/**
 * Created by bs on 25/05/2017.
 */
if(typeof CTopPlayerItem === "undefined") {
    var CTopPlayerItem = {};
    CTopPlayerItem.BH_ITEM						= 32;
    CTopPlayerItem.BW_ITEM                      = 487;
    CTopPlayerItem.FIRT_X 						= 5;
    CTopPlayerItem.HANG_WIDTH 					= 23;
    CTopPlayerItem.MAX_WITH_NAME 				= 150;
    CTopPlayerItem.MAX_WITH_CAPBAC 			    = 165;
    CTopPlayerItem.MAX_WITH_THANHTICH 			= 105;
    CTopPlayerItem.RANK_ME_X					= -25;
    CTopPlayerItem.MAX_RANK                     = 2000000000;

    CTopPlayerItem.COLOR_VAN_THANG				=  cc.color(0xfc,0x91,0x28) ;//0x4f5a7f;
    CTopPlayerItem.COLOR_VAN_CHOI				= cc.color(0xb0,0xa8,0x25);//0xd65218;
    CTopPlayerItem.COLOR_QUAN_TIEN				= cc.color(0xfe,0xe3,0x4b);//0xd18205;
    CTopPlayerItem.COLOR_GA_TO					= cc.color(0xfe,0xe3,0x4b);//0xd18205;
    CTopPlayerItem.COLOR_U_TO					= cc.color(0xff,0xff,0xff);//0xd18205;
    CTopPlayerItem.COLOR_CONTENT_TOP			= cc.color(0x3c,0x24,0x15);
}

