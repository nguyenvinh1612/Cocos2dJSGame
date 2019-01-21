/**
 * Created by bs on 31/05/2017.
 */
VvVipBenefitWindow = VvWindow.extend({
    btnHelp:null,
    curVipBG:null,
    nextVBG:null,
    startXLabel1:250,
    startXLabel2:600,
    startYVHT:320,

    vlKMNQVHT:null,
    vlVTDVHT:null,
    vlPCQVHT:null,
    vlTMBFBVHT:null,

    vlSDLVVTT:null,
    vlKMNQVTT:null,
    vlVTDVTT:null,
    vlPCQVTT:null,
    vlTMBFBVTT:null,

    guildeSprite:null,
    crVipData:null,
    ctor: function (pr) {
        this._super("Quyền lợi Vip", cc.size(680, 430),pr);
        this.setVisibleOutBackgroundWindow(true);
        // init btnHelp
        this.btnHelp = new BkButton(res_name.vip_icon_help_normal,res_name.vip_icon_help_normal
            ,res_name.vip_icon_help_normal,res_name.vip_icon_help_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnHelp.x = this._btnClose.x - 30;
        this.btnHelp.y = this._btnClose.y;
        this.addChildBody(this.btnHelp,VV_WD_ZORDER_TOP);
        var self = this;
        this.btnHelp.addClickEventListener(function () {
             self.onClickHelp();
        });

        this.drawUI();
    },
    onClickHelp:function () {
        logMessage("onClickHelp");
        var layer =new VvVipBenefitDetailsWindow(this);
        layer.showWithParent();
    },
    drawBG:function () {
        this.curVipBG = new BkSprite("#"+res_name.currentVipBG);
        this.curVipBG.x = this.getWindowSize().width/2;
        this.curVipBG.y = 280;
        this.addChildBody(this.curVipBG);

        this.nextVBG = new BkSprite("#"+res_name.nextVipBG);
        this.nextVBG.x = this.getWindowSize().width/2;
        this.nextVBG.y = 140;
        this.addChildBody(this.nextVBG);

        var lbCVHT = new BkLabel("Cấp VIP tiếp theo","",16);
        lbCVHT.setTextColor(cc.color(0xF4,0xE0,0x1E));
        lbCVHT.x = this.getWindowSize().width/2;
        lbCVHT.y = 200;
        this.addChildBody(lbCVHT);
    },
    drawVipHienTai:function () {
        var crVipLv = BkGlobal.UserInfo.VipLevel;
        var fontSize = 16;
        var textColor = BkColor.COLOR_CONTENT_TEXT;
        var deltaYVHT = 25;
        // if (crVipLv == 0){
        //     var lbNotify = new BkLabel("Hiện tại bạn không là VIP. Hãy Nạp quan để lên VIP.","",fontSize);
        //     lbNotify.setTextColor(textColor);
        //     lbNotify.x = this.getWindowSize().width/2 + 80;
        //     lbNotify.y = this.curVipBG.y;
        //     this.addChildBody(lbNotify);
        //     return;
        // }
        var iConVipHienTai = VvAvatarImg.getVipFromID(crVipLv,true);
        iConVipHienTai.y = this.curVipBG.y + 10;
        iConVipHienTai.x = this.curVipBG.x - 220;
        this.addChildBody(iConVipHienTai);

        var lbCVHT = new BkLabel("Cấp VIP hiện tại","",12);
        lbCVHT.setTextColor(cc.color(0,0,0));
        lbCVHT.x = iConVipHienTai.x;
        lbCVHT.y = iConVipHienTai.y - 70;
        this.addChildBody(lbCVHT);

        iConVipHienTai.x = this.curVipBG.x - 224;

        var lbKhuyenMaiNapQuan = new BkLabel("Khuyến mại nạp quan","",fontSize);
        lbKhuyenMaiNapQuan.setTextColor(textColor);
        lbKhuyenMaiNapQuan.x = this.startXLabel1 + lbKhuyenMaiNapQuan.getContentSize().width/2;
        lbKhuyenMaiNapQuan.y = this.startYVHT;
        this.addChildBody(lbKhuyenMaiNapQuan);


        var lbVayToiDa = new BkLabel("Vay tối đa","",fontSize);
        lbVayToiDa.setTextColor(textColor);
        lbVayToiDa.x = this.startXLabel1 + lbVayToiDa.getContentSize().width/2;
        lbVayToiDa.y = lbKhuyenMaiNapQuan.y - deltaYVHT;
        this.addChildBody(lbVayToiDa);

        var lbPhiChuyenQuan = new BkLabel("Phí chuyển quan","",fontSize);
        lbPhiChuyenQuan.setTextColor(textColor);
        lbPhiChuyenQuan.x = this.startXLabel1 + lbPhiChuyenQuan.getContentSize().width/2;
        lbPhiChuyenQuan.y = lbVayToiDa.y - deltaYVHT;
        this.addChildBody(lbPhiChuyenQuan);

        var lbThuongMoiBanFB = new BkLabel("Thưởng mời bạn FB","",fontSize);
        lbThuongMoiBanFB.setTextColor(textColor);
        lbThuongMoiBanFB.x = this.startXLabel1 + lbThuongMoiBanFB.getContentSize().width/2;
        lbThuongMoiBanFB.y = lbPhiChuyenQuan.y - deltaYVHT;
        this.addChildBody(lbThuongMoiBanFB);


        this.vlKMNQVHT = new BkLabel("","",fontSize);
        this.vlKMNQVHT.y = lbKhuyenMaiNapQuan.y;
        this.addChildBody(this.vlKMNQVHT);

        this.vlVTDVHT = new BkLabel("","",fontSize);
        this.vlVTDVHT.y = lbVayToiDa.y;
        this.addChildBody(this.vlVTDVHT);

        this.vlPCQVHT = new BkLabel("","",fontSize);
        this.vlPCQVHT.y = lbPhiChuyenQuan.y;
        this.addChildBody(this.vlPCQVHT);

        this.vlTMBFBVHT = new BkLabel("","",fontSize);
        this.vlTMBFBVHT.y = lbThuongMoiBanFB.y;
        this.addChildBody(this.vlTMBFBVHT);
    },
    drawVipTiepTheo:function () {
        var fontSize = 16;
        var textColor = BkColor.COLOR_CONTENT_TEXT;
        var deltaYVHT = 20;
        var crVipLv = BkGlobal.UserInfo.VipLevel;
        if (crVipLv == 10){
            var lbNotify = new BkLabel("Chúc mừng bạn đã đạt cấp VIP cao nhất","",fontSize);
            lbNotify.setTextColor(textColor);
            lbNotify.x = this.getWindowSize().width/2;
            lbNotify.y = this.nextVBG.y;
            this.addChildBody(lbNotify);
            return;
        }
        var iConVipTiepTheo = VvAvatarImg.getVipFromID(crVipLv + 1,true);
        iConVipTiepTheo.y = this.nextVBG.y;
        iConVipTiepTheo.x = this.nextVBG.x - 220;
        iConVipTiepTheo.setScale(0.8);
        this.addChildBody(iConVipTiepTheo);

        fontSize = 14;
        var staryYVTT = 175;
        var lbSoDiemLenVip = new BkLabel("Số điểm lên VIP","",fontSize);
        lbSoDiemLenVip.setTextColor(textColor);
        lbSoDiemLenVip.x = this.startXLabel1 + lbSoDiemLenVip.getContentSize().width/2;
        lbSoDiemLenVip.y = staryYVTT;
        this.addChildBody(lbSoDiemLenVip);

        var lbKhuyenMaiNapQuan = new BkLabel("Khuyến mại nạp quan","",fontSize);
        lbKhuyenMaiNapQuan.setTextColor(textColor);
        lbKhuyenMaiNapQuan.x = this.startXLabel1 + lbKhuyenMaiNapQuan.getContentSize().width/2;
        lbKhuyenMaiNapQuan.y = lbSoDiemLenVip.y - deltaYVHT;
        this.addChildBody(lbKhuyenMaiNapQuan);


        var lbVayToiDa = new BkLabel("Vay tối đa","",fontSize);
        lbVayToiDa.setTextColor(textColor);
        lbVayToiDa.x = this.startXLabel1 + lbVayToiDa.getContentSize().width/2;
        lbVayToiDa.y = lbKhuyenMaiNapQuan.y - deltaYVHT;
        this.addChildBody(lbVayToiDa);

        var lbPhiChuyenQuan = new BkLabel("Phí chuyển quan","",fontSize);
        lbPhiChuyenQuan.setTextColor(textColor);
        lbPhiChuyenQuan.x = this.startXLabel1 + lbPhiChuyenQuan.getContentSize().width/2;
        lbPhiChuyenQuan.y = lbVayToiDa.y - deltaYVHT;
        this.addChildBody(lbPhiChuyenQuan);

        var lbThuongMoiBanFB = new BkLabel("Thưởng mời bạn FB","",fontSize);
        lbThuongMoiBanFB.setTextColor(textColor);
        lbThuongMoiBanFB.x = this.startXLabel1 + lbThuongMoiBanFB.getContentSize().width/2;
        lbThuongMoiBanFB.y = lbPhiChuyenQuan.y - deltaYVHT;
        this.addChildBody(lbThuongMoiBanFB);

        this.vlSDLVVTT = new BkLabel("","",fontSize);
        this.vlSDLVVTT.y = lbSoDiemLenVip.y;
        this.addChildBody(this.vlSDLVVTT);

        this.vlKMNQVTT = new BkLabel("","",fontSize);
        this.vlKMNQVTT.y = lbKhuyenMaiNapQuan.y;
        this.addChildBody(this.vlKMNQVTT);

        this.vlVTDVTT = new BkLabel("","",fontSize);
        this.vlVTDVTT.y = lbVayToiDa.y;
        this.addChildBody(this.vlVTDVTT);

        this.vlPCQVTT = new BkLabel("","",fontSize);
        this.vlPCQVTT.y = lbPhiChuyenQuan.y;
        this.addChildBody(this.vlPCQVTT);

        this.vlTMBFBVTT = new BkLabel("","",fontSize);
        this.vlTMBFBVTT.y = lbThuongMoiBanFB.y;
        this.addChildBody(this.vlTMBFBVTT);

    },
    drawUI:function () {
        this.drawBG();
        var commonLogic = BkLogicManager.getLogic();
        commonLogic.setOnLoadComplete(this);
        commonLogic.doGetVipBenifit();
        Util.showAnim();
        this.drawVipHienTai();
        this.drawVipTiepTheo();
        this.drawButton();
        this.initGuildeSprite();
        this.drawVipGuile();
    },
    initGuildeSprite:function () {
        this.guildeSprite = new BkSprite();
        var bgGuidle = new BkSprite("#"+res_name.toast_explain);
        this.guildeSprite.addChild(bgGuidle);
        var lbGuilde = new BkLabel("Điểm Vip có thể nhận \n được khi nạp quan","",13);
        lbGuilde.y = 5;
        this.guildeSprite.addChild(lbGuilde);
        this.addChildBody(this.guildeSprite);
        this.guildeSprite.x = 645;
        this.guildeSprite.y = 210;
        this.guildeSprite.visible = false;
    },
    onHoverGuidle:function () {
        this.guildeSprite.visible = true;
    },
    onOutGuidle:function () {
        this.guildeSprite.visible = false;
    },
    drawVipGuile:function () {
        if (BkGlobal.UserInfo.VipLevel >= 10){
            return;
        }

        var guidleSprite =createBkButtonPlistNewTitle(res_name.icon_explain_normal, res_name.icon_explain_normal
            , res_name.icon_explain_normal, res_name.icon_explain_hover,"",0,0);
        var self = this;
        guidleSprite.x = 615;
        guidleSprite.y = this.vlSDLVVTT.y;
        var myEv = guidleSprite.createHoverEvent(function(){
            self.onHoverGuidle();
        },function(){
            self.onOutGuidle();
        });
        cc.eventManager.addListener(myEv, guidleSprite);
        this.addChildBody(guidleSprite);
    },
    onChuyenQuan:function () {
        if (this.crVipData != null){
            if (this.crVipData.mnTransferPercent<0){
                showToastMessage("Bạn chưa được phép chuyển quan, Hãy lên VIP cao hơn để được chuyển!",600,220,3);
                return;
            }
        }

        var layer = new VvVipMoneyTransferWindow();
        layer.showWithParent();
    },
    onClickVay:function () {
        if (this.crVipData != null){
            if (this.crVipData.maxBorrowMoney<=0){
                showToastMessage("Bạn chưa được phép vay quan, Hãy lên VIP cao hơn để được vay!",420,220,3);
                return;
            }
        }
        var layer = new VvVipMoneyBorrowWindow(this);
        layer.showWithParent();
    },
    onClickNapQuan:function () {
        var paymentWindow = new VvPaymentWindow();
        paymentWindow.showWithParent();
    },
    drawButton:function () {
        var self = this;
        var deltaX = 170;
        var centerX = this.getWindowSize().width/2;
        var yPos = 55;
        var btnNapQuan = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy
            ,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,"Nạp quan",0,0);
        btnNapQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnNapQuan.x = centerX-deltaX;
        btnNapQuan.y = yPos;
        this.addChildBody(btnNapQuan);
        btnNapQuan.addClickEventListener(function () {
            self.onClickNapQuan();
        });

        var btnVayQuan = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy
            ,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,"Vay quan",0,0);
        btnVayQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnVayQuan.x = centerX;
        btnVayQuan.y = yPos;
        this.addChildBody(btnVayQuan);
        btnVayQuan.addClickEventListener(function () {
            self.onClickVay();
        });

        var btnChuyenQuan = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy
            ,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,"Chuyển quan",0,0);
        btnChuyenQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnChuyenQuan.x = centerX+deltaX;
        btnChuyenQuan.y = yPos;
        this.addChildBody(btnChuyenQuan);
        btnChuyenQuan.addClickEventListener(function () {
            self.onChuyenQuan();
        });
    },
    //=======================================================================
    configViewVHT:function (currVipBenefit) {
        this.crVipData = currVipBenefit;
        var lv = BkGlobal.UserInfo.VipLevel;
        if (lv < 0){
            return;
        }
        this.vlKMNQVHT.setString("+"+currVipBenefit.paymentBonus+"%");
        this.vlKMNQVHT.x = this.startXLabel2 - this.vlKMNQVHT.getContentSize().width/2;
        var maxBr = currVipBenefit.maxBorrowMoney;
        if (maxBr<0){
            maxBr = 0;
        }
        this.vlVTDVHT.setString(formatNumber(maxBr)+" quan");
        this.vlVTDVHT.x = this.startXLabel2 - this.vlVTDVHT.getContentSize().width/2;

        var strPCQ = currVipBenefit.mnTransferPercent +"%";
        if (currVipBenefit.mnTransferPercent<0){
            strPCQ = "Không được sử dụng";
        }
        this.vlPCQVHT.setString(strPCQ);
        this.vlPCQVHT.x = this.startXLabel2 - this.vlPCQVHT.getContentSize().width/2;

        this.vlTMBFBVHT.setString(formatNumber(currVipBenefit.FBinviteBonus)+" quan/ lời mời");
        this.vlTMBFBVHT.x = this.startXLabel2 - this.vlTMBFBVHT.getContentSize().width/2;
    },
    configViewVTT:function (nextVipBenefit) {
        if (BkGlobal.UserInfo.VipLevel >= 10){
            return;
        }
        this.vlSDLVVTT.setString(nextVipBenefit.nextLevelScore+" điểm");
        this.vlSDLVVTT.x = this.startXLabel2 - this.vlSDLVVTT.getContentSize().width/2;

        this.vlKMNQVTT.setString("+"+nextVipBenefit.paymentBonus+"%");
        this.vlKMNQVTT.x = this.startXLabel2 - this.vlKMNQVTT.getContentSize().width/2;

        this.vlVTDVTT.setString(formatNumber(nextVipBenefit.maxBorrowMoney)+" quan");
        this.vlVTDVTT.x = this.startXLabel2 - this.vlVTDVTT.getContentSize().width/2;

        var strPCQ = nextVipBenefit.mnTransferPercent +"%";
        if (nextVipBenefit.mnTransferPercent<0){
            strPCQ = "Không được sử dụng";
        }
        this.vlPCQVTT.setString(strPCQ);
        this.vlPCQVTT.x = this.startXLabel2 - this.vlPCQVTT.getContentSize().width/2;

        this.vlTMBFBVTT.setString(formatNumber(nextVipBenefit.FBinviteBonus)+" quan/ lời mời");
        this.vlTMBFBVTT.x = this.startXLabel2 - this.vlTMBFBVTT.getContentSize().width/2;

    },
    onLoadComplete: function (obj, tag) {
        //var vipBenefit = {currVipBenefit:currVipBenefit,nextVipBenefit:nextVipBenefit};
        logMessage("onLoadComplete "+tag);
        Util.removeAnim();
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case VC.VIP_BENEFIT:
                this.configViewVHT(obj.currVipBenefit);
                this.configViewVTT(obj.nextVipBenefit);
                break;
        }
    }
});
