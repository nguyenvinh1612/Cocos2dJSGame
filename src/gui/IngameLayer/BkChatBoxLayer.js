/**
 * Created by hoangthao on 05/11/2015.
 */

CHAT_MSG_DISPLAY_DOWN=0;
CHAT_MSG_DISPLAY_UP=1;
CHAT_MSG_ROW_HEIGH=15;
CHAT_QUICK_TEXT_ROW_HEIGH=22;
CHAT_OPEN_HEIGH=120;
CHAT_BG_COLOR = cc.color(0x15,0x01,0x06,100);//cc.color(11, 10, 47,100);
CHAT_BG_COLOR_BORDER = cc.color(0x45,0x29,0x00,50);//cc.color(1, 14, 78, 50);

CHAT_PLACE_HOLDER_TEXT=" Nhập nội dung chat ...";

var BkChatBoxLayer = cc.Layer.extend({
    chatOpenBg: null,
    chatMiniSprite: null,
    inputMsg: null,
    chatView: null,
    btnChatUpDown: null,
    quickTextSprite: null,
    quickTextHover: null,
    quickEmoSprite: null,
    quickEmoHover: null,
    btnChatSmileState: null,
    btnChatTxtState: null,
    chatBoxDisplayMode: CHAT_MSG_DISPLAY_DOWN,
    displayChatState:null,
    chatXPosByGame: 0,
    chatYPosByGame: 0,
    isGameCo: false,
    chatQuickChatText: [
        "Chào các bác, cho em xin 1 chân",
        "Bác ơi, sẵn sàng nhanh nào",
        "Mạng em bị lag quá",
        "Tưởng chú thế nào, xịt nhỉ",
        "Xin lỗi, em vừa bận tí",
        "Chỉ có Lý trưởng trở lên mới được chơi",
        "Đỏ thế nhỉ, bác nay ăn thịt Rùa ah?",
        "Hẹn bác lần sau nhé",
        "Chơi to lên chút cho máu",
        "Chơi Gà Góp mới thú vị chứ",
        "Ăn được con Gà sướng quá",
        "Chơi Ù 4-11 không?",
        "Ù phát này sướng cả người",
        "Chơi Luật nâng cao hấp dẫn hơn"],

    ctor: function (chatMode, isGameCo) {
        this._super();
        if (chatMode) {
            this.chatBoxDisplayMode = chatMode;
        }

        if(isGameCo){
            this.isGameCo = isGameCo;
        }

        this.drawChat(this.isGameCo);

        this.initQuickChatText();

        this.initQuickEmoSprite(this.isGameCo);
    },

    drawChat: function (isGameCo) {
        var parent = this;
        var chat_bg_mini_res = "#";
        chat_bg_mini_res += isGameCo ? res_name.chat_bg_mini_co : res_name.chat_bg_mini;
        chat_bg_mini_res = "#chat_bar.png";
        this.chatMiniSprite = new BkSprite(chat_bg_mini_res);
        this.addChild(this.chatMiniSprite, -1);

        //this.btnChatTxt = new BkButton(res_name.Btn_Chat_Text,res_name.Btn_Chat_Text,res_name.Btn_Chat_Text,res_name.Btn_Chat_Text_Hover,ccui.Widget.PLIST_TEXTURE);
        // this.btnChatTxt = new BkButton(res_name.icon_chat_text,res_name.icon_chat_text_press,res_name.icon_chat_text
        //     ,res_name.icon_chat_text_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnChatTxt = new BkButton(res_name.vv1_icon_chat_text,res_name.vv1_icon_chat_text_press,res_name.vv1_icon_chat_text
            ,res_name.vv1_icon_chat_text_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnChatTxt.x = this.btnChatTxt.width / 2 + 0;
        this.btnChatTxt.y = this.chatMiniSprite.height / 2;
        this.btnChatTxt.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    parent.onClickBtnChatText();
                    return true;
            }

        }, this);
        this.chatMiniSprite.addChild(this.btnChatTxt, WD_ZORDER_TOP);

        //this.btnChatSmile = new BkButton(res_name.Btn_Chat_Smile,res_name.Btn_Chat_Smile,res_name.Btn_Chat_Smile,res_name.Btn_Chat_Smile_Hover,ccui.Widget.PLIST_TEXTURE);
        // this.btnChatSmile = new BkButton(res_name.chat_icon_smile,res_name.chat_icon_smile_press
        //     ,res_name.chat_icon_smile,res_name.chat_icon_smile_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnChatSmile = new BkButton(res_name.vv1_chat_icon_smile,res_name.vv1_chat_icon_smile_press
            ,res_name.vv1_chat_icon_smile,res_name.vv1_chat_icon_smile_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnChatSmile.x = Math.floor(this.btnChatTxt.x + this.btnChatTxt.width + 1);
        this.btnChatSmile.y = this.btnChatTxt.y;
        this.btnChatSmile.addTouchEventListener(function (sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_BEGAN:
                    parent.onClickBtnChatSmile();
                    return true;
            }
        }, this);
        this.chatMiniSprite.addChild(this.btnChatSmile, WD_ZORDER_TOP);

        var res_name_chatUp_normal = isGameCo? res_name.Chess_Btn_Chat_Up : res_name.Btn_Chat_Up;
        //this.btnChatUpDown = new BkButton(res_name_chatUp_normal,res_name_chatUp_normal,res_name_chatUp_normal,res_name.Btn_Chat_Up_Hover,ccui.Widget.PLIST_TEXTURE);
        this.btnChatUpDown = new BkButton(res_name.vv_chat_icon_up,res_name.vv_chat_icon_up_press,res_name.vv_chat_icon_up
            ,res_name.vv_chat_icon_up_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnChatUpDown.addTouchEventListener(
            function (sender, type) {
                switch (type) {
                    case ccui.Widget.TOUCH_BEGAN:
                        parent.onClickBtnUpDown();
                }
            }
            , this);
        this.addChild(this.btnChatUpDown,WD_ZORDER_TOP);

        var paddingLeftInput = this.btnChatTxt.width + this.btnChatSmile.width + this.btnChatUpDown.width;
        var wSize = this.chatMiniSprite.getContentSize().width + (this.isGameCo ? 4 : 0) - paddingLeftInput;
        this.inputMsg = createEditBox(cc.size(wSize, this.chatMiniSprite.height));
        this.inputMsg.setPlaceHolder(CHAT_PLACE_HOLDER_TEXT);
        this.inputMsg.setFontColor(cc.color(255, 255, 255));
        this.inputMsg.setTabStop();
        this.inputMsg.setFontSize(14);

        this.inputMsg.attr({
            fontName: res.GAME_FONT,
            alignment: cc.TEXT_ALIGNMENT_LEFT,
            x: this.btnChatTxt.width + this.btnChatSmile.width + 5,
            y: this.inputMsg.height / 2,
            anchorX: 0,
            anchorY: 0.5
        });
        this.chatMiniSprite.addChild(this.inputMsg);
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (key, event) {
                if (key == cc.KEY.enter) {
                    parent.onInputSendMsgEvent(event, parent.inputMsg.getString());
                }
            }
        }, this.inputMsg);

        this.chatOpenBg = new cc.DrawNode();
        this.chatOpenBg.drawRect(cc.p(this.chatXPosByGame, this.chatYPosByGame), cc.p(this.chatMiniSprite.width, CHAT_OPEN_HEIGH), CHAT_BG_COLOR, 1, CHAT_BG_COLOR_BORDER);
        this.chatOpenBg.setContentSize(this.chatMiniSprite.width, CHAT_OPEN_HEIGH);
        this.chatOpenBg.anchorY = 0.5;
        this.chatOpenBg.x = -this.chatMiniSprite.width/2;
        this.chatOpenBg.y = this.chatMiniSprite.height - this.chatYPosByGame;
        this.addChild(this.chatOpenBg, -1);

        this.chatView = createTextArea(cc.size(this.chatMiniSprite.width, CHAT_OPEN_HEIGH));
        this.chatView.setMaxLength(200);
        this.chatView.setFontSize(13);
        this.chatView.setFontColor(cc.color.WHITE);
        this.chatView.setDisabled(true);
        this.chatView.setEnableScroll();
        this.chatView.setPadding("5px");
        this.chatView.x = this.chatXPosByGame;
        this.chatView.y = this.chatMiniSprite.height;
        this.addChild(this.chatView);
        this.switchChatUpDown();
    },
    onInputSendMsgEvent: function (sender, inputMsg) {
        logMessage("Enter key");
        this.createTableChatMessage(inputMsg);
        this.inputMsg.setString("");
        this.inputMsg.setAutoFocus(true);
    },
    updateReceiveMsg: function (recvMsg, playerName) {

        this.renderChat(recvMsg, playerName);
    },
    renderChat: function (msg, playerName, mstType) {
        var msgStr = this.chatView.getString() + playerName + ": " + msg + "\n";
        if (playerName == null){
            msgStr = this.chatView.getString() + msg + "\n";
        }
        this.chatView.setString(msgStr);
        this.chatView.setScrollToEnd();
    },
    switchChatUpDown: function (switchMode) {
        if (switchMode != undefined) {
            this.chatBoxDisplayMode = switchMode;
        }
        var res_name_chatUp_normal = this.isGameCo? res_name.Chess_Btn_Chat_Up : res_name.Btn_Chat_Up;
        var res_name_chatDown_normal = this.isGameCo? res_name.Chess_Btn_Chat_Down : res_name.Btn_Chat_Down;
        if (this.chatBoxDisplayMode == CHAT_MSG_DISPLAY_UP) {
            this.x = cc.winSize.width - this.chatOpenBg.width / 2 - 2;
            this.y = this.chatOpenBg.height/2 + 2;
            this.chatMiniSprite.x = this.chatXPosByGame;
            this.chatMiniSprite.y = this.chatMiniSprite.height / 2 - CHAT_OPEN_HEIGH/2 + this.chatYPosByGame;
            this.btnChatUpDown.loadTextures(res_name.vv_chat_icon_down, res_name.vv_chat_icon_down_press, res_name.vv_chat_icon_down,
                res_name.vv_chat_icon_down_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnChatUpDown.x = this.btnChatUpDown.width/2  + 112;
            this.btnChatUpDown.y = this.chatOpenBg.height - this.btnChatUpDown.height/2 - 5;
            this.chatOpenBg.setVisible(true);
            this.chatView.setVisible(true);
            this.chatMiniSprite.setVisible(true);
        } else {
            this.x = cc.winSize.width - this.chatOpenBg.width / 2 - 2;
            this.y = 2;
            this.chatMiniSprite.y = this.chatMiniSprite.height / 2 + this.chatYPosByGame;
            this.chatMiniSprite.x = this.chatXPosByGame;
            this.btnChatUpDown.loadTextures(res_name.vv_chat_icon_up, res_name.vv_chat_icon_up_press, res_name.vv_chat_icon_up,
                res_name.vv_chat_icon_up_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnChatUpDown.x = this.btnChatUpDown.width/2 + 112;
            this.btnChatUpDown.y = this.btnChatUpDown.height / 2  + this.chatMiniSprite.height + this.chatYPosByGame;
            this.chatOpenBg.setVisible(false);
            this.chatView.setVisible(false);
            this.chatMiniSprite.setVisible(true);
        }
    },
    onClickBtnChatText: function (sender, type) {
        this.setChatDownState();
        this.createQuickChatList();
    },

    onClickBtnChatSmile: function () {
        this.setChatDownState();
        this.createQuickEmoList();
    },

    onClickBtnUpDown: function () {
        this.removeQuickChatItem();
        this.removeQuickEmoList();
        if(this.chatBoxDisplayMode == CHAT_MSG_DISPLAY_UP){
            this.switchChatUpDown(CHAT_MSG_DISPLAY_DOWN);
            BkGlobal.UserSetting.isChatEnable = 0;
        }else{
            this.switchChatUpDown(CHAT_MSG_DISPLAY_UP);
            BkGlobal.UserSetting.isChatEnable = 1;
        }
        BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
    },
    createTableChatMessage: function (message) {
        BkLogicManager.getInGameLogic().lastTimeSendChat = BkTime.GetCurrentTime();
        var packet = new BkPacket();
        packet.createChatMessage(message);
        BkConnectionManager.send(packet);
    },

    initQuickChatText: function () {
        this.quickTextSprite = new BkSprite();
        this.addChild(this.quickTextSprite,WD_ZORDER_TOP);
        this.initQuickChatMouseEvent();
    },

    createQuickChatList: function () {
        this.removeQuickChatItem();

        if (this.btnChatTxtState) {
            this.btnChatTxtState = false;
            this.restoreUpDownState();
            return;
        }
        var maxH = 325;
        var quickTextBg = new cc.DrawNode();
        quickTextBg.drawRect(cc.p(0, 0), cc.p(this.chatMiniSprite.width, maxH), CHAT_BG_COLOR, 1, CHAT_BG_COLOR_BORDER);
        quickTextBg.x = -this.chatMiniSprite.width;
        quickTextBg.y = CHAT_QUICK_TEXT_ROW_HEIGH / 2;
        this.quickTextSprite.addChild(quickTextBg, -1);
        var quickTextBottom = new cc.DrawNode();
        quickTextBottom.drawRect(cc.p(0, 0), cc.p(20, this.chatMiniSprite.height),
            cc.color(0, 0, 0, 0), 0, cc.color(0, 0, 0, 0));
        quickTextBottom.x = quickTextBg.x;
        quickTextBottom.y = -this.chatMiniSprite.height;
        this.quickTextSprite.addChild(quickTextBottom, -1);

        for (var i = 0; i < this.chatQuickChatText.length; i++) {
            var custom_item = new BkQuickTextItem(this.chatQuickChatText[i], this);
            custom_item.x = 0;
            custom_item.y = maxH;
            maxH = maxH - CHAT_QUICK_TEXT_ROW_HEIGH;
            this.quickTextSprite.addChild(custom_item);
        }
        this.quickTextSprite.setVisible(true);
        this.quickTextSprite.setContentSize(cc.size(this.chatMiniSprite.width, maxH));
        this.quickTextSprite.x = this.quickTextSprite.width + this.chatXPosByGame;
        this.quickTextSprite.y = this.chatMiniSprite.height-1;
        cc.eventManager.addListener(this.quickTextHover, this.quickTextSprite);
        this.btnChatTxtState = true;
        this.btnChatSmileState = false;
    },

    removeQuickChatItem: function () {
        this.removeQuickEmoList();
        if(this.quickTextSprite.getChildren().length > 0) {
            this.quickTextSprite.setVisible(false);
            cc.eventManager.removeListener(this.quickTextHover);
            this.quickTextSprite.removeAllChildren();
            logMessage("removeQuickChatItem");
        }
    },
    initQuickChatMouseEvent: function () {
        var self = this;
        this.quickTextHover = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: function (event) {
                var location = event.getLocation();
                var target = event.getCurrentTarget();

                if (!cc.rectContainsPoint(target.getBoundingBoxToWorld(), location)) {
                    self.removeQuickChatItem();
                    self.restoreUpDownState();
                }
            }
        });
    },

    initQuickEmoSprite: function (isGameCo) {
        var emoHeight = this.chatOpenBg.height;
        if(isGameCo) {
            this.quickEmoSprite = new BkQuickEmoCoSprite(this);
        }else{
            this.quickEmoSprite = new BkQuickEmotionsSprite(this);
        }
        this.addChild(this.quickEmoSprite,WD_ZORDER_TOP);

        this.quickEmoSprite.setContentSize(cc.size(this.chatOpenBg.width, emoHeight));
        this.quickEmoSprite.x = this.chatXPosByGame;
        this.quickEmoSprite.y = this.quickEmoSprite.height/2+31;
        var self = this;

        this.quickEmoHover = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseMove: function (event) {
                var location = event.getLocation();
                var target = event.getCurrentTarget();

                if (!cc.rectContainsPoint(target.getBoundingBoxToWorld(), location)) {
                    self.removeQuickEmoList();
                    self.restoreUpDownState();
                }
            }
        });
    },

    createQuickEmoList: function () {
        this.removeQuickChatItem();

        if(this.btnChatSmileState) {
            this.btnChatSmileState = false;
            this.restoreUpDownState();
            return;
        }
        this.quickEmoSprite.createQuickEmoList();
        this.quickEmoSprite.setVisible(true);
        this.btnChatSmileState = true;
        this.btnChatTxtState = false;
        cc.eventManager.addListener(this.quickEmoHover, this.quickEmoSprite);
    },

    removeQuickEmoList: function () {
        if(this.quickEmoSprite.getChildren().length > 0) {
            this.quickEmoSprite.removeAllEmo();
            cc.eventManager.removeListener(this.quickEmoHover);
            logMessage("removeQuickEmoList");
        }
    },

    clearInputChat:function(){
        this.inputMsg.setString("");
        this.inputMsg.setPlaceHolder("");
    },
    setChatDownState: function () {
        if(this.chatBoxDisplayMode == CHAT_MSG_DISPLAY_UP) {
            this.displayChatState = this.chatBoxDisplayMode;
            this.switchChatUpDown(CHAT_MSG_DISPLAY_DOWN);
        }
    },
    restoreUpDownState: function () {
        this.btnChatTxtState = false;
        this.btnChatSmileState = false;
        if(this.displayChatState == CHAT_MSG_DISPLAY_UP){
            this.displayChatState = null;
            this.switchChatUpDown(CHAT_MSG_DISPLAY_UP);
            logMessage("restoreUpDownState");
        }
    },
    onExit: function () {
        /*logMessage("-----------------cc.spriteFrameCache onExit-------: " + Object.keys(cc.spriteFrameCache._spriteFrames).length);
        //Remove chat sprite frame cache
        for(var i = 1; i <= 26; i ++){
            var fileName = "res/chat/chat_emo/expression"+i+"_plist.plist";
            cc.spriteFrameCache.removeSpriteFramesFromFile(fileName);
        }
        logMessage("-----------------cc.spriteFrameCache onExit-------: " + Object.keys(cc.spriteFrameCache._spriteFrames).length);*/
        this._super();
    },
});

