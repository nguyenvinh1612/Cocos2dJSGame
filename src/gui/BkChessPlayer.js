/**
 * Created by VanChinh on 2/20/2016.
 */

BkChessPlayer = BkPlayer.extend({
    alarmEndTimeSprite: null,
    chessPlayerBackground: null,
    ctor:function (data, status) {
        this._super(data, status)
    },

    _initPlayerSprite:function()
    {
        this.spriteFrameCache.addSpriteFrames(res.Player_Asset_plist, res.Player_Asset_img);

        var widthSize = this.getContentSize().width;
        var heightSize = this.getContentSize().height;

        this.chessPlayerBackground = new BkSprite("#Chess_player_bg.png");
        this.addChild(this.chessPlayerBackground);
        this.chessPlayerBackground.x = widthSize / 2 + 36.5;
        this.chessPlayerBackground.y = heightSize / 2 + 0.5;

        this.bgSprite = new BkSprite("#" + res_name.Chess_bg_avatar);
        this.addChild(this.bgSprite);
        this.bgSprite.x = widthSize / 2;
        this.bgSprite.y = heightSize / 2 + 0.5;

        this.avatarSprite = new BkSprite("#" + res_name.Chess_addplayer);
        this.addChild(this.avatarSprite);
        this.avatarSprite.x = widthSize / 2;
        this.avatarSprite.y = heightSize / 2 + 0.5;

        this.greenSprite = new BkSprite("#" + res_name.Chess_dark_countdown);
        this.greenSprite.x = widthSize/2;
        this.greenSprite.y = heightSize/2 + 0.5;
        this.greenSprite.setVisible(false);
        this.addChild(this.greenSprite);

        this.lbName = new BkLabel("","",14);
        this.lbName.setTextColor(cc.color(255,255,255));
        this.lbName.x = Math.floor(70 + this.lbName.getContentSize().width / 2);
        this.lbName.y =  -6.5;
        this.addChild(this.lbName,100);

        this.lbMoney = new BkLabel("","",14);
        this.lbMoney.setTextColor(cc.color(255,255,0));
        this.lbMoney.x = Math.floor(70 + this.lbMoney.getContentSize().width / 2);
        this.lbMoney.y = -26.5;
        this.addChild(this.lbMoney,101);


        this.lvSprite = new BkSprite();
        this.lvSprite.x = -25;
        this.lvSprite.y = heightSize/2 - 45;
        this.addChild(this.lvSprite);

        this.chubanSprite = new BkSprite("#Chess_chuban.png");
        this.chubanSprite.x =  widthSize/2 - 30;
        this.chubanSprite.y =  heightSize/2 + 29.5;
        this.chubanSprite.setVisible(false);
        this.addChild(this.chubanSprite,102);

        this._configViewPlayer();
    },

    initCountDown:function()
    {
        var self = this;
        var f= function(){
            logMessage("finish cb");
            self.stopCountDown();
        };
        //this.cdSprite = new BkCountDownTime("#" + res_name.Chess_dark_countdown);
        this.cdSprite = new BkCountDownTime("#" + res_name.Chess_countdown);
        this.cdSprite.x = this.getContentSize().width/2;
        this.cdSprite.y = this.getContentSize().height/2 + 0.5;
        this.cdSprite.setCallback(f);
        this.addChild(this.cdSprite);

        this.configAlarm();
    },

    configAlarm: function(){

        var currScene = getCurrentScene();
        if (currScene != null) {
            if (currScene instanceof BkIngame) {
                if(currScene.gameLayer){
                    var gameLogic = currScene.gameLayer.getLogic();
                    var currentPlayer = gameLogic.getMyClientState();
                    if(currentPlayer && !currentPlayer.isObserver && currentPlayer.UserInfo.userName == this.playerData.userName){
                        var self = this;
                        var f = function(){

                            if(self.alarmEndTimeSprite){
                                var action1 = new cc.FadeTo(0.75, 255);
                                var action2 = new cc.FadeTo(0.75, 0);
                                self.alarmEndTimeSprite.setVisible(true);
                                self.alarmEndTimeSprite.runAction(cc.sequence(action1, action2)).repeatForever();
                            }
                            var parent = self.getParent();
                            if(parent && parent.tableRedStatus){
                                var act1 = new cc.FadeTo(0.75, 255);
                                var act2 = new cc.FadeTo(0.75, 0);
                                parent.tableRedStatus.setVisible(true);
                                parent.tableRedStatus.runAction(cc.sequence(act1, act2)).repeatForever();
                            }
                        };
                        this.cdSprite.setAlarmCallBack(f);

                        this.alarmEndTimeSprite = new BkSprite("#" + res_name.ActiveAvatar);
                        this.alarmEndTimeSprite.x = this.getContentSize().width/2;
                        this.alarmEndTimeSprite.y = this.getContentSize().height/2;
                        this.alarmEndTimeSprite.setOpacity(0);
                        this.alarmEndTimeSprite.setVisible(false);
                        this.addChild(this.alarmEndTimeSprite);
                    }
                }
            }
        }
    },

    _configViewPlayer:function(isNewLevel)
    {
        this._super(isNewLevel);

        var widthSize = this.getContentSize().width;
        var heightSize = this.getContentSize().height;

        if(this.playerData != null){
            this.lbName.setString(Util.trimStringByWidth(this.playerData.userName,55));
            this.lbName.x =  43 + this.lbName.getContentSize().width / 2;
            this.lbMoney.setString("$ " + convertStringToMoneyFormat(this.playerData.playerMoney));
            this.lbMoney.x = 43 + this.lbMoney.getContentSize().width / 2;
            this.avatarSprite.scale = 0.7;
            this.avatarSprite.x = widthSize / 2;
            this.avatarSprite.y = heightSize / 2 + 1;
        }
        else{
            this.avatarSprite.removeFromParent();
            this.avatarSprite = new BkSprite("#Chess_addplayer.png");
            this.avatarSprite.x = widthSize / 2;
            this.avatarSprite.y = heightSize / 2 + 0.5;
            this.avatarSprite.scale = 1;
            this.addChild(this.avatarSprite);
        }
    },

    setLevelSprite:function(level) {
        this.clearLevelSprite();
        this.lvSprite.addChild(BkLevelImage.createLevelStarHorizontalSprite(level));
        if (this.playerData != null){
            if ((this.status != PLAYER_STATE_READY)&&(this.status != PLAYER_STATE_TABLE_OWNER)){
                this.lvSprite.setOpacity(AVAR_OPACITY);
            } else {
                this.lvSprite.setOpacity(255);
            }
        }
    },

    showMaskNotReady:function(){
        this._super();
        this.chessPlayerBackground.opacity = AVAR_OPACITY;
    },

    clearImgMaskNotReady:function()
    {
        this._super();
        this.chessPlayerBackground.opacity = 255;
    }
});