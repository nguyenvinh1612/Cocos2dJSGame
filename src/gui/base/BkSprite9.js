/**
 * Created by bs on 01/10/2015.
 */
/*
*
* */

BkSprite9 = BkSprite.extend({
    left:null,
    right:null,
    center:null,
    actionCount:0,
    ctor:function (img,rect) {
        this._super(img,rect);
    },
    init:function(left, right, center) {
        this.left = left;
        this.right = right;
        this.center = center;
    },

    removeAll:function() {
        this.left.removeFromParent();
        this.right.removeFromParent();
        this.center.removeFromParent();
    },

    scaleLeft:function(size, dur) {
        this.removeAll();
        this.actionCount = 0;
        this.right.x = (this.center.getWidth() + this.right.getWidth()) / 2;
        this.addChild(this.center);
        //this.addChild(this.right);
        var newCenterWidth = size - (this.left.getWidth() + this.right.getWidth());
        var scaleTime = newCenterWidth / this.center.getWidth();
        var finisPosX = -1 * (newCenterWidth - this.center.getWidth()) / 2;
        var callback = cc.callFunc(this.scaleLeftFinish, this);
        var scale = cc.scaleTo(dur, scaleTime , 1);
        var move = cc.moveTo(dur, finisPosX, 0);
        var seq3_1 = new cc.Sequence(scale, callback);
        var seq3_2 = new cc.Sequence(move, callback);
        var spawn = new cc.Spawn(seq3_1, seq3_2);
        var action = new cc.Repeat(spawn, 1);
        this.center.runAction(action);
    },

    scaleRight:function(size, dur) {
        this.removeAll();
        this.actionCount = 0;
        this.left.x = - (this.center.getWidth() + this.left.getWidth()) / 2;
        this.addChild(this.center);
        //this.addChild(this.left);
        var newCenterWidth = size - (this.left.getWidth() + this.right.getWidth());
        var scaleTime = newCenterWidth / this.center.getWidth();
        var finisPosX = (newCenterWidth - this.center.getWidth()) / 2;
        var callback = cc.callFunc(this.scaleRightFinish, this);
        var scale = cc.scaleTo(dur, scaleTime , 1);
        var move = cc.moveTo(dur, finisPosX, 0);
        var seq3_1 = new cc.Sequence(scale, callback);
        var seq3_2 = new cc.Sequence(move, callback);
        var spawn = new cc.Spawn(seq3_1, seq3_2);
        var action = new cc.Repeat(spawn, 1);
        this.center.runAction(action);
    },

    scaleRightFinish:function() {
        if (this.actionCount == 0) {
            this.actionCount = 1;
            return;
        }
        this.right.x = (this.center.getWidth() + this.right.getWidth())/2 + this.center.x;
        this.addChild(this.right, 0);
        this.actionCount = 0;
    },

    scaleLeftFinish:function() {
        if (this.actionCount == 0) {
            this.actionCount = 1;
            return;
        }
        this.left.x = - (this.center.getWidth() + this.left.getWidth()) / 2 + this.center.x;
        this.addChild(this.left, 0);
        this.actionCount = 0;
    },
});