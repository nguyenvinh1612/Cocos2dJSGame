/**
 * Created by Vu Viet Dung on 11/30/2015.
 */
XITO_CARD_SCALE = 0.55;
BkXiToGameLayer = BkRoundBetGameLayer.extend({
    showCardNumber:0,

    betMoney:null,
    winnerPos:0,
    totalBetMoney:0,
    betMoneyCount:0,
    avatarCardBackground:[],
    lblLatQuan:null,
    gamePoints:null,

    ctor:function(){
        this._super();

        this.lblLatQuan = new BkLabel("","",16);
        this.lblLatQuan.setTextColor(cc.color(255,255,225));
        this.lblLatQuan.x = 515;
        this.lblLatQuan.y = 289;
        this.addChild(this.lblLatQuan,1000);

        this.showGameButton(false);

        this.btnStartGame.y = 320;
        this.btnReady.y = 320;
    },

    removePlayerAvatar:function(displayPosition)
    {
        this._super(displayPosition);
        var pAvatar = this.PlayerAvatar[displayPosition];
        pAvatar.clearCardBg();
    },

    initPhingBetMoney:function() {
        this._super();
        // config view
        for (var i=0; i< this.roundBetMoney.length; i++) {
            this.roundBetMoney[i].updatePhingType(2);
        }
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

    onTableSynReturn:function() {
        this.betMoneyCount = 0;
        // Check game state
        this.showActivePlayer();
        if (this.getLogic().gameStatus == GAME_STATE_WAIT_OPEN_1_CARD) {
            this.showCountDownWithBG(29);
            if (this.getLogic().getMyClientState().isPlaying) {
                var cardSuite = this.getLogic().getMyClientState().getOnHandCard();
                if (!this.getLogic().getMyClientState().isFlip) {
                    cardSuite[1].x += 40;
                    this.lblLatQuan.visible = true;
                    this.lblLatQuan.setString("Chọn cây mở bài");
                }
                this.getLogic().activePlayerPosition = this.getLogic().getMyPos();
            } else {
                this.getLogic().activePlayerPosition = -1;
            }
            this.showGameButton(false);
        }
    },

    onFinish:function(serverPos, card) {
        var displayPos =  this.getLogic().getPlayerDisplayLocation(serverPos);
        if (displayPos == 0) {
            var myCards = this.getLogic().getMyClientState().getOnHandCard();
            for (var i = 0; i < myCards.length; i++){
                myCards[i].showMask(false);
            }
            return;
        }
        card.showBackMask(false);
        logMessage("Display pos" + displayPos + " Card " + card.id + " index");
    },

    onShowCard:function(serverPos, card, index) {
        var displayPos =  this.getLogic().getPlayerDisplayLocation(serverPos);
        var player = this.getLogic().getPlayer(serverPos);
        if (player.isFinishedGame) {
            card.showBackMask(true);
        }
        var cardPos = getXitoCardDisplayLocation(displayPos, this.getLogic().maxPlayer, index);
        card.x = cardPos.x;
        card.y = cardPos.y;
        card.setScale(XITO_CARD_SCALE);
        this.addChild(card);
        logMessage("Display pos" + displayPos + " Card " + card.id + " index" + index);
        this.removeCountDownText();
    },

    onPickCard:function(serverPos, card, index) {
        var centerPoint = this.getCenterTablePos();
        var displayPos =  this.getLogic().getPlayerDisplayLocation(serverPos);
        var cardPos = getXitoCardDisplayLocation(displayPos, this.getLogic().maxPlayer, index);
        card.x = centerPoint.x;
        card.y = centerPoint.y;
        card.setScale(XITO_CARD_SCALE);
        this.addChild(card);
        card.move(0.2, cardPos.x, cardPos.y);
        logMessage("Display pos" + displayPos + " Card " + card.id + " index" + index);
        this.removeCountDownText();
    },

    onDiscard:function(serverPos, card) {
        var displayPos =  this.getLogic().getPlayerDisplayLocation(serverPos);
        if (displayPos == 0) {
            // Check card onhand
            var myCards = this.getLogic().getMyClientState().getOnHandCard();
            for (var i = 0; i < myCards.length; i++){
                if (myCards[i].id == card.id) {
                    myCards[i].showMask(false);
                    break;
                }
            }
            var cardPos = getXitoCardDisplayLocation(0, this.getLogic().maxPlayer,1);
            myCards[1].move(0.1, cardPos.x, cardPos.y);

            cardPos = getXitoCardDisplayLocation(0, this.getLogic().maxPlayer,0);
            myCards[0].move(0.1, cardPos.x, cardPos.y);

            // Stop count down for me
            var myAvatar = this.getAvatarByServerPos(serverPos);
            myAvatar.stopCountDown();
            this.lblLatQuan.setString("");

            return;
        }
        card.showBackMask(false);
        logMessage("onDiscard" + displayPos + " Card " + card.id);
    },

    onFold:function(foldPlayer) {
        this._super(foldPlayer);

        var player = this.getLogic().getPlayer(foldPlayer);
        var cardSuite = player.getOnHandCard();
        for (var i=0; i< cardSuite.length; i++) {
            cardSuite[i].showBackMask(true);
        }
    },

    getCenterBetMoneyPos:function() {
        var xPos = 480;
        var yPos = 400;
        return cc.p(xPos,yPos);
    },

    getCenterTablePos:function() {
        var xPos = cc.director.getWinSize().width/2 ;
        var yPos = cc.director.getWinSize().height/2 ;
        return cc.p(xPos,yPos);
    },

    showCardBgForPlayer:function(serverPos, duration) {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        var dPos = this.getLogic().getPlayerDisplayLocation(serverPos);
        pAvatar.showBetBg(dPos, duration);
    },

    onDealCardReturn:function() {
        var self = this;

        this.betMoneyCount = 0;
        var fcb = function(playeri){
        };

        var finishDealingCB = function() {
            self.lblLatQuan.setString("Chọn cây mở bài");

            var myCards = self.getLogic().getMyClientState().getOnHandCard();
            for (var i = 0; i < myCards.length; i++){
                var card = myCards[i];
                card.showMask(true);
            }

            // Show card for all other player
            for (var i=0; i <self.getLogic().maxPlayer; i++) {
                if (i == self.getLogic().getMyPos()) {
                    continue;
                }
                var player = self.getLogic().getPlayer(i);
                if (player != null) {
                    var cardSuite = player.getOnHandCard();
                    if (cardSuite == null) {
                        continue;
                    }
                    var displayPos = self.getLogic().getPlayerDisplayLocation(i);
                    for (var j = 0; j< cardSuite.length; j++) {
                        var cardPos = getXitoCardDisplayLocation(displayPos, self.getLogic().maxPlayer, j);
                        cardSuite[j].x = cardPos.x;
                        cardSuite[j].y = cardPos.y;
                        self.addChild(cardSuite[j]);
                    }
                }
            }
            self.getLogic().processNextEventInQueue();
        };

        this.showCountDownWithBG(29);
        this.showTotalBetMoney();
        this.showActivePlayer();
        this.showGameButton(false);

        Util.animateDealCard(this.getLogic(),this,2,finishDealingCB,fcb,false,3,60);
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

    showXiToWinner:function(serverPos, result) {
        var pos = this.getLogic().getPlayerDisplayLocation(serverPos);
        var pAvatar = this.getAvatarByServerPos(serverPos);
        pAvatar.showXitoWinner(pos);
        if (this.gamePoints == null) {
            this.gamePoints = [];
        }
        // Remove old suite name
        if (this.gamePoints[pos] != null) {
            this.gamePoints[pos].removeFromParent();
            this.gamePoints[pos] = null;
        }
        // Show winner
        var winnerAW = new BkSprite("#" + res_name.xito_win_card_border);
        var cardPos = getXitoCardDisplayLocation(pos, this.getLogic().maxPlayer, 2);
        winnerAW.x = cardPos.x;
        winnerAW.y = cardPos.y;

        var spPoint = new BkSprite("#" + res_name.xito_suite_name_bg);

        var lblPoint = new cc.LabelBMFont(result, res.BITMAP_GAME_FONT);
        lblPoint.x = spPoint.getWidth() / 2 + 2;
        lblPoint.y = spPoint.getHeight() / 2 + 2;
        lblPoint.setScale(0.8);
        spPoint.addChild(lblPoint, 1);
        spPoint.x = winnerAW.getWidth() /2;
        spPoint.y = winnerAW.getHeight() / 2 - 15;
        winnerAW.addChild(spPoint,1);
        this.gamePoints[pos] = winnerAW;
        this.addChild(winnerAW, RESULT_SUITE_NAME_LAYER);

    },

    showSuiteName:function(serverPos, result, isWinner) {
        if (isWinner) {
            this.showXiToWinner(serverPos, result);
            return;
        }
        logMessage("UI showSuiteName pos:" + pos + " suite name:" + result + " winner:" + isWinner);
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
        var spPoint = new BkSprite("#" + res_name.xito_suite_name_bg);
        var lblPoint = new cc.LabelBMFont(result, res.BITMAP_GAME_FONT);
        lblPoint.x = spPoint.getWidth() / 2+ 2;
        lblPoint.y = spPoint.getHeight() / 2 + 2;
        lblPoint.setScale(0.8);
        spPoint.addChild(lblPoint);
        this.gamePoints[pos] = spPoint;
        var cardPos = getXitoCardDisplayLocation(pos, this.getLogic().maxPlayer, 2);
        spPoint.x = cardPos.x;
        spPoint.y = cardPos.y - 15;
        this.addChild(spPoint, RESULT_SUITE_NAME_LAYER);
    }
});