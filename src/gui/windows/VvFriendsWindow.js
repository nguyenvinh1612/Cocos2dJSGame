/**
 * Created by hoangthao on 10/10/2015.
 */
FRIEND_MAX_ROW_NUM = 10;

VvFriendsWindow = VvTabWindow.extend({
    _searchFrPanel: null,
    _friendListGrid: null,
    _friendSc: null,
    _tabList: ["Danh sách bạn", "Lời mời kết bạn", "Kết bạn"],
    _friendList: null,
    _invitationList: null,
    _selectedFriend:null,
    _isRemovedFriend:null,
    _isLoadedFriendList:false,
    _inputName:null,
    ctor: function () {
        this._super("Bạn bè", cc.size(715, 600), this._tabList.length, this._tabList);
        addSpriteFrames(res.btn_sprite_sheet_plist, res.btn_sprite_sheet_img);
        this.initFr();
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"FriendScene");
    },
    initFr: function () {
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
    },
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        switch (tag){
            case c.NETWORK_GET_FRIENDS_RETURN:
                this._isLoadedFriendList = true;
                this._friendList = o.friendList;
                this._invitationList = o.invitationList;
                this.drawUIWithFriendsListReturn();
                break;
            case c.NETWORK_ACCEPT_FRIEND_SUCCESS:
                showToastMessage("Bạn và "+this._selectedFriend.getUserName()+" đã trở thành bạn bè.",cc.director.getWinSize().width/2, cc.director.getWinSize().height/2);
                this.updateFriendList(true);
                break;
            case c.NETWORK_REMOVE_FRIEND_SUCCESS:
                showToastMessage("Đã xóa " + o + "\n khỏi danh sách bạn.",cc.director.getWinSize().width/2, cc.director.getWinSize().height/2, null, 200);
                if(this._isRemovedFriend){
                    this.removeFriendList();
                }else{
                    this.updateFriendList(false);
                }
                break;
            case c.NETWORK_REQUEST_FRIEND_SUCCESS:
                showToastMessage("Đã gửi lời mời kết bạn tới: " + o,cc.director.getWinSize().width/2, cc.director.getWinSize().height/2,null,200);
                this._inputName.setText("");
                this._inputName.setFocus();
                break;
        }
        Util.removeAnim();
    },

    drawUIWithFriendsListReturn: function () {
        this.cleanGUI();
        this.cleanSearchGUI();
        if (this.getCurrentTab() == 1) {
            this.drawFriendsList(this._friendList, this.getCurrentTab());
        } else if (this.getCurrentTab() == 2) {
            this.drawFriendsList(this._invitationList, this.getCurrentTab());
        }
    },

    loadFriendsList: function () {
        logMessage("loadFriendsList");
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreateFriendsListPacket();
        BkConnectionManager.send(packet);
        Util.showAnim();
    },


    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function (tabIndex) {
        this.cleanGUI();
        this.cleanSearchGUI();
        if (tabIndex == 1) {

            if(this._isLoadedFriendList) {
                this.drawFriendsList(this._friendList, this.getCurrentTab());
            } else {
                this.loadFriendsList();
            }
        } else if (tabIndex == 2) {
            //this.loadFriendsList();
            this.drawFriendsList(this._invitationList, this.getCurrentTab());
        } else if (tabIndex == 3) {
            this.initAddFriendTab();
        }
    },
    initAddFriendTab: function () {
        this.cleanSearchGUI();
        this._searchFrPanel = new BkSprite();
        this.addChildBody(this._searchFrPanel);

        var paddingLeft = 30;

        var guidelineText = new BkLabel("Hãy nhập tên người chơi bạn muốn kết bạn", "Arial", 16);
        guidelineText.setTextColor(BkColor.VV_REGISTER_PHONE_WD_TEXT_COLOR);
        guidelineText.x = this.getBodySize().width/2 - 20;
        guidelineText.y = guidelineText.getContentSize().height/2;
        this._searchFrPanel.addChild(guidelineText);

        this._inputName = createEditBox(cc.size(205, 36), res_name.edit_text);
        this._inputName.x = guidelineText.x;
        this._inputName.y = guidelineText.y - 45;
        this._inputName.setFontSize(15);
        this._inputName.setAutoFocus(true);
        this._inputName.setPlaceHolder("nhập tên...");
        // this._inputName.setPlaceholderFontColor(cc.color(88, 84, 84));
        this._inputName.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this._inputName.setMaxLength(20);
        this._inputName.setPaddingLeft("2px");
        // this._inputName.setBorder("1px solid #9c8643");
        this._searchFrPanel.addChild(this._inputName);
        this._inputName.setAutoFocus(true);
        this._inputName.setTabStop();
        this.addEditbox(this._inputName);

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (key, event) {
                if (key == cc.KEY.enter) {
                    self.doAddFriend(self._inputName.getString());
                }
            },
        }, this._inputName);

        var btnAddFriend = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
        btnAddFriend.setTitleText("Kết bạn");
        btnAddFriend.setTitleColor(BkColor.TEXT_INPUT_COLOR);
        btnAddFriend.x = guidelineText.x;
        btnAddFriend.y = this._inputName.y - 38;
        btnAddFriend.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.doAddFriend(this._inputName.getString());
            }
        }, this);
        this._searchFrPanel.addChild(btnAddFriend);
        this._searchFrPanel.x = 22;
        this._searchFrPanel.y = this.getBodyTab().height - 20;
    },

    drawFriendsList: function (frList, tabIndex, maxRowNum) {

        if(maxRowNum  == undefined){
            maxRowNum = FRIEND_MAX_ROW_NUM;
        }

        this._friendListGrid = new BkSprite();

        if (frList != null && frList.length > 0) {
            var maxContainerHeight = frList.length * FRIEND_ITEM_HEIGHT_SPRITE + FRIEND_ITEM_HEIGHT_SPRITE/2;
            logMessage("maxContainerHeight "+maxContainerHeight);
            var maxScrollHeight = maxRowNum*FRIEND_ITEM_HEIGHT_SPRITE;
            var beginContainerY = maxScrollHeight - maxContainerHeight;
            if (frList.length > maxRowNum) {
                this._friendListGrid.setContentSize(this.getBodyTab().width, maxContainerHeight);
                this._friendSc = new BkScrollView(cc.size(this.getBodyTab().width +25, maxScrollHeight), this._friendListGrid,this,false);

                this.addChildBody(this._friendSc);
                this._friendSc.y = FRIEND_ITEM_HEIGHT_SPRITE;
                this._friendSc.x = 0;
                this._friendSc.setBeginY(beginContainerY + FRIEND_ITEM_HEIGHT_SPRITE/2);
                if (tabIndex != 3){
                    this._friendSc.configPos(820,284);
                } else {
                    this._friendSc.configPos(820,262);
                }

            } else {
                this.addChildBody(this._friendListGrid);
                this._friendListGrid.y = beginContainerY + FRIEND_ITEM_HEIGHT_SPRITE/2 + FRIEND_ITEM_HEIGHT_SPRITE;
                this._friendListGrid.x =0;
            }

            var sortedList = frList;
            if (tabIndex != 3) {
                sortedList.sort(this.sortOnPriority);
            }
            for (var i = 0; i < sortedList.length; i++) {
                var player = sortedList[i];
                var isEndOfRow = i == (sortedList.length - 1);
                var friendItemRow = new BkFriendItem(player, maxContainerHeight, tabIndex, isEndOfRow, this);
                maxContainerHeight = friendItemRow.y;
                this._friendListGrid.addChild(friendItemRow);
            }
        } else {
            var lbDisplayMesg = new BkLabel("", "Arial", 16);
            if (tabIndex == 1) {
                lbDisplayMesg.setString("Bạn hiện tại chưa có bạn bè nào.");
            } else if (tabIndex == 2) {
                lbDisplayMesg.setString("Không có lời mời kết bạn nào.");
            } else if (tabIndex == 3) {
                lbDisplayMesg.setString("Không có kết quả, xin hãy thử lại.");
            }
            lbDisplayMesg.setPosition(0, 0);
            this._friendListGrid.addChild(lbDisplayMesg);
            this._friendListGrid.x = this.getBodyTab().width / 2;
            this._friendListGrid.y = this.getBodyTab().height / 2;
            this.addChildBody(this._friendListGrid);
        }
    },

    doAddFriend: function (name) {
        if (isUserNameValidate(name)) {
            if (!this.isInFriendList(name)){
                if(name.toLowerCase() != BkGlobal.UserInfo.userName.toLowerCase()){
                    this.initHandleonLoadComplete();
                    var packet = new BkPacket();
                    packet.CreateAddFriendPacket(name);
                    BkConnectionManager.send(packet);
                    Util.showAnim();
                }
                else{
                    showToastMessage("Bạn không thể kết bạn với chính mình.",
                        this.getBodyTab().width - 350, this.getBodyTab().height - 80, 2, 270);
                }
            }
            else{
                showToastMessage("Bạn và "+ name +" đang là bạn bè của nhau.",
                    this.getBodyTab().width - 350, this.getBodyTab().height - 80, 2, 270);
            }
        } else {
            showToastMessage("Tên bạn của bạn không hợp lệ.",
                this.getBodyTab().width - 350, this.getBodyTab().height - 80, 2, 270);
        }
    },

    drawSearchResultByName: function (playerList) {
        this.initSearchFriendTab();
        this.cleanGUI();
        this.drawFriendsList(playerList, this.getCurrentTab(), 9);
    },
    cleanGUI: function () {
        if (this._friendSc != null) {
            this._friendSc.removeFromParent();
            this._friendSc = null;
        }
        if (this._friendListGrid != null) {
            //this._friendListGrid.removeFromParent();
            this._friendListGrid.removeSelf();
            this._friendListGrid = null;
        }
    },
    cleanSearchGUI: function () {
        if (this._searchFrPanel != null) {
            this._searchFrPanel.removeFromParent();
            this._searchFrPanel = null;
        }
    },
    sortOnPriority: function (item1, item2) {
        var name1 = item1.getUserName().toLowerCase();
        var name2 = item2.getUserName().toLowerCase();
        // Compare the 2 keys
        if(item1.isOnline() < item2.isOnline()) return 1;
        if(item1.isOnline() > item2.isOnline()) return -1;
        else {
            if (name1 < name2) return -1;
            if (name1 > name2) return 1;
            return 0;
        }
    },
    isInFriendList: function (name) {
        if (this._friendList != null) {
            for (var i = 0; i < this._friendList.length; i++) {
                var player = this._friendList[i];
                if (player != null) {
                    if (player.getUserName().toLowerCase() == name.toLowerCase()) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    setSelectedFriend:function(value, isRemoveF){
        this._selectedFriend = value;
        this._isRemovedFriend = isRemoveF;
    },

    updateFriendList:function(isAddedFlag) {
        var loopTarget = this._invitationList.slice();
        for (var i = 0; i < loopTarget.length; i++) {
            if (this._selectedFriend.getUserName().toLowerCase() == loopTarget[i].getUserName().toLowerCase()) {
                this._invitationList.splice(i, 1);
                break;
            }
        }
        if (isAddedFlag) {
            loopTarget = this._friendList.slice();
            var isExistFr = false;
            for (var i = 0; i < loopTarget.length; i++) {
                var fr = this._friendList[i];
                if (this._selectedFriend.getUserName().toLowerCase() == fr.getUserName().toLowerCase()) {
                    isExistFr = true;
                }
            }
            if (!isExistFr) {
                this._friendList.push(this._selectedFriend);
            }
        }
        this.drawUIWithFriendsListReturn();
    },

    removeAddedFriendList:function() {
        var loopTarget = this._friendList.slice();
        for (var i = 0; i < loopTarget.length; i++) {
            if (this._selectedFriend.getUserName().toLowerCase() == loopTarget[i].getUserName().toLowerCase()) {
                this._friendList.splice(i, 1);
                break;
            }
        }
        this.drawUIWithFriendsListReturn();
    },

    removeFriendList:function() {
        var loopTarget = this._friendList.slice();
        for (var i = 0; i < loopTarget.length; i++) {
            if (this._selectedFriend.getUserName().toLowerCase() == loopTarget[i].getUserName().toLowerCase()) {
                this._friendList.splice(i, 1);
                break;
            }
        }
        this.drawUIWithFriendsListReturn();
    },
});