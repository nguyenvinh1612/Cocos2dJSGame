/**
 * Created by bs on 14/01/2016.
 */
BkAnimationCardData = cc.Class.extend({
    xPos:0,
    yPos:0,
    durationTime:0,
    tag:-1,
    fnCallback:null,
    ctor:function(dur,xp,yp,tag){
        this.xPos = xp;
        this.yPos = yp;
        this.durationTime = dur;
        this.tag = tag;
    }
});