/**
 * Created by hoangthao on 12/10/2015.
 */

VV_BASE_WIDTH_AVAR = 97;
VV_BASE_HEIGHT_AVAR = 97;
VV_BASE_WIDTH_HINHANH = 108;
VV_BASE_HEIGHT_HINHANH = 116;
VV_BASE_WIDTH_BAOBOI = 108;
VV_BASE_HEIGHT_BAOBOI = 116;
VV_BASE_WIDTH_VATPHAM = 75;
VV_BASE_HEIGHT_VATPHAM = 75;
VvAvatarImg.shopItemList  = new VvShoppingItemsData();

function VvAvatarImg() {
}
VvAvatarImg.getTypeFromId = function (itemId) {
    if (itemId >= 24) return AT.TYPE_BAOBOI;
    if (itemId >= 17) return AT.TYPE_VATPHAM;
    return AT.TYPE_AVATAR;
};

VvAvatarImg.getVatphamBackground = function (isHover, type) {
    if(type != undefined && type == AT.TYPE_VATPHAM)
    {
        return new BkSprite("#" + res_name.bg_VatPham_hover);
    }
    if(!isHover){
        return new BkSprite("#" + res_name.avatar_Frame_normal);
    }
    return new BkSprite("#"+res_name.avatar_Frame_hover);
};

VvAvatarImg.getAvatarBg = function (is1St) {
    if(is1St){
        return new BkSprite("#" + res_name.top_1st_bg);
    }
    return new BkSprite("#" + res_name.top_10_bg);
};
VvAvatarImg.getCircleImageFromID = function (itemId)
{
    var shopItem = VvAvatarImg.shopItemList.getItem(itemId);
    if(shopItem != undefined) {
        var imgName = shopItem.getName() + "_cr.png";
        return new BkSprite("#" + imgName);
    }
    return new BkSprite();
};
VvAvatarImg.getImageNameFromID = function(id)
{
    var item = VvAvatarImg.shopItemList.getItem(id);
    if(item) return item.getName();
    return "";
},
VvAvatarImg.getShopImageFromID = function (itemId, isAnhDaiDien) {
    if(isAnhDaiDien){
        return new BkSprite("#" + VvAvatarImg.getImageNameFromID(itemId) + "_ava.png");
    }

    var itemType = VvAvatarImg.getTypeFromId(itemId);
    if(itemType == AT.TYPE_VATPHAM){
        var bgVatPham = new BkSprite("#" + res_name.frame_vatpham_baoboi);
        var vatPham = new BkSprite("#" + VvAvatarImg.getImageNameFromID(itemId) + ".png");
        vatPham.x = bgVatPham.width/2;
        vatPham.y = bgVatPham.height/2;
        bgVatPham.addChild(vatPham);
        return bgVatPham;
    }
    else return new BkSprite("#" + VvAvatarImg.getImageNameFromID(itemId) + ".png");
};

VvAvatarImg.getAvatarByID = function (itemId) {
    return VvAvatarImg.getShopImageFromID(itemId, true);
};

VvAvatarImg.getRectImageFromItem = function (itemType){
    if (itemType == AT.TYPE_AVATAR) {
        return cc.rect(0, 0, VV_BASE_WIDTH_AVAR, VV_BASE_HEIGHT_AVAR);
    } else if (itemType == AT.TYPE_VATPHAM) {
        return cc.rect(0, 0, VV_BASE_WIDTH_VATPHAM, VV_BASE_HEIGHT_VATPHAM);
    } else if (itemType == AT.TYPE_BAOBOI) {
        return cc.rect(0, 0, VV_BASE_WIDTH_BAOBOI, VV_BASE_HEIGHT_BAOBOI);
    }
};

VvAvatarImg.getAvatarBg = function (type, row, rank) {
    var loc;
    switch (rank) {
        case 1:
            loc = CIngameAvatar.COL_TOP_AVATAR1;
            break;
        case 2:
            loc = CIngameAvatar.COL_TOP_AVATAR2;
            break;
        case 3:
            loc = CIngameAvatar.COL_TOP_AVATAR3;
            break;
    }
    if (row == CIngameAvatar.ROW_NORMAL) {
        if (type == CIngameAvatar.SIZE_TYPE_NORMAL) {
            loc = CIngameAvatar.COL_BIG_AVATAR;
        } else {
            loc = CIngameAvatar.COL_SMALL_AVATAR;
        }
    }
    return VvAvatarImg.getBitmap(type, row,loc);
};

VvAvatarImg.getBitmap = function(type, avatarType, loc){
    if (type == CIngameAvatar.SIZE_TYPE_NORMAL) {
        return new BkSprite(res.vv_avatar_normal,VvAvatarImg.getNormalAvatarLocation(avatarType, loc));
    } else {
        return new BkSprite(res.vv_avatar_small,VvAvatarImg.getSmallAvatarLocation(avatarType, loc));
    }
};

