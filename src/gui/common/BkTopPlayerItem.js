/**
 * Created by hoangthao on 26/10/2015.
 */
TOP_PLAYER_WIDTH_SPRITE =470;
TOP_PLAYER_HEIGHT_SPRITE =60;
TOP_PLAYER_ROW_Y =11;
TOP_PLAYER_TEXT_PADDING_X =26;

BkTopPlayerItem = BkSprite.extend({
    _eventHover: null,
    parentNode: null,
    topPlayer: null,

    ctor: function (item, pos, isEndOfRow, parent) {
        this._super();
        this.topPlayer = item;
        this.parentNode = parent;
        this.initItem(isEndOfRow);
        this.configPos(pos);
        this.initMouseAction();
    },

    initItem: function (isEndOfRow) {
        this.bgHover = new BkSprite("#" + res_name.top_row_list_hover);
        this.bgHover.x = this.bgHover.getContentSize().width/2 - 56;
        this.bgHover.y = 0;
        this.bgHover.setVisible(false);
        this.addChild(this.bgHover);

        var rankBg = new BkSprite("#" + res_name.rank_bg);
        rankBg.x = -40;
        rankBg.y = 0;
        this.addChild(rankBg);

        var lbRank = new BkLabel(this.topPlayer.getRank(), "Tahoma", 15, true);
        lbRank.setTextColor(cc.color(254, 207, 86));
        lbRank.x = rankBg.x;
        lbRank.y = rankBg.y;
        this.addChild(lbRank);

        var avatarBg = BkAvartarImg.getAvatarBg(false);
        avatarBg.x = 0;
        avatarBg.y = 0;
        this.addChild(avatarBg);

        var avatar = BkAvartarImg.getAvatarByID(this.topPlayer.getAvatarId());
        avatar.x = avatarBg.x;
        avatar.y = avatarBg.y;
        avatar.setScale(0.4);
        this.addChild(avatar, WD_ZORDER_TOP);

        var lbName = new BkLabel(this.topPlayer.getUserName(), "Tahoma", 14, true);
        //lbName.setTextColor(BkColor.HEADER_CONTENT_COLOR);
        lbName.x = TOP_PLAYER_TEXT_PADDING_X + lbName.getContentSize().width / 2;
        lbName.y = TOP_PLAYER_ROW_Y;
        this.addChild(lbName);

        var iconMoney = new BkSprite("#" + res_name.top_goldcoin);
        this.addChild(iconMoney);
        iconMoney.x = TOP_PLAYER_TEXT_PADDING_X + iconMoney.getContentSize().width / 2;
        iconMoney.y = -TOP_PLAYER_ROW_Y + 1;

        var moneyNum = convertStringToMoneyFormat(this.topPlayer.getMoney(),true);

        var lbMoney = new BkLabel(moneyNum, "Tahoma", 14);
        lbMoney.setTextColor(BkColor.TEXT_MONEY_COLOR);
        lbMoney.x = iconMoney.x + iconMoney.getContentSize().width/2 + lbMoney.getContentSize().width/2 + 5;
        lbMoney.y = iconMoney.y + 1;
        this.addChild(lbMoney);

        var strNumGame = "Chơi ";
        if (this.topPlayer.getLevel()) {
            // Level icon
            var iconLev = new BkSprite("#" + res_name.icon_level);
            iconLev.x = TOP_PLAYER_WIDTH_SPRITE/2 + iconLev.getContentSize().width / 2 + 58;
            iconLev.y = +TOP_PLAYER_ROW_Y;
            this.addChild(iconLev);

            var lbLevel = new BkLabel("level " + this.topPlayer.getLevel(), "Tahoma", 14);
            lbLevel.x = iconLev.x + iconLev.width / 2 + lbLevel.getContentSize().width / 2 + 10;
            lbLevel.y = iconLev.y;
            this.addChild(lbLevel);
        }
        if (this.topPlayer.getWinCount()) {
            if (this.parentNode.topGameData.type == 1) {
                var msgPlayer = "Chơi " + formatNumber(this.topPlayer.getWinCount()) + " ván";
                var lbNumGame = new BkLabel(msgPlayer, "Tahoma", 14);
                lbNumGame.x = TOP_PLAYER_WIDTH_SPRITE / 2 + lbNumGame.getContentSize().width / 2 + 46;
                lbNumGame.y = -TOP_PLAYER_ROW_Y;
                this.addChild(lbNumGame);
            } else {
                var msgPlayer = formatNumber(this.topPlayer.getWinCount()) + " ván";
                // Win icon
                var iconWin = new BkSprite("#" + res_name.win);
                iconWin.x = TOP_PLAYER_WIDTH_SPRITE / 2 + iconWin.getContentSize().width / 2 + 50;
                iconWin.y = -TOP_PLAYER_ROW_Y;
                this.addChild(iconWin);

                var lbNumGame = new BkLabel(msgPlayer, "Tahoma", 14);
                lbNumGame.x = iconWin.x + iconWin.width / 2 + lbNumGame.getContentSize().width / 2 + 5;
                lbNumGame.y = iconWin.y + 1;
                this.addChild(lbNumGame);
            }
        }
    },
    configPos: function (pos) {
        this.x = pos.x;
        this.y = pos.y - TOP_PLAYER_HEIGHT_SPRITE;
    },
    initMouseAction: function () {
        var self = this;
        this._eventHover = this.createHoverEvent(function (event) {
            self.bgHover.setVisible(true);
        }, function (event) {
            self.bgHover.setVisible(false);
        }, function (event) {
            if (self.bgHover.isVisible()) {
                self.onClickPlayerItem(self.topPlayer, self.parentNode);
            }
        });
        cc.eventManager.addListener(this._eventHover, this);
    },

    onClickPlayerItem: function (pData, parent) {
        logMessage("onClickPlayerItem " + pData.getUserName());
        var layer = new BkPlayerDetailsWindow(pData.getUserName(), pData.getIsFriend());
        layer.setParentWindow(parent);
        layer.showWithParent();
    },
});