/**
 * Created by hoangthao on 25/09/2015.
 */
BTN_YELLOW_TEXT_SHADOW_POS = cc.p(1, -3);

BkButton = ccui.Button.extend(/** @lends ccui.Button# */{
    //_buttonHoverRenderer: null,
  //  _hoverTextureLoaded: null,
  //  _hoverFileName: null,
  //  _hoverTextureAdaptDirty: true,
    _isSelectted: null,
    lastTimeClick:0,
   // _hoverTexType: ccui.Widget.LOCAL_TEXTURE,
  //  _hoverCb:null,
  //  _outCb:null,
    _titleButtonBMF:null,
    _isNewTitle:false,
   // _textHover:"",
   // _hoverTextSprite:null,
  //  _eventHoverText:null,
    ctor: function (normalImage, selectedImage, disableImage,texType,isNewTitle)
    {
        this._super();
        this._isNewTitle = false;
        if (isNewTitle != undefined){
            this._isNewTitle = isNewTitle;
        }

        if (!this._isNewTitle){
            // this.setTitleFontName(res_name.GAME_FONT_BOLD);
            this.setTitleFontName(res_name.GAME_FONT);
            this.setTitleFontSize(cc.winSize.height*0.035);
            //this.getTitleRenderer().enableStroke(cc.color.BLACK,0.5);
            //this.getTitleRenderer().enableShadow(cc.color(0,1,22), cc.p(1, -1),1,1);
            this.setName("BkButton");
            this.setTitleColor(cc.color(240,240,255));
        }

        this.loadTextures(normalImage, selectedImage,disableImage,texType);
        //this._initMouseHover();
        if (this._isNewTitle){
            this._initTitleBMF();
        }
    },
    setBlinking:function(isBlinking,blinkingImg,index)
    {
        if(isBlinking)
        {
            if(this.blinkingImage == null)
            {
                this.blinkingImage = new BkSprite("#" + blinkingImg);
                this.blinkingImage.x = this.blinkingImage.width/2;
                this.blinkingImage.y = this.blinkingImage.height/2;
                if(index != undefined)
                {
                    this.addChild(this.blinkingImage,index);
                }else
                {
                    this.addChild(this.blinkingImage,-1);
                }
                var action = cc.fadeOut(1.0);
                var actionBack =  action.reverse();
                var delay = cc.delayTime(0.25);
                var rep = cc.sequence(action, delay, actionBack).repeatForever();
                this.blinkingImage.runAction(rep);
            }
        }else
        {
            if(this.blinkingImage != null)
            {
                this.blinkingImage.stopAllActions();
                this.blinkingImage.removeFromParent();
                this.blinkingImage = null;
            }
        }
    },
    setOpacity:function(opacity){
        this._super(opacity);
        if (this._isNewTitle){
            if (this._titleButtonBMF != null){
                this._titleButtonBMF.setOpacity(opacity);
            }
        }
    },
    _initTitleBMF:function(){
        this._titleButtonBMF = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_BUTTON);
        this._titleButtonBMF.x = this._buttonNormalRenderer.width/2 + 0.5;
        this._titleButtonBMF.y = this._buttonNormalRenderer.height/2 + 0.5;
        this.addChild(this._titleButtonBMF,100);
    },
    setTitleText: function (text){
        if (this._isNewTitle){
            this._titleButtonBMF.setString(text,true);
        } else {
            this._super(text);
        }
    },
    setTitleFontSize: function (size) 
    {
//        if (this._isNewTitle){
//            if (size!= 18){
//                var sc = size/18;
//                this._titleButtonBMF.setScale(sc);
//            }
//        } else {
            this._super(size*2);
           // this.getTitleRenderer().setScale(0.5);
           // if(size > 14){
              //  this.getTitleRenderer().disableStroke();
           // }
         //   this.getTitleRenderer().disableStroke();
       // }

    },
    // removeHoverSprite:function () {
    //     if (this._hoverTextSprite != null){
    //         this._hoverTextSprite.removeFromParent();
    //         this._hoverTextSprite = null;
    //     }
    // },
    // _initBGHoverText:function () {
    //     this.removeHoverSprite();
    //     this._hoverTextSprite = new BkSprite("#"+res_name.icon_hover_text);
    //     this._hoverTextSprite.x = this._buttonNormalRenderer.width/2;
    //     this._hoverTextSprite.y = -this._buttonNormalRenderer.height/2;
    //     this.addChild(this._hoverTextSprite);
    //     var lbText = new BkLabel(this._textHover,"",11);
    //     lbText.setTextColor(cc.color(0x3F,0x2A,0x22));
    //     lbText.x = this._hoverTextSprite.getContentSize().width/2;
    //     lbText.y = this._hoverTextSprite.getContentSize().height/2 - 2;
    //     this._hoverTextSprite.addChild(lbText);
    //     this._hoverTextSprite.visible = false;
    // },
    // _initHoverTextEvent:function () {
    //     if (this._eventHoverText!= null){
    //         return;
    //     }
    //     var self = this;
    //     this._eventHoverText = this.createHoverEvent(function(event){
    //         if (self._hoverTextSprite != null){
    //             var lastWD = BkStackWindow.getTopWindow();
    //             if (lastWD == null){
    //                 self._hoverTextSprite.visible = true;
    //             } else {
    //                 cc._canvas.style.cursor = "default";
    //                 self._hoverTextSprite.visible = false;
    //             }
    //         }
    //     },function(event){
    //         if (self._hoverTextSprite != null){
    //             self._hoverTextSprite.visible = false;
    //         }
    //     },function(event){
    //         if (self._hoverTextSprite != null){
    //             self._hoverTextSprite.visible = false;
    //         }
    //     });
    //     cc.eventManager.addListener(this._eventHoverText, this._buttonNormalRenderer);
    //     //cc.eventManager.addListener(this._eventHoverText, this);
    // },
//    setStringHover:function (txt) {
//        this._textHover = txt;
//        if (txt){
//            if (txt.length>0){
//                this._initHoverTextEvent();
//                this._initBGHoverText();
//                return;
//            }
//        }
//        this.removeHoverSprite();
//    },
//    removeMouseHover:function () {
//        cc.eventManager.removeListener(this._eventHover);
//    },
//    _initMouseHover: function(){
//        var self = this;
//        this._eventHover = this.createHoverEvent(function(event){
//           // self._buttonHoverRenderer.setVisible(true);
//            self._buttonNormalRenderer.setVisible(false);
//            // if (self._hoverTextSprite != null){
//            //     self._hoverTextSprite.visible = true;
//            // }
//            if (self._hoverCb!= null){
//                self._hoverCb();
//            }
//        },function(event){
//          //  self._buttonHoverRenderer.setVisible(false);
//            self._buttonNormalRenderer.setVisible(true);
//            // if (self._hoverTextSprite != null){
//            //     self._hoverTextSprite.visible = false;
//            // }
//            if (self._outCb!= null){
//                self._outCb();
//            }
//        },function(event){
//           // self._buttonHoverRenderer.setVisible(false);
//            self._buttonNormalRenderer.setVisible(true);
//        });
//        cc.eventManager.addListener(this._eventHover, this);
//    },
//     setHoverCallback:function(hCB,oCB){
//         this._hoverCb = hCB;
//         this._outCb = oCB;
//     },
    /**
     * Load textures for button with hover.
     * @param {String} normal normal state of texture's filename.
     * @param {String} selected  selected state of texture's filename.
     * @param {String} disabled  disabled state of texture's filename.
     * @param {String} hover  hover state of texture's filename.
     */
    loadTextures: function (normal, selected, disabled,texType) {
        this._super(normal, selected, disabled,texType);
        //this._super(normal, hover, disabled,texType);
        //this.loadTextureHover(hover,texType);
    },
    /**
     * Call from super
     */
  //  _initRenderer: function () {
  //      this._super();

       // this._buttonHoverRenderer = new cc.Sprite();
       // this._buttonHoverRenderer.setVisible(false);
      //  this.addProtectedChild(this._buttonHoverRenderer, ccui.Button.NORMAL_RENDERER_ZORDER, -1);
    //},
    // _adaptRenderers: function(){
    //     this._super();
    //     if (this._hoverTextureAdaptDirty) {
    //         this._hoverTextureScaleChangedWithSize();
    //         this._hoverTextureAdaptDirty = false;
    //     }
    // },
    // _onSizeChanged: function () {
    //     this._super();
    //    // this._hoverTextureAdaptDirty = true;
    // },
    // _hoverTextureScaleChangedWithSize: function () {
    //     if(this._ignoreSize && !this._unifySize) {
    //      //   this._buttonHoverRenderer.setScale(1);
    //     }
    //   //  this._buttonHoverRenderer.setPosition(this._contentSize.width / 2, this._contentSize.height / 2);
    // },
//    loadTextureHover: function (hover,texType) 
//    {
//        if (!hover)
//            return;
//        this._hoverFileName = hover;
//
//        texType = texType || ccui.Widget.LOCAL_TEXTURE;
//        this._hoverTexType = texType;
//
//        var self = this;
//       // var renderer = this._buttonHoverRenderer;
////        if(!renderer._textureLoaded){
////            renderer.addEventListener("load", function(){
////                self.loadTextureHover(self._hoverFileName);
////            });
////        }
//
//        switch (this._hoverTexType) {
//            case ccui.Widget.LOCAL_TEXTURE:
//                //SetTexture cannot load resource
//                //renderer.initWithFile(hover);
//                break;
//            case ccui.Widget.PLIST_TEXTURE:
//                //SetTexture cannot load resource
//                renderer.initWithSpriteFrameName(hover);
//                break;
//            default:
//                break;
//        }
//
//        this._hoverTextureLoaded = renderer._textureLoaded;
//
//        this._hoverTextureSize = this._buttonNormalRenderer.getContentSize();
//        this._updateChildrenDisplayedRGBA();
//
//        this._updateContentSizeWithTextureSize(this._hoverTextureSize);
//
//        this._hoverTextureAdaptDirty = true;
//        this._findLayout();
//    },

    // setMouseOnHover:function(callbackOver,callbackOut){
    //     this.OnMouseMoveListener = this.createHoverEvent(callbackOver,callbackOut);
    //     cc.eventManager.addListener(this.OnMouseMoveListener, this);
    // },
    SetEnable:function(isEnable){
        this.setEnableButton(isEnable);
    },
    setEnableButton:function(isEnable){
        this.setBright(isEnable);
        this.setTouchEnabled(isEnable);
        //this.setEnableEventButton(isEnable);
    },
    // setEnableEventButton:function(isEnable){
    //     if (isEnable){
    //         this._eventHover.setEnabled(true);
    //     } else{
    //        // cc._canvas.style.cursor = "default";
    //         this._eventHover.setEnabled(false);
    //        // this._buttonHoverRenderer.setVisible(false);
    //     }
    // },
    setVisibleButton:function(isvisible)
    {
        this.setEnableButton(isvisible);
        this.visible = isvisible;
    },
    setIsSelected:function(isS){
        this._isSelectted = isS;
        if (this.getTitleText() != null){
            if (this._isSelectted){
                this.setTitleColor(cc.color(255, 255, 255));
            } else {
                this.setTitleColor(cc.color(18,237,240));
            }
        }
    },
    isSelected:function () {
        return this._isSelectted;
    },
    setScaleImage:function (sc) {
        var self = this;
//        if (self._buttonHoverRenderer){
//            self._buttonHoverRenderer.setScale(sc);
//        }
        if (self._buttonNormalRenderer){
            self._buttonNormalRenderer.setScale(sc);
        }
        if (self._buttonClickedRenderer){
            self._buttonClickedRenderer.setScale(sc);
        }
        if (self._buttonDisableRenderer){
            self._buttonDisableRenderer.setScale(sc);
        }

    },
    addClickButton: function (callback) {
        var clickEvent = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height);
                if (cc.rectContainsPoint(rect, location)) {
                    if ((callback != null) && (callback != undefined)) {
                        callback(event.getCurrentTarget());
                        return true;
                    }
                    return false;
                }
            }
        }, this);
        cc.eventManager.addListener(clickEvent, this);
    },
});

// BkButton.create = function (normalImage, selectedImage, disableImage) {
//     return new BkButton(normalImage, selectedImage, disableImage);
// };
