/**
 * Created by bs on 09/05/2017.
 */
BkChanPlayer = BkPlayer.extend({
    type:0,
    topDaiGia:-1,
    topCaoThu:-1,
    topDangLen:-1,
    isQuay:false,
    imgQuayBai:null,
    isVisibleDisable:false,
    levelStarBg: null,
    lvImg : null,
    lvStar : null,
    needUMark:false,
    playerUMarker:null,
    VipLevel:-1,
    vipMedal:null,
    ctor: function (data, status) {
        cc.spriteFrameCache.addSpriteFrames(res.vv_after_login_plist, res.vv_after_login_img);

        this._super(data, status)
    },
    getAvatarBg:function (type, row, rank) {
        var loc;
        switch (rank) {
            case 1:
                loc = CIngameAvatar.COL_TOP_AVATAR1;
                break;
            case 2:
                loc = CIngameAvatar.COL_TOP_AVATAR2;
                break;
            case 3:
                loc = CIngameAvatar.COL_TOP_AVATAR3;
                break;
        }
        if (row == CIngameAvatar.ROW_NORMAL) {
            if (type == CIngameAvatar.SIZE_TYPE_NORMAL) {
                loc = CIngameAvatar.COL_BIG_AVATAR;
            } else {
                loc = CIngameAvatar.COL_SMALL_AVATAR;
            }
        }
        return this.getBitmap(type, row,loc);
    },
    getTopType:function(){
        if (this.topDaiGia == -1 && this.topCaoThu == -1 && this.topDangLen == -1) {
            return CIngameAvatar.ROW_NORMAL;
        }
        var row = CIngameAvatar.ROW_NORMAL;
        var minLevel = 4;
        // Top dai gia
        if (this.topDaiGia < minLevel && this.topDaiGia != -1) {
            minLevel = this.topDaiGia;
            row = CIngameAvatar.ROW_DAI_GIA;
        }
        // Top cao thu
        if (this.topCaoThu < minLevel && this.topCaoThu != -1) {
            minLevel = this.topCaoThu;
            row = CIngameAvatar.ROW_CAO_THU;
        }
        // Nhiet tinh
        if (this.topDangLen < minLevel && this.topDangLen != -1) {
            minLevel = this.topDangLen;
            row = CIngameAvatar.ROW_DANG_LEN;
        }
        return row;
    },
    getMimRank:function(){
        var minRank = 4;
        if (this.topDaiGia < minRank && this.topDaiGia != -1) {
            minRank = this.topDaiGia + 1;
        }
        if (this.topCaoThu < minRank && this.topCaoThu != -1) {
            minRank = this.topCaoThu + 1;
        }
        if (this.topDangLen < minRank && this.topDangLen != -1) {
            minRank = this.topDangLen + 1;
        }
        return minRank;
    },
    getSmallAvatarLocation:function(avatarType, loc)
    {
        return cc.rect(loc * CIngameAvatar.BASE_SMALL_WIDTH, avatarType * CIngameAvatar.BASE_SMALL_HEIGHT, CIngameAvatar.BASE_SMALL_WIDTH, CIngameAvatar.BASE_SMALL_HEIGHT);
    },
    getNormalAvatarLocation:function(avatarType, loc) {
        return cc.rect(loc * CIngameAvatar.BASE_NORMAL_WIDTH, avatarType * CIngameAvatar.BASE_NORMAL_HEIGHT, CIngameAvatar.BASE_NORMAL_WIDTH, CIngameAvatar.BASE_NORMAL_HEIGHT);
    },
    getSpriteAvarWithData:function(type,row,rank){
        var loc;
        switch (rank) {
            case 1:
                loc = CIngameAvatar.COL_TOP_AVATAR1;
                break;
            case 2:
                loc = CIngameAvatar.COL_TOP_AVATAR2;
                break;
            case 3:
                loc = CIngameAvatar.COL_TOP_AVATAR3;
                break;
        }
        if (row == CIngameAvatar.ROW_NORMAL) {
            if (type == CIngameAvatar.SIZE_TYPE_NORMAL) {
                loc = CIngameAvatar.COL_BIG_AVATAR;
            } else {
                loc = CIngameAvatar.COL_SMALL_AVATAR;
            }
        }
        return this.getBitmap(type, row,loc);
    },
    getBitmap:function(type, avatarType, loc){
        if (type == CIngameAvatar.SIZE_TYPE_NORMAL) {
            return new BkSprite(res.vv_avatar_normal,this.getNormalAvatarLocation(avatarType, loc));
        } else {
            return new BkSprite(res.vv_avatar_small,this.getSmallAvatarLocation(avatarType, loc));
        }
    },
    getInviteBM:function() {
        return this.getBitmap(CIngameAvatar.SIZE_TYPE_NORMAL, CIngameAvatar.ROW_NORMAL, CIngameAvatar.COL_BIG_INVITE);
    },
    getBiBaoBM:function(type) {
        var loc;
        if (type== CIngameAvatar.SIZE_TYPE_NORMAL) {
            loc = CIngameAvatar.COL_BIG_BIBAO;
        } else {
            loc = CIngameAvatar.COL_SMALL_BIBAO;
        }
        return this.getBitmap(type, CIngameAvatar.ROW_NORMAL, loc);
    },
    getMarker:function()
    {
        return this.getBitmap(CIngameAvatar.SIZE_TYPE_NORMAL, CIngameAvatar.ROW_NORMAL, CIngameAvatar.COL_BIG_MARKER);
    },
    getAvatarBgBorder:function(type, row, rank) {
        var loc;
        if (row == 0) {
            if (type == CIngameAvatar.SIZE_TYPE_NORMAL) {
                loc = CIngameAvatar.COL_BIG_BORDER;
            } else {
                loc = CIngameAvatar.COL_SMALL_BORDER;
            }
        } else {
            switch (rank) {
                case 1:
                    loc = CIngameAvatar.COL_TOP_AVATAR1_BG;
                    break;
                case 2:
                    loc = CIngameAvatar.COL_TOP_AVATAR2_BG;
                    break;
                case 3:
                    loc = CIngameAvatar.COL_TOP_AVATAR3_BG;
                    break;
            }
        }

        return this.getBitmap(type, row, loc);
    },
    getBorderDisable:function()
    {
        return this.getBitmap(CIngameAvatar.SIZE_TYPE_SMALL, CIngameAvatar.ROW_NORMAL, CIngameAvatar.COL_SMALL_DISABLE);
    },
    getAvatarSmallBgBounder:function(type)
    {
        var rect = cc.rect(type * CIngameAvatar.SMALL_BOUNDER_WITH, 0, CIngameAvatar.SMALL_BOUNDER_WITH, CIngameAvatar.SMALL_BOUNDER_HEIGHT);
        return new BkSprite(res.avatar_small_bounder,rect);
    },
    getTranBM:function(row) {
        var loc;
        if (row == CIngameAvatar.ROW_NORMAL) {
            loc = CIngameAvatar.COL_BIG_TRANS;
        } else {
            loc = CIngameAvatar.COL_TOP_TRAN;
        }
        return this.getBitmap(CIngameAvatar.SIZE_TYPE_NORMAL, row, loc);
    },
    setVislebleAllBG:function (isVisi) {
        logMessage("setVislebleAllBG "+isVisi);
        if (this.bgSprite!= null){
            this.bgSprite.setVisible(isVisi);
        }
        if (this.bgavatarSprite!= null){
            this.bgavatarSprite.setVisible(isVisi);
        }
        if (this.imgAvatarBgBorder!= null) {
            this.imgAvatarBgBorder.setVisible(isVisi);
        }
        if (this.imgAvatarBgInvite != null){
            this.imgAvatarBgInvite.setVisible(isVisi);
        }
        if (this.imgAvatarBgBounder!= null) {
            this.imgAvatarBgBounder.setVisible(isVisi);
        }
        if (this.imgAvatarBgBounderFull != null) {
            this.imgAvatarBgBounderFull.setVisible(isVisi);
        }
        if (this.bmBgText != null){
            this.bmBgText.setVisible(isVisi);
        }
        if (this.bmBgBorderDisable != null){
            this.bmBgBorderDisable.setVisible(isVisi);
        }
        if (this.imgBaoMarkNormal != null){
            // logMessage("imgBaoMarkNormal "+isVisi+" - "+this.getPlayerName());
            this.imgBaoMarkNormal.setVisible(isVisi);
        }
        if (this.imgBaoMarkSmall != null){
            this.imgBaoMarkSmall.setVisible(isVisi);
        }
    },
    clearAllBG:function () {
        if (this.bgSprite!= null){
            this.bgSprite.removeFromParent();
            this.bgSprite = null;
        }
        if (this.bgavatarSprite!= null){
            this.bgavatarSprite.removeFromParent();
            this.bgavatarSprite = null;
        }
        if (this.imgAvatarBgBorder!= null) {
            this.imgAvatarBgBorder.removeFromParent();
            this.imgAvatarBgBorder = null;
        }
        if (this.imgAvatarBgInvite != null){
            this.imgAvatarBgInvite.removeFromParent();
            this.imgAvatarBgInvite = null;
        }
        if (this.imgAvatarBgBounder!= null) {
            this.imgAvatarBgBounder.removeFromParent();
            this.imgAvatarBgBounder = null;
        }
        if (this.imgAvatarBgBounderFull != null) {
            this.imgAvatarBgBounderFull.removeFromParent();
            this.imgAvatarBgBounderFull = null;
        }
        if (this.bmBgText != null){
            this.bmBgText.removeFromParent();
            this.bmBgText = null;
        }
        if (this.bmBgBorderDisable != null){
            this.bmBgBorderDisable.removeFromParent();
            this.bmBgBorderDisable = null;
        }
        if (this.imgBaoMarkNormal != null){
            this.imgBaoMarkNormal.removeFromParent();
            this.imgBaoMarkNormal = null;
        }
        if (this.imgBaoMarkSmall != null){
            this.imgBaoMarkSmall.removeFromParent();
            this.imgBaoMarkSmall = null;
        }
    },
    clearVipMedal:function () {
        if (this.vipMedal != null){
            this.vipMedal.removeFromParent();
            this.vipMedal = null;
        }
    },
    addMedalVipLv:function (type) {
        // logMessage("addMedalVipLv: "+this.VipLevel +" "+this.getPlayerName());
        if ((this.VipLevel<=0) || (this.VipLevel>10)){
            return;
        }
        this.clearVipMedal();

        this.vipMedal = VvAvatarImg.getVipFromID(this.VipLevel);
        this.vipMedal.setScale(0.5);
        this.vipMedal.x = this.bgavatarSprite.x - 45;
        this.vipMedal.y = this.bgavatarSprite.y;
        if (type == CPlayer.TYPE_SMALL_AVATAR){
            this.vipMedal.setScale(0.35);
            this.vipMedal.x = this.bgavatarSprite.x - 20;
            logMessage("TYPE_SMALL_AVATAR "+this.vipMedal.x);
        }
        this.addChild(this.vipMedal,COUNT_DOWN_TIME_ZO+2);
    },
    loadBackground:function(){
        logMessage("loadBackground ");
        this.clearAllBG();

        //this.needBaoMark = false;
        //logMessage("this.needBaoMark "+this.needBaoMark +" - "+this.getPlayerName());
        this.imgBaoMarkSmall = this.getBiBaoBM(CIngameAvatar.SIZE_TYPE_SMALL);
        this.imgBaoMarkSmall.visible = false;
        this.addChild(this.imgBaoMarkSmall,COUNT_DOWN_TIME_ZO+10);

        this.imgBaoMarkNormal = this.getBiBaoBM(CIngameAvatar.SIZE_TYPE_NORMAL);
        // logMessage("imgBaoMarkNormal -> visile = false"+" - "+this.getPlayerName());
        this.imgBaoMarkNormal.visible = false;
        this.addChild(this.imgBaoMarkNormal,COUNT_DOWN_TIME_ZO+10);

        var nameImg = res_name.imgTrans110;
        if (this.type == CPlayer.TYPE_SMALL_AVATAR){
            nameImg = res_name.imgTrans68;
        }
        this.bgSprite = new BkSprite("#" +nameImg);
        this.addChild(this.bgSprite);
        this.bgSprite.x = 0;
        this.bgSprite.y = 0;
        this.initEventListener();

        if (this.type == CPlayer.TYPE_NORMAL_AVATAR) {
            this.bgavatarSprite = this.getSpriteAvarWithData(this.type, this.getTopType(), this.getMimRank());
            this.imgAvatarBgBorder = this.getAvatarBgBorder(this.type, this.getTopType(), this.getMimRank());

            if (this.VipLevel>0 && !this.isTop()){
                logMessage("la vip va k la Top");
                this.bgavatarSprite = VvAvatarImg.getVipSpriteWithBound(this.VipLevel,CPlayer.TYPE_NORMAL_AVATAR);
            }
            this.addMedalVipLv(CPlayer.TYPE_NORMAL_AVATAR);

            this.imgAvatarBgInvite = this.getInviteBM();
            this.bmBgText = this.getTranBM(this.getTopType());
            this.bmBgText.y= 0.5;
            this.imgAvatarBgInvite.visible = false;
        } else {
            logMessage("type small");
            this.bgavatarSprite = this.getSpriteAvarWithData(this.type, this.getTopType(), this.getMimRank());
            this.imgAvatarBgBorder = this.getAvatarBgBorder(this.type, this.getTopType(), this.getMimRank());
            // TODO: Vip function
            if (this.VipLevel>0 && !this.isTop()){
                logMessage("la vip va k la Top");
                this.bgavatarSprite = VvAvatarImg.getVipSpriteWithBound(this.VipLevel,CPlayer.TYPE_SMALL_AVATAR);
            }
            this.addMedalVipLv(CPlayer.TYPE_SMALL_AVATAR);

            this.imgAvatarBgBounder = this.getAvatarSmallBgBounder(this.getTopType());
            this.imgAvatarBgBounderFull = new BkSprite("#"+res_name.avatar_small_bg_bounder_full);
            this.bmBgBorderDisable = this.getBorderDisable();
        }

        if (this.type != CPlayer.TYPE_NORMAL_AVATAR) {
            // is small avar
            this.imgAvatarBgBounderFull.x = 0;
            this.imgAvatarBgBounder.x = this.bgavatarSprite.x;
            this.imgAvatarBgBounder.y = this.bgavatarSprite.y - 40;

            this.imgAvatarBgBorder.x = this.bgavatarSprite.x;//this.imgAvatarBgBounder.x + (CPlayer.AVATAR_BOUNDER_SIZE - this.imgAvatarBgBorder.width) / 2;
            this.imgAvatarBgBorder.y = this.bgavatarSprite.y;//(CPlayer.AVATAR_BOUNDER_SIZE - this.imgAvatarBgBorder.height) /2;

            this.bmBgBorderDisable.x = this.bgavatarSprite.x;
            this.bmBgBorderDisable.y = this.bgavatarSprite.y;

            this.imgAvatarBgBounderFull.visible = false;
            //imgAvatarBgBounder.x -=0;

            this.addChild(this.imgAvatarBgBounderFull,0);
            this.addChild(this.imgAvatarBgBounder,1);
            this.addChild(this.imgAvatarBgBorder,2);
            this.addChild(this.bmBgBorderDisable,3);
            this.addChild(this.bgavatarSprite,4);
            // logMessage("hide bmBgBorderDisable");
            this.bmBgBorderDisable.visible  = false;
        } else {
            // Normal avatar
            this.addChild(this.imgAvatarBgBorder,0);
            this.addChild(this.bgavatarSprite,1);
            this.addChild(this.imgAvatarBgInvite,2);
            this.addChild(this.bmBgText,13);
            this.bmBgText.visible = false;
        }

        if (this.lbName!= null){
            this.lbName.removeFromParent();
            this.lbName = null;
        }
        if (this.lbMoney!= null){
            this.lbMoney.removeFromParent();
            this.lbMoney = null;
        }
        //if (this.lvSprite!= null){
        //    this.lvSprite.removeFromParent();
        //    this.lvSprite = null;
        //}
        this.lbName = new BkLabel("","",13,true);
        this.lbName.setTextColor(BkColor.DEFAULT_TEXT_COLOR);
        this.lbName.x =  this.bgSprite.x ;//+ 5;
        this.lbName.y =  this.bgSprite.y - 22;
        this.addChild(this.lbName,100);

        this.lbMoney = new BkLabel("","",12,true);
        this.lbMoney.setTextColor(cc.color(255,255,0));
        this.lbMoney.x = this.bgSprite.x;
        this.lbMoney.y = this.lbName.y - 15;
        this.addChild(this.lbMoney,101);
        this._configViewPlayer();
    },
    clearLvSprite:function(){
        if (this.levelStarBg!= null){
            this.levelStarBg.removeFromParent();
            this.levelStarBg = null;
        }
        if (this.lvImg!= null){
            this.lvImg.removeFromParent();
            this.lvImg = null;
        }
        if (this.lvStar!= null){
            this.lvStar.removeFromParent();
            this.lvStar = null;
        }
    },
    setLevelSprite:function(level) {
        this.clearLvSprite();
        this.levelStarBg = new BkSprite("#" + res_name.level_star_bg);
        this.levelStarBg.x = this.bgSprite.x;
        this.levelStarBg.y = this.bgSprite.y - 80;
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
    showBossTableFlag:function(){
        this._super();
        this.chubanSprite.x =  this.getContentSize().width/2 + 40;
    },
    _configViewPlayer:function(isNewLevel){
        this.showBossTableFlag();
        if (this.avatarSprite != null){
            this.avatarSprite.removeFromParent();
            this.avatarSprite= null;
        }

        if (this.playerData != null)
        {
            this.lbName.setString(Util.trimName(this.playerData.userName,10));
            this.lbMoney.setString(convertStringToMoneyFormatIngame(this.playerData.playerMoney));
            this.avatarSprite =  VvAvatarImg.getAvatarByID(this.playerData.getAvatarId());
            //this.avatarSprite =  BkAvartarImg.getCircleImageFromID(this.playerData.getAvatarId());
            this.avatarSprite.setScale(0.5,0.5);
            this.avatarSprite.x = this.bgavatarSprite.x;
            this.avatarSprite.y = this.bgavatarSprite.y;
            if (this.type == CPlayer.TYPE_NORMAL_AVATAR){
                this.avatarSprite.y = this.bgavatarSprite.y;
                this.avatarSprite.setScale(0.95,0.95);
            }
            this.addChild(this.avatarSprite,11);
            this.avatarSprite.setVisible(true);
            this.lbName.setVisible(true);
            this.lbMoney.setVisible(true);
            //this.lvSprite.setVisible(true);
            this.chubanSprite.setVisible(false);
            if(isNewLevel != undefined && isNewLevel == true)
            {
                this.setLevelSprite(this.playerData.getLevel());
                this.show();
                return;
            }
            if (this.status == PLAYER_STATE_TABLE_OWNER){
                this.chubanSprite.setVisible(true);
            }

            if ((this.status != PLAYER_STATE_READY)&&(this.status != PLAYER_STATE_TABLE_OWNER)){
                this.showMaskNotReady();
            } else {
                this.clearImgMaskNotReady();
            }
            this.setLevelSprite(this.playerData.getLevel());
            this.setVislebleAllBG(true);
            this.addMedalVipLv(this.type);
        } else
        {
            this.avatarSprite =  this.getInviteBM();//BkAvartarImg.getCircleImageFromID(this.playerData.getAvatarId());
            this.avatarSprite.setScale(0.95,0.95);
            this.avatarSprite.x = this.getContentSize().width/2;
            this.avatarSprite.y = this.getContentSize().height/2 - 1;
            this.addChild(this.avatarSprite,10);
            this.chubanSprite.setVisible(false);
            this.lbName.setVisible(false);
            this.lbMoney.setVisible(false);
            this.bgSprite.setVisible(false);
            if (this.bmBgText != null){
                this.bmBgText.visible = false;
            }
            this.clearLvSprite();
            //this.lvSprite.setVisible(false);
            if (this.bgSpriteXito != null) {
                this.bgSpriteXito.setVisible(false);
                this.bgSpriteXito = null;
            }
            this.showImgReady();
            this.clearAllMask();
            this.clearImgReady();
            this.clearBetMoney();
            this.setVislebleAllBG(false);
            this.clearUMask();
            this.clearBaoMask();
        }
        this.show();
    },
    arrangeNormalAvatar:function(){
        if (this.playerData!= null) {
            this.lbName.y =  this.bgSprite.y - 22;
            this.lbMoney.y = this.lbName.y - 15;

            if (this.imgAvatarBgInvite!=null){
                this.imgAvatarBgInvite.visible = false;
            }

            if (this.bmBgText != null){
                this.bmBgText.visible = true;
            }
        }

        if (this.isQuay) {
            // Normal avatar
            if (this.imgQuayBai!= null){
                this.imgQuayBai.x = -5;
                this.imgQuayBai.y = 5;
            }
        }
    },
    arrangeSmallAvatar:function(){
        if (this.playerData != null) {
            this.lbName.y =  this.bgSprite.y - 37;
            this.lbMoney.y = this.lbName.y - 15;
        }

        if (this.isQuay) {
            // Small avatar
            this.imgQuayBai.x = 33;
            this.imgQuayBai.y = 50;
        }

        if (this.bmBgBorderDisable!= null){
            // logMessage("arrangeSmallAvatar bmBgBorderDisable"+this.isVisibleDisable);
            this.bmBgBorderDisable.visible = this.isVisibleDisable;
        }
    },
    show:function()
    {
        // logMessage("show avar "+this.needBaoMark + " "+this.getPlayerName());
        this.visible = true;
        this.imgBaoMarkNormal.visible = false;
        this.imgBaoMarkSmall.visible = false;

        if (this.needBaoMark) {
            // logMessage("this.needBaoMark");
            if (this.type == CPlayer.TYPE_NORMAL_AVATAR) {
                // logMessage("imgBaoMarkNormal.visible = true"+" - "+this.getPlayerName());
                this.imgBaoMarkNormal.visible = true;
                this.imgBaoMarkNormal.x = this.bgavatarSprite.x;
                this.imgBaoMarkNormal.y = this.bgavatarSprite.y;
                //this.setChildIndex(flagChuBan,numChildren -1);
            } else {
                this.imgBaoMarkSmall.visible = true;
                this.imgBaoMarkSmall.x = this.bgavatarSprite.x;// + 7;
                this.imgBaoMarkSmall.y = this.bgavatarSprite.y;// + 7.25;
            }
        }

        if (this.type == CPlayer.TYPE_NORMAL_AVATAR) {
            this.arrangeNormalAvatar();
        } else {
            this.arrangeSmallAvatar();
        }
    },
    _initPlayerSprite:function(){
        this.loadBackground();
    },
    setType:function(mtype){
        this.type = mtype;
        this.loadBackground();
    },
    showOngameFullAvatar:function(){
        if (this.type == CPlayer.TYPE_NORMAL_AVATAR) {
            return;
        }
        if (this.imgAvatarBgBounderFull != null) {
            this.imgAvatarBgBounderFull.visible = true;
        }
    },
    clearUMask:function(){
        this.needUMark = false;
        // logMessage("this.needUMark "+this.needUMark+" - "+this.getPlayerName());
    },
    clearBaoMask:function(){
        this.needBaoMark = false;
        // logMessage("this.needBaoMark "+this.needBaoMark+" - "+this.getPlayerName());
    },
    onUpdateShowWiner:function(){
        this.playerUMarker.visible = !this.playerUMarker.visible;
        if (!this.needUMark){
            this.unschedule(this.onUpdateShowWiner);
            if(this.playerUMarker!= null){
                this.playerUMarker.removeFromParent();
                this.playerUMarker = null;
            }
        }
    },
    showWinner:function(){
        // logMessage("showWinner");
        this.needUMark = true;
        // logMessage("this.needUMark "+this.needUMark+" - "+this.getPlayerName());
        if(this.playerUMarker!= null){
            this.playerUMarker.removeFromParent();
            this.playerUMarker = null;
        }
        this.playerUMarker = this.getMarker();
        this.playerUMarker.x = this.bgSprite.x;
        this.playerUMarker.y = this.bgSprite.y;
        this.addChild(this.playerUMarker,COUNT_DOWN_TIME_ZO-1);
        this.schedule(this.onUpdateShowWiner,0.3);
    },
    setBao:function(strError){
        logMessage("setBao "+strError);
        this.needBaoMark = true;
        this.textError = strError;
        if (this.isMe()){
            this.setSmallAvatarDisable(true);
        }
        this.show();
    },
    setModel:function(top1, top2, top3,lv){
        logMessage("setModel :"+top1+" - "+top2+" - "+top3+" - "+lv);
        this.topDaiGia = top1;
        this.topCaoThu = top2;
        this.topDangLen = top3;
        if (lv){
            this.VipLevel = lv;
        }
        this.loadBackground();
    },
    setSmallAvatarDisable:function(isVisi){
        this.isVisibleDisable = isVisi;
    },
    initCountDown:function(){
        this._super();
        if (this.type == CPlayer.TYPE_NORMAL_AVATAR){
            this.cdSprite.setScale(1.2);
        } else {
            this.cdSprite.setScale(0.75);
        }
    },
    reset:function(){
        if (!this.visible){
            return;
        }
        this.clearBaoMask();
        this.clearUMask();
        this._super();
    },
    isMe:function(){
        if (this.playerData!= null){
            var playerName = this.playerData.userName;
            if (playerName== BkGlobal.UserInfo.getUserName()){
                return true;
            }
        }
        return false;
    },
    initplayerOverviewData:function () {
        this._super();
        var self = this;
        self.gameTable.playerOverviewData.isQuay = self.isQuay;
        self.gameTable.playerOverviewData.topCaoThu = self.topCaoThu;
        self.gameTable.playerOverviewData.topDaiGia = self.topDaiGia;
        self.gameTable.playerOverviewData.topDangLen = self.topDangLen;
        self.gameTable.playerOverviewData.VipLevel = this.VipLevel;
    },
    isTop:function () {
        if (this.topCaoThu != -1){
            return true;
        }
        if (this.topDangLen != -1){
            return true;
        }
        if (this.topDaiGia != -1){
            return true;
        }
        return false;
    },
    maskCircleChan:null,
    showMaskNotReady:function(){
        this._super();
        if (this.maskCircleChan!= null){
            this.maskCircleChan.removeFromParent();
        }
        this.maskCircleChan = new cc.DrawNode();
        var winSize = this.getContentSize();//cc.winSize;
        var radius = 28;
        var color = cc.color(0, 0, 0, 120);
        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        this.maskCircleChan.drawCircle(cc.p(winSize.width / 2, winSize.height / 2), radius, 0, 100, false, radius*2,color );
        this.addChild(this.maskCircleChan,COUNT_DOWN_TIME_ZO+1);
    },
    clearImgMaskNotReady:function() {
        this._super();
        if (this.maskCircleChan!= null){
            this.maskCircleChan.removeFromParent();
            this.maskCircleChan = null;
        }
    },
    clearAllMask:function () {
        this._super();
        this.clearVipMedal();
        if (this.maskCircleChan!= null){
            this.maskCircleChan.removeFromParent();
            this.maskCircleChan = null;
        }
    }
});