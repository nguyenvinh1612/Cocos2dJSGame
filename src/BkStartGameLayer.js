/**
 * Created by bs on 12/10/2015.
 */
var AVAR_TOP_ALIGN_HEIGHT = 30;
var SUB_APP_ITEM_PER_PAGE = 5;

var BkGameBaseLayer = cc.Layer.extend({
    background: null,
    gameSortOrder: false,
    gameListSprite: null,
    topSprite: null,
    curIndex: 0,
    otherGameList: null,

    isClickPrevious: -1,
    isAnimationChange: false,
    page1: null,
    page2: null,
    isVisiblePage1:true,
    listGameTab1: null,
    listGameTab2: null,
    bgSubAppListNav: null,

    playerAvatar: null,
    btnTopPlayer: null,
    btnScreenShot: null,
    btnFullScreen: null,
    btnPayment: null,

    btnBonus: null,
    btnFriend: null,
    btnMail: null,
    btnShop: null,
    btnNhiemVu: null,
    btnBookmark: null,

    btnPrevious: null,
    btnNext: null,
    mailNumBg: null,
    _winSize: null,
    marginBtnBottom: cc.p(185.5, 50),

    ctor: function (gameState) {
        this._super();
        this._winSize = cc.winSize;
        var defaultImg = "res/vanbackground.png";
        if(bk.isDesktopApp){
            defaultImg = "res/chan_desktop.png";
        }
        this.background = new BkSprite(defaultImg);
        this.background.x = this._winSize.width / 2;
        this.background.y = this._winSize.height / 2;
        this.addChild(this.background, -103);
        if(cc.game.config.app.isNoelSeason == 1)// && bk.fbAppIndex != 20 && bk.fbAppIndex != 19 )
        {
            var flowerBg = new BkSprite(res.flowerbg);
            flowerBg.x =  cc.director.getWinSize().width/2;
            flowerBg.y =  cc.director.getWinSize().height/2;
            this.addChild(flowerBg,-1);

            var hoaDaoAni  = new BkFlowerAnimation();
            hoaDaoAni.x = 835;
            hoaDaoAni.y = 500;
            hoaDaoAni.showStarEffect(1);
            this.addChild(hoaDaoAni);

            var hoaMaiAni = new BkFlowerAnimation();
            hoaMaiAni.x = 135;
            hoaMaiAni.y = 500;
            hoaMaiAni.showStarEffect(2);
            this.addChild(hoaMaiAni);
        }
         if (gameState == GS.PREPARE_GAME) {
             this.initPreGameTopBar(this._winSize);
             //this.showLoginWindow(1);
             this.initHotlineAndVersion();
         }
        // cc.spriteFrameCache.addSpriteFrames(res.icon_all_gamePlist, res.icon_all_gameIMG);

        // if (gameState == GS.PREPARE_GAME) {
        //     //this.initPreGameTopBar(this._winSize);
        //     //this.initPreGameBottomBar(this._winSize);
        // } else {
        //     this.initAfterLoginTopBar(this._winSize);
        //     this.initAfterLoginBottomBar(this._winSize);
        // }
        // if(gameState == GS.CHOOSE_GAME)
        // {
        //     this.initHotlineAndVersion();
        // }
    },
    initHotlineAndVersion: function () {
        var yPos = 22;
        var textcolor = cc.color.YELLOW;
        var version = cc.game.config.app.version;
        if (version != undefined) {
            if (version != "") {
                var lbVersion = new BkLabel("v" + version, "", 14);
                lbVersion.setTextColor(textcolor);
                lbVersion.x = 410;
                lbVersion.y = yPos;
                this.addChild(lbVersion);
            }
        }

        var hotline = cc.game.config.app.hotline;
        if (hotline != undefined) {
            if (hotline != "") {
                var lbHotline = new BkLabel("-  Hotline: " + hotline, "", 14);
                lbHotline.setTextColor(textcolor);
                lbHotline.x = 510;
                lbHotline.y = yPos;
                this.addChild(lbHotline);
            }
        }
    },

    initPreGameTopBar: function (size) {
        var btnTopRightMarginRight = WD_BODY_MARGIN_LR;
        var btnTopRightMarginTop = 27;

        var self = this;
        this.topSprite = new BkSprite();
        this.topSprite.x = size.width/2.2;
        this.addChild(this.topSprite);
        if (bk.isFbApp) {
            var spriteDesc = new BkSprite("/res/web/bg_text_thongbao.png");
            spriteDesc.x = 0;
            spriteDesc.y = size.height/1.5;
            var str = [
                new BkLabelItem("        �? choi game b?ng t�i kho?n Facebook", 18, BkColor.DEFAULT_TEXT_COLOR, 1, false),
                new BkLabelItem("b?n c?n c?p quy?n truy c?p ?ng d?ng, xin h�y th? l?i!", 18, BkColor.DEFAULT_TEXT_COLOR, 2, false)
            ];

            var lbDescription = new BkLabelSprite(str);
            lbDescription.x = 0;
            lbDescription.y = lbDescription.getContentSize().height/2 + 6;

            spriteDesc.addChild(lbDescription);

            this.topSprite.addChild(spriteDesc);

            var btnFb = new BkSprite("/res/web/btn_loginfacebook_normal.png");
            btnFb.x = 30;
            btnFb.y = size.height/2 + 30;
            this.topSprite.addChild(btnFb);
            btnFb.setMouseOnHover(
                function () {
                    btnFb.setOpacity(230);
                }, function () {
                    btnFb.setOpacity(255);
                }
            );
            btnFb.setOnlickListenner(function () {
                processLoginFb();
            });
        }
        /*
        else {
            var btnLogin = createBkButtonPlist(res_name.btn_dangnhap_normal, res_name.btn_dangnhap_hover, res_name.btn_dangnhap_normal, res_name.btn_dangnhap_hover, "�ang nh?p");
            Util.setBkButtonShadow(btnLogin);
            btnLogin.setTitleFontSize(16);
            btnLogin.x = btnLogin.width / 2 + btnTopRightMarginRight;
            btnLogin.y = size.height - btnTopRightMarginTop;
            this.topSprite.addChild(btnLogin);

            btnLogin.addClickEventListener(function () {
                BkGlobal.isAutoCreateAccount = false;
                self.showLoginWindow(1);
            });

            if (cc.game.config.app && cc.game.config.app.disableReg == 0) {
                var btnRegist = createBkButtonPlist(res_name.btn_dangky_normal, res_name.btn_dangky_hover, res_name.btn_dangky_normal, res_name.btn_dangky_hover, "�ang k�");
                Util.setBkButtonShadow(btnRegist);
                btnRegist.setTitleFontSize(16);
                btnRegist.x = btnLogin.x + btnLogin.width / 2 + btnRegist.width / 2 + 10;
                btnRegist.y = size.height - btnTopRightMarginTop;
                this.topSprite.addChild(btnRegist);

                btnRegist.addClickEventListener(function () {
                    BkGlobal.isAutoCreateAccount = false;
                    self.showLoginWindow(2);
                });
            }
        }
        */
    },

    initPreGameBottomBar: function (size) {
        var btnTopRightMarginRight = size.width - 150;
        var btnTopRightMarginTop = size.height - 27;
        var appConfig = cc.game.config.app;

        var taiAndroidSp = createBkButtonPlist(res_name.btn_googleplay_normal, res_name.btn_googleplay_hover, res_name.btn_googleplay_normal, res_name.btn_googleplay_hover);
        taiAndroidSp.x = btnTopRightMarginRight;
        taiAndroidSp.y = btnTopRightMarginTop;
        this.addChild(taiAndroidSp);
        taiAndroidSp.addClickEventListener(function () {
            cc.sys.openURL(appConfig.android);
        });

        var taiIosSp = createBkButtonPlist(res_name.btn_appstore_normal, res_name.btn_appstore_hover, res_name.btn_appstore_normal, res_name.btn_appstore_hover);
        taiIosSp.x = taiAndroidSp.x + taiAndroidSp.width / 2 + taiIosSp.width / 2 + 10;
        taiIosSp.y = btnTopRightMarginTop;
        this.addChild(taiIosSp);

        taiIosSp.addClickEventListener(function () {
            cc.sys.openURL(appConfig.ios);
        });

        var taiWpSp = createBkButtonPlist(res_name.btn_windowsphone_normal, res_name.btn_windowsphone_hover, res_name.btn_windowsphone_normal, res_name.btn_windowsphone_hover);
        taiWpSp.x = taiIosSp.x + taiIosSp.width / 2 + taiWpSp.width / 2 + 10;
        taiWpSp.y = btnTopRightMarginTop;
        this.addChild(taiWpSp);

        taiWpSp.addClickEventListener(function () {
            cc.sys.openURL(appConfig.wp);
        });
    },

    initAfterLoginTopBar: function (size) {
        var winSize = cc.director.getWinSize();
        if (!bk.isFbApp) {
            var btnLogout = new BkButton(res_name.ImgLeave, res_name.ImgLeave, res_name.ImgLeave, res_name.ImgLeaveHover, ccui.Widget.PLIST_TEXTURE);
            btnLogout.x = btnLogout.getContentSize().width / 2 + 12;
            btnLogout.y = winSize.height - 27;
            this.addChild(btnLogout);
            btnLogout.addClickEventListener(function () {
                if (!BkLogicManager.getLogic().isDoneLoadRes){
                    logMessage("!isDoneLoadRes -> don't process click action");
                    Util.showAnim(false);
                    return;
                }
                var logoutConfirm = new BkLogoutConfirmPopup("", TYPE_CONFIRM_BOX);
                logoutConfirm.setOkCallback(function () {
                    Util.showAnim(false);
                    BkLogicManager.getLogic().doLogout();
                    processLogout(BkLogicManager.getLogic().isDeleteLoginState);
                });
                logoutConfirm.show();
            });
        }

        // Add player avatar data
        if (this.playerAvatar == null) {
            this.playerAvatar = new BkAvatar(null);
            this.addChild(this.playerAvatar);
            if (BkGlobal.UserInfo != null) {
                this.updateAvatar(BkGlobal.UserInfo);
            }
        }

        //TOP bar
        var btnTopRightMarginRight = 30;
        var btnTopRightMarginTop = 27;
        var btnTopRightPadding = 5;

        this.playerAvatar.x = 81;
        this.playerAvatar.y = winSize.height - btnTopRightMarginTop;
        var self = this;

        if (cc.screen.fullScreen())
        {
            if(Util.isNeedToChangeIcon())
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_over_chess, ccui.Widget.PLIST_TEXTURE);

            }else
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2_over, ccui.Widget.PLIST_TEXTURE);
            }
        } else
        {
            if(Util.isNeedToChangeIcon())
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_over_chess, ccui.Widget.PLIST_TEXTURE);
            }else
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale, res_name.btn_scale, res_name.btn_scale, res_name.btn_scale_over, ccui.Widget.PLIST_TEXTURE);
            }
        }
        this.btnFullScreen.x = winSize.width - btnTopRightMarginRight;
        this.btnFullScreen.y = winSize.height - btnTopRightMarginTop;
        this.btnFullScreen.addClickEventListener(function ()
        {
            //logMessage("click btnFullScreen startGame");
            sendGA(BKGA.GAME_CHOOSE, "click btnFullScreen", BkGlobal.clientDeviceCheck);
            if (!cc.screen.fullScreen())
            {
                makeFullScreen(function () {
                    if (cc.screen.fullScreen())
                    {
                        if(Util.isNeedToChangeIcon())
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_over_chess, ccui.Widget.PLIST_TEXTURE);

                        }else
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2_over, ccui.Widget.PLIST_TEXTURE);
                        }
                    } else {
                        if(Util.isNeedToChangeIcon())
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_over_chess, ccui.Widget.PLIST_TEXTURE);
                        }else
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale, res_name.btn_scale, res_name.btn_scale, res_name.btn_scale_over, ccui.Widget.PLIST_TEXTURE);
                        }
                    }
                },self);
                return;
            }
            exitFullScreen();
            if(Util.isNeedToChangeIcon())
            {
                self.btnFullScreen.loadTextures(res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_over_chess, ccui.Widget.PLIST_TEXTURE);

            }else
            {
                self.btnFullScreen.loadTextures(res_name.btn_scale, res_name.btn_scale, res_name.btn_scale, res_name.btn_scale_over, ccui.Widget.PLIST_TEXTURE);
            }
        });
        this.addChild(this.btnFullScreen);
        if(Util.isNeedToChangeIcon())
        {
            this.btnScreenShot = new BkButton(res_name.btn_guide_chess, res_name.btn_guide_chess, res_name.btn_guide_chess, res_name.btn_guide_hover_chess, ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.btnScreenShot = new BkButton(res_name.btn_guide, res_name.btn_guide, res_name.btn_guide, res_name.btn_guide_hover, ccui.Widget.PLIST_TEXTURE);
        }
        this.btnScreenShot.y = this.btnFullScreen.y;
        this.btnScreenShot.addClickEventListener(function () {
            logMessage("click btnScreenShot");
            sendGA(BKGA.GAME_CHOOSE, "click btnScreenShot", BkGlobal.clientDeviceCheck);
            //makeScreenShot();
            showHelpMenu();
        });
        this.addChild(this.btnScreenShot);
        if(Util.isNeedToChangeIcon())
        {
            this.btnTopPlayer = new BkButton(res_name.btn_caothu_chess, res_name.btn_caothu_chess, res_name.btn_caothu_chess, res_name.btn_caothu_over_chess, ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.btnTopPlayer = new BkButton(res_name.btn_caothu, res_name.btn_caothu, res_name.btn_caothu, res_name.btn_caothu_over, ccui.Widget.PLIST_TEXTURE);
        }
        this.btnTopPlayer.y = this.btnFullScreen.y;
        this.btnTopPlayer.addClickEventListener(function () {
            logMessage("click topPlayer");
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            sendGA(BKGA.GAME_CHOOSE, "click topPlayer", BkGlobal.clientDeviceCheck);
            var layer = new BkLeaderBoardWindow();
            layer.setCallbackRemoveWindow(function () {
                self.setVisibleCtr(self.btnPrevious, true);
                self.setVisibleCtr(self.btnNext, true);
            });
            self.setVisibleCtr(self.btnPrevious, false);
            self.setVisibleCtr(self.btnNext, false);
            layer.showWithParent();
        });
        this.addChild(this.btnTopPlayer);

        this.btnTopPlayer.x = this.btnFullScreen.x - this.btnFullScreen.width - btnTopRightPadding;
        this.btnScreenShot.x = this.btnTopPlayer.x - this.btnScreenShot.width / 2 - this.btnTopPlayer.width / 2 - btnTopRightPadding;
    },

    initAfterLoginBottomBar: function (marginLeft) {
        var fontTextSize = 14;
        var numOfIcons = Util.getNumOfBottomIcon();
        var startX = Util.getStartXOfBottomIcon(numOfIcons,bk.isSubFbApp);
        var btnMarginbtn = 105;
        var marginTop = 77;
        
        if(bk.showCreateDesktopIconTutorial != 0) {
            this.btnBookmark = new BkButton(res_name.btn_bottom_bookmark, res_name.btn_bottom_bookmark, res_name.btn_bottom_bookmark, res_name.btn_bottom_bookmark_hover, ccui.Widget.PLIST_TEXTURE);
            this.btnBookmark.setTitleText("Luu trang");
            if (Util.isShowDesktopPromo()) {
                this.btnBookmark.setTitleText("B?n Desktop");
            }
            this.btnBookmark.setTitleFontSize(fontTextSize);
            this.btnBookmark.setTitleColor(cc.color.WHITE);
            this.btnBookmark.x = startX;
            this.btnBookmark.y = marginTop;
            this.addChild(this.btnBookmark);

            this.btnBookmark.addClickEventListener(function () {
                //logMessage("clicked Bookmark button");
                // 0 : hide , 1: Shortcut, 2: Bookmark
                if (bk.showCreateDesktopIconTutorial == 1) {
                    if (bk.isSubFbApp) {
                        var url = "bknews/video-huongdan-chrome.html?v=" + bk.fileVer;
                        var Browser = navigator.userAgent;
                        if (Browser.indexOf('coc_coc_browser') > 0) url = "bknews/video-huongdan-coccoc.html?v=" + bk.fileVer;
                        var layer = new BkShortcutWindow(url);
                        layer.showWithParent();
                    } else {
                        var url = "https://bigkool.net/huong-dan-cach-tao-duong-dan-tat-cho-game-bai-bigkool-len-desktop-pc/#frameYoutube";
                        cc.sys.openURL(url);
                    }
                    sendGA(BKGA.GAME_CHOOSE, "click btnBookmark", BkGlobal.clientDeviceCheck);
                }
                else if (bk.showCreateDesktopIconTutorial == 2) {
                    var layer = new BkShortcutWindow();
                    layer.showWithParent();
                    sendGA(BKGA.GAME_CHOOSE, "click CreateDesktop", BkGlobal.clientDeviceCheck);
                } else if (Util.isShowDesktopPromo()) {
                    var url = "https://goo.gl/sxDHeU";
                    cc.sys.openURL(url);
                }
            });
            var iconStar = new BkSprite("#" + res_name.bookmark_star);
            iconStar.x = this.btnBookmark.width / 2;
            iconStar.y = this.btnBookmark.height / 2 + 8;
            var an = new BkAnimation();
            an.gameIconFastEffect(iconStar);
            this.btnBookmark.addChild(iconStar);
        }
        this.btnNhiemVu = new BkButton(res_name.btn_bottom_task, res_name.btn_bottom_task, res_name.btn_bottom_task
            , res_name.btn_bottom_task_hover, ccui.Widget.PLIST_TEXTURE,null);

        this.btnNhiemVu.setTitleText("Nhi?m v?");
        this.btnNhiemVu.setTitleFontSize(fontTextSize);
        this.btnNhiemVu.setTitleColor(cc.color.WHITE);
        if(bk.showCreateDesktopIconTutorial != 0)
        {
            this.btnNhiemVu.x = this.btnBookmark.x + btnMarginbtn;
        }else
        {
            this.btnNhiemVu.x = startX;
        }
        this.btnNhiemVu.y = marginTop;
        this.addChild(this.btnNhiemVu);
        BkLogicManager.getLogic().getDailyTaskList();
        BkLogicManager.getLogic().setOnLoadComplete(this);
        this.btnNhiemVu.addClickEventListener(function () {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            var layer = new BkDailyTaskWindow();
            layer.showWithParent();
            sendGA(BKGA.GAME_CHOOSE, "click btnNhiemVu", BkGlobal.clientDeviceCheck);
        });
        this.numTaskBg = new BkSprite("#" + res_name.bg_notification_email);
        this.numTaskBg.x = this.btnNhiemVu.x + 0.3 * this.btnNhiemVu.width + this.numTaskBg.width / 2 - 3;
        this.numTaskBg.y = this.btnNhiemVu.y + 0 * this.btnNhiemVu.height + this.numTaskBg.height - 3 ;
        this.numTaskBg.visible = false;
        this.addChild(this.numTaskBg);
        this.numTaskTxt = new BkLabel("0", "", 14);
        this.numTaskTxt.x = this.numTaskBg.x;
        this.numTaskTxt.y = this.numTaskBg.y;
        this.numTaskTxt.visible = false;
        this.addChild(this.numTaskTxt);

        this.btnBonus = new BkButton(res_name.btn_bottom_bonus, res_name.btn_bottom_bonus, res_name.btn_bottom_bonus
            , res_name.btn_bottom_bonus_hover, ccui.Widget.PLIST_TEXTURE);

        this.btnBonus.setTitleText("Ti?n thu?ng");
        this.btnBonus.setTitleFontSize(fontTextSize);
        this.btnBonus.setTitleColor(cc.color.WHITE);
        this.btnBonus.x = this.btnNhiemVu.x + btnMarginbtn;
        this.btnBonus.y =  this.btnNhiemVu.y;
        this.addChild(this.btnBonus);
        this.btnBonus.addClickEventListener(function ()
        {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            var layer = new BkBonusWindow();
            layer.showWithParent();
            sendGA(BKGA.GAME_CHOOSE, "click btnBonus", BkGlobal.clientDeviceCheck);
        });
        var startAni = new BkStarAnimation();
        startAni.x = this.btnBonus.x - 15;
        startAni.y = this.btnBonus.y + 10;
        startAni.showStarEffect();
        this.addChild(startAni);

        this.btnFriend = new BkButton(res_name.btn_bottom_friend, res_name.btn_bottom_friend, res_name.btn_bottom_friend
            , res_name.btn_bottom_friend_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnFriend.setTitleText("B?n b�");
        this.btnFriend.setTitleFontSize(fontTextSize);
        this.btnFriend.setTitleColor(cc.color.WHITE);
        this.btnFriend.x = this.btnBonus.x + btnMarginbtn;
        this.btnFriend.y =  this.btnNhiemVu.y;
        this.addChild(this.btnFriend);
        this.btnFriend.addClickEventListener(function () {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            var layer = new BkFriendsWindow();
            layer.showWithParent();
            sendGA(BKGA.GAME_CHOOSE, "click btnFriend", BkGlobal.clientDeviceCheck);
        });

        this.btnShop = new BkButton(res_name.btn_bottom_shop, res_name.btn_bottom_shop, res_name.btn_bottom_shop
            , res_name.btn_bottom_shop_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnShop.setTitleText("C?a h�ng");
        this.btnShop.setTitleFontSize(fontTextSize);
        this.btnShop.setTitleColor(cc.color.WHITE);
        this.btnShop.x = this.btnFriend.x + btnMarginbtn;
        this.btnShop.y =  this.btnNhiemVu.y;
        this.addChild(this.btnShop);
        this.btnShop.addClickEventListener(function () {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            var layer = new BkShoppingWindow();
            layer.showWithParent();
            sendGA(BKGA.GAME_CHOOSE, "click btnShop", BkGlobal.clientDeviceCheck);
        });

        this.btnMail = new BkButton(res_name.btn_bottom_email, res_name.btn_bottom_email, res_name.btn_bottom_email
            , res_name.btn_bottom_email_hover, ccui.Widget.PLIST_TEXTURE,null);
        this.btnMail.setTitleText("H�m thu");
        this.btnMail.setTitleFontSize(fontTextSize);
        this.btnMail.setTitleColor(cc.color.WHITE);
        this.btnMail.x = this.btnShop.x + btnMarginbtn;
        this.btnMail.y =  this.btnNhiemVu.y;
        this.addChild(this.btnMail);
        this.btnMail.addClickEventListener(function () {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            var layer = new BkMailsWindow();
            layer.showWithParent();
            sendGA(BKGA.GAME_CHOOSE, "click btnMail", BkGlobal.clientDeviceCheck);
        });

        this.mailNumBg = new BkSprite("#" + res_name.bg_notification_email);
        this.mailNumBg.x = this.btnMail.x + 0.3 * this.btnMail.width + this.mailNumBg.width / 2 - 3;
        this.mailNumBg.y = this.btnMail.y + 0 * this.btnMail.height + this.mailNumBg.height - 3;
        this.mailNumBg.visible = false;
        this.addChild(this.mailNumBg);
        this.mailNumTxt = new BkLabel("0", "", 14);
        this.mailNumTxt.x = this.mailNumBg.x;
        this.mailNumTxt.y = this.mailNumBg.y;
        this.mailNumBg.visible = false;
        this.addChild(this.mailNumTxt);
        this.updateMailNum(BkGlobal.UserInfo);
    },
    onLoadComplete: function(o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case c.NETWORK_GET_DAILY_TASK_LIST_RETURN:
                var taskCompletedCount = BkLogicManager.getLogic().getTaskCompletedCount(o);
                this.btnNhiemVu.setBlinking(taskCompletedCount > 0,res_name.blinking);
                this.updateTaskCompletedNum(taskCompletedCount);
                BkLogicManager.getLogic().dailyTaskList = o;
                break;
        }
        Util.removeAnim();
    },
    createTooltipRename: function () {
        var fontSize = 15;
        var tooltip = new BkSprite("#" + res_name.bg_thongBaoCachDoiTen);
        var itemStr = [
            new BkLabelItem("Tên hiện tại của bạn là : ", fontSize, BkColor.DEFAULT_TEXT_COLOR, 1, false),
            new BkLabelItem(BkGlobal.UserInfo.getUserName(), fontSize, BkColor.HEADER_CONTENT_COLOR, 1, false),
            new BkLabelItem("Để đổi tên đăng nhập xin hãy bấm vào Avatar", fontSize, BkColor.DEFAULT_TEXT_COLOR, 2, false),
        ];
        var lblDisplayName = new BkLabelSprite(itemStr);
        lblDisplayName.x = 12;
        lblDisplayName.y = tooltip.getContentSize().height / 2;
        tooltip.addChild(lblDisplayName);

        tooltip.x = this.playerAvatar.x + tooltip.getContentSize().width / 2 - 20;
        tooltip.y = this.playerAvatar.y - tooltip.getContentSize().height / 2 - 20;
        this.addChild(tooltip);
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
            this.btnMail.setBlinking(true,res_name.blinking);
        } else {
            this.mailNumBg.visible = false;
            this.mailNumTxt.visible = false;
            this.mailNumTxt.setString("0");
            this.btnMail.setBlinking(false);
        }
    },
    updateTaskCompletedNum: function (count) {
        if (!this.numTaskBg || !this.numTaskTxt)
        {
            return;
        }
        if (count > 0) {
            this.numTaskBg.visible = true;
            this.numTaskTxt.visible = true;
            this.numTaskTxt.setString(count);
        } else {
            this.numTaskBg.visible = false;
            this.numTaskTxt.visible = false;
            this.numTaskTxt.setString("0");
        }
    },

    updateTextPosButton: function () {
        var textMarginTop = 15;
        this.btnBonus.getTitleRenderer().y -= textMarginTop;
        this.btnShop.getTitleRenderer().y -= textMarginTop;
        this.btnMail.getTitleRenderer().y -= textMarginTop;
        this.btnFriend.getTitleRenderer().y -= textMarginTop;
        this.btnNhiemVu.getTitleRenderer().y -= textMarginTop;
        if(bk.showCreateDesktopIconTutorial != 0)
        {
            this.btnBookmark.getTitleRenderer().y -= textMarginTop;
        }
    },
    updatebtnPayment:function()
    {
        if(this.btnPayment != undefined && this.btnPayment != null)
        {
            this.btnPayment.removeSelf();
        }
        this.btnPayment = new BkBtnPayment(GS.CHOOSE_GAME, BkGlobal.addMoneyBonusType);
        this.btnPayment.x = this.btnScreenShot.x - this.btnPayment.width / 2 - this.btnScreenShot.width / 2 - 5;
        this.btnPayment.y = this.btnFullScreen.y;
        if(cc.isShowWdByIp){
            this.addChild(this.btnPayment);
        }
        this.btnPayment.setOnlickListenner(function () {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            var layer = new BkPaymentWindow();
            layer.showWithParent();
            sendGA(BKGA.GAME_CHOOSE, "click btnPayment", BkGlobal.clientDeviceCheck);
        });
    },
    updateUserState: function () {
        var commonLogic = BkLogicManager.getLogic();
        this.updatebtnPayment();
        //Show fb push bonus money
        if (bk.showBnWdFlag) {
            this.showBonusMoney();
        } else
        //Show register phone
        //if (BkGlobal.UserSetting.isPhoneUpdatable && !bk.isFbApp && !BkGlobal.isAutoCreateAccount)
        //{
        //    this.registerPhoneWd = new BkRegisterPhoneNumberWindow();
        //    this.registerPhoneWd.showWithParent();
        //}
        if (BkGlobal.isFbRenameable && BkGlobal.isLoginFacebook)
        {
            //Thong bao doi ten fb
            logMessage("Call createTooltipRename");
            this.createTooltipRename();
        }
        //daily bonus popup
        //else if (commonLogic.hasDailyBonus) {
        //    showPopupMessageWith("B?n du?c thu?ng 1000 " + BkConstString.getGameCoinStr() + " cho l?n dang nh?p n�y.");
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
    },
    showBonusMoney: function () {
        var playerBonusWd = new BkPlayerBonusWd();
        playerBonusWd.setCallbackRemoveWindow(function () {
            bk.showBnWdFlag = false;
        });
        playerBonusWd.showWithParent();
    },
    doJoinTable: function (gid, selectedRoomType) {
        BkGlobal.currentGameID = gid;
        var dfValue = JSON.stringify(RT.ROOM_TYPE_BINH_DAN);
        if ((BkGlobal.currentGameID == GID.CO_TUONG) || (BkGlobal.currentGameID == GID.CO_UP)) {
            dfValue = JSON.stringify(RT.ROOM_TYPE_SOLO);
        }
        var lastRoomType = Util.getClientSetting(key.userLastRoomType + "_" + gid + "_" + cc.username.toLowerCase(), true, dfValue);
        if (selectedRoomType != undefined) {
            lastRoomType = selectedRoomType;
        }
        logMessage("lastRoomType " + lastRoomType);
        BkLogicManager.getLogic().doJoinWebGameRoom(BkGlobal.currentGameID, lastRoomType, BkGlobal.currentRoomID);
        sendGA(BKGA.GAME_CHOOSE, "Click " + Util.getGameLabel(gid), BkGlobal.clientDeviceCheck);
    },
    sortGameByOrderAsc: function (item1, item2) {
        return item1.order - item2.order;
    },

    sortGameByOrderDesc: function (item1, item2) {
        return item2.order - item1.order;
    },

    setVisibleCtr: function (ctrl, isVisible) {
        if (ctrl != undefined) {
            ctrl.setVisible(isVisible);
        }
    },


    visibleTop: function (isVisible) {
        if (this.topSprite != undefined) {
            this.topSprite.setVisible(isVisible);
        }
    },

    showRegisterPushbtn:function()
    {
        this.btnRegisterPush = new BkButton(res_name.btn_bottom_nhanthongbao, res_name.btn_bottom_nhanthongbao, res_name.btn_bottom_nhanthongbao
            , res_name.btn_bottom_nhanthongbao_hover, ccui.Widget.PLIST_TEXTURE,null);
        this.btnRegisterPush.setTitleText("Th�ng b�o");
        this.btnRegisterPush.setTitleFontSize(14);
        this.btnRegisterPush.setTitleColor(cc.color.WHITE);
        this.btnRegisterPush.x = this.btnMail.x + 105;
        this.btnRegisterPush.y =  this.btnNhiemVu.y;
        this.addChild(this.btnRegisterPush);
        this.btnRegisterPush.getTitleRenderer().y -= 12 ;//textMarginTop;
        this.btnRegisterPush.addClickEventListener(function ()
        {
            Util.openPushWindow();
            sendGA(BKGA.GAME_CHOOSE, "click btnRegister Push", BkGlobal.clientDeviceCheck);
        });
        this.btnRegisterPush.setBlinking(true,res_name.blinking);
        this.notifyBg = new BkSprite("#" + res_name.bg_notification_email);
        this.notifyBg.x = this.btnRegisterPush.x + 0.3 * this.btnRegisterPush.width + this.notifyBg.width / 2 - 3;
        this.notifyBg.y = this.btnRegisterPush.y + 0 * this.btnRegisterPush.height + this.notifyBg.height - 3 ;
        this.notifyBg.visible = true;
        this.addChild(this.notifyBg);
        this.notifyTxt = new BkLabel("1", "", 14);
        this.notifyTxt.x = this.notifyBg.x;
        this.notifyTxt.y = this.notifyBg.y;
        this.notifyTxt.visible = true;
        this.addChild(this.notifyTxt);
    },

});

