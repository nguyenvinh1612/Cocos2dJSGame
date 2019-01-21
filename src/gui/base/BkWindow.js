/**
 * Created by hoangthao on 28/09/2015.
 */

WD_ZORDER_WINDOW = -3;
WD_ZORDER_TOP = 2;
WD_ZORDER_BODY = -2;
WD_BODY_MARGIN_LR = 22;
WD_BODY_MARGIN_TB = 22;

BkWindow = BkBaseLayer.extend({
        _windowTitle: null,
        _windowSize: null,
        _wdBodyInnerSize: null,
        _bodyLayer: null,
        _bgWindowLayer: null,
        _maskTop:null,
        _top: null,
        _btnClose:null,
        _bgBody: null,
        _bgBottom:null,
        _parentNode: null,
        _moveWindowListener: null,
        _closedWindowListener:null,
        _isMovingWindow:null,
        _isVisibleOutBG:false,
        _callbackCloseButtonClick:null,
        _callbackRemoveWindow:null,
        ctor: function (titleBar, size, parent,isTab,isClean) {
            var screenSize = cc.director.getWinSize();
            //Hack wd size
            this._windowSize = cc.size(size.width,size.height-17);
            //this._windowSize = size;
            this.setParentWindow(parent);
            if (this._windowSize == null) {
                this._windowSize = cc.size(screenSize.width / 2, screenSize.height / 2);
            }
            this._super();
            logMessage("Call WD : " + titleBar);
            this.init(titleBar,isTab,isClean);
        },
        init: function (titleBar,isTab,isClean) {
            if (isTab == undefined){
                isTab = false;
            }
            this._isMovingWindow = false;
            this.setName("BkWindow");

            // Get the screen size
            this._bodyLayer = new cc.Layer();

            // Add the top
            //truongbs ++ add scale9Sprite
            var mRect = cc.rect(250,12,250,6);
            if (isTab){
                this._top = new cc.Scale9Sprite(res_name.Header_Window,mRect);
            } else {
                this._top = new cc.Scale9Sprite(res_name.Header_Nosub_Window,mRect);
            }

            this._top.width = this._windowSize.width;
            this._top.x = this._windowSize.width / 2;
            this._top.y = this._windowSize.height - this._top.height / 2;
            this._bodyLayer.addChild(this._top, WD_ZORDER_TOP);

            // Add the title
            this._windowTitle = new BkLabel(titleBar, "Arial", 20,true);
            this._windowTitle.color = cc.color(255,255,255);
            this._windowTitle.x = this._windowSize.width / 2;
            this._windowTitle.y = this._top.y;
            this._windowTitle.enableShadow(cc.color(13,59,85), cc.p(2, -2));
            this._bodyLayer.addChild(this._windowTitle, WD_ZORDER_TOP);

            this._btnClose = new BkButton(res_name.BtnClose_Window,res_name.BtnClose_Window,res_name.BtnClose_Window,res_name.BtnClose_Window_hover,ccui.Widget.PLIST_TEXTURE);
            this._btnClose.x = this._windowSize.width - 25;
            this._btnClose.y = this._top.y;
            this._btnClose.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    logMessage("click btnClose");
                    cc._canvas.style.cursor = "default";
                    this.removeSelf(isClean);
                    if (this._callbackCloseButtonClick!= null){
                        this._callbackCloseButtonClick();
                    }
                }
            }, this);
            this._bodyLayer.addChild(this._btnClose, WD_ZORDER_TOP);

            // Add the background
            var bodyFrame;
            if (isTab){
                bodyFrame = cc.spriteFrameCache.getSpriteFrame(res_name.Body_Window);
            } else {
                bodyFrame = cc.spriteFrameCache.getSpriteFrame(res_name.Body_Nosub_Window);
            }
            
            //if(this._windowSize.height < 240) {
            //    //var bodyRect = cc.rect(this._windowSize.width-WD_BODY_MARGIN_LR, 165, WD_BODY_MARGIN_LR, 5);
            //    //this._bgBody = new cc.Scale9Sprite(bodyFrame, bodyRect);
            //}else
            //{
            //    this._bgBody = new cc.Scale9Sprite(bodyFrame);
            //}
            this._bgBody = new cc.Scale9Sprite(bodyFrame);
            this._bgBody.width = this._windowSize.width;
            this._bgBody.height = this._windowSize.height - this._top.height;
            this._bgBody.x = this._windowSize.width / 2;
            this._bgBody.y = this._top.y - this._windowSize.height/2;
            this._bodyLayer.addChild(this._bgBody, WD_ZORDER_BODY);

            this._bgBottom = new cc.Scale9Sprite(res_name.Bottom_Window,mRect);
            this._bgBottom.width = this._windowSize.width;
            this._bgBottom.x = this._windowSize.width / 2;
            this._bgBottom.y = this._bgBody.y - this._windowSize.height/2 + 0.2 *this._bgBottom.height;
            this._bodyLayer.addChild(this._bgBottom, WD_ZORDER_BODY);
        },

        setCallbackCloseButtonClick:function(f){
            this._callbackCloseButtonClick = f;
        },
        setCallbackRemoveWindow:function(f){
            this._callbackRemoveWindow = f;
        },
        showWithParent: function (isPauseEvent,tag) {
            logMessage("window showWithParent");
            //this.visible = true;
            cc._canvas.style.cursor = "default";
            var screenSize = cc.director.getWinSize();

            this._bodyLayer.x = screenSize.width /2 - this._windowSize.width/2;
            this._bodyLayer.y = screenSize.height /2 - this._windowSize.height/2;
            this.addChild(this._bodyLayer, WD_ZORDER_WINDOW);

            if (this._isVisibleOutBG){
                this.addChild(this._bgWindowLayer, -4);
            }
            var isPause = true;
            if (isPauseEvent!= undefined && isPauseEvent != null){
                isPause = isPauseEvent;
            }
            if (isPause){
                if (!this.getParentWindow()){
                    logMessage("khong co parent node -> pause scene");
                    Util.pauseEventCurrentScene();
                } else {
                    logMessage("co parent node -> pause parent node");
                    cc.eventManager.pauseTarget(this.getParentWindow(), true);
                }
            }
            var scene = getCurrentScene();
            //this.y = 0.5;
            if(scene != undefined)
            {
                var curShownWD = scene.getChildByTag(WD_TAG.HOT_NEWS);
                if(curShownWD != undefined && curShownWD != null)
                {
                    curShownWD.removeSelf();
                }
                if(tag != undefined && tag != null)
                {
                    scene.addChild(this, TagOfLayer.Popup,tag);
                }else
                {
                    scene.addChild(this, TagOfLayer.Popup);
                }
            }
        },

        getWindowTitle: function () {
            return this._windowTitle;
        },

        setWindowTitle: function (windowTitle) {
            this._windowTitle.setString(windowTitle);
        },

        getWindowSize: function () {
            return this._windowSize;
        },

        setWindowSize: function (x, y) {
            this._windowSize = cc.size(x, y);
        },

        getBodySize: function () {
            return cc.size(this._windowSize.width, this._windowSize.height- this._top.height);
        },

        getBodyInnerSize: function () {
            return this._wdBodyInnerSize;
        },

        getBodyItem:function() {
            return this._bodyLayer;
        },

        getParentWindow: function () {
            return this._parentNode;
        },

        setParentWindow: function (parent) {
            this._parentNode = parent;
        },

        setDefaultWdBodyBg: function () {
            this._wdBodyInnerSize = cc.size(this.getBodySize().width - WD_BODY_MARGIN_LR*2, this.getBodySize().height - WD_BODY_MARGIN_TB);
            var windowBodyBg = new cc.DrawNode();
            var color = cc.color(18, 37, 98);
            windowBodyBg.drawRect(cc.p(0, 0), cc.p(this._wdBodyInnerSize.width, this._wdBodyInnerSize.height), color, 1,color)//; BkColor.BG_BODY_BORDER_COLOR);

            windowBodyBg.x = WD_BODY_MARGIN_LR;
            this.addChildBody(windowBodyBg, -1);
        },

        setVisibleTop:function(isVisible){
            this._top.visible = isVisible;
        },

        setVisibleBottom:function(isVisible){
            this._bgBottom.visible = isVisible;
        },

        setVisibleBgBody:function(isVisible){
            this._bgBody.visible = isVisible;
        },

        addChildBody:function(child, localZOrder, tag){
            this._bodyLayer.addChild(child, localZOrder, tag);
        },

        getWindowPos:function() {
            var xPos = this._bodyLayer.x -this._bgWindowLayer.x;
            var yPos = this._bodyLayer.y -this._bgWindowLayer.y;
            return cc.p(xPos,yPos);
        },

        setVisibleOutBackgroundWindow: function (isVisible) {
            this._isVisibleOutBG = isVisible;
            if(isVisible) {
                var screenSize = cc.director.getWinSize();
                //this._bgWindowLayer = new cc.LayerColor(cc.color(0, 0, 0, 100));
                this._bgWindowLayer = new BkSprite("#" + res_name.Window_bgMask);
                this._bgWindowLayer.setOpacity(210);
                this._bgWindowLayer.x = screenSize.width/2;
                    this._bgWindowLayer.y = screenSize.height/2;
                //this._bgWindowLayer.scaleX = screenSize.width / this._windowSize.width;
                //this._bgWindowLayer.scaleY = screenSize.height / this._windowSize.height;
                /*
                 * truongbs ++: fix not stop event after removing window
                 **/

                var selfPointer = this;
                var isRemoveWindow = false;
                this._closedWindowListener = this._bgWindowLayer.createTouchEvent(function(touch, event){
                    isRemoveWindow = false;
                    if(selfPointer._isMovingWindow){
                        return false;
                    }
                    var location = selfPointer.convertToNodeSpace(touch.getLocation());
                    cc.log("location "+location.x+" - "+location.y);

                    var rect = cc.rect(selfPointer._bodyLayer.x
                        , selfPointer._bodyLayer.y , selfPointer._windowSize.width, selfPointer._windowSize.height);

                    if (!cc.rectContainsPoint(rect, location)) {
                        logMessage("outzise window -> remove window");
                        isRemoveWindow = true;
                    } else {
                        logMessage("insize window");
                        return false;
                    }
                },null,function (touch, event) {
                    if (isRemoveWindow){
                        selfPointer.removeSelf();
                    }
                });
                cc.eventManager.addListener(this._closedWindowListener, this._bgWindowLayer);
            }
        },

        setMoveableWindow: function (isMove) {
            if (isMove){
                return;
            }
            if (!isMove) {
                return;
            }
            var selfPointer = this;
            this._moveWindowListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);

                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true;
                    }
                    return false;
                },
                onTouchMoved: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var location = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);

                    if (cc.rectContainsPoint(rect, location)) {
                        selfPointer._isMovingWindow = true;
                        var delta = touch.getDelta();
                        selfPointer.x += delta.x;
                        selfPointer.y += delta.y;
                        if (selfPointer.x< -selfPointer._windowSize.width / 2){
                            selfPointer.x = -selfPointer._windowSize.width / 2;
                        }
                        logMessage("[x: "+selfPointer.x+"- y: "+selfPointer.y+"]");
                        if (selfPointer._bgWindowLayer != null) {
                            selfPointer._bgWindowLayer.x -= delta.x;
                            selfPointer._bgWindowLayer.y -= delta.y;
                        }
                    }
                },
                onTouchEnded: function (touch, event) {
                    selfPointer._isMovingWindow = false;
                }
            });
            cc.eventManager.addListener(this._moveWindowListener, this._top);
        },

        removeSelf: function (isClean) {
            if(this.getParentWindow()){
                logMessage("co parent node -> resume event parent node");
                cc.eventManager.resumeTarget(this.getParentWindow(), true);
            } else {
                logMessage("khong co parent node -> remove current scene");
                Util.resumeEventCurrentScene();
            }
            this.visible = false;
            //TODO: 2 wd one parent
            this.removeFromParent(isClean);
            cc._canvas.style.cursor = "default";
            if (this._callbackRemoveWindow!= null){
                this._callbackRemoveWindow();
            }
        }
    }
);
