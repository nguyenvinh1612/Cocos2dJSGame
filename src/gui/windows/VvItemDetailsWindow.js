/**
 * Created by VanChinh on 10/22/2015.
 */
SHOP_ITEM_PADDING_LEFT = 5;

VvItemDetailsWindow = VvWindow.extend({
    itemInfo: null,
    rootNode: null,
    isNotInShop: false,
    userName: null,

    ctor: function (itemId, root, isNotInShop, userName, item) {
        this._super("Chi tiết", cc.size(430, 240));
        this.setVisibleOutBackgroundWindow(true);
        this.setVisibleBgBody(false);
        this.setMoveableWindow(true);
        this.rootNode = root;
        this.itemInfo = new BkItemInfo();
        if(item) this.itemInfo = item;
        else this.itemInfo.itemId = itemId;
        this.isNotInShop = isNotInShop;
        this.userName = userName;
        this.initData();
        this._windowTitle.setFontSize(18);
    },

    initData: function () {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        Util.showAnim();
        bkCommonLogic.processGetItemInfo(this.itemInfo.itemId);
    },

    onLoadComplete: function (obj, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag){
            case c.NETWORK_GET_ITEM_INFO:
                if(!this.itemInfo.displayName) {
                    var itemList = new BkShoppingItemsData();
                    this.itemInfo = itemList.getItem(this.itemInfo.itemId);
                }
                if(obj){
                    this.itemInfo.dayToLive = obj.DayToLive;
                    this.itemInfo.price = obj.Price;
                }
                if(!this.isNotInShop) this.initUIInShop();
                else this.initUIInProfile(this.userName);
                break;
            case c.NETWORK_BUY_ITEM_SUCCESS:
                Util.removeAnim();
                this.processBuyItemSuccess(obj);
                break;
            case c.NETWORK_BUY_ITEM_FAILURE:
                Util.removeAnim();
                this.processBuyItemFail(obj);
                break;
        }
        Util.removeAnim();
    },

    initUIInShop: function (){

        var bodyHeight = this.getBodySize().height;

        var bgImage = new BkSprite("#" + res_name.vv_avatar_detail_bg);
        this.addChildBody(bgImage);

        var itemImage = VvAvatarImg.getShopImageFromID(this.itemInfo.itemId, false);
        itemImage.x = itemImage.width / 2 + WD_BODY_MARGIN_LR;
        itemImage.y = bodyHeight/2 + 20;
        this.addChildBody(itemImage);

        bgImage.x = bgImage.width/2 + itemImage.width/2 + WD_BODY_MARGIN_LR;
        bgImage.y = itemImage.y;

        var lblDisplayName = new BkLabel(this.itemInfo.getDisplayName(), "", 16,true);
        lblDisplayName.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblDisplayName.x = itemImage.x + itemImage.width / 2 + lblDisplayName.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
        lblDisplayName.y = bodyHeight - lblDisplayName.getContentSize().height / 2 - 25;
        this.addChildBody(lblDisplayName);

        var lblPrice = new BkLabel("Giá: " + convertStringToMoneyFormat(this.itemInfo.getPrice())
            +" "+BkConstString.STR_GAME_COIN, "", 14);
        lblPrice.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblPrice.x = itemImage.x + itemImage.width / 2 + lblPrice.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
        lblPrice.y = lblDisplayName.y - lblDisplayName.getContentSize().height / 2 - lblPrice.getContentSize().height / 2 - 3;
        this.addChildBody(lblPrice);

        var lblDuration = new BkLabel("Hiệu lực: " + this.itemInfo.getDayToLive() + " ngày", "", 14);
        lblDuration.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblDuration.x = itemImage.x + itemImage.width / 2 + lblDuration.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
        lblDuration.y = lblPrice.y - lblPrice.getContentSize().height / 2 - lblDuration.getContentSize().height / 2 - 4;
        this.addChildBody(lblDuration);

        var strDescription = this.itemInfo.getDescription();
        if(strDescription.trim().length > 0){
            var lblDescription = new BkLabelTTF(strDescription, res_name.GAME_FONT, 13, cc.size (560, 80), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
            lblDescription.setFontFillColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
            lblDescription.opacity = 150;

            lblDescription.x = itemImage.x + itemImage.width / 2 + lblDescription.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
            lblDescription.y = lblDuration.y - lblDuration.getContentSize().height / 2 - lblDescription.getContentSize().height / 2 - 4;
            this.addChildBody(lblDescription);
        }

        if(!BkGlobal.UserInfo.hasBought(this.itemInfo.itemId, this.itemInfo.itemType)){
            var btnBuy = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
            btnBuy.setTitleText("Mua");
            btnBuy.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnBuy.width = 100;
            btnBuy.x = this.getBodySize().width - btnBuy.width / 2 - 10;
            btnBuy.y = btnBuy.height / 2 + 16;
            this.addChildBody(btnBuy);

            var self = this;

            btnBuy.x = this._windowTitle.x;

            btnBuy.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        // Send buy item packet
                        var bkCommonLogic = BkLogicManager.getLogic();
                        bkCommonLogic.setOnLoadComplete(self);
                        bkCommonLogic.processBuyItem(self.itemInfo.itemId);
                        Util.showAnim();
                    }
                }
            , this);
        }
    },

    initUIInProfile: function (userName) {
        var bodyHeight = this.getBodySize().height;

        var bgImage = new BkSprite("#" + res_name.vv_avatar_detail_bg);
        this.addChildBody(bgImage);

        var itemImage = VvAvatarImg.getShopImageFromID(this.itemInfo.itemId, false);
        itemImage.x = itemImage.width / 2 + WD_BODY_MARGIN_LR;
        itemImage.y = bodyHeight/2 + 20;
        this.addChildBody(itemImage);

        bgImage.x = bgImage.width/2 + itemImage.width/2 + WD_BODY_MARGIN_LR;
        bgImage.y = itemImage.y;

        var lblDisplayName = new BkLabel(this.itemInfo.getDisplayName(), "", 16);
        lblDisplayName.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        lblDisplayName.x = itemImage.x + itemImage.width / 2 + lblDisplayName.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
        lblDisplayName.y = bodyHeight - lblDisplayName.getContentSize().height / 2 - 25;
        this.addChildBody(lblDisplayName);

        if(BkGlobal.UserInfo.userName == userName){
            var secTime = this.itemInfo.RemainingDate / 1000;
            var nDay = Math.floor(secTime / (24 * 3600));
            var nHour = Math.floor((secTime - nDay * 24 * 3600) / 3600);
            var nMin = Math.floor((secTime - nDay * 24 * 3600 - nHour * 3600) / 60);
            var strDuration = "";
            if(this.itemInfo.isFree && this.itemInfo.itemId != 0 && this.itemInfo.itemId != 1)
            {
                strDuration = "Hiệu lực: " + BkConstString.STR_HINHANH_VOTHOIHAN;
            }
            else
            {
                strDuration = "Hiệu Lực: " + nDay + " ngày " + nHour + " giờ " + nMin + " Phút ";
            }

            var lblDuration = new BkLabel(strDuration, "", 14);
            lblDuration.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
            lblDuration.x = itemImage.x + itemImage.width / 2 + lblDuration.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
            lblDuration.y = lblDisplayName.y - lblDisplayName.getContentSize().height / 2 - lblDuration.getContentSize().height / 2 - 10;
            this.addChildBody(lblDuration);

            var strDescription = this.itemInfo.getDescription();
            if(strDescription.trim().length > 0){
                var lblDescription = new BkLabel(strDescription, "", 13);
                lblDescription.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
                lblDescription.opacity = 150;
                lblDescription.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                lblDescription.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
                lblDescription.x = itemImage.x + itemImage.width / 2 + lblDescription.getContentSize().width / 2 + SHOP_ITEM_PADDING_LEFT;
                lblDescription.y = lblDuration.y - lblDuration.getContentSize().height/2 - lblDescription.getContentSize().height/2 - 10;
                this.addChildBody(lblDescription);
            }
            if(this.itemInfo.itemType == AT.TYPE_AVATAR && this.itemInfo.itemId != BkGlobal.UserInfo.avatarID){
                var btnSelect = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
                btnSelect.setTitleText("Chọn");
                btnSelect.setTitleColor(BkColor.TEXT_INPUT_COLOR);
                btnSelect.x = this.getBodySize().width - btnSelect.width / 2 - 20;
                btnSelect.y = btnSelect.height / 2 + 16;
                this.addChildBody(btnSelect);

                var self = this;

                btnSelect.x = this._windowTitle.x;

                btnSelect.addTouchEventListener(
                    function (sender, type) {
                        if (type == ccui.Widget.TOUCH_ENDED) {
                            var bkCommonLogic = BkLogicManager.getLogic();
                            bkCommonLogic.setOnLoadComplete(self.rootNode);
                            bkCommonLogic.processSelectAvatarPacket(self.itemInfo.itemId);

                            self.rootNode.selectedAvatarId = self.itemInfo.itemId;

                            // close item details window
                            self.removeSelf();
                        }
                    }
                , this);
            }
        }
    },

    processBuyItemSuccess: function (itemCost) {
        if(this.rootNode){
            // update bought item to "checked"
            var boughtItem = this.rootNode._tabBodyLayout.getChildByTag(this.itemInfo.itemId);
            if(boughtItem) {
                // update bought item to "checked"
                boughtItem.icoCheck.setVisible(true);
            }
        }

        var winSize = cc.director.getWinSize();
        showToastMessage("Bạn đã mua thành công vật phẩm này.", winSize.width / 2, winSize.height / 2);

        // update listItem
        var itemDetail = new BkItemDetail();
        itemDetail.itemType = this.itemInfo.itemType;
        itemDetail.itemID = this.itemInfo.itemId;
        itemDetail.RemainingDate = this.itemInfo.dayToLive * 24 * 3600;

        switch (itemDetail.itemType){
            case AT.TYPE_AVATAR:
                if((BkGlobal.UserInfo.listAvatar == undefined) || (BkGlobal.UserInfo.listAvatar == null)){
                    BkGlobal.UserInfo.listAvatar = [];
                }
                BkGlobal.UserInfo.listAvatar.push(itemDetail);
                BkGlobal.UserInfo.avatarID = itemDetail.itemID;
                BkLogicManager.getLogic().processUpdateProfileUI();
                break;
            case AT.TYPE_VATPHAM:
                if((BkGlobal.UserInfo.listVatPham == null) || (BkGlobal.UserInfo.listVatPham == undefined)) {
                    BkGlobal.UserInfo.listVatPham = [];
                }
                BkGlobal.UserInfo.listVatPham.push(itemDetail);
                break;
            case AT.TYPE_BAOBOI:
                if((BkGlobal.UserInfo.listBaoBoi == null) || (BkGlobal.UserInfo.listBaoBoi == undefined)) {
                    BkGlobal.UserInfo.listBaoBoi = [];
                }
                BkGlobal.UserInfo.listBaoBoi.push(itemDetail);
                break;
        }

        // update user money
        BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() - itemCost);

        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.processUpdateProfileUI();

        // update user level
        if(this.itemInfo.itemId == 30 || this.itemInfo.itemId == 31 || this.itemInfo.itemId == 32)
        {
            var icLV = 2;
            if (this.itemInfo.itemId == 31){ icLV = 5;}
            if (this.itemInfo.itemId == 32){ icLV = 10;}
            BkGlobal.UserInfo.setLevel(BkGlobal.UserInfo.getLevel() + icLV);
        }

        if (this.itemInfo.itemId == 26){
            BkGlobal.UserInfo.setHasAllowKickWand(1);
        }

        if (this.itemInfo.itemId == 33){
            BkGlobal.UserInfo.setHasX2BetMoney(1);
        }

        if (this.itemInfo.itemId == 34){
            BkGlobal.UserInfo.setHasX5BetMoney(1);
        }

        if (this.itemInfo.itemId == 35){
            BkGlobal.UserInfo.setHasX10BetMoney(1);
        }

        if(this.rootNode){
            var shoppingWindow = this.rootNode;
            shoppingWindow.configBaseTabUI(shoppingWindow._currentTab);
        }

        // close item details window
        this.removeSelf();
    },

    processBuyItemFail: function (reason) {
        var strMessage = "";
        if(reason == 1) {
            strMessage = "Bạn không đủ quan để mua vật phẩm này, hãy nạp thêm quan để mua.";
        }
        else if(reason == 0) {
            strMessage = "Bạn đã sở hữu vật phẩm này rồi.";
        }

        var winSize = cc.director.getWinSize();
        showToastMessage(strMessage, winSize.width / 2, winSize.height / 2);
        this.removeSelf();
    },
    onExit: function () {
        if(!this.rootNode)cc.spriteFrameCache.removeSpriteFramesFromFile(res.vv_shopping_items_plist);
        this._super();
    }
});