var BkMainAppGameLayer = BkGameBaseLayer.extend({

    ctor: function (gameState) {
        this._super(gameState);
        /*
        this.initGameButton(this.getGameList(true));
        changeGameBg(BkGlobal.currentGameID,BkGlobal.currentGS);
        this.page1 = new BkSprite("#" + res_name.page1);
        this.page2 = new BkSprite("#" + res_name.page2);
        this.page1.x = cc.winSize.width/2 + 3;
        this.page1.y = cc.winSize.height/2 - 165;
        this.page2.x =  this.page1.x ;
        this.page2.y =  this.page1.y;
        this.addChild(this.page1);
        this.addChild(this.page2);
        this.page1.visible = true;
        this.isVisiblePage1 =  true;
        this.page2.visible = false;
        var self = this;
        this.page1.setOnlickListenner(function () {
            if (self.isAnimationChange) {
                return;
            }
            self.isClickPrevious = 0;
            self.setVisiblePage();
            self.initGameButton(self.getGameList(self.gameSortOrder));
        });
        this.page2.setOnlickListenner(function () {
            if (self.isAnimationChange) {
                return;
            }
            self.isClickPrevious = 1;
            self.setVisiblePage();
            self.initGameButton(self.getGameList(self.gameSortOrder));
        });
        this.page1.setMouseOnHover();
        this.page2.setMouseOnHover();
        */
    },
    setVisiblePage:function()
    {
            this.page1.visible = !this.isVisiblePage1;
            this.page2.visible = this.isVisiblePage1;
            this.isVisiblePage1 = !this.isVisiblePage1;
    },
    creatSpriteListGame: function (gameList) {
        var listHotGame = [];
        var listNewGame = [];
        if (cc.game.config.app) {
            if (cc.game.config.app.listHotGame) {
                listHotGame = cc.game.config.app.listHotGame.split(',');
            }
            if (cc.game.config.app.listNewGame) {
                listNewGame = cc.game.config.app.listNewGame.split(',');
            }
        }
        var self = this;
        var pos;
        var rtnSprite = new BkSprite();
        var order = 0;
        for (var i = 0; i < gameList.length; i++) {
            //Check new page
            if (i >= 10) {
                break;
            }
            var setting = gameList[i];
            var btnGame = new BkButton(setting.res.active, setting.res.active, setting.res.disable, setting.res.hover, ccui.Widget.PLIST_TEXTURE);
            btnGame.setEnableButton(setting.isEnable);
            pos = this.getPosOfButton(order);
            order++;
            btnGame.x = pos.x;
            btnGame.y = pos.y;
            btnGame.setName(setting.gid);
            rtnSprite.addChild(btnGame);
            btnGame.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.onClickGame(sender.getName());
                }
            }, this);
            var indexHot = listHotGame.indexOf(setting.gid.toString());
            var indexNew = listNewGame.indexOf(setting.gid.toString());

            if (listHotGame && listHotGame.length > 0 && indexHot >= 0) {
                var iconHot = new BkSprite("#" + res_name.icon_hot);
                iconHot.x = btnGame.x + btnGame.width / 2 - 26;
                iconHot.y = btnGame.y + btnGame.height / 2 - 25;
                rtnSprite.addChild(iconHot);
            }
            if (listNewGame && listNewGame.length > 0 && indexNew >= 0) {
                var iconNew = new BkSprite("#" + res_name.icon_new);
                iconNew.x = btnGame.x + btnGame.width / 2 - 30;
                iconNew.y = btnGame.y + btnGame.height / 2 - 29;
                var an = new BkAnimation();
                an.gameIconEffect(iconNew);
                rtnSprite.addChild(iconNew);
            }
        }

        return rtnSprite;
    },
    initGameButton: function (gameList) {
        var bgZoder = this.background.getLocalZOrder();
        var layerBtn = bgZoder + 3;
        var layerMask = bgZoder + 2;
        var layerListgame = bgZoder + 1;
        if (this.gameListSprite != null) {
            this.gameListSprite.removeFromParent();
        }

        this.gameListSprite = new BkSprite();
        this.addChild(this.gameListSprite, layerBtn);
        this.gameListSprite.setContentSize(cc.winSize);
        this.gameListSprite.x = cc.winSize.width / 2;
        this.gameListSprite.y = cc.winSize.height / 2;
        var self = this;
        this.btnPrevious = Util.createBtnNav(res_name.btn_prev, function () {
            if (self.isAnimationChange) {
                return;
            }
            self.isClickPrevious = 1;
            self.setVisiblePage();
            self.initGameButton(self.getGameList(self.gameSortOrder));
        });

        this.btnPrevious.y = cc.winSize.height / 2 + this.btnPrevious.height / 2 - 25;
        this.btnPrevious.x =  cc.winSize.width/2 - 625/2 - 145;
        this.gameListSprite.addChild(this.btnPrevious);
        this.btnNext = Util.createBtnNav(res_name.btn_next, function () {
            if (self.isAnimationChange) {
                return;
            }
            self.isClickPrevious = 0;
            self.setVisiblePage();
            self.initGameButton(self.getGameList(self.gameSortOrder));
        });
        this.btnNext.x = cc.winSize.width/2 + 625/2 +  145;
        this.btnNext.y = this.btnPrevious.y;
        this.gameListSprite.addChild(this.btnNext);

        var isDoAnimation = true;
        var deltaYListGame = 0.5;

        if (this.gameSortOrder) {
            if (this.listGameTab2 != null) {
                this.listGameTab2.removeFromParent();
                this.listGameTab2 = null;
            }
            if (this.listGameTab2 == null) {
                this.listGameTab2 = this.creatSpriteListGame(gameList);
                this.listGameTab2.setContentSize(cc.winSize);
                this.listGameTab2.x = cc.winSize.width / 2;
                this.listGameTab2.y = cc.winSize.height / 2 + deltaYListGame;
                this.addChild(this.listGameTab2, layerListgame);
            }

            if (!isDoAnimation) {
                if (this.listGameTab1 != null) {
                    this.listGameTab1.removeFromParent();
                    this.listGameTab1 = null;
                }
            }
        } else {
            if (this.listGameTab1 != null) {
                this.listGameTab1.removeFromParent();
                this.listGameTab1 = null;
            }
            if (this.listGameTab1 == null) {
                this.listGameTab1 = this.creatSpriteListGame(gameList);
                this.listGameTab1.setContentSize(cc.winSize);
                this.listGameTab1.x = cc.winSize.width / 2;
                this.listGameTab1.y = cc.winSize.height / 2 + deltaYListGame;
                this.addChild(this.listGameTab1, layerListgame);
            }

            if (!isDoAnimation) {
                if (this.listGameTab2 != null) {
                    this.listGameTab2.removeFromParent();
                    this.listGameTab2 = null;
                }
            }
        }

        if (!isDoAnimation) {
            return;
        }

        this.doAnimationChange(deltaYListGame);
    },

    doAnimationChange: function (deltaYListGame) {
        var self = this;
        var delta = 170 + 170;
        var xPos1 = cc.winSize.width / 2 - delta;//cc.winSize.width;
        var xPos2 = cc.winSize.width / 2 + delta;//cc.winSize.width;
        var yPosC = cc.winSize.height / 2 + deltaYListGame;
        var xPosC = cc.winSize.width / 2;

        if (this.isClickPrevious == -1) {
            this.listGameTab1.setVisible(true);
        } else {
            this.isAnimationChange = true;
            var f = function () {
                if (self.gameSortOrder) {
                    self.listGameTab1.removeFromParent();
                    self.listGameTab1 = null;
                } else {
                    self.listGameTab2.removeFromParent();
                    self.listGameTab2 = null;
                }
                self.isAnimationChange = false;
            };
            var dur = 0.2;
            var callback = cc.callFunc(f, this);
            var actionMovetoCenter = cc.moveTo(dur, xPosC, yPosC);
            var actionMovetoLeft = cc.moveTo(dur, xPos1, yPosC);
            var actionMovetoRight = cc.moveTo(dur, xPos2, yPosC);
            var sequenceMovetoCenter = cc.sequence(actionMovetoCenter, callback);

            if (this.isClickPrevious == 1) {
                if (this.gameSortOrder) {
                    this.listGameTab1.runAction(actionMovetoLeft);
                    this.listGameTab2.x = xPos2;
                    this.listGameTab2.runAction(sequenceMovetoCenter);
                } else {
                    this.listGameTab2.runAction(actionMovetoRight);
                    this.listGameTab1.x = xPos1;
                    this.listGameTab1.runAction(sequenceMovetoCenter);
                }
            } else {
                if (this.gameSortOrder) {
                    this.listGameTab1.runAction(actionMovetoLeft);
                    this.listGameTab2.x = xPos2;
                    this.listGameTab2.runAction(sequenceMovetoCenter);
                } else {
                    this.listGameTab2.runAction(actionMovetoRight);
                    this.listGameTab1.x = xPos1;
                    this.listGameTab1.runAction(sequenceMovetoCenter);
                }
            }
        }
    },

    getPosOfButton: function (iPos) {
        var marginLR = 145;
        var btnMargin = 170;
        var marginTop = 114;
        var iconHeight = 172;
        var rowOffset = 10;
        var yPos1 = cc.winSize.height - marginTop - iconHeight/2;
        var yPos2 = yPos1 - rowOffset - iconHeight;
        var yPos = yPos1;

        var xPos = marginLR + (Math.floor(iPos / 2)) * btnMargin -5;
        if ((iPos % 2) == 1) {
            yPos = yPos2;
        }
        return cc.p(xPos, yPos);
    },

    getGameList: function (sortAsc) {
        this.gameSortOrder = !sortAsc;
        var gameList = Util.getGameSettingList();
        var gameListAfterSort = gameList.sort(sortAsc ? this.sortGameByOrderAsc : this.sortGameByOrderDesc);
        var startIndex = 4;
        if (this.gameSortOrder) {
            var rtnListTab2 = [];
            gameListAfterSort = gameList.sort(this.sortGameByOrderAsc);
            //var lengthGL = gameListAfterSort.length;
            for (var j = startIndex; j < (startIndex +10); j++) {
                rtnListTab2.push(gameListAfterSort[j]);
            }
            return rtnListTab2;
        }

        var rtnList = [];
        for (var i = 0; i < 10; i++) {
            rtnList.push(gameListAfterSort[i]);
        }

        return rtnList.sort(this.sortGameByOrderAsc);
    },
    onClickGame: function (gid) {
        if (self.isAnimationChange) {
            return;
        }
        if (gid == GID.CHAN) {
            goToChanWeb();
            return;
        }
        if (BkGlobal.currentGS == GS.PREPARE_GAME) {
            if (bk.isFbApp) {
                processLoginFb();
            } else {
                var selectRegisTab = BkGlobal.isNewRegistraion ? 2 : 1;
                this.showLoginWindow(selectRegisTab);
            }
        } else {
            if (!BkLogicManager.getLogic().isDoneLoadRes){
                logMessage("!isDoneLoadRes -> don't process click action");
                Util.showAnim(false);
                return;
            }
            if(gid == GID.SOCCER)
            {
                var mainSoccerWD = new BkMainSoccerWindow(self);
                mainSoccerWD.showWithParent();
                sendGA(BKGA.GAME_CHOOSE, "click btnSoccer", BkGlobal.clientDeviceCheck);
                return;
            }
            BkGlobal.currentGameID = gid;
            this.doJoinTable(gid);
        }
    },
});

