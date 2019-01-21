/**
 * Created by hoangthao on 29/02/16.
 */
BkQuickEmoCoSprite = BkQuickEmotionsSprite.extend({
    ctor: function (parent) {
        this._super(parent);
        this.chatSetting = new BkChatSettingByGame(15, 5, 9, 5, 30, 235, 18, res.chat_emo_chess_plist, res.chat_emo_chess_img);
    }
});