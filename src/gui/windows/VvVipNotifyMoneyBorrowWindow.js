/**
 * Created by bs on 01/06/2017.
 */
VvVipNotifyMoneyBorrowWindow = VvWindow.extend({
    startNameX:0,
    endOnRight:625,
    userData:null,
    notifyBorrowObject:null,
    maxBorrowMoney:null,
    currentBorrowMoney:null,
    quanDuocVay:null,
    deadLine:null,
    availableBorrowMoney:null,
    btnHelp:null,
    bmAvar:null,
    lbQuanVayToiDa:null,
    lbQuanVayToiDaValue:null,
    lbQuanDangVayValue:null,
    lbQuanDuocVayValue:null,
    lbHanTraQuanValue:null,
    lbNotifyMoneyBorrowMsg:null,
    ctor: function (notifyBorrowObject, pr) {
        this._super("Thông báo trả quan", cc.size(670, 430),pr);
        this.setVisibleOutBackgroundWindow(true);
        this.notifyBorrowObject = notifyBorrowObject;
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
        this.drawAvar();
        this.drawUI()
    },
    drawAvar:function () {
        this.userData = BkGlobal.UserInfo;
        this.bmAvar = VvAvatarImg.getAvatarSpriteFromIDAndTopData(this.userData.avatarID,this.userData.getTopType(), this.userData.getMinRank(),this.userData.VipLevel);
        this.bmAvar.x = 100;
        this.bmAvar.y = 290;
        this.addChildBody(this.bmAvar);

        if(this.userData.VipLevel > 0)
        {
            var vipIcon = VvAvatarImg.getVipFromID(this.userData.VipLevel);
            vipIcon.setScale(0.5);
            vipIcon.x = this.bmAvar.x - 45;
            vipIcon.y = this.bmAvar.y;
            this.addChildBody(vipIcon);
        }
        this.drawLevel(this.userData.lvUser);
        this.drawName();
    },
    drawName:function () {
        this.startNameX = this.bmAvar.x + 70;
        var startY = this.bmAvar.y + 40;
        var deltaY = 25;
        var fontSize = 14;
        var lbName = new BkLabel(this.userData.getUserName(),"",fontSize);
        lbName.x = this.startNameX + lbName.getContentSize().width/2;
        lbName.y = startY;
        this.addChildBody(lbName);

        this.lbMoney= new BkLabel(formatNumber(this.userData.getMoney()) + " quan","",fontSize);
        this.lbMoney.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        this.lbMoney.x = this.startNameX + this.lbMoney.getContentSize().width/2;
        this.lbMoney.y = lbName.y - deltaY;
        this.addChildBody(this.lbMoney);

        var lvVip = new BkLabel("VIP "+this.userData.VipLevel,"",fontSize);
        lvVip.x = this.startNameX + lvVip.getContentSize().width/2;
        lvVip.y = lbName.y - 2*deltaY;
        this.addChildBody(lvVip);

        this.lbQuanVayToiDa = new BkLabel("Quan vay tối đa: ","",fontSize);
        this.lbQuanVayToiDa.x = this.startNameX + this.lbQuanVayToiDa.getContentSize().width/2;
        this.lbQuanVayToiDa.y = lbName.y - 3*deltaY;
        this.addChildBody(this.lbQuanVayToiDa);
    },
    drawLevel:function (level) {
        if (this.levelStarBg!= null){
            this.levelStarBg.removeFromParent();
        }

        if (this.lvImg!= null){
            this.lvImg.removeFromParent();
        }

        if (this.lvStar!= null){
            this.lvStar.removeFromParent();
        }

        this.levelStarBg = new BkSprite("#" + res_name.level_star_bg);
        this.levelStarBg.x = this.bmAvar.x;
        this.levelStarBg.y = this.bmAvar.y - 85;
        this.addChildBody(this.levelStarBg);

        this.lvImg = VvLevelImage.getChucDanhImage(level);
        this.lvImg.setScale(0.8);
        this.lvImg.x = this.levelStarBg.x;
        this.lvImg.y = this.levelStarBg.y + 15;
        this.addChildBody(this.lvImg);

        this.lvStar = VvLevelImage.getLevelSprite(level);
        this.lvStar.x = this.levelStarBg.x - 10;
        this.lvStar.y = this.levelStarBg.y;
        this.addChildBody(this.lvStar);
    },
    drawUI:function () {
        this.currentBorrowMoney = this.notifyBorrowObject.currentBorrowMoney;
        this.maxBorrowMoney = this.notifyBorrowObject.maxBorrowMoney;
        this.availableBorrowMoney = this.notifyBorrowObject.maxBorrowMoney - this.notifyBorrowObject.currentBorrowMoney;
        this.deadLine = this.notifyBorrowObject.deadLine;
        
        this.drawVayQuanInfomation();

        // show notify borrow money
        var isShowTraNgay = false;
        this.lbNotifyMoneyBorrowMsg = new BkLabelTTF("", "", 14, cc.size (1200, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        if(this.notifyBorrowObject.needRepay  == 0) // chưa trừ tiền
        {
            this.lbNotifyMoneyBorrowMsg.setString("Chào bạn " + BkGlobal.UserInfo.getUserName()+", hiện nay bạn đang vay " + formatNumberIngame(this.currentBorrowMoney) +" quan. Bạn vui lòng hoàn trả lại cho hệ thống trước ngày " + BkTime.convertToLocalTime24h(this.deadLine) + ". Nếu quá thời hạn này bạn chưa hoàn trả hệ thống sẽ trừ dần số quan trong tài khoản cho tới khi hết nợ.");
            isShowTraNgay = true;
        }else if(this.notifyBorrowObject.needRepay  == 1)
        {
            if(BkGlobal.UserInfo.getMoney() == 0)
            {
                this.quanDuocVay = this.maxBorrowMoney - this.currentBorrowMoney;
                this.lbNotifyMoneyBorrowMsg.setString("Chào bạn " + BkGlobal.UserInfo.getUserName()+", hiện nay khoản vay " + formatNumberIngame(this.currentBorrowMoney) + " quan của bạn đã quá hạn. Chắn Vạn Văn sẽ tự động trừ dần số quan trong tài khoản của bạn cho đến khi hết nợ.");
            }else if(this.currentBorrowMoney >= BkGlobal.UserInfo.getMoney())
            {
                this.lbNotifyMoneyBorrowMsg.setString("Chào bạn " + BkGlobal.UserInfo.getUserName()+", hiện nay khoản vay " + formatNumberIngame(this.currentBorrowMoney) + " quan của bạn đã quá hạn. Chắn Vạn Văn đã tự động trừ " + formatNumberIngame(BkGlobal.UserInfo.getMoney()) + " quan từ tài khoản của bạn.");
                this.currentBorrowMoney = this.currentBorrowMoney - BkGlobal.UserInfo.getMoney();
                this.quanDuocVay = this.maxBorrowMoney - this.currentBorrowMoney;
                this.updateUserInfo(-BkGlobal.UserInfo.getMoney());
            }else
            {
                this.lbNotifyMoneyBorrowMsg.setString("Chào bạn " + BkGlobal.UserInfo.getUserName()+", hiện nay khoản vay " + formatNumberIngame(this.currentBorrowMoney) + " quan của bạn đã quá hạn. Chắn Vạn Văn đã tự động trừ " + formatNumberIngame(this.currentBorrowMoney) + " quan từ tài khoản của bạn.");
                this.updateUserInfo(-this.currentBorrowMoney);
                this.currentBorrowMoney = 0;
                this.quanDuocVay  = this.maxBorrowMoney;
            }
            this.updateDangVayDuocVayHanTraValue(this.currentBorrowMoney,this.quanDuocVay);
        }
        this.lbNotifyMoneyBorrowMsg.setFontFillColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        this.lbNotifyMoneyBorrowMsg.x = this.getBodySize().width/2 + 10;
        this.lbNotifyMoneyBorrowMsg.y = 180 - this.lbNotifyMoneyBorrowMsg.getContentSize().height/2;
        this.addChildBody(this.lbNotifyMoneyBorrowMsg);

        var btnNapQuan = new BkButton(res_name.vv_btn_huy,res_name.vv_btn_huy,res_name.vv_btn_huy,res_name.vv_btn_huy_hover,ccui.Widget.PLIST_TEXTURE);
        btnNapQuan.setTitleText("Nạp quan");
        btnNapQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnNapQuan.setVisible(this.currentBorrowMoney > BkGlobal.UserInfo.getMoney());
        btnNapQuan.x = this.getBodySize().width/2;
        btnNapQuan.y = 70;
        this.addChildBody(btnNapQuan);
        btnNapQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    // show Payment Window
                    var layer = new VvPaymentWindow();
                    layer.showWithParent();
                }
            }
        );

        var btnTraHetQuan = new BkButton(res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,ccui.Widget.PLIST_TEXTURE);
        btnTraHetQuan.setTitleText("Trả ngay");
        btnTraHetQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnTraHetQuan.setVisibleButton(isShowTraNgay);
        btnTraHetQuan.x = this.getBodySize().width/2;
        btnTraHetQuan.y = btnNapQuan.y;
        this.addChildBody(btnTraHetQuan);
        var self = this;
        btnTraHetQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    logMessage("Trả ngay Clicked!");
                    self.onBtnTraHetQuanClick();
                }
            }
        );

        if(isShowTraNgay && this.currentBorrowMoney > BkGlobal.UserInfo.getMoney()){
            btnNapQuan.x = this.getBodySize().width/2 - 60;
            btnTraHetQuan.x = this.getBodySize().width/2 + 60;
        }

    },
    onBtnTraHetQuanClick:function(){
        if(this.currentBorrowMoney == 0)
        {
            showToastMessage("Bạn không vay quan từ hệ thống",600,300);
            return;
        }
        if(BkGlobal.UserInfo.getMoney() <= 0)
        {
            showToastMessage("Bạn không có đủ quan. Hãy nạp quan để trả.",600,300);
            return;
        }
        var self = this;
        showPopupConfirmWith("Hệ thống sẽ tự động trừ số quan bạn vay vào tài khoản của bạn. Bạn có chắc chắc muốn trả quan?","",
            function(){
                self.doPayAllMoneyRequest();
            });
    },
    doPayAllMoneyRequest:function(){
        Util.showAnim();
        BkLogicManager.getLogic().setOnLoadComplete(this);
        var packet = new BkPacket();
        packet.CreatePacketWithTypeAndByteData(c.NETWORK_VIP_FUNCTION,VC.VIP_RETURN_BORROWED_MONEY);
        BkConnectionManager.send(packet);
        logMessage("PayAllMoney");
    },
    updateUserInfo: function(changeMoney)
    {
        BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + changeMoney);
        BkLogicManager.getLogic().processUpdateProfileUI();
        if(this.lbMoney)
        {
            this.lbMoney.setString(formatNumberIngame(BkGlobal.UserInfo.getMoney()) + " quan");
            this.lbMoney.x = this.startNameX + this.lbMoney.getContentSize().width/2;
        }
    },
    updateDangVayDuocVayHanTraValue: function(dangVay, duocVay)
    {
        if(dangVay == 0)
        {
            this.lbHanTraQuanValue.setString("--/--/----");
            this.lbHanTraQuanValue.x = this.endOnRight - this.lbHanTraQuanValue.getContentSize().width/2;
        }

        this.lbQuanDangVayValue.setString(formatNumberIngame(dangVay) + " quan");
        this.lbQuanDuocVayValue.setString(formatNumberIngame(duocVay) + " quan");
        this.lbQuanDangVayValue.x = this.endOnRight - this.lbQuanDangVayValue.getContentSize().width/2;
        this.lbQuanDuocVayValue.x = this.endOnRight - this.lbQuanDuocVayValue.getContentSize().width/2;
    },
    drawVayQuanInfomation: function()
    {
        var startX = this.bmAvar.x + 275;
        var startY = this.bmAvar.y + 40;
        var deltaY = 25;
        var fontSize = 14;
        var color = cc.color(200, 125, 55);
        var marginRight = 35;
        var spaceRow = 37;

        this.lbQuanVayToiDaValue = new BkLabel(formatNumberIngame(this.maxBorrowMoney) + " quan", "", fontSize);
        this.lbQuanVayToiDaValue.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        this.lbQuanVayToiDaValue.x = this.lbQuanVayToiDa.x + this.lbQuanVayToiDa.getContentSize().width/2 + this.lbQuanVayToiDaValue.getContentSize().width/2;
        this.lbQuanVayToiDaValue.y = this.lbQuanVayToiDa.y;
        this.addChildBody(this.lbQuanVayToiDaValue,0);

        var lbQuanDangVay = new BkLabel("Quan đang vay", "", fontSize);
        lbQuanDangVay.setTextColor(color);
        lbQuanDangVay.x = startX + lbQuanDangVay.getContentSize().width/2;
        lbQuanDangVay.y = startY;
        this.addChildBody(lbQuanDangVay);

        var box1 = new BkSprite("#" + res_name.numberbox);
        box1.x = this.getBodySize().width - box1.width/2 - marginRight;
        box1.y = lbQuanDangVay.y;
        this.addChildBody(box1);

        this.endOnRight = box1.x + box1.width/2 - 10;

        this.lbQuanDangVayValue = new BkLabel(formatNumberIngame(this.currentBorrowMoney), "", fontSize);
        this.lbQuanDangVayValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        this.lbQuanDangVayValue.x = this.endOnRight - this.lbQuanDangVayValue.getContentSize().width/2;
        this.lbQuanDangVayValue.y = box1.y;
        this.addChildBody(this.lbQuanDangVayValue);

        var lbQuanDuocVay = new BkLabel("Quan được vay", "", fontSize);
        lbQuanDuocVay.setTextColor(color);
        lbQuanDuocVay.x = startX + lbQuanDuocVay.getContentSize().width/2;
        lbQuanDuocVay.y = lbQuanDangVay.y - spaceRow;
        this.addChildBody(lbQuanDuocVay);

        var box2 = new BkSprite("#" + res_name.numberbox);
        box2.x = box1.x;
        box2.y = lbQuanDuocVay.y;
        this.addChildBody(box2);

        this.lbQuanDuocVayValue = new BkLabel(formatNumberIngame(this.availableBorrowMoney), "", fontSize);
        this.lbQuanDuocVayValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        this.lbQuanDuocVayValue.x = this.endOnRight - this.lbQuanDuocVayValue.getContentSize().width/2;
        this.lbQuanDuocVayValue.y = box2.y;
        this.addChildBody(this.lbQuanDuocVayValue);

        var lbHanTraQuan = new BkLabel("Hạn trả quan", "", fontSize);
        lbHanTraQuan.setTextColor(color);
        lbHanTraQuan.x = startX + lbHanTraQuan.getContentSize().width/2;
        lbHanTraQuan.y = lbQuanDuocVay.y - spaceRow - 0.5;
        this.addChildBody(lbHanTraQuan);

        var box3 = new BkSprite("#" + res_name.numberbox);
        box3.x = box1.x;
        box3.y = lbHanTraQuan.y;
        this.addChildBody(box3);

        var deadLine = "--/--/----";
        if (new Date(this.deadLine) != "Invalid Date") {
            deadLine = BkTime.convertToLocalTime24h(this.deadLine);
        }

        this.lbHanTraQuanValue = new BkLabel(deadLine, "", fontSize);
        this.lbHanTraQuanValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        this.lbHanTraQuanValue.x = this.endOnRight - this.lbHanTraQuanValue.getContentSize().width/2;
        this.lbHanTraQuanValue.y = box3.y;
        this.addChildBody(this.lbHanTraQuanValue);
    },
    onPayBorrowedMoneyReturn:function(returnMoney)
    {
        this.updateUserInfo(-returnMoney);
        showPopupMessageWith("Bạn đã trả thành công " + formatNumberIngame(returnMoney) + " quan cho hệ thống.");
        this.removeSelf();
    },
    onLoadComplete: function (obj, tag) {
        logMessage("onLoadComplete "+tag);
        Util.removeAnim();
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case VC.VIP_RETURN_BORROWED_MONEY:
                this.onPayBorrowedMoneyReturn(obj);
                break;
        }
    },
    onClickHelp:function () {
        logMessage("onClickHelp");
        var layer =new VvVipBenefitDetailsWindow(this);
        layer.showWithParent();
    }
});
