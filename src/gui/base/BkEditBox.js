/**
 * Created by bs on 03/10/2015.
 */

var MAX_NUMBER_COUNT = 10;

BkEditBox  =cc.EditBox.extend({
    isAutofocus:false,
    countFrame:0,
    ctor: function (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
        cc.ControlButton.prototype.ctor.call(this);
        var textBoxHeight = cc.winSize.height/10;
        this._textColor = cc.color.WHITE;
        this._placeholderColor = BkColor.TEXT_INPUT_PLACEHOLDER_COLOR;
        this.setContentSize(size);
//        var tmpDOMSprite = this._domInputSprite = new cc.Sprite();
//        tmpDOMSprite.draw = function () {};  //redefine draw function
//        this.addChild(tmpDOMSprite);

       // 
        var tmpEdTxt =  this._edTxt =  cc.EditBox(cc.size(cc.winSize.height*0.3, cc.winSize.height*0.1), new cc.Scale9Sprite(res_name.texbox_login));
        tmpEdTxt.setString("nguyenvinh1612");
        tmpEdTxt.type = "text";
        tmpEdTxt.x = size.width/2;
        tmpEdTxt.y = size.height / 2 + textBoxHeight * 1.3;
        this.addChild(tmpEdTxt);
      //  
        
        //var tmpEdTxt = this._edTxt = document.createElement("input");
        tmpEdTxt.type = "text";
//        tmpEdTxt.style.fontSize = this._edFontSize + "px";
//        tmpEdTxt.style.color = "#000000";
//        tmpEdTxt.style.border = 0;
//        tmpEdTxt.style.background = "transparent";
        tmpEdTxt.placeholder = "";
        //tmpEdTxt.setAttribute("spellcheck", "false");
        //tmpEdTxt.style.paddingLeft = "2px";
//        tmpEdTxt.style.width = "100%";
//        tmpEdTxt.style.height = "100%";
//        tmpEdTxt.style.active = 0;
//        tmpEdTxt.style.outline = "medium";
//        tmpEdTxt.style.padding = "0";
        var onCanvasClick = function() { this._edTxt.blur();};
        this._onCanvasClick = onCanvasClick.bind(this);

        var inputEvent = function () {
            if (this._delegate && this._delegate.editBoxTextChanged)
                this._delegate.editBoxTextChanged(this, this._edTxt.value);
        };
        this._inputEvent = inputEvent.bind(this);
        var keypressEvent = function ( e ) {
            if (e.keyCode === cc.KEY.enter) {
                e.stopPropagation();
                e.preventDefault();
                if (this._delegate && this._delegate.editBoxReturn)
                    this._delegate.editBoxReturn(this);
                cc._canvas.focus();
            }
        };
        this._keyPressEvent = keypressEvent.bind(this);
        var focusEvent = function () {
            if (this._edTxt.value === this._placeholderText) {
                this._edTxt.value = "";
                //this._edTxt.style.fontSize = this._edFontSize + "px";
                //this._edTxt.style.color = cc.colorToHex(this._textColor);
                if (this._editBoxInputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD)
                    this._edTxt.type = "password";
                else
                    this._edTxt.type = "text";
            }
            if (this._delegate && this._delegate.editBoxEditingDidBegin)
                this._delegate.editBoxEditingDidBegin(this);
            cc._canvas.addEventListener("click", this._onCanvasClick);
        };
        this._focusEvent = focusEvent.bind(this);
        var blurEvent = function () {
            if (this._edTxt.value === "") {
                this._edTxt.value = this._placeholderText;
              //  this._edTxt.style.fontSize = this._placeholderFontSize + "px";
              //  this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._edTxt.type = "text";
            }
            if (this._delegate && this._delegate.editBoxEditingDidEnd)
                this._delegate.editBoxEditingDidEnd(this);
            cc._canvas.removeEventListener('click', this._onCanvasClick);
        };
        this._blurEvent = blurEvent.bind(this);

//        tmpEdTxt.addEventListener("input", this._inputEvent);
//        tmpEdTxt.addEventListener("keypress", this._keyPressEvent);
//        tmpEdTxt.addEventListener("focus", this._focusEvent);
//        tmpEdTxt.addEventListener("blur", this._blurEvent);

       // cc.DOM.convert(tmpDOMSprite);
        //tmpDOMSprite.dom.appendChild(tmpEdTxt);

       // tmpDOMSprite.dom.showTooltipDiv = false;
        //tmpDOMSprite.dom.style.width = (size.width - 6) + "px";
        //tmpDOMSprite.dom.style.height = (size.height - 6) + "px";

       // tmpDOMSprite.canvas.remove();

        if (this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg)) {
            if (press9SpriteBg)
                this.setBackgroundSpriteForState(press9SpriteBg, cc.CONTROL_STATE_HIGHLIGHTED);
            if (disabled9SpriteBg)
                this.setBackgroundSpriteForState(disabled9SpriteBg, cc.CONTROL_STATE_DISABLED);
        }

        this.isAutofocus = false;
        this.countFrame = 0;
    },
    setPlaceHolder: function (text) {
        this._edTxt.placeholder = text;
    },
    setFontSize: function (fontSize){
        this._super(fontSize);
        this.setPlaceholderFontSize(fontSize);
    },
    setPlaceholderFontColor:function(color){
        var cssClasName = " dfInvalid";
         if (color == BkColor.TEXT_INPUT_PLACEHOLDER_LOGIN) {
             cssClasName = " loginInvalid";
         } else if (color == BkColor.TEXT_INPUT_PLACEHOLDER_NOBG_COLOR){
             cssClasName = " noBGInvalid";
         } else if (color == BkColor.TEXT_INPUT_PLACEHOLDER_COLOR){
             cssClasName = " normalText";
         }
        this._edTxt.className += cssClasName;
    },

    setAutoFocus:function(isAF){
        logMessage("setAutoFocus BkEditBox");
        this.isAutofocus = isAF;
        if (this.isAutofocus){
            this.countFrame = 0;
            this.scheduleUpdate();
        }
    },

    setTabStopToPrevious: function(){
        if (this._edTxt.addEventListener) {
            this._edTxt.addEventListener('keydown', stopTabToPrevious, false);
        } else if (this._edTxt.attachEvent) {
            this._edTxt.attachEvent('onkeydown', stopTabToPrevious);
        }
    },
    setTabStopToNext: function(){
        if (this._edTxt.addEventListener) {
            this._edTxt.addEventListener('keydown', stopTabToNext, false);
        } else if (this._edTxt.attachEvent) {
            this._edTxt.attachEvent('onkeydown', stopTabToNext);
        }
    },
    setTabStop: function(){
        if (this._edTxt.addEventListener) {
            this._edTxt.addEventListener('keydown', stopTab, false);
        } else if (this._edTxt.attachEvent) {
            this._edTxt.attachEvent('onkeydown', stopTab);
        }
    },

    update:function() {
        if (this.countFrame<= MAX_NUMBER_COUNT){
            this.countFrame++;
            if (this.countFrame >MAX_NUMBER_COUNT){
                this.unscheduleUpdate();
                this.setFocus();
            }
        }
    },
    setFocus: function () {
        logMessage("setFocus tf");
        this._edTxt.focus();
    },
    setDisabled: function (value,isStoreString) {
        if (isStoreString){
            if (value){
                logMessage("clear text");
                this.storeString = this.getString();
                this.setString("");
            } else {
                if (this.storeString){
                    this.setString(this.storeString);
                }
            }
        }

        this._edTxt.disabled = value;
    },

    /* @property {String}   style     - <@writeonly> Config border style of edit box
     * example: txt.setStyle("padding-left: 3px; border: 1px solid #fbb040"); */
    setStylePaddingLeft: function(style){
        if (style != null) {
            this._edTxt.style.paddingLeft = style;
        }
    },
    setStylePaddingBottom: function(style){
        if (style != null) {
            this._edTxt.style.paddingBottom = style;
        }
    },

    /* @property {String}   style     - <@writeonly> Config border style of edit box
     * example: txt.setBorder("1px solid #fbb040"); */
    setBorder: function (style) {
        if (style != null) {
            this._edTxt.style.border = style;
        }
    },
    /* @property {String}   style     - <@writeonly> Config border style of edit box
     * example: txt.setBackground("#fbb040"); */
    setBackground: function (style) {
        if (style != null) {
            this._edTxt.style.backgroundColor = style;
        }
    },
    /* @property {String}   strValue     - <@writeonly> Config padding-left style of edit box
     * example: txt.setPaddingLeft("5px"); */
    setPaddingLeft: function (strValue){
        if( strValue != null){
            this._edTxt.style.paddingLeft = strValue;
        }
    },
    setPaddingRight: function (strValue){
        if(this._edTxt && strValue != null){
            this._edTxt.style.paddingLeft = strValue;
        }
    },
    setTextAlignRight: function (){
        if(this._edTxt){
            this._edTxt.style.textAlign  = "right";
        }
    },
    /* @property {String}   style     - <@writeonly> Config height style of edit box
     * example: txt.setHeight("22px"); */
    setHeight: function (strValue){
        if( strValue != null){
            this._edTxt.style.height = strValue;
        }
    },

    setNumericMode: function (){
        this.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this._edTxt.onkeypress  = function(eparam){
            var event = eparam || window.event;
            var key = event.which || event.charCode || event.keyCode || 0;
            if (key == 8 || key == 46 || key == 37 || key == 39) {
                return true;
            } else if (key < 48 || key > 57) {
                return false;
            }
            return true;
        }
    }
});