/**
 * Created by bs on 30/05/2017.
 */


WD_PLAYER_INFO_ITEM_X = 20;
WD_PLAYER_INFO_ITEM_Y = 35;
VvPlayerInfo = VvWindow.extend({//BkWindow.extend({
    userData: null,
    ctor: function (data) {
        cc.spriteFrameCache.addSpriteFrames(res.vv_trang_ca_nhan_plist, res.vv_trang_ca_nhan_img);
        cc.spriteFrameCache.addSpriteFrames(res.vv_huan_chuong_plist, res.vv_huan_chuong_img);
        this._super("Thông tin người chơi", cc.size(660, 410), null);
        this.userData = data;
        //this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(true);
        //this.setDefaultWdBodyBg();
        this.setDefaultWdBodyBgSprite();
        this._bodyContentBg.y += 25;
        var widBody = this._windowSize.width*0.95;
        var heiBody = this._windowSize.height*0.73;
        this._bodyContentBg.setScaleX(widBody/624);
        this._bodyContentBg.setScaleY(heiBody/435);
        this.inital();
    },
    drawBackGroundContent:function () {
        this.bmContentBG = new BkSprite("#"+res_name.trangcanhan_avatar_bg_2);
        this.addChildBody(this.bmContentBG,100);
        //this.bmContentBG.setScaleY(285/435);
        this.bmContentBG.x = 120;
        this.bmContentBG.y = 202;
    },
    inital:function () {
        this.drawBackGroundContent();
        this.drawAvartar();
        this.drawContentWinLose();
        this.drawHuanChuong();
        this.initButton();
    },
    drawHuanChuong:function () {
        //var scaleNumber = 1;
        var space = 140;
        var deltaY = 30;
        var spBachChien = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_BACH_CHIEN,this.userData.winCountRecord);
        //spBachChien.scale = scaleNumber;
        spBachChien.x = this.startX + 50;
        spBachChien.y = this.startY -100;
        var bmde_hc_bachChien = new BkSprite("#" + res_name.hc_bachchien_de);
        //bmde_hc_bachChien.scale = 0.8;
        bmde_hc_bachChien.x = spBachChien.x;
        bmde_hc_bachChien.y = spBachChien.y-50;
        this.addChildBody(bmde_hc_bachChien);
        this.addChildBody(spBachChien);

        var spThapThanh = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_THAP_THANH,this.userData.firstSpecialCountRecord);
        //spThapThanh.scale = scaleNumber;
        spThapThanh.x = spBachChien.x + space;
        spThapThanh.y = spBachChien.y;
        var bmde_hc_ThapThanh = new BkSprite("#" + res_name.hc_thapthanh_de);
        //bmde_hc_ThapThanh.scale = 0.8;
        bmde_hc_ThapThanh.x = spThapThanh.x;
        bmde_hc_ThapThanh.y = bmde_hc_bachChien.y;
        this.addChildBody(bmde_hc_ThapThanh);
        this.addChildBody(spThapThanh);

        var spChiBachThu = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_CHI_BACH_THU,this.userData.secondSpecialCountRecord);
        //spChiBachThu.scale = scaleNumber;
        spChiBachThu.x = spThapThanh.x + space;
        spChiBachThu.y = spThapThanh.y;
        var bmde_hc_ChiBachThu = new BkSprite("#" + res_name.hc_uchibachthu_de);
        //bmde_hc_ChiBachThu.scale = 0.8;
        bmde_hc_ChiBachThu.x = spChiBachThu.x;
        bmde_hc_ChiBachThu.y = bmde_hc_bachChien.y;
        this.addChildBody(bmde_hc_ChiBachThu);
        this.addChildBody(spChiBachThu);

        var desBachChienBg = new BkSprite("#" + res_name.hc_de);
        desBachChienBg.x = spBachChien.x;
        desBachChienBg.y = bmde_hc_bachChien.y - deltaY;
        desBachChienBg.setScaleY(0.35);
        this.addChildBody(desBachChienBg);

        var desThapThanhBg = new BkSprite("#" + res_name.hc_de);
        desThapThanhBg.x = spThapThanh.x;
        desThapThanhBg.y = desBachChienBg.y;// - deltaY;
        desThapThanhBg.setScaleY(0.35);
        this.addChildBody(desThapThanhBg);

        var desChiBachThu = new BkSprite("#" + res_name.hc_de);
        desChiBachThu.x = spChiBachThu.x;
        desChiBachThu.y = desBachChienBg.y;// - deltaY;
        desChiBachThu.setScaleY(0.35);
        this.addChildBody(desChiBachThu);

        //VvHuanChuongHelper.getCapDoFromWinCount
        var tfBachChien= new BkLabel(VvHuanChuongHelper.getCapDoFromWinCount(this.userData.winCountRecord),"",13);
        tfBachChien.setTextColor(cc.color(0xfb,0xb0,0x40));
        tfBachChien.x = spBachChien.x;
        tfBachChien.y = desBachChienBg.y;
        this.addChildBody(tfBachChien);

        var tfThapThanh= new BkLabel(VvHuanChuongHelper.getCapDoFromWinCount(this.userData.firstSpecialCountRecord),"",13);
        tfThapThanh.setTextColor(cc.color(0xfb,0xb0,0x40));
        tfThapThanh.x = spThapThanh.x;
        tfThapThanh.y = desBachChienBg.y;
        this.addChildBody(tfThapThanh);

        var tfChiBachThu= new BkLabel(VvHuanChuongHelper.getCapDoFromWinCount(this.userData.secondSpecialCountRecord),"",13);
        tfChiBachThu.setTextColor(cc.color(0xfb,0xb0,0x40));
        tfChiBachThu.x = spChiBachThu.x;
        tfChiBachThu.y = desBachChienBg.y;
        this.addChildBody(tfChiBachThu);
    },
    drawContentWinLose:function () {
        this.startX = this.bmAvar.x + 120;
        this.startY = this.bmAvar.y + 50;
        //0xcfb45a
        var tfHang = new BkLabel("Hạng: ","",13);
        tfHang.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        tfHang.x = this.startX+tfHang.getContentSize().width/2;
        tfHang.y = this.startY;
        this.addChildBody(tfHang);
        var tfHangContent = new BkLabel("","",13);
        tfHangContent.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        if (this.userData.rank > CTopPlayerItem.MAX_RANK){
            tfHangContent.setString("Không xếp hạng");
        }else{
            var userRank = this.userData.rank +1;
            tfHangContent.setString(""+ userRank);
        }
        tfHangContent.x = tfHang.x + 200;
        tfHangContent.y = tfHang.y;
        this.addChildBody(tfHangContent);

        var lblWinCount = new BkLabel("Số ván thắng/Số ván thua:","",USER_INFO_SPRITE_FONT_SIZE);
        lblWinCount.setTextColor(BkColor.COLOR_CONTENT_TEXT);
        lblWinCount.x = this.startX + lblWinCount.getContentSize().width / 2;
        lblWinCount.y = tfHang.y - 30;
        this.addChildBody(lblWinCount);

        var winCount, loseCount;
        winCount = this.userData.getWinCount();
        loseCount = this.userData.getLoseCount();
        var winLoseSprite = this.createWinLoseInfoSprite(winCount, loseCount);
        winLoseSprite.x = winLoseSprite.getContentSize().width / 2 + tfHangContent.x - tfHangContent.getContentSize().width/2;
        winLoseSprite.y = lblWinCount.y;
        this.addChildBody(winLoseSprite);

    },
    createWinLoseInfoSprite: function(winCountTxt, loseCountTxt){
        var winLoseCountSprite = new BkSprite("#"+res_name.thang_thua_bg);

        // win info
        var tfWin = new BkLabel(winCountTxt, "", USER_INFO_SPRITE_FONT_SIZE);
        tfWin.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        tfWin.x = tfWin.getContentSize().width/2 + 10;
        tfWin.y = winLoseCountSprite.height/2;
        winLoseCountSprite.addChild(tfWin);

        // lose info
        var tfLose = new BkLabel(loseCountTxt, "", USER_INFO_SPRITE_FONT_SIZE);
        tfLose.setTextColor(cc.color(255,255,255));
        tfLose.x = winLoseCountSprite.width - tfLose.getContentSize().width/2 - 10;
        tfLose.y = winLoseCountSprite.height/2;
        winLoseCountSprite.addChild(tfLose);

        return winLoseCountSprite;
    },
    getStringAvartarDescription:function () {
        return "Top "+this.userData.getMinRank() + " "+this.userData.getTopTypeString();
    },
    drawAvartar:function () {
        this.bmAvar = VvAvatarImg.getAvatarSpriteFromIDAndTopData(this.userData.avatarID,this.userData.getTopType(), this.userData.getMinRank(),this.userData.VipLevel);
        this.bmAvar.x = this.bmContentBG.x;//bmBgAvatar.x + (bmBgAvatar.width - bmAvar.width)*0.5;//startX + MARGIN_LEFT;
        this.bmAvar.y = this.bmContentBG.y + 50;//bmBgAvatar.y + 30;
        this.addChildBody(this.bmAvar);


        if(this.userData.VipLevel > 0)
        {
            var vipIcon = VvAvatarImg.getVipFromID(this.userData.VipLevel);
            vipIcon.setScale(0.5);
            vipIcon.x = this.bmAvar.x - 45;
            vipIcon.y = this.bmAvar.y;
            this.addChildBody(vipIcon);
        }
        var isTop = this.userData.isTop();
        if (isTop){
            this.bmAvatarLine = new BkSprite("#"+res_name.avatar_line);
            this.bmAvatarLine.x = this.bmAvar.x;// + (bmAvar.width - bmAvatarLine.width)*0.5;
            this.bmAvatarLine.y = this.bmAvar.y + 58;
            this.addChildBody(this.bmAvatarLine);

            //13,0xFCED63,true
            var tfAvartarDescription = new BkLabel(this.getStringAvartarDescription(),"",13,true);
            tfAvartarDescription.setTextColor(cc.color(0xFC,0xED,0x63));
            tfAvartarDescription.x = this.bmAvatarLine.x;
            tfAvartarDescription.y = this.bmAvatarLine.y + 13;
            this.addChildBody(tfAvartarDescription);
        }
        //14,0xFFFFFF
        var tfName = new BkLabel(this.userData.getUserName(),"",14,true);
        tfName.setTextColor(cc.color(255,255,255));
        tfName.x = this.bmAvar.x;
        tfName.y = this.bmAvar.y - 65;
        this.addChildBody(tfName);


        var lblMoney = new BkLabel(convertStringToMoneyFormat(this.userData.getMoney(),true) +" quan" , "Tahoma", 15);
        lblMoney.setTextColor(CTopPlayerItem.COLOR_QUAN_TIEN);
        lblMoney.x = tfName.x;// + iconMoney.width/2 + lblMoney.getContentSize().width/2  + 15;
        lblMoney.y = tfName.y - 20;
        this.addChildBody(lblMoney);
        this.drawLevel(this.userData.lvUser);
    },
    drawLevel:function (level) {
        if (this.levelStarBg!= null){
            this.levelStarBg.removeFromParent();
        }

        if (this.lvImg!= null){
            this.lvImg.removeFromParent();
        }

        if (this.lvStar!= null){
            this.lvStar.removeFromParent();
        }

        this.levelStarBg = new BkSprite("#" + res_name.level_star_bg);
        this.levelStarBg.x = this.bmAvar.x;
        this.levelStarBg.y = this.bmAvar.y - 125;
        this.addChildBody(this.levelStarBg);

        this.lvImg = VvLevelImage.getChucDanhImage(level);
        this.lvImg.x = this.levelStarBg.x;
        this.lvImg.y = this.levelStarBg.y + 15;
        this.addChildBody(this.lvImg);

        this.lvStar = VvLevelImage.getLevelSprite(level);
        this.lvStar.x = this.levelStarBg.x - 10;
        this.lvStar.y = this.levelStarBg.y;
        this.addChildBody(this.lvStar);

        var trangthaitaisan = new BkSprite("#"+res_name.trangthaitaisan);
        trangthaitaisan.x = this.levelStarBg.x;
        trangthaitaisan.y = this.levelStarBg.y - 28;
        this.addChildBody(trangthaitaisan);

        var lblTrangThaiTaiSan = new BkLabel(VvLevelImage.getStringFromMoney(this.userData.playerMoney), "", 13);
        lblTrangThaiTaiSan.setTextColor(cc.color(207, 180, 90));
        lblTrangThaiTaiSan.x = trangthaitaisan.width/2;
        lblTrangThaiTaiSan.y = trangthaitaisan.height/2 + 2;
        trangthaitaisan.addChild(lblTrangThaiTaiSan);
    },

    initButton: function ()
    {
        //Event
        if(this.userData.getUserName() !=  BkGlobal.UserInfo.getUserName())
        {
            var self = this;
            var size = cc.winSize;
            var ws = this.getWindowSize();
            var dX = 80;
            var btnKetBan = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy
                , res_name.vv_btn_dongy, res_name.vv_btn_dongy_hover,"Kết bạn");
            btnKetBan.x = ws.width/2 - dX;//WD_BODY_MARGIN_LR*2 + btnKetBan.width;
            btnKetBan.y = WD_PLAYER_INFO_ITEM_Y;
            btnKetBan.setTitleColor(cc.color(0,0,0));
            this.addChildBody(btnKetBan);
            btnKetBan.addClickEventListener(function()
            {
                self.doKetBan();
                BkLogicManager.getLogic().setOnLoadComplete(self);
            });
            if(!BkLogicManager.getInGameLogic().isInGameProgress() && (BkLogicManager.getInGameLogic().isMeBossTable() || BkGlobal.UserInfo.getHasAllowKickWand()) )
            {
                var btnDuoi = createBkButtonPlist(res_name.vv_btn_huy, res_name.vv_btn_huy, res_name.vv_btn_huy
                    , res_name.vv_btn_huy_hover,"Đuổi");
                btnDuoi.x = btnKetBan.x+ 2*dX;//this.getWindowSize().width - WD_BODY_MARGIN_LR - btnDuoi.width;
                btnDuoi.y =  btnKetBan.y;
                this.addChildBody(btnDuoi);
                btnDuoi.setTitleColor(cc.color(0,0,0));
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
        Packet.CreateAddFriendPacket(this.userData.getUserName());
        BkConnectionManager.send(Packet);
        this.visible = false;
        this.removeSelf();
    },
    doKickPlayer:function()
    {
        BkLogicManager.getInGameLogic().ProcessKickPlayerAction(this.userData.getUserName());
        this.visible = false;
        this.removeSelf();
    }
});