/**
 * Created by hoangthao on 22/10/2015.
 */
FB_SETUP_BEGIN_ITEM_Y = 1.15;
FB_SETUP_PADDING = 30;
FB_SETUP_PADDING_INPUT = 290;
FB_SETUP_LINK_USER = 0;
FB_SETUP_RENAME = 1;

EXISTING_NAME  = 0;
UPDATE_NAME_SUCCESS  = 1;
PROHIBITED_NAME  = 2;
UPDATED_BEFORE  = 3;

BkFbUserSetupWindow = VvWindow.extend({
    fbLinkUserSprite: null,
    setupType: null,
    txtUser: null,
    txtPassword: null,
    userName:null,
    facebookId:null,
    accessToken:null,
    ctor: function (type, userName, facebookId, accessToken) {
        this.userName = userName;
        this.facebookId = facebookId;
        this.accessToken = accessToken;
        this.setupType = type; // 0 or 1
        var title = "Đổi tên đăng nhập";
        if (this.setupType == FB_SETUP_LINK_USER) {
            title = "Liên kết tài khoản";
        }
        this._super(title, cc.size(530, 301));
        this.setMoveableWindow(true);
        this.setVisibleOutBackgroundWindow(true);
        this.setDefaultWdBodyBgSprite();
        this._bodyContentBg.y +=10;
        this.initWd();

        if (this.setupType == FB_SETUP_LINK_USER && this.userName != null && this.accessToken != null) {
            this.setCallbackRemoveWindow(this.onCloseWindows);
        }
    },

    initWd: function () {
        // this.setDefaultWdBodyBg();

        if (this.fbLinkUserSprite != null) {
            this.fbLinkUserSprite.removeSelf();
            this.fbLinkUserSprite = null;
        }
        this.fbLinkUserSprite = new BkSprite();
        this.addChildBody(this.fbLinkUserSprite);
        if (this.setupType == FB_SETUP_RENAME) {
            this.drawRenameUser();
        } else if (this.setupType == FB_SETUP_LINK_USER) {
            this.drawLinkUser();
        }
    },
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onCloseWindows:function() {
        if (this.setupType == FB_SETUP_LINK_USER) {
            if (this.facebookId != null && this.accessToken != null) {
                BkFacebookMgr.doRegisterFbUser(this.facebookId,this.accessToken,cc.bkClientId);
            }
        }
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        if(tag == c.UPDATE_PLAYER_NAME) {
            switch (o) {
                case EXISTING_NAME:
                    this.showPopUpNotify(BkConstString.STR_EXISTING_NAME);
                    break;
                case UPDATE_NAME_SUCCESS:
                    BkGlobal.isFbRenameable = false;
                    BkGlobal.UserInfo.setUserName(this.txtUser.getString());
                    var curScene = getCurrentScene();
                    if (((curScene instanceof VVChooseGame)) || (curScene instanceof VvLobby)) {
                        curScene.updateAvatar(BkGlobal.UserInfo);
                    }
                    //Update user name setting
                    var userInfo = Util.getClientSetting(key.userLoginInfo, true);
                    var oldUserName = undefined;
                    if (userInfo.username != undefined) {
                        oldUserName = userInfo.username;
                        userInfo.username = this.txtUser.getString();
                        Util.setClientSetting(key.userLoginInfo, JSON.stringify(userInfo));
                        Util.setClientSession(key.userLoginInfo, JSON.stringify(userInfo));
                    }
                    if(oldUserName != undefined){
                        var listUserLoggedIn = BkUserClientSettings.getListUserLoggedIn();
                        var userIndex = BkUserClientSettings.getUserIndex(oldUserName,listUserLoggedIn);
                        if(userIndex != -1)
                        {
                            BkUserClientSettings.removeUserLoggedIn(listUserLoggedIn, userIndex);
                            BkUserClientSettings.updateUserToList(userInfo.username, userInfo.password, listUserLoggedIn);
                            Util.setClientSetting(key.ListLoggedInUsers, JSON.stringify(listUserLoggedIn));
                        }
                    }

                    this.renameNotifyWeb(BkGlobal.UserInfo.getUserName());
                    this.showPopUpNotify(BkConstString.STR_UPDATE_NAME_SUCCESS + ":" + BkGlobal.UserInfo.getUserName(), true);
                    break;
                case PROHIBITED_NAME:
                    this.showPopUpNotify(BkConstString.STR_PROHIBITED_NAME);
                    break;
                case UPDATED_BEFORE:
                    this.showPopUpNotify(BkConstString.STR_UPDATED_BEFORE);
                    break;
            }
        }
        /*
        switch (o) {
            case fb.SUCCESS:
                if (tag == fb.SUBEVENT_LINK_PLAYER) {
                    this.showPopUpNotify("Bạn đã liên kết tài khoản thành công!", true);
                    BkGlobal.isFbLinkable = false;
                    logMessage("after link fb success -> update user info");
                    if (this.txtUser != undefined) {
                        postUserTracker(2, BkGlobal.UserInfo.getUserName(), bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, "FB_LINK_PLAYER: " + this.txtUser.getString());
                        BkGlobal.UserInfo.setUserName(this.txtUser.getString());
                    }
                    BkLogicManager.getLogic().setOnLoadComplete(this.getParentWindow());
                    BkLogicManager.getLogic().DoGetProfilePlayer(this.txtUser.getString());
                } else if (tag == fb.SUBEVENT_RENAME) {
                    BkGlobal.isFbRenameable = false;
                    //Update user name setting
                    var userInfo = Util.getClientSetting(key.userLoginInfo, true);
                    if (userInfo.username != undefined) {
                        userInfo.username = this.txtUser.getString();
                        Util.setClientSetting(key.userLoginInfo, JSON.stringify(userInfo));
                    }
                    this.showPopUpNotify("Bạn đã đổi tên đăng nhập thành công!", true);
                    //postUserTracker(2, BkGlobal.UserInfo.getUserName(), bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, "FB_RENAME: " + this.txtUser.getString());
                    this.renameNotifyWeb(this.txtUser.getString());
                }

                if (this.txtUser != undefined) {
                    BkGlobal.UserInfo.setUserName(this.txtUser.getString());
                    getCurrentScene().updateAvatar(BkGlobal.UserInfo);
                }
                break;
            case fb.ERR_AUTH_FACEBOOK:
                this.showPopUpNotify(BkConstString.ERR_AUTH_FACEBOOK);
                break;
            case fb.ERR_LINK_FACEBOOK_LINKED:
                this.showPopUpNotify(BkConstString.ERR_LINK_FACEBOOK_LINKED);
                break;
            case fb.ERR_LINK_PLAYER_LINKED:
                this.showPopUpNotify(BkConstString.ERR_LINK_PLAYER_LINKED);
                break;
            case fb.ERR_LINK_PLAYER_FACEBOOK:
                var errMsg = BkConstString.insertIntoStringWithListString(BkConstString.ERR_LINK_PLAYER_FACEBOOK, [this.txtUser.getString()]);
                this.showPopUpNotify(errMsg);
                break;
            case fb.ERR_LINK_INCORRECT_USERPASS:
                this.showPopUpNotify(BkConstString.ERR_LINK_INCORRECT_USERPASS);
                break;
            case fb.ERR_RENAME_NULL_OR_EMPTY:
                this.showPopUpNotify(BkConstString.ERR_RENAME_NULL_OR_EMPTY);
                break;
            case fb.ERR_RENAME_UNAVAILABLE:
                this.showPopUpNotify(BkConstString.ERR_RENAME_UNAVAILABLE);
                break;
            case fb.ERR_RENAME_EXISTING:
                this.showPopUpNotify(BkConstString.ERR_RENAME_EXISTING);
                break;
        }*/
        Util.removeAnim();
    },

    drawLinkUser: function () {
        var lblNotify = new BkLabel("Hãy nhập tài khoản bạn muốn liên kết", "", 15);
        lblNotify.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblNotify.x = this.getBodySize().width / 2;
        lblNotify.y = this.getBodySize().height - lblNotify.height / 2 - FB_SETUP_PADDING;
        this.fbLinkUserSprite.addChild(lblNotify);

        var lblUser = new BkLabel("Tên đăng nhập: ", "Tahoma", 14);
        lblUser.x = lblUser.width / 2 + FB_SETUP_PADDING;
        lblUser.y = lblNotify.y - lblNotify.getContentSize().height / 2 - lblUser.getContentSize().height / 2 - 20;
        this.fbLinkUserSprite.addChild(lblUser);

        this.txtUser = createEditBox(WD_PASS_INPUT_SIZE, res_name.edit_text);
        this.txtUser.setMaxLength(20);
        this.txtUser.setPaddingLeft("2px");
        this.txtUser.x = FB_SETUP_PADDING_INPUT;
        this.txtUser.y = lblUser.y;
        this.txtUser.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.txtUser.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.txtUser.setAutoFocus(true);
        if (this.userName != null && this.userName != undefined) {
            this.txtUser.setString(this.userName);
        }

        this.fbLinkUserSprite.addChild(this.txtUser);

        var lblPass = new BkLabel("Mật khẩu: ", "Tahoma", 14);
        lblPass.x = lblPass.width / 2 + FB_SETUP_PADDING;
        lblPass.y = this.txtUser.y - this.txtUser.height / 2 - lblPass.getContentSize().height / 2 - 15;
        this.fbLinkUserSprite.addChild(lblPass);

        this.txtPassword = createEditBox(WD_PASS_INPUT_SIZE, res_name.edit_text);
        this.txtPassword.setMaxLength(20);
        this.txtPassword.setPaddingLeft("2px");
        this.txtPassword.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        this.txtPassword.x = FB_SETUP_PADDING_INPUT;
        this.txtPassword.y = lblPass.y;
        this.txtPassword.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.txtPassword.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.fbLinkUserSprite.addChild(this.txtPassword);

        var btnUpdate = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnUpdate.setTitleText("Cập nhật");
        btnUpdate.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnUpdate.x = WD_BODY_MARGIN_LR * 8 + btnUpdate.width / 2;
        btnUpdate.y = this.txtPassword.y - this.txtPassword.height / 2 - btnUpdate.height / 2 - 15;
        this.fbLinkUserSprite.addChild(btnUpdate);
        var self = this;
        btnUpdate.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    if (this.validateLinkUserLogin(this.txtUser.getString(), this.txtPassword.getString())) {
                        this.requestLinkWFbUser(this.txtUser.getString(), this.txtPassword.getString(),
                            this.facebookId, this.accessToken);
                    }
                }
            },
            this);

        var btnCancel = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
        btnCancel.setTitleText("Thôi");
        btnCancel.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnCancel.x = btnUpdate.x + btnUpdate.width + btnCancel.width / 2;
        btnCancel.y = btnUpdate.y;
        this.fbLinkUserSprite.addChild(btnCancel);

        btnCancel.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    if (this.facebookId != null && this.accessToken != null) {
                        BkFacebookMgr.doRegisterFbUser(this.facebookId,this.accessToken,cc.bkClientId);
                    }
                    self.removeSelf();
                }
            },
            this);

        var note = "Chú ý: Tài khoản hiện thời sẽ bị xóa sau khi liên kết.";
        //Chú ý: bạn có thể vào phần cài đặt để có thể thiết lập liên kết sau."
        var lblNote = new BkLabel(note, "", 15);
        lblNote.setTextColor(cc.color("#edff88"));
        lblNote.x = lblNote.getContentSize().width / 2 + FB_SETUP_PADDING;
        lblNote.y = btnUpdate.y - btnUpdate.height / 2 - lblNote.getContentSize().height / 2 - 10;
        this.fbLinkUserSprite.addChild(lblNote);
    },

    drawRenameUser: function () {
        var lblNotify = new BkLabel("Tên đăng nhập hiện thời của bạn là: " + BkGlobal.UserInfo.getUserName(), "", 15);
        lblNotify.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblNotify.x = this.getBodySize().width / 2;
        lblNotify.y = this.getBodySize().height - lblNotify.getContentSize().height / 2 - FB_SETUP_PADDING;
        this.fbLinkUserSprite.addChild(lblNotify);

        // var lblUser = new BkLabel("Tên đăng nhập: ", "Tahoma", 14);
        // lblUser.x = lblUser.width / 2 + FB_SETUP_PADDING;
        // lblUser.y = lblNotify.y - lblNotify.getContentSize().height / 2 - lblUser.getContentSize().height / 2 - FB_SETUP_PADDING;
        // this.fbLinkUserSprite.addChild(lblUser);

        this.txtUser = createEditBox(WD_PASS_INPUT_SIZE, res_name.edit_text);
        this.txtUser.setMaxLength(20);
        this.txtUser.setPaddingLeft("2px");
        this.txtUser.x = 275;
        this.txtUser.y = lblNotify.y - lblNotify.getContentSize().height / 2 - this.txtUser.getContentSize().height / 2 - FB_SETUP_PADDING - 10;
        this.txtUser.setPlaceHolder("Nhập tên đăng nhập mới");
        this.txtUser.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.txtUser.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.txtUser.setAutoFocus(true);
        this.fbLinkUserSprite.addChild(this.txtUser);

        var btnUpdate = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnUpdate.setTitleText("Cập nhật");
        btnUpdate.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnUpdate.x = WD_BODY_MARGIN_LR * 7 + btnUpdate.width / 2;
        btnUpdate.y = this.txtUser.y - this.txtUser.height / 2 - btnUpdate.height / 2 - 15;
        this.fbLinkUserSprite.addChild(btnUpdate);

        var self = this;

        btnUpdate.addTouchEventListener(
            function (sender, type) {
                var toastX = this.getWindowSize().width / 2 + 220;
                var toastY = this.getWindowSize().height + 65;
                var toastWidth = 370;
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var username = this.txtUser.getString();
                    if (username == "") {
                        showToastMessage(BkConstString.STR_MUST_INPUT_NAME,toastX,toastY, 2, toastWidth);
                        return false;
                    }
                    var errMsg = isValidUsername(username);
                    if (errMsg != "") {
                        showToastMessage(errMsg,toastX,toastY, 2, toastWidth);
                        return false;
                    }
                    this.requestRenameUser(username);
                }
            },
            this);

        var btnCancel = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
        btnCancel.setTitleText("Thôi");
        btnCancel.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnCancel.x = btnUpdate.x + btnUpdate.width + btnCancel.width / 2;
        btnCancel.y = btnUpdate.y;
        this.fbLinkUserSprite.addChild(btnCancel);

        btnCancel.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.removeSelf();
                }
            },
            this);

        var note = "Chú ý: Bạn chỉ được đổi tên duy nhất một lần.";
        var lblNote = new BkLabel(note, "", 15);
        lblNote.setTextColor(cc.color("#edff88"));
        lblNote.x = this.getBodySize().width / 2;
        lblNote.y = btnUpdate.y - btnUpdate.height / 2 - lblNote.getContentSize().height / 2 - WD_BODY_MARGIN_TB;
        this.fbLinkUserSprite.addChild(lblNote);
    },

    showPopUpNotify: function (textMess, isClose) {
        this.txtUser.visible = false;
        if (this.txtPassword)
            this.txtPassword.visible = false;
        var self = this;
        var onOKClick = function () {
            if (isClose) {
                self.removeSelf();
                return;
            }
            self.txtUser.visible = true;
            if (self.txtPassword)
                self.txtPassword.visible = true;
        };
        showPopupMessageWith(textMess, "", onOKClick, onOKClick, this);
    },

    requestLinkWFbUser: function (user, pass, fbId, accessToken) {
        Util.showAnim();
        logMessage("User: " + user + " pass: " + pass + " fbId: " + fbId + " accessToken: " + accessToken);
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        if (fbId != null && accessToken != null) {
            packet.CreatePacketLoginFbLinkLogin(user, pass, fbId, accessToken);
        } else {
            packet.CreatePacketLoginFbLinkSetup(user, pass);
        }
        BkConnectionManager.send(packet);
    },

    requestRenameUser: function (newUser) {
        Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreatePacketLoginFbChangeName(newUser);
        BkConnectionManager.send(packet);
    },

    renameNotifyWeb:function (newUser) {
        if(typeof UpdateNewName == "function"){
            UpdateNewName(newUser);
        }else{
            console.log("call UpdateNewName error");
        }
    },

    validateLinkUserLogin: function (username, password, cbFunc) {
        var wPos = this.getWindowPos();
        var toastX = wPos.x + this.getWindowSize().width / 2;
        var toastY = wPos.y + this.getWindowSize().height - 65;
        var toastWidth = 370;
        if (username == "" || password == "") {
            showToastMessage("Bạn phải nhập tên tài khoản và mật khẩu đăng nhập",toastX,toastY, 2, toastWidth);
            return false;
        } else if (username.length < 3 || username.length > 20) {
            showToastMessage(BkConstString.STR_INVALID_NAME + BkConstString.STR_VALID_LENGTH_NAME,this.x,this.y, 2, 200);
            return false;
        }

        var errMsg = isValidUsername(username);
        if (errMsg != "") {
            showToastMessage(errMsg, toastX,toastY, 2, toastWidth);
            return false;
        }

        else if (isEasyPassword(password)) {
            showPopupConfirmWith("Vì mật khẩu của bạn quá đơn giản nên không thể liên kết tài khoản, hãy vào di động và đổi mật khẩu sau đó quay lại đây để đăng nhập. Bạn có muốn xem hướng dẫn không?",null,
                function () {
                    if(cbFunc){
                        cbFunc();
                    }
                    cc.sys.openURL(cc.game.config.app.pwdHelp);
                }, cbFunc,cbFunc, this);
            sendGA(BKGA.CHECK_LOGIN_REGIST, "ErrorSimplePass-Link", username);
            return false;
        }
        errMsg = isValidPassword(password);
        if (errMsg != "") {
            //showPopupMessageWith(errMsg, null,cbFunc,cbFunc,this);
            showToastMessage(errMsg,toastX,toastY, 2, toastWidth);
            return false;
        }
        return true;
    },
});