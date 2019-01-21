/**
 * Created by hoangthao on 12/10/2015.
 */

var SCALE_WID_SC = 1;
var HEIGHT_SC = 86;
BkScrollView = cc.ScrollView.extend({
    winSize:null,
    beginY:null,
    mouseScrollEvent:null,
    mouseWheelListener:null,
    DOMMouseScrollListener:null,
    thanhSc:null,
    sliderSc:null,
    myPr:null,
    minY:0,
    maxY:0,
    onDragDropListener:null,
    beginTouchPoint:null,
    isHSC:false,
    ctor:function (size, container,parent,isHasScrollBar) {
        this.initSysEventListener(cc._canvas);
        this._super(size, container);
        logMessage("Container - width:" + container.width + " - height:" + container.height);
        this.myPr = parent;
        this.initScroll();
        if (isHasScrollBar != undefined){
            this.isHSC = isHasScrollBar;
        }
        if (this.isHSC){
            this.initScrollUI();
        }
    },
    initScrollUI:function(){
        if (this.thanhSc == null){
            this.thanhSc = new BkSprite("#"+res_name.thanhSc);
            this.myPr.addChild(this.thanhSc,100);
        }

        if (this.sliderSc == null){
            this.sliderSc = new BkSprite("#"+res_name.sliderSc);
            this.myPr.addChild(this.sliderSc,100);
        }
        this.sliderSc.setScale(SCALE_WID_SC,30 / HEIGHT_SC);
        this.thanhSc.setScale(1,this._viewSize.height / HEIGHT_SC);
        this.sliderSc.x = this._viewSize.width;
        this.sliderSc.y = this._viewSize.height - this.sliderSc.getHeight()/2;
        this.thanhSc.x = this.sliderSc.x;
        this.thanhSc.y = this._viewSize.height/2;
    },
    initScrollbarEvent:function(){
        if (this.onDragDropListener == null){
            var self = this;
            this.onDragDropListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();

                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);

                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        self.beginTouchPoint = cc.p(target.x,target.y);
                        return true;
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var delta1 = touch.getDelta();
                    var tg = target.y + delta1.y;
                    var oldY = target.y;
                    if (tg <= self.minY){
                        target.y = self.minY;
                    } else if (tg>= self.maxY){
                        target.y = self.maxY;
                    } else {
                        target.y = tg;
                    }
                    var realDelta = oldY -target.y;
                    self.doScrollVertical(self.getContainer(),realDelta);
                }
            });
            cc.eventManager.addListener(this.onDragDropListener, this.sliderSc);
        }
    },
    configPos:function(xPos,yPos){
        if (this.isHSC){
            this.sliderSc.x = xPos;
            this.thanhSc.x = xPos;
            this.thanhSc.y = yPos;
            this.sliderSc.y = yPos + this.thanhSc.getHeight()/2 - this.sliderSc.getHeight()/2;
            this.minY = yPos - this.thanhSc.getHeight()/2 + this.sliderSc.getHeight()/2 ;
            this.maxY = yPos + this.thanhSc.getHeight()/2 - this.sliderSc.getHeight()/2;
            this.initScrollbarEvent();
        }
    },
    initScroll: function () {
        this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.setTouchEnabled(false);
        this.winSize = cc.director.getWinSize();
        var self = this;

        this.mouseScrollEvent = {
            event: cc.EventListener.MOUSE,
            onMouseScroll: function (event) {
                var delta = cc.sys.isNative ? event.getScrollY() * 6 : -event.getScrollY();
                var target = event.getCurrentTarget();
                var location = event.getLocation();

                if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), location)) {
                    self.updatePosSlice(target,delta/ 10);
                    self.doScrollVertical(target, delta /10);
                }
                return true;
            }
        };
        cc.eventManager.addListener(this.mouseScrollEvent, this.getContainer());
    },

    setBeginY: function (y) {
        this.getContainer().y = y;
        this.beginY = y;
        if (this.isHSC){
            var viewHeight = this._viewSize.height;
            var heightSlice = (viewHeight + this.beginY);
            this.sliderSc.setScale(SCALE_WID_SC,heightSlice / HEIGHT_SC);
        }
    },

    updatePosSlice:function(target,delta){
        if (!this.isHSC){
            return;
        }
        var d1 = (this._viewSize.height - this.sliderSc.getHeight()) * delta/this.beginY;
        var newY = target.y + delta;
        if (newY >0) {
            this.sliderSc.y = this.minY;
        } else if (newY < this.beginY) {
            this.sliderSc.y = this.maxY;
        } else {
            this.sliderSc.y += d1;
        }

    },
    doScrollVertical:function(target, delta) {
        var newY = target.y + delta;
        if (newY >0) {
            newY = 0;
            if (this.isHSC){
                this.sliderSc.y = this.minY;
            }
        }
        if (newY < this.beginY) {
            newY = this.beginY;
            if (this.isHSC){
                this.sliderSc.y = this.maxY;
            }
        }
        target.y = newY;

        var locChildren = this._container._children;
        for (var i = 0; i < locChildren.length; i++) {
            var child = locChildren[i];
            var isPause = (!this.isNodeVisible(child));
            pauseEventOfTarget(child,isPause);
        }
    },

    initSysEventListener: function (element) {
       // cc.inputManager.registerMouseScrollSystemEvent(element);
    },

    removeSysEventListener: function (element) {
        cc.inputManager.removeMouseScrollSystemEvent(cc._canvas);
    },

    onExit: function () {
        this.removeSysEventListener();
        this._super();
    },
    removeFromParent:function(){
        this._super();
        if (this.sliderSc!= null){
            this.sliderSc.removeFromParent();
        }
        if (this.thanhSc!= null){
            this.thanhSc.removeFromParent();
        }
    }
});