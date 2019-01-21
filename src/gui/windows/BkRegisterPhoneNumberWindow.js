/**
 * Created by hoangthao on 24/10/2015.
 */
function RegPhoneNum() {
}
RegPhoneNum.INVALID_PHONE_NUMBER = 0;
RegPhoneNum.ALREADY_REGISTERED_PHONE_NUMBER = 1;
RegPhoneNum.NOT_WEB_CLIENTID = 2;
RegPhoneNum.CANNOT_GENERATE_TOKEN = 3;
RegPhoneNum.INVALID_COUPON_CODE = 4;
RegPhoneNum.ALREADY_UPDATED_NUMBER = 5;
RegPhoneNum.UPDATE_SUCCESS = 6;

SHOW_UPDATE_PHONE_WD = true;
HIDE_UPDATE_PHONE_WD = false;
PHONE_WD_PADDING_X = 30;
PHONE_WD_COLOR_HIGTLINE = cc.color(253,215,3);

BkRegisterPhoneNumberWindow = BkWindow.extend({
    contentSprite: null,
    tfInput: null,
    tfGuideline: null,
    tfDesc: null,
    resData: null,
    userPhoneNum:null,
    ctor: function (parent) {
        cc.spriteFrameCache.addSpriteFrames(res.tien_thuong_plist, res.tien_thuong_img);
        this._super("Xác thực tài khoản", cc.size(580, 380), parent);
        this.initWd();
    },
    initWd: function () {
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this.setVisibleBottom(false);
        this.setVisibleOutBackgroundWindow(true);
        this.setCallbackRemoveWindow(function () {
            BkGlobal.UserSetting.isPhoneUpdatable = HIDE_UPDATE_PHONE_WD;
            BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
        });

        var bgWd = new BkSprite("#" + res_name.popup_dangkysdt);
        bgWd.x = this.getWindowSize().width / 2;
        bgWd.y = this.getWindowSize().height / 2;
        this.addChildBody(bgWd, WD_ZORDER_BODY);

        this._windowTitle.setFontName(res_name.GAME_FONT_BOLD);
        this._btnClose.y = this._btnClose.y - 38;
        this._btnClose.x = this._btnClose.x + 15;
        this._windowTitle.x = this._windowTitle.x + PHONE_WD_PADDING_X;
        this._windowTitle.y = this._windowTitle.y - 38;

        this.drawContentByStep(1);
    },
    drawEnterPhoneNumberWindow: function () {
        var self = this;
        if (this.contentSprite != null) {
            this.contentSprite.removeSelf();
            this.contentSprite = null;
        }
        this.contentSprite = new BkSprite();
        this.addChildBody(this.contentSprite);
        this.contentSprite.x = this.getBodySize().width / 2;
        this.contentSprite.y = 0;

        var fontSize = 15;
        var bonusMoney = Util.getRegPhoneBonus();

        var itemStr = [
            new BkLabelItem("Hãy xác thực tài khoản bằng số điện thoại để:", fontSize, BkColor.DEFAULT_TEXT_COLOR, 1, true),
            new BkLabelItem(" ✔ Khôi phục tài khoản khi mất mật khẩu.", fontSize, BkColor.DEFAULT_TEXT_COLOR, 2, true),
            new BkLabelItem(" ✔ Được bảo vệ tài khoản khi có tranh chấp.", fontSize, BkColor.DEFAULT_TEXT_COLOR, 3, true),
            new BkLabelItem(" ✔ Được tặng ", fontSize, BkColor.DEFAULT_TEXT_COLOR, 4, true),
            new BkLabelItem(bonusMoney, fontSize, cc.color(255,255,0), 4, false),
            new BkLabelItem(" xu khởi nghiệp.", fontSize, BkColor.DEFAULT_TEXT_COLOR, 4, true),
        ];

        this.tfGuideline = new BkLabelSprite(itemStr);
        this.tfGuideline.x = -this.tfGuideline.getContentSize().width/2 + 20;
        this.tfGuideline.y = this.getBodySize().height / 2 + this.tfGuideline.getContentSize().height / 2 - 10;
        this.contentSprite.addChild(this.tfGuideline);

        var itemStr = [
            new BkLabelItem("Mỗi số điện thoại chỉ xác thực được cho một tài khoản", fontSize, BkColor.DEFAULT_TEXT_COLOR, 1, true),
            new BkLabelItem("Hãy nhập số điện thoại của bạn", fontSize, BkColor.DEFAULT_TEXT_COLOR, 2, true),
        ];
        this.tfDesc = new BkLabelSprite(itemStr);
        this.tfDesc.x = -this.tfDesc.getContentSize().width/2 + 40;
        this.tfDesc.y = this.getBodySize().height / 2 + this.tfDesc.getContentSize().height / 2 - 70;
        this.contentSprite.addChild(this.tfDesc);

        this.tfInput = createEditBox(cc.size(195, 35));
        this.tfInput.setPlaceHolder("Nhập số điện thoại");
        this.tfInput.setFontSize(16);
        this.tfInput.setFontName(res.GAME_FONT);
        this.tfInput.setMaxLength(12);
        this.tfInput.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        this.tfInput.setPaddingLeft("5px");
        this.tfInput.setHeight(35 + "px");
        this.tfInput.setNumericMode();
        this.tfInput.setAutoFocus(true);
        this.tfInput.setTabStop();

        this.tfInput.x = WD_BODY_MARGIN_LR;
        this.tfInput.y = this.tfInput.height/2 + 54;
        this.contentSprite.addChild(this.tfInput);
        this.btnSend = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
        this.btnSend.setTitleText("Kiểm tra");
        this.btnSend.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.onEnterPhoneNumber();
            }
        }, this);
        this.btnSend.x = WD_BODY_MARGIN_LR;
        this.btnSend.y = this.btnSend.height / 2 + 2;
        this.contentSprite.addChild(this.btnSend);

        var tabWidth = 480;
        var tabHeight = 175;

        var bodyContent = new cc.DrawNode();
        bodyContent.drawRect(cc.p(0, 0), cc.p(tabWidth, tabHeight), BkColor.BG_BODY_COLOR, 1, BkColor.BG_BODY_BORDER_COLOR);
        bodyContent.width = tabWidth;
        bodyContent.height = tabHeight;
        bodyContent.x = TAB_WD_BODY_MARGIN_LR * 4 + 5;
        bodyContent.y = TAB_WD_BODY_MARGIN_TB * 2 - 5;
        this.addChildBody(bodyContent, WD_ZORDER_BODY);
    },
    drawContentByStep: function (step) {

        this.drawEnterPhoneNumberWindow();

        var stepbg = null;
        if (step == 1) {
            stepbg = new BkSprite("#" + res_name.registerPhoneB1);
        } else {
            stepbg = new BkSprite("#" + res_name.registerPhoneB2);
        }
        stepbg.x = 35 ;
        stepbg.y = this.getBodySize().height - stepbg.height / 2 - 43;
        var tfStep1Guide = new BkLabel("Kiểm tra số điện thoại", "Tahoma", 14);
        var tfStep1 = new BkLabel("Bước 1", "Tahoma", 17);
        tfStep1.x = -80;
        tfStep1.y = stepbg.y + 10;

        tfStep1Guide.x = tfStep1.x;
        tfStep1Guide.y = stepbg.y - 10;

        var tfStep2Guide = new BkLabel("Nhắn tin xác thực", "Tahoma", 14);
        var tfStep2 = new BkLabel("Bước 2", "Tahoma", 17);
        tfStep2.x = stepbg.x + 120;
        tfStep2.y = tfStep1.y;
        tfStep2Guide.x = tfStep2.x;
        tfStep2Guide.y = tfStep1Guide.y;
        if (step == 1) {
            tfStep2.opacity = 150;
            tfStep2Guide.opacity = 150;
        }
        else {
            tfStep1.opacity = 150;
            tfStep1Guide.opacity = 150;
        }
        this.contentSprite.addChild(stepbg, WD_ZORDER_BODY);
        this.contentSprite.addChild(tfStep1);
        this.contentSprite.addChild(tfStep1Guide);
        this.contentSprite.addChild(tfStep2);
        this.contentSprite.addChild(tfStep2Guide);
    },
    onEnterPhoneNumber: function () {
        if (this.tfInput.getString() == "") {
            showToastMessage(BkConstString.STR_PHONE_NUMBER_EMPTY, this.getWindowSize().width/1.5, this.getBodySize().height / 2);
        }
        else if (Util.isPhoneNumberValidate(this.tfInput.getString())) {
            logMessage("onEnterPhoneNumber");
            this.sendPhoneNum(this.tfInput.getString());
/*            this.resData = {result: 6,bonus:-1};
             this.onConfirmPhoneCouponResult(6,-1);*/
        }
        else {
            showToastMessage(BkConstString.STR_INVALID_PHONE_NUMBER, this.getWindowSize().width/1.5, this.getBodySize().height / 2);
        }
        this.tfInput.setFocus();
    },
    onConfirmPhoneCouponResult: function (result, msgDetail) {
        this.tfInput.setVisible(false);

        if (result == RegPhoneNum.INVALID_PHONE_NUMBER) {
            this.showPopUpNotify(BkConstString.STR_INVALID_PHONE_NUMBER);
        } else if (result == RegPhoneNum.ALREADY_REGISTERED_PHONE_NUMBER) {
            var msg = BkConstString.insertIntoStringWithListString(BkConstString.STR_ALREADY_REGISTERED_PHONE_NUMBER, [msgDetail])
            this.showPopUpNotify(msg);

        } else if (result == RegPhoneNum.NOT_WEB_CLIENTID) {
            this.showPopUpNotify(BkConstString.STR_NOT_WEB_CLIENTID);
        }
        else if (result == RegPhoneNum.CANNOT_GENERATE_TOKEN) {
            this.showPopUpNotify(BkConstString.STR_CANNOT_GENERATE_TOKEN);
        }
        else if (result == RegPhoneNum.INVALID_COUPON_CODE) {
            this.showPopUpNotify(BkConstString.STR_INVALID_COUPON_CODE);
        }
        else if (result == RegPhoneNum.ALREADY_UPDATED_NUMBER) {
            this.showPopUpNotify(BkConstString.STR_ALREADY_UPDATE_PHONE_NUMBER);
        }
        else if (result == RegPhoneNum.UPDATE_SUCCESS) {
            // Send Phone Number Success
            if (cc.isString(msgDetail)) {
                this.initHandleonLoadComplete();
                var phoneNum = this.tfInput.getString();
                this.userPhoneNum = phoneNum;
                this.drawContentByStep(2);
                this.btnSend.setTitleText("Đóng");
                this.btnSend.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        this.closeAllWd();
                    }
                }, this);
                this.tfDesc.setVisible(false);
                var accDescStr ="Để xác thực tài khoản: "+BkGlobal.UserInfo.getUserName();
                var accDesc = new BkLabel(accDescStr, "", 18);
                accDesc.x = WD_BODY_MARGIN_LR;
                accDesc.y = this.getBodySize().height / 2 + accDesc.getContentSize().height / 2 + 18;
                this.contentSprite.addChild(accDesc);

                this.tfGuideline.removeFromParent();
                var itemStr = [
                    new BkLabelItem("Hãy nhắn tin từ số: " , 16, BkColor.DEFAULT_TEXT_COLOR, 2, false),
                    new BkLabelItem(phoneNum , 16, PHONE_WD_COLOR_HIGTLINE, 2, false),
                    new BkLabelItem(" theo cú pháp: " , 16, BkColor.DEFAULT_TEXT_COLOR, 2, false),
                    new BkLabelItem("               BK " , 20, PHONE_WD_COLOR_HIGTLINE, 3, true),
                    new BkLabelItem(msgDetail , 20, PHONE_WD_COLOR_HIGTLINE, 3, true),
                    new BkLabelItem(" gửi đến " , 20, BkColor.DEFAULT_TEXT_COLOR, 3, false),
                    new BkLabelItem("7095" , 20, PHONE_WD_COLOR_HIGTLINE, 3, true),
                    new BkLabelItem("" , 16, BkColor.DEFAULT_TEXT_COLOR, 4, false),
                    new BkLabelItem("                (phí tin nhắn:" , 16, BkColor.DEFAULT_TEXT_COLOR, 5, false),
                    new BkLabelItem(" 1000 " , 16, BkColor.TEXT_MONEY_COLOR, 5, false),
                    new BkLabelItem("đồng)" , 16, BkColor.DEFAULT_TEXT_COLOR, 5, false),
                ];
                this.tfGuideline = new BkLabelSprite(itemStr);
                this.tfGuideline.x = -this.tfGuideline.width + 10;
                this.tfGuideline.y = this.getBodySize().height / 2 + this.tfGuideline.getContentSize().height / 2 - 48;
                this.contentSprite.addChild(this.tfGuideline);
                this.tfInput.setVisible(false);
                //this.tfInput.setString("");
                //this.tfInput.setPlaceHolder("Nhập mã xác nhận");
            }
        }
    },
    showPopUpNotify: function (textMess) {
        var self = this;
        var callBackWithSender = function () {
            self.tfInput.setVisible(true);
            if (self.resData == undefined) {
                self.tfInput.setFocus();
                return;
            }
/*            if (self.resData.result == RegPhoneNum.UPDATE_SUCCESS) {
                if (self.resData.bonus > 0) {
                    BkGlobal.UserSetting.isPhoneUpdatable = HIDE_UPDATE_PHONE_WD;
                    BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
                    BkGlobal.isPhoneNumberUpdatable = false;
                    self.closeAllWd();
                } else {
                    self.tfInput.setFocus();
                }
            } else if (self.resData.result == RegPhoneNum.NOT_WEB_CLIENTID || self.resData.result == RegPhoneNum.CANNOT_GENERATE_TOKEN) {
                self.removeSelf();
            } else {
                self.tfInput.setFocus();
            }*/
        };
        showPopupMessageWith(textMess, "", callBackWithSender,callBackWithSender,self);
    },

    showSucessReg: function (bonus) {
        var self = this;
        postUserTracker(2, BkGlobal.UserInfo.getUserName(), bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, "phoneNum: " + this.userPhoneNum);
        var arrBonus = [formatNumber(bonus)];
        var msg = BkConstString.STR_UPDATE_PHONE_NUMBER_SUCESS;
        if(bonus > 0){
            msg = BkConstString.STR_UPDATE_PHONE_NUMBER_SUCESS + BkConstString.insertIntoStringWithListString(BkConstString.STR_UPDATE_PHONE_NUMBER_MONEY, arrBonus);
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + bonus);
            BkLogicManager.getLogic().processUpdateProfileUI();
        }

        BkGlobal.UserSetting.isPhoneUpdatable = HIDE_UPDATE_PHONE_WD;
        BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
        BkGlobal.isPhoneNumberUpdatable = HIDE_UPDATE_PHONE_WD;
        if (this.contentSprite != null) {
            this.contentSprite.removeSelf();
            this.contentSprite = null;
        }
        this.contentSprite = new BkSprite();
        this.addChildBody(this.contentSprite);
        this.contentSprite.x = this.getWindowSize().width / 2;
        this.contentSprite.y = this.getWindowSize().height / 2;

        var lblSuccess = new BkLabel(msg, "", 17, true);
        lblSuccess.setTextColor(cc.color(255,255,0));
        lblSuccess.x = PHONE_WD_PADDING_X;
        lblSuccess.y = 60;
        this.contentSprite.addChild(lblSuccess);

        var itemStr = [
            new BkLabelItem("Các mục nhận thưởng hằng ngày bao gồm:", 15, PHONE_WD_COLOR_HIGTLINE, 1, false),
            new BkLabelItem("      • Thưởng đăng nhập", 15, PHONE_WD_COLOR_HIGTLINE, 2, false),
            new BkLabelItem("      • Thưởng hộp quà may mắn", 15, PHONE_WD_COLOR_HIGTLINE, 3, false),
            new BkLabelItem("Bạn cần đăng nhập vào web hằng ngày để được nhận thưởng.", 15, PHONE_WD_COLOR_HIGTLINE, 4, false)
        ];
        var lblSuccessNote = new BkLabelSprite(itemStr);
        lblSuccessNote.x = -lblSuccessNote.getContentSize().width/2 + 35;
        lblSuccessNote.y = lblSuccessNote.getContentSize().height/2 - 70;

        this.contentSprite.addChild(lblSuccessNote);
    },
    onEnterCouponCode: function () {
        if (this.tfInput.getString() == "") {
            showToastMessage(BkConstString.STR_COUPON_CODE_EMPTY, this.getWindowSize().width/1.5, this.getBodySize().height / 2);
        }
        if (Util.isCouponCodeValidate(this.tfInput.getString())) {
            logMessage("onEnterCouponCode");
            this.sendPhoneToken(this.tfInput.getString());
        }
        else {
            showToastMessage(BkConstString.STR_INVALID_COUPON_CODE, this.getWindowSize().width/1.5, this.getBodySize().height / 2);
        }
    },
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, packetType) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        this.resData = o;
        switch (packetType) {
            case c.NETWORK_SEND_TOKEN_TO_PHONE:
            case c.NETWORK_VALID_PLAYER_BY_PHONE_CHECK_AND_SEND_TOKEN:
                this.onConfirmPhoneCouponResult(o.result, o.bonus);
                break;
            case c.NETWORK_UPDATE_PHONE_NUMBER:
                this.onConfirmPhoneCouponResult(o.result, o.bonus);
                break;
            case  c.NETWORK_ADD_MONEY_RETURN:
                BkGlobal.isPhoneNumberUpdatable = false;
                BkGlobal.UserSetting.isPhoneUpdatable = HIDE_UPDATE_PHONE_WD;
                BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
                this.closeAllWd();
                break;
        }
        Util.removeAnim();
    },

    sendPhoneNum: function (phoneNum) {
        Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.requestSendTokenToPhoneNumberPacket(this.formatPhoneNum(phoneNum));
        BkConnectionManager.send(packet);
    },

    formatPhoneNum: function (phoneNum) {
        if(phoneNum.indexOf('0') == 0){
            phoneNum = phoneNum.substr(1);
        }
        return "84" + phoneNum;
    },

    sendPhoneToken: function (token) {
        Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.createUpdatePhoneNumberPacket(token);
        BkConnectionManager.send(packet);
    },

    closeAllWd: function () {
        if (this.getParentWindow() != undefined) {
            this.getParentWindow().removeSelf();
        }
        this.removeSelf();
        logMessage("Close: BkRegisterPhoneNumberWindow and parent");
    },
});