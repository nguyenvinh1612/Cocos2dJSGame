/**
 * Created by vinhnq on 30/02/2018.
 */
VvTabWindow = VvWindow.extend({
    _currentTab: null,
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
    ctor: function (titleBar, size, numberTab, arrBtnText) 
    {
    	this._super(titleBar, size,null,true);
        //addSpriteFrames(res.vv_sprite_sheet_plist,res.vv_sprite_sheet_img);
        this._numberTab = numberTab;
        this._currentTab = 1;
        this._arrBtnText = arrBtnText;

        this.iniTab();
    },

    setSelectedForButton: function (btn, isEnable) {
        if(!btn){
            return;
        }
        btn.setIsSelected(isEnable);
        if(isEnable){
            btn.loadTextures(res_name.vv_btn_selected,res_name.vv_btn_selected,res_name.vv_btn_selected
                ,res_name.vv_btn_selected,ccui.Widget.PLIST_TEXTURE);
        }else{
            btn.loadTextures(res_name.vv_btn_deselected,res_name.vv_btn_deselected,res_name.vv_btn_deselected
                ,res_name.vv_btn_deselected_hover,ccui.Widget.PLIST_TEXTURE);
            //btn.setTitleColor(cc.color(149,174,255));
            btn.setTitleColor(cc.color(194, 181, 155));
        }
    },

    iniTab: function ()
    {
        var tabColor = cc.color(18, 37, 98);
        var tabWidth = this.getBodySize().width - 2* TAB_WD_BODY_MARGIN_LR;
        var tabHeight = this.getBodySize().height - TAB_WD_BODY_MARGIN_TB + 2;

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

        this.configPosXButton();

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
        btn.setTitleFontSize(cc.director.getWinSize().height*0.025);
        btn.x = 0;
        btn.y = this._bodyContentBg.y + this._bodyContentBg.height / 2 + TAB_WD_BUTTON_HEIGHT / 2 - 3;
        btn.getTitleRenderer().enableShadow(cc.color(13,59,85), cc.p(2, -2));
        this.addChildBody(btn, WD_ZORDER_TOP);
        var selfPointer = this;
        btn.setHoverCallback(function(){
            if (tabIndex == selfPointer._currentTab){
                //cc._canvas.style.cursor = "default";
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
    	logMessage("configBaseTabUI");
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
    configPosXButton: function (startButtonX) {
        startButtonX = typeof startButtonX !== 'undefined' ? startButtonX : VV_TAB_WD_BUTTON_MARGIN_LEFT;

        var btnDefault = this._arrBtnTab[0];
        btnDefault.x = startButtonX;
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
    selectedTab:function(tabIndex)
    {
    	//error here
        if(this._tabEventSelector)
        {
        	//logMessage("this._tabEventListener:" + this._tabEventListener);
            if (this._tabEventListener)
            	{
            		logMessage("this._tabEventListener is not null");
                	this._tabEventSelector.call(this._tabEventListener, this, tabIndex);
            	}
            else
            	{
                	this._tabEventSelector(this, tabIndex);
            	}
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
        return cc.p(this._bodyContentBg.x, this._bodyContentBg.y);
    },

    getBodyTab:function(){
        return this._bodyContentBg;
    },

    visibleBodyContent: function (isVisible) {
        this._bodyContentBg.visible = isVisible;
    },

    createTabBtn:function(){
        return new BkButton(res_name.vv_btn_deselected,res_name.vv_btn_deselected,res_name.vv_btn_deselected
        ,res_name.vv_btn_deselected_hover,ccui.Widget.PLIST_TEXTURE);
    }

});