/**
 * Created by bs on 12/10/2015.
 */

var BkChooseGame = cc.Scene.extend({
    isPauseEvent: false,
    chooseGameLayer: null,
    onEnter: function () {
        Util.showAnim();
        logMessage("------------------------------BkChooseGame ");
        this._super();
        //this.chooseGameLayer = new BkChooseGameLayer();
        if(bk.isSubFbApp){
            this.chooseGameLayer = new BkSubAppGameLayer(GS.CHOOSE_GAME);
        }else {
            this.chooseGameLayer = new BkMainAppGameLayer(GS.CHOOSE_GAME);
        }
        this.addChild(this.chooseGameLayer);

        this.chooseGameLayer.updateTextPosButton();
        // reset all game state
        BkGlobal.currentGameID = -1;
        BkGlobal.currentRoomID = -1;
        BkGlobal.currentTableID = -1;
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        this.scheduleUpdate();
        //Init avatar & shop item img
        Util.removeAnim();
    },
    update:function(){
        var currS = getCurrentScene();
        if (currS != null) {
            if (currS instanceof BkChooseGame) {
                if (this.chooseGameLayer != null) {
                    this.chooseGameLayer.updateUserState();
                    this.chooseGameLayer.updateAvatar(BkGlobal.UserInfo);
                    if (Util.isNeedtoShowRegisterPushButton()) {
                        this.chooseGameLayer.showRegisterPushbtn();
                    }
                    if(cc.game.config.app.isNoelSeason == 1 && bk.fbAppIndex != 20 && bk.fbAppIndex != 19 )
                    {
                            Util.showSnow(this);
                    }
                    if (BkGlobal.UserInfo.listAvatar == null) {
                        BkLogicManager.getLogic().processAfterLogin();
                    }
                    if (BkGlobal.UserInfo.playerMoney == 0 && !Util.getClientSession(key.isShowPromotionWD,1))
                    {
                        BkLogicManager.getLogic().showPromotionAtChooseGame(BkLogicManager.getLogic().dailyTaskList);
                        Util.setClientSession(key.isShowPromotionWD, 1);
                    }
                    if(BkGlobal.isAutoCreateAccount)
                    {
                        var self = this;
                        BkDialogWindowManager.showPopupWith("Hệ thống đã tự động tạo cho bạn tài khoản với tên đăng nhập: " + BkGlobal.UserInfo.userName + " và mật khẩu: " + BkGlobal.UserInfo.password + " Bạn có muốn đổi tên đăng nhập và mật khẩu không ?",null,function ()
                        {
                            BkGlobal.isAutoCreateAccount = false;
                            var layer = new VvPlayerDetailsWindow(BkGlobal.UserInfo.userName);
                            layer.setCallbackRemoveWindow(function () {
                                self.isShowPlayerDetail = false;
                            });
                            layer.showWithParent(self);
                            self.isShowPlayerDetail = true;
                            sendGA(BKGA.GAME_CHOOSE, "Automatic login Rename", bk.cpid);
                        },function(){BkGlobal.isAutoCreateAccount = false;},function(){BkGlobal.isAutoCreateAccount = false;},TYPE_CONFIRM_BOX,null);
                    }
                    this.unscheduleUpdate();
                }
            }
        }
    },
    updateAvatar: function (data) {
        if (this.chooseGameLayer != null) {
            this.chooseGameLayer.updateAvatar(data);
        }
    },
    updatebtnPayment: function () {
        if (this.chooseGameLayer != null) {
            this.chooseGameLayer.updatebtnPayment();
        }
    }
});