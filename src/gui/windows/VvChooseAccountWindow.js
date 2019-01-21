/**
 * Created by VanChinh on 3/25/2016.
 */

VvChooseAccountWindow = VvWindow.extend({
    listUserLoggedIn:[],
    _accountListGrid:null,
    isRememberPassWord:true,

ctor: function ()
    {
        this._super("Chọn tài khoản đăng nhập", cc.size(480, 520));
        this.setVisibleOutBackgroundWindow(false);
        this._btnClose.visible = false;

        this.initUI();
    },
    initUI: function () {

        this.initAccountSelection();
    },

    cleanGUI: function () {
    },
    initAccountSelection:function()
    {
        var listUserLoggedIn = BkUserClientSettings.getListUserLoggedIn();
        Util.removeArrList(this.listUserLoggedIn);
        this.listUserLoggedIn = [];
        if(this._accountListGrid != undefined && this._accountListGrid  != null)
        {
            this._accountListGrid.removeSelf();
            this._accountListGrid =null;
        }
        this.drawAccountList(listUserLoggedIn);
    },
    drawAccountList: function (listUserLoggedIn) {

        var maxRowNum = 8;
        var ITEM_HEIGHT = 39;
        this._accountListGrid = new BkSprite();
        var self = this;
        if (listUserLoggedIn != null && listUserLoggedIn.length > 0)
        {
            var maxContainerHeight = listUserLoggedIn.length/3 * ITEM_HEIGHT + ITEM_HEIGHT/2;
            var maxScrollHeight = maxRowNum*ITEM_HEIGHT;
            var beginContainerY = maxScrollHeight - maxContainerHeight;
            if (listUserLoggedIn.length/3 > maxRowNum)
            {
                this._accountListGrid.setContentSize(600, maxContainerHeight);
                this._accountSc = new BkScrollView(cc.size(600, maxScrollHeight), this._accountListGrid,this,false);
                this.addChildBody(this._accountSc);
                this._accountSc.y = 0;
                this._accountSc.x = 0;
                this._accountSc.setBeginY(beginContainerY + ITEM_HEIGHT/2);
            } else
            {
                this.addChildBody(this._accountListGrid);
                this._accountListGrid.y = beginContainerY + ITEM_HEIGHT/2 + 125;
                this._accountListGrid.x = 0;
            }
            var count = 0;
            var startY = maxContainerHeight;
            for (var i = 0; i < listUserLoggedIn.length; i = i+ 3) {
                count++;
                var accountNamei = listUserLoggedIn[i];
                var passWordi = listUserLoggedIn[i+1];
                var lastloggedTime = listUserLoggedIn[i + 2];
                var isEndOfRow = i == (listUserLoggedIn.length - 3);
                var accountSpritei = new BkAccountLoginSprite(accountNamei,passWordi,lastloggedTime, maxContainerHeight,isEndOfRow,this);
                accountSpritei.setHandleClickCallBack(this);
                accountSpritei.x = 90;
                accountSpritei.y = startY - count*ITEM_HEIGHT;
                maxContainerHeight = accountSpritei.y;
                this._accountListGrid.addChild(accountSpritei);
            }
        } else {
            var lbDisplayMesg = new BkLabel("Chưa có tài khoản nào", "Arial", 16);
            lbDisplayMesg.setPosition(0, 0);
            this._accountListGrid.addChild(lbDisplayMesg);
            this._accountListGrid.x = this.getBodySize().width / 2 + 20;
            this._accountListGrid.y = this.getBodySize().height / 2;
            this.addChildBody(this._accountListGrid);
        }

        var btnLogin = createBkButtonPlist(res_name.btnLoginNormal, res_name.btnLoginHover, res_name.btnLoginNormal,
            res_name.btnLoginHover, "Đăng nhập");
        btnLogin.setTitleFontSize(17);
        btnLogin.setContentSize(140, 40);
        btnLogin.setTitleColor(cc.color.WHITE);
        btnLogin.x = btnLogin.getContentSize().width/2 + 15;
        btnLogin.y = 80;
        this.addChildBody(btnLogin);
        btnLogin.addClickEventListener(function () {
            self.showLoginRegWd(1);
        });

        var btnShowReg = createBkButtonPlist(res_name.btnLoginNormal, res_name.btnLoginHover, res_name.btnLoginNormal,
            res_name.btnLoginHover, "Đăng ký");
        btnShowReg.setTitleFontSize(17);
        btnShowReg.setContentSize(140, 40);
        btnShowReg.setTitleColor(cc.color.WHITE);
        btnShowReg.x = btnLogin.x + btnShowReg.getContentSize().width + 15;
        btnShowReg.y = btnLogin.y;
        this.addChildBody(btnShowReg);
        btnShowReg.addClickEventListener(function () {
            self.showLoginRegWd(2);
        });
    },
    onLoadComplete: function (o, packetType) {
        switch (packetType) {
            case c.NETWORK_LOG_IN_FAILURE:
                this.showError(BkConstString.STR_LOGIN_FAILURE);
                var self = this;
                showPopupMessageConfirmEx(BkConstString.STR_LOGIN_FAILURE, function () {
                    self.showLoginRegWd(1);
                }, true);
                break;
        }
        BkGlobal.isNewRegistraion = false; //reset flag
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
    },

    showError: function (msg) {
        showPopupMessageConfirmEx(msg);
    },
    onSelectAccount:function(account)
    {
        this.processAutoLogin(account);
    },
    processAutoLogin:function(account)
    {
        var self = this;
        var username = account.userName;
        var password = account.passWord;
        cc.username = username;
        cc.password = password;
        cc.rememberPassword = this.isRememberPassWord;
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
    },
    onDeleteAccount:function(account)
    {
        var userName = account.userName;
        var listUserArr = BkUserClientSettings.getListUserLoggedIn();
        var userIndex = BkUserClientSettings.getUserIndex(userName,listUserArr);
        if(userIndex > -1) // user existed
        {
            listUserArr.splice(userIndex,3);
        }
        if(listUserArr.length== 0){
            Util.removeClientSetting(key.userLoginInfo);
            Util.removeClientSetting(key.userLoginInfo);
        }
        Util.setClientSetting(key.ListLoggedInUsers, JSON.stringify(listUserArr));
        if(cc.username === userName)
        {
            cc.username = "";
            cc.password = "";
        }
        this.initAccountSelection();
    },

    showLoginRegWd:function (tab) {
        var sc = getCurrentScene();
        if(sc != undefined){
            sc.visibleChooseAccWd(false);
            sc.showLoginWd(tab);
        }
    }
});