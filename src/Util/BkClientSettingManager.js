/**
 * Created by vinhnq on 10/28/2015.
 */
//
function BkClientSettingManager() {
}
//DEFAULT_CLIENT_VALUE = 0;
//if (typeof key == "undefined") 
//{
//    var key = {};
//    var fbKey = bk.isFbApp ? 'f' : '';
//    key.isRenamealbe = 0 + fbKey;
//    //key.isPhoneUpdatable = 1 + fbKey;
//    //key.soundEnable = 2 + fbKey;
//    //key.isChatEnable = 3 + fbKey;
//    key.itemList = 4 + fbKey;
//    key.clientId = 5 + fbKey;
//    key.isRegisterUser = 6 + fbKey;
//    key.usernameKey = 7 + fbKey;
//    key.passwordKey = 8 + fbKey;
//    key.showTakenPiece = 9 + fbKey;
//    key.userLoginInfo = 10 + fbKey;
//    key.userSettingInfo = 11 + fbKey;
//    key.userLastRoomType = 12 + fbKey;
//    key.isSaveUserSession = 13;  //Web only
//    key.displayHotNews = "DisplayHotNews";
//    key.endpoint ="endpoint";
//    key.popupCount ="popupCount";
//    key.lastGameChoose ="lastGameChoose";
//    key.ListLoggedInUsers="ListLoggedInUsers";
//    key.isShowPromotionWD  = "isShowPromotionWD:";
//    key.dfBackgorundIngame = "BackgorundIngame";
//    key.lastCheckAllState = "lastCheckAllCheckboxState";
//}
BkClientSettingManager.setDefaultValue = function (key) 
{
    var ls = cc.sys.localStorage;
    ls.setItem(key, DEFAULT_CLIENT_VALUE);
};

/*
*   defaultValue is JSON.stringify
* */
BkClientSettingManager.getClientSetting = function (key, isJson,defaultValue) 
{
    var ls = cc.sys.localStorage;
    logMessage("key:" + key + "issJson:" + isJson + "defaultValue:" + defaultValue);
    var res = ls.getItem(key);
    if (res == null) 
    {
    	return defaultValue;
        //if ((defaultValue != undefined) && (defaultValue != null))
        //{
        	//defaultValue
        	//BkClientSettingManager.setClientSetting(key,defaultValue);
       // } 
//        else {
//        	BkClientSettingManager.setClientSetting(key,JSON.stringify(DEFAULT_CLIENT_VALUE));
//        }
    }
    if(isJson && res)
    {
        return JSON.parse(res);
    }
    logMessage("res:" + res );
    return res;
};

/*
 *   value is JSON.stringify
 * */
BkClientSettingManager.setClientSetting = function (key, value) {
    var ls = cc.sys.localStorage;
    if(value == undefined)
    {
        logMessage("key:" + key + " undefined");
        return;
    }
    return ls.setItem(key, value.toString());
};

//Util.removeClientSetting = function (key) {
//    cc.sys.localStorage.removeItem(key);
//};
//
//Util.getClientSession = function (key, isJson) {
//    var ls = bk.sessionStorage;
//    var res = ls.getItem(key);
//
//    if(isJson && res){
//        return JSON.parse(res);
//    }
//    return res;
//};
//
//Util.setClientSession = function (key, value) {
//    var ls = bk.sessionStorage;
//    return ls.setItem(key, value.toString());
//};
//
//Util.removeClientSession = function (key) {
//    bk.sessionStorage.removeItem(key);
//};

//try {
//    bk.sessionStorage = sessionStorage = window.sessionStorage;
//    bk.sessionStorage.setItem("storage", "");
//    bk.sessionStorage.removeItem("storage");
//} catch (e) {
//    var warn = function () {
//        logMessage("Warning: sessionStorage isn't enabled. Please confirm browser cookie or privacy option");
//    };
//    bk.sessionStorage = {
//        getItem : warn,
//        setItem : warn,
//        removeItem : warn,
//        clear : warn
//    };
//}