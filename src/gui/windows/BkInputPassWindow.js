/**
 * Created by bs on 23/11/2015.
 */
BkInputPassWindow = VvWindow.extend({//BkWindow.extend({
    lbText:null,
    tfPass:null,
    tableDT:0,
    ctor:function(title,tdt){
        this._super(title,cc.size(400,200));
        this.setWindowTitle("Nhập mật khẩu bàn");
        this.setVisibleOutBackgroundWindow(true);
        this.setVisibleDefaultWdBodyBg(false);
        BkLogicManager.getLogic().isInputPass = true;
        this.lbText = new BkLabel(BkConstString.STR_NHAP_MAT_KHAU,"",16);
        this.lbText.x = this.getWindowSize().width * 0.5 ;
        this.lbText.y = this.getWindowSize().height * 0.65;
        this.lbText.setTextColor(cc.color(255, 255, 0));
        this.getBodyItem().addChild(this.lbText);

        this.tfPass = createEditBox(cc.size(290, 35), res_name.edit_text);
        this.tfPass.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.tfPass.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.tfPass.setAutoFocus(true);
        this.tfPass.x = this.lbText.x - this.lbText.width/2 + this.tfPass.width/2;
        this.tfPass.y = this.getWindowSize().height * 0.45;
        this.getBodyItem().addChild(this.tfPass);
        this.tfPass.setAutoFocus(true);
        this.tfPass.setTabStop();

        this.tableDT = tdt;

        this.btnOK = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy
            , res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover,"Vào bàn");

        this.btnOK.x = this.getWindowSize().width * 0.5 + 60;
        this.btnOK.y =  this.getWindowSize().height * 0.2;
        this.getBodyItem().addChild(this.btnOK);
        var self = this;
        this.btnOK.addClickEventListener(function(){
            self.removeSelf();
            BkLogicManager.getLogic().setLastTableBetMoney(self.tableDT.betMoney);
            BkLogicManager.getLogic().doRequestJoinTable(self.tableDT.tableID,self.tfPass.getString());
        });

        this.btnCancel = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy
            , res_name.vv_btn_huy_hover,"Hủy bỏ");
        this.btnCancel.x = this.getWindowSize().width * 0.5 - 60;
        this.btnCancel.y =  this.btnOK.y;
        this.getBodyItem().addChild(this.btnCancel);
        this.btnCancel.addClickEventListener(function(){
            self.removeSelf();
        });
    },
    removeSelf: function (){
        this._super();
        BkLogicManager.getLogic().isInputPass = false;
    },
});