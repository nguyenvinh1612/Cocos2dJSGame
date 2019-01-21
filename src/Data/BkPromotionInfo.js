/**
 * Created by hoangthao on 03/11/2015.
 */

BkPromotionInfo = cc.Class.extend({

    isShowPromotionEnable:null,
    isFacebookInviteFR:null,
    isPhoneNumberUpdatable:null,

    suggestInviteFriendFBCount:0,
    suggestNapTienCount:0,
    suggestRegisterPhoneCount:0,

    isShowNapTien: null,
    isShowFaceBookInviteFB: null,
    isShowRegisterPhone: null,
    lastAskingTimeRegisterPhone: 0,
    lastAskingTimeInviteFacebook: 0,
    lastAskingTimeInvitePayment: 0,
    receiveInviteState: null,
    isJoinFromInviteFriend: null,

    ctor: function () {
        isShowNapTien = false;
        isShowFaceBookInviteFB = false;
        isShowRegisterPhone = false;
        receiveInviteState = false;
        isJoinFromInviteFriend = false;
        lastAskingTimeRegisterPhone = 0;
        lastAskingTimeInviteFacebook = 0;
        lastAskingTimeInvitePayment = 0;
    }
});