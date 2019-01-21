/**
 * Created by vinhnq on 16/12/2015.
 */
BkXiDzachInGameLogic = BkInGameLogic.extend({
    ctor: function () {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.XI_DZACH);
    },
    processDealCardReturn: function (packet)
    {
        this._super();
        var cardSuite = [];
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.setScale(0.9);
            card.initCardBackMask();
            card.visible = false;
            cardSuite.push(card);
        }
        this.getMyClientState().setOnhandCard(cardSuite); // my card
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if (playeri != null) {
                playeri.isPlaying = true;
                playeri.setRank(-1);
                playeri.setCardsCount(2);
                this.numberOfPlayingPlayer++;
            }
        }

        this.activePlayerPosition = this.getTableOwner().serverPosition;
        logMessage("chu ban pos: "+ this.activePlayerPosition);
        this.getNextActivePlayerPosition();
        logMessage("activePlayerPosition after dealing card: "+ this.activePlayerPosition);
        this.getGameLayer().onDealCardReturn();
    },
    processPickCardReturn:function(packet)
    {
        var card =  decode(packet.Buffer.readByte());
        card.setSelectable(false);
        card.setScale(0.9);
        this.getMyClientState().getOnHandCard().push(card);
        if(this.getMyClientState().getOnHandCard().length == 5)
        {
            this.sendFofeitCommand();
        }
        this.getGameLayer().onPickCardReturn(card,this.getMyClientState());
        this.processNextEventInQueue();
    },
    processPickCardPush:function()
    {
        var card = new BkCard(14,1);
        card.setScale(0.8);
        card.setSelectable(false);
        this.getActivePlayer().getOnHandCard().push(card);
        this.getGameLayer().onPickCardReturn(card,this.getActivePlayer(),true);
        this.processNextEventInQueue();
    },
    processForfeitReturn:function()
    {
        if (!this.isInGameProgress()){
            this.processNextEventInQueue();
            return;
        }
        logMessage("processForfeitReturn");
        this.getActivePlayer().leaveTurn(true);
        this.getNextActivePlayerPosition();
        this.getGameLayer().ShowCicleCountDownTimeOnActivePlayer(60);
        this.getGameLayer().showGameCustomButtons();
        this.processNextEventInQueue();
    },
    getScore:function(cardList)
    {
        if(this.isXiBang(cardList))
        {
            return "Xì Bàng";
        }
        if(this.isXiDzach(cardList))
        {
            return "Xì Dách";
        }
        if(this.isNguLinh(cardList))
        {
            return "Ngũ Linh";
        }
        if(this.isChuaDuTuoi(cardList))
        {
            return "Chưa đủ tuổi";
        }
        if(this.isQuac(cardList))
        {
            return "Quắc";
        }else
        {
           return this.calculateScore(cardList) + " điểm";
        }
    },
    processXetBai:function(serverPos)
    {
        var Packet = new BkPacket();
        Packet.createXetBaiPacket(serverPos);
        BkConnectionManager.send(Packet);
    },
    processXetBaiReturn:function(packet)
    {
        var playerPosition = packet.Buffer.readByte();
        var player = this.getPlayer(playerPosition);
        var tableOwner = this.getTableOwner();
        var size = packet.Buffer.readByte();
        var tableOwnerCardSuite = [];
        var card;
        for(var i = 0; i < size; i++)
        {
            card = decode(packet.Buffer.readByte());
            if(tableOwner.serverPosition != this.getMyClientState().serverPosition)
            {
                card.setScale(0.8);
            }
            card.setSelectable(false);
            tableOwnerCardSuite.push(card);
        }
        size = packet.Buffer.readByte();
        var PlayerCardSuite = [];
        for(var j = 0; j< size; j++)
        {
            card  = decode(packet.Buffer.readByte());
            if(playerPosition != this.getMyClientState().serverPosition)
            {
                card.setScale(0.8);
            }
            card.setSelectable(false);
            PlayerCardSuite.push(card);
        }
        this.getGameLayer().onXetBai(tableOwner,tableOwnerCardSuite,player,PlayerCardSuite);
        this.processNextEventInQueue();
    },
    updateMoneyAfterXetbai:function(playerPosition)
    {
        var cashLost = -this.getTableBetMoney();
        var cashWin = Math.floor(-(1 - TAX_RATE)*cashLost);
        var player = this.getPlayer(playerPosition);
        var tableOwner = this.getTableOwner();
        var result = this.compareScore(player.getOnHandCard(),tableOwner.getOnHandCard());
        if(result == 1)
        {
            this.increaseCash(player, cashWin, "");
            this.increaseCash(tableOwner, cashLost, "");
            this.getGameLayer().showWinSplash(player.serverPosition);
            return;
        }
        if(result == -1)
        {
            this.increaseCash(player, cashLost, "");
            this.increaseCash(tableOwner, cashWin, "");
            this.getGameLayer().showLoseSplash(player.serverPosition);
        }
    },
    compareScore:function(cardList1,cardList2)
    {
        // 0 hòa , 1 lớn hơn, -1 Nhỏ hơn
        if(this.isXiBang(cardList1))
        {
            if(this.isXiBang(cardList2))
            {
                return 0;
            }
            return 1;
        }
        if(this.isXiDzach(cardList1))
        {
            if(this.isXiBang(cardList2))
            {
                return -1;
            }
            if(this.isXiDzach(cardList2))
            {
                return 0;
            }
            return 1;
        }
        var score1 = 0;
        var score2 = 0;
        if(this.isNguLinh(cardList1))
        {
            if(this.isChuaDuTuoi(cardList2) ||this.isQuac(cardList2))
            {
                return 1;
            }
            if(this.isNguLinh(cardList2))
            {
                score1 = this.calculateScore(cardList1);
                score2 = this.calculateScore(cardList2);
                if(score1 < score2)
                {
                    return 1;
                }else if(score1 == score2)
                {
                    return 0;
                }
                return -1;
            }
            if(this.isXiDzach(cardList2)|| this.isXiBang(cardList2))
            {
                return -1;
            }
            return 1;
        }
        if(this.isQuac(cardList1))
        {
            if(this.isChuaDuTuoi(cardList2))
            {
                return 1;
            }
            if(this.isQuac(cardList2))
            {
                return 0;
            }
            return -1;
        }
        if(this.isChuaDuTuoi(cardList1))
        {
           if(this.isChuaDuTuoi(cardList2))
           {
               return 0;
           }
            return -1;
        }
        if(this.isXiBang(cardList2) || this.isXiDzach(cardList2)|| this.isNguLinh(cardList2))
        {
            return -1;
        }
        if(this.isChuaDuTuoi(cardList2) || this.isQuac(cardList2))
        {
            return 1;
        }
        score1 = this.calculateScore(cardList1);
        score2 = this.calculateScore(cardList2);
        if(score1 > score2)
        {
            return 1;
        }
        if(score1 === score2)
        {
            return 0;
        }
        return -1;
    },
    isAllPlayerFinishedGame:function()
    {
        for(var i = 0; i < this.PlayerState.length; i ++)
        {
            var playeri = this.PlayerState[i];
            if(playeri.isPlaying && !playeri.isFinishedGame && playeri != this.getTableOwner())
            {
                return false;
            }
        }
        logMessage("isAllPlayerFinishedGame: true");
        return true;
    },
    getNumberOfPlayingPlayerWhenStartGame:function()
    {
        var count = 0;
        for(var i = 0; i < this.PlayerState.length; i++)
        {
            var playeri = this.PlayerState[i];
            if(playeri.isPlaying)
            {
                count++;
            }
        }
        return count;
    },
    processFinishGame:function()
    {
        if(this.isAllPlayerFinishedGame())
        {
            this._super();
            this.getGameLayer().hideAllOngameCustomButton();
            this.getGameLayer().showOnHandCardList();
        }
    },
    getTableOwner:function() {
        for (var i=0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].status == 0) { //STATE_TABLE_OWNER:int = 0
                return this.PlayerState[i];
            }
        }
        return null;
    },
    processAutoWinReturn:function(packet)
    {
        var playerPosition = packet.Buffer.readByte();
        var autoWinPlayer = this.getPlayer(playerPosition);
        var cardSuite = [];
        while (packet.Buffer.isReadable())
        {
            var card = decode(packet.Buffer.readByte());
            if(playerPosition != this.getMyClientState().serverPosition)
            {
                card.setScale(0.8);
            }
            card.setSelectable(false);
            cardSuite.push(card);
        }
        this.getGameLayer().onAutoWin(autoWinPlayer, cardSuite);
        this.processNextEventInQueue();
    },
    updateAutoWinMoney:function(autoWinPlayer)
    {
        var cashLost = -this.getTableBetMoney();
        var cashWin = Math.floor(-(1 - TAX_RATE)*cashLost);
        var tableOwner = this.getTableOwner();
        this.increaseCash(autoWinPlayer,cashWin,"");
        this.increaseCash(tableOwner,cashLost,"");
    },
    processGameTableSyn:function(packet)
    {
        this._super(packet);
        if (!this.isInGameProgress())
        {
            this.getGameLayer().clearCurrentGameGui();
            this.getGameLayer().hideAllOngameCustomButton();
            return;
        }
        this.activePlayerPosition = packet.Buffer.readByte();
        while (packet.Buffer.isReadable())
        {
            var playerPosition = packet.Buffer.readByte();
            var handCardSize = packet.Buffer.readByte();
            var player = this.getPlayer(playerPosition);
            player.isPlaying = true;
            player.isFinishedGame = packet.Buffer.readByte() == 1;
            var cardSuite = [];
            var cardi;
            if (player.isFinishedGame || (player == this.getMyClientState()))
            {
                for (var i = 0; i < handCardSize; i++)
                {
                    cardi = decode(packet.Buffer.readByte());
                    cardi.setSelectable(false);
                    if(playerPosition != this.getMyClientState().serverPosition)
                    {
                        cardi.setScale(0.8);
                    } else {
                        cardi.setScale(0.9);
                    }
                    cardSuite.push(cardi);
                }
            }
            else
            {
                for (var j = 0; j < handCardSize; j++)
                {
                    cardi = new BkCard(14,1);
                    cardi.setScale(0.8);
                    cardi.setSelectable(false);
                    cardSuite.push(cardi);
                }
            }
            player.setOnhandCard(cardSuite);
            this.getGameLayer().onTableSyn(player);
        }
        if (!this.getMyClientState().isPlaying)
        {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
        this.getGameLayer().onTableSynReturn();
    },
    processLeaveDurringGame:function(packet)
    {
        var leavePlayer = this.getPlayer(packet.Buffer.readByte());
        leavePlayer.isPlaying = false;
        leavePlayer.isFinishedGame = true;
        var cashLost = -this.getTableBetMoney();
        var cashWin = Math.floor((1-TAX_RATE)*(this.getTableBetMoney()));
        if(leavePlayer != this.getTableOwner())
        {
            this.increaseCash(this.getTableOwner(),cashWin,"");
            this.increaseCash(leavePlayer,cashLost,"Phạt");
            if(leavePlayer == this.getActivePlayer())
            {
                if(this.getNumOfPlayingPlayer() >= 2)
                {
                    this.getNextActivePlayerPosition();
                    this.getGameLayer().ShowCicleCountDownTimeOnActivePlayer(60);
                    this.getGameLayer().showGameCustomButtons();
                }else
                {
                    this.gameStatus = GAME_STATE_FINISH;
                }
            }
            if (this.isMyServerPos(leavePlayer.serverPosition))
            {
                this.ProcessOutGame();
            }
            this.processNextEventInQueue();
            return;
        }
        else
        {
            cashLost = (this.getNumberOfPlayingPlayerWhenStartGame())*cashLost;
            this.increaseCash(leavePlayer,cashLost,"Phạt");
            for(var i = 0; i < this.maxPlayer; i++)
            {
                var playeri = this.getPlayer(i);
                if(playeri != null && playeri.isPlaying)
                {
                    this.increaseCash(playeri,cashWin,"");
                }
            }
            if (this.isMyServerPos(leavePlayer.serverPosition))
            {
                this.ProcessOutGame();
            }
            this.processNextEventInQueue();
        }

    },
    getPunishExitDuringGameMoney: function ()
    {
        if(this.isMeBossTable())
        {
            return this.getTableBetMoney()*(this.getNumberOfPlayingPlayerWhenStartGame() -1);
        }else
        {
            return this.getTableBetMoney();
        }
    },
    isChuaDuTuoi:function(myCard)
    {
       if(this.isXiBang(myCard) ||(this.isXiDzach(myCard)))
       {
           return false;
       }
        var totalScore = this.calculateScore(myCard);
        return (totalScore < 16 && myCard.length < 5);
    },
    isDuTuoi:function(myCard)
    {
        var totalScore = this.calculateScore(myCard);
        return (totalScore >= 16 && totalScore <= 21);
    },
    isXiDzach:function(cardList)
    {
        if(cardList.length > 2)
        {
            return false;
        }
        if(cardList[0].number == 1)
        {
            return (cardList[1].number >= 10 && cardList[1].number <=13)
        }
        if(cardList[0].number >= 10 && cardList[0].number <= 13 )
        {
            return (cardList[1].number == 1);
        }
        return false;
    },
    isXiBang:function(cardList)
    {
        if(cardList == null || cardList.length != 2)
        {
            return false;
        }
        return(cardList[0].number ==1 && cardList[1].number == 1)
    },
    isNguLinh:function(cardList)
    {
        if(cardList.length < 5)
        {
            return false;
        }
        var totalScore = 0;
        var number = 0;
        for(var i = 0; i < cardList.length; i++)
        {
            number = cardList[i].number;
            if(cardList[i].number > 10)
            {
                number = 10;
            }
            totalScore += number;
        }
        return( totalScore < 21);
    },
    isQuac:function(cardList)
    {
        var totalScore = 0;
        var number = 0;
        for(var i = 0; i < cardList.length; i++)
        {
            number = cardList[i].number;
            if(cardList[i].number > 10)
            {
                number = 10;
            }
            totalScore += number;
        }
        return( totalScore > 21);
    },
    calculateScore:function(cardList)
    {
        var totalScore = 0;
        var number = 0;
        var AtCount = 0;
        for(var i = 0; i < cardList.length; i++)
        {
            if(cardList[i].number > 10)
            {
                number = 10;
                totalScore += number;

            }else if(cardList[i].number > 1 && cardList[i].number <= 10)
            {
                number = cardList[i].number;
                totalScore += number;
            }else if(cardList[i].number == 1)
            {
                AtCount = AtCount + 1;
            }
        }
        if(AtCount > 0)
        {
            if(cardList.length > 3)
            {
                totalScore = totalScore + AtCount;
            }else // có 2 hoặc 3 lá bài trong đó tối đa 2 con At
            {
                if(AtCount == 1) // chỉ có 1 at
                {
                    if(totalScore < 11)
                    {
                        totalScore = totalScore + 11;
                    }else if(totalScore == 11)
                    {
                        totalScore = totalScore + 10;
                    }else
                    {
                        totalScore = totalScore + 1;
                    }
                }else if(AtCount == 2)// Có 2 at và lenght > 2, tổng total score chắc chắn;
                {
                    if(cardList.length == 2)
                    {
                        return 23;
                    }
                    if(totalScore < 10)
                    {
                        totalScore = totalScore + 12;
                    }else if(totalScore == 10)
                    {
                        totalScore = totalScore + 11;
                    }
                }
            }
        }
        return totalScore;
    },
    sendFofeitCommand:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_FORFEIT,1);
        BkConnectionManager.send(Packet);
    },
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_PICK_CARD_PUSH:
            case c.NETWORK_PICK_CARD_RETURN:
            case c.NETWORK_FORFEIT_RETURN:
            case c.NETWORK_XET_BAI_RETURN:
            case c.NETWORK_AUTO_WIN_RETURN:

            case c.NETWORK_LEAVE_DURING_GAME:
            case c.NETWORK_PLAYER_STATUS_RETURN:
            case c.NETWORK_PREPARE_NEW_GAME:
                return true;
        }
        return this._super(eventType);
    },
    /*
     * handle all TLMN ingame event
     * */
    processNetworkEvent: function (packet) {
        logMessage("BkXiDzachInGameLogic InGameLogic -> processNetworkEvent " + packet.Type);
        switch (packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_PICK_CARD_RETURN:
                this.processPickCardReturn(packet);
                break;
            case c.NETWORK_PICK_CARD_PUSH:
                this.processPickCardPush();
                break;
            case c.NETWORK_FORFEIT_RETURN:
                this.processForfeitReturn();
                break;
            case c.NETWORK_XET_BAI_RETURN:
                this.processXetBaiReturn(packet);
                break;
            case c.NETWORK_AUTO_WIN_RETURN:
                this.processAutoWinReturn(packet);
                break;
            case c.NETWORK_LEAVE_DURING_GAME:
                this.processLeaveDurringGame(packet);
                break;
            default:
            {
                logMessage("BkXiDzachInGameLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});