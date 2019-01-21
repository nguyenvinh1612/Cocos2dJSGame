/**
 * Created by bs on 04/05/2017.
 */

var VVChoosegameLayer = BkBaseLayer.extend({
    btnDinhThuQuan:null,
    dinhThuQuanHover:null,
    btnNhaTranh:null,
    nhaTranhHover:null,
    btnDauTayDoi:null,
    dauTayDoiHover:null,
    btnTienThuong:null,
    btnCho:null,
    btnBanBe:null,
    btnHopThu:null,
    btnDesktop:null,
    mailNumBg: null,
    playerAvatar: null,
    btnVip:null,
    imgVip:null,
    ctor: function () {
        this._super(GS.CHOOSE_GAME);
        this.setBackground(res.BG_Choosegame);
        this.initHeaderButton();
        this.configTopButton(GS.CHOOSE_GAME);

        cc.spriteFrameCache.addSpriteFrames(res.vv_seven_day_bonus_plist, res.vv_seven_day_bonus_img);
        cc.spriteFrameCache.addSpriteFrames(res.vv_after_login_plist, res.vv_after_login_img);
        cc.spriteFrameCache.addSpriteFrames(res.vv_vip_plist, res.vv_vip_img);
        if(cc.game.config.app.isNoelSeason == 1)
        {
            var flowBg = new BkSprite(res.flowerbg);
            flowBg.x =  cc.director.getWinSize().width/2;
            flowBg.y =  cc.director.getWinSize().height/2;
            this.addChild(flowBg,-1);
        }
        this.initGameButtons();
        this.initBottomButtons();

        // Add player avatar
        this.initAvatar();
        this.configAvatarPos();
        this.initButtonVip();
        this.initHotlineAndVersion();

        if(bk.isDesktopApp){
            this.initTopButton();
        }
    },
    initTopButton:function () {
        this.btnLogout = createBkButtonPlist(res_name.icon_roiban, res_name.icon_roiban, res_name.icon_roiban,
            res_name.icon_roiban_hover, "Thoát");
        this.btnLogout.setTitleColor(BkColor.VV_BUTTON_TITLE_COLOR);
        this.btnLogout.setTitleFontName(res_name.GAME_FONT);
        this.btnLogout.x = 50;
        this.btnLogout.y = cc.director.getWinSize().height - 27.5;
        this.addChild(this.btnLogout);
        this.btnLogout.addClickEventListener(function(){
            logMessage("onLogoutClick -> need override in subclass");
            processLogout();
            Util.reloadWebPage();
        });
    },
    initHotlineAndVersion: function () {
        var yPos = 15;
        var textcolor = cc.color.YELLOW;//cc.color(120,85,122);
        var version = cc.game.config.app.version;
        if (version != undefined) {
            if (version != "") {
                var lbVersion = new BkLabel("v" + version, "", 14);
                lbVersion.setTextColor(textcolor);
                lbVersion.x = 30;
                lbVersion.y = yPos;
                this.addChild(lbVersion);
            }
        }

        var hotline = cc.game.config.app.hotline;
        if (hotline != undefined) {
            if (hotline != "") {
                var lbHotline = new BkLabel("Hotline: " + hotline, "", 14);
                lbHotline.setTextColor(textcolor);
                lbHotline.x = 885;
                lbHotline.y = yPos;
                this.addChild(lbHotline);
            }
        }
    },


    configAvatarPos: function(){
        var btnTopRightMarginTop = 27.5;
        var winSize = cc.director.getWinSize();
        var marginAvatarX = bk.isDesktopApp ? 245 : 170;
        this.playerAvatar.x = marginAvatarX;
        this.playerAvatar.y = winSize.height - btnTopRightMarginTop;
    },
    initGameButtons:function(){
        var self = this;

        this.btnDinhThuQuan = new BkSprite("#" + res_name.dinhthuquan_bg);
        this.btnDinhThuQuan.x = 562;
        this.btnDinhThuQuan.y = 450;
        this.addChild(this.btnDinhThuQuan);
        this.btnDinhThuQuan.setOnlickListenner(function(touch, event){
            self.doJoinTable(RT.ROOM_TYPE_DINH_THU_QUAN);
        });

        this.dinhThuQuanHover = new BkSprite("#" + res_name.dinhthuquan_bg_hover);
        this.dinhThuQuanHover.x = this.btnDinhThuQuan.x;
        this.dinhThuQuanHover.y = this.btnDinhThuQuan.y;
        this.dinhThuQuanHover.setVisible(false);
        this.addChild(this.dinhThuQuanHover);

        var dtqDescription = self.getRoomDescriptionSprite(RT.ROOM_TYPE_DINH_THU_QUAN);
        dtqDescription.x = this.dinhThuQuanHover.width - 50;
        dtqDescription.y = this.dinhThuQuanHover.height - 70;
        this.dinhThuQuanHover.addChild(dtqDescription);

        this.btnDinhThuQuan.setMouseOnHover(
            function () {
                self.dinhThuQuanHover.setVisible(true);
            }, function () {
                self.dinhThuQuanHover.setVisible(false);
            });

        this.btnNhaTranh = new BkSprite("#" + res_name.nhatranh_bg);
        this.btnNhaTranh.x = 199;
        this.btnNhaTranh.y = 240;
        this.addChild(this.btnNhaTranh);
        this.btnNhaTranh.setOnlickListenner(function(touch, event){
            self.doJoinTable(RT.ROOM_TYPE_NHA_TRANH);
        });

        this.nhaTranhHover = new BkSprite("#" + res_name.nhatranh_bg_hover);
        this.nhaTranhHover.x = this.btnNhaTranh.x;
        this.nhaTranhHover.y = this.btnNhaTranh.y;
        this.nhaTranhHover.setVisible(false);
        this.addChild(this.nhaTranhHover);

        var ntDescription = self.getRoomDescriptionSprite(RT.ROOM_TYPE_NHA_TRANH);
        ntDescription.x = this.nhaTranhHover.width - 50;
        ntDescription.y = this.nhaTranhHover.height - 90;
        this.nhaTranhHover.addChild(ntDescription);

        this.btnNhaTranh.setMouseOnHover(
            function () {
                self.nhaTranhHover.setVisible(true);
            }, function () {
                self.nhaTranhHover.setVisible(false);
            });

        this.btnDauTayDoi = new BkSprite("#" + res_name.dautaydoi_bg);
        this.btnDauTayDoi.x = 762;
        this.btnDauTayDoi.y = 202;
        this.addChild(this.btnDauTayDoi);
        this.btnDauTayDoi.setOnlickListenner(function(touch, event){
            self.doJoinTable(RT.ROOM_TYPE_DAU_TAY_DOI);
        });

        this.dauTayDoiHover = new BkSprite("#" + res_name.dautaydoi_bg_hover);
        this.dauTayDoiHover.x = this.btnDauTayDoi.x;
        this.dauTayDoiHover.y = this.btnDauTayDoi.y;
        this.dauTayDoiHover.setVisible(false);
        this.addChild(this.dauTayDoiHover);

        var dtdDescription = self.getRoomDescriptionSprite(RT.ROOM_TYPE_DAU_TAY_DOI);
        dtdDescription.x = this.dauTayDoiHover.width - 60;
        dtdDescription.y = this.dauTayDoiHover.height - 70;

        this.dauTayDoiHover.addChild(dtdDescription);

        this.btnDauTayDoi.setMouseOnHover(
            function () {
                self.dauTayDoiHover.setVisible(true);
            }, function () {
                self.dauTayDoiHover.setVisible(false);
            });
    },
    getRoomDescriptionSprite: function(roomType){
        var sprite = new BkSprite("#" + res_name.hoanhphi_hover);
        var str = [
            new BkLabelItem("Cược tối thiểu " + c.MIN_BET_MONEY_DAU_TAY_DOI + " " + BkConstString.STR_GAME_COIN.toLowerCase(), 14, BkColor.DEFAULT_TEXT_COLOR, 1, false),
            new BkLabelItem("            bàn 2 người ", 14, BkColor.DEFAULT_TEXT_COLOR, 2, false)
        ];

        if(roomType == RT.ROOM_TYPE_DINH_THU_QUAN){
            var str = [
                new BkLabelItem("Cược tối thiểu " + c.MIN_BET_MONEY_DINH_THU_QUAN + " " + BkConstString.STR_GAME_COIN.toLowerCase(), 14, BkColor.DEFAULT_TEXT_COLOR, 1, false),
                new BkLabelItem("            bàn 4 người ", 14, BkColor.DEFAULT_TEXT_COLOR, 2, false)
            ];
        } else if (roomType == RT.ROOM_TYPE_NHA_TRANH){
            var str = [
                new BkLabelItem("Cược tối thiểu " + c.MIN_BET_MONEY_NHA_TRANH + " " + BkConstString.STR_GAME_COIN.toLowerCase(), 14, BkColor.DEFAULT_TEXT_COLOR, 1, false),
                new BkLabelItem("            bàn 4 người ", 14, BkColor.DEFAULT_TEXT_COLOR, 2, false)
            ];
        }
        var lbDescription = new BkLabelSprite(str);
        lbDescription.x = sprite.width/2 - 50;
        lbDescription.y = sprite.height/2;
        sprite.addChild(lbDescription);

        return sprite;
    },
    doJoinTable: function (roomTypeId) {
        var crSce = getCurrentScene();
        if (!(crSce instanceof  VVChooseGame)){
            logMessage("! crSce instanceof  VVChooseGame");
            return;
        }

        BkLogicManager.getLogic().doJoinChanGameRoom(roomTypeId);
        //sendGA(BKGA.GAME_CHOOSE, "Click " + Util.getGameLabel(gid), BkGlobal.clientDeviceCheck);
    },

    initBottomButtons:function(){
        var widthSize = this.getContentSize().width;
        var heightSize = this.getContentSize().height;

        // add bottom bar sprite
        var bottomBG, startX, deltaX, deltaY;

        var iconCount = 4;
        if(bk.showCreateDesktopIconTutorial == 1){
            iconCount += 1;
        }
        if(Util.isNeedtoShowRegisterPushButton()){
            iconCount += 1;
        }

        if(iconCount == 4){
            bottomBG = new BkSprite("#" + res_name.footer_bg);
            startX = 75;
            deltaX = 87;
            deltaY = 0;
        }
        else if(iconCount == 5){
            bottomBG = new BkSprite("#" + res_name.footer_bg_5_icons);
            startX = 147;
            if(Util.isNeedtoShowRegisterPushButton()) startX = 70;
            deltaX = 75;
            deltaY = 6;
        }
        else if(iconCount == 6) {
            bottomBG = new BkSprite("#" + res_name.footer_bg_6_icons);
            startX = 147;
            deltaX = 75;
            deltaY = 6;
        }

        this.addChild(bottomBG);
        bottomBG.x = widthSize / 2;
        bottomBG.y = 30;

        this.btnTienThuong = new BkButton(res_name.icon_tienthuong, res_name.icon_tienthuong, res_name.icon_tienthuong, res_name.icon_tienthuong_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnTienThuong.x = startX;
        this.btnTienThuong.y = 70.5 - deltaY;
        bottomBG.addChild(this.btnTienThuong);

        var lblTienThuong = new BkLabel("Tiền thưởng","",14,true);
        lblTienThuong.setTextColor(cc.color(255,255,255));
        lblTienThuong.x = this.btnTienThuong.x + 2;
        lblTienThuong.y = this.btnTienThuong.y - 43;
        bottomBG.addChild(lblTienThuong);

        var startAni = new BkStarAnimation();
        startAni.x = 60;
        startAni.y = 80;
        if(bk.showCreateDesktopIconTutorial == 1)
        {
            startAni.x = 132;
        }
        startAni.showStarEffect();
        bottomBG.addChild(startAni);

        this.btnTienThuong.addClickEventListener(function () {
            if(BkGlobal.UserInfo.VipLevel != 0){
                var packet = new BkPacket();
                packet.createVipInviteFriendMoneyRequest();
                BkConnectionManager.send(packet);
            }
            else {
                var bonusWindow = new VvBonusWindow();
                bonusWindow.showWithParent();
            }
        });

        this.btnCho = new BkButton(res_name.icon_cho, res_name.icon_cho, res_name.icon_cho, res_name.icon_cho_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnCho.x = this.btnTienThuong.x + deltaX;
        this.btnCho.y = 69.5 - deltaY;
        bottomBG.addChild(this.btnCho);

        var lblCho = new BkLabel("Cửa hàng","",14,true);
        lblCho.setTextColor(cc.color(255,255,255));
        lblCho.x = this.btnCho.x + 2;
        lblCho.y = this.btnCho.y - 42;
        bottomBG.addChild(lblCho);

        this.btnCho.addClickEventListener(function () {
            var shoppingWindow = new VvShoppingWindow();
            shoppingWindow.showWithParent();
        });

        this.btnBanBe = new BkButton(res_name.icon_banbe, res_name.icon_banbe, res_name.icon_banbe, res_name.icon_banbe_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnBanBe.x = this.btnCho.x + deltaX;
        this.btnBanBe.y = 70.5 - deltaY;
        bottomBG.addChild(this.btnBanBe);

        var lblBanBe = new BkLabel("Bạn bè","",14,true);
        lblBanBe.setTextColor(cc.color(255,255,255));
        lblBanBe.x = this.btnBanBe.x + 2;
        lblBanBe.y = this.btnBanBe.y - 43;
        bottomBG.addChild(lblBanBe);

        this.btnBanBe.addClickEventListener(function () {
            var friendsWindow = new VvFriendsWindow();
            friendsWindow.showWithParent();

        });

        this.btnHopThu = new BkButton(res_name.icon_hopthu, res_name.icon_hopthu, res_name.icon_hopthu, res_name.icon_hopthu_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnHopThu.x = this.btnBanBe.x + deltaX;
        this.btnHopThu.y = 70 - deltaY;
        bottomBG.addChild(this.btnHopThu);

        var lblHopThu = new BkLabel("Hộp thư","",14,true);
        lblHopThu.setTextColor(cc.color(255,255,255));
        lblHopThu.x = this.btnHopThu.x + 2;
        lblHopThu.y = this.btnHopThu.y - 42;
        bottomBG.addChild(lblHopThu);

        this.btnHopThu.addClickEventListener(function () {
            var mailsWindow = new VvMailsWindow();
            mailsWindow.showWithParent();
        });

        this.mailNumBg = new BkSprite("#" + res_name.bg_notification_email);
        this.mailNumBg.x = this.btnHopThu.x + this.btnHopThu.width/2 - this.mailNumBg.width/2;
        this.mailNumBg.y = this.btnHopThu.y + 0 * this.btnHopThu.height + this.mailNumBg.height - 3;
        this.mailNumBg.visible = false;
        bottomBG.addChild(this.mailNumBg);
        this.mailNumTxt = new BkLabel("0", "", 14);
        this.mailNumTxt.x = this.mailNumBg.x;
        this.mailNumTxt.y = this.mailNumBg.y;
        this.mailNumBg.visible = false;
        bottomBG.addChild(this.mailNumTxt);
        this.updateMailNum(BkGlobal.UserInfo);

        if(bk.showCreateDesktopIconTutorial == 1){
            this.btnDesktop = new BkButton(res_name.icon_desktop, res_name.icon_desktop, res_name.icon_desktop, res_name.icon_desktop_hover, ccui.Widget.PLIST_TEXTURE);
            this.btnDesktop.x = this.btnTienThuong.x - deltaX;
            this.btnDesktop.y = 70 - deltaY;
            bottomBG.addChild(this.btnDesktop);

            var lblDesktop = new BkLabel("Bản desktop","",14,true);
            lblDesktop.setTextColor(cc.color(255,255,255));
            lblDesktop.x = this.btnDesktop.x - 7;
            lblDesktop.y = this.btnDesktop.y - 42;
            bottomBG.addChild(lblDesktop);

            this.btnDesktop.addClickEventListener(function () {
                if(bk.showCreateDesktopIconTutorial == 1){
                    var url = "https://goo.gl/C9tnrX";
                    openUrl(url);
                }
            });
        }

        if (Util.isNeedtoShowRegisterPushButton())
        {
            this.btnRegisterPush = new BkButton(res_name.icon_notification, res_name.icon_notification, res_name.icon_notification
                , res_name.icon_notification_hover, ccui.Widget.PLIST_TEXTURE,null);
            this.btnRegisterPush.x = this.btnHopThu.x + deltaX;
            this.btnRegisterPush.y = 70 - deltaY;
            bottomBG.addChild(this.btnRegisterPush);

            var lblPush = new BkLabel("Thông báo","",14,true);
            lblPush.setTextColor(cc.color(255,255,255));
            lblPush.x = this.btnRegisterPush.x;
            lblPush.y = this.btnRegisterPush.y - 42;
            bottomBG.addChild(lblPush);

            this.btnRegisterPush.addClickEventListener(function ()
            {
                Util.openPushWindow();
                sendGA(BKGA.GAME_CHOOSE, "click btnRegister Push", BkGlobal.clientDeviceCheck);
            });
            // this.btnRegisterPush.setBlinking(true,res_name.blinking);
            // this.notifyBg = new BkSprite("#" + res_name.bg_notification_email);
            // this.notifyBg.x = this.btnRegisterPush.x + 0.3 * this.btnRegisterPush.width + this.notifyBg.width / 2 - 3;
            // this.notifyBg.y = this.btnRegisterPush.y + 0 * this.btnRegisterPush.height + this.notifyBg.height - 3 ;
            // this.notifyBg.visible = true;
            // this.addChild(this.notifyBg);
            // this.notifyTxt = new BkLabel("1", "", 14);
            // this.notifyTxt.x = this.notifyBg.x;
            // this.notifyTxt.y = this.notifyBg.y;
            // this.notifyTxt.visible = true;
            // this.addChild(this.notifyTxt);
        }
    },

    updateAvatar: function (data) {
        logMessage("updateAvatar layer");
        if (this.playerAvatar != null) {
            this.playerAvatar.setPlayerdata(data);
        } else {
            logMessage("this.playerAvatar == null");
        }
        this.updateMailNum(data);
    },

    updateMailNum: function (data) {
        if (!this.mailNumBg || !this.mailNumTxt) {
            return;
        }
        if (data && data.getNumberOfUnreadMails() > 0) {
            this.mailNumBg.visible = true;
            this.mailNumTxt.visible = true;
            this.mailNumTxt.setString(data.getNumberOfUnreadMails());
        } else {
            this.mailNumBg.visible = false;
            this.mailNumTxt.visible = false;
            this.mailNumTxt.setString("0");
        }
    },
    updateUserState: function () {
        var commonLogic = BkLogicManager.getLogic();
        this.updatebtnPayment();
        //Show fb push bonus money
        if (bk.showBnWdFlag) {
            this.showBonusMoney();
        }
        //else
        //Show register phone
        //if (BkGlobal.UserSetting.isPhoneUpdatable && !bk.isFbApp && !BkGlobal.isAutoCreateAccount)
        //{
        //    this.registerPhoneWd = new BkRegisterPhoneNumberWindow();
        //    this.registerPhoneWd.showWithParent();
        //}
            /*
        if (BkGlobal.isFbRenameable && BkGlobal.isLoginFacebook)
        {
            //Thong bao doi ten fb
            logMessage("Call createTooltipRename");
            this.createTooltipRename();
        }
        */
        //daily bonus popup
        //else if (commonLogic.hasDailyBonus) {
        //    showPopupMessageWith("Bạn được thưởng 1000 " + BkConstString.getGameCoinStr() + " cho lần đăng nhập này.");
        //    commonLogic.hasDailyBonus = false;
        //}
        else {
            if(BkGlobal.currentGS == GS.CHOOSE_GAME){
                var today = new Date().getDay();
                Util.removeClientSetting(key.displayHotNews + (today != 0? today - 1: 6));
                var displayHotNews = Util.getClientSetting(key.displayHotNews + today, false, 1);

                if(displayHotNews != 0 && bk.showHotNewsWdFlag){
                    cc.loader.loadJson("news.json?v="+(new Date() - 0),function(err,data){
                        if (err) {
                            return ;
                        } else {
                            var news = data["news"];

                            var commonLogic = BkLogicManager.getLogic();
                            if(news && news.length > 0 && !(news.length == 1 && news[0].id == 6 && !commonLogic.hasDailyBonus)){
                                var newsWd = new BkHotNewsWindow(news);
                                newsWd.showWithParent(null,WD_TAG.HOT_NEWS);
                                if(bk.showHotNewsWdFlag) bk.showHotNewsWdFlag = false;
                            }
                        }
                    });
                }
            }
        }

        commonLogic.processUpdateProfileUI();
    }
});
var VVChooseGame = cc.Scene.extend({
    chooseGameLayer: null,
    onEnter: function () {
        Util.showAnim();
        logMessage("------------------------------BkChooseGame ");
        this._super();
        this.chooseGameLayer = new VVChoosegameLayer();
        this.addChild(this.chooseGameLayer);

        //this.chooseGameLayer.updateTextPosButton();
        // reset all game state
        BkGlobal.currentGameID = -1;
        BkGlobal.currentRoomID = -1;
        BkGlobal.currentTableID = -1;
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        this.scheduleUpdate();
        //Init avatar & shop item im
        Util.removeAnim();

    },
    update:function(){
        var currS = getCurrentScene();
        if (currS != null) {
            if (currS instanceof VVChooseGame) {
                if (this.chooseGameLayer != null) {
                    this.chooseGameLayer.updateUserState();
                    this.chooseGameLayer.updateAvatar(BkGlobal.UserInfo);

                    if(cc.game.config.app.isNoelSeason == 1)// && bk.fbAppIndex != 20 && bk.fbAppIndex != 19 )
                    {
                        var flowAni = new BkFlowerAnimation();
                        flowAni.x = 835;
                        flowAni.y = 500;
                        flowAni.showStarEffect(1);
                        this.addChild(flowAni);
                        var flowAni = new BkFlowerAnimation();
                        flowAni.x = 135;
                        flowAni.y = 500;
                        flowAni.showStarEffect(2);
                        this.addChild(flowAni);
                    }
                    if (BkGlobal.UserInfo.listAvatar == null) {
                        BkLogicManager.getLogic().processAfterLogin();
                    }
                    //if (BkGlobal.UserInfo.playerMoney == 0 && !Util.getClientSession(key.isShowPromotionWD,1))
                    //{
                    //    BkLogicManager.getLogic().showPromotionAtChooseGame(BkLogicManager.getLogic().dailyTaskList);
                    //    Util.setClientSession(key.isShowPromotionWD, 1);
                    //}
                    if(BkGlobal.isAutoCreateAccount)
                    {
                        var self = this;
                        BkDialogWindowManager.showPopupWith("Hệ thống đã tự động tạo cho bạn tài khoản với tên đăng nhập: " + BkGlobal.UserInfo.userName + " và mật khẩu: " + BkGlobal.UserInfo.password + " Bạn có muốn đổi tên đăng nhập và mật khẩu không ?",null,function ()
                        {
                            BkGlobal.isAutoCreateAccount = false;
                            var layer = new VvPlayerDetailsWindow(BkGlobal.UserInfo.userName);
                            layer.setCallbackRemoveWindow(function () {
                                self.isShowPlayerDetail = false;
                            });
                            layer.showWithParent(self);
                            self.isShowPlayerDetail = true;
                        },function(){BkGlobal.isAutoCreateAccount = false;},function(){BkGlobal.isAutoCreateAccount = false;},TYPE_CONFIRM_BOX,null);
                    }
                    this.unscheduleUpdate();
                }
            }
        }
    },
    updateAvatar: function (data) {
        if (this.chooseGameLayer != null) {
            this.chooseGameLayer.updateAvatar(data);
        }
    },
    updatebtnPayment: function () {
        if (this.chooseGameLayer != null) {
            this.chooseGameLayer.updatebtnPayment();
        }
    },
    getGameLayer:function () {
        return this.chooseGameLayer;
    }
});