/**
 * Created by bs on 03/11/2015.
 */
BkTestTab = BkTabWindow.extend({
    _tabList: ["Danh sách bạn", "Lời mời kết bạn", "Tìm bạn"],
    contentSprite:null,
    ctor: function () {
        this._super("Bạn bè", cc.size(660, 550), this._tabList.length, this._tabList);
        this.initTestTab();
    },
    initTestTab:function(){
        this.setMoveableWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
    },
    selectedTabEvent: function (sender, tabIndex) {
        logMessage("selectedTabEvent "+tabIndex);
        if (this.contentSprite != null){
            this.contentSprite.removeSelf();
            this.contentSprite = null;
        }
        this.contentSprite = new BkSprite();
        this.addChildBody(this.contentSprite);
        var btnTopPlayer = new BkButton(res.BtnDialog_Normal, res.BtnDialog_Pressed, res.BtnDialog_Inactive,res.BtnDialog_Hover);
        this.contentSprite.addChild(btnTopPlayer);
        if (tabIndex == 1){
            btnTopPlayer.setTitleText("Tab 1");
            btnTopPlayer.x = 100;
            btnTopPlayer.y = 100;
        } else if (tabIndex == 2){
            btnTopPlayer.setTitleText("Tab 2");
            btnTopPlayer.x = 200;
            btnTopPlayer.y = 200;
        } else if (tabIndex == 3){
            btnTopPlayer.setTitleText("Tab 3");
            btnTopPlayer.x = 300;
            btnTopPlayer.y = 300;
        }
        Util.showAnim();
    }
});