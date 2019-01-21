/**
 * Created by bs on 18/11/2015.
 */
BkLabelTTF= cc.LabelTTF.extend({
    ctor:function(label, fontName, fontSize, dimensions, hAlignment, vAlignment,isBold){
        var fontName = res_name.GAME_FONT;
        if (isBold != undefined){
            if (isBold){
                fontName = res_name.GAME_FONT_BOLD;
            }
        }
        this._super(label, fontName, fontSize, dimensions, hAlignment, vAlignment);
        this.setFontSize(fontSize);
        this.setScale(0.5);
    },
    setFontSize: function (fontSize){
        this._super(fontSize*2);
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
    setTextColor:function (color) {
        this.setFontFillColor(color);
    }
});