/**
 * Created by bs on 15/05/2017.
 */
BkChiuUAnimation = BkSprite.extend({
    color1:cc.color(0xB2,0x19,0x19),//cc.color(0xE8, 0x42, 0x0A),
    color2:cc.color(0xF9, 0xF4, 0x00),
    type:0,
    content:null,
    ctor: function (type) {
        this._super();
        var s = cc.winSize;
        // colors
        //0xE8420A chiu color
        //0xF9F400 u color
        var chiuColor = cc.color(0xE8, 0x42, 0x0A);
        var uColor = cc.color(0xF9, 0xF4, 0x00);
        var strokeColor = cc.color(0, 0, 0);
        //type = 1;
        var textContent = "CHÍU";
        var colorContent = chiuColor;
        if (type == 1){
            textContent = "Ù";
            colorContent = uColor;
        }
        colorContent = this.color1;
        // shadow offset
        var shadowOffset = cc.p(4, 4);
        var fontDefRedShadow = new cc.FontDefinition();
        fontDefRedShadow.fontName = "BRUSHSBI";
        fontDefRedShadow.fontSize = 60;
        fontDefRedShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        fontDefRedShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        fontDefRedShadow.fillStyle = colorContent;
        fontDefRedShadow.boundingWidth = 100;
        fontDefRedShadow.boundingHeight = 100;
        fontDefRedShadow.strokeEnabled = true;
        fontDefRedShadow.strokeStyle = strokeColor;
        // shadow
        // fontDefRedShadow.shadowEnabled = true;
        // fontDefRedShadow.shadowOpacity = 150;
        // fontDefRedShadow.shadowBlur = 10;
        // fontDefRedShadow.shadowOffsetX = shadowOffset.x;
        // fontDefRedShadow.shadowOffsetY = shadowOffset.y;

        // create the label using the definition
        this.content = new cc.LabelTTF(textContent, fontDefRedShadow);
        this.content.setDimensions(cc.size(200,0));
        this.content.x = s.width/2;
        this.content.y = s.height/2;
        this.addChild(this.content);
    },
    showAnimation:function(){
        var dur = 0.3;
        var self = this;
        var cb1 = cc.callFunc(function () {
            self.content.setFontFillColor(self.color2);
        });
        var cb2 = cc.callFunc(function () {
            self.content.setFontFillColor(self.color1);
        });
        var face1 = cc.fadeTo(dur,255);
        var face2 = cc.fadeTo(dur,150);
        var mSq = cc.sequence(face1,cb1,face2,cb2);
        var repeat = cc.repeatForever(mSq);
        this.runAction(repeat);
    }
});