var NAME_TOP_ALIGN = 50;
var MONEY_TOP_ALIGN = 5;

VvAvatar = BkSprite.extend({
    playerData:null,
    lbName:null,
    lbMoney:null,
    avarSprite:null,
    lvSprite:null,
    bgSprite:null,
    bgAvaSprite:null,
    imgRank:null,
    levelStarBg:null,
    isShowPlayerDetail:false,
ctor:function (data) {
        if (data != undefined) {
            this.playerData = data;
        }
        this._super();
        this._initPlayerSprite();
        this.initEventListener();
    },

    _initPlayerSprite:function()
    {
        this.bgSprite = new BkSprite("#"+res_name.lobby_avatar_bg);
        this.addChild(this.bgSprite);

        var contentSizeW = this.bgSprite.width;
        var contentSizeH = this.bgSprite.height;

        var verticalLine = new BkSprite("#" + res_name.lobby_avatar_vachchia);
        this.bgSprite.addChild(verticalLine,0);
        verticalLine.x = contentSizeW/2 + 15.5;
        verticalLine.y = contentSizeH/2;

        this.levelStarBg = new BkSprite("#" + res_name.level_star_bg);
        this.bgSprite.addChild(this.levelStarBg);
        this.levelStarBg.x = contentSizeW * 3/4 + 3;
        this.levelStarBg.y = contentSizeH/4 + 1;

        this.bgAvaSprite = new BkSprite("#" + res_name.lobby_avatar_circle);
        this.bgSprite.addChild(this.bgAvaSprite);
        this.bgAvaSprite.x = 28;
        this.bgAvaSprite.y = contentSizeH / 2;

        this.lbName = new BkLabel("","",14, true);
        this.lbName.setTextColor(BkColor.DEFAULT_TEXT_COLOR);
        this.bgSprite.addChild(this.lbName);

        this.lbMoney = new BkLabel("","",14);
        this.lbMoney.setTextColor(BkColor.VV_MONEY_TEXT_COLOR);
        this.bgSprite.addChild(this.lbMoney);

        this._configViewPlayer();
    },

    initEventListener:function()
    {
        var self = this;

        this.bgSprite.setMouseOnHover( function () {

        }, function () {

        });

        this.bgSprite.setOnlickListenner(function(touch, event){
            if(self.playerData == null)
            {
                sendGA(BKGA.GAME_CHOOSE, "click BkAvatar null", bk.cpid);
            } else
            {
                var layer = new VvPlayerDetailsWindow(self.playerData.userName);
                layer.setCallbackRemoveWindow(function () {
                    self.isShowPlayerDetail = false;
                });
                layer.showWithParent(self);
                self.isShowPlayerDetail = true;
                sendGA(BKGA.GAME_CHOOSE, "click BkAvatar", bk.cpid);
            }
        });
    },

    isShowPlayerDetailWD: function () {
      return this.isShowPlayerDetail;
    },

    setPlayerdata:function(data){
        this.playerData = data;
        if (this.playerData != null) {
            logMessage("set this.playerData != null");
        } else{
            logMessage("set this.playerData == null");
        }
        this._configViewPlayer();
    },

    getPlayerName:function()
    {
        if (this.playerData == null) {
            return null;
        } else {
            return this.playerData.getUserName();
        }
    },
    _configViewPlayer:function()
    {
        if (this.playerData != null){
            this.setVisible(true);
            logMessage("this.playerData != null");
            this.lbName.setString(Util.trimStringByWidth(this.playerData.userName, 80));
            this.lbMoney.setString(convertStringToMoneyFormat(this.playerData.playerMoney));
            if (this.avarSprite != null){
                this.avarSprite.removeFromParent();
            }

            if (this.playerData.getAvatarId() != -1){
                this.avarSprite = new BkSprite();
                this.avarSprite = VvAvatarImg.getAvatarByID(this.playerData.getAvatarId());
                this.avarSprite.x = this.bgAvaSprite.width/2;
                this.avarSprite.y = this.bgAvaSprite.height/2;
                this.avarSprite.setScale(45/BASE_WIDTH_AVAR);
                this.bgAvaSprite.addChild(this.avarSprite,2);
            }

            if (this.levelStarBg!= null){
                this.levelStarBg.removeFromParent();
            }

            if (this.imgRank!= null){
                this.imgRank.removeFromParent();
            }

            var level = this.playerData.getLevel();
            logMessage("level "+level);
            var levelStar = VvLevelImage.getLevelSprite(level);
            if(this.levelStarBg)this.levelStarBg.removeAllChildren();
            this.levelStarBg.addChild(levelStar);
            levelStar.x = this.levelStarBg.width/2 - 7;
            levelStar.y = this.levelStarBg.height/2;
            this.bgSprite.addChild(this.levelStarBg);

            if(this.imgRank)this.imgRank.removeFromParent();
            this.imgRank = VvLevelImage.getChucDanhImage(level);
            this.imgRank.setScale(0.8);
            this.bgSprite.addChild(this.imgRank);
            this.imgRank.x = this.bgSprite.width * 3/4 + 3;
            this.imgRank.y = this.bgAvaSprite.y + 5;
        } else {
            logMessage("this.playerData == null");
            this.setVisible(false);
        }

        this.lbName.x =  this.bgAvaSprite.x + this.bgAvaSprite.width/2 + this.lbName.getContentSize().width/2 + 5;
        this.lbName.y =  this.bgAvaSprite.y + 10;

        this.lbMoney.x = this.bgAvaSprite.x + this.bgAvaSprite.width/2 + this.lbMoney.getContentSize().width/2 + 5;
        this.lbMoney.y = this.bgAvaSprite.y - 10;
    },

    updateMoney:function(newMoney){
        if (this.playerData != null) {
            this.playerData.setMoney(newMoney);
            this.lbMoney.setString(convertStringToMoneyFormat(this.playerData.playerMoney));
        }
    }
});