/**
 * Created by vinhnq on 1/18/2017.
 */
var BkPaymentPromotionWD = BkWindow.extend({
    remainingTime:null,
    ctor: function (title,content,percent,remainingtime)
    {
        this._super("", cc.size(841, 323));
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.setVisibleTop(false);
        this.setVisibleBottom(false);
        this.setVisibleBgBody(false);
        this._btnClose.visible = false;
        this.remainingTime = remainingtime;
        this.drawWindow(title,content,percent);
    },
    drawWindow:function(title,content,percent)
    {
        var bg = new BkSprite(cc.spriteFrameCache.getSpriteFrame(res_name.paymentpromotionbg));
        bg.x = this.getBodySize().width / 2;
        bg.y = this.getBodySize().height/2;
        this.addChildBody(bg);
        var lblTitle = new BkLabel(title,"Tahoma",35,true);
        lblTitle.setTextColor(cc.color(216,255,0));
        lblTitle.x = this.getBodySize().width / 2;
        lblTitle.y = this.getBodySize().height/2 + 150;
        this.addChildBody(lblTitle);
        var strContent = "Chúc mừng bạn được tặng " + percent + "% cho mọi\n mệnh giá nạp tiền";
        var lblcontent = new BkLabel(strContent,"Tahoma",21);
        lblcontent.setTextColor(cc.color(255,255,255));
        lblcontent.x = this.getBodySize().width / 2;
        lblcontent.y = this.getBodySize().height/2 + 90;
        this.addChildBody(lblcontent);
        var strPromotion = "+" + percent + "%\n"+"SMS & THẺ CÀO"
        var lblPromotion = new cc.LabelBMFont(strPromotion, res.BITMAP_GAME_FONT_TCM);
        lblPromotion.setScale(1);
        this.addChildBody(lblPromotion);
        lblPromotion.x = this.getBodySize().width / 2 + 105;
        lblPromotion.y = this.getBodySize().height/2 - 20;
        var strRemainingTime = "Lưu ý: hiệu lực của khuyến mại còn: " + Util.secondsToTimecode(this.remainingTime);
        this.lblRemainingTime = new BkLabel(strRemainingTime,"Arial", 17);
        this.schedule(this.ontick,1);
        this.lblRemainingTime.x = this.getBodySize().width / 2;
        this.lblRemainingTime.y =this.getBodySize().height/2 - 100;
        this.addChildBody(this.lblRemainingTime);
        var btnPayment = createBkButtonPlistNewTitle(res_name.btn_ready_normal, res_name.btn_ready_normal, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Nạp ngay",cc.winSize.width/2,cc.winSize.height/2);
        btnPayment.y =  cc.director.getWinSize().height/2 - 160;
        this.addChild(btnPayment);
        var self = this;
        btnPayment.addClickEventListener(function()
        {
            if(self.paymentWD != null)
            {
                self.paymentWD.removeSelf();
                self.paymentWD = null;
            }
            self.paymentWD = new BkPaymentWindow();
            self.paymentWD.setParentWindow(self.getParent());
            self.paymentWD.showWithParent(true);
            self.removeFromParent();
        });
    },
    ontick:function()
    {
        if(this.remainingTime == 0)
        {
            return;
        }
        if(this.remainingTime > 0)
        {
            this.remainingTime = this.remainingTime - 1;
        }
        var strRemainingTime = "Lưu ý: hiệu lực của khuyến mại còn: " + Util.secondsToTimecode(this.remainingTime);
        this.lblRemainingTime.setString(strRemainingTime);
    },
});