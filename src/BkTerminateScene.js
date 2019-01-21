/**
 * Created by bs on 28/10/2015.
 */
BkTerminateScene = cc.Scene.extend({
    _className:"BkTerminateScene",
    onEnter:function () {
        this._super();
        this.init();
    },
    init : function(){
        // bg
        var winSize = cc.director.getWinSize();
        var bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        this.addChild(bgLayer);
        var background = new BkSprite(res.Bg_Default);
        background.scaleX = 1;
        background.scaleY = 1;
        background.attr({
            x: winSize.width / 2,
            y: winSize.height / 2
        });
        bgLayer.addChild(background);
        var contentbg = new cc.DrawNode();
        var contentHeight = 200;
        contentbg.drawRect(cc.p(0, 0), cc.p(winSize.width- contentHeight, contentHeight), BkColor.BG_PANEL_COLOR,1, BkColor.BG_PANEL_BORDER_COLOR);
        contentbg.x = 100;
        contentbg.y = contentHeight;
        bgLayer.addChild(contentbg);

        var lbMsg = new BkLabel(BkConstString.STR_LOCKED_CLIENT, "", 20);
        lbMsg.x = winSize.width/2;
        lbMsg.y = contentbg.y + contentHeight/2 + lbMsg.height/2;
        bgLayer.addChild(lbMsg);

//        showPopupMessageWith(BkConstString.STR_LOCKED_CLIENT);
        return true;
    },
});