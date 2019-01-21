/**
 * Created by hoangthao on 12/10/2015.
 */

FRIEND_ITEM_HEIGHT_SPRITE =34;
FRIEND_ITEM_SCALE_BUTTON =0.8;

FRIEND_ITEM_PADDING_X = 20;
FRIEND_ITEM_PADDING_Y = 20;
TEXT_OFFSET_WITH_AVATAR =10;
TEXT_OFFSET_NAME_LEVEL =10;

SELECT_OFFSET =50;

AVATAR_FRIEND_WINDOW_WIDTH =34;
AVATAR_FRIEND_WINDOW_HEIGHT =34;

BkIngameInviteFriendItem = BkSprite.extend({
    parentNode: null,
    playerData: null,
    typeItem: null,
    bgHover: null,
    checkItem:null,
    _eventHover: null,
    checkChangeCallback:null,

    ctor: function (player, pos, parent,isFirstItem) {
        this._super();
        this.playerData = player;
        this.parentNode = parent;
        this.initItem(pos,isFirstItem);
        this.initMouseAction();
    },

    initItem: function (pos,isFirstItem)
    {
        if(isFirstItem)
        {
            var drawLine1stLine = new cc.DrawNode();
            drawLine1stLine.drawSegment(cc.p(-15, FRIEND_ITEM_HEIGHT_SPRITE/2), cc.p(this.parentNode.getBodySize().width - 65, FRIEND_ITEM_HEIGHT_SPRITE/2), 0.5, BkColor.GRID_ROW_BORDER_COLOR_VV);
            this.addChild(drawLine1stLine);
        }
            var drawLine = new cc.DrawNode();
            drawLine.drawSegment(cc.p(-15, -FRIEND_ITEM_HEIGHT_SPRITE/2), cc.p(this.parentNode.getBodySize().width - 65, -FRIEND_ITEM_HEIGHT_SPRITE/2), 0.5, BkColor.GRID_ROW_BORDER_COLOR_VV);
            this.addChild(drawLine);
        this.bgHover = new cc.DrawNode();
        this.bgHover.drawRect(cc.p(-15, -FRIEND_ITEM_HEIGHT_SPRITE/2), cc.p(this.parentNode.getBodySize().width - 65, FRIEND_ITEM_HEIGHT_SPRITE/2), BkColor.GRID_ITEM_HOVER_COLOR_VV, 0, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        this.bgHover.setOpacity(122);
        this.bgHover.visible = false;
        this.addChild(this.bgHover);
        
        var avatar = VvAvatarImg.getAvatarByID(this.playerData.getAvatarId());//BkAvartarImg.getAvatarByIDWidthBg(this.playerData.getAvatarId());
        avatar.setScale(0.4);
        avatar.x = 5;
        avatar.y = 0;
        this.addChild(avatar, WD_ZORDER_TOP);

        var lbName = new BkLabel(Util.getFormatString(this.playerData.getUserName(), 16), "Arial", 16);
        lbName.setTextColor(BkColor.GRID_ITEM_TEXT_HEADER_VV);

        lbName.x = avatar.x + 20 + lbName.getContentSize().width / 2;
        lbName.y = 0;
        this.addChild(lbName);

        this.checkItem = new BkCheckBox();
        this.checkItem.x = 311.5;
        this.checkItem.y = lbName.y;
        var self = this;
        this.checkItem.addEventListener(function() {
            self.checkItem.setSelected(!self.checkItem.isSelected());
        });
        this.addChild(this.checkItem);

        var lbMoney = new BkLabel(convertStringToMoneyFormat(this.playerData.getMoney()) + BkConstString.getGameCoinStr(), "Arial", 15);
        lbMoney.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR_VV);
        lbMoney.x = this.checkItem.x - 20 - lbMoney.getContentSize().width/2;
        lbMoney.y = lbName.y;
        this.addChild(lbMoney);

        // Init checkbox
        this.configPos(pos);
    },

    configPos: function (pos) {
        this.x = 0;
        this.y = pos - FRIEND_ITEM_HEIGHT_SPRITE;
    },

    initMouseAction: function () {
        var self = this;
        this._eventHover = this.createHoverEvent(function (event) {
            self.bgHover.setVisible(true);
        }, function (event) {
            self.bgHover.setVisible(false);
        }, function (event) {
            if(self.bgHover.isVisible()){
                self.onClickFriendItem(self.playerData.getUserName());
            }
        });
        cc.eventManager.addListener(this._eventHover, this);
    },

    setOncallbackOncheckChange:function(cb){
        this.checkChangeCallback = cb;
    },

    onClickFriendItem: function (playerName) {
        if (this.checkItem != null) {
            this.checkItem.setSelected(!this.checkItem.isSelected());
            if (this.checkChangeCallback != null){
                this.checkChangeCallback();
            }
        }
    },
    updateSelectedState:function (isSelected) {
        this.checkItem.setSelected(isSelected);
    },

    isSelected:function() {
        return this.checkItem.isSelected();
    },

    getPlayerName:function() {
        return this.playerData.getUserName();
    }
});