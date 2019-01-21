/**
 * Created by VanChinh on 3/29/2016.
 */


RecoveryPasswordWindow = VvWindow.extend({
    txtUsername:null,
    ctor: function(){
        this._super("Khôi phục mật khẩu", cc.size(530, 240));
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        //this.setVisibleTop(false);
        this.setVisibleBgBody(false);
/*
        var bgWd = new BkSprite("#" + res_name.popup_khoiphucmk);
        bgWd.x = this.getWindowSize().width/2 - 0.5;
        bgWd.y = this.getWindowSize().height/2 - 0.5 - 11;
        this.addChildBody(bgWd, WD_ZORDER_BODY);

        this._btnClose.loadTextures(res_name.BtnClose_Window, res_name.BtnClose_Window, res_name.BtnClose_Window
            , res_name.BtnClose_Window_hover, ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x = this._btnClose.x - 40;
        this._btnClose.y = this._btnClose.y + 35;
        */
        this.initUI();
    },

    initUI: function(){
        var self = this;
        var tabBodyWidth = this.getBodySize().width;

        var lblNotice = new BkLabel("Chú ý:", "", 15, true);
        lblNotice.x = Math.floor(tabBodyWidth / 2) - 190;
        lblNotice.y = this.getBodySize().height - 15;
        this.addChildBody(lblNotice);

        var lblNotice1 = new BkLabel("", "", 14);
        lblNotice1.setTextColor(cc.color("#edff88"));
        lblNotice1.setString("Tài khoản cần khôi phục phải là tài khoản đăng ký trên web.");
        lblNotice1.x = Math.floor(tabBodyWidth / 2) + 20;
        lblNotice1.y = lblNotice.y;
        this.addChildBody(lblNotice1);

        this.txtUsername = createEditBox(cc.size(353, 40), res_name.textbox_bg_login);
        this.txtUsername.setMaxLength(22);
        this.txtUsername.setPlaceHolder("Tên tài khoản");
        this.txtUsername.setFontColor(cc.color.BLACK);
        this.txtUsername.setMaxLength(20);
        this.txtUsername.setFontSize(16);
        this.txtUsername.setPaddingLeft("3px");
        this.txtUsername.x = Math.floor(tabBodyWidth / 2);
        this.txtUsername.y = lblNotice.y - 50;
        this.addChildBody(this.txtUsername, WD_ZORDER_TOP);
        this.txtUsername.setAutoFocus(true);
        this.txtUsername.setTabStop();
        this.addEditbox(this.txtUsername);

        var btnRecoveryPassword = createBkButtonPlist(res_name.btnLoginNormal, res_name.btnLoginHover, res_name.btnLoginNormal, res_name.btnLoginHover, "Khôi phục");
        btnRecoveryPassword.setTitleFontSize(17);
        btnRecoveryPassword.setTitleColor(cc.color.WHITE);
        btnRecoveryPassword.x = Math.floor(tabBodyWidth / 2);
        btnRecoveryPassword.y = this.txtUsername.y - 60;
        this.addChildBody(btnRecoveryPassword);

        btnRecoveryPassword.addClickEventListener(function(){
            if(BkTime.GetCurrentTime() - btnRecoveryPassword.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            btnRecoveryPassword.lastTimeClick = BkTime.GetCurrentTime();

            var username = self.txtUsername.getString().trim();

            if (username == "") {
                showToastMessage(BkConstString.STR_MUST_INPUT_NAME, cc.winSize.width / 2, cc.winSize.height / 2 - 30, 2, 200);
                self.txtUsername.setAutoFocus(true);
                return;
            }
            var errMsg = isValidUsername(username);
            if (errMsg != "") {
                showToastMessage(errMsg, cc.winSize.width / 2, cc.winSize.height / 2 - 30, 2, 400);
                self.txtUsername.setAutoFocus(true);
                return;
            }

            BkConnectionManager.prepareConnection();
            BkLogicManager.getLogic().setOnLoadComplete(self);
            BkLogicManager.getLogic().processForgotPass(username, cc.bkClientId);
            Util.showAnim();
        });
    },
    onLoadComplete: function (o, packetType) {
        var self = this;
        var closeDialogCb = function () {
            if (self.txtUsername) {
                self.txtUsername.setVisible(true);
            }
            self.removeSelf();
        };
        self.txtUsername.setVisible(false);
        var currentPassword = o;

        switch (packetType) {
            case c.NETWORK_FORGOT_PASSWORD:
                showPopupMessageWith("Mật khẩu đã được gửi tới số điện thoại bạn đã đăng ký. Nếu không được xin hãy liên hệ CSKH.", "", null, closeDialogCb, self);
                break;
            case c.NETWORK_FORGOT_PASSWORD_RETURN:
                showPopupConfirmWith("Khôi phục mật khẩu thành công,\n mật khẩu của bạn là: " + currentPassword, "", null, closeDialogCb, closeDialogCb, self);
                break;
            case c.NETWORK_WRONG_USERNAME_OR_CLIENT_ID:
                showPopupMessageWith("Bạn phải nhập chính xác tên đăng nhập đã đăng ký ở trên trình duyệt này.", "", null, closeDialogCb, self);
                break;
        }
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
    },
});