VvAvatarImg.getSmallAvatarLocation = function(avatarType, loc)
{
    return cc.rect(loc * CIngameAvatar.BASE_SMALL_WIDTH, avatarType * CIngameAvatar.BASE_SMALL_HEIGHT, CIngameAvatar.BASE_SMALL_WIDTH, CIngameAvatar.BASE_SMALL_HEIGHT);
};
VvAvatarImg.getNormalAvatarLocation = function(avatarType, loc) {
    return cc.rect(loc * CIngameAvatar.BASE_NORMAL_WIDTH, avatarType * CIngameAvatar.BASE_NORMAL_HEIGHT, CIngameAvatar.BASE_NORMAL_WIDTH, CIngameAvatar.BASE_NORMAL_HEIGHT);
};

VvAvatarImg.getAvatarSpriteFromIDAndTopData = function(ItemID,topType,rank,vipLevel){
    if (vipLevel == undefined){
        vipLevel = 0;
    }
    var rtnSprite = new BkSprite;

    cc.spriteFrameCache.addSpriteFrames(res.vv_trang_ca_nhan_plist, res.vv_trang_ca_nhan_img);
    var bmBorder = new BkSprite("#" + res_name.vv_avatar_out_bg);

    rtnSprite.addChild(bmBorder);
    bmBorder.x = 0;
    bmBorder.y = 0;

    if (rank < 4){
        var bmBG = VvAvatarImg.getAvatarBg(CPlayer.TYPE_NORMAL_AVATAR, topType, rank);
        bmBG.x = bmBorder.x ;//+ (bmBorder.width - bmBG.width)*0.5;
        bmBG.y = bmBorder.y ;//+ (bmBorder.height - bmBG.height)*0.5;
        rtnSprite.addChild(bmBG);
    }
    if(vipLevel > 0 && topType == CIngameAvatar.ROW_NORMAL)
    {
        var vipBG = VvAvatarImg.getVipSpriteWithBound(vipLevel);
        vipBG.x = bmBorder.x;
        vipBG.y = bmBorder.y;
        rtnSprite.addChild(vipBG);
    }

    var bm = VvAvatarImg.getAvatarByID(ItemID);
    rtnSprite.addChild(bm);
    return rtnSprite;
};

// truongbs++: add VIP
VvAvatarImg.getVipBgFromID = function (vipID,type) {
    var xpos = 0;
    var BWH = 110;
    var nameRes = res.VipBG;
    if (type == CPlayer.TYPE_SMALL_AVATAR){
        BWH = 68;
        nameRes = res.VipBGSmall;
    }
    if (vipID<4){
        xpos = 0;
    } else if (vipID<7){
        xpos = BWH;
    } else if (vipID<10){
        xpos = 2* BWH;
    } else {
        xpos = 3* BWH;
    }
    var rect = cc.rect(xpos,0,BWH,BWH);
    return new BkSprite(nameRes,rect);
};

VvAvatarImg.getVipBoundFromID = function (vipID,type) {
    var xpos = 0;
    var BWH = 110;
    var nameRes = res.VipBounder;
    if (type == CPlayer.TYPE_SMALL_AVATAR){
        BWH = 68;
        nameRes = res.VipBounderSmall;
    }
    if (vipID<4){
        xpos = 0;
    } else if (vipID<7){
        xpos = BWH;
    } else if (vipID<10){
        xpos = 2* BWH;
    } else {
        xpos = 3* BWH;
    }
    var rect = cc.rect(xpos,0,BWH,BWH);
    return new BkSprite(nameRes,rect);
};

VvAvatarImg.getVipSpriteWithBound = function (vipID,type) {
    var rtnSprite = new BkSprite;
    var bgSp = VvAvatarImg.getVipBgFromID(vipID,type);
    rtnSprite.addChild(bgSp);

    var bounderSp = VvAvatarImg.getVipBoundFromID(vipID,type);
    rtnSprite.addChild(bounderSp);
    return rtnSprite;
};

VvAvatarImg.getVipFromID = function (vipID,isFullText) {
    var resName = "vip"+vipID+".png";
    if (isFullText){
        resName = "vipvip"+vipID+".png";
    }
    return new BkSprite("#"+resName);
    // var BWVIP = 90;
    // var BHVIP = 123;
    // var rect = cc.rect(vipID*BWVIP,0,BWVIP,BHVIP);
    // var resName = res.vip_number;
    // if (isFullText){
    //     resName = res.vip_all_in_one;
    // }
    // return new BkSprite(resName,rect);
};