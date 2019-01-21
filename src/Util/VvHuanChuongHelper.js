/**
 * Created by VanChinh on 5/19/2017.
 */

HC_BASE_WIDTH = 104;
HC_BASE_HEIGHT = 94;
// huan chuong type
if(typeof HC_TYPE == "undefined") {
    var HC_TYPE = {};
    HC_TYPE.TYPE_BACH_CHIEN = 0;
    HC_TYPE.TYPE_CHI_BACH_THU = 1;
    HC_TYPE.TYPE_THAP_THANH = 2;
}
// huan chuong type value
if(typeof HC_TYPE_MAX_VALUE == "undefined") {
    var HC_TYPE_MAX_VALUE = {};
    HC_TYPE_MAX_VALUE.ONE = 5;
    HC_TYPE_MAX_VALUE.AMATEUR = 20;
    HC_TYPE_MAX_VALUE.BEGINNER = 100;
    HC_TYPE_MAX_VALUE.EXPERT = 500;
    HC_TYPE_MAX_VALUE.PROFESSIONAL = 10000;
    HC_TYPE_MAX_VALUE.SUPER = 999999999;
}

if(typeof HC_LEVEL == "undefined") {
    var HC_LEVEL = {};
    HC_LEVEL.ONE = 0;
    HC_LEVEL.AMATEUR = 1;
    HC_LEVEL.BEGINNER = 2;
    HC_LEVEL.EXPERT = 3;
    HC_LEVEL.PROFESSIONAL = 4;
    HC_LEVEL.SUPER = 5;
}
if(typeof HC_DESCRIPTION == "undefined") {
    var HC_DESCRIPTION = {};
    HC_DESCRIPTION.ONE = "Chưa đạt";
    HC_DESCRIPTION.AMATEUR = "Lính mới";
    HC_DESCRIPTION.BEGINNER = "Nghiệp dư";
    HC_DESCRIPTION.EXPERT = "Chuyên nghiệp";
    HC_DESCRIPTION.PROFESSIONAL = "Cao thủ";
    HC_DESCRIPTION.SUPER = "Đại cao thủ";
}

function VvHuanChuongHelper() {
}

VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin = function(iType,wCount){
    cc.spriteFrameCache.addSpriteFrames(res.vv_huan_chuong_plist, res.vv_huan_chuong_img);
    return new BkSprite("#" + VvHuanChuongHelper.getNameWithTypeAndNumberWin(iType,wCount));
};

VvHuanChuongHelper.getNameWithTypeAndNumberWin = function(iType,wCount){
    var iCur = VvHuanChuongHelper.getCurrentMedalWith(wCount);
    if (iType == HC_TYPE.TYPE_BACH_CHIEN){
        if (iCur == HC_LEVEL.ONE) 			{return "win_none.png";}
        if (iCur == HC_LEVEL.AMATEUR) 		{return "win_beginner.png";}
        if (iCur == HC_LEVEL.BEGINNER) 		{return "win_amateur.png";}
        if (iCur == HC_LEVEL.EXPERT) 		{return "win_professional.png";}
        if (iCur == HC_LEVEL.PROFESSIONAL)	{return "win_expert.png";}
        if (iCur == HC_LEVEL.SUPER) 		{return "win_super.png";}
    }
    if (iType == HC_TYPE.TYPE_CHI_BACH_THU){
        if (iCur == HC_LEVEL.ONE) 			{return "secondspecial_none.png";}
        if (iCur == HC_LEVEL.AMATEUR) 		{return "secondspecial_beginner.png";}
        if (iCur == HC_LEVEL.BEGINNER) 		{return "secondspecial_amateur.png";}
        if (iCur == HC_LEVEL.EXPERT) 		{return "secondspecial_professional.png";}
        if (iCur == HC_LEVEL.PROFESSIONAL) 	{return "secondspecial_expert.png";}
        if (iCur == HC_LEVEL.SUPER) 		{return "secondspecial_super.png";}
    }
    if (iType == HC_TYPE.TYPE_THAP_THANH){
        if (iCur == HC_LEVEL.ONE) 			{return "firstspecial_none.png";}
        if (iCur == HC_LEVEL.AMATEUR) 		{return "firstspecial_beginner.png";}
        if (iCur == HC_LEVEL.BEGINNER)	 	{return "firstspecial_amateur.png";}
        if (iCur == HC_LEVEL.EXPERT) 		{return "firstspecial_professional.png";}
        if (iCur == HC_LEVEL.PROFESSIONAL) 	{return "firstspecial_expert.png";}
        if (iCur == HC_LEVEL.SUPER) 		{return "firstspecial_super.png";}
    }
    return "";
}

VvHuanChuongHelper.getSpriteWithTypeAndNumberWin = function(iType,wCount){
    return new BkSprite(res.vv_huan_chuong, VvHuanChuongHelper.getRectWithTypeAndNumberWin(iType,wCount));
};

