/**
 * Created by bs on 10/10/2015.
 */
BA_CAY_CARD_SCALE = 0.7;
BkBaCayInGameLogic = BkInGameLogic.extend({
    openCardCount:0,
    playerDiscardCount:0,
    lastSendBetMoney:-1,

    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.BA_CAY);
        this.lastSendBetMoney = -1;
    },

    processUpdateBetMoney:function(mul) {
        var maxBetMoney = 5 * this.tableBetMoney;
        if (this.getTableOwner() != null){
            maxBetMoney = this.getTableOwner().getCurrentCash() / 5;
        } else {
            logTracker("ERROR: game ba cay khong co chu ban -> ReCheck","");
        }

        var playerBetMoney = mul * this.tableBetMoney;
        if (maxBetMoney < playerBetMoney) {
            var maxMul =  Math.floor(maxBetMoney /this.tableBetMoney);
            if (maxMul < 1) {
                maxMul = 1;
            }
            playerBetMoney = maxMul * this.tableBetMoney;
            showToastMessage("Chủ bàn chỉ đủ tiền cược tối đa " + playerBetMoney, 700, 70);
            this.getGameLayer().setRadioBetMoney(maxMul);
        }
        this.getGameLayer().lblMoneyForBet.setString(playerBetMoney);
    },


    processDiscardClick:function(){
        var Packet = new BkPacket();
        Packet.CreateDiscardAction();
        BkConnectionManager.send(Packet);
    },

    processCardClickEvent:function(card) {
        card.showBackMask(false);
        if (card.cardStatus == 0) {
            card.cardStatus = 1;
            this.openCardCount++;
            if (this.openCardCount == 3) {
                this.processDiscardClick();
            }
        }
    },

    processLeaveTableRequest:function(){
        var myPlayer = this.getMyClientState();
        if (this.isInGameProgress()) {
            if (myPlayer == null) return;
            if (myPlayer.status != PLAYER_STATE_NOT_READY) {
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
        } else {
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

    initCardForPlayer:function(player, numOfCard, scale) {
        var tempSuite = [];

        for (var i=0; i< numOfCard; i++) {
            var card = decode(5);
            card.showBackMask(true);
            card.removeAllEventListener();
            card.setScale(scale);
            tempSuite.push(card);
        }
        player.setOnhandCard(tempSuite);
    },

    processDealCardReturn:function (packet)
    {
        this._super();

        // Reset state
        this.openCardCount = 0;
        this.playerDiscardCount = 0;
        this.numberOfPlayingPlayer = this.PlayerState.length;

        for (var i=0; i < this.PlayerState.length; i++) {
            this.PlayerState[i].isPlaying = true;
        }
        logMessage("Process Ba Cay Deal card");
        var cardSuite = [];
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.showBackMask(true);
            card.setScale(BA_CAY_CARD_SCALE);
            cardSuite.push(card);
        }
        this.getMyClientState().setOnhandCard(cardSuite); // my card

        // Init card for other player
        var myPos = this.getMyPos();
        for (i=0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].serverPosition != myPos) {
                this.initCardForPlayer(this.PlayerState[i], 3, BA_CAY_CARD_SCALE);
            }
        }

        this.getGameLayer().onDealCardReturn();

    },

    processDiscard:function (packet)
    {
        logMessage("Process Ba Cay Discard");
        this.playerDiscardCount++;

        var playerPosition = packet.Buffer.readByte();
        var player = this.getPlayer(playerPosition);
        if (player == null){
            this.networkGetTableInfo();
            return;
        }
        var count = 0;
        while (packet.Buffer.isReadable()) // my card
        {
            var cardId = packet.Buffer.readByte();
            var card = player.updateOnhandCard(cardId, count);
            card.showBackMask(false);
            count++;
        }

        var point = this.getPoint(player);
        this.getGameLayer().showBaCayResult(playerPosition, point + " Điểm");

        this.processFinishGame();
        this.processNextEventInQueue();
    },

    processDiscardSuccess:function (packet) {
        logMessage("processDiscardSuccess ");
        this.playerDiscardCount++;
        this.getGameLayer().onDiscardSuccess();
        this.processFinishGame();

        this.processNextEventInQueue();
    },

    sendBetMoney:function(betMoney) {
        logMessage("Send bet money" + betMoney);
        var Packet = new BkPacket();
        Packet.CreateBaCayBetMoneyAction(betMoney);
        BkConnectionManager.send(Packet);

        this.lastSendBetMoney = betMoney;
    },

    processFinishGame:function() {
        logMessage("Check Finish game playerDiscard:" + this.playerDiscardCount + " playing: " + this.numberOfPlayingPlayer);
        if (this.playerDiscardCount < this.numberOfPlayingPlayer) {
            return false;
        }
        //set table status
        this.gameStatus = GAME_STATE_FINISH;
        this.getGameLayer().btnLatBai.visible = false;
        this.updateMoneyAfterFinishGame();
        if (this.getMyClientState().isLeaveRegistered)
        {
            this.getGameLayer().scheduleGetOut(3);
        }
        this._super();
    },

    getTableOwner:function() {
        for (var i=0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].status == 0) { //STATE_TABLE_OWNER:int = 0
                return this.PlayerState[i];
            }
        }
        return null;
    },

    getPoint:function(player) {
        var cardSuite = player.getOnHandCard();
        var point = 0;
        for (var i=0; i < cardSuite.length; i++) {
            point = point + cardSuite[i].number;
        }
        while (point > 10) {
            point = point - 10;
        }
        traceCardList(player.getOnHandCard(), "Player: " + player.getName() + " point:" + point);
        return point;
    },

    getBacayCardNumber:function(number)
    {
        if (number == 1)
        {
            return 10;
        }
        return number;
    },

    getBacayCardColor:function(type) {
        switch (type)
        {
            case 0: return 0;
            case 1: return 3;
            case 2: return 2;
        }
        return 1;
    },

    compareCard:function(card1, card2) {
        var color1 = this.getBacayCardColor(card1.type);
        var color2 = this.getBacayCardColor(card2.type);
        if (color1 > color2) {
            return true;
        } else if (color1 < color2) {
            return false;
        }

        var bacayNumber1 = this.getBacayCardNumber(card1.number);
        var bacayNumber2 = this.getBacayCardNumber(card2.number);
        return bacayNumber1 > bacayNumber2;

    },

    getMaxCard:function(cardSuite) {
        var tempCard = cardSuite[0];
        for (var i=1; i<cardSuite.length; i++) {
            if (this.compareCard(cardSuite[i], tempCard)) {
                tempCard = cardSuite[i];
            }
        }
        return tempCard;
    },

    isBacayBigger:function(player1, player2) {
        logMessage("Player1: " + player1.getName() + " player2: " + player2.getName());
        var point1 = this.getPoint(player1);
        var point2 = this.getPoint(player2);
        if (point1 > point2) {
            return true;
        } else if (point1 < point2) {
            return false;
        }
        var card1 = this.getMaxCard(player1.getOnHandCard());
        var card2 = this.getMaxCard(player2.getOnHandCard());
        return this.compareCard(card1, card2);
    },

    showBaCayWinLose:function(tableOwner, player, isWin, cashChange){
        var postOwner = this.getPlayerDisplayLocation(tableOwner.serverPosition);
        var posPlayer = this.getPlayerDisplayLocation(player.serverPosition);
        if (isWin) {
            this.increaseCash(player, cashChange, "Thắng");
            this.getGameLayer().moveCashEffect(postOwner, posPlayer, cashChange);
        } else {
            this.increaseCash(player, cashChange, "Thua");
            this.getGameLayer().moveCashEffect(posPlayer, postOwner, cashChange);
        }
        this.getGameLayer().updateWinner(posPlayer, isWin);
    },

    updateMoneyAfterFinishGame:function() {

        if (BkGlobal.currentGS != GS.INGAME_GAME){
            logMessage("BkGlobal.currentGS != GS.INGAME_GAME -> don't process next");
            return;
        }

        var tableOwner = this.getTableOwner();
        var totalMoney = 0;
        for (var i = 0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].status != PLAYER_STATE_READY) {
                continue;
            }
            var cashChange = 0;
            if (this.isBacayBigger(this.PlayerState[i],tableOwner)) {
                logMessage("Player " + this.PlayerState[i].getName() + " bigger than player:" + tableOwner.getName());
                cashChange = Math.floor(this.PlayerState[i].betMoney * (1- TAX_RATE));
                totalMoney -= this.PlayerState[i].betMoney;
                this.showBaCayWinLose(tableOwner, this.PlayerState[i],true, cashChange);
            }
            else {
                logMessage("Player " + this.PlayerState[i].getName() + " smaller than player:" + tableOwner.getName());
                cashChange = -1 * this.PlayerState[i].betMoney;
                totalMoney += Math.floor( this.PlayerState[i].betMoney * (1 - TAX_RATE));
                this.showBaCayWinLose(tableOwner, this.PlayerState[i],false, cashChange);
            }
        }
        totalMoney = -totalMoney > tableOwner.getCurrentMoney() ? -1 * tableOwner.getCurrentMoney() : totalMoney;

        if (totalMoney > 0) {
            this.increaseCash(tableOwner, totalMoney, "Thắng");
        }
        else if (totalMoney < 0) {
            this.increaseCash(tableOwner, totalMoney, "Thua");
        }
    },

    processBetBaCayReturn:function(packet) {
        var playerPosition = packet.Buffer.readByte();
        var money = packet.Buffer.readInt();
        var player = this.getPlayer(playerPosition);
        if (player != null){
            logMessage("Update bet money player: " + player.getName() + " money:" + money);
            player.betMoney = money;
            if (player.status != PLAYER_STATE_TABLE_OWNER) { //STATE_TABLE_OWNER:int = 0
                this.getGameLayer().onUpdateBetMoney(playerPosition, money);
            }
        }

        // Send ready
        if (this.lastSendBetMoney == money) {
            this.lastSendBetMoney = -1;
            this.getGameLayer().onReady();
            //this.getGameLayer().clearCurrentGameGui();
            //this.processPlayerReadyAction();
        }

        this.processNextEventInQueue();
    },

    processGameTableSyn:function(packet) {
        this._super(packet);

        if (!this.isInGameProgress()) {
            return;
        }

        while (packet.Buffer.isReadable())
        {
            var playerPosition = packet.Buffer.readByte();
            var tempPlayer = this.getPlayer(playerPosition);
            if(tempPlayer == null)
            {
                return;
            }
            tempPlayer.setBetMoney(packet.Buffer.readInt());
            // Show bet money if player is not table owner
            if (tempPlayer.status != PLAYER_STATE_TABLE_OWNER) {
                this.getGameLayer().onUpdateBetMoney(playerPosition, tempPlayer.betMoney);
            }
            tempPlayer.isPlaying = true;
            this.numberOfPlayingPlayer++;

            var hasDiscard = (packet.Buffer.readByte() == 1);
            if (hasDiscard) {
                this.playerDiscardCount++;
            }

            if (hasDiscard || (playerPosition == this.getMyPos()))
            {
                var cardSuite = [];
                for (var i = 0; i < 3; i++) {
                    var card = decode(packet.Buffer.readByte());
                    card.setScale(BA_CAY_CARD_SCALE);
                    cardSuite.push(card);
                }
                tempPlayer.setOnhandCard(cardSuite);

                if (playerPosition != this.getMyPos())
                {
                    this.getGameLayer().onDiscard(playerPosition, true);
                } else {
                    // Enable Select
                    for (var i = 0; i < 3; i++) {
                        cardSuite[i].setSelectable(true);
                    }
                    this.getGameLayer().synOnhandCard();
                    if (hasDiscard)
                    {
                        this.getGameLayer().onDiscardSuccess();
                    }
                }
            } else {
                this.initCardForPlayer(tempPlayer, 3, BA_CAY_CARD_SCALE);
                this.getGameLayer().onDiscard(playerPosition, false);
            }
        }
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
    },

    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_DISCARD_PUSH:
            case c.NETWORK_DISCARD_SUCCESS:
            case c.NETWORK_BET_BACAY_RETURN:
                return true;
        }
        return this._super(eventType);
    },
    /*
     * handle all Ba Cay ingame event
     */
    processNetworkEvent:function(packet){
        logMessage("Bk BaCay Ingame Logic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_DISCARD_PUSH:
                this.processDiscard(packet);
                break;
            case c.NETWORK_DISCARD_SUCCESS:
                this.processDiscardSuccess(packet);
                break;
            case c.NETWORK_BET_BACAY_RETURN:
                this.processBetBaCayReturn(packet);
                break;
            default:{
                logMessage("Bk BaCay Ingame Logic not process packet with type: "+packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});