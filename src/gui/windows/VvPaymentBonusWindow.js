/**
 * Created by bs on 01/06/2017.
 */
VvPaymentBonusWindow = VvWindow.extend({
    spriteSheet: cc.spriteFrameCache,
    timeDur:0,
    lbTime:null,
    ctor: function (bonusPercent,header,body1,body2,duration,numBtn,func,strUrl) {
        this.spriteSheet.addSpriteFrames(res.vv_nap_tien_plist, res.vv_nap_tien_img);
        this._super("Thông báo", cc.size(500, 350));
        this.setVisibleOutBackgroundWindow(true);
        this.setVisibleDefaultWdBodyBg(false);

        var ruongSp = new BkSprite("#"+res_name.image_treasure);
        ruongSp.x = 440;
        ruongSp.y = 175;
        this.addChildBody(ruongSp);

        var lbKMNT = new  BkLabel("KHUYẾN MẠI NẠP TIỀN","",18);
        lbKMNT.setTextColor(cc.color(0xF0,0xf4,0x2b));
        lbKMNT.x = this.getWindowSize().width/2;
        lbKMNT.y = 260;
        this.addChildBody(lbKMNT);

        var lb1 = new cc.LabelTTF(header,"",16*2);
        lb1.setDimensions(cc.size(0.8 * 2 *this.getWindowSize().width,0));
        lb1.setFontFillColor(cc.color(0xf7,0xac,0x2f));
        lb1.x = lbKMNT.x;
        lb1.y = lbKMNT.y - 35;
        lb1.setScale(0.5);
        lb1.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChildBody(lb1);

        var lbKM1 = new cc.LabelBMFont(body1, res.BITMAP_GAME_FONT_TCM);
        lbKM1.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        lbKM1.x = this.getWindowSize().width* 0.4;
        lbKM1.y = 180;
        this.addChildBody(lbKM1);

        var lbKM2 = new cc.LabelBMFont(body2, res.BITMAP_GAME_FONT_TCM);
        lbKM2.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        lbKM2.x = lbKM1.x;
        lbKM2.y = 130;
        this.addChildBody(lbKM2);

        var btnNapQuan = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy
            ,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,"Nạp quan",0,0);
        btnNapQuan.x = this.getWindowSize().width/2;
        btnNapQuan.y = 40;
        btnNapQuan.setTitleColor(cc.color(0,0,0));
        this.addChildBody(btnNapQuan);
        var  self = this;
        btnNapQuan.addClickEventListener(function () {
            self.onClickNapQuan();
        });
        this.timeDur = duration-1;
        this.lbTime = new BkLabel(this.getStringTime() ,"",16);
        this.lbTime.y = 75;
        this.lbTime.x = btnNapQuan.x;
        this.addChildBody(this.lbTime);


        this.schedule(this.onTick,1);

        // TODO... number button = 2

    },
    getStringTime:function () {
        return "Lưu ý: hiệu lực của khuyến mại còn: " + BkTime.formatSeconds(this.timeDur);
    },
    onTick:function () {
        if (this.timeDur == 0){
            this.unschedule(this.onTick);
            return;
        }
        this.timeDur--;
        this.lbTime.setString(this.getStringTime());
    },
    onClickNapQuan:function () {
        this.removeFromParent();
        var paymentWindow = new VvPaymentWindow();
        paymentWindow.showWithParent();
    }
});