/**
 * Created by bs on 10/10/2015.
 */
BkTLMNInGameLogic = BkInGameLogic.extend({
    isNewTurn: false,
    leavedTurnPlayerCount: 0,
    isAnSaiTurn: false,
    secondLastDiscardPlayer: null,
    lastDiscardPlayer: null,
    lastFinishedPlayerPosition: 0,
    currentDiscardSuite: null,
    preDiscardSuite: null,
    TLMNMoneyLogic: null,
    numberOfUnfinishedPlayer:0, // Số người chơi thực tế ở thời điểm table syn, có thể có thằng nhất đã rời bàn, để tính lượt
    //sortType:0, // 0 -> sort tang dan theo ID, 1 -> sort theo bo
    ctor: function () {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.TLMN);
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

        //this.sortType = 0;

        this.numberOfUnfinishedPlayer = 0;
        this.isNewTurn = true;
        this.isAnSaiTurn = false;
        this.leavedTurnPlayerCount = 0;
        this.finishedPlayerCount = 0;
        this.lastFinishedPlayerPosition = 0;
        this.secondLastDiscardPlayer = null;
        this.lastDiscardPlayer = null;
        this.currentDiscardSuite = null;

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
        this.numberOfUnfinishedPlayer = this.numberOfPlayingPlayer;
        this.betMoneyWhenStartGame();
        this.getGameLayer().onDealCardReturn();
    },

    betMoneyWhenStartGame: function () {
        var playerState;
        for (var i = 0; i < this.PlayerState.length; i++) {
            playerState = this.PlayerState[i];
            if ((playerState != null) && playerState.isPlaying) {
                var cashLost = this.TLMNMoneyLogic.cashLostWhenBet(this.getTableBetMoney());
                this.increaseCash(playerState, cashLost, "Đặt cược");
            }
        }
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
            //this.getGameLayer().clearCurrentGameGui();
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
        this.isAnSaiTurn = (packet.Buffer.readByte() == 1);
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
            player.setRank(packet.Buffer.readByte());
            if (player.getCardsCount() == 0) {
                this.getGameLayer().showRankSplash(player.serverPosition, player.getRank());
                this.getGameLayer().clearImgCardCount(player);
                player.isFinishedGame = true;
            }
            player.setColdLose(packet.Buffer.readByte() == 1);
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
        this.numberOfUnfinishedPlayer = count; // số đang người chơi lúc syn,
        if (this.leavedTurnPlayerCount == (this.numberOfUnfinishedPlayer - 1)) {
            this.resetTurn();
        }
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
        this.getGameLayer().onTableSynReturn(this.currentDiscardSuite);
    },

    checkAllPlayerLeaveInAnsaiTurn: function () {
        if (this.leavedTurnPlayerCount == (this.numberOfUnfinishedPlayer - this.finishedPlayerCount)) {
            this.activePlayerPosition = this.lastFinishedPlayerPosition;
            return true;
        }
        return false;
    },
    getPunishExitDuringGameMoney: function () {
        return this.TLMNMoneyLogic.cashChangeWhenLeaveDuringGame(this.getTableBetMoney(), this.numberOfUnfinishedPlayer);
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
                this.updateMoneyWhenColdLose(playeri);
            }
        }
    },

    updateMoneyWhenColdLose: function (losePlayer) {
        var cashLost = this.TLMNMoneyLogic.cashLostWhenColdLose(this.tableBetMoney);
        cashLost = Math.max(cashLost, -losePlayer.getCurrentCash());
        var cashWin = Math.floor(-cashLost * (1 - TAX_RATE));
        logMessage("cashwin:" + cashWin);
        this.increaseCash(losePlayer, cashLost, "Thua cóng");
        logMessage("cashLost:" + cashLost + "thua cóng:" + losePlayer.getName());
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            // chuyển tiền cóng cho thằng nhất
            if ((playeri.isPlaying && playeri.isFinishedGame) && (playeri.getRank() == 0)) {
                this.increaseCash(playeri, cashWin, "Thắng cóng");
                logMessage("thắng cóng:" + playeri.getName());
                break;
            }
        }
    },

    checkBiChat: function (currentSuite, preCardSuite) {
        if (this.secondLastDiscardPlayer == null || this.secondLastDiscardPlayer.isFinishedGame) {
            return;
        }
        if (isDoithong3(currentSuite) || isTuQuy(currentSuite) || isDoithong4(currentSuite)) {
            var cashLost = this.TLMNMoneyLogic.cashLostWhenChat(this.getTableBetMoney(), preCardSuite);
            cashLost = Math.max(cashLost, -this.secondLastDiscardPlayer.getCurrentCash());
            this.increaseCash(this.secondLastDiscardPlayer, cashLost, "Bị Chặt");
            var cashWin = Math.floor(-cashLost * (1 - TAX_RATE));
            this.increaseCash(this.lastDiscardPlayer, cashWin, "Chặt");
        }
    },
    processThoiPush: function (packet) {
        var losePos = packet.Buffer.readByte();
        var winPos = packet.Buffer.readByte();
        var thoiCount = packet.Buffer.readByte();
        this.updateThoiMoney(losePos, winPos, thoiCount);
        this.processNextEventInQueue();
    },
    updateThoiMoney: function (losePosition, winPosition, thoiCount) {
        var losePlayer = this.getPlayer(losePosition);
        var winPlayer = this.getPlayer(winPosition);
        var cashLost = this.TLMNMoneyLogic.cashLostWhenThoi(this.getTableBetMoney(), thoiCount);
        cashLost = Math.max(cashLost, -losePlayer.getCurrentCash());
        var cashWin = Math.floor(-cashLost * (1 - TAX_RATE));
        this.increaseCash(losePlayer, cashLost, "Phạt thối");
        this.increaseCash(winPlayer, cashWin, "");
    },
    updateTwoLastDiscardPlayer: function (discardPlayer) {
        this.secondLastDiscardPlayer = this.lastDiscardPlayer;
        this.lastDiscardPlayer = discardPlayer;
    },
    resetTurn: function () {
        this.checkBiChat(this.currentDiscardSuite, this.preDiscardSuite);
        this.isNewTurn = true;
        this.resetAllPlayerTurn();
        this.leavedTurnPlayerCount = 0;
        this.secondLastDiscardPlayer = null;
        this.lastDiscardPlayer = null;
        this.currentDiscardSuite = null;
    },
    checkAllPlayerLeaveNotInAnsaiTurn: function () {
        return (this.leavedTurnPlayerCount == (this.numberOfUnfinishedPlayer - this.finishedPlayerCount - 1));
    },
    onLeaveTurn: function () {
        this.getActivePlayer().leaveTurn(true);
        this.leavedTurnPlayerCount++;
        if (this.isAnSaiTurn) {
            if (this.checkAllPlayerLeaveInAnsaiTurn()) {
                this.resetTurn();
            }
            else {
                this.getGameLayer().showBoLuotMark(this.getActivePlayer().serverPosition, true);
            }
            this.getNextActivePlayerPosition();
        }
        else {
            this.getGameLayer().showBoLuotMark(this.getActivePlayer().serverPosition, true);
            this.getNextActivePlayerPosition();
            if (this.checkAllPlayerLeaveNotInAnsaiTurn()) {
                this.resetTurn();
            }
        }
    },
    isMustLeaveTurn: function () {
        logMessage("isMustLeaveTurn ");
        var onhand = this.getOnHandCard(this.getMyClientState());
        var onhandCard = onhand.slice();
        onhandCard = sortCardByType(onhandCard);
        var currentDiscard = this.currentDiscardSuite;
        if (currentDiscard == null || currentDiscard.length == 0) {
            return false;
        }
        logMessage("isMustLeaveTurn "+currentDiscard.length);
        for(var j = 0; j < currentDiscard.length; j++)
        {
            if(currentDiscard[j] instanceof  BkCard)
            {
                logMessage("card "+ j +  "is instanceof BK card");
            } else {
                logMessage("not card "+ j +  "is instanceof BK card -> error recheck");
            }

        }


        for (var i = 0; i < onhandCard.length; i++)
        {
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
    checkLast3Bich: function (currentSuite) {
        if (isDiscardLast3Bich(currentSuite)) {
            var cashWin = 0;
            for (var i = 0; i < this.getPlayerState().length; i++) {
                var playeri = this.getPlayerState()[i];
                if (playeri != null && playeri != this.getActivePlayer() && playeri.isPlaying) {
                    var cashLost = this.TLMNMoneyLogic.cashLostWhenBiDanh3Cuoi(this.getTableBetMoney());
                    cashLost = Math.max(cashLost, -playeri.getCurrentCash());
                    cashWin += Math.floor(-cashLost * (1 - TAX_RATE));
                    this.increaseCash(playeri, cashLost, "");
                }
            }
            this.increaseCash(this.getActivePlayer(), cashWin, "3 bích cuối");
        }
    },
    updateMoneyAfterFinishGame: function (finishedPlayer) {
        var cashChange = this.TLMNMoneyLogic.cashChangeWhenFinishGame(this.getTableBetMoney(), finishedPlayer.getRank(), this.numberOfPlayingPlayer);
        this.increaseCash(finishedPlayer, cashChange, "");
    },

    processDiscardPush: function (packet) {
        logMessage("processDiscardPush");
        var activePlayer = this.getActivePlayer();
        if (activePlayer == null) {
            this.networkGetTableInfo();
            this.processNextEventInQueue();
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
                    this.processNextEventInQueue();
                    return;
                }

                removeCardIdFromArrCardListOnly(cardID, myPlayer.getOnHandCard());
            }
            if (card == null) {
                logMessage("card == null");
                card = decode(cardID);
            }
            if(card instanceof BkCard)
            {
                logMessage("OK");
            }else
            {
                logMessage("card" + cardID + "is not instance of BKCard");
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
            var needUpdateActivePlayer = true;
            if (this.isAnSaiTurn && (this.leavedTurnPlayerCount == this.numberOfUnfinishedPlayer - this.finishedPlayerCount - 1)) {
                needUpdateActivePlayer = false;
            }
            this.isAnSaiTurn = false;
            activePlayer.setCardsCount(activePlayer.getCardsCount() - cardSuite.length);
            if (!needUpdateActivePlayer) {
                this.resetTurn();
            }
            if (activePlayer.getCardsCount() == 0)
            {
                logMessage("player "+activePlayer.getName()+" finish game ");
                this.getGameLayer().clearImgCardCount(activePlayer);
                activePlayer.isFinishedGame = true;
                activePlayer.leaveTurn(true);
                this.isAnSaiTurn = true;
                this.lastFinishedPlayerPosition = this.activePlayerPosition;
                activePlayer.setRank(this.currentPlayerRank);
                this.getGameLayer().showRankSplash(activePlayer.serverPosition, this.currentPlayerRank);
                this.currentPlayerRank++;
                this.finishedPlayerCount++;
                if (this.finishedPlayerCount == 1) {
                    this.checkColdLose();
                    this.checkLast3Bich(cardSuite);
                }
                this.updateMoneyAfterFinishGame(activePlayer);
                this.getGameLayer().stopGoldBox();
            }
            if (!this.isFinishGame() && needUpdateActivePlayer) {
                this.getNextActivePlayerPosition();
            }
        }
        this.getGameLayer().onDiscardPush(cardSuite, activePlayer);
        this.processNextEventInQueue();
        //checkPlayerInfo();
    },
    isFinishGame: function ()
    {
        return !(this.finishedPlayerCount < (this.numberOfUnfinishedPlayer - 1)) ;
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
            if (getNumberCount(onhandCardList, i) == 4)
            {
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
    checkThoiBai: function (player) {
        var thoiCount = this.getThoiCount(player.getOnHandCard(), player);
        if (thoiCount == 0) {
            return;
        }
        var receivedPlayer = null;
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if (playeri != null && playeri.isFinishedGame && playeri.isPlaying) {
                receivedPlayer = playeri;
                if (receivedPlayer.getRank() == player.getRank() - 1) {
                    break;
                }
            }
        }
        if (receivedPlayer == null) {
            return;
        }
        var cashLost = this.TLMNMoneyLogic.cashLostWhenThoi(this.getTableBetMoney(), thoiCount);
        cashLost = Math.max(cashLost, -player.getCurrentCash());
        var cashWin = Math.floor(-cashLost * (1 - TAX_RATE));
        this.increaseCash(player, cashLost, "Thối");
        this.increaseCash(receivedPlayer, cashWin, "");
    },
    checkThoi3Bich: function (thoiPlayer) {
        if (!isThoi3Bich(thoiPlayer.getOnHandCard())) {
            return;
        }
        var cashLost = this.TLMNMoneyLogic.cashLostWhenThoi3(this.getTableBetMoney(), this.numberOfUnfinishedPlayer);
        cashLost = Math.max(cashLost, -thoiPlayer.getCurrentCash());
        var cashWin = Math.floor(-cashLost * (1 - TAX_RATE));
        if (this.numberOfUnfinishedPlayer > 2) {
            cashWin = cashWin / (this.numberOfUnfinishedPlayer - 1);
        }
        this.increaseCash(thoiPlayer, cashLost, "Thối 3 bích");
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if ((playeri != null) && (playeri != thoiPlayer) && playeri.isPlaying) {
                this.increaseCash(playeri, cashWin, "");
            }
        }
    },
    processAutoWin: function (packet) {
        var cardSuite = [];
        var playerPosition = packet.Buffer.readByte();
        var autoWinPlayer = this.getPlayer(playerPosition);
        while (packet.Buffer.isReadable()) {
            var card = decode(packet.Buffer.readByte());
            cardSuite.push(card);
        }
        this.updateGameStatus(GAME_STATE_FINISH);
        this.getGameLayer().onAutoWin(autoWinPlayer, cardSuite);
        this.processNextEventInQueue();
    },
    updateMoneyWhenAutoWin: function (autoWinPlayer) {
        var cashChange = this.TLMNMoneyLogic.cashWinWhenAutoWin(this.getTableBetMoney(), this.numberOfUnfinishedPlayer);
        this.increaseCash(autoWinPlayer, cashChange, "Tới trắng");
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
    processLeaveDurringGameWithData:function(playerPos,cashChange,playerOutGame){
        if(!playerOutGame.isFinishedGame)
        {
            this.gameStatus = GAME_STATE_FINISH;
            var cashLost = this.getLoseMoneyOfPlayerOutGameLeavingDuringGame(cashChange);//-cashChange * (this.numberOfUnfinishedPlayer - 1);
            //cashLost = Math.max(cashLost, - playerOutGame.getCurrentCash());
            this.increaseCash(playerOutGame,cashLost,"Phạt");
            for (var  i = 0 ; i < this.PlayerState.length; i++)
            {
                var betMoney = this.getTableBetMoney();
                var playeri = this.PlayerState[i];
                if (playeri.isFinishedGame){
                    betMoney = 0;
                }
                if (playeri.serverPosition != playerOutGame.serverPosition )
                {
                    if (playeri.isPlaying) {
                        this.increaseCash(playeri, this.getReturnMoneyWhenLeavingDuringGame(betMoney, cashChange));
                    }
                }
            }
            this.getGameLayer().hideAllOngameCustomButton();
        }
        else
        {
            this.numberOfUnfinishedPlayer--;
            this.finishedPlayerCount--;
        }
    },
    getLoseMoneyOfPlayerOutGameLeavingDuringGame:function(cashChange){
        return -cashChange * (this.numberOfUnfinishedPlayer - 1);
    },
    getReturnMoneyWhenLeavingDuringGame: function (betMoney, cashChange) {
        return this.TLMNMoneyLogic.cashReturnToOtherPlayersWhenStopGame(betMoney, cashChange);
    },
    processFinishGame: function (packet) {
        this._super();
        // Cancel click event
        this.cancelCardClickEvent();
        this.checkBiChat(this.currentDiscardSuite, this.preDiscardSuite);
        var cardSuite = [];
        var playerPosition = packet.Buffer.readByte();
        while (packet.Buffer.isReadable()) {
            var card = decode(packet.Buffer.readByte());
            cardSuite.push(card);
        }
        if (playerPosition != -1) {
            // nếu là mình thì ko cần cập nhật lại card onhand list
            var player = this.getPlayer(playerPosition);
            if (player.serverPosition != this.getMyClientState().serverPosition) {
                player.removeOnhandCard();
                player.setOnhandCard(cardSuite);
            }
            player.isFinishedGame = true; // set player finish game
            player.setRank(this.currentPlayerRank);
            this.currentPlayerRank++;
            this.updateMoneyAfterFinishGame(player);
            this.getGameLayer().showRankSplash(player.serverPosition, player.getRank());
            this.getGameLayer().hideAllOngameCustomButton();
            this.checkThoi3Bich(player);
            this.checkThoiBai(player);
            showThoiBaiMark(player);
            logMessage("processFinishGame:" + player.getName() + "rank:" + player.getRank());
            this.getGameLayer().onFinishGame(player.getOnHandCard(), player);
            // set Rank for All Player
            for (var i = 0; i < this.PlayerState.length; i++) {
                var playeri = this.PlayerState[i];
                if (playeri.isPlaying && !playeri.isFinishedGame) {
                    playeri.setRank(this.currentPlayerRank);
                    logMessage("processFinishGame:" + player.getName() + "rank:" + player.getRank());
                    this.getGameLayer().showRankSplash(playeri.serverPosition, playeri.getRank());
                    this.currentPlayerRank++;
                }
            }
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
            case c.NETWORK_DISCARD_PUSH:
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
        this.getGameLayer().showGameCustomButtons();
    },
    /*
     * handle all TLMN ingame event
     * */
    processNetworkEvent: function (packet) {
        logMessage("BkTLMNInGameLogic -> processNetworkEvent " + packet.Type);
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
            default:
            {
                logMessage("BkTLMNInGameLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});