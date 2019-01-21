/**
 * Created by bs on 10/10/2015.
 */
BkPokerInGameLogic = BkRoundBetInGameLogic.extend({
    tableSuite:null,
    firstCallPosition:0,
    totalBetMoney:0,
    raisePosition:0,
    winPosition:null,
    myPokerSuite:null,
    needToShowSuiteName:false,
    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.POKER);
    },

    init:function() {
        this._super();
        this.tableSuite = null;
    },

    getTableSuite:function(){
        return this.tableSuite;
    },

    getMyCardSuiteName:function() {
        if (this.myPokerSuite == null) {
            return "";
        }
        var myPlayer = this.getMyClientState();
        if (!myPlayer.isPlaying || myPlayer.isFinishedGame) {
            return "";
        }
        return this.myPokerSuite.getBiggestSuiteName();
    },

    getMyCardSuiteDetail:function() {
        if (this.myPokerSuite == null) {
            return null;
        }
        var myPlayer = this.getMyClientState();
        if (!myPlayer.isPlaying || myPlayer.isFinishedGame) {
            return null;
        }
        return this.myPokerSuite.getBiggestPokerSuite();
    },

    processDealCardReturn:function(packet) {
        this._super();
        var i;
        logMessage("Poker Logic: processDealCardReturn");
        // Reset table Suite
        this.tableSuite = [];
        this.myPokerSuite = new BkPokerCardSuite();
        this.totalBetMoney = 0;
        this.gameStatus = GAME_STATE_PLAYING;
        this.currentBetMoney = 2 * this.tableBetMoney;

        this.numberOfPlayingPlayer = this.PlayerState.length;

        for (i=0; i < this.PlayerState.length; i++) {
            this.PlayerState[i].isPlaying = true;
            this.PlayerState[i].isFinishedGame = false;
            this.PlayerState[i].betMoney = 0;
            this.PlayerState[i].totalBetMoney = 0;
        }


        this.firstCallPosition = packet.Buffer.readByte();
        this.activePlayerPosition = this.firstCallPosition;

        // Show dealer
        var dealerPos = this.getPreviousPlayerPosition(this.firstCallPosition);
        this.getGameLayer().showDealer(this.getPlayerDisplayLocation(dealerPos));

        var cardSuite = [];
        while (packet.Buffer.isReadable()) // my card
        {
            var card = decode(packet.Buffer.readByte());
            card.setScale(0.9);
            cardSuite.push(card);
            this.myPokerSuite.addCard(card);
            logMessage("Card:" + card.id);
        }
        this.getMyClientState().setOnhandCard(cardSuite);

        // calculate small blind, big blind
        var smallBlindPlayer = this.getPlayer(this.activePlayerPosition);
        if(smallBlindPlayer == null)
        {
            return;
        }
        smallBlindPlayer.setBetMoney(this.tableBetMoney);
        this.getGameLayer().updateBetMoney(this.activePlayerPosition, this.tableBetMoney);
        this.increaseCash(smallBlindPlayer, -1 * this.tableBetMoney, "Cược");

        this.getNextActivePlayerPosition();
        var bigBlindPlayer = this.getPlayer(this.activePlayerPosition);
        if(bigBlindPlayer == null)
        {
            return;
        }
        bigBlindPlayer.setBetMoney(this.tableBetMoney * 2);
        this.getGameLayer().updateBetMoney(this.activePlayerPosition, 2* this.tableBetMoney);
        this.increaseCash(bigBlindPlayer, -2 * this.tableBetMoney, "Cược");

        // Create card for all player
        var myPos = this.getMyPos();
        for (i=0; i < this.PlayerState.length; i++) {
            if (this.PlayerState[i].serverPosition != myPos) {
                var tempSuite = [];
                var card1 = decode(5);
                card1.showBackMask(true);
                card1.removeAllEventListener();
                tempSuite.push(card1);
                var card2 = decode(5);
                card2.showBackMask(true);
                card2.removeAllEventListener();
                tempSuite.push(card2);
                this.PlayerState[i].setOnhandCard(tempSuite);
            }
        }

        // calculate first bet player
        this.getNextActivePlayerPosition();

        this.getGameLayer().onDealCardReturn();
    },

    getPreviousPlayerPosition:function(playerPos)
    {
        var count = 0;
        var pos = playerPos;
        do
        {
            pos = Math.floor(pos + this.maxPlayer - 1)% this.maxPlayer;

            var player = this.getPlayer(pos);
            if(player != null) {
                return pos;
            }
            count++;
        }
        while( count < 10);
        return -1;
    },

    processPickCard:function(packet) {
        logMessage("Poker Logic: processPickCard");
        this.currentBetMoney = 0;

        if (this.tableSuite == null) {
            this.tableSuite = [];
        }

        var newCard = [];

        while (packet.Buffer.isReadable())
        {
            var card = decode(packet.Buffer.readByte());
            card.removeAllEventListener();
            this.tableSuite.push(card);
            this.myPokerSuite.addCard(card);
            newCard.push(card);
            logMessage("Pick card:" + card.id);
        }

        this.calculateFistPlayerForNewRound();

        this.sendCheckForAllIn();

        this.getGameLayer().onPickCard(newCard);

        var self = this;
        var fcb = function(playeri){
            self.processNextEventInQueue();
        };
        this.processBetMoney(fcb);
    },

    showPokerSuiteName:function(pos, suiteName) {
        this.getGameLayer().showResultPokerSuiteName(pos, suiteName);
    },

    isWinner:function(pos, winPos) {
        if (winPos ==null) {
            return false;
        }
        for (var i =0; i< winPos.length; i++) {
            if (pos == winPos[i]) {
                return true;
            }
        }
        return false;
    },

    processFinishGame:function(buffer) {
        this._super();

        logMessage("Poker Logic: processFinishGame");
        this.gameStatus = GAME_STATE_FINISH;
        var winCount = buffer.readByte();
        this.winPosition = [];
        for (var i = 0; i < winCount; i++) {
            this.winPosition[i] = buffer.readByte();
        }
        this.needToShowSuiteName = false;

        while (buffer.isReadable())
        {
            this.needToShowSuiteName = true;
            var position = buffer.readByte();
            var cardId1 = buffer.readByte();
            var cardId2 = buffer.readByte();
            //if (position != this.getMyPos()) {
                var player = this.getPlayer(position);
                var card1 = player.updateOnhandCard(cardId1, 0);
                var card2 = player.updateOnhandCard(cardId2, 1);

                // Show ket qua cua tung player
                var pokerSuite = new BkPokerCardSuite();
                pokerSuite.setCardSuite(this.tableSuite);
                pokerSuite.addCard(card1);
                pokerSuite.addCard(card2);
                var suiteName = pokerSuite.getBiggestSuiteName();

                if (!this.isWinner(position, this.winPosition)) {
                    // Show suite name
                    this.showPokerSuiteName(position, suiteName);
                    card1.showBlackMask();
                    card2.showBlackMask();
                }
            //}
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
        var i;
        this.currentBetMoney = packet.Buffer.readInt();

        // No need to set total bet money
        this.totalBetMoney = packet.Buffer.readInt();

        this.raisePosition = packet.Buffer.readByte();
        this.firstCallPosition = packet.Buffer.readByte();
        this.activePlayerPosition = packet.Buffer.readByte();

        if (this.tableSuite!= null) {
            this.getGameLayer().clearTableCard();
        }
        this.tableSuite = [];

        var tableSuiteCount = packet.Buffer.readByte();
        for (i=0; i < tableSuiteCount; i++) {
            var card = decode(packet.Buffer.readByte());
            card.removeAllEventListener();
            this.tableSuite.push(card);
        }

        // Show table card
        this.getGameLayer().showCardNumber = 0;
        this.getGameLayer().showTableCard(this.tableSuite);

        // Add table suite to poker suite
        this.myPokerSuite = new BkPokerCardSuite();
        this.myPokerSuite.setCardSuite(this.tableSuite);

        // read player
        while (packet.Buffer.isReadable()) {
            var playerPos = packet.Buffer.readByte();
            var player = this.getPlayer(playerPos);
            if(player == null)
            {
                return;
            }
            player.setBetMoney(packet.Buffer.readInt());
            var isContinue = packet.Buffer.readByte();
            player.isFinishedGame = (isContinue == 0);
            player.isPlaying = true;

            if (!player.isFinishedGame) {
                this.totalBetMoney -= player.betMoney;
            } else {
                player.betMoney = 0;
            }

            if (playerPos == this.getMyPos()) {
                var cardSuite = [];
                for (i = 0; i< 2; i++) {
                    var card = decode(packet.Buffer.readByte());
                    card.removeAllEventListener();
                    if (player.isFinishedGame) {
                        card.showBlackMask();
                    }
                    card.setScale(0.9);
                    this.myPokerSuite.addCard(card);
                    logMessage("Card id:" + card.id);
                    cardSuite.push(card);
                }
                player.setOnhandCard(cardSuite);
            } else {
                if (!player.isFinishedGame) {
                    var tempSuite = [];
                    var card1 = decode(5);
                    card1.showBackMask(true);
                    card1.removeAllEventListener();
                    tempSuite.push(card1);
                    var card2 = decode(5);
                    card2.showBackMask(true);
                    card2.removeAllEventListener();
                    tempSuite.push(card2);
                    player.setOnhandCard(tempSuite);
                }
            }
            this.getGameLayer().onTableSynForPlayer(player);
        }
        // Reset poker myPokerSuite if player isn't playing
        var myPlayer = this.getMyClientState();
        if (!myPlayer.isPlaying) {
            this.myPokerSuite = new BkPokerCardSuite();
        }
        this.getGameLayer().showTableBetMoney();
        this.getGameLayer().onTableSynReturn();
        if (!this.getMyClientState().isPlaying) {
            showToastMessage(BkConstString.STR_JOIN_DURING_GAME, 480, 312, 3, 500);
        }
    },

    calculateFistPlayerForNewRound:function() {
        this.activePlayerPosition = this.firstCallPosition;
        var player = this.getPlayer(this.activePlayerPosition);
        if (player != null && !player.isFinishedGame && player.isPlaying) {
            return;
        }
        this.getNextActivePlayerPosition();
    },

    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_PICK_CARD_RETURN:
                return true;
        }
        return this._super(eventType);
    },
    updateMoneyAfterFinishGame:function() {
        if (BkGlobal.currentGS != GS.INGAME_GAME){
            logMessage("BkGlobal.currentGS != GS.INGAME_GAME -> don't process next");
            return;
        }
        this._super();
        // Show winner
        this.getGameLayer().showMultiWinner();
    },

/*
 * handle all Poker ingame event
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
            case  c.NETWORK_PICK_CARD_RETURN:
                this.processPickCard(packet);
                break;
            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame(packet.Buffer);
                break;
            default:{
                logMessage("Bk Poker not process packet, send to base class");
                this._super(packet);
            }
        }
    }
});