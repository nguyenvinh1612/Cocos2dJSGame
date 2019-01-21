/**
 * Created by vinhnq on 22/01/2018.
 */
VvDayBonusItemSprite = BkSprite.extend({
    dayId: 0,
    moneyBonus: 0,
    bonusImgId:0,
    itemID1: 0,
    itemID2: 0,
    bonusPercent: 0,
    vipBonus: 0,
    bmAvar: null,
    bmMoney: null,
    btnNhan: null,
    itemBg:null,
    avatarSpr:null,
    pr:null,
    ctor: function (dayObj,pr)
    {
        this.pr = pr;
        this._super();
        this.dayId = dayObj.dayId;
        this.curDay = dayObj.curDay;
        this.moneyBonus = dayObj.moneyBonus;
        this.bonusImgId = dayObj.bonusImgId;
        this.itemID1 = dayObj.itemID1;
        this.itemID2 = dayObj.itemID2;
        this.bonusPercent = dayObj.bonusPercent;
        this.vipBonus = dayObj.vipBonus;
        this.initBaseElement();
    },
    initBaseElement: function ()
    {
        //btnNhan
        this.btnNhan = createBkButtonPlistNewTitle(res_name.day_bonus_item_btn_nhan_normal, res_name.day_bonus_item_btn_nhan_pressed, res_name.day_bonus_item_btn_nhan_disable
            , res_name.day_bonus_item_btn_nhan_hover,"Nhận",0,0);
        this.addChild(this.btnNhan);
        var self = this;
        this.btnNhan.addClickEventListener(function()
        {
            logMessage("this.btnNhan .....");
            if(self.dayId == self.curDay)
            {
                var test = self.pr;
                self.pr.doGetDailyBonus();
                return;
            }else
            {
                showToastMessage("Đăng nhập vào ngày tiếp theo để nhận được gói quà này.",self.x + 100,self.y + 140);
            }
        });
        this.btnNhan.y = -100;
        //background
       if(this.dayId == this.curDay)
       {
           this.itemBg = new BkSprite("#"+res_name.day_bonus_item_bg_current);

       }else
       {
           this.itemBg = new BkSprite("#"+res_name.day_bonus_item_bg_future);
           if(this.dayId < this.curDay)
           {
              this.btnNhan.loadTextures(res_name.day_bonus_item_btn_nhan_disable,res_name.day_bonus_item_btn_nhan_disable,res_name.day_bonus_item_btn_nhan_disable
                  ,res_name.day_bonus_item_btn_nhan_disable,ccui.Widget.PLIST_TEXTURE);
              this.btnNhan.SetEnable(false);
              this.btnNhan.setTitleColor(cc.color.GRAY);
               if(this.bonusPercent > 0)
               {
                   this.itemMask = new BkSprite("#"+res_name.day_bonus_item_bg_past_km);
               }else
               {
                   this.itemMask = new BkSprite("#"+res_name.day_bonus_item_bg_past);
               }
               this.itemMask.y = this.itemBg.y - 5;
               this.addChild(this.itemMask,1);
           }
       }
        this.addChild(this.itemBg);
       //lblday
        var tfday = new BkLabel("Ngày " + this.dayId,"",13);
        if(this.dayId <= this.curDay)
        {
            tfday.setTextColor( cc.color.WHITE );
        }else
        {
            tfday.setTextColor(cc.color(234,155,50));
        }
        tfday.y = 63;
        this.addChild(tfday);
       // avatar, bao boi, display itemid1 by default
        if(this.itemID1 != 0)
        {
            var type = VvAvatarImg.getTypeFromId(this.itemID1);
            if(type == AT.TYPE_AVATAR)
            {
                this.avatarSpr = VvAvatarImg.getShopImageFromID(this.itemID1, false); // is avatar
                if(this.itemID2 != 0)
                {
                    var type2 = VvAvatarImg.getTypeFromId(this.itemID2);
                    if(type2 != AT.TYPE_AVATAR )
                    {
                       /// itemImage = VvAvatarImg.getShopImageFromID(this.itemInfo.itemId, false);
                        this.avatarSpr = VvAvatarImg.getShopImageFromID(this.itemID2, false); // is avatar
                    }
                }
            }else
            {
                this.avatarSpr = VvAvatarImg.getShopImageFromID(this.itemID1, false); // is vat pham, bao boi
            }
            this.avatarSpr.setScale(0.6);
            this.addChild(this.avatarSpr);
        }
        // Icon money
        if(this.moneyBonus > 0)
        {
            this.iconMoney = new BkSprite("#" +  "gold_" + this.bonusImgId + ".png");
            this.iconMoney.y = - 28;
            this.addChild(this.iconMoney);

            this.tfMoney = new BkLabel(formatNumber(this.moneyBonus),"",20,true);
            this.tfMoney.x =  this.iconMoney.x;
            this.tfMoney.y = this.iconMoney.y - 15;
            this.addChild(this.tfMoney);
        }

         if(this.bonusPercent > 0)
         {
             var stickerImg = new BkSprite("#" + res_name.day_bonus_item_sticker_KM);
             stickerImg.y = - 67;
             stickerImg.x = - 7;
             this.addChild(stickerImg);
             var tfBonusKM = new BkLabel("+" + this.bonusPercent + "% KM","",13);
             tfBonusKM.setTextColor( cc.color.WHITE );
             tfBonusKM.x = stickerImg.width/2;
             tfBonusKM.y = stickerImg.height/2 -1;
             stickerImg.addChild(tfBonusKM);
         }
         if(this.vipBonus > 0)
         {
             tfVipBonus = new BkLabel(this.vipBonus + " điểm VIP","",12,true);
             tfVipBonus.setTextColor(cc.color(192,222,25));
             tfVipBonus.y = -48;
             this.addChild(tfVipBonus);
         }
         this.configPos();
    },
    setDisable:function(isDisable)
    {
        if(this.itemBg != undefined && this.itemBg != null)
        {
            this.itemBg.removeSelf();
            this.itemBg = new BkSprite("#"+res_name.day_bonus_item_bg_future);
            this.addChild(this.itemBg);
        }
        if(isDisable)
        {
            if(this.bonusPercent > 0)
            {
                this.itemMask = new BkSprite("#"+res_name.day_bonus_item_bg_past_km);
            }else
            {
                this.itemMask = new BkSprite("#"+res_name.day_bonus_item_bg_past);
            }
            this.itemMask.y = this.itemBg.y - 5;
            this.addChild(this.itemMask,1);
        }
    },
    configPos:function()
    {
        if(this.vipBonus > 0 || this.itemID1 > 0 && this.itemID2 > 0)
        {
            //scale avatar;
            if(this.moneyBonus > 0 && this.vipBonus > 0)
            {
                this.iconMoney.setScale(0.7);
                this.iconMoney.y = this.iconMoney.y + 8;
                this.tfMoney.y = this.iconMoney.y - 10;
            }

        }
        if(this.moneyBonus > 0 && this.avatarSpr != null && this.avatarSpr != undefined)
        {
            this.avatarSpr.x = this.avatarSpr.x + 8;
            this.avatarSpr.y = this.avatarSpr.y + 10;
        }
    },
});