/**
 * Created by VanChinh on 3/25/2016.
 */

BkLoginRegisterWindow = VvTabWindow.extend({
    _tabBodyLayout: null,
    _tabList: ["Đăng nhập", "Đăng ký"],
    lblWarningMsg: null,
    txtUsername: null,
    txtPassword: null,
    warningSprite: null,
    isHideRegisterTab: false,
    listUserLoggedIn:[],
    isRememberPassWord:true,

ctor: function (tabIndex)
{
    var listAccount = BkUserClientSettings.getListUserLoggedIn();
    if(!BkGlobal.isAutoCreateAccount && bk.isDesktopApp && listAccount.length > 0 )
        {
            this._tabList = ["Đăng nhập", "Đăng ký"];
        }
    if(cc.game.config.app && cc.game.config.app.disableReg == 1){
            this._tabList = ["Đăng nhập"];
            this.isHideRegisterTab = true;
        }
    this._super("", cc.size(403, 455), this._tabList.length, this._tabList);
        this.initUI(tabIndex);
    },
    initUI: function (tabIndex) {
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(false);
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this._bgBody.visible = false;
        this.visibleBodyContent(false);
        this.addTabChangeEventListener(this.selectedTabEvent, this, tabIndex);

        var bgWd = new BkSprite("#" + res_name.popup_login_bg);
        bgWd.x = this.getWindowSize().width / 2;
        bgWd.y = this.getWindowSize().height / 2 + 15;
        this.addChildBody(bgWd, WD_ZORDER_BODY);
        this.y = this.y + 40;

        this._btnClose.visible = false;
    },

    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function (tabIndex) {
        this.setCurrentTab(tabIndex);
        this.cleanGUI();

        this._tabBodyLayout = new BkSprite();
        this._tabBodyLayout.setContentSize(this.getBodySize().width, this.getBodySize().height);
        this.addChildBody(this._tabBodyLayout, WD_ZORDER_TOP);
        this._tabBodyLayout.x = this.getBodySize().width / 2;
        this._tabBodyLayout.y = this.getBodySize().height / 2;

        switch (tabIndex) {
            case 1:
                this.initLoginTab();
                break;
            case 2:
                this.initRegisterTab();
                break;
            default :
                break;
        }
    },

    cleanGUI: function () {
        if (this._tabBodyLayout != null) {
            this._tabBodyLayout.removeFromParent();
        }
    },

    initLoginTab: function () {
        var self = this;
        var tabBodyHeight = this._tabBodyLayout.height;
        var tabBodyWidth = this._tabBodyLayout.width + 10;

        this.warningSprite = new BkSprite("#" + res_name.iconWarning_login);
        this.warningSprite.x = 60;
        this.warningSprite.y = tabBodyHeight - 30;
        this.warningSprite.setVisible(false);
        this._tabBodyLayout.addChild(this.warningSprite);

        this.lblWarningMsg = new BkLabelTTF("", "", 15);
        this.lblWarningMsg.setDimensions(cc.size(300 * 2, 40 * 2));
        this.lblWarningMsg.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.lblWarningMsg.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.lblWarningMsg.setColor(BkColor.DEFAULT_TEXT_COLOR);
        this.lblWarningMsg.enableShadow(cc.color(0,47,93, 170), cc.p(1, -1));
        this.lblWarningMsg.x = 222;
        this.lblWarningMsg.y = tabBodyHeight - 40;
        this.lblWarningMsg.setString("Nhập thông tin bên dưới để đăng nhập, nếu chưa có tài khoản bấm đăng ký.");
        this._tabBodyLayout.addChild(this.lblWarningMsg);


        this.txtUsername = createEditBox(cc.size(280, 36), res_name.textbox_bg_login);
        this.txtUsername.setMaxLength(20);
        this.txtUsername.setStylePaddingLeft("5px");
        this.txtUsername.x = Math.floor(tabBodyWidth / 2);
        this.txtUsername.y = this.lblWarningMsg.y - 50 + 0.5;
        this.txtUsername.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN);
        this.txtUsername.setPlaceholderFontSize(16);
        this.txtUsername.setFontColor(cc.color.BLACK);
        this.txtUsername.setMaxLength(20);
        this.txtUsername.setFontSize(16);
        this.txtUsername.setAutoFocus(true);
        this.txtUsername.setPlaceHolder("Tên đăng nhập",false);
        this.txtUsername.setString(cc.username);
        this._tabBodyLayout.addChild(this.txtUsername, WD_ZORDER_TOP);
        this.txtUsername.setTabStopToPrevious();

        this.txtPassword = createEditBox(cc.size(280, 36), res_name.textbox_bg_login);
        this.txtPassword.setMaxLength(20);
        this.txtPassword.setStylePaddingLeft("5px");
        this.txtPassword.x = Math.floor(tabBodyWidth / 2);
        this.txtPassword.y = this.txtUsername.y - 52;
        this.txtPassword.setPlaceHolder("Mật khẩu");
        this.txtPassword.setString(cc.password);
        this.txtPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN);
        this.txtPassword.setPlaceholderFontSize(16);
        this.txtPassword.setFontColor(cc.color.BLACK);
        this.txtPassword.setFontSize(16);
        this.txtPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this.txtPassword.setTabStopToNext();
        this._tabBodyLayout.addChild(this.txtPassword, WD_ZORDER_TOP);

        var chkAgree = new BkCheckBox();
        chkAgree.loadTextures(res_name.checkboxLoginNormal,
            res_name.checkboxLoginNormal,
            res_name.checkboxLoginChecked,
            res_name.checkboxLoginNormal,
            res_name.checkboxLoginNormal, ccui.Widget.PLIST_TEXTURE);
        chkAgree.setScale(0.8);
        chkAgree.setSelected(true);
        chkAgree.x = Math.floor(tabBodyWidth / 2) - this.txtPassword.getContentSize().width / 2 + 9;
        chkAgree.y = this.txtPassword.y - 40 + 0.5;
        var self = this;
        chkAgree.addEventListener(function () {
            chkAgree.setSelected(chkAgree.isSelected());
            this.isRememberPassWord = chkAgree.isSelected();
        });
        this._tabBodyLayout.addChild(chkAgree);

        var forChkAgree = new BkSprite();
        var lblAgree = new BkLabel("Lưu mật khẩu", "", 14);
        lblAgree.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR);
        lblAgree.x = lblAgree.getContentSize().width / 2;
        lblAgree.y = lblAgree.getContentSize().height / 2;
        forChkAgree.addChild(lblAgree);

        forChkAgree.x = chkAgree.x + lblAgree.getContentSize().width / 2 + 15;
        forChkAgree.y = chkAgree.y;
        forChkAgree.setContentSize(lblAgree.getContentSize());
        this._tabBodyLayout.addChild(forChkAgree);

        forChkAgree.setOnlickListenner(function () {
            chkAgree.setSelected(!chkAgree.isSelected());
            this.isRememberPassWord = chkAgree.isSelected();
        });

        var forgotPassword = new BkSprite();
        var lblForgotPassword = new BkLabel("Quên mật khẩu?", "", 14);
        lblForgotPassword.x = lblForgotPassword.getContentSize().width / 2;
        lblForgotPassword.y = lblForgotPassword.getContentSize().height / 2;
        forgotPassword.addChild(lblForgotPassword);

        var drawLine = new cc.DrawNode();
        drawLine.drawSegment(cc.p(0, 0), cc.p(lblForgotPassword.getContentSize().width, 0), 0.5, cc.color.WHITE);
        forgotPassword.addChild(drawLine, 0);

        forgotPassword.x = tabBodyWidth - 120;
        forgotPassword.y = forChkAgree.y;
        this._tabBodyLayout.addChild(forgotPassword);

        forgotPassword.setContentSize(lblForgotPassword.getContentSize());

        forgotPassword.setMouseOnHover(
            function () {

            }, function () {

            }
        );

        forgotPassword.setOnlickListenner(function () {
            // Open forgot password window
            var selfP = self;
            var recoveryPasswordWindow = new RecoveryPasswordWindow();
            recoveryPasswordWindow.setParentWindow(self);
            recoveryPasswordWindow.showWithParent();

            recoveryPasswordWindow.setCallbackRemoveWindow(function () {
                selfP.setVisible(true);
                hideToastMessage();
            });
            self.setVisible(false);
        });

        var btnLogin = createBkButtonPlist(res_name.btnLoginNormal, res_name.btnLoginHover, res_name.btnLoginNormal, res_name.btnLoginHover, "Đăng nhập");
        btnLogin.setTitleFontSize(17);
        btnLogin.setTitleColor(cc.color.WHITE);
        btnLogin.x = Math.floor(tabBodyWidth / 2);
        btnLogin.y = chkAgree.y - 50;
        this._tabBodyLayout.addChild(btnLogin);

        var setVisibleInputText = function (isVisible) {
            if (isVisible == undefined) {
                isVisible = true;
            }
            if (self.txtUsername) {
                self.txtUsername.setVisible(isVisible);
            }

            if (self.txtPassword) {
                self.txtPassword.setVisible(isVisible);
            }
        };

        var processLogin = function () {
            logMessage("Do Login");
            if (BkTime.GetCurrentTime() - btnLogin.lastTimeClick < 1000) {
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            btnLogin.lastTimeClick = BkTime.GetCurrentTime();

            self.warningSprite.setVisible(false);
            self.lblWarningMsg.setString("");
            var username = self.txtUsername.getString().trim();
            var password = self.txtPassword.getString().trim();

            if (chkAgree.isSelected() == true) {
                cc.rememberPassword = true;
            }

            // validate input data
            if (username.length === 0) {
                self.showError(BkConstString.STR_MUST_INPUT_NAME, self.txtUsername);
                self.txtUsername.setAutoFocus(true);
                return;
            }
            else if (username.length < 3 || username.length > 20) {
                self.showError(BkConstString.STR_INVALID_NAME + BkConstString.STR_VALID_LENGTH_NAME, self.txtUsername);
                self.txtUsername.setAutoFocus(true);
                return;
            }

            var errMsg = isValidUsername(username, false);
            if (errMsg != "") {
                self.showError(errMsg, self.txtUsername);
                self.txtUsername.setAutoFocus(true);
                return;
            }

            if (password.length === 0) {
                self.showError("Bạn phải nhập mật khẩu", self.txtPassword);
                self.txtPassword.setAutoFocus(true);
                return;
            }
            else if (isEasyPassword(password)) {
                setVisibleInputText(false);
                showPopupConfirmWith("Vì mật khẩu của bạn quá đơn giản nên không thể đăng nhập được vào game, hãy vào di động và đổi mật khẩu sau đó quay lại đây để đăng nhập. Bạn có muốn xem hướng dẫn không?", "",
                    function () {
                        cc.sys.openURL(cc.game.config.app.pwdHelp);
                    },
                    setVisibleInputText,
                    setVisibleInputText, self);
                return;
            }
            errMsg = isValidPassword(password);
            if (errMsg != "") {
                self.showError(errMsg, self.txtPassword);
                self.txtPassword.setAutoFocus(true);
                return;
            }

            cc.username = username;
            cc.password = password;

            // Send login request
            if (!BkLogicManager.getLogic().isLogged) {
                if (BkGlobal.UserInfo == null) {
                    BkGlobal.UserInfo = new BkUserData();
                }
                BkGlobal.UserInfo.setUserName(cc.username);
                BkGlobal.UserInfo.clientID = cc.bkClientId;
                BkGlobal.UserInfo.password = cc.password;
                BkConnectionManager.conStatus = CONECTION_STATE.RELOGIN;
            }
            BkLogicManager.getLogic().setOnLoadComplete(self);
            BkConnectionManager.prepareConnection();
            BkGlobal.isNewRegistraion = false;
            Util.showAnim(false);
        };

        btnLogin.addClickEventListener(function () {
            processLogin();
        });

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (key, event) {
                if (key == cc.KEY.enter && self._currentTab == 1) {
                    processLogin();
                }
            },
        }, this);

        var hoacSprite = new BkSprite("#" + res_name.hoacSprite);
        hoacSprite.x = 206;
        hoacSprite.y = btnLogin.y - hoacSprite.getContentSize().height/2 - 30;
        this._tabBodyLayout.addChild(hoacSprite);

        var btnLoginFb = createBkButtonPlist(res_name.btnLoginFacebookNormal, res_name.btnLoginFacebookHover, res_name.btnLoginFacebookNormal, res_name.btnLoginFacebookHover, "");
        btnLoginFb.x = 206.5;
        btnLoginFb.y = hoacSprite.y - btnLoginFb.getContentSize().height/2 - 20;
        this._tabBodyLayout.addChild(btnLoginFb);


        var self = this;
        btnLoginFb.addClickEventListener(function () {
            if (BkTime.GetCurrentTime() - btnLoginFb.lastTimeClick < 1000) {
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            btnLoginFb.lastTimeClick = BkTime.GetCurrentTime();

            if (chkAgree.isSelected() == true) {
                cc.rememberPassword = true;
            }
            // Send login request
            BkLogicManager.getLogic().setOnLoadComplete(self);
            processLoginFb();
            //self.removeSelf();
        });
    },

    initRegisterTab: function () {
        var self = this;
        var tabBodyHeight = this._tabBodyLayout.height;
        var tabBodyWidth = this._tabBodyLayout.width +10;

        this.warningSprite = new BkSprite("#" + res_name.iconWarning_login);
        this.warningSprite.x = 60;
        this.warningSprite.y = tabBodyHeight - 30;
        this.warningSprite.setVisible(false);
        this._tabBodyLayout.addChild(this.warningSprite);

        this.lblWarningMsg = new BkLabelTTF("", "", 15);
        this.lblWarningMsg.setDimensions(cc.size(300 * 2, 40 *2));
        this.lblWarningMsg.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.lblWarningMsg.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.lblWarningMsg.setColor(BkColor.DEFAULT_TEXT_COLOR);
        this.lblWarningMsg.enableShadow(cc.color(0,47,93, 170), cc.p(1, -1));
        this.lblWarningMsg.x = 220;
        this.lblWarningMsg.y = tabBodyHeight - 40;
        this.lblWarningMsg.setString("Nhập thông tin bên dưới để đăng ký.");
        this._tabBodyLayout.addChild(this.lblWarningMsg);

        this.txtUsername = createEditBox(cc.size(280, 36), res_name.textbox_bg_login);
        this.txtUsername.setMaxLength(20);
        this.txtUsername.setStylePaddingLeft("5px");
        this.txtUsername.x = Math.floor(tabBodyWidth / 2);
        this.txtUsername.y = this.lblWarningMsg.y - 50 + 0.5;
        this.txtUsername.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN);
        this.txtUsername.setPlaceholderFontSize(16);
        this.txtUsername.setFontColor(cc.color.BLACK);
        this.txtUsername.setMaxLength(20);
        this.txtUsername.setFontSize(16);
        this.txtUsername.setAutoFocus(true);
        this.txtUsername.setPlaceHolder("Tên đăng nhập",false);
        this._tabBodyLayout.addChild(this.txtUsername, WD_ZORDER_TOP);
        this.txtUsername.setTabStopToPrevious();

        this.txtPassword = createEditBox(cc.size(280, 36), res_name.textbox_bg_login);
        this.txtPassword.setMaxLength(20);
        this.txtPassword.setStylePaddingLeft("5px");
        this.txtPassword.x = Math.floor(tabBodyWidth / 2);
        this.txtPassword.y = this.txtUsername.y - 52;
        this.txtPassword.setPlaceHolder("Mật khẩu");
        this.txtPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN);
        this.txtPassword.setPlaceholderFontSize(16);
        this.txtPassword.setFontColor(cc.color.BLACK);
        this.txtPassword.setFontSize(16);
        this.txtPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this._tabBodyLayout.addChild(this.txtPassword, WD_ZORDER_TOP);

        this.txtConfirmPassword = createEditBox(cc.size(280, 36), res_name.textbox_bg_login);
        this.txtConfirmPassword.setMaxLength(20);
        this.txtConfirmPassword.setStylePaddingLeft("5px");
        this.txtConfirmPassword.x = Math.floor(tabBodyWidth / 2);
        this.txtConfirmPassword.y = this.txtPassword.y - 52;
        this.txtConfirmPassword.setPlaceHolder("Nhập lại mật khẩu");
        this.txtConfirmPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN);
        this.txtConfirmPassword.setPlaceholderFontSize(16);
        this.txtConfirmPassword.setFontColor(cc.color.BLACK);
        this.txtConfirmPassword.setFontSize(16);
        this.txtConfirmPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this.txtConfirmPassword.setTabStopToNext();
        this._tabBodyLayout.addChild(this.txtConfirmPassword, WD_ZORDER_TOP);

        var processRegister = function () {
            logMessage("Do processRegister");
            if (BkTime.GetCurrentTime() - btnRegister.lastTimeClick < 1000) {
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }

            if(self.isHideRegisterTab == true){
                return;
            }

            btnRegister.lastTimeClick = BkTime.GetCurrentTime();

            self.warningSprite.setVisible(false);
            self.lblWarningMsg.setString("");
            var username = self.txtUsername.getString().trim();
            var password = self.txtPassword.getString().trim();
            var confirmPass = self.txtConfirmPassword.getString().trim();

            // validate input data
            if (username.length === 0) {
                self.showError(BkConstString.STR_MUST_INPUT_NAME, self.txtUsername);
                return;
            }
            else if (username.length < 3 || username.length > 20) {
                self.showError(BkConstString.STR_INVALID_NAME + BkConstString.STR_VALID_LENGTH_NAME, self.txtUsername);
                return;
            }

            var errMsg = isValidUsername(username, false);
            if (errMsg != "") {
                self.showError(errMsg, self.txtUsername);
                self.txtUsername.setAutoFocus(true);
                return;
            }
            var checkDisallowed = isDisallowedUsername(username);
            if (checkDisallowed != "") {
                //self.showError(checkDisallowed, self.txtUsername);
                showPopupMessageWith(checkDisallowed);
                return;
            }

            if (password.length === 0) {
                self.showError("Bạn phải nhập mật khẩu", self.txtPassword);
                return;
            }
            else if (confirmPass.length === 0) {
                self.showError("Bạn phải nhập mật khẩu nhắc lại", self.txtConfirmPassword);
                return;
            }
            else if (confirmPass != password) {
                self.showError("Mật khẩu và mật khẩu nhắc lại không khớp", self.txtConfirmPassword);
                return;
            }

            if (isEasyPassword(password)) {
                self.showError("Mật khẩu quá đơn giản (ví dụ: 123456, abcdef), hãy chọn mật khẩu khác", self.txtPassword);
                return;
            }

            var errMsg = isValidPassword(password);
            if (errMsg != "") {
                self.showError(errMsg, self.txtPassword);
                return;
            }

            cc.username = username;
            cc.password = password;

            BkConnectionManager.prepareConnection();
            if (!BkLogicManager.getLogic().isLogged) {
                BkLogicManager.getLogic().setOnLoadComplete(self);
                BkLogicManager.getLogic().doRegisterUser(cc.username, cc.password, cc.bkClientId);
                BkGlobal.isNewRegistraion = true;
            }

            Util.showAnim(false);
        };

        var btnRegister = createBkButtonPlist(res_name.btnLoginNormal, res_name.btnLoginHover, res_name.btnLoginNormal, res_name.btnLoginHover, "Đăng ký");
        btnRegister.setTitleFontSize(17);
        btnRegister.setTitleColor(cc.color.WHITE);
        btnRegister.x = Math.floor(tabBodyWidth / 2);
        btnRegister.y = this.txtConfirmPassword.y - 60;
        this._tabBodyLayout.addChild(btnRegister);

        btnRegister.addClickEventListener(function () {
            processRegister();
        });

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (key, event) {
                if (key == cc.KEY.enter && self._currentTab == 2) {
                    processRegister();
                }
            },
        }, this);

        var hoacSprite = new BkSprite("#" + res_name.hoacSprite);
        hoacSprite.x = 206.5;
        hoacSprite.y = btnRegister.y - hoacSprite.getContentSize().height/2 - 30;
        this._tabBodyLayout.addChild(hoacSprite);

        var btnLoginFb = createBkButtonPlist(res_name.btnLoginFacebookNormal, res_name.btnLoginFacebookHover, res_name.btnLoginFacebookNormal, res_name.btnLoginFacebookHover, "");
        btnLoginFb.x = 206;
        btnLoginFb.y =  hoacSprite.y - btnLoginFb.getContentSize().height/2 - 20;
        this._tabBodyLayout.addChild(btnLoginFb);
        var self = this;
        btnLoginFb.addClickEventListener(
            function () {
                if (BkTime.GetCurrentTime() - btnLoginFb.lastTimeClick < 1000) {
                    logMessage("click 2 lan trong 1 sec -> don't process action");
                    return;
                }
                btnLoginFb.lastTimeClick = BkTime.GetCurrentTime();

                // Send login request
                BkLogicManager.getLogic().setOnLoadComplete(self);
                processLoginFb();
                //self.removeSelf();
            }
        );
    },
    setSelectedForButton: function (btn, isEnable) {
        if (!btn) {
            return;
        }

        btn.setIsSelected(isEnable);
        if (isEnable) {
            btn.loadTextures(res_name.btnTab_login_active, res_name.btnTab_login_inactive, res_name.btnTab_login_inactive
                , res_name.btnTab_login_active, ccui.Widget.PLIST_TEXTURE);
        } else {
            btn.loadTextures(res_name.btnTab_login_inactive, res_name.btnTab_login_inactive, res_name.btnTab_login_inactive
                , res_name.btnTab_login_inactive, ccui.Widget.PLIST_TEXTURE);
            btn.setTitleColor(cc.color(255,255,255));
        }
    },

    configButtonWithSelectedTab: function (tabIndex) {
        this._super(tabIndex);
            this._btnTab1.y = this._top.y - this._btnTab1.height - TAB_WD_BUTTON_MARGIN_TOP - 6.8;
            this._btnTab2.y = this._btnTab1.y;
    },

    configPosButton: function (startButtonX) {
        startButtonX = typeof startButtonX !== 'undefined' ? startButtonX : TAB_WD_BUTTON_MARGIN_LEFT;

        var btnDefault = this._arrBtnTab[0];
        btnDefault.x = startButtonX + 13.5;
        for (var i = 1; i < this._arrBtnTab.length; i++) {
            var currentBtn = this._arrBtnTab[i];
            var prevBtn = this._arrBtnTab[i - 1];
            currentBtn.x = prevBtn.x + prevBtn.width + TAB_WD_BUTTON_MARGIN + 5;
        }
    },
    onLoadComplete: function (o, packetType) {
        switch (packetType) {
            case c.NETWORK_LOG_IN_FAILURE:
                this.showError(BkConstString.STR_LOGIN_FAILURE, this.txtUsername);
                break;
            case c.NETWORK_REGISTER_FAILURE:
                this.onRegisterFailure(o);
                break;
            case c.NETWORK_REGISTER_EXCEED_MAX:
                this.showError(BkConstString.STR_REGISTER_EXCEED_MAX, this.txtUsername);
                break;
        }
        BkGlobal.isNewRegistraion = false; //reset flag
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
    },
    onRegisterFailure: function (packet) {
        var self = this;
        var setVisibleInputText = function (isVisible) {
            if (isVisible == undefined) {
                isVisible = true;
            }
            if (self.txtUsername) {
                self.txtUsername.setVisible(isVisible);
            }

            if (self.txtPassword) {
                self.txtPassword.setVisible(isVisible);
            }

            if (self.txtConfirmPassword) {
                self.txtConfirmPassword.setVisible(isVisible);
            }
            cc.username = "";
            cc.password = "";
        };
        this.showError("Tên của bạn đã có người đăng ký. Hãy chọn một tên khác.");
        /*
        var regStatus = packet.Buffer.readByte();
        switch (regStatus) {
            case REG_FAIL.FAILURE_PWD:
                this.showError("Mật khẩu bạn thiết lập rất dễ bị đoán. Bạn phải đặt lại mật khẩu bảo mật hơn.", this.txtPassword);
                break;
            case REG_FAIL.SUGGEST_NAME_ERR:
                this.showError(BkConstString.STR_INVALID_NAME + BkConstString.STR_LOGIN_NAME + BkConstString.STR_VALID_CHAR, this.txtUsername);
                break;
            case REG_FAIL.SUGGEST_NEW_NAME:
                var suggestName = packet.Buffer.readString();
                var errMsg = "Tên của bạn đã có người đăng ký. Để đăng ký bạn có thể dùng tên: " + suggestName;
                if (isValidUsername(cc.username) != "") {
                    errMsg = 'Tên đăng nhập chứa ký tự không hợp lệ. Bạn muốn tạo tên đăng nhập là: ' + suggestName + " phải không?";
                }
                setVisibleInputText(false);
                showPopupConfirmWith(errMsg, "Gợi ý tên tài khoản",
                    function () {
                        cc.username = suggestName;
                        cc.password = self.txtPassword.getString().trim();
                        BkLogicManager.getLogic().doRegisterUser(cc.username, cc.password, cc.bkClientId);
                    }, setVisibleInputText,
                    setVisibleInputText, self);
                break;
            default :
                this.showError("Đăng ký không hợp lệ. Hãy thử lại sau!");
        }
        */
    },

    showError: function (msg, ctrl) {
        this.warningSprite.setVisible(true);
        this.lblWarningMsg.setString(msg);
        if (ctrl != undefined) {
            ctrl.setAutoFocus(true);
        }
        hideProgressModalEx();
    },
});