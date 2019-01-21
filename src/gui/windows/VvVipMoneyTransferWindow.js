/**
 * Created by bs on 01/06/2017.
 */
VvVipMoneyTransferWindow = VvWindow.extend({
    listMoney:[100000,200000,500000,1000000,2000000,5000000],
    startNameX:0,
    userData:null,
    bmAvar:null,
    lbPhiChuyen:null,
    lbNote:null,
    tf_Name_Input:null,
    spriteSheet: cc.spriteFrameCache,
    trasferPercent:0,
    minTransfer:100000,
    ctor: function (pr) {
        this._super("Chuyển quan", cc.size(670, 420),pr);
        this.setVisibleOutBackgroundWindow(true);
        this.doGetVipTranferInfo();
        this.drawAvar();

        var bgNote = new BkSprite("#"+res_name.noteBg);
        bgNote.x = 170;
        bgNote.y = 110;
        this.addChildBody(bgNote);

        var startXQD = 65;
        var deltaY = 22;
        var lbQD = new BkLabel("Qui định","",16);
        lbQD.setTextColor(cc.color(140,82,36));
        lbQD.x = startXQD + lbQD.getContentSize().width/2;
        lbQD.y = 160;
        this.addChildBody(lbQD);

        this.lbNote = new BkLabel("- Số quan chuyển nhỏ nhất là 100k","",15);
        this.lbNote.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        this.lbNote.x = startXQD -20 +this.lbNote.getContentSize().width/2;
        this.lbNote.y = 135;
        this.addChildBody(this.lbNote);

        var lbNote2 = new BkLabel("- Số quan chuyển chia hết cho 1000","",15);
        lbNote2.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        lbNote2.x = startXQD -20 +lbNote2.getContentSize().width/2;
        lbNote2.y = this.lbNote.y - deltaY;
        this.addChildBody(lbNote2);

        var lbNote3 = new BkLabel("- Tài khoản nhận viết liền không được\n có dấu cách","",15);
        lbNote3.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        lbNote3.x = startXQD -20 +lbNote3.getContentSize().width/2;
        lbNote3.y = this.lbNote.y - 2.5*deltaY;
        this.addChildBody(lbNote3);

        this.drawEditText();

        this.drawRadio();

        var btnXacNhan = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy,res_name.vv_btn_dongy
            ,res_name.vv_btn_dongy_hover,"Xác nhận",0,0);
        btnXacNhan.x = this.tf_Name_Input.x;
        btnXacNhan.y = 80;//this.tf_Name_Input.x;
        btnXacNhan.setTitleColor(cc.color(0,0,0));
        this.addChildBody(btnXacNhan);
        var self = this;
        btnXacNhan.addClickEventListener(function () {
            self.onXacNhanClick();
        })
    },
    validateQuanChuyen:function (money) {
        var rtnStr = "";

        if(money < this.minTransfer)
        {
            rtnStr  = "Số quan chuyển nhỏ nhất là "+formatNumber(this.minTransfer) +" quan.";
        }
        if(money%1000 != 0)
        {
            rtnStr = "Số quan chuyển phải chia hết cho 1000";
        }
        if(money*(1 + this.trasferPercent/100)  > BkGlobal.UserInfo.getMoney())
        {
            rtnStr = "Số quan chuyển cộng với phí chuyển lớn hơn số quan bạn đang có."
        }
        return rtnStr;
    },
    onXacNhanClick:function () {
        if (this.tf_Name_Input.getString() == ""){
            showToastMessage("Bạn chưa nhập tên người nhận.",490,270);
            return;
        }
        if (!isUserNameValidate(this.tf_Name_Input)){
            showToastMessage("Tên người nhận không tồn tại trong hệ thống.",490,270);
            return;
        }
        var nameTK = this.tf_Name_Input.getString();
        var money = Math.floor(this.tf_Quan_Input.getString());
        var error = this.validateQuanChuyen(money);
        if (error!= ""){
            showToastMessage(error,490,270,3);
            return;
        }
        var strText = "Bạn có chắc chắn muốn chuyển "
            +formatNumber(money)
            + " quan \n cho tài khoản " + this.tf_Name_Input.getString()
            + " ?\n Phí giao dịch: " + formatNumber(money*this.trasferPercent/100) + " quan.";
        var self = this;
        self.setEnableEditBox(false);
        showPopupConfirmWith(strText,"Xác nhận chuyển quan",function () {
            Util.showAnim();
            BkLogicManager.getLogic().setOnLoadComplete(self);
            var Packet = new BkPacket();
            Packet.vipMoneyTransferRequest(nameTK,money);
            BkConnectionManager.send(Packet);
        },function () {

        },function () {
            logMessage("setEnableEditBox");
            self.setEnableEditBox(true);
        }//,this
        );
        BkDialogWindowManager.confirmPopup.y -=15;
    },
    configRadioButton:function (rdData) {
        var rd = new BkRadioButton(rdData.description);
        rd.setData(rdData);
        rd.setGroup(this.radioGroup);
        var rbID = rd.getRadioButtonId();
        if (rbID == 0){
            this.radioGroup.setRadioSelected(rd);
            this.tf_Quan_Input.setString(rd.getValue()+"");
        }
        var xPos = this.getWindowSize().width * 0.14 * ((rbID %3) +1) + 240;
        var yPos = this.tf_Quan_Input.y - this.tf_Quan_Input.height/2 - 30;
        yPos -= Math.floor(rbID / 3) * 35;
        rd.x = xPos;
        rd.y = yPos;
        this.getBodyItem().addChild(rd);
    },
    drawRadio:function () {
        var self = this;
        this.radioGroup = new BkRadioButtonGroup();
        this.radioGroup.setOnSelectedCallback(function(){
            var selectRB= self.radioGroup.getRadioButtonSelected();
            if (selectRB == null){
                return;
            }
            self.tf_Quan_Input.setString(selectRB.getValue()+"");
        });

        for (var i=0;i<this.listMoney.length;i++){
            var rdData = new BkRadioButtonData(i,this.listMoney[i],convertStringToMoneyFormat(""+this.listMoney[i],true));
            this.configRadioButton(rdData);
        }
    },
    setEnableEditBox:function (isEn) {
        // this.tf_Name_Input.setDisabled(!isEn,true);
        // this.tf_Quan_Input.setDisabled(!isEn,true);
    },
    drawEditText:function () {
        var startX = this.getWindowSize().width/2;
        var lbNTTK = new BkLabel("Nhập tên tài khoản","",16);
        lbNTTK.x = startX + lbNTTK.getContentSize().width/2;
        lbNTTK.y = this.bmAvar.y + 40;
        lbNTTK.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        this.addChildBody(lbNTTK);

        this.spriteSheet.addSpriteFrames(res.vv_nap_tien_plist, res.vv_nap_tien_img);
        this.tf_Name_Input = createEditBox(cc.size(246, 35), this.spriteSheet.getSpriteFrame(res_name.napxu_edit_text));
        this.tf_Name_Input.setStylePaddingLeft("3px");
        this.tf_Name_Input.setStylePaddingBottom("3px");
        this.tf_Name_Input.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.tf_Name_Input.setFontSize(15);
        this.tf_Name_Input.setMaxLength(20);
        this.tf_Name_Input.setFontName(res.GAME_FONT);
        this.tf_Name_Input.x = 460;
        this.tf_Name_Input.y = 285;
        this.tf_Name_Input.setAutoFocus(true);
        this.tf_Name_Input.setTabStopToPrevious();
        this.addChildBody(this.tf_Name_Input,100);


        var lbNQC = new BkLabel("Nhập quan chuyển","",16);
        lbNQC.x = startX + lbNQC.getContentSize().width/2;
        lbNQC.y = this.bmAvar.y - 30;
        lbNQC.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        this.addChildBody(lbNQC);

        this.tf_Quan_Input = createEditBox(cc.size(246, 35), this.spriteSheet.getSpriteFrame(res_name.napxu_edit_text));
        this.tf_Quan_Input.setStylePaddingLeft("3px");
        this.tf_Quan_Input.setStylePaddingBottom("3px");
        this.tf_Quan_Input.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.tf_Quan_Input.setFontSize(15);
        this.tf_Quan_Input.setMaxLength(20);
        this.tf_Quan_Input.setFontName(res.GAME_FONT);
        this.tf_Quan_Input.x = 460;
        this.tf_Quan_Input.y = 214;
        this.tf_Quan_Input.setAutoFocus(true);
        this.tf_Quan_Input.setTabStopToPrevious();
        this.addChildBody(this.tf_Quan_Input,100);

        this.addEditbox(this.tf_Name_Input);
        this.addEditbox(this.tf_Quan_Input);
    },
    drawAvar:function () {
        this.userData = BkGlobal.UserInfo;
        this.bmAvar = VvAvatarImg.getAvatarSpriteFromIDAndTopData(this.userData.avatarID,this.userData.getTopType(), this.userData.getMinRank(),this.userData.VipLevel);
        this.bmAvar.x = 100;
        this.bmAvar.y = 280;
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
        var fontSize = 16;
        var nameValue  = Util.trimName(this.userData.getUserName(),11);
        var lbName = new BkLabel(nameValue,"",fontSize);
        lbName.x = this.startNameX + lbName.getContentSize().width/2;
        lbName.y = startY;
        this.addChildBody(lbName);

        this.lbMoney= new BkLabel(formatNumber(this.userData.getMoney()) + " quan","",fontSize);
        this.lbMoney.setTextColor(BkColor.TEXT_MONEY_COLOR);
        this.lbMoney.x = this.startNameX + this.lbMoney.getContentSize().width/2;
        this.lbMoney.y = lbName.y - deltaY;
        this.addChildBody(this.lbMoney);

        var lvVip = new BkLabel("VIP "+this.userData.VipLevel,"",fontSize);
        lvVip.x = this.startNameX + lvVip.getContentSize().width/2;
        lvVip.y = lbName.y - 2*deltaY;
        this.addChildBody(lvVip);

        this.lbPhiChuyen = new BkLabel("Phí chuyển: ","",fontSize);
        this.lbPhiChuyen.x = this.startNameX + this.lbPhiChuyen.getContentSize().width/2;
        this.lbPhiChuyen.y = lbName.y - 3*deltaY;
        this.addChildBody(this.lbPhiChuyen);
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
        this.lvImg.x = this.levelStarBg.x;
        this.lvImg.y = this.levelStarBg.y + 15;
        this.addChildBody(this.lvImg);

        this.lvStar = VvLevelImage.getLevelSprite(level);
        this.lvStar.x = this.levelStarBg.x - 10;
        this.lvStar.y = this.levelStarBg.y;
        this.addChildBody(this.lvStar);
    },

    doGetVipTranferInfo:function () {
        Util.showAnim();
        BkLogicManager.getLogic().setOnLoadComplete(this);
        var packet = new BkPacket();
        packet.CreatePacketWithTypeAndByteData(c.NETWORK_VIP_FUNCTION,VC.VIP_TRANSFER_INFO);
        BkConnectionManager.send(packet);

    },
    drawUI:function (tax,minTranfer) {
        this.lbNote.setString("- Số quan chuyển nhỏ nhất là "+formatNumberIngame(minTranfer));
        this.lbNote.x = 45 +this.lbNote.getContentSize().width/2;

        this.lbPhiChuyen.setString("Phí chuyển: "+tax+"%");
        this.lbPhiChuyen.x = this.startNameX + this.lbPhiChuyen.getContentSize().width/2;

        this.trasferPercent = tax;
        this.minTransfer = minTranfer;
    },
    onTransferReturn:function (result) {
        var strResult = "";
        var nameTK = this.tf_Name_Input.getString();
        var money = Math.floor(this.tf_Quan_Input.getString());
        if(result == 0)
        {
            strResult = "Bạn đã chuyển " + formatNumber(money) + " quan" + " thành công tới tài khoản " + nameTK +
                " phí chuyển quan là " + formatNumber(money*this.trasferPercent/100) +" quan";

            var moneyTodecrease = Math.floor(money*( 1 + this.trasferPercent/100));
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney()- moneyTodecrease);
            BkLogicManager.getLogic().processUpdateProfileUI();
            this.lbMoney.setString(formatNumber(BkGlobal.UserInfo.getMoney()) + " quan");
            this.lbMoney.x = this.startNameX + this.lbMoney.getContentSize().width/2;
            this.tf_Name_Input.setString("");
        }
        if(result == 1)
        {
            strResult = "Bạn không đủ tiền để chuyển quan.";
        }
        if(result == 2)
        {
            strResult = "Cấp VIP của bạn chưa đủ để chuyển quan.";
        }
        if(result == 3)
        {
            strResult = "Tài khoản nhận quan không tồn tại."
        }
        if(result == 4)
        {
            strResult = "Bạn không thể gửi tiền cho chính mình."
        }
        if(result == 5)
        {
            strResult = "Số tiền cần chuyển không hợp lệ."
        }
        this.setEnableEditBox(false);
        var self = this;
        showPopupMessageWith(strResult,"",null,function () {
            self.setEnableEditBox(true);

        },this);
        BkDialogWindowManager.confirmPopup.y -=15;
    },
    //====================================================
    onLoadComplete: function (obj, tag) {
        logMessage("onLoadComplete "+tag);
        //var o = {tax:tax,minTranfer:minTranfer};
        Util.removeAnim();
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case VC.VIP_TRANSFER_INFO:
                this.drawUI(obj.tax,obj.minTranfer);
                break;
            case VC.VIP_TRANSFER_MONEY:
                logMessage(" data "+obj.transferResult);
                this.onTransferReturn(obj.transferResult);
                break;
        }
    }
});
