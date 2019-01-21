/**
 * Created by bs on 09/12/2015.
 */
BkPhomIngameLogic = BkInGameLogic.extend({
    //firstFinishPlayer:-1,
    pickCount:-1,
    currentDiscard:null,
    firstFinishPlayer:0,
    hasSendedCard:false,
    isAutoSend:false,
    isSendMultiCard:false,
    listSendMultiCard:null,
    currentIndexSendInList:0,
    listSendFlag:null,
    currentPlayer:null,
    currentIndex:0,
    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.PHOM);
        this.moneyLogic = new BkPhomMoneyLogic();
    },
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_TABLE_LEAVE_PUSH:
            case c.NETWORK_TABLE_JOIN_PUSH:
            case c.NETWORK_KICK_PLAYER_PUSH:

            case c.NETWORK_DISCARD_PUSH:
            case c.NETWORK_PICK_CARD_RETURN:
            case c.NETWORK_PICK_CARD_PUSH:
            case c.NETWORK_SHOW_PHOM_RETURN:
            case c.NETWORK_TAKE_CARD_PUSH:

            case c.NETWORK_SHOW_U_PUSH:
            case c.NETWORK_SEND_CARD_RETURN:
            case c.NETWORK_FINISH_GAME_RETURN:
            case c.NETWORK_DEAL_CARD_RETURN:
                return true;
        }
        return this._super(eventType);
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
    getPunishExitDuringGameMoney:function()
    {
        return this.moneyLogic.cashChangeWhenLeaveDuringGame(this.getTableBetMoney(),this.numberOfPlayingPlayer);
    },
    processGameTableSyn:function(packet){
        this._super(packet);
        if (!this.isInGameProgress()) {
            logMessage("processGameTableSyn -> clear gui");
            this.getGameLayer().hideAllOngameCustomButton();
            this.getGameLayer().clearAllImgCardCount();
            return;
        }

        this.activePlayerPosition = packet.Buffer.readByte();
        this.firstFinishPlayer = packet.Buffer.readByte();
        this.pickCount = packet.Buffer.readByte();
        //this.currentDiscard = decode(packet.Buffer.readByte());
        var curentCardID = packet.Buffer.readByte();
        this.numberOfPlayingPlayer = 0;
        while(packet.Buffer.isReadable()){
            var playerPosition = packet.Buffer.readByte();
            this.numberOfPlayingPlayer++;
            logMessage("palyer "+this.numberOfPlayingPlayer+" playerPosition "+playerPosition +" myPos "+this.getMyPos());

            var player = this.getPlayer(playerPosition);
            player.isPlaying = true;
            player.currentBestPoint = 1000;
            var discardList = [];
            var i= 0;
            var card;
            var discardCount = packet.Buffer.readByte();
            logMessage("discardCount "+discardCount);
            for (i=0;i<discardCount;i++){
                card = decode(packet.Buffer.readByte());
                card.setSelectable(false);
                if (card.encode() == curentCardID){
                    this.currentDiscard = card;
                    this.currentDiscard.playerHasCard = player;
                    this.currentDiscard.setCardStatus(CARD_STATUS_CURRENT);
                }
                discardList.push(card);
            }
            player.setDisCardList(discardList);

            var phomList = [];
            var phomCount = packet.Buffer.readByte();
            logMessage("phomCount "+phomCount);
            for (i=0;i<phomCount;i++){
                card = decode(packet.Buffer.readByte());
                card.setSelectable(false);
                card.phomIndex = packet.Buffer.readByte();
                phomList.push(card);
            }
            player.setPhomList(phomList);

            var takenList = [];
            if (phomCount == 0){
                var takenCount = packet.Buffer.readByte();
                player.takenCardsCount = takenCount;
                logMessage("takenCount "+takenCount);
                for (i=0;i<takenCount;i++){
                    card = decode(packet.Buffer.readByte());
                    card.setSelectable(false);
                    takenList.push(card);
                }
                player.setTakenList(takenList);
            }

            if (playerPosition == this.getMyPos()){
                var handList = [];
                var handCount = packet.Buffer.readByte();
                logMessage("handCount "+handCount);
                for (i=0;i<handCount;i++){
                    card = decode(packet.Buffer.readByte());
                    card.setSelectable(true);
                    handList.push(card);
                    this.getGameLayer().addChild(card);
                }
                player.setOnhandCard(handList);
            }
        }

        this.getGameLayer().onTableSynReturn();
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
    },
    ableToSendListCardWithPhom:function(list,phom){
        logMessage("ableToSendListCardWithPhom ");
        logListCard(list);
        logListCard(phom);
        var me = this.getMyClientState();
        if (!me.havePhoms()){
            logMessage(" toi khong co phom -> k duoc gui");
            return false;
        }
        if (phom.length <3){
            logMessage("phom length <3");
            return false;
        }
        var i;
        for (i = 0;i<list.length;i++){
            phom.push(list[i]);
        }
        var rtn = findBestPhomCard.isPhomOrCa(phom);
        for (i = 0;i<list.length;i++){
            phom.pop();
        }
        logMessage("rtn "+rtn);
        return rtn;
    },
    sendMultiCard:function(indexInList,player,phomIndex){
        logMessage("sendMultiCard "+indexInList);
        for (var i=0;i<this.listSendMultiCard.length;i++){
            if (!this.listSendFlag[i]){
                logMessage("chua send card "+i);
                var ca = this.listSendMultiCard[i];
                if (this.ableToSendCard(ca,player,phomIndex)){
                    logMessage("can send card "+ca.encode());
                    this.listSendFlag[i] = true;
                    this.sendPacketSendCard(ca,player.serverPosition,phomIndex);
                }
            }
        }
    },
    onclickButtonGuiWithPhomindexAndPlayer:function(player,phomIndex){
        logMessage("onclickButtonGuiWithPhomindexAndPlayer "+player.getName()+" phomIndex: "+phomIndex);
        this.isSendMultiCard = false;
        this.listSendMultiCard = [];
        this.currentPlayer = null;
        this.currentIndex = 0;
        var selectCard = getSelectedCard(this.getMyClientState().getOnHandCard());
        if (selectCard.length == 1){
            var ca = selectCard[0];
            if (this.ableToSendCard(ca,player,phomIndex)){
                this.sendPacketSendCard(ca,player.serverPosition,phomIndex);
            } else {
                showToastMessage(BkConstString.STR_INVALID_GUI, cc.winSize.width / 2, cc.winSize.height / 2,3,200);
            }
        } else if (selectCard.length>1){
            var phomList = player.getPhomList();
            var listPhomWithIndex = [];
            for (var i=0;i<phomList.length;i++){
                var iC = phomList[i];
                if (iC.phomIndex == phomIndex){
                    listPhomWithIndex.push(iC);
                }
            }
            if (this.ableToSendListCardWithPhom(selectCard,listPhomWithIndex)){
                this.isSendMultiCard = true;
                this.listSendMultiCard = selectCard;
                this.listSendFlag = [];
                for (var j=0;j<selectCard.length;j++){
                    this.listSendFlag[j] = false;
                }
                this.currentIndexSendInList = 0;
                this.currentPlayer = player;
                this.currentIndex = phomIndex;
                this.sendMultiCard(0,player,phomIndex);
            } else {
                showToastMessage(BkConstString.STR_INVALID_GUI, cc.winSize.width / 2, cc.winSize.height / 2,3,200);
            }
        }
    },
    sendPacketSendCard:function(ca,receivedPlayerPosition,receivedPhomIndex){
        logMessage("sendPacketSendCard : ["+ca.encode()+" - "+receivedPlayerPosition+" - "+receivedPhomIndex+" ]");
        var Packet = new BkPacket();
        Packet.createSendCardPacket(ca,receivedPlayerPosition,receivedPhomIndex);
        BkConnectionManager.send(Packet);
    },
    autoSend:function(){
        logMessage("autoSend");
        this.isAutoSend = true;
        var onhand = this.getMyClientState().getOnHandCard();
        var i, j,k;
        var iCard;
        var jPlayer;
        // yeu tien gui cac phom doc truoc
        for (i=0;i<onhand.length;i++){
            iCard = onhand[i];
            if (iCard.phomIndex == 0){
                for (j=0;j<this.maxPlayer;j++){
                    jPlayer = this.getPlayer(j);
                    if ((jPlayer != null) && (jPlayer.isPlaying)){
                        for (k=1;k<3;k++){
                            if (!jPlayer.isPhomNgang(k)){
                                if (this.ableToSendCard(iCard,jPlayer,k)){
                                    this.sendPacketSendCard(iCard,jPlayer.serverPosition,k);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }

        // sau khi gui het phom doc thi gui phom ngang
        for (i=0;i<onhand.length;i++){
            iCard = onhand[i];
            if (iCard.phomIndex == 0){
                for (j=0;j<this.maxPlayer;j++){
                    jPlayer = this.getPlayer(j);
                    if ((jPlayer != null) && (jPlayer.isPlaying)){
                        for (k=1;k<3;k++){
                            if (jPlayer.isPhomNgang(k)){
                                if (this.ableToSendCard(iCard,jPlayer,k)){
                                    this.sendPacketSendCard(iCard,jPlayer.serverPosition,k);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }

    },
    precessAfterSendCard:function(){
        logMessage("precessAfterSendCard");
        var onhand = this.getMyClientState().getOnHandCard();
        if (onhand.length <=1){
            // gui het bai -> send u
            this.sendShowUPacket();
        } else {
            if (this.isAutoSend){
                logMessage("isAutoSend");
                this.autoSend();
                this.hasSendedCard = false;
            } else {
                logMessage("not isAutoSend");
                if (this.isSendMultiCard){
                    this.currentIndexSendInList++;
                    logMessage("isSendMultiCard :" + this.currentIndexSendInList);
                    this.sendMultiCard(this.currentIndexSendInList,this.currentPlayer,this.currentIndex);
                }else {
                    this.hasSendedCard = this.recommendSendedCard();
                    logMessage("hasSendedCard " + this.hasSendedCard);
                    this.getGameLayer().showOngameCustomButton();
                }
            }
        }
    },
    resetData:function(){
        this.gameStatus = GAME_STATE_PHOM_WAIT_DISCARD;
        this.isAutoSend= false;
        this.hasSendedCard = false;
        this.pickCount = 1;
        this.isSendMultiCard = false;

        for (var i= 0;i<this.maxPlayer;i++){
            var iplayer = this.getPlayer(i);
            if (iplayer!= null){
                iplayer.takenCardsCount = 0;
                iplayer.currentBestPoint = 1000;
                iplayer.playerPoint = -1;
            }
        }
    },
    processDealCardReturn:function(packet){
        this._super();
        this.resetData();
        var cardSuite = [];
        this.activePlayerPosition = packet.Buffer.readByte();
        logMessage("processDealCardReturn "+this.activePlayerPosition);
        // set lai ng ha dau la active player dau tien
        this.firstFinishPlayer = this.getActivePlayerPos();

        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.initCardBackMask();
            card.visible = false;
            cardSuite.push(card);
        }

        this.getMyClientState().setOnhandCard(cardSuite);
        this.getMyClientState().sortOnhandCardAfterPickOrTake();
        for (var i = 0; i < this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            if (playeri != null) {
                playeri.isPlaying = true;
                playeri.setRank(-1);
                if (playeri.serverPosition != this.activePlayerPosition){
                    playeri.setCardsCount(9);
                } else {
                    playeri.setCardsCount(10);
                }
                this.numberOfPlayingPlayer++;
            }
        }
        this.getGameLayer().onDealCardReturn();
    },
    onTakeCard:function(){
        if (!this.isValidGameTableWhenReceiveTakeCard()){
            this.networkGetTableInfo();
            return;
        }

        this.getGameLayer().onTakeCard();
    },
    processPlayerDiscard:function(packet){

        var card = decode(packet.Buffer.readByte());
        if (!this.isValidGameTableWhenReceiveDiscard(card.number,card.type)){
            this.networkGetTableInfo();
            return;
        }
        this.getGameLayer().onDiscard(card);
    },
    processPickCardReturn:function(packet){
        // la minh pick card
        var card = decode(packet.Buffer.readByte());
        if (!this.isValidGameTableWhenReceivePickCard(card.number,card.type)){
            this.networkGetTableInfo();
            return;
        }

        this.getGameLayer().onPickCard(card);
    },
    processPickCard:function(packet){
        this.getGameLayer().onPickCard(null);
    },
    processShowPhom:function(packet){
        if (!this.isValidGameTableWhenReceiveShowphom()){
            this.networkGetTableInfo();
            return;
        }
        var phomList = [];
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.phomIndex = packet.Buffer.readByte();
            phomList.push(card);
        }
        this.getGameLayer().onShowPhom(phomList);
        logMessage("player da show phom -> wait discard");
        this.gameStatus = GAME_STATE_PHOM_WAIT_DISCARD;
    },
    isValidGameTableWhenReceiveDiscard:function(number, type) {
        if (this.gameStatus != GAME_STATE_PHOM_WAIT_DISCARD) {
            return false;
        }
        if (this.isMyTurn()) {
            var onhand = this.getMyClientState().getOnHandCard();
            if (findCard(number, type,onhand) == null){
                return false;
            }
        }
        return true;
    },
    isValidGameTableWhenReceivePickCard:function( number,  type) {
        if (this.gameStatus != GAME_STATE_PHOM_WAIT_TAKE_OR_PICK_CARD) {
            return false;
        }
        if (this.isMyTurn() && (number < 0)) {
            return false;
        }
        if (!this.isMyTurn() && (number >= 0)) {
            return false;
        }
        return true;
    },
    isValidGameTableWhenReceiveTakeCard:function() {
        if (this.gameStatus != GAME_STATE_PHOM_WAIT_TAKE_OR_PICK_CARD) {
            return false;
        }
        if (this.currentDiscard == null) {
            return false;
        }
        return true;
    },
    isValidGameTableWhenReceiveShowphom:function() {
        if (this.gameStatus != GAME_STATE_WAIT_SHOW_PHOM) {
            return false;
        }
        return true;
    },
    updateGameStatusAfterPickOrTakeCard:function() {
        if (this.pickCount <= this.numberOfPlayingPlayer * 3) {
            this.gameStatus = GAME_STATE_PHOM_WAIT_DISCARD;
        } else {
            this.gameStatus = GAME_STATE_WAIT_SHOW_PHOM;
        }
    },
    updateStateAfterPickCard:function() {
        this.pickCount++;
    },
    updateStateAfterTakeCard:function() {
        this.getActivePlayer().takenCardsCount++;
    },
    updateGameStatusAfterDiscard:function() {
        if (this.pickCount < this.numberOfPlayingPlayer * 4) {
            this.gameStatus = GAME_STATE_PHOM_WAIT_TAKE_OR_PICK_CARD;
        }
        else {
            this.gameStatus = GAME_STATE_FINISH;
        }
    },
    updateGameStatusAfterFinishGame:function() {
        this.gameStatus = GAME_STATE_FINISH;
    },
    updateFirstFinishPlayerAfterTakeCard:function() {
        logMessage("ng ha dau hien tai " + this.firstFinishPlayer +" name "+ this.getPlayer(this.firstFinishPlayer).getName());
        this.firstFinishPlayer = this.nextReadyPosition(this.firstFinishPlayer);
        logMessage("ng ha dau sau update  "+ this.firstFinishPlayer +" name " + this.getPlayer(this.firstFinishPlayer).getName());
    },
    isLastTakeCard:function(){
        if (this.pickCount >= this.numberOfPlayingPlayer * 3) {
            return true;
        }
        return false;
    },
    updatePlayersMoneyAfterTakeCard:function(){
        logMessage("updatePlayersMoneyAfterTakeCard");
        var lostMoneyPlayer = this.currentDiscard.playerHasCard;
        var activePlayer = this.getActivePlayer();
        var numberTakenCard = 0;
        //if (activePlayer.getTakenList() != null){
        //    numberTakenCard = activePlayer.getTakenList().length;
        //}
        numberTakenCard = activePlayer.takenCardsCount;
        var lostMoney = -numberTakenCard * this.getTableBetMoney();
        var isAnChot = this.isLastTakeCard();
        var str = "Ăn";
        if (isAnChot){
            str = "Ăn chốt";
            lostMoney = -this.moneyLogic.LAST_CARD_LOSS_RATE * this.getTableBetMoney();
        }

        logMessage("lostMoneyPlayer "+lostMoneyPlayer.getName()," activePlayer "+activePlayer.getName()
            +" numberTakenCard: "+numberTakenCard+" lostMoney "+lostMoney);

        var EarnMoney = Math.floor(-lostMoney*(1-TAX_RATE));
        this.increaseCash(lostMoneyPlayer,lostMoney,"Bị Ăn");
        this.increaseCash(activePlayer,EarnMoney,str);
    },
    isAllPlayerFinishGame:function(){
        for (var i=0;i<this.maxPlayer;i++){
            var iPlayer = this.getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying) && (iPlayer.playerPoint == -1)){
                return false;
            }
        }
        return true;
    },
    isShowFirst:function(needCheckPosition,comparePosition){
        if ( ((needCheckPosition - this.firstFinishPlayer + 4) % 4) <
            ((comparePosition - this.firstFinishPlayer + 4) % 4) ) {
            return true;
        }
        return false;
    },
    getPlayersRank:function(iserverPos){
        var posPlayer = this.getPlayer(iserverPos);
        var rank = 0;
        for (var i = 0; i < this.maxPlayer; i++) {
            var iPlayer = this.getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying) && (i != iserverPos)) {
                if (iPlayer.playerPoint < posPlayer.playerPoint) {
                    rank++;
                }
                else if (iPlayer.playerPoint == posPlayer.playerPoint) {
                    if (this.isShowFirst(i, iserverPos)) {
                        rank++;
                    }
                }
            }
        }
        logMessage("player: "+posPlayer.getName()+" point: "+posPlayer.playerPoint+" rank: "+rank);
        return rank;
    },
    getCashLostWhenLose:function(iserverPos){
        var playerPos = this.getPlayer(iserverPos);
        if (playerPos.isMom()) {
            return this.moneyLogic.cashLostWhenMom(this.tableBetMoney);
        }
        else {
            return this.moneyLogic.cashLostWhenLose(this.tableBetMoney, playerPos.getRank());
        }
    },
    updateMonetAfterFinsihGame:function(){
        logMessage("updateMonetAfterFinsihGame");
        var winPosition = 0;
        var cashLost;
        var cashEarn = 0;
        for (var i = 0; i < this.maxPlayer; i++) {
            var iPlayer = this.getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying)) {
                iPlayer.setRank(this.getPlayersRank(i));
                if (iPlayer.getRank() > 0) {
                    cashLost = this.getCashLostWhenLose(i);
                    cashLost = Math.max(cashLost, -iPlayer.getCurrentCash());
                    cashEarn -= cashLost;
                    logMessage("player lost: "+iPlayer.getName()+" cashLost: "+cashLost +" rank: "+iPlayer.getRank());
                    this.increaseCash(iPlayer,cashLost);
                }
                else {
                    winPosition = i;
                }
            }
        }
        cashEarn = Math.floor(cashEarn * (1 - TAX_RATE));
        this.increaseCash(this.getPlayer(winPosition),cashEarn);
        logMessage("player win: "+this.getPlayer(winPosition).getName()+" cashEarn: "+cashEarn);
    },
    showAllSplash:function(){
        logMessage("showAllSplash");
        for (var i = 0; i < this.maxPlayer; i++) {
            var iPlayer = this.getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying)) {
                if (!iPlayer.isMom()){
                    this.getGameLayer().showRankSplash(iPlayer.serverPosition,iPlayer.getRank());
                } else {
                    var pAvar = this.getGameLayer().getAvatarByServerPos(iPlayer.serverPosition);
                    pAvar.showMom();
                }
            }
        }
    },
    processFinishGame: function (packet) {
        this._super();
        var finishPlayerPosition = packet.Buffer.readByte();
        var fnPlayer = this.getPlayer(finishPlayerPosition);
        logMessage("processFinishGame with player "+fnPlayer.getName());
        var cardList = [];
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            cardList.push(card);
        }
        if (finishPlayerPosition!= this.getMyPos()) {
            // neu k la minh thi set lai list on hand
            fnPlayer.setOnhandCard(cardList);
        }
        this.getGameLayer().showListCardFinish(finishPlayerPosition,cardList);
        fnPlayer.playerPoint = fnPlayer.calculatePoint(cardList);
        logMessage("player point "+fnPlayer.playerPoint);
        if (this.isAllPlayerFinishGame()){
            // tat ca player finish game -> tinh tien het van hien thi rank
            logMessage("allplayer finish");
            this.updateMonetAfterFinsihGame();
            this.showAllSplash();
            this.getGameLayer().hideAllOngameCustomButton();
            this.getGameLayer().resetAllPlayerAvatar();
            //if (this.currentDiscard != null){
            //    this.currentDiscard.setScale(PHOM_CARD_SCALE_INGAME);
            //}
        }

        this.processNextEventInQueue();
    },
    isNeedShowPhom:function(){
        if ((this.isMyTurn()) && (this.gameStatus == GAME_STATE_WAIT_SHOW_PHOM)){
            return true;
        }
      return false;
    },
    processSendCard:function(packet){
        var sendCard = decode(packet.Buffer.readByte());
        var userReceiveCard = packet.Buffer.readByte();
        var phomReceiveCard = packet.Buffer.readByte();
        this.getGameLayer().onSendCard(sendCard,userReceiveCard,phomReceiveCard);
    },
    ableToTakeCard:function(){
      return this.getMyClientState().ableToTakeCard(this.currentDiscard);
    },
    onTakeCardClick:function(){
        logMessage("onTakeCardClick");
        if (this.ableToTakeCard()){
            var Packet = new BkPacket();
            Packet.CreatePacketWithOnlyType(c.NETWORK_TAKE_CARD);
            BkConnectionManager.send(Packet);
        } else{
            showToastMessage(BkConstString.STR_INVALID_AN, cc.winSize.width / 2, cc.winSize.height / 2)
        }
    },
    onPickCardClick:function(){
        logMessage("onPickCardClick");
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_PICK_CARD);
        BkConnectionManager.send(Packet);
    },
    onDiscardCardClick:function(){
        logMessage("onDiscardCardClick");
        var onhand = getSelectedCard(this.getOnHandCard(this.getMyClientState()));
        var selectedCards = getSelectedCard(onhand);
        if (selectedCards == null || selectedCards.length == 0) {
            showToastMessage(BkConstString.STR_NOT_SELECT_CARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }

        if (selectedCards.length>1){
            showToastMessage(BkConstString.STR_INVALID_DISCARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }
        var dcCard = selectedCards[0];

        if (dcCard.cardUIStatus == CARD_STATUS_TAKEN){
            showToastMessage(BkConstString.STR_INVALID_DISCARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }

        if (!this.getMyClientState().ableToDiscard(dcCard)){
            showToastMessage(BkConstString.STR_INVALID_DISCARD, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }

        logMessage("send discard: "+dcCard.id);
        var Packet = new BkPacket();
        Packet.CreateDiscardCards(selectedCards);
        BkConnectionManager.send(Packet);
    },
    onUClick:function(){
        logMessage("onUClick");
        if (this.getMyClientState().canU()){
            this.sendShowUPacket();
        } else{
            showToastMessage(BkConstString.STR_INVALID_U, cc.winSize.width / 2, cc.winSize.height / 2);
        }

    },
    onShowPhomClick:function(){
        logMessage("onShowPhomClick");
        var self = this;
        var onhand = this.getOnHandCard(this.getMyClientState());
        var selectedCards = getSelectedCard(onhand);
        if (selectedCards.length < 3){
            showToastMessage(BkConstString.STR_INVALID_SHOW_PHOM, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }

        logMessage("kiem tra cac cay an co o trong phom k");
        var allTakenCardInPhomHa = true;
        var i;
        for (i=0;i<onhand.length;i++){
            if (onhand[i].cardUIStatus == CARD_STATUS_TAKEN){
                logMessage("find card: "+onhand[i].id+" trong list select");
                var iCard = findCard(onhand[i].getNumber(),onhand[i].getType(),selectedCards);
                if (iCard == null){
                    allTakenCardInPhomHa = false;
                    break;
                }
            }
        }
        logMessage("allTakenCardInPhomHa: "+allTakenCardInPhomHa);
        if (!allTakenCardInPhomHa){
            showToastMessage(BkConstString.STR_INVALID_SHOW_PHOM_TAKEN, cc.winSize.width / 2, cc.winSize.height / 2);
            return;
        }

        findBestPhomCard.findWithData(selectedCards,function(){
            selectedCards = findBestPhomCard.listFind;
            var allcardInPhom = true;
            for (i=0;i<selectedCards.length;i++){
                if (selectedCards[i].phomIndex == 0){
                    allcardInPhom = false;
                }
            }
            var maxPhomIndex = self.getMyClientState().getMaxPhomIndexInPhomList();
            logMessage("maxPhomIndex "+maxPhomIndex);
            if (maxPhomIndex >0){
                logMessage("minh da co phom -> update phom index trong list onhand maxPhomIndex:"+maxPhomIndex);
                for (i=0;i<selectedCards.length;i++){
                    if (selectedCards[i].phomIndex != 0){
                        selectedCards[i].phomIndex += maxPhomIndex;
                    }
                }
            }
            logListCard(selectedCards);
            logMessage("allcardInPhom "+allcardInPhom);

            if (allcardInPhom){
                self.sendShowPhomPacket();
            } else {
                showToastMessage(BkConstString.STR_INVALID_SHOW_PHOM, cc.winSize.width / 2, cc.winSize.height / 2);
            }
        });
    },
    sendShowPhomPacket:function(){
        var onhand = this.getOnHandCard(this.getMyClientState());
        var selectedCards = getSelectedCard(onhand);
        if ((onhand.length - selectedCards.length) <= 1){
            logMessage("onhand.length: "+onhand.length+" selectedCards.length: "+selectedCards.length +" -> isU -> send U");
            this.sendShowUPacket();
            return;
        }
        var Packet = new BkPacket();
        Packet.createShowPhomPacket(selectedCards);
        BkConnectionManager.send(Packet);
    },
    sendShowUPacket:function(){
        logMessage("sendShowUPacket");
        var onhand = this.getOnHandCard(this.getMyClientState());
        var self = this;
        var maxPhomIndex = self.getMyClientState().getMaxPhomIndexInPhomList();
        logMessage("maxPhomIndex "+maxPhomIndex);
        if (maxPhomIndex >0){
            logMessage("minh da co phom -> update phom index trong list onhand maxPhomIndex:"+maxPhomIndex);
            for (var i=0;i<onhand.length;i++){
                if (onhand[i].phomIndex != 0){
                    onhand[i].phomIndex += maxPhomIndex;
                }
            }
        }
        logListCard(onhand);
        var Packet = new BkPacket();
        Packet.createShowUPacket(onhand);
        BkConnectionManager.send(Packet);
    },
    clearPlayerCard:function (player)
    {
        logMessage("clearPlayerCard phom logic");
        if(player != null)
        {
            player.removeOnhandCard();
            player.removeDisCardList();
            player.removePhomList();
            player.removeTakenList();
            player.removeListBtnGui();
            this.getGameLayer().clearImgCardCount(player);
        }
    },
    processShowU:function(packet){
        var playerPosition = packet.Buffer.readByte();
        var denPlayerPosition = packet.Buffer.readByte();
        var cardSuite = [];
        while (packet.Buffer.isReadable())
        {
            var card = decode(packet.Buffer.readByte());
            card.phomIndex = packet.Buffer.readByte();
            cardSuite.push(card);
        }
        this.updateMoneyAfterU(playerPosition,denPlayerPosition);
        this.getGameLayer().onShowU(playerPosition,denPlayerPosition,cardSuite);

        //this.processNextEventInQueue();
    },
    updatePlayersMoneyAfterUDen:function(playerPosition,denPlayerPosition){
        var cashLost = this.moneyLogic.cashLostWhenUDen(this.tableBetMoney, this.numberOfPlayingPlayer);
        cashLost = Math.max(cashLost, -this.getPlayer(denPlayerPosition).getCurrentCash());
        var cashEarn = Math.floor(-cashLost * (1 - TAX_RATE));
        this.increaseCash(this.getPlayer(playerPosition),cashEarn,"Ù");
        this.increaseCash(this.getPlayer(denPlayerPosition),cashLost,"Đền làng");
    },
    updatePlayersMoneyAfterU:function(playerPosition){
        var cashEarn = 0;
        for (var i = 0; i < this.maxPlayer; i++) {
            var iPlayer = this.getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying) && (i != playerPosition)) {
                var cashLost = this.moneyLogic.cashLostWhenU(this.tableBetMoney);
                cashLost = Math.max(cashLost, -iPlayer.getCurrentCash());
                this.increaseCash(iPlayer,cashLost);
                cashEarn -= cashLost;
            }
        }
        cashEarn = Math.floor(cashEarn * (1 - TAX_RATE));
        this.increaseCash(this.getPlayer(playerPosition),cashEarn,"Ù");
    },
    updateMoneyAfterU:function(playerPosition,denPlayerPosition){
        if (denPlayerPosition != -1) {
            this.updatePlayersMoneyAfterUDen(playerPosition, denPlayerPosition);
            return;
        }
        this.updatePlayersMoneyAfterU(playerPosition);
    },
    updateCurrentCard:function(card){
        this.currentDiscard = card;
        this.currentDiscard.setCardStatus(CARD_STATUS_CURRENT);
        this.currentDiscard.playerHasCard = this.getActivePlayer();
        if (card != null){
            logMessage("update currentDiscard -> "+card.id);
            logMessage("this.getNocCount(): "+this.getNocCount());
            if (this.getNocCount() == 0){
                logMessage("Noc == 0 -> la ng danh cuoi cung -> k scale");
                if (this.currentDiscard != null){
                    this.currentDiscard.setScale(PHOM_CARD_SCALE_INGAME);
                }
            }
        } else {
            logMessage("update currentDiscard -> null");
        }
    },
    ableToSendCardWithPhom:function(iCard,phom){
        //logMessage("ableToSendCardWithPhom ");
        //logListCard(phom);
        var me = this.getMyClientState();
        if (!me.havePhoms()){
            //logMessage(" toi khong co phom -> k duoc gui");
            return false;
        }
        if (phom.length <3){
            //logMessage("phom length <3");
            return false;
        }
        phom.push(iCard);
        var rtn = findBestPhomCard.isPhomOrCa(phom);
        phom.pop();
        //logMessage("rtn "+rtn);
        return rtn;
    },
    ableToSendCard:function(iCard,player,receivedPhomIndex){
        //logMessage("ableToSendCard "+iCard.encode()+" player "+player.getName());
        var phomList = player.getPhomList();
        var listPhomWithIndex = [];
        for (var i=0;i<phomList.length;i++){
            var iC = phomList[i];
            if (iC.phomIndex == receivedPhomIndex){
                listPhomWithIndex.push(iC);
            }
        }
        //logListCard(listPhomWithIndex);
        return this.ableToSendCardWithPhom(iCard,listPhomWithIndex);
    },
    recommendSendedCard:function(){
        logMessage("recommendSendedCard "+BkTime.GetCurrentTime());
        var hasSendedCard = false;
        var onhand = this.getMyClientState().getOnHandCard();
        logMessage("bai tren tay hien tai");
        // reset tat ca phomIndex bai tren tay sau khi ha
        for (var i1=0;i1<onhand.length;i1++){
            onhand[i1].phomIndex = 0;
        }
        logListCard(onhand);
        var i,j,k;
        var iCard;
        var jPlayer;

        var listCanSend = [];
        for (i=0;i<onhand.length;i++){
            listCanSend[i] = false;
        }

        // suggest send phom doc truoc
        for (i=0;i<onhand.length;i++){
            iCard = onhand[i];
            logMessage("kiem tra card "+iCard.encode());
            if (!listCanSend[i]){
                for (j=0;j<this.maxPlayer;j++){
                    jPlayer = this.getPlayer(j);
                    //if ((jPlayer != null) && (jPlayer.isPlaying) && (jPlayer.serverPosition != this.getMyPos())){
                    if ((jPlayer != null) && (jPlayer.isPlaying)) {
                        for (k=1;k<3;k++){
                            if (!jPlayer.isPhomNgang(k)){
                                if (this.ableToSendCard(iCard,jPlayer,k)){
                                    hasSendedCard = true;
                                    listCanSend[i] = true;
                                    iCard.selectCard();
                                    //this.getGameLayer().canSendCardTo(jPlayer,k);
                                    // co the gui iCard vao phom doc -> suggest cac card cung chat lien tiep
                                    var nextCard = getCardById(iCard.encode()+4,onhand);
                                    var idNextCardInList = -1;
                                    while(nextCard != null){
                                        nextCard.selectCard();
                                        idNextCardInList = findIndexCardByIdInList(nextCard.encode(),onhand);
                                        if (idNextCardInList!= -1){
                                            listCanSend[idNextCardInList] = true;
                                        }
                                        nextCard = getCardById(nextCard.encode()+4,onhand);
                                    }

                                    nextCard = getCardById(iCard.encode()-4,onhand);
                                    while(nextCard != null){
                                        nextCard.selectCard();
                                        idNextCardInList = findIndexCardByIdInList(nextCard.encode(),onhand);
                                        if (idNextCardInList!= -1){
                                            listCanSend[idNextCardInList] = true;
                                        }
                                        nextCard = getCardById(nextCard.encode()-4,onhand);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // suggest send phom ngang
        for (i=0;i<onhand.length;i++){
            iCard = onhand[i];
            logMessage("kiem tra card "+iCard.encode());
            if (!listCanSend[i]) {
                for (j = 0; j < this.maxPlayer; j++) {
                    jPlayer = this.getPlayer(j);
                    //if ((jPlayer != null) && (jPlayer.isPlaying) && (jPlayer.serverPosition != this.getMyPos())) {
                    if ((jPlayer != null) && (jPlayer.isPlaying)) {
                        for (k = 1; k < 3; k++) {
                            if (jPlayer.isPhomNgang(k)) {
                                if (this.ableToSendCard(iCard, jPlayer, k)) {
                                    hasSendedCard = true;
                                    iCard.selectCard();
                                    //this.getGameLayer().canSendCardTo(jPlayer, k);
                                }
                            }
                        }
                    }
                }
            }
        }

        // init button gui
        for (i=0;i<onhand.length;i++){
            iCard = onhand[i];
            for (j = 0; j < this.maxPlayer; j++) {
                jPlayer = this.getPlayer(j);
                //if ((jPlayer != null) && (jPlayer.isPlaying) && (jPlayer.serverPosition != this.getMyPos())) {
                if ((jPlayer != null) && (jPlayer.isPlaying)) {
                    for (k = 1; k < 3; k++) {
                        if (this.ableToSendCard(iCard, jPlayer, k)) {
                            this.getGameLayer().canSendCardTo(jPlayer, k);
                        }
                    }
                }
            }
        }

        logMessage("hasSendedCard "+hasSendedCard+" time: "+BkTime.GetCurrentTime());
        return hasSendedCard;
    },
    getNocCount:function(){
        var maxCountNoc = 4*this.numberOfPlayingPlayer;
        return maxCountNoc - this.pickCount;
    },
    processNetworkEvent:function(packet){
        logMessage("BkPhomIngameLogic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet);
                break;
            case c.NETWORK_SEND_CARD_RETURN:
                // gui phom
                this.processSendCard(packet);
                break;
            case c.NETWORK_TAKE_CARD_PUSH:
                this.onTakeCard();
                break;
            case c.NETWORK_DISCARD_PUSH:
                this.processPlayerDiscard(packet);
                break;
            case c.NETWORK_PICK_CARD_RETURN:
                this.processPickCardReturn(packet);
                break;
            case c.NETWORK_PICK_CARD_PUSH:
                this.processPickCard(packet);
                break;
            case c.NETWORK_SHOW_PHOM_RETURN:
                this.processShowPhom(packet);
                break;
            case c.NETWORK_SHOW_U_PUSH:
                this.processShowU(packet);
                break;
            //case c.NETWORK_LEAVE_DURING_GAME:
            //    this.processLeaveDurringGame(packet);
            //    break;
            default:{
                logMessage("BkPhomIngameLogic not process packet with type: "+packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});