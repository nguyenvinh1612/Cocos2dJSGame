/**
 * Created by VanChinh on 10/24/2015.
 */
MAX_RANK = 2000000000;
STR_NOT_RANKING = "Chưa xếp hạng";
UP_TS_ITEM_PER_PAGE = 6;
UP_TT_ITEM_PER_PAGE = 4;
VvPlayerDetailsWindow = VvTabWindow.extend({
    sph: cc.spriteFrameCache,
    _tabList: ["Thông tin", "Tài sản"],
    userInfo: null,
    userInfoSprite: null,
    selectedAvatarId: null,
    avatarImg: null,
    avatarSelectionWindow: null,
    _ThongTinSprite: null,
    _TaiSanSprite: null,
    _CongTrangSprite: null,
    isLoadForChangeAvatar: null,
    currentTaiSanType: null,
    taiSanItemListSprite: null,
    shopItemsData: null,
    btnHinhAnhTab: null,
    btnVatPhamTab: null,
    btnBaoBoiTab: null,
    isFriend: null,
    btnFriend: null,
    btnChangePassword:null,
    lblUserName:null,
    lblMoney:null,
    _windowSc:null,
    ctor: function (userName, isFriend) {
        this.sph.addSpriteFrames(res.vv_trang_ca_nhan_plist, res.vv_trang_ca_nhan_img);
        this.sph.addSpriteFrames(res.vv_huan_chuong_plist, res.vv_huan_chuong_img);
        this.sph.addSpriteFrames(res.vv_shopping_items_plist, res.vv_shopping_items_img);
        this._super("Trang cá nhân", cc.size(670, 597), this._tabList.length, this._tabList);
        this.initUI();
        this.userInfo = new BkUserData();
        this.userInfo.setUserName(userName);
        this.initData();

        this.isFriend = isFriend;
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"ProfileScene");
    },

    initData: function () {
        var commonLogic = BkLogicManager.getLogic();
        commonLogic.setOnLoadComplete(this);
        commonLogic.DoGetProfilePlayer(this.userInfo.userName);
        Util.showAnim();
    },

    initUI: function () {
        this._TaiSanSprite = new BkSprite();
        this._ThongTinSprite = new BkSprite();
        this._CongTrangSprite = new BkSprite();
        this.setMoveableWindow(true);
        this.setVisibleOutBackgroundWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
    },

    onLoadComplete: function (obj, tag) {
        var winSize;
        switch (tag) {
            case c.NETWORK_PROFILE_RETURN:
                this.setUserInfo(obj);
                Util.removeAnim();
                this.drawThongTinTab();
                break;
            case c.NETWORK_REQUEST_FRIEND_SUCCESS:
                winSize = cc.director.getWinSize();
                if (this.btnFriend){
                    this.btnFriend.removeFromParent();
                }
                // if(this.laban)this.laban.visible = true;
                // else {
                //     this.laban = new BkSprite("#" + res_name.icon_laban);
                //     this.laban.x = this.avatarImg.x + this.avatarImg.width/2 + 0.5;
                //     this.laban.y = this.avatarImg.y + this.avatarImg.height/2;
                //     this._ThongTinSprite.addChild(this.laban);
                // }
                showToastMessage("Đã gửi lời mời kết bạn tới: " + this.userInfo.userName, winSize.width / 2- 100, winSize.height / 2 + 50);
                break;
            case c.NETWORK_REMOVE_FRIEND_SUCCESS:
                winSize = cc.director.getWinSize();
                showToastMessage("Đã xóa " + this.userInfo.userName + " khỏi danh sách bạn.", winSize.width / 2- 100, winSize.height / 2 + 50);
                if (this.btnFriend){
                    // this.btnFriend.setTitleText("Kết bạn");
                    this.btnFriend.removeFromParent();
                }

                this.isFriend = false;
                this.userInfo.isFriend = 0;
                if(this.laban)this.laban.visible = false;
                var parent = this.getParentWindow();
                if(parent instanceof VvFriendsWindow){
                    parent.removeAddedFriendList();
                }
                break;
            case c.NETWORK_PLAYER_ITEMS_RETURN:
                Util.removeAnim();
                this.drawTaiSanListItems(obj, this.currentTaiSanType);
                break;
            case c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN:
                this.setUserInfo(obj);
                //this.drawTaiSanTab();
                this.initCongTrangArea(VV_WD_BODY_MARGIN_LR + 247, this.getBodySize().height - VV_WD_BODY_MARGIN_TB - 210.5);
                Util.removeAnim();
                break;
            case c.NETWORK_SELECT_AVATAR_SUCCESS:
                if(this.avatarSelectionWindow) this.avatarSelectionWindow.removeSelf();
                this.avatarImg.initWithSpriteFrameName(VvAvatarImg.getImageNameFromID(this.selectedAvatarId) + "_ava.png");
                this.userInfo.avatarID = this.selectedAvatarId;
                BkGlobal.UserInfo.setAvatarId(this.selectedAvatarId);
                if (this.taiSanItemListSprite) {
                    var childs = this.taiSanItemListSprite.getChildren();
                    for (var i = 0; i < childs.length; i++) {
                        var item = childs[i];
                        if(item.itemInfo == undefined)
                            continue;

                        if (item.itemInfo.itemId != this.selectedAvatarId) {
                            item.icoCheck.setVisible(false);
                        }
                        else item.icoCheck.setVisible(true);
                    }
                }
                break;
            case c.NETWORK_UPDATE_PROFILE_SUCCESS:
                Util.removeAnim();
                this.userInfoSprite.userInfo = this.userInfoSprite.updatedInfo;
                this.userInfoSprite.initUI();
                break;
            case fb.SUBEVENT_CHECK_ACCOUNT_SETUP:
                this.initBtnFbUserSetup();
                break;
        }
    },

    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function (tabIndex) {
        if (tabIndex == 1) {
            this.drawThongTinTab();
        }
        else if (tabIndex == 2) {
            this.drawTaiSanTab();
        }
    },

    drawThongTinTab: function () {
        this.cleanGUI();
        if (this.userInfo == null) return;
        this._ThongTinSprite.removeAllChildren();
        var startX = VV_WD_BODY_MARGIN_LR + 50;
        var startY = this.getBodySize().height - VV_WD_BODY_MARGIN_TB - 70;
        this.initProfileArea(startX, startY);
        this.initThongTinCaNhanArea(startX + 215, startY + 15);

        this.addChildBody(this._ThongTinSprite);
        this.addChildBody(this._CongTrangSprite);
    },
    initProfileArea: function (startX, startY) {
        var underBG = new BkSprite(this.sph.getSpriteFrame(res_name.vv_trangcanhan_avatar_bg));
        underBG.x = 123;
        underBG.y = 263.5;
        this._ThongTinSprite.addChild(underBG);

        // Avatar background
        var avatarBg = new BkSprite("#" + res_name.vv_avatar_out_bg);
        avatarBg.x = startX + avatarBg.getContentSize().width / 2;
        avatarBg.y = startY - avatarBg.getContentSize().height / 2 - VV_WD_BODY_MARGIN_TB - 5.5;
        this._ThongTinSprite.addChild(avatarBg);

        // Avatar image
        this.avatarImg = VvAvatarImg.getAvatarByID(this.userInfo.avatarID);
        this.selectedAvatarId = this.userInfo.avatarID;
        if (this.avatarImg) {
            this.avatarImg.x = avatarBg.x;
            this.avatarImg.y = avatarBg.y;

            this.tooltip = createTooltip("Click để đổi ảnh đại diện", 13, 20, 8);
            this.tooltip.visible = false;
            this.tooltip.x = this.avatarImg.x;
            this.tooltip.y = this.avatarImg.y + this.tooltip.getContentSize().height / 2 + this.avatarImg.height / 2 + 7;
            this._ThongTinSprite.addChild(this.tooltip);
        }
        this._ThongTinSprite.addChild(this.avatarImg);

        if(this.userInfo.isFriend){
            this.laban = new BkSprite("#" + res_name.icon_laban);
            this.laban.x = this.avatarImg.x + this.avatarImg.width/2 + 0.5;
            this.laban.y = this.avatarImg.y + this.avatarImg.height/2;
            this._ThongTinSprite.addChild(this.laban);
        }

        if(this.userInfo.VipLevel && this.userInfo.VipLevel > 0)
        {
            var vipIcon = VvAvatarImg.getVipFromID(this.userInfo.VipLevel);
            vipIcon.setScale(0.5);
            vipIcon.x = this.avatarImg.x - 45;
            vipIcon.y = this.avatarImg.y;
            this._ThongTinSprite.addChild(vipIcon);
        }

        var self = this;

        if (this.userInfo.userName == BkGlobal.UserInfo.getUserName()) {
            // allow click to change avatar
            this.avatarImg.setMouseOnHover(function () {
                // mouse hover: show tooltip
                if(self.tooltip) self.tooltip.visible = true;
                if(self.tooltip1 && self.tooltip1.visible == true) self.tooltip.visible = false;
            }, function () {
                // mouse out: hide tooltip
                if(self.tooltip) self.tooltip.visible = false;
            });
            this.avatarImg.setOnlickListenner(function () {
                if (self.userInfoSprite) self.userInfoSprite.backToViewMode();
                var listAvatars = BkGlobal.UserInfo.listAvatar;
                var avatarSelectWD = new BkAvatarSelectionWindow(listAvatars, self);
                avatarSelectWD.setParentWindow(self);
                avatarSelectWD.showWithParent();
            });
        }

        // Name
        this.lblUserName = new BkLabel(Util.trimStringByWidth(this.userInfo.userName, 115), "", 16, true);
        this.lblUserName.setTextColor(BkColor.DEFAULT_TEXT_COLOR);
        this.lblUserName.x = avatarBg.x;
        this.lblUserName.y = avatarBg.y - avatarBg.height/2 - this.lblUserName.getContentSize().height / 2 - 7;
        this._ThongTinSprite.addChild(this.lblUserName);

        // Money
        this.lblMoney = new BkLabel("", "", 14);
        this.lblMoney.setString(formatNumber(this.userInfo.playerMoney) + " quan");
        this.lblMoney.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        this.lblMoney.x = avatarBg.x;
        this.lblMoney.y = this.lblUserName.y - 20;
        this._ThongTinSprite.addChild(this.lblMoney);

        var imgChucDanh = VvLevelImage.getChucDanhImage(this.userInfo.lvUser);
        this._ThongTinSprite.addChild(imgChucDanh);
        imgChucDanh.x = avatarBg.x;
        imgChucDanh.y = this.lblMoney.y - 20;

        var levelStarBg = new BkSprite("#" + res_name.level_star_bg);
        this._ThongTinSprite.addChild(levelStarBg);
        levelStarBg.x = avatarBg.x;
        levelStarBg.y = imgChucDanh.y - 20;

        var levelStar = VvLevelImage.getLevelSprite(this.userInfo.lvUser);
        this._ThongTinSprite.addChild(levelStar);
        levelStar.x = avatarBg.x - 7;
        levelStar.y = levelStarBg.y;

        var trangthaitaisan = new BkSprite(this.sph.getSpriteFrame(res_name.trangthaitaisan));
        trangthaitaisan.x = avatarBg.x;
        trangthaitaisan.y = levelStarBg.y - 30.5;
        this._ThongTinSprite.addChild(trangthaitaisan);

        var fontSize = 13;
        if(this.userInfo.playerMoney >= VvLevelImage.MAX_TRAU_BO_CO_VAI_CON && this.userInfo.playerMoney < VvLevelImage.MAX_RUONG_DAT_KHONG_THIEU)
            fontSize = 12;
        var lblTrangThaiTaiSan = new BkLabel(VvLevelImage.getStringFromMoney(this.userInfo.playerMoney), "", fontSize);
        lblTrangThaiTaiSan.setTextColor(cc.color(207, 180, 90));
        lblTrangThaiTaiSan.x = trangthaitaisan.width/2;
        lblTrangThaiTaiSan.y = trangthaitaisan.height/2 + 2;
        trangthaitaisan.addChild(lblTrangThaiTaiSan,0);

        if (this.userInfo.userName == BkGlobal.UserInfo.getUserName()) {
            this.btnChangePassword = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
            this.btnChangePassword.setTitleText("Đổi mật khẩu");
            this.btnChangePassword.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            this.btnChangePassword.setTitleFontSize(13);
            this.btnChangePassword.x = avatarBg.x;
            this.btnChangePassword.y = trangthaitaisan.y - this.btnChangePassword.height / 2 - 30;
            this._ThongTinSprite.addChild(this.btnChangePassword);

            this.btnChangePassword.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        if (self.userInfoSprite) self.userInfoSprite.backToViewMode();
                        // show update password window
                        var isCreatePass = (BkGlobal.isFbCreateablePass || BkGlobal.isLoginFacebook);
                        var updatePassWD = new BkUpdatePasswordWindow(isCreatePass);
                        updatePassWD.setParentWindow(self);
                        updatePassWD.showWithParent();
                    }
                },
                this);
            this.initBtnFbUserSetup();

            // drawUpdPhoneInfo isPhoneNumberUpdatable
            if(!BkGlobal.isPhoneNumberUpdatable){
                var updPhoneSprite = new BkSprite("#" + res_name.user_verify);
                this._ThongTinSprite.addChild(updPhoneSprite);

                updPhoneSprite.x = this.avatarImg.x - this.avatarImg.width/2 + 15.5;
                updPhoneSprite.y = this.avatarImg.y + this.avatarImg.height/2 - 10;

                this.tooltip1 = createTooltip("Tài khoản đã được xác thực", 13, 20, 8, - 34);
                this.tooltip1.visible = false;
                this.tooltip1.x = updPhoneSprite.x + 34;
                this.tooltip1.y = updPhoneSprite.y + updPhoneSprite.height/2 + this.tooltip1.getContentSize().height / 2 + 2;
                this._ThongTinSprite.addChild(this.tooltip1);

                var self = this;
                updPhoneSprite.setMouseOnHover(function () {
                    // mouse hover: show tooltip
                    self.tooltip1.visible = true;
                }, function () {
                    // mouse out: hide tooltip
                    self.tooltip1.visible = false;
                });
            }
        }
        else {
            var btnSendMail = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
            btnSendMail.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnSendMail.setTitleText("Gửi thư");
            btnSendMail.setZoomScale(0);
            btnSendMail.x = avatarBg.x;
            btnSendMail.y = 150;
            this._ThongTinSprite.addChild(btnSendMail);

            btnSendMail.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        // open send mail wd
                        var mailEditorWindow = new BkMailEditorWindow(null, null, self.userInfo.userName);
                        mailEditorWindow.setParentWindow(self);
                        mailEditorWindow.showWithParent();
                    }
                },
                this);

            this.btnFriend = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
            this.btnFriend.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            if (this.userInfo.isFriend === 1) {
                this.btnFriend.setTitleText("Xóa bạn");
            }
            else if (this.userInfo.isFriend === 0) {
                this.btnFriend.setTitleText("Kết bạn");
            }
            this.btnFriend.setZoomScale(0);
            this.btnFriend.x = btnSendMail.x ;
            this.btnFriend.y = btnSendMail.y - 40;
            this._ThongTinSprite.addChild(this.btnFriend);

            this.btnFriend.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        var packet = new BkPacket();
                        BkLogicManager.getLogic().setOnLoadComplete(self);

                        if (self.userInfo.isFriend === 1) {
                            // send un-friend request
                            packet.CreateRemoveFriendPacket(self.userInfo.userName);
                            BkConnectionManager.send(packet);
                        }
                        else {
                            // send add-friend request
                            packet.CreateAddFriendPacket(self.userInfo.userName);
                            BkConnectionManager.send(packet);
                        }
                    }
                },
                this);
        }
    },
    initThongTinCaNhanArea: function (startX, startY) {

        var tabThongTinCaNhan = new BkSprite(this.sph.getSpriteFrame(res_name.tab_thongtincanhan));
        this._ThongTinSprite.addChild(tabThongTinCaNhan);
        tabThongTinCaNhan.x = startX + 10;
        tabThongTinCaNhan.y = startY;

        var drawLine = new cc.DrawNode();
        drawLine.drawSegment(cc.p(startX - tabThongTinCaNhan.width/2 + 12, startY - tabThongTinCaNhan.height/2 + 1), cc.p(startX + 332, startY - tabThongTinCaNhan.height/2 + 1), 0.5, cc.color(217, 129, 19));
        this._ThongTinSprite.addChild(drawLine);

        var lblThongTinCaNhan = new BkLabel("Thông tin cá nhân", "", 14, true);
        lblThongTinCaNhan.setTextColor(BkColor.COLOR_TEXT_FORMAT_TAB);
        lblThongTinCaNhan.x = tabThongTinCaNhan.width/2;
        lblThongTinCaNhan.y = tabThongTinCaNhan.height/2;
        tabThongTinCaNhan.addChild(lblThongTinCaNhan);

        // Thong tin ca nhan - content
        this.userInfoSprite = new BkUserInfoSprite(this.userInfo, this);
        this.userInfoSprite.x = this.getBodySize().width / 2 - 86;
        this.userInfoSprite.y = (this.getBodySize().height - (VV_WD_BODY_MARGIN_TB * 2)) / 2 - 5;
        this._ThongTinSprite.addChild(this.userInfoSprite);

        // if (this.userInfo.userName != BkGlobal.UserInfo.userName) {
        //     this.userInfoSprite.y = this.userInfoSprite.y - 10;
        //     lblThongTinCaNhan.y = lblThongTinCaNhan.y - 5;
        // }
    },
    initCongTrangArea: function(startX, startY){

        if (this._CongTrangSprite) {
            this._CongTrangSprite.removeAllChildren();
        }

        var tabCongTrangCaNhan = new BkSprite(this.sph.getSpriteFrame(res_name.tab_congtrang));
        this._CongTrangSprite.addChild(tabCongTrangCaNhan);
        tabCongTrangCaNhan.x = startX + 10;
        tabCongTrangCaNhan.y = startY;

        var drawLine = new cc.DrawNode();
        drawLine.drawSegment(cc.p(startX - tabCongTrangCaNhan.width/2 + 13, startY - tabCongTrangCaNhan.height/2), cc.p(startX + 350, startY - tabCongTrangCaNhan.height/2), 0.5, cc.color(217, 129, 19));
        this._CongTrangSprite.addChild(drawLine);

        var lblThongTinCaNhan = new BkLabel("Công trạng", "", 14, true);
        lblThongTinCaNhan.setTextColor(BkColor.COLOR_TEXT_FORMAT_TAB);
        lblThongTinCaNhan.x = tabCongTrangCaNhan.x;
        lblThongTinCaNhan.y = tabCongTrangCaNhan.y;
        this._CongTrangSprite.addChild(lblThongTinCaNhan);

        this.drawCongTrangArea(startX - 20, startY - 5);
    },
    drawCongTrangArea: function(startX, startY){

        var MARGIN_LEFT = 160;
        var MARGIN_TOP = 22;

        //Hang
        var lblHang = new BkLabel("Hạng:","", USER_INFO_SPRITE_FONT_SIZE);
        lblHang.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblHang.x = startX + lblHang.getContentSize().width / 2;
        lblHang.y = startY - MARGIN_TOP;
        this._CongTrangSprite.addChild(lblHang);

        var lblRank = new BkLabel("", "", USER_INFO_SPRITE_FONT_SIZE);
        lblRank.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        if( this.userInfo.rank && this.userInfo.rank > 0 && this.userInfo.rank < MAX_RANK)
        {
            lblRank.setString(this.userInfo.rank);
        }else
        {
            lblRank.setString(STR_NOT_RANKING);
        }
        lblRank.x = lblRank.getContentSize().width / 2 + startX + MARGIN_LEFT;
        lblRank.y = lblHang.y;
        this._CongTrangSprite.addChild(lblRank);

        //Van Thang Lon Nhat
        var lblBestHand = new BkLabel("Ván thắng lớn nhất:","",USER_INFO_SPRITE_FONT_SIZE);
        lblBestHand.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblBestHand.x = startX + lblBestHand.getContentSize().width / 2;
        lblBestHand.y = lblHang.y - MARGIN_TOP;
        this._CongTrangSprite.addChild(lblBestHand);

        var lblBestHandValue = new BkLabel("", "", USER_INFO_SPRITE_FONT_SIZE);
        lblBestHandValue.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        if( this.userInfo.bestHand && this.userInfo.bestHand > 0)
        {
            lblBestHandValue.setString(formatNumber(this.userInfo.bestHand) + " quan");
        }else
        {
            lblBestHandValue.setString("0 quan");
        }
        lblBestHandValue.x = lblBestHandValue.getContentSize().width / 2 + startX + MARGIN_LEFT;
        lblBestHandValue.y = lblBestHand.y;
        this._CongTrangSprite.addChild(lblBestHandValue);

        //So Van Thang/Van Thua
        var lblWinCount = new BkLabel("Số ván thắng/Số ván thua:","",USER_INFO_SPRITE_FONT_SIZE);
        lblWinCount.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblWinCount.x = startX + lblWinCount.getContentSize().width / 2;
        lblWinCount.y = lblBestHand.y - MARGIN_TOP;
        this._CongTrangSprite.addChild(lblWinCount);

        var winCount, loseCount;
        if( this.userInfo.gameCount && this.userInfo.winCount)
        {
            winCount = this.userInfo.winCount;
            loseCount = this.userInfo.gameCount - this.userInfo.winCount;
        }else
        {
            winCount = 0;
            loseCount = 0;
        }
        var winLoseSprite = this.createWinLoseInfoSprite(winCount, loseCount);
        winLoseSprite.x = winLoseSprite.getContentSize().width / 2 + startX + MARGIN_LEFT;
        winLoseSprite.y = lblWinCount.y;

        this._CongTrangSprite.addChild(winLoseSprite);

        var tfCuocToNhat = new BkLabel("Cước to nhất: ", "", USER_INFO_SPRITE_FONT_SIZE);
        tfCuocToNhat.setTextColor(BkColor.COLOR_HEADER_TEXT);
        tfCuocToNhat.x = startX + tfCuocToNhat.getContentSize().width / 2;
        tfCuocToNhat.y = lblWinCount.y - MARGIN_TOP;
        this._CongTrangSprite.addChild(tfCuocToNhat);

        //var tfCuocToContent = new BkLabel("", "", USER_INFO_SPRITE_FONT_SIZE);
        //tfCuocToContent.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        var tfCuocToContent = new BkLabelTTF("", "", USER_INFO_SPRITE_FONT_SIZE);
        tfCuocToContent.setDimensions(cc.size(250*2,0));
        tfCuocToContent.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);

        if(this.userInfo.stringCuocU)
        {
            var strCuocU = this.splitCuocUString(this.userInfo.stringCuocU, 196);
            tfCuocToContent.setString(strCuocU);
            logMessage("wid: "+tfCuocToContent.getContentSize().width +" - hei: "+tfCuocToContent.getContentSize().height);
            if(strCuocU != this.userInfo.stringCuocU){
                tfCuocToContent.y = tfCuocToNhat.y - 8;
            }else{
                tfCuocToContent.y = tfCuocToNhat.y;
            }
            tfCuocToContent.x = tfCuocToContent.getContentSize().width / 2 + startX + MARGIN_LEFT;
            if (tfCuocToContent.getContentSize().height>16){
                tfCuocToContent.y = tfCuocToNhat.y - 8;
            }
        }
        this._CongTrangSprite.addChild(tfCuocToContent);

        //Bach Chien
        var scaleNumber = 0.8;
        var space = 45;
        var spBachChien = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_BACH_CHIEN,this.userInfo.winCountRecord);
        spBachChien.scale = scaleNumber;
        spBachChien.x = 298;
        spBachChien.y = tfCuocToNhat.y - 65;

        var bmde_hc_bachChien = new BkSprite("#" + res_name.hc_bachchien_de);
        bmde_hc_bachChien.scale = 0.8;
        bmde_hc_bachChien.x = spBachChien.x;
        bmde_hc_bachChien.y = spBachChien.y - 44 ;

        var desBachChienBg = new BkSprite("#" + res_name.hc_de);
        desBachChienBg.scaleY = 0.75;
        desBachChienBg.x = spBachChien.x;
        desBachChienBg.y = bmde_hc_bachChien.y - bmde_hc_bachChien.height/2 - desBachChienBg.height/2 + 18;
        this._CongTrangSprite.addChild(desBachChienBg);
        this._CongTrangSprite.addChild(bmde_hc_bachChien);
        this._CongTrangSprite.addChild(spBachChien);

        var tfCapDoBachChien = new BkLabel("","",11);
        tfCapDoBachChien.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        var strCapDoBachChien = VvHuanChuongHelper.getCapDoFromWinCount(this.userInfo.winCountRecord);
        if(this.userInfo.userName == BkGlobal.UserInfo.getUserName())
        {
            var winCountRecord = 0;
            if(this.userInfo.winCountRecord) winCountRecord = this.userInfo.winCountRecord;
            tfCapDoBachChien.setString("Cấp độ: " + strCapDoBachChien + "\nHiện tại: " + winCountRecord
                +"\nSố ván lên cấp: " + VvHuanChuongHelper.getNextLevelFromWinCount(this.userInfo.winCountRecord));
        }
        else
        {
            tfCapDoBachChien.setString("Cấp độ: " + strCapDoBachChien);
        }
        tfCapDoBachChien.setTextColor(cc.color(251, 176, 64));
        tfCapDoBachChien.x = desBachChienBg.x;
        tfCapDoBachChien.y = desBachChienBg.y - 3;
        this._CongTrangSprite.addChild(tfCapDoBachChien);

        //Thap Thanh
        var spThapThanh = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_THAP_THANH,this.userInfo.firstSpecialCountRecord);
        spThapThanh.scale = scaleNumber;
        spThapThanh.x = spBachChien.x + spBachChien.width * scaleNumber/2 + space + spThapThanh.width * scaleNumber/2;
        spThapThanh.y = spBachChien.y;

        var bmde_hc_ThapThanh = new BkSprite("#" + res_name.hc_thapthanh_de);
        bmde_hc_ThapThanh.scale = 0.8;
        bmde_hc_ThapThanh.x = spThapThanh.x;
        bmde_hc_ThapThanh.y = spThapThanh.y - 44 ;

        var desThapThanhBg = new BkSprite("#" + res_name.hc_de);
        desThapThanhBg.scaleY = 0.75;
        desThapThanhBg.x = spThapThanh.x;
        desThapThanhBg.y = bmde_hc_ThapThanh.y - bmde_hc_ThapThanh.height/2 - desThapThanhBg.height/2 + 18;
        this._CongTrangSprite.addChild(desThapThanhBg);
        this._CongTrangSprite.addChild(bmde_hc_ThapThanh);
        this._CongTrangSprite.addChild(spThapThanh);

        var tfCapDoThapThanh = new BkLabel("","",11);
        tfCapDoThapThanh.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        var strCapDoThapThanh = VvHuanChuongHelper.getCapDoFromWinCount(this.userInfo.firstSpecialCountRecord);
        if(this.userInfo.userName == BkGlobal.UserInfo.getUserName())
        {
            var firstSpecialCountRecord = 0;
            if(this.userInfo.firstSpecialCountRecord) firstSpecialCountRecord = this.userInfo.firstSpecialCountRecord;
            tfCapDoThapThanh.setString("Cấp độ: " + strCapDoThapThanh + "\nHiện tại: "+ firstSpecialCountRecord
                +"\nSố ván lên cấp: " + VvHuanChuongHelper.getNextLevelFromWinCount(this.userInfo.firstSpecialCountRecord));        }
        else
        {
            tfCapDoThapThanh.setString("Cấp độ: " + strCapDoThapThanh);
        }
        tfCapDoThapThanh.setTextColor(cc.color(251, 176, 64));
        tfCapDoThapThanh.x = desThapThanhBg.x;
        tfCapDoThapThanh.y = desThapThanhBg.y - 3;
        this._CongTrangSprite.addChild(tfCapDoThapThanh);

        // U chi bach thu
        var spChiBachThu = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_CHI_BACH_THU,this.userInfo.secondSpecialCountRecord);
        spChiBachThu.scale = scaleNumber;
        spChiBachThu.x = spThapThanh.x + spThapThanh.width * scaleNumber/2 + space + spChiBachThu.width * scaleNumber/2;
        spChiBachThu.y = spThapThanh.y;

        var bmde_hc_ChiBachThu = new BkSprite("#" + res_name.hc_uchibachthu_de);
        bmde_hc_ChiBachThu.scale = 0.8;
        bmde_hc_ChiBachThu.x = spChiBachThu.x;
        bmde_hc_ChiBachThu.y = spChiBachThu.y - 44 ;

        var desChiBachThuBg = new BkSprite("#" + res_name.hc_de);
        desChiBachThuBg.scaleY = 0.75;
        desChiBachThuBg.x = spChiBachThu.x;
        desChiBachThuBg.y = bmde_hc_ChiBachThu.y - bmde_hc_ChiBachThu.height/2 - desChiBachThuBg.height/2 + 18;
        this._CongTrangSprite.addChild(desChiBachThuBg);
        this._CongTrangSprite.addChild(bmde_hc_ChiBachThu);
        this._CongTrangSprite.addChild(spChiBachThu);

        var tfCapDoChiBachThu = new BkLabel("","",11);
        tfCapDoChiBachThu.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        var strCapDoChiBachThu = VvHuanChuongHelper.getCapDoFromWinCount(this.userInfo.secondSpecialCountRecord);
        if(this.userInfo.userName == BkGlobal.UserInfo.getUserName())
        {
            var secondSpecialCountRecord = 0;
            if(this.userInfo.secondSpecialCountRecord) secondSpecialCountRecord = this.userInfo.secondSpecialCountRecord;
            tfCapDoChiBachThu.setString("Cấp độ: " + strCapDoChiBachThu + "\nHiện tại: "+ secondSpecialCountRecord
                +"\nSố ván lên cấp: " + VvHuanChuongHelper.getNextLevelFromWinCount(this.userInfo.secondSpecialCountRecord));        }
        else
        {
            tfCapDoChiBachThu.setString("Cấp độ: " + strCapDoChiBachThu);
        }
        tfCapDoChiBachThu.setTextColor(cc.color(251, 176, 64));
        tfCapDoChiBachThu.x = desChiBachThuBg.x;
        tfCapDoChiBachThu.y = desChiBachThuBg.y - 3;
        this._CongTrangSprite.addChild(tfCapDoChiBachThu);

    },
    splitCuocUString: function(strCuocU, width){
        var arrStr = strCuocU.split([',']);
        var i = 1, len = arrStr.length;
        if(len <= 1) return strCuocU;

        var str = arrStr[0];
        var lbl = new BkLabel(str, "", 13);
        while(lbl.getContentSize().width < width && i < len){
            str += ", " + arrStr[i].trim() + "," ;
            lbl.setString(str);
            i++;
        }

        if(i < len){
            str=arrStr[0];
            for(var j=1; j<i; j++){
                str = str + ", " + arrStr[j].trim();
            }
            str = str + ", " + " \n";
            str += arrStr[i].trim();
            for(j=i+1; j < len; j++){
                str = str + ", " + arrStr[j].trim();
            }
            return str;
        }
        else return strCuocU;
    },
    createWinLoseInfoSprite: function(winCountTxt, loseCountTxt){
        var winLoseCountSprite = new BkSprite(this.sph.getSpriteFrame(res_name.thang_thua_bg));

        // win info
        var tfWin = new BkLabel(winCountTxt, "", USER_INFO_SPRITE_FONT_SIZE);
        tfWin.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        tfWin.x = tfWin.getContentSize().width/2 + 10;
        tfWin.y = winLoseCountSprite.height/2;
        winLoseCountSprite.addChild(tfWin,0);

        // lose info
        var tfLose = new BkLabel(loseCountTxt, "", USER_INFO_SPRITE_FONT_SIZE);
        tfLose.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        tfLose.x = winLoseCountSprite.width - tfLose.getContentSize().width/2 - 10;
        tfLose.y = winLoseCountSprite.height/2;
        winLoseCountSprite.addChild(tfLose,0);

        return winLoseCountSprite;
    },
    initBtnFbUserSetup: function () {
        this.setChangePassBtnState(BkGlobal.isLoginFacebook);

        var self = this;
        var updateNameFnc = function () {
            if(self.lblUserName){
                self.lblUserName.setString(BkGlobal.UserInfo.getUserName());
            }
        };
        if (BkGlobal.isFbLinkable) {
            var btnLinkUserFb = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover);
            btnLinkUserFb.setTitleText("LK tài khoản");
            btnLinkUserFb.setTitleFontSize(12);
            btnLinkUserFb.x = this.btnChangePassword.x + this.btnChangePassword.width / 2 + btnLinkUserFb.width / 2 + 10;
            btnLinkUserFb.y = this.btnChangePassword.y;
            this._ThongTinSprite.addChild(btnLinkUserFb);
            btnLinkUserFb.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        if (self.userInfoSprite) self.userInfoSprite.backToViewMode();
                        var linkUserWd = new BkFbUserSetupWindow(FB_SETUP_LINK_USER);
                        linkUserWd.setParentWindow(self);
                        linkUserWd.showWithParent();
                        //linkUserWd.setCallbackCloseButtonClick(updateNameFnc);
                        linkUserWd.setCallbackRemoveWindow(updateNameFnc);
                    }
                },
                this);
        }
        if (BkGlobal.isFbRenameable) {
            var btnRenameUserFb = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy_hover);
            btnRenameUserFb.setTitleText("Đổi tên");
            btnRenameUserFb.setTitleFontSize(12);
            btnRenameUserFb.setTitleColor(BkColor.TEXT_INPUT_COLOR);
            btnRenameUserFb.x = this.btnChangePassword.x;
            btnRenameUserFb.y = this.btnChangePassword.y  - this.btnChangePassword.height - 10;
            this._ThongTinSprite.addChild(btnRenameUserFb);
            btnRenameUserFb.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        if (self.userInfoSprite) self.userInfoSprite.backToViewMode();
                        var linkUserWd = new BkFbUserSetupWindow(FB_SETUP_RENAME);
                        linkUserWd.setParentWindow(self);
                        linkUserWd.showWithParent();
                        //linkUserWd.setCallbackCloseButtonClick(updateNameFnc);
                        linkUserWd.setCallbackRemoveWindow(updateNameFnc);
                        btnRenameUserFb.setVisible(false)
                    }
                },
                this);
        }
    },
    setChangePassBtnState: function (btnState) {
        if (btnState)
        {
            this.btnChangePassword.setTitleText("Đặt mật khẩu");
        } else {
            this.btnChangePassword.setTitleText("Đổi mật khẩu");
        }
        this.btnChangePassword.setEnableButton(true);
    },

    initTaiSanArea: function (startX, startY) {

        // tai san background
        var taisanBg = new BkSprite("#" + res_name.bv_daigia_content_bg);
        taisanBg.x = this.getContentSize().width/2 - 146;
        taisanBg.y = this.getContentSize().height/2 - 50.5;
        this._TaiSanSprite.addChild(taisanBg);

        //Tab Menu Button
        var btnPaddingX = 11;
        this.btnHinhAnhTab = createBkButtonPlist(res_name.btn_taisan_avatar_press, res_name.btn_taisan_avatar, res_name.btn_taisan_avatar_press, res_name.btn_taisan_avatar_press);
        this.btnHinhAnhTab.setTitleText("Hình ảnh");
        this.btnHinhAnhTab.setTitleColor(cc.color.WHITE);
        this.btnHinhAnhTab._titleRenderer.x += -10;
        this.btnHinhAnhTab.setName(AT.TYPE_AVATAR);
        this.btnHinhAnhTab.x = startX + this.btnHinhAnhTab.width / 2 + btnPaddingX;
        this.btnHinhAnhTab.y = startY - 1;
        this._TaiSanSprite.addChild(this.btnHinhAnhTab);

        var lineSperate = new BkSprite("#" + res_name.gach_ngang);
        lineSperate.x = this.btnHinhAnhTab.x - 5;
        lineSperate.y = this.btnHinhAnhTab.y - this.btnHinhAnhTab.height/2 - 1;
        this._TaiSanSprite.addChild(lineSperate);

        this.btnBaoBoiTab = createBkButtonPlist(res_name.btn_taisan_baoboi, res_name.btn_taisan_baoboi, res_name.btn_taisan_baoboi, res_name.btn_taisan_baoboi_hover);
        this.btnBaoBoiTab.setTitleColor(cc.color(194, 181, 155));
        this.btnBaoBoiTab.setTitleText("Bảo bối");
        this.btnBaoBoiTab._titleRenderer.x += -10;
        this.btnBaoBoiTab.setName(AT.TYPE_BAOBOI);
        this.btnBaoBoiTab.x = this.btnHinhAnhTab.x;
        this.btnBaoBoiTab.y = lineSperate.y - this.btnBaoBoiTab.height/2;
        this._TaiSanSprite.addChild(this.btnBaoBoiTab);

        var lineSperate2 = new BkSprite("#" + res_name.gach_ngang);
        lineSperate2.x = this.btnBaoBoiTab.x - 5;
        lineSperate2.y = this.btnBaoBoiTab.y - this.btnBaoBoiTab.height/2  - 1;
        this._TaiSanSprite.addChild(lineSperate2);

        this.btnVatPhamTab = createBkButtonPlist(res_name.btn_taisan_vatpham, res_name.btn_taisan_vatpham, res_name.btn_taisan_vatpham, res_name.btn_taisan_vatpham_hover);
        this.btnVatPhamTab.setTitleText("Vật phẩm");
        this.btnVatPhamTab.setTitleColor(cc.color(194, 181, 155));
        this.btnVatPhamTab._titleRenderer.x += -10;
        this.btnVatPhamTab.setName(AT.TYPE_VATPHAM);
        this.btnVatPhamTab.x = this.btnBaoBoiTab.x;
        this.btnVatPhamTab.y = lineSperate2.y - this.btnVatPhamTab.height/2 - 0.5;
        this._TaiSanSprite.addChild(this.btnVatPhamTab);

        var self = this;
        var btnEventHoverClick = this.createHoverEvent(
            function (event) {  // call back over
                // var target = event.getCurrentTarget();
                // if (self.currentTaiSanType != target.getName()) {
                //     target.setTitleColor(cc.color(252, 237, 99));
                // }
                // else{
                //     self.setSelectedTaiSanButtons(target.getName());
                // }
            }, function (event) {   // call back out
                // var target = event.getCurrentTarget();
                // if (self.currentTaiSanType != target.getName()) {
                //     target.setTitleColor(cc.color(194, 181, 155));
                // }
            }, function (event) {   // call back mouse down
                var location = event.getLocation();
                var target = event.getCurrentTarget();
                if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), location)) {
                    target.setTitleColor(cc.color.WHITE);
                    self.loadTaiSanList(target.getName(), target);
                    logMessage("btnEventHoverClick" + target.getTitleText());
                }
            });
        cc.eventManager.addListener(btnEventHoverClick, this.btnHinhAnhTab);
        cc.eventManager.addListener(btnEventHoverClick.clone(), this.btnVatPhamTab);
        cc.eventManager.addListener(btnEventHoverClick.clone(), this.btnBaoBoiTab);

        this.loadTaiSanList(AT.TYPE_AVATAR);
    },
    setSelectedTaiSanButtons:function(name){
        var resString = "";
        if(name == "" + AT.TYPE_AVATAR){
            resString = res_name.btn_taisan_avatar_press;
            this.btnHinhAnhTab.loadTextures(resString,resString,resString,resString,ccui.Widget.PLIST_TEXTURE);
            this.btnVatPhamTab.loadTextures(res_name.btn_taisan_vatpham,res_name.btn_taisan_vatpham,res_name.btn_taisan_vatpham,res_name.btn_taisan_vatpham_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnVatPhamTab.setTitleColor(cc.color(194, 181, 155));
            this.btnBaoBoiTab.loadTextures(res_name.btn_taisan_baoboi,res_name.btn_taisan_baoboi,res_name.btn_taisan_baoboi,res_name.btn_taisan_baoboi_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnBaoBoiTab.setTitleColor(cc.color(194, 181, 155));
        }
        else if(name == "" + AT.TYPE_VATPHAM){
            resString = res_name.btn_taisan_vatpham_press;
            this.btnVatPhamTab.loadTextures(resString,resString,resString,resString,ccui.Widget.PLIST_TEXTURE);
            this.btnHinhAnhTab.loadTextures(res_name.btn_taisan_avatar,res_name.btn_taisan_avatar,res_name.btn_taisan_avatar,res_name.btn_taisan_avatar_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnHinhAnhTab.setTitleColor(cc.color(194, 181, 155));
            this.btnBaoBoiTab.loadTextures(res_name.btn_taisan_baoboi,res_name.btn_taisan_baoboi,res_name.btn_taisan_baoboi,res_name.btn_taisan_baoboi_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnBaoBoiTab.setTitleColor(cc.color(194, 181, 155));
        }
        else if(name == "" + AT.TYPE_BAOBOI){
            resString = res_name.btn_taisan_baoboi_press;
            this.btnBaoBoiTab.loadTextures(resString,resString,resString,resString,ccui.Widget.PLIST_TEXTURE);
            this.btnHinhAnhTab.loadTextures(res_name.btn_taisan_avatar,res_name.btn_taisan_avatar,res_name.btn_taisan_avatar,res_name.btn_taisan_avatar_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnHinhAnhTab.setTitleColor(cc.color(194, 181, 155));
            this.btnVatPhamTab.loadTextures(res_name.btn_taisan_vatpham,res_name.btn_taisan_vatpham,res_name.btn_taisan_vatpham,res_name.btn_taisan_vatpham_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnVatPhamTab.setTitleColor(cc.color(194, 181, 155));
        }
        cc._canvas.style.cursor = "default";
    },
    loadTaiSanList: function (taiSanIndex) {
        if (this.shopItemsData == null) {
            this.shopItemsData = new VvShoppingItemsData();
        }
        this.currentTaiSanType = "" + taiSanIndex;
        switch (taiSanIndex) {
            //Vat pham
            case AT.TYPE_VATPHAM:
                if (this.userInfo.listVatPham) {
                    this.drawTaiSanListItems(this.userInfo.listVatPham, AT.TYPE_VATPHAM);
                } else {
                    this.requestListItemWithType(AT.TYPE_VATPHAM);
                }
                break;
            //Bao boi
            case AT.TYPE_BAOBOI:
                if (this.userInfo.listBaoBoi) {
                    this.drawTaiSanListItems(this.userInfo.listBaoBoi, AT.TYPE_BAOBOI);
                } else {
                    this.requestListItemWithType(AT.TYPE_BAOBOI);
                }
                break;
            //Avatar
            default :
                this.currentTaiSanType = "" + AT.TYPE_AVATAR;
                if (this.userInfo.listAvatar) {
                    this.drawTaiSanListItems(this.userInfo.listAvatar, AT.TYPE_AVATAR);
                } else if(this.userInfo.getUserName().toLowerCase() != BkGlobal.UserInfo.getUserName().toLowerCase()){
                    this.requestListItemWithType(AT.TYPE_AVATAR);
                }
                break;
        }
    },
    drawTaiSanListItems: function (listItem, itemType) {
        this.updateArrowPos();
        var startItemX = VV_WD_BODY_MARGIN_LR * 2 + 130;
        var startItemY = this.getBodySize().height - VV_WD_BODY_MARGIN_TB * 2 - 100;
        if(this._windowSc){
            this._windowSc.removeFromParent();
            this._windowSc = null;
        }
        if (this.taiSanItemListSprite) {
            this.taiSanItemListSprite.removeSelf();
            this.taiSanItemListSprite = null;
        }
        this.taiSanItemListSprite = new BkSprite();
        this.taiSanItemListSprite.x = 0;
        this.taiSanItemListSprite.y = 0;
        //No item msg
        if (listItem.length == 0) {
            var lblNoItem = new BkLabel("", "Arial", 14);
            lblNoItem.setString(this.getStringNoItemWith(itemType));
            lblNoItem.x = startItemX + lblNoItem.getContentSize().width / 2 - 10;
            lblNoItem.y = startItemY;
            this.taiSanItemListSprite.addChild(lblNoItem);
            this._TaiSanSprite.addChild(this.taiSanItemListSprite);
            return;
        }

        var itemWidth = 97;
        var spaceX = 20;
        var xPos = startItemX;
        var yPos = startItemY;
        var itemCount = 0;
        var rowCount = 0;

        if(itemType == AT.TYPE_BAOBOI){
            yPos = yPos + 10;
        }
        else if(itemType == AT.TYPE_VATPHAM){
            yPos = yPos - 10;
        }

        if(listItem.length > 12) {
            yPos += 80;
        }
        else {
            startItemX -= 10;
        }

        for (var i = 0; i < listItem.length; i++) {
            var avatarInfo = listItem[i];
            var sprite = new BkSprite();
            var item = new BkItemInfo();
            if (this.shopItemsData) {
                item = this.shopItemsData.getItem(avatarInfo.itemID);
                item.Id = avatarInfo.itemID;
                item.RemainingDate = avatarInfo.RemainingDate;
                item.Type = avatarInfo.itemType;
            }

            if (item.itemType == itemType) {
                if(itemCount == 0 )
                {
                    xPos = startItemX + itemWidth / 2;
                    if(itemType == AT.TYPE_VATPHAM) xPos = startItemX + itemWidth / 2 - 10;
                    rowCount = 1;
                }
                else if(itemCount% SHOPPING_WINDOW_NUMBER_OF_COLUMNES == 0)
                {
                    // new row, increase Y , reset X
                    yPos = yPos - 97 - VV_SHOPPING_WINDOW_SPACE_ROW - 20;
                    xPos = startItemX + itemWidth / 2;
                    if(itemType == AT.TYPE_VATPHAM) xPos = startItemX + itemWidth / 2 - 10;
                    rowCount++;
                }
                else
                {
                    xPos = xPos + itemWidth + spaceX;
                }
                sprite = new VvShoppingItem(item, this, true, this.userInfo.userName);
                sprite.x = xPos;
                sprite.y = yPos;
                this.taiSanItemListSprite.addChild(sprite);
                itemCount++;
            }
        }

        if(listItem.length <= 12){
            this._TaiSanSprite.addChild(this.taiSanItemListSprite);
        }
        else {
            var SPACE_ROW = 30;
            var itemSize = 106;
            var containerHeight = rowCount * itemSize + (rowCount - 1)* SPACE_ROW;
            this.taiSanItemListSprite.setContentSize(550, containerHeight);
            this._windowSc = new BkScrollView(cc.size(620, 380), this.taiSanItemListSprite, this._TaiSanSprite, true);

            this._TaiSanSprite.addChild(this._windowSc);
            this._windowSc.y = 70;
            this._windowSc.x = -20;
            this._windowSc.setBeginY(-145);
            this._windowSc.configPos(610,260);
        }

    },
    updateArrowPos: function () {
        this.setSelectedTaiSanButtons(this.currentTaiSanType);
    },
    drawTaiSanTab: function () {
        this.cleanGUI();
        if (!this.userInfo) {
            Util.showAnim();
            BkLogicManager.getLogic().setOnLoadComplete(this);
            BkLogicManager.getLogic().DoGetAchievementPlayer(this.userInfo.userName);
            return;
        }
        this._TaiSanSprite.removeAllChildren();

        this.addChildBody(this._TaiSanSprite, 3);

        this.initTaiSanArea(WD_BODY_MARGIN_LR, this.getBodySize().height - 140);
    },
    getFullName: function () {
        if (!this.userInfo || !this.userInfo.fullname) {
            return BkConstString.STR_NO_INFO;
        }
        else {
            return Util.getFormatString(this.userInfo.fullname, 30);
        }
    },
    getGender: function () {
        if (this.userInfo.gender == 1) {
            return "Nữ";
        }
        else if (this.userInfo.gender == 0) {
            return "Nam";
        }else{
            return BkConstString.STR_NO_INFO;
        }
    },
    getBirthday: function () {
        if (!this.userInfo || !this.userInfo.birthDate || new Date(this.userInfo.birthDate) == "Invalid Date") {
            return BkConstString.STR_NO_INFO;
        }
        else {
            return BkTime.convertToLocalTime24h(this.userInfo.birthDate).substr(0, 10);
        }
    },
    getAddress: function () {
        if (!this.userInfo || !this.userInfo.homeTown) {
            return BkConstString.STR_NO_INFO;
        }
        else {
            return this.userInfo.homeTown;
        }
    },
    getEmail: function () {
        if (!this.userInfo || !this.userInfo.email) {
            return BkConstString.STR_NO_INFO;
        }
        else {
            return this.userInfo.email;
        }
    },
    requestListItemWithType: function (type) {
        var commonLogic = BkLogicManager.getLogic();
        commonLogic.setOnLoadComplete(this);
        commonLogic.DoGetPlayerItem(this.userInfo.userName, type, this.userInfo);
        Util.showAnim();
    },
    getStringNoItemWith: function (itemType) {
        var strNoItem = "";

        if (this.userInfo == null) {
            return strNoItem;
        }

        if (BkGlobal.UserInfo.getUserName() == this.userInfo.userName) {
            if (itemType == AT.TYPE_AVATAR) {
                strNoItem = BkConstString.STR_NO_AVATAR;
            }
            else if (itemType == AT.TYPE_VATPHAM) {
                strNoItem = BkConstString.STR_NO_VATPHAM;
            }
            else {
                strNoItem = BkConstString.STR_NO_BAOBOI;
            }
        } else {
            if (itemType == AT.TYPE_AVATAR) {
                strNoItem = "Người chơi này không có avatar nào.";
            }
            else if (itemType == AT.TYPE_VATPHAM) {
                strNoItem = "Người chơi này không có vật phẩm nào.";
            }
            else {
                strNoItem = "Người chơi này không có bảo bối nào.";
            }
        }

        return strNoItem;
    },
    cleanGUI: function () {
        if (this._ThongTinSprite) {
            this._ThongTinSprite.removeFromParent();
        }
        if (this._TaiSanSprite) {
            this._TaiSanSprite.removeFromParent();
        }
        if (this._CongTrangSprite) {
            this._CongTrangSprite.removeFromParent();
        }
    },
    setUserInfo: function (obj) {
        this.userInfo = obj;
    },
    removeSelf: function (){
        this._super();
        BkLogicManager.getLogic().setOnLoadComplete(null);
    },
    onExit: function () {
        this.sph.removeSpriteFramesFromFile(res.vv_trang_ca_nhan_plist);
        this.sph.removeSpriteFramesFromFile(res.vv_huan_chuong_plist);
        this.sph.removeSpriteFramesFromFile(res.vv_shopping_items_plist);
        this._super();
    }
});