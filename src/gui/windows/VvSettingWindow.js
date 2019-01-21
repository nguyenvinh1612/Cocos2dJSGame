/**
 * Created by bs on 23/05/2017.
 */
VvSettingWindow = VvTabWindow.extend({
    MARGIN_TOP:35,
    sph: cc.spriteFrameCache,
    _tabList: ["Cài đặt", "Hiển thị"],
    startContentX:60,
    startContentY:420,
    START_X_LUAT_NANG_CAO: 170,
    START_X_U_411: 270,
    btnBoQua:null,
    btnThietLap:null,
    CaiDatBanChoiSprite:null,
    HienThiSprite:null,
    colorSubtitle:cc.color(0xcf,0xb4,0x5a),
    rgChoiGa:null,
    tfCuoc:null,
    cbIsBacsicMode:null,
    cbIs411:null,
    tfChoiGaGop:null,
    rgCuocGaChiBachThu:null,
    currentTableData:null,
    isBetMoneyChange:false,
    ctor: function (tdt) {
        this.currentTableData = tdt;
        this.sph.addSpriteFrames(res.vv_trang_ca_nhan_plist, res.vv_trang_ca_nhan_img);
        this._super("Cài đặt", cc.size(500, 550), this._tabList.length, this._tabList);
        // this.setVisibleOutBackgroundWindow(false);
        this.initUI();
    },
    initUI: function () {
        this.initButton();
        this.initBanChoiSprite();
        this.initHienThiSprite();
        this.addTabChangeEventListener(this.selectedTabEvent, this);
    },
    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },
    hideAllSprite:function () {
        if (this.CaiDatBanChoiSprite!= null){
            this.CaiDatBanChoiSprite.visible = false;
        }
        if (this.HienThiSprite!= null){
            this.HienThiSprite.visible = false;
        }
    },
    drawUIWithTab: function (tabIndex) {
        this.hideAllSprite();
        this.showAllButton(false);
        if (tabIndex == 1) {
            if (this.CaiDatBanChoiSprite!= null){
                this.CaiDatBanChoiSprite.visible = true;
                if (!this.isHideAllButton()){
                    this.showAllButton(true);
                }
            }
        }
        else if (tabIndex == 2) {
            if (this.HienThiSprite!= null){
                this.HienThiSprite.visible = true;
            }
        }
    },
    initButton:function () {
        var size = cc.winSize;
        var deltaXButton = 70;
        this.btnBoQua = createBkButtonPlistNewTitle(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy
            , res_name.vv_btn_huy_hover,"Bỏ qua",0,0);
        this.btnBoQua.x = this.getWindowSize().width/2 - deltaXButton;
        this.btnBoQua.y = 60;
        this.btnBoQua.setTitleColor(cc.color(0,0,0));
        this.addChildBody(this.btnBoQua);
        var self = this;
        this.btnBoQua.addClickEventListener(function()
        {
            logMessage("this.btnStartGame .....");
            if(BkTime.GetCurrentTime() - self.btnBoQua.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnBoQua.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickBoQua();
        });

        this.btnThietLap = createBkButtonPlistNewTitle(res_name.vv_btn_dongy, res_name.vv_btn_dongy
            , res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover,"Thiết lập",0,0);
        this.btnThietLap.setTitleColor(cc.color(0,0,0));
        this.btnThietLap.x = this.btnBoQua.x + 2*deltaXButton;
        this.btnThietLap.y = this.btnBoQua.y;
        this.addChildBody(this.btnThietLap);

        this.btnThietLap.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnThietLap.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnThietLap.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickThietLap();
        });
    },
    showAllButton:function (isShow) {
        this.btnThietLap.setVisibleButton(isShow);
        this.btnBoQua.setVisibleButton(isShow);
    },
    onClickBoQua:function () {
        logMessage("onClickBoQua");

        this.removeSelf();
    },
    onClickThietLap:function () {
        logMessage("onClickThietLap");
        this.processOnClickThietLap();
        this.removeSelf();
    },
    isChangeLuatChanCuocGa:function () {
        var currIs411 = 0;
        if (this.cbIs411.isSelected()){
            currIs411 = 1;
        }
        logMessage("currIs411: "+currIs411+" is411: "+ this.currentTableData.is411);
        if (currIs411!= this.currentTableData.is411){
            return true;
        }

        var currIsBasic =1;
        if (this.cbIsBacsicMode.isSelected()){
            currIsBasic = 0;
        }

        if (currIsBasic!= this.currentTableData.isBaicMode){
            return true;
        }

        var currCuocGa = [];
        currCuocGa.push(this.rgCuocGaChiBachThu.getSelectedData());
        currCuocGa.push(this.rgCuocGaBachThuChi.getSelectedData());
        currCuocGa.push(this.rgCuocGaBachDinh.getSelectedData());
        currCuocGa.push(this.rgCuocGaTamDo.getSelectedData());
        for (var i=0;i<4;i++){
            var iCurrCG = currCuocGa[i];
            var iCG = this.currentTableData.cuocGa[i];
            logMessage("iCurrCG: "+iCurrCG+" iCG: "+ iCG);
            if (iCurrCG!=iCG){
                return true;
            }
        }
        return false;
    },
    doSetupLuatChanCuocGa:function () {
        var currCuocGa = [];
        currCuocGa.push(this.rgCuocGaChiBachThu.getSelectedData());
        currCuocGa.push(this.rgCuocGaBachThuChi.getSelectedData());
        currCuocGa.push(this.rgCuocGaBachDinh.getSelectedData());
        currCuocGa.push(this.rgCuocGaTamDo.getSelectedData());
        BkLogicManager.getInGameLogic().setupChanTable(this.cbIs411.isSelected(),!this.cbIsBacsicMode.isSelected(),currCuocGa);
    },
    doSetupChoiGagop:function () {
        BkLogicManager.getInGameLogic().SetUpHaveGaGop(this.rgChoiGa.getSelectedData());
    },
    isChangeBetMoneyMaxNumber:function () {
        this.isBetMoneyChange = false;
        var bMoney = Math.floor(this.tfCuoc.getString());
        var maxNumber =  this.rgMaxNumberPlayer.getSelectedData();
        var hasPass = this.rgPass.getSelectedData();
        logMessage("On Setting Tab: bMoney: "+bMoney+" maxNumber: "+maxNumber+" Password: "+bMoney);
        logMessage("On real Table: bMoney: "+this.currentTableData.BetMoney
            +" maxNumber: "+this.currentTableData.MaxNumberPlayers+" Password: "+this.currentTableData.HasPassword);
        if (bMoney!= this.currentTableData.BetMoney){
            this.isBetMoneyChange = true;
            return true;
        }

        if (maxNumber!= this.currentTableData.MaxNumberPlayers){
            return true;
        }
        logMessage("CGlobal.GameTable.pass: "+BkLogicManager.getInGameLogic().pass);
        if ((hasPass==1) && (this.etPassword.getString()!=BkLogicManager.getInGameLogic().pass)){
            return true;
        }

        return false;
    },
    doSetupTienCuocSoNguoiPass:function () {
        logMessage("set tien cuoc so ng choi pass");
        var bMoney = Math.floor(this.tfCuoc.getString());
        var maxNumber =  this.rgMaxNumberPlayer.getSelectedData();
        logMessage("bMoney: "+bMoney+" maxNumber: "+maxNumber+" Password: "+this.etPassword.getString());

        if (maxNumber >= BkLogicManager.getInGameLogic().getPlayerState().length){
            BkLogicManager.getInGameLogic().maxAllowedPlayer = maxNumber;
            BkLogicManager.getInGameLogic().pass = this.etPassword.getString();
            BkLogicManager.getInGameLogic().setupTable(bMoney,maxNumber,this.etPassword.getString());
        } else {
            showPopupConfirmWith(BkConstString.STR_MAX_PLAYER_INVALID);
        }
    },
    getMaxBetMoney:function (rType) {
        var hasXBetmoney = 0;
        if (BkGlobal.UserInfo.getHasX2BetMoney() == 1){
            hasXBetmoney += 2;
        }

        if (BkGlobal.UserInfo.getHasX5BetMoney() == 1){
            hasXBetmoney += 5;
        }

        if (BkGlobal.UserInfo.getHasX10BetMoney() == 1){
            hasXBetmoney += 10;
        }

        if (hasXBetmoney == 0){ hasXBetmoney =1;}

        if (rType == c.ROOM_TYPE_DINH_THU_QUAN){
            return (hasXBetmoney * c.MAX_BET_MONEY_DINH_THU_QUAN);
        }

        if (rType == c.ROOM_TYPE_DAU_TAY_DOI){
            return (hasXBetmoney * c.MAX_BET_MONEY_DAU_TAY_DOI);
        }
        return (hasXBetmoney * c.MAX_BET_MONEY_NHA_TRANH);
    },
    getMinBetMoney:function (rType) {
        if (rType == RT.ROOM_TYPE_DINH_THU_QUAN){
            return c.MIN_BET_MONEY_DINH_THU_QUAN;
        }

        if (rType == RT.ROOM_TYPE_DAU_TAY_DOI){
            return c.MIN_BET_MONEY_DAU_TAY_DOI;
        }
        return c.MIN_BET_MONEY_NHA_TRANH;
    },
    processOnClickThietLap:function()
    {
        // change Luat Chan Cuoc Ga
        if (this.isChangeLuatChanCuocGa()){
            this.doSetupLuatChanCuocGa();
        }

        // Change Luat Ga Gop
        var iCurrChoiGaGop = this.rgChoiGa.getRadioButtonSelected().data.value;
        if (iCurrChoiGaGop!=this.currentTableData.HasGagop){
            this.doSetupChoiGagop();
        }

        // Change Maxnumber
        if (this.isChangeBetMoneyMaxNumber()){
            if (this.isBetMoneyChange){
                var bMoney = Math.floor (this.tfCuoc.getString());
                var curRoomType = BkGlobal.getCurrentRoomType();
                var max = this.getMaxBetMoney(curRoomType);
                var min = this.getMinBetMoney(curRoomType);
                var curMyMoney = BkGlobal.UserInfo.getMoney();
                var realMaxBetMoney =(Math.floor(Math.min(max,curMyMoney/5)));
                this.doSetupTienCuocSoNguoiPass();
            } else {
                this.doSetupTienCuocSoNguoiPass();
            }
        }
    },
    // ban choi sprite
    initBanChoiSprite:function()
    {
        this.CaiDatBanChoiSprite = new BkSprite();
        var bmBGGa = new BkSprite("#"+res_name.setting_ga_bg);
        bmBGGa.x = this._top.x;
        bmBGGa.y = 240;
        this.CaiDatBanChoiSprite.addChild(bmBGGa);

        this.initCuoc();
        this.initLuatChoi();
        this.initChoiGaGop();
        this.initLuatGa();
        this.initSoNguoiChoi();
        this.initMatKhauBan();

        this.addChildBody(this.CaiDatBanChoiSprite);
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
    initCuoc:function () {
        var tfCuoc;
        tfCuoc = this.initSubtitle("Cược",this.startContentX,this.startContentY);
        this.CaiDatBanChoiSprite.addChild(tfCuoc);

        this.tfCuoc = createEditBox(cc.size(180, 30), res_name.edit_password);
        this.tfCuoc.x = this.START_X_LUAT_NANG_CAO + 90 ;
        this.tfCuoc.y = tfCuoc.y;
        this.tfCuoc.setAutoFocus(true);
        this.tfCuoc.setMaxLength(10);
        this.tfCuoc.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.tfCuoc.setFontColor(BkColor.TEXT_MONEY_COLOR);
        this.CaiDatBanChoiSprite.addChild(this.tfCuoc);
    },
    initLuatChoi:function () {
        var tfLuatChoi;
        tfLuatChoi = this.initSubtitle("Luật Chơi",this.startContentX,this.tfCuoc.y - this.MARGIN_TOP);
        this.CaiDatBanChoiSprite.addChild(tfLuatChoi);

        this.cbIsBacsicMode = new BkCheckBox();
        this.cbIsBacsicMode.x = this.START_X_LUAT_NANG_CAO + this.cbIsBacsicMode.width/2 - 5;
        this.cbIsBacsicMode.y = tfLuatChoi.y;
        var self = this;
        // this.cbIsBacsicMode.addEventListener(function(){
        //     logMessage("cbIsBacsicMode "+self.cbIsBacsicMode.isSelected());
        // },this);
        this.CaiDatBanChoiSprite.addChild(this.cbIsBacsicMode);
        this.lbNangCao = this.initSubtitle("Nâng cao",this.cbIsBacsicMode.x + 15,this.cbIsBacsicMode.y,this.colorSubtitle,13,false);
        this.CaiDatBanChoiSprite.addChild(this.lbNangCao);

        this.cbIs411 = new BkCheckBox();
        this.cbIs411.x = this.START_X_U_411 + this.cbIs411.width/2 - 5;
        this.cbIs411.y = tfLuatChoi.y;
        this.CaiDatBanChoiSprite.addChild(this.cbIs411);
        this.lb411 = this.initSubtitle("Ù 4-11",this.cbIs411.x + 15,this.cbIsBacsicMode.y,this.colorSubtitle,13,false);
        this.CaiDatBanChoiSprite.addChild(this.lb411);

    },
    initChoiGaGop:function () {
        //var tfChoiGaGop;
        this.tfChoiGaGop= this.initSubtitle("Chơi Gà Góp",this.startContentX,this.cbIs411.y - this.MARGIN_TOP);
        this.CaiDatBanChoiSprite.addChild(this.tfChoiGaGop);

        var rdData1 = new BkRadioButtonData(1,1,"Chơi gà");
        var bet1Time = new BkRadioButton(rdData1.description,this.colorSubtitle);
        bet1Time.setData(rdData1);
        bet1Time.x = this.START_X_LUAT_NANG_CAO + bet1Time.width/2 - 5;
        bet1Time.y = this.tfChoiGaGop.y - bet1Time.radio.getContentSize().height/2;
        this.CaiDatBanChoiSprite.addChild(bet1Time);

        var rdData2Time = new BkRadioButtonData(2,2,"Không chơi gà");
        var bet2Time = new BkRadioButton(rdData2Time.description,this.colorSubtitle);
        bet2Time.setData(rdData2Time);
        bet2Time.x = this.START_X_U_411 + bet2Time.width/2 - 5;
        bet2Time.y = bet1Time.y;
        this.CaiDatBanChoiSprite.addChild(bet2Time);

        this.rgChoiGa = new BkRadioButtonGroup();
        bet1Time.setGroup(this.rgChoiGa);
        bet2Time.setGroup(this.rgChoiGa);
    },
    initLuatGa:function () {
        var tfLuatGa ;
        tfLuatGa = this.initSubtitle("Luật Gà",this.startContentX,this.tfChoiGaGop.y - this.MARGIN_TOP);
        this.CaiDatBanChoiSprite.addChild(tfLuatGa);

        var stXCuocGa = this.startContentX+10;
        // Chi Bach Thu
        var tfChiBachThu;
        tfChiBachThu = this.initSubtitle("Chì Bạch Thủ",stXCuocGa,tfLuatGa.y - this.MARGIN_TOP,this.colorSubtitle,13,false);
        this.CaiDatBanChoiSprite.addChild(tfChiBachThu);

        this.rgCuocGaChiBachThu = new BkRadioButtonGroup();
        var rdData11 = new BkRadioButtonData(1,0,"1 gà");
        var radio11 = new BkRadioButton(rdData11.description,this.colorSubtitle);
        radio11.setData(rdData11);
        radio11.x = this.START_X_LUAT_NANG_CAO + radio11.width/2 - 5;
        radio11.y = tfChiBachThu.y - radio11.radio.getContentSize().height/2;
        this.CaiDatBanChoiSprite.addChild(radio11);

        var rdData12 = new BkRadioButtonData(2,1,"2 gà");
        var radio12 = new BkRadioButton(rdData12.description,this.colorSubtitle);
        radio12.setData(rdData12);
        radio12.x = this.START_X_U_411 + radio12.width/2 - 5;
        radio12.y = radio11.y;
        this.CaiDatBanChoiSprite.addChild(radio12);
        radio11.setGroup(this.rgCuocGaChiBachThu);
        radio12.setGroup(this.rgCuocGaChiBachThu);

        // Bach Thu Chi
        var cuocGaMarginTop = 25;
        var tfBachThuChi;
        tfBachThuChi = this.initSubtitle("Bạch Thủ Chi",stXCuocGa,tfChiBachThu.y - cuocGaMarginTop,this.colorSubtitle,13,false);
        this.CaiDatBanChoiSprite.addChild(tfBachThuChi);

        this.rgCuocGaBachThuChi = new BkRadioButtonGroup();
        var rdData21 = new BkRadioButtonData(1,0,"Có gà");
        var radio21 = new BkRadioButton(rdData21.description,this.colorSubtitle);
        radio21.setData(rdData21);
        radio21.x = this.START_X_LUAT_NANG_CAO + radio21.width/2 - 5;
        radio21.y = tfBachThuChi.y - radio21.radio.getContentSize().height/2;
        this.CaiDatBanChoiSprite.addChild(radio21);

        var rdData22 = new BkRadioButtonData(2,1,"Không gà");
        var radio22 = new BkRadioButton(rdData22.description,this.colorSubtitle);
        radio22.setData(rdData22);
        radio22.x = this.START_X_U_411 + radio22.width/2 - 5;
        radio22.y = radio21.y;
        this.CaiDatBanChoiSprite.addChild(radio22);
        radio21.setGroup(this.rgCuocGaBachThuChi);
        radio22.setGroup(this.rgCuocGaBachThuChi);

        // Bach Dinh
        var tfBachDinh;
        tfBachDinh = this.initSubtitle("Có 1 Gà",stXCuocGa,tfBachThuChi.y - cuocGaMarginTop,this.colorSubtitle,13,false);
        this.CaiDatBanChoiSprite.addChild(tfBachDinh);

        this.rgCuocGaBachDinh = new BkRadioButtonGroup();
        var rdData31 = new BkRadioButtonData(1,0,"Bạch định");
        var radio31 = new BkRadioButton(rdData31.description,this.colorSubtitle);
        radio31.setData(rdData31);
        radio31.x = this.START_X_LUAT_NANG_CAO + radio31.width/2 - 5;
        radio31.y = tfBachDinh.y - radio31.radio.getContentSize().height/2;
        this.CaiDatBanChoiSprite.addChild(radio31);
        radio31.setGroup(this.rgCuocGaBachDinh);

        var rdData32 = new BkRadioButtonData(2,1,"Bạch định, Tôm");
        var radio32 = new BkRadioButton(rdData32.description,this.colorSubtitle);
        radio32.setData(rdData32);
        radio32.x = this.START_X_U_411 + radio32.width/2 - 5;
        radio32.y = radio31.y;
        this.CaiDatBanChoiSprite.addChild(radio32);
        radio32.setGroup(this.rgCuocGaBachDinh);

        // Tam do
        var tfTamDo;
        tfTamDo = this.initSubtitle("Có 1 Gà",stXCuocGa,tfBachDinh.y - cuocGaMarginTop,this.colorSubtitle,13,false);
        this.CaiDatBanChoiSprite.addChild(tfTamDo);

        this.rgCuocGaTamDo = new BkRadioButtonGroup();
        var rdData41 = new BkRadioButtonData(1,0,"Tám đỏ");
        var radio41 = new BkRadioButton(rdData41.description,this.colorSubtitle);
        radio41.setData(rdData41);
        radio41.x = this.START_X_LUAT_NANG_CAO + radio41.width/2 - 5;
        radio41.y = tfTamDo.y - radio41.radio.getContentSize().height/2;
        this.CaiDatBanChoiSprite.addChild(radio41);
        radio41.setGroup(this.rgCuocGaTamDo);

        var rdData42 = new BkRadioButtonData(2,1,"Tám đỏ, lèo");
        var radio42 = new BkRadioButton(rdData42.description,this.colorSubtitle);
        radio42.setData(rdData42);
        radio42.x = this.START_X_U_411 + radio42.width/2 - 5;
        radio42.y = radio41.y;
        this.CaiDatBanChoiSprite.addChild(radio42);
        radio42.setGroup(this.rgCuocGaTamDo);
    },
    initSoNguoiChoi:function () {
        var lblSoNguoiChoi = this.initSubtitle("Số người chơi",this.startContentX,165);
        this.CaiDatBanChoiSprite.addChild(lblSoNguoiChoi);
        var rdData2Player = new BkRadioButtonData(4, 2, "2");
        var rd2Player = new BkRadioButton(rdData2Player.description);
        rd2Player.setData(rdData2Player);
        rd2Player.x = this.START_X_LUAT_NANG_CAO + rd2Player.width/2 - 5;
        rd2Player.y = lblSoNguoiChoi.y - rd2Player.radio.getContentSize().height/2;
        this.CaiDatBanChoiSprite.addChild(rd2Player);

        var rdData3Player = new BkRadioButtonData(5, 3, "3");
        var rd3Player = new BkRadioButton(rdData3Player.description);
        rd3Player.setData(rdData3Player);
        rd3Player.x = this.START_X_U_411 + rd3Player.width/2 - 5;
        rd3Player.y = rd2Player.y;
        this.CaiDatBanChoiSprite.addChild(rd3Player);

        var rdData4Player = new BkRadioButtonData(6, 4, "4");
        var rd4Player = new BkRadioButton(rdData4Player.description);
        rd4Player.setData(rdData4Player);
        rd4Player.x = 370 + rd4Player.width/2 - 5;
        rd4Player.y = rd2Player.y;

        this.CaiDatBanChoiSprite.addChild(rd4Player);
        this.rgMaxNumberPlayer = new BkRadioButtonGroup();
        this.rdGroupNumOfPlayer = this.rgMaxNumberPlayer;
        rd2Player.setGroup(this.rgMaxNumberPlayer);
        rd3Player.setGroup(this.rgMaxNumberPlayer);
        rd4Player.setGroup(this.rgMaxNumberPlayer);
        logMessage("this.currentTableData.MaxNumberPlayers "+this.currentTableData.maxNumberPlayer);



        this.rdGroupNumOfPlayer.setRadioSelected(this.rdGroupNumOfPlayer.listRadio[2]);
        if (BkGlobal.isRoomTypeSolo()) {
            this.rdGroupNumOfPlayer.setRadioSelected(this.rdGroupNumOfPlayer.listRadio[0]);
        }

        // So Nguoi Choi
        if (this.currentTableData.maxNumberPlayer == 4 ){
            this.rgMaxNumberPlayer.setRadioSelected(rd4Player);
        } else if (this.currentTableData.maxNumberPlayer == 3 ){
            this.rgMaxNumberPlayer.setRadioSelected(rd3Player);
        } else {
            this.rgMaxNumberPlayer.setRadioSelected(rd2Player);
        }
    },
    initMatKhauBan:function () {
        var self = this;
        var lblMatKhauBan = this.initSubtitle("Mật khẩu bàn",this.startContentX,130);
        this.CaiDatBanChoiSprite.addChild(lblMatKhauBan);

        // RB Mật khẩu bàn Yes
        var rdDataMKBYes = new BkRadioButtonData(9, 1, "Có");
        var rdMKBYes = new BkRadioButton(rdDataMKBYes.description);
        rdMKBYes.setData(rdDataMKBYes);
        rdMKBYes.x = this.START_X_LUAT_NANG_CAO + rdMKBYes.width/2 - 5;
        rdMKBYes.y = lblMatKhauBan.y - 8;
        this.CaiDatBanChoiSprite.addChild(rdMKBYes);

        // text box Mật khẩu bàn
        this.tablePass = createEditBox(cc.size(180, 35), res_name.edit_password);
        //this.tablePass.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.tablePass.setFontColor(cc.color(255,255,255));
        this.tablePass.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.tablePass.setMaxLength(20);
        this.tablePass.x = rdMKBYes.x + 150;
        this.tablePass.y = rdMKBYes.y + 8 + 0.5;
        this.tablePass.setTabStop();
        this.CaiDatBanChoiSprite.addChild(this.tablePass);

        this.etPassword =this.tablePass;

        // RB Mật khẩu bàn No
        var rdDataMKBNo = new BkRadioButtonData(10, 0, "Không");
        var rdMKBNo = new BkRadioButton(rdDataMKBNo.description);
        rdMKBNo.setData(rdDataMKBNo);
        rdMKBNo.x = rdMKBYes.x;
        rdMKBNo.y = lblMatKhauBan.y - 43;
        this.CaiDatBanChoiSprite.addChild(rdMKBNo);

        this.configView();
        
        this.rdGroupTablePass = new BkRadioButtonGroup();
        this.rgPass = this.rdGroupTablePass;
        rdMKBYes.setGroup(this.rdGroupTablePass);
        rdMKBNo.setGroup(this.rdGroupTablePass);

        if (BkLogicManager.getInGameLogic().pass == "") {
            //this.tablePass.setPlaceHolder("Nhập mật khẩu...");
            this.tablePass.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
            this.rdGroupTablePass.setRadioSelected(rdMKBNo);
            this.tablePass.setDisabled(true);
        } else {
            //this.tablePass.setPlaceHolder(BkLogicManager.getInGameLogic().pass);
            this.tablePass.setString(BkLogicManager.getInGameLogic().pass);
            this.rdGroupTablePass.setRadioSelected(rdMKBYes);
            this.tablePass.setDisabled(false);

        }
        this.rdGroupTablePass.setOnSelectedCallback(function () {
            var selectRB = self.rdGroupTablePass.getRadioButtonSelected();
            if (selectRB.getValue() == 1) {
                self.tablePass.setDisabled(false);
                self.tablePass.setAutoFocus(true);
            } else {
                self.tablePass.setDisabled(true);
            }
        });
        if (BkLogicManager.getInGameLogic().isInGameProgress() || BkGlobal.isRoomTypeSolo() || !BkLogicManager.getInGameLogic().isMeBossTable()) {
            if (BkGlobal.isRoomTypeSolo()) {
                this.rdGroupNumOfPlayer.setRadioSelected(this.rdGroupNumOfPlayer.listRadio[0]);
            }
            this.rdGroupNumOfPlayer.setEnableRadioGroup(false);
            if (BkLogicManager.getInGameLogic().isInGameProgress() || !BkLogicManager.getInGameLogic().isMeBossTable()) {
                this.rdGroupTablePass.setEnableRadioGroup(false);
                this.tablePass.setDisabled(true);
                this.tfCuoc.setDisabled(true);
                this.tfCuoc.setFontColor(DISABLE_DEFAULT_COLOR);
            }
        }
    },
    isHideAllButton:function () {
        if (BkLogicManager.getInGameLogic().isInGameProgress() || !BkLogicManager.getInGameLogic().isMeBossTable()) {
            return true;
        }
        return false;
    },
    enableCheckBox:function (isEnable) {
        this.cbIsBacsicMode.setEnableCheckBox(isEnable);
        this.cbIs411.setEnableCheckBox(isEnable);
        if (!isEnable){
            this.lb411.setTextColor(DISABLE_DEFAULT_COLOR);
            this.lbNangCao.setTextColor(DISABLE_DEFAULT_COLOR);
        }else {
            this.lb411.setTextColor(this.colorSubtitle);
            this.lbNangCao.setTextColor(this.colorSubtitle);
        }
    },
    configView:function () {
        this.tfCuoc.setString(this.currentTableData.BetMoney + "");
        //var curRoomType = BkGlobal.getCurrentRoomType();

        // U 411 Nang cao
        this.cbIs411.setSelected(this.currentTableData.is411);
        this.cbIsBacsicMode.setSelected(!this.currentTableData.isBaicMode);

        // Choi Ga
        if (this.currentTableData.HasGagop == 1){
            this.rgChoiGa.setRadioSelected(this.rgChoiGa.getRadioButtonAt(0));
        } else {
            this.rgChoiGa.setRadioSelected(this.rgChoiGa.getRadioButtonAt(1));
        }

        // Cuoc Ga
        var iChiBachThu = this.currentTableData.cuocGa[0];
        var iBachThuChi = this.currentTableData.cuocGa[1];
        var iBachDinh = this.currentTableData.cuocGa[2];
        var iTamDo = this.currentTableData.cuocGa[3];

        if (iChiBachThu == 1){
            this.rgCuocGaChiBachThu.setRadioSelected(this.rgCuocGaChiBachThu.getRadioButtonAt(1));
        } else {
            this.rgCuocGaChiBachThu.setRadioSelected(this.rgCuocGaChiBachThu.getRadioButtonAt(0));
        }

        if (iBachThuChi == 1){
            this.rgCuocGaBachThuChi.setRadioSelected( this.rgCuocGaBachThuChi.getRadioButtonAt(1));
        } else {
            this.rgCuocGaBachThuChi.setRadioSelected(this.rgCuocGaBachThuChi.getRadioButtonAt(0));
        }

        if (iBachDinh == 1){
            this.rgCuocGaBachDinh.setRadioSelected(this.rgCuocGaBachDinh.getRadioButtonAt(1));
        } else {
            this.rgCuocGaBachDinh.setRadioSelected(this.rgCuocGaBachDinh.getRadioButtonAt(0));
        }

        if (iTamDo == 1){
            this.rgCuocGaTamDo.setRadioSelected(this.rgCuocGaTamDo.getRadioButtonAt(1));
        } else {
            this.rgCuocGaTamDo.setRadioSelected(this.rgCuocGaTamDo.getRadioButtonAt(0));
        }

        if (BkLogicManager.getInGameLogic().isInGameProgress() || (!BkLogicManager.getInGameLogic().isMeBossTable())){
            this.rgCuocGaTamDo.setEnableRadioGroup(false);
            this.rgCuocGaBachDinh.setEnableRadioGroup(false);
            this.rgCuocGaChiBachThu.setEnableRadioGroup(false);
            this.rgCuocGaBachThuChi.setEnableRadioGroup(false);
            this.rgChoiGa.setEnableRadioGroup(false);
            this.enableCheckBox(false);
        }
    },
    // hien thi sprite
    initHienThiSprite:function () {
        this.HienThiSprite = new BkSprite;

        this.initSettingAmThanhChat();
        this.initSettingBackGround();

        this.addChildBody(this.HienThiSprite);
    },
    initSettingAmThanhChat:function () {
        // Am thanh
        var lblSound = new BkLabel("Âm thanh" , "Tahoma", 15,true);
        lblSound.setTextColor(this.colorSubtitle);
        lblSound.x = this.startContentX + lblSound.getContentSize().width/2;
        lblSound.y = this.startContentY;//this.getBodySize().height - lblSound.getContentSize().height/2 - WD_BODY_MARGIN_TB * 2;
        this.HienThiSprite.addChild(lblSound);

        var rdDataBatSound = new BkRadioButtonData(0,1,"");
        var rdBatSound = new BkRadioButton(rdDataBatSound.description);
        rdBatSound.setData(rdDataBatSound);
        rdBatSound.x = lblSound.x + 70;
        rdBatSound.y = lblSound.y - 12;
        this.HienThiSprite.addChild(rdBatSound);

        ////Icon bat sound
        var imgBatSound = new BkSprite("#"+res_name.icon_sound_on);
        imgBatSound.x = rdBatSound.x + 35;
        imgBatSound.y = rdBatSound.y + 12;
        this.HienThiSprite.addChild(imgBatSound);

        var rdDataTatSound = new BkRadioButtonData(1,0,"");
        var rdTatSound = new BkRadioButton(rdDataTatSound.description);
        rdTatSound.setData(rdDataTatSound);
        rdTatSound.x = imgBatSound.x + 50;
        rdTatSound.y = rdBatSound.y;
        this.HienThiSprite.addChild(rdTatSound);

        //Icon tat sound
        var imgTatSound = new BkSprite("#"+res_name.icon_sound_off);
        imgTatSound.x = rdTatSound.x + 35;
        imgTatSound.y = imgBatSound.y;
        this.HienThiSprite.addChild(imgTatSound);

        this.rdGroupSound = new BkRadioButtonGroup();
        rdBatSound.setGroup(this.rdGroupSound);
        rdTatSound.setGroup(this.rdGroupSound);

        if(BkGlobal.UserSetting.soundEnable == 1)
        {
            this.rdGroupSound.setRadioSelected(rdBatSound);
            BkLogicManager.getInGameLogic().isSoundEnable = true;
        }else
        {
            this.rdGroupSound.setRadioSelected(rdTatSound);
            BkLogicManager.getInGameLogic().isSoundEnable = false;
        }

        var self = this;
        this.rdGroupSound.setOnSelectedCallback(function () {
            var soundRadioSelected = self.rdGroupSound.getRadioButtonSelected();
            if (soundRadioSelected != null){
                BkGlobal.UserSetting.soundEnable = soundRadioSelected.getValue();
            } else {
                logMessage("soundRadioSelected == null -> check loi");
            }

            BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
            if(BkGlobal.UserSetting.soundEnable == 1)
            {
                BkLogicManager.getInGameLogic().isSoundEnable = true;
            }else
            {
                BkLogicManager.getInGameLogic().isSoundEnable = false;
            }
        });

        ////Hien thi chat
        var lblchat = new BkLabel("Hiển thị chat" , "Tahoma", 15,true);
        lblchat.setTextColor(this.colorSubtitle);
        lblchat.x = lblSound.x + 7;
        lblchat.y = lblSound.y - 35;
        this.HienThiSprite.addChild(lblchat);

        var rdDataBatChat = new BkRadioButtonData(2,1,"Bật");
        var rdBatChat = new BkRadioButton(rdDataBatChat.description,this.colorSubtitle);
        rdBatChat.setData(rdDataBatChat);
        rdBatChat.x = rdBatSound.x;
        rdBatChat.y = lblchat.y - 12;
        this.HienThiSprite.addChild(rdBatChat);

        var rdDataTatChat = new BkRadioButtonData(3,0,"Tắt");
        var rdTatChat = new BkRadioButton(rdDataTatChat.description,this.colorSubtitle);
        rdTatChat.setData(rdDataTatChat);
        rdTatChat.x = rdTatSound.x;
        rdTatChat.y = rdBatChat.y;
        this.HienThiSprite.addChild(rdTatChat);

        this.rdGroupChat = new BkRadioButtonGroup();
        rdBatChat.setGroup(this.rdGroupChat);
        rdTatChat.setGroup(this.rdGroupChat);

        if(BkGlobal.UserSetting.isChatEnable == 1)
        {
            this.rdGroupChat.setRadioSelected(rdBatChat);
        }else
        {
            this.rdGroupChat.setRadioSelected(rdTatChat);
        }

        this.rdGroupChat.setOnSelectedCallback(function () {
            var chatRadioSelected = self.rdGroupChat.getRadioButtonSelected();
            if (chatRadioSelected != null){
                BkGlobal.UserSetting.isChatEnable = chatRadioSelected.getValue();
            } else {
                logMessage("chatRadioSelected == null -> check loi");
            }
            BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
            getCurrentScene().updateUpDownChatBoxState(BkGlobal.UserSetting.isChatEnable);
        });
    },
    initSettingBackGround:function () {
        var tfKieuBan = this.initSubtitle("Kiểu Bàn",this.startContentX,this.startContentY - 2* this.MARGIN_TOP);
        this.HienThiSprite.addChild(tfKieuBan);
        var deltaXRadio = 130;
        this.rgKieuBan = new BkRadioButtonGroup();
        var rdData11 = new BkRadioButtonData(1,1,"");
        var radio11 = new BkRadioButton(rdData11.description,this.colorSubtitle);
        radio11.setData(rdData11);
        radio11.x = tfKieuBan.x - tfKieuBan.getContentSize().width/2 ;//+ radio11.radio.getContentSize().width/2;
        radio11.y = tfKieuBan.y - radio11.radio.getContentSize().height/2 - this.MARGIN_TOP;
        this.HienThiSprite.addChild(radio11);
        radio11.setGroup(this.rgKieuBan);

        var rdData12 = new BkRadioButtonData(2,2,"");
        var radio12 = new BkRadioButton(rdData12.description,this.colorSubtitle);
        radio12.setData(rdData12);
        radio12.x = radio11.x + deltaXRadio;
        radio12.y = radio11.y;
        this.HienThiSprite.addChild(radio12);
        radio12.setGroup(this.rgKieuBan);

        var rdData13 = new BkRadioButtonData(3,3,"");
        var radio13 = new BkRadioButton(rdData13.description,this.colorSubtitle);
        radio13.setData(rdData13);
        radio13.x = radio12.x + deltaXRadio;
        radio13.y = radio11.y;
        this.HienThiSprite.addChild(radio13);
        radio13.setGroup(this.rgKieuBan);
        var rType = BkGlobal.getCurrentRoomType();
        var sp1 = this.getBackGroundWith(rType,1);
        sp1.x = 130;
        sp1.y = 295;
        this.HienThiSprite.addChild(sp1);

        var sp2 = this.getBackGroundWith(rType,2);
        sp2.x = sp1.x + deltaXRadio;
        sp2.y = sp1.y;
        this.HienThiSprite.addChild(sp2);
        var sp3 = this.getBackGroundWith(rType,3);
        sp3.x = sp2.x + deltaXRadio;
        sp3.y = sp1.y;
        this.HienThiSprite.addChild(sp3);
        var self = this;
        this.rgKieuBan.setOnSelectedCallback(function () {
            var radioSelect = self.rgKieuBan.getRadioButtonSelected();
            var data = radioSelect.data;
            logMessage("select radio "+rType+" - "+data.value);
            BkLogicManager.getInGameLogic().getGameLayer().updateBgBanChoi(data.value,rType);
        });

        var dfValue =JSON.stringify(1);
        var crRoomType = BkGlobal.getCurrentRoomType();
        var sttBG = Util.getClientSetting(key.dfBackgorundIngame + "_" + cc.username.toLowerCase()+"_"+crRoomType, true, dfValue);
        if (sttBG == 1){
            this.rgKieuBan.setRadioSelected(radio11);
        }
        if (sttBG == 2){
            this.rgKieuBan.setRadioSelected(radio12);
        }
        if (sttBG == 3){
            this.rgKieuBan.setRadioSelected(radio13);
        }
    },
    getBackGroundWith:function(rTpye,stt){
        if (rTpye == RT.ROOM_TYPE_DINH_THU_QUAN){
            if (stt == 1){ return new BkSprite("#"+res_name.ingame_dinhthuquan_bg_1);}
            if (stt == 2){ return new BkSprite("#"+res_name.ingame_dinhthuquan_bg_2);}
            if (stt == 3){ return new BkSprite("#"+res_name.ingame_dinhthuquan_bg_3);}
        }else if (rTpye == RT.ROOM_TYPE_DAU_TAY_DOI){
            logMessage("ROOM_TYPE_DAU_TAY_DOI "+stt);
            if (stt == 1){ return new BkSprite("#"+res_name.ingame_dataydoi_bg_1);}
            if (stt == 2){ return new BkSprite("#"+res_name.ingame_dataydoi_bg_2);}
            if (stt == 3){ return new BkSprite("#"+res_name.ingame_dataydoi_bg_3);}
        }
        else {
            if (stt == 1){ return new BkSprite("#"+res_name.ingame_nhatranh_bg_1);}
            if (stt == 2){ return new BkSprite("#"+res_name.ingame_nhatranh_bg_2);}
            if (stt == 3){ return new BkSprite("#"+res_name.ingame_nhatranh_bg_3);}
        }
        return new BkSprite("#"+res_name.ingame_nhatranh_bg_1);
    }
});
