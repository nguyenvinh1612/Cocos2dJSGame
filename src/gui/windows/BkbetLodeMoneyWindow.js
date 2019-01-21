/**
 * Created by bs on 21/03/2016.
 */

var LIST_LODE_BET_MONEY_BD   = [500,1000,2000,5000,10000,20000,50000,100000,200000];
BkbetLodeMoneyWindow = BkWindow.extend({
    tfCuoc:null,
    radioGroup:null,
    listBM:null,
    btnOK:null,
    btnCancel:null,
    okCB:null,
    listNum:null,
    ctor:function(listNumber){
        this.listNum = listNumber;
        this._super("",SETTING_BETMONEY_SIZE_WD);
        this.setWindowTitle("Đặt cược");
        this.setVisibleOutBackgroundWindow(true);
        this.tfCuoc = createEditBox(cc.size(180, 35), res_name.edit_text);
        this.tfCuoc.x = this.getWindowSize().width * 0.62 ;
        this.tfCuoc.y = this.getWindowSize().height * 0.7;
        this.tfCuoc.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.tfCuoc.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.getBodyItem().addChild(this.tfCuoc);

        var lbCuoc = new BkLabel("Đặt cược","",16);
        lbCuoc.x = this.getWindowSize().width * 0.2 + lbCuoc.getContentSize().width/2 - 15;
        lbCuoc.y = this.tfCuoc.y;
        this.getBodyItem().addChild(lbCuoc);

        var self = this;
        this.radioGroup = new BkRadioButtonGroup();
        this.radioGroup.setOnSelectedCallback(function(){
            var selectRB= self.radioGroup.getRadioButtonSelected();
            if (selectRB == null){
                return;
            }
            self.tfCuoc.setString(selectRB.getValue()+"");
        });
        this.listBM = this.getListBetmonney();
        for (var i=0;i<this.listBM.length;i++){
            var rdData = new BkRadioButtonData(i,this.listBM[i],""+this.listBM[i]);
            this.configRadioButton(rdData);
        }

        var delta = 80;
        this.btnOK =createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover,"Đồng ý");
        this.btnOK.x = this.getWindowSize().width * 0.5 + delta;
        this.btnOK.y =  this.btnOK.getContentSize().height/2 - 5;
        this.getBodyItem().addChild(this.btnOK);

        this.btnOK.addClickEventListener(function(){

            var betMoney = Math.floor(self.tfCuoc.getString());
            if (isNaN(betMoney)){
                showToastMessage("Tiền đặt cược không hợp lệ");
                return;
            }
            if (self.okCB != null){
                self.okCB(betMoney,self.listNum);
            }
            self.removeSelf();
        });

        this.btnCancel = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover,"Hủy bỏ");
        this.btnCancel.x = this.getWindowSize().width * 0.5 - delta;
        this.btnCancel.y =  this.btnOK.y;
        this.getBodyItem().addChild(this.btnCancel);
        this.btnCancel.addClickEventListener(function(){
            self.removeSelf();
        });
    },
    getListBetmonney:function(){
        return LIST_LODE_BET_MONEY_BD;
    },
    configRadioButton:function(rdData){
        var rd = new BkRadioButton(rdData.description);
        rd.setData(rdData);
        rd.setGroup(this.radioGroup);
        var rbID = rd.getRadioButtonId();
        var xPos = this.getWindowSize().width * 0.23 * ((rbID %3) +1) - 20;
        var yPos = this.tfCuoc.y - this.tfCuoc.height/2 - 30;
        yPos -= Math.floor(rbID / 3) * 35;
        rd.x = xPos;
        rd.y = yPos;
        this.getBodyItem().addChild(rd);
    },
    setOkcallback:function(cb){
        this.okCB = cb;
    }
});