BkQuickTextItem = BkSprite.extend({
    parentNode: null,
    ctor: function (chatText, parent) {
        this._super();
        this.parentNode = parent;
        this.setContentSize(this.parentNode.chatMiniSprite.width, CHAT_QUICK_TEXT_ROW_HEIGH/2);
        var self = this;
        var bgHover = new cc.DrawNode();
        bgHover.drawRect(cc.p(0, -10), cc.p(this.parentNode.chatMiniSprite.width, 10),
            cc.color(5, 61, 118, 140), 1, cc.color(5, 61, 118, 140));
        bgHover.x = -this.parentNode.chatMiniSprite.width/2;
        this.addChild(bgHover, -1);
        bgHover.visible = false;

        var lblText = new BkLabel(chatText, "Tahoma", "15");
        lblText.setTextColor(cc.color(214,216,221));
        this.addChild(lblText);
        this.setMouseOnHover(
            function (event) {
                bgHover.setVisible(true);
            }, function (event) {
                bgHover.setVisible(false);
            });
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch, event) {
                if (bgHover.isVisible()) {
                    self.onClickChatTextItem(chatText);
                }
                return false;
            }
        }, bgHover);
    },

    onClickChatTextItem: function (chatText) {
        this.parentNode.createTableChatMessage(chatText);
        this.parentNode.removeQuickChatItem();
        this.parentNode.restoreUpDownState();
    }
});