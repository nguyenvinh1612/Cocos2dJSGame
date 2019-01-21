/**
 * Created by VanChinh on 10/24/2016.
 */

BkShortcutWindow = BkWindow.extend({
    webView: null,
    ctor: function (url) {
        if(url){
            this._super("Lưu Trang",cc.size(750,525));
            this.setVisibleOutBackgroundWindow(true);

            this.webView = new ccui.WebView(url);
            this.webView.setContentSize(750, 500);
            this.webView.setPosition(382, 220);
            this.webView.setScalesPageToFit(true);
            this.addChildBody(this.webView);
        }
        else{
            this._super("", cc.size(520, 290), null);
            this.setVisibleOutBackgroundWindow(true);
            this.setDefaultWdBodyBg();
            this.initWindow();
        }
    },
    setDefaultWdBodyBg:function(){
        this._top.y = this._top.y - 1;

        var bookmarkTittle = new BkSprite("#" + res_name.bookmark_title);

        bookmarkTittle.x = 195;
        bookmarkTittle.y = -9;
        this._top.addChild(bookmarkTittle);

        this._btnClose.loadTextures(res_name.btn_close_bookmark, res_name.btn_close_bookmark, res_name.btn_close_bookmark, res_name.btn_close_bookmark_hover, ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x += 24;
        this._btnClose.y += 18;
    },
    initWindow: function () {
        this.removeAllChildren();

        var smsItemStr = [
            new BkLabelItem("Bạn yêu thích bigkool.net, hãy nhấn ", 20, BkColor.DEFAULT_TEXT_COLOR, 1, false),
            new BkLabelItem("Ctrl + D", 20, cc.color(255,255,5), 1, false),
            new BkLabelItem(" để", 20, BkColor.DEFAULT_TEXT_COLOR, 1, false),
            new BkLabelItem("lưu trang vào mục yêu thích của trình duyệt", 20, BkColor.DEFAULT_TEXT_COLOR, 2, false),
        ];
        var lblContent = new BkLabelSprite(smsItemStr);
        lblContent.x = 55;
        lblContent.y = 110;
        this.addChildBody(lblContent);
    }
});