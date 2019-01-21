/**
 * Created by vinhnq on 7/15/2016.
 */
BkAnimation = cc.Layer.extend({
    //cardBackMaskList:null,
    ctor:function(){
        this._super();
        this.setVisible(true);
        this.obj = new BkSprite("#" + res_name.blinking);
        this.addChild(this.obj);
    },
    scaleTo:function(obj,dur,scaleX,scaleY,delay)
    {
        var action = cc.scaleTo(dur,scaleX,scaleY);
        var actionScaleToBack = cc.scaleTo(dur, 1.0, 1.0);
        var delay = cc.delayTime(delay);
        var rep = cc.sequence(action, delay, actionScaleToBack).repeatForever();
        obj.runAction(rep);
    },
    moveBy:function(obj,dur,x,y,delay)
    {
        var action = cc.moveBy(dur,x,y);
        var actionBack = cc.moveBy(dur,-x,y);
        var delay = cc.delayTime(delay);
        var rep = cc.sequence(action, delay, actionBack).repeatForever();
        obj.runAction(rep);
    },
    blink:function(obj)
    {
      var bl = cc.blink(5,10);
        var rep = cc.sequence(bl).repeatForever();
        obj.runAction(rep);
    },
    highlightAnimation:function(obj)
    {
        // scale & scale back
        var action = cc.scaleTo(0.13,1.2,1.2);
        var actionScaleBack = cc.scaleTo(0.13, 1.0, 1.0);
        // move by
        var actionMove = cc.moveBy(0.13,10,0);
        var actionMoveBack = cc.moveBy(0.13,-10,0);
        var actionLeft = cc.moveBy(0.13,-10,0);
        //Blinking
        var actionBlink = cc.blink(1,2);
        var animateDelay = cc.delayTime(2.5);
        var sq = cc.sequence(action,actionScaleBack,action,actionScaleBack,animateDelay,actionBlink,animateDelay).repeatForever();
        obj.runAction(sq);
    },
    gameIconEffect:function(obj)
    {
        var action = cc.scaleTo(0.13,0.8,0.8);
        var actionScaleBack = cc.scaleTo(0.13, 1.0, 1.0);
        var animateDelay = cc.delayTime(5);
        var sq = cc.sequence(action,actionScaleBack,action,actionScaleBack,animateDelay).repeatForever();
        obj.runAction(sq);

    },
    gameIconEffect1:function(obj)
    {
        var action = cc.scaleTo(0.13,0.8,0.8);
        var actionScaleBack = cc.scaleTo(0.13, 1.1, 1.1);
        var animateDelay = cc.delayTime(5);
        var sq = cc.sequence(action,actionScaleBack,action,actionScaleBack,animateDelay).repeatForever();
        obj.runAction(sq);

    },
    gameIconFastEffect:function(obj)
    {
        var action = cc.scaleTo(0.13,0.8,0.8);
        var actionScaleBack = cc.scaleTo(0.13, 1.0, 1.0);
        var animateDelay = cc.delayTime(1);
        var sq = cc.sequence(action,actionScaleBack,action,actionScaleBack,animateDelay).repeatForever();
        obj.runAction(sq);

    },
    starEffect:function(dl,obj)
    {
        var delay = cc.delayTime(dl);
        var self = this;
        obj.runAction(cc.sequence(delay,cc.callFunc(self.startEffect,obj)));
    },
    startEffect:function(obj)
    {
        obj.visible = true;
        var acScale = cc.scaleTo(1, 0.8, 0.8);
        var acScaleBack = cc.scaleTo(1, 1.0, 1.0);
        var sq1 = cc.sequence(acScale, acScaleBack);
        var acRotate = cc.rotateTo(2, 45, 45);
        var acRotateBack = cc.rotateTo(2, -45, -45);
        var sq3 = cc.sequence(acRotate, acRotateBack);
        var fadeOut = cc.fadeOut(1);
        var fadeIn = cc.fadeIn(1);
        var sq2 = cc.sequence(fadeIn, fadeOut);
        var mySp = cc.spawn(sq1, sq2, sq3).repeatForever();
        obj.runAction(mySp);

    },
});