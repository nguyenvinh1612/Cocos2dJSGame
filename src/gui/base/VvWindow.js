/**
 * Created by chinhtv on 12/05/2017.
 */

VV_WD_ZORDER_WINDOW = -3;
VV_WD_ZORDER_TOP = 2;
VV_WD_ZORDER_BODY = -2;
VV_WD_BODY_MARGIN_LR = 22;
VV_WD_BODY_MARGIN_TB = 22;

TAB_WD_BODY_MARGIN_LR = 22;
TAB_WD_BODY_MARGIN_TB = 22;
TAB_WD_BUTTON_MARGIN_TOP = 16;
VV_TAB_WD_BUTTON_MARGIN_LEFT = 134;
TAB_WD_BUTTON_MARGIN = 3;
TAB_WD_BUTTON_HEIGHT = 35;


BkStackWindow = {
    listWD:null,
    initStack:function () {
        if (this.listWD == null){
            this.listWD = new BkStack();
        }
    },
    pushWindow:function (wd) {
        this.initStack();
        this.listWD.pushItem(wd);
        logMessage("pushWindow length "+this.getLength());
    },
    getTopWindow:function () {
        this.initStack();
        logMessage("getTopWindow length "+this.getLength());
        return this.listWD.getTopIem();
    },
    pop:function () {
        this.initStack();
        logMessage("pop length "+this.getLength());
        return this.listWD.pop();
    },
    isEmpty:function () {
        this.initStack();
        return (this.listWD.getLength() == 0);
    },
    getLength:function () {
        this.initStack();
        return this.listWD.getLength();
    },
    clearStack:function () {
        this.listWD = null;
    }
};

