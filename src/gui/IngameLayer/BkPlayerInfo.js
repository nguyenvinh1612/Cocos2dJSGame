/**
 * Created by Vu Viet Dung on 10/24/2015.
 */

WD_PLAYER_INFO_ITEM_X = 20;
WD_PLAYER_INFO_ITEM_Y = 5;
BkPlayerInfo = BkWindow.extend({//BkWindow.extend({
    playerData: null,
    ctor: function (data) {
        this._super("Thông tin người chơi", cc.size(420, 320), null);
        this.playerData = data;
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(true);
        this.setDefaultWdBodyBg();
        this.initWindow();
    },
    setDefaultWdBodyBg:function(){
        this._wdBodyInnerSize = cc.size(this.getBodySize().width - WD_BODY_MARGIN_LR*2, this.getBodySize().height - WD_BODY_MARGIN_TB);
        var imgBg = new BkSprite("#" + res_name.bg_userInfo_inGame);
        //imgBg.x =  210;
        //imgBg.y = 180;
        imgBg.x =  this.getWindowSize().width/2;
        imgBg.y = this.getWindowSize().height/2 - 10;
        this.addChildBody(imgBg);
    },
    initWindow: function ()
    {
        this.removeAllChildren();

        //Avatar
        var bmAvar = new BkAvartarImg.getAvatarByID(this.playerData.getAvatarId());
        if(bmAvar != null)
        {
            //avatar Frame
            var avatarFrame = new BkSprite("#" + res_name.ingame_AvatarFrame);
            avatarFrame.x =  avatarFrame.width/2 + WD_BODY_MARGIN_LR*2;
            avatarFrame.y = this.getBodyInnerSize().height - avatarFrame.height/2 - WD_BODY_MARGIN_TB + 5;
            this.addChildBody(avatarFrame);
            //Avatar
            this.addChildBody(bmAvar);
            bmAvar.x = bmAvar.width/2 + WD_BODY_MARGIN_LR*2;
            bmAvar.y = this.getBodyInnerSize().height - bmAvar.height/2 - WD_BODY_MARGIN_TB + 5;
        }
        // Over view
        logMessage("bmAvatar:" + bmAvar.width);
        var lblName = new BkLabel(Util.getFormatString(this.playerData.getUserName(), 20) , "Tahoma", 17,true);
        lblName.setTextColor(cc.color(255,255,255));
        lblName.x = bmAvar.x + bmAvar.width/2 + lblName.getContentSize().width/2 + WD_PLAYER_INFO_ITEM_X;
        lblName.y = bmAvar.y + bmAvar.height/2 - lblName.getContentSize().height/2;
        this.addChildBody(lblName);

        var iconMoney = new BkSprite("#"+res_name.top_goldcoin);
        this.addChildBody(iconMoney);
        iconMoney.x = bmAvar.x + bmAvar.width/2 + iconMoney.width/2 + WD_PLAYER_INFO_ITEM_X;
        iconMoney.y = lblName.y - 30;

        var lblMoney = new BkLabel(convertStringToMoneyFormat(this.playerData.getMoney(),true) , "Tahoma", 15);
        lblMoney.setTextColor(cc.color(255,255,0));
        lblMoney.x = iconMoney.x + iconMoney.width/2 + lblMoney.getContentSize().width/2  + 15;
        lblMoney.y = iconMoney.y;
        this.addChildBody(lblMoney);
        var imgLevel = new BkSprite("#" + res_name.icon_level)
        imgLevel.x =  iconMoney.x;
        imgLevel.y =  iconMoney.y - 30;
        this.addChildBody(imgLevel);

        var itemStr = [
            //new BkLabelItem("★ ", 22, cc.color(254, 186, 0), 1, false),
            new BkLabelItem("Level ", 15, cc.color.WHITE, 1, false),
            new BkLabelItem(this.playerData.getLevel(), 15, cc.color.WHITE, 1, false)
        ];
        var lblLevel = new BkLabelSprite(itemStr);
        lblLevel.x = imgLevel.x + 25;
        lblLevel.y = imgLevel.y - 10;
        this.addChildBody(lblLevel);
        var imgWin = new BkSprite("#" + res_name.win);
        imgWin.x = 58.5;
        imgWin.y = this.getWindowSize().height/2 - 50;
        this.addChildBody(imgWin);

        itemStr = [
            //new BkLabelItem("Thắng: ", 16, BkColor.HEADER_CONTENT_COLOR, 1, false),
            new BkLabelItem(convertStringToMoneyFormat(this.playerData.getWinCount()), 16, cc.color.WHITE, 1, false)
        ];
        var lblWin = new BkLabelSprite(itemStr);
        lblWin.x = imgWin.x + 20;
        lblWin.y = imgWin.y - 9;
        this.addChildBody(lblWin);

        var imgLose = new BkSprite("#" + res_name.icon_lose);
        imgLose.x = imgWin.x + 130;
        imgLose.y = imgWin.y;
        this.addChildBody(imgLose);

        itemStr = [
           // new BkLabelItem("Thua: ", 16, BkColor.HEADER_CONTENT_COLOR, 1, false),
            new BkLabelItem(convertStringToMoneyFormat(this.playerData.getLoseCount()), 16, cc.color.WHITE, 1, false)
        ];
        var lblLose = new BkLabelSprite(itemStr);
        lblLose.x = imgLose.x + 20;
        lblLose.y = imgWin.y - 9;
        this.addChildBody(lblLose);

        var rankTxt = "Chưa có";
        if(this.playerData.getRank() != 2147483647 )
        {
            rankTxt = formatNumber(this.playerData.getRank()+1);
        }
        itemStr = [
            new BkLabelItem("Hạng: ", 16, BkColor.HEADER_CONTENT_COLOR, 1, false),
            new BkLabelItem(rankTxt, 16, cc.color.WHITE, 1, false)
        ];
        var lblRank = new BkLabelSprite(itemStr);

        lblRank.x = lblRank.getContentSize().width/2 + 250;
        lblRank.y = imgWin.y - 9;
        this.addChildBody(lblRank);

        //Badges
        //var badgeFrame = new BkSprite(res.badge_frame);
        //badgeFrame.scaleX = 1.0;
        //badgeFrame.scaleY = 1.0;
        //badgeFrame.x = this.getBodySize().width/2;
        //badgeFrame.y = this.getBodySize().height/3- 5;
        //this.addChildBody(badgeFrame);
        var bmbadges0 = new BkBadge(BadgeCategory.Win,this.playerData.getWinCount(),this.playerData.getGameId());
        var bmbadges1 = new BkBadge(BadgeCategory.FirstSpecial,this.playerData.getFirstSpecialCountRecord(),this.playerData.getGameId());
        var bmbadges2 = new BkBadge(BadgeCategory.SecondSpecial,this.playerData.getSecondSpecialCountRecord(),this.playerData.getGameId());
        bmbadges0.scaleX = 0.5;
        bmbadges0.scaleY = 0.5;
        bmbadges0.x = this.getWindowSize().width/2 - 70;
        bmbadges0.y = this.getBodySize().height/3- 5 - 30;
        bmbadges1.x =  this.getWindowSize().width/2;
        bmbadges1.y = bmbadges0.y;
        bmbadges1.scaleX = 0.5;
        bmbadges1.scaleY = 0.5;
        bmbadges2.x = bmbadges1.x + 70;
        bmbadges2.y = bmbadges0.y;
        bmbadges2.scaleX = 0.5;
        bmbadges2.scaleY = 0.5;
        this.addChildBody(bmbadges0);
        this.addChildBody(bmbadges1);
        this.addChildBody(bmbadges2);
        bmbadges0.createToolTip(this);
        bmbadges1.createToolTip(this);
        bmbadges2.createToolTip(this);

        //Event
        if(this.playerData.getUserName() !=  BkGlobal.UserInfo.getUserName())
        {
            var self = this;
            var size = cc.winSize;
            var btnKetBan = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
                res_name.BtnDialog_Hover,"Kết bạn");
            btnKetBan.x = WD_BODY_MARGIN_LR*2 + btnKetBan.width;
            btnKetBan.y = WD_PLAYER_INFO_ITEM_Y;
            this.addChildBody(btnKetBan);
            btnKetBan.addClickEventListener(function()
            {
                self.doKetBan();
                BkLogicManager.getLogic().setOnLoadComplete(self);
            });
            if(!BkLogicManager.getInGameLogic().isInGameProgress() && (BkLogicManager.getInGameLogic().isMeBossTable() || BkGlobal.UserInfo.getHasAllowKickWand()) )
            {
                var btnDuoi = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
                    res_name.BtnDialog_Hover,"Đuổi");
                btnDuoi.x = this.getBodyInnerSize().width - WD_BODY_MARGIN_LR - btnDuoi.width;
                btnDuoi.y =  btnKetBan.y;
                this.addChildBody(btnDuoi);
                btnDuoi.addClickEventListener(function(){
                    self.doKickPlayer();
                });
            }else{
                btnKetBan.x = this.getBodySize().width/2;
            }
        }
    },
    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag){
            case c.NETWORK_REQUEST_FRIEND_SUCCESS:
                showToastMessage("Đã gửi yêu cầu kết bạn",cc.director.getWinSize().width/2, cc.director.getWinSize().height/2);
                break;
        }
    },
    doKetBan:function()
    {
        var Packet = new BkPacket();
        Packet.CreateAddFriendPacket(this.playerData.getUserName());
        BkConnectionManager.send(Packet);
        this.visible = false;
        this.removeSelf();
    },
    doKickPlayer:function()
    {
        BkLogicManager.getInGameLogic().ProcessKickPlayerAction(this.playerData.getUserName());
        this.visible = false;
        this.removeSelf();
    }
});