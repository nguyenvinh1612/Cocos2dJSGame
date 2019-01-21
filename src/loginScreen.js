
var loginLayer = cc.Layer.extend({
    sprite:null,
    TEXT_BOX_HEIGHT_SCALE_IN_SCREEN:10,
    TEXT_BOX_WIDTH_SCALE_WITH_HEIGHT:8,
    ctor:function () {
        this._super();
        addSpriteFrames(res.loginPlist,res.loginPNG);
        logMessage("loginLayer");
        var size = cc.winSize;
        var height = size.height;
        this.sprite = new cc.Sprite("#" + res_name.mainscreen_bg);
        this.sprite.setScaleX(size.width/this.sprite.getContentSize().width);
        this.sprite.setScaleY(size.height/this.sprite.getContentSize().height);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        var textBoxHeight = size.height / this.TEXT_BOX_HEIGHT_SCALE_IN_SCREEN;
        var textBoxWidth = textBoxHeight * this.TEXT_BOX_WIDTH_SCALE_WITH_HEIGHT;
        var centerPosition = size.width * 0.5;
        var deltaHeight = 0.3 * textBoxHeight;

        var edtUserName = new cc.EditBox(cc.size(textBoxWidth, textBoxHeight), new cc.Scale9Sprite(res_name.texbox_login));
        edtUserName.setString("nguyenvinh1612");
        edtUserName.x = size.width/2;
        edtUserName.y = size.height / 2 + textBoxHeight * 1.3 + deltaHeight;
        this.addChild(edtUserName);

        var edtPass = new cc.EditBox(cc.size(textBoxWidth, textBoxHeight), new cc.Scale9Sprite(res_name.texbox_login));
        edtPass.setString("14101983");
        edtPass.x = size.width/2;
        edtPass.y = size.height / 2 + deltaHeight;
        this.addChild(edtPass);

        //ormalImage, selectedImage, disableImage, hover,texType,isNewTitle
        var btnScale = 1.2;
        var btnSizeW = 147*btnScale;
        var self = this;

        var btnDK = new BkButton(res_name.btn_dk,res_name.btn_dk_press,res_name.btn_dk,ccui.Widget.PLIST_TEXTURE);
        btnDK.setTitleFontSize(height*0.013);
        btnDK.setTitleColor(cc.color(0x50, 0x20, 0x00));
        btnDK.setScale(2);
        btnDK.setTitleText("Đăng ký");
        btnDK.setPosition(centerPosition + textBoxWidth / 2 - btnSizeW * 0.5
            , size.height / 2 - textBoxHeight * 2.6 + deltaHeight);
        // btnDK.addTouchEventListener(function()
        // {
        //     logMessage("btnDangKiClicked");
        // },self);
        this.addChild(btnDK);

        var btnDN = new BkButton(res_name.btn_dk,res_name.btn_dk_press,res_name.btn_dk,ccui.Widget.PLIST_TEXTURE);
        btnDN.setTitleFontSize(height*0.013);
        btnDN.setTitleColor(cc.color(0x50, 0x20, 0x00));
        btnDN.setScale(2);
        btnDN.setTitleText("Đăng Nhập");
        btnDN.setPosition(centerPosition - textBoxWidth / 2 + btnSizeW * 0.5
            , size.height / 2 - textBoxHeight * 2.6 + deltaHeight);
        btnDN.addTouchEventListener(function(sender,type)
        {
            switch (type) {
                // case ccui.Widget.TOUCH_BEGAN:
                //     logMessage("touch ");
                //     break;
                //
                // case ccui.Widget.TOUCH_MOVED:
                //     logMess("Touch Move");
                //     break;

                case ccui.Widget.TOUCH_ENDED:
                    logMessage("btnDangNhapClick");
                    break;

                // case ccui.Widget.TOUCH_CANCELED:
                //     logMessage("Touch Cancelled");
                //
                //     break;

                default:
                    break;
            }
        },self);
        this.addChild(btnDN);




        //var btnDN = new BkButton(res_name.btn_dn,res_name.btn_dn_press,res_name.btn_dn,res_name.btn_dn,ccui.Widget.PLIST_TEXTURE);
//         var btnDN = new BkButton(res_name.btn_dk,res_name.btn_dk_press,res_name.btn_dk,res_name.btn_dk,ccui.Widget.PLIST_TEXTURE);
//         btnDN.setTitleFontSize(height*0.02);
//         btnDN.setTitleColor(cc.color(0x50, 0x20, 0x00));
//         btnDN.setScale(2);
//         btnDN.setTitleText("Đăng nhập");
//         btnDN.setPosition(centerPosition - textBoxWidth / 2 + btnSizeW * 0.5
//             , size.height / 2 - textBoxHeight * 2.6 + deltaHeight);
//         btnDN.addTouchEventListener(function()
//         {
//             logMessage("btnDangNhapClicked");
//             //       btnDN.addClickEventListener(function () {
//             //        	NativeInterface.sendSTN("str1","str2");
// //        	return;
// //        	NativeInterface.onClickBuyItem(0);
// //        	return;
// //        	var myString   = "Mobifone";
// //        	var psswd = "H2G9XJMHN1";
// //        	var strEncrypt = CryptoJS.AES.encrypt(myString, psswd);
// //        	var decrypted = CryptoJS.AES.decrypt(strEncrypt,psswd);
// //        	logMessage("encrypted:" + strEncrypt);
// //        	logMessage("decrypted:" + decrypted.toString(CryptoJS.enc.Utf8));
// //        	//return  decrypted.toString(CryptoJS.enc.Utf8);
//
//
// //        	if(typeof VersionCompareResult == "undefined")
// //        	{
// //        		var VersionCompareResult = {};
// //        		VersionCompareResult.Same = 0;
// //        		VersionCompareResult.MinorUpdate = 1;
// //        		VersionCompareResult.MajorUpdate = 2;
// //        	}
//
//
// //        	var test = compareVersion("0.6.70","99.99.99","0.6.71");
// //        	logMessage("test:" + test);
// //        	return;
//             //       	var isinstaled = NativeInterface.isCheckSHP();
//             //       	logMessage("isinstaled:" + isinstaled);
//             //      	return;
// //        	Util.split(ServerSettings.ANDROID_COMMON_APP,';');
// //        	return;
//             //          cc.log("click btn DN "+edtUserName.getString()+" - "+edtPass.getString());
//             //         BkConnectionManager.doLogin(edtUserName.getString(),edtPass.getString());
//         },self);

 //      this.addChild(btnDN);
 //       return true;
    },
});

var loginScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new loginLayer();
        this.addChild(layer);
    },
	onEnterTransitionDidFinish:function()
	{
    	ServerSettings.reloadData();
	},
});

