/**
 * Created by Vu Viet Dung on 10/30/2015.
 */

BkInvitePopup = BkDialogWindow.extend({
    ctor: function (title, type) {
        this.MARGIN_TOP = 20;
        var invitePopupSize = cc.size(500,210);
        this._super(title, type, invitePopupSize);
        this.setVisibleOutBackgroundWindow(true);
        var checkBoxClickArea = new BkSprite(res.Tranperent_IMG);
        this.addChildBody(checkBoxClickArea);
        var lblNotReceive = new BkLabelTTF("Không nhận lời mời", "", 16);
        //lblNotReceive.setScale(0.5);
        //lblNotReceive.setFontFillColor(BkColor.HEADER_CONTENT_COLOR);
        lblNotReceive.setFontFillColor(cc.color(225,227,26));
        lblNotReceive.x = lblNotReceive.width/4 + 20;
        lblNotReceive.y = lblNotReceive.height/4 + 15 - 10;
        checkBoxClickArea.addChild(lblNotReceive);

        this.btnOK.setTitleText("Vào bàn");
        this.btnCancel.setTitleText("Từ chối");

        this.notReceive = new BkCheckBox();
        this.notReceive.x = lblNotReceive.x - lblNotReceive.width / 4 - this.notReceive.width / 2 - 35;
        this.notReceive.y = lblNotReceive.y + 2;
        checkBoxClickArea.addChild(this.notReceive);
        var self = this;
        this.notReceive.addEventListener(function(){
            logMessage("addEventListener");
            BkLogicManager.getLogic().isDisableReceiveInvite = self.notReceive.isSelected();
            logMessage("isDisableReceiveInvite: "+BkLogicManager.getLogic().isDisableReceiveInvite);
        },this);

        checkBoxClickArea.setContentSize(cc.size(this.notReceive.width + lblNotReceive.width/2,this.notReceive.height));
        checkBoxClickArea.x = this.getBodySize().width/2;
        checkBoxClickArea.y = this.getBodySize().height/2 - 10;
        checkBoxClickArea.setMouseOnHover();
        checkBoxClickArea.setOnlickListenner(function () {
            logMessage("checkBoxClickArea");
            self.notReceive.setSelected(!self.notReceive.isSelected());
            BkLogicManager.getLogic().isDisableReceiveInvite = self.notReceive.isSelected();
        });
    },

    isNotReceiveSelected: function () {
        if (this.notReceive == null) {
            return false;
        }
        return (this.notReceive.isSelected());
    }
});