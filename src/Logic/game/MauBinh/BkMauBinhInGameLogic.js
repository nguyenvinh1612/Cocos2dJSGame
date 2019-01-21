/**
 * Created by vinhnq on 1/20/2016.
 */
BkMauBinhInGameLogic = BkInGameLogic.extend({
    isProcessingFinishGame:false,
    ctor: function () {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.MAU_BINH);
    },
    // truongbs ++: fix chuyen tab khi dang thuc hien animation finish
    onTabShow:function(){
        logMessage("onShow BkMauBinhInGameLogic");
        this._super();
        if (this.isProcessingFinishGame){
            logMessage("onShow isProcessingFinishGame");
            this.getGameLayer().unscheduleAllCallbacks();
            this.getGameLayer().processFinishShowSumary();
            this.getGameLayer().clearCurrentGameGui();
        }
    },
    processDiscardSuccess: function (packet)
    {
        if (!this.isInGameProgress()){
            this.processNextEventInQueue();
            return;
        }
        this.getGameLayer().onDiscardSuccess(packet.Buffer.readByte(),packet.Buffer.readByte() == 1);
        this.processNextEventInQueue();
    },
    processDealCardReturn: function (packet)
    {
        this._super();
        var cardSuite = [];
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.initCardBackMask();
            card.setScale(MY_CARD_SCALE_DEAL_CARD);
            cardSuite.push(card);
        }
        this.getMyClientState().setOnhandCard(cardSuite); // my card
        this.getMyClientState().setMauBinhCard(cardSuite); // my card
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if (playeri != null) {
                playeri.isPlaying = true;
                playeri.setRank(-1);
                playeri.setCardsCount(13);
                this.numberOfPlayingPlayer++;
            }
        }
        this.getGameLayer().onDealCardReturn();
    },
    stopAllAnimationMyOnhand:function(){
        var me = this.getMyClientState();
        var myonhand = me.getOnHandCard();
        if(myonhand != null) {
            for (var i=0;i<myonhand.length;i++) {
                myonhand[i].setCallBackMoveFinish(null);
                myonhand[i].stopAllActionOfCard();
                myonhand[i].cardImage.setOpacity(255);
            }
        }
    },
    prepareMyOnhandForShowChi:function(){
        logMessage("prepareMyOnhandForShowChi");
        var me = this.getMyClientState();
        if (me.getMauBinhCard() != null){
            me.getMauBinhCard().removeCardTextType();
        }
        this.getGameLayer().showMyOnhand(true);
    },
    reSortOnhandCard:function(listCard){
        // process my onhand card after receive finish game packet
        var myOnHand = this.getMyClientState().getOnHandCard();
        this.stopAllAnimationMyOnhand();
        this.getGameLayer().removeAllEventListener(myOnHand);
        this.getGameLayer().removeAllClickMark(myOnHand);

        // resort list card
        var rtnList = [];
        for (var i =0;i<13;i++){
            var iCa = listCard[i];
            for (var j=0;j<13;j++){
                var jCa = myOnHand[j];
                if (iCa.id == jCa.id){
                    rtnList.push(jCa);
                }
            }
        }
        setZOrder(rtnList);
        this.getMyClientState().setOnhandCard(rtnList);
        this.getMyClientState().setMauBinhCard(rtnList);
        this.sortCard(this.getMyClientState());
    },
    processFinishGame:function(packet)
    {
        this._super();
        this.isProcessingFinishGame = true;
        //this.gameStatus = GAME_STATE_FINISH;
        //playAlertSound();

        var autoWinCount = packet.Buffer.readByte();
        var autoWinMoneyChange = [];
        logMessage("autoWinCount:" + autoWinCount);
        var i;
        for (i = 0; i < autoWinCount; i++) {
            var atWinMoney = packet.Buffer.readInt();
            logMessage("AutowinMoney:" + atWinMoney);
            autoWinMoneyChange.push(atWinMoney);
        }

        var sap3ChiCount = packet.Buffer.readByte();
        var isSap3ChiFlag = [];
        var sap3ChiMoneyChange = [];
        logMessage("sap3ChiCount:" + sap3ChiCount);
        for (var j = 0; j < sap3ChiCount; j++) {
            var isSap3Chi = packet.Buffer.readByte();
            isSap3ChiFlag.push(isSap3Chi);
            var  sapMoney = packet.Buffer.readInt();
            sap3ChiMoneyChange.push(sapMoney);
            logMessage("isSap3Chi:" + isSap3Chi + "SapMoney:" + sapMoney)
        }

        var totalChi1MoneyChange = 0;
        var totalChi2MoneyChange = 0;
        var totalChi3MoneyChange = 0;

        while (packet.Buffer.isReadable()) {
            var playerPosition = packet.Buffer.readByte();
            var player = this.getPlayer(playerPosition);

            if(sap3ChiCount > 0 &&  isSap3ChiFlag[playerPosition] == 1) {
                player.isSap3Chi = true;
            }

            if(sap3ChiMoneyChange[playerPosition] != undefined && sap3ChiMoneyChange[playerPosition] != 0) {
                player.sap3ChiMoney = sap3ChiMoneyChange[playerPosition];
            }

            player.isAutoWin =  packet.Buffer.readByte();

            if(autoWinMoneyChange[playerPosition] != 0) {
                player.autoWinMoney = autoWinMoneyChange[playerPosition];
            }

            var cardsCount = packet.Buffer.readByte();
            var cardSuite = [];

            for (i = 0; i < cardsCount; i++) {
                var iCard;
                if (playerPosition != this.getMyClientState().serverPosition) {
                    iCard = player.getOnHandCard()[i];
                    if(iCard != undefined && iCard != null)
                    {
                        iCard.setSelectable(false);
                        iCard.reloadByID(packet.Buffer.readByte());
                        iCard.showBackMask(true);
                    }
                } else {
                    iCard = decode(packet.Buffer.readByte());
                }

                cardSuite.push(iCard);
            }

            player.isPlaying = (cardSuite.length>0);

            if(playerPosition != this.getMyClientState().serverPosition) {
                logMessage("khong phai la minh -> update mau binh card");
                player.setMauBinhCard(cardSuite);
                this.sortCard(player);
            } else {
                logMessage("la minh -> sort lai list card finish");
                this.reSortOnhandCard(cardSuite);
                this.prepareMyOnhandForShowChi();
            }

            var fn = packet.Buffer.readInt();
            player.setFinalMoney(fn);
            logMessage("player:" + player.getName()  + "finial Money:" + fn);
            for(var chi = 3; chi >= 1; chi--) {
                var moneyChange = packet.Buffer.readInt();
                if(chi == 3 && !player.isAutoWin)
                {
                    totalChi3MoneyChange = totalChi3MoneyChange + moneyChange;
                    logMessage("player:" + player.getName() + "moneyChange:" + moneyChange + "totalChi3MoneyChange:" + totalChi3MoneyChange);
                }else if(chi == 2 && !player.isAutoWin)
                {
                    totalChi2MoneyChange = totalChi2MoneyChange + moneyChange;
                    logMessage("player:" + player.getName() +  "moneyChange:" + moneyChange+ "totalChi2MoneyChange:" + totalChi2MoneyChange);

                }else if(chi == 1 && !player.isAutoWin)
                {
                    totalChi1MoneyChange = totalChi1MoneyChange + moneyChange;
                    logMessage("player:" + player.getName() +  "moneyChange:" + moneyChange + "totalChi1MoneyChange:" + totalChi1MoneyChange);
                }
                player.setMoneyChange(chi, moneyChange);
            }
        }
        logMessage("finish result: totalChi1MoneyChange:" + totalChi1MoneyChange + "totalChi2MoneyChange:"
            + totalChi2MoneyChange + "totalChi3MoneyChange:" + totalChi3MoneyChange );

        var me = this.getMyClientState();
        if(me.isPlaying) {
            me.setMoneyChange(1,totalChi1MoneyChange);
            me.setMoneyChange(2,totalChi2MoneyChange);
            me.setMoneyChange(3,totalChi3MoneyChange);
        }
        this.getGameLayer().onFinishGame();
    },
    cancelCardClickEvent:function() {
        if (this.cardClickQueue.isRunningAction()) {
            var currentEventCard = this.cardClickQueue.getLastCard();
            this.cardClickQueue.resetQueue();
            currentEventCard.setMoveHandle(null);
            currentEventCard.stopMoveAction();
            currentEventCard.setMoveHandle(this.getGameLayer());
        }
    },
    processGameTableSyn:function(packet)
    {
        this._super(packet);
        this.getGameLayer().unscheduleAllCallbacks();
        if (!this.isInGameProgress())
        {
            this.getGameLayer().clearCurrentGameGui();
            this.getGameLayer().hideAllOngameCustomButton();
            return;
        }
        var timerCountDown = packet.Buffer.readByte();
        if(timerCountDown > 0)
        {
            this.getGameLayer().showCountDownWithBG(timerCountDown);
        }
        var cardCount = packet.Buffer.readByte();
        var cardi;
        var cardSuite = [];
        var i;
        for(i = 0; i < cardCount; i++)
        {
            cardi = decode(packet.Buffer.readByte());
            //cardi.setEnableClick(false);
            cardSuite.push(cardi);
        }
        while (packet.Buffer.isReadable())
        {
            var position =  packet.Buffer.readByte();
            this.getPlayer(position).hasDiscard = (packet.Buffer.readByte() == 1);
            this.getPlayer(position).isPlaying = (this.getPlayer(position).status != PLAYER_STATE_NOT_READY);
            this.getGameLayer().initOnhandCardOtherPlayer(this.getPlayer(position));
            this.getGameLayer().alertDiscardSuccess( position,this.getPlayer(position).hasDiscard);
            logMessage("tableSyn:" + " - Name: " +  this.getPlayer(position).getName() + " - position: " + position);
        }
        if(cardSuite.length > 0) {
            var me = this.getMyClientState();
            logMessage("set onhand "+cardSuite.length);
            me.setOnhandCard(cardSuite);
            me.setMauBinhCard(cardSuite);
            this.getGameLayer().addCardToScene(cardSuite);
            for(i = 0; i < cardSuite.length; i++) {
                cardSuite[i].setSelectable(!me.hasDiscard);
            }

            if(me.hasDiscard) {
                this.getGameLayer().showMyOnhand(true,false);
            } else {
                this.getGameLayer().showMyOnhand(false,false);
                this.getGameLayer().showCardTextType(me,CARD_TEXT_TYPE_X,CARD_TEXT_TYPE_Y);
                this.initDragDrop(cardSuite);
            }
            me.isPlaying = true;
        }
        if (!this.getMyClientState().isPlaying)
        {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
        this.getGameLayer().onTableSynReturn();
    },
    initDragDrop:function(cardList)
    {
        this.getGameLayer().initMyOnhandCard();
        for(var i = 0; i < cardList.length; i++)
        {
            initDragDropForMauBinhCard(cardList[i],this.getGameLayer());
        }
    },
    getMyMauBinhCardSuite:function()
    {
        return this.getMyClientState().getMauBinhCard();
    },
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_FINISH_GAME_RETURN:
            case c.NETWORK_LEAVE_DURING_GAME:
            case c.NETWORK_PLAYER_STATUS_RETURN:
            case c.NETWORK_PREPARE_NEW_GAME:
            case c.NETWORK_DISCARD_SUCCESS:
            case c.NETWORK_ASSIGN_AS_TABLE_OWNER:
                return true;
        }
        return this._super(eventType);
    },
    discardCommand:function()
    {
        var Packet = new BkPacket();
        if(this.getMyClientState().hasDiscard)
        {
            Packet.CreateDiscardAction();
        }else
        {
            Packet.CreateDiscardCards(this.getMyClientState().getOnHandCard());
        }
        BkConnectionManager.send(Packet);
    },
    sortCard:function(playeri)
    {
        logMessage("sort card");
        var sortedonhand = [];
        var sortedCard = playeri.getMauBinhCard().getChi3CardSuite().sortMauBinhSuite();
        this.addCardList(sortedCard,sortedonhand);
        sortedCard = playeri.getMauBinhCard().getChi2CardSuite().sortMauBinhSuite();
        this.addCardList(sortedCard,sortedonhand);
        sortedCard = playeri.getMauBinhCard().getChi1CardSuite().sortMauBinhSuite();
        this.addCardList(sortedCard,sortedonhand);
        setZOrder(sortedonhand);
        playeri.setMauBinhCard(sortedonhand);
        playeri.setOnhandCard(sortedonhand);
    },

    addCardList:function(fromList,toList)
    {
        for(var i= 0; i < fromList.length; i++)
        {
            toList.push(fromList[i]);
        }
    },
    ProcessOutGame:function(){
        this.getGameLayer().unscheduleAllCallbacks();
        this._super();
    },
    getPunishExitDuringGameMoney:function()
    {
        return 6*this.getTableBetMoney()*(this.numberOfPlayingPlayer - 1);
    },
    processOverViewPlayer:function(userName){
        if(this.isProcessingFinishGame)
        {
            return;
        }
        this._super(userName);
    },
    processLeaveTableRequest:function(){
        var myPlayer = this.getMyClientState();
        if (this.isInGameProgress() || this.isProcessingFinishGame)
        {
            if (myPlayer == null) return;
            if (myPlayer.status != PLAYER_STATE_NOT_READY)
            {
                var strMess = "";
                if(!myPlayer.isLeaveRegistered)
                {
                    myPlayer.isLeaveRegistered = true;
                    this.getGameLayer().showRegExitSplash(true);
                    strMess = "Bạn đã đăng ký rời phòng thành công. Hãy nhấn nút rời phòng một lần nữa để hủy.";
                }else
                {
                    myPlayer.isLeaveRegistered = false;
                    this.getGameLayer().showRegExitSplash(false);
                    strMess = "Bạn đã hủy rời phòng thành công."
                }
                showToastMessage(strMess,153,530,null,240);
            } else {
                this.networkOutTable(0);
            }
        } else
        {
            if(myPlayer.isLeaveRegistered)
            {
                myPlayer.isLeaveRegistered = false;
                this.getGameLayer().showRegExitSplash(false);
                this.getGameLayer().cancelSchedule();
                return;
            }
            this.networkOutTable(0);
        }
    },
    processNetworkEvent: function (packet) {
        logMessage("BkMauBinhInGameLogic InGameLogic -> processNetworkEvent " + packet.Type);
        switch (packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_DISCARD_SUCCESS:
                this.processDiscardSuccess(packet);
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet);
                break;
            default:
            {
                logMessage("BkXiMauBinhInGameLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});