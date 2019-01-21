/**
 * Created by hoangthao on 12/10/2015.
 */

FRIEND_ITEM_HEIGHT_SPRITE = 44;
//FRIEND_ITEM_SCALE_BUTTON = 0.8;
VV_DELTAX_WIDTH_ITEM = 12;
FRIEND_ITEM_PADDING_X = 12;
FRIEND_ITEM_PADDING_Y = 20;
FRIEND_ITEM_BTN_P_RIGHT = 15;
TEXT_OFFSET_WITH_AVATAR = 6;
TEXT_OFFSET_MONEY_LEVEL = 290;

AVATAR_FRIEND_WINDOW_WIDTH = 34;
AVATAR_FRIEND_WINDOW_HEIGHT = 34;

FRIEND_ITEM_TEXT_COLOR = cc.color(255, 178, 102);
FRIEND_ITEM_HOVER_COLOR = cc.color(225, 178, 102, 100);

BkFriendItem = BkSprite.extend({
    parentNode: null,
    playerData: null,
    typeItem: null,
    btnSendMsg: null,
    btnDenied: null,
    btnAddFriend: null,
    btnPlayWith: null,
    bgHover: null,
    isClickButton: null,
    ctor: function (player, pos, type, isEndOfRow, parent) {
        this._super();
        this.setName("BkFriendItem");
        this.playerData = player;
        this.typeItem = type;
        this.parentNode = parent;
        this.initItem(pos, isEndOfRow);
        this.initMouseAction();
    },

    initItem: function (pos, isEndOfRow) {
        this.bgHover = new cc.DrawNode();
        this.bgHover.drawRect(cc.p(-FRIEND_ITEM_PADDING_X, -FRIEND_ITEM_HEIGHT_SPRITE / 2), cc.p(this.parentNode.getBodyTab().width - FRIEND_ITEM_PADDING_X - VV_DELTAX_WIDTH_ITEM, FRIEND_ITEM_HEIGHT_SPRITE / 2), BkColor.GRID_ITEM_HOVER_COLOR_VV, 0, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        this.bgHover.visible = false;
        this.addChild(this.bgHover, -1);

        var avatar = VvAvatarImg.getAvatarByID(this.playerData.getAvatarId());
        avatar.setScale(0.4);
        avatar.x = 10;
        avatar.y = 3;
        this.addChild(avatar, WD_ZORDER_TOP);

        if (this.playerData.VipLevel>0){
            this.iConVip = VvAvatarImg.getVipFromID(this.playerData.VipLevel,false);
            this.iConVip.setScale(0.3);
            this.iConVip.y = avatar.y - 5;
            this.iConVip.x = avatar.x + 25;
            this.addChild(this.iConVip);
        }

        var lbName = new BkLabel(this.playerData.getUserName(), "", 16);
        lbName.setTextColor(BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR);

        lbName.x = avatar.x + 40 + lbName.getContentSize().width / 2;
        lbName.y = avatar.y + TEXT_OFFSET_WITH_AVATAR;
        this.addChild(lbName);

        var lbOnlineStatus = new BkLabel("", "", 12);
        var statusIco = null;
        var onlineColor = cc.color(178, 176, 177);
        if (this.playerData.isOnline()) {
            if (this.isAllowPlayWithCheck(this.playerData.getGameId())) {
                lbOnlineStatus.setString("Đang chơi " + Util.getGameLabel(this.playerData.getGameId()));
            } else {
                lbOnlineStatus.setString("Online");
            }
            onlineColor = cc.color(27, 197, 2);
            statusIco = new BkSprite("#" + res_name.icon_online);
        } else {
            lbOnlineStatus.setString("Offline");
            statusIco = new BkSprite("#" + res_name.icon_offline);
        }
        statusIco.x = avatar.x + 45;
        statusIco.y = lbName.y - FRIEND_ITEM_PADDING_Y;
        lbOnlineStatus.setTextColor(onlineColor);
        lbOnlineStatus.x = statusIco.x + statusIco.width + lbOnlineStatus.getContentSize().width / 2;
        lbOnlineStatus.y = statusIco.y + 0.5;
        this.addChild(statusIco);
        this.addChild(lbOnlineStatus);

        var lbMoney = new BkLabel(convertStringToMoneyFormat(this.playerData.getMoney()) + " " + BkConstString.STR_GAME_COIN.toLowerCase(), "", 15);
        lbMoney.setTextColor(cc.color(255,255,0));
        lbMoney.x = avatar.x + TEXT_OFFSET_MONEY_LEVEL + lbMoney.getContentSize().width / 2;
        lbMoney.y = lbName.y;
        this.addChild(lbMoney);

        var lbLevel = new BkLabel(VvLevelImage.getStringFromMoney(this.playerData.getMoney()), "", 12);
        lbLevel.setTextColor(BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR);
        lbLevel.x = lbMoney.x - lbMoney.getContentSize().width/2 + lbLevel.getContentSize().width / 2;
        lbLevel.y = lbOnlineStatus.y;
        this.addChild(lbLevel);

        if (!isEndOfRow) {
            var drawLine = new cc.DrawNode();
            drawLine.drawSegment(cc.p(-FRIEND_ITEM_PADDING_X, -FRIEND_ITEM_HEIGHT_SPRITE / 2), cc.p(this.parentNode.getBodyTab().width - FRIEND_ITEM_PADDING_X - VV_DELTAX_WIDTH_ITEM, -FRIEND_ITEM_HEIGHT_SPRITE / 2), 0.1, BkColor.GRID_ROW_BORDER_COLOR_VV);
            this.addChild(drawLine);
        }
        this.initButonForItem(avatar.y - 3, this.playerData.getUserName());
        this.configPos(pos);

    },
    initButonForItem: function (avatarY) {
        var self = this;

        var onClickSendMsg = function () {
            var selfP = self;
            var mailEditorWindow = new BkMailEditorWindow(null, null, self.playerData.getUserName());
            mailEditorWindow.setParentWindow(self.parentNode);
            mailEditorWindow.showWithParent();
            //mailEditorWindow.setCallbackCloseButtonClick(function () {
            //    selfP.visibleSearchPanel(true);
            //});
            mailEditorWindow.setCallbackRemoveWindow(function () {
                selfP.visibleSearchPanel(true);
            });
            self.visibleSearchPanel(false);
        };
        var btnPlayWith = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
        btnPlayWith.setTitleText("Chơi cùng");

        var btnSendMessage = createBkButtonPlist(res_name.icon_guiMail, res_name.icon_guiMail, null, res_name.icon_guiMail_hover);
        var btnAddFriend = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);

        if (this.typeItem == 1) {
            btnSendMessage.x = this.parentNode.getBodyTab().width - btnSendMessage.width - FRIEND_ITEM_BTN_P_RIGHT;
            btnSendMessage.y = avatarY;
            btnSendMessage.addTouchEventListener(function () {
                onClickSendMsg();
            }, this);

            this.addChild(btnSendMessage);

            var btnRemove = createBkButtonPlist(res_name.icon_delete, res_name.icon_delete, null, res_name.icon_delete_hover);
            btnRemove.x = btnSendMessage.x - btnRemove.width - FRIEND_ITEM_BTN_P_RIGHT;
            btnRemove.y = btnSendMessage.y;
            btnRemove.addTouchEventListener(function () {
                self.onClickRemoveFriend();
            }, this);
            this.addChild(btnRemove);

            btnPlayWith.x = btnRemove.x - btnPlayWith.width;
            btnPlayWith.y = btnRemove.y;

        } else if (this.typeItem == 2) {
            var btnDenied = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
            btnDenied.setTitleText("Từ chối");
            btnDenied.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnDenied.x = this.parentNode.getBodyTab().width - btnDenied.width / 2 - FRIEND_ITEM_BTN_P_RIGHT * 2;
            btnDenied.y = avatarY;
            btnDenied.addTouchEventListener(function () {
                self.onClickRejectFriendRequest();
            }, this);
            this.addChild(btnDenied);


            btnAddFriend.setTitleText("Chấp nhận");
            btnAddFriend.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnAddFriend.x = btnDenied.x - btnDenied.width - FRIEND_ITEM_BTN_P_RIGHT / 2;
            btnAddFriend.y = btnDenied.y;
            btnAddFriend.addTouchEventListener(function () {
                self.onClickAcceptFriendRequest();
            }, this);
            this.addChild(btnAddFriend);
        } else if (this.typeItem == 3) {
            btnSendMessage.x = this.parentNode.getBodyTab().width - btnSendMessage.width - FRIEND_ITEM_BTN_P_RIGHT;
            btnSendMessage.y = avatarY;
            btnSendMessage.addTouchEventListener(function () {
                onClickSendMsg();
            }, this);
            this.addChild(btnSendMessage);

            if (!this.parentNode.isInFriendList(this.playerData.getUserName())) {
                var btnAddFriend = createBkButtonPlist(res_name.icon_add_friend, res_name.icon_add_friend, res_name.icon_add_friend, res_name.icon_add_friend);
                btnAddFriend.x = btnSendMessage.x - btnAddFriend.width - FRIEND_ITEM_BTN_P_RIGHT;
                btnAddFriend.y = btnSendMessage.y;
                btnSendMessage.y = btnSendMessage.y -3;

                btnAddFriend.addTouchEventListener(
                    function (sender, type) {
                        switch (type) {
                            case ccui.Widget.TOUCH_BEGAN:
                                logMessage("btnAddFriend");
                                self.onClickCreateAddFriendPacket();
                                break;
                            case ccui.Widget.TOUCH_ENDED:
                                btnAddFriend.removeFromParent();
                                break;
                        }
                    }
                    , this);
                this.addChild(btnAddFriend);
            } else {
                this.playerData.setIsFriend(true);
            }

            btnPlayWith.x = btnSendMessage.x - btnPlayWith.width - FRIEND_ITEM_BTN_P_RIGHT;
            btnPlayWith.y = btnSendMessage.y;
        }

        if (this.playerData.isOnline() && this.isAllowPlayWithCheck(this.playerData.getGameId())) {
            btnPlayWith.addTouchEventListener(function () {
                self.onClickPlayWith();
            }, this);
            this.addChild(btnPlayWith);
        }
    },
    configPos: function (pos) {
        this.x = 40;
        this.y = pos - FRIEND_ITEM_HEIGHT_SPRITE;
    },
    initMouseAction: function () {
        var self = this;

        this.setMouseOnHover(
            function (event) {
                var target = event.getCurrentTarget();
                //Do nothing when outside list
                if (!self.isOutsideTargetCheck(target, event.getLocation())) {
                    cc._canvas.style.cursor = "default";
                    return false;
                }
                cc._canvas.style.cursor = "pointer";
                self.bgHover.setVisible(true);
            }, function (event) {
                self.bgHover.setVisible(false);
            });
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if (self.isOutsideTargetCheck(target, touch.getLocation())) {
                    self.onClickFriendItem(self.playerData, self.parentNode);
                    return false;
                }
            },
        }, this);
    },

    onClickPlayWith: function () {
        var packet = new BkPacket();
        packet.CreatePlayWithPacket(this.playerData.getUserName());
        BkConnectionManager.send(packet);
        BkLogicManager.getLogic().promotionInfo.isJoinFromInviteFriend = true;
    },
    onClickAcceptFriendRequest: function () {
        this.parentNode.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreateAcceptFriendRequestPacket(this.playerData.getUserName());
        BkConnectionManager.send(packet);
        this.playerData.setIsFriend(true);
        this.parentNode.setSelectedFriend(this.playerData);
    },
    onClickRejectFriendRequest: function () {
        this.parentNode.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreateRejectFriendRequestPacket(this.playerData.getUserName());
        BkConnectionManager.send(packet);
        this.parentNode.setSelectedFriend(this.playerData);
    },

    onClickRemoveFriend: function () {
        this.parentNode.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreateRemoveFriendPacket(this.playerData.getUserName());
        BkConnectionManager.send(packet);
        this.parentNode.setSelectedFriend(this.playerData, true);
    },

    onClickCreateAddFriendPacket: function () {
        this.parentNode.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreateAddFriendPacket(this.playerData.getUserName());
        BkConnectionManager.send(packet);
        this.parentNode.setSelectedFriend(this.playerData);
    },

    onClickFriendItem: function (pData, parent) {
        parent.setSelectedFriend(pData);
        var self = this;
        if (this.bgHover.isVisible()) {
            var layer = new VvPlayerDetailsWindow(self.playerData.userName, pData.getIsFriend());
            //var layer = new BkPlayerDetailsWindow(pData.getUserName(), pData.getIsFriend());
            layer.setParentWindow(parent);
            layer.showWithParent();
            //layer.setCallbackCloseButtonClick(function () {
            //    self.visibleSearchPanel(true);
            //});
            layer.setCallbackRemoveWindow(function () {
                self.visibleSearchPanel(true);
            });
            this.visibleSearchPanel(false);
        }
    },

    isOutsideTargetCheck: function (target, location) {
        target = (target.parentNode && target.parentNode._friendSc) ? target.parentNode._friendSc : null;
        if (target) {
            var locationInNode = target.convertToNodeSpace(location);
            var rect = cc.rect(0, 0, target._contentSize.width, target._contentSize.height);
            //Do nothing when outside list
            return cc.rectContainsPoint(rect, locationInNode);
        }
        return true;
    },

    visibleSearchPanel: function (isVisible) {
        if (this.parentNode._searchFrPanel) {
            this.parentNode._searchFrPanel.visible = isVisible;
        }
    },
    isAllowPlayWithCheck: function (gid) {
        var gameList = Util.getGameSettingList();
        if(gid == GID.CHAN)
        {
            return false;
        }
        for (var i = 0; i < gameList.length; i++) {
            var gameSetting = gameList[i];
            if (gameSetting.gid == gid && gameSetting.isEnable)
            {
                if(!bk.isFbApp || (bk.isFbApp && bk.fbAppIndex == "") || (bk.isFbApp && bk.fbAppIndex == gameSetting.gid))
                {
                    return true;
                }
            }
        }
        return false;
    },
});