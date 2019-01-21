/**
 * Created by bs on 12/10/2015.
 */
var BkPrepareGame = cc.Scene.extend({
    isPauseEvent: false,
    prepareGameLayer: null,
    onEnter: function () {
        logMessage("------------------------------BkPrepareGame-------------------------- ");
        this._super();
        cc.spriteFrameCache.addSpriteFrames(addition_res.login_register_ss_plist, addition_res.login_register_ss_img);
        this.prepareGameLayer = new BkPrepareGameLayer(GS.PREPARE_GAME);

        this.addChild(this.prepareGameLayer);
        if(bk.isDesktopApp) {
        var listAccount = BkUserClientSettings.getListUserLoggedIn();
            if (!BkGlobal.isAutoCreateAccount && listAccount.length > 0) {
                this.prepareGameLayer.showChooseAccountWindow();
            } else {
                this.prepareGameLayer.showLoginWindow(1);
            }
        }

        visibleGameCanvas(true);

        // reset all game state
        BkGlobal.currentGameID = -1;
        BkGlobal.currentRoomID = -1;
        BkGlobal.currentTableID = -1;
    },
    onEnterTransitionDidFinish: function () {
        this._super();
        logMessage("BkPrepareGame  onEnterTransitionDidFinish");
        this.scheduleUpdate();
    },
    update:function()
    {
        var currS = getCurrentScene();
        if (currS != null) {
            if (currS instanceof BkPrepareGame)
            {

                    if(cc.game.config.app.isNoelSeason == 1 && bk.fbAppIndex != 20 && bk.fbAppIndex != 19 )
                    {
                        //Util.showSnow(this);
                    }
                    this.unscheduleUpdate();
            }
        }
    },
    visibleBtnItem: function (isVisible) {
        this.prepareGameLayer.visibleTop(isVisible);
    },
    showLoginWd: function (tab) {
       this.prepareGameLayer.showLoginWindow(tab);
    },

    visibleChooseAccWd:function (isVisible) {
      this.prepareGameLayer.visibleChooseAccWd(isVisible);
    }
});