/**
 * Created by bs on 15/10/2015.
 */
var TYPE_MESSAGE_BOX        = 1;
var TYPE_CONFIRM_BOX        = 2;
var TYPE_NO_CONFIRM_BOX     = 3;
var DEFAULT_SIZE_DW         = cc.size(400,200);
var CONTENT_MARGIN_LR_DW    = 20;


BkDialogWindow = VvWindow.extend({
    type:TYPE_MESSAGE_BOX,
    contentMess:null,
    crSize:null,
    btnOK:null,
    btnCancel:null,
    okCallback:null,
    cancelCallback:null,
    MARGIN_TOP:10,
    ctor:function(title,type,sizeWD){
        var Wsize = DEFAULT_SIZE_DW;
        if (sizeWD!= undefined){
            Wsize =  sizeWD;
        }
        this._super(title,Wsize);
        this.setVisibleDefaultWdBodyBg(false);
        this.setVisibleOutBackgroundWindow(true);
        this.type = type;
        if(title == undefined) title = "Thông báo";
        this.setWindowTitle(title);
        this.crSize = Wsize;

        this.contentMess = new cc.LabelTTF("", "Tahoma", 16*2,cc.size (this.crSize.width*2 - 2*CONTENT_MARGIN_LR_DW , 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.contentMess.setScale(0.5);
        this.contentMess.setFontFillColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        this.contentMess.x = this.getWindowSize().width/2;
        this.contentMess.y = this.getWindowSize().height/2 + this.MARGIN_TOP;
        this.getBodyItem().addChild(this.contentMess);

        this.btnOK = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy,
            res_name.vv_btn_dongy_hover,"Đồng ý");
        this.btnOK.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        this.btnOK.x = this.contentMess.x + this.btnOK.getContentSize().width/2 + 20;
        this.btnOK.y =  this.btnOK.getContentSize().height/2 + 20;
        this.getBodyItem().addChild(this.btnOK);
        this.btnOK.setVisible(false);
        var self = this;
        this.btnOK.addClickEventListener(function(){
            self.removeSelf();
            if (self.okCallback != null){
                self.okCallback();
            }
        });

        this.btnCancel = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy,
            res_name.vv_btn_huy_hover,"Hủy bỏ");
        this.btnCancel.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        this.btnCancel.x = this.contentMess.x - this.btnCancel.getContentSize().width/2 - 20;
        this.btnCancel.y =  this.btnOK.y;
        this.getBodyItem().addChild(this.btnCancel);
        this.btnCancel.setVisible(false);
        this.btnCancel.addClickEventListener(function(){
            self.removeSelf();
            if (self.cancelCallback != null){
                self.cancelCallback();
            }
        });
        this.configButton();
    },
    configButton:function(){
        if (this.type == TYPE_MESSAGE_BOX){
            this.btnOK.setVisible(true);
            this.btnOK.x = this.contentMess.x;
        } else if( this.type == TYPE_CONFIRM_BOX) {
            this.btnOK.setVisible(true);
            this.btnCancel.setVisible(true);
        }
    },
    setTextMessage:function(txt){
        this.contentMess.setString(txt);
        logMessage("BkDialogWindow: " + txt);
    },
    show:function(){
        //this.setParentWindow(cc.director.getRunningScene());
        //this.showWithParent(cc.director.getRunningScene());
        this.showWithParent();
    },
    setOkCallback:function(f){
        this.okCallback = f;
    },
    setCancelCallback:function(f){
        this.cancelCallback = f;
    },
    setTextColor:function(color){
        this.contentMess.setFontFillColor(color);
    }
});