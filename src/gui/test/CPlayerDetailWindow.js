/**
 * Created by hoangthao on 05/10/2015.
 */
CPlayerDetailWindow = BkTabWindow.extend({

    ThongTinSprite: null,
    TaiSanSprite: null,
    ItemList:null,

    ctor: function () {
        //var buttonList = ["Thông tin", "Tài sản", "Tab 3", "Tab 4", "Tab 55 AAAdsd s"];
        var buttonList = ["Thông tin", "Tài sản", "Tab 3"];
        this._super("Trang cá nhân", cc.size(680, 540), buttonList.length, buttonList);
        this.initUI();
    },
    initUI: function () {
        this.initThongTinTab();
        this.initTaiSanTab();

        this.addTabChangeEventListener(this.selectedTabEvent, this)
    },
    selectedTabEvent: function (sender, tabIndex) {
       // console.log("Click tab " + tabIndex);
        this.drawUIWithTab(tabIndex);
    },
    drawUIWithTab: function(tabIndex) {
        if (tabIndex == 1) {
            this._thongTinSprite.setVisible(true);
            this._taiSanSprite.setVisible(false);
            cc.eventManager.pauseTarget(this._taiSanSprite, true);
            cc.eventManager.resumeTarget(this._thongTinSprite, true);
        } else if (tabIndex == 2) {
            this._thongTinSprite.setVisible(false);
            this._taiSanSprite.setVisible(true);
            cc.eventManager.pauseTarget(this._thongTinSprite, true);
            cc.eventManager.resumeTarget(this._taiSanSprite, true);
        }else if(tabIndex == 3){
            this._thongTinSprite.setVisible(false);
            this._taiSanSprite.setVisible(false);
        }
    },

    initThongTinTab: function () {
        this._thongTinSprite = new BkSprite();
        this.addChildBody(this._thongTinSprite);

        var btnCall4 = BkButton.create(res.BtnDialog_Normal, res.BtnDialog_Pressed, res.BtnDialog_Inactive, res.BtnDialog_Hover);
        btnCall4.setTitleText("Call 2");
        btnCall4.x = this.width / 2;
        btnCall4.y = this.height / 2 - 10;
        this._thongTinSprite.addChild(btnCall4);

    },

    initTaiSanTab: function () {

        this._taiSanSprite = new BkSprite();
        cc.eventManager.pauseTarget(this._taiSanSprite, true);
        this.addChildBody(this._taiSanSprite);

        var bg = new BkSprite(res.bv_daigia_content_bg);

        var width = this.getWindowSize().width - 30;
        var height = this.getWindowSize().height - this._btnTab1.height - 45;
        bg.setScale(1.05,1.00);

        bg.x = this.getWindowSize().width/2;
        bg.y = height/2;

        this._taiSanSprite.addChild(bg);

        var btnHinhAnh = new BkButton(res.btn_taisan_avatar, res.btn_taisan_avatar_press, null, res.btn_taisan_avatar_hover);
        btnHinhAnh.setTitleText("Hình ảnh");
        btnHinhAnh.setZoomScale(0);
        btnHinhAnh.x = bg.x/4 - 10;
        btnHinhAnh.y = bg.y + btnHinhAnh.height;
        btnHinhAnh.setIsSelected(true);
        this._taiSanSprite.addChild(btnHinhAnh);

        var btnBaoBoi = new BkButton(res.btn_taisan_baoboi, res.btn_taisan_baoboi_press, null, res.btn_taisan_baoboi_hover);
        btnBaoBoi.setTitleText("Bảo bối");
        btnBaoBoi.setZoomScale(0);
        btnBaoBoi.x = btnHinhAnh.x;
        btnBaoBoi.y = btnHinhAnh.y - btnBaoBoi.height;
        btnBaoBoi.setIsSelected(true);
        this._taiSanSprite.addChild(btnBaoBoi);

        var btnVatPham = new BkButton(res.btn_taisan_vatpham, res.btn_taisan_vatpham_press, null, res.btn_taisan_vatpham_hover);
        btnVatPham.setTitleText("Vật phẩm");
        btnVatPham.setZoomScale(0);
        btnVatPham.x = btnHinhAnh.x;
        btnVatPham.y = btnBaoBoi.y - btnVatPham.height;
        btnVatPham.setIsSelected(true);
        this._taiSanSprite.addChild(btnVatPham);

        var gachngang = new BkSprite(res.gachngang);

        this._taiSanSprite.addChild(gachngang);
    },

});