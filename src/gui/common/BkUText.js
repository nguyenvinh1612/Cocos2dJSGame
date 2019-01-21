/**
 * Created by bs on 17/05/2017.
 */

if(typeof CUText == "undefined") {
    var CUText = {};
    CUText.MIN_DIEM_TYPE_0 		= 0;
    CUText.MIN_DIEM_TYPE_1 		= 10;
    CUText.MIN_DIEM_TYPE_2 		= 20;

    CUText.TYPE_COLOR_0			= 0;
    CUText.TYPE_COLOR_1 		= 1;
    CUText.TYPE_COLOR_2 		= 2;

    CUText.TEXT_SIZE 			= 40;
    CUText.TIME_DELAY_REMOVE 	= 2;
    CUText.TIME_ANI_SCALE 		= 2;
    CUText.TIME_ANI_ALPHA 		= 1;

    CUText.TEXT_COLOR0 			= cc.color(0xff,0xff,0xff);//cc.hexToColor(0xffffff);
    CUText.TEXT_COLOR1 			= cc.color(0xc5,0x00,0x23);//cc.hexToColor(0xC50023);
    CUText.TEXT_COLOR2 			=cc.color(0xf1,0xaf,0x00);// cc.hexToColor(0xF1AF00);
    CUText.SCALE_TIME 			= 2;
}
BkUText = BkSprite.extend({
    content:null,
    textSize:CUText.TEXT_SIZE,
    text_color:CUText.TEXT_COLOR0,
    text_content:"",
    myPr:null,
    ctor: function () {
        this._super();
    },
    initUText:function(){
        var s = cc.winSize;
        var strokeColor = cc.color(0, 0, 0);
        // shadow offset
        var shadowOffset = cc.p(1, 1);
        var fontDefRedShadow = new cc.FontDefinition();
        fontDefRedShadow.fontName = "BRUSHSBI";
        fontDefRedShadow.fontSize = this.textSize *2;
        fontDefRedShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        fontDefRedShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
        fontDefRedShadow.fillStyle = this.text_color;
        fontDefRedShadow.boundingWidth = 100;
        fontDefRedShadow.boundingHeight = 100;
        fontDefRedShadow.strokeEnabled = true;
        fontDefRedShadow.strokeStyle = strokeColor;
        // shadow
        // fontDefRedShadow.shadowEnabled = false;
        // fontDefRedShadow.shadowOpacity = 40;
        // fontDefRedShadow.shadowBlur = 5;
        // fontDefRedShadow.shadowOffsetX = shadowOffset.x;
        // fontDefRedShadow.shadowOffsetY = shadowOffset.y;

        this.content = new cc.LabelTTF(this.text_content,fontDefRedShadow);
        this.content.setDimensions(cc.size((c.WINDOW_WIDTH - 200),0));
        this.content.setScale(0.5);
        this.content.enableStroke(strokeColor,3);
        //this.content.x = s.width/2;
        //this.content.y = s.height/2;
        this.addChild(this.content);
    },
    setText:function(str,size)
    {
        if (size == undefined){
            size = CUText.TEXT_SIZE;
        }
        //CPostOnForumWindow.strCuocU = str;
        if(size !=0)
        {
            this.textSize = size;
        } else {
            this.textSize = CUText.TEXT_SIZE;
        }
        this.text_content = str;
    },
    setColor:function(typeColor){
        if (typeColor == CUText.TYPE_COLOR_0){
            this.text_color = CUText.TEXT_COLOR0;
        } else if (typeColor == CUText.TYPE_COLOR_1){
            this.text_color = CUText.TEXT_COLOR1;
        } else if (typeColor == CUText.TYPE_COLOR_2){
            this.text_color = CUText.TEXT_COLOR2;
        } else {
            this.text_color = typeColor;
        }
    },
    setParentSprite:function(pprr){
        this.myPr = pprr;
    },
    show:function()
    {
        this.initUText();
        this.setScale(0.2);
        //scaleTL = TweenLite.fromTo(this,TIME_ANI_SCALE,{scaleX:0.2,scaleY:0.2},
        //    {scaleX:SCALE_TIME,scaleY:SCALE_TIME,onComplete:onCompleteScale,ease:Elastic.easeOut});
        var scaleAction = cc.scaleTo(CUText.TIME_ANI_SCALE,CUText.SCALE_TIME);
        scaleAction.easing(cc.easeElasticOut());
        var alphaAction  = cc.fadeOut(CUText.TIME_ANI_ALPHA);
        alphaAction.easing(cc.easeOut(1));
        var self = this;
        var showUFinish = cc.callFunc(function(){
            self.showUFinish();
        });
        var callBack = cc.callFunc(function(){
            self.onAnimationFinish();
        });
        var sq = cc.sequence(scaleAction,showUFinish,cc.delayTime(CUText.TIME_DELAY_REMOVE),alphaAction,callBack);
        this.runAction (sq);
    },
    showUFinish:function()
    {
        if (this.myPr!=null){
            this.myPr.onCaptureCuocU();
        }
    },
    onAnimationFinish:function(){
        logMessage("onAnimationFinish");
        if (this.myPr!=null){
            this.myPr.onShowUTextFinish();
        }
    }
});
