/**
 * Created by VanChinh on 10/16/2015.
 */

BkMailsWindow = BkTabWindow.extend({
    _tabBodyLayout: null,
    _tabList: ["Thư đến", "Đã gửi", "Soạn thư", "Thư góp ý"],
    _playerName:"",
    ctor: function (playerName) {
        this._super("Thư tín", cc.size(704, 450.5), this._tabList.length, this._tabList);
        if(playerName == undefined) {
            this.initUI();
        }else{
            //Send mail to
            this._playerName = playerName;
            this.initUI(3);
        }
        var tabWidth = this.getBodySize().width - 2* TAB_WD_BODY_MARGIN_LR;
        //this._bodyContent.drawRect(cc.p(0, -4), cc.p(tabWidth, 20), BkColor.BG_BODY_COLOR, 1, BkColor.BG_BODY_BORDER_COLOR);
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"MailboxScene");
    },

    initUI: function (defaultTab) {
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this, defaultTab);
    },

    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function(tabIndex, title, content) {
        this.setCurrentTab(tabIndex);
        this.cleanGUI();

        this._tabBodyLayout = new BkSprite();
        this._tabBodyLayout.setContentSize(this.getBodySize().width, this.getBodySize().height);
        this.addChildBody(this._tabBodyLayout, WD_ZORDER_TOP);
        this._tabBodyLayout.x = this.getBodySize().width/2;
        this._tabBodyLayout.y = this.getBodySize().height/2;

        switch (tabIndex){
            case 1:
                this.initInboxMailTab();
                break;
            case 2:
                this.initSentMailTab();
                break;
            case 3:
                this.initMailEditorTab(title, content, this._playerName);
                break;
            case 4:
                this.initMailEditorTab("", "", "admin");
                break;
            default :
                break;
        }

    },

    initInboxMailTab: function () {
        this.loadMailInboxList();
    },

    initSentMailTab: function () {
        this.loadMailSentList();
    },

    initMailEditorTab: function (title, content, receiver) {
        var self = this;
        var tabBodyHeight = this._tabBodyLayout.height;
        var tabBodyWidth = this._tabBodyLayout.width;

        var drawLineLeft = new cc.DrawNode();
        drawLineLeft.drawSegment(cc.p(38, tabBodyHeight - 32), cc.p(38, tabBodyHeight - 342), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this._tabBodyLayout.addChild(drawLineLeft);

        //top
        var drawLineTop = new cc.DrawNode();
        drawLineTop.drawSegment(cc.p(38, tabBodyHeight - 32), cc.p(tabBodyWidth - 38, tabBodyHeight - 32), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this._tabBodyLayout.addChild(drawLineTop);

        //right
        var drawLineRight = new cc.DrawNode();
        drawLineRight.drawSegment(cc.p(tabBodyWidth - 38, tabBodyHeight - 32), cc.p(tabBodyWidth - 38, tabBodyHeight - 342), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this._tabBodyLayout.addChild(drawLineRight);

        var lblTo = new BkLabel("Tới:", "Tahoma", 16);
        lblTo.setTextColor(BkColor.MAIL_ITEM_HEADER_COLOR);
        lblTo.x = 54 + lblTo.getContentSize().width / 2;
        lblTo.y = tabBodyHeight - 50;
        this._tabBodyLayout.addChild(lblTo);

        var txtTo = createEditBox(cc.size(tabBodyWidth - 165, 40));
        txtTo.setMaxLength(22);
        txtTo.x = 90 + txtTo.getContentSize().width / 2;
        txtTo.y = lblTo.y;
        txtTo.setPlaceHolder("Nhập tên người nhận");
        txtTo.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        txtTo.setFontColor(cc.color(255,255,255));
        txtTo.setMaxLength(20);
        txtTo.setFontSize(16);
        this._tabBodyLayout.addChild(txtTo, WD_ZORDER_TOP);
        if(receiver == ""){
            txtTo.setAutoFocus(true);
            txtTo.setTabStopToPrevious();
        }
        else txtTo.setString(receiver);

        var drawLineTo = new cc.DrawNode();
        drawLineTo.drawSegment(cc.p(38, txtTo.y - txtTo.height / 2), cc.p(tabBodyWidth - 38, txtTo.y - txtTo.height / 2), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this._tabBodyLayout.addChild(drawLineTo);

        var txtSubject = createEditBox(cc.size(tabBodyWidth - 165, 40));
        txtSubject.setMaxLength(80);
        txtSubject.x = 52 + txtSubject.getContentSize().width / 2;
        txtSubject.y = txtTo.y - 40;
        txtSubject.setPlaceHolder("Nhập tiêu đề");
        txtSubject.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        txtSubject.setFontColor(cc.color(255,255,255));
        txtSubject.setFontSize(16);
        if(title){
            txtSubject.setString(title);
        }
        if(receiver && receiver != "") txtSubject.setAutoFocus(true);
        this._tabBodyLayout.addChild(txtSubject, WD_ZORDER_TOP);

        var drawLineSubject = new cc.DrawNode();
        drawLineSubject.drawSegment(cc.p(38, txtSubject.y - txtSubject.height / 2), cc.p(tabBodyWidth - 38, txtSubject.y - txtSubject.height / 2), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this._tabBodyLayout.addChild(drawLineSubject);

        var txtContent = createTextArea(cc.size(tabBodyWidth - 105, 210));
        txtContent.setFontSize(16);
        txtContent.setEnableScroll();
        txtContent.setMaxLength(600);
        txtContent.x = 52 + txtContent.getContentSize().width / 2;
        txtContent.y = txtSubject.y - (txtSubject.height + txtContent.height) / 2 - 14;
        txtContent.setPlaceHolder("Nhập nội dung");
        if(content){
            txtContent.setString(content);
        }
        this._tabBodyLayout.addChild(txtContent, WD_ZORDER_TOP);
        txtContent.setTabStopToNext();

        var drawLineBottom = new cc.DrawNode();
        drawLineBottom.drawSegment(cc.p(38, txtContent.y - txtContent.height / 2 - 6), cc.p(tabBodyWidth - 38, txtContent.y - txtContent.height / 2 - 6), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this._tabBodyLayout.addChild(drawLineBottom);

        var btnSend = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
        btnSend.setTitleText("Gửi");
        btnSend.x = tabBodyWidth - btnSend.getContentSize().width / 2 - 37;
        btnSend.y = txtContent.y - (txtContent.height + btnSend.height) / 2 - 16;
        this._tabBodyLayout.addChild(btnSend);
        btnSend.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var receivers = txtTo.getString();
                    var mailTitle = txtSubject.getString();
                    var mailContent = txtContent.getString();

                    // validate input data
                    if(receivers.trim().length === 0){
                        showToastMessage("Bạn chưa nhập tên người nhận", txtTo.x + 150, txtTo.y+ 95, 2, 220);
                        txtTo.setFocus();
                        return;
                    }
                    if (mailTitle.trim().length === 0){
                        showToastMessage("Bạn chưa nhập tiêu đề", txtSubject.x + 150, txtSubject.y+ 95, 2);
                        txtSubject.setFocus();
                        return;
                    }
                    if (mailContent.trim().length === 0){
                        showToastMessage("Bạn chưa nhập nội dung", txtContent.x + 150, txtContent.y+ 95, 2);
                        txtContent.setFocus();
                        return;
                    }

                    // Send mail packet
                    var bkCommonLogic = BkLogicManager.getLogic();
                    bkCommonLogic.setOnLoadComplete(self);
                    bkCommonLogic.processSendMailData(mailTitle, mailContent, receivers);
                    Util.showAnim();
                }
            }
            , this);

        if(receiver == "admin"){
            txtTo.setString(receiver);
            txtTo.setDisabled(true);
            txtTo.setFontColor(BkColor.HEADER_CONTENT_COLOR);

            txtSubject.setAutoFocus(true);
            txtSubject.setTabStopToPrevious();
        }
    },

    drawMailsList: function (lstMails, tabIndex) {
        if (lstMails.length > 0) {
            var sortedList = lstMails;
            //sortedList.sort(this.sortOnPriority);
            var rowH = this.getBodySize().height - 0.5;

            for (var i = 0, len = sortedList.length; i < len; i++) {
                var mail = sortedList[i];
                var mailItemRow = new BkMailItem(mail, rowH, tabIndex, this, i == (len - 1));
                rowH = mailItemRow.y;
                this._tabBodyLayout.addChild(mailItemRow);
            }
            this._tabBodyLayout.x = this._tabBodyLayout.x + 43;
        } else {
            var lbDisplayMesg = new BkLabel("Hòm thư trống.", "Arial", 16);
            lbDisplayMesg.setPosition(this.getBodySize().width/2, this.getBodySize().height/2);
            this._tabBodyLayout.addChild(lbDisplayMesg);
            /*this._tabBodyLayout.x = this._tabBodyLayout.width/2;
             this._tabBodyLayout.y = this._tabBodyLayout.height/2*/
        }
    },

    cleanGUI: function () {
        if (this._tabBodyLayout != null) {
            this._tabBodyLayout.removeFromParent();
        }
    },

    sortOnPriority: function (item1, item2) {
        if (item1.getDate() > item2.getDate()) {
            return 1;
        } else {
            return -1;
        }
    },

    loadMailInboxList: function () {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        bkCommonLogic.processGetMailInboxListData();

        Util.showAnim();
    },

    loadMailSentList: function () {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        bkCommonLogic.processGetMailOutboxListData();

        Util.showAnim();
    },

    onLoadComplete: function (obj, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag){
            case c.NETWORK_INBOX_MAILS_RETURN:
                Util.removeAnim();
                this.drawMailsList(obj, 1);
                break;
            case c.NETWORK_OUTBOX_MAILS_RETURN:
                Util.removeAnim();
                this.drawMailsList(obj, 2);
                break;
            case c.NETWORK_SEND_MAIL_SUCCESS:
                Util.removeAnim();
                showToastMessage("Đã gửi thư thành công!",285,123.5,5,220);
                this._playerName = "";
                if(this._currentTab == 3) this.drawUIWithTab(3, "", "");
                else if(this._currentTab == 4) this.drawUIWithTab(4, "", "");

                break;
            case c.NETWORK_PLAYER_NOT_EXIST:
                Util.removeAnim();
                showToastMessage("Người nhận thư không tồn tại!",460,401.5,5,220);
                break;
            default :
                break;
        }
    },
    removeSelf: function () {
        this._super();
        BkLogicManager.getLogic().DoGetMainProfile();
    }
});