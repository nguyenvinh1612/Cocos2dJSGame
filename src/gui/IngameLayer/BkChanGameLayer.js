/**
 * Created by bs on 08/05/2017.
 */


if(typeof IGC == "undefined") {
    var IGC = {};
    IGC.MARGIN_BOTTOM_BOX_CHAT 	    = 2;
    IGC.DELTA_HEIGHT_EATCARD 	    = 30;
    IGC.DURATION_ANIMATION_CARD	    = 0.2;
    IGC.DURATION_ANI_XOEQUAT		= 0.5;

    IGC.CENTER_CIR_X 				= c.WINDOW_WIDTH /2 + 15;
    IGC.CENTER_CIR_Y 				=  90;

    IGC.STATE_NORMAL				= 0;
    IGC.STATE_SHOW_CHIU				= 1;
    IGC.STATE_TRA_CUA				= 2;

    IGC.X_COOR_CDT				    = (c.WINDOW_WIDTH - 76)*0.5 + 15;
    IGC.Y_COOR_CDT				    = 300;

    IGC.X_COOR_BTN_TIEP_TUC		    = (c.WINDOW_WIDTH - 76)*0.5;
    IGC.Y_COOR_BTN_TIEP_TUC		    = 360;

    IGC.RADIUS_CIR 				    = 100;
    IGC.DEGREES_PER_CARD 		    = 12;
    IGC.MAX_DIVIDE_CARDS 			= 20;
    IGC.START_RIGHT_SHARE 			= 15;

    IGC.ACTION_AN 					= 1;
    IGC.ACTION_BOC					= 2;
    IGC.ACTION_DANH				    = 3;
    IGC.ACTION_DUOI				    = 4;
    IGC.ACTION_CHIU				    = 5;
    IGC.ACTION_BOCHIU				= 6;
    IGC.ACTION_TRACUA				= 7;
    IGC.ACTION_U					= 8;
    IGC.ACTION_BOU					= 9;
    IGC.ACTION_ACTIVE				= 10;
    IGC.ACTION_STARTGAME 			= 11;
    IGC.ACTION_LOST_ACTIVE 		    = 12;

    IGC.CHIU_TIMEOUT				= 10;
    IGC.U_TIMEOUT					= 5;
    IGC.TRACUA_TIMEOUT				= 10;

}

