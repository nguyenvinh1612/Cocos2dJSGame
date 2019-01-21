/**
 * Created by VanChinh on 12/10/2015.
 */

/**
 * <p>BkTextArea is a multi-line TextBox.</p>
 * let use util function createTextArea(size,img9PatchBG) to create a BkTextArea
 * @class
 * @extends cc.ControlButton
 *
 * @property {String}   string                  - Content string of textarea
 * @property {String}   maxLength               - Max length of the content string
 * @property {String}   font                    - <@writeonly> Config font of textarea
 * @property {String}   fontName                - <@writeonly> Config font name of textarea
 * @property {Number}   rows                    - <@writeonly> Config rows size of textarea
 * @property {Number}   cols                    - <@writeonly> Config font size of textarea
 * @property {Number}   fontSize                - <@writeonly> Config font size of textarea
 * @property {cc.Color} fontColor               - <@writeonly> Config font color of textarea
 * @property {String}   placeHolder             - Place holder of textarea
 * @property {String}   placeHolderFont         - <@writeonly> Config font of place holder
 * @property {String}   placeHolderFontName     - <@writeonly> Config font name of place holder
 * @property {Number}   placeHolderFontSize     - <@writeonly> Config font size of place holder
 * @property {cc.Color} placeHolderFontColor    - <@writeonly> Config font color of place holder
 * @property {Number}   returnType              - <@writeonly> Return type of textarea, value should be one of the KeyboardReturnType constants.
 *
 */
