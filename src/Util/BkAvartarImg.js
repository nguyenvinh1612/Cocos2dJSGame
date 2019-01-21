/**
 * Created by hoangthao on 12/10/2015.
 */

BASE_WIDTH_AVAR = 97;
BASE_HEIGHT_AVAR = 97;
BASE_WIDTH_BAOBOI = 81;
BASE_HEIGHT_BAOBOI = 83;
BkAvartarImg.shopItemList  = new BkShoppingItemsData();

function BkAvartarImg() {
}
BkAvartarImg.getTypeFromId = function (itemId) {
    if (itemId >= 24) return AT.TYPE_BAOBOI;
    if (itemId >= 17) return AT.TYPE_VATPHAM;
    return AT.TYPE_AVATAR;
};
BASE_WIDTH_VATPHAM = 83;
BASE_HEIGHT_VATPHAM = 84;
BkAvartarImg.getVatphamBackground = function (isHover, type) {
    if(type != undefined && type == AT.TYPE_VATPHAM)
    {
        return new BkSprite("#" + res_name.bg_VatPham_hover);
    }
    if(!isHover){
        return new BkSprite("#" + res_name.avatar_Frame_normal);
    }
    return new BkSprite("#"+res_name.avatar_Frame_hover);
};

BkAvartarImg.getAvatarBg = function (is1St) {
    if(is1St){
        return new BkSprite("#" + res_name.top_1st_bg);
    }
    return new BkSprite("#" + res_name.top_10_bg);
};
BkAvartarImg.getImageFromID = function (itemId)
{
    return  BkAvartarImg.getShopImageFromID(itemId);
};
BkAvartarImg.getCircleImageFromID = function (itemId)
{
    var shopItem = BkAvartarImg.shopItemList.getItem(itemId);
    if(shopItem != undefined) {
        var imgName = shopItem.getName() + "_cr.png";
        return new BkSprite("#" + imgName);
    }
    return new BkSprite();
};
BkAvartarImg.getImageNameFromID = function(id)
{
    return BkAvartarImg.shopItemList.getItem(id).getName() + ".png";
};
BkAvartarImg.getShopImageFromID = function (itemId) {
    var shopItem = BkAvartarImg.shopItemList.getItem(itemId);
    if(shopItem != undefined) {
        var imgName = shopItem.getName() + ".png";
        return new BkSprite("#" + imgName);
    }
    return new BkSprite();
};

BkAvartarImg.getAvatarByID = function (itemId) {
    var avatarSp = new BkSprite();
    avatarSp.anchorX = 0.5;
    avatarSp.anchorY = 0.5;
    var background = BkAvartarImg.getVatphamBackground(false);
    background.x = background.width / 2;
    background.y = background.height / 2;
    //avatarSp.addChild(background, -1);
    var avarImg = new BkAvartarImg.getImageFromID(itemId);
    avarImg.x = background.x;
    avarImg.y = background.y;
    avatarSp.addChild(avarImg);
    avatarSp.width = background.width;
    avatarSp.height = background.height;
    return avatarSp;
};

BkAvartarImg.getAvatarByIDWidthBg = function (itemId) {
    var avatarSp = new BkSprite();
    avatarSp.anchorX = 0.5;
    avatarSp.anchorY = 0.5;
    var background = BkAvartarImg.getVatphamBackground(false);
    background.x = background.width / 2;
    background.y = background.height / 2;
    avatarSp.addChild(background, -1);
    var avarImg = new BkAvartarImg.getImageFromID(itemId);
    avarImg.x = background.x;
    avarImg.y = background.y;
    avatarSp.addChild(avarImg);
    avatarSp.width = background.width;
    avatarSp.height = background.height;
    return avatarSp;
};

BkAvartarImg.getRectImageFromItem = function (itemType){
    if (itemType == AT.TYPE_AVATAR) {
        return cc.rect(0, 0, BASE_WIDTH_AVAR, BASE_HEIGHT_AVAR);
    } else if (itemType == AT.TYPE_VATPHAM) {
        return cc.rect(0, 0, BASE_WIDTH_VATPHAM, BASE_HEIGHT_VATPHAM);
    } else if (itemType == AT.TYPE_BAOBOI) {
        return cc.rect(0, 0, BASE_WIDTH_BAOBOI, BASE_HEIGHT_BAOBOI);
    }
};