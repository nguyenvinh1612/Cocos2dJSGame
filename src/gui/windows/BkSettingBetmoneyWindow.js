/**
 * Created by bs on 26/10/2015.
 */
var LIST_SETTING_BET_MONEY_BD   = [200,500,1000,2000,5000,10000,20000,50000,100000];
var SETTING_BETMONEY_SIZE_WD    = cc.size(400,270);
BkSettingBetmoneyWindow = VvWindow.extend({//BkWindow.extend({
    spriteSheet: cc.spriteFrameCache,
    tfCuoc:null,
    radioGroup:null,
    listBM:null,
    btnOK:null,
    btnCancel:null,
    ctor:function(title){
        this.spriteSheet.addSpriteFrames(res.vv_nap_tien_plist, res.vv_nap_tien_img);
        this._super(title,SETTING_BETMONEY_SIZE_WD);
        this.setWindowTitle("Tiền cược");
        // this.setVisibleOutBackgroundWindow(true);
        this.tfCuoc = createEditBox(cc.size(180, 35), res_name.edit_text);
        this.tfCuoc.x = this.getWindowSize().width * 0.62 ;
        this.tfCuoc.y = this.getWindowSize().height * 0.7 + 0.5;
        this.tfCuoc.setAutoFocus(true);
        this.tfCuoc.setMaxLength(10);
        this.tfCuoc.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.tfCuoc.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.getBodyItem().addChild(this.tfCuoc);
        this.tfCuoc.setTabStop();

        var lbCuoc = new BkLabel("Tiền cược","",16);
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
            var rdData = new BkRadioButtonData(i,this.listBM[i],convertStringToMoneyFormat(""+this.listBM[i],true));
            this.configRadioButton(rdData);
        }

        var delta = 80;
        this.btnOK =createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy
            , res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover,"Đồng ý");
        this.btnOK.x = this.getWindowSize().width * 0.5 + delta;
        this.btnOK.y =  this.btnOK.getContentSize().height/2 + 20;
        this.getBodyItem().addChild(this.btnOK);


        this.btnOK.addClickEventListener(function(){
            self.removeSelf();
            var betMoney = Math.floor(self.tfCuoc.getString());
            var maxPlayer = getMaxPlayer(BkGlobal.currentGameID);
            if (BkGlobal.isRoomTypeSolo()){
                maxPlayer = 2;
            }

            logMessage("betMoney "+betMoney);
            var packet = new BkPacket();
            packet.CreateSetupTablepacket(betMoney,maxPlayer,"");
            BkConnectionManager.send(packet);
        });

        this.btnCancel = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy
            , res_name.vv_btn_huy_hover,"Hủy bỏ");
        this.btnCancel.x = this.getWindowSize().width * 0.5 - delta;
        this.btnCancel.y =  this.btnOK.y;
        this.getBodyItem().addChild(this.btnCancel);
        this.btnCancel.addClickEventListener(function(){
            self.removeSelf();
        });

        this.btnOK.setTitleColor(cc.color(0,0,0));
        this.btnCancel.setTitleColor(cc.color(0,0,0));

        // custom for chan
        this.setVisibleDefaultWdBodyBg(false);
    },
    getListBetmonney:function(){
        return LIST_SETTING_BET_MONEY_BD;
    },
    configRadioButton:function(rdData){
        var rd = new BkRadioButton(rdData.description);
        rd.setData(rdData);
        rd.setGroup(this.radioGroup);
        //logMessage("current betMoney "+BkLogicManager.getInGameLogic().tableBetMoney);
        // truongbs++ set default radio = current table betmoney
        if (rdData.value == BkLogicManager.getInGameLogic().tableBetMoney){
            this.radioGroup.setRadioSelected(rd);
            this.tfCuoc.setString(rd.getValue()+"");
        }
        var rbID = rd.getRadioButtonId();
        var xPos = this.getWindowSize().width * 0.23 * ((rbID %3) +1) - 20;
        var yPos = this.tfCuoc.y - this.tfCuoc.height/2 - 30;
        yPos -= Math.floor(rbID / 3) * 35;
        rd.x = xPos;
        rd.y = yPos;
        this.getBodyItem().addChild(rd);
    }
});