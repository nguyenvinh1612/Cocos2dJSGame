/**
 * Created by bs on 06/10/2015.
 */

var TEXT_MARGIN_TOP_BUTTOM = 23;
var DEFAULT_TIME_COUNT_DOWN = 15;
var BET_OPTION_Y = -20.5;
var AVAR_OPACITY = 180;
var COUNT_DOWN_TIME_ZO = 100;

BkPlayer = BkSprite.extend({

    numberHasBonus:0,
    playerData:null,
    lbName:null,
    lbMoney:null,
    cdSprite:null,
    chubanSprite:null,
    avatarSprite:null,
    bgInfoSprite:null,
    lvSprite:null,
    status:2, // PLAYER_STATE_NOT_READY = 2;
    gameTable:null,
    clientState:null,
    bgSprite:null,
    bgSpriteXito:null,
    imgRank:null,
    ImgSanSang:null,
    imgColdLose:null,
    imgWin:null,
    imgAutoWin:null,
    spriteBatch:null,
    toolTip:null,
    spriteFrameCache: cc.spriteFrameCache,

    imgWinLose:null,
    imgFold:null,
    imgRaise:null,
    imgCheck:null,
    imgAllIn:null,
    lblResult:null,
    cardBg:null,
    betMoney:null,
    maskNotReady:null,
    //mainSprite:null,

    ctor:function (data,status) {
        if (data != undefined) {
            this.playerData = data;
            this.status = status;
        }
        this._super();
        this._initPlayerSprite();
        this.initEventListener();
    },

    _initPlayerSprite:function()
    {
        this.spriteFrameCache.addSpriteFrames(res.Player_Asset_plist, res.Player_Asset_img);
        this.bgSprite = new BkSprite("#bgPlayer.png");
        this.addChild(this.bgSprite);
        this.bgSprite.x = this.getContentSize().width/2;
        this.bgSprite.y = this.getContentSize().height/2;

        this.avatarSprite = new BkSprite("#bginvitedFR.png");
        this.addChild(this.avatarSprite);
        this.avatarSprite.x = this.getContentSize().width/2;
        this.avatarSprite.y = this.getContentSize().height/2;

        // new bg info
        this.initBginfoSprite();
        this.lbName = new BkLabel("","",13,true);
        this.lbName.setTextColor(BkColor.DEFAULT_TEXT_COLOR);
        this.lbName.x =  this.bgInfoSprite.x ;//+ 5;
        this.lbName.y =  this.bgInfoSprite.y - 10;
        this.addChild(this.lbName,100);

        this.lbMoney = new BkLabel("","",12,true);
        this.lbMoney.setTextColor(cc.color(255,255,0));
        this.lbMoney.x = this.bgInfoSprite.x - 25;
        this.lbMoney.y = this.bgInfoSprite.y + 8;
        this.addChild(this.lbMoney,101);

        this.lvSprite = new BkSprite();
        this.lvSprite.x = this.bgInfoSprite.x - this.lvSprite.getContentSize().width + 4;
        this.lvSprite.y = this.bgInfoSprite.y + 8;
        this.addChild(this.lvSprite);
        this._configViewPlayer();
    },
    initBginfoSprite:function()
    {

        this.bgInfoSprite = new BkSprite("#" + res_name.info_player);
        this.bgInfoSprite.x = this.avatarSprite.x;
        this.bgInfoSprite.y = this.avatarSprite.y - 63;
        this.addChild(this.bgInfoSprite,-1);

    },
    initCountDown:function()
    {
        var self = this;
        var f= function(){
            logMessage("finish cb");
            self.stopCountDown();
        };
        // if(!BkGlobal.isGameCo())
        // {
        //     this.cdSprite = new BkCountDownTime(res.circle_cd);
        //
        // }else
        // {
        //     this.cdSprite = new BkCountDownTime(res.square_cd);
        // }

        this.cdSprite = new BkCountDownTime(res.circle_cd);
        this.cdSprite.x = this.getContentSize().width/2;
        this.cdSprite.y = this.getContentSize().height/2;
        this.cdSprite.setCallback(f);
        this.addChild(this.cdSprite,COUNT_DOWN_TIME_ZO);
    },

    showXitoWinner:function(location) {
        if (location == 1 || location == 2 || location == 3) {
            this.spWinnerXitoBg = new BkSprite("#" + res_name.xito_win_bg_border_r);
            this.spWinnerXitoBg.x =  (this.bgSprite.getWidth() - this.spWinnerXitoBg.getWidth()) / 2;
        } else {
            this.spWinnerXitoBg = new BkSprite("#" + res_name.xito_win_bg_border_l);
            this.spWinnerXitoBg.x =  -1 * (this.bgSprite.getWidth() - this.spWinnerXitoBg.getWidth()) / 2;
        }
        this.addChild(this.spWinnerXitoBg);
    },

    clearResult:function() {
        if (this.spWinnerXitoBg != null) {
            this.spWinnerXitoBg.removeSelf();
            this.spWinnerXitoBg = null;
        }
        if (this.lblResult != null) {
            this.lblResult.removeFromParent();
            this.lblResult = null;
        }
    },

    show3CayBetMoney:function(money, location) {
        if (this.betMoney == null) {
            this.betMoney = new BkPhingSprite();
            this.betMoney.updatePhingType(2);
            this.addChild(this.betMoney);
        }
        this.betMoney.setMoney(money);
        if (location == 1 || location == 2 || location ==3) {
            this.betMoney.x = - 66 - this.betMoney.getWidth() / 2;
        } else {
            this.betMoney.x = 86;
        }
        this.betMoney.y = -60;
    },

    clearBetMoney:function() {
        if (this.betMoney != null) {
            this.betMoney.removeFromParent();
            this.betMoney = null;
        }
    },

    initEventListener:function() {
        logMessage("initEventListener BkPlayer");
        this.clearEventListener();
        if (!this.visible){
            logMessage("!this.visible");
            return;
        }
        this.bgSprite.setMouseOnHover(function(event){});
        var self = this;
        this.bgSprite.setOnlickListenner(function(touch, event){
            var deltaTime = BkTime.GetCurrentTime() - self.gameTable.lastTimeSendChat;
            logMessage("deltaTime "+deltaTime);
            if (deltaTime < 1000){
                return;
            }

            if(self.playerData == null) {
                if (self.gameTable != null) {
                    self.gameTable.processShowInviteWindows();
                }
            } else {
                if (self.gameTable != null) {
                    self.gameTable.processOverViewPlayer(self.getPlayerName());
                    self.initplayerOverviewData();
                }
            }
        });
    },
    initplayerOverviewData:function () {
        var self = this;
        self.gameTable.playerOverviewData = new BkUserData();
        self.gameTable.playerOverviewData.setUserName(self.getPlayerName());
    },
    addEventListenerforbgInfoSprite:function()
    {
        var self = this;
        this.bgInfoSprite.setMouseOnHover(function(event){});
        this.bgInfoSprite.setOnlickListenner(function(touch, event){
            var deltaTime = BkTime.GetCurrentTime() - self.gameTable.lastTimeSendChat;
            logMessage("deltaTime "+deltaTime);
            if (deltaTime < 1000){
                return;
            }
            if (self.gameTable != null)
            {
                self.gameTable.processOverViewPlayer(self.getPlayerName());
            }
        });
    },
    setIsVisible:function (isVi) {
        this.isVisible = isVi;
    },

    setStatus:function(status)
    {
      this.status = status;
      this._configViewPlayer();
    },

    setGameTable:function (gt)
    {
        this.gameTable = gt;
    },
    setClientState:function(cs)
    {
        this.clientState = cs;
    },
    setPlayerdata:function(data,isNewLevel){
        this.playerData = data;
        if(isNewLevel != undefined)
        {
            this._configViewPlayer(isNewLevel);
        }else
        {
            this._configViewPlayer();
        }
    },
    getPlayerName:function()
    {
        if (this.playerData == null) {
            return null;
        } else {
            return this.playerData.getUserName();
        }
    },

    reset:function(){
        this.clearAllMask();
        this._configViewPlayer();
    },

    _configViewPlayer:function(isNewLevel)
    {
        //logMessage("config view Player");
        this.showBossTableFlag();
        this.avatarSprite.removeFromParent();
        if(this.bgInfoSprite != undefined && this.bgInfoSprite != null)
        {
            this.bgInfoSprite.removeFromParent();
        }
        if (this.playerData != null)
        {
            this.lbName.setString(Util.trimName(this.playerData.userName,12));
            this.lbMoney.setString(convertStringToMoneyFormatIngame(this.playerData.playerMoney));
            if(BkGlobal.isGameCo())
            {
                this.avatarSprite =  BkAvartarImg.getImageFromID(this.playerData.getAvatarId());
                this.avatarSprite.setScale(0.75,0.75);
                this.avatarSprite.x = this.getContentSize().width/2;
                this.avatarSprite.y = this.getContentSize().height/2 - 1;
            }else
            {
                this.initBginfoSprite();
                this.addEventListenerforbgInfoSprite();
                this.avatarSprite =  BkAvartarImg.getCircleImageFromID(this.playerData.getAvatarId());
                this.avatarSprite.setScale(0.95,0.95);
                this.avatarSprite.x = this.getContentSize().width/2;
                this.avatarSprite.y = this.getContentSize().height/2 - 1;
            }
            this.addChild(this.avatarSprite);
            this.avatarSprite.setVisible(true);
            this.lbName.setVisible(true);
            this.lbMoney.setVisible(true);

            if (this.bgSpriteXito == null) {
                this.bgSprite.setVisible(true);
            }
            this.lvSprite.setVisible(true);
            this.chubanSprite.setVisible(false);
            if(isNewLevel != undefined && isNewLevel == true)
            {
                this.setLevelSprite(this.playerData.getLevel());
                return;
            }
            if (this.status == PLAYER_STATE_TABLE_OWNER){
                this.chubanSprite.setVisible(true);
            }

            if ((this.status != PLAYER_STATE_READY)&&(this.status != PLAYER_STATE_TABLE_OWNER)){
                this.showMaskNotReady();
            } else {
                //this.clearAllMask();
                this.clearImgMaskNotReady();
            }
            this.setLevelSprite(this.playerData.getLevel());
        } else
        {
            this.avatarSprite = new BkSprite("#bginvitedFR.png");
            this.addChild(this.avatarSprite);
            this.chubanSprite.setVisible(false);
            this.lbName.setVisible(false);
            this.lbMoney.setVisible(false);
            this.bgSprite.setVisible(false);
            this.lvSprite.setVisible(false);
            if (this.bgSpriteXito != null) {
                this.bgSpriteXito.setVisible(false);
                this.bgSpriteXito = null;
            }
            this.showImgReady();
            this.clearAllMask();
            this.clearImgReady();
            this.clearBetMoney();
        }
    },
    clearAllMask:function()
    {
        this.clearWinLose();
        this.ClearRank();
        this.clearColdLose();
        this.clearAutoWin();
        this.clearBoLuotMark();
        this.clearAlert1Card();
        this.clearBaoSam();
        this.clearAnSam();
        this.clearWinSplash();
        this.clearBetOption();
        this.clearAllPhomSplash();
        this.clearScore();
        this.clearLoseSplash();
        this.clearResult();
        //this.clearImgMaskNotReady();
    },

    showBossTableFlag:function()
    {
        var isShow = (this.status === PLAYER_STATE_TABLE_OWNER);
        if(this.chubanSprite == null)
        {
            this.chubanSprite = new BkSprite("#icon_chuban.png");
            this.chubanSprite.x =  this.getContentSize().width/2 - 30;
            this.chubanSprite.y =  this.getContentSize().height/2 + 35;
            this.addChild(this.chubanSprite,102);
        }
        this.chubanSprite.visible = isShow ;
    },

    showCountDownTime:function(timeCountDown){
        if (timeCountDown == undefined){
            timeCountDown = DEFAULT_TIME_COUNT_DOWN;
        }
        if (this.cdSprite!= null){
            this.cdSprite.removeFromParent();
            this.cdSprite = null;
        }
        this.initCountDown();
        this.cdSprite.showCountDown(timeCountDown);
    },
    onFinishCountDown:function(){

    },
    stopCountDown:function()
    {
        if (this.cdSprite!= null){
            this.cdSprite.removeCountDown();
            this.cdSprite = null;
        }
    },

    setBoLuotStatus:function(isBoLuot)
    {

        if(this.imgBoLuot == null)
        {
            this.imgBoLuot = new BkSprite("#imgBoluot.png");
            this.imgBoLuot.x = 0;
            this.imgBoLuot.y = -5;
            this.addChild(this.imgBoLuot,this.avatarSprite.getLocalZOrder() + 1);
        }
        this.imgBoLuot.visible = isBoLuot;
    },
    updateMoney:function(newMoney)
    {
        if (this.playerData != null)
        {
            if(newMoney >= 0)
            {
                this.playerData.setMoney(newMoney);
                this.lbMoney.setString(convertStringToMoneyFormatIngame(this.playerData.playerMoney));
            }
        }
    },



    clearWinLose:function() {
        if (this.imgWinLose != null) {
            this.imgWinLose.removeFromParent();
            this.imgWinLose = null;
        }
    },

    showWinLose:function(isWin) {
        this.clearWinLose();
        if (isWin) {
            this.imgWinLose = new BkSprite("#Thang.png");
        } else {
            this.imgWinLose = new BkSprite("#Thua.png");
        }
        this.imgWinLose.visible = true;
        this.addChild(this.imgWinLose, this.avatarSprite.getLocalZOrder() + 1);
    },
    showLoseSplash:function()
    {
        if(this.imgLose == null)
        {
            this.imgLose = new BkSprite("#Thua.png");
            this.imgLose.x = 0;
            this.imgLose.y = 0;
            this.addChild(this.imgLose,this.avatarSprite.getLocalZOrder() + 1);
        }
    },
    clearLoseSplash:function()
    {
        if (this.imgLose != null) {
            this.imgLose.removeFromParent();
            this.imgLose = null;
        }
    },
    showWinSplash:function()
    {
        if(this.imgWin == null)
        {
            this.imgWin = new BkSprite("#Thang.png");
            this.imgWin.x = 0;
            this.imgWin.y = 0;
            this.addChild(this.imgWin,this.avatarSprite.getLocalZOrder() + 1);
        }
    },
    clearWinSplash:function()
    {
        if (this.imgWin != null) {
            this.imgWin.removeFromParent();
            this.imgWin = null;
        }
    },

    showFold:function() {
        this.clearBetOption();
        this.imgFold = new BkSprite("#" + res_name.round_bet_fold);
        this.imgFold.y = BET_OPTION_Y;
        this.addChild(this.imgFold, this.avatarSprite.getLocalZOrder() + 1);
    },

    showRaise:function() {
        this.clearBetOption();
        this.imgRaise = new BkSprite("#" + res_name.round_bet_raise);
        this.imgRaise.y = BET_OPTION_Y;
        this.addChild(this.imgRaise, this.avatarSprite.getLocalZOrder() + 1);
    },

    showCheck:function() {
        this.clearBetOption();
        this.imgCheck = new BkSprite("#" + res_name.round_bet_check);
        this.imgCheck.y = BET_OPTION_Y;
        this.addChild(this.imgCheck, this.avatarSprite.getLocalZOrder() + 1);
    },

    clearCardBg:function(disPos) {
        if (this.cardBg != null) {
            this.cardBg.removeFromParent();
            this.cardBg = null;
        }
    },

    showBetBg:function(disPos, duration) {
        // Change bg
        if (this.cardBg != null)
        {
            return;
        }
        if (this.bgSpriteXito != null) {
            this.bgSpriteXito.removeFromParent();
        }
        if (disPos ==0 || disPos == 4 || disPos ==5) {
            this.bgSpriteXito = new BkSprite("#" + res_name.xito_bg_r);
            this.bgSpriteXito.x = 24.94;
        } else {
            this.bgSpriteXito = new BkSprite("#" + res_name.xito_bg_l);
            this.bgSpriteXito.x = -24.98;
        }
        this.addChild(this.bgSpriteXito, this.bgSprite.getLocalZOrder() -1);
        //this.bgSprite.setOpacity(0);
        //this.bgSprite.setVisible(false);

        this.cardBg = new BkSprite9();
        this.cardBg.init(new BkSprite(res.black_bg_l), new BkSprite(res.black_bg_r), new BkSprite(res.black_bg_c));
        if (disPos ==0 || disPos == 4 || disPos ==5) {
            this.cardBg.x = 94.8;
            this.cardBg.scaleRight(167, duration);
        } else {
            this.cardBg.x = -94.8;
            this.cardBg.scaleLeft(167, duration);
        }
        this.addChild(this.cardBg, -3);
    },



    showAllIn:function() {
        this.clearBetOption();
        this.imgAllIn = new BkSprite("#" + res_name.round_bet_all_in);
        this.imgAllIn.y = BET_OPTION_Y;
        this.addChild(this.imgAllIn, this.avatarSprite.getLocalZOrder() + 1);
    },

    clearBetOptionForNewRound:function() {
        this.clearCheck();
        this.clearRaise();
    },

    clearBetOption:function() {
        this.clearAllIn();
        this.clearCheck();
        this.clearFold();
        this.clearRaise();
    },

    clearCheck:function() {
        if (this.imgCheck != null) {
            this.imgCheck.removeFromParent();
            this.imgCheck = null;
        }
    },

    clearRaise:function() {
        if (this.imgRaise != null) {
            this.imgRaise.removeFromParent();
            this.imgRaise = null;
        }
    },

    clearFold:function() {
        if (this.imgFold != null) {
            this.imgFold.removeFromParent();
            this.imgFold = null;
        }
    },

    clearAllIn:function() {
        if (this.imgAllIn != null) {
            this.imgAllIn.removeFromParent();
            this.imgAllIn = null;
        }
    },



    showRank:function(rank,numberOfPlayingPlayer)
    {
        this.ClearRank();
        if(numberOfPlayingPlayer == 2)
        {
            switch(rank)
            {
                case 0:
                    this.imgRank = new BkSprite("#Nhat.png");
                    break;
                case 1:
                    this.imgRank = new BkSprite("#Bet.png");
            }
        }else if(numberOfPlayingPlayer == 3)
        {
            switch(rank)
            {
                case 0:
                    this.imgRank = new BkSprite("#Nhat.png");
                    break;
                case 1:
                    this.imgRank = new BkSprite("#Nhi.png");

                    break;
                case 2:
                    this.imgRank = new BkSprite("#Bet.png");

                    break;
            }
        }
        else
        {
            switch(rank)
            {
                case 0:
                    this.imgRank = new BkSprite("#Nhat.png");
                    break;
                case 1:
                    this.imgRank = new BkSprite("#Nhi.png");

                    break;
                case 2:
                    this.imgRank = new BkSprite("#Ba.png");

                    break;
                case 3:
                    this.imgRank = new BkSprite("#Bet.png");
                    break;
            }
        }
        if(this.imgRank != null)
        {
            this.imgRank.x = 0;
            this.imgRank.y = 0;
            this.imgRank.visible = true;
            this.addChild(this.imgRank,this.avatarSprite.getLocalZOrder() + 1);
        }
    },

    ClearRank:function()
    {
        if(this.imgRank != null)
        {
            this.imgRank.removeFromParent();
            this.imgRank = null;
        }
    },
    clearBoLuotMark:function()
    {
        if(this.imgBoLuot != null)
        {
            this.imgBoLuot.removeFromParent();
            this.imgBoLuot = null;
        }
    },
    clearColdLose:function()
    {
        if(this.imgColdLose != null)
        {
            this.imgColdLose.removeFromParent();
            this.imgColdLose = null;
        }
    },
    clearImgReady:function()
    {
        if(this.ImgSanSang != null)
        {
            this.ImgSanSang.removeFromParent();
            this.ImgSanSang = null;
        }
    },
    showImgReady:function()
    {
        if(this.ImgSanSang == null)
        {
            this.ImgSanSang =  new BkSprite("#Ready.png");
            this.ImgSanSang.x = 0;
            this.ImgSanSang.y = 0;
            this.addChild(this.ImgSanSang,this.avatarSprite.getLocalZOrder() + 1)
        }
    },
    clearImgMaskNotReady:function()
    {
        this.bgSprite.opacity = 255;
        this.avatarSprite.opacity = 255;
        if(this.bgInfoSprite != undefined && this.bgInfoSprite != null)
        {
            this.bgInfoSprite.opacity = 255;
        }
    },
    showMaskNotReady:function(){
        this.bgSprite.opacity = AVAR_OPACITY;
        this.avatarSprite.opacity = AVAR_OPACITY;
        if(this.bgInfoSprite != undefined && this.bgInfoSprite != null)
        {
            this.bgInfoSprite.opacity = AVAR_OPACITY;
        }
    },
    showColdLose:function()
    {
        if(this.imgColdLose == null)
        {
            this.imgColdLose = new BkSprite("#cong.png");
            this.imgColdLose.x = 0;
            this.imgColdLose.y = 0;
            this.addChild(this.imgColdLose,this.avatarSprite.getLocalZOrder() + 1);
        }
        this.imgColdLose.visible = true;
    },

    showAutoWin:function()
    {
        if(this.imgAutoWin == null)
        {
            this.imgAutoWin = new BkSprite("#AutoWin.png");
            this.imgAutoWin.x = 0;
            this.imgAutoWin.y = 0;
            this.addChild(this.imgAutoWin,this.avatarSprite.getLocalZOrder() + 1);
        }
        this.imgAutoWin.visible = true;
    },
    showMauBinh:function()
    {
        if(this.imgAutoWin == null)
        {
            this.imgAutoWin = new BkSprite("#maubinh.png");
            this.imgAutoWin.x = 0;
            this.imgAutoWin.y = 0;
            this.addChild(this.imgAutoWin,this.avatarSprite.getLocalZOrder() + 1);
        }
        this.imgAutoWin.visible = true;
    },
    showSap3Chi:function()
    {
        if(this.imgLose == null)
        {
            this.imgLose = new BkSprite("#"+res_name.text_sap3chi);
            this.imgLose.x = 0;
            this.imgLose.y = 0;
            this.addChild(this.imgLose,this.avatarSprite.getLocalZOrder() + 1);
        }
    },
    clearAutoWin:function()
    {
        if(this.imgAutoWin != null)
        {
            this.imgAutoWin.removeFromParent();
            this.imgAutoWin = null;
        }
    },

    baoSam:function(isBao) {
        if(this.imgBaoSam == null)
        {
            if(isBao) {
                this.imgBaoSam = new BkSprite("#BaoSam.jpg");
            } else {
                this.imgBaoSam = new BkSprite("#KoBaoSam.jpg");
            }
            this.imgBaoSam.x = 0;
            this.imgBaoSam.y = 0;
            this.addChild(this.imgBaoSam,this.avatarSprite.getLocalZOrder() + 1);
        }
        this.imgBaoSam.visible = true;
    },
    clearBaoSam:function()
    {
        if(this.imgBaoSam != null)
        {
            this.imgBaoSam.removeFromParent();
            this.imgBaoSam = null;
        }
    },
    alert1Card:function(isAlert) {
        if(isAlert)
        {
            if(this.imgAlert1Card == null)
            {
                this.imgAlert1Card = new BkSprite("#Alert1Card.jpg");
                this.addChild(this.imgAlert1Card,this.avatarSprite.getLocalZOrder() + 1);
                this.imgAlert1Card.x = 0;
                this.imgAlert1Card.y = 20;
            }
            this.imgAlert1Card.visible = true;
        }else
        {
            this.clearAlert1Card();
        }

    },
    clearAlert1Card:function()
    {
        if(this.imgAlert1Card != null)
        {
            this.imgAlert1Card.removeFromParent();
            this.imgAlert1Card = null;
        }
    },
    anSam:function(isAnSam)
    {
        this.clearAnSam();
        if(this.imgAnSam == null)
        {
            if (isAnSam){
                this.imgAnSam = new BkSprite("#AnSam.jpg");
            } else{
                this.imgAnSam = new BkSprite("#DenSam.jpg");
            }
            this.addChild(this.imgAnSam,this.avatarSprite.getLocalZOrder() + 1);
            this.imgAnSam.x = 0;
            this.imgAnSam.y = 0;
        }
        this.imgAnSam.visible = true;
    },
    showMom:function(){
        if(this.imgChay == null)
        {
            this.imgChay = new BkSprite("#Chay.png");
            this.addChild(this.imgChay,this.avatarSprite.getLocalZOrder() + 1);
            this.imgChay.x = 0;
            this.imgChay.y = 0;
        }
        this.imgChay.visible = true;
    },
    showSplashU:function(){
        // TODO:implement later
        if(this.imgU == null)
        {
            this.imgU = new BkSprite("#U.png");
            this.addChild(this.imgU,this.avatarSprite.getLocalZOrder() + 1);
            this.imgU.x = 0;
            this.imgU.y = 0;
        }
        this.imgU.visible = true;
    },
    showUDen:function(){
        if(this.imgDenLang == null)
        {
            this.imgDenLang = new BkSprite("#Den.png");
            this.addChild(this.imgDenLang,this.avatarSprite.getLocalZOrder() + 1);
            this.imgDenLang.x = 0;
            this.imgDenLang.y = 0;
        }
        this.imgDenLang.visible = true;
    },
    clearAllPhomSplash:function(){
        if(this.imgDenLang != null)
        {
            this.imgDenLang.removeFromParent();
            this.imgDenLang = null;
        }
        if(this.imgU != null)
        {
            this.imgU.removeFromParent();
            this.imgU = null;
        }
        if(this.imgChay != null)
        {
            this.imgChay.removeFromParent();
            this.imgChay = null;
        }
    },
    clearAnSam:function()
    {
        if(this.imgAnSam != null)
        {
            this.imgAnSam.removeFromParent();
            this.imgAnSam = null;
        }
    },
    clearScore:function()
    {
        if(this.txtscore != null)
        {
            this.txtscore.removeFromParent();
            this.txtscore = null;
        }
    },
    alertDiscardSuccess:function(isXepXong)
    {
        if(this.txtscore == null)
        {
            this.txtscore = new BkLabel("", "", 17);
            this.addChild(this.txtscore, this.avatarSprite.getLocalZOrder() + 1);
            this.txtscore.x = 0;
            this.txtscore.y = 65;
        }
        if(isXepXong)
        {
            this.txtscore.setString("Xong");
        }else
        {
            this.txtscore.setString("Đang xếp");
        }
    },
    clearEventListener:function()
    {
        cc.eventManager.removeListener(this.OnMouseMoveListener);
        cc.eventManager.removeListener(this.bgSprite.OnMouseMoveListener);
        cc.eventManager.removeListener(this.bgSprite.OnClickListener);
        if(this.bgInfoSprite != undefined && this.bgInfoSprite != null)
        {
            cc.eventManager.removeListener(this.bgInfoSprite.OnMouseMoveListener);
            cc.eventManager.removeListener(this.bgInfoSprite.OnClickListener);
        }
    },
    setLevelSprite:function(level) {
        this.clearLevelSprite();
        this.lvSprite.addChild(BkLevelImage.createLevelStarHorizontalSprite(level));
        if (this.playerData != null){
            if ((this.status != PLAYER_STATE_READY)&&(this.status != PLAYER_STATE_TABLE_OWNER)){
                this.lvSprite.setOpacity(AVAR_OPACITY);
            } else {
                this.lvSprite.setOpacity(255);
            }
        }

    },
    clearLevelSprite: function () {
        if(this.lvSprite != null)
        {
            this.lvSprite.removeAllChildren();
        }
    },
    showEmotionWithIndex:function(index){
        if (!BkGlobal.isLoadedChatEmo){
            logMessage("chat emo not loaded -> reject command!");
            return;
        }
        if (this.spriteBatch != null){
            this.spriteBatch.removeEmo();
        }
        this.spriteBatch = new BkChatEmoSprite(Util.getChatEmoDataWithIndex(index+1));

        // this.addChild(this.spriteBatch,1000);
        // this.spriteBatch.x = this.avatarSprite.x;
        // this.spriteBatch.y = this.avatarSprite.y;

        var crSc = getCurrentScene();
        if (crSc!= null){
            crSc.addChild(this.spriteBatch,1000000000);
            this.spriteBatch.x = this.x;
            this.spriteBatch.y = this.y;
        }

        this.spriteBatch.showEmo();
    },

    showChatWithContent:function(chatMsg,xPos,yPos){
        if (this.toolTip != null){
            this.toolTip.finishAutoHide();
        }
        this.toolTip = new BkToolTip(res_name.ToastBG_png);
        this.toolTip.setWidthToolTip(0);
        this.toolTip.setContentText(chatMsg);
        if (+this.toolTip.textLabel.getContentSize().width>150){
            this.toolTip.setWidthToolTip(150);
            this.toolTip.setContentText(chatMsg);
        }
        this.toolTip.setTextColor(cc.color(255,255,255));
        var timeAH = 3;
        var self = this;
        this.toolTip.setRemoveCallback(function(){
            self.toolTip = null;
        });
        this.toolTip.setAutoHideAfter(timeAH);
        this.toolTip.show(xPos,yPos);
    }
});