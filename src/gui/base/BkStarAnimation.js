/**
 * Created by vinhnq on 7/20/2016.
 */
BkStarAnimation = cc.Layer.extend({
showStarEffect:function()
{
    var delay = cc.delayTime(0.8);
    this.runAction(cc.sequence(cc.callFunc(this.starEffect,this,1),delay,cc.callFunc(this.starEffect,this,2),delay,cc.callFunc(this.starEffect,this,3),delay,cc.callFunc(this.starEffect,this,4)));
},
fadeout:function(obj)
{
    var action = new  cc.fadeOut(2);
    var actionBack = new   cc.fadeIn(0);
    var rep = cc.sequence(action,actionBack);
    obj.runAction(rep);
},
getStarbyID:function(i)
{
    var offsetx  = 10;
    if(i == 1)
    {
        if(this.star1 == null)
        {
            this.star1 = new BkSprite("#" + res_name.star);
            this.star1.setScale(0.7,0.7);
            this.addChild(this.star1);
        }
        return this.star1;
    }
    if(i == 2)
    {
        if(this.star2 == null)
        {
            this.star2 = new BkSprite("#" + res_name.star);
            this.star2.setScale(0.8,0.8);
            this.star2.x  =   this.star2.x + offsetx;
            this.addChild(this.star2);
        }
        return this.star2;
    }
    if(i == 3)
    {
        if(this.star3 == null)
        {
            this.star3 = new BkSprite("#" + res_name.star);
            this.star3.setScale(0.5,0.5);
            this.star3.x  =   this.star3.x + 2*offsetx;
            this.addChild(this.star3);
        }
        return this.star3;
    }
    if(i == 4)
    {
        if(this.star4 == null)
        {
            this.star4 = new BkSprite("#" + res_name.star);
            this.star4.x  =   this.star4.x + 3*offsetx;
            this.addChild(this.star4);
        }
        return this.star4;
    }
},
starEffect:function(obj,i)
{
    var actionMove = new cc.moveBy(2,0,50);
    var fo = cc.fadeOut(2);
    var fi = cc.fadeIn(0);
    var sq = cc.sequence(fo,fi);
    var mySp = cc.spawn(actionMove,sq);
    this.getStarbyID(i).runAction(cc.sequence(mySp,cc.callFunc(this.onfinish,this.getStarbyID(i)))).repeatForever();
},
onfinish:function(obj)
{
    obj.y = obj.y - 50;
},
});