BkTextArea = cc.ControlButton.extend({
    _domInputSprite: null,

    _delegate: null,
    _keyboardReturnType: cc.KEYBOARD_RETURNTYPE_DEFAULT,

    _rows: 3,
    _cols: 28,

    _text: "",
    _placeholderText: "",
    _textColor: null,
    _placeholderColor: null,
    _maxLength: 50,
    _adjustHeight: 18,

    _edTxt: null,
    _edFontSize: 16,
    _edFontName: "Arial",

    _placeholderFontName: "",
    _placeholderFontSize: 16,

    _tooltip: false,
    _className: "BkTextArea",


    _inputEvent : null,
    _keyPressEvent : null,
    _focusEvent : null,
    _blurEvent : null,
    /**
     * constructor of cc.EditBox
     * @param {cc.Size} size
     * @param {cc.Scale9Sprite} normal9SpriteBg
     * @param {cc.Scale9Sprite} press9SpriteBg
     * @param {cc.Scale9Sprite} disabled9SpriteBg
     */
    ctor: function (size, normal9SpriteBg, press9SpriteBg, disabled9SpriteBg) {
        cc.ControlButton.prototype.ctor.call(this);

        this._textColor = cc.color.WHITE;
        this._placeholderColor = BkColor.TEXT_INPUT_PLACEHOLDER_COLOR;
        this.setContentSize(size);
        var tmpDOMSprite = this._domInputSprite = new cc.Sprite();
        tmpDOMSprite.draw = function () {};  //redefine draw function
        this.addChild(tmpDOMSprite);
        var selfPointer = this;
        var tmpEdTxt = this._edTxt = document.createElement("textarea");
        tmpEdTxt.setAttribute("rows", this._rows);
        tmpEdTxt.setAttribute("cols", this._cols);
        tmpEdTxt.setAttribute("spellcheck", "false");
        tmpEdTxt.style.resize = "none";
        tmpEdTxt.style.fontSize = this._edFontSize + "px";
        tmpEdTxt.style.color = "#000000";
        tmpEdTxt.style.border = 0;
        tmpEdTxt.style.background = "transparent";
        tmpEdTxt.style.paddingLeft = "2px";
        tmpEdTxt.style.width = "100%";
        tmpEdTxt.style.height = "100%";
        tmpEdTxt.style.active = 0;
        tmpEdTxt.style.outline = "medium";
        tmpEdTxt.style.padding = "0";
        tmpEdTxt.style.overflow = "hidden";
        var onCanvasClick = function() {
            tmpEdTxt.blur();
        };
        this._onCanvasClick = onCanvasClick.bind(this);
        var inputEvent = function () {
            if (this._delegate && this._delegate.editBoxTextChanged)
                this._delegate.editBoxTextChanged(this, this._edTxt.value);
        };
        this._inputEvent = inputEvent.bind(this);
        var keypressEvent = function ( e ) {
            if (e.keyCode === cc.KEY.enter) {
/*                e.stopPropagation();
                e.preventDefault();
                if (this._delegate && this._delegate.editBoxReturn)
                    this._delegate.editBoxReturn(this);
                cc._canvas.focus();*/
            }
        };
        this._keyPressEvent = keypressEvent.bind(this);
        var focusEvent = function () {
            if (this._edTxt.value === this._placeholderText) {
                this._edTxt.value = "";
                this._edTxt.style.fontSize = this._edFontSize + "px";
                this._edTxt.style.color = cc.colorToHex(this._textColor);
                if (this._editBoxInputFlag === cc.EDITBOX_INPUT_FLAG_PASSWORD)
                    this._edTxt.type = "password";
                else
                    this._edTxt.type = "text";
            }
            /*if (this._delegate && this._delegate.editBoxEditingDidBegin)
             this._delegate.editBoxEditingDidBegin(this);*/
            cc._canvas.addEventListener("click", this._onCanvasClick);
        };
        this._focusEvent = focusEvent.bind(this);
        var blurEvent = function () {
            if (this._edTxt.value === "") {
                this._edTxt.value = this._placeholderText;
                this._edTxt.style.fontSize = this._placeholderFontSize + "px";
                this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._edTxt.type = "text";
            }
            /*if (this._delegate && this._delegate.editBoxEditingDidEnd)
             this._delegate.editBoxEditingDidEnd(this);*/
            cc._canvas.removeEventListener('click', this._onCanvasClick);
        };
        this._blurEvent = blurEvent.bind(this);

        tmpEdTxt.addEventListener("input", this._inputEvent);
        tmpEdTxt.addEventListener("keypress", this._keyPressEvent);
        tmpEdTxt.addEventListener("focus", this._focusEvent);
        tmpEdTxt.addEventListener("blur", this._blurEvent);

        cc.DOM.convert(tmpDOMSprite);
        tmpDOMSprite.dom.appendChild(tmpEdTxt);
        tmpDOMSprite.dom.showTooltipDiv = false;
        tmpDOMSprite.dom.style.width = (size.width - 6) + "px";
        tmpDOMSprite.dom.style.height = (size.height - 6) + "px";

        //this._domInputSprite.dom.style.borderWidth = "1px";
        //this._domInputSprite.dom.style.borderStyle = "solid";
        //this._domInputSprite.dom.style.borderRadius = "8px";
        tmpDOMSprite.canvas.remove();

        if (this.initWithSizeAndBackgroundSprite(size, normal9SpriteBg)) {
            if (press9SpriteBg)
                this.setBackgroundSpriteForState(press9SpriteBg, cc.CONTROL_STATE_HIGHLIGHTED);
            if (disabled9SpriteBg)
                this.setBackgroundSpriteForState(disabled9SpriteBg, cc.CONTROL_STATE_DISABLED);
        }
        this.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_NOBG_COLOR);
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

    setEnableScroll: function (){
        this._edTxt.style.overflowX = "hidden";
        this._edTxt.style.overflowY = "auto";
    },

    setScrollToEnd: function () {
        if(this._edTxt.selectionStart == this._edTxt.selectionEnd) {
            this._edTxt.scrollTop = this._edTxt.scrollHeight-8;
        }
        cc._canvas.focus();
    },

    setDisabled: function (disabled,isStoreString) {
        if (isStoreString){
            if (disabled){
                logMessage("clear text");
                this.storeString = this.getString();
                this.setString("");
            } else {
                if (this.storeString){
                    this.setString(this.storeString);
                }
            }
        }
        if (disabled != null) {
            this._edTxt.disabled = disabled;
        }
    },

    setPadding: function (value) {
        this._edTxt.style.padding =  value;
    },

    /**
     * Set textarea size.
     * @param {Number} rows  The rows of textarea
     * @param {Number} cols  The cols of textarea.
     */
    setTextAreaSize: function (rows, cols) {
        if(rows) this._rows = rows;
        if(cols) this._cols = cols;
        this._setTextAreaSize();
    },

    _setTextAreaSize: function () {
        if (this._edTxt) {
            this._edTxt.setAttribute("rows", this._rows);
            this._edTxt.setAttribute("cols", this._cols);
        }
    },

    /**
     * Set the font.
     * @param {String} fontName  The font name.
     * @param {Number} fontSize  The font size.
     */
    setFont: function (fontName, fontSize) {
        this._edFontSize = fontSize;
        this._edFontName = fontName;
        this._setFontToEditBox();
    },

    _setFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._edFontSize = parseInt(res[1]);
            this._edFontName = res[2];
            this._setFontToEditBox();
        }
    },

    /**
     * set fontName
     * @param {String} fontName
     */
    setFontName: function (fontName) {
        this._edFontName = fontName;
        this._setFontToEditBox();
    },

    /**
     * set fontSize
     * @param {Number} fontSize
     */
    setFontSize: function (fontSize) {
        this._edFontSize = fontSize;
        this._setFontToEditBox();
    },

    _setFontToEditBox: function () {
        if (this._edTxt.value !== this._placeholderText) {
            this._edTxt.style.fontFamily = this._edFontName;
        }
        this._edTxt.style.fontSize = this._edFontSize + "px";
    },

    /**
     *  Set the text entered in the textarea.
     * @deprecated
     * @param {string} text The given text.
     */
    setText: function (text) {
        cc.log("Please use the setString");
        this.setString(text);
    },

    /**
     *  Set the text entered in the textarea.
     * @param {string} text The given text.
     */
    setString: function (text) {
        if (text != null) {
            if (text === "") {
                this._edTxt.value = this._placeholderText;
                this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._edTxt.type = "text";
            } else {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.colorToHex(this._textColor);
            }
        }
    },

    /**
     * Set the font color of the widget's text.
     * @param {cc.Color} color
     */
    setFontColor: function (color) {
        this._textColor = color;
        this._edTxt.style.color = cc.colorToHex(color);
    },

    /**
     * <p>
     * Sets the maximum input length of the textarea.
     * </p>
     * @param {Number} maxLength The maximum length.
     */
    setMaxLength: function (maxLength) {
        if (!isNaN(maxLength) && maxLength > 0) {
            this._maxLength = maxLength;
            this._edTxt.maxLength = maxLength;
        }
    },

    /**
     * Gets the maximum input length of the textarea.
     * @return {Number} Maximum input length.
     */
    getMaxLength: function () {
        return this._maxLength;
    },

    /**
     * Set a text in the textarea that acts as a placeholder when an textarea is empty.
     * @param {string} text The given text.
     */
    setPlaceHolder: function (text) {
        if (text != null) {
            var oldPlaceholderText = this._placeholderText;
            this._placeholderText = text;
            if (this._edTxt.value === oldPlaceholderText) {
                this._edTxt.value = text;
                this._edTxt.style.color = cc.colorToHex(this._placeholderColor);
                this._setPlaceholderFontToEditText();
            }
        }
    },

    /**
     * Set the placeholder's font.
     * @param {String} fontName
     * @param {Number} fontSize
     */
    setPlaceholderFont: function (fontName, fontSize) {
        this._placeholderFontName = fontName;
        this._placeholderFontSize = fontSize;
        this._setPlaceholderFontToEditText();
    },
    _setPlaceholderFont: function (fontStyle) {
        var res = cc.LabelTTF._fontStyleRE.exec(fontStyle);
        if (res) {
            this._placeholderFontName = res[2];
            this._placeholderFontSize = parseInt(res[1]);
            this._setPlaceholderFontToEditText();
        }
    },

    /**
     * Set the placeholder's fontName.
     * @param {String} fontName
     */
    setPlaceholderFontName: function (fontName) {
        this._placeholderFontName = fontName;
        this._setPlaceholderFontToEditText();
    },

    /**
     * Set the placeholder's fontSize.
     * @param {Number} fontSize
     */
    setPlaceholderFontSize: function (fontSize) {
        this._placeholderFontSize = fontSize;
        this._setPlaceholderFontToEditText();
    },

    _setPlaceholderFontToEditText: function () {
        if (this._edTxt.value === this._placeholderText) {
            this._edTxt.style.fontFamily = this._placeholderFontName;
            this._edTxt.style.fontSize = this._placeholderFontSize + "px";
            this._edTxt.type = "text";
        }
    },

    /**
     * Set the font color of the placeholder text when the textarea is empty.
     * @param {cc.Color} color
     */
    setPlaceholderFontColor: function (color) {
        this._placeholderColor = color;
        this._edTxt.style.color = cc.colorToHex(color);
    },

    /**
     * Gets the  input string of the textarea.
     * @deprecated
     * @return {string}
     */
    getText: function () {
        return this._edTxt.value;
    },

    /**
     * Gets the  input string of the textarea.
     * @return {string}
     */
    getString: function () {
        if(this._edTxt.value === this._placeholderText)
            return "";
        return this._edTxt.value;
    },

    /**
     * Init textarea with specified size.
     * @param {cc.Size} size
     * @param {cc.Color | cc.Scale9Sprite} normal9SpriteBg
     */
    initWithSizeAndBackgroundSprite: function (size, normal9SpriteBg) {
        if (this.initWithBackgroundSprite(normal9SpriteBg)) {
            this._domInputSprite.x = 3;
            this._domInputSprite.y = 3;

            this.setZoomOnTouchDown(false);
            this.setPreferredSize(size);
            this.x = 0;
            this.y = 0;
            this._addTargetWithActionForControlEvent(this, this.touchDownAction, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
            return true;
        }
        return false;
    },

    /* override functions */
    /**
     * Set the delegate for textarea.
     * @param {cc.EditBoxDelegate} delegate
     */
    setDelegate: function (delegate) {
        this._delegate = delegate;
    },

    /**
     * Get a text in the textarea that acts as a placeholder when an
     * textarea is empty.
     * @return {String}
     */
    getPlaceHolder: function () {
        return this._placeholderText;
    },

    /**
     * Set the return type that are to be applied to the textarea.
     * @param {Number} returnType One of the CCKeyboardReturnType constants.
     */
    setReturnType: function (returnType) {
        this._keyboardReturnType = returnType;
    },

    keyboardWillShow: function (info) {
        var rectTracked = cc.EditBox.getRect(this);
        // some adjustment for margin between the keyboard and the textarea.
        rectTracked.y -= 4;
        // if the keyboard area doesn't intersect with the tracking node area, nothing needs to be done.
        if (!rectTracked.intersectsRect(info.end)) {
            cc.log("needn't to adjust view layout.");
            return;
        }

        // assume keyboard at the bottom of screen, calculate the vertical adjustment.
        this._adjustHeight = info.end.getMaxY() - rectTracked.getMinY();
        // CCLOG("CCEditBox:needAdjustVerticalPosition(%f)", m_fAdjustHeight);

        //callback
    },
    keyboardDidShow: function (info) {
    },
    keyboardWillHide: function (info) {
        //if (m_pEditBoxImpl != NULL) {
        //    m_pEditBoxImpl->doAnimationWhenKeyboardMove(info.duration, -m_fAdjustHeight);
        //}
    },
    keyboardDidHide: function (info) {
    },

    touchDownAction: function (sender, controlEvent) {
        //this._editBoxImpl.openKeyboard();
    },

    /**
     * @warning HTML5 Only
     * @param {cc.Size} size
     * @param {cc.color} bgColor
     */
    initWithBackgroundColor: function (size, bgColor) {
        this._edWidth = size.width;
        this.dom.style.width = this._edWidth.toString() + "px";
        this._edHeight = size.height;
        this.dom.style.height = this._edHeight.toString() + "px";
        this.dom.style.backgroundColor = cc.colorToHex(bgColor);
    },

    setFocus: function () {
        this._edTxt.focus();
        // this._edTxt.scrollIntoView();
    },

    setVisible: function (isVisible) {
        if(isVisible){
            this.style.display = "block";
        }else{
            this.style.display = "none";
        }
    },
    cleanup : function () {
        this._edTxt.removeEventListener("input", this._inputEvent);
        this._edTxt.removeEventListener("keypress", this._keyPressEvent);
        this._edTxt.removeEventListener("focus", this._focusEvent);
        this._edTxt.removeEventListener("blur", this._blurEvent);
        cc._canvas.removeEventListener('click', this._onCanvasClick);
        this._super();
    }
});

