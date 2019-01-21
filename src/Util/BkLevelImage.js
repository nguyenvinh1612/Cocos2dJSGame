/**
 * Created by hoangthao on 17/10/2015.
 */
function BkLevelImage() {
}
BkLevelImage.MAX_FARMER=50000;
BkLevelImage.MAX_RICH_FARMER=BkLevelImage.MAX_FARMER*10;
BkLevelImage.MAX_LAND_LORD=BkLevelImage.MAX_FARMER*100;
BkLevelImage.MAX_GREAT_ARISTOCRATIC_FAMILY=BkLevelImage.MAX_FARMER*1000;

BkLevelImage.getStringFromMoney=function(money) {
    if (money < BkLevelImage.MAX_FARMER) {
        return "Tá điền";
    }
    if (money < BkLevelImage.MAX_RICH_FARMER) {
        return "Phú nông";
    }
    if (money < BkLevelImage.MAX_LAND_LORD) {
        return "Địa chủ";
    }
    if (money < BkLevelImage.MAX_GREAT_ARISTOCRATIC_FAMILY) {
        return "Đại gia";
    }
    return "V.I.P";
};
BkLevelImage.createLevelStarHorizontalSprite = function(level){
    var lvSprite = new BkSprite();
    var starType = Math.min(Math.floor(level / TITLED_STAR_MAX_NUM), 9);
    var numberOfStar = level % TITLED_STAR_MAX_NUM;
    var starIndex = 0;
    for (var i = 0; i < TITLED_STAR_MAX_NUM; i++) {
        starIndex = starType;
        if(i > numberOfStar){
            starIndex = 0;
        }
        var levStar = new BkTiledSprite(starIndex);
        levStar.x = TITLED_STAR_SIZE * i;
        lvSprite.addChild(levStar);
    }
    if(!BkGlobal.isGameCo())
    {
        lvSprite.setScale(0.8,0.8);
    }
    return lvSprite;
};