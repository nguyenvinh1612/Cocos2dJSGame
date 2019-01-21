/**
 * Created by bs on 01/12/2015.
 */
BkSAMIngameLogic = BkInGameLogic.extend({
    isNewTurn: false,
    leavedTurnPlayerCount: 0,
    secondLastDiscardPlayer: null,
    lastDiscardPlayer: null,
    lastFinishedPlayerPosition: 0,
    currentDiscardSuite: null,
    baoXamCount:0,
    baoXamPlayerPosition:-1,
    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.XAM);
        this.moneyLogic = new BkSamMoneyLogic();
    },
    processGameTableSyn: function (packet) {
        this._super(packet);
        if (!this.isInGameProgress())
        {
            this.getGameLayer().clearAllImgCardCount();
            this.getGameLayer().clearCurrentGameGui();
            this.getGameLayer().hideAllOngameCustomButton();
            return;
        }
        this.activePlayerPosition = packet.Buffer.readByte();
        this.getGameLayer().ShowCicleCountDownTimeOnActivePlayer();
        this.isNewTurn = (packet.Buffer.readByte() == 1);// ? true : false;
        this.leavedTurnPlayerCount = packet.Buffer.readByte();
        this.baoXamCount = packet.Buffer.readByte();
        var secondDiscardPlayerPosition = packet.Buffer.readByte();
        this.secondLastDiscardPlayer = (secondDiscardPlayerPosition == -1 ? null : this.getPlayer(secondDiscardPlayerPosition));
        var lastDiscardPlayerPosition = packet.Buffer.readByte();
        this.lastDiscardPlayer = (lastDiscardPlayerPosition == -1 ? null : this.getPlayer(lastDiscardPlayerPosition));
        this.baoXamPlayerPosition = packet.Buffer.readByte();
        var player;
        if(this.baoXamPlayerPosition != -1)
        {
            //player = this.getPlayer(this.baoXamPlayerPosition);
            this.getGameLayer().showBaoXamMark(this.baoXamPlayerPosition,true);
        }

        this.currentDiscardSuite = [];
        var currentDiscardCount = packet.Buffer.readByte();
        for (var i = 0; i < currentDiscardCount; i++) {
            this.currentDiscardSuite.push(decode(packet.Buffer.readByte()));
        }
        var count = 0;
        while (packet.Buffer.isReadable()) {
            var playerPosition = packet.Buffer.readByte();
            player = this.getPlayer(playerPosition);
            if(player == null)
            {
                return;
            }
            var cardCount = packet.Buffer.readByte();
            player.setCardsCount(cardCount);
            player.isPlaying = true;
            count++;
            if(cardCount == 1)
            {
                if(player.serverPosition == this.baoXamPlayerPosition)
                {
                    this.getGameLayer().resetImageBaoSamForBaoSamPlayer();
                }
                this.getGameLayer().alert1Card(player.serverPosition,true);
            }
            if (packet.Buffer.readByte() == 1) {
                player.leaveTurn(true);
                this.getGameLayer().showBoLuotMark(player.serverPosition, true);
            }
            else {
                player.leaveTurn(false);
                this.getGameLayer().showBoLuotMark(player.serverPosition, false);
            }
            if (player.getCardsCount() == 0) {
                this.getGameLayer().showWinSplash(player.serverPosition);
                player.isFinishedGame = true;
            }
            if (playerPosition == this.getMyPos())
            {
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
                handList = sortCardByType(handList);
                this.getMyClientState().setOnhandCard(handList);
            }
        }
        this.numberOfPlayingPlayer = count;
        if (this.leavedTurnPlayerCount == (this.numberOfPlayingPlayer - 1))
        {
            this.resetTurn();
        }
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
        this.getGameLayer().onTableSynReturn(this.currentDiscardSuite);
        if(this.baoXamPlayerPosition == -1) {
            if (!this.allPlayersBaoXam()){
                if (this.getMyClientState().isPlaying) {
                    this.getGameLayer().showCountDownWithBG(30-2);
                    this.getGameLayer().showBaoSamMenuButton();
                }
            }
        }
    },
    processDealCardReturn: function (packet) {
        this._super();
        this.numberOfPlayingPlayer = 0;
        this.baoXamCount = 0;
        this.baoXamPlayerPosition = -1;
        this.resetTurn();
        var cardSuite = [];
        this.activePlayerPosition = packet.Buffer.readByte();
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.initCardBackMask();
            card.visible = false;
            cardSuite.push(card);
        }
        cardSuite = sortCardByType(cardSuite);
       if(this.getMyClientState() == null)
       {
           return;
       }
        this.getMyClientState().setOnhandCard(cardSuite); // my card
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if (playeri != null) {
                playeri.isPlaying = true;
                playeri.leaveTurn(false);
                playeri.setRank(-1);
                playeri.setCardsCount(10);
                this.numberOfPlayingPlayer++;
            }
        }
        this.getGameLayer().onDealCardReturn();
    },
    allPlayersBaoXam:function()
    {
        return (this.baoXamCount >= this.numberOfPlayingPlayer);
    },
    updateStateWhenBaoXam:function(playerPosition,flag){
        this.baoXamCount++;
        if (flag){
            this.baoXamPlayerPosition = playerPosition;
            this.activePlayerPosition = playerPosition;
        }
    },
    processBaoSam:function(packet){
        var playerPosition = packet.Buffer.readByte();
        var flagBaoXam = packet.Buffer.readByte();
        var flag = false;
        if (flagBaoXam == 1){
            flag = true;
        }
        this.updateStateWhenBaoXam(playerPosition,flag);
        this.getGameLayer().onBaoSam(playerPosition,flag);
        logMessage("processBaoSam -> pneiq");
        this.processNextEventInQueue();
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
    invalidDiscardPush:function(){
        var activePlayer = this.getActivePlayer();
        if (activePlayer == null){
            return true;
        }
        var myPlayer = this.getMyClientState();
        if (myPlayer == null){
            return true;
        }

        if (this.gameStatus != GAME_STATE_WAIT_XAM_DISCARD){
            return true;
        }

        return false;
    },
    processDiscardPush: function (packet) {
        logMessage("processDiscardPush Sam");
        if (this.invalidDiscardPush()){
            logMessage("onReceive DiscardPush sai state -> get table info and sync event");
            this.networkGetTableInfo();
            return;
        }
        var activePlayer = this.getActivePlayer();
        var myPlayer = this.getMyClientState();
        var cardSuite = [];

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
            if(card instanceof  BkCard)
            {
                logMessage("processDiscardPush: card OK" );
            }else
            {
                logMessage("card:" + cardID + "is not instance of BKcard");
            }
            cardSuite.push(card);
        }

        logMessage("cardSuite.length: "+cardSuite.length);
        logMessage("activePlayer: "+activePlayer.getName() + " number Card Count:" + activePlayer.getCardsCount());
        // bo luot
        if (cardSuite.length == 0)
        {
            this.onLeaveTurn();
        } else // danh bai moi
        {
            logListCard(cardSuite);
            this.isNewTurn = false;
            if (isDoithong3(cardSuite) || isDoithong4(cardSuite) || isTuQuy(cardSuite)) {
                playLaughtSound();
            } else {
                playDealCardSound();
            }
            this.currentDiscardSuite = cardSuite;
            this.updateTwoLastDiscardPlayer(activePlayer);
            activePlayer.setCardsCount(activePlayer.getCardsCount() - cardSuite.length);
            if (activePlayer.getCardsCount() == 0)
            {
                logMessage("activePlayer.getCardsCount() == 0 -> finish game");
                this.getGameLayer().alert1Card(activePlayer.serverPosition,false);
                activePlayer.isFinishedGame = true;
                activePlayer.leaveTurn(true);
                activePlayer.setRank(0);
                if (this.baoXamPlayerPosition == -1)
                {
                    this.getGameLayer().showWinSplash(activePlayer.serverPosition);
                }
                this.getGameLayer().stopGoldBox();
                this.getGameLayer().onDiscardPush(cardSuite, activePlayer);
                // danh 2 cuoi, den bang tong so quan moi nguoi da danh ra* tien cuoc
                if(isRac2(cardSuite) || isDoi2(cardSuite) || isBa2(cardSuite)||isTuQuy2(cardSuite))
                {
                    for(var j = 0; j < cardSuite.length; j++)
                    {
                        cardSuite[j].setCardStatus(CARD_STATUS_TAKEN,true);
                    }
                    var totalDiscardCount = 0;
                    for(var i = 0; i < this.PlayerState.length; i++)
                    {
                        var playeri = this.PlayerState[i];
                        if(playeri.isPlaying && !playeri.isFinishedGame)
                        {
                            var discardCount = 10 - playeri.getCardsCount();
                            totalDiscardCount += discardCount;
                            var cashWin  = Math.floor(-(1-TAX_RATE)*this.moneyLogic.cashLostWhen2Cuoi(this.getTableBetMoney(),discardCount));
                            this.increaseCash(playeri,cashWin,"");
                        }
                    }
                    var cashLost = this.moneyLogic.cashLostWhen2Cuoi(this.getTableBetMoney(),totalDiscardCount);
                    this.increaseCash(activePlayer,cashLost,"Thối");
                }
                return;
            }
            if(activePlayer.getCardsCount() == 1)
            {
                logMessage("activePlayer.getCardsCount() == 1 -> show alert1Card");
                if(activePlayer.serverPosition == this.baoXamPlayerPosition)
                {
                    this.getGameLayer().resetImageBaoSamForBaoSamPlayer();
                }
                this.getGameLayer().alert1Card(activePlayer.serverPosition,true);
            }

            if (this.baoXamPlayerPosition != -1){
                if (activePlayer.serverPosition != this.baoXamPlayerPosition){
                    logMessage("co ng bao Sam va bi chat -> finish game");
                    this.getGameLayer().onDiscardPush(cardSuite, activePlayer);
                    return;
                }
            }

            logMessage("change next ActivePlayer");
            this.getNextActivePlayerPosition();
        }

        logMessage("update UI onDiscardPush");
        this.getGameLayer().onDiscardPush(cardSuite, activePlayer);
        //checkPlayerInfo();
    },
    resetTurn: function () {
        this.isNewTurn = true;
        this.resetAllPlayerTurn();
        this.leavedTurnPlayerCount = 0;
        this.secondLastDiscardPlayer = null;
        this.lastDiscardPlayer = null;
        this.currentDiscardSuite = null;

    },
    resetAllPlayerTurn: function () {
        for (var i = 0; i < this.PlayerState.length; i++) {
            var player = this.PlayerState[i];
            if (player != null && player.isPlaying) {
                player.leaveTurn(false);
                this.getGameLayer().showBoLuotMark(player.serverPosition, false);
            }
        }

        this.processSlash();
    },
    processSlash:function(){
        if (this.secondLastDiscardPlayer != null) {
            if (isTuQuy(this.currentDiscardSuite)) {
                var cashLost = Math.max(this.moneyLogic.cashLostWhenSlash(this.getTableBetMoney()), -this.secondLastDiscardPlayer.getCurrentCash());
                var cashWin = Math.floor(-cashLost * (1 - TAX_RATE));
                this.increaseCash(this.secondLastDiscardPlayer,cashLost,"Bị Chặt");
                this.increaseCash(this.lastDiscardPlayer,cashWin,"Chặt");
            }
        }
    },
    updateTwoLastDiscardPlayer: function (discardPlayer) {
        this.secondLastDiscardPlayer = this.lastDiscardPlayer;
        this.lastDiscardPlayer = discardPlayer;
    },
    checkAllPlayerLeaveTurn: function ()
    {
        return (this.leavedTurnPlayerCount == this.numberOfPlayingPlayer -1)
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
    processFinishGame: function (packet) {
        this._super();
        // Cancel click event
        this.cancelCardClickEvent();
        this.getGameLayer().hideAllOngameCustomButton();
        var playerNotDiscardBiggestCardPosition = packet.Buffer.readByte();
        logMessage(" playerNotDiscardBiggestCardPosition "+playerNotDiscardBiggestCardPosition);
        while (packet.Buffer.isReadable()){
            var playerPosition = packet.Buffer.readByte();
            var cardsCount = packet.Buffer.readByte();
            var cardSuite = [];
            for (var i=0;i<cardsCount;i++){
                var card = decode(packet.Buffer.readByte());
                cardSuite.push(card);
            }

            if (playerPosition!= this.getMyPos()){
                var player = this.getPlayer(playerPosition);
                player.setOnhandCard(cardSuite);
                this.getGameLayer().showListCardFinish(playerPosition,cardSuite);
            }
        }

        // het van tinh tien
        var activePlayer =  this.getActivePlayer();
        var pAvar = this.getGameLayer().getAvatarByServerPos(this.getActivePlayerPos());
        if (activePlayer.getCardsCount() == 0)
        {
            // activePlayer danh het bai -> thang binh thuong hoac an sam
            logMessage("activePlayer danh het bai -> thang binh thuong hoac an sam");
            //var playerNotDiscardBiggestCard = this.getGameLayer().getAvatarByServerPos(playerNotDiscardBiggestCardPosition);
            var playerNotDiscardBiggestCard = this.getPlayer(playerNotDiscardBiggestCardPosition);
            if (playerNotDiscardBiggestCard != null){
                logMessage(" playerNotDiscardBiggestCard "+playerNotDiscardBiggestCard.getName());
            } else{
                logMessage("khong co ng k danh cay to nhat");
            }
            this.updateMoneyAfterFinishGame(activePlayer,playerNotDiscardBiggestCard);

            if (this.baoXamPlayerPosition != -1){
                // an sam -> show avar an sam
                pAvar.anSam(true);
            } else
            {
                // thang binh thuong
            }
        } else {
            // den sam
            logMessage("den sam "+activePlayer.serverPosition+" baoXamPlayerPosition: "+this.baoXamPlayerPosition);
            if (this.baoXamPlayerPosition == -1){
                logTracker("ERROR: onreceive Finish game khi -> recheck");
                this.networkGetTableInfo();
                return;
            }

            this.updateMoneyWhenDenXam(activePlayer);
            // show den sam
            var denSamAvar = this.getGameLayer().getAvatarByServerPos(this.baoXamPlayerPosition);
            //pAvar.anSam(true);
            denSamAvar.clearBaoSam();
            denSamAvar.clearAlert1Card();
            denSamAvar.anSam(false);
        }
        logMessage("finish game -> pneiq");
        this.processNextEventInQueue();
    },
    isThoi2GameSam:function(iPlayer){
        if (iPlayer == null){
            logMessage("iPlayer == null");
            return false;
        }
        var onhand = iPlayer.getOnHandCard();
        if (onhand == null){
            logMessage("onhand == null");
            return false;
        }
        logMessage("on hand length: "+onhand.length);
        for (var  i=0;i< onhand.length;i++){
            var iCard = onhand[i];
            logMessage("i "+i+": cardNumber "+iCard.getNumber());
            if (iCard.getNumber() != 2){
                logMessage("khong thoi hai");
                return false;
            }
        }
        logMessage("thoi hai");
        return true;
    },
    updateMoneyAfterFinishGame:function(winPlayer,playerNotDiscardBiggestCard){
        logMessage("updateMoneyAfterFinishGame");
        var totalEarn =0;
        for (var i=0;i < this.maxPlayer;i++){
            var iPlayer = this.getPlayer(i);
            if ((iPlayer == null) || (i == winPlayer.serverPosition) || (!iPlayer.isPlaying)){
                continue;
            }
            var cashLost = 0;
            var strMess = "";
            if (this.baoXamPlayerPosition != -1){
                cashLost = this.moneyLogic.cashLostWhenXamLose(this.getTableBetMoney());
            }else{
                if (iPlayer.getCardsCount() == 10){
                    // thua cong
                    cashLost = this.moneyLogic.cashLostWhenColdLose(this.getTableBetMoney());
                    var pAvar = this.getGameLayer().getAvatarByServerPos(iPlayer.serverPosition);
                    pAvar.showColdLose();
                } else {
                    cashLost =  this.moneyLogic.cashLostWhenLose(this.getTableBetMoney(),iPlayer.getCardsCount());
                }
                if (this.isThoi2GameSam(iPlayer)){
                    logMessage("thoi hai game sam");
                    cashLost = this.moneyLogic.cashLostWhenThoi2(this.getTableBetMoney());
                    strMess = "Thối";
                } else{
                    logMessage("Khong thoi hai");
                }
            }
            cashLost = Math.max(cashLost, -iPlayer.getCurrentCash());
            if (playerNotDiscardBiggestCard!= null){
                logMessage("co player k danh cay to nhat");
            } else {
                this.increaseCash(iPlayer,cashLost,strMess);
            }
            totalEarn -= cashLost;
            logMessage(" iPlayer "+iPlayer.getName()+" cashLost: "+cashLost+" totalEarn: "+totalEarn)
        }

        if (playerNotDiscardBiggestCard!= null){
            logMessage(" playerNotDiscardBiggestCard "+playerNotDiscardBiggestCard.getName());
            totalEarn = Math.max(-totalEarn, -playerNotDiscardBiggestCard.getCurrentCash());
            logMessage(" totalEarn khi co ng den do k danh cay to nhat: "+totalEarn);
            this.increaseCash(playerNotDiscardBiggestCard,totalEarn,"");
        }

        totalEarn = Math.abs(totalEarn);
        logMessage("totalEarn: "+totalEarn);
        var cashEarn = Math.floor(totalEarn * (1-TAX_RATE));
        this.increaseCash(winPlayer,cashEarn,"");
    },
    updateMoneyWhenDenXam:function(winplayer){
        var baoSamPlayer = this.getPlayer(this.baoXamPlayerPosition);
        var cashLost = Math.max(this.moneyLogic.cashLostWhenDenXam(this.getTableBetMoney(), this.numberOfPlayingPlayer)
            , -baoSamPlayer.getCurrentCash());
        var cashEarn = Math.floor(-cashLost * (1 - TAX_RATE));

        this.increaseCash(baoSamPlayer,cashLost,"Đền Sâm");
        this.increaseCash(winplayer,cashEarn,"Thắng Sâm");
        logMessage("updateMoneyWhenDenXam card lost "+cashLost+" cashEarn "+cashEarn);
    },
    netWorkProcessDiscardCard: function () {
        var onhand = this.getOnHandCard(this.getMyClientState());
        var Packet;
        if(onhand != null && onhand.length == 1) // Special case, auto discard if player has only 1 card onhand.
        {
            if (this.isNewTurn && this.currentDiscardSuite != null)
            {
                this.currentDiscardSuite = null;
            }
            if(this.isabletoWin(onhand, this.currentDiscardSuite))
            {
                Packet = new BkPacket();
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
        if (!this.isabletoWin(selectedCards, this.currentDiscardSuite)) {
            showToastMessage(BkConstString.STR_INVALID_DISCARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }
        Packet = new BkPacket();
        Packet.CreateDiscardCards(selectedCards);
        BkConnectionManager.send(Packet);
    },
    processDiscard: function () {
        playClickSound();
        var Packet = new BkPacket();
        Packet.CreateDiscardAction();
        BkConnectionManager.send(Packet);
    },
    getSmartSuggestedCards: function (discardSuite, onhandCardSuite, selectedCard) {
        logMessage("SAM getsmartsuggestCard:");
        if (discardSuite != null && discardSuite.length > 0) // in a turn
        {
            for(var j = 0; j < discardSuite.length; j++)
            {
                if(discardSuite[j] instanceof  BkCard)
                {
                    logMessage("card " + j + " OK");
                }else
                {
                    logMessage("card " + j + "is not instance of BKCard");
                }
            }
            var currentSelectedCard = getSelectedCard(onhandCardSuite);
            if (this.isabletoWin(currentSelectedCard, discardSuite)) {
                return currentSelectedCard;
            }
            //ended
            if (isRac(discardSuite)) {
                if (isRac2(discardSuite))
                {
                    {
                        return findTuQuy(selectedCard, onhandCardSuite);
                    }
                }
                return findRac(selectedCard);
            }
            if (isDoi(discardSuite)) {
                if (isDoi2(discardSuite)) {
                    return null;
                }
                return findSmallestDoi(selectedCard, onhandCardSuite);
            }
            if (isBa(discardSuite))
            {
                return findBa(selectedCard, onhandCardSuite);
            }
            if (isTuQuy(discardSuite)) {
                return findTuQuy(selectedCard, onhandCardSuite);
            }
            if (BkSamCardUtil.isSanh(discardSuite))
            {
                var rtnSanh = BkSamCardUtil.findBiggestSanh(selectedCard,null, discardSuite.length, onhandCardSuite);
                if (rtnSanh != null && getCardIndex(selectedCard.id, rtnSanh) != -1)
                {
                    return rtnSanh;
                }
                return null;
            }
        }
        return null;
    },
    getSmartSuggestNewturn: function (onhandCardSuite, selectedList) {
        if (selectedList.length != 2) {
            return null;
        }
        var firstselectedCard = selectedList[0];
        var secondSelectedCard = selectedList[1];
        if (isDoi(selectedList))
        {
            if (findTuQuy(secondSelectedCard, onhandCardSuite) != null) {
                return findTuQuy(secondSelectedCard, onhandCardSuite);
            }
            if (findBa(secondSelectedCard, onhandCardSuite) != null) {
                return findBa(secondSelectedCard, onhandCardSuite);
            }
            return findSmallestDoi(secondSelectedCard, onhandCardSuite);
        }

        var Sanh = [];
            for (var sanhCount = onhandCardSuite.length; sanhCount >= 3; sanhCount--)
            {
                Sanh = BkSamCardUtil.findBiggestSanh(firstselectedCard, secondSelectedCard,sanhCount, onhandCardSuite);
                if (Sanh != null && isContain(firstselectedCard, Sanh) && isContain(secondSelectedCard, Sanh)) {
                    return Sanh;
                }
            }
        return null;
    },

    isMustLeaveTurn: function () {
        logMessage("ismust leave turn:");
        var onhand = this.getOnHandCard(this.getMyClientState());
        var onhandCard = onhand.slice();
        var currentDiscard = this.currentDiscardSuite;
        if (currentDiscard == null || currentDiscard.length == 0) {
            return false;
        }
        for(var j = 0; j < currentDiscard.length; j++)
        {
            if(currentDiscard[j] instanceof  BkCard)
            {
                logMessage("card " + j + " OK");
            }else
            {
                logMessage("card " + j + "is not instance of BKCard");
            }
        }
        for (var i = 0; i < onhandCard.length; i++){
            var cardi = onhandCard[i];
            var suggestedList = this.getSmartSuggestedCards(currentDiscard, onhandCard, cardi);
            if (suggestedList != null && suggestedList.length != 0) {
                if (this.isabletoWin(suggestedList, currentDiscard)) {
                    return false; //co kha nang thang
                }
            }
        }
        return true;
    },

    isabletoWin: function(NewSuggestedCard, currentDiscard)
    {
        if (!isRac(NewSuggestedCard) && !isDoi(NewSuggestedCard) && !isBa(NewSuggestedCard) && !isTuQuy(NewSuggestedCard) && !BkSamCardUtil.isSanh(NewSuggestedCard)) {
            return false;
        }
        if ((currentDiscard == null || currentDiscard.length == 0) && (NewSuggestedCard != null && NewSuggestedCard.length > 0))
        {
            return true;
        }
        if (isRac2(currentDiscard))
        {
            return isTuQuy(NewSuggestedCard);
        }
        if (isDoi2(currentDiscard)|| isBa2(currentDiscard) || isTuQuy2(currentDiscard))
        {
                return false;
        }
        if((isRac(currentDiscard)&& isRac2(NewSuggestedCard)) || (isDoi(currentDiscard) && isDoi2(NewSuggestedCard)) || (isBa(currentDiscard)  && isBa2(NewSuggestedCard))|| (isTuQuy(currentDiscard) && isTuQuy2(NewSuggestedCard)))
        {
            return true;
        }
        if (currentDiscard.length != NewSuggestedCard.length)
        {
            return false;
        }
        var SuggestedlastCardNumber = NewSuggestedCard[NewSuggestedCard.length - 1].number;
        var DiscardLastCardNumber = currentDiscard[currentDiscard.length - 1].number;

        if (DiscardLastCardNumber == 1)
        {
            DiscardLastCardNumber = DiscardLastCardNumber + 13;
        }
        if (SuggestedlastCardNumber == 1)
        {
            SuggestedlastCardNumber = SuggestedlastCardNumber + 13;
        }
        if(SuggestedlastCardNumber == 2 && DiscardLastCardNumber == 2)
        {
            var secondlastSuggestedCardNumber = NewSuggestedCard[NewSuggestedCard.length - 2].number;
            var secondlastDisCardNumber = currentDiscard[currentDiscard.length - 2].number;
            return(secondlastSuggestedCardNumber > secondlastDisCardNumber);
        }
        return (SuggestedlastCardNumber > DiscardLastCardNumber);
    },
    getPunishExitDuringGameMoney:function()
    {
        logMessage("BkSAMIngameLogic getPunishExitDuringGameMoney");
        return this.moneyLogic.cashChangeWhenLeaveDuringGame(this.getTableBetMoney(),this.numberOfPlayingPlayer);
    },
    netWorkBaoSam:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_BAO_XAM,1);
        BkConnectionManager.send(Packet);
    },
    netWorkKhongBaoSam:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_BAO_XAM,0);
        BkConnectionManager.send(Packet);
    },
    shouldShowButtonSort:function()
    {
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
        this.getGameLayer().hideSortButton();
    },
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_BAO_XAM_RETURN:
            case c.NETWORK_DISCARD_PUSH:
            case c.NETWORK_FINISH_GAME_RETURN:
                return true;
        }
        return this._super(eventType);
    },
    /*
    *
    * */
    processNetworkEvent:function(packet){
        logMessage("BkSAMIngameLogic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_BAO_XAM_RETURN:
                this.processBaoSam(packet);
                break;
            case c.NETWORK_DISCARD_PUSH:
                logMessage("NETWORK_DISCARD_PUSH -> pneiq");
                this.processDiscardPush(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet);
                break;
            //case c.NETWORK_LEAVE_DURING_GAME:
            //    this.processLeaveDurringGame(packet);
            //    break;
            default:{
                logMessage("BkSAMIngameLogic not process packet with type: "+packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});