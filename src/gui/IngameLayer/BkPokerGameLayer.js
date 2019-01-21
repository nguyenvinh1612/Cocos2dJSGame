/**
 * Created by Vu Viet Dung on 11/30/2015.
 */
RESULT_SUITE_NAME_LAYER = 30;
BkPokerGameLayer = BkRoundBetGameLayer.extend({
    showCardNumber:0,
    betMoneyCount:0,

    dealer:null,
    suiteName:null,
    suiteDetail:null,
    cardSuiteDetail:null,
    mouseOver:null,
    pokerSuiteName:null,
    tableSuiteName:null,
    qWinner:null,

    ctor:function(){
        this._super();

        this.dealer = new BkSprite("#" + res_name.poker_dealer);
        this.dealer.x = 250;
        this.dealer.y = 250;
        this.dealer.visible = false;
        this.addChild(this.dealer);
        this.initSuiteName();
        this.showSuiteName("");
    },

    showDealer:function(pos) {
        var dealerPos = getPokerDealerLocation(pos);
        this.dealer.x = dealerPos.x;
        this.dealer.y = dealerPos.y;
        this.dealer.visible = true;
        logMessage("Show dealer " + pos);
    },

    hideDealer:function() {
        this.dealer.visible = false;
    },


    showSuiteName:function(suiteName) {
        logMessage("Show Suite name");
        var isShow = true;
        if (suiteName == "") {
            isShow = false;
        }
        this.suiteName.visible = isShow;
        this.suiteName.setEnableEventButton(isShow);
        if (isShow) {
            this.suiteName.setTitleText(suiteName);
        }
        if (!isShow) {
            this.hideSuiteDetail();
        }
    },

    onTableLeavePush:function(player)
    {
        this._super(player);

        var displayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);

        if (this.pokerSuiteName != null && this.pokerSuiteName[displayPos] != null) {
            this.pokerSuiteName[displayPos].removeFromParent();
            this.pokerSuiteName[displayPos] = null;
        }
    },

    initSuiteName:function() {
        this.suiteName = createBkButtonPlist(res_name.bg_suite_name, res_name.bg_suite_name, res_name.bg_suite_name_hover,
            res_name.bg_suite_name_hover,"");
        this.suiteName.x = 291;
        this.suiteName.y = 87;
        this.suiteName.setTitleColor(cc.color(255, 255, 255));
        this.addChild(this.suiteName);

        var self = this;

        var suiteHoverBegan = function () {
            self.showSuiteDetail();
        };

        var suiteHoverEnd = function() {
            self.hideSuiteDetail();
            //logMessage("Mouse hover end");
        };
        this.suiteName.setHoverCallback(suiteHoverBegan, suiteHoverEnd);
    },

    hideSuiteDetail:function() {
        if (this.suiteDetail != null) {
            this.suiteDetail.visible = false;
        }
    },

    updateSuiteDetail:function() {
        if (this.suiteDetail == null) {
            this.initSuiteDetail();
        }
        // Remove current suite
        if (this.cardSuiteDetail != null) {
            for (var i=0; i< this.cardSuiteDetail.length; i++) {
                this.cardSuiteDetail[i].removeFromParent();
            }
        }
        this.cardSuiteDetail = [];
        // Add to suiteDetail
        var cardSuite = this.getLogic().getMyCardSuiteDetail();
        if (cardSuite != null) {
            for (var i=0; i< cardSuite.length; i++) {
                var newCard = decode(cardSuite[i].id);
                newCard.setScale(0.44);
                this.cardSuiteDetail.push(newCard);
                newCard.x = 24 + 40 * i;
                newCard.y = 28;
                this.suiteDetail.addChild(newCard, CARD_LAYER);
                logMessage("Suite detail card " + i + ": cardId" + newCard.id);
            }
        }
    },

    initSuiteDetail:function() {
        if (this.suiteDetail == null) {
            this.suiteDetail = new BkSprite("#" + res_name.bg_suite_detail);
            this.suiteDetail.x = 248;
            this.suiteDetail.y = 45;
            this.addChild(this.suiteDetail);
            this.suiteDetail.visible = false;
        }
    },

    showTableSuiteName:function(suitType) {
        if (this.tableSuiteName != null) {
            this.tableSuiteName.removeFromParent();
            this.tableSuiteName = null;
        }

        this.tableSuiteName = new BkSprite("#"+Util.getPokerSuiteResource(suitType));
        this.tableSuiteName.y = 350;
        this.tableSuiteName.x = 480;
        this.addChild(this.tableSuiteName, RESULT_SUITE_NAME_LAYER);
    },

    showSingleWinner: function (winPos) {
        // Show poker result
        logMessage("showPokerResultWinner pos" + winPos);
        var disPlayPos = this.getLogic().getPlayerDisplayLocation(winPos);
        var player = this.getLogic().getPlayer(winPos);

        if (this.getLogic().needToShowSuiteName) {
            var onHandCard = player.getOnHandCard();
            var tableCard = this.getLogic().tableSuite;
            var cardSuite = new BkPokerCardSuite();

            cardSuite.setCardSuite(tableCard);
            cardSuite.setCardSuite(onHandCard);
            var biggestSuite = cardSuite.getBiggestPokerSuite();

            if (disPlayPos != 0) {
                // Scale card
                if (onHandCard != null && onHandCard.length > 0) {
                    for (var i = 0; i < onHandCard.length; i++) {
                        var cardPos = getPokerFinishCardLocation(disPlayPos, this.getLogic().maxPlayer, i);
                        onHandCard[i].x = cardPos.x;
                        onHandCard[i].y = cardPos.y;
                        onHandCard[i].setScale(0.65);
                        if (cardInCardSuite(onHandCard[i], biggestSuite)) {
                            onHandCard[i].setScale(0.70);
                            onHandCard[i].y += 2;
                        }
                    }
                }
            }

            var notSelectCards = cardSuite.getCardNotInSuiteCard();
            for (var i = 0; i < notSelectCards.length; i++) {
                notSelectCards[i].showBlackMask();
            }
            this.showTableSuiteName(cardSuite.getBiggestSuiteType());
        }

        this.updateWinner(winPos, true, player.totalChangedMoney);
        this.getLogic().increaseCash(player, player.totalChangedMoney, "Thắng");
        logMessage("Win money player: " + player.getName() + " - win money: " + player.totalChangedMoney);
    },


    showSuiteDetail: function () {
        // Init suite
        if (this.suiteDetail == null) {
            this.updateSuiteDetail();
        }
        this.suiteDetail.visible = true;
    },

    getCenterBetMoneyPos:function() {
        var xPos = 478;
        var yPos = 248;
        return cc.p(xPos,yPos);
    },

    showResultPokerSuiteName:function(serverPos, result) {
        // Show result
        logMessage("showResultPokerSuiteName pos:" + serverPos + " result:" + result);
        var pos = this.getLogic().getPlayerDisplayLocation(serverPos);
        if (this.pokerSuiteName == null) {
            this.pokerSuiteName = [];
        }

        // Remove old suite name
        if (this.pokerSuiteName[pos] != null) {
            this.pokerSuiteName[pos].removeFromParent();
            this.pokerSuiteName[pos] = null;
        }

        // add new suite name
        var suiteSprite = new BkSprite("#" +res_name.result_normal_bg);
        var lblSuiteName = new BkLabel(result, "", 17);
        lblSuiteName.setTextColor(cc.color(255,255,255));
        lblSuiteName.x = suiteSprite.getWidth() / 2;
        lblSuiteName.y = suiteSprite.getHeight() / 2;
        suiteSprite.addChild(lblSuiteName);
        this.pokerSuiteName[pos] = suiteSprite;
        var cardPos = getPokerFinishCardLocation(pos, this.getLogic().maxPlayer, 0);
        suiteSprite.x = cardPos.x + 32;
        suiteSprite.y = cardPos.y;
        this.addChild(suiteSprite, RESULT_SUITE_NAME_LAYER);

        if (serverPos != this.getLogic().getMyPos()) {
            var cardSuite = this.getLogic().getPlayer(serverPos).getOnHandCard();
            if (cardSuite != null) {
                for (var i =0; i < cardSuite.length; i++) {
                    var cardPos = getPokerFinishCardLocation(pos, this.getLogic().maxPlayer, i);
                    cardSuite[i].x = cardPos.x + 30.5;
                    cardSuite[i].y = cardPos.y + 0.5;
                    cardSuite[i].setScale(0.65);
                }
            }
        }
    },

    showPlayingCardForPlayer:function(displayPos) {
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
                    var cardPos = getPokerCardLocation(displayPos, this.getLogic().maxPlayer, j);
                    cardSuite[j].x = cardPos.x;
                    cardSuite[j].y = cardPos.y;
                    cardSuite[j].setScale(0.40);
                    this.addChild(cardSuite[j], CARD_LAYER);
                }
            }
        }
    },


    onDealCardReturn:function() {
        var self = this;

        this.showCardNumber = 0;
        this.phingBetMoney.setMoney(0);
        this.betMoneyCount = 0;

        var fcb = function(playeri){

        };

        var finishDealingCB = function() {
            // Show my card suite
            self.updateSuiteDetail();
            self.showSuiteName(self.getLogic().getMyCardSuiteName());

            self.removeOnHandCardEventListener();
            // Show card of other player
            self.showPlayingCardForPlayer();

            // Show count down
            self.showActivePlayer();
            self.getLogic().processNextEventInQueue();
        };

        // Show bai cac player khac
        Util.animateDealCard(this.getLogic(),this,2,finishDealingCB,fcb,false,3);
    },

    onTableSynReturn:function() {
        this.showPlayingCardForPlayer();
        this.showSuiteName(this.getLogic().getMyCardSuiteName());
        this.showActivePlayer();
    },


    showTableCard:function(cardSuite) {
        // Show card on table center
        for (var i = 0; i < cardSuite.length; i++) {
            var card = cardSuite[i];
            var point = getPokerCenterPoint(this.showCardNumber + i);
            card.x = point.x ;
            card.y = 347;
            //card.y = point.y - 0.5;
            this.addChild(card, CARD_LAYER);
        }
        this.showCardNumber += cardSuite.length;
    },

    onPickCard:function(cardSuite) {
        this.showTableCard(cardSuite);
        this.showActivePlayer();
        this.updateSuiteDetail();
        this.showSuiteName(this.getLogic().getMyCardSuiteName());
        this.clearBetOptionForNewRound();
    },

    clearTableCard:function() {
        var suiteCard = this.getLogic().getTableSuite();
        if (suiteCard != null) {
            for (var i=0; i < suiteCard.length; i++) {
                suiteCard[i].removeSelf();
            }
        }
    },

    clearCurrentGameGui:function()
    {
        this._super();

        this.clearTableCard();
        this.hideDealer();

        if (this.pokerSuiteName != null) {
            for (var i=0; i<this.getLogic().maxPlayer; i++) {
                if (this.pokerSuiteName[i] != null) {
                    this.pokerSuiteName[i].removeFromParent();
                    this.pokerSuiteName[i] = null;
                }
            }
        }

        if (this.tableSuiteName != null) {
            this.tableSuiteName.removeFromParent();
            this.tableSuiteName = null;
        }

        this.showSuiteName("");
    },

    updatePlayerAvatar:function(serverPos) {
        var player = this.getLogic().getPlayer(serverPos);
        var avatar = this.getAvatarByServerPos(serverPos);
        if (avatar == null) {
            return;
        }
        if (player.isFinishedGame) {
            avatar.showFold();
        }
        this.updateBetMoney(serverPos,player.betMoney)
    },

    onFold:function(foldPlayer) {
        this._super(foldPlayer);

        var player = this.getLogic().getPlayer(foldPlayer);
        var cardSuite = player.getOnHandCard();
        // Check fold player
        if (foldPlayer == this.getLogic().getMyPos()) {
            // show black mask for my card
            if (cardSuite != null) {
                for (var i = 0; i < cardSuite.length; i++) {
                    // Remove card
                    cardSuite[i].showBlackMask();
                }
            }
        } else {
            // show black mask of fold player
            if (cardSuite != null) {
                for (var i = 0; i < cardSuite.length; i++) {
                    // Remove card
                    cardSuite[i].removeFromParent();
                }
            }
            player.setOnhandCard(null);
        }
    },

    // TODO: need to recheck this function
    onTableSynForPlayer:function(player) {
        this.updatePlayerAvatar(player.serverPosition);
        if (this.getLogic().getMyPos() == player.serverPosition) {
            var cardSuite = player.getOnHandCard();
            if (cardSuite != null) {
                for (var i=0; i < cardSuite.length; i++) {
                    var pos = getCardDisplayLocation(GID.POKER, 0, 6, i);
                    cardSuite[i].x = pos.x;
                    cardSuite[i].y = pos.y;
                    this.addChild(cardSuite[i], CARD_LAYER);
                }
            }
        }
    },
});