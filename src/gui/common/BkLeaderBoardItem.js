/**
 * Created by hoangthao on 26/10/2015.
 */
LEADER_BOARD_HEIGHT_SPRITE = 73;

LEADER_BOARD_TEXT_COLOR = cc.color(252, 241, 9);

BkLeaderBoardItem = BkSprite.extend({
        _eventHover: null,
        parentNode: null,
        leaderBoardData: null,
        ctor: function (item, pos, parent) {
            this._super();
            this.leaderBoardData = item;
            this.parentNode = parent;
            this.initItem(pos);
            this.configPos(pos);
            this.initMouseAction();
        },

        initItem: function (pos) {
            var gameIcon = Util.getGameIconById(this.leaderBoardData.gid, this.leaderBoardData.typeName);
            gameIcon.x = 0;
            gameIcon.y = 0;
            this.addChild(gameIcon);

            this.bgHover = new cc.Scale9Sprite(res_name.top_bg_hover);
            this.bgHover.setContentSize(cc.size(387, 72));
            //this.bgHover.drawRect(cc.p(-3, 2), cc.p(382, LEADER_BOARD_HEIGHT_SPRITE), BkColor.BG_LB_PANEL_HOVER, 1, BkColor.BG_LB_PANEL_HOVER);
            this.bgHover.x = 147;
            this.bgHover.y = gameIcon.getContentSize().height/2  + 0.5;
            this.bgHover.setVisible(false);
            this.addChild(this.bgHover);

            var boardBg = new BkSprite("#"+res_name.caothugame_bg);
            boardBg.x = this.bgHover.x;
            boardBg.y = this.bgHover.y;
            this.addChild(boardBg, WD_ZORDER_BODY);

            var nameBg = new BkSprite("#"+res_name.cao_thu_name_bg);
            nameBg.x = 230;
            nameBg.y = gameIcon.getContentSize().height/2  + 0.5;
            this.addChild(nameBg);

            var lbPlayerName = new BkLabel(this.leaderBoardData.leaderName, "Tahoma", 15, true);
            //lbPlayerName.setTextColor(LEADER_BOARD_TEXT_COLOR);
            //lbPlayerName.setContentSize(cc.size(170,0))
            //lbPlayerName.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            lbPlayerName.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            lbPlayerName.x = nameBg.x;
            lbPlayerName.y = gameIcon.getContentSize().height/2  + 1;
            this.addChild(lbPlayerName);
        },

        configPos: function (pos) {
            this.x = pos.x;
            //this.y = pos.y - LEADER_BOARD_HEIGHT_SPRITE;
        },
        initMouseAction: function () {
            var self = this;
            this._eventHover = this.createHoverEvent(function (event) {
                self.bgHover.setVisible(true);
            }, function (event) {
                self.bgHover.setVisible(false);
            }, function (event) {
                if (self.bgHover.isVisible()) {
                    self.onClickItem(self.leaderBoardData);
                }
            });
            cc.eventManager.addListener(this._eventHover, this);
        },

        onClickItem: function (data) {
            var parent = this.parentNode;
            var topWd = new BkTopPlayerWindow(data);
            topWd.setParentWindow(parent);
            topWd.setCallbackRemoveWindow(function () {
                parent.setVisible(true);
            });
            topWd.showWithParent();
            parent.setVisible(false);
        },
    }
);