VvWindow = cc.Layer.extend({
        _windowTitle: null,
        _windowSize: null,
        _wdBodyInnerSize: null,
        _bodyLayer: null,
        _bgWindowLayer: null,
        _bodyContentBg: null,
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
        listEditBox:[],
        ctor: function (titleBar, size, parent,isTab,isClean) {
            var screenSize = cc.director.getWinSize();
            //Hack wd size
            this._windowSize = cc.size(size.width,size.height - 17);
            this.setParentWindow(parent);
            addSpriteFrames(res.vv_sprite_sheet_plist,res.vv_sprite_sheet_img);
            if (this._windowSize == null) {
                this._windowSize = cc.size(screenSize.width / 2, screenSize.height / 2);
            }
            this._super();
            logMessage("Call WD : " + titleBar);
            this.init(titleBar,isTab,isClean);
            this.listEditBox = [];
        },
        init: function (titleBar,isTab,isClean) {
            if (isTab == undefined){
                isTab = false;
            }
            this._isMovingWindow = false;
            this.setName("VvWindow");

            // Get the screen size
            this._bodyLayer = new cc.Layer();

            // Add the top
            //var mRect = cc.rect(250,12,250,6);
            //var mRect = cc.rect(0,0,0,0);
            //this._top = new cc.Scale9Sprite(res_name.vv_window_header,mRect);
            //this._top.width = this._windowSize.width;
            this._top = new BkSprite("#"+res_name.vv_window_header);
            this._top.setScaleX(this._windowSize.width/654);// img window_header width = 654
            this._top.x = this._windowSize.width / 2;
            this._top.y = this._windowSize.height - this._top.height / 2;
            this._bodyLayer.addChild(this._top, VV_WD_ZORDER_TOP);

            // Add the title
            this._windowTitle = new BkLabel(titleBar, "Arial", cc.director.getWinSize().height*0.09,true);
            //this._windowTitle = new BkLabel(titleBar, "Arial", 20,true);            
            this._windowTitle.color = BkColor.VV_WINDOW_TITLE_COLOR;
            this._windowTitle.x = this._windowSize.width / 2;
            this._windowTitle.y = this._top.y;
            this._windowTitle.enableShadow(cc.color(13,59,85), cc.p(2, -2));
            this._bodyLayer.addChild(this._windowTitle, VV_WD_ZORDER_TOP);

            this._btnClose = new BkButton(res_name.vv_btn_close,res_name.vv_btn_close,res_name.vv_btn_close,res_name.vv_btn_close_hover,ccui.Widget.PLIST_TEXTURE);
            this._btnClose.scale = 1.5;
            this._btnClose.x = this._windowSize.width - 25;
            this._btnClose.y = this._top.y;
            var self = this;
            this._btnClose.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    logMessage("click btnClose");
                    //cc._canvas.style.cursor = "default";
                    self.removeSelf(isClean);
                    if (this._callbackCloseButtonClick!= null){
                        this._callbackCloseButtonClick();
                    }
                }
            }, this);
            this._bodyLayer.addChild(this._btnClose, VV_WD_ZORDER_TOP);

            // Add the background
            var bodyFrame = cc.spriteFrameCache.getSpriteFrame(res_name.vv_window_body_bg_1);
            this._bgBody = new cc.Scale9Sprite(bodyFrame);
            this._bgBody.width = this._windowSize.width - 4;
            this._bgBody.height = this._windowSize.height - this._top.height;
            this._bgBody.x = this._windowSize.width / 2;
            this._bgBody.y = this._top.y - this._windowSize.height/2 + 6.5;
            this.addChildBody(this._bgBody, VV_WD_ZORDER_BODY);

            this.setDefaultWdBodyBg(isTab);
        },

        setCallbackCloseButtonClick:function(f){
            this._callbackCloseButtonClick = f;
        },
        setCallbackRemoveWindow:function(f){
            this._callbackRemoveWindow = f;
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
            return cc.size(this._windowSize.width, this._windowSize.height - this._top.height);
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
        setDefaultWdBodyBgSprite:function (yPos) {
            if (this._bodyContentBg){
                this._bodyContentBg.removeFromParent();
            }
            this._bodyContentBg = new BkSprite("#"+res_name.vv_window_body_content);//size img 624x435
            var widBody = this._windowSize.width*0.9;
            var heiBody = this._windowSize.height*0.7;
            this._bodyContentBg.setScaleX(widBody/624);
            this._bodyContentBg.setScaleY(heiBody/435);
            if (!yPos){
                yPos = this._bgBody.y - 0.25 * TAB_WD_BUTTON_HEIGHT;//this._windowSize.height/2 - TAB_WD_BUTTON_HEIGHT + 5;
            }
            this._bodyContentBg.x = this._windowSize.width/2;

            this._bodyContentBg.y = yPos;
            this.addChildBody(this._bodyContentBg, -1);
        },
        setDefaultWdBodyBg: function (isTab) {
            var bodyContentFrame = cc.spriteFrameCache.getSpriteFrame(res_name.vv_window_body_content);
            this._bodyContentBg = new cc.Scale9Sprite(bodyContentFrame);

            this._bodyContentBg.x = this._bgBody.x;
            if(isTab){
                var tabWidth = this.getBodySize().width - 2 * VV_WD_BODY_MARGIN_LR;
                var tabHei = this.getBodySize().height - VV_WD_BODY_MARGIN_TB * 2 - TAB_WD_BUTTON_HEIGHT;
                this._bodyContentBg.width = tabWidth;
                this._bodyContentBg.height = tabHei;
                this._bodyContentBg.y = this._bgBody.y - TAB_WD_BUTTON_HEIGHT / 2;
            }
            else{
                this._bodyContentBg.width = this.getBodySize().width - VV_WD_BODY_MARGIN_LR * 2;
                this._bodyContentBg.height = this.getBodySize().height - VV_WD_BODY_MARGIN_TB * 2;
                this._bodyContentBg.y = this._bgBody.y;
            }
            this.addChildBody(this._bodyContentBg, -1);
        },

        setVisibleDefaultWdBodyBg: function (isVisible){
            this._bodyContentBg.setVisible(isVisible);
        },

        setVisibleTop:function(isVisible){
            this._top.visible = isVisible;
        },

        setVisibleBottom:function(isVisible){
            this._bgBottom.visible = isVisible;
        },

        setVisibleBgBody:function(isVisible){
            this._bodyContentBg.visible = isVisible;
        },

        addChildBody:function(child, localZOrder, tag){
        	if(localZOrder != undefined && localZOrder != null && tag != undefined && tag != null)
        	{
            	this._bodyLayer.addChild(child, localZOrder,tag);
        	}else if(localZOrder != undefined && localZOrder != null )
        	{
            	this._bodyLayer.addChild(child, localZOrder);
        	}else 
        	{
            	this._bodyLayer.addChild(child);
        	}
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
                // this._bgWindowLayer.scaleX = screenSize.width / this._windowSize.width;
                // this._bgWindowLayer.scaleY = screenSize.height / this._windowSize.height;
                this._bgWindowLayer = new BkSprite("#" + res_name.Window_bgMask);
                this._bgWindowLayer.setOpacity(210);
                this._bgWindowLayer.x = screenSize.width/2;
                this._bgWindowLayer.y = screenSize.height/2;
                
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
        preprocessBeforeRemoveWindow:function () {
            // remove window khoi stack khi revoveWindow
            logMessage("preprocessBeforeRemoveWindow");
            BkStackWindow.pop();
            this.enableAllEditboxInLastWindow();

            if(this.getParentWindow()){
                logMessage("co parent node -> resume event parent node");
                cc.eventManager.resumeTarget(this.getParentWindow(), true);
            } else {
                this.resumeEventLastWindow();
            }
            this.visible = false;

           // cc._canvas.style.cursor = "default";
            if (this._callbackRemoveWindow!= null){
                logMessage("this._callbackRemoveWindow!= null");
                this._callbackRemoveWindow();
            }
        },
        removeSelf: function (isClean) {
            this.removeFromParent(isClean);
        },
        removeFromParent: function (cleanup) {
            this.preprocessBeforeRemoveWindow();
            this._super(cleanup);
        },

        showWithParent: function (isPauseEvent,tag) {

            logMessage("window showWithParent");
            var scene = getCurrentScene();

            if(scene != undefined) {
                var curShownWD = scene.getChildByTag(WD_TAG.HOT_NEWS);
                if (curShownWD != undefined && curShownWD != null) {
                    curShownWD.removeSelf();
                }
            }
            //this.visible = true;
           // cc._canvas.style.cursor = "default";
            var screenSize = cc.director.getWinSize();
            this._bodyLayer.x = screenSize.width /2 - this._windowSize.width/2;
            this._bodyLayer.y = screenSize.height /2 - this._windowSize.height/2;
            this.addChild(this._bodyLayer, VV_WD_ZORDER_WINDOW);

            if (this._isVisibleOutBG){
                this.addChild(this._bgWindowLayer, -4);
            }
            var isPause = true;
            if (isPauseEvent!= undefined && isPauseEvent != null){
                isPause = isPauseEvent;
            }
            if (isPause){
                if (!this.getParentWindow()){
                    this.pauseEventLastWindow();
                } else {
                    logMessage("co parent node -> pause parent node");
                    cc.eventManager.pauseTarget(this.getParentWindow(), true);
                }
            }

            if(scene != undefined)
            {
                if(tag != undefined && tag != null)
                {
                    scene.addChild(this, TagOfLayer.Popup,tag);
                }else
                {
                    scene.addChild(this, TagOfLayer.Popup);
                }
            }

            this.disableAllEditboxInLastWindow();
            // add window vao stack khi hien thi
            BkStackWindow.pushWindow(this);

        },

        // truongbs++ sua loi enable scene khi show window tu event network
        pauseEventLastWindow:function () {
            logMessage("khong co parent node -> pauseEventLastWindow");
            var lastWD = BkStackWindow.getTopWindow();// chua add crWD vao stack -> topWD la last WD
            if (lastWD == null){
                logMessage("chua show 1 wd nao truoc day -> pause scene");
                Util.pauseEventCurrentScene();
            } else {
                cc.eventManager.pauseTarget(lastWD, true);
            }

        },
        resumeEventLastWindow:function () {
            logMessage("khong co parent node -> resumeEventLastWindow");
            var lastWD = BkStackWindow.getTopWindow(); // da remove crWD khoi stack -> topWD la last WD
            if ( lastWD == null){
                logMessage("hien tai chi show crWD -> resume scene");
                Util.resumeEventCurrentScene();
            } else {
                cc.eventManager.resumeTarget(lastWD, true);
            }
        },
        //truongbs++ sua loi hien thi text box o cao nhat
        addEditbox:function (o) {
            this.listEditBox.push(o);
        },
        disableAllEditboxInLastWindow:function () {
            var lastWD = BkStackWindow.getTopWindow(); // da remove crWD khoi stack -> topWD la last WD

            if (lastWD!= null){
                var iEditBox;
                for (var i=0;i<lastWD.listEditBox.length;i++){
                    iEditBox = lastWD.listEditBox[i];
                    iEditBox.setDisabled(true,true);
                }
            }
        },
        enableAllEditboxInLastWindow:function () {
            var lastWD = BkStackWindow.getTopWindow(); // da remove crWD khoi stack -> topWD la last WD
            if (lastWD!= null){
                var iEditBox;
                for (var i=0;i<lastWD.listEditBox.length;i++){
                    iEditBox = lastWD.listEditBox[i];
                    iEditBox.setDisabled(false,true);
                }
            }
        }
    }
);