var _pro = BkTextArea.prototype;

// Extended properties
/** @expose */
_pro.font;
cc.defineGetterSetter(_pro, "font", null, _pro._setFont);
/** @expose */
_pro.fontName;
cc.defineGetterSetter(_pro, "fontName", null, _pro.setFontName);
/** @expose */
_pro.fontSize;
cc.defineGetterSetter(_pro, "fontSize", null, _pro.setFontSize);
/** @expose */
_pro.fontColor;
cc.defineGetterSetter(_pro, "fontColor", null, _pro.setFontColor);
/** @expose */
_pro.string;
cc.defineGetterSetter(_pro, "string", _pro.getString, _pro.setString);
/** @expose */
_pro.maxLength;
cc.defineGetterSetter(_pro, "maxLength", _pro.getMaxLength, _pro.setMaxLength);
/** @expose */
_pro.placeHolder;
cc.defineGetterSetter(_pro, "placeHolder", _pro.getPlaceHolder, _pro.setPlaceHolder);
/** @expose */
_pro.placeHolderFont;
cc.defineGetterSetter(_pro, "placeHolderFont", null, _pro._setPlaceholderFont);
/** @expose */
_pro.placeHolderFontName;
cc.defineGetterSetter(_pro, "placeHolderFontName", null, _pro.setPlaceholderFontName);
/** @expose */
_pro.placeHolderFontSize;
cc.defineGetterSetter(_pro, "placeHolderFontSize", null, _pro.setPlaceholderFontSize);
/** @expose */
_pro.placeHolderFontColor;
cc.defineGetterSetter(_pro, "placeHolderFontColor", null, _pro.setPlaceholderFontColor);
/** @expose */
_pro.inputFlag;
cc.defineGetterSetter(_pro, "inputFlag", null, _pro.setInputFlag);
/** @expose */
_pro.delegate;
cc.defineGetterSetter(_pro, "delegate", null, _pro.setDelegate);
/** @expose */
_pro.inputMode;
cc.defineGetterSetter(_pro, "inputMode", null, _pro.setInputMode);
/** @expose */
_pro.returnType;
cc.defineGetterSetter(_pro, "returnType", null, _pro.setReturnType);

_pro = null;

/**
 * get the rect of a node in world coordinate frame
 * @function
 * @param {cc.Node} node
 * @return {cc.Rect}
 */
BkTextArea.getRect = function (node) {
    var contentSize = node.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    return cc.rectApplyAffineTransform(rect, node.getNodeToWorldTransform());
};

