
BkInviteOtherPlayer = VvTabWindow.extend({//BkTabWindow.extend({
    _friendListGrid: null,
    _tabList: ["Phòng chờ", "Bạn bè"],
    _friendList: null,
    _friendUIItemList:null,
    _logic:null,
    _isLoadedData:false,
    ctor: function (logic) {
        this._super("Mời chơi", cc.size(400, 470), this._tabList.length, this._tabList);
        // this.setVisibleOutBackgroundWindow(true);
        this.setDefaultWdBodyBgSprite();
        this._logic = logic;
        this.initFr();

    },

    initFr: function () {
        this.setMoveableWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
        //this.updateUI();
    },

    invitePlayer:function(PlayerName) {
        this._logic.invitePlayer(PlayerName);
    },

    selectedTabEvent: function (sender, tabIndex) {
        if (tabIndex ==1) {
            if (this._isLoadedData){
                this._logic.processGetWaitingPlayerList();
            }
        } else {
            this._logic.processGetOnlineFriendList();
        }
    },

    cleanGUI: function () {
        if (this._friendListGrid != null) {
            this._friendListGrid.removeFromParent();
        }
    },

    updateUI: function () {
        if (this.getCurrentTab() == 1) {
            this.drawFriendsList(this._friendList, this.getCurrentTab());
        } else if (this.getCurrentTab() == 2) {
            this.drawFriendsList(this._invitationList, this.getCurrentTab());
        }
    },

    drawFriendsList: function (frList, tabIndex) {
        Util.removeAnim();
        this._isLoadedData = true;
        this.cleanGUI();
        this._friendListGrid = new BkSprite();
        this._friendUIItemList = [];
        this.addChildBody(this._friendListGrid);

        var rowH = this.getBodySize().height - 60;
        if (frList != null && frList.length > 0) {

            var checkBoxClickArea = new BkSprite(res.Tranperent_IMG);

            this._friendListGrid.addChild(checkBoxClickArea);
            var lblCheckAll = new BkLabel("Chọn tất cả", "Arial", 16);
            lblCheckAll.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR_VV);
            lblCheckAll.x = lblCheckAll.getContentSize().width/2;
            lblCheckAll.y = lblCheckAll.getContentSize().height/2;
            checkBoxClickArea.addChild(lblCheckAll);

            var checkall = new BkCheckBox();
            checkall.x = lblCheckAll.x + lblCheckAll.getContentSize().width/2 + checkall.width;
            checkall.y = lblCheckAll.y;
            checkBoxClickArea.addChild(checkall);
            checkBoxClickArea.setContentSize(cc.size(checkall.width + lblCheckAll.getContentSize().width,checkall.height));
            checkBoxClickArea.x = 255+6;//this.getBodyTab().width - checkBoxClickArea.width/2 - WD_BODY_MARGIN_LR*2;
            checkBoxClickArea.y = 370;//this.getBodyTab().height - checkBoxClickArea.height/2 - WD_BODY_MARGIN_TB;

            var self = this;


            checkBoxClickArea.setMouseOnHover();
            checkBoxClickArea.setOnlickListenner(function () {
                checkall.setSelected(!checkall.isSelected());
                self.checkAllList(self, checkall.isSelected());
            });

            checkall.addEventListener(function() {
                self.checkAllList(self, checkall.isSelected());
            });

            var sortedList = frList;
            var isFirstItem = false;
            var fcb = function(){
                var isAllSelect = true;
                for (var j=0;j<self._friendUIItemList.length;j++){
                    var jItem = self._friendUIItemList[j];
                    if (!jItem.isSelected()){
                        isAllSelect = false;
                        break;
                    }
                }
                checkall.setSelected(isAllSelect);
            };
            for (var i = 0; i < sortedList.length; i++) {
                var player = sortedList[i];
                if(i == 0 )
                {
                    isFirstItem = true;
                }
                if(i >= 5) // display only 5 player in the list
                {
                    break;
                }
                var friendItemRow = new BkIngameInviteFriendItem(player, rowH, this,isFirstItem);
                friendItemRow.setOncallbackOncheckChange(fcb);
                friendItemRow.updateSelectedState(true);
                rowH = friendItemRow.y;
                this._friendListGrid.addChild(friendItemRow);
                this._friendUIItemList.push(friendItemRow);
            }
            this._friendListGrid.x = 40;
            this._friendListGrid.y = -35;

            var tbnInvite = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy,
                res_name.vv_btn_dongy_hover);
            tbnInvite.setTitleText("Mời");
            tbnInvite.setTitleColor(cc.color.BLACK);
            tbnInvite.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var count = 0;
                    if (self._friendUIItemList != null) {
                        for (var i = 0; i < self._friendUIItemList.length; i++) {
                            var item = self._friendUIItemList[i];
                            if (item.isSelected()) {
                                count++;
                                self.invitePlayer(item.getPlayerName());
                            }
                        }
                        if (count == 0) {
                            showToastMessage("Bạn phải chọn người chơi để mời.");
                        } else {
                            showToastMessage("Đã gửi lời mời thành công.",480,getYposforToast(BkGlobal.currentGameID),null,190);
                            self.removeSelf();
                        }
                    }
                }
            }, this);
            tbnInvite.x = 280;
            tbnInvite.y = 65;
            this._friendListGrid.addChild(tbnInvite);

            var lastCheckAllState = this.getLastCheckAllState();
            checkall.setSelected(lastCheckAllState);
            self.checkAllList(self, checkall.isSelected());
        } else {
            var lbDisplayMesg = new BkLabel("", "Arial", 16);
            if (tabIndex == 1) {
                lbDisplayMesg.setString("Không tìm thấy người chơi.");
            } else if (tabIndex == 2) {
                lbDisplayMesg.setString("Bạn bè của bạn đang bận.");
            }
            lbDisplayMesg.setPosition(0, 0);
            this._friendListGrid.addChild(lbDisplayMesg);
            this._friendListGrid.x = this.getBodySize().width/2;
            this._friendListGrid.y = this.getBodySize().height/2;
        }

    },
    storeCheckAllState:function (CheckAllIsSelected) {
        var keyCheckAllState = key.lastCheckAllState + "_" + cc.username.toLowerCase();
        var value = 0;
        if (CheckAllIsSelected){
            value = 1;
        }
        Util.setClientSetting(keyCheckAllState,JSON.stringify(value));
    },
    getLastCheckAllState:function () {
        var dfValue =JSON.stringify(0);
        var keyCheckAllState = key.lastCheckAllState + "_" + cc.username.toLowerCase();
        var value = Util.getClientSetting(keyCheckAllState, true, dfValue);
        if (value){
            if (value == 1){
                return true;
            }
        }
        return false;
    },
    checkAllList: function (self, isSelected) {
        self.storeCheckAllState(isSelected);
        if (self._friendUIItemList != null) {
            for (var i = 0; i < self._friendUIItemList.length; i++) {
                var item = self._friendUIItemList[i];
                item.updateSelectedState(isSelected);
            }
        }
    }
});
