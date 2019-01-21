/**
 * Created by hoangthao on 17/10/2015.
 */
MB_ID = 0;
VN_ID = 1;
VT_ID = 2;
PM_CONTENT_PADDING_Y = 16;
PM_PM_CONTENT_PADDING_Y = 8;
PM_PADDING_LR = 42;
PM_PADDING_TEXT_LR = PM_PADDING_LR + PM_CONTENT_PADDING_Y;
PM_PADDING_TB = 25;

PM_SMS_PADDING_LR = PM_PADDING_LR;
PM_SMS_PADDING_TEXT_LR = PM_PADDING_LR + PM_CONTENT_PADDING_Y;
PM_SMS_PADDING_TB = 22;
PAYMENT_MOBI_TEXT_COLOR = cc.color(255,153,153, 180);
PM_SMS_COMMAND_COLOR = cc.color(246,224,1);

BkPaymentWindow = BkTabWindow.extend({
    _tabList: ["Thẻ cào", "Tin nhắn (SMS)"],
    spriteSheet: cc.spriteFrameCache,
    TheCaoSprite: null,
    SMSSprite: null,
    TelcoID: 0,
    vtSprite: null,
    mobiSprite: null,
    vinaSprite: null,
    listTheMobile: null,
    ItemCardXu: null,
    tf_SSR_Input: null,
    tf_MST_Input: null,
    btnNap: null,
    strprovider: "Mobifone",
    contentbg: null,
    marginLR: 20,
    arrowPos: null,
    unavailableTheCaoTelcos: [],
    ctor: function () {
        this._super("Nạp xu", cc.size(750, 450), this._tabList.length, this._tabList);
        
        return;//this.initPm();
        //Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"AddMoneyScreen");
    },
    initPm: function () {
        this.spriteSheet.addSpriteFrames(res.nap_tien_ss_plist, res.nap_tien_ss_img);
        this.setMoveableWindow(true);
        this.setVisibleOutBackgroundWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
        this.initTheCao();
        this.getContentProviderInfo(this.TelcoID);

    },

    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag)
        {
            case c.NETWORK_SERVER_REQUEST:
            {
                logMessage("goes here");
                var paymentType = o.Buffer.readByte();
                var item;
                if(paymentType == PAYMENT_TYPE.ADD_MONEY_TYPE_CARD)
                {
                    this.listTheMobile = [];
                    this.unavailableTheCaoTelcos = [];
                    var telcoType = o.Buffer.readByte();
                    var numOfItem = o.Buffer.readByte();
                    for(var i = 0; i < numOfItem; i++)
                    {
                        var menhGiathe = o.Buffer.readInt();
                        var xu = o.Buffer.readInt();
                        var xuKM = xu + o.Buffer.readInt();
                        item = new BkConvertCardXu(menhGiathe,xu,xuKM);
                        this.listTheMobile.push(item);
                        logMessage("telcoType:" + telcoType + " menhGiathe:" + menhGiathe + " xu:" + xu + " Xu KM:" + xuKM);
                    }
                    var bonusPercent = o.Buffer.readInt();
                    var isBonus = (bonusPercent > 0);
                    this.initTheTableBg(isBonus);
                    if(this.lblGuide != undefined && this.lblGuide != null)
                    {
                        this.lblGuide.removeFromParent();
                    }
                        var strGuide = "Tỷ giá quy đổi khi nạp thẻ";
                        this.lblGuide = new BkLabel(strGuide,"Arial",15);
                        this.lblGuide.x = 200;
                        this.lblGuide.y = 250;
                        this.TheCaoSprite.addChild(this.lblGuide);

                    if(bonusPercent > 0)
                    {
                        var strbonus = "(Khuyến Mại " + bonusPercent + "%)";
                        if(this.lblBonus != undefined && this.lblBonus != null)
                        {
                            this.lblBonus.removeFromParent();
                        }
                        this.lblBonus = new BkLabel(strbonus,"Arial",15);
                        this.lblBonus.x = this.lblGuide.x + this.lblGuide.getContentSize().width/2 + this.lblBonus.getContentSize().width/2;
                        this.lblBonus.setTextColor(cc.color.YELLOW);
                        this.lblBonus.y = this.lblGuide.y;
                        this.TheCaoSprite.addChild(this.lblBonus);
                        this.lblBonus.setString(strbonus);
                        item = new BkConvertCardXu("Thẻ(VNĐ)", "Cũ", "Mới");
                        this.listTheMobile.unshift(item);
                    }
                    else
                    {
                        this.lblGuide.x = 250;
                        item = new BkConvertCardXu("Thẻ(VNĐ)", "Xu",null);
                        this.listTheMobile.unshift(item);
                    }
                    var isSameBonusPercent = (o.Buffer.readByte() == 1);
                    var isAvailable = (o.Buffer.readByte() == 1);
                    logMessage(" Bonus percent:" + bonusPercent + " menh gia the:"+ menhGiathe
                        + " isSameBonusPercent:" + isSameBonusPercent + " isAvailable:" + isAvailable);
                    if(!isAvailable)
                    {
                        this.unavailableTheCaoTelcos.push(telcoType);
                    }
                    if(this.ItemCardXu != null)
                    {
                        this.ItemCardXu.removeSelf();
                    }
                    this.ItemCardXu = this.createListCardXuWith(this.listTheMobile,isBonus);
                    this.ItemCardXu.x = this.getBodySize().width /2 - 200;
                    this.ItemCardXu.y = this.contentbg.y;
                    this.TheCaoSprite.addChild(this.ItemCardXu);
                }
                if(paymentType == PAYMENT_TYPE.ADD_MONEY_TYPE_SMS)
                {
                    var numOfItem = o.Buffer.readByte();
                    this.SMSSprite = new BkSprite();
                    this.SMSSprite.x = 105;
                    this.SMSSprite.y = 90;
                    this.addChild(this.SMSSprite);
                    var startY = 300;
                    var isNewServicesNumber = false;
                    for(var i = 0; i < numOfItem; i++)
                    {
                        var menhGia = o.Buffer.readInt();
                        var xu = o.Buffer.readInt();
                        var xuKM = xu + o.Buffer.readInt();
                        var strServicesNumber = o.Buffer.readString();
                        if(strServicesNumber =="9029")
                        {
                            isNewServicesNumber = true;
                        }
                        var strContent = o.Buffer.readString();
                        var smsSpritei = this.CreateSMSSprite(menhGia, xu,xuKM ,strContent, strServicesNumber, isNewServicesNumber);
                        logMessage("menhGia:" + menhGia + "xu:" + xu + "xuKM:" + xuKM + "strServicesNumber:" + strServicesNumber + "strContent:" + strContent );
                        this.SMSSprite.addChild(smsSpritei);
                        smsSpritei.x = smsSpritei.width / 2;
                        smsSpritei.y = startY;
                        startY = startY - 130;
                    }
                    var numOfUnavailableTelco = o.Buffer.readByte();
                    if(numOfUnavailableTelco > 0)
                    {
                        var providerName = "";
                        for(var i = 0; i < numOfUnavailableTelco; i++)
                        {
                            var unavailableTelco = o.Buffer.readByte();
                            if(i == 0)
                            {
                                providerName = this.getProviderNameFromId(unavailableTelco);
                            }else
                            {
                                providerName = providerName + "," + this.getProviderNameFromId(unavailableTelco);
                            }
                            logMessage("unavailableTelco:" + unavailableTelco);
                        }
                        if(providerName != "") {
                            sendGA(BKGA.PAYMENT, 'SMS fail', providerName);
                            var strUnavailableSMS = "Hiện tại nạp tiền bằng SMS của nhà mạng:\n" + providerName + " đang gặp sự cố, xin hãy thử cách nạp tiền khác.";
                            this.showPopUpNotify(strUnavailableSMS);
                        }
                    }
                    var SMSNoteSpriteNew = this.CreateSMSNote(isNewServicesNumber);
                    SMSNoteSpriteNew.x = this.getBodySize().width/2;
                    SMSNoteSpriteNew.y = SMSNoteSpriteNew.height/2 + 15;
                    if(!isNewServicesNumber)
                    {
                        SMSNoteSpriteNew.y = SMSNoteSpriteNew.height/2 - 5;
                    }
                    this.SMSSprite.addChild(SMSNoteSpriteNew);
                }

                break;
            }
            case c.NETWORK_NAP_THE_CAO_BANNED:
                var wrongNapTheCount = o.Buffer.readByte();
                sendGA(BKGA.PAYMENT, 'Card BANNED', wrongNapTheCount);
                this.NotifyNapTheBanned(wrongNapTheCount);
                break;
            case c.NETWORK_NAP_THE_CAO_FAILED:
                var napTheResultCode = o.Buffer.readByte();
                this.NotifyNapTheFailed(napTheResultCode);
                break;
            case c.NETWORK_NAP_THE_CAO_SUCCESS:
                var totalMoney = o.Buffer.readInt();
                this.NotifyNapTheSucess(totalMoney);
                while (o.Buffer.isReadable())
                {
                    var realMoney = o.Buffer.readInt();
                    Util.logPurchase(realMoney,"Thecao");
                }
                break;
            case c.NETWORK_SERVICE_NAP_THE_BUSY:
                this.NotifyNapTheBusy();
                break;
            default :
            {
                logMessage("BkPaymentWindow not process packet with type " + tag);
            }
        }
        Util.removeAnim();
    },
    getProviderNameFromId:function(id)
    {
        if(id == 0)
        {
            return "Mobifone";
        }else if(id == 1)
        {
            return "Vinaphone";
        }else if(id == 2)
        {
            return "Viettel";
        }
        return "";
    },
    selectedTabEvent: function (sender, tabIndex) {
        this.DrawUIWithTab(tabIndex);
    },

    DrawUIWithTab: function (i) {
        if (i == 1) {
            this.DrawTabTheCao();
        }
        else if (i == 2) {
            this.DrawTabSMS();
        }
    },
    initTheTableBg:function(isBonus)
    {
        if(this.theTableBg != undefined && this.theTableBg != null)
        {
            this.theTableBg.removeSelf();
        }
        if(isBonus)
        {
            this.theTableBg =  new BkSprite("#" + res_name.board_3columns);
        }else
        {
            this.theTableBg =  new BkSprite("#" + res_name.board_2columns);
        }
        this.theTableBg.x = 252;
        this.theTableBg.y = 152;
        this.TheCaoSprite.addChild(this.theTableBg);
    },
    createRowWithBonus: function (strThe, strOldXu, strNewXu,rowIdx) {
        var textColor = BkColor.GRID_ITEM_TEXT_COLOR;
        var fontSize = 15;
        var isBold = false;
        var rtnS = new BkSprite();
        if(rowIdx == 0)
        {
            isBold = true;
        }
        else
        {
            strThe = convertStringToMoneyFormat(strThe,true);
            strOldXu = convertStringToMoneyFormat(strOldXu,true) + "$";
            strNewXu = convertStringToMoneyFormat(strNewXu,true)+"$";
        }
        var tfTheCao = new BkLabel(strThe, "Tahoma", fontSize,isBold);
        tfTheCao.y = 0 ;
        tfTheCao.setTextColor(textColor);
        rtnS.addChild(tfTheCao);
        tfTheCao.x = 105 - tfTheCao.getContentSize().width/2;
        var tfOldXu = new BkLabel(strOldXu, "Tahoma", fontSize,isBold);
        tfOldXu.setTextColor(textColor);
        tfOldXu.x = 240 - tfOldXu.getContentSize().width/2;
        tfOldXu.y = tfTheCao.y;
        rtnS.addChild(tfOldXu);
        //tfNewXu
        var tfNewXu = new BkLabel(strNewXu, "Tahoma", fontSize,isBold);
        tfNewXu.setTextColor(textColor);
        rtnS.addChild(tfNewXu);
        tfNewXu.x = 370 - tfNewXu.getContentSize().width/2;
        tfNewXu.setTextColor(cc.color.YELLOW);
        tfNewXu.y = tfTheCao.y;
        if(rowIdx != 0)
        {
            tfOldXu.setTextColor(cc.color.GRAY);
            tfOldXu.setStrikeThrough();
        }else
        {
            tfNewXu.x = 345;
            tfOldXu.x = 210;
            tfTheCao.x = 80;
            tfNewXu.setTextColor(cc.color.WHITE);
        }
        return rtnS;
    },
    createRowWithNoBonus: function (strThe, strOldXu, strNewXu,rowIdx) {
        var textColor = BkColor.GRID_ITEM_TEXT_COLOR;
        var fontSize = 15;
        var isBold = false;
        var rtnS = new BkSprite();
        if(rowIdx == 0)
        {
            isBold = true;
        }
        else
        {
            strThe = convertStringToMoneyFormat(strThe,true);
            strOldXu = convertStringToMoneyFormat(strOldXu,true) + "$";
        }
        var tfTheCao = new BkLabel(strThe, "Tahoma", fontSize,isBold);
        tfTheCao.y = 0 ;
        tfTheCao.setTextColor(textColor);
        rtnS.addChild(tfTheCao);
        tfTheCao.x = 135 - tfTheCao.getContentSize().width/2;
        var tfOldXu = new BkLabel(strOldXu, "Tahoma", fontSize,isBold);
        tfOldXu.setTextColor(textColor);
        tfOldXu.x = 340 - tfOldXu.getContentSize().width/2;
        tfOldXu.y = tfTheCao.y;
        rtnS.addChild(tfOldXu);
        if(rowIdx != 0)
        {
            tfOldXu.setTextColor(cc.color.YELLOW);
        }else
        {
            tfOldXu.x = 310;
            tfTheCao.x = 115;
        }
        return rtnS;
    },
    resetIcoTelco: function () {
        this.vtSprite.setScale(0.8);
        this.vinaSprite.setScale(0.8);
        this.mobiSprite.setScale(0.8);

        this.vtSprite.opacity  = 90;
        this.vinaSprite.opacity = 90;
        this.mobiSprite.opacity = 90;
    },

    selectedIcoTelco: function (target) {
        target.opacity = 255;
        target.setScale(1);
    },

    configWithTelcoID: function (i)
    {
        this.resetIcoTelco();
        this.getContentProviderInfo(i);
        if (i == 0)
        {
            this.selectedIcoTelco(this.mobiSprite);
        }
        if (i == 1) {
            this.selectedIcoTelco(this.vinaSprite);
        }
        if (i == 2) {
            this.selectedIcoTelco(this.vtSprite);
        }
    },

    createListCardXuWith: function (list,isBonus)
    {
        var rtnS = new BkSprite();
        rtnS.setContentSize(cc.size(250,175));
        var startY = 150;
        var rowHeight = 27.5;
        var iRow;
        for (var i = 0; i < list.length; i++)
        {
            var iOj = list[i];
            if(isBonus)
            {
                iRow = this.createRowWithBonus(iOj.TheCao, iOj.oldXu, iOj.newXu, i);
            }else
            {
                iRow = this.createRowWithNoBonus(iOj.TheCao, iOj.oldXu, iOj.newXu, i);
            }
            iRow.y = startY;
            startY = startY - rowHeight;
            rtnS.addChild(iRow);
        }
        return rtnS;
    },

    DrawTabSMS: function () {
        if (this.TheCaoSprite != null) {
            this.TheCaoSprite.visible = false;
            cc.eventManager.pauseTarget(this.TheCaoSprite, true);
        }
        if (this.SMSSprite != null) {
            this.SMSSprite.visible = true;
        }
        else {
            this.initSMS();
        }
    },
    DrawTabTheCao: function () {
        if (this.TheCaoSprite != null) {
            this.TheCaoSprite.visible = true;
            cc.eventManager.resumeTarget(this.TheCaoSprite, true);
            this.tf_MST_Input.setAutoFocus(true);
        }
        if (this.SMSSprite != null) {
            this.SMSSprite.visible = false;
        }
    },
    initImageTelco: function () {
        var startX = this.getBodySize().width / 4;
        var startY = this.getBodySize().height - 60;
        this.TheCaoSprite = new BkSprite();

        this.vtSprite = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.viettel_select));
        this.vtSprite.y = startY;
        this.vtSprite.x = startX + 35;

        this.mobiSprite = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.mobi_select));
        this.mobiSprite.y = startY;
        this.mobiSprite.x = this.vtSprite.x + this.vtSprite.width + this.marginLR;

        this.vinaSprite = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.vina_select));
        this.vinaSprite.y = startY;
        this.vinaSprite.x = this.mobiSprite.x + this.mobiSprite.width + this.marginLR - 5;

        this.initMouseAction();
        //arrow_pos
        if (this.arrowPos == null) {
            this.arrowPos = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.arrow_pos_payment));
            this.TheCaoSprite.addChild(this.arrowPos,1);
        }
        this.TheCaoSprite.addChild(this.vinaSprite);
        this.TheCaoSprite.addChild(this.mobiSprite);
        this.TheCaoSprite.addChild(this.vtSprite);
    },

    initTheCao: function ()
    {
        this.initImageTelco();
        this.contentbg = new cc.Scale9Sprite(res_name.bg_payment);
        this.contentbg.setContentSize(this.getBodySize().width -(PM_PADDING_LR*2), 280);
        this.contentbg.x = this.contentbg.width/2 + 42;
        this.contentbg.y = this.getBodySize().height / 2 - 45;

        this.TheCaoSprite.addChild(this.contentbg,-1);
        var tf_MST = new BkLabel("Mã thẻ", "Tahoma", 15);
        tf_MST.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR);
        tf_MST.x = 490;
        tf_MST.y = 213;
        this.TheCaoSprite.addChild(tf_MST);

        //TextField SSR
        var tf_SSR = new BkLabel("Số seri", "Tahoma", 15);
        tf_SSR.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR);
        tf_SSR.x = tf_MST.x + tf_SSR.getContentSize().width/2 - tf_MST.getContentSize().width/2 ;
        tf_SSR.y = 155;
        this.TheCaoSprite.addChild(tf_SSR);

        // Input MST
        this.tf_MST_Input = createEditBox(cc.size(216, 30), this.spriteSheet.getSpriteFrame(res_name.editTextPayment));
        this.tf_MST_Input.setStylePaddingLeft("3px");
        this.tf_MST_Input.setStylePaddingBottom("3px");
        this.tf_MST_Input.setFontColor(cc.color.WHITE);
        this.tf_MST_Input.setFontSize(15);
        this.tf_MST_Input.setMaxLength(20);
        this.tf_MST_Input.setFontName(res.GAME_FONT);
        this.tf_MST_Input.x = 575 ;
        this.tf_MST_Input.y = tf_MST.y - 25;
        this.tf_MST_Input.setAutoFocus(true);
        this.tf_MST_Input.setTabStopToPrevious();
        this.TheCaoSprite.addChild(this.tf_MST_Input);
        //Input SSR
        this.tf_SSR_Input = createEditBox(cc.size(216, 30), this.spriteSheet.getSpriteFrame(res_name.editTextPayment));
        this.tf_SSR_Input.setStylePaddingLeft("3px");
        this.tf_SSR_Input.setStylePaddingBottom("3px");
        this.tf_SSR_Input.setFontColor(cc.color.WHITE);
        this.tf_SSR_Input.setFontSize(15);
        this.tf_SSR_Input.setMaxLength(20);
        this.tf_SSR_Input.setFontName(res.GAME_FONT);
        this.tf_SSR_Input.x = this.tf_MST_Input.x;
        this.tf_SSR_Input.y = tf_SSR.y - 25;
        this.tf_SSR_Input.setTabStopToNext();
        this.TheCaoSprite.addChild(this.tf_SSR_Input);

        this.btnNap = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
        this.btnNap.setTitleText("Nạp xu");
        this.btnNap.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                logMessage("DoNapThe");
                this.DoNapThe();
            }
        }, this);
        this.btnNap.x = this.tf_SSR_Input.x;
        this.btnNap.y = tf_SSR.y - this.btnNap.height - PM_PM_CONTENT_PADDING_Y - 25;
        this.TheCaoSprite.addChild(this.btnNap);

        // set default provider
        this.configWithTelcoID(MB_ID);
        this.updateArrowPos(this.mobiSprite);
        this.addChildBody(this.TheCaoSprite);
    },

    updateArrowPos: function (pos) {
        this.arrowPos.x = pos.x;
        this.arrowPos.y = this.contentbg.y + this.contentbg.getContentSize().height/2 + this.arrowPos.height / 2 - 5;
    },

    ChooseViettel: function ()
    {
        if(this.TelcoID == VT_ID)
        {
            return;
        }
        this.strprovider = "Viettel";
        this.updateArrowPos(this.vtSprite);
        this.TelcoID = VT_ID;
        this.configWithTelcoID(this.TelcoID);
    },

    ChooseMobile: function ()
    {
        if(this.TelcoID == MB_ID)
        {
            return;
        }
        this.strprovider = "Mobifone";
        this.updateArrowPos(this.mobiSprite);
        this.TelcoID = MB_ID;
        this.configWithTelcoID(this.TelcoID);
    },

    ChooseVina: function ()
    {
        if(this.TelcoID == VN_ID)
        {
            return;
        }
        this.strprovider = "Vinaphone";
        this.updateArrowPos(this.vinaSprite);
        this.TelcoID = VN_ID;
        this.configWithTelcoID(this.TelcoID);
    },

    DoNapThe: function () {
        if (this.isInputValidate() == true) {
            if (this.isTelcoIdAvailable(this.TelcoID)) {
                this.initHandleonLoadComplete();
                var packet = new BkPacket();
                packet.CreatePaymentPacket(this.tf_MST_Input.getString(), this.tf_SSR_Input.getString(), this.TelcoID);
                BkConnectionManager.send(packet);
                Util.showAnim();
            } else {
                this.NotifyNapTheBusy();
            }
        }
    },

    isTelcoIdAvailable: function (telcoID) {
        for (var i = 0; i < this.unavailableTheCaoTelcos.length; i++) {
            if (this.unavailableTheCaoTelcos[i] == telcoID) {
                return false;
            }
        }
        return true;
    },

    isInputValidate: function () {
        var strMess = "";
         if (this.tf_MST_Input.getString() == "") {
            strMess = BkConstString.STR_MST_EMPTY;
            this.tf_MST_Input.setAutoFocus(true);
        }
        else if (this.tf_SSR_Input.getString() == "") {
            strMess = BkConstString.STR_SSR_EMPTY;
            this.tf_SSR_Input.setAutoFocus(true);
        }
        if (strMess != "") {
            showToastMessage(strMess, this.getWindowSize().width / 2 + 300, this.getWindowSize().height / 2 + 120, null,  196);
            return false;
        }
        else {
            return true;
        }
    },

    initSMS: function ()
    {
        this.getSMSProviderInfo();
    },
    getContentProviderInfo: function (telcoId) {
        Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.GetContentProviderInfo(telcoId);
        BkConnectionManager.send(packet);
    },
    getSMSProviderInfo:function()
    {
        Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.getSMSProviderInfo();
        BkConnectionManager.send(packet);
    },
    showPopUpNotify: function (textMess) {
        this.tf_MST_Input.visible = false;
        this.tf_SSR_Input.visible = false;
        var self = this;
        var onOKClick = function(){
            self.tf_MST_Input.visible = true;
            self.tf_SSR_Input.visible = true;
        };
        showPopupMessageWith(textMess, "", onOKClick,onOKClick,self);
    },

    NotifyNapTheFailed: function (napTheResultCode) {
        sendGA(BKGA.PAYMENT, 'Card fail', napTheResultCode);
        if (napTheResultCode == 1) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_USED);
        } else if (napTheResultCode == 2) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_EXPIRED);
        } else if (napTheResultCode == 3) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_LOCKED);
        } else if (napTheResultCode == 4) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_NOT_ACTIVED);
        } else if (napTheResultCode == 5) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_WRONG_FORMAT);
        } else if (napTheResultCode == 6) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_UNAVAILABLE);
        } else if (napTheResultCode == 7) {
            this.showPopUpNotify(BkConstString.STR_NOTIFY_NAPTHE_FAIL_UNDEFINED_ERROR);
        }
    },
    NotifyNapTheBanned: function (wrongNapTheCount) {
        var strMess = BkConstString.insertIntoStringWithListString(BkConstString.STR_NOTIFY_NAPTHE_ACCOUNT_BANNED, [wrongNapTheCount]);
        this.showPopUpNotify(strMess);
    },
    NotifyNapTheBusy: function () {
        this.showPopUpNotify("Hiện tại hệ thống nạp thẻ "
            + this.strprovider
            + " đang bị lỗi."
            + "\n" + "Xin vui lòng chờ hệ thống làm việc trở lại và nạp sau.");
        sendGA(BKGA.PAYMENT, 'Card Busy', this.strprovider);
    },

    NotifyNapTheSucess: function (totalMoney) {
        this.showPopUpNotify("Nạp thẻ " + this.strprovider + " thành công.\nBạn được cộng " + totalMoney + " " + BkConstString.STR_GAME_COIN.toLowerCase() + " vào tài khoản.");
        sendGA(BKGA.PAYMENT, 'Card Success', this.strprovider);
    },
    CreateSMSSprite: function (vnd, xucu,xuMoi,SMSContent, servicesNumber, isNewSMS)
    {
        var smsSpr = new BkSprite();
        var phoneIcon = new BkSprite("#" + res_name.icon_mobile);
        phoneIcon.x = 110;
        phoneIcon.y = 0;
        smsSpr.addChild(phoneIcon);
        var rowOffset = 12;
        var lblSMS = new BkLabel("SMS","Tahoma",15);
        lblSMS.x = phoneIcon.x + 5;
        lblSMS.y = phoneIcon.y + 30;
        smsSpr.addChild(lblSMS);
        var lblmgt = new BkLabel(convertStringToMoneyFormat(vnd,true) + " vnđ","Tahoma",15);
        lblmgt.x = phoneIcon.x + 5;
        lblmgt.y =  phoneIcon.y + 10;
        smsSpr.addChild(lblmgt);
        //xu
        var lblxu = new BkLabel("Xu","Tahoma",15,true);
        lblxu.x = phoneIcon.x + phoneIcon.width/2 + 50;
        lblxu.y = 2*rowOffset;
        smsSpr.addChild(lblxu);

        var lblxuCuValue = new BkLabel(convertStringToMoneyFormat(xucu) + "$","Tahoma",15,true);
        lblxuCuValue.setTextColor(PM_SMS_COMMAND_COLOR);
        lblxuCuValue.x = lblxu.x + lblxu.getContentSize().width/2 + lblxuCuValue.getContentSize().width/2 + 60;
        lblxuCuValue.y = lblxu.y;
        smsSpr.addChild(lblxuCuValue);

        var iconCu = new BkSprite("#" + res_name.bubbletalk_blue);
        iconCu.x = lblxuCuValue.x + lblxuCuValue.getContentSize().width/2 + 15;
        iconCu.y = lblxuCuValue.y + 20;
        iconCu.visible = false;
        smsSpr.addChild(iconCu);

        var lblCu = new BkLabel("Cũ", "Tahoma",15,true);
        lblCu.x = iconCu.x;
        lblCu.y = iconCu.y + 3;
        lblCu.visible = false;
        smsSpr.addChild(lblCu);
        if(xuMoi != xucu)
        {
            var arrow = new BkSprite("#" + res_name.icon_muitenxanh);
            arrow.x = iconCu.x + 80;
            arrow.y = lblxuCuValue.y;
            smsSpr.addChild(arrow);
            var lblxuMoiValue = new BkLabel(convertStringToMoneyFormat(xuMoi,true) + "$","Tahoma",15,true);
            lblxuMoiValue.x = arrow.x + arrow.width/2 + 5 + lblxuMoiValue.getContentSize().width/2;
            lblxuMoiValue.y = lblxuCuValue.y;
            lblxuMoiValue.setTextColor(PM_SMS_COMMAND_COLOR);
            smsSpr.addChild(lblxuMoiValue);
            var iconMoi = new BkSprite("#" + res_name.bubbletalk_orange);
            iconMoi.x = lblxuMoiValue.x + lblxuMoiValue.getContentSize().width/2  + 15;
            iconMoi.y = iconCu.y;
            smsSpr.addChild(iconMoi);
            var lblMoi = new BkLabel("Mới", "Tahoma",15);
            lblMoi.x = iconMoi.x;
            lblMoi.y = iconMoi.y + 3;
            smsSpr.addChild(lblMoi);
            lblxuCuValue.setTextColor(cc.color.GRAY);
            lblxuCuValue.setStrikeThrough();
            iconCu.visible = true;
            lblCu.visible = true;

        }


        //cú pháp
        var lblCuPhap = new BkLabel("Cú pháp","Tahoma",15,true);
        lblCuPhap.x = lblxu.x + lblCuPhap.getContentSize().width/2 - lblxu.getContentSize().width/2 ;
        lblCuPhap.y = 0;
        smsSpr.addChild(lblCuPhap);

        var smsArr = SMSContent.split(" ");
        var cachItem = new BkLabelItem("\<cách\>", 12, cc.color.WHITE, 1, false);
        var cuPhapFontSize = 15;
        var cuPhapColor = PM_SMS_COMMAND_COLOR;
        var convertedSMS = [
            new BkLabelItem(smsArr[0], cuPhapFontSize, cuPhapColor, 1, true),
            cachItem,
            new BkLabelItem(smsArr[1], cuPhapFontSize, cuPhapColor, 1, true),
            cachItem,
            new BkLabelItem(smsArr[2], cuPhapFontSize, cuPhapColor, 1, true)
        ];
        if (isNewSMS)
        {
            convertedSMS.push(cachItem);
            convertedSMS.push(new BkLabelItem(smsArr[3], cuPhapFontSize, cuPhapColor, 1, true));

        }

        var lblCuPhapContent = new BkLabelSprite(convertedSMS);
        lblCuPhapContent.x = lblxuCuValue.x - lblxuCuValue.getContentSize().width/2;//  + lblCuPhapContent.width/2 - 70;
        lblCuPhapContent.y = lblCuPhap.y - 10;
        smsSpr.addChild(lblCuPhapContent);

        //gui
        var lblSend = new BkLabel("Gửi", "Tahoma", 15,true);
        lblSend.x = lblxu.x + lblSend.getContentSize().width/2 - lblxu.getContentSize().width/2;
        lblSend.y = -2*rowOffset;
        smsSpr.addChild(lblSend);

        // Number
        var lblServicesNumber = new BkLabel(servicesNumber, "Tahoma", 24, true);
        lblServicesNumber.setTextColor(cuPhapColor);
        lblServicesNumber.x = lblxuCuValue.x + lblServicesNumber.getContentSize().width/2 - lblxuCuValue.getContentSize().width/2;
        lblServicesNumber.y = -2*rowOffset;
        smsSpr.addChild(lblServicesNumber);

        var separateLine = new BkSprite("#" + res_name.light_line);
        separateLine.x = 370;
        separateLine.y = -90 ;
        smsSpr.addChild(separateLine);
        return smsSpr;

    },
    CreateSMSNote: function (isNewSMS) {
        var paddingLeft = 15;
        var smsNote = new BkSprite();
        smsNote.width = this.getBodySize().width - PM_PADDING_LR*2;
        smsNote.height = 124;
        var strNote0 = "Chỉ hỗ trợ nạp qua tin nhắn các nhà mạng:";
        var strWarning = "\n*Bạn cần nhập đúng cú pháp để nhận được đủ số xu đã nạp.";
        var strNote1 = [];
        var strNote2 = [];
        var strNote3 = [];

        var fontSize = 14;
        if (isNewSMS) {
            smsNote.height = 100;
            fontSize = 18;
            var strNote1 = [
                new BkLabelItem("Viettel", fontSize, PM_SMS_COMMAND_COLOR, 1, true)
            ];

            var strNote2 = [
                new BkLabelItem("Mobifone", fontSize, PM_SMS_COMMAND_COLOR, 1, true)
            ];
            var strNote3 = [
                new BkLabelItem("Vinaphone", fontSize, PM_SMS_COMMAND_COLOR, 1, true)
            ];
        } else {
            var strNote1 = [
                new BkLabelItem("Viettel", fontSize, PM_SMS_COMMAND_COLOR, 1, true)
            ];

            var strNote2 = [
                new BkLabelItem("Mobifone", fontSize, PM_SMS_COMMAND_COLOR, 1, true)
            ];
            var strNote3 = [
                new BkLabelItem("Vinaphone", fontSize, PM_SMS_COMMAND_COLOR, 1, true)
            ];
            strNote1.push(new BkLabelItem("Tối đa 150k/thuê bao/ngày", 13, BkColor.DEFAULT_TEXT_COLOR, 2, false));
            strNote2.push(new BkLabelItem("Tối đa 100k/thuê bao/ngày", 13, BkColor.DEFAULT_TEXT_COLOR, 2, false));
            strNote3.push(new BkLabelItem("Tối đa 300k/thuê bao/ngày", 13, BkColor.DEFAULT_TEXT_COLOR, 2, false));

            var strNote4 = [
                new BkLabelItem("Gtel và VietnamMobile", 14, PM_SMS_COMMAND_COLOR, 1, true),
                new BkLabelItem("Không giới hạn", 13, BkColor.DEFAULT_TEXT_COLOR, 2, false)
            ];
            var tfNote4 = new BkLabelSprite(strNote4);
            tfNote4.x = smsNote.width - tfNote4.getContentSize().width/2 - 80;
            tfNote4.y = smsNote.height/2 + 10;
            smsNote.addChild(tfNote4);
        }
        var tfNote1 = new BkLabelSprite(strNote1);
        var tfNote2 = new BkLabelSprite(strNote2);
        var tfNote3 = new BkLabelSprite(strNote3);

        var tfNote0 = new BkLabel(strNote0, "Tahoma", 15);
        tfNote0.setTextColor(cc.color.WHITE);

        var tfWarning = new BkLabel(strWarning, "Tahoma", 15);
        tfWarning.setTextColor(cc.color.WHITE);

        tfNote0.x = paddingLeft + tfNote0.getContentSize().width/2;
        tfNote0.y = smsNote.height - 15;

        tfNote1.x = 16;
        tfNote1.y = smsNote.height/2 + 10;

        tfNote2.x = smsNote.width/3.6;
        tfNote2.y = tfNote1.y;

        tfNote3.x = smsNote.width/1.9;
        tfNote3.y = tfNote1.y;

        if (isNewSMS){
            logMessage("smsNote.width "+smsNote.width);
            tfNote1.x = 140;
            tfNote2.x = 333;
            tfNote3.x = 555 - 40;
            tfNote1.y = smsNote.height/2 - 10;
            tfNote2.y = tfNote1.y;
            tfNote3.y = tfNote1.y;
        }

        tfWarning.x = paddingLeft + tfWarning.getContentSize().width/2;
        tfWarning.y = smsNote.height/4 + 5;

        smsNote.addChild(tfNote0);
        smsNote.addChild(tfNote1);
        smsNote.addChild(tfNote2);
        smsNote.addChild(tfNote3);
        smsNote.addChild(tfWarning);

        return smsNote;
    },
    initMouseAction: function () {
        var self = this;
        this.vtSprite.setMouseOnHover();
        this.vtSprite.setOnlickListenner(function () {
            self.ChooseViettel();
        });

        this.mobiSprite.setMouseOnHover();
        this.mobiSprite.setOnlickListenner(function () {
            self.ChooseMobile();
        });

        this.vinaSprite.setMouseOnHover();
        this.vinaSprite.setOnlickListenner(function () {
            self.ChooseVina();
        });
    },
    onExit: function () {
        this.spriteSheet.removeSpriteFramesFromFile(res.nap_tien_ss_plist);
        this._super();
    }
});