VvTopPlayerItem = BkSprite.extend({
    startXColum1:0,
    startXColum2:0,
    startXColum3:0,
    UserInfo:null,
    bmAvar:null,
    TopWD:null,
    bm_Item:null,
    vipIcon:null,
    tfRank:null,
    color_content:cc.color(0xfe,0xe3,0x4b),// 0xfee34b;
    iConVip:null,
    ctor:function(pr,currentTab,iP, isRichest,isDrawLine){
        this.TopWD = pr;
        this.UserInfo = iP;
        this._super();
        if (isDrawLine === undefined){
            isDrawLine = true
        }
        this.bm_BG = new BkSprite("#"+res_name.img_top_cao_thu_item_hover);
        this.bm_BG.width = CTopPlayerItem.BW_ITEM;
        this.bm_BG.height = CTopPlayerItem.BH_ITEM;
        this.bm_BG.setOpacity(0);
        this.bm_BG.x = CTopPlayerItem.BW_ITEM/2;
        this.bm_BG.y = CTopPlayerItem.BH_ITEM/2;
        this.addChild(this.bm_BG);

        this.bm_Item = new BkSprite("#"+res_name.img_top_cao_thu_item_hover);
        this.bm_Item.setOpacity(122);
        this.bm_Item.x = CTopPlayerItem.BW_ITEM/2;
        this.bm_Item.y = CTopPlayerItem.BH_ITEM/2;
        this.addChild(this.bm_Item);
        this.bm_Item.visible = false;

        // init rank
        var deltaX = 10;
        if (iP.getRank() == 1){
            var bmHang1 = new BkSprite("#"+res_name.icon_no1_2);
            bmHang1.x = CTopPlayerItem.FIRT_X+deltaX;
            bmHang1.y = this.bm_Item.y;
            this.addChild(bmHang1);
        } else if (iP.getRank() == 2){
            var bmHang2 = new BkSprite("#"+res_name.icon_no2);
            bmHang2.x = CTopPlayerItem.FIRT_X+deltaX;
            bmHang2.y = this.bm_Item.y ;
            this.addChild(bmHang2);
        } else if (iP.getRank() == 3) {
            var bmHang3 = new BkSprite("#"+res_name.icon_no3);
            bmHang3.x = CTopPlayerItem.FIRT_X+deltaX;
            bmHang3.y = this.bm_Item.y;
            this.addChild(bmHang3);
        } else {
            var strRank = ""+iP.getRank();
            this.tfRank = new BkLabel(strRank,"",15);
            this.tfRank.setTextColor(this.color_content);
            this.tfRank.x = CTopPlayerItem.FIRT_X+this.tfRank.getContentSize().width/2+deltaX/2;
            if(iP.getRank() > CTopPlayerItem.MAX_RANK){
                this.tfRank.setString("?");
            }
            if (iP.getRank() > 10){
                this.tfRank.x = 30 - this.tfRank.getContentSize().width;//RANK_ME_X;
            }

            this.tfRank.y = this.bm_Item.y;
            this.addChild(this.tfRank);
        }

        this.startXColum1 = CTopPlayerItem.FIRT_X + CTopPlayerItem.HANG_WIDTH + 55;
        this.startXColum2 =  this.startXColum1 + CTopPlayerItem.MAX_WITH_NAME;
        this.startXColum3 =  this.startXColum2 + CTopPlayerItem.MAX_WITH_CAPBAC + CTopPlayerItem.MAX_WITH_THANHTICH - 20;
        // drawAvartar
        this.drawAvartar(iP);

        this.tfName = new BkLabel(iP.getUserName(),"",13);
        this.tfName.setTextColor(cc.color(255,255,255));
        this.tfName.y = this.bm_Item.y;
        this.tfName.x = this.startXColum1 + this.tfName.getContentSize().width/2;
        this.addChild(this.tfName);

        logMessage("iP.getLevel(): "+iP.getLevel());
        var strCapBac = VvLevelImage.getCapBacFromLevel(iP.getLevel());
        this.tfCapBac = new cc.LabelTTF(strCapBac,"",13);
        this.tfCapBac.setFontFillColor(this.color_content);
        this.tfCapBac.y = this.bm_Item.y;
        this.tfCapBac.x = this.startXColum2 + this.tfCapBac.getContentSize().width/2;//this.tfName.x - this.tfName.getContentSize().width/2 + CTopPlayerItem.MAX_WITH_NAME + this.tfCapBac.getContentSize().width/2;
        this.addChild(this.tfCapBac);

        this.tfThanhTich = new BkLabel("","",15,true);
        this.cofigThanhTich(currentTab,iP,isRichest);
        this.tfThanhTich.y = this.bm_Item.y;
        this.tfThanhTich.x = this.startXColum3 - this.tfThanhTich.getContentSize().width/2;//this.tfCapBac.x - this.tfCapBac.getContentSize().width/2 + CTopPlayerItem.MAX_WITH_CAPBAC + this.tfThanhTich.getContentSize().width/2;
        this.addChild(this.tfThanhTich);
        if(isDrawLine){
            this.initMouseAction();
        }

    },
    configPosXLabel:function () {
        this.tfName.x = this.startXColum1 + this.tfName.getContentSize().width/2;
        this.tfCapBac.x = this.startXColum2 + this.tfCapBac.getContentSize().width/2;
        this.tfThanhTich.x = this.startXColum3 - this.tfThanhTich.getContentSize().width/2;
    },
    cofigThanhTich:function (currentTab,iP,isRichest,isLoadding,isDangLen) {
        if (isLoadding == undefined){
            isLoadding = false;
        }
        if (isDangLen == undefined){
            isDangLen = false;
        }

        var stringTXT = "";
        var color = cc.color(255,255,255);
        if (!isLoadding){
            if(currentTab == 1) {
                stringTXT = ""+formatNumber(iP.getWinCount());
                color =CTopPlayerItem.COLOR_VAN_THANG;

            } else if (currentTab ==2) {
                stringTXT = ""+formatNumber(iP.getWinCount());
                color =CTopPlayerItem.COLOR_VAN_CHOI;
                if(iP.getRank() == 1) {
                    this.TopWD.strRank1NumberofGame = stringTXT;
                }
            } else if(currentTab ==3) {
                if (!isDangLen){
                    stringTXT = ""+ formatNumber(iP.getMoney()) + " ";
                } else {
                    stringTXT = ""+ formatNumber(iP.getWinCount()) + " ";
                }
                color = CTopPlayerItem.COLOR_QUAN_TIEN;
            } else if(currentTab == 4) {
                stringTXT =""+formatNumber(iP.getWinCount());
                color = CTopPlayerItem.COLOR_GA_TO;
            } else if(currentTab == 5) {
                stringTXT = iP.getmaxUPoint()+" " ;
                color = CTopPlayerItem.COLOR_U_TO;
            }
            this.tfThanhTich.setString(stringTXT) ;
            this.tfThanhTich.setTextColor(color);
        } else {
            this.tfThanhTich.setString("...");
        }
    },
    drawAvartar:function (iP,isLoading) {
        if (this.bmAvar != null){
            this.bmAvar.removeFromParent();
        }

        if (this.iConVip != null){
            this.iConVip.removeFromParent();
        }

        if (isLoading === undefined){
            isLoading = false;
        }
        if (isLoading){
            return;
        }
        var bm = VvAvatarImg.getAvatarByID(iP.getAvatarId());
        bm.setScale(24/97);
        var bmBG = new BkSprite("#"+res_name.avatar_out_bg_small);

        this.bmAvar = new BkSprite();
        this.bmAvar.addChild(bmBG);
        this.bmAvar.addChild(bm);
        this.bmAvar.x = CTopPlayerItem.FIRT_X + CTopPlayerItem.HANG_WIDTH + 5 +12;
        this.bmAvar.y = this.bm_Item.y;
        this.addChild(this.bmAvar);

        logMessage("vip lv" +iP.VipLevel);
        if (iP.VipLevel>0){
            this.iConVip =VvAvatarImg.getVipFromID(iP.VipLevel,false);
            this.iConVip.setScale(0.25);
            this.iConVip.y = this.bmAvar.y;
            this.iConVip.x = this.bmAvar.x + 25;//+ this.bmAvar.width/2 + this.iConVip.width/2 + 3;
            this.addChild(this.iConVip);
        }
    },
    initMouseAction: function () {
        var self = this;
        this._eventHover = this.createHoverEvent(function (event) {
            self.bm_Item.setVisible(true);
        }, function (event) {
            self.bm_Item.setVisible(false);
        }, function (event) {
            if (self.bm_Item.isVisible()) {
                self.onClickItem();
            }
        });
        cc.eventManager.addListener(this._eventHover, this);
    },
    isMe:function () {
        return false;
    },
    onClickItem:function () {
        logMessage("onClickItem ");
        var self = this;
        var layer = new VvPlayerDetailsWindow(self.UserInfo.getUserName());
        layer.setParentWindow(self.TopWD);
        layer.showWithParent();
    },
    updateData:function (currentTab,iP, isRichest,isDangLen) {
        if (isDangLen === undefined){
            isDangLen = false;
        }

        this.UserInfo = iP;
        logMessage("updateData: "+iP.getLevel());
        this.tfCapBac.setString(VvLevelImage.getCapBacFromLevel(iP.getLevel()));
        if (currentTab != 5){
            this.tfThanhTich.x = this.tfCapBac.x + CTopPlayerItem.MAX_WITH_CAPBAC - 30;
            this.tfCapBac.setFontSize(13);
            this.tfCapBac.setString(VvLevelImage.getCapBacFromLevel(iP.getLevel()));
            this.tfThanhTich.visible = true;
            this.tfCapBac.y = this.tfName.y;
        } else {
            var newWidCapBac = CTopPlayerItem.MAX_WITH_CAPBAC + 0.50 *CTopPlayerItem.MAX_WITH_THANHTICH;
            this.tfCapBac.setDimensions(cc.size(newWidCapBac,0));
            this.tfThanhTich.x = this.tfCapBac.x + newWidCapBac - 30;
            this.tfCapBac.setFontSize(12);
            if (iP.getCuocU() != ""){
                this.tfCapBac.setString("Ù: " + iP.getCuocU());
            } else {
                this.tfCapBac.setString("...");
            }
        }

        this.tfName.setString(""+iP.getUserName());
        this.cofigThanhTich(currentTab,iP,isRichest,false,isDangLen);

        if (this.tfRank!= null){
            this.tfRank.text = ""+iP.getRank();
            if(iP.getRank() > CTopPlayerItem.MAX_RANK)
            {
                this.tfRank.text = "?";
            }
            if (iP.getRank() > 10){
                this.tfRank.x = 30 - this.tfRank.getContentSize().width;
            }
        }
        this.drawAvartar(iP);
        this.configPosXLabel();
    },
    updateDataLoading:function () {
        this.tfCapBac.setString("...");
        this.tfName.setString("...");
        this.tfName.x = this.startXColum1 + this.tfName.getContentSize().width/2;
        this.cofigThanhTich(1,null,false,true);

        if (this.tfRank!= null){
            this.tfRank.setString = "...";
            this.tfRank.setTextColor(cc.color(255,255,255));
        }
        this.drawAvartar(null,true);
    }
});