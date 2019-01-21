/**
 * Created by bs on 02/06/2017.
 */
VvNotifyContentWindow = VvWindow.extend({
    func1:-1,
    func2:-1,
    strWeb1:"",
    strWeb2:"",
    ctor: function (strContent,numberButton,funcBtn1,strWeb1,funcBtn2,strWeb2) {

        this.func1 = funcBtn1;
        this.func2 = funcBtn2;
        this.strWeb1 = strWeb1;
        this.strWeb2 = strWeb2;

        this._super("Thông báo", cc.size(500, 280));
        this.setVisibleOutBackgroundWindow(true);
        this.setVisibleDefaultWdBodyBg(false);

        var bm2 = new BkSprite("#down_thongbao.png");
        bm2.x = cc.winSize.width/2;
        bm2.y = cc.winSize.height/2;
        this.addChild(bm2,-3);

        var bm1 = new BkSprite("#up_thongbao.png");
        bm1.x = 150;
        bm1.y = 35;
        this.addChildBody(bm1);
        strContent = strContent.substring (0,100);
        var lb1 = new cc.LabelTTF(strContent,"",16*2);
        lb1.setDimensions(cc.size(0.8 * 2 *this.getWindowSize().width,0));
        lb1.setFontFillColor(cc.color(0xf7,0xac,0x2f));
        lb1.x = this.getWindowSize().width/2;
        lb1.y = 165;
        lb1.setScale(0.5);
        lb1.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChildBody(lb1);

        var btn1 = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy
            ,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,this.getTextBtn(funcBtn1),0,0);
        btn1.x = this.getWindowSize().width/2;
        btn1.y = 80;
        btn1.setTitleColor(cc.color(0,0,0));
        this.addChildBody(btn1);
        var  self = this;
        btn1.addClickEventListener(function () {
            self.onClickBtn1();
        });

        if (numberButton == 2){
            var deltaX = 85;
            btn1.x -= deltaX;
            var btn2 = createBkButtonPlist(res_name.vv_btn_dongy,res_name.vv_btn_dongy
                ,res_name.vv_btn_dongy,res_name.vv_btn_dongy_hover,this.getTextBtn(funcBtn2),0,0);
            btn2.x = this.getWindowSize().width/2+deltaX;
            btn2.y = btn1.y;
            btn2.setTitleColor(cc.color(0,0,0));
            this.addChildBody(btn2);
            btn2.addClickEventListener(function () {
                self.onClickBtn2();
            });
        }

    },
    getTextBtn:function (type) {
        var rtn = "Đồng ý";
        if (type == 0){
            return "Đóng"
        }
        if (type == 1){
            return "Quan thưởng"
        }
        if (type == 2){
            return "Cửa hàng"
        }
        if (type == 3){
            return "Chuyển quan"
        }
        if (type == 4){
            return "Vay quan"
        }
        if (type == 5){
            return "Quyền lợi VIP"
        }
        if (type == 6){
            return "Chơi ngay"
        }
        if (type == 7){
            return "Xem chi tiết"
        }
        return rtn;
    },
    onClickBtn2:function () {
        this.processClickButton(this.func2,this.strWeb2);
    },
    onClickBtn1:function () {
        this.processClickButton(this.func1,this.strWeb1);
    },
    processClickButton:function (type,webURL) {
        this.removeSelf();
        var layer;
        if (type == 1){
            layer = new VvBonusWindow();
            layer.showWithParent();
        }
        if (type == 2){
            var shoppingWindow = new VvShoppingWindow();
            shoppingWindow.showWithParent();
        }
        if (type == 3){
            layer = new VvVipMoneyTransferWindow();
            layer.showWithParent();
        }
        if (type == 4){
            layer = new VvVipMoneyBorrowWindow(this);
            layer.showWithParent();
        }
        if (type == 5){
            layer = new VvVipBenefitWindow();
            layer.showWithParent();
        }
        if (type == 6){
            var Packet = new BkPacket();
            Packet.CreatePacketWithOnlyType(c.NETWORK_AUTO_FIND_TABLE);
            BkConnectionManager.send(Packet);
        }
        if (type == 7){
            openUrl(webURL);
        }
    }
});