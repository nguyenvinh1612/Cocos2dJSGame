/**
 * Created by Vu Viet Dung on 10/30/2015.
 */

BkLogoutConfirmPopup = BkDialogWindow.extend({
    ctor: function (title, type) {
        this.MARGIN_TOP = 20;
        this._super(title, type, DEFAULT_SIZE_DW);
        this.setVisibleOutBackgroundWindow(true);
        var checkBoxClickArea = new BkSprite(res.Tranperent_IMG);
        BkLogicManager.getLogic().isDeleteLoginState = false;
        if(!BkGlobal.isLoginFacebook) {
            this.addChildBody(checkBoxClickArea);
        }
        var lblNotReceive = new BkLabelTTF("Xóa thông tin đăng nhập", "", 16);
        //lblNotReceive.setFontFillColor(BkColor.HEADER_CONTENT_COLOR);
        lblNotReceive.setFontFillColor(cc.color(225,227,26));
        lblNotReceive.x = lblNotReceive.width/4 + 20;
        lblNotReceive.y = lblNotReceive.height/4;
        checkBoxClickArea.addChild(lblNotReceive);

        this.notReceive = new BkCheckBox();
        this.notReceive.x = lblNotReceive.x - lblNotReceive.width / 4 - this.notReceive.width / 2 - 45;
        this.notReceive.y = lblNotReceive.y;
        checkBoxClickArea.addChild(this.notReceive);
        var self = this;
        this.notReceive.addEventListener(function(){
            logMessage("check isDeleteLoginState");
            BkLogicManager.getLogic().isDeleteLoginState = self.notReceive.isSelected();
        },this);

        checkBoxClickArea.setContentSize(cc.size(this.notReceive.width + lblNotReceive.width/2,this.notReceive.height));
        checkBoxClickArea.x = this.getBodySize().width/2;
        checkBoxClickArea.y = this.getBodySize().height/2 - 10;
        checkBoxClickArea.setMouseOnHover();
        checkBoxClickArea.setOnlickListenner(function () {
            logMessage("checkBoxClickArea");
            self.notReceive.setSelected(!self.notReceive.isSelected());
            BkLogicManager.getLogic().isDeleteLoginState = self.notReceive.isSelected();
        });

        this.setTextMessage("Cảm ơn bạn đã tham gia Bigkool.\n Bạn có muốn thoát không?");
    },

    isDeleteLoginState: function () {
        if (this.notReceive == null) {
            return false;
        }
        return (this.notReceive.isSelected());
    }
});