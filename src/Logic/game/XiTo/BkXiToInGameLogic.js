/**
 * Created by bs on 10/10/2015.
 */

STATE_WAIT_OPEN_1_CARD = 2;

BkXiToInGameLogic = BkRoundBetInGameLogic.extend({
    currentBetMoney:0,
    totalBetMoney:0,
    raisePosition:0,
    isOpenCardTime:false,
    winPosition:0,

    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.XITO);
    },

    processCardClickEvent:function(card) {
        // Card click event
        if (this.isOpenCardTime) {
            var tempArray = [];
            tempArray.push(card);
            var Packet = new BkPacket();
            Packet.CreateDiscardCards(tempArray);
            BkConnectionManager.send(Packet);
        }
    },

    processDealCardReturn:function(packet)
    {
        this._super(packet);
        logMessage("Xi To: processDealCardReturn");
        var i;
        for (i=0; i < this.PlayerState.length; i++) {
            this.PlayerState[i].isPlaying = true;
            this.PlayerState[i].isFinishedGame = false;
            this.PlayerState[i].betMoney = 0;
            this.PlayerState[i].totalBetMoney = this.tableBetMoney;
            this.increaseCash(this.PlayerState[i], -1 * this.tableBetMoney, "Cược");
            // reset rule card suite
            this.PlayerState[i].ruleCardSuite = new BkXiToCardSuite();

            // Show card bg
            this.getGameLayer().showCardBgForPlayer(this.PlayerState[i].serverPosition, 0.3);
        }
        this.totalBetMoney = this.tableBetMoney * this.PlayerState.length;

        this.isOpenCardTime = true;

        var buffer = packet.Buffer;
        var cardSuite = [];
        while (buffer.isReadable())
        {
            var card = decode(buffer.readByte());
            card.setScale(XITO_CARD_SCALE);
            cardSuite.push(card);
        }
        this.getMyClientState().setOnhandCard(cardSuite);
        var myPos = this.getMyPos();
        this.activePlayerPosition = myPos;

        // Create card for all player
        for (i=0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].serverPosition != myPos) {
                var tempSuite = [];
                var card1 = decode(5);
                card1.setScale(XITO_CARD_SCALE);
                card1.showBackMask(true);
                tempSuite.push(card1);
                var card2 = decode(5);
                card2.setScale(XITO_CARD_SCALE);
                card2.showBackMask(true);
                tempSuite.push(card2);
                this.PlayerState[i].setOnhandCard(tempSuite);
            }
        }
        this.getGameLayer().onDealCardReturn(cardSuite);
    },

    updateActivePlayerAfterPickCard:function() {
        var maxCardSuite = null;
        var maxPos = -1;
        for (var i=0; i<this.PlayerState.length; i++) {
            if (this.PlayerState[i] == null || this.PlayerState[i].status == 2) {
                continue;
            }
            if (!this.PlayerState[i].isPlaying || this.PlayerState[i].isFinishedGame) {
                continue;
            }
            if (maxCardSuite == null) {
                maxCardSuite = this.PlayerState[i].getRuleCardSuite();
                maxPos = i;
                continue;
            }
            var tempCardSuite = this.PlayerState[i].getRuleCardSuite();
            if (tempCardSuite.isBiggerThanCardSuite(maxCardSuite)) {
                maxCardSuite = tempCardSuite;
                maxPos = i;
            }
        }
        this.raisePosition = this.PlayerState[maxPos].serverPosition;
        this.activePlayerPosition = this.raisePosition;

        this.getGameLayer().showActivePlayer();
    },

    processPickCard:function(buffer)
    {
        logMessage("Xi To: processPickCard");
        while (buffer.isReadable())
        {
            var position = buffer.readByte();
            var card = decode(buffer.readByte());
            var player = this.getPlayer(position);
            player.addOnhandCard(card);
            player.addRuleCardSuite(card);
            this.getGameLayer().onPickCard(position,card,player.onhandCardList.length-1);
        }



        this.getGameLayer().clearBetOptionForNewRound();
        // Update active player after discard
        this.updateActivePlayerAfterPickCard();

        this.sendCheckForAllIn();

        var self = this;
        var fcb = function(playeri){
            self.processNextEventInQueue();
        };
        this.processBetMoney(fcb);
    },

    processDiscardCard:function(buffer) {
        logMessage("Xi To: processDiscardCard");
        var position = buffer.readByte();
        var cardId = buffer.readByte();
        var player = this.getPlayer(position);
        var card = decode(cardId);
        if (position == this.getMyPos()) {
            this.isOpenCardTime = false;
        } else {
            card = player.updateOnhandCard(cardId,1);
        }
        player.addRuleCardSuite(card);
        this.getGameLayer().onDiscard(position,card);
        this.processNextEventInQueue();
    },

    showSuiteResult:function(pos, suiteName) {
        var isWinner = (this.winPosition == pos);
        this.getGameLayer().showSuiteName(pos, suiteName,isWinner);
    },

    updateMoneyAfterFinishGame:function() {
        if ((BkGlobal.currentGS != GS.INGAME_GAME) && (BkGlobal.currentGS != GS.WAITTING_JOIN_ROOM_FROM_INGAME)){
            logMessage("BkGlobal.currentGS != GS.INGAME_GAME -> don't process next");
            return;
        }
        // Find bet money of win Player
        var maxBetMoney = this.getPlayer(this.winPosition).totalBetMoney;
        logMessage("Winner bet money: " + maxBetMoney);

        // return bet money
        for (var i=0; i< this.PlayerState.length; i++) {
            var player = this.PlayerState[i];
            if (player != null && player.isPlaying) {
                if (player.totalBetMoney > maxBetMoney) {
                    var cash = player.totalBetMoney - maxBetMoney;
                    logMessage("Return money for player: " + player.getName() + " Money: "
                        + cash + " total bet money:" + this.totalBetMoney);
                    this.increaseCash(player, cash, "Hoàn tiền");
                    this.totalBetMoney -= cash;
                }
            }
        }

        // Return money for winner
        var winPlayer = this.getPlayer(this.winPosition);
        var winMoney = Math.floor((this.totalBetMoney - winPlayer.totalBetMoney) * (1 - TAX_RATE));
        var totalWinMoney = winMoney + winPlayer.totalBetMoney;
        this.increaseCash(winPlayer, totalWinMoney, "Thắng");

        this.totalBetMoney = 0;
        this.getGameLayer().showTableBetMoney();

        this.getGameLayer().updateWinner(this.winPosition, true, totalWinMoney);
        logMessage("Win money player:" + winPlayer.getName() + "win money: " + winMoney
            + " total bet money: " + winPlayer.totalBetMoney);
        this.isFinishGameAnimation = false;
    },

    processFinishGame:function(buffer) {
        logMessage("XiTo Game logic: Process finish game return");
        this._super();

        this.winPosition = buffer.readByte();
        while (buffer.isReadable())
        {
            var position = buffer.readByte();
            var card = decode(buffer.readByte());
            var player = this.getPlayer(position);
            player.isFinishedGame = true;
            //player.addOnhandCard(card);
            player.addRuleCardSuite(card);
            var ruleSuite = player.getRuleCardSuite();
            var suiteName = ruleSuite.getBiggestSuiteName();
            this.showSuiteResult(position, suiteName);

            var myPos = this.getMyPos();
            if (position != myPos) {
                card = player.updateOnhandCard(card.id, 0);
            }
            this.getGameLayer().onFinish(position, card);
        }

        var self = this;
        var fcb = function(playeri){
            self.updateMoneyAfterFinishGame();
        };
        this.processBetMoney(fcb);
    },

    processGameTableSyn:function(packet) {
        this._super(packet);
        if (!this.isInGameProgress()) {
            return;
        }
        this.currentBetMoney = packet.Buffer.readInt();
        this.totalBetMoney = packet.Buffer.readInt();
        logMessage("Current Bet money: " + this.currentBetMoney + " total bet money:" + this.totalBetMoney);
        this.raisePosition = packet.Buffer.readByte();
        this.activePlayerPosition = packet.Buffer.readByte();

        // Setup states for all player
        while (packet.Buffer.isReadable()) {
            var playerPosition = packet.Buffer.readByte();
            var player = this.getPlayer(playerPosition);
            player.betMoney = packet.Buffer.readInt();

            player.isFlip = packet.Buffer.readByte() == 1;
            player.isFinishedGame = packet.Buffer.readByte() != 1;
            player.isPlaying = true;

            // Show card background
            this.getGameLayer().showCardBgForPlayer(playerPosition, 0.1);

            if (!player.isFinishedGame) {
                this.totalBetMoney -= player.betMoney;
            } else {
                player.betMoney = 0;
            }
            this.getGameLayer().updateBetMoney(playerPosition, player.betMoney);

            var myPos = this.getMyPos();
            if (playerPosition != myPos) {
                if (player.isFlip) {
                    var card1 = decode(5);
                    card1.showBackMask(true);
                    player.addOnhandCard(card1);
                    this.getGameLayer().onShowCard(playerPosition,card1,player.onhandCardList.length-1);
                } else {
                    var card1 = decode(5);
                    card1.showBackMask(true);
                    player.addOnhandCard(card1);
                    this.getGameLayer().onShowCard(playerPosition,card1,player.onhandCardList.length-1);
                    var card2 = decode(5);
                    card2.showBackMask(true);
                    player.addOnhandCard(card2);
                    this.getGameLayer().onShowCard(playerPosition,card2,player.onhandCardList.length-1);
                }
            }
            var openCardSuite = [];
            if (player.isFlip) {
                var cardsSize = packet.Buffer.readByte();
                for (var i = 0; i < cardsSize; i++) {
                    var card = decode(packet.Buffer.readByte());
                    openCardSuite.push(card);
                }
            }
            if (playerPosition == this.getMyPos()) {
                logMessage("la minh =======================");
                var card1 = decode(packet.Buffer.readByte());
                card1.showMask(true);
                player.addOnhandCard(card1);

                this.getGameLayer().onShowCard(playerPosition,card1,player.onhandCardList.length-1);
                if (!player.isFlip) {
                    logMessage("chua chon con mo -> show card cua minh");
                    this.isOpenCardTime = true;
                    var card2 = decode(packet.Buffer.readByte());
                    card2.showMask(true);
                    player.addOnhandCard(card2);
                    logMessage(" index "+player.onhandCardList.length-1);
                    this.getGameLayer().onShowCard(playerPosition,card2,player.onhandCardList.length-1);
                } else {
                    this.isOpenCardTime = false;
                }
                if (this.isOpenCardTime) {
                    card1.setSelectable(true);
                    card2.setSelectable(true);
                }
            }
            
            logMessage("openCardSuite.length: "+openCardSuite.length);
            for (var i=0; i< openCardSuite.length; i++) {
                player.addOnhandCard(openCardSuite[i]);
                player.addRuleCardSuite(openCardSuite[i]);
                this.getGameLayer().onShowCard(playerPosition,openCardSuite[i],player.onhandCardList.length-1);
            }
        }
        this.getGameLayer().showTableBetMoney();
        this.getGameLayer().onTableSynReturn();
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
    },

    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DISCARD_PUSH:
            case  c.NETWORK_PICK_CARD_RETURN:
                return true;
        }
        return this._super(eventType);
    },


    processNetworkEvent:function(packet){
        logMessage("Bk Xi To Ingame Logic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            // Lat 1 quan o thoi diem dau van
            case c.NETWORK_DISCARD_PUSH:
                this.processDiscardCard(packet.Buffer);
                break;
            case  c.NETWORK_PICK_CARD_RETURN:
                this.processPickCard(packet.Buffer);
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet.Buffer);
                break;
            default:{
                logMessage("Bk Xi To not process packet, send to base class");
                this._super(packet);
            }
        }
    }
});