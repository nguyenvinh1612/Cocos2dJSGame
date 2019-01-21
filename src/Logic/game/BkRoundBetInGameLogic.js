/**
 * Created by bs on 10/10/2015.
 */
BkRoundBetInGameLogic = BkInGameLogic.extend({
    firstCallPosition:0,
    currentBetMoney:0,
    totalBetMoney:0,
    raisePosition:0,
    winPosition:null,
    isFinishGameAnimation:false,
    ctor:function()
    {
        this._super();
        this.init();
    },

    init:function() {
        this.winPosition = null;
        this.totalBetMoney=0;
        if (this.PlayerState != null) {
            for (var i=0; i< this.PlayerState.length; i++) {
                this.PlayerState[i].betMoney = 0;
                this.PlayerState[i].totalBetMoney = 0;
            }
        }
    },

    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_PLAYER_STATUS_RETURN:
            case c.NETWORK_PREPARE_NEW_GAME:
            case c.NETWORK_LEAVE_DURING_GAME:
            case c.NETWORK_FINISH_GAME_RETURN:

            case c.NETWORK_FORFEIT_RETURN:
            case c.NETWORK_CALL_RETURN:
            case c.NETWORK_RAISE_RETURN:
                return true;
        }
        return this._super(eventType);
    },

    processCheckClick:function() {
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_CALL);
        BkConnectionManager.send(Packet);
    },

    processFoldClick:function(){
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_FORFEIT);
        BkConnectionManager.send(Packet);
    },

    sendBetMoney:function(money) {
        // Send bet money
        var Packet = new BkPacket();
        Packet.CreateRaiseMoneyAction(money);
        BkConnectionManager.send(Packet);
    },

    processRaiseClick:function(money) {
        var myCash = this.getMyClientState().getCurrentCash();
        if (money != null && myCash > money) {
            this.sendBetMoney(money);
        } else {
            showToastMessage("Bạn không đủ tiền để tố",650, 60,2);
        }
    },

    processAllInClick:function() {
        var player = this.getMyClientState();
        var currentCheckMoney = this.currentBetMoney - player.betMoney;
        var moneyAllIn = player.getCurrentCash() - (this.currentBetMoney - player.betMoney);
        logMessage("Current money to check: " + currentCheckMoney + " all in money: " + moneyAllIn);
        if (moneyAllIn > 0) {
            this.sendBetMoney(moneyAllIn);
        } else {
            this.processCheckClick();
        }
    },

    processBetMoney:function(callbackFun) {
        // warning -> duplicate variable
        this.currentBetMoney = 0;
        var count = 0;
        for (var i=0; i< this.PlayerState.length; i++) {
            if (this.PlayerState[i].isPlaying && this.PlayerState[i].betMoney > 0) { // check player is playing
                count++;
            }
        }
        this.getGameLayer().betMoneyCount = count;

        for (var i=0; i< this.PlayerState.length; i++) {
            if (this.PlayerState[i].isPlaying &&
                this.PlayerState[i].betMoney > 0) { // check player is playing
                logMessage("Bet Money: player:" + this.PlayerState[i].getName() + " Money:" + this.PlayerState[i].betMoney);
                this.getGameLayer().playerBetMoney(this.PlayerState[i].serverPosition, this.PlayerState[i].betMoney, callbackFun);
                this.totalBetMoney += this.PlayerState[i].betMoney;
                this.PlayerState[i].totalBetMoney += this.PlayerState[i].betMoney;
                this.PlayerState[i].betMoney = 0;
            }
        }
        if (count == 0) {
            if (callbackFun != null) {
                callbackFun();
            }
        }
        this.getGameLayer().resetSliderBetMoney();
    },

    processDealCardReturn:function(packet) {
        this._super();
        logMessage("RoundBetIngameLogic: processDealCardReturn");
        // Setup state for new game
        this.totalBetMoney = 0;
        this.currentBetMoney = 0;
        this.gameStatus = GAME_STATE_PLAYING;

        this.numberOfPlayingPlayer = this.PlayerState.length;

        for (var i=0; i < this.PlayerState.length; i++) {
            this.PlayerState[i].isPlaying = true;
            this.PlayerState[i].isFinishedGame = false;
            this.PlayerState[i].betMoney = 0;
            this.PlayerState[i].totalBetMoney = 0;
        }
        //this.checkMoney();
    },

    countCheckMoney:0,
    isCheckMoney:false,
    checkMoney:function(){
        this.countCheckMoney = 0;
        this.isCheckMoney = true;
        for (var i = 0; i < this.PlayerState.length; i++){
            var playeri = this.PlayerState[i];
            if (playeri != null) {
                var name = playeri.getName();
                this.processOverViewPlayer(name);
            }
        }
    },

    isSaiTien:function(money){
        for (var i=0;i<this.maxPlayer;i++){
            var iplayer = this.getPlayer(i);
            if (iplayer != null){
                logMessage("name "+iplayer.getName()+ " money "+money+" current money "+iplayer.getCurrentCash());
                if (money == iplayer.getCurrentCash()){
                    return false;
                }
            }
        }
        return true;
    },

    ProcessOverviewProfile:function(Packet){
        if (!this.isCheckMoney){
            this._super(Packet);
        } else {
            var userData = this.playerOverviewData;
            var avar =Packet.Buffer.readByte();
            var money = Packet.Buffer.readInt();
            if (this.isSaiTien(money)){
                postUserTracker(4, BkGlobal.UserInfo.getUserName(),bk.cpid, cc.bkClientId, "", "co ng sai tien: "+ money);
            }
            this.countCheckMoney++;
            if (this.countCheckMoney == this.numberOfPlayingPlayer){
                this.isCheckMoney = false;
            }
            logMessage("Ingame ProcessOverviewProfile count:" + this.countCheckMoney + " isCheckMoney: " + this.isCheckMoney);
        }
    },

    processForfeit:function(packet) {
        logMessage("RoundBet Base Logic: processForfeit");
        if (!this.isInGameProgress()){
            logMessage("onReceive wrong game status-> reject");
            this.processNextEventInQueue();
            return;
        }
        // Danh dau current active player da ket thuc
        var foldPlayer = this.activePlayerPosition;

        var player = this.getPlayer(foldPlayer);
        if(player) {
            if (player.betMoney > 0) {
                this.totalBetMoney += player.betMoney;
                this.getGameLayer().removePlayerBetMoney(foldPlayer, player.betMoney);
                player.betMoney = 0;
            }
            player.isFinishedGame = true;
        }

        // change active player
        this.getNextActivePlayerPosition();

        this.sendCheckForAllIn();

        this.getGameLayer().onFold(foldPlayer);
        this.processNextEventInQueue();
    },

    processCallReturn:function(packet) {
        var money = packet.Buffer.readInt();
        logMessage("RoundBet Base Logic: processCallReturn money:" + money);

        var checkPlayer = this.activePlayerPosition;
        var player = this.getPlayer(checkPlayer);
        if (player == null) {
            return;
        }
        player.betMoney += money;

        this.increaseCash(player, -1 * money, "Theo");

        this.getNextActivePlayerPosition();

        this.sendCheckForAllIn();

        if (player.getCurrentCash() == 0) {
            this.getGameLayer().onAllIn(checkPlayer,player.betMoney);
        } else {
            this.getGameLayer().onCheck(checkPlayer,player.betMoney);
        }
        this.processNextEventInQueue();
    },

    processRaiseReturn:function(packet) {
        var money = packet.Buffer.readInt();
        var raisePlayer = this.activePlayerPosition;
        var player = this.getPlayer(raisePlayer);
        if(player == null)
        {
            return;
        }
        this.increaseCash(player, -1 * money, "Cược");
        player.betMoney += money;
        if (player.betMoney > this.currentBetMoney) {
            this.currentBetMoney = player.betMoney;
        }
        logMessage("RoundBetInGameLogic: processRaiseReturn money:" + money + " current bet money:" + this.currentBetMoney);

        this.getNextActivePlayerPosition();

        this.sendCheckForAllIn();
        logMessage("RoundBetInGameLogic: processRaiseReturn");

        if (player.getCurrentCash() == 0) {
            this.getGameLayer().onAllIn(raisePlayer, player.betMoney);
        } else {
            this.getGameLayer().onRaise(raisePlayer, player.betMoney);
        }
        this.processNextEventInQueue();
    },

    sendCheckForAllIn:function() {
        if (this.activePlayerPosition != this.getMyPos()){
            return;
        }
        var player = this.getMyClientState();
        if (player.isFinishedGame || player.getCurrentCash() > 0) {
            return;
        }
        // auto send check
        this.processCheckClick();
    },

    processFinishGame:function(buffer) {
        logMessage("RoundBet Base: Process finish game return");
        this.isFinishGameAnimation = true;
        this._super();
    },

    processLeaveTableRequest:function(){
        if(this.isDealingCard || this.isFinishGameAnimation)
        {
            return;
        }
        var player = this.getMyClientState();
        var self = this;
        if (player != null && player.isPlaying && !player.isFinishedGame)
        {
            // Neu đang trong game thi show thong bao
            if (this.isInGameProgress())
            {
                var str = "Bạn sẽ mất hết số tiền đã cược nếu thoát giữa ván."+
                    "\nBạn có thực sự muốn thoát không?";
                showPopupConfirmWith(str,"Thoát giữa ván chơi",function(){
                    self.networkOutTable(1);
                });
                return;
            }
        }else if(player != null && player.isPlaying && player.isFinishedGame)
        {
            this.networkOutTable(1);
            return;
        }
        this.networkOutTable(0);
    },

    resetAllCurrentChangeCash:function() {
        for (var i=0; i< this.PlayerState.length; i++) {
            this.PlayerState[i].totalChangedMoney =0;
        }
    },

    updateMoneyAfterFinishGame:function() {
        // Find max of total bet money
        logMessage("update money after finish");
        if ((BkGlobal.currentGS != GS.INGAME_GAME) && (BkGlobal.currentGS != GS.WAITTING_JOIN_ROOM_FROM_INGAME)){
            logMessage("BkGlobal.currentGS != GS.INGAME_GAME -> don't process next");
            return;
        }

        var maxBetMoney = 0;
        for (var i=0; i< this.winPosition.length; i++) {
            var totalBet = this.getPlayer(this.winPosition[i]).totalBetMoney;
            if (maxBetMoney < totalBet) {
                maxBetMoney = totalBet;
            }
            logMessage("Check bet money player:" + this.winPosition[i] + " - betMoney: " + totalBet);
        }

        // return bet money
        this.resetAllCurrentChangeCash();

        for (var i=0; i< this.PlayerState.length; i++) {
            var player = this.PlayerState[i];
            if (player != null && player.isPlaying) {
                if (player.totalBetMoney > maxBetMoney) {
                    var cash = player.totalBetMoney - maxBetMoney;
                    this.increaseCash(player, cash, "Trả lại");
                    this.totalBetMoney -= cash;
                }
            }
        }

        // Return money for winner
        this.resetAllCurrentChangeCash();

        for (var i = 0; i < this.winPosition.length; i++) {
            var player = this.getPlayer(this.winPosition[i]);
            var cashReturn = player.totalBetMoney;
            player.totalChangedMoney = cashReturn;
            this.totalBetMoney -= cashReturn;
        }

        this.totalBetMoney = Math.floor(this.totalBetMoney / this.winPosition.length);
        for (var i = 0; i < this.winPosition.length; i++) {
            var player = this.getPlayer(this.winPosition[i]);
            var cashEarn = Math.floor(this.totalBetMoney * (1 - TAX_RATE));
            player.totalChangedMoney += cashEarn;
        }

        this.isFinishGameAnimation = false;
        this.totalBetMoney = 0;
        this.getGameLayer().showTableBetMoney();
    },

    processLeaveDuringGame:function(packet) {
        logMessage("RoundBet Base: processLeaveDuringGame");
        var playerPos = packet.Buffer.readByte();


        var player = this.getPlayer(playerPos);
        if (player != null){
            logMessage("chi danh dau ng choi k choi -> cho goi tin table leave push de update mang playerState");
            player.isPlaying = false;
        }

        // Check bet money
        if (player != null && player.betMoney >0) {
            this.totalBetMoney += player.betMoney;
            this.getGameLayer().removePlayerBetMoney(playerPos, player.betMoney);
        }

        if (playerPos == this.activePlayerPosition) {
            this.getNextActivePlayerPosition();
            this.getGameLayer().showActivePlayer();
        }
        this.processNextEventInQueue();
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


    processGameTableSyn:function(packet) {
        this._super(packet);

        this.init();
    },

    getNextActivePlayerPosition:function()
    {
        var count = 0;
        do
        {
            this.activePlayerPosition = Math.floor(this.activePlayerPosition + 1)% this.maxPlayer; // modified
            count++;
            var player = this.getPlayer(this.activePlayerPosition);
            if(player != null && !player.isFinishedGame && player.isPlaying
                && player.status != PLAYER_STATE_NOT_READY)
            {
                return this.activePlayerPosition;
            }
        }
        while( count < 10);
        return -1;
    },

    /*
     * handle all RoundBet ingame event
     */
    processNetworkEvent:function(packet){
        logMessage("Bk Poker Ingame Logic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_FORFEIT_RETURN:
                this.processForfeit(packet);
                break;
            case c.NETWORK_CALL_RETURN:
                this.processCallReturn(packet);
                break;
            case c.NETWORK_RAISE_RETURN:
                this.processRaiseReturn(packet);
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet.Buffer);
                break;
            case c.NETWORK_LEAVE_DURING_GAME:
                this.processLeaveDuringGame(packet);
                break;
            case c.NETWORK_OVERVIEW_OTHER_PROFILE_RETURN:
                this.ProcessOverviewProfile(packet);
                break;

            default:{
                logMessage("Bk RoundBetIngameLogic not process packet, send to base class");
                this._super(packet);
            }
        }
    }
});