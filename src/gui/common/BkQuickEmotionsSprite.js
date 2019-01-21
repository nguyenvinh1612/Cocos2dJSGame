/**
 * Created by hoangthao on 12/11/2015.
 */
CHAT_SMILE_TEXT_LENGTH = 25;
CHAT_SMILE_BG_VIEW_SIZE = 115;
BkQuickEmotionsSprite = BkSprite.extend({
    parentNode: null,
    spriteFrameCache: cc.spriteFrameCache,
    detailEmo: null,
    isShowingDetail: null,
    staticEmo: null,
    lblChatDescription:null,
    chatSetting : null,

    ctor: function (parent) {
        this._super();
        this.parentNode = parent;
        this.chatSetting = new BkChatSettingByGame(15, 10, 15, 5, 38, 270, 24, res.vv_chat_emo_static_plist, res.vv_icon_chat_emo_static);
    },

    createQuickEmoList: function () {
        this.removeAllEmo();
        var fileName = "";
        this.spriteFrameCache.addSpriteFrames(this.chatSetting.spriteSheetPlist, this.chatSetting.spriteSheetImg);
        var chatListBg = new cc.DrawNode();
        chatListBg.drawRect(cc.p(0, 0), cc.p(this.parentNode.chatMiniSprite.width, this.chatSetting.bgHeight), CHAT_BG_COLOR, 2, CHAT_BG_COLOR_BORDER);
        chatListBg.x = 0;
        chatListBg.y = 0;
        this.addChild(chatListBg, -1);

        var chatPreviewBg = new cc.DrawNode();
        chatPreviewBg.drawRect(cc.p(0, 0), cc.p(CHAT_SMILE_BG_VIEW_SIZE, CHAT_SMILE_BG_VIEW_SIZE),
            cc.color(CHAT_BG_COLOR.r, CHAT_BG_COLOR.g, CHAT_BG_COLOR.b, 100), 2, cc.color(CHAT_BG_COLOR.r, CHAT_BG_COLOR.g, CHAT_BG_COLOR.b, 110));
        chatPreviewBg.x = chatListBg.x;
        chatPreviewBg.y = this.chatSetting.bgHeight - CHAT_SMILE_BG_VIEW_SIZE;
        //this.addChild(chatPreviewBg, -1);

        for (var i = 1; i <= CHAT_SMILE_TEXT_LENGTH; i++) {
            // truongbs ++: tip trick change emo 22 -> 26
            if (i != 22){
                fileName = "vv_expression" + i + ".png";
            } else {
                fileName = "vv_expression26.png";
            }

            var emoSp = new BkEmotionsItem(this.spriteFrameCache.getSpriteFrame(fileName), i, this);
            this.addChild(emoSp);
        }
        var bottomBar = new cc.DrawNode();
        bottomBar.drawRect(cc.p(0, 0), cc.p(this.parentNode.chatMiniSprite.width, this.parentNode.chatMiniSprite.height), cc.color(0, 0, 0, 0), 0, cc.color(0, 0, 0, 0));
        bottomBar.y = -this.parentNode.chatMiniSprite.height;
        this.addChild(bottomBar, -1);

        this.showStaticEmo(1);
    },

    removeAllEmo: function () {
        this.setVisible(false);
        this.removeAllChildren();
    },
    onShowDetailEmoIco: function (emoIndex) {
        if (this.isShowingDetail)
            return;
        this.isShowingDetail = true;
        this.removeDetailEmo();
        logMessage("onShowDetailEmoIco "+emoIndex);
        this.detailEmo = new BkChatEmoSprite(Util.getChatEmoDataWithIndex(emoIndex));
        this.addChild(this.detailEmo);
        this.detailEmo.x = this.staticEmo.x;
        this.detailEmo.y = this.staticEmo.y;
        this.detailEmo.showEmoForever();
    },
    removeDetailEmoIco: function () {
        this.isShowingDetail = false;
    },
    showStaticEmo: function (emoIndex) {
        this.removeDetailEmo();
        if(this.lblChatDescription) {
            this.lblChatDescription.removeFromParent();
        }
        var data = Util.getChatEmoDataWithIndex(emoIndex);
        cc.spriteFrameCache.addSpriteFrames(data.iconPlist, data.iconTexture);
        this.staticEmo = new BkSprite("#" + data.iconName + "_1.png");
        this.addChild(this.staticEmo);
        this.staticEmo.x = CHAT_SMILE_BG_VIEW_SIZE / 2;
        this.staticEmo.y = this.chatSetting.bgHeight + CHAT_SMILE_BG_VIEW_SIZE/2;
       /* if(this.staticEmo.height > CHAT_SMILE_BG_VIEW_SIZE){
            this.staticEmo.y = this.chatSetting.bgHeight - CHAT_SMILE_BG_VIEW_SIZE + this.staticEmo.height / 2;
        }*/

        this.lblChatDescription = new BkLabel(Util.getSmileText(emoIndex -1),"", 16);
        this.lblChatDescription.x = CHAT_SMILE_BG_VIEW_SIZE - this.lblChatDescription.width/2;
        this.lblChatDescription.y = this.chatSetting.bgHeight + this.lblChatDescription.height/2;
        this.addChild(this.lblChatDescription,2);
    },
    restoreUpDownStateP: function () {
        this.parentNode.restoreUpDownState();
    },
    removeBkQuickEmotionsSpriteP: function () {
        this.parentNode.removeQuickEmoList();
    },
    removeDetailEmo: function () {
        if (this.staticEmo != null) {
            this.staticEmo.removeFromParent();
        }
        if (this.detailEmo) {
            this.detailEmo.removeEmo();
        }
    },
    onExit: function () {
        this.spriteFrameCache.removeSpriteFramesFromFile(this.chatSetting.spriteSheetPlist);
        this._super();
    }
});