VvHuanChuongHelper.getRectWithTypeAndNumberWin = function(iType,wCount){
    var iCur = VvHuanChuongHelper.getCurrentMedalWith(wCount);
    if (iType == HC_TYPE.TYPE_BACH_CHIEN){
        if (iCur == HC_LEVEL.ONE) 			{return cc.rect(0,0,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.AMATEUR) 		{return cc.rect(HC_BASE_WIDTH * 1,0,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.BEGINNER) 		{return cc.rect(HC_BASE_WIDTH * 2,0,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.EXPERT) 		{return cc.rect(HC_BASE_WIDTH * 3,0,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.PROFESSIONAL)	{return cc.rect(HC_BASE_WIDTH * 4,0,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.SUPER) 		{return cc.rect(HC_BASE_WIDTH * 5,0,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
    }
    if (iType == HC_TYPE.TYPE_CHI_BACH_THU){
        if (iCur == HC_LEVEL.ONE) 			{return cc.rect(0,HC_BASE_HEIGHT + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.AMATEUR) 		{return cc.rect(HC_BASE_WIDTH * 1,HC_BASE_HEIGHT + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.BEGINNER)	 	{return cc.rect(HC_BASE_WIDTH * 2,HC_BASE_HEIGHT + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.EXPERT) 		{return cc.rect(HC_BASE_WIDTH * 3,HC_BASE_HEIGHT + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.PROFESSIONAL) 	{return cc.rect(HC_BASE_WIDTH * 4,HC_BASE_HEIGHT + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
        if (iCur == HC_LEVEL.SUPER) 		{return cc.rect(HC_BASE_WIDTH * 5,HC_BASE_HEIGHT + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT);}
    }
    if (iType == HC_TYPE.TYPE_THAP_THANH){
        if (iCur == HC_LEVEL.ONE) 			{return cc.rect(0,HC_BASE_HEIGHT * 2 + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT - 0.5);}
        if (iCur == HC_LEVEL.AMATEUR) 		{return cc.rect(HC_BASE_WIDTH * 1,HC_BASE_HEIGHT * 2 + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT - 0.5);}
        if (iCur == HC_LEVEL.BEGINNER) 		{return cc.rect(HC_BASE_WIDTH * 2,HC_BASE_HEIGHT * 2 + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT - 0.5);}
        if (iCur == HC_LEVEL.EXPERT) 		{return cc.rect(HC_BASE_WIDTH * 3,HC_BASE_HEIGHT * 2 + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT - 0.5);}
        if (iCur == HC_LEVEL.PROFESSIONAL) 	{return cc.rect(HC_BASE_WIDTH * 4,HC_BASE_HEIGHT * 2 + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT - 0.5);}
        if (iCur == HC_LEVEL.SUPER) 		{return cc.rect(HC_BASE_WIDTH * 5,HC_BASE_HEIGHT * 2 + 1,HC_BASE_WIDTH, HC_BASE_HEIGHT - 0.5);}
    }
    return null;
};

VvHuanChuongHelper.getCurrentMedalWith=function(winCount)
{
    if ( winCount < HC_TYPE_MAX_VALUE.ONE ) return HC_LEVEL.ONE;
    if ( winCount < HC_TYPE_MAX_VALUE.AMATEUR ) return HC_LEVEL.AMATEUR;
    if ( winCount < HC_TYPE_MAX_VALUE.BEGINNER ) return HC_LEVEL.BEGINNER;
    if ( winCount < HC_TYPE_MAX_VALUE.EXPERT ) return HC_LEVEL.EXPERT;
    if ( winCount < HC_TYPE_MAX_VALUE.PROFESSIONAL ) return HC_LEVEL.PROFESSIONAL;
    if ( winCount < HC_TYPE_MAX_VALUE.SUPER ) return HC_LEVEL.SUPER;
    return 0;
};

VvHuanChuongHelper.getCapDoFromWinCount=function(winCount){
    var iCur = VvHuanChuongHelper.getCurrentMedalWith(winCount);
    if (iCur == HC_LEVEL.ONE) {return HC_DESCRIPTION.ONE;}
    if (iCur == HC_LEVEL.AMATEUR) {return HC_DESCRIPTION.AMATEUR;}
    if (iCur == HC_LEVEL.BEGINNER) {return HC_DESCRIPTION.BEGINNER;}
    if (iCur == HC_LEVEL.EXPERT) {return HC_DESCRIPTION.EXPERT;}
    if (iCur == HC_LEVEL.PROFESSIONAL) {return HC_DESCRIPTION.PROFESSIONAL;}
    if (iCur == HC_LEVEL.SUPER) {return HC_DESCRIPTION.SUPER;}
    return "";
};
VvHuanChuongHelper.getNextLevelFromWinCount=function(winCount){
    var iCur = VvHuanChuongHelper.getCurrentMedalWith(winCount);
    if (iCur == HC_LEVEL.ONE){ return HC_TYPE_MAX_VALUE.ONE - winCount;}
    if (iCur == HC_LEVEL.AMATEUR){ return HC_TYPE_MAX_VALUE.AMATEUR - winCount;}
    if (iCur == HC_LEVEL.BEGINNER){ return HC_TYPE_MAX_VALUE.BEGINNER - winCount;}
    if (iCur == HC_LEVEL.EXPERT){ return HC_TYPE_MAX_VALUE.EXPERT - winCount;}
    if (iCur == HC_LEVEL.PROFESSIONAL){ return HC_TYPE_MAX_VALUE.PROFESSIONAL - winCount;}
    if (iCur == HC_LEVEL.SUPER){ return 0;}
    return 0;
}

