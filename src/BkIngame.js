/**
 * Created by bs on 02/10/2015.
 */
var BkIngame = cc.Scene.extend({
    isPauseEvent:false,
    playerInfo:null,
    inviteFriend:null,
    gameLayer:null,
    ChatLayer:null,
    onEnter:function () {
        this._super();
        this.initGameLayer();
        this.initChatLayer();
        BkGlobal.ingameScene = this;
    },

    onEnterTransitionDidFinish:function()
    {
        if(this.ChatLayer){
            this.ChatLayer.visible = true;
            this.ChatLayer.switchChatUpDown(BkUserClientSettings.isChatEnable);
        }
        BkLogicManager.getInGameLogic().networkGetTableInfo();
        if (!BkGlobal.isLoadedChatEmo){
            cc.loader.load(chat_resources,
                function (result, count, loadedCount) {
                }, function () {
                    logMessage("done load chat emo");
                    BkGlobal.isLoadedChatEmo = true;
                });
        } else {
            logMessage("isLoadedChatEmo -> not need reload!");
        }

    },
    initGameLayer:function()
    {
        if (this.gameLayer != null){
            this.gameLayer.removeAllChildren();
            this.gameLayer.removeFromParent();
            this.gameLayer = null;
        }

        // // TODO: init custom layer depend current gameID
        // switch (BkGlobal.currentGameID) {
        //     case GID.TLMN:
        //         this.gameLayer = new BkTLMNGameLayer();
        //         break;
        //     case GID.CO_TUONG:
        //         this.gameLayer = new BkCoTuongGameLayer();
        //         break;
        //     case GID.CO_UP:
        //         this.gameLayer = new BkCoUpGameLayer();
        //         break;
        //     case GID.PHOM:
        //         this.gameLayer = new BkPhomGameLayer();
        //         break;
        //     case GID.BA_CAY:
        //         this.gameLayer = new BkBaCayGameLayer();
        //         break;
        //     case GID.XAM:
        //         this.gameLayer = new BkSamGameLayer();
        //         break;
        //     case GID.TLMN_DEM_LA:
        //         this.gameLayer = new BkTLMNDemLaGameLayer();
        //         break;
        //     case GID.XITO:
        //         this.gameLayer = new BkXiToGameLayer();
        //         break;
        //     case GID.XI_DZACH:
        //         this.gameLayer = new BkXiDzachGameLayer();
        //         break;
        //     case GID.POKER:
        //         this.gameLayer = new BkPokerGameLayer();
        //         break;
			// case GID.LIENG:
        //         this.gameLayer = new BkLiengGameLayer();
        //         break;
        //
			// case GID.MAU_BINH:
        //         this.gameLayer = new BkMauBinhGameLayer();
        //         break;
			// //case GID.XENG:
        //     //    break;
        //     default:
        //         this.gameLayer = new BkTLMNGameLayer();
        //         break;
        // }
        this.gameLayer = new BkChanGameLayer();
        if (this.gameLayer != null){
            this.addChild(this.gameLayer);
            this.gameLayer.setParent(this);
        }
    },

    initChatLayer: function () {
        if (this.ChatLayer != null) {
            this.ChatLayer.removeAllChildren();
            this.ChatLayer.removeFromParent();
            this.ChatLayer = null;
        }
        var chatSetting = 0;
        if (BkGlobal.UserSetting.isChatEnable == 1) {
            chatSetting = 1;
        }
        if (Util.isGameCo()) {
            //Default open chat
            this.ChatLayer = new BkChatBoxCoLayer(1);
        } else {
            this.ChatLayer = new BkChatBoxLayer(chatSetting);
        }
        this.ChatLayer.visible = false;
        if (this.ChatLayer != null){
            this.addChild(this.ChatLayer);
            this.ChatLayer.setParent(this);
        }
    },
    getGameLayer:function()
    {
        if(this.gameLayer == null)
        {
            this.initGameLayer();
        }
        return this.gameLayer;
    },
    getLogic:function()
    {
        return BkLogicManager.getInGameLogic();
    },
    // dinh nghia lai nguoi dung
    showPlayerOverviewInfo:function(data) {
        if (this.playerInfo != null) {
            this.playerInfo.removeSelf();
        }
        //this.playerInfo = new BkPlayerInfo(data);
        this.playerInfo = new VvPlayerInfo(data);
        //this.playerInfo.setVisibleOutBackgroundWindow(true);
        var chatLayer = getCurrentScene().ChatLayer;
        if (chatLayer != undefined){
            chatLayer.setChatDownState();
        }
        var self = this;
        var f = function(){
            logMessage("close playerInfo callback");
            self.getGameLayer().enableEventStartGameButton();
            if (chatLayer != undefined){
                chatLayer.restoreUpDownState();
            }
        };
        this.getGameLayer().disableEventStartGameButton();
        this.playerInfo.setCallbackRemoveWindow(f);
        this.playerInfo.setParentWindow(this);
        this.playerInfo.showWithParent();
    },

    showInviteWindows:function(logic) {
        if (this.inviteFriend != null) {
            this.inviteFriend.removeFromParent();
        }
        this.inviteFriend = new BkInviteOtherPlayer(logic);
        //this.inviteFriend.setVisibleOutBackgroundWindow(true);
        var self = this;
        var f = function(){
            logMessage("close inviteFriend callback");
            self.getGameLayer().enableEventStartGameButton();
            //self.getGameLayer().showStartGameButton(false);
        };
        this.getGameLayer().disableEventStartGameButton();
        //this.getGameLayer().hideStartGameButton();
        this.inviteFriend.setCallbackRemoveWindow(f);
        this.inviteFriend.setParentWindow(this);
        this.inviteFriend.showWithParent();
    },

    showInviteFriend:function(data, tag) {
        if (this.inviteFriend != null) {
            this.inviteFriend.drawFriendsList(data, tag);
        }
    },
    updateChatBox: function (chatMsg, serverPos) {
        var indexChat = Util.isTextChatEmo(chatMsg);
        var player = this.getLogic().getPlayer(serverPos);
        var playerName = player.getName();
        var pavar = this.getGameLayer().getAvatarByServerPos(serverPos);
        if (indexChat == -1){
            if(this.ChatLayer) {
                this.ChatLayer.updateReceiveMsg(chatMsg,playerName);
            }
            if (pavar != null){
                var index = this.getGameLayer().getIndexOfAvatarByName(playerName);
                var xPos = pavar.x;
                var yPos = pavar.y;
                var avarMarginY = 70;
                var avarMarginX = 80;
                var deltaX = 0;
                var deltaY = 0;
                if (index!= -1){
                    var maxPlayer = getMaxPlayer(BkGlobal.currentGameID);
                    switch(index) {
                        case 0:
                            deltaY = avarMarginY;
                            break;
                        case 1:
                            deltaX = -1.2 * avarMarginX;
                            break;
                        case 2:
                            if (maxPlayer == 6){
                                deltaX = -1.2 * avarMarginX;
                            } else {
                                deltaY = - avarMarginY;
                            }
                            break;
                        case  3:
                            deltaX = avarMarginX;
                            if (maxPlayer == 6){
                            }
                            break;
                        case  4:
                            if (maxPlayer == 6){
                                deltaX = avarMarginX;
                            }
                            break;
                        case  5:
                            if (maxPlayer == 6){
                                deltaX = avarMarginX;
                            }
                            break;
                        default:{
                        }
                    }
                }
                xPos+= deltaX;
                yPos+= deltaY;

                if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
                    if(player.isObserver === false ){
                        index = player.tablePosition;
                        yPos = 520;
                        if(index == 0){
                            xPos = 100;
                        }
                        else if(index == 1){
                            xPos = 850;
                        }
                    }
                    else return;
                }

                pavar.showChatWithContent(chatMsg,xPos,yPos);
            }
        } else {
            if (pavar!= null){
                pavar.showEmotionWithIndex(indexChat);
            }
        }
    },

    updateUpDownChatBoxState: function (value) {
        this.ChatLayer.displayChatState = value;
        if(this.ChatLayer) {
            this.ChatLayer.switchChatUpDown(value);
        }
    },

    setDisablePlayerChat: function (isEnable) {
        if(this.ChatLayer) {
            this.ChatLayer.setDisablePlayerChat(isEnable);
        }
    },
    updateUContentChatbox:function (strCuoc) {
        if(this.ChatLayer) {
            this.ChatLayer.updateReceiveMsg(strCuoc,null);
        }
    }

});