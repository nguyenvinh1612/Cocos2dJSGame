/**
 * Created by VanChinh on 10/21/2015.
 */

VvShoppingItem = BkSprite.extend({
    parentNode: null,
    itemInfo: null,
    _eventHover: null,
    isNotInShop: false,
    userName: null,
    tooltip: null,
    icoCheck: null,

    ctor: function (item, parent, isNotInShop, userName) {
        var rect = VvAvatarImg.getRectImageFromItem(item.itemType);
        this._super(res.Tranperent_IMG, rect);

        this.itemInfo = item;
        this.parentNode = parent;
        this.isNotInShop = isNotInShop;
        this.userName = userName;

        this.initItem();
    },

    initItem: function () {

        var imgWidth = 84, imgHeight = 84;
        var itemImage = VvAvatarImg.getShopImageFromID(this.itemInfo.itemId, false);
        itemImage.x = imgWidth / 2;
        itemImage.y = imgHeight / 2;
        this.addChild(itemImage);

        this.initMouseAction(itemImage);

        this.tooltip = createTooltip(this.itemInfo.displayName, 16);
        this.tooltip.visible = false;
        this.tooltip.x = itemImage.x;
        this.tooltip.y = itemImage.y + this.tooltip.getContentSize().height / 2 + itemImage.height * itemImage.scaleY / 2 + 7;
        this.addChild(this.tooltip);

        this.icoCheck = getSpriteFromImage("#"+res_name.icon_check);
        this.icoCheck.x = itemImage.x / 2 - 10;
        this.icoCheck.y = 116 - itemImage.y / 2 - 12;
        this.icoCheck.setVisible(false);
        this.addChild(this.icoCheck);

        // check item has bought
        if((!this.isNotInShop && BkGlobal.UserInfo.hasBought(this.itemInfo.itemId, this.itemInfo.itemType) == true) ||
            (this.isNotInShop && BkGlobal.UserInfo.userName == this.userName && BkGlobal.UserInfo.avatarID == this.itemInfo.itemId))
        {
            this.icoCheck.setVisible(true);
        }
    },
    updateCheckStatusForShop:function(){
        if(!this.isNotInShop && BkGlobal.UserInfo.hasBought(this.itemInfo.itemId, this.itemInfo.itemType) == true){
            this.icoCheck.setVisible(true);
        }
    },
    initMouseAction: function (target) {
        var self = this;
        target.setMouseOnHover(function(){
            // mouse hover: show tooltip
            if(self.tooltip && !self.isNotInShop) self.tooltip.setVisible(true);
            if(self.background) self.background.setVisible(false);
            if(self.backgroundHover) self.backgroundHover.setVisible(true);
        },function(){
            // mouse out: hide tooltip
            if(self.tooltip) self.tooltip.setVisible(false);
            if(self.backgroundHover) self.backgroundHover.setVisible(false);
            if(self.background) self.background.setVisible(true);
        });
        target.setOnlickListenner(function(){
            if(BkGlobal.UserInfo.userName == self.userName) {
                if (self.tooltip && !self.isNotInShop) self.tooltip.setVisible(false);
                if (self.backgroundHover) self.backgroundHover.setVisible(false);
                if (self.background) self.background.setVisible(true);
                self.onClickShoppingItem();
            }
        });
    },

    onClickShoppingItem: function (){
        //Remove edit user mode
        if (this.parentNode.userInfoSprite) this.parentNode.userInfoSprite.backToViewMode();
        var itemDetailsWindow = new VvItemDetailsWindow(this.itemInfo.itemId, this.parentNode, this.isNotInShop, this.userName, this.itemInfo);
        itemDetailsWindow.setParentWindow(this.parentNode);
        itemDetailsWindow.showWithParent();
    }
});