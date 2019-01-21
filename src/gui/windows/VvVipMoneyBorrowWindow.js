/**
 * Created by bs on 01/06/2017.
 */
VvVipMoneyBorrowWindow = VvWindow.extend({
    startNameX:0,
    endOnRight:625,
    userData:null,
    minBorrowMoney:null,
    maxBorrowMoney:null,
    currentBorrowMoney:null,
    availableBorrowMoney:null,
    deadLine:null,
    btnHelp:null,
    bmAvar:null,
    lbQuanVayToiDa:null,
    lbQuanVayToiDaValue:null,
    lbQuanDangVayValue:null,
    lbQuanDuocVayValue:null,
    lbHanTraQuanValue:null,
    tabVayQuan:null,
    tabTraQuan:null,
    bgContentTab:null,
    currentTab:0,
    spriteVayQuan:null,
    txtVayQuanInput:null,
    spriteTraQuan:null,
    boxHienCo:null,
    boxDangVay:null,
    lbNote:null,
    ctor: function (pr) {
        this._super("Vay quan", cc.size(670, 430),pr);
        this.setVisibleOutBackgroundWindow(true);
        this.doGetVipBorrowInfo();
        // init button Help (?)
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

        this.lbMoney= new BkLabel(formatNumber(this.userData.getMoney()) + BkConstString.getGameCoinStr(),"",fontSize);
        this.lbMoney.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        this.lbMoney.x = this.startNameX + this.lbMoney.getContentSize().width/2;
        this.lbMoney.y = lbName.y - deltaY;
        this.addChildBody(this.lbMoney);

        var lvVip = new BkLabel("VIP "+this.userData.VipLevel,"",fontSize);
        lvVip.x = this.startNameX + lvVip.getContentSize().width/2;
        lvVip.y = lbName.y - 2*deltaY;
        this.addChildBody(lvVip);

        this.lbQuanVayToiDa = new BkLabel("Quan vay tối thiểu: ","",fontSize);
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
    doGetVipBorrowInfo:function () {
        Util.showAnim();
        BkLogicManager.getLogic().setOnLoadComplete(this);
        var packet = new BkPacket();
        packet.CreatePacketWithTypeAndByteData(c.NETWORK_VIP_FUNCTION,VC.VIP_BORROW_INFO);
        BkConnectionManager.send(packet);
    },
    drawUI:function (maxBorrowMoney, currentBorrowMoney, deadLine, minBorrowMoney) {
        this.currentBorrowMoney = currentBorrowMoney;
        this.maxBorrowMoney = maxBorrowMoney;
        this.availableBorrowMoney = maxBorrowMoney - currentBorrowMoney;
        this.minBorrowMoney = minBorrowMoney;
        this.deadLine = deadLine;
        
        this.drawVayQuanInfomation();

        // draw Vay quan, Tra quan tabs
        this.initTabs();
        this.createVayQuanSprite();
    },
    initTabs:function(){
        this.bgContentTab = new BkSprite("#" + res_name.bg_money);
        this.bgContentTab.x = this.getBodySize().width/2;
        this.bgContentTab.y = this.bgContentTab.height/2 + 45;
        this.addChildBody(this.bgContentTab);

        this._currentTab = 0;
        this.tabVayQuan = new BkButton(res_name.vip_btn_selected,res_name.vip_btn_selected,res_name.vip_btn_selected
            ,res_name.vip_btn_selected,ccui.Widget.PLIST_TEXTURE);
        this.tabVayQuan.setTitleText("Vay quan");
        this.tabVayQuan.setTitleColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        var selfPointer = this;
        this.tabVayQuan.setHoverCallback(function(){
            if(selfPointer._currentTab == 0){
                cc._canvas.style.cursor = "default";
            }
        },null);
        this.tabVayQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    if (selfPointer._currentTab == 0){
                        return;
                    }
                    selfPointer.configBaseTabUI(0);
                }
            }
        );

        this.tabVayQuan.x = 130;
        this.tabVayQuan.y = this.bgContentTab.y + this.bgContentTab.height/2 + this.tabVayQuan.height/2 - 2;
        this.addChildBody(this.tabVayQuan);

        this.tabTraQuan = new BkButton(res_name.vip_btn_deselected,res_name.vip_btn_deselected,res_name.vip_btn_deselected
            ,res_name.vip_btn_deselected_hover,ccui.Widget.PLIST_TEXTURE);
        this.tabTraQuan.setTitleText("Trả quan");
        this.tabTraQuan.setTitleColor(BkColor.VV_VIP_TAB_DESELECTED_BUTTON_COLOR);
        this.tabTraQuan.setHoverCallback(function(){
            if(selfPointer._currentTab == 1){
                cc._canvas.style.cursor = "default";
            }
        },null);
        this.tabTraQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    if (selfPointer._currentTab == 1){
                        return;
                    }
                    selfPointer.configBaseTabUI(1);
                }
            }
        );

        this.tabTraQuan.x = this.tabVayQuan.x + this.tabVayQuan.width/2 + this.tabTraQuan.width/2 + 5;
        this.tabTraQuan.y = this.bgContentTab.y + this.bgContentTab.height/2 + this.tabTraQuan.height/2 - 1;
        this.addChildBody(this.tabTraQuan);
    },
    configBaseTabUI:function(tabIndex){
        this.setSelectedTab(tabIndex);
        if(tabIndex == 0){
            this.createVayQuanSprite();
        }
        else{
            this.createTraQuanSprite();
        }
    },
    setSelectedTab:function(tabIndex){
        this._currentTab = tabIndex;
        if(tabIndex == 0){
            this.tabVayQuan.loadTextures(res_name.vip_btn_selected,res_name.vip_btn_selected,res_name.vip_btn_selected
                ,res_name.vip_btn_selected,ccui.Widget.PLIST_TEXTURE);
            this.tabVayQuan.setTitleColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
            this.tabVayQuan.y = this.bgContentTab.y + this.bgContentTab.height/2 + this.tabVayQuan.height/2 - 2;

            this.tabTraQuan.loadTextures(res_name.vip_btn_deselected,res_name.vip_btn_deselected,res_name.vip_btn_deselected
                ,res_name.vip_btn_deselected_hover,ccui.Widget.PLIST_TEXTURE);
            this.tabTraQuan.setTitleColor(BkColor.VV_VIP_TAB_DESELECTED_BUTTON_COLOR);
            this.tabTraQuan.y = this.bgContentTab.y + this.bgContentTab.height/2 + this.tabTraQuan.height/2 - 1;
        }
        else{
            this.tabVayQuan.loadTextures(res_name.vip_btn_deselected,res_name.vip_btn_deselected,res_name.vip_btn_deselected
                ,res_name.vip_btn_deselected_hover,ccui.Widget.PLIST_TEXTURE);
            this.tabVayQuan.setTitleColor(BkColor.VV_VIP_TAB_DESELECTED_BUTTON_COLOR);
            this.tabVayQuan.y = this.bgContentTab.y + this.bgContentTab.height/2 + this.tabVayQuan.height/2 - 1;

            this.tabTraQuan.loadTextures(res_name.vip_btn_selected,res_name.vip_btn_selected,res_name.vip_btn_selected
                ,res_name.vip_btn_selected,ccui.Widget.PLIST_TEXTURE);
            this.tabTraQuan.setTitleColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
            this.tabTraQuan.y = this.bgContentTab.y + this.bgContentTab.height/2 + this.tabTraQuan.height/2 - 2;
        }
    },
    createTraQuanSprite: function(){
        if(this.spriteVayQuan != null)
        {
            this.spriteVayQuan.removeAllChildren();
        }
        if(this.spriteTraQuan != null)
        {
            this.spriteTraQuan.removeAllChildren();
        }
        if(this.lbNotifyVayQuan)this.lbNotifyVayQuan.setString("");

        var fontSize = 14;

        if(this.currentBorrowMoney == 0)
        {
            this.lbNotifyVayQuan = new BkLabel("Bạn không cần trả quan.", "", fontSize);
            this.lbNotifyVayQuan.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
            this.lbNotifyVayQuan.x = this.bgContentTab.width/2;
            this.lbNotifyVayQuan.y = this.bgContentTab.height/2;
            this.bgContentTab.addChild(this.lbNotifyVayQuan);
            return;
        }

        var color = cc.color(186, 99, 29);
        var startX = 120;
        var startY = 90;
        var tfQuanHienCo = new BkLabel("Hiện có", "", fontSize);
        tfQuanHienCo.setTextColor(color);
        tfQuanHienCo.x = startX + tfQuanHienCo.getContentSize().width/2;
        tfQuanHienCo.y = 90;
        this.spriteTraQuan.addChild(tfQuanHienCo);

        this.boxHienCo = new BkSprite("#" + res_name.numberbox);
        this.boxHienCo.x = startX + 60 + this.boxHienCo.width/2;
        this.boxHienCo.y = tfQuanHienCo.y;
        this.spriteTraQuan.addChild(this.boxHienCo);

        this.lbHienCoValue = new BkLabel(formatNumberIngame(BkGlobal.UserInfo.getMoney()) + BkConstString.getGameCoinStr(), "", fontSize);
        this.lbHienCoValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        this.lbHienCoValue.x = this.boxHienCo.width - this.lbHienCoValue.getContentSize().width/2 - 10;
        this.lbHienCoValue.y = this.boxHienCo.height/2;
        this.boxHienCo.addChild(this.lbHienCoValue);

        var tfQuanDangVay = new BkLabel("Đang vay", "", fontSize);
        tfQuanDangVay.setTextColor(color);
        tfQuanDangVay.x = startX + tfQuanDangVay.getContentSize().width/2;
        tfQuanDangVay.y = tfQuanHienCo.y - 30;
        this.spriteTraQuan.addChild(tfQuanDangVay);

        this.boxDangVay = new BkSprite("#" + res_name.numberbox);
        this.boxDangVay.x = this.boxHienCo.x;
        this.boxDangVay.y = tfQuanDangVay.y;
        this.spriteTraQuan.addChild(this.boxDangVay);

        this.lbDangVayValue = new BkLabel(formatNumberIngame(this.currentBorrowMoney) + BkConstString.getGameCoinStr(), "", fontSize);
        this.lbDangVayValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
        this.lbDangVayValue.x = this.boxDangVay.width - this.lbDangVayValue.getContentSize().width/2 - 10;
        this.lbDangVayValue.y = this.boxDangVay.height/2;
        this.boxDangVay.addChild(this.lbDangVayValue);

        var remainingMoney = BkGlobal.UserInfo.getMoney() - this.currentBorrowMoney;
        if(remainingMoney < 0)
        {
            var tfQuanPhaiNap = new BkLabel("Phải nạp", "", fontSize);
            tfQuanPhaiNap.setTextColor(color);
            tfQuanPhaiNap.x = startX + tfQuanPhaiNap.getContentSize().width/2;
            tfQuanPhaiNap.y = tfQuanDangVay.y - 30;
            this.spriteTraQuan.addChild(tfQuanPhaiNap);

            var boxPhaiNap = new BkSprite("#" + res_name.numberbox);
            boxPhaiNap.x = this.boxHienCo.x;
            boxPhaiNap.y = tfQuanPhaiNap.y;
            this.spriteTraQuan.addChild(boxPhaiNap);

            this.lbPhaiNapValue = new BkLabel(formatNumberIngame(-1*remainingMoney) + BkConstString.getGameCoinStr(), "", fontSize);
            this.lbPhaiNapValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
            this.lbPhaiNapValue.x = boxPhaiNap.width - this.lbPhaiNapValue.getContentSize().width/2 - 10;
            this.lbPhaiNapValue.y = boxPhaiNap.height/2;
            boxPhaiNap.addChild(this.lbPhaiNapValue);
        } else {
            var tfQuanPhaiNap = new BkLabel("Còn lại", "", fontSize);
            tfQuanPhaiNap.setTextColor(color);
            tfQuanPhaiNap.x = startX + tfQuanPhaiNap.getContentSize().width/2;
            tfQuanPhaiNap.y = tfQuanDangVay.y - 30;
            this.spriteTraQuan.addChild(tfQuanPhaiNap);

            var boxPhaiNap = new BkSprite("#" + res_name.numberbox);
            boxPhaiNap.x = this.boxHienCo.x;
            boxPhaiNap.y = tfQuanPhaiNap.y;
            this.spriteTraQuan.addChild(boxPhaiNap);

            this.lbPhaiNapValue = new BkLabel(formatNumberIngame(remainingMoney) + BkConstString.getGameCoinStr(), "", fontSize);
            this.lbPhaiNapValue.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
            this.lbPhaiNapValue.x = boxPhaiNap.width - this.lbPhaiNapValue.getContentSize().width/2 - 10;
            this.lbPhaiNapValue.y = boxPhaiNap.height/2;
            boxPhaiNap.addChild(this.lbPhaiNapValue);
        }

        var btnNapQuan = new BkButton(res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,ccui.Widget.PLIST_TEXTURE);
        btnNapQuan.setScale(0.7);
        btnNapQuan.setTitleText("Nạp quan");
        btnNapQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnNapQuan.setVisible(this.currentBorrowMoney > BkGlobal.UserInfo.getMoney());
        btnNapQuan.x = this.boxDangVay.x + this.boxDangVay.width/2 + btnNapQuan.width/2;
        btnNapQuan.y = this.boxDangVay.y;
        this.spriteTraQuan.addChild(btnNapQuan);
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
        btnTraHetQuan.setScale(0.7);
        btnTraHetQuan.setTitleText("Trả ngay");
        btnTraHetQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnTraHetQuan.x = btnNapQuan.x;
        btnTraHetQuan.y = btnNapQuan.y - 30;
        this.spriteTraQuan.addChild(btnTraHetQuan);
        var self = this;
        btnTraHetQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    logMessage("Trả ngay Clicked!");
                    self.onBtnTraHetQuanClick();
                }
            }
        );
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

    createVayQuanSprite:function()
    {
        if(this.spriteVayQuan != null)
        {
            this.spriteVayQuan.removeAllChildren();
        }
        if(this.spriteTraQuan != null)
        {
            this.spriteTraQuan.removeAllChildren();
        }
        if(this.lbNotifyVayQuan)this.lbNotifyVayQuan.setString("");
        
        this.spriteVayQuan = new BkSprite();
        this.spriteTraQuan = new BkSprite();
        this.bgContentTab.addChild(this.spriteVayQuan);
        this.bgContentTab.addChild(this.spriteTraQuan);

        var fontSize = 14;
        if(this.availableBorrowMoney == 0)
        {
            this.lbNotifyVayQuan = new BkLabel("Bạn không thể vay thêm quan.", "", fontSize);
            this.lbNotifyVayQuan.setTextColor(BkColor.VV_VIP_TAB_SELECTED_BUTTON_COLOR);
            this.lbNotifyVayQuan.x = this.bgContentTab.width/2;
            this.lbNotifyVayQuan.y = this.bgContentTab.height/2;
            this.bgContentTab.addChild(this.lbNotifyVayQuan);
            return;
        }

        var btnVayToiDaQuan = new BkButton(res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,ccui.Widget.PLIST_TEXTURE);
        btnVayToiDaQuan.setTitleText("Vay tối đa");
        btnVayToiDaQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnVayToiDaQuan.setScaleX(0.7);
        btnVayToiDaQuan.setScaleY(0.75);
        btnVayToiDaQuan.x = this.bgContentTab.width/2;
        btnVayToiDaQuan.y = this.bgContentTab.height - btnVayToiDaQuan.height/2 - 5;

        var self = this;
        btnVayToiDaQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    self.onVayQuanRequest();
                }
            }
        );
        this.spriteVayQuan.addChild(btnVayToiDaQuan);

        var btnVayQuan = new BkButton(res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,ccui.Widget.PLIST_TEXTURE);
        btnVayQuan.setTitleText("Vay");
        btnVayQuan.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnVayQuan.setScaleX(0.7);
        btnVayQuan.setScaleY(0.75);
        btnVayQuan.x = 600 - btnVayQuan.width/2;
        btnVayQuan.y = btnVayToiDaQuan.y;

        var self = this;
        btnVayQuan.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var money = self.txtVayQuanInput.getString();
                    if(money == "")
                    {
                        showToastMessage("Bạn chưa nhập số quan cần vay",600,300);
                        return;
                    }
                    if(parseInt(money) > self.availableBorrowMoney)
                    {
                        showToastMessage("Số quan cần vay vượt quá số quan được vay.",600,300);
                        return;
                    }
                    if(parseInt(money) < self.minBorrowMoney)
                    {
                        showToastMessage("Số quan vay tối thiểu là " + formatNumberIngame(self.minBorrowMoney) + BkConstString.getGameCoinStr(),600,300);
                        return;
                    }

                    self.onVayQuanRequest(parseInt(money));
                }
            }
        );
        this.spriteVayQuan.addChild(btnVayQuan);

        this.txtVayQuanInput = createEditBox(cc.size(120, 30));
        this.txtVayQuanInput.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.txtVayQuanInput.setPaddingRight("2px");
        this.txtVayQuanInput.setTextAlignRight();
        this.txtVayQuanInput.setMaxLength(this.maxBorrowMoney? ("" + this.maxBorrowMoney).length : 20);
        this.txtVayQuanInput.setNumericMode();
        this.txtVayQuanInput.x = btnVayQuan.x - btnVayQuan.width/2 - this.txtVayQuanInput.width/2 + 10;
        this.txtVayQuanInput.y = btnVayQuan.y + 3;
        this.txtVayQuanInput.setString(this.availableBorrowMoney);
        var bgTextBox = new cc.DrawNode();
        bgTextBox.drawRect(cc.p(0,0), cc.p(120,25), cc.color("#ffffff"), 1, cc.color("#9c8643"));
        bgTextBox.x = this.txtVayQuanInput.x - 60;
        bgTextBox.y = this.txtVayQuanInput.y - 16;
        this.spriteVayQuan.addChild(bgTextBox);
        this.spriteVayQuan.addChild(self.txtVayQuanInput);
        this.txtVayQuanInput.setFocus();

        this.addEditbox(this.txtVayQuanInput);

        var mnArr = Util.getVIPMoneyArrayList(this.availableBorrowMoney,this.minBorrowMoney);
        var mnlist = this.createMoneySpriteList(mnArr);
        mnlist.x = -50;
        mnlist.y = btnVayToiDaQuan.y - 55;
        this.spriteVayQuan.addChild(mnlist);
    },
    createMoneySpriteList:function(mnArrList)
    {
        var rtnSprite = new BkSprite();
        for(var i = 1; i < 6; i++)
        {
            var moneyi = this.createMoneySprite(mnArrList[i-1]) ;
            moneyi.x = i*115;
            rtnSprite.addChild(moneyi);
        }
        return rtnSprite;
    },
    createMoneySprite:function(money)
    {
        var rtnSprite = new BkSprite("#" + res_name.vip_image_money);
        var tfMoneyValue = new BkLabel("$ " + formatNumberIngame(money), "", 15);
        tfMoneyValue.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        tfMoneyValue.x = rtnSprite.width/2;
        tfMoneyValue.y = 15;
        rtnSprite.addChild(tfMoneyValue);
        var self = this;
        rtnSprite.setMouseOnHover(null,null);
        rtnSprite.setOnlickListenner(function(touch, event){
            self.txtVayQuanInput.setString(money);
        });
        return rtnSprite;
    },
    onVayQuanRequest: function(money)
    {
        if(this.availableBorrowMoney ==0)
        {
            showToastMessage("Bạn đã vay tối đa số quan cho phép. Bạn không thể vay thêm quan.",400,270);
            return;
        }

        if(money == undefined){
            this.txtVayQuanInput.setString(this.availableBorrowMoney);
            Util.showAnim();
            BkLogicManager.getLogic().setOnLoadComplete(this);
            var packet = new BkPacket();
            packet.vipMoneyBorrowRequest(this.availableBorrowMoney);
            BkConnectionManager.send(packet);
        }
        else{
            Util.showAnim();
            BkLogicManager.getLogic().setOnLoadComplete(this);
            var packet = new BkPacket();
            packet.vipMoneyBorrowRequest(money);
            BkConnectionManager.send(packet);
        }
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

        this.lbQuanVayToiDaValue = new BkLabel(formatNumberIngame(this.minBorrowMoney) + BkConstString.getGameCoinStr(), "", fontSize);
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
    onBorrowMoneyReturn:function(obj){
        if(obj.result == 0)
        {
            //update money 
            var borrowMoney = parseInt(this.txtVayQuanInput.getString());
            this.updateUserInfo(borrowMoney);
            this.currentBorrowMoney = this.currentBorrowMoney + borrowMoney;
            this.availableBorrowMoney  = this.availableBorrowMoney - borrowMoney;
            this.updateDangVayDuocVayHanTraValue(this.currentBorrowMoney,this.availableBorrowMoney,obj.deadline);
            var self = this;
            showPopupMessageWith("Bạn đã vay thành công " + formatNumber(borrowMoney) + " quan từ hệ thống."
                ,null,function(){},function(){});
        }
    },
    updateUserInfo: function(changeMoney)
    {
        BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + changeMoney);
        BkLogicManager.getLogic().processUpdateProfileUI();
        if(this.lbMoney)
        {
            this.lbMoney.setString(formatNumberIngame(BkGlobal.UserInfo.getMoney()) + BkConstString.getGameCoinStr());
            this.lbMoney.x = this.startNameX + this.lbMoney.getContentSize().width/2;
        }
    },
    updateDangVayDuocVayHanTraValue: function(dangVay, duocVay, deadLine)
    {
        var deadLineValue = "";
        if(dangVay == 0)
        {
            deadLineValue = "--/--/----";
            this.lbHanTraQuanValue.setString(deadLineValue);
            this.lbHanTraQuanValue.x = this.endOnRight - this.lbHanTraQuanValue.getContentSize().width/2;
        }else if(deadLine > 0){
            deadLineValue = BkTime.convertToLocalTime24h(deadLine);
            this.lbHanTraQuanValue.setString(deadLineValue);
            this.lbHanTraQuanValue.x = this.endOnRight - this.lbHanTraQuanValue.getContentSize().width/2;
        }

        this.lbQuanDangVayValue.setString(formatNumberIngame(dangVay) + BkConstString.getGameCoinStr());
        this.lbQuanDuocVayValue.setString(formatNumberIngame(duocVay) + BkConstString.getGameCoinStr());
        this.lbQuanDangVayValue.x = this.endOnRight - this.lbQuanDangVayValue.getContentSize().width/2;
        this.lbQuanDuocVayValue.x = this.endOnRight - this.lbQuanDuocVayValue.getContentSize().width/2;
    },
    onPayBorrowedMoneyReturn:function(returnMoney)
    {
        this.currentBorrowMoney = this.currentBorrowMoney - returnMoney;
        this.availableBorrowMoney = this.maxBorrowMoney - this.currentBorrowMoney;

        showPopupMessageWith("Bạn đã trả thành công " + formatNumberIngame(returnMoney) + " quan cho hệ thống.");
        this.updateUserInfo(-1 * returnMoney);
        this.updateDangVayDuocVayHanTraValue(this.currentBorrowMoney,this.availableBorrowMoney);
        if(this.lbQuanDangVayValue)
        {
            this.lbQuanDangVayValue.setString(formatNumberIngame(this.currentBorrowMoney) + BkConstString.getGameCoinStr());
            this.lbQuanDangVayValue.x = this.endOnRight - this.lbQuanDangVayValue.getContentSize().width/2;
        }
        if(this._currentTab == 1) this.createTraQuanSprite();

    },
    onLoadComplete: function (obj, tag) {
        logMessage("onLoadComplete "+tag);
        Util.removeAnim();
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case VC.VIP_BORROW_INFO:
                this.drawUI(obj.maxBorrowMoney,obj.currentBorrowMoney,obj.deadLine, obj.minBorrowMoney, false);
                break;
            case VC.VIP_BORROW_MONEY:
                this.onBorrowMoneyReturn(obj);
                break;
            case VC.VIP_RETURN_BORROWED_MONEY:
                this.onPayBorrowedMoneyReturn(obj);
                break;
        }
    },
    onClickHelp:function () {
        logMessage("onClickHelp");
        var layer = new VvVipBenefitDetailsWindow(this);
        layer.showWithParent();
    }
});
