/**
 * Created by hoangthao on 29/09/2015.
 */
var LuckyBoxWd = BkWindow.extend({
    ctor: function () {
      this._super("Chiếc hộp may mắn",cc.size(700,450));
    this.initUI();
    },
    initUI: function() {

        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(true);

        var bg = new BkSprite();
        var marginBg = 10;
        var bgRect = bg.getTextureRect();
        //bg.scaleX = (this.getBodyItem().width - marginBg)/ bgRect.width;
        //bg.scaleY = (this.getBodyItem().height - marginBg)/ bgRect.height;

        bg.x = 40;
        bg.y = this.getBodyItem().height;
        //this.addChildBody(bg);

        var sv = new ccui.ScrollView();
        sv.setDirection(ccui.ScrollView.DIR_VERTICAL);
        sv.setContentSize(cc.size(this.getBodyItem().width, this.getBodyItem().height - 20));
        //sv.setBackGroundColor(cc.color.GREEN);
        //sv.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.addChildBody(sv);

        var sortedList = this.createTestData();
        var by = 20;
        for (var i = 0; i < sortedList.length; i++) {
            var player = sortedList[i];
            var friendItemRow = new BkFriendItem(player, i, 1, this);
            //friendItemRow.y = by;
            //by = friendItemRow.y + 44;
            //friendItemRow.x = 20;
            bg.addChild(friendItemRow);
        }

        sv.x = 0;
        sv.y = 0;
        sv.setInnerContainerSize(cc.size(sv.width,sv.height + 44 * sortedList.length));
        sv.addChild(bg);
        // Create the label
        var self = this;
        var text = new ccui.Text();
        text.attr({
            string: "Bạn hãy chọn một chiếc hộp may mắn",
            font: "30px AmericanTypewriter",
            x: self.getWindowSize(),
            y: self.getWindowSize().height / 2 + text.height / 4
        });
        cc.log("size "+this.getContentSize().width/2 + " - "+this.getContentSize().height/2);
        //this.addChildBody(text);

        var button = new BkButton(res.BtnDialog_Normal, res.BtnDialog_Pressed, res.BtnDialog_Inactive, res.BtnDialog_Hover);
        button.setTitleText("DONE");
        button.x = text.x;
        button.y = text.y - text.getContentSize().height - 50;
        //this.addChildBody(button);
        var self = this;
        button.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var s = cc.director.getWinSize();
                    var layer = new cc.LayerColor(cc.color(255, 0, 0, 128));

                    layer.ignoreAnchor = false;
                    layer.anchorX = 0.5;
                    layer.anchorY = 0.5;
                    layer.setContentSize(200, 200);
                    layer.x = s.width / 2;
                    layer.y = s.height / 2;
                    this.addChild(layer, 1, cc.TAG_LAYER);
                }
            }
            , this);
    },

    createTestData: function () {

        var frList = [];

        for (var i = 0; i < 15; i++) {
            var bkUser = new BkUserData();
            bkUser.setUserName("Da_thap_huong " + i);
            bkUser.setOnlineStatus(i % 2 == 0);
            bkUser.setMoney(122 + i * 12323342);
            bkUser.setIsFriend(true);
            bkUser.setAvatarId(i);

            frList.push(bkUser);
        }

        return frList;
    },
});