var BkSubAppGameLayer = BkGameBaseLayer.extend({
    subGameListSprite: null,
    currentPageNum: null,
    fbAppIndex:null,
    ctor: function (gameState) {
        this.marginBtnBottom = cc.p(380, 80);
        this._super(gameState);
        this.fbAppIndex = parseInt(bk.fbAppIndex);
        if (Util.isGameCo(this.fbAppIndex)) {
            this.background.initWithSpriteFrameName(res_name.bg_co_subapp);
        } else {
            this.background.initWithSpriteFrameName(res_name.bg_bai_subapp);
        }
        //changeGameBg(this.fbAppIndex);

        // init game label
        var appIconName = "#fbapp_"+this.fbAppIndex+".png";
        var imgNameGame = new BkSprite(appIconName);
        imgNameGame.x = cc.winSize.width / 2 + 50;
        imgNameGame.y = cc.winSize.height - 125;

        this.addChild(imgNameGame);

        this.initPromotionNaviGame();

        this.initGameButton();
    },

    initGameButton: function (gameList) {
        if (Util.isGameCo(this.fbAppIndex)) {
            btnGame1 = createBkButtonPlist(res_name.btn_co_cham, res_name.btn_co_cham_hover, res_name.btn_co_cham, res_name.btn_co_cham_hover);
            btnGame2 = createBkButtonPlist(res_name.btn_co_nhanh, res_name.btn_co_nhanh_hover, res_name.btn_co_nhanh, res_name.btn_co_nhanh_hover);
        }else{
            var btnGame1 = createBkButtonPlist(res_name.btn_bai_binh_dan, res_name.btn_bai_binh_dan_hover, res_name.btn_bai_binh_dan, res_name.btn_bai_binh_dan_hover);
            var btnGame2 = createBkButtonPlist(res_name.btn_bai_solo, res_name.btn_bai_solo_hover, res_name.btn_bai_solo, res_name.btn_bai_solo_hover);
        }
        var self = this;

        btnGame1.x = this.background.getContentSize().width / 2 - btnGame1.getContentSize().width / 2 + 75;
        btnGame1.y = this.background.getContentSize().height / 2 - 50;
        this.addChild(btnGame1);
        btnGame1.addClickEventListener(function () {
            self.onClickGame(self.fbAppIndex, RT.ROOM_TYPE_BINH_DAN);
        });

        btnGame2.x = btnGame1.x + btnGame1.getContentSize().width / 2 + btnGame2.getContentSize().width / 2 + 50;
        btnGame2.y = btnGame1.y;
        this.addChild(btnGame2);
        btnGame2.addClickEventListener(function () {
            self.onClickGame(self.fbAppIndex, RT.ROOM_TYPE_SOLO);
        });
    },

    initPromotionNaviGame: function () {
        if(bk.subAppList.length == 0){
            return;
        }
        var promoGameList = bk.subAppList.split(",");

        this.bgSubAppListNav = new BkSprite("#" + res_name.frame_listgames);
        this.bgSubAppListNav.x = this.bgSubAppListNav.getContentSize().width / 2 + 30;
        this.bgSubAppListNav.y = this.bgSubAppListNav.getContentSize().height / 2 + 55;
        this.addChild(this.bgSubAppListNav, -2);

        this.curIndex = 0;
        this.currentPageNum = 1;
        this.createSubAppGame(promoGameList);
    },

    createSubAppGame: function (gameList) {
        if (this.subGameListSprite != null) {
            this.subGameListSprite.removeFromParent();
        }
        this.subGameListSprite = new BkSprite();

        var self = this;
        var pageNumber = Math.floor((gameList.length + SUB_APP_ITEM_PER_PAGE - 1) / SUB_APP_ITEM_PER_PAGE);
        var beginPageIdx = this.curIndex;

        if (pageNumber > 1) {
            this.btnPrevious = Util.createBtnNav(res_name.arrow_up, function () {
                if (self.currentPageNum <= pageNumber) {
                    self.currentPageNum -= 1;
                    if (self.currentPageNum < 1) {
                        self.currentPageNum = pageNumber;
                    }
                    self.curIndex = self.currentPageNum * SUB_APP_ITEM_PER_PAGE - SUB_APP_ITEM_PER_PAGE;

                } else {
                    self.currentPageNum -= 1;
                    self.curIndex = 0;
                }
                self.createSubAppGame(gameList);
            });

            this.btnPrevious.y = this.bgSubAppListNav.getHeight() + 12;
            this.btnPrevious.x = 75;
            this.subGameListSprite.addChild(this.btnPrevious);
            this.btnNext = Util.createBtnNav(res_name.arrow_down, function () {
                if (self.currentPageNum >= pageNumber) {
                    self.currentPageNum = 1;
                    self.curIndex = 0;
                } else {
                    self.currentPageNum += 1;
                    self.curIndex = self.currentPageNum * SUB_APP_ITEM_PER_PAGE - SUB_APP_ITEM_PER_PAGE;
                }
                self.createSubAppGame(gameList);
            });
            this.btnNext.x = this.btnPrevious.x;
            this.btnNext.y = 38;
            this.subGameListSprite.addChild(this.btnNext);
        }
        this.subGameListSprite.x = 40;
        this.subGameListSprite.y = 30;

        var beginPosY = this.bgSubAppListNav.getHeight();
        for (var i = beginPageIdx; i < gameList.length; i++) {
            if (i % SUB_APP_ITEM_PER_PAGE == 0) {
                if (i >= beginPageIdx + SUB_APP_ITEM_PER_PAGE) {
                    this.curIndexc = i;
                    break;
                }
            }
            var gid = parseInt(gameList[i]);
            var gameIcon = this.createSubAppItem(gid);
            if (gameIcon != null) {
                gameIcon.y = beginPosY - 75 + 0.5;
                beginPosY = gameIcon.y;
                this.subGameListSprite.addChild(gameIcon);
            }
        }
        this.addChild(this.subGameListSprite);
    },

    createSubAppItem: function (gid) {
        var subAppItem = new BkSprite();
        var subAppSp = new BkSprite(res.Tranperent_IMG, cc.rect(0,0,170,60));
        subAppSp.x = subAppSp.getWidth()/2;
        subAppSp.y = subAppSp.getHeight()/2;
        subAppItem.addChild(subAppSp);
        var appPromoName = "#promo_app_"+gid+".png";
        var gameIcon = new BkSprite(appPromoName);
        gameIcon.x = gameIcon.getWidth()/2;
        gameIcon.y = gameIcon.getHeight()/2;
        subAppItem.addChild(gameIcon);

        var bgSubAppHover = new cc.Scale9Sprite(res_name.top_bg_hover, cc.rect(10,1,10,1));
        bgSubAppHover.setContentSize(cc.size(170, 60));
        bgSubAppHover.x = bgSubAppHover.getContentSize().width/2 - 7.5;
        bgSubAppHover.y = bgSubAppHover.getContentSize().height/2 - 8;
        bgSubAppHover.setVisible(false);
        subAppItem.addChild(bgSubAppHover, -1);
        var self = this;
        subAppSp.setMouseOnHover(
            function () {
                bgSubAppHover.setVisible(true);
            },
            function () {
                bgSubAppHover.setVisible(false);
            });

        subAppSp.setOnlickListenner(function () {
            //var appLink = createFbUrl("fbgame/" + gid+ "/");
            var appLink = Util.getFBAppLinkUrl(gid);
            logMessage("applink:" + appLink);
            openUrl(appLink);
        });
        return subAppItem;
    },

    onClickGame: function (gid, selRoomType) {
        if (gid == GID.CHAN) {
            goToChanWeb();
            return;
        }
        if (BkGlobal.currentGS == GS.PREPARE_GAME) {
            processLoginFb();
        } else {
            this.doJoinTable(gid, selRoomType);
        }
    }
});

