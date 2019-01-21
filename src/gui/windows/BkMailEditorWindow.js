/**
 * Created by VanChinh on 11/6/2015.
 */
MAIL_CONTENT_MARGIN_LR = VV_WD_BODY_MARGIN_LR + 25;
BkMailEditorWindow = VvWindow.extend({
    title: null,
    content: null,
    receiver: null,
    ctor: function (title, content, receiver) {
        this._super("Soạn thư", cc.size(700, 480));
        this.title = title;
        this.content = content;
        this.receiver = receiver;
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.initUI();
    },

    onLoadComplete: function (obj, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        var winSize = cc.director.getWinSize();
        switch (tag){
            case c.NETWORK_SEND_MAIL_SUCCESS:
                Util.removeAnim();
                showToastMessage("Đã gửi thư thành công!", winSize.width / 2, winSize.height / 2);
                this.removeSelf();
                break;
            case c.NETWORK_PLAYER_NOT_EXIST:
                Util.removeAnim();
                showToastMessage("Người nhận thư không tồn tại!", winSize.width / 2, winSize.height / 2, null, 220);
                break;
            default :
                break;
        }
    },

    initUI: function () {
        this.setDefaultWdBodyBg();
        var bodyWidth = this.getBodySize().width - 50;
        var bodyHeight = this.getBodySize().height - 10;

        var txtTo = createEditBox(cc.size(bodyWidth, 40));
        txtTo.x = 40 + txtTo.getContentSize().width / 2;
        txtTo.y = bodyHeight - 29.5;
        txtTo.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtTo.setFontSize(16);
        this.addChildBody(txtTo);
        this.addEditbox(txtTo);

        var drawLine = new cc.DrawNode();
        var line1Y = txtTo.y - txtTo.getContentSize().height / 2;
        drawLine.drawSegment(cc.p(VV_WD_BODY_MARGIN_LR + 3, line1Y), cc.p(bodyWidth+ VV_WD_BODY_MARGIN_LR + 2, line1Y), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this.addChildBody(drawLine);

        var txtSubject = createEditBox(cc.size(bodyWidth - 80, 40));
        txtSubject.x =  40 + txtSubject.getContentSize().width / 2;
        txtSubject.y = txtTo.y - (txtTo.getContentSize().height + txtSubject.getContentSize().height) / 2 - 5;
        txtSubject.setPlaceHolder("Nhập tiêu đề");
        txtSubject.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        txtSubject.setMaxLength(80);
        txtSubject.setFontColor(cc.color(255,255,255));
        txtSubject.setFontSize(16);
        if(this.title){
            txtSubject.setString(title);
        }
        this.addChildBody(txtSubject);
        txtSubject.setAutoFocus(true);
        txtSubject.setTabStopToPrevious();
        this.addEditbox(txtSubject);

        var drawLine1 = new cc.DrawNode();
        var line2Y = txtSubject.y - txtSubject.getContentSize().height / 2;
        drawLine1.drawSegment(cc.p(VV_WD_BODY_MARGIN_LR + 3, line2Y), cc.p(bodyWidth + VV_WD_BODY_MARGIN_LR + 2, line2Y), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this.addChildBody(drawLine1);

        var txtContent = createTextArea(cc.size(bodyWidth, 210));
        txtContent.setMaxLength(700);
        txtContent.x = 40 + txtContent.getContentSize().width / 2;
        txtContent.y = txtSubject.y - (txtSubject.getContentSize().height + txtContent.getContentSize().height) / 2 - 15;
        txtContent.setPlaceHolder("Nhập nội dung");
        txtContent.setFontSize(16);
        if(this.content){
            txtContent.setString(content);
        }
        this.addChildBody(txtContent);
        txtContent.setTabStopToNext();
        this.addEditbox(txtContent);

        var drawLine2 = new cc.DrawNode();
        var line3Y = txtContent.y - txtContent.getContentSize().height / 2 - 10;
        drawLine2.drawSegment(cc.p(VV_WD_BODY_MARGIN_LR + 3, line3Y), cc.p(bodyWidth + VV_WD_BODY_MARGIN_LR + 2, line3Y), 0.5, BkColor.MAIL_EDITOR_BORDER_COLOR);
        this.addChildBody(drawLine2);

        var self = this;

        var btnSend = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnSend.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnSend.setTitleText("Gửi");
        btnSend.x = bodyWidth - btnSend.getContentSize().width / 2;
        btnSend.y = txtContent.y - (txtContent.getContentSize().height + btnSend.getContentSize().height) / 2 - 20;
        this.addChildBody(btnSend);
        btnSend.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var receivers = txtTo.getString();
                    var mailTitle = txtSubject.getString();
                    var mailContent = txtContent.getString();

                    // validate input data
                    if(receivers.trim().length === 0){
                        showToastMessage("Bạn chưa nhập tên người nhận", txtTo.x, txtTo.y + 20, 2);
                        txtTo.setFocus();
                        return;
                    }
                    if (mailTitle.trim().length === 0){
                        showToastMessage("Bạn chưa nhập tiêu đề", txtSubject.x, txtSubject.y + 20, 2);
                        txtSubject.setFocus();
                        return;
                    }
                    if (mailContent.trim().length === 0){
                        showToastMessage("Bạn chưa nhập nội dung", txtContent.x, txtContent.y + 20, 2);
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

        if(this.receiver){
            txtTo.setString(this.receiver);
            txtTo.setPlaceHolder("Nhập tên người nhận");
            txtTo.setFontSize(16);
            txtTo.setDisabled(true);
        }
    }
});
