/**
 * Created by Vu Viet Dung on 11/30/2015.
 */

PHINH_LAYER = 20;
CARD_LAYER = 10;
PHINH_MOVE_DURATION = 0.4;

BkRoundBetGameLayer = BkBaseIngameLayer.extend({
    showCardNumber:0,
    btnRaise:null,
    btnFold:null,
    btnCheck:null,
    btnAllIn:null,
    phingBetMoney:null,
    betMoney:null,
    betMoneyCount:0,

    sliderBetMoney:null,
    lblMoneyForBet:null,
    rdGroupBetMoney:null,

    btnBetGroup:null,
    betxTimeButton:null,

    roundBetMoney:null,

    ctor:function(){
        this._super();

        // lbl Table bet money
        this.phingBetMoney = new BkPhingSprite(0,1);
        var moneyPoint = this.getCenterBetMoneyPos();
        this.phingBetMoney.x = moneyPoint.x;
        this.phingBetMoney.y = moneyPoint.y;
        this.addChild(this.phingBetMoney, PHINH_LAYER);

        this.btnBetGroup = new BkSprite("#" + res_name.bg_bet_button_group);
        this.btnBetGroup.x = 485;
        this.btnBetGroup.y = 80;
        this.btnBetGroup.visible = false;
        this.addChild(this.btnBetGroup);

        this.initBetButtonGroup();

        this.initSliderBetMoney();

        this.showGameButton(false);
    },

    BUTTON_ROW_P_LEFT:6,
    BUTTON_SPACE:5,

    initBetButtonGroup:function() {
        var self = this;

        this.btnCheck = createBkButtonPlistNewTitle(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Theo");
        this.btnCheck.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnCheck.x = this.BUTTON_ROW_P_LEFT + this.btnCheck.getContentSize().width / 2;
        this.btnCheck.y = 109;
        this.btnBetGroup.addChild(this.btnCheck);

        this.btnCheck.addClickEventListener(function(){
            logMessage("btnCheck clicked!");
            if (BkTime.GetCurrentTime() - self.btnCheck.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnCheck.lastTimeClick = BkTime.GetCurrentTime();
            self.getLogic().processCheckClick();
        });

        this.btnFold = createBkButtonPlistNewTitle(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Úp bài");
        this.btnFold.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnFold.x = this.btnCheck.x + (this.btnCheck.getContentSize().width
            + this.btnFold.getContentSize().width) / 2 +this.BUTTON_SPACE;
        this.btnFold.y = 109;
        this.btnBetGroup.addChild(this.btnFold);
        this.btnFold.addClickEventListener(function(){
            logMessage("btnFold clicked!");
            if (BkTime.GetCurrentTime() - self.btnFold.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnFold.lastTimeClick = BkTime.GetCurrentTime();
            self.getLogic().processFoldClick();
        });

        this.btnAllIn = createBkButtonPlistNewTitle(res_name.btn_allIn, res_name.btn_allIn_press, res_name.btn_allIn_hover,
            res_name.btn_allIn_hover,"Tố tất");
        Util.setBkButtonShadow(this.btnAllIn);
        this.btnAllIn.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnAllIn.x = this.btnFold.x
            + (this.btnAllIn.getContentSize().width + this.btnFold.getContentSize().width) /2 + this.BUTTON_SPACE;
        this.btnAllIn.y = 109;
        this.btnBetGroup.addChild(this.btnAllIn);
        this.btnAllIn.addClickEventListener(function(){
            logMessage("btnAllIn clicked!");
            if (BkTime.GetCurrentTime() - self.btnAllIn.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnAllIn.lastTimeClick = BkTime.GetCurrentTime();
            self.getLogic().processAllInClick();
        });

        this.btnRaise = createBkButtonPlistNewTitle(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Tố");
        this.btnRaise.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnRaise.x = this.BUTTON_ROW_P_LEFT + this.btnRaise.getContentSize().width / 2;
        this.btnRaise.y = 63;
        this.btnBetGroup.addChild(this.btnRaise);
        this.btnRaise.addClickEventListener(function(){
            logMessage("btnRaise clicked!");
            if (BkTime.GetCurrentTime() - self.btnRaise.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnRaise.lastTimeClick = BkTime.GetCurrentTime();
            var textMoney = self.lblMoneyForBet.getString();
            if (IsNumeric(textMoney)) {
                self.getLogic().processRaiseClick(textMoney);
            }
        });

        var lblBetMoneyBg = new BkSprite("#" + res_name.bg_lbl_bet_money);
        lblBetMoneyBg.x = this.btnRaise.x
            + (this.btnRaise.getContentSize().width + lblBetMoneyBg.getWidth()) / 2 + this.BUTTON_SPACE;
        lblBetMoneyBg.y = this.btnRaise.y;
        this.btnBetGroup.addChild(lblBetMoneyBg);
    },

    onTableInfoReturn:function() {
        this._super();
        this.resetSliderBetMoney();
    },

    initPhingBetMoney:function() {
        if (this.roundBetMoney == null) {
            this.roundBetMoney = [];
            for (var i =0; i< this.getLogic().maxPlayer; i++) {
                var phing = new BkPhingSprite(0);
                var phingPos = getPhingLocation(BkGlobal.currentGameID, i, this.getLogic().maxPlayer);
                phing.x = phingPos.x;
                phing.y = phingPos.y;
                this.roundBetMoney.push(phing);
                this.addChild(phing, PHINH_LAYER);
            }
        }
    },

    updateBetMoney:function(serverPos, money) {
        // init phingBetMoney
        if (this.roundBetMoney == null) {
            this.initPhingBetMoney();
        }
        var dPos = this.getLogic().getPlayerDisplayLocation(serverPos);

        logMessage("updateBetMoney dPos " + dPos);
        this.roundBetMoney[dPos].setMoney(money);

        if (dPos == 1 || dPos == 2 || dPos ==3) {
            if (BkGlobal.currentGameID != GID.XITO) {
                var phinhPos = getPhingLocation(BkGlobal.currentGameID, dPos, this.getLogic().maxPlayer);
                this.roundBetMoney[dPos].x = phinhPos.x + 20 - this.roundBetMoney[dPos].getWidth() / 2;
            }
        }
    },

    onUpdateTableMoneyStatus:function()
    {
        this._super();
        this.resetSliderBetMoney();
    },

    resetSliderBetMoney: function () {
        this.lblMoneyForBet.setString(this.getLogic().tableBetMoney);
        this.sliderBetMoney.updateSliderPos(0);
    },
    
    initSliderBetMoney:function() {
        // label bet money
        this.lblMoneyForBet = new BkLabel("0", "", 14);
        this.lblMoneyForBet.x = 170;
        this.lblMoneyForBet.y = 63;
        this.btnBetGroup.addChild(this.lblMoneyForBet);

        // slider bet money
        this.sliderBetMoney = new BkSlider();
        this.sliderBetMoney.loadBarTexture(res_name.slider_tract,ccui.Widget.PLIST_TEXTURE);
        this.sliderBetMoney.loadSlidBallTextures(res_name.slider_ball, res_name.slider_ball_press,null,ccui.Widget.PLIST_TEXTURE);
        this.sliderBetMoney.loadProgressBarTexture(res_name.slider_progress,ccui.Widget.PLIST_TEXTURE);
        this.sliderBetMoney.setCapInsets(cc.rect(0, 0, 0, 0));
        this.sliderBetMoney.setContentSize(cc.size(244, 10));
        this.sliderBetMoney.x = 8 + this.sliderBetMoney.getContentSize().width / 2;
        this.sliderBetMoney.y = 33;
        this.sliderBetMoney.addEventListener(this.sliderEvent, this);
        this.btnBetGroup.addChild(this.sliderBetMoney);

        this.betxTimeButton = [];
        var self = this;
        for (var i=0; i < 5; i++) {
            var str = "x";
            if (i == 0) {
                str = str + "1";
            } else {
                str = str + (i * 5);
            }
            var btnNumber = createBkButtonPlist(res_name.invisible_btn, res_name.invisible_btn, res_name.invisible_btn,
                res_name.invisible_btn,str);
            //btnNumber.setTitleFontSize(14);
            btnNumber.setTitleColor(cc.color.WHITE);
            btnNumber.btnid = i;
            btnNumber.addClickEventListener(function(){
                logMessage("click to number" + this.btnid);
                self.sliderBetMoney.updateSliderPos(this.btnid);
                var money = self.getLogic().tableBetMoney * this.btnid * 5;
                if (money == 0) {
                    money = self.getLogic().tableBetMoney;
                }
                self.lblMoneyForBet.setString(money);

            });
            btnNumber.x = 15 + i * 58;
            btnNumber.y = 15;
            this.btnBetGroup.addChild(btnNumber);
            this.betxTimeButton.push(btnNumber);
        }
    },

    sliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED:
                var slider = sender;
                var percent = Math.floor(slider.getPercent() * 19 / 100);
                var tableMoney = this.getLogic().tableBetMoney;
                var money = tableMoney + percent * tableMoney;
                this.lblMoneyForBet.setString(money);
                break;
            default:
                break;
        }
    },

    getCenterBetMoneyPos:function() {
        var xPos = 300;
        var yPos = 300;
        return cc.p(xPos,yPos);
    },


    // warning-> duplicate : co function tuong tu o baseIngameLayer : ShowCicleCountDownTimeOnActivePlayer
    showActivePlayer:function() {
        for (var i=0; i< this.getLogic().maxPlayer; i++)
        {
            var tempAvatar = this.PlayerAvatar[i];
            if (tempAvatar != null)
            {
                tempAvatar.stopCountDown();
            }
        }
        var activePlayerPos = this.getLogic().getActivePlayerPos();
        var pAvatar = this.getAvatarByServerPos(activePlayerPos);
        if (pAvatar!= null) {
            pAvatar.showCountDownTime(30);
        }
        this.updateGameButton();
    },


    onRaise:function(playerPos, money) {
        // show raise
        var pAvatar = this.getAvatarByServerPos(playerPos);
        pAvatar.showRaise();

        this.updateBetMoney(playerPos, money);
        this.showActivePlayer();

    },

    onAllIn:function(serverPos, money) {
        // show all in
        var pAvatar = this.getAvatarByServerPos(serverPos);
        pAvatar.showAllIn();

        if (money != null) {
            this.updateBetMoney(serverPos, money);
        }
        // Show count down
        this.showActivePlayer();
    },

    onCheck:function(checkPlayer, money) {
        // show check
        var pAvatar = this.getAvatarByServerPos(checkPlayer);
        pAvatar.showCheck();

        if (money != null) {
            this.updateBetMoney(checkPlayer, money);
        }
        // Show count down
        this.showActivePlayer();
    },

    onFold:function(foldPlayer) {
        // show fold
        var pAvatar = this.getAvatarByServerPos(foldPlayer);
        pAvatar.showFold();
        this.showActivePlayer();
    },

    clearBetOptionForNewRound:function() {
        if (this.PlayerAvatar != null) {
            for (var i=0; i< this.PlayerAvatar.length; i++) {
                this.PlayerAvatar[i].clearBetOptionForNewRound();
            }
        }
    },

    onTableSynReturn:function() {
        this.showActivePlayer();
    },

    showTotalBetMoney:function() {
        this.phingBetMoney.setMoney(this.getLogic().totalBetMoney);
    },

    // TODO: Need to update for other game - function getCardDisplayLocation
    onDisplay:function(serverPos) {
        logMessage("Discard card");
        var player = this.getLogic().getPlayer(serverPos);
        var displayPos =  this.getLogic().getPlayerDisplayLocation(serverPos);
        var cardSuite;
        cardSuite = player.getOnHandCard();
        if (cardSuite != null) {
            for(var i = 0; i < cardSuite.length; i++) {
                var cardPos = getCardDisplayLocation(GID.POKER, displayPos, this.getLogic().maxPlayer, i);
                cardSuite[i].x = cardPos.x;
                cardSuite[i].y = cardPos.y;
                cardSuite[i].visible = true;
                this.addChild(cardSuite[i], CARD_LAYER);
                logMessage("Display pos" + displayPos + " Card " + cardSuite[i].id);
            }
        }
    },

    removeOnHandCardEventListener:function() {
        var myCS = this.getLogic().getMyClientState();
        if (myCS == null){
            return;
        }
        var myCard = this.getLogic().getMyClientState().getOnHandCard();
        for (var i=0; i< myCard.length; i++) {
            myCard[i].removeAllEventListener();
        }
    },

    winMoneyEffect:function(winnerPos, money) {
        logMessage("Move win money:" + money +" to winner:" + winnerPos);
        var displayPos = this.getLogic().getPlayerDisplayLocation(winnerPos);
        var phing = new BkPhingSprite(money);
        var post1 = this.getCenterBetMoneyPos();
        var post2 = _getAvatarLocationPos(displayPos,
            this.getLogic().maxPlayer,BkGlobal.currentGameID);
        phing.x = post1.x;
        phing.y = post1.y;
        this.addChild(phing, PHINH_LAYER);

        var self = this;
        phing.setCallbackMoveFinish(function() {
            self.showNextWinner();
        });
        phing.move(PHINH_MOVE_DURATION,post2.x, post2.y);
    },

    showMultiWinner:function() {
        var winnerPlayer = this.getLogic().winPosition;
        logMessage("showPokerWinner win0: " + winnerPlayer[0]);
        if (winnerPlayer != null) {
            this.qWinner = new BkQueue();
            for (var i=0; i<winnerPlayer.length; i++) {
                this.qWinner.push(winnerPlayer[i]);
            }
        }
        this.showNextWinner();
    },

    showNextWinner:function() {
        //this.unschedule(this.showNextWinner);
        logMessage("showNextWinner");
        if (this.qWinner == null || this.qWinner.isEmpty()) {
            logMessage("finish show winner, process next queue event");
            this.getLogic().processNextEventInQueue();
            return;
        }
        var winner = this.qWinner.pop();
        this.showSingleWinner(winner);
    },

    removePlayerBetMoney:function(playerPos, betMoney) {
        var displayPos = this.getLogic().getPlayerDisplayLocation(playerPos);

        // Clear player bet money
        this.roundBetMoney[displayPos].setMoney(0);
        var phing = new BkPhingSprite(betMoney);
        var post = this.getCenterBetMoneyPos();
        phing.x = this.roundBetMoney[displayPos].x;
        phing.y = this.roundBetMoney[displayPos].y;
        this.addChild(phing, PHINH_LAYER);
        var self = this;

        phing.setCallbackMoveFinish(function(betMoneyObject) {
            var money = betMoneyObject.getMoney();
            self.phingBetMoney.addMoney(money);
        });

        phing.move(PHINH_MOVE_DURATION,post.x, post.y);
    },

    betMoneyEffect:function(fromPos, money, callbackFun) {
        var displayPos = this.getLogic().getPlayerDisplayLocation(fromPos);
        var phing = new BkPhingSprite(money);
        var post1 = _getAvatarLocationPos(displayPos, this.getLogic().maxPlayer,BkGlobal.currentGameID);
        var post2 = this.getCenterBetMoneyPos();
        phing.x = post1.x;
        phing.y = post1.y;
        this.addChild(phing, PHINH_LAYER);
        var self = this;

        phing.setCallbackMoveFinish(function(betMoneyObject) {
            self.betMoneyCount--;
            logMessage("FinishBetMoneyEffect" + self.betMoneyCount);
            var money = betMoneyObject.getMoney();
            self.phingBetMoney.addMoney(money);
            if (self.betMoneyCount == 0) {
                if (callbackFun != null) {
                    callbackFun();
                }
            }
        });
        phing.move(PHINH_MOVE_DURATION,post2.x, post2.y);
    },

    playerBetMoney:function(serverPos, money, callbackFun, count) {
        this.betMoneyEffect(serverPos, money, callbackFun);
        this.updateBetMoney(serverPos, 0);
    },

    showGameButton:function(isShow) {
        this.btnBetGroup.visible = true;
		if (this.betxTimeButton != null) {
            for (var i=0; i< this.betxTimeButton.length; i++) {
                this.betxTimeButton[i].setEnableEventButton(isShow);
                this.betxTimeButton[i].setEnabled(isShow);
            }
        }

        this.sliderBetMoney.setEnable(isShow);

        if (isShow) {
            this.btnBetGroup.setOpacity(255);
        } else {
            this.btnBetGroup.setOpacity(100);
        }

        this.btnCheck.setEnableButton(isShow);
        this.btnFold.setEnableButton(isShow);
        this.btnRaise.setEnableButton(isShow);
        this.btnAllIn.setEnableButton(isShow);
    },

    onPlayerStatusUpdate:function(displayPos, status) {
        this._super(displayPos, status);
        if(!this.getLogic().isInGameProgress()) {
            this.showGameButton(false);
        }
    },

    updateGameButton:function() {
        if (!this.getLogic().isInGameProgress()) {
            this.showGameButton(false);
            return;
        }
        if (this.getLogic().isIAmActive()) {
            this.showGameButton(true);
        } else {
            this.showGameButton(false);
        }
    },

    updateWinner:function(serverPos, isWin, winMoney){
        this.winMoneyEffect(serverPos, winMoney);
        var pAvatar = this.getAvatarByServerPos(serverPos);
        pAvatar.showWinLose(isWin);
    },

    showTableBetMoney:function() {
        logMessage("Show table bet money: " + this.getLogic().totalBetMoney);
        this.phingBetMoney.setMoney(this.getLogic().totalBetMoney);
    },

    onPickCard:function(cardSuite) {
        this.showTableCard(cardSuite);
        this.showActivePlayer();
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
    },
    getCustomGameButtonList:function()
    {
        var rtnlist = [];
        rtnlist.push(this.btnAllIn);
        rtnlist.push(this.btnCheck);
        rtnlist.push(this.btnFold);
        rtnlist.push(this.btnRaise);
        return rtnlist;
    }
});