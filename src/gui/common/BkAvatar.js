/**
 * Created by bs on 06/10/2015.
 */

var NAME_TOP_ALIGN = 50;
var MONEY_TOP_ALIGN = 5;

BkAvatar = BkSprite.extend({
    playerData:null,
    lbName:null,
    lbMoney:null,
    lbMoneyDes:null,
    avarSprite:null,
    lvSprite:null,
    bgSprite:null,
    imgRank:null,
    iconMoneny:null,
    bgHover:null,
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
        if(Util.isNeedToChangeIcon())
        {
            this.bgSprite = new BkSprite("#"+res_name.ImgBgAvarAcc_chess);

        }else
        {
            this.bgSprite = new BkSprite("#"+res_name.ImgBgAvarAcc);
        }
        this.addChild(this.bgSprite);
        this.bgSprite.x = this.getContentSize().width/2;
        this.bgSprite.y = this.getContentSize().height/2;
        if(Util.isNeedToChangeIcon())
        {
            this.bgHover = new BkSprite("#"+res_name.ImgBgAvarAccHover_chess);
        }else
        {
            this.bgHover = new BkSprite("#"+res_name.ImgBgAvarAccHover);
        }
        this.addChild(this.bgHover,1);
        this.bgHover.x = this.bgSprite.x;
        this.bgHover.y = this.bgSprite.y;
        this.bgHover.setVisible(false);

        this.iconMoneny = new BkSprite("#"+res_name.top_goldcoin);
        this.addChild(this.iconMoneny);
        this.iconMoneny.x = this.bgSprite.x + this.bgSprite.width/2 + 5 + this.iconMoneny.getContentSize().width/2;
        this.iconMoneny.y = this.bgSprite.y - 10;

        this.lbName = new BkLabel("","",16, true);
        this.lbName.setTextColor(BkColor.DEFAULT_TEXT_COLOR);
        this.addChild(this.lbName);

        this.lbMoney = new BkLabel("","",14);
        this.lbMoney.setTextColor(cc.color(255,255,0));
        this.addChild(this.lbMoney);

        this.lbMoneyDes = new BkLabel("","",14);
        this.lbMoneyDes.setTextColor(cc.color(255,255,255));
        this.addChild(this.lbMoneyDes);

        this._configViewPlayer();
    },

    initEventListener:function()
    {
        var self = this;
        this.bgSprite.setMouseOnHover(function(){
            self.bgHover.setVisible(true);
        },function(){
            self.bgHover.setVisible(false);
        });

        this.bgSprite.setOnlickListenner(function(touch, event){
            if(self.playerData == null)
            {
                //showToastMessage("click TYPE_INVITE_FRIEND_AVATAR");
                sendGA(BKGA.GAME_CHOOSE, "click BkAvatar null", bk.cpid);
            }else
            {
                var layer = new BkPlayerDetailsWindow(self.playerData.userName);
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
            this.lbName.setString(this.playerData.userName);
            this.lbMoney.setString(convertStringToMoneyFormat(this.playerData.playerMoney));
            this.lbMoneyDes.setString(BkLevelImage.getStringFromMoney(this.playerData.playerMoney));
            if (this.avarSprite != null){
                this.avarSprite.removeFromParent();
            }

            if (this.playerData.getAvatarId() != -1){
                this.avarSprite = new BkSprite();
                this.avarSprite = BkAvartarImg.getAvatarByID(this.playerData.getAvatarId());
                this.avarSprite.x = this.bgSprite.x;
                this.avarSprite.y = this.bgSprite.y;
                this.avarSprite.setScale(34/BASE_WIDTH_AVAR);
                this.addChild(this.avarSprite,2);
            }
        } else {
            logMessage("this.playerData == null");
            this.setVisible(false);
        }

        this.lbName.x =  this.bgSprite.x + this.bgSprite.width/2 + this.lbName.getContentSize().width/2 + 5;
        this.lbName.y =  this.bgSprite.y + 10;

        this.lbMoney.x = this.iconMoneny.x+this.iconMoneny.width/2+this.lbMoney.getContentSize().width/2 + 3;
        this.lbMoney.y = this.iconMoneny.y;
        this.lbMoneyDes.x = this.lbMoney.x+this.lbMoney.getContentSize().width/2+this.lbMoneyDes.getContentSize().width/2 + 5;
        this.lbMoneyDes.y = this.lbMoney.y;

        //this.lbName.setString("admin");
        //this.lbMoney.setString("10.000");
    },

    updateMoney:function(newMoney){
        if (this.playerData != null) {
            this.playerData.setMoney(newMoney);
            this.lbMoney.setString(convertStringToMoneyFormat(this.playerData.playerMoney));
        }
    }
});