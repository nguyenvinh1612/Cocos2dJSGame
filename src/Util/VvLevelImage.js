/**
 * Created by chinhtv on 10/05/2017.
 */
function VvLevelImage() {
}
VvLevelImage.MAX_NGHEO_ROT_MUNG_TOI = 50000;
VvLevelImage.MAX_CO_CUA_AN_CUA_DE = VvLevelImage.MAX_NGHEO_ROT_MUNG_TOI*10;
VvLevelImage.MAX_TRAU_BO_CO_VAI_CON = VvLevelImage.MAX_NGHEO_ROT_MUNG_TOI*100;
VvLevelImage.MAX_RUONG_DAT_KHONG_THIEU = VvLevelImage.MAX_NGHEO_ROT_MUNG_TOI*1000;

VvLevelImage.VALUE_LEVEL_DANDEN = 0;
VvLevelImage.VALUE_LEVEL_CAIDOI = 1;
VvLevelImage.VALUE_LEVEL_PHOLY = 2;
VvLevelImage.VALUE_LEVEL_LYTRUONG = 3;
VvLevelImage.VALUE_LEVEL_HUONGPHO = 4;
VvLevelImage.VALUE_LEVEL_HUONGTRUONG = 5;
VvLevelImage.VALUE_LEVEL_CHANHTONG = 6;
VvLevelImage.VALUE_LEVEL_TRIHUYEN = 7;
VvLevelImage.VALUE_LEVEL_TRIPHU = 8;
VvLevelImage.VALUE_LEVEL_DOCPHU = 9;
VvLevelImage.VALUE_LEVEL_TUANPHU = 10;
VvLevelImage.VALUE_LEVEL_TONGDOC = 11;
VvLevelImage.VALUE_LEVEL_VUONGGIA = 12;

VvLevelImage.getChucDanhImage = function (level) {
    level = Math.floor(level/4);
    var nameImg = "#level_"+level+".png";
    return new BkSprite(nameImg);
};

VvLevelImage.getStringFromMoney=function(money) {
    if (money < VvLevelImage.MAX_NGHEO_ROT_MUNG_TOI) {
        return "Nghèo Rớt Mùng Tơi";
    }
    if (money < VvLevelImage.MAX_CO_CUA_AN_CUA_DE) {
        return "Có Của Ăn Của Để";
    }
    if (money < VvLevelImage.MAX_TRAU_BO_CO_VAI_CON) {
        return "Trâu Bò Có Vài Con";
    }
    if (money < VvLevelImage.MAX_RUONG_DAT_KHONG_THIEU) {
        return "Ruộng Đất Không Thiếu";
    }
    return "Vàng Bạc Đầy Nhà";
};
VvLevelImage.getCapBacFromLevel=function(level){
    var lv = Math.floor(level / 4);

    if (lv == VvLevelImage.VALUE_LEVEL_DANDEN)		{return "Dân Đen";}
    if (lv == VvLevelImage.VALUE_LEVEL_CAIDOI)		{return "Cai Đội";}
    if (lv == VvLevelImage.VALUE_LEVEL_PHOLY)		{return "Phó Lý";}
    if (lv == VvLevelImage.VALUE_LEVEL_LYTRUONG)	{return "Lý Trưởng";}
    if (lv == VvLevelImage.VALUE_LEVEL_HUONGPHO)	{return "Hương Phó";}
    if (lv == VvLevelImage.VALUE_LEVEL_HUONGTRUONG)	{return "Hương Trưởng";}
    if (lv == VvLevelImage.VALUE_LEVEL_CHANHTONG)	{return "Chánh Tổng";}
    if (lv == VvLevelImage.VALUE_LEVEL_TRIHUYEN)	{return "Tri Huyện";}
    if (lv == VvLevelImage.VALUE_LEVEL_TRIPHU)		{return "Tri Phủ";}
    if (lv == VvLevelImage.VALUE_LEVEL_DOCPHU)		{return "Đốc Phủ";}
    if (lv == VvLevelImage.VALUE_LEVEL_TUANPHU)		{return "Tuần Phủ";}
    if (lv == VvLevelImage.VALUE_LEVEL_TONGDOC)		{return "Tổng Đốc";}
    if (lv == VvLevelImage.VALUE_LEVEL_VUONGGIA)	{return "Vương Gia";}
    return "";
};
VvLevelImage.getLevelSprite = function(level){
    var levelSprite = new BkSprite();
    var numOfEnableStart = level % 4;
    var currentX =0;
    var star;
    for (var i = 0; i< numOfEnableStart; i++ ){
        star = new BkSprite("#" + res_name.level_star);
        star.x = currentX;
        currentX = currentX + star.width + 1;
        levelSprite.addChild(star);
    }

    for (i = 0; i< 3 - numOfEnableStart; i++ ){
        star = new BkSprite("#" + res_name.level_star_no);
        star.x = currentX;
        currentX = currentX + star.width + 1;
        levelSprite.addChild(star);
    }

    return levelSprite;
};