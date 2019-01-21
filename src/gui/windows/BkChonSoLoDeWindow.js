/**
 * Created by bs on 21/03/2016.
 */
BkChonSoLoDeWindow = BkWindow.extend({
    lodeType:-1,
    numberColum:10,
    numberRow:10,
    listCheckbox:null,
    btnDatCuoc:null,
    lbListSo:null,
    ctor: function (type) {
        this.lodeType = type;
        var popupSize  = this.getWindowSizeWithType(type);
        this._super(this.getTitleWindowWithType(type), popupSize);
        this.numberColum = this.getNumberCoulumnWithType(type);
        this.numberRow = this.getNumberRowWithType(type);
        this.listCheckbox = [];
        this.initWd();
        this.setVisibleOutBackgroundWindow(true);
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },
    initWd:function(){
        var crWdSize = this.getWindowSizeWithType(this.lodeType);
        var startX = 100;
        var startY = crWdSize.height - 85;
        var deltaX = 60;
        var deltaY = -40;
        var i,j;
        var self = this;
        var checkBoxClickArea;

        var f = function(target){
            var arr = self.getListSelectedCB();
            var maxCBselect = self.getMaxNumberCheckboxSelect();
            if (target.isSelected()){
                if (arr.length > maxCBselect){
                    target.ldCheckbox.setSelected(!target.ldCheckbox.isSelected());
                    target.lbText.setColor(cc.color(255,255,255));
                    showToastMessage("Bạn được chọn tối đa "+maxCBselect+" con cho 1 lượt đặt");
                    return;
                }
            }

            var str = "Các số bạn chọn: ";
            for (var i=0;i<arr.length;i++){
                if (arr[i].ldNumber<10){
                    str+= "0"+arr[i].ldNumber;
                } else {
                    str+= arr[i].ldNumber;
                }

                if (i != (arr.length -1) ){
                    str+=", ";
                }
            }
            self.lbListSo.setString(str);
            self.lbListSo.x = startX + self.lbListSo.getContentSize().width/2;
        };

        for (i=0;i<this.numberRow;i++){
            for (j=0;j<this.numberColum;j++){
                var data = i* this.numberColum + j;
                checkBoxClickArea= new BkNumberCBSprite(data);
                checkBoxClickArea.setCheckboxOnChangeCallback(f);
                checkBoxClickArea.x = startX + j * deltaX;
                checkBoxClickArea.y = startY + i * deltaY;
                this.addChildBody(checkBoxClickArea);
                this.listCheckbox.push(checkBoxClickArea);
            }
        }

        this.btnDatCuoc = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Đặt Cược");
        this.btnDatCuoc.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnDatCuoc.x = crWdSize.width/2 + 220;
        this.btnDatCuoc.y = 7;
        this.addChildBody(this.btnDatCuoc);
        this.btnDatCuoc.addClickEventListener(function(){
            var arr = self.getListSelectedCB();
            var stringCheck = "|";
            for (i=0;i<arr.length;i++){
                stringCheck+= arr[i].ldNumber+"|";
            }
            logMessage("btnDatCuoc "+stringCheck);
            var layer = new BkbetLodeMoneyWindow(arr);
            layer.setOkcallback(self.onOkCallback);
            layer.showWithParent(self);
        });

        this.lbListSo = new BkLabel("Các số bạn chọn: ","",16);
        this.lbListSo.x = startX + self.lbListSo.getContentSize().width/2;
        this.lbListSo.y = this.btnDatCuoc.y;
        this.addChildBody(this.lbListSo);
    },
    onOkCallback:function(betMoney,arr){
        logMessage("betMoney "+betMoney);

        var listNumber = [];
        var str = "";
        for (i=0;i<arr.length;i++){
            if (arr[i].ldNumber < 10){
                str = "0"+arr[i].ldNumber;
            } else {
                str = ""+arr[i].ldNumber;
            }
            listNumber.push(str);
        }
        BkLogicManager.getLogic().sendLodePacket(this.lodeType,betMoney,listNumber);
        //var packet = new BkPacket();
        //packet.createBetLotteTicket(this.lodeType,betMoney,listNumber);
        //BkConnectionManager.send(packet);
    },
    getMaxNumberCheckboxSelect:function(){
        switch(this.lodeType) {
            case LDNS.XIEN2:
                    return 2;
                break;
            case LDNS.XIEN3:
                    return 3;
                break;
            case LDNS.XIEN4:
                    return 4;
                break;
            default:
                return 10;
        }
    },
    getListSelectedCB:function(){
        var arr = [];
        if (this.listCheckbox != null){
            for (var i=0;i<this.listCheckbox.length;i++){
                if (this.listCheckbox[i].isSelected()){
                    arr.push(this.listCheckbox[i]);
                }
            }
        }
        return arr;
    },
    getWindowSizeWithType:function(type){
        switch(type) {
            case LDNS.LO:
            case LDNS.DE:
            case LDNS.XIEN2:
            case LDNS.XIEN3:
            case LDNS.XIEN4:
                return cc.size(740, 500);
            default:
                return cc.size(740, 250);
        }
    },
    getTitleWindowWithType:function(type){
        switch(type) {
            case LDNS.LO:
                return "Lô";
                break;
            case LDNS.DE:
                return "Đề";
                break;
            case LDNS.XIEN2:
                return "Xiên 2";
                break;
            case LDNS.XIEN3:
                return "Xiên 3";
                break;
            case LDNS.XIEN4:
                return "Xiên 4";
                break;
            case LDNS.DECUOI:
                return "Đề cuối";
                break;
            case LDNS.DEDAU:
                return "Đề đầu";
                break;
            default:
                return "";
        }

    },
    getNumberCoulumnWithType:function(type){
        switch(type) {
            case LDNS.LO:
            case LDNS.DE:
            case LDNS.XIEN2:
            case LDNS.XIEN3:
            case LDNS.XIEN4:
                return 10;
            default:
                return 5;
        }
    },
    getNumberRowWithType:function(type){
        switch(type) {
            case LDNS.LO:
            case LDNS.DE:
            case LDNS.XIEN2:
            case LDNS.XIEN3:
            case LDNS.XIEN4:
                return 10;
            default:
                return 2;
        }
    },
    removeSelf: function () {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        this._super();
    },
    onLoadComplete: function (o, tag) {
        switch (tag){
            //case c.NETWORK_GET_FRIENDS_RETURN:
            //    break;

        }
        Util.removeAnim();
    }
});