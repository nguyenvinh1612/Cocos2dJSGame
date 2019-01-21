/**
 * Created by bs on 01/10/2015.
 */
/*
*
* */
cc.Node.prototype.createHoverEvent = function(callbackOver,callbackOut,callbackMouseDown){
    var hoverEvent = cc.EventListener.create({
        event: cc.EventListener.MOUSE,
        onMouseMove: function (event) {
            var location = event.getLocation();
            var target = event.getCurrentTarget();

            if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), location)) {
            //if (cc.rectContainsPoint(target.getBoundingBox(), location)) {
                cc._canvas.style.cursor = "pointer";
                BkInSide.isInSide = true;
                BkInSide.targetInSide = target;
                if ((callbackOver != null) && (callbackOver != undefined)){
                    callbackOver(event);
                }
            } else {
                if (BkInSide.targetInSide == target) {
                    cc._canvas.style.cursor = "default";
                    BkInSide.isInSide = false;
                    BkInSide.targetInSide = null;
                }

                if ((callbackOut != null) && (callbackOut != undefined)){
                    callbackOut(event);
                }
            }
        },
        onMouseDown: function (event) {
            if ((callbackMouseDown != null) && (callbackMouseDown != undefined)){
                callbackMouseDown(event);
            }
        }
    });

    return hoverEvent.clone();
};

cc.Node.prototype.createTouchEvent = function(cbTouchBegan,cbTouchMove,cbTouchEnd){
    //logMessage("createTouchEvent");
    var mOnTouchListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);
            //logMessage("s.width: "+s.width+" s.height: "+s.height);
            if (cc.rectContainsPoint(rect, locationInNode)) {
                if ((cbTouchBegan != null) && (cbTouchBegan != undefined)){
                    var isCB = cbTouchBegan(touch,event);
                    if (isCB != undefined){
                        logMessage("rtn callback != undefined");
                        return isCB;
                    }
                }
                return true;
            } else {
                //logMessage("click out rect");
            }
            return false;
        },
        onTouchMoved: function (touch, event) {
            if ((cbTouchMove != null) && (cbTouchMove != undefined)){
                cbTouchMove(touch,event);
            }
        },
        onTouchEnded: function (touch, event) {
            if ((cbTouchEnd != null) && (cbTouchEnd != undefined)){
                cbTouchEnd(touch,event);
            }
        }
    });

    return mOnTouchListener.clone();
};

BkInSide = {
    isInSide:false,
    targetInSide:null
};

BkSprite = cc.Sprite.extend({
    OnMouseMoveListener:null,
    OnClickListener:null,
    ctor:function (img,rect) {
        this._super(img,rect);
        this.OnMouseMoveListener= null;
        this.OnClickListener=null;
    },
    getWidth:function(){// get current wid
        //cc.log("wid "+this.width*this.getScaleX());
        return this.width * this.getScaleX();
    },
    getHeight:function(){// get current hei
        //cc.log("hei "+this.height * this.getScaleY());
        return this.height * this.getScaleY();
    },
    setOnlickListenner:function(callback) {
        this.OnClickListener = this.createTouchEvent(callback);
        cc.eventManager.addListener(this.OnClickListener, this);
    },
    setMouseOnHover:function(callbackOver,callbackOut){
        this.OnMouseMoveListener = this.createHoverEvent(callbackOver,callbackOut);
        cc.eventManager.addListener(this.OnMouseMoveListener, this);
    },
    setPositionCenter:function(){
        this.x = this.getContentSize().width/2;
        this.y = this.getContentSize().height/2;
    },
    removeSelf:function(){
        if (this.OnMouseMoveListener != null){
            cc.eventManager.removeListener(this.OnMouseMoveListener);
        }
        if (this.OnClickListener != null){
            cc.eventManager.removeListener(this.OnClickListener);
        }
        if (!cc.sys.isNative){
            cc._canvas.style.cursor = "default";
        }
        this.removeFromParent();
    },

    // Set Opacity
    setOpacity:function(percent) {
        // Origin function
        this._realOpacity = percent;
        //this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.opacityDirty);

        // Set for all child
        var locChildren = this._children; 
        if(locChildren!= undefined && locChildren != null)
        {
        	for (var i = 0; i < locChildren.length; i++) {
                var child = locChildren[i];
                if (child && child._visible) {
                    child.setOpacity(percent);
                }
            }
        }
        
    }
});