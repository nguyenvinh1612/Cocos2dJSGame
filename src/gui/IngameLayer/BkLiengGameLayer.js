/**
 * Created by Vu Viet Dung on 11/30/2015.
 */

BkLiengGameLayer = BkRoundBetGameLayer.extend({
    qWinner:null,
    gamePoints:null,
    lblsuiteName:null,

    ctor:function(){
        this._super();

        this.lblsuiteName = new BkLabel("","",16);
        this.lblsuiteName.setTextColor(cc.color(255,255,225));
        var pos = _getAvatarLocationPos(0, 6, GID.LIENG);
        this.lblsuiteName.y = pos.y - 45;
        this.lblsuiteName.x = pos.x + 175;
        this.addChild(this.lblsuiteName);
        this.lblsuiteName.setVisible(false);
        // Update layout
        this.btnStartGame.y = 320;
        this.btnReady.y = 320;
    },

    clearSuiteName:function() {
        this.lblsuiteName.setString("");
    },

    clearAllAvatar: function () {
        this._super();

        if (this.gamePoints != null) {
            for (var i = 0; i < this.getLogic().maxPlayer; i++) {
                if (this.gamePoints[i] != null) {
                    this.gamePoints[i].removeFromParent();
                    this.gamePoints[i] = null;
                }
            }
        }
    },

    onTableLeavePush:function(player)
    {
        this._super(player);

        var displayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);

        if (this.gamePoints != null && this.gamePoints[displayPos] != null) {
            this.gamePoints[displayPos].removeFromParent();
            this.gamePoints[displayPos] = null;
        }
    },

    clearCurrentGameGui:function() {
        this._super();

        if (this.gamePoints != null) {
            for (var i = 0; i < this.getLogic().maxPlayer; i++) {
                if (this.gamePoints[i] != null) {
                    this.gamePoints[i].removeFromParent();
                    this.gamePoints[i] = null;
                }
            }
        }
    },



	showMySuiteName:function() {
        var onhandCard = this.getLogic().getMyClientState().getOnHandCard();
        if (onhandCard == null || onhandCard.length ==0) {
            this.clearSuiteName();
        } else {
            var liengSuite = new BkLiengCardSuite();
            liengSuite.setCardSuite(onhandCard);
            var suiteName = liengSuite.getSuiteName();
            this.lblsuiteName.setString(suiteName);
            var pos = _getAvatarLocationPos(0, 6, GID.LIENG);
            this.lblsuiteName.x = pos.x + 175 - this.lblsuiteName.getContentSize().width / 2;
        }
    },

    onTableLeavePush:function(player)
    {
        this._super(player);
        var displayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
    },

    getCenterBetMoneyPos:function() {
        var xPos = 480;
        var yPos = 400;
        return cc.p(xPos,yPos);
    },

    initPhingBetMoney:function() {
        this._super();
        // config view
        for (var i=0; i< this.roundBetMoney.length; i++) {
            this.roundBetMoney[i].updatePhingType(2);
        }
    },

    showPlayingCardForPlayer:function() {
        // Show card for all other player
        for (var i=0; i <this.getLogic().maxPlayer; i++) {
            if (i == this.getLogic().getMyPos()) {
                continue;
            }
            var player = this.getLogic().getPlayer(i);
            if (player != null) {
                var cardSuite = player.getOnHandCard();
                if (cardSuite == null) {
                    continue;
                }
                var displayPos = this.getLogic().getPlayerDisplayLocation(i);
                for (var j = 0; j< cardSuite.length; j++) {
                    var cardPos = getLiengCardDisplayLocation(displayPos, this.getLogic().maxPlayer, j);
                    cardSuite[j].x = cardPos.x;
                    cardSuite[j].y = cardPos.y;
                    cardSuite[j].setScale(LIENG_CARD_SCALE);
                    this.addChild(cardSuite[j], CARD_LAYER);
                }
            }
        }
    },

    onDealCardReturn:function() {
        var self = this;
        var fcb = function(playeri){
        };

        var finishDealingCB = function() {
            self.showTotalBetMoney();

            // Show card of other player
            self.showPlayingCardForPlayer();
            self.removeOnHandCardEventListener();
            self.showMySuiteName();
            self.showActivePlayer();
            self.getLogic().processNextEventInQueue();
        };

        Util.animateDealCard(this.getLogic(),this,3,finishDealingCB,fcb,false,3,30);
    },


    showSingleWinner: function (winPos) {
        logMessage("showLiengResultWinner pos" + winPos);
        var disPlayPos = this.getLogic().getPlayerDisplayLocation(winPos);
        var player = this.getLogic().getPlayer(winPos);

        this.updateWinner(winPos, true, player.totalChangedMoney);
        this.getLogic().increaseCash(player, player.totalChangedMoney, "Thắng");
        logMessage("Win money player: " + player.getName() + " - win money: " + player.totalChangedMoney);
    },

    onTableSynForPlayer:function(player) {
        this.updatePlayerAvatar(player.serverPosition);
        var disPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        var cardSuite = player.getOnHandCard();
        if (cardSuite != null) {
            for (var i=0; i < cardSuite.length; i++) {
                var pos = getLiengCardDisplayLocation(disPos, 6, i);
                cardSuite[i].x = pos.x;
                cardSuite[i].y = pos.y;
                this.addChild(cardSuite[i], CARD_LAYER);
            }
        }
    },

    showSuiteName:function(serverPos, result, winnerFlag) {
        logMessage("showBaCayResult pos:" + serverPos + " result:" + result);
        var pos = this.getLogic().getPlayerDisplayLocation(serverPos);
        if (this.gamePoints == null) {
            this.gamePoints = [];
        }

        // Remove old suite name
        if (this.gamePoints[pos] != null) {
            this.gamePoints[pos].removeFromParent();
            this.gamePoints[pos] = null;
        }

        // add new suite name
        var spPoint = new BkSprite("#" + res_name.bg_suite_name);
        var lblPoint = new cc.LabelBMFont(result, res.BITMAP_GAME_FONT);
        lblPoint.x = spPoint.getWidth() / 2;
        lblPoint.y = spPoint.getHeight() / 2 + 3;
        spPoint.addChild(lblPoint);
        this.gamePoints[pos] = spPoint;
        var cardPos = getLiengCardDisplayLocation(pos, this.getLogic().maxPlayer, 1);
        spPoint.x = cardPos.x;
        spPoint.y = cardPos.y - 17;
        this.addChild(spPoint, RESULT_SUITE_NAME_LAYER);
    }
});