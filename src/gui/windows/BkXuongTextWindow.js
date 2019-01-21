/**
 * Created by bs on 10/05/2017.
 */
BkXuongTextWindow = VvWindow.extend({
    tfCuocXuong:null,
    btnXuong:null,
    ctor:function() {
        this._super("", cc.size(460, 190));
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this._bgBody.visible = false;
        //this.setVisibleBottom(false);
        this.setVisibleOutBackgroundWindow(false);
        this.setMoveableWindow(true);
        this._btnClose.visible = false;
        this.bgWd = new BkSprite("#"+res_name.cuocho_bg);
        this.bgWd.x = this.getWindowSize().width/2;
        this.bgWd.y = 300;//this.getWindowSize().height - this.bgWd.getContentSize().height/2;
        this.addChildBody(this.bgWd, WD_ZORDER_BODY);

        this.tfCuocXuong = new cc.LabelTTF("", "BRUSHSBI", 20*2,cc.size (400 * 2 , 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.tfCuocXuong.setScale(0.5);
        this.tfCuocXuong.x  = this.bgWd.x;
        this.tfCuocXuong.y  = this.bgWd.y;
        this.addChildBody(this.tfCuocXuong);

        this.btnXuong = createBkButtonPlistNewTitle(res_name.vv_btn_big_normal, res_name.vv_btn_big_press
            , res_name.vv_btn_big_normal, res_name.vv_btn_big_hover,"Xướng cước",0,0);
        //Util.setBkButtonShadow(this.btnXuong);
        this.btnXuong.setTitleColor(cc.color.BLACK);
        this.btnXuong.setTitleFontSize(14);
        this.btnXuong.x = this.bgWd.x;
        this.btnXuong.y = this.bgWd.y - 80;
        this.addChildBody(this.btnXuong, WD_ZORDER_BODY);
        var self = this;
        this.btnXuong.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnXuong.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnXuong.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickButtonXuongCuoc();
        });
    },
    onClickButtonXuongCuoc:function(){
        logMessage("oclick Xuong cuoc");
        if (this.tfCuocXuong.getString()== ""){
            showToastMessage(BkConstString.STR_STRING_XUONG_TRONG,this.btnXuong.x,this.btnXuong.y - 25);
        } else {
            var cuoc = this.getParentWindow().xcw.getArrayXuong();
            var Packet = new BkPacket();
            Packet.CreatePacketXuongCuoc(cuoc);
            BkConnectionManager.send(Packet);
        }
    },
    setTextContent:function(strText){
        this.tfCuocXuong.setString(strText);
    }
});
