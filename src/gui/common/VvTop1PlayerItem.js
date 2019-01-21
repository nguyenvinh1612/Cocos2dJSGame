/**
 * Created by bs on 25/05/2017.
 */

//tformatTitle:TextFormat = new TextFormat(CFont.TAHOMA,14,0xF9CC3D,true,false);
//
// tformatName: TextFormat = new TextFormat(CFont.TAHOMA,TEXT_SIZE_TOP1,0xffffff,true,false);
// tformatMoney: TextFormat = new TextFormat(CFont.TAHOMA,TEXT_SIZE_TOP1,CTopPlayerItem.COLOR_QUAN_TIEN,true,false);
// textformatWin:TextFormat = new TextFormat(CFont.TAHOMA,TEXT_SIZE_TOP1,CTopPlayerItem.COLOR_VAN_THANG,false,false);
// textformatNumGame:TextFormat = new TextFormat(CFont.TAHOMA,TEXT_SIZE_TOP1,CTopPlayerItem.COLOR_VAN_CHOI,false,false);
// textformatBestHand:TextFormat = new TextFormat(CFont.TAHOMA,TEXT_SIZE_TOP1,0x97824e,false,false);

VvTop1PlayerItem = BkSprite.extend({
    Top1UD:null,
    tfTitle:null,
    avatarTopPL:null,
    TopWD:null,
    iconRankTop1:null,
    textSizeTop1:14,
    tfNameTop1:null,
    tfMoneyTop1:null,
    tfWinTop1:null,
    tfNumGame:null,
    tfBestHand:null,

    levelStarBg:null,
    lvImg:null,
    lvStar:null,

    bmde_hc_bachChien:null,
    bmBachChien:null,
    bmde_hc_ThapThanh:null,
    bmThapThanh:null,
    bmde_hc_ChiBachThu:null,
    bmChiBachThu:null,

    iConVip:null,
    ctor:function(TopPlayer,currentTab,strRank1NumberofGame,pr){
        this._super();
        this.TopWD = pr;
        this.Top1UD = TopPlayer;
        this.tfTitle = new BkLabel("","",16,true);
        this.tfTitle.setTextColor(cc.color(0xF9,0xCC,0x3D));
        this.addChild(this.tfTitle);
        this.configTextTitleWithTab(currentTab);

        this.drawAvar(TopPlayer.avatarID,currentTab);

        this.iconRankTop1 = new BkSprite("#"+res_name.icon_no1);
        this.iconRankTop1.x = this.tfTitle.x - 69;
        this.iconRankTop1.y = this.tfTitle.y - 42;
        this.addChild(this.iconRankTop1);
        var deltaY = 5;
        var deltaX = 18;
        this.tfNameTop1 = new BkLabel(TopPlayer.getUserName(),"",this.textSizeTop1,true);
        this.tfNameTop1.x = this.tfTitle.x;
        this.tfNameTop1.y = this.tfTitle.y - 135 + deltaY;
        this.addChild(this.tfNameTop1);

        this.tfMoneyTop1= new BkLabel(formatNumber(TopPlayer.getMoney())+" quan","",this.textSizeTop1,true);
        this.tfMoneyTop1.setTextColor(CTopPlayerItem.COLOR_QUAN_TIEN);
        this.tfMoneyTop1.x = this.tfTitle.x;
        this.tfMoneyTop1.y = this.tfNameTop1.y - deltaX;
        this.addChild(this.tfMoneyTop1);

        // Level
        var level = TopPlayer.getLevel();
        this.drawLevel(level);

        this.tfWinTop1 = new BkLabel("Thắng: "+formatNumber(TopPlayer.getWinCount())+" ván","",this.textSizeTop1-1);
        this.tfWinTop1.x = this.tfTitle.x;
        this.tfWinTop1.y = this.tfTitle.y -210+ deltaY;
        this.tfWinTop1.setTextColor(CTopPlayerItem.COLOR_VAN_THANG);
        this.addChild(this.tfWinTop1);

        this.tfNumGame = new BkLabel("","",this.textSizeTop1-1);
        this.configTextNumGame(currentTab,strRank1NumberofGame,TopPlayer);
        this.tfNumGame.x = this.tfTitle.x;
        this.tfNumGame.y = this.tfWinTop1.y -16;
        this.tfNumGame.setTextColor(CTopPlayerItem.COLOR_VAN_CHOI);
        this.addChild(this.tfNumGame);

        this.tfBestHand = new BkLabel( "Thắng lớn nhất: " + formatNumber(TopPlayer.bestHand)," quan",this.textSizeTop1-1);
        this.tfBestHand.x = this.tfTitle.x;
        this.tfBestHand.y = this.tfNumGame.y -16;
        this.tfBestHand.setTextColor(cc.color(0x97,0x82,0x4e));
        this.addChild(this.tfBestHand);

        this.drawHuanChuong(TopPlayer);
    },
    initDeHuanChuong:function () {
        if (this.bmde_hc_bachChien == null){
            this.bmde_hc_bachChien = new BkSprite("#"+res_name.huanchuong_bg);
            this.bmde_hc_bachChien.x = this.tfTitle.x - 70;
            this.bmde_hc_bachChien.y = this.tfTitle.y - 275;
            this.addChild(this.bmde_hc_bachChien)
        }
        if (this.bmde_hc_ThapThanh == null){
            this.bmde_hc_ThapThanh = new BkSprite("#"+res_name.huanchuong_bg);
            this.bmde_hc_ThapThanh.x = this.tfTitle.x ;
            this.bmde_hc_ThapThanh.y = this.bmde_hc_bachChien.y;
            this.addChild(this.bmde_hc_ThapThanh)
        }
        if (this.bmde_hc_ChiBachThu == null){
            this.bmde_hc_ChiBachThu = new BkSprite("#"+res_name.huanchuong_bg);
            this.bmde_hc_ChiBachThu.x = this.tfTitle.x + 70;
            this.bmde_hc_ChiBachThu.y = this.bmde_hc_bachChien.y;
            this.addChild(this.bmde_hc_ChiBachThu)
        }
    },
    drawHuanChuong:function (TopPlayer,isLoading) {
        this.initDeHuanChuong();
        var scaleXHC = 52/HC_BASE_WIDTH;
        var scaleYHC = 47/HC_BASE_HEIGHT;
        if (this.bmBachChien != null){
            this.bmBachChien.removeFromParent();
        }

        if (this.bmThapThanh != null){
            this.bmThapThanh.removeFromParent();
        }

        if (this.bmChiBachThu != null){
            this.bmChiBachThu.removeFromParent();
        }

        if (isLoading == undefined){
            isLoading = false;
        }

        if (!isLoading){
            this.bmBachChien = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_BACH_CHIEN,TopPlayer.winCountRecord);
            this.bmBachChien.setScaleX(scaleXHC);
            this.bmBachChien.setScaleY(scaleYHC);
            this.bmBachChien.x = this.bmde_hc_bachChien.x;
            this.bmBachChien.y = this.bmde_hc_bachChien.y;
            this.addChild(this.bmBachChien);

            this.bmThapThanh = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_THAP_THANH,TopPlayer.winCountRecord);
            this.bmThapThanh.setScaleX(scaleXHC);
            this.bmThapThanh.setScaleY(scaleYHC);
            this.bmThapThanh.x = this.bmde_hc_ThapThanh.x;
            this.bmThapThanh.y = this.bmde_hc_ThapThanh.y;
            this.addChild(this.bmThapThanh);

            this.bmChiBachThu = VvHuanChuongHelper.getHuanChuongWithTypeAndNumberWin(HC_TYPE.TYPE_CHI_BACH_THU,TopPlayer.winCountRecord);
            this.bmChiBachThu.setScaleX(scaleXHC);
            this.bmChiBachThu.setScaleY(scaleYHC);
            this.bmChiBachThu.x = this.bmde_hc_ChiBachThu.x;
            this.bmChiBachThu.y = this.bmde_hc_ChiBachThu.y;
            this.addChild(this.bmChiBachThu);
        }
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.vv_huan_chuong_plist);
    },
    configTextNumGame:function (currentTab,strRank1NumberofGame,TopPlayer,isLoading) {
        if (isLoading == undefined){
            isLoading = false;
        }
        if (isLoading){
            this.tfNumGame.setString("Chơi: ... ván");
            return;
        }
        if(currentTab == 2 && strRank1NumberofGame !="")
        {
            this.tfNumGame.setString("Chơi: " + strRank1NumberofGame + " ván");
        }
        else
        {
            this.tfNumGame.setString("Chơi: " + formatNumber(TopPlayer.gameCount) + " ván");
        }
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
        this.levelStarBg.x = this.tfTitle.x;
        this.levelStarBg.y = this.tfTitle.y - 185;
        this.addChild(this.levelStarBg);

        this.lvImg = VvLevelImage.getChucDanhImage(level);
        this.lvImg.x = this.levelStarBg.x;
        this.lvImg.y = this.levelStarBg.y + 15;
        this.addChild(this.lvImg);

        this.lvStar = VvLevelImage.getLevelSprite(level);
        this.lvStar.x = this.levelStarBg.x - 10;
        this.lvStar.y = this.levelStarBg.y;
        this.addChild(this.lvStar);
    },

    drawAvar:function (avarID,currentTab) {
        if (this.avatarTopPL!= null){
            this.avatarTopPL.removeFromParent();
        }

        if (currentTab == 1){
            if (this.TopWD.btnDanDau.isSelected()){
                this.Top1UD.topCaoThu = 0;
            } else {
                this.Top1UD.topDangLen = 0;
            }
        } else if (currentTab == 3){
            if (this.TopWD.btnDanDau.isSelected()){
                this.Top1UD.topDaiGia = 0;
            }
        }

        //avatarTopPL = CAvartarImage.getAvatarSpriteFromID(avarID);
        this.avatarTopPL =VvAvatarImg.getAvatarSpriteFromIDAndTopData(avarID,this.Top1UD.getTopType()
            ,this.Top1UD.getMinRank(),this.Top1UD.VipLevel);
        this.avatarTopPL.x = this.tfTitle.x;
        this.avatarTopPL.y = this.tfTitle.y -68;
        this.addChild(this.avatarTopPL);

        if (this.iConVip!= null){
            this.iConVip.removeFromParent();
        }
        if (this.Top1UD.VipLevel>0){
            this.iConVip =VvAvatarImg.getVipFromID(this.Top1UD.VipLevel,false);
            this.iConVip.setScale(0.35);
            this.iConVip.y = this.avatarTopPL.y - 30;
            this.iConVip.x = this.avatarTopPL.x - 35;//+ this.bmAvar.width/2 + this.iConVip.width/2 + 3;
            this.addChild(this.iConVip);
        }
    },
    configTextTitleWithTab:function (currentTab) {
        logMessage("configTextTitleWithTab "+currentTab);
        if(currentTab == 1 || currentTab == 2)
        {
            this.tfTitle.setString("Trưởng lão ");
        }
        else if(currentTab == 3)
        {
            this.tfTitle.setString("Đại phú hộ ");
        } else if(currentTab == 4)
        {
            this.tfTitle.setString("Lão làng ");
        } else if(currentTab == 5)
        {
            this.tfTitle.setString("Lão làng ");
        }
    },
    updateUITop1Player:function (TopPlayer,currentTab,strRank1NumberofGame) {
        this.Top1UD = TopPlayer;
        this.configTextTitleWithTab(currentTab);
        this.drawAvar(TopPlayer.avatarID,currentTab);
        this.tfNameTop1.setString(TopPlayer.userName);
        this.tfMoneyTop1.setString(formatNumber(TopPlayer.playerMoney) +" quan");// + CConstString.STR_GAME_COIN.toLocaleLowerCase();
        this.drawLevel(TopPlayer.lvUser);
        this.tfWinTop1.setString("Thắng: " + formatNumber(TopPlayer.winCount) + " ván");
        this.configTextNumGame(currentTab,strRank1NumberofGame,TopPlayer);
        this.tfBestHand.setString(" Thắng lớn nhất: " + formatNumber(TopPlayer.bestHand) + " quan");// + CConstString.STR_GAME_COIN.toLocaleLowerCase();
        this.drawHuanChuong(TopPlayer);
    },
    updateUILoading:function(currentTab){
        this.configTextTitleWithTab(currentTab);
        if (this.avatarTopPL!= null){
            this.avatarTopPL.removeFromParent();
        }
        if (this.iConVip!= null){
            this.iConVip.removeFromParent();
        }
        this.tfNameTop1.setString("...");
        this.tfMoneyTop1.setString("...");
        this.drawLevel(0,true);
        this.tfWinTop1.setString("Thắng: ... ván");
        this.configTextNumGame(currentTab,"",null,true);
        this.tfBestHand.setString(" Thắng lớn nhất: " + "..." + " quan") ;//+ CConstString.STR_GAME_COIN.toLocaleLowerCase();
        this.drawHuanChuong(null,true);
    }
});