/**
 * Created by vinhnq on 10/28/2015.
 */
BkBacayBetMoney = BkWindow.extend({
    logic:null,
    txtMoney:null,
    betMoney:null,
    ctor: function(money) {
        this._super("Cược tiền bàn", cc.size(450, 280), null);
        this.betMoney = money;
        this.initWindow();
    },

    initWindow: function ()
    {
        var self = this;
        var size = cc.winSize;

        // lbl Bet Money
        var lblTienCuoc = new BkLabel("Tiền cược" , "Tahoma", 14);
        lblTienCuoc.setTextColor(cc.color(255,255,255));
        lblTienCuoc.x = this.getBodySize().width - 380;
        lblTienCuoc.y = this.getBodySize().height -30;
        this.addChildBody(lblTienCuoc);

        // txt bet money
        this.txtMoney = createEditBox(cc.size(180, 26), res_name.edit_text);
        this.txtMoney.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.txtMoney.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.txtMoney.x = lblTienCuoc.x + 150;
        this.txtMoney.y = lblTienCuoc.y;
        var str = "" + this.betMoney;
        logMessage("BetMoney " + str);
        this.txtMoney.setString(this.betMoney);
        this.addChildBody(this.txtMoney);

        var lblMucCuoc = new BkLabel("Số lần tiền bàn" , "Tahoma", 14);
        lblMucCuoc.setTextColor(cc.color(255,255,255));
        lblMucCuoc.x = lblTienCuoc.x;
        lblMucCuoc.y = lblTienCuoc.y - 35;
        this.addChildBody(lblMucCuoc);

        var rdData1Time = new BkRadioButtonData(1,1,"1");
        var bet1Time = new BkRadioButton(rdData1Time.description);
        bet1Time.setData(rdData1Time);
        bet1Time.x = this.getBodySize().width - 420;
        bet1Time.y = lblMucCuoc.y - 40;
        this.addChildBody(bet1Time);

        var rdData2Time = new BkRadioButtonData(2,2,"2");
        var bet2Time = new BkRadioButton(rdData2Time.description);
        bet2Time.setData(rdData2Time);
        bet2Time.x = bet1Time.x + 85;
        bet2Time.y = bet1Time.y;
        this.addChildBody(bet2Time);

        var rdData3Time = new BkRadioButtonData(3,3,"3");
        var bet3Time = new BkRadioButton(rdData3Time.description);
        bet3Time.setData(rdData3Time);
        bet3Time.x = bet2Time.x + 85;
        bet3Time.y = bet2Time.y;
        this.addChildBody(bet3Time);

        var rdData4Time = new BkRadioButtonData(4,4,"4");
        var bet4Time = new BkRadioButton(rdData4Time.description);
        bet4Time.setData(rdData4Time);
        bet4Time.x = bet3Time.x + 85;
        bet4Time.y = bet3Time.y;
        this.addChildBody(bet4Time);

        var rdData5Time = new BkRadioButtonData(5,5,"5");
        var bet5Time = new BkRadioButton(rdData5Time.description);
        bet5Time.setData(rdData5Time);
        bet5Time.x = bet4Time.x + 85;
        bet5Time.y = bet4Time.y;
        this.addChildBody(bet5Time);

        this.rdGroupBetMoney = new BkRadioButtonGroup();
        bet1Time.setGroup(this.rdGroupBetMoney);
        bet2Time.setGroup(this.rdGroupBetMoney);
        bet3Time.setGroup(this.rdGroupBetMoney);
        bet4Time.setGroup(this.rdGroupBetMoney);
        bet5Time.setGroup(this.rdGroupBetMoney);

        //var self = this;
        this.rdGroupBetMoney.setOnSelectedCallback(function(){
            //logMessage();
            var selectRB= self.rdGroupBetMoney.getRadioButtonSelected();
            self.txtMoney.setString(self.betMoney * selectRB.getValue());
        });

        var btnThietLap = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Thiết lập",size.width/2,size.height/2);
        btnThietLap.x = this.width/2 - 100;
        btnThietLap.y = this.height/2 - 120;
        this.addChild(btnThietLap);
        btnThietLap.addClickEventListener(function()
        {
            var textMoney = self.txtMoney.getString();
            if (IsNumeric(textMoney)) {
                if (self.logic!= null) {
                    self.logic.sendBetMoney(textMoney);
                }
                self.removeSelf();
            } else {
                showToastMessage("Tiền cược không đúng", 400, 300);
            }
        });

        // Bo qua
        var btnBoQua = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Bỏ qua",size.width/2,size.height/2);
        btnBoQua.x = this.width/2 + 100;
        btnBoQua.y = this.height/2 - 120;
        this.addChild(btnBoQua);
        btnBoQua.addClickEventListener(function()
        {
            self.removeSelf();
        });
    },

    setLogic:function(gameLogic){
        this.logic = gameLogic;
    }
});