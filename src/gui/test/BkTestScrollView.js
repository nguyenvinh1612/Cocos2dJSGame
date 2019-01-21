/**
 * Created by bs on 22/06/2016.
 */
BkTestScrollView = BkWindow.extend({
    mcv:null,
    ctor: function () {
        this._super("test scroll", cc.size(560, 400));
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.initUI();
    },
    initUI:function(){
        this.setDefaultWdBodyBg();
        var scrollView = this.mcv = new ccui.ScrollView();
        scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        scrollView.setTouchEnabled(true);
        scrollView.setContentSize(cc.size(280, 150));
        scrollView.x = 200;//(this._windowSize.width - this._wdBodyInnerSize.width) / 2 + (this._wdBodyInnerSize.width - scrollView.width) / 2;
        scrollView.y = 200;//(this._windowSize.height - this._wdBodyInnerSize.height) / 2 + (this._wdBodyInnerSize.height - scrollView.height) / 2;
        this.addChild(scrollView);

        var imageView = new ccui.ImageView();
        imageView.loadTexture(res.chat_nho);

        var innerWidth = scrollView.width;
        var innerHeight = scrollView.height + 10* imageView.height;

        scrollView.setInnerContainerSize(cc.size(innerWidth, innerHeight));

        var button = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press
            , res_name.btnXethet,res_name.btnXethet_hover,"Xếp Xong1");
        button.addClickEventListener(function(){
            logMessage("click 1")
        });
        button.x = innerWidth / 2;
        button.y = scrollView.getInnerContainerSize().height - button.height / 2;
        scrollView.addChild(button);

        var textButton = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press
            , res_name.btnXethet,res_name.btnXethet_hover,"Xếp Xong2");
        textButton.x = innerWidth / 2;
        textButton.y = button.getBottomBoundary() - button.height;
        scrollView.addChild(textButton);

        var button_scale9 = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press
            , res_name.btnXethet,res_name.btnXethet_hover,"Xếp Xong3");
        button_scale9.width = 100;
        button_scale9.height = 32;
        button_scale9.x = innerWidth / 2;
        button_scale9.y = textButton.getBottomBoundary() - textButton.height;
        scrollView.addChild(button_scale9);

        imageView.x = innerWidth / 2;
        imageView.y = imageView.height / 2;
        scrollView.addChild(imageView);
    }
});