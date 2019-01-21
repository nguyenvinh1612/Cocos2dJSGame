/**
 * Created by bs on 29/09/2015.
 */
BkBaseLayer = cc.Layer.extend({
    background:null,
    btnTopPlayer:null,
    btnScreenShot:null,
    btnFullScreen:null,
    btnBack:null,
    btnPayment:null,
    btnChoiNgay:null,
    btnSetting:null,
    righticon_bg: null,
    stickerKM:null,
    gs:0,
    ctor: function (crGS) {
        this._super();
        this.gs = crGS;
        cc.spriteFrameCache.addSpriteFrames(res.vv_sprite_sheet_plist, res.vv_sprite_sheet_img);

    },
    initHeaderButton:function(){
        // truongbs ++ : add top bar button
        var winSize = cc.director.getWinSize();
        var btnTopRightMarginRight = 79.5;
        var btnTopRightMarginTop = 26;
        var btnTopRightPadding = 6;
        var self= this;

        this.righticon_bg = new BkSprite("#" + res_name.righticon_bg);
        this.righticon_bg.x = winSize.width - btnTopRightMarginRight;
        this.righticon_bg.y = winSize.height - btnTopRightMarginTop;
        this.addChild(this.righticon_bg);

        if (cc.screen.fullScreen()){
            this.btnFullScreen = new BkButton(res_name.icon_fullscreen_close, res_name.icon_fullscreen_close
                , res_name.icon_fullscreen_close, res_name.icon_fullscreen_close_press, ccui.Widget.PLIST_TEXTURE);
            this.btnFullScreen.setStringHover("Thu nhỏ");
        } else {
            this.btnFullScreen = new BkButton(res_name.icon_fullscreen, res_name.icon_fullscreen, res_name.icon_fullscreen
                , res_name.icon_fullscreen_press, ccui.Widget.PLIST_TEXTURE);
            this.btnFullScreen.setStringHover("Phóng to");
        }

        this.btnFullScreen.x = this.righticon_bg.getContentSize().width - this.btnFullScreen.getContentSize().width + 5;
        this.btnFullScreen.y = this.righticon_bg.getContentSize().height / 2;
        this.righticon_bg.addChild(this.btnFullScreen);
        this.btnFullScreen.addClickEventListener(function () {
            logMessage("clock btnFullScreen Lobby");
            if (!cc.screen.fullScreen())
            {
                makeFullScreen(function () {
                    if (cc.screen.fullScreen())
                    {
                        self.btnFullScreen.loadTextures(res_name.icon_fullscreen_close, res_name.icon_fullscreen_close, res_name.icon_fullscreen_close, res_name.icon_fullscreen_close_press, ccui.Widget.PLIST_TEXTURE);
                        self.btnFullScreen.setStringHover("Thu nhỏ");
                    } else {
                        self.btnFullScreen.loadTextures(res_name.icon_fullscreen, res_name.icon_fullscreen, res_name.icon_fullscreen, res_name.icon_fullscreen_press, ccui.Widget.PLIST_TEXTURE);
                        self.btnFullScreen.setStringHover("Phóng to");
                    }
                },self);
                return;
            }
            exitFullScreen();
            self.btnFullScreen.loadTextures(res_name.icon_fullscreen, res_name.icon_fullscreen, res_name.icon_fullscreen, res_name.icon_fullscreen_press, ccui.Widget.PLIST_TEXTURE);
        });

        this.btnScreenShot = new BkButton(res_name.icon_capture, res_name.icon_capture, res_name.icon_capture
            , res_name.icon_capture_press, ccui.Widget.PLIST_TEXTURE);
        this.btnScreenShot.setStringHover("Chụp hình");
        this.btnScreenShot.x = this.btnFullScreen.x - this.btnScreenShot.width - btnTopRightPadding;
        this.btnScreenShot.y = this.btnFullScreen.y;
        this.btnScreenShot.addClickEventListener(function(){
            logMessage("click btnScreenShot");
            makeScreenShot();
        });
        this.righticon_bg.addChild(this.btnScreenShot);

        this.btnTopPlayer = new BkButton(res_name.icon_bxh, res_name.icon_bxh, res_name.icon_bxh
            , res_name.icon_bxh_press, ccui.Widget.PLIST_TEXTURE);
        this.btnTopPlayer.setStringHover("Bảng vàng");
        this.btnTopPlayer.x = this.btnScreenShot.x - this.btnScreenShot.width - btnTopRightPadding;
        this.btnTopPlayer.y = this.btnFullScreen.y;
        this.btnTopPlayer.addClickEventListener(function(){
            self.onTopBtnClick();
        });
        this.righticon_bg.addChild(this.btnTopPlayer);

        var btnTopRightMarginTop = 27.5;
        var winSize = cc.director.getWinSize();
        this.btnBack = createBkButtonPlist(res_name.icon_roiban, res_name.icon_roiban, res_name.icon_roiban,
            res_name.icon_roiban_hover, "Ra ngoài");
        this.btnBack.setTitleColor(BkColor.VV_BUTTON_TITLE_COLOR);
        this.btnBack.setTitleFontName(res_name.GAME_FONT);
        this.btnBack.x = 40 + 10;
        this.btnBack.y = winSize.height - btnTopRightMarginTop;
        this.addChild(this.btnBack);
        this.btnBack.addClickEventListener(function(){
            self.onBackClick();
        });

        // this.updatebtnPayment();
        this.btnPayment = createBkButtonPlist(res_name.icon_napxu, res_name.icon_napxu, res_name.icon_napxu, res_name.icon_napxu_hover, "Nạp quan");
        this.btnPayment.setTitleColor(BkColor.VV_BUTTON_TITLE_COLOR);
        this.btnPayment.setTitleFontName(res_name.GAME_FONT);
        this.btnPayment.x = this.righticon_bg.x - this.righticon_bg.width / 2 - this.btnPayment.width / 2 - 15;
        this.btnPayment.y =  this.righticon_bg.y;
        var self = this;
        this.btnPayment.addClickEventListener(function () {
            self.onPaymentClick();
        });

        if(cc.isShowWdByIp) this.addChild(this.btnPayment);
        this.updatebtnPayment();

        this.btnChoiNgay = createBkButtonPlist(res_name.btn_choinhanh, res_name.btn_choinhanh, res_name.btn_choinhanh,
            res_name.btn_choinhanh_hover, "Chơi ngay");
        this.btnChoiNgay.setTitleColor(BkColor.VV_BUTTON_TITLE_COLOR);
        this.btnChoiNgay.setTitleFontName(res_name.GAME_FONT);
        this.addChild(this.btnChoiNgay);
        this.btnChoiNgay.x = this.btnPayment.x - this.btnPayment.width / 2 - this.btnChoiNgay.width / 2 - 20;
        this.btnChoiNgay.y = this.btnPayment.y - 0.5;
        this.btnChoiNgay.addClickEventListener(function(){
            logMessage("-----------------------click choi ngay-----------------------");
            var Packet = new BkPacket();
            Packet.CreatePacketWithOnlyType(c.NETWORK_AUTO_FIND_TABLE);
            BkConnectionManager.send(Packet);
        });

        // settings
        this.btnSetting = new BkButton(res_name.icon_caidat, res_name.icon_caidat, res_name.icon_caidat
            , res_name.icon_caidat_press, ccui.Widget.PLIST_TEXTURE);
        this.btnSetting.setStringHover("Cài đặt");
        this.btnSetting.y = this.btnTopPlayer.y;
        this.btnSetting.x = this.btnTopPlayer.x;
        this.righticon_bg.addChild(this.btnSetting);

        this.btnSetting.addClickEventListener(function () {
            self.onSettingClick();
        });
    },
    addPaymentBonusSticker:function()
    {
        if(this.stickerKM) {
            this.stickerKM.removeFromParent();
        }

        if(BkGlobal.paymentBonusPercent == 0) return;

        this.stickerKM = new BkSprite("#" + res_name.btn_napquan_km);
        this.stickerKM.x = this.btnPayment.x + 10;
        this.stickerKM.y = this.btnPayment.y - 20;
        this.addChild(this.stickerKM);

        this.tfPercent = new BkLabel("+" + BkGlobal.paymentBonusPercent + "%", "", 12);
        this.tfPercent.x = this.stickerKM.width/2;
        this.tfPercent.y = this.stickerKM.height/2;
        this.stickerKM.addChild(this.tfPercent);
    },
    configTopButton:function(gs){
        if (gs == GS.CHOOSE_GAME){
            this.btnSetting.setVisible(false);
            this.btnChoiNgay.setVisible(false);
            this.btnBack.removeFromParent();
        } else if (gs ==GS.CHOOSE_TABLE){
            this.btnSetting.setVisible(false);
            this.btnChoiNgay.setVisible(true);
            this.btnBack.setVisible(true);
        } else if (gs ==GS.INGAME_GAME){
            this.btnBack.setVisible(true);
            this.btnTopPlayer.setVisible(false);
            this.btnChoiNgay.setVisible(false);
        }
    },
    initAvatar: function(){
        // Add player avatar
        if (this.playerAvatar == null) {
            this.playerAvatar = new VvAvatar(null);
            this.addChild(this.playerAvatar);
            if (BkGlobal.UserInfo != null) {
                this.updateAvatar(BkGlobal.UserInfo);
            }
        }
    },
    onSettingClick:function(){
        logMessage("onSettingClick -> need override in subclass");
    },
    onBackClick:function(){
        logMessage("onBackClick -> need override in subclass");
        BkLogicManager.getLogic().doleaveGame();
        if(Util.isNeedtoShowPushPopup())
        {
            Util.openPushWindow();
        }
    },
    onTopBtnClick:function(){
        var topWd = new VvTopPlayerWindow();
        topWd.setParentWindow(this);
        topWd.showWithParent();
    },
    onPaymentClick:function(){
        var paymentWindow = new VvPaymentWindow();
        paymentWindow.showWithParent();
    },
    removeBackground:function(){
        if (this.background != null){
            this.background.removeFromParent();
            this.background = null;
        }
    },
    updateBackground:function(bgName){
        this.removeBackground();
        this.setBackground(bgName);
    },
    setBackground:function(nameImgBG){
        logMessage("setBackground "+nameImgBG);
        var size = cc.director.getWinSize();
        this.background = new BkSprite(nameImgBG);
        this.background.scaleX = size.width / this.background.getWidth();
        this.background.scaleY = size.height / this.background.getHeight();
        this.background.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.background, -1);
    },
    updatebtnPayment:function()
    {
        if(cc.isShowWdByIp) {
            this.addPaymentBonusSticker();
        }
    },
    updateImgVip:function () {
        var vipLV = BkGlobal.UserInfo.VipLevel;
        logMessage("addImgVip "+vipLV);
        if (vipLV>=0){
            if (this.imgVip != null){
                this.imgVip.removeFromParent();
                this.imgVip = null;
            }
            this.imgVip = VvAvatarImg.getVipFromID(vipLV,true);
            this.imgVip.setScale(0.4);
            this.imgVip.x = this.btnVip.x;
            this.imgVip.y = this.btnVip.y;
            this.addChild(this.imgVip);
        }
    },
    initButtonVip:function () {
        logMessage("initButtonVip");
        if (BkGlobal.currentGS == GS.INGAME_GAME){
            return;
        }
        var vipLV = BkGlobal.UserInfo.VipLevel;
        logMessage("initButtonVip "+vipLV);
        if (vipLV<0){
            return;
        }
        if (IS_VIP_ENABLE){
            cc.spriteFrameCache.addSpriteFrames(res.vv_vip_plist, res.vv_vip_img);
            if (this.btnVip == null){
                var self = this;
                this.btnVip = createBkButtonPlist(res_name.btn_vip,res_name.btn_vip,res_name.btn_vip,res_name.btn_vip,"",0,0);
                this.btnVip.x = 350;
                if (BkGlobal.currentGS == GS.CHOOSE_TABLE){
                    this.btnVip.x = 430;
                }
                if(bk.isDesktopApp){
                    this.btnVip.x = 420;
                }
                this.btnVip.y = this.playerAvatar.y;
                this.btnVip.addClickEventListener(function () {
                    self.onClickVipButton();
                });
                this.addChild(this.btnVip);
                this.updateImgVip();
            }
        }
    },
    onClickVipButton:function () {
        logMessage("onClickVipButton");
        var layer = new VvVipBenefitWindow();
        layer.showWithParent();
    }
    //,
    // isUpdatedPosButton:false,
    // onEnterTransitionDidFinish: function () {
    //     this._super();
    //     this.scheduleUpdate();
    // },
    // update:function(){
    //     if (!this.isUpdatedPosButton){
    //         this.updateTitleRenderPosY();
    //         this.isUpdatedPosButton = true;
    //         this.unscheduleUpdate();
    //     }
    // },
    // updateTitleRenderPosY:function () {
    //     var delta = 10;
    //     this.btnBack.getTitleRenderer().y +=delta;
    //     this.btnPayment.getTitleRenderer().y +=delta;
    //     this.btnChoiNgay.getTitleRenderer().y +=delta;
    // }

});