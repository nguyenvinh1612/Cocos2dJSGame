/**
 * Created by VanChinh on 10/16/2015.
 */

BkMailItem = BkSprite.extend({
    tabWdNode: null,
    mailInfo: null,
    typeItem: null,                 // tab Inbox mail: 1, tab Outbox mail: 2
    _eventHover: null,
    mailIcon: null,
    background: null,
    bgHover: null,

    ctor: function (mail, pos, type, parent, isLastItem) {
        this._super();
        this.mailInfo = mail;
        this.typeItem = type;
        this.tabWdNode = parent;

        this.initItem(pos, isLastItem);
        this.initMouseAction();
    },

    initItem: function (pos, isLastItem) {
        var startXItem = -16;
        var deltaXItem = 65 + 16;
        this.background = new cc.DrawNode();
        this.background.drawRect(cc.p(startXItem, -18), cc.p(this.tabWdNode.getBodySize().width - deltaXItem, 18), BkColor.GRID_ITEM_COLOR_VV, 0, BkColor.GRID_ITEM_COLOR_VV);
        //this.addChild(this.background);

        this.bgHover = new cc.DrawNode();
        this.bgHover.drawRect(cc.p(startXItem, -18), cc.p(this.tabWdNode.getBodySize().width - deltaXItem, 18), BkColor.GRID_ITEM_HOVER_COLOR_VV, 1, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        this.bgHover.visible = false;
        this.addChild(this.bgHover);

        var mailStatus = this.mailInfo.getMailStatus();
        this.mailIcon = this.getMailIcon(mailStatus);
        this.mailIcon.setScale(0.8);
        this.mailIcon.x = mailStatus == 0 ? 0.5 : 0;
        this.mailIcon.y = mailStatus == 0 ? 2.5 : 0;
        this.addChild(this.mailIcon);

        var strStatus = '';

        if (this.typeItem === 2) {
            strStatus = "Tới: ";
        }
        else strStatus = "Từ: ";

        var lblStatus = new BkLabel(strStatus, "", 16);
        lblStatus.setTextColor(BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR);
        lblStatus.x = 20 + lblStatus.getContentSize().width / 2;
        lblStatus.y = this.mailIcon.y + 0.5;
        this.addChild(lblStatus);

        var strEmail = "";
        if (this.typeItem === 2) {
            strEmail = this.mailInfo.getReceiver();
        }
        else strEmail = this.mailInfo.getSender();
        var lblEmail = createFixedWidthLabel(strEmail, 70, 14, "");
        //lblEmail.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR_VV);
        lblEmail.x = lblStatus.x + lblStatus.getContentSize().width / 2 + lblEmail.getContentSize().width / 2;
        lblEmail.y = lblStatus.y;
        this.addChild(lblEmail);

        var lblSubject = createFixedWidthLabel(this.mailInfo.getTitle(), 320, 14, "");
        lblSubject.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR_VV);
        lblSubject.x = lblStatus.x + 120 + lblSubject.getContentSize().width / 2 + 0.5;
        lblSubject.y = lblEmail.y + 0.5;
        this.addChild(lblSubject);

        var lblDate = new BkLabel(this.mailInfo.getDate(), "", 14);
        lblDate.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR_VV);
        lblDate.x = 560;
        lblDate.y = lblSubject.y;
        this.addChild(lblDate);

        if (!isLastItem) {
            var drawLine = new cc.DrawNode();
            drawLine.drawSegment(cc.p(startXItem, -19), cc.p(this.tabWdNode.getBodySize().width - deltaXItem, -19), 0.5, BkColor.GRID_ROW_BORDER_COLOR_VV);
            this.addChild(drawLine);
        }

        this.configPos(pos);
    },
    getMailIcon: function (status) {
        if (this.typeItem == 1) {
            if (status == 0) {
                return getSpriteFromImage("#" + res_name.MailUnreadIcon);
            }
            else if (status == 1) {
                return getSpriteFromImage("#" + res_name.MailReadIcon);
            }
        }
        else if (this.typeItem == 2) return getSpriteFromImage("#" + res_name.MailSentIcon);
        return getSpriteFromImage("#" + res_name.MailUnreadIcon);
    },
    configPos: function (pos) {
        this.x = 0;
        this.y = pos - 37.7;
    },

    initMouseAction: function () {
        var self = this;
        this._eventHover = this.createHoverEvent(function () {
            self.bgHover.setVisible(true);
        }, function () {
            self.bgHover.setVisible(false);
        }, function () {
            if (self.bgHover.isVisible()) {
                self.onClickMailItem(self.mailInfo.getMailId());
            }
        });
        cc.eventManager.addListener(this._eventHover, this);
    },

    onClickMailItem: function (mailId) {
        if (this.mailInfo.getMailStatus() == 0) {
            BkGlobal.UserInfo.setNumberOfUnreadMails(BkGlobal.UserInfo.getNumberOfUnreadMails() - 1);
            this.mailIcon.setSpriteFrame(res_name.MailReadIcon);
        }

        var mailDetailsWindow = new BkMailDetailsWindow(mailId, this.typeItem, this.tabWdNode, this);
        mailDetailsWindow.setParentWindow(this.tabWdNode);
        mailDetailsWindow.showWithParent();
    }
});