BkEmotionsItem = BkSprite.extend({
    parentNode: null,
    idEmo: null,
    bgHover: null,
    emoSp: null,
    atHoverPos:false,
    chatSetting:null,
    ctor: function (frameObject, id, parent) {
        this._super();
        this.idEmo = id;
        this.parentNode = parent;
        this.chatSetting = this.parentNode.chatSetting;
        this.x = this.chatSetting.emoSpace;
        var self = this;
        this.bgHover = new cc.DrawNode();
        this.bgHover.drawRect(cc.p(-this.chatSetting.bgHoverSize, -this.chatSetting.bgHoverSize), cc.p(this.chatSetting.bgHoverSize, this.chatSetting.bgHoverSize), cc.color(255, 255, 255, 30), 1, cc.color(255, 255, 255, 30));
        this.addChild(this.bgHover, -1);
        this.bgHover.visible = false;
        var viewAniEmo = function () {
            self.parentNode.onShowDetailEmoIco(self.idEmo);
            logMessage("self.idEmo:" + self.idEmo);
        };
        this.emoSp = new BkSprite(frameObject);
        this.addChild(this.emoSp);
        this.emoSp.setMouseOnHover(
            function (event) {
                if(!self.atHoverPos) {
                    self.atHoverPos = true;
                    self.bgHover.setVisible(true);
                    self.parentNode.showStaticEmo(self.idEmo);
                    self.scheduleOnce(viewAniEmo, 0.8, "viewAniEmo");
                }
            }, function (event) {
                self.bgHover.setVisible(false);
                self.parentNode.removeDetailEmoIco();
                self.unschedule(viewAniEmo);
                self.atHoverPos = false;
            });
        this.emoSp.setOnlickListenner(function () {
            self.onClickItem(id);
        });
        this.configPos(id);
    },
    configPos: function (myID) {
        var row = Math.floor((myID - 1) / this.chatSetting.numberPerLine);
        var column = (myID - 1) % this.chatSetting.numberPerLine;
/*        if (myID > 23) {
            row = 5;
            column = (myID - 1) % 3;
        }
        if (myID > 20) {
            column = column + 2;
        }*/

        this.emoSp.x = 2 * this.chatSetting.emoMarginRl + column * (this.chatSetting.emoSmileSize + this.chatSetting.emoSpace);
        this.emoSp.y = 2 * this.chatSetting.emoMarginTb + row * (this.chatSetting.emoSmileSize + this.chatSetting.emoMarginTb);
        this.bgHover.x = this.emoSp.x;
        this.bgHover.y = this.emoSp.y;
    },
    onClickItem: function (id) {
        this.createTableChatMessage(Util.getSmileText(id -1));
        if(this.parentNode) {
            this.parentNode.setVisible(false);
            this.parentNode.removeBkQuickEmotionsSpriteP();
            this.parentNode.restoreUpDownStateP();
        }
    },
    createTableChatMessage: function (message) {
        BkLogicManager.getInGameLogic().lastTimeSendChat = BkTime.GetCurrentTime();
        var packet = new BkPacket();
        packet.createChatMessage(message);
        BkConnectionManager.send(packet);
    }
});

BkChatSettingByGame = cc.Class.extend({
    emoMarginTb: null,
    emoMarginRl: null,
    emoSpace: null,
    numberPerLine: null,
    emoSmileSize: null,
    bgHeight: null,
    bgHoverSize: null,
    spriteSheetPlist: null,
    spriteSheetImg: null,

    ctor: function (emoMarginTb, emoMarginRl, emoSpace, numberPerLine, emoSmileSize, bgHeight, bgHoverSize, spriteSheetPlist, spriteSheetImg) {
        this.emoMarginTb = emoMarginTb;
        this.emoMarginRl = emoMarginRl;
        this.emoSpace = emoSpace;
        this.numberPerLine = numberPerLine;
        this.emoSmileSize = emoSmileSize;
        this.bgHeight = bgHeight;
        this.bgHoverSize = bgHoverSize;
        this.spriteSheetPlist = spriteSheetPlist;
        this.spriteSheetImg = spriteSheetImg;
    }
});
