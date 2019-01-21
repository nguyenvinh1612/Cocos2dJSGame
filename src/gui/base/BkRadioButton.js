/**
 * Created by bs on 12/10/2015.
 */
var NORMAL_DEFAULT_COLOR = cc.color(255,255,255);
var DISABLE_DEFAULT_COLOR = cc.color(136,136,136);
BkRadioButton = BkSprite.extend({
    radio:null,
    label:null,
    data:null,
    textColorDeault:null,
    textColorDisable:null,
    contentText:null,
    group:null,
    currentState:null,
    ctor:function(txtRB,normalColor,disableColor){
        this._super();

        if ((txtRB == undefined)||(txtRB == null)){
            this.contentText = "";
        } else {
            this.contentText = txtRB;
        }

        if ((normalColor == undefined)||(normalColor == null)){
            this.textColorDeault = NORMAL_DEFAULT_COLOR;
        } else {
            this.textColorDeault = normalColor;
        }

        if ((disableColor == undefined)||(disableColor == null)){
            this.textColorDisable = DISABLE_DEFAULT_COLOR;
        } else {
            this.textColorDisable = DISABLE_DEFAULT_COLOR;
        }

        // init radio button
        //this.radio = new ccui.CheckBox("res/RadioButton/rb_uncheck.png",
        //    "res/RadioButton/rb_uncheck_hover.png",
        //    "res/RadioButton/rb_check.png",
        //    "res/RadioButton/rb_uncheck_disable.png",
        //    "res/RadioButton/rb_check_disable.png");
        //cc.spriteFrameCache.addSpriteFrames(res.btn_sprite_sheet_plist, res.btn_sprite_sheet_img);
        this.radio = new ccui.CheckBox(res_name.rb_uncheck,
            res_name.rb_uncheck_hover,
            res_name.rb_check,
            res_name.rb_uncheck_disable,
            res_name.rb_check_disable,ccui.Widget.PLIST_TEXTURE);
        this.radio.x = this.radio.getContentSize().width/2;
        this.radio.y = this.radio.getContentSize().height/2;
        this.addChild(this.radio);

        // init label
        this.label = new BkLabel(this.contentText,"",14);
        this.label.x = this.radio.getContentSize().width + this.label.getContentSize().width/2 ;
        this.label.y = this.radio.y;
        this.label.setTextColor(this.textColorDeault);
        this.addChild(this.label);

        // initEvent
        this.radio.addEventListener(this.onCheckChange, this);
        this.currentState = this.radio.isSelected();
    },
    onCheckChange:function(sender, type) {
        logMessage("onCheckChange");
        switch (type) {
            case  ccui.CheckBox.EVENT_UNSELECTED:
                break;
            case ccui.CheckBox.EVENT_SELECTED:
                if (this.group != null){
                    this.group.onSelectedGroud(this.getRadioButtonId());
                }
                break;

            default:
                break;
        }

        if (this.group != null){

        }
    },
    setEnableRadioButton:function(isEnable){
        this.radio.setBright(isEnable);
        this.radio.setTouchEnabled(isEnable);
        // set color label if need
        if (isEnable){
            this.label.setTextColor(this.textColorDeault);
        } else {
            this.label.setTextColor(this.textColorDisable);
        }
    },
    setData:function(dt){
        this.data = dt;
    },
    setGroup:function(mGroup){
        this.group = mGroup;
        this.group.addRadioButton(this);
    },
    isSelected:function(){
        return this.radio.isSelected();
    },
    //Not used this func for group radio, insert using BkRadioButtonGroup.setRadioSelected
    setSelected:function(isS){
        if (isS){
            this.radio.setTouchEnabled(false);
        } else {
            this.radio.setTouchEnabled(true);
        }
        this.radio.setSelected(isS);
    },
    getRadioButtonId:function(){
        return this.data.id;
    },
    getValue:function(){
        return this.data.value;
    }
});