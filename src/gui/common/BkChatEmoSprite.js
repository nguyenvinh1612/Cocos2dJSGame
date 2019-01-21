/**
 * Created by bs on 12/11/2015.
 */
var CHAT_ICON_WH                = 165;
var MAX_NUMBER_IMG_IN_ACTION    = 10;
var TIME_PER_FRAME              = 0.2;

BkChatEmoSprite = cc.SpriteBatchNode.extend({
    sprite:null,
    animFrames:null,
    numberImage:0,
    numberRepeat:0,
    /*
    *   example ctor
    *   chatPlist = res.chat_expression1_plist
    *   chatTextture = res.chat_expression1_img
    *   chatItemName = expression1
    * */
    //ctor:function(chatPlist,chatTextture,chatItemName,numberImageInTextture){
    ctor:function(data){
        var chatPlist = data.iconPlist;
        var chatTextture = data.iconTexture;
        var chatItemName = data.iconName;
        var numberImageInTextture = data.nunberImage;
        cc.spriteFrameCache.addSpriteFrames(chatPlist, chatTextture);
        this.sprite = new BkSprite("#"+chatItemName+"_1.png");
        this._super(chatTextture);
        this.addChild(this.sprite);
        this.animFrames = [];
        this.numberImage = numberImageInTextture;
        this.numberRepeat = Math.floor(MAX_NUMBER_IMG_IN_ACTION/numberImageInTextture);
        if ((this.numberRepeat < 2) && (this.numberImage < 10)){
            this.numberRepeat = 2;
        }
        if (this.numberRepeat == 0){
            this.numberRepeat = 2;
        }
        var str ="";
        for (var i = 1; i < numberImageInTextture+1; i++) {
            str = chatItemName+"_"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            this.animFrames.push(frame);
        }
    },
    showEmo:function(){
        var animation = new cc.Animation(this.animFrames, TIME_PER_FRAME);
        this.sprite.runAction(cc.animate(animation).repeat(this.numberRepeat));
        this.scheduleOnce(this.removeEmo,TIME_PER_FRAME * this.numberImage * this.numberRepeat);
    },

    showEmoForever:function(){
        var animation = new cc.Animation(this.animFrames, TIME_PER_FRAME);
        this.sprite.runAction(cc.animate(animation).repeatForever());
    },
    removeEmo:function(){
        this.unscheduleAllCallbacks();
        this.removeFromParent();
    }
});