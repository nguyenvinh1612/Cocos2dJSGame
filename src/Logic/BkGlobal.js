/**
 * Created by bs on 02/10/2015.
 */
BkGlobal = {
    chooseGameScene:null,
    afterLoginScene:null,
    lobbyScene:null,
    ingameScene:null,


    // client state
    currentGameID: -1,
    currentRoomID: -1,
    currentTableID: -1,

    currentGS:-1,
    clientID:null,
    isReceiveSyncEvent:false,
    isTabActive:true,

    isLoadedChatEmo:false,
    isNewRegistraion:false,
    isPhoneNumberUpdatable:false,
    clientDeviceCheck:0, //0: Web | 1: Other
    isLoginFacebook:false,
    isFbLinkable:false,
    isFbRenameable:false,
    isFbCreateablePass:false,
    addMoneyBonusType:0,
    paymentBonusPercent:0,
    leavingGameReason:0,
    isAutoCreateAccount:false,
    bonusObj:null,
// user data
    UserInfo:null,
    UserSetting:null,
    getCurrentRoomType:function(){
        // logMessage("this.currentRoomID "+this.currentRoomID+" getCurrentRoomType "+BkRoomTypeUtils.getRoomTypeById(this.currentRoomID));
        // return BkRoomTypeUtils.getRoomTypeById(this.currentRoomID);
        return 0;
    },
    isRoomTypeSolo:function(){
        // if (this.getCurrentRoomType() == RT.ROOM_TYPE_DAU_TAY_DOI){
        //     return true;
        // }
        return false;
    },
    isGameCo:function(){
        // if ((this.currentGameID == GID.CO_TUONG) || (this.currentGameID == GID.CO_UP)){
        //     return true;
        // }
        return false;
    },
    currentServerTime:null
};