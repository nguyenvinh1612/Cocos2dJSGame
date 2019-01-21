BkHotNewsWindow = VvTabWindow.extend({
    sph: cc.spriteFrameCache,
    listBox: null,
    selectedBox: -1,
    textMsg: null,
    _tabList: [],
    news: null,
    webView: null,
    notDisplay: null,
    ctor: function (news) {
        this.news = news;
        this.sph.addSpriteFrames(res.hot_news_plist, res.hot_news_img);
        this._tabList = [];

        var commonLogic = BkLogicManager.getLogic();
        var bonusP = Util.getAddBonusPercent(BkGlobal.addMoneyBonusType);

        for(var i = 0; i < this.news.length; i++){
            if(this.news[i].id == 3 && bonusP > 0 && bonusP <= 150){
                this.news[i].title = "Khuyến mãi";
                this.news[i].url = "bknews/khuyen_mai_" + bonusP + ".html";
            }
            if(this.news[i].id != 6 || commonLogic.hasDailyBonus)this._tabList.push(this.news[i].title);
            else if(BkGlobal.isPhoneNumberUpdatable){
                if(this.news[i].id == 6){
                    this.news[i].title = "Thưởng xu";
                    this.news[i].url = "bknews/input_phone" + ".html";
                    this._tabList.push(this.news[i].title)
                }
            }
        }

        commonLogic.hasDailyBonus = false;

        this._super("", cc.size(680, 460), this._tabList.length, this._tabList);
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(true);
        this.setVisibleTop(false);
        // this.setVisibleBottom(false);
        this._bgBody.setVisible(false);
        this.setVisibleBgBody(false);
        this._btnClose.removeFromParent();
        this.configPosButton();
        this.DrawUI();
        this.addTabChangeEventListener(this.selectedTabEvent, this);
    },

    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function (tabIndex) {
        this.cleanGUI();
        var currentNews = this.news[tabIndex - 1];

        this.webView = new ccui.WebView(currentNews.url);
        this.webView.setContentSize(510, 240);
        this.webView.setPosition(385, 255);
        this.webView.setScalesPageToFit(true);
        this.addChildBody(this.webView);
    },

    cleanGUI: function(){
        if (this.webView != null) {
            this.webView.removeFromParent();
            this.webView = null;
        }
    },

    DrawUI: function () {

        var bg = new BkSprite(this.sph.getSpriteFrame(res_name.hotnews_bg));
        bg.x = this.getBodySize().width / 2 + 28;
        bg.y = this.getBodySize().height / 2 - 10;
        this.addChildBody(bg);

        var checkBoxClickArea = new BkSprite(res.Tranperent_IMG);
        this.addChildBody(checkBoxClickArea);

        var lblNotReceive = new BkLabelTTF("Không hiển thị", "", 16);
        lblNotReceive.x = lblNotReceive.width/4 + 20;
        lblNotReceive.y = lblNotReceive.height/4;
        checkBoxClickArea.addChild(lblNotReceive);

        this.notDisplay = new BkCheckBox();
        this.notDisplay.loadTextures(res_name.hotnews_checkbox_normal,
            res_name.hotnews_checkbox_normal,
            res_name.hotnews_checkbox_pressed,
            res_name.hotnews_checkbox_normal,
            res_name.hotnews_checkbox_normal, ccui.Widget.PLIST_TEXTURE);
        this.notDisplay.x = lblNotReceive.x - lblNotReceive.width / 4 - this.notDisplay.width / 2 - 35;
        this.notDisplay.y = lblNotReceive.y;
        checkBoxClickArea.addChild(this.notDisplay);
        var self = this;

        checkBoxClickArea.setContentSize(cc.size(this.notDisplay.width + lblNotReceive.width/2,this.notDisplay.height));
        checkBoxClickArea.x = this.getBodySize().width/2 - 123;
        checkBoxClickArea.y = 90;
        checkBoxClickArea.setMouseOnHover();
        checkBoxClickArea.setOnlickListenner(function () {
            self.notDisplay.setSelected(!self.notDisplay.isSelected());
        });

        var btnClose = createBkButtonPlist(res_name.hotnews_btn_close_normal,res_name.hotnews_btn_close_normal,res_name.hotnews_btn_close_normal,res_name.hotnews_btn_close_hover, "");
        if(cc.sys.browserType == cc.sys.BROWSER_TYPE_FIREFOX){
            btnClose._eventHover.setEnabled(false);
            btnClose.setMouseOnHover();
        }
        this.addChildBody(btnClose);
        btnClose.x = 170.5 + checkBoxClickArea.x;
        btnClose.y = checkBoxClickArea.y - 13;
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                var isDisplayHotNews = !self.notDisplay.isSelected();
                self.closeHotNews(isDisplayHotNews);
            }
        }, this);
    },

    configPosButton: function (btnMarginTop) {

        var btnDefault = this._arrBtnTab[0];
        btnDefault.y = 335;
        btnDefault.x = 76;
        // set disable hover on Firefox
        if(cc.sys.browserType == cc.sys.BROWSER_TYPE_FIREFOX){
            btnDefault._eventHover.setEnabled(false);
            btnDefault.setMouseOnHover();
        }
        for (var i = 1; i < this._arrBtnTab.length; i++) {
            var currentBtn = this._arrBtnTab[i];
            var prevBtn = this._arrBtnTab[i - 1];
            currentBtn.y = prevBtn.y - prevBtn.height/2 - TAB_WD_BUTTON_MARGIN - currentBtn.height/2;
            currentBtn.x = btnDefault.x;
            if(cc.sys.browserType == cc.sys.BROWSER_TYPE_FIREFOX){
                currentBtn._eventHover.setEnabled(false);
                currentBtn.setMouseOnHover();
            }
        }
    },

    configPosYButton: function (startButtonX) {
    },

    setSelectedForButton: function (btn, isEnable) {
        if (!btn) {
            return;
        }

        btn.setIsSelected(isEnable);

        if (!isEnable){
            btn.setTitleColor(cc.color("#a7be25"));
        }

        if (isEnable) {
            btn.loadTextures(res_name.hotnews_tab_inactive, res_name.hotnews_tab_inactive, res_name.hotnews_tab_inactive
                , res_name.hotnews_tab_inactive, ccui.Widget.PLIST_TEXTURE);
        } else {
            btn.loadTextures(res_name.hotnews_tab_active, res_name.hotnews_tab_inactive, res_name.hotnews_tab_inactive
                , res_name.hotnews_tab_active, ccui.Widget.PLIST_TEXTURE);
        }
    },

    closeHotNews: function(isDisplayHotNews) {
        if (!isDisplayHotNews) {
            var today = new Date().getDay();
            Util.setClientSetting(key.displayHotNews + today, 0);
        }

        this.removeSelf();
    }
});