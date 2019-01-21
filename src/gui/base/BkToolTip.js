/**
 * Created by bs on 14/10/2015.
 */
BkToolTip = BkSprite.extend({
    fontSize:16,
    background:null,
    textLabel:null,
    cbRemove:null,
    _clickSceneEvent:null,
    ctor:function(bgImage){
        this._super();
        //this.background = new BkSprite(bgImage);
        this.background = new cc.Scale9Sprite(bgImage);
        this.addChild(this.background);
        this.textLabel = new BkLabelTTF("", "", this.fontSize, cc.size (180*2, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.textLabel.setFontSize(this.fontSize);
        //this.textLabel = new BkLabelTTF("", "", this.fontSize, cc.size (150, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.addChild(this.textLabel);
    },
    setTextColor:function(color){
        this.textLabel.setFontFillColor(color);
    },
    setContentText:function(txt){
        this.textLabel.setString(txt);
        var deltaX = 20, deltaY = 10;
        if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
            deltaX = 20;
            deltaY = 10;
        }
        var txtWid = this.textLabel.getContentSize().width + deltaX;
        var txtHei = this.textLabel.getContentSize().height + deltaY;
        //this.textLabel.boundingWidth = txtWid;
        //this.background.setScale(txtWid/this.background.getContentSize().width,txtHei/this.background.getContentSize().height);
        if (txtHei< 35){
            txtHei = 35;
        }
        if (txtWid< 45){
            txtWid = 45;
        }
        this.background.width = txtWid;
        this.background.height = txtHei;
    },
    show:function(xPos,yPos){
        if (cc.director.getRunningScene()){
            var currentScene = cc.director.getRunningScene();
            if (xPos != undefined){
                this.x = xPos;
            }
            if (yPos != undefined){
                this.y = yPos;
            }
            currentScene.addChild(this,TagOfLayer.Toast);
            var self = this;
            this._clickSceneEvent = currentScene.createTouchEvent(undefined,undefined,function(){
                logMessage("click scene");
                self.removeSelf();
            });

            cc.eventManager.addListener(this._clickSceneEvent, currentScene);
        }
    },
    removeSelf:function(){
        this.removeFromParent();
        if (this._clickSceneEvent != null){
            cc.eventManager.removeListener(this._clickSceneEvent);
        }
        if (this.cbRemove != null){
            this.cbRemove();
        }
    },
    setRemoveCallback:function(f){
        this.cbRemove = f;
    },
    setAutoHideAfter:function(xSec){
        this.scheduleOnce(this.finishAutoHide,xSec);
    },
    finishAutoHide:function(){
        this.unschedule(this.finishAutoHide);
        this.removeSelf();
    },
    setWidthToolTip:function(mWid){
        //TODO: fix FW file CCLabelTTFCanvasRenderCmd.js
        mWid = mWid * 2;
        this.textLabel.setContentSize(cc.size(mWid,0));
        this.textLabel.setDimensions(cc.size(mWid,0));
    }
});

