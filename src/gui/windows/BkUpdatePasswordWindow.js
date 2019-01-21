/**
 * Created by VanChinh on 10/30/2015.
 */
WD_PASS_PADDING_INPUT = 325;
WD_PASS_INPUT_SIZE = cc.size(240, 32);
WD_PW_SETUP_PADDING = 50;
BkUpdatePasswordWindow = VvWindow.extend({
    isCreatePass: null,
    newPass: null,
    txtOldPass:null,
    txtNewPass:null,
    txtReNewPass:null,
    ctor: function (isCreatePass){
        cc.spriteFrameCache.addSpriteFrames(res.vv_nap_tien_plist, res.vv_nap_tien_img);
        this.isCreatePass = isCreatePass;
        var wdSize = cc.size(500, 301);
        if(this.isCreatePass){
            this._super("Thiết lập mật khẩu", wdSize);
        }
        else {
            wdSize = cc.size(500, 330);
            this._super("Thay đổi mật khẩu", wdSize);
        }

        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.setDefaultWdBodyBgSprite();
        this._bodyContentBg.y += 5;
        var widBody = this._windowSize.width*0.9;
        var heiBody = this._windowSize.height*0.75;
        this._bodyContentBg.setScaleX(widBody/624);
        this._bodyContentBg.setScaleY(heiBody/435);
        this.initUI();
    },
    initUI: function (){
        var lblNotify = new BkLabel("Bạn cần nhập chính xác mật khẩu cũ. Mật khẩu mới dài từ 6 \nđến 20 kí tự, nên chứa ít nhất một chữ cái in hoa và một chữ số.", "Tahoma", 14);
        lblNotify.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        if(this.isCreatePass){
            lblNotify.setString("Mật khẩu mới dài từ 6 đến 20 kí tự, nên chứa ít nhất một chữ\n cái in hoa và một chữ số.");
        }
        lblNotify.x = lblNotify.getContentSize().width / 2 + WD_PW_SETUP_PADDING;
        lblNotify.y = this.getBodySize().height - lblNotify.getContentSize().height / 2 - 35;
        this.addChildBody(lblNotify);

        var lblOldPass = new BkLabel("Mật khẩu cũ: ", "Tahoma", 14);
        lblOldPass.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblOldPass.x = lblOldPass.getContentSize().width / 2 + WD_PW_SETUP_PADDING;
        lblOldPass.y = lblNotify.y - lblNotify.getContentSize().height / 2 - lblOldPass.getContentSize().height / 2 - 20;
        this.addChildBody(lblOldPass);

        var txtOldPassword = createEditBox(WD_PASS_INPUT_SIZE, res_name.edit_text);
        this.txtOldPass = txtOldPassword;
        txtOldPassword.setMaxLength(20);
        txtOldPassword.setPaddingLeft("5px");
        txtOldPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        txtOldPassword.x = WD_PASS_PADDING_INPUT;
        txtOldPassword.y = lblOldPass.y;
        txtOldPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        txtOldPassword.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.addChildBody(txtOldPassword);
        txtOldPassword.setAutoFocus(true);
        txtOldPassword.setTabStopToPrevious();
        this.addEditbox(txtOldPassword);

        var lblNewPass = new BkLabel("Mật khẩu mới: ", "Tahoma", 14);
        lblNewPass.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblNewPass.x = lblNewPass.getContentSize().width / 2 + WD_PW_SETUP_PADDING;
        lblNewPass.y = txtOldPassword.y - txtOldPassword.getContentSize().height / 2 - lblNewPass.getContentSize().height / 2 - 15;
        this.addChildBody(lblNewPass);

        var txtNewPassword = createEditBox(WD_PASS_INPUT_SIZE, res_name.edit_text);
        this.txtNewPass = txtNewPassword;
        txtNewPassword.setMaxLength(20);
        txtNewPassword.setPaddingLeft("5px");
        txtNewPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        txtNewPassword.x = WD_PASS_PADDING_INPUT;
        txtNewPassword.y = lblNewPass.y;
        txtNewPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        txtNewPassword.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.addChildBody(txtNewPassword);
        this.addEditbox(txtNewPassword);

        var lblConfirmPass = new BkLabel("Nhập lại mật khẩu mới: ", "Tahoma", 14);
        lblConfirmPass.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblConfirmPass.x = lblConfirmPass.getContentSize().width / 2 + WD_PW_SETUP_PADDING;
        lblConfirmPass.y = txtNewPassword.y - txtNewPassword.getContentSize().height / 2 - lblConfirmPass.getContentSize().height / 2 - 15;
        this.addChildBody(lblConfirmPass);

        var txtConfirmPassword = createEditBox(WD_PASS_INPUT_SIZE, res_name.edit_text);
        this.txtReNewPass = txtConfirmPassword;
        txtConfirmPassword.setMaxLength(20);
        txtConfirmPassword.setPaddingLeft("5px");
        txtConfirmPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        txtConfirmPassword.x = WD_PASS_PADDING_INPUT;
        txtConfirmPassword.y = lblConfirmPass.y;
        txtConfirmPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        txtConfirmPassword.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.addChildBody(txtConfirmPassword);
        txtConfirmPassword.setTabStopToNext();
        this.addEditbox(txtConfirmPassword);

        var btnUpdate = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnUpdate.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnUpdate.setTitleText("Cập nhật");
        btnUpdate.setZoomScale(0);
        btnUpdate.x = txtConfirmPassword.x - txtConfirmPassword.getContentSize().width/2 + btnUpdate.width/2;
        btnUpdate.y = txtConfirmPassword.y - txtConfirmPassword.getContentSize().height / 2 - btnUpdate.height / 2 - 10;
        this.addChildBody(btnUpdate);

        if(this.isCreatePass){
            lblNewPass.y = lblNotify.y - lblNotify.getContentSize().height / 2 - lblNewPass.getContentSize().height / 2 - 20;
            txtNewPassword.y = lblNewPass.y;
            lblConfirmPass.y = txtNewPassword.y - txtNewPassword.getContentSize().height / 2 - lblConfirmPass.getContentSize().height / 2 - 20;
            txtConfirmPassword.y = lblConfirmPass.y;
            lblOldPass.visible = false;
            txtOldPassword.visible = false;
            txtOldPassword.setString(BkGlobal.UserInfo.password);
            btnUpdate.setTitleText("Thiết lập");
            btnUpdate.y = txtConfirmPassword.y - txtConfirmPassword.getContentSize().height / 2 - btnUpdate.height / 2 - 10;
        }

        var self = this;
        btnUpdate.addTouchEventListener(
            function (sender, type){
                if(type == ccui.Widget.TOUCH_ENDED){
                    var winSize = cc.director.getWinSize();
                    var toastPos = cc.p(winSize.width / 3, winSize.height / 3);
                    // send update password request
                    var oldPass = txtOldPassword.getString();
                    var newPass = txtNewPassword.getString();
                    var confirmPass = txtConfirmPassword.getString();

                    // validate input data
                    if(oldPass.trim().length === 0 || newPass.trim().length === 0 || confirmPass.trim().length === 0){
                        showToastMessage("Bạn chưa nhập đầy đủ thông tin!", toastPos.x, toastPos.y, 2, 200);
                        return;
                    }

                    if (newPass != confirmPass){
                        showToastMessage("Mật khẩu mới không khớp.", toastPos.x, toastPos.y, 2, 200);
                        return;
                    }

                    if (newPass.length < 6 || newPass.length > 20){
                        showToastMessage("Mật khẩu mới phải có độ dài tối thiểu là 6 kí tự và tối đa 20 kí tự.", toastPos.x, toastPos.y, 2, 200);
                        return;
                    }

                    if (newPass == oldPass){
                        showToastMessage("Mật khẩu mới phải khác mật khẩu cũ.", toastPos.x, toastPos.y, 2, 200);
                        return;
                    }

                    var strValidatePass = Util.validatePassword(BkGlobal.UserInfo.getUserName(), newPass);
                    if (strValidatePass != ""){
                        showToastMessage(strValidatePass, toastPos.x, toastPos.y, 2);
                        return;
                    }

                    // Send mail packet
                    var bkCommonLogic = BkLogicManager.getLogic();
                    bkCommonLogic.setOnLoadComplete(self);
                    bkCommonLogic.doUpdatePassword(oldPass, newPass);
                    this.newPass = newPass;
                }
            },
            this);
    },

    onLoadComplete: function (obj, type) {
        var winSize = cc.director.getWinSize();
        if(type == c.NETWORK_UPDATE_PASSWORD_SUCCESS) {
            BkGlobal.UserInfo.password = this.newPass;
            this.newPass = null;
            var self = this;

            this.txtOldPass.removeFromParent();
            this.txtNewPass.removeFromParent();
            this.txtReNewPass.removeFromParent();

            //Update login state
            var userInfo = Util.getClientSession(key.userLoginInfo, true);
            if (userInfo != null && userInfo.username != undefined)
            {
                userInfo.password = BkGlobal.UserInfo.password;
                Util.setClientSetting(key.userLoginInfo, JSON.stringify(userInfo));
                Util.setClientSession(key.userLoginInfo, JSON.stringify(userInfo));
            }
            var listUserLoggedIn = BkUserClientSettings.getListUserLoggedIn();
            var userIndex = BkUserClientSettings.getUserIndex(userInfo.username,listUserLoggedIn);
            if(userIndex != -1)
            {
                listUserLoggedIn[userIndex +  1] = BkGlobal.UserInfo.password;
                Util.setClientSetting(key.ListLoggedInUsers, JSON.stringify(listUserLoggedIn));
            }

            showPopupMessageWith("Cập nhật mật khẩu mới thành công.", "",
                function () {
                    self.removeSelf();
                },
                function () {
                    self.removeSelf();
                });
        }
        else if(type == c.NETWORK_UPDATE_PASSWORD_FAILED)
        {
            this.newPass = null;
            showToastMessage("Mật khẩu cũ bị sai. Hãy kiểm tra lại.", winSize.width / 3, winSize.height / 3, 2);
        }
    },
    onExit: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.vv_nap_tien_plist);
        this._super();
    }
});