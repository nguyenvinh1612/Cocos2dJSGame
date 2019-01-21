/**
 * Created by bs on 21/03/2016.
 */
BkLodeWindow = BkWindow.extend({
    btnLo:null,
    btnXien2:null,
    btnXien3:null,
    btnXien4:null,
    btnLo3Cang:null,
    btnDe:null,
    btnDeDau:null,
    btnDeCuoi:null,
    btnDe3Cang:null,
    btnThongKe:null,
    ctor: function () {
        var popupSize  = cc.size(740, 325);
        this._super("Chọn số", popupSize);
        this.initWd();
        this.setVisibleOutBackgroundWindow(true);
    },
    initWd:function(){
        var startX = 100;
        var startY = 200;
        var deltaX = 120;
        var deltaY = -50;
        var size = cc.winSize;
        var  self = this;
        this.btnLo = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Lô",size.width/2,size.height/2);
        this.btnLo.x = startX;
        this.btnLo.y = startY;
        this.addChildBody(this.btnLo);
        this.btnLo.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.LO);
        });

        this.btnXien2 = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Xiên 2",size.width/2,size.height/2);
        this.btnXien2.x = this.btnLo.x + deltaX;
        this.btnXien2.y = this.btnLo.y;
        this.addChildBody(this.btnXien2);
        this.btnXien2.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.XIEN2);
        });

        this.btnXien3 = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Xiên 3",size.width/2,size.height/2);
        this.btnXien3.x = this.btnXien2.x + deltaX;
        this.btnXien3.y = this.btnLo.y;
        this.addChildBody(this.btnXien3);
        this.btnXien3.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.XIEN3);
        });

        this.btnXien4 = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Xiên 4",size.width/2,size.height/2);
        this.btnXien4.x = this.btnXien3.x + deltaX;
        this.btnXien4.y = this.btnLo.y;
        this.addChildBody(this.btnXien4);
        this.btnXien4.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.XIEN4);
        });

        this.btnLo3Cang = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Lô 3 càng",size.width/2,size.height/2);
        this.btnLo3Cang.x = this.btnXien4.x + deltaX;
        this.btnLo3Cang.y = this.btnLo.y;
        this.addChildBody(this.btnLo3Cang);
        this.btnLo3Cang.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.LO3CANG);
        });

        this.btnDe = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Đề",size.width/2,size.height/2);
        this.btnDe.x = this.btnLo.x;
        this.btnDe.y = this.btnLo.y + deltaY;
        this.addChildBody(this.btnDe);
        this.btnDe.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.DE);
        });

        this.btnDeDau = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Đề Đầu",size.width/2,size.height/2);
        this.btnDeDau.x = this.btnLo.x + deltaX;
        this.btnDeDau.y = this.btnLo.y + deltaY;
        this.addChildBody(this.btnDeDau);
        this.btnDeDau.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.DEDAU);
        });

        this.btnDeCuoi = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Đề Cuối",size.width/2,size.height/2);
        this.btnDeCuoi.x = this.btnDeDau.x + deltaX;
        this.btnDeCuoi.y = this.btnLo.y + deltaY;
        this.addChildBody(this.btnDeCuoi);
        this.btnDeCuoi.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.DECUOI);
        });

        this.btnDe3Cang = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Đề 3 Càng",size.width/2,size.height/2);
        this.btnDe3Cang.x = this.btnDeCuoi.x + deltaX;
        this.btnDe3Cang.y = this.btnLo.y + deltaY;
        this.addChildBody(this.btnDe3Cang);
        this.btnDe3Cang.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.DE3CANG);
        });

        this.btnThongKe = createBkButtonPlist(res_name.btn_ready_normal, res_name.btn_ready_press, res_name.btn_ready_normal,
            res_name.btn_ready_hover,"Thống Kê",size.width/2,size.height/2);
        this.btnThongKe.x = this.btnDe3Cang.x + deltaX;
        this.btnThongKe.y = this.btnLo.y + deltaY;
        this.addChildBody(this.btnThongKe);
        this.btnThongKe.addClickEventListener(function(){
            self.onClickBtnLodeWithType(LDNS.THONGKELODE);
        });

    },
    onClickBtnLodeWithType:function(lodeType){
        logMessage("lodeType "+lodeType);
        var layer = new BkChonSoLoDeWindow(lodeType);
        layer.showWithParent(this);
    }
});