/**
 * Created by hoangthao on 29/09/2015.
 */

LUCKY_BOX_WD_BOX_WIDTH = 103;
var BkLuckyBoxWd = BkWindow.extend({
    sph: cc.spriteFrameCache,
    listBox: null,
    selectedBox: -1,
    textMsg: null,
    ctor: function (parentNode) {
        this._super("Chiếc hộp may mắn", cc.size(750, 390), parentNode);
        this.sph.addSpriteFrames(res.tien_thuong_plist, res.tien_thuong_img);
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(true);
        this.DrawLuckyBoxWindow();
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"LuckyBoxScene");
    },
    DrawLuckyBoxWindow: function () {

        var bg = new BkSprite(this.sph.getSpriteFrame(res_name.luckyBoxbg));
        bg.x = this.getBodySize().width / 2;
        bg.y = this.getBodySize().height / 2 - 10;
        this.addChildBody(bg);

        var self = this;
        this.textMsg = new BkLabel("Bạn hãy chọn một chiếc hộp may mắn", "", 24, true);
        this.textMsg.x = this.getBodySize().width/2;
        this.textMsg.y = this.getWindowSize().height / 1.5;
        this.addChildBody(this.textMsg);

        this.listBox = new BkSprite();
        this.listBox.x = 120;
        this.listBox.y = bg.height / 3 + 10;
        this.addChildBody(this.listBox);
        var cX = 0;
        var cY = 0;
        var space = 18;
        for (var i = 0; i < 5; i++) {
            var boxSprite = this.CreateBoxSprite(i);
            boxSprite.x = cX;
            boxSprite.y = cY + 0.5;
            this.listBox.addChild(boxSprite);
            cX = cX + LUCKY_BOX_WD_BOX_WIDTH + space;
        }
        /*//Test
        var o = {luckyResult: 1, bonus: 100};
        this.upLuckyBoxWindow(o);*/
    },

    CreateBoxSprite: function (boxId) {
        var self = this;
        var rtnSprite = new BkSprite(this.sph.getSpriteFrame(res_name.closeBox));
        rtnSprite.setName(boxId);
        rtnSprite.setMouseOnHover(
            function () {
                rtnSprite.setScale(1);
            }, function () {
                rtnSprite.setScale(0.9);
            });

        rtnSprite.setOnlickListenner(function () {
            self.selectedBox = boxId;
            var clientId = BkGlobal.UserInfo.clientID;
            if (clientId != null) {
                self.requestLuckyBox(boxId, clientId);
            } else {
                showToastMessage("Không nhận được client ID", self.getBodySize().width / 2, self.getBodySize().height / 1.5);
            }
        });

        return rtnSprite;
    },
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case c.NETWORK_LUCKY_BOX_REQUEST_RETURN:
                Util.removeAnim();
                this.upLuckyBoxWindow(o);
                break;
        }
    },
    requestLuckyBox: function (selectedBoxId, clientID) {
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreateLuckyboxPacket(selectedBoxId, clientID);
        BkConnectionManager.send(packet);
        Util.showAnim();
    },
    upLuckyBoxWindow: function (requestBoxReturn) {
        var strMess = "";
        var self = this;
        if (requestBoxReturn.luckyResult == 0) {
            strMess = "Bạn không được thưởng, thiết bị hoặc tài khoản này đã nhận thưởng hôm nay rồi.\n Xin vui lòng trở lại vào ngày mai để nhận thưởng.";
            showPopupMessageWith(strMess, "", function () {self.removeSelf();},null,self );
        }
        else {
            this.textMsg.setTextColor(cc.color(246,224,1));
            strMess = "Chúc mừng bạn!  Bạn được thưởng " + requestBoxReturn.bonus + BkConstString.getGameCoinStr();
            this.textMsg.setString(strMess);

            var actionBy = cc.scaleBy(0.5, 1.2);
            this.textMsg.runAction(actionBy);

            var textNotice = new BkLabel("Hãy quay lại vào ngày mai để nhận thêm phần thưởng!", "", 18);
            textNotice.setTextColor(BkColor.HEADER_CONTENT_COLOR);
            textNotice.x = this.getBodySize().width/2;
            textNotice.y = WD_BODY_MARGIN_TB*2;
            this.addChildBody(textNotice);

            var selBox = this.listBox.getChildByName(this.selectedBox);
            if(selBox != undefined) {
                logMessage("upLuckyBoxWindow " + this.selectedBox);
                selBox.initWithSpriteFrame(this.sph.getSpriteFrame(res_name.openBox));
            }else{
                logMessage("upLuckyBoxWindow ERROR selBox = null " + this.selectedBox);
            }
            cc.eventManager.pauseTarget(this.listBox, true);
        }
    },
    onExit: function () {
        this.sph.removeSpriteFramesFromFile(res.tien_thuong_plist);
        this._super();
    }
});