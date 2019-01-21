/**
 * Created by VanChinh on 10/20/2015.
 */

BkMailDetailsWindow = VvWindow.extend({
    mailId: null,
    mailType: null,
    mail: null,
    content: null,
    tabWdNode: null,
    parentMailItemNode: null,

    ctor: function (mailid, type, tabWD, parent) {
        this._super("Nội dung thư", cc.size(444, 460));
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.setDefaultWdBodyBg();
        if(mailid){
            this.mailId = mailid;
            this.mailType = type;
            this.tabWdNode = tabWD;
            this.parentMailItemNode = parent;
            this.loadData();
        }
    },

    setDefaultWdBodyBg: function () {
        this._wdBodyInnerSize = cc.size(this.getBodySize().width - WD_BODY_MARGIN_LR*2, this.getBodySize().height - WD_BODY_MARGIN_TB);
        var windowBodyBg = new cc.DrawNode();
        var color = cc.color(18, 37, 98);
        windowBodyBg.drawRect(cc.p(0, 45), cc.p(this._wdBodyInnerSize.width, this._wdBodyInnerSize.height), color, 1, color);
        windowBodyBg.x = WD_BODY_MARGIN_LR;
        windowBodyBg.visible = false;
        this.addChildBody(windowBodyBg, -1);
    },

    loadData: function () {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        bkCommonLogic.processGetMailData(this.mailId);
    },

    initUIAfterLoadDataComplete: function () {
        var bodyContentWidth = this.getBodySize().width;
        var strStatus = '';
        var strMailType = "Trả lời";
        if(this.mailType === 2){
            strStatus = "Đến: ";
            strMailType = "Chuyển tiếp";
        }
        else strStatus = "Từ: ";

        var lblStatus = new BkLabel(strStatus, "", 16);
        lblStatus.setTextColor(BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR);
        lblStatus.x = lblStatus.getContentSize().width / 2 + WD_BODY_MARGIN_LR + 20;
        lblStatus.y = this.getBodySize().height - lblStatus.getContentSize().height / 2 - WD_BODY_MARGIN_TB;
        this.addChildBody(lblStatus);

        var lblSubject = new BkLabel("Tiêu đề: ", "", 15);
        lblSubject.setTextColor(BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR);
        lblSubject.x = lblSubject.getContentSize().width/2 + WD_BODY_MARGIN_LR + 20;
        lblSubject.y = lblStatus.y - lblSubject.getContentSize().height / 2 - 20;
        this.addChildBody(lblSubject);

        var lblEmail = new BkLabel("", "", 16);
        if(this.mailType === 2) lblEmail.setString(this.mail.getReceiver());
        else lblEmail.setString(this.mail.getSender());
        lblEmail.x = lblSubject.x + lblSubject.getContentSize().width / 2 + lblEmail.getContentSize().width / 2 + 5;
        lblEmail.y = lblStatus.y;
        this.addChildBody(lblEmail);

        //var subject = createFixedWidthLabel(this.mail.getTitle(), 260, 15);
        var subject = new BkLabelTTF("", "", 16, cc.size (590, 75), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        subject.setString(this.mail.getTitle());
        subject.x = lblSubject.x + lblSubject.getContentSize().width / 2 + subject.getContentSize().width / 2 + 5;
        subject.y = lblSubject.y - 9.5;
        this.addChildBody(subject);

        var lblContent = createTextArea(cc.size(360, 230), res_name.edit_text);
        lblContent._backgroundSprite.scaleX = 1.03;
        lblContent.setString(this.mail.getContent());
        lblContent.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        lblContent.setFontSize(16);
        lblContent.setFontColor(BkColor.TEXT_INPUT_COLOR);
        lblContent.setEnableScroll();
        lblContent.setDisabled(true);
        lblContent.x = lblContent.getContentSize().width / 2 + WD_BODY_MARGIN_LR * 2 - 2;
        lblContent.y = lblSubject.y - lblSubject.getContentSize().height / 2 - lblContent.getContentSize().height / 2 - 30;
        this.addChildBody(lblContent);

        var btnDeleteMail = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
        btnDeleteMail.setTitleText("Xóa");
        btnDeleteMail.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnDeleteMail.width = 100;
        btnDeleteMail.x = bodyContentWidth / 2 - 70;
        btnDeleteMail.y = btnDeleteMail.getContentSize().height / 2 + 25;
        this.addChildBody(btnDeleteMail);

        var self = this;
        btnDeleteMail.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    // Send delete mail packet
                    var bkCommonLogic = BkLogicManager.getLogic();
                    bkCommonLogic.processDeleteMail(self.mailId);

                    // and refresh mail list grid data
                    var mailTabWindow = self.tabWdNode;
                    mailTabWindow.configBaseTabUI(mailTabWindow._currentTab);

                    // close mail details window
                    self.removeSelf();
                }
            }
        , this);

        var btnForward = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnForward.setTitleText(strMailType);
        btnForward.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnForward.x = bodyContentWidth / 2 + 70;
        btnForward.y = btnForward.getContentSize().height / 2 + 25;
        this.addChildBody(btnForward);
        btnForward.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    // close mail details window and open mail editor tab with init data
                    var mailTabWindow = self.tabWdNode;
                    mailTabWindow.configButtonWithSelectedTab(3);
                    if (this.mailType == 2){
                        mailTabWindow._playerName = undefined;
                        mailTabWindow.drawUIWithTab(3, self.mail.getTitle(), self.mail.getContent());
                    } else {
                        mailTabWindow._playerName = this.mail.getSender();
                        mailTabWindow.drawUIWithTab(3, "Re:" + self.mail.getTitle(), "");
                    }
                    // close mail details window
                    self.removeSelf();
                }
            }
            , this);
    },

    onLoadComplete: function (obj, tag) {
        if(tag == c.NETWORK_MAIL_RETURN){
            this.mail = obj;
            if(this.parentMailItemNode.typeItem != 2) this.parentMailItemNode.mailIcon.setTexture("#"+res.MailReadIcon);
            this.initUIAfterLoadDataComplete();
        }
    },
});