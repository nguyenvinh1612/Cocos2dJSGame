/**
 * Created by bs on 23/05/2017.
 */
var SETTING_LUATCHOI_SIZE_WD    = cc.size(400,200);
BkSettingLuatChoiWindow = VvWindow.extend({
    colorSubtitle:cc.color(0xcf,0xb4,0x5a),
    cbIs411:null,
    cbIsBacsicMode:null,
    ctor:function(title) {
        this._super(title, SETTING_LUATCHOI_SIZE_WD);
        this.setVisibleDefaultWdBodyBg(false);
        // this.setVisibleOutBackgroundWindow(true);
        this.setWindowTitle("Luật chơi");
        this.initLuatChoi();
        this.initButtonWD();
    },
    initButtonWD:function () {
        var delta = 70;
        var self = this;
        this.btnOK =createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy
            , res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover,"Đồng ý");
        this.btnOK.x = this.getWindowSize().width * 0.5 + delta;
        this.btnOK.y =  this.btnOK.getContentSize().height/2 + 25;
        this.getBodyItem().addChild(this.btnOK);

        this.btnOK.addClickEventListener(function(){
            self.removeSelf();
            var globalIs411 = 0;
            var globalIsBasic = 0;

            if (BkLogicManager.getInGameLogic().isBasicMode){
                globalIsBasic = 1;
            }

            if (BkLogicManager.getInGameLogic().isEnable4_11){
                globalIs411 = 1;
            }
            var currIs411 = 0;
            var currIsBasic = 1;

            if (self.cbIs411.isSelected()){
                currIs411 = 1;
            }
            if (self.cbIsBacsicMode.isSelected()){
                currIsBasic = 0;
            }
            if ((currIs411 != globalIs411)||(currIsBasic!= globalIsBasic)){
                BkLogicManager.getInGameLogic().setupChanTable(self.cbIs411.isSelected(),!self.cbIsBacsicMode.isSelected()
                    ,BkLogicManager.getInGameLogic().cuocGa);
            }
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
    },
    initSubtitle:function(txt,xPos,yPos,color,fontSize,isBold){
        if (color == undefined){
            color = this.colorSubtitle;
        }
        if (fontSize == undefined){
            fontSize = 14;
        }
        if (isBold == undefined){
            isBold = true;
        }
        var tf = new BkLabel(txt,"",fontSize,isBold);
        tf.x = xPos + tf.getContentSize().width/2;
        tf.y = yPos;
        tf.setTextColor(color);
        return tf;
    },
    initLuatChoi:function () {
        var globalIs411 = 0;
        var globalIsBasic = 0;

        if (BkLogicManager.getInGameLogic().isBasicMode){
            globalIsBasic = 1;
        }

        if (BkLogicManager.getInGameLogic().isEnable4_11){
            globalIs411 = 1;
        }

        this.cbIsBacsicMode = new BkCheckBox();
        this.cbIsBacsicMode.x = 150;
        this.cbIsBacsicMode.y = 90;
        this.addChildBody(this.cbIsBacsicMode);
        this.lbNangCao = this.initSubtitle("Nâng cao",this.cbIsBacsicMode.x + 15,this.cbIsBacsicMode.y,this.colorSubtitle,13,false);
        this.addChildBody(this.lbNangCao);
        if (globalIsBasic == 0){
            this.cbIsBacsicMode.setSelected(true);
        }


        this.cbIs411 = new BkCheckBox();
        this.cbIs411.x = this.cbIsBacsicMode.x;//this.START_X_U_411 + this.cbIs411.width/2 - 5;
        this.cbIs411.y = this.cbIsBacsicMode.y + 25;
        this.addChildBody(this.cbIs411);
        this.lb411 = this.initSubtitle("Ù 4-11",this.cbIs411.x + 15,this.cbIs411.y,this.colorSubtitle,13,false);
        this.addChildBody(this.lb411);
        if (globalIs411 == 1){
            this.cbIs411.setSelected(true);
        }
    }

});