/**
 * Created by vinhnq on 11/12/2015.
 */
BkTLMNDemLaInGameLogic = BkInGameLogic.extend({
    isNewTurn: false,
    leavedTurnPlayerCount: 0,
    secondLastDiscardPlayer: null,
    lastDiscardPlayer: null,
    lastFinishedPlayerPosition: 0,
    currentDiscardSuite: null,
    preDiscardSuite: null,
    TLMNMoneyLogic: null,

    ctor: function () {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.TLMN_DEM_LA);
        this.TLMNMoneyLogic = new BkTLMNMoneyLogic();
        this.moneyLogic = this.TLMNMoneyLogic;
    },

    processCardClickEvent:function(card) {
        logMessage("Queue event click");
        var lastCard = this.cardClickQueue.lastElement();
        if (lastCard == null || lastCard.id != card.id) {
            this.cardClickQueue.push(card);
            if (!this.cardClickQueue.isRunningAction()) {
                this.processNextCardClickEvent();
            }
        }
    },

    processNextCardClickEvent:function(){
        logMessage("Process next click event in queue");
        this.cardClickQueue.traceQueue();
        var player = this.getMyClientState();
        var selectedCard = getSelectedCard(player.getOnHandCard());
        traceCardList(selectedCard, "Selected Card: ");

        var firstCard = this.cardClickQueue.pop();
        if (firstCard == null) {
            this.cardClickQueue.setRunningState(false);
            return;
        }
        this.cardClickQueue.setRunningState(true);
        if (firstCard.isAnimation) {
            logMessage("Not process click event of card:" + firstCard.id);
            this.processNextCardClickEvent();
        } else {
            firstCard.OnCardMouseClick();
        }
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

    processDealCardReturn: function (packet) {
        this._super();
        this.isNewTurn = true;
        this.leavedTurnPlayerCount = 0;
        this.finishedPlayerCount = 0;
        this.lastFinishedPlayerPosition = 0;
        this.secondLastDiscardPlayer = null;
        this.lastDiscardPlayer = null;
        this.currentDiscardSuite = null;
        this.preDiscardSuite = null;

        var cardSuite = [];
        this.activePlayerPosition = packet.Buffer.readByte();
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
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
                playeri.setCardsCount(13);
                this.numberOfPlayingPlayer++;
            }
        }
        this.getGameLayer().onDealCardReturn();
    },
    processDiscard: function () {
        playClickSound();
        var Packet = new BkPacket();
        Packet.CreateDiscardAction();
        BkConnectionManager.send(Packet);
    },

    netWorkProcessDiscardCard: function () {
        var onhand = this.getOnHandCard(this.getMyClientState());
        if(onhand != null && onhand.length == 1) // Special case, auto discard if player has only 1 card onhand.
        {
            if (this.isNewTurn && this.currentDiscardSuite != null)
            {
                this.currentDiscardSuite = null;
            }
            if(TLMNisabletoWin(onhand, this.currentDiscardSuite))
            {
                var Packet = new BkPacket();
                Packet.CreateDiscardCards(onhand);
                BkConnectionManager.send(Packet);
                return;
            }
        }
        var selectedCards = getSelectedCard(onhand);
        selectedCards = sortCardByType(selectedCards);
        if (selectedCards == null || selectedCards.length == 0) {
            showToastMessage(BkConstString.STR_NOT_SELECT_CARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }
        if (this.isNewTurn && this.currentDiscardSuite != null) {
            this.currentDiscardSuite = null;
        }
        if (!TLMNisabletoWin(selectedCards, this.currentDiscardSuite)) {
            showToastMessage(BkConstString.STR_INVALID_DISCARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }
        var Packet = new BkPacket();
        Packet.CreateDiscardCards(selectedCards);
        BkConnectionManager.send(Packet);
    },

    processGameTableSyn: function (packet) {
        this._super(packet);
        if (!this.isInGameProgress())
        {
            this.getGameLayer().clearAllImgCardCount();
            this.getGameLayer().clearCurrentGameGui();
            this.getGameLayer().clearCurrentGameGui();
            this.getGameLayer().hideAllOngameCustomButton();
            return;
        }
        this.activePlayerPosition = packet.Buffer.readByte();
        this.getGameLayer().ShowCicleCountDownTimeOnActivePlayer();
        this.numberOfPlayingPlayer = packet.Buffer.readByte();// số người chơi lúc bắt đầu ván
        this.isNewTurn = (packet.Buffer.readByte() == 1);
        this.leavedTurnPlayerCount = packet.Buffer.readByte();
        this.currentPlayerRank = packet.Buffer.readByte();
        this.finishedPlayerCount = packet.Buffer.readByte();
        var secondDiscardPlayerPosition = packet.Buffer.readByte();
        this.secondLastDiscardPlayer = (secondDiscardPlayerPosition == -1 ? null : this.getPlayer(secondDiscardPlayerPosition));
        var lastDiscardPlayerPosition = packet.Buffer.readByte();
        this.lastDiscardPlayer = (lastDiscardPlayerPosition == -1 ? null : this.getPlayer(lastDiscardPlayerPosition));
        this.lastFinishedPlayerPosition = packet.Buffer.readByte();
        var currentDiscardCount = packet.Buffer.readByte();
        this.currentDiscardSuite = [];
        for (var i = 0; i < currentDiscardCount; i++) {
            this.currentDiscardSuite.push(decode(packet.Buffer.readByte()));
        }
        var preDiscardCount = packet.Buffer.readByte();
        this.preDiscardSuite = [];
        for (var j = 0; j < preDiscardCount; j++) {
            this.preDiscardSuite.push(decode(packet.Buffer.readByte()));
        }
        var count = 0;
        while (packet.Buffer.isReadable()) {
            var playerPosition = packet.Buffer.readByte();
            var player = this.getPlayer(playerPosition);
            var cardCount = packet.Buffer.readByte();
            player.setCardsCount(cardCount);
            player.isPlaying = true;
            count++;
            if (packet.Buffer.readByte() == 1) {
                player.leaveTurn(true);
                this.getGameLayer().showBoLuotMark(player.serverPosition, true);
            }
            else {
                player.leaveTurn(false);
                this.getGameLayer().showBoLuotMark(player.serverPosition, false);
            }
            if (player.getCardsCount() == 0) {
                this.getGameLayer().clearImgCardCount(player);
                this.getGameLayer().showWinSplash(player.serverPosition);
                player.isFinishedGame = true;
            }
            if (playerPosition == this.getMyPos()) {
                var handList = [];
                var handCount = packet.Buffer.readByte();
                var iCard;
                for (var k = 0; k < handCount; k++) {
                    iCard = decode(packet.Buffer.readByte());
                    iCard.setSelectable(true);
                    iCard.setMoveHandle(this.getGameLayer());
                    iCard.setIsQueueAnimation(true);
                    initDragDropForCard(iCard,this.getGameLayer(),450);
                    handList.push(iCard);
                }
                this.getMyClientState().setOnhandCard(handList);
            }

        }
        this.numberOfPlayingPlayer = count;
        if (this.leavedTurnPlayerCount == (this.numberOfPlayingPlayer - 1)) {
            this.resetTurn();
        }
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
        this.getGameLayer().onTableSynReturn(this.currentDiscardSuite);
    },
    checkAllPlayerLeaveTurn: function () {
        return (this.leavedTurnPlayerCount == this.numberOfPlayingPlayer -1);
    },
    getPunishExitDuringGameMoney: function ()
    {
        return Math.floor(26*this.getTableBetMoney()*(this.numberOfPlayingPlayer - 1));
    },
    resetAllPlayerTurn: function () {
        for (var i = 0; i < this.PlayerState.length; i++) {
            var player = this.PlayerState[i];
            if (player != null && player.isPlaying) {
                player.leaveTurn(false);
                this.getGameLayer().showBoLuotMark(player.serverPosition, false);
            }
        }
    },
    checkColdLose: function () {
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if (playeri != null && playeri.getCardsCount() == 13) {
                playeri.setColdLose(true);
                playeri.isFinishedGame = true;
                this.finishedPlayerCount++;
                this.getGameLayer().showColdLoseSplash(playeri.serverPosition);
                this.getGameLayer().clearImgCardCount(playeri);
            }
        }
    },
    processThoiPush: function (packet) {
        var losePos = packet.Buffer.readByte();
        var cashLost = packet.Buffer.readInt();
        this.updateThoiMoney(losePos, cashLost);
        this.processNextEventInQueue();
    },
    updateThoiMoney: function (losePosition, cashLost) {
        var losePlayer = this.getPlayer(losePosition);
        this.increaseCash(losePlayer, cashLost, "Phạt thối");
    },
    updateTwoLastDiscardPlayer: function (discardPlayer) {
        this.secondLastDiscardPlayer = this.lastDiscardPlayer;
        this.lastDiscardPlayer = discardPlayer;
    },
    resetTurn: function () {
        this.isNewTurn = true;
        this.resetAllPlayerTurn();
        this.leavedTurnPlayerCount = 0;
        this.secondLastDiscardPlayer = null;
        this.lastDiscardPlayer = null;
        this.currentDiscardSuite = null;
    },
    onLeaveTurn: function()
    {
        this.getActivePlayer().leaveTurn(true);
        this.leavedTurnPlayerCount++;
        var currentActivePlayer = this.getActivePlayer();
        this.getNextActivePlayerPosition();
        if (this.checkAllPlayerLeaveTurn())
        {
            this.resetTurn();
        }else
        {
            this.getGameLayer().showBoLuotMark(currentActivePlayer.serverPosition, true);
        }
    },
    isMustLeaveTurn: function () {
        var onhand = this.getOnHandCard(this.getMyClientState());
        var onhandCard = onhand.slice();
        var currentDiscard = this.currentDiscardSuite;
        if (currentDiscard == null || currentDiscard.length == 0) {
            return false;
        }
        for (var i = 0; i < onhandCard.length; i++) {
            var cardi = onhandCard[i];
            var suggestedList = TLMNgetSmartSuggestedCards(currentDiscard, onhandCard, cardi);
            if (suggestedList != null && suggestedList.length != 0) {
                if (TLMNisabletoWin(suggestedList, currentDiscard)) {
                    return false; //co kha nang thang
                }
            }
        }
        return true;
    },
    updateMoneyAfterFinishGame: function (finishedPlayer,cashChange) {
        this.increaseCash(finishedPlayer, cashChange, "");
    },

    processDiscardPush: function (packet) {
        var activePlayer = this.getActivePlayer();
        if (activePlayer == null) {
            this.networkGetTableInfo();
            return;
        }
        var cardSuite = [];
        var myPlayer = this.getMyClientState();
        while (packet.Buffer.isReadable()) {
            var cardID = packet.Buffer.readByte();
            var card = null;
            if (this.isMyTurn()) {
                card = getCardById(cardID, myPlayer.getOnHandCard());
                if (card == null){
                    logMessage("invalid state -> get table info and sync event");
                    this.networkGetTableInfo();
                    return;
                }
                removeCardIdFromArrCardListOnly(cardID, myPlayer.getOnHandCard());
            }

            if (card == null) {
                logMessage("card == null");
                card = decode(cardID);
            }
            cardSuite.push(card);
        }
        // bo luot
        if (cardSuite.length == 0) {
            this.onLeaveTurn();
        } else // danh bai moi
        {
            this.isNewTurn = false;
            if (isDoithong3(cardSuite) || isDoithong4(cardSuite) || isTuQuy(cardSuite)) {
                playLaughtSound();
            } else {
                playDealCardSound();
            }
            this.preDiscardSuite = this.currentDiscardSuite;
            this.currentDiscardSuite = cardSuite;
            this.updateTwoLastDiscardPlayer(activePlayer);
            activePlayer.setCardsCount(activePlayer.getCardsCount() - cardSuite.length);
            if (activePlayer.getCardsCount() == 0) {
                this.getGameLayer().clearImgCardCount(activePlayer);
                activePlayer.isFinishedGame = true;
                activePlayer.leaveTurn(true);
                this.getGameLayer().showWinSplash(activePlayer.serverPosition);
                this.lastFinishedPlayerPosition = this.activePlayerPosition;
                activePlayer.setRank(this.currentPlayerRank);
                this.currentPlayerRank++;
                this.finishedPlayerCount++;
                this.checkColdLose();
                this.getGameLayer().stopGoldBox();
            }
                this.getNextActivePlayerPosition();
        }
        this.getGameLayer().onDiscardPush(cardSuite, activePlayer);
    },
    getThoiCount: function (onhandCardList, playerCard) {
        var card;
        var thoiCount = 0;
        if (playerCard == undefined) {
            playerCard = null;
        }
        if (onhandCardList == null || onhandCardList.length == 0) {
            return 0;
        }
        // search thoi 2
        for (var i = 0; i < onhandCardList.length; i++) {
            card = onhandCardList[i];
            if (card.number == 2) {
                thoiCount++;
                if (card.type == RO || card.type == CO) {
                    thoiCount++;
                }
            }
        }
        // search thoi tu quy
        for (i = 1; i < 13; i++) {
            if (getNumberCount(onhandCardList, i) == 4) {
                thoiCount += 2;
            }
        }
        // search thoi 3 doi thong
        for (i = 3; i <= 12; i++) {
            var doiFlag = true;
            for (var j = i; j < i + 3; j++) {
                if (j == 14) {
                    if (getNumberCount(onhandCardList, 1) >= 2) {
                        break;
                    }
                }
                if (getNumberCount(onhandCardList, j) < 2) {
                    doiFlag = false;
                    break;
                }
            }
            if (doiFlag) {
                thoiCount += 2;
                break;
            }
        }
        return thoiCount;
    },
    processSlash:function(packet)
    {
        var chatPosition = packet.Buffer.readByte();
        var biChatPosition = packet.Buffer.readByte();
        var chatPlayer = this.getPlayer(chatPosition);
        var biChatPlayer = this.getPlayer(biChatPosition);
        var cashLost = packet.Buffer.readInt();
        this.increaseCash(biChatPlayer, cashLost, "Bị chặt");
        var cashWin = Math.floor(-cashLost*(1 - TAX_RATE));
        this.increaseCash(chatPlayer,cashWin, "Chặt");
        this.processNextEventInQueue();
    },
    processAutoWin: function (packet) {
        var cardSuite = [];
        var playerPosition = packet.Buffer.readByte();
        var autoWinPlayer = this.getPlayer(playerPosition);
        var  cashWin = packet.Buffer.readInt();
        while (packet.Buffer.isReadable()) {
            var card = decode(packet.Buffer.readByte());
            cardSuite.push(card);
        }
        this.updateGameStatus(GAME_STATE_FINISH);
        this.getGameLayer().onAutoWin(autoWinPlayer, cardSuite,cashWin);
        this.processNextEventInQueue();
    },
    updateMoneyWhenAutoWin: function (autoWinPlayer,cashWin) {
        this.increaseCash(autoWinPlayer, cashWin, "Thắng trắng");
    },
    updateStateWhenAutoWin: function (playerAutoWin) {
        playerAutoWin.setRank(this.currentPlayerRank);
        playerAutoWin.setCardsCount(0);
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if ((playeri != null) && (playeri.isPlaying) && (i != playerAutoWin.serverPosition)) {
                playeri.setCardsCount(0);
                playeri.setRank(this.numberOfPlayingPlayer - 1);
                this.finishedPlayerCount++;
            }
        }
    },
    getLoseMoneyOfPlayerOutGameLeavingDuringGame:function(cashChange){
        return - Math.floor(cashChange / (1 - TAX_RATE ) * (this.numberOfPlayingPlayer - 1));
    },
    getReturnMoneyWhenLeavingDuringGame:function(betMoney, cashChange){
        return cashChange;//Math.floor(cashChange *(1 -TAX_RATE));
    },
    processFinishGame: function (packet)
    {
        this._super();
        this.cancelCardClickEvent();
        this.getGameLayer().hideAllOngameCustomButton();
        var cardSuite = [];
        var playerPosition = packet.Buffer.readByte();
        var cashChange = packet.Buffer.readInt();
        while (packet.Buffer.isReadable()) {
            var card = decode(packet.Buffer.readByte());
            cardSuite.push(card);
        }
        if (playerPosition != -1)
        {
            // nếu là mình thì ko cần cập nhật lại card onhand list
            var player = this.getPlayer(playerPosition);
            if (player == null){
                this.networkGetTableInfo();
                return;
            }
            if (player.serverPosition != this.getMyClientState().serverPosition) {
                player.removeOnhandCard();
                player.setOnhandCard(cardSuite);
            }
            player.isFinishedGame = true; // set player finish game
            player.setRank(this.currentPlayerRank);
            showThoiBaiMark(player);
            this.updateMoneyAfterFinishGame(player,cashChange);
            logMessage("processFinishGame:" + player.getName() + "rank:" + player.getRank());
            this.getGameLayer().onFinishGame(player.getOnHandCard(), player);
        }
        this.processNextEventInQueue();
    },
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_FINISH_GAME_RETURN:
            case c.NETWORK_TLMN_THOI_PUSH:
            case c.NETWORK_LEAVE_DURING_GAME:
            case c.NETWORK_TLMN_AUTO_WIN_PUSH:
            case c.NETWORK_PLAYER_STATUS_RETURN:
            case c.NETWORK_PREPARE_NEW_GAME:
            case c.NETWORK_TLMN_SLASH:
                return true;
        }
        return this._super(eventType);
    },
    shouldShowButtonSort:function(){
        if(this.getMyClientState() == null)
        {
            return;
        }
        var onhand = this.getMyClientState().getOnHandCard();
        if (onhand.length == 0){
            return;
        }
        var cloneOnhand = onhand.slice();
        cloneOnhand = sortCardByType(cloneOnhand);
        for (var i=0;i<onhand.length;i++){
            if (cloneOnhand[i].id != onhand[i].id){
                return true;
            }
        }
        return false;
    },
    sortOnHandCard:function(){
        logMessage("sortOnHandCard");
        var onhand = this.getMyClientState().getOnHandCard();
        if (onhand.length == 0){
            return;
        }
        this.getMyClientState().setOnhandCard(sortCardByType(onhand));
        showOnHandCardList(this.getMyClientState(),true,this.getGameLayer(),450);
    },
    /*
     * handle all TLMN ingame event
     * */
    processNetworkEvent: function (packet) {
        logMessage("BkTLMN Dem La InGameLogic -> processNetworkEvent " + packet.Type);
        switch (packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_DISCARD_PUSH:
                this.processDiscardPush(packet);
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet);
                break;
            case c.NETWORK_TLMN_THOI_PUSH:
                this.processThoiPush(packet);
                break;
            case c.NETWORK_TLMN_AUTO_WIN_PUSH:
                this.processAutoWin(packet);
                break;
            //case c.NETWORK_PLAYER_STATUS_RETURN:
            //    this.processPlayerStatusUpdate(packet);
            //    break;
            case c.NETWORK_TLMN_SLASH:
                this.processSlash(packet);
                break;
            default:
            {
                logMessage("BkTLMNDemLaInGameLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});