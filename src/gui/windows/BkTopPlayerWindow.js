/**
 * Created by hoangthao on 26/10/2015.
 */
BkTopPlayerWindow = BkTabWindow.extend({
    _tabList: ["Dẫn đầu", "Đang lên"],
    playerListSprite:null,
    topProfileSprite:null,
    currentProfileSprite:null,
    topGameData:null,
    badgesPos:null,

    ctor: function (data) {
        if (data == undefined) {
            data = new BkLeaderBoardData(Util.getGameIdToLeaderBoardId(BkGlobal.currentGameID), "");
        }
        var titleWd = data.typeName != "" ? data.typeName + " - " + data.gameName : data.gameName;
        this.topGameData = data;

        cc.spriteFrameCache.addSpriteFrames(res.leader_board_ss_plist, res.leader_board_ss_img);

        this._super(this.upperFirstAllWords(titleWd), cc.size(930, 590), this._tabList.length, this._tabList);
        this.initBaseWindow();
    },

    upperFirstAllWords: function (str) {
        var pieces = str.split(" ");
        for (var i = 0; i < pieces.length; i++) {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1);
        }
        return pieces.join(" ");
    },

    initBaseWindow: function () {
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this.setVisibleBottom(false);
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        this.visibleBodyContent(false);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
        this.configPosButton(125);
        var bgWd = new BkSprite("#"+res_name.popup_top_by_game_bg);
        bgWd.x = this.getWindowSize().width/2 - 0.5;
        bgWd.y = this.getWindowSize().height/2;
        this.addChildBody(bgWd, WD_ZORDER_BODY);

        this._btnClose.loadTextures(res_name.BtnClose_Window,res_name.BtnClose_Window,res_name.BtnClose_Window,res_name.BtnClose_Window_hover,ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x = this._btnClose.x - 24;
        this._btnClose.y = this._btnClose.y - 46;
        this._windowTitle.setFontSize(22);
        this._windowTitle.x = this._windowTitle.x + this._windowTitle.getContentSize().width/2;
        this._windowTitle.y = this._windowTitle.y - 30;
        this._windowTitle.setVisible(true);
        var logoGame = new BkSprite("#top_game_icon_" + this.topGameData.type + ".png");
        this.addChildBody(logoGame, WD_ZORDER_TOP);
        logoGame.x = this._windowTitle.x - this._windowTitle.getContentSize().width/2 - logoGame.width/2 - 38;
        logoGame.y = this.getWindowSize().height - logoGame.height/2 - 23;
    },

    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case c.NETWORK_GET_TOP_PLAYER_RETURN:
                this.drawTopPlayer(o.playerList);
                this.drawCurUserAchievement(o.mySelf);
                break;
            case c.NETWORK_GET_TOP_RICHEST_PLAYER_RETURN:
                this.drawTopPlayer(o.richestPlayerList);
                this.drawCurUserAchievement(o.mySelf);
                break;
            case c.NETWORK_PROFILE_RETURN:
                this.drawTop3Profile(o);
                break;
            case c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN:
                this.draw1StPlayerDetail(o.playerAchievements);
                break;
        }
        Util.removeAnim();
    },
    selectedTabEvent: function (sender, tabIndex) {
        this.DrawUIWithTab(tabIndex);

    },

    DrawUIWithTab: function (i) {
        this.initHandleonLoadComplete();
        if (i == 1) {
            this.requestTopPlayer(this.topGameData.type,2);
        }
        else if (i == 2) {
            this.requestTopPlayer(this.topGameData.type,1);
        }
    },

    drawTopPlayer: function (topPlayerList) {
        if (topPlayerList.length == 0) {
            return;
        }

        if (this.playerListSprite) {
            this.playerListSprite.removeSelf();
            this.playerListSprite = null;
        }
        this.playerListSprite = new BkSprite();
        this.playerListSprite.x = this.getBodySize().width / 2 -2;
        this.playerListSprite.y = this.getBodySize().height / 2 - 35;
        this.addChildBody(this.playerListSprite);

        this.drawTop3Profile(topPlayerList);

        //Remove top 3 above
        topPlayerList.splice(0,3);

        var rowH = this.getBodySize().height / 2 + WD_BODY_MARGIN_TB/2 - 12;

        for (var i = 0; i < topPlayerList.length; i++) {
            var item = topPlayerList[i];
            var isEndOfRow = i == (topPlayerList.length - 1);
            var displayObject = new BkTopPlayerItem(item, cc.p(0, rowH), isEndOfRow, this);
            rowH = displayObject.y;
            this.playerListSprite.addChild(displayObject);
        }
    },

    drawTop3Profile: function (topPlayer) {
        var paddingTextLeft = 16;
        if(topPlayer.length < 3){
            return;
        }
        if (this.topProfileSprite) {
            this.topProfileSprite.removeSelf();
            this.topProfileSprite = null;
        }
        this.topProfileSprite = new BkSprite();
        this.addChildBody(this.topProfileSprite);
        this.topProfileSprite.x = 0;
        this.topProfileSprite.y = 0;

        var drawRank1 = new BkSprite("#"+res_name.top_1st);
        drawRank1.x = WD_BODY_MARGIN_LR*5;
        drawRank1.y = this.getWindowSize().height - 140;
        this.topProfileSprite.addChild(drawRank1);
        this.badgesPos = cc.p(drawRank1.x, drawRank1.y);

        var top1Data = topPlayer[0];
        var lbPlayerName1 = new BkLabel(top1Data.getUserName(), "", 15, true);
        lbPlayerName1.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        lbPlayerName1.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        lbPlayerName1.x = drawRank1.x + drawRank1.getContentSize().width/2 + lbPlayerName1.getContentSize().width/2+ paddingTextLeft;
        lbPlayerName1.y = drawRank1.y;
        this.topProfileSprite.addChild(lbPlayerName1);

        var top1Sp = this.createTopPlayer(top1Data, 1);
        this.topProfileSprite.addChild(top1Sp);
        top1Sp.x = drawRank1.x + WD_BODY_MARGIN_LR *2;
        top1Sp.y = drawRank1.y - WD_BODY_MARGIN_TB *2;

        BkLogicManager.getLogic().setOnLoadComplete(this);
        BkLogicManager.getLogic().DoGetAchievementPlayer(top1Data.userName);


        var drawRank2 = new BkSprite("#"+res_name.top_2rd);
        drawRank2.x = drawRank1.x;
        drawRank2.y = drawRank1.y - drawRank1.height/2 - drawRank2.height - 113;
        this.topProfileSprite.addChild(drawRank2);

        var top2Data = topPlayer[1];
        var lbPlayerName2 = new BkLabel(top2Data.getUserName(), "", 15, true);
        lbPlayerName2.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        lbPlayerName2.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        lbPlayerName2.x = drawRank2.x + drawRank2.getContentSize().width/2 + lbPlayerName2.getContentSize().width/2 + paddingTextLeft + 5;
        lbPlayerName2.y = drawRank2.y + 6;
        this.topProfileSprite.addChild(lbPlayerName2);

        var top2Sp = this.createTopPlayer(top2Data, 2);
        this.topProfileSprite.addChild(top2Sp);
        top2Sp.x = top1Sp.x;
        top2Sp.y = drawRank2.y - drawRank2.height/2;

        var drawRank3 = new BkSprite("#"+res_name.top_3rd);
        drawRank3.x = drawRank1.x;
        drawRank3.y = drawRank2.y - drawRank2.height/2 - drawRank3.height - 50;
        this.topProfileSprite.addChild(drawRank3);

        var top3Data = topPlayer[2];
        var lbPlayerName3 = new BkLabel(top3Data.getUserName(), "", 15, true);
        lbPlayerName3.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        lbPlayerName3.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        lbPlayerName3.x = drawRank3.x + drawRank3.getContentSize().width/2 + lbPlayerName3.getContentSize().width/2 + paddingTextLeft + 5;
        lbPlayerName3.y = drawRank3.y + 6;
        this.topProfileSprite.addChild(lbPlayerName3);

        var top3Sp = this.createTopPlayer(top3Data, 3);
        this.topProfileSprite.addChild(top3Sp);
        top3Sp.x = top2Sp.x;
        top3Sp.y = drawRank3.y - drawRank3.height/2;
    },

    createTopPlayer: function (topPlayer, rank) {
        var topSp = new BkSprite();
        var avatarScale = 54/72;
        var textFont = 14;
        var avatarBg = BkAvartarImg.getAvatarBg(true);
        avatarBg.x = avatarBg.getContentSize().width / 2 + 0.5;
        avatarBg.y = avatarBg.getContentSize().height / 2 - 54;
        topSp.addChild(avatarBg);

        // Avatar image
        var avatarImg = BkAvartarImg.getAvatarByID(topPlayer.getAvatarId());
        if (avatarImg != null)
        {
            avatarImg.setScale(avatarScale);
            avatarImg.x = avatarBg.x;
            avatarImg.y = avatarBg.y;
        }
        topSp.addChild(avatarImg);
        avatarImg.setMouseOnHover();
        var self = this;
        avatarImg.setOnlickListenner(function () {
            var layer = new BkPlayerDetailsWindow(topPlayer.getUserName(), topPlayer.getIsFriend());
            layer.setParentWindow(self);
            layer.showWithParent();
        });
        var beginProfileDescX = avatarBg.x + avatarBg.width / 2 + 10;
        var paddingItemY = 3;
        var name1StPosX = beginProfileDescX;

        var iconMoney = new BkSprite("#" + res_name.top_goldcoin);
        topSp.addChild(iconMoney);
        iconMoney.x = beginProfileDescX + iconMoney.width / 2;
        iconMoney.y = avatarBg.y + 18;

        // Money
        var lblMoney = new BkLabel("", "Tahoma", textFont);
        lblMoney.setString(formatNumber(topPlayer.playerMoney));
        lblMoney.setTextColor(BkColor.TEXT_MONEY_COLOR);
        lblMoney.x = iconMoney.x + iconMoney.width / 2 + lblMoney.getContentSize().width / 2 + 10;
        lblMoney.y = iconMoney.y;
        topSp.addChild(lblMoney);

        if(this.topGameData.type > 1) {
            // Level icon
            var iconLev = new BkSprite("#" + res_name.icon_level);
            iconLev.x = beginProfileDescX + iconLev.width / 2;
            iconLev.y = lblMoney.y - lblMoney.getContentSize().height/2 - iconLev.height/2 - paddingItemY;
            topSp.addChild(iconLev);

            var lblLevel = new BkLabel("Level " + topPlayer.getLevel(), "", textFont);
            lblLevel.x = iconLev.x + iconLev.width / 2 + lblLevel.getContentSize().width / 2 + 10;
            lblLevel.y = iconLev.y;
            topSp.addChild(lblLevel);

            // Win icon
            var iconWin = new BkSprite("#" + res_name.win);
            iconWin.x = beginProfileDescX + iconWin.width / 2 - 5;
            iconWin.y = iconLev.y - iconLev.getContentSize().height/2 - iconWin.height/2 - paddingItemY;
            topSp.addChild(iconWin);

            var lblWin = new BkLabel(convertStringToMoneyFormat(topPlayer.getWinCount()) + " ván", "", textFont);
            lblWin.x = iconWin.x + iconWin.width / 2 + lblWin.getContentSize().width / 2 + 5;
            lblWin.y = iconWin.y + 1;
            topSp.addChild(lblWin);
        }else{
            if (this.topGameData.type == 1){
                iconMoney.y = iconMoney.y - 12;
                lblMoney.y = iconMoney.y;

                var lblChoi = new BkLabel("Chơi " + convertStringToMoneyFormat(topPlayer.getWinCount()) + " ván", "", textFont);
                lblChoi.x = beginProfileDescX + lblChoi.getContentSize().width / 2;
                lblChoi.y = lblMoney.y - lblMoney.getContentSize().height/2 - lblChoi.height/2 - paddingItemY;
                topSp.addChild(lblChoi);
            } else {
                iconMoney.y = iconMoney.y - 20;
                lblMoney.y = iconMoney.y;
            }
        }
        return topSp;
    },

    drawCurUserAchievement: function (currPlayer) {
        if (this.currentProfileSprite) {
            this.currentProfileSprite.removeSelf();
            this.currentProfileSprite = null;
        }
        this.currentProfileSprite = new BkSprite();
        this.addChildBody(this.currentProfileSprite);
        this.currentProfileSprite.x = 0;
        this.currentProfileSprite.y = 0;

        var itemPaddingX = 50;
        var rankText = STR_NOT_RANKING;
        if (currPlayer.getRank() != 2147483647) {
            rankText = "Hạng: " +formatNumber(currPlayer.getRank());
        }
        var lbRank = new BkLabel(rankText, "Tahoma", 14);
        //lbRank.setTextColor(BkColor.HEADER_CONTENT_COLOR);
        lbRank.x = 112;
        lbRank.y = WD_BODY_MARGIN_TB - 5;
        this.currentProfileSprite.addChild(lbRank);

        var avatar = BkAvartarImg.getAvatarByID(currPlayer.getAvatarId());
        avatar.x = 155 + avatar.width / 2 - 10;
        avatar.y = lbRank.y - 1.5;
        avatar.setScale(0.4);
        this.currentProfileSprite.addChild(avatar, WD_ZORDER_TOP);

        var background = BkAvartarImg.getAvatarBg(false);
        background.x = avatar.x + 0.5;
        background.y = avatar.y;
        this.currentProfileSprite.addChild(background);

        var lbName = new BkLabel(currPlayer.getUserName(), "Tahoma", 15, true);
        //lbName.setTextColor(BkColor.HEADER_CONTENT_COLOR);
        lbName.x = avatar.x + avatar.width / 3 + lbName.getContentSize().width / 2;
        lbName.y = lbRank.y;
        this.currentProfileSprite.addChild(lbName);

        var iconMoney = new BkSprite("#" + res_name.top_goldcoin);
        iconMoney.x = lbName.x + lbName.getContentSize().width / 2 + iconMoney.width / 2 + 146;
        iconMoney.y = lbRank.y;
        this.currentProfileSprite.addChild(iconMoney);

        var lbMoney = new BkLabel(formatNumber(currPlayer.getMoney()), "Tahoma", 14);
        lbMoney.setTextColor(BkColor.TEXT_MONEY_COLOR);
        lbMoney.x = iconMoney.x + iconMoney.width / 2 + lbMoney.getContentSize().width / 2 + 5;
        lbMoney.y = lbRank.y;
        this.currentProfileSprite.addChild(lbMoney);
        var winCountPosX = winCountPosX = this.getWindowSize().width - 150;
        if (this.topGameData.type > 1) {
            // Level icon
            var iconLev = new BkSprite("#" + res_name.icon_level);
            iconLev.x = lbMoney.x + lbMoney.getContentSize().width / 2 + iconLev.getContentSize().width / 2 + 110;
            iconLev.y = lbRank.y;
            this.currentProfileSprite.addChild(iconLev);

            var lbLevel = new BkLabel("Level " + currPlayer.getLevel(), "Tahoma", 14);
            //lbLevel.setTextColor(BkColor.HEADER_CONTENT_COLOR);
            lbLevel.x = iconLev.x + iconLev.width / 2 + lbLevel.getContentSize().width / 2 + 5;
            lbLevel.y = lbRank.y;
            this.currentProfileSprite.addChild(lbLevel);
        }
        if (this.topGameData.type > 0) {
            var strNumGame = "";
            var paddingText = 0;
            if (this.topGameData.type == 1) {
                strNumGame = "Chơi ";
                paddingText = -35;
            }
            strNumGame = strNumGame + formatNumber(currPlayer.getWinCount()) + " ván";
            var lbNumGame = new BkLabel(strNumGame, "Tahoma", 14);
            //lbNumGame.setTextColor(BkColor.HEADER_CONTENT_COLOR);
            lbNumGame.x = winCountPosX + lbNumGame.getContentSize().width / 2 + paddingText;
            lbNumGame.y = lbRank.y;
            this.currentProfileSprite.addChild(lbNumGame);

            if (this.topGameData.type > 1) {
                // Win icon
                var iconWin = new BkSprite("#" + res_name.win);
                iconWin.x = lbNumGame.x - lbNumGame.getContentSize().width / 2 - iconWin.getContentSize().width/2 - 5 - 0.5;
                iconWin.y = lbRank.y - 1;
                this.currentProfileSprite.addChild(iconWin);
            }
        }
    },

    draw1StPlayerDetail: function (playerArchive) {
        var badgesData = null;
        if(this.topGameData.type < 2){
            badgesData = playerArchive[0];
        }else {
            for (var i = 0; i < playerArchive.length; i++) {
                if (playerArchive[i].gameId == this.topGameData.gid) {
                    badgesData = playerArchive[i];
                    break;
                }
            }
        }
        if(badgesData) {
            var badges = BkBadgeUtil.createBadgeList(badgesData, 0.5);
            badges.x = 165;
            badges.y = this.getWindowSize().height/2 + 19;
            this.topProfileSprite.addChild(badges);
        }
    },

    requestTopPlayer: function (type, periodId) {
        if (type == 0) {
            this.requestTopRichestList();
        } else {
            this.requestTopPlayerList(type, periodId);
        }
        Util.showAnim();
    },

    /*
        @type: index of champion list
        @periodId= 1: dang len 2: dan dau
     */
    requestTopPlayerList: function (type, periodId) {
        var packet = new BkPacket();
        packet.Type = c.NETWORK_GET_TOP_PLAYER;
        packet.Buffer.writeByte(type);
        packet.Buffer.writeByte(periodId);
        packet.Length = HEADER_SIZE;
        packet.CreateHeader();
        BkConnectionManager.send(packet);
    },

    requestTopRichestList: function () {
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GET_TOP_RICHEST_PLAYER);
        BkConnectionManager.send(packet);
    },
    //Override btn tab
    setSelectedForButton: function (btn, isEnable) {
        if(!btn){
            return;
        }
        //Hide btn tab for richest wd
        if(this.topGameData.type < 1){
            btn.visible = false;
        }
        var textColor = cc.color(43,129,241);
        btn.setIsSelected(isEnable);
        if(isEnable){
            btn.loadTextures(res_name.tab_top_active,res_name.tab_top_no_active,res_name.tab_top_no_active
                ,res_name.tab_top_active,ccui.Widget.PLIST_TEXTURE);
        }else{
            btn.loadTextures(res_name.tab_top_no_active,res_name.tab_top_no_active,res_name.tab_top_no_active
                ,res_name.tab_top_no_active_hover,ccui.Widget.PLIST_TEXTURE);
            btn.setTitleColor(textColor);
        }
    },
    initForBtn: function (btn, tabIndex) {
        this._super(btn, tabIndex);
        btn.y = this.getBodyTab().height + btn.height/2 - 34.99;
        btn.x = btn.x - 0.5;
    },
    onExit: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.badges_plist);
        this._super();
    }
});