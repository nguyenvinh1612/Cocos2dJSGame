/**
 * Created by VanChinh on 10/20/2015.
 */

ITEM_WIDTH = 90;
ITEM_HEIGHT = 95;
SHOPPING_WINDOW_NUMBER_OF_COLUMNES = 4;
VV_SHOPPING_WINDOW_SPACE_ROW = 20;
VvShoppingWindow = VvTabWindow.extend({
    sph:cc.spriteFrameCache,
    shopItemsData: null,
    lblItemShortDescription: null,
    bmItemHoverbg: null,
    bmItemHoverArrow: null,
    itemShortDescriptionSprite: null,
    _tabBodyLayout: null,
    _tabList: ["Hình ảnh", "Vật phẩm", "Bảo bối"],
    listUIItem:null,
    ctor: function () {
        this._super("Cửa hàng", cc.size(650, 515), this._tabList.length, this._tabList);
        this.sph.addSpriteFrames(res.vv_shopping_items_plist, res.vv_shopping_items_img);
        this.initInputData();
        this.initUI();
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"ShoppingScene");
    },
    onLoadComplete: function (obj, tag) {
        logMessage("onLoadComplete "+tag);
        switch (tag) {
            case c.NETWORK_PLAYER_ITEMS_RETURN:
                BkLogicManager.getLogic().setOnLoadComplete(null);
                this.updateCheckStatus();
                break;
        }
    },
    updateCheckStatus:function(){
        logMessage("updateCheckStatus");
        if (this.listUIItem != null){
            logMessage("update");
            for (var i=0;i<this.listUIItem.length;i++){
                this.listUIItem[i].updateCheckStatusForShop();
            }
        }
    },
    initInputData: function(){
        if(this.shopItemsData == null){
            this.shopItemsData = new VvShoppingItemsData();
        }
    },
    initUI: function () {
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
    },

    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function(tabIndex) {
        this.cleanGUI();

        this._tabBodyLayout = new cc.Layer();
        this._tabBodyLayout.setContentSize(this.getBodySize().width, this.getBodySize().height);
        this.addChildBody(this._tabBodyLayout,3);

        var itemType = -1;
        switch (tabIndex){
            case 1:
                itemType = AT.TYPE_AVATAR;
                break;
            case 2:
                itemType = AT.TYPE_VATPHAM;
                break;
            case 3:
                itemType = AT.TYPE_BAOBOI;
                break;
            default :
                break;
        }

        this.drawItemList(itemType);

    },
    drawItemList: function (itemType){
        if(itemType == -1 || this.shopItemsData == null) return;

        var listItems = this.shopItemsData.listItems.filter(
            function (item) {
                return (item.itemType == itemType);
            }
        );
        this.listUIItem = [];
        var itemCount = 0;
        var xPos = 0;
        var yPos = 321;
        var itemWidth = 86;
        var bodyContentWidth = this.getBodySize().width;
        var SPACE_COLUMN = (bodyContentWidth - 0 - SHOPPING_WINDOW_NUMBER_OF_COLUMNES * itemWidth) / (SHOPPING_WINDOW_NUMBER_OF_COLUMNES + 1);
        for ( var i = 0, len = listItems.length; i < len; i++ )
        {
            var item = listItems[i];
            if(!item.isSpecialItem && item.price > 0)
            {
                var itemSprite = new VvShoppingItem(item, this, false, BkGlobal.UserInfo.userName);
                itemSprite.scale = 0.8;

                if(itemCount == 0 )
                {
                    xPos = 2 + itemWidth / 2 + SPACE_COLUMN;
                }
                else if(itemCount% SHOPPING_WINDOW_NUMBER_OF_COLUMNES == 0)
                {
                    // new row, increase Y , reset X
                    yPos = yPos - 97 - VV_SHOPPING_WINDOW_SPACE_ROW;
                    xPos = 2 + itemWidth / 2 + SPACE_COLUMN;
                }
                else
                {
                    xPos = xPos + itemWidth + SPACE_COLUMN;
                }

                var avaPos = cc.p(0,0);
                if(itemType == AT.TYPE_AVATAR){
                    avaPos = cc.p(5, 5);
                } else if(itemType == AT.TYPE_BAOBOI){
                    avaPos = cc.p(10,20);
                }
                itemSprite.x = xPos + avaPos.x;
                itemSprite.y = yPos + avaPos.y;
                this._tabBodyLayout.addChild(itemSprite, i, item.itemId);
                itemCount++;
                this.listUIItem.push(itemSprite);
            }
        }

        if (BkGlobal.UserInfo.listAvatar == null){
            logMessage("get full my info -> setOnload");
            BkLogicManager.getLogic().setOnLoadComplete(this);
            BkLogicManager.getLogic().DoGetProfilePlayer(BkGlobal.UserInfo.getUserName());
        }
    },

    cleanGUI: function () {
        if (this._tabBodyLayout != null) {
            this._tabBodyLayout.removeFromParent();
        }
    },
    onExit: function () {
        this.sph.removeSpriteFramesFromFile(res.vv_shopping_items_plist);
        this._super();
    }
});