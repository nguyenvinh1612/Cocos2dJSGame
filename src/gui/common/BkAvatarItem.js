/**
 * Created by VanChinh on 10/27/2015.
 */

BkAvatarItem = BkSprite.extend({
    itemId: null,
    parentNode: null,
    rootNode: null,
    ctor: function (avatar, parent, root) {
        this.itemId = avatar.itemID;
        var itemType = VvAvatarImg.getTypeFromId(this.itemId);
        var rect = VvAvatarImg.getRectImageFromItem(itemType);
        this._super(res.Tranperent_IMG, rect);
        this.avatarInfo = avatar;
        this.parentNode = parent;
        this.rootNode = root;
        this.initItem();
    },

    initItem: function () {
        var itemImage = VvAvatarImg.getShopImageFromID(this.itemId);
        itemImage.x = itemImage.width / 2;
        itemImage.y = itemImage.height / 2;
        this.addChild(itemImage);
        var self = this;
        itemImage.setMouseOnHover(function(){}, function(){});
        itemImage.setOnlickListenner(function () {
            var bkCommonLogic = BkLogicManager.getLogic();
            bkCommonLogic.setOnLoadComplete(self.rootNode);
            bkCommonLogic.processSelectAvatarPacket(self.itemId);
            self.rootNode.selectedAvatarId = self.itemId;
            self.rootNode.avatarSelectionWindow = self.parentNode;
        });
        // check item has selected
        if (this.itemId == BkGlobal.UserInfo.getAvatarId()) {
            var icoCheck = getSpriteFromImage("#"+res_name.icon_check);
            icoCheck.x = itemImage.x / 2 - 5;
            icoCheck.y = 126 - itemImage.y / 2;
            this.addChild(icoCheck);
        }
    },
});