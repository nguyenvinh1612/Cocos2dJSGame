/**
 * Created by Vu Viet Dung on 11/30/2015.
 */

BkBaCayGameLayer = BkBaseIngameLayer.extend({
    btnLatBai:null,
    btnBetMoney:null,
    tableTime:null,
    gamePoints:null,

    rdGroupBetMoney:null,
    btnBetGroup:null,
    lblMoneyForBet:null,

    ctor:function(){
        this._super();

        this.btnStartGame.y = 320;
        this.btnReady.y = 320;

        // init bet money group
        this.initGameButton();
    },

    showCountDownForMe:function(xSec,isAutoStartGame)
    {
        this._super(xSec,isAutoStartGame);
        var myPlayer = this.getLogic().getMyClientState();

        if (myPlayer == null){
            logMessage("is invalid game state -> get table info & sync event");
            this.getLogic().networkGetTableInfo();
            return;
        }

        if (myPlayer.status == PLAYER_STATE_TABLE_OWNER) {
            //if (this.countdownText != null) {
            //    this.countdownText.y = this.btnStartGame.y;
            //    this.countdownText.x = this.btnStartGame.x + this.btnStartGame.getContentSize().width /2 + 30;
            //}
            if (this.countdownText != null) {
                this.countdownText.y = this.btnReady.y + 38;
                this.countdownText.x = this.btnReady.x;
            }
        } else {
            if (this.countdownText != null) {
                this.countdownText.y = this.btnReady.y + 38;
                this.countdownText.x = this.btnReady.x;
            }
        }
    },

    initGameButton:function () {
        // Discard button
        var size = cc.winSize;

        this.btnLatBai = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Lật tất cả");
        this.btnLatBai.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnLatBai.x = size.width / 2 + 44;
        this.btnLatBai.y = 120;
        this.showOpenCard(false);

        var self = this;
        this.btnLatBai.addClickEventListener(function(){
            if (BkTime.GetCurrentTime() - self.btnLatBai.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            logMessage("btn lật bài clicked!");
            self.getLogic().processDiscardClick();
            self.btnLatBai.lastTimeClick = BkTime.GetCurrentTime();
        });
        this.addChild(this.btnLatBai);

        this.btnBetGroup = new BkSprite("#" + res_name.ba_cay_bet_table);
        this.btnBetGroup.x = size.width /2 + 5;
        this.btnBetGroup.y = (this.btnBetGroup.getContentSize().height) /2 + 40;

        this.btnBetMoney = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Cược");
        this.btnBetMoney.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnBetMoney.x = (this.btnBetMoney.getContentSize().width / 2) + 8;
        this.btnBetMoney.y = (this.btnBetMoney.getContentSize().height / 2) + 40;
        this.btnBetGroup.addChild(this.btnBetMoney);
        this.btnBetMoney.addClickEventListener(function()
        {
            if (BkTime.GetCurrentTime() - self.btnBetMoney.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnBetMoney.lastTimeClick = BkTime.GetCurrentTime();
            var textMoney = self.lblMoneyForBet.getString();
            if (IsNumeric(textMoney)) {
                logMessage("send bet money");
                self.getLogic().sendBetMoney(textMoney);
            }
        });
        this.showBetGroup(false);

        var lblBetMoneyBg = new BkSprite("#"  + res_name.bg_lbl_bet_money);
        lblBetMoneyBg.scaleX = 0.9;
        lblBetMoneyBg.x = this.btnBetMoney.x
            + (this.btnBetMoney.getContentSize().width + lblBetMoneyBg.getWidth()) / 2 + 5;
        lblBetMoneyBg.y = this.btnBetMoney.y;
        this.btnBetGroup.addChild(lblBetMoneyBg);

        this.lblMoneyForBet = new BkLabel("0", "", 14);
        this.lblMoneyForBet.x = lblBetMoneyBg.x;
        this.lblMoneyForBet.y = lblBetMoneyBg.y;
        this.btnBetGroup.addChild(this.lblMoneyForBet);

        // init radio group
        var radioSpace = 54;
        var rdData1Time = new BkRadioButtonData(1,1,"1");
        var bet1Time = new BkRadioButton(rdData1Time.description);
        bet1Time.setData(rdData1Time);
        bet1Time.x = 5;
        bet1Time.y = 10;
        this.btnBetGroup.addChild(bet1Time);

        var rdData2Time = new BkRadioButtonData(2,2,"2");
        var bet2Time = new BkRadioButton(rdData2Time.description);
        bet2Time.setData(rdData2Time);
        bet2Time.x = bet1Time.x + radioSpace;
        bet2Time.y = bet1Time.y;
        this.btnBetGroup.addChild(bet2Time);

        var rdData3Time = new BkRadioButtonData(3,3,"3");
        var bet3Time = new BkRadioButton(rdData3Time.description);
        bet3Time.setData(rdData3Time);
        bet3Time.x = bet2Time.x + radioSpace;
        bet3Time.y = bet2Time.y;
        this.btnBetGroup.addChild(bet3Time);

        var rdData4Time = new BkRadioButtonData(4,4,"4");
        var bet4Time = new BkRadioButton(rdData4Time.description);
        bet4Time.setData(rdData4Time);
        bet4Time.x = bet3Time.x + radioSpace;
        bet4Time.y = bet3Time.y;
        this.btnBetGroup.addChild(bet4Time);

        var rdData5Time = new BkRadioButtonData(5,5,"5");
        var bet5Time = new BkRadioButton(rdData5Time.description);
        bet5Time.setData(rdData5Time);
        bet5Time.x = bet4Time.x + radioSpace;
        bet5Time.y = bet4Time.y;
        this.btnBetGroup.addChild(bet5Time);

        this.rdGroupBetMoney = new BkRadioButtonGroup();
        bet1Time.setGroup(this.rdGroupBetMoney);
        bet2Time.setGroup(this.rdGroupBetMoney);
        bet3Time.setGroup(this.rdGroupBetMoney);
        bet4Time.setGroup(this.rdGroupBetMoney);
        bet5Time.setGroup(this.rdGroupBetMoney);

        this.rdGroupBetMoney.setOnSelectedCallback(function(){
            var selectRB= self.rdGroupBetMoney.getRadioButtonSelected();
            self.getLogic().processUpdateBetMoney(selectRB.getValue());
        });

        this.addChild(this.btnBetGroup);
    },

    setRadioBetMoney:function(value) {
        this.rdGroupBetMoney.setSelectRadio(value);
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

    onTableInfoReturn:function() {
        this._super();
        this.resetBetMoney();
    },

    onUpdateTableMoneyStatus:function()
    {
        this._super();
        this.resetBetMoney();
    },

    resetBetMoney:function () {
        this.lblMoneyForBet.setString(this.getLogic().tableBetMoney);
    },

    displayPlayerAvatar:function()
    {
        this._super();
        //for (var i=0; i< this.PlayerAvatar.length; i++) {
        //    this.PlayerAvatar[i].showBetBg(i);
        //}
    },

    onPrepareNewGame:function(){
        this._super();
        var myPlayer = this.getLogic().getMyClientState();
        if (myPlayer == null) {
            logMessage("My client state is null");
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

    showBaCayResult:function(serverPos, result) {
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
        //var lblPoint = new BkLabel(result, "", 17);
        var lblPoint = new cc.LabelBMFont(result, res.BITMAP_GAME_FONT);
        lblPoint.x = spPoint.getWidth() / 2;
        lblPoint.y = spPoint.getHeight() / 2 + 2;
        spPoint.addChild(lblPoint);
        this.gamePoints[pos] = spPoint;
        var cardPos = getBaCayCardDisplayLocation(pos, this.getLogic().maxPlayer, 1);
        spPoint.x = cardPos.x;
        spPoint.y = cardPos.y - 17;
        this.addChild(spPoint, RESULT_SUITE_NAME_LAYER);
    },

    onUpdateBetMoney:function(serverPos, betMoney) {
        var displayPos = this.getLogic().getPlayerDisplayLocation(serverPos);
        var pA = this.PlayerAvatar[displayPos];
        logMessage("Update bet money for player: " + pA.getPlayerName());
        pA.show3CayBetMoney(betMoney,displayPos);
    },

    onPlayerStatusUpdate:function(displayPos, status) {
        this._super(displayPos, status);
        // Ko hien thi nut cuoc neu minh san san
        var pA = this.PlayerAvatar[displayPos];
        var player = this.getLogic().getPlayerByName(pA.getPlayerName());
        if (displayPos == 0) {
            if (player.status == PLAYER_STATE_READY) {
                this.btnBetGroup.visible = false;
            } if (player.status == PLAYER_STATE_NOT_READY ) {
                this.btnBetGroup.visible = true;
            }
        }
        logMessage("Player Status update pos:" + displayPos + " status:" + player.status + " name" + pA.getPlayerName());
        if (player.status == PLAYER_STATE_READY) {
            if (player.betMoney == 0) {
                player.betMoney = this.getLogic().tableBetMoney;
            }
            pA.show3CayBetMoney(player.betMoney, displayPos);
        } else if (player.status == PLAYER_STATE_TABLE_OWNER) {
            pA.clearBetMoney();
        }
    },

    showOpenCard:function(isShow) {
        this.btnLatBai.setVisibleButton(isShow);
    },

    showBetGroup:function(isShow) {
        this.btnBetGroup.visible = isShow;
        this.btnBetMoney.setVisibleButton(isShow);
    },

    showStartGameButton:function(isReshowCountDown)
    {
        this._super(isReshowCountDown);
        var me = this.getLogic().getMyClientState();
        if (me == null) {
            return;
        }
        if (!this.getLogic().isInGameProgress() && !this.getLogic().isMeBossTable()) {
            this.showBetGroup(me.status == PLAYER_STATE_NOT_READY)
            //this.btnBetGroup.visible = (me.status == PLAYER_STATE_NOT_READY);
        } else {
            this.showBetGroup(false);
            //this.btnBetGroup.visible = false;
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
                    var cardPos = getBaCayCardDisplayLocation(displayPos, this.getLogic().maxPlayer, j);
                    cardSuite[j].x = cardPos.x;
                    cardSuite[j].y = cardPos.y;
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
            // Show card of other player
            self.showPlayingCardForPlayer();
            self.getLogic().processNextEventInQueue();
        };

        // Hien thi nut
        this.showOpenCard(true);
        this.showBetGroup(false);
        //this.btnBetGroup.visible = false;

        // Show count down time cho cac player khac
        this.showCountDownWithBG(29, 480, 340);

        Util.animateDealCard(this.getLogic(),this,3,finishDealingCB,fcb,false,3);
    },

    onDiscardSuccess:function() {
        this.showOpenCard(false);
        var myPlayer = this.getLogic().getMyClientState();
        var cardSuite = myPlayer.getOnHandCard();
        for(var i = 0; i < cardSuite.length; i++) {
            cardSuite[i].showBackMask(false);
        }

        //Show point
        var point = this.getLogic().getPoint(myPlayer);
        this.showBaCayResult(myPlayer.serverPosition, point + " Điểm");
    },

    synOnhandCard:function() {
        this.showOpenCard(true);
        var cardSuite = this.getLogic().getMyClientState().getOnHandCard();
        for (var i = 0; i < cardSuite.length; i++) {
            var card = cardSuite[i];
            var point = getBaCayCardDisplayLocation(0, this.getLogic().maxPlayer, i);
            card.x = point.x;
            card.y = point.y;
            card.showBackMask(true);
            this.addChild(card, CARD_LAYER);
        }
    },

    onDiscard:function(serverPos, showPoint) {
        logMessage("Discard card");
        var player = this.getLogic().getPlayer(serverPos);
        var displayPos =  this.getLogic().getPlayerDisplayLocation(serverPos);
        var cardSuite = player.getOnHandCard();
        if (cardSuite != null) {
            for(var i = 0; i < cardSuite.length; i++) {
                var cardPos = getBaCayCardDisplayLocation(displayPos, this.getLogic().maxPlayer, i);
                cardSuite[i].x = cardPos.x;
                cardSuite[i].y = cardPos.y;
                this.addChild(cardSuite[i], CARD_LAYER);
                logMessage("Display pos" + displayPos + " Card " + cardSuite[i].id);
            }
        }
        //Show point
        if (showPoint) {
            var point = this.getLogic().getPoint(player);
            this.showBaCayResult(serverPos, point + " Điểm");
        }
    },

    moveCashEffect:function(fromPos, toPos, money){
        var phing = new BkPhingSprite(money);
        var post1 = _getAvatarLocationPos(fromPos, this.getLogic().maxPlayer, GID.BA_CAY);
        var post2 = _getAvatarLocationPos(toPos, this.getLogic().maxPlayer, GID.BA_CAY);
        phing.x = post1.x;
        phing.y = post1.y;
        this.addChild(phing, PHINH_LAYER);
        phing.move(1,post2.x, post2.y);
    },

    updateWinner:function(displayPos, isWin){
        var pAvatar = this.PlayerAvatar[displayPos];
        pAvatar.showWinLose(isWin);
    },

    getCustomGameButtonList:function()
    {
        var rtnlist = [];
        rtnlist.push(this.btnBetMoney);
        rtnlist.push(this.btnLatBai);
        return rtnlist;
    },
    cancelSchedule:function()
    {
        var self = this;
        this.unschedule(self.getout);
    },
    getout:function()
    {
        var self = this;
        if (self.getLogic().getMyClientState() != null) {
            self.getLogic().getMyClientState().isLeaveRegistered = false;
            self.showRegExitSplash(false);
            self.getLogic().networkOutTable(0);
        }
    },
    scheduleGetOut:function(time)
    {
        var self = this;
        this.scheduleOnce(self.getout
        ,time);
    }
});