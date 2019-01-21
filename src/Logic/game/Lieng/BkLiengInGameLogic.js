/**
 * Created by bs on 10/10/2015.
 */
LIENG_CARD_SCALE = 0.75;
LIENG_NUM_OF_CARD = 3;
BkLiengInGameLogic = BkRoundBetInGameLogic.extend({
    currentBetMoney:0,
    totalBetMoney:0,
    raisePosition:0,
    firstCallPosition:0,
    activePlayerPosition:0,

    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.LIENG);
    },

    processGameTableSyn:function(packet) {
        // TODO
        this.init();

        this._super(packet);

        if (!this.isInGameProgress()) {
            this.getGameLayer().showGameButton(false);
            return;
        }

        // Process bet money
        this.currentBetMoney = packet.Buffer.readInt();
        this.totalBetMoney = packet.Buffer.readInt();
        this.raisePosition = packet.Buffer.readByte();
        this.firstCallPosition = packet.Buffer.readByte();
        this.activePlayerPosition = packet.Buffer.readByte();
        while (packet.Buffer.isReadable()) {
            var playerPosition = packet.Buffer.readByte();
            logMessage("playerPosition: "+playerPosition);
            var player = this.getPlayer(playerPosition);
            if(player == null)
            {
                return;
            }
            player.setBetMoney(packet.Buffer.readInt());
            player.isPlaying = true;
            var isContinue = packet.Buffer.readByte();
            player.isFinishedGame = (isContinue == 0);

            if (!player.isFinishedGame) {
                this.totalBetMoney -= player.betMoney;
            } else {
                player.betMoney = 0;
            }
            this.getGameLayer().updateBetMoney(playerPosition, player.betMoney);

            if (playerPosition == this.getMyPos()) {
                var cardSuite = [];
                for (var i = 0; i < LIENG_NUM_OF_CARD; i++) {
                    var card = decode(packet.Buffer.readByte());
                    card.setScale(LIENG_CARD_SCALE);
                    cardSuite.push(card);
                }
                player.setOnhandCard(cardSuite);
                this.getGameLayer().showMySuiteName();
            } else {
                if (!player.isFinishedGame) {
                    this.initCardForPlayer(player, 3, LIENG_CARD_SCALE);
                }
            }
            this.getGameLayer().onTableSynForPlayer(player);
        }
        this.getGameLayer().showTableBetMoney();
        this.getGameLayer().showActivePlayer();
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
    },

    processDealCardReturn:function(packet) {
        logMessage("Lieng Logic: process Deal card return:");
        this._super();

        // init
        this.numberOfPlayingPlayer = this.PlayerState.length;

        for (var i=0; i < this.PlayerState.length; i++) {
            this.PlayerState[i].totalBetMoney = this.tableBetMoney;
            this.increaseCash(this.PlayerState[i], -1 * this.tableBetMoney, "Cược");
        }
        this.totalBetMoney = this.numberOfPlayingPlayer * this.tableBetMoney;

        // Process deal card
        var cardSuite = [];
        this.firstCallPosition = packet.Buffer.readByte();
        while (packet.Buffer.isReadable()) {
            var card = decode(packet.Buffer.readByte());
            card.setScale(LIENG_CARD_SCALE);
            cardSuite.push(card);
        }
        this.getMyClientState().setOnhandCard(cardSuite); // my card
        this.activePlayerPosition = this.firstCallPosition;

        // Create card for all player
        var myPos = this.getMyPos();
        for (i=0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].serverPosition != myPos) {
                this.initCardForPlayer(this.PlayerState[i], 3, 0.7);
            }
        }

        this.getGameLayer().onDealCardReturn();
    },

    showSuiteResult:function(pos, suiteName) {
        var winnerFlag = false;
        for (var i= 0; i< this.winPosition.length; i++) {
            if (this.winPosition[i] == pos) {
                winnerFlag = true;
                break;
            }
        }
        this.getGameLayer().showSuiteName(pos, suiteName, winnerFlag);
    },

    updateMoneyAfterFinishGame: function () {
        if (BkGlobal.currentGS != GS.INGAME_GAME){
            logMessage("BkGlobal.currentGS != GS.INGAME_GAME -> don't process next");
            return;
        }
        this._super();
        // run animation
        this.getGameLayer().showMultiWinner();
    },

    processFinishGame:function(buffer) {
        this._super();

        this.getGameLayer().clearSuiteName("");

        var winCount = buffer.readByte();
        this.winPosition = [];
        for (var i = 0; i < winCount; i++) {
            this.winPosition.push(buffer.readByte());
        }
        while (buffer.isReadable()) {
            var position = buffer.readByte();
            var player = this.getPlayer(position);
            if(player == null)
            {
                if (player == null){
                    logMessage("is invalid game state -> get table info & sync event");
                    this.getLogic().networkGetTableInfo();
                    return;
                }
            }
            var cardId1 = buffer.readByte();
            var cardId2 = buffer.readByte();
            var cardId3 = buffer.readByte();

            if (this.getMyPos() != position)
            {
                // Update card and remove back mark
                var card1 = player.updateOnhandCard(cardId1, 0);
                card1.showBackMask(false);
                var card2 = player.updateOnhandCard(cardId2, 1);
                card2.showBackMask(false);
                var card3 = player.updateOnhandCard(cardId3, 2);
                card3.showBackMask(false);
            }
            // Show suite name
            var liengSuite = new BkLiengCardSuite();
            liengSuite.setCardSuite(player.getOnHandCard());
            var suiteName = liengSuite.getSuiteName();
            this.showSuiteResult(position, suiteName);
        }
        var self = this;
        var fcb = function(playeri){
            self.updateMoneyAfterFinishGame();
        };
        this.processBetMoney(fcb);
    },
    /*
     * handle all Lieng ingame event
     */
    processNetworkEvent:function(packet){
        logMessage("Bk Lieng Ingame Logic -> processNetworkEvent "+packet.Type);
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
                this.processFinishGame(packet.Buffer);
                break;
            default:{
                logMessage("Bk Lieng not process packet, send to base class");
                this._super(packet);
            }
        }
    }
});