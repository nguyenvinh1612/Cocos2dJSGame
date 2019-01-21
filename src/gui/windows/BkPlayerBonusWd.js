/**
 * Created by hoangthao on 20/06/2016.
 */
PLAYER_BONUS_ERROR = "Có lỗi xảy ra khi nhận tiền thưởng, bạn vui lòng liên hệ cskh để được trợ giúp.";

var BkPlayerBonusWd = BkWindow.extend({
    sph: cc.spriteFrameCache,
    listBox: null,
    selectedBox: -1,
    textMsg: null,
    ctor: function (parentNode) {
        this._super("", cc.size(841, 379), parentNode);
        this.sph.addSpriteFrames(res.tien_thuong_plist, res.tien_thuong_img);
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(false);
        this.setVisibleTop(false);
        this.setVisibleBottom(false);
        this.setVisibleBgBody(false);
        this._btnClose.x = this._btnClose.x + 22;
        this.DrawLuckyBoxWindow();
    },
    DrawLuckyBoxWindow: function () {

        var bg = new BkSprite(this.sph.getSpriteFrame(res_name.popup_quaTang));
        bg.x = this.getBodySize().width / 2;
        bg.y = this.getBodySize().height / 2 - 10;
        this.addChildBody(bg);

        var self = this;
        var itemStr = [
            new BkLabelItem("Hãy bấm vào nút nhận bên dưới", 22, BkColor.DEFAULT_TEXT_COLOR, 1, true),
            new BkLabelItem("        để nhận thưởng", 22, BkColor.DEFAULT_TEXT_COLOR, 2, true),
        ];
        this.textMsg = new BkLabelSprite(itemStr);
        this.textMsg.x = this.textMsg.getContentSize().width/2 - 55;
        this.textMsg.y = 160;
        //this.addChildBody(this.textMsg);

        var btnBonus = createBkButtonPlist(res_name.btnPopupQuaTang,res_name.btnPopupQuaTang,res_name.btnPopupQuaTang,res_name.btnPopupQuaTang_hover, "");
        this.addChildBody(btnBonus);
        btnBonus.x = 170 + btnBonus.width/2;
        btnBonus.y = this.textMsg.y - 80;
        btnBonus.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.getBonusMoney();
            }
        }, this);
    },

    getBonusMoney: function () {
        var userName = BkGlobal.UserInfo.getUserName();
        var self = this;
        try {
            if (cc.game.config.debugMode != cc.game.DEBUG_MODE_NONE) {
                return;
            }
            $.ajax({
                type: "POST",
                url: createPostApiUrl("user/bonus"),
                dataType: 'json',
                async: true,
                data: JSON.stringify({
                    "fbId": BkFacebookMgr.facebookID,
                    "fbAppId": BkFacebookMgr.facebookAppId,
                    "username": BkGlobal.UserInfo.getUserName(),
                    "pwd": btoa(cc.password),
                    "curMoney": BkGlobal.UserInfo.getMoney(),
                    "clientId": bk.clientId,
                    "providerId": bk.cpid,
                    "isPhoneUpd": BkGlobal.isPhoneNumberUpdatable,
                })
            }).done(function (data) {
                if(cc.isUndefined(data)){
                    var jsonData = JSON.parse(data);
                    if(cc.isUndefined(data) && jsonData.retVal != 0) {
                        showPopupMessageWith(PLAYER_BONUS_ERROR, "");
                    }
                }
                else if( data.retVal == 1){
                    showPopupMessageWith("Tài khoản của bạn không nằm trong danh sách thưởng, nếu có thắc mắc xin hãy liên hệ cskh.", "");
                }
                self.removeSelf();
            });
        } catch (err) {
            logMessage(err);
            showPopupMessageWith(PLAYER_BONUS_ERROR, "");
            self.removeSelf();
        }
    },
});