BkChanGameLayer  = BkBaseIngameLayer.extend({
    gameTable:null,
    isDealingCard:false,
    bocCaiCard:null,
    rotateCount:-1,
    bocCaiName:null,
    bocCaiPos:-1,
    bocCaiPoint:null,

    btnAn:null,
    btnDuoi:null,
    btnBocCentrer:null,
    btnDanh:null,
    btnChiu:null,
    btnKoChiu:null,
    btnTraCua:null,
    btnBoc:null,
    btnU:null,
    btnKoU:null,
    NocBackGround:null,
    NocText:null,
    currentAction:-1,
    xcw:null,
    xctw:null,
    UConfirmDialog:null,
    txtTableMode:null,
    txtTableURule:null,
    btnSettingLuat:null,
    imgCoinChan:null,
    txtBetMoneyChan:null,
    imgChicken:null,
    txtGaGop:null,
    chiuAnimationSprite:null,
    UAnimationSprite:null,
    baiNoc:null,
    uText:null,
    strCuoc:null,
    isVisibleSharebtn:false,
    ctor:function(){
        this._super();
        this.imgCoin.setVisibleButton(false);
        this.txtBetMoney.visible = false;
        cc.spriteFrameCache.addSpriteFrames(res.resIngameChan_plist, res.resIngameChan_img);
        cc.spriteFrameCache.addSpriteFrames(res.vv_vip_plist, res.vv_vip_img);
        this.InitNoc();
        this.initMenuCustomButton();
        this.initIngameHeader();
        this.gameTable = BkLogicManager.getInGameLogic();

        // init BG
        var dfValue =JSON.stringify(1);
        var crRoomType = BkGlobal.getCurrentRoomType();
        var sttBG = Util.getClientSetting(key.dfBackgorundIngame + "_" + cc.username.toLowerCase()+"_"+crRoomType, true, dfValue);
        this.updateBgBanChoi(sttBG,BkGlobal.getCurrentRoomType());
    },
    onBackClick:function(){
        var myCS = this.gameTable.getMyClientState();
        if (myCS!= null){
            if (myCS.isPlaying){
                if (this.gameTable.gameStatus == STATE_WAIT_XUONG){
                    showToastMessage("Bạn không thể thoát khi xướng cước",100,525);
                    return;
                }
            }
        }
        this._super();
    },
    _getLocationPos:function(clientPos){
        var superValue = this._super(clientPos);
        var deltaX = 10;
        if (clientPos == 1){
            superValue.x +=deltaX;
            return superValue;
        }
        if (clientPos == 3){
            superValue.x -=deltaX;
            return superValue;
        }

        if (clientPos == 2){
            superValue.x = IGC.CENTER_CIR_X;
            return superValue;
        }
        // if (clientPos != 0){
        //     return this._super(clientPos);
        // }
        return cc.p(IGC.CENTER_CIR_X,IGC.CENTER_CIR_Y);
    },
    testDealCard:function(){
        var NocCards = [];
        for (var i=0;i<20;i++){
            NocCards.push(new BkChanCard(40));
        }
        this.gameTable.getMyClientState().setOnhandCard(NocCards);
        this.bocCaiPoint = CConstIngame.getToolTipBocCaiPoint(1);
        this.bocCaiCard = new BkChanCard(40);
        this.bocCaiName = "Truongbsasf";
        this.rotateCount = 1;
        this.DivideCards();
    },
    testShowNoc:function(){
        this.removeCountDownText();
        this.clearShowU();
        var NocCards = [];
        var onHandCard = [];
        for (var i=0;i<10;i++){
            NocCards.push(new BkChanCard(40));
            onHandCard.push(new BkChanCard(40));
        }


        this.showBaiU(NocCards, onHandCard,new BkChanCard(40));
    },
    testXoeQuatAndMoveAnimation:function () {
        var onHandCard = [];

        for (var i=0;i<20;i++){
            onHandCard.push(new BkChanCard(40));
        }
        var ca1 = onHandCard[0];
        this.DisplayListOnHandCard(onHandCard);
        ca1.moveTo(400,400,3,function () {
            logMessage("finish moveCa1");
        })
    },
    testAnmationIncreaseCash:function () {
        var pAvar = this.PlayerAvatar[1];
        this.showAnimationUpdateMoney(-500,"Nhái vào gà",pAvar);
    },
    testShowKetU:function () {

        var list = [];
        var ele = BkRichTextUtil.creatElementText(list.length,cc.color.WHITE,"DoanNguyen14 Xuong Dung: 16 diem, 2Ga",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);
        ele = BkRichTextUtil.creatElementText(list.length,cc.color.WHITE,"Chi, Bach thu, Co tom",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        ele = BkRichTextUtil.creatElementText(list.length,cc.color.WHITE," ",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        ele = BkRichTextUtil.creatElementText(list.length,cc.color.WHITE," DuongThang124235: -320000",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        ele = BkRichTextUtil.creatElementText(list.length,cc.color.WHITE," phgd84696: -320000",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        ele = BkRichTextUtil.creatElementText(list.length,cc.color.WHITE," Hoangbang05: -320000",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        ele = BkRichTextUtil.creatElementText(list.length,cc.color.YELLOW," DoanNguyen14: +912000",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        ele = BkRichTextUtil.creatElementText(list.length,cc.color.RED," An ga gop: 1033333",15);
        list.push(ele);
        ele = BkRichTextUtil.createLineBreakElement(list.length);
        list.push(ele);

        this.gameTable.listKqUTextElement = list;
        this.showPopupConfirmAfterUpdateMoney(list,"Hòa cả làng!");
    },
    // onPaymentClick:function(){
    //     //this.testShowKetU();
    //     //this.testAnmationIncreaseCash();
    //     //this.updateContentChatBoxAfterFinishgame("Ván hòa.");
    //     //this.testXoeQuatAndMoveAnimation();
    //     //this.showPopupConfirmAfterUpdateMoney(null,"Hòa cả làng!");
    //     //var myAvar = this.PlayerAvatar[0];
    //     //myAvar.visible = false;
    //     //this.showChiuMenu(IGC.STATE_TRA_CUA);
    //     //this.ShowUConfirmMenu();
    //     //this.showUText("Thông chì bạch thủ chi tám đỏ hai lèo tôm",CUText.TYPE_COLOR_0);
    //     // this.showXuongCuoc();
    //     //this.testDealCard();
    //     //this.testShowNoc();
    //     //this.hideStartGameButton();
    //     //BkSound.playContinuousSound(["thong.mp3","chi.mp3"]);
    //     //this.showBaoChiuAnimation();
    //     //  this.showBaoUAnimation();
    // },
    onSettingClick:function () {

        var tbData = new BkTableData();
        tbData.BetMoney = this.gameTable.tableBetMoney;
        tbData.cuocGa = this.gameTable.cuocGa;
        tbData.is411 = this.gameTable.isEnable4_11;
        tbData.isBaicMode = this.gameTable.isBasicMode;
        tbData.HasGagop = 0;

        if (this.gameTable.maxAllowedPlayer!=0){
            tbData.maxNumberPlayer = this.gameTable.maxAllowedPlayer;
        }

        if (BkGlobal.getCurrentRoomType() == c.ROOM_TYPE_DAU_TAY_DOI){
            tbData.maxNumberPlayer =2;
        }

        if (this.gameTable.gaGop){
            tbData.HasGagop = 1;
        }

        if (this.gameTable.pass != ""){
            tbData.HasPassword = 1;
        }

        var SettingLayer = new VvSettingWindow(tbData);
        SettingLayer.setParentWindow(this.getParent());
        var chatLayer = getCurrentScene().ChatLayer;
        if (chatLayer != undefined){
            chatLayer.setChatDownState();
        }
        var self = this;
        SettingLayer.setCallbackRemoveWindow(function () {
            self.setVisibleCountDownText(true);
            if (chatLayer != undefined){
                chatLayer.restoreUpDownState();
            }
        });
        SettingLayer.showWithParent();
        self.setVisibleCountDownText(false);
    },
    initMenuCustomButton:function(){
        var mPoint;
        var self = this;
        this.btnContainer = new cc.Layer();
        var AN = "Ăn";
        var DANH = "Đánh";
        var BOC = "Bốc";
        var DUOI = "Dưới";
        var CHIU = "Chíu";
        var BOCHIU = "Bỏ Chíu";
        var TRACUA = "Trả cửa";
        var U = "Ù";
        var BOU = "Bỏ Ù";

        mPoint = this.getControlButtonLocation("An");
        this.btnAn = createBkButtonPlistNewTitle(res_name.btn_an, res_name.btn_an_press, res_name.btn_an_disable,
            res_name.btn_an_hover,AN,mPoint.x,mPoint.y);
        this.btnAn.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnAn.lastTimeClick < 1000){
                return;
            }
            self.btnAn.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerAnAction();
        });

        mPoint = this.getControlButtonLocation("Duoi");
        this.btnDuoi = createBkButtonPlistNewTitle(res_name.btn_danh, res_name.btn_danh_press, res_name.btn_danh_disable,
            res_name.btn_danh_hover,DUOI,mPoint.x,mPoint.y);
        this.btnDuoi.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnDuoi.lastTimeClick < 1000){
                return;
            }
            self.btnDuoi.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerDuoiAction();
        });

        mPoint = this.getControlButtonLocation("Danh");
        this.btnDanh = createBkButtonPlistNewTitle(res_name.btn_danh, res_name.btn_danh_press, res_name.btn_danh_disable,
            res_name.btn_danh_hover,DANH,mPoint.x,mPoint.y);
        this.btnDanh.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnDanh.lastTimeClick < 1000){
                return;
            }
            self.btnDanh.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerDanhAction();
        });

        mPoint = this.getControlButtonLocation("Chiu");
        this.btnChiu =createBkButtonPlistNewTitle(res_name.btn_an, res_name.btn_an_press, res_name.btn_an_disable,
            res_name.btn_an_hover,CHIU,mPoint.x,mPoint.y);
        this.btnChiu.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnChiu.lastTimeClick < 1000){
                return;
            }
            self.btnChiu.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerChiuAction();
        });

        mPoint = this.getControlButtonLocation("BoChiu");
        this.btnKoChiu = createBkButtonPlistNewTitle(res_name.btn_danh, res_name.btn_danh_press, res_name.btn_danh_disable,
            res_name.btn_danh_hover,BOCHIU,mPoint.x,mPoint.y);
        this.btnKoChiu.addClickEventListener(function()
            {
                if(BkTime.GetCurrentTime() - self.btnKoChiu.lastTimeClick < 1000){
                    return;
                }
                self.btnKoChiu.lastTimeClick = BkTime.GetCurrentTime();
                self.gameTable.ProcessPlayerKoChiuAction();
            });

        mPoint = this.getControlButtonLocation("TraCua");
        this.btnTraCua = createBkButtonPlistNewTitle(res_name.btn_danh, res_name.btn_danh_press, res_name.btn_danh_disable,
            res_name.btn_danh_hover,TRACUA,mPoint.x,mPoint.y);
        this.btnTraCua.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnTraCua.lastTimeClick < 1000){
                return;
            }
            self.btnTraCua.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerTraCuaAction();
        });

        mPoint = this.getControlButtonLocation("Boc");
        this.btnBoc = createBkButtonPlistNewTitle(res_name.btn_boc, res_name.btn_boc_press, res_name.btn_boc_disable,
            res_name.btn_boc_hover,BOC,mPoint.x,mPoint.y);
        this.btnBoc.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnBoc.lastTimeClick < 1000){
                return;
            }
            self.btnBoc.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerBocAction();
        });

        mPoint = this.getControlButtonLocation("U");
        this.btnU = createBkButtonPlistNewTitle(res_name.btn_an, res_name.btn_an_press, res_name.btn_an_disable,
            res_name.btn_an_hover,U,mPoint.x,mPoint.y);
        this.btnU.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnU.lastTimeClick < 1000){
                return;
            }
            self.btnU.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerUAction();
        });

        mPoint = this.getControlButtonLocation("BoU");
        this.btnKoU = createBkButtonPlistNewTitle(res_name.btn_danh, res_name.btn_danh_press, res_name.btn_danh_disable,
            res_name.btn_danh_hover,BOU,mPoint.x,mPoint.y);
        this.btnKoU.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnKoU.lastTimeClick < 1000){
                return;
            }
            self.btnKoU.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerKoUAction();
        });

        this.btnContainer.addChild(this.btnAn);
        this.btnContainer.addChild(this.btnDuoi);
        this.btnContainer.addChild(this.btnBoc);
        this.btnContainer.addChild(this.btnDanh);

        this.btnContainer.addChild(this.btnChiu);
        this.btnContainer.addChild(this.btnKoChiu);
        this.btnContainer.addChild(this.btnTraCua);

        this.btnContainer.addChild(this.btnU);
        this.btnContainer.addChild(this.btnKoU);

        this.InitMask();
        this.initCutonFontButton();
        this.addChild(this.btnContainer);
        this.hidePlayerButton();
        this.initFakeButton();
    },
    initFakeButton:function () {
        var self = this;
        var mPoint = this.getControlButtonLocation("Boc");
        this.fakeBtn1 = createBkButtonPlistNewTitle(res_name.trans_2, res_name.trans_2, res_name.trans_2,
            res_name.trans_2,"",mPoint.x,mPoint.y);
        this.fakeBtn1.addClickEventListener(function() {
        });

        mPoint = this.getControlButtonLocation("An");
        this.fakeBtn2 = createBkButtonPlistNewTitle(res_name.trans_1, res_name.trans_1, res_name.trans_1,
            res_name.trans_1,"",mPoint.x,mPoint.y);
        this.fakeBtn2.addClickEventListener(function() {
        });

        mPoint = this.getControlButtonLocation("Danh");
        this.fakeBtn3 = createBkButtonPlistNewTitle(res_name.trans_1, res_name.trans_1, res_name.trans_1,
            res_name.trans_1,"",mPoint.x,mPoint.y);
        this.fakeBtn3.addClickEventListener(function() {
        });
        var zo = -1;
        this.btnContainer.addChild(this.fakeBtn1,zo);
        this.btnContainer.addChild(this.fakeBtn2,zo);
        this.btnContainer.addChild(this.fakeBtn3,zo);
        this.fakeBtn1.removeMouseHover();
        this.fakeBtn2.removeMouseHover();
        this.fakeBtn3.removeMouseHover();

    },
    initCutonFontButton:function () {
        this.btnAn.setTitleFontName("BRUSHSBI");
        this.btnDuoi.setTitleFontName("BRUSHSBI");
        this.btnBoc.setTitleFontName("BRUSHSBI");
        this.btnDanh.setTitleFontName("BRUSHSBI");

        this.btnChiu.setTitleFontName("BRUSHSBI");
        this.btnKoChiu.setTitleFontName("BRUSHSBI");
        this.btnTraCua.setTitleFontName("BRUSHSBI");

        this.btnU.setTitleFontName("BRUSHSBI");
        this.btnKoU.setTitleFontName("BRUSHSBI");

        this.btnBocCentrer.setTitleFontName("BRUSHSBI");

        var fontsize = 22;
        this.btnAn.setTitleFontSize(fontsize);
        this.btnDuoi.setTitleFontSize(fontsize);
        this.btnBoc.setTitleFontSize(fontsize);
        this.btnDanh.setTitleFontSize(fontsize);

        var fontsize2 = 18;
        this.btnChiu.setTitleFontSize(fontsize2);
        this.btnKoChiu.setTitleFontSize(fontsize2);
        this.btnTraCua.setTitleFontSize(fontsize2);

        var fontsize3 = 22;
        this.btnU.setTitleFontSize(fontsize3);
        this.btnKoU.setTitleFontSize(fontsize3);

        var fontsize4 = 26;
        this.btnBocCentrer.setTitleFontSize(fontsize4);
    },

    hidePlayerButton:function()
    {
        this.btnBocCentrer.setVisibleButton(false);
        this.btnAn.setVisibleButton(false);
        this.btnDanh.setVisibleButton(false);
        this.btnBoc.setVisibleButton(false);
        this.btnDuoi.setVisibleButton(false);
        this.btnChiu.setVisibleButton(false);
        this.btnKoChiu.setVisibleButton(false);
        this.btnTraCua.setVisibleButton(false);
        this.btnU.setVisibleButton(false);
        this.btnKoU.setVisibleButton(false);
        this.hideAllMask();
    },
    InitMask:function(){

    },
    hideAllMask:function(){

    },
    visibleMask:function(){

    },
    getControlButtonLocation:function(btnName)
    {
        var mPoint = cc.p(c.WINDOW_WIDTH / 2 + 15, c.WINDOW_HEIGHT - 90);
        switch (btnName) {
            case "An":
            case "Chiu":
            case "U":
                mPoint.x = mPoint.x - 99 - 2.7;
                mPoint.y = mPoint.y - 23.5;
                break;
            case "Boc":
                mPoint.x = mPoint.x - 40;
                mPoint.y = mPoint.y - 81;//89.4;
                break;
            case "Danh":
            case "Duoi":
            case "BoChiu":
            case "BoU":
            case "TraCua":
                mPoint.x = mPoint.x + 21;
                mPoint.y = mPoint.y - 23.5;
                break;
            default:
                mPoint.x = c.WINDOW_WIDTH / 2;
                mPoint.y = c.WINDOW_HEIGHT / 2;
        }
        mPoint.x += 40;
        mPoint.y -= 32;
        return CConstIngame.convertYPosFlashToYPosCocosJS(mPoint);
    },
    showNoc:function()
    {
        this.NocText.setString("" + this.gameTable.getNoc());
        this.NocText.visible = true;
        this.NocBackGround.visible = true;
        if (this.gameTable.getMyClientState().isPlaying) {
            this.btnBocCentrer.visible = true;
        } else {
            this.btnBocCentrer.visible = false;
        }
    },
    OnPlayerError:function(serverPos,strError)
    {
        logMessage("OnPlayerError"+serverPos);
        var displayPos = this.gameTable.getPlayerDisplayLocation(serverPos)+1;
        if (this.PlayerAvatar == null) {
            return;
        }
        var pAvatar = this.PlayerAvatar[displayPos -1];
        pAvatar.setBao(strError);
    },
    OnTableSys:function(isChiu, chiuStatus, chiuPos)
    {
        var gs;
        gs=this.gameTable.getPlayerState();
        var i;
        var card = null;
        var player;
        var gameStatus = this.gameTable.gameStatus;
        this.isDealingCard = false;
        this.clearXuongCuocWindow();
        // if (gs == STATE_WAIT_XUONG){
        //     logMessage("gs == STATE_WAIT_XUONG");
        //     if (this.gameTable.IAmActive()){
        //         this.showXuongCuoc();
        //     }
        // }
        for (i=0;i< gs.length; i++){
            player = gs[i];

            //traceOnGamePlayer(player);

            var locationID = this.gameTable.getPlayerDisplayLocation(player.serverPosition) + 1;
            logMessage(" locationID: "+locationID);
            var mypos = this.gameTable.getMyPos();
            // ShowOnHandCard
            if (mypos == player.serverPosition  && player.isPlaying)
            {
                player.sortCardOnHand();
                card = player.getLeftMostOnHandCards();
                //his.DisplayListOnHandCard(player.onhandCardList);
                //var player = this.gameTable.getMyClientState();
                //this.UpdateXoeQuat(player,IGC.DURATION_ANI_XOEQUAT);
                var cPoint = cc.p(IGC.CENTER_CIR_X,IGC.CENTER_CIR_Y);
                this.DisplayXoeQuat(player.onhandCardList,cPoint, 100, false);
                this.showNoc();
            }

            // draw cards eat
            this.DisplayListEatCards(locationID,player.getListEatCards());

            // draw cards play
            this.DisplayListPlayCards(locationID,player.getListPlayCards());

            // Show button an, chiu, u, duoi
            if (locationID == 1) {
                if (player.isPlaying) {
                    this.showPlayerButton();
                } else {
                    this.showOngameButton();
                }
            }
        }

        player = this.gameTable.getMyClientState();

        if (player.isPlaying) {
            // Thiet lap trang thai nut bam cho nguoi choi
            this.disablePlayerNormalButton();
            if (isChiu==1 && chiuPos == this.gameTable.getMyClientState().serverPosition) {
                if (chiuStatus == STATE_CHAN_WAIT_CHIU) {
                    this.showChiuMenu(IGC.STATE_SHOW_CHIU);
                } else if (chiuStatus == STATE_CHAN_WAIT_TRA_CUA) {
                    this.showChiuMenu(IGC.STATE_TRA_CUA);
                }
            } else if (this.gameTable.IAmActive()) {
                if (this.gameTable.gameStatus == STATE_WAIT_TAKE_CARD) {
                    this.updatePlayerButton(IGC.ACTION_BOC);
                } else if (this.gameTable.gameStatus == STATE_WAIT_PICK_CARD) {
                    this.updatePlayerButton(IGC.ACTION_ACTIVE);
                } else if (this.gameTable.gameStatus == STATE_WAIT_DISCARD) {
                    this.updatePlayerButton(IGC.ACTION_AN);
                } else if (this.gameTable.gameStatus == STATE_WAIT_BOC_CAI) {
                    this.updatePlayerButton(IGC.ACTION_AN);
                }
            }
        }

        if (player.isPlaying && this.gameTable.hasChiu) {
            logMessage("has chiu "+gameStatus);
            if (gameStatus != STATE_WAIT_XUONG){
                logMessage("gs != STATE_WAIT_XUONG");
                this.displayChiu((new BkChanCard(this.gameTable.currentCard)).getServerCardID());
            }
        }

        if (this.gameTable.isInGameProgress()) {
            this.resetCountdown();
        }
    },
    resetCountdown:function(timeOut)
    {
        if (timeOut == undefined){
            timeOut = -1;
        }
        if (this.PlayerAvatar == null) {
            return;
        }

        if (timeOut == -1) {
            timeOut = this.gameTable.getTimeForCountDown();
        }

        this.ShowCicleCountDownTimeOnActivePlayer(timeOut);

        var pos = this.gameTable.getPlayerDisplayLocation(this.gameTable.activePlayerPosition) + 1;
        var pAvatar;

        pAvatar = this.PlayerAvatar[pos -1];
        if (pAvatar != null) {
            pAvatar.isActive= true;
            pAvatar.show();
        }
    },
    displayChiu:function(cardID,isBoU)
    {

        if (this.gameTable.ICanChiu(cardID))
        {
            logMessage(" ICanChiu ");
            if ((!this.gameTable.ICanU(cardID)) || (isBoU)){
                logMessage(" Toi Khong the U hoac toi bo U-> show animation Chiu ");
                this.showBaoChiuAnimation();
            } else {
                logMessage(" Toi co the U -> show animation Chiu sau x Sec");
                var self = this;
                f= function(){
                    self.showBaoChiuAnimation();
                };
                Util.postDelay(this,1,f);
            }
            // Neu current player co the chiu
            this.showChiuMenu(IGC.STATE_SHOW_CHIU);

            this.resetSpecialCountdown(10);
        } else if (this.gameTable.IAmActive())
        {
            // Neu current player la nguoi active
            this.stopAllPlayerCountdown();
        } else {
            this.resetCountdown();
        }
    },
    updatePlayerButton:function(currentAction)
    {

        this.visibleMask();
        this.disablePlayerNormalButton();

        this.currentAction = currentAction;

        // Neu minh bi bao thi ko update trang thai nut bam cua minh
        var myPlayer = this.gameTable.getMyClientState();

        if (myPlayer.Fault) {
            // Khi an bi bao thi van cho phep nguoi dung danh di mot cay
            if (currentAction != IGC.ACTION_AN) {
                return;
            }
        }
        switch(currentAction) {
            case IGC.ACTION_STARTGAME:
                if (this.gameTable.IAmActive()) {
                    this.ShowBGDisableSmallAvar(false);
                    this.btnDuoi.setVisibleButton(false);
                    this.btnDanh.setVisibleButton(true);
                    this.btnAn.SetEnable(false);
                    this.btnBoc.SetEnable(false);
                    this.btnBocCentrer.SetEnable(false);
                    this.btnDanh.SetEnable(true);
                }
                break;
            case IGC.ACTION_AN:
                this.ShowBGDisableSmallAvar(false);
                this.btnDuoi.setVisibleButton(false);
                this.btnDanh.setVisibleButton(true);
                this.btnDanh.SetEnable(true);
                break;
            case IGC.ACTION_BOC:
                this.ShowBGDisableSmallAvar(false);
                this.btnDanh.setVisibleButton(false);
                this.btnDuoi.setVisibleButton(true);
                this.btnAn.SetEnable(true);
                this.btnDuoi.SetEnable(true);
                break;
            case IGC.ACTION_ACTIVE:
                this.ShowBGDisableSmallAvar(false);
                this.btnBoc.setVisibleButton(true);
                this.btnBocCentrer.setVisibleButton(true);
                this.btnAn.setVisibleButton(true);
                this.btnDuoi.setVisibleButton(true);
                this.btnDanh.setVisibleButton(false);
                this.btnTraCua.setVisibleButton(false);
                this.btnBoc.SetEnable(true);
                this.btnBocCentrer.SetEnable(true);
                this.btnAn.SetEnable(true);
                this.btnDuoi.SetEnable(false);
                break;
            case IGC.ACTION_TRACUA:
                this.ShowBGDisableSmallAvar(false);
                this.btnDuoi.setVisibleButton(false);
                this.btnDanh.setVisibleButton(true);
                this.btnTraCua.setVisibleButton(true);
                this.btnTraCua.SetEnable(true);

            case IGC.ACTION_DANH:
            case IGC.ACTION_DUOI:
            case IGC.ACTION_LOST_ACTIVE:
                break;
        }
    },
    InitNoc:function()
    {
        this.NocBackGround = new BkSprite("#"+res_name.dia_noc_2);
        this.NocBackGround.visible = false;
        this.NocBackGround.x = this.getNocLocation().x;//c.WINDOW_WIDTH * 0.5 - 20;
        this.NocBackGround.y = this.getNocLocation().y;//c.WINDOW_HEIGHT * 0.5;//CConstIngame.convertYPosFlashToYPosCocosJSForSprite(c.WINDOW_HEIGHT * 0.5 - 90);

        this.NocText = new BkLabel("", "", 14);
        this.NocText.visible = false;
        this.NocText.x = this.NocBackGround.x + 30;
        this.NocText.y = this.NocBackGround.y + 32;

        var self = this;
        this.btnBocCentrer = createBkButtonPlistNewTitle(res_name.btn_boc_center, res_name.btn_boc_center_press, res_name.btn_boc_center_disable,
            res_name.btn_boc_center_hover,"Bốc",0,0);
        this.btnBocCentrer.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnBocCentrer.lastTimeClick < 1000){
                return;
            }
            self.btnBocCentrer.lastTimeClick = BkTime.GetCurrentTime();
            self.gameTable.ProcessPlayerBocAction();
        });
        this.btnBocCentrer.x = this.NocBackGround.x-4;
        this.btnBocCentrer.y = this.NocBackGround.y-5;
        logMessage("NocBackGround.x: "+this.NocBackGround.x+" NocBackGround.y: "+this.NocBackGround.y
            +" btnBocCentrer.x: "+this.btnBocCentrer.x+" btnBocCentrer.y: "+this.btnBocCentrer.y);
        this.btnBocCentrer.setVisibleButton(false);

        this.addChild(this.NocBackGround);
        this.addChild(this.NocText);
        this.addChild(this.btnBocCentrer);
    },
    ShowBGDisableSmallAvar:function(isVisi){
        var pAvatar = this.PlayerAvatar[0];
        if (pAvatar!= null){
            pAvatar.setSmallAvatarDisable(isVisi);
        }
    },
    showChiuMenu:function(state)
    {
        switch (state) {
            case IGC.STATE_SHOW_CHIU:
                this.btnChiu.SetEnable(true);
                this.btnKoChiu.SetEnable(true);
                this.btnChiu.setVisibleButton(true);
                this.btnKoChiu.setVisibleButton(true);
                this.btnTraCua.setVisibleButton(false);
                this.btnBoc.SetEnable(false);
                this.btnBocCentrer.SetEnable(false);
                break;
            case IGC.STATE_TRA_CUA:
                this.btnChiu.setVisibleButton(false);
                this.btnKoChiu.setVisibleButton(false);
                this.btnTraCua.setVisibleButton(true);
                this.btnTraCua.SetEnable(true);
                this.resetCountdown();
                this.hideBaoChiuAnimation();
                break;
            case IGC.STATE_NORMAL:
                this.btnChiu.setVisibleButton(false);
                this.btnKoChiu.setVisibleButton(false);
                this.btnTraCua.setVisibleButton(false);
                this.hideBaoChiuAnimation();
        }
    },
    hideBaoChiuAnimation:function(){
        if (this.chiuAnimationSprite!=null){
            this.chiuAnimationSprite.removeFromParent();
            this.chiuAnimationSprite = null;
        }
    },
    showBaoChiuAnimation:function(){
        var gameSTT = this.gameTable.gameStatus;
        if (gameSTT == STATE_WAIT_XUONG){
            return;
        }
        if (!this.gameTable.isInGameProgress()){
            return;
        }

        if (this.UAnimationSprite != null){
            return;
        }
        this.hideBaoChiuAnimation();
        this.chiuAnimationSprite = new BkChiuUAnimation(0);
        this.addChild(this.chiuAnimationSprite);
        this.chiuAnimationSprite.showAnimation();
    },
    // hien animation khi co the U
    hideBaoUAnimation:function(){
        if (this.UAnimationSprite!=null){
            this.UAnimationSprite.removeFromParent();
            this.UAnimationSprite = null;
        }
    },
    showBaoUAnimation:function(){
        this.hideBaoChiuAnimation();
        this.hideBaoUAnimation();
        this.UAnimationSprite = new BkChiuUAnimation(1);
        this.UAnimationSprite.showAnimation();
        this.addChild(this.UAnimationSprite);
    },
    disablePlayerNormalButton:function()
    {
        this.ShowBGDisableSmallAvar(true);
        this.btnAn.SetEnable(false);
        this.btnDuoi.SetEnable(false);
        this.btnBoc.SetEnable(false);
        this.btnBocCentrer.SetEnable(false);
        this.btnDanh.SetEnable(false);
        this.btnBocCentrer.SetEnable(false);
    },
    hideOngameButton:function()
    {
        this.hideStartGameButton();
    },
    _initStartGameButton:function(){
        logMessage("_initStartGameButton");
        if (this.btnStartGame != null){
            this.btnStartGame.removeFromParent();
            this.btnStartGame = null;
        }

        if (this.btnReady != null){
            this.btnReady.removeFromParent();
            this.btnReady = null;
        }
        var size = cc.winSize;
        var xPos = IGC.CENTER_CIR_X;//size.width/2;
        var yPos = size.height/2 - 80;

        var  self = this;
        this.btnStartGame = createBkButtonPlistNewTitle(res_name.vv_btn_big_normal, res_name.vv_btn_big_press
            , res_name.vv_btn_big_normal, res_name.vv_btn_big_hover,"Bắt đầu",size.width/2,size.height/2);
        // Util.setBkButtonShadow(this.btnStartGame);
        this.btnStartGame.setTitleColor(cc.color.BLACK);
        // this.btnStartGame.setTitleFontSize(18);
        this.btnStartGame.x = xPos;
        this.btnStartGame.y = yPos;
        this.btnStartGame.setVisibleButton(false);
        this.addChild(this.btnStartGame);
        this.btnStartGame.addClickEventListener(function()
        {
            logMessage("this.btnStartGame .....");
            if(BkTime.GetCurrentTime() - self.btnStartGame.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnStartGame.lastTimeClick = BkTime.GetCurrentTime();
            self.onStartGame();
        });

        this.btnReady = createBkButtonPlistNewTitle(res_name.vv_btn_big_normal, res_name.vv_btn_big_press
            , res_name.vv_btn_big_normal, res_name.vv_btn_big_hover,"Sẵn sàng",size.width/2,size.height/2);
        // Util.setBkButtonShadow(this.btnReady);
        this.btnReady.setTitleColor(cc.color.BLACK);
        // this.btnReady.setTitleFontSize(18);
        this.btnReady.x = xPos;
        this.btnReady.y = yPos;
        this.addChild(this.btnReady);
        this.btnReady.setVisibleButton(false);

        this.btnReady.addClickEventListener(function()
        {
            logMessage("this.btnReady .....");
            if(BkTime.GetCurrentTime() - self.btnReady.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnReady.lastTimeClick = BkTime.GetCurrentTime();
            self.onReady();
        });
    },
    showStartGameButton:function(){
        this._initStartGameButton();
        this._super();
        if (this.UConfirmDialog!= null){
            logMessage("an start game button");
            this.hideStartGameButton();
            this.countdownText.y = 45 + 15;
            if(this.isVisibleSharebtn )
            {
                this.countdownText.x = 550+15 + 60;
            }else
            {
                this.countdownText.x = 550+15 + 10;
            }

            this.countdownText.setScale(0.7);
        }
    },
    showOngameButton:function()
    {
        this.enableEventStartGameButton();
        this.showStartGameButton();
    },
    showPlayerButton:function()
    {

        var pAvatar = this.PlayerAvatar[0];
        pAvatar.setType(1);
        this.setChildIndex(pAvatar,this.getChildrenCount() - 1);

        this.setChildIndex(this.btnContainer, this.getChildrenCount() - 1);

        this.btnAn.setVisibleButton(true);
        this.btnDuoi.setVisibleButton(true);
        this.btnBoc.setVisibleButton(true);
        this.btnDanh.setVisibleButton(false);
    },
    DisplayListEatCards:function(pos, listEatCards){
        var i;
        for(i=0; i<listEatCards.length; i++){
            var ca = listEatCards[i];
            var location =CConstIngame.getEatCardPos(pos, i);
            ca.y = location.y;
            ca.x = location.x;
            this.addChild(ca);
        }
    },
    DisplayListPlayCards:function(pos, listPlayCards)
    {
        var loc;
        var i;
        for (i=0;i<listPlayCards.length;i++){

            // Get display location
            loc= CConstIngame.getPlayedCardPos(pos, i);

            var ca = listPlayCards[i];
            ca.y = loc.y;
            ca.x = loc.x;
            this.addChild(ca);
        }
    },
    DisplayListOnHandCard:function(arrCardOnHand,callback)
    {
        logMessage("IGC.CENTER_CIR_X "+IGC.CENTER_CIR_X);
        var cPoint = cc.p(IGC.CENTER_CIR_X,IGC.CENTER_CIR_Y);
        this.DisplayXoeQuat(arrCardOnHand,cPoint, 100, true,callback);
    },
    DisplayXoeQuat:function(listCard,centerPoint,radius,isAnimation,callback){
        var i;
        for (i=0;i<listCard.length;i++){
            var ca = listCard[i];
            this.addChild(ca);
            ca.setVisible(false);
            this.ConfigCard(i,listCard.length,ca,centerPoint, radius, isAnimation);
            if (i == (listCard.length -1)){
                if (isAnimation){
                    if (callback){
                        ca.setCallbackXoeQuatFinish(callback);
                    }
                }
            }
        }
    },
    ConfigCard:function(i, CardsNumber, ca, cPoint, radius,isAnimation){
        var totalDegrees =  CardsNumber*CCard.DEGREES_PER_CARD;
        // is degrees of Z axis and the symmetry axis of card
        var anphaCard;
        if (CardsNumber % 2 == 0){
            anphaCard = -totalDegrees/2 + CCard.DEGREES_PER_CARD/2;
        } else {
            anphaCard = -((CardsNumber -1)/2)*CCard.DEGREES_PER_CARD;
        }

        anphaCard += i*CCard.DEGREES_PER_CARD;
        ca.OnHandCardRotate(anphaCard, cPoint, radius,isAnimation);
    },
    OnGotActive:function(){
        this.updatePlayerButton(IGC.ACTION_ACTIVE);
    },
    setChildIndex:function(target,zOrd){
        if (target.getLocalZOrder() != zOrd){
            target.setLocalZOrder(zOrd);
        }
    },
    OnDiscardCard:function(playerPos, card, index, isMe)
    {
        var eventCard = card;

        //eventCard.addEventListener(CCardEvent.ANIMATION_FINISHED, OnGuiUpdateCompleted);

        var locID = this.gameTable.getPlayerDisplayLocation(playerPos);
        locID += 1;
        if (!isMe)
        {
            this.addChild(card);
            var uPoint = CConstIngame.getPlayerAvatarPos(locID);
            card.x = uPoint.x;
            card.y = uPoint.y;
        } else {
            card.setRotation(0);
            if (this.isContains(card)){
                this.setChildIndex(card, this.getChildrenCount() -1);
            }
        }

        var location = CConstIngame.getPlayedCardPos(locID,index);

        // don bai neu tren ban da co qua nhieu bai
        var maxCard = CConstIngame.MAX_NUMBER_DISCARD_CARDS;
        if (locID == 4){
            maxCard += 1;
        }
        if (index > maxCard){
            this.DrawListDiscardCards(playerPos,locID,index);
        } else {
            var self = this;
            var f = function(){
                self.gameTable.processNextEventInQueue();
            };
            card.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD,f);
        }

        if (isMe) {
            var player = this.gameTable.getMyClientState();
            this.UpdateXoeQuat(player,IGC.DURATION_ANI_XOEQUAT);

            this.updatePlayerButton(IGC.ACTION_DANH);
        }

        if (this.gameTable.hasChiu == 1) {
            this.displayChiu(card.getServerCardID());
        } else {
            this.resetCountdown();
        }
    },
    DrawListDiscardCards:function(playerPos,locID, index){
        var listDiscard =  this.gameTable.getPlayer(playerPos).getListPlayCards();
        var widthCardNomal = CCard.CARD_SIZE_NORMAL_WIDTH - CConstIngame.DELTA_X;
        var delta = (widthCardNomal * (index+1 - CConstIngame.MAX_NUMBER_DISCARD_CARDS)) / (index+1) ;
        if ((locID ==2)||(locID == 3)){
            delta = -delta;
        }
        if (listDiscard!=null){
            for (var i = 1;i<listDiscard.length;i++){
                var iLoc = CConstIngame.getPlayedCardPos(locID,i);
                var iCard = listDiscard[i];

                var f = null;
                if (i == listDiscard.length -1){
                    var self = this;
                    f = function(){
                        self.gameTable.processNextEventInQueue();
                    }
                }

                iCard.moveTo(iLoc.x - i*delta,iLoc.y,IGC.DURATION_ANIMATION_CARD,f);
            }
        }
    },
    UpdateXoeQuat:function(player, duration)
    {
        if (duration == undefined){
            duration = 0.5;
        }

        player.sortCardOnHand();
        var arrCardOnHand = player.getListOnHandCards();
        var i;
        var cPoint = cc.p(IGC.CENTER_CIR_X, IGC.CENTER_CIR_Y);

        this.sortDisplayLevel(arrCardOnHand);


        logMessage("set pos list card");
        for (i=0;i<arrCardOnHand.length;i++){
            ca = arrCardOnHand[i];
            this.ConfigCard(i,arrCardOnHand.length,ca,cPoint, 100, false);
        }
    },
    sortDisplayLevel:function(arrCardOnHand)
    {
        var i;
        var cardI;
        var minZo = arrCardOnHand[0].getLocalZOrder();
        for (i=0; i < arrCardOnHand.length; i++){
            cardI = arrCardOnHand[i];
            if (minZo > cardI.getLocalZOrder()){
                minZo = cardI.getLocalZOrder()
            }
        }
        for (i=0; i < arrCardOnHand.length; i++){
            cardI = arrCardOnHand[i];
            this.setChildIndex(cardI,minZo + i);
        }
    },
    onUpdateTableMoneyStatus:function(){
        this.OnUpdateTableMoneyStatus();
    },
    OnUpdateTableMoneyStatus:function()
    {
        var tablebetM = this.getLogic().tableBetMoney;
        this.txtBetMoneyChan.setString(convertStringToMoneyFormat(tablebetM,true));
        if (this.gameTable.gaGop) {
            this.setIsSelectBtnGa(true);
            this.txtGaGop.setString("" + this.gameTable.tongGa);
            this.txtGaGop.visible = true;
            this.txtGaGop.setTextColor(cc.color(0xFC,0xBB,0x38));//0xFCBB38
        } else {
            this.setIsSelectBtnGa(false);
            this.txtGaGop.setString("gà đang tắt");
            this.txtGaGop.setTextColor(cc.color(0x80,0x80,0x80));
        }

        this.imgCoinChan.setVisibleButton(true);
        this.txtBetMoneyChan.visible = true;
        // config posX
        this.txtBetMoneyChan.x = this.imgCoinChan.x + 15 + this.txtBetMoneyChan.getContentSize().width/2;
        this.txtGaGop.x =  this.imgChicken.x +15 + this.txtGaGop.getContentSize().width/2;
    },
    OnPickCard:function(playerPos, card, index, isMe)
    {
        card.setCardStatus(CCard.CARD_STATUS_ONTABLE_BOC);
        this.gameTable.updateSizeForCurrentCard();
        //card.addEventListener(CCardEvent.ANIMATION_FINISHED, OnGuiUpdateCompleted);

        this.addChild(card);
        var locID = this.gameTable.getPlayerDisplayLocation(playerPos)+1;
        var location = CConstIngame.getPlayedCardPos(locID,index);
        var NocPoint = this.getNocLocation();

        card.x = NocPoint.x;
        card.y = NocPoint.y;
        var maxCard = CConstIngame.MAX_NUMBER_DISCARD_CARDS;
        if (locID == 4){
            maxCard += 1;
        }

        // don bai neu tren ban da co qua nhieu bai
        if (index > maxCard){
            this.DrawListDiscardCards(playerPos,locID,index);
        } else {
            var self = this;
            var f = function(){
                self.gameTable.processNextEventInQueue();
            };
            card.moveTo(location.x,location.y,IGC.DURATION_ANIMATION_CARD,f);
        }

        this.showNoc();
        if (isMe) {
            this.updatePlayerButton(IGC.ACTION_BOC);
        }

        if (this.gameTable.hasChiu == 1) {
            this.displayChiu(card.getServerCardID());
        } else {
            this.resetCountdown();
        }


        //if (chatBox != null){
        //    if (chatBox.isShowQuickChatOrEmo()){
        //        setChildIndex(chatBox,numChildren - 1);
        //    }
        //}
    },
    getNocLocation:function()
    {
        return cc.p(c.WINDOW_WIDTH / 2 + 15,c.WINDOW_HEIGHT / 2 + 10);
    },
    OnTakeCard:function(playerPos, card1, card2, index, isMe)
    {
        var locID = this.gameTable.getPlayerDisplayLocation(playerPos)+1;

        //var eventCard = card1;
        //eventCard.addEventListener(CCardEvent.ANIMATION_FINISHED, OnGuiUpdateCompleted);

        if (!isMe) {
            this.addChild(card1);
            var uPoint = CConstIngame.getPlayerAvatarPos(locID);

            card1.x = uPoint.x;
            card1.y = uPoint.y;
        } else {
            card1.setRotation(0);
            this.setChildIndex(card1, this.getChildrenCount() -1);
        }

        var takeCardPlayer = this.gameTable.getPlayer(playerPos);

        var location = CConstIngame.getEatCardPos(locID,index,takeCardPlayer.chiuCount);
        card2.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD);
        var self = this;
        var f = function(){
            self.gameTable.processNextEventInQueue();
        };
        location = CConstIngame.getEatCardPos(locID,index+1,takeCardPlayer.chiuCount);
        card1.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD,f);

        // truongbs++ set Zoder cho cay an tu tay cao hoan current card (khong de loi trai vi)
        var zOrdercard2 = card2.getLocalZOrder();
        this.setChildIndex(card1, zOrdercard2 + 1);

        if (isMe) {
            var player = this.gameTable.getMyClientState();
            this.UpdateXoeQuat(player,IGC.DURATION_ANI_XOEQUAT);

            this.updatePlayerButton(IGC.ACTION_AN);
        }
        this.resetCountdown();
    },
    OnDealCard:function(activePlayer, bocCaiPos, cai, onHandCard)
    {
        BkLogicManager.getInGameLogic().UBytesData = null;
        this.removeCountDownText();

        var activePlayerPos = this.gameTable.getPlayerDisplayLocation(activePlayer)+1;

        logMessage("Chia bai: Boc cai " + bocCaiPos + " cai: " + cai);
        this.showOngameButton();

        this.bocCaiCard = new BkChanCard(cai);
        this.rotateCount = activePlayerPos;
        this.bocCaiName = this.gameTable.getPlayer(bocCaiPos).getName();
        this.bocCaiPos = this.getClientPosFromName(this.bocCaiName);
        logMessage("Chia bai: Boc cai " + this.bocCaiPos);
        this.bocCaiPoint = CConstIngame.getToolTipBocCaiPoint(this.bocCaiPos);
        this.DivideCards(onHandCard);
        this.isDealingCard = true;
    },
    getClientPosFromName:function(name){
        for (var i= 0 ; i<this.PlayerAvatar.length;i++){
            var iPlayer = this.PlayerAvatar[i];
            var iName = iPlayer.getPlayerName();
            if (iName != null){
                if (iName == name){
                    return i+1;
                }
            }
        }
        return 1;
    },
    DivideCards:function(onHandCard){
        var dlc = new BkDealingCard(this.gameTable,this,this.bocCaiCard,this.bocCaiName,this.bocCaiPoint
            ,this.bocCaiPos,this.rotateCount,this.PlayerAvatar);
        dlc.doAnimationDealCard();
    },
    InitAfterDealingCards:function(onHandCard)
    {
        var self = this;
        var f = function () {
            logMessage("xoe quat finish -> processNextEvent");
            self.gameTable.processNextEventInQueue();
        };
        this.DisplayListOnHandCard(onHandCard,f);

        this.showOngameButton();

        this.showPlayerButton();

        this.updatePlayerButton(IGC.ACTION_STARTGAME);

        this.resetCountdown();

        this.isDealingCard = false;

        this.showNoc();

        hideToastMessage()
    },
    resumeGameAfterNotChiu:function(serverPos)
    {
        // Thuc hien khi nguoi choi khong chiu
        if (this.gameTable.getMyPos() == serverPos) {
            this.showChiuMenu(IGC.STATE_NORMAL);
            this.resetCountdown();
        }
        if (this.gameTable.IAmActive()) {
            this.resetCountdown();
            this.updatePlayerButton(this.getCurrentActionState());
        }
    },
    getCurrentActionState:function()
    {
        return this.currentAction;
    },
    OnLostActiveByChiu:function()
    {
        var retVal = this.currentAction;
        this.updatePlayerButton(IGC.ACTION_LOST_ACTIVE);
        return retVal;
    },
    OnChiuCard:function(ServerPos, card1, card2, card3, card4, index, isMe)
    {
        var chiuPlayer = this.gameTable.getPlayerByServerPos(ServerPos);
        var locID = this.gameTable.getPlayerDisplayLocation(ServerPos)+1;
        //var eventCard:CCard = card2;
        //eventCard.addEventListener(CCardEvent.ANIMATION_FINISHED, OnGuiUpdateCompleted);


        if (!isMe) {
            var uPoint = CConstIngame.getPlayerAvatarPos(locID);
            card1.x = uPoint.x;
            card1.y = uPoint.y;
            card2.x = uPoint.x;
            card2.y = uPoint.y;
            card3.x = uPoint.x;
            card3.y = uPoint.y;
            this.addChild(card1);
            this.addChild(card2);
            this.addChild(card3);
        } else {
            card1.setRotation(0);
            card2.setRotation(0);
            card3.setRotation(0);
            this.setChildIndex(card1, this.getChildrenCount() -3);
            this.setChildIndex(card2, this.getChildrenCount() -2);
            this.setChildIndex(card3, this.getChildrenCount() -1);
        }
        this.setChildIndex(card4, this.getChildrenCount() -1);
        var location = CConstIngame.getEatCardPos(locID,index-2,chiuPlayer.chiuCount-1,0);
        card1.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD);

        location = CConstIngame.getEatCardPos(locID,index-1,chiuPlayer.chiuCount-1,1);
        card2.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD);


        location = CConstIngame.getEatCardPos(locID,index,chiuPlayer.chiuCount-1,2);
        card3.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD);

        var self = this;
        var f = function(){
            self.gameTable.processNextEventInQueue();
        };
        location = CConstIngame.getEatCardPos(locID,index+1,chiuPlayer.chiuCount-1,3);
        card4.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD,f);

        if (isMe) {
            var player = this.gameTable.getMyClientState();

            this.UpdateXoeQuat(player,IGC.DURATION_ANI_XOEQUAT);

            this.showChiuMenu(IGC.STATE_TRA_CUA);
        }
        logMessage("Reset timeout for tracua");
        this.resetCountdown(IGC.TRACUA_TIMEOUT);

    },
    OnResumePlayerButtonAfterChiu:function(action)
    {
        this.updatePlayerButton(action);
    },
    OnDiablePlayerButton:function()
    {
        this.disablePlayerNormalButton();
    },
    OnTraCua:function(tracuaPos, chiuPos, card, index, isMe)
    {
        var tracuaLoc = this.gameTable.getPlayerDisplayLocation(tracuaPos)+1;
        var chiuLoc = this.gameTable.getPlayerDisplayLocation(chiuPos)+1;

        //var eventCard:CCard = card;
        //eventCard.addEventListener(CCardEvent.ANIMATION_FINISHED, OnGuiUpdateCompleted);

        if (!isMe)
        {
            this.addChild(card);
            var uPoint = CConstIngame.getPlayerAvatarPos(chiuLoc);
            card.x = uPoint.x;
            card.y = uPoint.y;
        } else {
            card.setRotation(0);
            this.setChildIndex(card, this.getChildrenCount() -1);
        }

        var location = CConstIngame.getPlayedCardPos(tracuaLoc,index);

        // don bai neu tren ban da co qua nhieu bai
        var maxCard = CConstIngame.MAX_NUMBER_DISCARD_CARDS;
        if (tracuaLoc == 4){
            maxCard += 1;
        }
        if (index > maxCard){
            this.DrawListDiscardCards(tracuaPos,tracuaLoc,index);
        } else {
            var self = this;
            var f = function(){
                self.gameTable.processNextEventInQueue();
            };
            card.moveTo(location.x, location.y,IGC.DURATION_ANIMATION_CARD,f);
        }

        if (isMe) {
            var player = this.gameTable.getMyClientState();
            this.UpdateXoeQuat(player,IGC.DURATION_ANI_XOEQUAT);
            this.showChiuMenu(IGC.STATE_NORMAL);
        }

        if (this.gameTable.hasChiu == 1) {
            this.displayChiu(card.getServerCardID());
        } else {
            this.resetCountdown();
        }
    },
    resetSpecialCountdown:function(timeout){
        // TODO: override if need...
        this.resetCountdown(timeout);
    },
    ShowUConfirmMenu:function()
    {
        this.showBaoUAnimation();
        this.btnU.SetEnable(true);
        this.btnKoU.SetEnable(true);
        this.btnU.setVisibleButton(true);
        this.btnKoU.setVisibleButton(true);
        this.resetSpecialCountdown(IGC.U_TIMEOUT);
        //OnGuiUpdateCompleted(null);
    },
    HideUConfirmMenu:function()
    {
        this.hideBaoUAnimation();
        this.btnU.setVisibleButton(false);
        this.btnKoU.setVisibleButton(false);
    },
    OnForfeit:function(isMe)
    {
        if (isMe) {
            this.updatePlayerButton(IGC.ACTION_DUOI);
        }
        this.resetCountdown();
        //OnGuiUpdateCompleted(null);
    },
    clearCurrentGameGui:function(){
        this._super();
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            playeri.clearAllCard();
        }
        this.hidePlayerButton();
        this.clearShowU();
        this.clearUText();
        this.hideNoc();
        this.removeUCofirmDialog();

        var pAvatar = this.PlayerAvatar[0];
        if (pAvatar!= null){
            pAvatar.setType(0);
        }
    },
    stopAllPlayerCountdown:function(){
        this.resetAllPlayerAvatar();
    },
    //showNoc:function()
    //{
    //    this.NocText.setString("" + this.gameTable.getNoc());
    //    this.NocText.visible = true;
    //    this.NocBackGround.visible = true;
    //    if (this.gameTable.getMyClientState().isPlaying) {
    //        this.btnBocCentrer.setVisibleButton(true);
    //    } else {
    //        this.btnBocCentrer.setVisibleButton(false);
    //    }
    //},
    hideNoc:function()
    {
        this.NocText.visible = false;
        this.NocBackGround.visible = false;
        this.btnBocCentrer.setVisibleButton(false);
    },
    showU:function(serverPos, NocCards, onHandCard, TakenList, uCard)
    {
        this.hideBaoChiuAnimation();
        this.stopAllPlayerCountdown();
        this.HideUConfirmMenu();
        this.hideNoc();

        var pos = this.gameTable.getPlayerDisplayLocation(serverPos) + 1;
        var player = this.gameTable.getPlayerByServerPos(serverPos);

        // hide nut bam
        this.updatePlayerButton(IGC.ACTION_LOST_ACTIVE);
        this.btnChiu.SetEnable(false);
        this.btnKoChiu.SetEnable(false);

        var pAvatar = this.PlayerAvatar[pos -1];

        if (pos == 1) {
            pAvatar.showOngameFullAvatar();
            // Toi U:
            this.showXuongCuoc();
        } else {
            pAvatar.showWinner();
            this.showBaiU(NocCards, onHandCard,uCard);
            var myAvatar = this.PlayerAvatar[0];
            myAvatar.showOngameFullAvatar();
        }

        //OnGuiUpdateCompleted(null);
    },
    showXuongCuoc:function(){
        logMessage("show xuong cuoc");
        this.xcw = new BkXuongCuocWindow();
        this.xcw.setParentWindow(this);
        this.xcw.showWithParent();
        this.xcw.x = -370;

        this.xctw = new BkXuongTextWindow();
        this.xctw.setParentWindow(this);
        this.xctw.showWithParent();
        this.xctw.x = 20;
        this.showCountDownTextXC(59,580,400 + 25);
    },
    showBaiU:function(NocCards, onHandCards, uCard)
    {
        // show bai u
        var maxZo = 10000;
        for (var i=0;i<onHandCards.length;i++){
            var cai = onHandCards[i];
            this.setChildIndex(cai,maxZo+i);
        }
        var cP = cc.p(c.WINDOW_WIDTH/2 + 15,c.WINDOW_HEIGHT/2);
        this.DisplayXoeQuat(onHandCards,cP,80,true);

        this.baiNoc = new BkNocCard(NocCards);
        this.baiNoc.x = c.WINDOW_WIDTH / 2 + 15;
        this.baiNoc.y = c.WINDOW_HEIGHT / 2 - 20;
        this.addChild(this.baiNoc , maxZo + onHandCards.length + 1);
        this.baiNoc.updatePosYTextXemNoc();
    },
    OnSetupTable:function()
    {
        if (this.gameTable.isBasicMode) {
            this.txtTableMode.setString("Luật cơ bản");
        } else {
            this.txtTableMode.setString("Luật nâng cao");
        }

        if (this.gameTable.isEnable4_11) {
            this.txtTableURule.setString("Ù 4-11");
        } else {
            this.txtTableURule.setString("Chơi ù xuông");
        }
        this.txtTableMode.visible = true;
        this.txtTableURule.visible = true;
        var dx = 105;
        this.txtTableMode.x = dx +this.txtTableMode.getContentSize().width/2;
        this.txtTableURule.x = dx +this.txtTableURule.getContentSize().width/2;
    },
    clearXuongCuocWindow:function(){
        if ( this.xcw!=null ){ this.xcw.removeSelf(); }
        if ( this.xctw!=null ){ this.xctw.removeSelf(); }
    },
    onClickTiepTucKQU:function(){
        logMessage("onClickTiepTucKQU ->reshow ongame button if need");
        this.removeUCofirmDialog();
        this.showOngameButton();
        this.onReady();
    },
    showPopupConfirmAfterUpdateMoney:function(list,txt,tongDiem,isMeU)
    {
        if(isMeU && BkLogicManager.getInGameLogic().numberOfPlayingPlayer >= cc.game.config.app.minPlayerUPost && tongDiem >= cc.game.config.app.minDiemUPost)
        {
            this.isVisibleSharebtn = true;
            this.UConfirmDialog = new BkKetquaUWindow(txt,tongDiem,true); // enable Share btn

        }else
        {
            this.isVisibleSharebtn = false;
            this.UConfirmDialog = new BkKetquaUWindow(txt,tongDiem,false);

        }
        this.hideStartGameButton();
        if (list != null){
            this.UConfirmDialog.setListElementText(this.gameTable.listKqUTextElement);
        }
        this.UConfirmDialog.setParentWindow(this);
        this.UConfirmDialog.showWithParent(false);
        this.UConfirmDialog.x+=15;

        var myAvar = this.getMyAvatar();
        if (myAvar != null){
            myAvar.clearEventListener();
        }

        if (list == null){
            logMessage("van hoa");
            return;
        }
        // tru tien
        for (var i=0;i<list.length;i++){
            data = list[i];
            if (data.player != null){
                this.gameTable.increaseMoney(data.player,data.moneyChange + data.moneyGaGop);
            }
        }
    },
    disableGameButton:function(){
        this.disablePlayerNormalButton();
        this.btnChiu.SetEnable(false);
        this.btnKoChiu.SetEnable(false);
        this.btnU.SetEnable(false);
        this.btnKoU.SetEnable(false);
    },
    OnXuongCuocResult:function(serverPos, diem, ga, tongDiemDung, errCode, cuocSai, cuoc,isXuongDung)
    {
        this.disableGameButton();

        if (this.gameTable.getMyPos() == serverPos)
        {
            this.showBaiU(this.gameTable.baiUNoc, this.gameTable.baiUOnHand, null);
        }
        var pAvar = this.getPlayerAvatarByName(this.gameTable.getPlayerByServerPos(serverPos).getName());
        if (pAvar!=null){
            pAvar.clearUMask();
        }

        var cuocID = "[" + cuoc.length + "] ";
        for (var i =0; i < cuoc.length; i++)
        {
            cuocID = cuocID + "|" + cuoc[i];
        }

        logMessage("Cuoc:" + cuocID);
        this.strCuoc = CXuongCuocWindow.getStringXuongCuoc(cuoc);
        logMessage("strCuoc: "+this.strCuoc);
        var typeU = CUText.TYPE_COLOR_0;
        if (diem >= CUText.MIN_DIEM_TYPE_2){
            typeU = CUText.TYPE_COLOR_2;
        } else if (diem >= CUText.MIN_DIEM_TYPE_1){
            typeU = CUText.TYPE_COLOR_1;
        }

        if (isXuongDung){
            this.showUText(this.strCuoc,typeU);
        }

        this.removeCountDownText();
        var myPlayer = this.gameTable.getMyClientState();
        myPlayer.hideCardOnHand();
        if (this.gameTable.isMeBossTable()){
            this.showCountDownForMe(39);
        }
    },
    onShowUTextFinish:function(){
    },
    onCaptureCuocU:function()
    {
        if(this.isVisibleSharebtn)
        {
            Util.removeAnim();
            BkLogicManager.getInGameLogic().UBytesData = cc._canvas.toDataURL();
        }
    },
    clearUText:function(){
        if (this.uText != null) {
            this.uText.removeSelf();
            this.uText = null;
        }
    },
    showUText:function(strCuoc,typeColor){
        this.clearUText();
        this.uText = new BkUText();

        /// Add vao dau
        var locLevel =  11000;
        this.addChild(this.uText,locLevel+1);

        this.uText.setText(strCuoc);

        this.uText.x =c.WINDOW_WIDTH / 2;
        this.uText.y = c.WINDOW_HEIGHT/2 + 80;

        this.uText.setColor(typeColor);
        this.uText.setParentSprite(this);
        this.uText.show();

        //var self = this;
        //function callbackWhenRemoveUText(){
        //    self.showOngameButton();
        //}
    },
    OnFinishedGame:function(){
        this._super();
        this.hideBaoChiuAnimation();
        this.hideBaoUAnimation();
        //this.showOngameButton();
    },
    updateContentChatBoxAfterFinishgame:function (strMess) {
        this.gameTable.getGui().updateUContentChatbox(strMess);
    },
    OnProcessFinishGame:function(){
        logMessage("van hoa");
        this.updateContentChatBoxAfterFinishgame("Ván hòa.");
        this.showPopupConfirmAfterUpdateMoney(null,"Hòa cả làng!");
        this.disablePlayerNormalButton();
    },
    isContains:function(o){
        var listChild = this.getChildren();
        for (var i=0;i<listChild.length;i++){
            if (listChild[i] == o){
                return true;
            }
        }
        return false;
    },
    clearShowU:function()
    {
        var cardList;
        var card;
        // Remove bai u Onhand
        cardList = this.gameTable.baiUOnHand;
        if (cardList != null) {
            while (cardList.length >0) {
                card = cardList[0];
                //removeChild(card);
                card.removeFromParent();
                cardList.splice(0,1);
        }
            cardList = null;
            this.gameTable.baiUOnHand = null;
        }

        if (this.baiNoc != null) {
            this.baiNoc.removeSelf();
            this.baiNoc = null;
            this.gameTable.baiUNoc = null;
        }
    },
    removeUCofirmDialog:function(){
        if (this.UConfirmDialog!= null){
            this.UConfirmDialog.removeSelf();
            this.UConfirmDialog = null;
        }
    },
    showPopupSettingLuatChoi:function () {
        var self = this;
        var luatChoiWD = new BkSettingLuatChoiWindow();
        luatChoiWD.setParentWindow(this);
        luatChoiWD.setCallbackRemoveWindow(function () {
            self.setVisibleCountDownText(true);
        });
        luatChoiWD.showWithParent();
        self.setVisibleCountDownText(false);
    },
    onClickSettingLuat:function(){
        logMessage("onClickSettingLuat");
        if (!this.gameTable.isMeBossTable()){
            showToastMessage(BkConstString.STR_SETTING_LUAT_KHONG_LA_CHU_BAN,170,540);
            return;
        }
        if (this.gameTable.isInGameProgress()){
            showToastMessage(BkConstString.STR_SETTING_LUAT_TRONG_VAN,170,540);
            return;
        }
        this.showPopupSettingLuatChoi();
    },
    onClickCoin:function(){
        this.onClickSettingMoney();
    },
    onClickChicken:function(){
        logMessage("onClickChicken");
        if (!this.gameTable.isMeBossTable()){
            showToastMessage(BkConstString.STR_SETTING_GA_KHONG_LA_CHU_BAN,this.imgChicken.x +10,535);
            return;
        }

        if (this.gameTable.isInGameProgress()){
            showToastMessage(BkConstString.STR_SETTING_GA_TRONG_VAN,this.imgChicken.x +10,535);
            return;
        }

        if (this.gameTable.tongGa>0){
            showToastMessage(BkConstString.STR_SETTING_GA_TONG_GA_KHAC_0,this.imgChicken.x +50,this.imgChicken.y);
            return;
        }

        if (this.gameTable.gaGop){
            this.gameTable.SetUpHaveGaGop(0);
        } else {
            this.gameTable.SetUpHaveGaGop(1);
        }
    },
    initIngameHeader:function(){
        var colorText = cc.color(0xFC,0xBB,0x38);

        this.txtTableMode = new BkLabel("","",15);
        this.txtTableMode.setTextColor(colorText);
        this.txtTableMode.x = 140;
        this.txtTableMode.y = 605;
        this.addChild(this.txtTableMode);
        this.txtTableURule = new BkLabel("","",15);
        this.txtTableURule.setTextColor(colorText);
        this.txtTableURule.x = 140;
        this.txtTableURule.y = 587;
        this.addChild(this.txtTableURule);

        var self = this;

        this.btnSettingLuat = createBkButtonPlist(res_name.luat_u_tran, res_name.luat_u_tran, res_name.luat_u_tran,
            res_name.luat_u_tran,"",0,0);//,CConstString.STR_DOI_LUAT);
        this.btnSettingLuat.x = 150;
        this.btnSettingLuat.y = this.btnBack.y ;
        this.addChild(this.btnSettingLuat);
        this.btnSettingLuat.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnSettingLuat.lastTimeClick < 1000){
                return;
            }
            self.btnSettingLuat.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickSettingLuat();
        });

        this.imgCoinChan = createBkButtonPlist(res_name.icon_coinIG, res_name.icon_coin_press, res_name.icon_coin,
            res_name.icon_coin_hover,"",0,0);
        this.imgCoinChan.setVisibleButton(false);
        this.imgCoinChan.x = 230;//btnSettingLuat.x + btnSettingLuat.width + 10;
        this.imgCoinChan.y = this.btnBack.y;//18;//(bmHeader.height - imgCoin.height) * 0.5;
        //imgCoin.SetEnable(false);
        this.imgCoinChan.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.imgCoinChan.lastTimeClick < 1000){
                return;
            }
            self.imgCoinChan.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickCoin();
        });
        this.addChild(this.imgCoinChan);

        this.txtBetMoneyChan = new BkLabel("","",15);
        this.txtBetMoneyChan.setTextColor(colorText);
        this.txtBetMoneyChan.x = 270;
        this.txtBetMoneyChan.y = this.imgCoinChan.y;
        this.addChild(this.txtBetMoneyChan);

        this.imgChicken = createBkButtonPlist(res_name.btn_ga, res_name.btn_ga_press, res_name.btn_ga,
            res_name.btn_ga_hover,"",0,0);
        this.imgChicken.x = 330;//btnSettingLuat.x + btnSettingLuat.width + 10;
        this.imgChicken.y = this.btnBack.y;//18;//(bmHeader.height - imgCoin.height) * 0.5;
        this.imgChicken.setVisibleButton(false);
        this.imgChicken.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.imgChicken.lastTimeClick < 1000){
                return;
            }
            self.imgChicken.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickChicken();
        });
        this.addChild(this.imgChicken);

        this.txtGaGop = new BkLabel("","",15);
        this.txtGaGop.x = 380;
        this.txtGaGop.y = this.imgChicken.y;
        this.addChild(this.txtGaGop);
    },
    setIsSelectBtnGa:function(isSelected){

        if (isSelected) {
            this.imgChicken.loadTextures(res_name.btn_ga, res_name.btn_ga_press, res_name.btn_ga,
                res_name.btn_ga_hover, ccui.Widget.PLIST_TEXTURE);
        } else {
            this.imgChicken.loadTextures(res_name.btn_ga_disable, res_name.btn_ga_disable, res_name.btn_ga_disable
                , res_name.btn_ga_disable_hover, ccui.Widget.PLIST_TEXTURE);
        }
        this.imgChicken.setVisibleButton(true);
    },
    onTableInfoReturn:function(){
        this._super();
        this.imgCoin.setVisibleButton(false);
        this.txtBetMoney.visible = false;
        this.OnUpdateTableMoneyStatus();

        if (BkGlobal.isRoomTypeSolo()){

        }
    },
    setPlayerModel:function(playerName, top1, top2, top3,vipLv){
        var pAvatar = this.getPlayerAvatarByName(playerName);
        if (pAvatar != null) {
            pAvatar.setModel(top1, top2, top3,vipLv);
        }
    },
    updateBgBanChoi:function(sttBG,rType){
        if (!sttBG){
            sttBG = 1;
        }
        var keyClientSetting = key.dfBackgorundIngame + "_" + cc.username.toLowerCase()+"_"+rType;
        Util.setClientSetting(keyClientSetting,sttBG);

        logMessage("update bg with BG: "+sttBG+" roomtype: "+rType);
        var bm;
        if (rType == RT.ROOM_TYPE_DINH_THU_QUAN){
            logMessage("rType == c.ROOM_TYPE_DINH_THU_QUAN");
            if (sttBG == 1){
                bm = res.IG_DTQ_1;//CGlobal.getBitmap("background/IG_DTQ_1.jpg");
            } else if (sttBG == 2){
                bm = res.IG_DTQ_2;//CGlobal.getBitmap("background/IG_DTQ_2.jpg");
            } else if (sttBG == 3){
                bm = res.IG_DTQ_3;//CGlobal.getBitmap("background/IG_DTQ_3.jpg");
            } else {
                bm = res.IG_DTQ_1;//CGlobal.getBitmap("background/IG_DTQ_1.jpg");
            }
        } else if (rType == RT.ROOM_TYPE_DAU_TAY_DOI){
            logMessage("rType == c.ROOM_TYPE_DAU_TAY_DOI");
            if (sttBG == 1){
                bm = res.IG_SOLO_1;//CGlobal.getBitmap("background/IG_SOLO_1.jpg");
            } else if (sttBG == 2){
                bm = res.IG_SOLO_2;//CGlobal.getBitmap("background/IG_SOLO_2.jpg");
            } else if (sttBG == 3){
                bm = res.IG_SOLO_3;//CGlobal.getBitmap("background/IG_SOLO_3.jpg");
            } else {
                bm = res.IG_SOLO_1;//CGlobal.getBitmap("background/IG_SOLO_1.jpg");
            }
        } else {
            logMessage("rType == c.ROOM_TYPE_NHA_TRANH ");
            if (sttBG == 1){
                bm = res.IG_NT_1;//CGlobal.getBitmap("background/IG_NT_1.jpg");
            } else if (sttBG == 2){
                bm = res.IG_NT_2;//CGlobal.getBitmap("background/IG_NT_2.jpg");
            } else if (sttBG == 3){
                bm = res.IG_NT_3;//CGlobal.getBitmap("background/IG_NT_3.jpg");
            } else {
                bm = res.IG_NT_1;//CGlobal.getBitmap("background/IG_NT_1.jpg");
            }
        }
        this.updateBackground(bm);
        //updateBGWith(bm);
    },
    onPlayerStatusUpdate:function(displayPos, status){
        this._super(displayPos, status);
        var pAvatar = this.PlayerAvatar[displayPos];
        if (pAvatar == null) {
            return;
        }
        var name = pAvatar.getPlayerName();
        var player = this.gameTable.getPlayerByName(name);
        if (player!= null){
            this.gameTable.updateTienGaForOtherPlayer(player,status);
        }
    },
    disableEventStartGameButton:function(){
        this._super();
        this.setVisibleCountDownText(false);
    },
    enableEventStartGameButton:function(){
        this._super();
        this.setVisibleCountDownText(true);
    },
    showGoldBoxWithRemainTime:function(remainTime){
        this._super(remainTime);
        if (this.goldBox){
            this.goldBox.x = 630;//cc.winSize.width/2 + this.goldBox.width  + 405;
            this.goldBox.y = this.btnBack.y;//cc.winSize.height - 70;
        }
    },
    updateImgVip:function () {
        var myName = BkGlobal.UserInfo.getUserName();
        var myAvar = this.getPlayerAvatarByName(myName);
        myAvar.VipLevel = BkGlobal.UserInfo.VipLevel;
        myAvar.loadBackground();
    }

});