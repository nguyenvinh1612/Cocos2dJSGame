/**
 * Created by vinhnq on 30/06/2016.
 */
TASK_CARD_PAYMENT_ID = 8;
var BkPromotionWd = BkWindow.extend({
    sph: cc.spriteFrameCache,
    taskList:null,
    ctor: function (taskList)
    {
        this.taskList = taskList;
        this._super("", cc.size(841, 323));
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.setVisibleTop(false);
        this.setVisibleBottom(false);
        this.setVisibleBgBody(false);
        this._btnClose.x = this._btnClose.x - 60;
        this.drawWindow();
    },
    drawWindow:function()
    {
        var rc = 2;
        var OffsetY = 30; // 4 row
        var bgOffset = 160; // 4 row
        this._btnClose.y = 400;
        bg = new BkSprite(this.sph.getSpriteFrame(res_name.promotionbg));
        if(BkGlobal.isPhoneNumberUpdatable && Util.isShowDesktopPromo())
        {
            rc = rc + 2;
            OffsetY = 115; // 4 row
            bgOffset = 160; // 4 row
        }else if(BkGlobal.isPhoneNumberUpdatable ||  Util.isShowDesktopPromo()) // 3 row
        {
            rc = 3;
            bg.setScale(1,0.78);
            OffsetY = 50;
            bgOffset = 170;
            this._btnClose.y = 335;
        }else
        {
            rc = 2;
            bg.setScale(1,0.54);
            OffsetY = -8;
            bgOffset = 170;
            this._btnClose.y = 273;
        }
        bg.x = this.getBodySize().width / 2;
        bg.y = cc.director.getWinSize().height/2 - bgOffset;
        this.addChildBody(bg);
        var title = new BkSprite(this.sph.getSpriteFrame(res_name.title));
        title.x = this.getBodySize().width / 2;
        title.y =  this.getBodySize().height + OffsetY;
        this.addChildBody(title)
        var self = this;
        var napthe_bg = new BkSprite(this.sph.getSpriteFrame(res_name.thuongnapthe_bg));
        napthe_bg.x = this.getBodySize().width / 2;
        napthe_bg.y = title.y - 85;
        this.addChildBody(napthe_bg);
        var taskCard = this.getTaskCard(this.taskList);
        if(taskCard != null)
        {

            if(taskCard.bonusMoney > 0)
            {
                var bonus = taskCard.bonusMoney;
                //bonus = 2000000;
                var txtNapTien = this.getTextFromBonus(bonus);
                //txtNapTien = "500K-1M";
                var isGetBonus = taskCard.isGetBonus;
                if(isGetBonus)
                {
                    bonus = this.getNextBonus(bonus);
                    txtNapTien = this.getTextFromBonus(bonus);
                }
                if(bonus > 0)
                {
                    // var lblBonus = new BkLabel(bonus + " Xu","",30,true);
                    //var lblNapTien = new BkLabel(txtNapTien ,"",30,true);
                    var lblBonus = new cc.LabelBMFont(bonus + " xu", res.BITMAP_GAME_FONT_TCM);
                    lblBonus.setScale(0.8);
                    var lblNapTien = new cc.LabelBMFont(txtNapTien, res.BITMAP_GAME_FONT_TCM);
                    lblNapTien.setScale(0.8);
                }
                lblNapTien.x = napthe_bg.x - 20;
                lblNapTien.y = napthe_bg.y + 35;
                this.addChildBody(lblNapTien);
                lblBonus.x  = napthe_bg.x + 77;
                lblBonus.y  = napthe_bg.y + 2;
                this.addChildBody(lblBonus);
            }
        }
        var btnThucHien_NapThe = createBkButtonPlist(res_name.btnThucHien,res_name.btnThucHienPress,res_name.btnThucHien,res_name.btnThucHienHover, "");
        this.addChildBody(btnThucHien_NapThe);
        btnThucHien_NapThe.x = 675;
        btnThucHien_NapThe.y =  napthe_bg.y;
        btnThucHien_NapThe.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                self.onClickNapThe();
                sendGA(BKGA.PROMOTION_WD, "click btnNapThe", BkGlobal.clientDeviceCheck);
            }
        }, this);

        var moiban_bg = new BkSprite(this.sph.getSpriteFrame(res_name.moibanFB_bg));
        moiban_bg.x =  this.getBodySize().width/ 2;
        moiban_bg.y = napthe_bg.y - 115;
        this.addChildBody(moiban_bg);
        var btnThucHien_MoiBan = createBkButtonPlist(res_name.btnThucHien,res_name.btnThucHienPress,res_name.btnThucHien,res_name.btnThucHienHover, "");
        this.addChildBody(btnThucHien_MoiBan);
        btnThucHien_MoiBan.x = btnThucHien_NapThe.x;
        btnThucHien_MoiBan.y = moiban_bg.y ;
        btnThucHien_MoiBan.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                BkLogicManager.getLogic().onClickInviteFBFriend();
                sendGA(BKGA.PROMOTION_WD, "click btnMoiBanFB", BkGlobal.clientDeviceCheck);
            }
        }, this);
        if(BkGlobal.isPhoneNumberUpdatable)
        {
            var xacthuc_bg = new BkSprite(this.sph.getSpriteFrame(res_name.xacthucTK_sdt_bg));
            xacthuc_bg.x =  this.getBodySize().width / 2;
            xacthuc_bg.y = moiban_bg.y - 115;
            this.addChildBody(xacthuc_bg);
            var btnThucHien_XacThuc = createBkButtonPlist(res_name.btnThucHien,res_name.btnThucHienPress,res_name.btnThucHien,res_name.btnThucHienHover, "");
            this.addChildBody(btnThucHien_XacThuc);
            btnThucHien_XacThuc.x = btnThucHien_MoiBan.x;
            btnThucHien_XacThuc.y = xacthuc_bg.y;
            btnThucHien_XacThuc.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    sendGA(BKGA.PROMOTION_WD, "click btnThucHien_XacThuc", BkGlobal.clientDeviceCheck);
                    self.updatePhoneNumber();
                }
            }, this);
        }
        if(Util.isShowDesktopPromo())
        {
            var desktopPromotion_bg = new BkSprite(this.sph.getSpriteFrame(res_name.taiapp_Bg));
            desktopPromotion_bg.x =  this.getBodySize().width / 2;
            if(rc == 3)
            {
                desktopPromotion_bg.y = moiban_bg.y - 115;
            }else
            {
                desktopPromotion_bg.y = moiban_bg.y - 230;
            }
            this.addChildBody(desktopPromotion_bg);
            var btnTaiApp = createBkButtonPlist(res_name.btnTaiApp,res_name.btnTaiAppPress,res_name.btnTaiApp,res_name.btnTaiAppHover, "");
            this.addChildBody(btnTaiApp);
            btnTaiApp.x = btnThucHien_MoiBan.x;
            btnTaiApp.y = desktopPromotion_bg.y;
            btnTaiApp.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    sendGA(BKGA.PROMOTION_WD, "click btnTaiDesktopApp", BkGlobal.clientDeviceCheck);
                    var url = " https://goo.gl/dvYUzN";
                    cc.sys.openURL(url);
                }
            }, this);
        }
    },
    getTaskCard:function(taskList)
    {
      for(var i = 0 ; i < taskList.length; i++ )
      {
          if(this.taskList[i].id >= TASK_CARD_PAYMENT_ID )
          {
              return this.taskList[i];
          }
      }
        return null;
    },
    updatePhoneNumber:function()
    {
        if(this.registerPhoneWd != null)
        {
            this.registerPhoneWd.removeFromParent();
            this.registerPhoneWd = null;
        }
        this.registerPhoneWd = new BkRegisterPhoneNumberWindow();
        this.registerPhoneWd.setParentWindow(this);
        this.registerPhoneWd.showWithParent();
    },
    onClickNapThe:function()
    {
        logMessage("onClickNapThe");
        if(this.paymentWD != null)
        {
            this.paymentWD.removeSelf();
            this.paymentWD = null;
        }
        this.paymentWD = new BkPaymentWindow();
        this.paymentWD.setParentWindow(this);
        this.paymentWD.showWithParent();
    },
    getNextBonus:function(bonus)
    {
        switch(bonus)
        {
            case 20000:
                return 50000;
            case 50000:
               return 100000;
            case 100000:
                return 200000;
            case 200000:
                return 500000;
            case 500000:
                return 1000000;
            case 1000000:
                return 2000000;
            case 2000000:
                return 2000000;
            default:
            {
                return 20000;
            }
        }
    },
    getTextFromBonus:function(bonus)
    {
        switch(bonus)
        {
            case 20000:
                return "20K-50K";
            case 50000:
                return "50K-100K";
            case 100000:
                return "100K-200K";
            case 200000:
                return "200K-500K";
            case 500000:
                return "500K-1M";
            case 1000000:
                return "1M-2M";
            case 2000000:
                return "2M";
            default:
            {
                return "20K-50K";
            }
        }
    },
});