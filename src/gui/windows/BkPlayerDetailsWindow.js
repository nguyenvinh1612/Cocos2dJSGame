/**
 * Created by VanChinh on 10/24/2015.
 */
MAX_RANK = 2000000000;
STR_NOT_RANKING = "Chưa xếp hạng";
UP_TS_ITEM_PER_PAGE = 6;
UP_TT_ITEM_PER_PAGE = 4;
BkPlayerDetailsWindow = BkTabWindow.extend({
    _tabList: ["Thông tin", "Thành tích"],
    userInfo: null,
    userInfoSprite: null,
    selectedAvatarId: null,
    avatarImg: null,
    avatarSelectionWindow: null,
    _ThongTinSprite: null,
    _TaiSanSprite: null,
    _ThanhTichSprite: null,
    arrowPosTaiSan: null,
    isLoadForChangeAvatar: null,
    currentTaiSanType: null,
    taiSanItemListSprite: null,
    thanhTichItemListSprite: null,
    shopItemsData: null,
    bgTaiSanItemList: null,
    bgTaiSanSize: null,
    bgThanhTichSize:null,
    btnHinhAnhTab: null,
    btnVatPhamTab: null,
    btnBaoBoiTab: null,
    isFriend: null,
    btnFriend: null,
    bgProfile: null,
    taiSanPageIndex: 0,
    thanhTichPageIndex:0,
    currentPageNum:1,
    btnChangePassword:null,
    lblUserName:null,

    lblMoney:null,

    ctor: function (userName, isFriend) {
        cc.spriteFrameCache.addSpriteFrames(res.leader_board_ss_plist, res.leader_board_ss_img);
        this._super("Trang cá nhân", cc.size(750, 470), this._tabList.length, this._tabList);
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
        this._ThanhTichSprite = new BkSprite();
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
                if (this.btnFriend != null){
                    this.btnFriend.removeFromParent();
                }
                showToastMessage("Đã gửi lời mời kết bạn tới: " + this.userInfo.userName, winSize.width / 2- 100, winSize.height / 2 + 50);
                break;
            case c.NETWORK_REMOVE_FRIEND_SUCCESS:
                winSize = cc.director.getWinSize();
                showToastMessage("Đã xóa " + this.userInfo.userName + " khỏi danh sách bạn.", winSize.width / 2- 100, winSize.height / 2 + 50);
                if (this.btnFriend != null){
                    this.btnFriend.setTitleText("Kết bạn");
                }

                this.isFriend = false;
                var parent = this.getParentWindow();
                if(parent instanceof  BkFriendsWindow){
                    parent.removeAddedFriendList();
                }
                break;
            case c.NETWORK_PLAYER_ITEMS_RETURN:
                Util.removeAnim();
                this.drawTaiSanListItems(obj, this.currentTaiSanType);
                break;
            case c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN:
                this.setUserInfo(obj);
                this.drawThanhTichTab();
                Util.removeAnim();
                break;
            case c.NETWORK_SELECT_AVATAR_SUCCESS:
                if(this.avatarSelectionWindow) this.avatarSelectionWindow.removeSelf();
                this.avatarImg.initWithSpriteFrameName(BkAvartarImg.getImageNameFromID(this.selectedAvatarId));
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
            this.drawThanhTichTab();
        }
    },

    drawThongTinTab: function () {
        this.cleanGUI();
        this.visibleBodyContent(false);
        if (this.userInfo == null) return;
        this._ThongTinSprite.removeAllChildren();
        this._TaiSanSprite.removeAllChildren();
        var startX = WD_BODY_MARGIN_LR + 35;
        var startY = this.getBodySize().height - WD_BODY_MARGIN_TB - 10;

        var bgProfileSize = cc.size(this.getBodySize().width - WD_BODY_MARGIN_LR * 2, (this.getBodySize().height - (WD_BODY_MARGIN_TB * 2)) / 2);
        this.bgProfile = new cc.DrawNode();
        var bgColor = cc.color(18, 37, 98);
        this.bgProfile.drawRect(cc.p(0, 0), cc.p(bgProfileSize.width, bgProfileSize.height + 20),bgColor, 0, bgColor);
        this.bgProfile.x = WD_BODY_MARGIN_LR;
        this.bgProfile.y = bgProfileSize.height + 5;
        this._ThongTinSprite.addChild(this.bgProfile, -1);

        this.initProfileArea(startX, startY);
        this.initThongTinCaNhanArea(bgProfileSize.width / 2 + WD_BODY_MARGIN_LR, startY);

        var bgTaiSan = new cc.DrawNode();
        bgTaiSan.drawRect(cc.p(0, 0), cc.p(bgProfileSize.width, bgProfileSize.height-10), bgColor, 0, bgColor);
        bgTaiSan.x = WD_BODY_MARGIN_LR;
        bgTaiSan.y = 0;
        this._ThongTinSprite.addChild(bgTaiSan, -1);

        this.initTaiSanArea(WD_BODY_MARGIN_LR, bgProfileSize.height - 25);

        this.addChildBody(this._ThongTinSprite);
        this.addChildBody(this._TaiSanSprite);
    },

    initProfileArea: function (startX, startY) {
        var underBG = new BkSprite("#" + res_name.bg_profile);
        underBG.x = 192.5;
        underBG.y = 293.5;
        this._ThongTinSprite.addChild(underBG);

        // Avatar area background
        var avatarBg = BkAvartarImg.getVatphamBackground(false);
        avatarBg.x = startX + avatarBg.getContentSize().width / 2;
        avatarBg.y = startY - avatarBg.getContentSize().height / 2 - WD_BODY_MARGIN_TB + 0.5;
        this._ThongTinSprite.addChild(avatarBg);

        // Avatar image
        this.avatarImg = BkAvartarImg.getImageFromID(this.userInfo.avatarID);
        this.selectedAvatarId = this.userInfo.avatarID;
        if (this.avatarImg != null) {
            this.avatarImg.x = avatarBg.x;
            this.avatarImg.y = avatarBg.y;
        }
        this._ThongTinSprite.addChild(this.avatarImg);

        var self = this;

        if (this.userInfo.userName == BkGlobal.UserInfo.getUserName()) {
            // allow click to change avatar

            this.avatarImg.setMouseOnHover(function () {
                // mouse hover: show tooltip
            }, function () {
                // mouse out: hide tooltip
            });
            this.avatarImg.setOnlickListenner(function () {
                if (self.userInfoSprite) self.userInfoSprite.backToViewMode();
                var listAvatars = BkGlobal.UserInfo.listAvatar;
                var avatarSelectWD = new BkAvatarSelectionWindow(listAvatars, self);
                avatarSelectWD.setParentWindow(self);
                avatarSelectWD.showWithParent();
            });
        }
        var beginProfileDescX = avatarBg.x + avatarBg.width / 2 + 10;
        // Name
        this.lblUserName = new BkLabel(this.userInfo.userName, "", 16, true);
        this.lblUserName.setTextColor(BkColor.DEFAULT_TEXT_COLOR);
        this.lblUserName.x = beginProfileDescX + this.lblUserName.getContentSize().width / 2 + 5.5;
        this.lblUserName.y = avatarBg.y + this.lblUserName.getContentSize().height / 2 + 20;
        this._ThongTinSprite.addChild(this.lblUserName);

        var iconMoneny = new BkSprite("#" + res_name.top_goldcoin);
        this._ThongTinSprite.addChild(iconMoneny);
        iconMoneny.x = beginProfileDescX + iconMoneny.width / 2 + 5;
        iconMoneny.y = avatarBg.y - 4;

        // Money
        this.lblMoney = new BkLabel("", "", 14);
        this.lblMoney.setString(formatNumber(this.userInfo.playerMoney));
        this.lblMoney.setTextColor(cc.color(255,255,0));
        this.lblMoney.x = iconMoneny.x + iconMoneny.width / 2 + this.lblMoney.getContentSize().width / 2 + 5;
        this.lblMoney.y = avatarBg.y - 3;
        this._ThongTinSprite.addChild(this.lblMoney);

        var lblMoneyDescription = new BkLabel(BkLevelImage.getStringFromMoney(this.userInfo.playerMoney), "", 14);
        lblMoneyDescription.x = beginProfileDescX + lblMoneyDescription.getContentSize().width / 2 + 5;
        lblMoneyDescription.y = this.lblMoney.y - 27;
        this._ThongTinSprite.addChild(lblMoneyDescription);

        if (this.userInfo.userName == BkGlobal.UserInfo.getUserName()) {
            this.btnChangePassword = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
            this.btnChangePassword.setTitleText("Đổi mật khẩu");
            this.btnChangePassword.setTitleFontSize(12);
            this.btnChangePassword.x = startX + this.btnChangePassword.width / 2;
            this.btnChangePassword.y = avatarBg.y - avatarBg.width / 2 - this.btnChangePassword.height / 2 - 20;
            this._ThongTinSprite.addChild(this.btnChangePassword);

            this.btnChangePassword.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        if (self.userInfoSprite) self.userInfoSprite.backToViewMode();
                        // show update password window
                        var isCreatePass = (BkGlobal.isFbCreateablePass || BkGlobal.isLoginFacebook)
                        var updatePassWD = new BkUpdatePasswordWindow(isCreatePass);
                        updatePassWD.setParentWindow(self);
                        updatePassWD.showWithParent();
                    }
                },
                this);
            this.initBtnFbUserSetup();
           /* if (BkGlobal.isLoginFacebook) {
                this.btnChangePassword.visible = false;
                this.initBtnFbUserSetup();
                //BkFacebookMgr.doFbLCheckSetup();
                //Util.showAnim();
            }*/
        }
        else if (this.isFriend != null) {
            var btnSendMail = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
            btnSendMail.setTitleText("Gửi thư");
            btnSendMail.setZoomScale(0);
            btnSendMail.x = startX + btnSendMail.width / 2;
            btnSendMail.y = avatarBg.y - avatarBg.width / 2 - btnSendMail.height / 2 - 20;
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

            this.btnFriend = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
            if (this.isFriend === true) {
                this.btnFriend.setTitleText("Xóa bạn");
            }
            else if (this.isFriend === false) {
                this.btnFriend.setTitleText("Kết bạn");
            }
            this.btnFriend.setZoomScale(0);
            this.btnFriend.x = btnSendMail.x + btnSendMail.width + 10;
            this.btnFriend.y = btnSendMail.y;
            this._ThongTinSprite.addChild(this.btnFriend);

            this.btnFriend.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        var packet = new BkPacket();
                        BkLogicManager.getLogic().setOnLoadComplete(self);

                        if (this.isFriend === true) {
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
    initBtnFbUserSetup: function () {
        this.setChangePassBtnState(BkGlobal.isFbCreateablePass);

        var self = this;
        var updateNameFnc = function () {
            if(self.lblUserName != undefined){
                self.lblUserName.setString(BkGlobal.UserInfo.getUserName());
            }
        };
        if (BkGlobal.isFbLinkable) {
            var btnLinkUserFb = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
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
            var btnRenameUserFb = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Normal, res_name.BtnDialog_Hover);
            btnRenameUserFb.setTitleText("Đổi tên");
            btnRenameUserFb.setTitleFontSize(12);
            btnRenameUserFb.x = this.btnChangePassword.x + this.btnChangePassword.width / 2 + btnRenameUserFb.width / 2 + 10;
            if (btnLinkUserFb) {
                btnRenameUserFb.x = btnLinkUserFb.x + btnLinkUserFb.width / 2 + btnRenameUserFb.width / 2 + 10;
            }
            btnRenameUserFb.y = this.btnChangePassword.y;
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
                    }
                },
                this);
        }
    },

    setChangePassBtnState: function (btnState) {
/*
        if(!this.btnChangePassword){
            return;
        }
        if (BkGlobal.isLoginFacebook) {
            this.btnChangePassword.visible = false;
            return;
        }
*/
        if (btnState)
        {
            this.btnChangePassword.setTitleText("Tạo mật khẩu");
        } else {
            this.btnChangePassword.setTitleText("Đổi mật khẩu");
           // this.btnChangePassword.visible = false;
        }
        this.btnChangePassword.setEnableButton(true);
    },

    initThongTinCaNhanArea: function (startX, startY) {

        //var lineSperate = new BkSprite("#" + res_name.line_big_h);
        //lineSperate.x = this.getBodySize().width / 2;
        //lineSperate.y = this.getBodySize().height - lineSperate.height + 10;
        //this._ThongTinSprite.addChild(lineSperate);

        var lblThongTinCaNhan = new BkLabel("Thông tin cá nhân", "", 16, true);
        lblThongTinCaNhan.setTextColor(cc.color(4, 241, 232));
        lblThongTinCaNhan.x = this.getBodySize().width / 2 + lblThongTinCaNhan.getContentSize().width / 2 + 5;
        lblThongTinCaNhan.y = startY - WD_BODY_MARGIN_TB + 10;
        this._ThongTinSprite.addChild(lblThongTinCaNhan);

        // Thong tin ca nhan - content
        this.userInfoSprite = new BkUserInfoSprite(this.userInfo, this);
        this.userInfoSprite.x = this.getBodySize().width / 2 + 10;
        this.userInfoSprite.y = this.bgProfile.y - 45;
        this._ThongTinSprite.addChild(this.userInfoSprite);

        if (this.userInfo.userName != BkGlobal.UserInfo.userName) {
            this.userInfoSprite.y = this.userInfoSprite.y - 10;
            lblThongTinCaNhan.y = lblThongTinCaNhan.y - 5;
        }
    },

    initTaiSanArea: function (startX, startY) {
        //Tab Menu Button
        var btnPaddingX = 20;
        this.btnHinhAnhTab = new BkLabel("Hình ảnh", "", 15);
        this.btnHinhAnhTab.setColor(cc.color.WHITE);
        this.btnHinhAnhTab.setName(AT.TYPE_AVATAR);
        this.btnHinhAnhTab.x = startX + this.btnHinhAnhTab.width / 2 + btnPaddingX + 5;
        this.btnHinhAnhTab.y = startY - 3;
        this._ThongTinSprite.addChild(this.btnHinhAnhTab);

        var lineSperate = new BkSprite("#" + res_name.line_medium_h);
        lineSperate.scaleY = 0.6;
        lineSperate.x = this.btnHinhAnhTab.x + this.btnHinhAnhTab.width / 2 + btnPaddingX - 0.5;
        lineSperate.y = this.btnHinhAnhTab.y - 2;
        this._ThongTinSprite.addChild(lineSperate);

        this.btnVatPhamTab = new BkLabel("Vật phẩm", "", 15);
        this.btnVatPhamTab.setName(AT.TYPE_VATPHAM);
        this.btnVatPhamTab.setColor(cc.color(119, 223, 224));
        this.btnVatPhamTab.x = lineSperate.x + this.btnVatPhamTab.width / 2 + btnPaddingX;
        this.btnVatPhamTab.y = this.btnHinhAnhTab.y;
        this._ThongTinSprite.addChild(this.btnVatPhamTab);

        var lineSperate2 = new BkSprite("#" + res_name.line_medium_h);
        lineSperate2.scaleY = 0.6;
        lineSperate2.x = this.btnVatPhamTab.x + this.btnVatPhamTab.width / 2 + btnPaddingX;
        lineSperate2.y = this.btnHinhAnhTab.y - 2;
        this._ThongTinSprite.addChild(lineSperate2);

        this.btnBaoBoiTab = new BkLabel("Bảo bối", "", 15);
        this.btnBaoBoiTab.setName(AT.TYPE_BAOBOI);
        this.btnBaoBoiTab.setColor(cc.color(119, 223, 224));
        this.btnBaoBoiTab.x = lineSperate2.x + this.btnBaoBoiTab.width / 2 + btnPaddingX;
        this.btnBaoBoiTab.y = this.btnHinhAnhTab.y;
        this._ThongTinSprite.addChild(this.btnBaoBoiTab);

        var self = this;
        var btnEventHoverClick = this.createHoverEvent(
            function (event) {
                var target = event.getCurrentTarget();
                if (self.currentTaiSanType != target.getName()) {
                    target.setColor(cc.color.WHITE);
                }
            }, function (event) {
                var target = event.getCurrentTarget();
                if (self.currentTaiSanType != target.getName()) {
                    target.setColor(cc.color(119, 223, 224));
                }
            }, function (event) {
                var location = event.getLocation();
                var target = event.getCurrentTarget();
                if (cc.rectContainsPoint(target.getBoundingBoxToWorld(), location)) {
                    target.setColor(cc.color.WHITE);
                    self.taiSanPageIndex = 0;
                    self.currentPageNum = 1;
                    self.loadTaiSanList(target.getName(), target);
                    logMessage("btnEventHoverClick" + target.getString());
                }
            });
        cc.eventManager.addListener(btnEventHoverClick, this.btnHinhAnhTab);
        cc.eventManager.addListener(btnEventHoverClick.clone(), this.btnVatPhamTab);
        cc.eventManager.addListener(btnEventHoverClick.clone(), this.btnBaoBoiTab);

        this.arrowPosTaiSan = new BkSprite("#" + res_name.arrow_pos);
        this.arrowPosTaiSan.visible = false;
        this._ThongTinSprite.addChild(this.arrowPosTaiSan, 1);
        var startItemX = WD_BODY_MARGIN_LR * 2;
        this.bgTaiSanSize = cc.size(this.getBodySize().width - startItemX * 2, 125);
        this.bgTaiSanItemList = new cc.Scale9Sprite(res_name.Body_Content_Window);
        this.bgTaiSanItemList.setContentSize(this.bgTaiSanSize.width, this.bgTaiSanSize.height);
        //this.bgTaiSanItemList.drawRect(cc.p(0, 0), cc.p(this.bgTaiSanSize.width, this.bgTaiSanSize.height), BkColor.BG_PANEL_COLOR, 1, BkColor.BG_PANEL_BORDER_COLOR);
        this.bgTaiSanItemList.x = this.getBodySize().width/2;
        this.bgTaiSanItemList.y = this.bgTaiSanItemList.getContentSize().height/2 + 10 - 0.5;
        this._ThongTinSprite.addChild(this.bgTaiSanItemList, -1);
        this.taiSanPageIndex = 0;
        this.loadTaiSanList(AT.TYPE_AVATAR);
    },

    loadTaiSanList: function (taiSanIndex) {
        if (this.shopItemsData == null) {
            this.shopItemsData = new BkShoppingItemsData();
        }
        this.currentTaiSanType = taiSanIndex;
        switch (taiSanIndex) {
            //Vat pham
            case AT.TYPE_VATPHAM:
                if (this.userInfo.listVatPham != null) {
                    this.drawTaiSanListItems(this.userInfo.listVatPham, AT.TYPE_VATPHAM);
                } else {
                    this.requestListItemWithType(AT.TYPE_VATPHAM);
                }
                break;
            //Bao boi
            case AT.TYPE_BAOBOI:
                if (this.userInfo.listBaoBoi != null) {
                    this.drawTaiSanListItems(this.userInfo.listBaoBoi, AT.TYPE_BAOBOI);
                } else {
                    this.requestListItemWithType(AT.TYPE_BAOBOI);
                }
                break;
            //Avatar
            default :
                this.currentTaiSanType = AT.TYPE_AVATAR;
                if (this.userInfo.listAvatar != null) {
                    this.drawTaiSanListItems(this.userInfo.listAvatar, AT.TYPE_AVATAR);
                } else if(this.userInfo.getUserName().toLowerCase() != BkGlobal.UserInfo.getUserName().toLowerCase()){
                    this.requestListItemWithType(AT.TYPE_AVATAR);
                }
                break;
        }
    },

    drawTaiSanListItems: function (listItem, itemType) {
        this.updateArrowPos();
        var startItemX = WD_BODY_MARGIN_LR * 2;
        var startItemY = WD_BODY_MARGIN_TB * 4 - 5;
        if (this.taiSanItemListSprite != null) {
            this.taiSanItemListSprite.removeSelf();
            this.taiSanItemListSprite = null;
        }
        this.taiSanItemListSprite = new BkSprite();
        this.taiSanItemListSprite.x = 0 + 7;
        this.taiSanItemListSprite.y = 0;
        //No item msg
        if (listItem.length == 0) {
            var lblNoItem = new BkLabel("", "Arial", 14);
            lblNoItem.setString(this.getStringNoItemWith(itemType));
            lblNoItem.x = WD_BODY_MARGIN_LR * 2 + lblNoItem.getContentSize().width / 2 + WD_BODY_MARGIN_LR;
            lblNoItem.y = startItemY;
            this.taiSanItemListSprite.addChild(lblNoItem);
            this._TaiSanSprite.addChild(this.taiSanItemListSprite);
            return;
        }

        var pageNumber = Math.floor((listItem.length + UP_TS_ITEM_PER_PAGE - 1) / UP_TS_ITEM_PER_PAGE);

        var itemWidth = 97;
        var spaceX = 5;
        var xPos = startItemX * 3 - WD_BODY_MARGIN_LR / 2;
        var yPos = startItemY - 6;
        var beginPageIdx = this.taiSanPageIndex;

        if (pageNumber > 1) {
            var self = this;
            var btnPrevious = Util.createBtnNav(res_name.btn_back_small, function () {
                if(self.currentPageNum <= pageNumber){
                    self.currentPageNum -=1;
                    if(self.currentPageNum < 1) {
                        self.currentPageNum = pageNumber;
                    }
                    self.taiSanPageIndex = self.currentPageNum * UP_TS_ITEM_PER_PAGE - UP_TS_ITEM_PER_PAGE;

                }else{
                    self.currentPageNum -= 1;
                    self.taiSanPageIndex = 0;
                }
                self.loadTaiSanList(self.currentTaiSanType);
            });
            btnPrevious.x = startItemX + btnPrevious.width - 3;
            btnPrevious.y = yPos - 8;
            this.taiSanItemListSprite.addChild(btnPrevious);
            var btnNext = Util.createBtnNav(res_name.btn_next_small, function () {
                if(self.currentPageNum >= pageNumber){
                    self.currentPageNum = 1;
                    self.taiSanPageIndex = 0;
                }else{
                    self.currentPageNum += 1;
                    self.taiSanPageIndex = self.currentPageNum * UP_TS_ITEM_PER_PAGE - UP_TS_ITEM_PER_PAGE;
                }
                self.loadTaiSanList(self.currentTaiSanType);
            });
            btnNext.x = this.getBodySize().width - WD_BODY_MARGIN_LR * 3 - 3;
            btnNext.y = yPos - 8;
            this.taiSanItemListSprite.addChild(btnNext);
        }
        for (var i = beginPageIdx; i < listItem.length;i++) {
            var avatarInfo = listItem[i];
            var sprite = new BkSprite();
            var item = new BkItemInfo();
            if (this.shopItemsData != null) {
                item = this.shopItemsData.getItem(avatarInfo.itemID);
                item.Id = avatarInfo.itemID;
                item.RemainingDate = avatarInfo.RemainingDate;
                item.Type = avatarInfo.itemType;
            }

            if (item.itemType == itemType) {
                if (i % UP_TS_ITEM_PER_PAGE == 0) {
                    if (i >= beginPageIdx + UP_TS_ITEM_PER_PAGE) {
                        this.taiSanPageIndex = i;
                        break;
                    }
                }else {
                    xPos = xPos + itemWidth + spaceX;
                }
                sprite = new BkShoppingItem(item, this, true, this.userInfo.userName);
                sprite.x = xPos;
                sprite.y = yPos;
                this.taiSanItemListSprite.addChild(sprite);
            }
        }

        this._TaiSanSprite.addChild(this.taiSanItemListSprite);
    },

    updateArrowPos: function () {
        var posTarget = null;
        switch (this.currentTaiSanType) {
            case AT.TYPE_AVATAR:
                posTarget = this.btnHinhAnhTab;
                break;
            case AT.TYPE_VATPHAM:
                posTarget = this.btnVatPhamTab;
                break;
            case AT.TYPE_BAOBOI:
                posTarget = this.btnBaoBoiTab;
                break;
        }
        if(posTarget) {
            this.arrowPosTaiSan.x = posTarget.x - 0.5;
            this.arrowPosTaiSan.y = this.bgTaiSanItemList.y + this.bgTaiSanItemList.getContentSize().height/2 + this.arrowPosTaiSan.height / 2 - 5;
            this.arrowPosTaiSan.visible = true;
        }
    },

    drawThanhTichTab: function () {
        this.cleanGUI();
        if (this.userInfo && !this.userInfo.playerAchievements) {
            Util.showAnim();
            BkLogicManager.getLogic().setOnLoadComplete(this);
            BkLogicManager.getLogic().DoGetAchievementPlayer(this.userInfo.userName);
            return;
        }

        this.visibleBodyContent(true);
        this._ThanhTichSprite.removeAllChildren();
        this.currentPageNum = 1;
        this.thanhTichPageIndex = 0;

        var startX = (WD_BODY_MARGIN_LR + 30);
        var startY = WD_BODY_MARGIN_TB * 2 + WD_BODY_MARGIN_TB;
        this.bgThanhTichSize = cc.size(this.getBodySize().width - startX * 2, this.getBodySize().height - startY);
        var bgThanhTich = new cc.DrawNode();
        bgThanhTich.drawRect(cc.p(0, 0), cc.p(this.bgThanhTichSize.width, this.bgThanhTichSize.height), cc.color(14, 100, 147), 0, cc.color(66, 167, 221));
        bgThanhTich.x = startX;
        bgThanhTich.y = WD_BODY_MARGIN_TB;
        if(this.userInfo.playerAchievements.length > 0) {
            //this._ThanhTichSprite.addChild(bgThanhTich, -1);
        }

        this.drawThanhTichItem();
        this.addChildBody(this._ThanhTichSprite, 3);
    },

    drawThanhTichItem: function () {
        if (this.thanhTichItemListSprite != null) {
            this.thanhTichItemListSprite.removeSelf();
            this.thanhTichItemListSprite = null;
        }
        this.thanhTichItemListSprite = new BkSprite();
        this.thanhTichItemListSprite.x = WD_BODY_MARGIN_LR*4;
        this.thanhTichItemListSprite.y = WD_BODY_MARGIN_TB;
        var archieveList = this.userInfo.playerAchievements;
        if(archieveList.length == 0) {
            var archieveMsg = "Bạn chưa đạt được thành tích nào, hãy chọn 1 game để bắt đầu chơi";
            if (this.userInfo.userName != BkGlobal.UserInfo.getUserName()) {
                var archieveMsg = "Người chơi hiện chưa có thành tích nào.";
            }
            var lblNoItem = new BkLabel(archieveMsg, "", 16);
            lblNoItem.x = WD_BODY_MARGIN_LR + lblNoItem.getContentSize().width/2;
            lblNoItem.y = this.getBodySize().height/2;
            this.thanhTichItemListSprite.addChild(lblNoItem);
            this._ThanhTichSprite.addChild(this.thanhTichItemListSprite);
            return;
        }
        var pageNumber = Math.floor((archieveList.length + UP_TT_ITEM_PER_PAGE - 1) / UP_TT_ITEM_PER_PAGE);

        if (pageNumber > 1) {
            var self = this;
            var btnPrevious = Util.createBtnNav(res_name.btn_back_small, function () {
                if(self.currentPageNum <= pageNumber){
                    self.currentPageNum -=1;
                    if(self.currentPageNum < 1) {
                        self.currentPageNum = pageNumber;
                    }
                    self.thanhTichPageIndex = self.currentPageNum * UP_TT_ITEM_PER_PAGE - UP_TT_ITEM_PER_PAGE;
                }else{
                    self.currentPageNum -= 1;
                    self.thanhTichPageIndex = 0;
                }
                self.drawThanhTichItem();
            });
            btnPrevious.x = -WD_BODY_MARGIN_LR * 2 - btnPrevious.width / 2;
            btnPrevious.y = this.bgThanhTichSize.height / 2;
            this.thanhTichItemListSprite.addChild(btnPrevious);
            var btnNext = Util.createBtnNav(res_name.btn_next_small, function () {
                if(self.currentPageNum >= pageNumber){
                    self.currentPageNum = 1;
                    self.thanhTichPageIndex = 0;
                }else{
                    self.currentPageNum += 1;
                    self.thanhTichPageIndex = self.currentPageNum * UP_TT_ITEM_PER_PAGE - UP_TT_ITEM_PER_PAGE;
                }
                //self.currentPageNum += 1;
                self.drawThanhTichItem();
            });
            btnNext.x = btnNext.width / 2 + this.bgThanhTichSize.width - 25;
            btnNext.y = this.bgThanhTichSize.height / 2;
            this.thanhTichItemListSprite.addChild(btnNext);
        }

        var posYItem = this.getBodySize().height - WD_BODY_MARGIN_TB*2 + 29;
        var beginItemIdex = this.thanhTichPageIndex;
        for (var i = beginItemIdex; i < archieveList.length; i++) {
            //Check new page
            if (i % UP_TT_ITEM_PER_PAGE == 0) {
                if (i >= beginItemIdex + UP_TT_ITEM_PER_PAGE) {
                    this.thanhTichPageIndex = i;
                    break;
                }
            }
            var playerArchive = archieveList[i];
            var isEndOfLine = i+1 == UP_TT_ITEM_PER_PAGE || i+1 == archieveList.length;
            var archiveSp = new BkPlayerAchievementItem(playerArchive, posYItem, this, isEndOfLine);
            posYItem = archiveSp.y;

            this.thanhTichItemListSprite.addChild(archiveSp);
        }
        this._ThanhTichSprite.addChild(this.thanhTichItemListSprite);
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
        if (this._ThongTinSprite != null) {
            this._ThongTinSprite.removeFromParent();
        }
        if (this._TaiSanSprite != null) {
            this._TaiSanSprite.removeFromParent();
        }
        if (this._ThanhTichSprite != null) {
            this._ThanhTichSprite.removeFromParent();
        }
    },
    setUserInfo: function (obj) {
        this.userInfo = obj;
    },
    removeSelf: function (){
        this._super();
        BkLogicManager.getLogic().setOnLoadComplete(null);
    }
});