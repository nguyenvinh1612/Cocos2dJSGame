/**
 * Created by vinhnq on 10/20/2015.
 */
var BTN_INGAME_SIZE = 16;
BkBaseIngameLayer = BkBaseLayer.extend({
    numberAvarPos:0,
    PlayerAvatar:[],
    //background:null,
    btnStartGame:null,
    //btnBack:null,
    btnReady:null,
    txtBetMoney:null,
    imgCoin:null,
    countdownText:null,
    countdownTextYoffset:45,
    goldBox:null,
    settingBetmoneyWindow:null,

    ctor: function ()
    {
        this._super(GS.INGAME_GAME);
        this.initBaseElement();
        //changeGameBg(BkGlobal.currentGameID,BkGlobal.currentGS);
    },
    initBaseElement:function(){
        this.removeAllChildren(true);
        var size = cc.winSize;
        //this.setBackground(res.BG_Ingame);
        this.initTopBar();
        // ingame logo
        //if(BkGlobal.currentGameID != GID.CO_TUONG && BkGlobal.currentGameID != GID.CO_UP)
        //{
        //    this.imgLogo = new BkSprite(res.ingameLogo,this._getinGameLogo());
        //    if(this.imgLogo != null)
        //    {
        //        this.imgLogo.setScale(0.8);
        //        this.imgLogo.x = 565;
        //        this.imgLogo.y = 318;
        //        this.addChild(this.imgLogo);
        //    }
        //}
        ////Bắt đầu
        var  self = this;
        this.btnStartGame = createBkButtonPlistNewTitle(res_name.btn_ready_normal, res_name.btn_ready_normal, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Bắt đầu",size.width/2,size.height/2);
        Util.setBkButtonShadow(this.btnStartGame);
        this.btnStartGame.setTitleFontSize(18);
        this.btnStartGame.x = size.width/2;
        this.btnStartGame.y = size.height/2 - 90;
        this.btnStartGame.setVisibleButton(false);
        this.addChild(this.btnStartGame);
        this.btnStartGame.addClickEventListener(function()
        {
            logMessage("this.btnStartGame .....");
            if(BkTime.GetCurrentTime() - self.btnStartGame.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnStartGame.lastTimeClick = BkTime.GetCurrentTime();
            self.onStartGame();
        });

        this.btnReady = createBkButtonPlistNewTitle(res_name.btn_ready_normal, res_name.btn_ready_normal, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Sẵn sàng",size.width/2,size.height/2);
        Util.setBkButtonShadow(this.btnReady);
        this.btnReady.setTitleFontSize(18);
        this.btnReady.x = size.width/2;
        this.btnReady.y = size.height/2 - 90;
        this.addChild(this.btnReady);
        this.btnReady.setVisibleButton(false);

        this.btnReady.addClickEventListener(function()
        {
            logMessage("this.btnReady .....");
            if(BkTime.GetCurrentTime() - self.btnReady.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnReady.lastTimeClick = BkTime.GetCurrentTime();
            self.onReady();
        });
    },
    _getinGameLogo:function()
    {
        var wid = 130;
        var hei = 33;
        var xPos = 0;
        var yPos =0;
        switch (BkGlobal.currentGameID)
        {
            case GID.XITO:
                yPos =1;
                hei = hei -1;
                break;
            case GID.POKER:
                yPos = hei;
                break;
            case GID.XI_DZACH:
                yPos = 2 * hei;
                break;
            case GID.TLMN_DEM_LA:
                yPos = 3 * hei;
                break;
            case GID.XAM:
                yPos = 4 * hei;
                break;
            case GID.PHOM:
                yPos = 5 * hei;
                break;
            case GID.MAU_BINH:
                yPos = 6 * hei;
                break;
            case GID.LIENG:
                yPos = 7 * hei;
                break;
            case GID.BA_CAY:
                yPos = 8 * hei;
                break;
            case GID.TLMN:
                yPos = 9 * hei;
                break;
            default:
                yPos =0;
        }

        return new cc.rect(xPos,yPos -1,wid,hei);
    },
    clearCurrentGameGui:function()
    {
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            playeri.removeOnhandCard();
        }
    },
    onStartGame:function()
    {
        var self = this;
        this.resetAvatarForNewGame();
        self.clearCurrentGameGui();
        if(self.getLogic().isNeedInvitePlayers())
        {
            self.getLogic().processShowInviteWindows();
            return;
        }
        if(!self.getLogic().isAllPlayerReady())
        {
            showToastMessage(" Còn người chơi trong bàn chưa sẵn sàng.",cc.winSize.width/2,self.btnStartGame.y + 70,3,300);
            return;
        }
        if(self.getLogic().isEnoughMoneyToStartGame())
        {
            self.getLogic().ProcessPlayerStartGame();
        }else
        {
            self.showPopUpInvitePayment();
        }
    },
    onReady:function(){
        var self = this;
        this.resetAvatarForNewGame();
        self.clearCurrentGameGui();
        if(self.getLogic().isEnoughMoneyToStartGame())
        {
            self.getLogic().processPlayerReadyAction();
        }else
        {
            self.showPopUpInvitePayment();
        }
    },

    resetAvatarForNewGame:function()
    {
        if(this.PlayerAvatar == null)
        {
            return;
        }
        for(var i =0; i<this.PlayerAvatar.length; i++)
        {
            var pAvatar = this.PlayerAvatar[i];
            pAvatar.reset();
        }
    },
    onTableLeavePush:function(player)
    {
        var pAvatar = this.getAvatarByServerPos(player.serverPosition);
        if (pAvatar != null) pAvatar.clearAllMask();
    },
    initTopBar:function() {
        var self = this;
        var size = cc.winSize;

        this.initHeaderButton();
        this.configTopButton(GS.INGAME_GAME);

        if(Util.isNeedToChangeIcon())
        {
            this.imgCoin = createBkButtonPlist(res_name.btn_tienCuoc_normal_chess, res_name.btn_tienCuoc_normal_chess, res_name.btn_tienCuoc_normal_chess, res_name.btn_tienCuoc_Hover_chess, "", size.width / 2, size.height / 2);
        }else
        {
            this.imgCoin = createBkButtonPlist(res_name.btn_tienCuoc_normal, res_name.btn_tienCuoc_normal, res_name.btn_tienCuoc_normal, res_name.btn_tienCuoc_Hover, "", size.width / 2, size.height / 2);
        }
        this.imgCoin.x = this.btnBack.x + 119;
        this.imgCoin.y = this.btnBack.y ;
        this.imgCoin.addClickEventListener(function () {
            self.onClickSettingMoney();
        });
        this.addChild(this.imgCoin);
        this.txtBetMoney = new BkLabel("Tiền cược:", "", 18);
        this.txtBetMoney.setTextColor(cc.color(255, 215, 0));
        this.txtBetMoney.x = this.imgCoin.x;
        this.txtBetMoney.y = this.imgCoin.y;
        this.txtBetMoney.visible = false;
        this.addChild(this.txtBetMoney);
    },
    onBackClick:function(){
        this.getLogic().processLeaveTableRequest();
    },
    setVisibleCountDownText:function(isVisi){
        if (this.getLogic().isInGameProgress()){
            return;
        }
        if (this.countdownText != null){
            this.countdownText.visible = isVisi;
        }
    },
    onSettingClick:function(){
        var SettingLayer = new VvSettingWindow();

        SettingLayer.setParentWindow(this.getParent());
        var chatLayer = getCurrentScene().ChatLayer;
        if (chatLayer != undefined){
            chatLayer.setChatDownState();
        }
        var self = this;
        SettingLayer.setCallbackRemoveWindow(function () {
            self.setVisibleCountDownText(true);
            if (chatLayer != undefined){
                chatLayer.restoreUpDownState();
            }
        });
        SettingLayer.showWithParent();
        self.setVisibleCountDownText(false);
    },
    onPaymentClick:function(){
        var layer = new VvPaymentWindow();
        layer.setParentWindow(this.getParent());
        var chatLayer = getCurrentScene().ChatLayer;
        if (chatLayer != undefined){
            chatLayer.setChatDownState();
        }
        var self = this;
        layer.setCallbackRemoveWindow(function () {
            self.setVisibleCountDownText(true);
            if (chatLayer != undefined){
                chatLayer.restoreUpDownState();
            }
        });
        layer.showWithParent();
        self.setVisibleCountDownText(false);
        sendGA(BKGA.INGAME, "click btnPayment", BkGlobal.clientDeviceCheck);
    },
    showPopUpInvitePayment:function()
    {
        var self = this;
        var str = "Bạn không còn đủ tiền. Bạn có muốn nạp tiền để tiếp tục chơi không ?";
        self.setVisibleCountDownText(false);
        showPopupConfirmWith(str,"Không đủ tiền",function(){
            self.onPaymentClick();
        },function () {
            logMessage("onhideWD");
            self.setVisibleCountDownText(true);
        },function () {
            logMessage("onhideWD");
            self.setVisibleCountDownText(true);
        });
    },
    getLogic:function()
    {
        return this.getParent().getLogic();
    },
    disableEventStartGameButton:function(){
        this.btnStartGame.setEnableButton(false);
        this.btnReady.setEnableButton(false);
    },
    enableEventStartGameButton:function(){
        this.btnStartGame.setEnableButton(true);
        this.btnReady.setEnableButton(true);
    },
    hideStartGameButton:function()
    {
        this.btnStartGame.setVisibleButton(false);
        this.btnReady.setVisibleButton(false);
    },
    onDealCard:function()
    {
        this.clearPlayerReadyMark();
        this.hideStartGameButton();
        this.removeCountDownText();
        // truongbs++: add start countdown gold box
        this.startGoldBox();
    },
    clearPlayerReadyMark:function()
    {
        if(this.PlayerAvatar == null)
        {
            return;
        }
        for(var i =0; i<this.PlayerAvatar.length; i++)
        {
            var pAvatar = this.PlayerAvatar[i];
            pAvatar.clearImgReady();
        }
    },

    removePlayerAvatar:function(displayPosition)
    {
        var pAvatar = this.PlayerAvatar[displayPosition];
        if(pAvatar)
        {
            pAvatar.setPlayerdata(null);
            pAvatar.setClientState(null);
        }
    },

    onLeaveDuringGame:function(playerOutGame)
    {
        var pos = playerOutGame.serverPosition;
        this.removePlayerAvatar(this.getLogic().getPlayerDisplayLocation(pos));
    },

    OnGameTableSyn:function()
    {
        this.onUpdateTableMoneyStatus();
        this.hideStartGameButton();
        if(this.getLogic().isInGameProgress())
        {
            this.clearPlayerReadyMark();
            // truongbs++ hide countdown text if need
            this.removeCountDownText();
        }
        if(!this.getLogic().isInGameProgress())
        {
            this.showStartGameButton();
            if(this.getLogic().isMeBossTable())
            {
                this.showCountDownForMe(TIME_AUTO_START_GAME -1);
            }else
            {
                if(this.getLogic().isContinueGame)
                {
                    this.showCountDownForMe(7,true);
                }else
                {
                    this.showCountDownForMe(TIME_AUTO_READY -1);
                }
            }
        }
    },
    onUpdatePlayerLevel:function(serverPos,userDT)
    {
        var displayPos = this.getLogic().getPlayerDisplayLocation(serverPos);
        if (this.PlayerAvatar == null)
        {
            return;
        }
        var pAvatar = this.PlayerAvatar[displayPos];
        pAvatar.setPlayerdata(userDT,true);
    },

    showStartGameButton:function(reShowCountDown)
    {
        logMessage("showStartGameButton");
        this.hideStartGameButton();
        if(this.getLogic().isInGameProgress())
        {
            return;
        }
        var needReShowCD = true;
        if (reShowCountDown != undefined){
            needReShowCD = reShowCountDown;
        }
        if (needReShowCD){
            this.getLogic().showCountDownForMe();
        }

        if(this.getLogic().isMeBossTable())
        {
            this.btnStartGame.setVisibleButton(true);
        }else
        {
            var myClientState = this.getLogic().getMyClientState();
            if (myClientState!= null) {
                if (myClientState.status != PLAYER_STATE_READY) {
                    this.btnReady.setVisibleButton(true);
                }
            } else {
                this.btnReady.setVisibleButton(true);
            }
        }
    },

    _getLocationPos:function(clientPos){
        var maxPlayer = this.getLogic().maxPlayer;
        var currentGameID = BkGlobal.currentGameID;
        return _getAvatarLocationPos(clientPos,maxPlayer, currentGameID);
    },

    displayPlayerAvatar:function()
    {
        var gameTable = this.getLogic();
        var player;
        if (this.PlayerAvatar != null && this.PlayerAvatar.length >0) {
            logMessage(this.PlayerAvatar.length);
            this.clearAllAvatar();
        }
        var pAvatar = null;
        for (var i = 0; i<  gameTable.maxPlayer; i++)  // i client pos
        {
            //gameTable.getPlayer(i);
            player = gameTable.getPlayerDisplayAt(i);
            if (player != null)
            {
                pAvatar = new BkPlayer(player.getUserInfo(), player.status);
                if (BkGlobal.currentGameID == GID.CHAN){
                    logMessage("chan game");
                    pAvatar = new BkChanPlayer(player.getUserInfo(), player.status);
                }
                logMessage(pAvatar.playerData.getUserName() + " i:" + i);
            } else
            {
                pAvatar = new BkPlayer(null,-1);
                if (BkGlobal.currentGameID == GID.CHAN){
                    logMessage("chan game");
                    pAvatar = new BkChanPlayer(null,-1);
                }
            }
            if(pAvatar != null)
            {
                pAvatar.setGameTable(gameTable);
                pAvatar.setClientState(player);
                this.PlayerAvatar.push(pAvatar);
                this.addChild(pAvatar);
                // config the display
                pAvatar.x = this._getLocationPos(i).x ;
                pAvatar.y = this._getLocationPos(i).y;
            }
            logMessage("displayPlayerAvatar "+gameTable.maxPlayer);
            if(BkGlobal.isRoomTypeSolo())
            {
                logMessage("isRoomTypeSolo: "+BkGlobal.isRoomTypeSolo());
                if(gameTable.maxPlayer == 6)
                {
                    if( i == 1 || i == 2 || i == 4 || i == 5)
                    {
                        pAvatar.visible = false;
                        pAvatar.clearEventListener();
                    }
                }
                if(gameTable.maxPlayer == 4)
                {
                    if( i == 1 || i == 3 )
                    {
                        logMessage("i "+i+" clearEventListener ");
                        pAvatar.visible = false;
                        pAvatar.clearEventListener();

                    }
                }
            }
        }
    },
    clearAllAvatar:function()
    {
        var pAvatar;
        while (this.PlayerAvatar.length >0)
        {
            pAvatar = this.PlayerAvatar[0];
            this.removeChild(pAvatar);
            this.PlayerAvatar.splice(0,1);
        }
    },
    showAnimationUpdateMoney:function(amount,reason,pAvatar){
        if (amount == 0){
            return;
        }
        var tfUpdateMoney = new BkTextFieldChangeMoney(pAvatar,amount);
        logMessage("reason.length: "+reason.length);
        if (reason.length>9){
            tfUpdateMoney.setScaleTF(0.55);
        }
        var str = reason + "\n";
        if (amount>0){
            str += "+ "+convertStringToMoneyFormat(amount,true);
        } else{
            str += convertStringToMoneyFormat(amount,true);
        }

        tfUpdateMoney.setContentText(str);
        tfUpdateMoney.doChangeMoney();
    },
    UpdatePlayerMoney:function(player,amount,reason,animateAmount)
    {
        var pAvatar;
        var pos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        logMessage("pos "+pos + " player.serverPosition: "+player.serverPosition);
        if(reason == undefined)
        {
            reason = "";
        }
        pAvatar = this.PlayerAvatar[pos];
        if (pAvatar != null) {
            logMessage("name "+pAvatar.getPlayerName());
            pAvatar.updateMoney(player.getCurrentCash());
            if(animateAmount != undefined && animateAmount != null)
            {
                this.showAnimationUpdateMoney(animateAmount,reason,pAvatar);
            }else
            {
                this.showAnimationUpdateMoney(amount,reason,pAvatar);
            }

        }
    },
    removeGoldBox:function(){
        if (this.goldBox != null){
            this.goldBox.removeSelf();
        }
    },
    showGoldBoxWithRemainTime:function(remainTime){
        if (remainTime>=0){
            if (this.goldBox != null){
                this.goldBox.removeSelf();
            }
            this.goldBox = new BkGoldBoxSprite();
            this.goldBox.x = cc.winSize.width/2 + this.goldBox.width  + 405;
            this.goldBox.y = cc.winSize.height - 70;
            this.goldBox.showGoldBoxWith(remainTime);
            var mPlayer = this.getLogic().getMyClientState();
            if (mPlayer!= null){
                if (mPlayer.isPlaying && !mPlayer.isFinishedGame)
                {
                    this.goldBox.startCountDown();
                }else
                {
                    this.goldBox.stopCountDown();
                }
            }
            this.addChild(this.goldBox);
        }
    },
    stopGoldBoxCountDown:function(){
        if (this.goldBox != null){
            this.goldBox.stopCountDown();
        }
    },
    startGoldBoxCountDown:function(){
        if (this.goldBox != null){
            this.goldBox.startCountDown();
        }
    },
    onPlayerStatusUpdate:function(displayPos, status)
    {
        var pAvatar = this.PlayerAvatar[displayPos];
        if (pAvatar == null) {
            return;
        }

        pAvatar.setStatus(status);

        if(!this.getLogic().isInGameProgress())
        {
            logMessage("show start game button update status "+displayPos);
            if (displayPos == 0){
                this.showStartGameButton(false);
            }
        }

    },
    onTableInfoReturn:function() {
        this.displayPlayerAvatar();
        this.onUpdateTableMoneyStatus();
        this.imgCoin.visible = true;
        this.txtBetMoney.visible = true;
    },
    onUpdateTableMoneyStatus:function() {
        var tablebetM = this.getLogic().tableBetMoney;
        var fontSize = 16;
        if (BkGlobal.isGameCo()){
            fontSize = 14;
        }
        if (tablebetM >= 1000000){
            this.txtBetMoney.setFontSize(fontSize);
        }
        this.txtBetMoney.setString("Tiền cược: $ " + convertStringToMoneyFormat(tablebetM,true));
    },
    ShowCicleCountDownTimeOnActivePlayer:function(timeShow)
    {
        logMessage("ShowCicleCountDownTimeOnActivePlayer GS: "+this.getLogic().gameStatus);
        for (var i=0; i< this.getLogic().maxPlayer; i++)
        {
            var tempAvatar = this.PlayerAvatar[i];
            if (tempAvatar!= null)
            {
                tempAvatar.stopCountDown();
            }
        }

        var activePlayerPos = this.getLogic().getActivePlayerPos();
        logMessage("activePlayerPos: "+activePlayerPos);
        var pAvatar = this.getAvatarByServerPos(activePlayerPos);
        if (pAvatar!= null) {
            var tShow = 29;
            if (timeShow!= undefined){
                tShow = timeShow;
            }
            pAvatar.showCountDownTime(tShow);
        }
    },
    getAvatarByServerPos:function(pos)
    {
        for (var i =0; i<this.PlayerAvatar.length; i++)
        {
            var pAvatar = this.PlayerAvatar[i];
            if (pAvatar.clientState != null && pAvatar.clientState.serverPosition == pos)
            {
                return pAvatar;
            }
        }
        return null;
    },
    getIndexOfAvatarByName:function(playerName)
    {
        for (var i =0; i<this.PlayerAvatar.length; i++)
        {
            var pAvatar = this.PlayerAvatar[i];
            if (pAvatar.getPlayerName() == playerName) {
                return i;
            }
        }
        return -1;
    },
    getPlayerAvatarByName:function(playerName){
        var index = this.getIndexOfAvatarByName(playerName);
        if (index!= -1){
            return this.PlayerAvatar[index];
        }
        return null;
    },
    getMyAvatar:function () {
        var myName = BkGlobal.UserInfo.getUserName();
        return this.getPlayerAvatarByName(myName);
    },
    removeCountDownText:function()
    {
        if (this.countdownText != null)
        {
            this.countdownText.removeCountDown();
            this.countdownText.removeFromParent();
            this.countdownText = null;
        }
    },
    showCountDownForMe:function(xSec,isAutoStartGame)
    {
        if (this.getLogic().isInGameProgress()){
            return;
        }
        this.removeCountDownText();
        var isGameCo = false;
        if ((BkGlobal.currentGameID == GID.CO_TUONG) || (BkGlobal.currentGameID == GID.CO_UP)){
            isGameCo = true;
        }
        var myClientState = this.getLogic().getMyClientState();
        if (myClientState!= null) {
            if (myClientState.status != PLAYER_STATE_READY)
            {
                if(isAutoStartGame != undefined && isAutoStartGame == true)
                {
                    this.countdownText = new BkCountDownText(30,false,true,isGameCo);
                    var self = this;
                    this.countdownText.setCallBackfunction(function()
                    {
                        self.onReady();
                    });
                    if (BkGlobal.currentGameID == GID.MAU_BINH){
                        this.countdownText.setScale(0.8);
                    }
                }else
                {
                    this.countdownText = new BkCountDownText(30,false,false,isGameCo);
                }
                var crScene = getCurrentScene();
                if (crScene!= null){
                    crScene.addChild(this.countdownText,TagOfLayer.CountDownTime);
                } else {
                    this.addChild(this.countdownText,TagOfLayer.CountDownTime);
                }

                this.countdownText.x = IGC.CENTER_CIR_X;//cc.winSize.width / 2 ;
                this.countdownText.y = this.btnStartGame.y + this.countdownTextYoffset;
                this.countdownText.showCountDownText(xSec);
            }
        }
    },
    showCountDownTextXC:function(xSec,xPos,yPos){
        this.removeCountDownText();
        this.countdownText = new BkCountDownText(30,false,false,true);
        var crScene = getCurrentScene();
        if (crScene!= null){
            crScene.addChild(this.countdownText,TagOfLayer.CountDownTime);
        } else {
            this.addChild(this.countdownText,TagOfLayer.CountDownTime);
        }

        this.countdownText.x = xPos;//cc.winSize.width / 2 ;
        this.countdownText.y = yPos;//this.btnStartGame.y + this.countdownTextYoffset;
        this.countdownText.showCountDownText(xSec);
    },
    showCountDownWithBG:function(xSec,xPos,yPos)
    {
        this.removeCountDownText();
        this.countdownText = new BkCountDownText(30,true);
        this.addChild(this.countdownText);
        if (xPos == undefined){
            xPos = cc.winSize.width / 2;
        }
        if (yPos == undefined){
            yPos = 340;
        }
        this.countdownText.x = xPos;
        this.countdownText.y = yPos;
        this.countdownText.showCountDownText(xSec);
        if(this.getLogic().getMyClientState() == null)
        {
            return;
        }
        if(this.getLogic().getMyClientState().status != PLAYER_STATE_NOT_READY && BkGlobal.currentGameID == GID.MAU_BINH)
        {
            var self = this;
            this.countdownText.y = yPos + 50;
            this.countdownText.setCallbackForMauBinh(function()
            {
                self.onAutoSendDiscard();
            });
        }
    },
    resetAllPlayerAvatar:function ()
    {
        if (this.PlayerAvatar == null || this.PlayerAvatar.length == 0 )
        {
            return;
        }
        for (var i = 0; i< this.getLogic().maxPlayer; i++) {
            var tempAvatar = this.PlayerAvatar[i];
            if (tempAvatar!= null) {
                tempAvatar.stopCountDown();
            }
        }
    },
    startGoldBox:function()
    {
        this.startGoldBoxCountDown();
    },
    stopGoldBox:function()
    {
        this.stopGoldBoxCountDown();
    },
    OnFinishedGame:function()
    {
        this.resetAllPlayerAvatar();
        this.stopGoldBox();
        //this.showStartGameButton();
    },
    onPrepareNewGame:function()
    {
        logMessage("onPrepareNewGame base layer");
        this.resetAllPlayerAvatar();
        this.showStartGameButton();
    },
    onTableJoin:function(player, displayPos)
    {
        if (this.PlayerAvatar.length < this.getLogic().maxPlayer)
        {
            this.displayPlayerAvatar();
        } else {
            var pAvatar = this.PlayerAvatar[displayPos];
            if (pAvatar == null)
            {
                this.displayPlayerAvatar();
            } else
            {
                pAvatar.setStatus(player.status);
                pAvatar.setPlayerdata(player.getUserInfo());
                pAvatar.setClientState(player);
            }
        }
    },
    onClickSettingMoney:function(){
        if (!this.getLogic().isMeBossTable()){
            showToastMessage(BkConstString.STR_SETTING_TIEN_KHONG_LA_CHU_BAN,this.imgCoin.x + 10,cc.winSize.height - 90);
            return;
        }
        if(this.getLogic().getMyClientState().getCurrentCash() == 0)
        {
            showToastMessage(BkConstString.STR_SETTING_TIEN_KHONG_DU_TIEN,this.imgCoin.x + 10,cc.winSize.height - 90);
            return;
        }
        if (this.getLogic().isInGameProgress()){
            showToastMessage(BkConstString.STR_SETTING_CUOC_TRONG_VAN,this.imgCoin.x + 10,cc.winSize.height - 90);
            return;
        }

        if (this.settingBetmoneyWindow != null){
            this.settingBetmoneyWindow.removeFromParent();
        }
        var self = this;
        this.settingBetmoneyWindow = new BkSettingBetmoneyWindow("Tiền cược");
        this.settingBetmoneyWindow.setCallbackRemoveWindow(function () {
            self.setVisibleCountDownText(true);
        });
        this.settingBetmoneyWindow.showWithParent();
        self.setVisibleCountDownText(false);
    },
    getCustomGameButtonList:function()
    {
        return null;
    },
    showRegExitSplash:function(isShow)
    {
        this.btnBack.setBlinking(isShow,res_name.registerExit,1);
    }

});