/**
 * Created by VanChinh on 11/10/2015.
 */

BkChessInGameLogic = BkInGameLogic.extend({

    ctor:function() {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.CO_TUONG);
    },

    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_UPDATE_OBSERVER_STATUS:
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_MOVE_PIECE_RETURN:
            case c.NETWORK_INFOR_RETURN:
            case c.NETWORK_FINISH_GAME_RETURN:
            case c.NETWORK_CHESS_OFFER_RETURN:
            case c.NETWORK_CONTINUE_GAME_RETURN:
                return true;
        }
        return this._super(eventType);
    },

    /* override function of base layer */
    isNeedInvitePlayers:function(){
        if(this.PlayerState.length < 2) return true;
        else{
            var numberOfActivePlayers = 0;
            for(var i = 0, len = this.PlayerState.length; i < len; i++){
                var player = this.PlayerState[i];
                if(player && !player.isObserver){
                    numberOfActivePlayers++;
                }
            }
            return numberOfActivePlayers < 2;
        }
    },

    /* override function of base layer */
    isAllPlayerReady:function()
    {
        for(var i = 0, len = this.PlayerState.length; i < len; i++){
            var player = this.PlayerState[i];
            if(player.status == PLAYER_STATE_NOT_READY && player.isObserver === false)
            {
                showToastMessage("player" + player.getName() + "is not ready");
                return false;
            }
        }
        return true;
    },

    /* override function of base layer */
    readPlayerInfo:function(Packet) {
        var player = this._super(Packet);
        player.isObserver = (Packet.Buffer.readByte() == 1);
        return player;
    },

    onObserverStatusChange: function(packet) {
        this._super(packet);
        var playerPosition = packet.Buffer.readByte();
        var isObserver = (packet.Buffer.readByte() == 1);

        this.getGameLayer().onObserverStatusChange(playerPosition, isObserver);
    },

    onDealCard: function(packet) {
        var firstPosition = packet.Buffer.readByte(),
            lastPosition = packet.Buffer.readByte();
        this.getGameLayer().onDealCard(firstPosition, lastPosition);
    },

    onMove: function(packet) {
        var startCol = packet.Buffer.readByte(),
            startRow = packet.Buffer.readByte(),
            finishCol = packet.Buffer.readByte(),
            finishRow = packet.Buffer.readByte(),
            remainTime = packet.Buffer.readInt();

        var gameLayer = this.getGameLayer();
        if(gameLayer && typeof gameLayer.onMove === 'function') gameLayer.onMove(startCol, startRow, finishCol, finishRow, remainTime);
        else this.networkGetTableInfo();
    },

    onInforReturn: function(packet) {
        var code = packet.Buffer.readByte(),
            position = packet.Buffer.readByte();

        this.getGameLayer().onInforReturn(code, position);
    },

    onFinishGame: function(packet) {
        var winnerPosition = packet.Buffer.readByte();
        this.getGameLayer().onFinishGame(winnerPosition);
    },

    onOfferReturn: function(packet) {
        var offer = packet.Buffer.readByte();

        this.getGameLayer().onOfferReturn(offer);
    },
    updateObserverStatus: function(playerPosition, isObserver) {
        var player = this.getPlayer(playerPosition);
        if(player == null)
        {
            return;
        }
        player.isObserver = isObserver;
        if (isObserver) {
            if(player) {
                player.tablePosition = - 1;
                player.status = PLAYER_STATE_NOT_READY;
            }
        }
        else {
            var tablePosition = this.findTablePosition();
            if(player) player.tablePosition = tablePosition;
        }
        this.updateNumberOfReadyPlayer();
    },

    findTablePosition: function() {
        var tablePositionFlag = [];
        var i;
        for (i = 0; i < this.maxPlayer; i++) {
            if (this.PlayerState[i] != null) {
                if (this.PlayerState[i].tablePosition >= 0 && this.PlayerState[i].tablePosition < 2) {
                    tablePositionFlag[this.PlayerState[i].tablePosition] = true;
                }
            }
        }
        for (i = 0; i < 2; i++) {
            if (!tablePositionFlag[i]) {
                return i;
            }
        }

        return -1;
    },

    updateNumberOfReadyPlayer: function() {
        var count = 0;
        for (var i = 0; i < this.maxPlayer; i++)
        {
            var player = this.getPlayerByIndex(i);
            if (player && (player.status != PLAYER_STATE_NOT_READY))
            {
                count++;
            }
        }
        this.numberOfPlayingPlayer = count;
    },

    getPlayerByIndex: function(index) {
        return this.PlayerState[index];
    },

    processLeaveTableRequest:function() {
        var player = this.getMyClientState();
        var self = this;
        if (player && !player.isObserver && this.gameStatus == GAME_STATE_PLAYING) {
            //var str = "Nếu bạn rời bàn chơi bạn sẽ bị phạt " +
            //    convertStringToMoneyFormat(this.getTableBetMoney(),true) + " " + BkConstString.STR_GAME_COIN.toLowerCase() +
            //    ".\nBạn có thực sự muốn thoát không?";

            var str = "Bạn sẽ thua ván này.\nBạn có chắc chắn muốn thoát?";
            showPopupConfirmWith(str,"Thoát khi đang chơi",function() {
                self.networkOutTable(1);
            });
        }
        else this.networkOutTable(0);
    },

    processChessOfferDraw: function(offer) {
        var packet = new BkPacket();
        packet.CreateChessOfferPacket(offer);
        BkConnectionManager.send(packet);
    },

    processBetMaxMoney: function(betMoney, chessRule) {
        var packet = new BkPacket();
        packet.CreateSetupCoTablePacket(betMoney, chessRule);
        BkConnectionManager.send(packet);
    },

    processUpdateObserverStatus: function(flag) {
        var packet = new BkPacket();
        packet.CreateUpdateObserverStatusPacket(flag);
        BkConnectionManager.send(packet);
    },

    processContinueGame: function() {
        var packet = new BkPacket();
        packet.CreateContinueGamePacket();
        BkConnectionManager.send(packet);
    },

    processMovePiece: function(startCol, startRow, finishCol, finishRow) {
        var packet = new BkPacket();
        packet.CreateMovePiecePacket(startCol, startRow, finishCol, finishRow);
        BkConnectionManager.send(packet);
    },

    /*
     * handle in-game events
     */
    processNetworkEvent:function(packet) {
        logMessage("BkChessInGameLogic -> processNetworkEvent " + packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_UPDATE_OBSERVER_STATUS:
                this.onObserverStatusChange(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.onDealCard(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_MOVE_PIECE_RETURN:
                this.onMove(packet);
                break;
            case c.NETWORK_INFOR_RETURN:
                this.onInforReturn(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.onFinishGame(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_CHESS_OFFER_RETURN:
                this.onOfferReturn(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_CONTINUE_GAME_RETURN:
                this.getGameLayer().onContinueGame();
                this.processNextEventInQueue();
                break;
            default:{
                logMessage("BkChessInGameLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
                break;
            }
        }
    }
});