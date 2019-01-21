/**
 * Created by hoangthao on 11/12/2015.
 */

PA_ITEM_WIDTH = 645;
PA_ITEM_HEIGHT = 90;

BkPlayerAchievementItem = BkSprite.extend({
    parentNode: null,
    playerArchive: null,
    ctor: function (player, pos, parent, isEndLine) {
        this._super();
        this.parentNode =  parent;
        this.playerArchive = player;
        this.drawItem(pos, isEndLine);
    },

    drawItem: function (pos, isEndLine) {
        // add background
        var bgThanhTich = new BkSprite("#" + res_name.bg_thanhTich);
        this.addChild(bgThanhTich);

        bgThanhTich.x = 277.2;
        var gameIcon = Util.getGameIconById(this.playerArchive.gameId,"",true);
        logMessage("this.playerArchive.gameId: "+this.playerArchive.gameId);

        if(gameIcon) {
            gameIcon.x = 1;
            this.addChild(gameIcon);
        }
        //
        var lineSperate = new BkSprite("#" + res_name.line_medium_h);
        lineSperate.x = 115;
        lineSperate.y = 0;
        this.addChild(lineSperate);

        var lineSperate2 = new BkSprite("#" + res_name.line_medium_h);
        lineSperate2.x = lineSperate.x + 305 + lineSperate2.width/2;
        lineSperate2.y = 0;
        this.addChild(lineSperate2);

        //imgWin
        var imgWin = new BkSprite("#" + res_name.win);
        imgWin.x = lineSperate.x + 25;
        imgWin.y = 14.5;
        this.addChild(imgWin);
        var itemStr = [
            new BkLabelItem(convertStringToMoneyFormat(this.playerArchive.winCount)+ " ván", 15, cc.color.WHITE, 1, false),
        ];
        var lblWin = new BkLabelSprite(itemStr);
        lblWin.x = imgWin.x + 20;
        lblWin.y = imgWin.y - 8;
        this.addChild(lblWin);

        var imgLose = new BkSprite("#" + res_name.icon_lose);
        imgLose.x = 295;
        imgLose.y = imgWin.y;
        this.addChild(imgLose);

        itemStr = [
            //new BkLabelItem("  Thua: ", 15, cc.color.WHITE, 1, false),
            new BkLabelItem(convertStringToMoneyFormat(this.playerArchive.gameCount - this.playerArchive.winCount) + " ván", 15, cc.color.WHITE, 1, false),
        ];
        var lblLose = new BkLabelSprite(itemStr);
        lblLose.x = imgLose.x + 20;
        lblLose.y = lblWin.y;
        this.addChild(lblLose);

        var imgLevel = new BkSprite("#" + res_name.icon_level)
        imgLevel.x = imgWin.x - 6;
        imgLevel.y = -14;
        this.addChild(imgLevel);

        itemStr = [
            new BkLabelItem("Level: ", 15, cc.color(255,255,255), 1, false),
            new BkLabelItem(this.playerArchive.level +" + "+ this.playerArchive.newLevelPercent + "%", 15, cc.color.WHITE, 1, false),
        ];
        var lblLevel = new BkLabelSprite(itemStr);
        lblLevel.x = imgLevel.x + 20;
        lblLevel.y = imgLevel.y - 10;
        this.addChild(lblLevel);

        var itemStr = [
            new BkLabelItem("Lãi nhất: ", 15, cc.color(26,243,248), 1, false),
            new BkLabelItem(convertStringToMoneyFormat(this.playerArchive.bestHand), 15,cc.color(255,255,0), 1, false),
        ];
        var lblMoney = new BkLabelSprite(itemStr);
        lblMoney.x =  imgLose.x - 17 ;
        lblMoney.y =  lblLevel.y ;
        this.addChild(lblMoney);

        //var iconMoney = new BkSprite("#" + res_name.top_goldcoin);
        //iconMoney.x = imgLose.x + 58;
        //iconMoney.y = lblLevel.y + 8;
        //this.addChild(iconMoney);


        var rankTxt = STR_NOT_RANKING;
        itemStr = [new BkLabelItem(rankTxt, 13, cc.color.WHITE, 1, false)];
        var rankPosX = lineSperate2.x;
        var imgXepHang;
        if(this.playerArchive.rank != 2147483647 )
        {
            rankTxt = formatNumber(this.playerArchive.rank);
            itemStr[0] = new BkLabelItem("Xếp hạng ", 13, cc.color.WHITE, 1, false);
            itemStr[1] = new BkLabelItem(rankTxt, 14, cc.color.YELLOW, 1, true);
            imgXepHang = new BkSprite("#" + res_name.bg_XepHang);
            imgXepHang.x = lineSperate2.x + 100;
            imgXepHang.y = -23;
            this.addChild(imgXepHang);
            rankPosX = rankPosX + 20;
        }else
        {
            imgXepHang = new BkSprite("#" + res_name.bg_KoXepHang);
            imgXepHang.x = lineSperate2.x + 100;
            imgXepHang.y = -23;
            this.addChild(imgXepHang);
        }
        var badges = BkBadgeUtil.createBadgeList(this.playerArchive);
        badges.x = lineSperate2.x + 30;
        badges.y = 14;
        this.addChild(badges);

        var lblRank = new BkLabelSprite(itemStr);
        lblRank.x = rankPosX + lblRank.getContentSize().width/2;
        lblRank.y = lblMoney.y - 6;
        this.addChild(lblRank);
        this.configPos(pos);

        //if(!isEndLine) {
        //    var drawLine = new cc.DrawNode();
        //    drawLine.drawSegment(cc.p(-45, -PA_ITEM_HEIGHT / 2), cc.p(598, -PA_ITEM_HEIGHT / 2), 0.5, cc.color(10, 85, 125));
        //    this.addChild(drawLine);
        //}
    },
    configPos: function (pos) {
        this.x = 10;
        this.y = pos - PA_ITEM_HEIGHT;
    },

    onExit: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.badges_plist);
        this._super();
    }
});