var BkSubPrepareGameLayer = BkSubAppGameLayer.extend({
    ctor: function () {
        this._super();
    }
});

var BkSubChooseGameLayer = BkSubAppGameLayer.extend({
    ctor: function () {
        this._super();
    }
});

var BkPrepareGameLayer = BkMainAppGameLayer.extend({
    loginWindow: null,
    chooseAccountWindow: null,
    ctor: function () {
        this._super();
    },

    showLoginWindow: function (tab) {
        this.loginWindow = new BkLoginRegisterWindow(tab);
        this.loginWindow.setParentWindow(this);
        var self = this;
        this.loginWindow.setCallbackRemoveWindow(function () {
            self.visibleTop(true);
        });
        self.visibleTop(false);
        this.loginWindow.showWithParent();
    },

    visibleLoginForm: function (isVisible) {
        if (this.loginWindow != undefined && this.loginWindow instanceof BkLoginRegisterWindow) {
            this.loginWindow.setVisible(isVisible);
        }
    },

    showChooseAccountWindow: function (tab) {
        if(this.chooseAccountWindow == undefined){
            this.chooseAccountWindow = new VvChooseAccountWindow();
            this.chooseAccountWindow.setParentWindow(this);
            var self = this;
            this.chooseAccountWindow.setCallbackRemoveWindow(function () {
                self.visibleTop(true);
            });
            self.visibleTop(false);
        }
        this.chooseAccountWindow.showWithParent();
    },

    visibleChooseAccWd: function (isVisible) {
        this.chooseAccountWindow.removeFromParent();
    },
});

var BkChooseGameLayer = BkMainAppGameLayer.extend({

    ctor: function () {
        this._super();
    }
});