/**
 * Created by hoangthao on 05/11/2015.
 */

var BkChatBoxCoLayer = BkChatBoxLayer.extend({
    ctor: function (chatMode) {
        this.chatXPosByGame = -1;
        this.chatYPosByGame = 2;
        this.chatQuickChatText = [
            "Ê bồ tèo, chơi hay nghỉ đây",
            "Mạng lag quá, hix",
            "Tưởng chú thế nào, xịt nhỉ",
            "Xin lỗi, em vừa bận tí",
            "Sẵn sàng nhanh nào",
            "Cao thủ, kính phục",
            "Lần sau chơi tiếp nhé",
            "Chơi to lên chút đi",
            "Đi nước hay đấy",
            "Thủ thế chắc thật",
            "Cao cờ là đây",
            "Thôi xong!",
            "Ván sau cho mình chơi với",
            "Xin chào mọi người"];
        this._super(chatMode, true);
        this.updateChatItemPos();

        this.inputMsg.y += 0.5;
        this.chatMiniSprite.width += 2;
    },

    updateChatItemPos : function () {
        this.btnChatTxt.x = this.chatMiniSprite.width - this.btnChatTxt.width  - 24;
        this.btnChatTxt.y = this.btnChatTxt.y;

        this.btnChatSmile.x = this.chatMiniSprite.width - this.btnChatSmile.width / 2 - 8;
        this.btnChatSmile.y = this.btnChatSmile.y + 0.5;
        this.inputMsg.x = 0;
    },
    switchChatUpDown: function (switchMode) {
        this._super(switchMode);
        this.btnChatUpDown.x = this.btnChatUpDown.width/2  + 67;
        if (this.chatBoxDisplayMode == CHAT_MSG_DISPLAY_UP) {
            this.btnChatUpDown.y = this.btnChatUpDown.y + 5;
        }
        else this.btnChatUpDown.y = this.btnChatUpDown.y + 1;
    },

    setDisablePlayerChat: function (isEnable) {
        if(isEnable) {
            //disabled
            this.btnChatTxt.setEnableButton(false);
            this.btnChatSmile.setEnableButton(false);
            this.inputMsg.setDisabled(true);
            this.inputMsg.setPlaceHolder("Tắt chat");
        }else{
            //enabled
            this.btnChatTxt.setEnableButton(true);
            this.btnChatSmile.setEnableButton(true);
            this.inputMsg.setDisabled(false);
            this.inputMsg.setPlaceHolder(CHAT_PLACE_HOLDER_TEXT);
        }
    }
});