function BkBadgeUtil() {
}
BkBadgeUtil.createBadgeList = function (playerArchive, scaleSize) {
    var badgeScaleSize = 0.6;
    if(scaleSize != undefined){
        badgeScaleSize = scaleSize;
    }

    //Badges
    var badgeFrame = new BkSprite();
    badgeFrame.x = 0;
    badgeFrame.y = 0;
    var badgeData = playerArchive.Badges[0];
    var bmbadges0 = new BkBadge(badgeData.badgeCategory, badgeData.badgeValue, badgeData.gameId);
    badgeData = playerArchive.Badges[1];
    var bmbadges1 = new BkBadge(badgeData.badgeCategory, badgeData.badgeValue, badgeData.gameId);
    badgeData = playerArchive.Badges[2];
    var bmbadges2 = new BkBadge(badgeData.badgeCategory, badgeData.badgeValue, badgeData.gameId);

    bmbadges0.scaleX = badgeScaleSize;
    bmbadges0.scaleY = badgeScaleSize;
    bmbadges0.x = 0;
    bmbadges0.y = badgeFrame.y;
    bmbadges1.x = bmbadges0.x + 60;
    bmbadges1.y = bmbadges0.y;
    bmbadges1.scaleX = badgeScaleSize;
    bmbadges1.scaleY = badgeScaleSize;
    bmbadges2.x = bmbadges1.x + 60;
    bmbadges2.y = bmbadges0.y;
    bmbadges2.scaleX =badgeScaleSize;
    bmbadges2.scaleY =badgeScaleSize;
    badgeFrame.addChild(bmbadges0);
    badgeFrame.addChild(bmbadges1);
    badgeFrame.addChild(bmbadges2);
    bmbadges0.createToolTip(this);
    bmbadges1.createToolTip(this);
    bmbadges2.createToolTip(this);

    return badgeFrame;
};