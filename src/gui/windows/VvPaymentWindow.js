/**
 * Created by hoangthao on 17/10/2015.
 */
this.height = cc.winSize.height;
MB_ID = 0;
VN_ID = 1;
VT_ID = 2;
PM_PADDING_LR = 0.0625*this.height;
VvPaymentWindow = VvTabWindow.extend({
    _tabList: [],
    spriteSheet: cc.spriteFrameCache,
    providerInfoData:null,
    TheCaoSprite: null,
    SMSSprite: null,
    IAPSprite:null,
    TelcoID: 2,
    vtSprite: null,
    mobiSprite: null,
    vinaSprite: null,
    tableTheCao:null,
    listTheMobile: null,
    ItemCardXu: null,
    tf_SSR_Input: null,
    tf_MST_Input: null,
    btnNap: null,
    strprovider: "",
    marginLR: this.height*0.03125,
    bonusPercentThe:0,
    bonusPercentSMS:0,
    bonusPercentIAP:0,
    stickerKM:null,
    stickerKMThe:null,
    stickerKMSMS:null,
    stickerKMIAP:null,
    tfBonus:null,
    tfBonusThe:null,
    tfBonusSMS:null,
    unavailableTheCaoTelcos: [],
    ctor: function () 
    {
    	logMessage("cc.winSize.width: " + cc.winSize.width + "cc.winSize.height:" + cc.winSize.height);
    	var size = cc.winSize; 
       // addSpriteFrames(res.vv_sprite_sheet_plist, res.vv_sprite_sheet_img);
        addSpriteFrames(res.vv_nap_tien_plist, res.vv_nap_tien_img);
		var isSHP = NativeInterface.isCheckSHP();
        if(SessionManager.isInsideVietnam || SessionManager.isForceSP == 0 || (SessionManager.isForceSP == -2 && isSHP ) )
        {
    		this._tabList = ["Thẻ cào", "Tin nhắn","Google Play"];
        }else if(!SessionManager.isInsideVietnam)
        {
        	this._tabList = ["Google Play"];
        }
        this._super("Nạp quan", cc.size(size.height*1.3, size.height*0.85), this._tabList.length, this._tabList);
        // Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"AddMoneyScreen");
    },
    onEnterTransitionDidFinish:function()
	{
    	// this.spriteSheet.addSpriteFrames(res.vv_nap_tien_plist,
		// res.vv_nap_tien_img);
        // this.setMoveableWindow(true);
        // this.setVisibleOutBackgroundWindow(true);
        this.getContentProviderInfo(this.TelcoID);
        this.CheckGoogleIAPCommand();
	},
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },
    clearGUI:function()
    {
    	if(this.SMSSprite){
            this.SMSSprite.removeAllChildren();
            this.SMSSprite.removeFromParent();
        }
        if(this.tableTheCao) {
            this.tableTheCao.removeAllChildren();
            this.tableTheCao.removeFromParent();
        }
        if(this.IAPSprite)
        {
        	this.IAPSprite.removeAllChildren();
        	this.IAPSprite.removeFromParent();
        }
    },
    onLoadComplete: function (o, tag) {
        // BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag)
        {
            case c.NETWORK_CONTENT_PROVIDER_INFO_RETURN:
            {
                logMessage("NETWORK_CONTENT_PROVIDER_INFO_RETURN");
                this.providerInfoData = o;
                this.unavailableTheCaoTelcos = o.unavailableTheCaoTelcos;
                this.clearGUI();
                this.addTabChangeEventListener(this.selectedTabEvent, this);
                this.initKMSticker();
                if(SessionManager.isInsideVietnam)
                {
                	 if(this._currentTab == 1){
                         this.drawTheCaoTabContent();
                     }
                     else if (this._currentTab == 2) {
                         this.DrawSMSContent(o);
                     }else 
                     {
                     	this.DrawTabIAP();
                     }
                }else 
                {
                 	this.DrawTabIAP();
                }
               

                break;
            }
            case c.NETWORK_NAP_THE_CAO_BANNED:
                var wrongNapTheCount = o.Buffer.readByte();
                // sendGA(BKGA.PAYMENT, 'Card BANNED', wrongNapTheCount);
                this.NotifyNapTheBanned(wrongNapTheCount);
                break;
            case c.NETWORK_NAP_THE_CAO_FAILED:
                var napTheResultCode = o.Buffer.readByte();
                this.NotifyNapTheFailed(napTheResultCode);
                break;
            case c.NETWORK_NAP_THE_CAO_SUCCESS:
                logMessage("c.NETWORK_NAP_THE_CAO_SUCCESS");
                this.getContentProviderInfo(this.TelcoID);
                this.NotifyNapTheSuccess(o);
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
    selectedTabEvent: function (sender, tabIndex) 
    {
    	logMessage("selectedTabEvent: " + tabIndex);
    	this.DrawUIWithTab(tabIndex);
    },

    DrawUIWithTab: function (i) 
    {	
    	logMessage("this._tabList.length:" + this._tabList.length + "i:" + i);
    	if(this._tabList.length == 1)
    	{
    		this.DrawTabIAP();
    		return;
    	}
        if (i == 1) {
            this.DrawTabTheCao();
        }
        else if (i == 2) {
            this.DrawTabSMS();
        }else if (i == 3)
        {
        	this.DrawTabIAP();
        }
    },
    resetIcoTelco: function () 
    {
    	this.vtSpriteSelect.visible = false;
    	this.mobiSpriteSelect.visible = false;
    	this.vinaSpriteSelect.visible = false;
    },

    configWithTelcoID: function (i)
    {
    	logMessage("configWithTelcoID:" + i);
        this.resetIcoTelco();
        // this.getContentProviderInfo(i);
        if (i == 0)
        {
        	this.mobiSpriteSelect.visible = true;
        }
        if (i == 1) 
        {
        	this.vinaSpriteSelect.visible = true;
        }
        if (i == 2) 
        {
        	this.vtSpriteSelect.visible = true;
        }
    },
    DrawTabSMS: function ()
    {
    	this.invisibleAll();
        if (this.SMSSprite != null) 
        {
        	this.SMSSprite.visible = true;
            cc.eventManager.resumeTarget(this.SMSSprite, true);
        }
        else 
        {
            this.initSMS();
        }
    },
    DrawTabTheCao: function () 
    {
    	this.invisibleAll();
        if (this.TheCaoSprite != null) {
            this.TheCaoSprite.visible = true;
            cc.eventManager.resumeTarget(this.TheCaoSprite, true);
        }
        else {
            this.initTheCao();
        }
    },
    DrawTabIAP: function()
    {
    	this.invisibleAll();
    	  if (this.IAPSprite != null) 
    	  {
              this.IAPSprite.visible = true;
              cc.eventManager.resumeTarget(this.IAPSprite, true);
          }
          else 
          {
              this.initIAP();
          }
    },
    invisibleAll:function()
    {
    	logMessage("call invisibleall");
    	 if (this.SMSSprite != null) {
             this.SMSSprite.visible = false;
             cc.eventManager.pauseTarget(this.SMSSprite, true);
         }
    	 if (this.TheCaoSprite != null) {
             this.TheCaoSprite.visible = false;
             cc.eventManager.pauseTarget(this.TheCaoSprite, true);
         }
    	 if(this.IAPSprite != null)
    	 {
    	    logMessage("HideIAP");
    		 this.IAPSprite.visible = false;
             cc.eventManager.pauseTarget(this.IAPSprite, true);
    	 }
    },
    initImageTelco: function () 
    {
    	var height = cc.winSize.height;
    	var startX = this.getBodySize().width / 4;
        var startY = this.getBodySize().height - height*0.18;
        this.TheCaoSprite = new BkSprite();
    	logMessage("initImageTelco:" + height);

        this.vtSprite = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.napxu_unselect));
        this.vtSpriteSelect = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.napxu_select));
        this.vtSprite.setScale(0.8);
        this.vtSpriteSelect.setScale(0.8);
        this.vtSprite.y = this.vtSpriteSelect.y = startY;
        this.vtSprite.x = this.vtSpriteSelect.x = startX + height*0.055;
        //vinh
      
        this.tfVt = new BkLabel(this.getProviderNameFromId(VT_ID), "", height*0.094, true);
        this.tfVt.x = this.vtSprite.x ;
        this.tfVt.y = this.vtSprite.y;
        
        this.mobiSprite = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.napxu_unselect));
        this.mobiSpriteSelect = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.napxu_select));
        this.mobiSprite.y = this.mobiSpriteSelect.y = startY;
        this.mobiSprite.x = this.mobiSpriteSelect.x = this.vtSprite.x +  height*0.3125;
        this.mobiSprite.setScale(0.8);
        this.mobiSpriteSelect.setScale(0.8);
        
        this.tfMb = new BkLabel(this.getProviderNameFromId(MB_ID), "", height*0.094, true);
        this.tfMb.x = this.mobiSprite.x ;
        this.tfMb.y = this.mobiSprite.y;
        
        this.vinaSprite = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.napxu_unselect));
        this.vinaSpriteSelect = getSpriteFromImage(this.spriteSheet.getSpriteFrame(res_name.napxu_select));
        this.vinaSprite.y = this.vinaSpriteSelect.y = startY;
        this.vinaSprite.x = this.vinaSpriteSelect.x = this.mobiSprite.x + height*0.3125;
        this.vinaSprite.setScale(0.8);
        this.vinaSpriteSelect.setScale(0.8);
        
        this.tfVn = new BkLabel(this.getProviderNameFromId(VN_ID), "", height*0.094, true);
        this.tfVn.x = this.vinaSprite.x ;
        this.tfVn.y = this.vinaSprite.y;
        
        
        this.initMouseAction();
        
        this.TheCaoSprite.addChild(this.vinaSprite);
        this.TheCaoSprite.addChild(this.vinaSpriteSelect);
        this.TheCaoSprite.addChild(this.tfVn);
        
        this.TheCaoSprite.addChild(this.mobiSprite);
        this.TheCaoSprite.addChild(this.mobiSpriteSelect);
        this.TheCaoSprite.addChild(this.tfMb);
        
        this.TheCaoSprite.addChild(this.vtSprite);
        this.TheCaoSprite.addChild(this.vtSpriteSelect);
        this.TheCaoSprite.addChild(this.tfVt);

        
},
    initTheCao: function ()
    {
        this.initImageTelco();
        var size = cc.winSize;
        var height = cc.winSize.height;
        var tf_MST = new BkLabel("Mã thẻ:", "Tahoma", height*0.06);
        tf_MST.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        tf_MST.x = size.width/2 + height*0.12;
        tf_MST.y = height*0.46156;
        logMessage("tf_MST.x:" + tf_MST.x + "tf_MST.y:" + tf_MST.y);
        this.TheCaoSprite.addChild(tf_MST);

        // Input MST
        this.tf_MST_Input =  cc.EditBox(cc.size(height*0.4, height*0.07), new cc.Scale9Sprite(res_name.napxu_edit_text));
        this.tf_MST_Input.setString("");
        this.tf_MST_Input.fontColor = BkColor.VV_TY_GIA_COLOR;
        this.tf_MST_Input.type = "text";
        this.tf_MST_Input.x = size.width/2 + height*0.27;
        this.tf_MST_Input.y = height/2*0.8;
        this.TheCaoSprite.addChild(this.tf_MST_Input);
        // TextField SSR
        var tf_SSR = new BkLabel("Số seri:", "Tahoma", height*0.06);
        tf_SSR.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        tf_SSR.x = tf_MST.x - tf_MST.getContentSize().width/2 + tf_SSR.getContentSize().width/2;
        tf_SSR.y = height/2*0.62;
        this.TheCaoSprite.addChild(tf_SSR);
        
        this.tf_SSR_Input =  cc.EditBox(cc.size(size.height*0.4, height*0.07), new cc.Scale9Sprite(res_name.napxu_edit_text));
        this.tf_SSR_Input.setString("");
        this.tf_SSR_Input.fontColor = BkColor.VV_TY_GIA_COLOR;
        this.tf_SSR_Input.type = "text";
        this.tf_SSR_Input.x = this.tf_MST_Input.x;
        this.tf_SSR_Input.y = height/2*0.5;
        this.TheCaoSprite.addChild(this.tf_SSR_Input);

        this.btnNap = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        this.btnNap.scale = 1.5;
        this.btnNap.setTitleText("Nạp quan");
        this.btnNap.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        this.btnNap.setTitleFontSize(height*0.021875);
        this.btnNap.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                logMessage("DoNapThe");
                this.DoNapThe();
            }
        }, this);
        this.btnNap.x = this.tf_SSR_Input.x - height*0.01;
        this.btnNap.y = this.tf_SSR_Input.y - height*0.1;
        this.TheCaoSprite.addChild(this.btnNap);
        
        // set default provider
        this.configWithTelcoID(VT_ID);
        this.addChildBody(this.TheCaoSprite);
    },

    initKMSticker:function () 
    {
    	if(!SessionManager.isInsideVietnam)
    	{
    		return;
    	}
    	var height = cc.winSize.height;
    	var fontSize = height*0.0218;
        var fontSize1 = height*0.032;
        this.bonusPercentThe = this.getTheCaoBonusByID(this.TelcoID);
        this.bonusPercentSMS = this.providerInfoData.BonusSMS;
        this.bonusPercentIAP = this.providerInfoData.BonusIAP;
        if(this.stickerKM)this.stickerKM.setVisible(false);
        if(this.stickerKMThe) this.stickerKMThe.setVisible(false);
        if(this.stickerKMSMS) this.stickerKMSMS.setVisible(false);
        // % KM giong nhau
        if(this.bonusPercentIAP > 0)
        {
        	 if(this.stickerKMIAP == null)
             {
                 var bgSp = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_sticker_khuyenmai_big));
                 bgSp.setScale(0.7);
                 this.stickerKMIAP = new BkSprite();
                 this.stickerKMIAP.addChild(bgSp);
                 this.stickerKMIAP.x = height*0.72;
                 this.stickerKMIAP.y = height*0.72;
                 this.stickerKMIAP.setVisible(true);
                 this._bodyLayer.addChild(this.stickerKMIAP, VV_WD_ZORDER_TOP);
                 this.tfBonusIAP = new BkLabel(this.bonusPercentIAP + "%", "", fontSize1);
                 this.tfBonusIAP.x = this.stickerKMIAP.width/2 + 5;
                 this.tfBonusIAP.y = this.stickerKMIAP.height/2;
                 this.stickerKMIAP.addChild(this.tfBonusIAP,0);
             }
             else 
             {
                 this.tfBonusIAP.setString(this.bonusPercentIAP + "%");
                 this.stickerKMIAP.setVisible(true);
             }
        }
        if(this.bonusPercentThe > 0)
        {
            if(this.bonusPercentThe == this.bonusPercentSMS)
            {
                if(this.stickerKM == null)
                {
                    this.stickerKM = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_sticker_khuyenmai_big));
                    this.stickerKMIAP = new BkSprite();
                    this.stickerKM.addChild(bgSp3);
                    this.stickerKM.x = height*0.65;
                    this.stickerKM.y = this._top.y + height*0.00468;
                    this.stickerKM.setVisible(true);
                    this._bodyLayer.addChild(this.stickerKM, VV_WD_ZORDER_TOP);

                    this.tfBonus = new BkLabel(this.bonusPercentThe + "%", "", fontSize1);
                    this.tfBonus.x = this.stickerKM.width/2 + 5;
                    this.tfBonus.y = this.stickerKM.height/2;
                    this.stickerKM.addChild(this.tfBonus,0);
                }
                else 
                {
                    this.tfBonus.setString(this.bonusPercentThe + "%");
                    this.stickerKM.setVisible(true);
                }
            }
            else
            {
                if(this.stickerKMThe == null)
                {
                    var bgSp1 = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_sticker_khuyenmai_big));
                    bgSp1.setScale(0.7);
                    this.stickerKMThe = new BkSprite();
                    this.stickerKMThe.addChild(bgSp1);
                    this.stickerKMThe.x = height*0.27;
                    this.stickerKMThe.y = height*0.72;
                    this.stickerKMThe.setVisible(true);
                    this._bodyLayer.addChild(this.stickerKMThe, VV_WD_ZORDER_TOP);

                    this.tfBonusThe = new BkLabel(this.bonusPercentThe + "%", "", fontSize1);
                    this.tfBonusThe.x = this.stickerKMThe.width/2 + 5;
                    this.tfBonusThe.y = this.stickerKMThe.height/2;
                    this.stickerKMThe.addChild(this.tfBonusThe,0);
                }
                else {
                    this.tfBonusThe.setString( this.bonusPercentThe + "%");
                    this.stickerKMThe.setVisible(true);
                }
            }
        }

        if(this.bonusPercentSMS > 0 && (this.bonusPercentSMS != this.bonusPercentThe))
        {
            if(this.stickerKMSMS == null){
                var bgSp2 = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_sticker_khuyenmai_big));
                bgSp2.setScale(0.7);
                this.stickerKMSMS = new BkSprite();
                this.stickerKMSMS.addChild(bgSp2);
                this.stickerKMSMS.x = height*0.5;
                this.stickerKMSMS.y = height*0.72;;
                this.stickerKMSMS.setVisible(true);
                this._bodyLayer.addChild(this.stickerKMSMS, VV_WD_ZORDER_TOP);
                this.tfBonusSMS = new BkLabel(this.bonusPercentSMS + "%", "", fontSize1);
                this.tfBonusSMS.x = this.stickerKMSMS.width/2 + height*0.00781;
                this.tfBonusSMS.y = this.stickerKMSMS.height/2;
                this.stickerKMSMS.addChild(this.tfBonusSMS,0);
            }
            else {
                this.tfBonusSMS.setString(this.bonusPercentSMS + "%");
                this.stickerKMSMS.setVisible(true);
            }
        }
    },

    drawTheCaoTabContent: function()
    {
    	var height = cc.winSize.height;
        this.tableTheCao = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_board_2columns));
        // this.tableTheCao.setScale(1.1);
        var tableHeaderFontSize = cc.winSize.height*0.05;
        // TheVND
        var theVND = new BkLabel("Thẻ(VND)", "", tableHeaderFontSize, true);
        theVND.setTextColor(BkColor.VV_TY_GIA_COLOR);

        // Quan goc
        var quanGoc = new BkLabel("Quan", "", tableHeaderFontSize, true);
        quanGoc.setTextColor(BkColor.VV_TY_GIA_COLOR);

        // MenhGiaThe
        var listTheCao = this.providerInfoData.listTheCao;
        var listTyGiaQD = this.getListTyGiaQuyDoiByTelcoID(this.TelcoID);

        if(listTheCao == null){
            listTheCao = [10000,20000,50000,100000,200000,500000];
        }

        if(listTyGiaQD == null){
            listTyGiaQD = [30000,60000,150000,350000,900000,2750000];
        }

        var spMenhGiaThe = this.createListSprite(listTheCao, cc.color.WHITE);

        this.bonusPercentThe = this.getTheCaoBonusByID(this.TelcoID);
        var spTyGiaQuyDoi = null;
        if(this.bonusPercentThe > 0)
        {
            // 3 columns
            this.tableTheCao = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_board_3columns));
            this.tableTheCao.x = this.tableTheCao.width/2 + PM_PADDING_LR;
            this.tableTheCao.y = this.getBodySize().height/2 - height*0.05;
            this.TheCaoSprite.addChild(this.tableTheCao);

            var titleStr = [
                new BkLabelItem("Tỷ giá quy đổi khi nạp thẻ ", tableHeaderFontSize, BkColor.VV_TY_GIA_COLOR, 1, true),
                new BkLabelItem("(Khuyến mại " + this.bonusPercentThe + "%)", tableHeaderFontSize, cc.color(255,232,64), 1, true)
            ];

            var titleKM = new BkLabelSprite(titleStr);
            titleKM.x = height*0.007;
            titleKM.y = this.tableTheCao.height - height*0.034375;
            this.tableTheCao.addChild(titleKM);

            theVND.x = theVND.getContentSize().width/2 + height*0.0546;
            theVND.y = this.tableTheCao.height - height*0.0546875;
            this.tableTheCao.addChild(theVND);

            quanGoc.setString("Quan gốc");
            quanGoc.x = theVND.x + height*0.156;
            quanGoc.y = theVND.y;
            this.tableTheCao.addChild(quanGoc);

            var kmTitle = new BkLabel("KM " + this.bonusPercentThe + "%", "", tableHeaderFontSize, true);
            kmTitle.setTextColor(BkColor.VV_TY_GIA_COLOR);
            kmTitle.x = quanGoc.x + height*0.1718;
            kmTitle.y = quanGoc.y;
            this.tableTheCao.addChild(kmTitle);

            // MenhGiaThe column
            spMenhGiaThe.x = theVND.x;
            spMenhGiaThe.y = this.tableTheCao.height/2 + height*0.06875;
            this.tableTheCao.addChild(spMenhGiaThe);

            // Quan goc column
            spTyGiaQuyDoi = this.createListSprite(listTyGiaQD, BkColor.VV_QUAN_GOC_OLD_COLOR, true);
            spTyGiaQuyDoi.x = quanGoc.x;
            spTyGiaQuyDoi.y = spMenhGiaThe.y;
            this.tableTheCao.addChild(spTyGiaQuyDoi);


            if(this.providerInfoData.BonusVip >= this.bonusPercentThe)
            {
                kmTitle.setString("Vip +" + this.providerInfoData.BonusVip + "%");
            }

            // TyGiaQuyDoi pos
            var spTyGiaQuyDoiKM = this.createListSprite(this.getListTyGiaQuyDoiKMByTelcoID(this.TelcoID,this.bonusPercentThe),BkColor.VV_QUAN_GOC_NEW_COLOR);
            spTyGiaQuyDoiKM.x = kmTitle.x;
            spTyGiaQuyDoiKM.y = spMenhGiaThe.y;
            this.tableTheCao.addChild(spTyGiaQuyDoiKM);
        }
        else{
            this.tableTheCao.x = this.tableTheCao.width/2 + PM_PADDING_LR;
            this.tableTheCao.y = this.getBodySize().height/2 - height*0.0789;
            this.TheCaoSprite.addChild(this.tableTheCao);

            var title = new BkLabel("Tỷ giá quy đổi khi nạp thẻ", "", tableHeaderFontSize, true);
            title.setTextColor(BkColor.VV_TY_GIA_COLOR);
            title.x = this.tableTheCao.width/2;
            title.y = this.tableTheCao.height - height*0.01875;
            this.tableTheCao.addChild(title);

            // TheVND
            theVND.x = theVND.getContentSize().width/2 + height*0.0859;
            theVND.y = this.tableTheCao.height - height*0.0578;
            this.tableTheCao.addChild(theVND);

            // Quan goc
            quanGoc.setTextColor(BkColor.VV_TY_GIA_COLOR);
            quanGoc.x = theVND.x + height*0.25;
            quanGoc.y = theVND.y;
            this.tableTheCao.addChild(quanGoc);

            // MenhGiaThe
            spMenhGiaThe.x = theVND.x;
            spMenhGiaThe.y = this.tableTheCao.height/2 + 43;
            this.tableTheCao.addChild(spMenhGiaThe);

            spTyGiaQuyDoi = this.createListSprite(listTyGiaQD, BkColor.VV_QUAN_GOC_NEW_COLOR);
            spTyGiaQuyDoi.x = quanGoc.x;
            spTyGiaQuyDoi.y = spMenhGiaThe.y;
            this.tableTheCao.addChild(spTyGiaQuyDoi);
        }
    },
    createListSprite: function(listItem,color,isStrikeThrough)
    {
    	var height = cc.winSize.height;
        var offSetY = cc.winSize.height*0.043;
        var startX = 0;
        var startY = 0;
        var width = 0;
        var rtnSprite = new BkSprite();
        for(var i = 0 ;i < listItem.length; i++)
        {
            var ival = listItem[i];
            var tfi = new BkLabel(formatNumber(ival), "", cc.winSize.height*0.06);
            tfi.setTextColor(color);
            tfi.x = startX;
            tfi.y = startY - i*offSetY;
            width = tfi.getContentSize().width;
            if(isStrikeThrough)
            {
                var drawLine = new cc.DrawNode();
                drawLine.drawSegment(cc.p(startX - width/2 - height*0.003125, tfi.y), cc.p(startX + width/2 + height*0.003125, tfi.y), 0.5, color);
                rtnSprite.addChild(drawLine);
            }
            rtnSprite.addChild(tfi);
        }
        return rtnSprite;
    },
    getTheCaoBonusByID: function(telcoID)
    {
        var bonus = 0;
        if(telcoID == VT_ID)
        {
            bonus = this.providerInfoData.BonusTheVT;
        }else if(telcoID == VN_ID)
        {
            bonus = this.providerInfoData.BonusTheVina;
        }else if(telcoID == MB_ID)
        {
            bonus = this.providerInfoData.BonusTheMobi;
        }
        bonus = Math.max(this.providerInfoData.BonusVip,bonus);
        return bonus;
    },
    getListTyGiaQuyDoiByTelcoID: function(telcoID)
    {
        if(!this.providerInfoData) return [];
        if(telcoID == VT_ID)
        {
            return this.providerInfoData.listMenhGiaVT
        }
        if(telcoID == VN_ID)
        {
            return this.providerInfoData.listMenhGiaVina
        }
        if(telcoID == MB_ID)
        {
            return this.providerInfoData.listMenhGiaMobi

        }
        return this.providerInfoData.listMenhGiaVT;
    },
    getListTyGiaQuyDoiKMByTelcoID: function(telcoID,bonusPercent)
    {
        if(telcoID == VT_ID)
        {
            return this.providerInfoData.listMenhGiaKMVT;
        }
        if(telcoID == VN_ID)
        {
            return this.providerInfoData.listMenhGiaKMVina;
        }
        if(telcoID == MB_ID)
        {
            return this.providerInfoData.listMenhGiaKMMobi;
        }
        return this.providerInfoData.listMenhGiaKMVT;
    },
    ChooseViettel: function ()
    {
      	logMessage("this.telcoID:" + this.TelcoID);
    	logMessage("this.VT_ID:" + VT_ID);
        if(this.TelcoID == VT_ID)
        {
            return;
        }
        this.strprovider = this.getProviderNameFromId(VT_ID);
        this.TelcoID = VT_ID;
        this.configWithTelcoID(this.TelcoID);
    },
    ChooseMobile: function ()
    {
    	logMessage("this.telcoID:" + this.TelcoID);
    	logMessage("this.MB_ID:" + MB_ID);

        if(this.TelcoID == MB_ID)
        {
        	logMessage("this.TelcoID == MB_ID" + this.TelcoID );
            return;
        }
        this.strprovider = this.getProviderNameFromId(MB_ID);
        this.TelcoID = MB_ID;
        this.configWithTelcoID(this.TelcoID);
    },
    ChooseVina: function ()
    {
    	logMessage("this.telcoID:" + this.TelcoID);
    	logMessage("this.VN_ID:" + VN_ID);
        if(this.TelcoID == VN_ID)
        {
            return;
        }
        this.strprovider = this.getProviderNameFromId(VN_ID);
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
    	var height = cc.winSize.height;
        var strMess = "";
         if (this.tf_MST_Input.getString() == "") {
            strMess = BkConstString.STR_MST_EMPTY;
            // this.tf_MST_Input.setAutoFocus(true);
        }
        else if (this.tf_SSR_Input.getString() == "") {
            strMess = BkConstString.STR_SSR_EMPTY;
            // this.tf_SSR_Input.setAutoFocus(true);
        }
        if (strMess != "") {
            showToastMessage(strMess, this.getWindowSize().width / 2 + height*0.46875, this.getWindowSize().height / 2 + 0.1875, null,  height*0.306);
            return false;
        }
        else {
            return true;
        }
    },
    initSMS: function ()
    {
    	var height = cc.winSize.height;
        this.SMSSprite = new BkSprite();
        this.SMSSprite.x =  cc.winSize.width/2 - 0.74*height;
        this.SMSSprite.y = height*0.14;
        this.addChildBody(this.SMSSprite);
        if(this.providerInfoData) this.DrawSMSContent(this.providerInfoData);
    },
    initIAP: function ()
    {
    	var height = cc.winSize.height;
        this.IAPSprite = new BkSprite();
        this.IAPSprite.x =  cc.winSize.width/2 - 0.74*height;
        this.IAPSprite.y = height*0.14;
        this.addChildBody(this.IAPSprite);
        if(this.providerInfoData)
        {
        	var startX = 200;
	        for(var i = 0; i < 3; i++)
	        {
	        	var spri =  new VvIAPSprite(this.providerInfoData.BonusIAP,i);
	        	spri.x = startX + i*height*0.36;
	        	spri.y = height*0.22;
	        	this.IAPSprite.addChild(spri);
	        }
        }
        var tfIAPGuide = new BkLabel("Hướng dẫn nạp IAP", "", height*0.06);
        tfIAPGuide.setTextColor(BkColor.VV_QUAN_GOC_NEW_COLOR);
        tfIAPGuide.x = cc.winSize.width/2 + height*0.3;
        tfIAPGuide.y =  height*0.4;
    	this.IAPSprite.addChild(tfIAPGuide);
    	 var tfIAPPromotion = new BkLabel("Khuyến mại:             cho mọi hình thức nạp IAP lần đầu tiên.", "", height*0.06);
    	 tfIAPPromotion.setTextColor(BkColor.VV_QUAN_GOC_NEW_COLOR);
         tfIAPPromotion.x = cc.winSize.width/2 - height*0.3125;
         tfIAPPromotion.y =  height*0.05;
     	this.IAPSprite.addChild(tfIAPPromotion);
    	 var tfBonus = new BkLabel(this.providerInfoData.BonusIAP + "%", "", height*0.06);
    	 tfBonus.setTextColor(cc.color.RED);
    	 tfBonus.x =  height*0.26;
    	 tfBonus.y = tfIAPPromotion.y;
    	 this.IAPSprite.addChild(tfBonus);
     	
    },
    DrawSMSContent: function(o)
    {
    	var height = cc.winSize.height;
        if(!o) return;
        var numOfSMS = 2;
        if(o.smsInfoList != null)
        {
        	numOfSMS = o.smsInfoList.length;
            var CurY = this.getBodySize().height - height*0.3 + height*0.1875;
            if(numOfSMS == 2)
            {
            	CurY = CurY - height*0.185;
            }
            logMessage("numOfSMS:" + numOfSMS);
            if(numOfSMS > 2)
            {
                var sc = new ccui.ScrollView();
                sc.setDirection(ccui.ScrollView.DIR_VERTICAL);
                sc.setTouchEnabled(true);
                sc.setContentSize(cc.size(cc.winSize.width,height*0.34375));
                sc.setInnerContainerSize(cc.size(960,height*0.6875));
                sc.x = 0;
                sc.y = height*0.15625;
                this.SMSSprite.addChild(sc);
            }
            for(var i = 0; i < numOfSMS; i++)
            {	    
            	// SMS
                var smsInfo = o.smsInfoList[i];
                var smsSpritei = this.createSMSSprite(smsInfo.moneyVnd,smsInfo.moneyXu,smsInfo.content,smsInfo.serviceNumber);
                smsSpritei.x = 0;
                smsSpritei.y = CurY;
                if(numOfSMS > 2)
                {
                    sc.addChild(smsSpritei);
                }else 
                {
                	this.SMSSprite.addChild(smsSpritei);
                }
                CurY = CurY  - height*0.172;
            }
            
            var SMSNoteSpriteNew = this.createSMSNote(true);
            SMSNoteSpriteNew.x = height*0.359375;
            SMSNoteSpriteNew.y = height*0.125;
            this.SMSSprite.addChild(SMSNoteSpriteNew);
        }
        else
        {
            // Old SMS format
            var SMS10k = this.createSMSSprite(10000,10000,o.smsContent,o.dauSo10K);
            var SMS15k = this.createSMSSprite(15000,15000,o.smsContent,o.dauSo15K);
            SMS10k.x = 0;
            SMS10k.y = this.getBodySize().height - height*0.1875;
            this.SMSSprite.addChild(SMS10k);
            SMS15k.x = SMS10k.x;
            SMS15k.y = SMS10k.y - SMS10k.height - height*0.1875;
            this.SMSSprite.addChild(SMS15k);
            var SMSNoteSprite = this.createSMSNote(false);
            SMSNoteSprite.x = height*0.359;
            SMSNoteSprite.y = height*0.226;
            this.SMSSprite.addChild(SMSNoteSprite);
        }
    },
    createSMSSprite: function(vnd,xu,SMSContent, servicesNumber)
    {
    	var height = cc.winSize.height;
        // Back ground
        var smsSpr = new BkSprite();
        var marginLeft = height*0.0859;
        var smsfontSize = height*0.06
        // Tin 10.000vnđ Gửi 9029
        var lblItems1 = [
            new BkLabelItem("Tin            ", smsfontSize, BkColor.VV_PAYMENT_SMS_NORMAL_TEXT, 1, false),
            new BkLabelItem(formatNumber(vnd) + " vnđ", smsfontSize, BkColor.VV_QUAN_GOC_NEW_COLOR, 1, false),
            new BkLabelItem("   Gửi   ", smsfontSize, BkColor.VV_PAYMENT_SMS_NORMAL_TEXT, 1, false),
            new BkLabelItem(servicesNumber, smsfontSize, cc.color.WHITE, 1, false)
        ];

        var lbl1 = new BkLabelSprite(lblItems1);
        lbl1.x = marginLeft;
        smsSpr.addChild(lbl1);

        var lbl2 = new BkLabel("Quan        ", "", smsfontSize);
        lbl2.setTextColor(BkColor.VV_PAYMENT_SMS_NORMAL_TEXT);
        lbl2.x = lbl2.getContentSize().width/2 + marginLeft;
        lbl2.y = lbl1.y - height*0.0234;
        smsSpr.addChild(lbl2,0);

        var lblQuan = new BkLabel(formatNumber(xu) + " quan", "", smsfontSize);
        lblQuan.x = lbl2.x + lbl2.getContentSize().width/2 + lblQuan.getContentSize().width/2;
        lblQuan.y = lbl2.y;
        smsSpr.addChild(lblQuan,0);

        if(this.providerInfoData && this.providerInfoData.BonusSMS > 0)
        {
            this.bonusPercentSMS = this.providerInfoData.BonusSMS;
            lblQuan.setTextColor(BkColor.VV_QUAN_GOC_OLD_COLOR);

            var drawOldLine = new cc.DrawNode();
            drawOldLine.drawSegment(cc.p(0, 0), cc.p(height*0.296, 0), 0.5, BkColor.VV_QUAN_GOC_OLD_COLOR);
            drawOldLine.y = height*0.031;
            lblQuan.addChild(drawOldLine);

            var greenArrow = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_green_arrow));
            greenArrow.x = lblQuan.x + lblQuan.getContentSize().width/2 + height*0.031 + greenArrow.width/2;
            greenArrow.y = lblQuan.y;
            smsSpr.addChild(greenArrow,0);

            var newQuan = formatNumber(xu * (1 + this.bonusPercentSMS / 100));
            var lblNewQuan = new BkLabel(newQuan + " quan", "", smsfontSize);
            lblNewQuan.setTextColor(BkColor.VV_QUAN_GOC_NEW_COLOR);
            lblNewQuan.x = greenArrow.x + greenArrow.width/2 + height*0.03125 + lblNewQuan.getContentSize().width/2;
            lblNewQuan.y = greenArrow.y;
            smsSpr.addChild(lblNewQuan,0);

            var sprBT = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_bubbletalk));
            sprBT.x = lblNewQuan.x + height*0.109;
            sprBT.y = lblNewQuan.y + height*0.031;
            smsSpr.addChild(sprBT,1);

            var strbonus = "   KM\n +" + this.providerInfoData.BonusSMS + "%";
            if(this.providerInfoData.BonusVip == this.providerInfoData.BonusSMS)
            {
                strbonus = "  VIP\n +" + this.providerInfoData.BonusSMS + "%";
            }
            var lblBT = new BkLabel(strbonus, "", height*0.032);
            lblBT.x = sprBT.width/2;
            lblBT.y = sprBT.height/2 + height*0.00468;
            sprBT.addChild(lblBT,0);
        }
        else{
            lblQuan.setTextColor(BkColor.VV_QUAN_GOC_NEW_COLOR);
        }

        // Cú pháp DT<cách>NAP10<cách>TAI10<cách>chinhtv
        var smsArr = SMSContent.split(" ");
        logMessage("smsArr.length:" + smsArr.length);
        var lbl1 = new BkLabelItem("Cú pháp   ", smsfontSize, BkColor.VV_PAYMENT_SMS_NORMAL_TEXT, 1, false);
        var lblItems3 = [];
        lblItems3.push(lbl1);
        for(var i = 0; i < smsArr.length; i++)
        {
        	if(i >0)
        	{
        		var cachi = new BkLabelItem(" ", smsfontSize, BkColor.VV_PAYMENT_SMS_NORMAL_TEXT, 1, false);
            	lblItems3.push(cachi);
        	}
        	var lbli =  new BkLabelItem(smsArr[i], smsfontSize, cc.color.WHITE, 1, false);
        	lblItems3.push(lbli);
        }
        var lbl3 = new BkLabelSprite(lblItems3);
        lbl3.x = marginLeft;
        lbl3.y = lbl2.y - height*0.059375;
        smsSpr.addChild(lbl3);
        
        var btnNap = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnNap.scale = 1.6;
        btnNap.setTitleText("Nạp");
        btnNap.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnNap.setTitleFontSize(height*0.028);
        btnNap.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                logMessage("DoNapSMS");
                NativeInterface.sendSTN(servicesNumber,SMSContent);
            }
        }, this);
        btnNap.x = cc.winSize.height;
        btnNap.y = lbl3.y + height*0.05;
        smsSpr.addChild(btnNap);
        var drawLine = new cc.DrawNode();
        drawLine.drawSegment(cc.p(height*0.086, -height*0.094), cc.p(height*1.2031, -height*0.094), 0.5, cc.color(97, 45, 8));
        smsSpr.addChild(drawLine);
        
        return smsSpr;
    },
    createSMSNote: function(isNewSMS)
    {
    	var height = cc.winSize.height;
        var spriteSMSNote = new BkSprite();

        var desBG = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_banner_red));
        spriteSMSNote.addChild(desBG);

        var lblDescrible = new BkLabel("NẠP QUAN BẰNG THẺ CÀO LỢI HƠN SMS", "", 30);
        lblDescrible.setTextColor(BkColor.VV_QUAN_GOC_NEW_COLOR);
        lblDescrible.x = desBG.width/2 + height*0.01562;
        lblDescrible.y = desBG.height/2 + height*0.003125;
        desBG.addChild(lblDescrible,0);
        var strNote0 = "Chỉ hỗ trợ nạp qua tin nhắn các nhà mạng:";
        var strNote1 = "- " + this.getProviderNameFromId(VT_ID); 
        var strNote2 = "- " + this.getProviderNameFromId(MB_ID);
        var strNote3 = "- " + this.getProviderNameFromId(VN_ID);
        var strWarning = "Nạp từ 2 thuê bao khác nhau được tính riêng rẽ";
        var noteFontSize = height*0.05;
        var spaceRow = height*0.03125;
        var tfNote0 = new BkLabel("","",noteFontSize);
        var tfNote1 = new BkLabel("","",noteFontSize);
        var tfNote2 = new BkLabel("","",noteFontSize);
        var tfNote3 = new BkLabel("","",noteFontSize);
        var tfWarning = new BkLabel("","",noteFontSize);

        var dot1 = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_green_dot));
        dot1.x = desBG.x - desBG.width/2 + height*0.00781;
        dot1.y = desBG.y - desBG.height/2 - height*0.03125;
        spriteSMSNote.addChild(dot1,0);

        var dot2 = new BkSprite(this.spriteSheet.getSpriteFrame(res_name.napxu_green_dot));
        dot2.x = height*0.2968;
        dot2.y = dot1.y;
        spriteSMSNote.addChild(dot2,0);

        tfNote0.setString(strNote0);
        tfNote0.x = dot1.x + height*0.0156 + tfNote0.getContentSize().width/2;
        tfNote0.y = dot1.y;
        spriteSMSNote.addChild(tfNote0,0);

        tfWarning.setString(strWarning);
        tfWarning.x = dot2.x + height*0.0156 + tfWarning.getContentSize().width/2;
        tfWarning.y = dot2.y;
        spriteSMSNote.addChild(tfWarning,0);

        if(isNewSMS){
            tfNote1.setString(this.getProviderNameFromId(VT_ID));
            tfNote1.x = dot1.x + height*0.03125 + tfNote1.getContentSize().width/2;
            tfNote1.y = tfNote0.y - spaceRow;
            spriteSMSNote.addChild(tfNote1,0);

            tfNote2.setString(this.getProviderNameFromId(MB_ID));
            tfNote2.x = tfNote1.x + tfNote1.getContentSize().width/2 + height*0.046875 + tfNote2.getContentSize().width/2;
            tfNote2.y = tfNote1.y;
            spriteSMSNote.addChild(tfNote2,0);

            tfNote3.setString(this.getProviderNameFromId(VN_ID));
            tfNote3.x = tfNote2.x + tfNote2.getContentSize().width/2 + height*0.046875 + tfNote3.getContentSize().width/2;
            tfNote3.y = tfNote2.y;
            spriteSMSNote.addChild(tfNote3,0);
        }
        else{
            strNote1 = strNote1 + ": Tối đa 150k/thuê bao/ngày";
            strNote2 = strNote2 + ": Tối đa 300k/thuê bao/ngày";
            strNote3 = strNote3 + ": Tối đa 100k/thuê bao/ngày";

            tfNote1.setString(strNote1);
            tfNote1.x = dot1.x + height*0.03125 + tfNote1.getContentSize().width/2;
            tfNote1.y = tfNote0.y - spaceRow;
            spriteSMSNote.addChild(tfNote1,0);

            tfNote2.setString(strNote2);
            tfNote2.x = dot1.x + height*0.03125 + tfNote2.getContentSize().width/2;
            tfNote2.y = tfNote1.y - spaceRow;
            spriteSMSNote.addChild(tfNote2,0);

            tfNote3.setString(strNote3);
            tfNote3.x = dot1.x + height*0.03125 + tfNote3.getContentSize().width/2;
            tfNote3.y = tfNote2.y - spaceRow;
            spriteSMSNote.addChild(tfNote3,0);

            var strNote4 = "- Gtel và VietnamMobile: Không giới hạn";
            var tfNote4 = new BkLabel(strNote4, "", noteFontSize);
            tfNote4.x = dot1.x + height*0.03125 + tfNote4.getContentSize().width/2;
            tfNote4.y = tfNote3.y - spaceRow;
            spriteSMSNote.addChild(tfNote4,0);
        }

        return spriteSMSNote;
    },

    getContentProviderInfo: function (telcoId) {
        logMessage("getContentProviderInfo");
        Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.GetContentProviderInfo(telcoId);
        BkConnectionManager.send(packet);
    },
    CheckGoogleIAPCommand:function()
    {
    	logMessage("CheckGoogleIAPCommand");
    	Util.showAnim();
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CheckGoogleIAPCommand();
        BkConnectionManager.send(packet);
        
    },
    getProviderNameFromId:function(id)
    {
    	var psswd = "H2G9XJMHN1";
    	var strEncrypt = "";
    	if(id == 0)
    	{
    		strEncrypt = "U2FsdGVkX1+I0KTEgWVCbrZKAn4EeDWHVj3F264ih4E=";
    	} else if(id == 1)
    	{
    		strEncrypt = "U2FsdGVkX19hivfVyGTueVmqbYQEuWZLlHQR/ZCzOm8=";
    	}else if(id == 2)
    	{
    		strEncrypt = "U2FsdGVkX19vnV0oT0/2uMh5+IfOCmAiN7Sq9MgLtPs=";
    	}

    	var decrypted = CryptoJS.AES.decrypt(strEncrypt,psswd);
    	return  decrypted.toString(CryptoJS.enc.Utf8);
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
        // this.tf_MST_Input.visible = false;
        // this.tf_SSR_Input.visible = false;
        var self = this;
        var onOKClick = function(){
            // self.tf_MST_Input.visible = true;
            // self.tf_SSR_Input.visible = true;
        };
        showPopupMessageWith(textMess, "", onOKClick,onOKClick,self);
    },

    NotifyNapTheFailed: function (napTheResultCode) {
        // sendGA(BKGA.PAYMENT, 'Card fail', napTheResultCode);
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
        // sendGA(BKGA.PAYMENT, 'Card Busy', this.strprovider);
    },

    NotifyNapTheSuccess: function (totalMoney) {
        this.showPopUpNotify("Nạp thẻ " + this.strprovider + " thành công.\nBạn được cộng " + totalMoney + " " + BkConstString.STR_GAME_COIN.toLowerCase() + " vào tài khoản.");
        // sendGA(BKGA.PAYMENT, 'Card Success', this.strprovider);
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
    onExit: function () 
    {
        logMessage("onExit -> remove onLoadComplete");
        this.clearGUI();
        BkLogicManager.getLogic().setOnLoadComplete(null);
        this._super();
    }
});
