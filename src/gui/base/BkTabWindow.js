/**
 * Created by hoangthao on 02/10/2015.
 */
TAB_WD_BUTTON_MARGIN_TOP = -29;
TAB_WD_BUTTON_MARGIN_LEFT = 84;
TAB_WD_BUTTON_MARGIN = 3;
TAB_WD_BODY_MARGIN_LR = 22;
TAB_WD_BODY_MARGIN_TB = 22;

BkTabWindow = BkWindow.extend({
    _currentTab: null,
    _bodyContent: null,
    _numberTab: null,
    _arrBtnTab: null,
    _arrBtnText: null,
    _btnTab1: null,
    _btnTab2: null,
    _btnTab3: null,
    _btnTab4: null,
    _btnTab5: null,
    _tabEventListener: null,
    _tabEventSelector:null,

    ctor: function (titleBar, size, numberTab, arrBtnText) {
        this._super(titleBar, size,null,true);

        this._numberTab = numberTab;
        this._currentTab = 1;
        this._arrBtnText = arrBtnText;

        this.iniTab();

        this._windowTitle.setVisible(false);
    },

    setSelectedForButton: function (btn, isEnable) {
        if(!btn){
            return;
        }
        btn.setIsSelected(isEnable);
        if(isEnable){
            btn.loadTextures(res_name.btnTab_selected,res_name.btnTab_selected,res_name.btnTab_selected
                ,res_name.btnTab_selected,ccui.Widget.PLIST_TEXTURE);
        }else{
            btn.loadTextures(res_name.btnTab_deselected,res_name.btnTab_deselected,res_name.btnTab_deselected
                ,res_name.btnTab_deselected_hover,ccui.Widget.PLIST_TEXTURE);
            //btn.setTitleColor(cc.color(149,174,255));
            btn.setTitleColor(cc.color(47, 134, 248));
        }
    },

    iniTab: function ()
    {
        var tabColor = cc.color(18, 37, 98);
        var tabWidth = this.getBodySize().width - 2* TAB_WD_BODY_MARGIN_LR;
        var tabHeight = this.getBodySize().height - TAB_WD_BODY_MARGIN_TB + 2;
        this._bodyContent = new cc.DrawNode();
        //this._bodyContent.drawRect(cc.p(0, 0), cc.p(tabWidth, tabHeight), BkColor.BG_BODY_COLOR, 1, BkColor.BG_BODY_BORDER_COLOR);
        this._bodyContent.drawRect(cc.p(0, 0), cc.p(tabWidth, tabHeight), tabColor, 1,tabColor);
        this._bodyContent.width = tabWidth;
        this._bodyContent.height = tabHeight;
        this._bodyContent.x = TAB_WD_BODY_MARGIN_LR;//this.getBodySize().width/2;
        this.addChildBody(this._bodyContent);
        this._arrBtnTab = [];
        switch (this._numberTab) {
            case 1:
            {
                this._btnTab1 = this.createTabBtn();
                this.initForBtn(this._btnTab1, 1);
                this._arrBtnTab.push(this._btnTab1);
                break;
            }
            case 2:
            {
                this._btnTab1 = this.createTabBtn();
                this.initForBtn(this._btnTab1, 1);
                this._arrBtnTab.push(this._btnTab1);

                this._btnTab2 = this.createTabBtn();
                this.initForBtn(this._btnTab2, 2);
                this._arrBtnTab.push(this._btnTab2);
                break;
            }
            case 3:
            {
                this._btnTab1 = this.createTabBtn();
                this.initForBtn(this._btnTab1, 1);
                this._arrBtnTab.push(this._btnTab1);

                this._btnTab2 = this.createTabBtn();
                this.initForBtn(this._btnTab2, 2);
                this._arrBtnTab.push(this._btnTab2);

                this._btnTab3 = this.createTabBtn();
                this.initForBtn(this._btnTab3, 3);
                this._arrBtnTab.push(this._btnTab3);
                break;
            }
            case 4:
            {
                this._btnTab1 = this.createTabBtn();
                this.initForBtn(this._btnTab1, 1);
                this._arrBtnTab.push(this._btnTab1);

                this._btnTab2 = this.createTabBtn();
                this.initForBtn(this._btnTab2, 2);
                this._arrBtnTab.push(this._btnTab2);

                this._btnTab3 = this.createTabBtn();
                this.initForBtn(this._btnTab3, 3);
                this._arrBtnTab.push(this._btnTab3);

                this._btnTab4 = this.createTabBtn();
                this.initForBtn(this._btnTab4, 4);
                this._arrBtnTab.push(this._btnTab4);
                break;
            }
            case 5:
            {
                this._btnTab1 = this.createTabBtn();
                this.initForBtn(this._btnTab1, 1);
                this._arrBtnTab.push(this._btnTab1);

                this._btnTab2 = this.createTabBtn();
                this.initForBtn(this._btnTab2, 2);
                this._arrBtnTab.push(this._btnTab2);

                this._btnTab3 = this.createTabBtn();
                this.initForBtn(this._btnTab3, 3);
                this._arrBtnTab.push(this._btnTab3);

                this._btnTab4 = this.createTabBtn();
                this.initForBtn(this._btnTab4, 4);
                this._arrBtnTab.push(this._btnTab4);

                this._btnTab5 = this.createTabBtn();
                this.initForBtn(this._btnTab5, 5);
                this._arrBtnTab.push(this._btnTab5);
                break;
            }
            default :
            {
                break;
            }
        }

        this.configPosButton();


        //var bgRect = this._bodyContent.getTextureRect();
        //this._bodyContent.scaleX = tabWidth / bgRect.width;
        //this._bodyContent.scaleY = tabHeight / bgRect.height;
        //this._bodyContent.width = tabWidth;
        //this._bodyContent.height = tabHeight;
        //this._bodyContent.x = TAB_WD_BODY_MARGIN_LR;//this.getBodySize().width/2;
        //this._bodyContent.y = 1.5 * TAB_WD_BODY_MARGIN_TB;//this.getBodySize().height/2;

        if(this._arrBtnText != undefined){
            for (var i =0;i<this._arrBtnText.length;i++){
                var iBtn= this._arrBtnTab[i];
                var iText = this._arrBtnText[i];
                iBtn.setTitleText(iText);
                if (i == 0){
                    this.setSelectedForButton(iBtn, true);
                } else {
                    this.setSelectedForButton(iBtn, false);
                }
            }
        }else{
            logMessage("Error: Must addTabChangeEventListener to callback handle");
        }


    },
    initForBtn: function (btn, tabIndex) {
        this.setSelectedForButton(btn, true);
        //btn.setZoomScale(0.02);
        btn.setTitleFontSize(16);
        btn.x = 0;
        btn.y = this._top.y - btn.height - TAB_WD_BUTTON_MARGIN_TOP;
        btn.getTitleRenderer().enableShadow(cc.color(13,59,85), cc.p(2, -2));
        this.addChildBody(btn, WD_ZORDER_TOP);
        var selfPointer = this;
        btn.setHoverCallback(function(){
            if (tabIndex == selfPointer._currentTab){
                cc._canvas.style.cursor = "default";
            }
        },null);
        btn.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    if (tabIndex == selfPointer._currentTab){
                        return;
                    }
                    selfPointer.configBaseTabUI(tabIndex);
                }
            });
    },
    configBaseTabUI: function (tabIndex) {
        cc.log("configBaseTabUI "+tabIndex);
        this._currentTab = tabIndex;
        this.configButtonWithSelectedTab(tabIndex);
        //On tab change
        this.selectedTab(tabIndex);
    },
    configButtonWithSelectedTab: function (tabIndex) {
        this.setSelectedForButton(this._btnTab1, false);
        this.setSelectedForButton(this._btnTab2, false);
        this.setSelectedForButton(this._btnTab3, false);
        this.setSelectedForButton(this._btnTab4, false);
        this.setSelectedForButton(this._btnTab5, false);

        if (tabIndex == 1) {
            this.setSelectedForButton(this._btnTab1, true);
        } else if (tabIndex == 2) {
            this.setSelectedForButton(this._btnTab2, true);
        } else if (tabIndex == 3) {
            this.setSelectedForButton(this._btnTab3, true);
        } else if (tabIndex == 4) {
            this.setSelectedForButton(this._btnTab4, true);
        } else if (tabIndex == 5) {
            this.setSelectedForButton(this._btnTab5, true);
        }
    },
    configPosButton: function (startButtonX) {
        startButtonX = typeof startButtonX !== 'undefined' ? startButtonX : TAB_WD_BUTTON_MARGIN_LEFT;

        var btnDefault = this._arrBtnTab[0];
        btnDefault.x = startButtonX + 0.5;
        for (var i = 1; i < this._arrBtnTab.length; i++) {
            var currentBtn = this._arrBtnTab[i];
            var prevBtn = this._arrBtnTab[i - 1];
            currentBtn.x = prevBtn.x + prevBtn.width + TAB_WD_BUTTON_MARGIN;
        }
    },
    configPosYButton: function (btnMarginTop) {
        btnMarginTop = typeof btnMarginTop !== 'undefined' ? btnMarginTop : TAB_WD_BUTTON_MARGIN_TOP;

        for (var i = 0; i < this._arrBtnTab.length; i++) {
            var currentBtn = this._arrBtnTab[i];
            currentBtn.y = this._top.height + btnMarginTop;
        }
    },
    selectedTab:function(tabIndex){
        if(this._tabEventSelector){
            if (this._tabEventListener)
                this._tabEventSelector.call(this._tabEventListener, this, tabIndex);
            else
                this._tabEventSelector(this, tabIndex);
        }
    },
    addTabChangeEventListener: function(selector, target, tabIndex){
        if(tabIndex ==undefined){
            tabIndex = this._currentTab;
        }
        this._tabEventSelector = selector;
        this._tabEventListener = target;
        this.configBaseTabUI(tabIndex);
    },

    getCurrentTab: function () {
        return this._currentTab;
    },
    setCurrentTab: function (tab) {
        this._currentTab = tab;
    },
    getCoordinateStart: function () {
        return cc.p(this._bodyContent.x, this._bodyContent.y);
    },

    getBodyTab:function(){
        return this._bodyContent;
    },

    visibleBodyContent: function (isVisible) {
        this._bodyContent.visible = isVisible;
    },

    createTabBtn:function(){
    return new BkButton(res_name.btnTab_deselected,res_name.btnTab_deselected,res_name.btnTab_deselected
        ,res_name.btnTab_deselected_hover,ccui.Widget.PLIST_TEXTURE);
    }

});