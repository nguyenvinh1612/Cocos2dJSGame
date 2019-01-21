/**
 * Created by hoangthao on 21/10/2015.
 */

BS_ICO_PADDING_LR = 85;
BS_ITEM_ADJUST_WIDTH = 76;
BS_ITEM_LINE_HEIGHT = 13;

VvBonusWindow = VvWindow.extend({
    sph: cc.spriteFrameCache,
    registerPhoneNumberWD: null,
    luckyboxWD: null,
    inviteFriendLists: null,
    excludeFriendList: null,
    ctor: function (isHideLuckyBox) {
        this.sph.addSpriteFrames(res.vv_bonus_window_plist, res.vv_bonus_window_img);
        var height = 426;
        if (isHideLuckyBox != undefined && isHideLuckyBox == true) {
            height = 440;
        } else {
            if (BkGlobal.isPhoneNumberUpdatable) {
                if(Util.isShowDesktopPromo()){
                    height = 498;
                }
            }
        }

        var popupSize = cc.size(700, height);
        this._super("Tiền thưởng", popupSize);

        this.initWd(isHideLuckyBox);
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"FreeGoldScene");
    },
    initWd: function (isHideLuckyBox) {
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(true);
        var self = this;
        var fontSize = 14;
        //Invite friend
        var fbInviteFriendBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.vv_textInstruction_bg));
        fbInviteFriendBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
        fbInviteFriendBg.height = 94;
        this.addChildBody(fbInviteFriendBg);
        fbInviteFriendBg.x = this.getBodySize().width / 2;
        fbInviteFriendBg.y = this.getBodySize().height - fbInviteFriendBg.height / 2 - 25;

        var bmFbInviteFr = new BkSprite(this.sph.getSpriteFrame(res_name.vv_moiban_facebook));
        this.addChildBody(bmFbInviteFr);
        bmFbInviteFr.x = fbInviteFriendBg.x + fbInviteFriendBg.width/2 - bmFbInviteFr.width/2 - 10;
        bmFbInviteFr.y = fbInviteFriendBg.y;

        var btnMoiBan = createBkButtonPlist(res_name.vv_btn_moiban, res_name.vv_btn_moiban, res_name.vv_btn_moiban, res_name.vv_btn_moiban_hover);
        btnMoiBan.setTitleText("Mời bạn");
        btnMoiBan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnMoiBan.x = fbInviteFriendBg.x + 0.5;
        btnMoiBan.y = fbInviteFriendBg.y - 20.5;
        btnMoiBan.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                BkLogicManager.getLogic().onClickInviteFBFriend();
            }
        }, this);
        var fbFrMoney = 50;
        if (cc.game.config.app && cc.game.config.app.inviteFrBonus) {
            fbFrMoney = cc.game.config.app.inviteFrBonus + BkConstString.getGameCoinStr();
        }
        var fbMnIv = Util.getFriendCost();
        var strFBVL = ""+formatNumber(fbMnIv) +"  ";
        var inviStr = [
            new BkLabelItem("Chức năng mời bạn Facebook đang tắt để bảo trì, mời bạn quay lại sau.", 14, BkColor.TEXT_INPUT_COLOR, 1, false)];
        if (cc.isShowWdByIp) {
            inviStr = [
                new BkLabelItem("Mời bạn chơi Chắn Vạn Văn qua ", fontSize, BkColor.TEXT_INPUT_COLOR, 1, false),
                new BkLabelItem("Facebook", fontSize, cc.color(0,0,255), 1, true),
                new BkLabelItem(" để nhận thưởng không giới hạn, với", fontSize, BkColor.TEXT_INPUT_COLOR, 1, false),
                new BkLabelItem('mỗi người bạn nhận được lời mời, bạn sẽ nhận được ', fontSize, BkColor.TEXT_INPUT_COLOR, 2, false),
                new BkLabelItem(fbMnIv, fontSize,  cc.color(0,0,255), 2, true),
                new BkLabelItem(' quan trong game.', fontSize, BkColor.TEXT_INPUT_COLOR, 2, false)
            ];
            this.addChildBody(btnMoiBan);
        }

        var lbGuidelineInv = new BkLabelSprite(inviStr);
        lbGuidelineInv.x = lbGuidelineInv.getContentSize().width / 2 - 105;
        lbGuidelineInv.y = fbInviteFriendBg.y + lbGuidelineInv.getContentSize().height / 2;
        this.addChildBody(lbGuidelineInv);

        if (isHideLuckyBox != undefined && isHideLuckyBox == true) {
            return;
        }

        //Lucky box
        var luckyBoxBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.vv_textInstruction_bg));
        luckyBoxBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
        luckyBoxBg.height = 94;
        this.addChildBody(luckyBoxBg);
        luckyBoxBg.x = this.getBodySize().width / 2;
        luckyBoxBg.y = fbInviteFriendBg.y - fbInviteFriendBg.height - BS_ITEM_LINE_HEIGHT;

        var bmLuckyBox = new BkSprite(this.sph.getSpriteFrame(res_name.vv_CloseBox));
        this.addChildBody(bmLuckyBox);
        bmLuckyBox.x = bmFbInviteFr.x;
        bmLuckyBox.y = luckyBoxBg.y;

        var btnLuckbox = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        this.addChildBody(btnLuckbox);
        btnLuckbox.setTitleText("Mở hộp");
        btnLuckbox.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnLuckbox.x = luckyBoxBg.x;
        btnLuckbox.y = luckyBoxBg.y - 20;
        btnLuckbox.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.onClickOpenLuckyBox();
            }
        }, this);

        var lbGuidelineLkBox = new BkLabel("Hãy mở hộp quà may mắn mỗi ngày để nhận thêm quan từ Chắn Vạn Văn.","",fontSize);
        lbGuidelineLkBox.setTextColor(BkColor.TEXT_INPUT_COLOR);
        lbGuidelineLkBox.x = luckyBoxBg.x - luckyBoxBg.width/2 + lbGuidelineLkBox.getContentSize().width/2 + 20;
        lbGuidelineLkBox.y = luckyBoxBg.y + luckyBoxBg.height/2 - lbGuidelineLkBox.getContentSize().height - 7;
        this.addChildBody(lbGuidelineLkBox);

        if (BkGlobal.isPhoneNumberUpdatable) {
            //Register phone
            var regPhoneBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.vv_textInstruction_bg));
            regPhoneBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
            regPhoneBg.height = 94;
            this.addChildBody(regPhoneBg);
            regPhoneBg.x = this.getBodySize().width / 2;
            regPhoneBg.y = luckyBoxBg.y - luckyBoxBg.height - BS_ITEM_LINE_HEIGHT;

            var bmregPhone = new BkSprite(this.sph.getSpriteFrame(res_name.vv_xacthuc_sdt));
            this.addChildBody(bmregPhone);
            bmregPhone.x = bmFbInviteFr.x;
            bmregPhone.y = regPhoneBg.y - 2;

            var btnregPhone = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
            this.addChildBody(btnregPhone);
            btnregPhone.setTitleText("Đăng ký");
            btnregPhone.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnregPhone.x = regPhoneBg.x;
            btnregPhone.y = regPhoneBg.y - 20;
            btnregPhone.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.onClickRegisterPhone();
                }
            }, this);

            var bonusMoney = Util.getRegPhoneBonus();
            var phoneStr = [
                new BkLabelItem("Hãy xác thực tài khoản của bạn bằng cách đăng ký số điện thoại với Chắn Vạn Văn", fontSize, BkColor.TEXT_INPUT_COLOR, 1, false),
                new BkLabelItem("và nhận thưởng lên đến ", fontSize, BkColor.TEXT_INPUT_COLOR, 2, false),
                new BkLabelItem(formatNumber(bonusMoney), fontSize, cc.color(0,0,255), 2, true),
                new BkLabelItem(' quan.', fontSize, BkColor.TEXT_INPUT_COLOR, 2, false)
            ];

            var lbGuidelineRegPhone = new BkLabelSprite(phoneStr);
            lbGuidelineRegPhone.x = lbGuidelineRegPhone.getContentSize().width / 2 - 197;
            lbGuidelineRegPhone.y = regPhoneBg.y + lbGuidelineRegPhone.height / 2;
            this.addChildBody(lbGuidelineRegPhone);
        }
        else if(Util.isShowDesktopPromo()){
            var desktopAppBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.vv_textInstruction_bg));
            desktopAppBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
            desktopAppBg.height = 94;
            this.addChildBody(desktopAppBg);
            desktopAppBg.x = this.getBodySize().width / 2;
            desktopAppBg.y = luckyBoxBg.y - luckyBoxBg.height - BS_ITEM_LINE_HEIGHT;

            var icoDesktopApp = new BkSprite(this.sph.getSpriteFrame(res_name.vv_installDesktop));
            this.addChildBody(icoDesktopApp);
            icoDesktopApp.x = bmFbInviteFr.x;;
            icoDesktopApp.y = desktopAppBg.y;

            var btnDesktopApp = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
            this.addChildBody(btnDesktopApp);
            btnDesktopApp.setTitleText("Tải ngay");
            btnDesktopApp.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnDesktopApp.x = desktopAppBg.x;
            btnDesktopApp.y = desktopAppBg.y - 20;
            btnDesktopApp.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var url = "https://goo.gl/C9tnrX";
                    cc.sys.openURL(url);
                }
            }, this);

            var desktopAppStr = "Cài đặt Chắn Vạn Văn trên máy tính, nhận ngay xu thưởng cho tài khoản mới. " + "\n" +
                "Chơi toàn màn hình, thỏa sức tranh tài !";
            var lbGuideInstallDesktopApp = new BkLabel(desktopAppStr, "Tahoma", fontSize);
            lbGuideInstallDesktopApp.setTextColor(BkColor.TEXT_INPUT_COLOR);
            lbGuideInstallDesktopApp.x = lbGuideInstallDesktopApp.getContentSize().width / 2 + 57;
            lbGuideInstallDesktopApp.y = desktopAppBg.y + lbGuideInstallDesktopApp.height / 2;
            this.addChildBody(lbGuideInstallDesktopApp);
        }
    },

    onClickOpenLuckyBox: function () {
        logMessage("onClickOpenLuckyBox");
        if (this.luckyboxWD != null) {
            this.luckyboxWD.removeSelf();
            this.luckyboxWD = null;
        }

        this.luckyboxWD = new VvLuckyBoxWindow();
        this.luckyboxWD.setParentWindow(this);
        this.luckyboxWD.showWithParent();
    },
    onClickRegisterPhone: function () {
        logMessage("onClickRegisterPhone");
        if (this.registerPhoneWd != null) {
            this.registerPhoneWd.removeSelf();
            this.registerPhoneWd = null;
        }
        if (!BkGlobal.isPhoneNumberUpdatable) {
            return;
        }
        this.registerPhoneWd = new VvRegisterPhoneNumberWindow();
        this.registerPhoneWd.setParentWindow(this);
        this.registerPhoneWd.showWithParent();
        var self = this;
        this.registerPhoneWd.setCallbackRemoveWindow(function () {
            if (self.registerPhoneWd.resData != null) {
                self.removeSelf();
            } else {
                self.setVisible(true);
            }
        });
        self.setVisible(false);
    },

    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
    },
    onExit: function () {
        this.sph.removeSpriteFramesFromFile(res.vv_bonus_window_plist);
        this._super();
    },

});