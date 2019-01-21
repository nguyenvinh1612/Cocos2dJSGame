/**
 * Created by hoangthao on 21/10/2015.
 */

BS_ICO_PADDING_LR = 85;
BS_ITEM_ADJUST_WIDTH = 76;
BS_ITEM_LINE_HEIGHT = 13;

BkBonusWindow = BkWindow.extend({
    sph: cc.spriteFrameCache,
    registerPhoneNumberWD: null,
    luckyboxWD: null,
    inviteFriendLists: null,
    excludeFriendList: null,
    ctor: function (isHideLuckyBox) {
        this.sph.addSpriteFrames(res.tien_thuong_plist, res.tien_thuong_img);
        var height = 396;
        if (isHideLuckyBox != undefined && isHideLuckyBox == true) {
            height = 440;
        } else {
            if (BkGlobal.isPhoneNumberUpdatable) {
                if(Util.isShowDesktopPromo()){
                    height = 498;
                }
            }

        }
        var popupSize = cc.size(760, height);
        //Check show update phone wd
        // popupSize = cc.size(740, 440);
        this._super("Tiền thưởng", popupSize);
        this.initWd(isHideLuckyBox);
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"FreeGoldScene");
    },
    initWd: function (isHideLuckyBox) {
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(true);
        this.setDefaultWdBodyBg();
        var self = this;
        //Invite friend
        var fbInviteFriendBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.textInstruction_bg));
        fbInviteFriendBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
        fbInviteFriendBg.height = 89;
        this.addChildBody(fbInviteFriendBg);
        fbInviteFriendBg.x = this.getBodySize().width / 2;
        fbInviteFriendBg.y = this.getBodySize().height - fbInviteFriendBg.height / 2 - 35;

        var bmFbInviteFr = new BkSprite(this.sph.getSpriteFrame(res_name.icon_moiBan));
        this.addChildBody(bmFbInviteFr);
        bmFbInviteFr.x = BS_ICO_PADDING_LR;
        bmFbInviteFr.y = fbInviteFriendBg.y - 2;

        var btnMoiBan = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
        btnMoiBan.setTitleText("Mời bạn");
        btnMoiBan.x = bmFbInviteFr.x + bmFbInviteFr.width + btnMoiBan.width / 2 - 5;
        btnMoiBan.y = fbInviteFriendBg.y - 24.5;
        btnMoiBan.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                BkLogicManager.getLogic().onClickInviteFBFriend();
            }
        }, this);
        var fbFrMoney = 50;
        if (cc.game.config.app && cc.game.config.app.inviteFrBonus) {
            fbFrMoney = cc.game.config.app.inviteFrBonus + BkConstString.getGameCoinStr();
        }
        var invStr = "Chức năng mời bạn Facebook đang tắt để bảo trì, mời bạn quay lại sau.";
        if (cc.isShowWdByIp) {
            invStr = "Mời bạn chơi BigKool qua Facebook để nhận thưởng không giới hạn, với mỗi người \n" +
                "bạn nhận được lời mời, bạn sẽ nhận được " + fbFrMoney + " trong game.";
            this.addChildBody(btnMoiBan);
        }

        var lbGuidelineInv = new BkLabel(invStr, "Tahoma", 15);
        //lbGuidelineInv.setTextColor(cc.color(0, 0, 0));
        lbGuidelineInv.x = bmFbInviteFr.x + bmFbInviteFr.width + lbGuidelineInv.getContentSize().width / 2 - 4;
        lbGuidelineInv.y = fbInviteFriendBg.y + lbGuidelineInv.getContentSize().height / 2;
        this.addChildBody(lbGuidelineInv);

        if (isHideLuckyBox != undefined && isHideLuckyBox == true) {
            return;
        }

        //Lucky box
        var luckyBoxBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.textInstruction_bg));
        luckyBoxBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
        luckyBoxBg.height = 89;
        this.addChildBody(luckyBoxBg);
        luckyBoxBg.x = this.getBodySize().width / 2;
        luckyBoxBg.y = fbInviteFriendBg.y - fbInviteFriendBg.height - BS_ITEM_LINE_HEIGHT;

        var bmLuckyBox = new BkSprite(this.sph.getSpriteFrame(res_name.icon_hopQua));
        this.addChildBody(bmLuckyBox);
        bmLuckyBox.x = BS_ICO_PADDING_LR + 0.5;
        bmLuckyBox.y = luckyBoxBg.y - 2;

        var btnLuckbox = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
        this.addChildBody(btnLuckbox);
        btnLuckbox.setTitleText("Mở hộp");
        btnLuckbox.x = bmLuckyBox.x + bmLuckyBox.width + btnLuckbox.width / 2 - 6.5;
        btnLuckbox.y = luckyBoxBg.y - 24.5;
        btnLuckbox.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.onClickOpenLuckyBox();
            }
        }, this);
        var itemStr = [
            new BkLabelItem("Hãy mở hộp quà may mắn mỗi ngày để nhận thêm " + BkConstString.STR_GAME_COIN + " từ BigKool.", 15, BkColor.DEFAULT_TEXT_COLOR, 1, false)
        ];
        itemStr.push(new BkLabelItem("Lưu ý: tài khoản nhận thưởng phải thường xuyên đăng nhập trên cùng 1 trình duyệt.", 14, cc.color(0, 255, 128), 2, false));
        var lbGuidelineLkBox = new BkLabelSprite(itemStr);
        lbGuidelineLkBox.x = BS_ICO_PADDING_LR + 68;
        lbGuidelineLkBox.y = luckyBoxBg.y + lbGuidelineLkBox.getContentSize().height/2;
        this.addChildBody(lbGuidelineLkBox);

        // show install desktop app
        if(Util.isShowDesktopPromo()){
            var desktopAppBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.textInstruction_bg));
            desktopAppBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
            desktopAppBg.height = 89;
            this.addChildBody(desktopAppBg);
            desktopAppBg.x = this.getBodySize().width / 2;
            desktopAppBg.y = luckyBoxBg.y - luckyBoxBg.height - BS_ITEM_LINE_HEIGHT;

            var icoDesktopApp = new BkSprite(this.sph.getSpriteFrame(res_name.icon_desktop));
            this.addChildBody(icoDesktopApp);
            icoDesktopApp.x = BS_ICO_PADDING_LR + 0.5;
            icoDesktopApp.y = desktopAppBg.y - 2;

            var btnDesktopApp = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
            this.addChildBody(btnDesktopApp);
            btnDesktopApp.setTitleText("Tải ngay");
            btnDesktopApp.x = icoDesktopApp.x + icoDesktopApp.width + icoDesktopApp.width / 2 - 3;
            btnDesktopApp.y = desktopAppBg.y - 24.5;
            btnDesktopApp.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var url = "https://goo.gl/1OG2El";
                    cc.sys.openURL(url);
                }
            }, this);

            var desktopAppStr = "Cài đặt Bigkool trên máy tính, nhận ngay xu thưởng cho tài khoản mới. Chơi toàn " + "\n" +
                "màn hình, thỏa sức tranh tài !";
            var lbGuideInstallDesktopApp = new BkLabel(desktopAppStr, "Tahoma", 15);
            lbGuideInstallDesktopApp.x = icoDesktopApp.x + icoDesktopApp.width + lbGuideInstallDesktopApp.getContentSize().width / 2 - 7;
            lbGuideInstallDesktopApp.y = desktopAppBg.y + lbGuideInstallDesktopApp.height / 2;
            this.addChildBody(lbGuideInstallDesktopApp);
        }

        if (BkGlobal.isPhoneNumberUpdatable) {
            //Register phone
            var regPhoneBg = new cc.Scale9Sprite(this.sph.getSpriteFrame(res_name.textInstruction_bg));
            regPhoneBg.width = this.getBodySize().width - BS_ITEM_ADJUST_WIDTH;
            regPhoneBg.height = 89;
            this.addChildBody(regPhoneBg);
            regPhoneBg.x = this.getBodySize().width / 2;
            regPhoneBg.y = luckyBoxBg.y - luckyBoxBg.height - BS_ITEM_LINE_HEIGHT;
            if(Util.isShowDesktopPromo()){
                regPhoneBg.y = desktopAppBg.y - desktopAppBg.height - BS_ITEM_LINE_HEIGHT;
            }

            var bmregPhone = new BkSprite(this.sph.getSpriteFrame(res_name.icon_dangkysdt));
            this.addChildBody(bmregPhone);
            bmregPhone.x = BS_ICO_PADDING_LR;
            bmregPhone.y = regPhoneBg.y - 2;

            var btnregPhone = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
            this.addChildBody(btnregPhone);
            btnregPhone.setTitleText("Đăng ký");
            btnregPhone.x = bmregPhone.x + bmregPhone.width + btnregPhone.width / 2 - 6;
            btnregPhone.y = regPhoneBg.y - 24.5;
            btnregPhone.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.onClickRegisterPhone();
                }
            }, this);
            //Web only
            var bonusMoney = Util.getRegPhoneBonus() + BkConstString.getGameCoinStr();
            var msgMoney = "được nhận thưởng " + bonusMoney;
            var regPhoneStr = "Hãy đăng ký số điện thoại của bạn với BigKool để được hỗ trợ tốt nhất \n" + msgMoney + " và nhận tiền thưởng hằng ngày.";
            var lbGuidelineRegPhone = new BkLabel(regPhoneStr, "Tahoma", 15);
            lbGuidelineRegPhone.x = bmregPhone.x + bmregPhone.width + lbGuidelineRegPhone.getContentSize().width / 2 - 6;
            lbGuidelineRegPhone.y = regPhoneBg.y + lbGuidelineRegPhone.height / 2;
            this.addChildBody(lbGuidelineRegPhone);
        }
    },

    onClickOpenLuckyBox: function () {
        logMessage("onClickOpenLuckyBox");
        if (this.luckyboxWD != null) {
            this.luckyboxWD.removeSelf();
            this.luckyboxWD = null;
        }
        //var self = this;
        /*if(BkGlobal.isPhoneNumberUpdatable){
         showPopupConfirmWith("Bạn cần đăng ký số điện thoại để được mở hộp quà hằng ngày, bạn có muốn đăng ký không?", "",
         function () {
         self.onClickRegisterPhone();
         },
         null,
         null,
         self);
         return;
         }*/

        this.luckyboxWD = new BkLuckyBoxWd();
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
        this.registerPhoneWd = new BkRegisterPhoneNumberWindow();
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
        this.sph.removeSpriteFramesFromFile(res.tien_thuong_plist);
        this._super();
    },

});