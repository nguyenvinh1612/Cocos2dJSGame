/**
 * Created by bs on 03/10/2015.
 */
BkLabel = ccui.Text.extend({
    ctor: function (textContent, fontName, fontSize,isBold) {
        fontName = res_name.GAME_FONT;
        if (isBold != undefined){
            if (isBold){
                fontName =res_name.GAME_FONT_BOLD;
            }
        }
        this._super(textContent, fontName, fontSize);
        var point = this.getAnchorPoint();
        this.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.setScale(0.5);
        //this.setAnchorPoint(point.x/2,point.y);
    },
    getContentSize:function(){
        var size = this._super();
        return cc.size(size.width/2,size.height/2);
    },
    _getWidth: function () {
        return this.getContentSize().width;
    },
    _getHeight: function () {
        return this.getContentSize().height;
    },
    setFontSize: function (size) {
        this._super(size*2);
    },
    setStrikeThrough:function()
    {
        var gray_line = new BkSprite("#" + res_name.gray_line);
        gray_line.setScale(this._getWidth()*2/gray_line.width,2.5);
        gray_line.x = this.getContentSize().width/2 + 30;
        gray_line.y = this.getContentSize().height/2 + 10;// this.getContentSize().height/2 + 10;
        this.addChild(gray_line);
    }
});