
var mainLayer = cc.Layer.extend({
    sprite:null,
    TEXT_BOX_HEIGHT_SCALE_IN_SCREEN:10,
    TEXT_BOX_WIDTH_SCALE_WITH_HEIGHT:8,
    ctor:function () {
        this._super();
       // addClickButton(this);
        var size = cc.winSize;
        this.sprite = new cc.Sprite("#" + res_name.mainscreen_bg);
        this.sprite.setScaleX(size.width/this.sprite.getContentSize().width);
        this.sprite.setScaleY(size.height/this.sprite.getContentSize().height);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        var centerPosition = size.width * 0.5;        
        var btnPayment = new ccui.Button();
        var btnSizeH = size.height * 0.1;
        var btnScale = btnSizeH/58;
        var btnSizeW = 147*btnScale;
        btnPayment.setTouchEnabled(true);
        btnPayment.setTitleText("Nap tiền");
        btnPayment.setTitleFontSize(20);
        btnPayment.setTitleColor(cc.color(0x50, 0x20, 0x00));
        btnPayment.loadTextures(res_name.btn_dk, res_name.btn_dk_press, "",ccui.Widget.PLIST_TEXTURE);
        btnPayment.setScale(btnScale);
        btnPayment.setScale(btnScale);
        btnPayment.setPosition(centerPosition , size.height  - size.height * 0.1);
        var self = this;
        var count =0;
        var countY = 0;
        btnPayment.addClickEventListener(function () {
        	 var paymentWindow = new VvPaymentWindow();
             paymentWindow.showWithParent();
//             var frWd = new VvFriendsWindow();
//             frWd.showWithParent();

        });
        this.addChild(btnPayment,10);
//        var btnBack = new ccui.Button();
//        btnBack.setTouchEnabled(true);
//        btnBack.setTitleText("Back");
//        btnBack.setTitleFontSize(20);
//        btnBack.setTitleColor(cc.color(0x50, 0x20, 0x00));
//        btnBack.loadTextures(res_name.btn_dk, res_name.btn_dk_press, "",ccui.Widget.PLIST_TEXTURE);
//        btnBack.setScale(btnScale);
//        btnBack.setPosition(btnSizeW/2 + 5 , size.height - btnSizeH - 5);
//        btnBack.addClickEventListener(function () {
//            cc.log("click btn btnBack");
//            var packet = new BkPacket();
//            packet.CreatePacketWithOnlyType(c.NETWORK_LOG_OUT);
//            BkConnectionManager.send(packet);
//            BkConnectionManager.closeConn();
//
//            var scene = new HelloWorldScene();
//            var timeTrans = 0.3;
//            var trans = null;
//            trans = new cc.TransitionProgressOutIn(timeTrans, scene);
//            cc.director.runScene(trans);
//        });
//        this.addChild(btnBack,10);

        return true;
    },
});


var mainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new mainLayer();
        this.addChild(layer);
    }
});

