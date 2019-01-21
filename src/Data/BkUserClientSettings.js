/**
 * Created by ht on 06/10/2015.
 */
BkUserClientSettings = cc.Class.extend({
    isPhoneUpdatable: null,
    soundEnable: null,
    isChatEnable: null,

    ctor: function (isPhoneUpd, soundEnable, isChatEnable) {
            this.isPhoneUpdatable = isPhoneUpd;
            this.soundEnable = soundEnable;
            this.isChatEnable = isChatEnable;
    }
});

BkUserClientSettings.updateSetting = function (setting) {
    Util.setClientSetting(key.userSettingInfo + cc.username.toLowerCase(), JSON.stringify(setting));
    //BkGlobal.UserSetting = setting;
};
BkUserClientSettings.getListUserLoggedIn = function()
{
    var listUser = Util.getClientSetting(key.ListLoggedInUsers,false,"");
    var listUserArr = [];
    if(listUser != undefined && listUser != "" )
    {
        listUserArr = JSON.parse(listUser);
    }
    return listUserArr;
};
BkUserClientSettings.updateListUserLoggedIn = function(userName,password)
{

    var listUserArr = BkUserClientSettings.getListUserLoggedIn();
    var userIndex = BkUserClientSettings.getUserIndex(userName.toLowerCase(),listUserArr);
    if(userIndex > -1) // user existed
    {
        BkUserClientSettings.removeUserLoggedIn(listUserArr, userIndex);
    }
    listUserArr.unshift((new Date()).getTime()); // insert to beginning of Array (sort list logged in by time)
    listUserArr.unshift(password);
    listUserArr.unshift(userName.toLowerCase());
    Util.setClientSetting(key.ListLoggedInUsers, JSON.stringify(listUserArr));
};

BkUserClientSettings.updateUserToList = function(userName,password, listUserArr)
{
    listUserArr.unshift((new Date()).getTime());
    listUserArr.unshift(password);
    listUserArr.unshift(userName.toLowerCase());
};

BkUserClientSettings.removeUserLoggedIn = function (listUserArr, userIndex) {
    listUserArr.splice(userIndex,3);
};
BkUserClientSettings.getUserIndex = function(userName,listUserArr)
{
    for(var i = 0; i < listUserArr.length; i = i+3)
    {
        if(listUserArr[i] === userName)
        {
            return i;
        }
    }
    return -1;
},
BkUserClientSettings.getSetting = function () {
    return Util.getClientSetting(key.userSettingInfo + cc.username.toLowerCase(), true);
};

BkUserClientSettings.setDektopClientId = function (newClientId, macAddress) {
    logMessage("call setDektopClientId: " + newClientId +" "+ macAddress);
    var desktopId = newClientId;
    //If can not generate client id, used default web client id
    if (desktopId.indexOf("undefined") == -1) {
        var cid = Util.getClientSetting(key.clientId);
        if (cid == null || cid == DEFAULT_CLIENT_VALUE || cid == "") {
            logMessage("cid not found, set dessktop client id");
            Util.setClientSetting(key.clientId, desktopId);
            setCookie(c.WEB_CLIENT_ID, desktopId, 3650);
            cid = desktopId;
        } else {
            logMessage("cid found, do nothing");
        }

        cc.bkClientId = Util.createClientIdSuffix(cid);
    }else{
        logMessage("Used default web client id");
        cc.bkClientId = cc.bkClientId.replace('_Chrome', '_Dt');
        cc.bkClientId = Util.createClientIdSuffix(cc.bkClientId);
    }
    logMessage("DESKTOP CLIENT ID: " + cc.bkClientId);

    if(cc.isString(macAddress)){
        bk.userIp = macAddress;
    }
    if(Util.isAutoCreateAccount() &&  BkGlobal.isAutoCreateAccount)
    {
        logMessage("AUTO REGISTER");
        if (!BkLogicManager.getLogic().isLogged)
        {
            $('#progress-text').text("Đang khởi tạo dữ liệu...");
            showProgressModalEx();
            BkConnectionManager.prepareConnection();
            BkLogicManager.getLogic().setOnLoadComplete(BkLogicManager.getLogic());
            BkLogicManager.getLogic().doRegisterUser("_1", "",cc.bkClientId);
            Util.showAnim(true);
        }
    }
};

BkUserClientSettings.updateListFBInvited = function (fid,ArrList)
{
    var invitedArr = [];
    if(Util.getClientSetting(fid,false,"") != undefined && Util.getClientSetting(fid,false,"") != "")
    {
        var  invitedArr = JSON.parse(Util.getClientSetting(fid,false,""));
    }
    for(var i = 0; i < ArrList.length; i++)
    {
        invitedArr.push(ArrList[i]);
    }
    Util.setClientSetting(fid, JSON.stringify(invitedArr));
};
BkUserClientSettings.setExpireDate = function(fid)
{
    var arr = [];
    var expriteDate = (new Date()).getTime() + 30*24*60*60*1000; //  1 months
    arr.push(expriteDate);
    BkUserClientSettings.updateListFBInvited(fid,arr);
},
BkUserClientSettings.getListFBInvited = function (fid)
{
    if(Util.getClientSetting(fid,false,"") == "")
    {
        BkUserClientSettings.setExpireDate(fid);
    }else
    {
        var cachedStr = Util.getClientSetting(fid,false,"");
        if(cachedStr == undefined)
        {
            return "";
        }
        var cachedArr = JSON.parse(cachedStr);
        var now = (new Date()).getTime();
        if(now >= cachedArr[0])
        {
            //expire
            Util.removeClientSetting(fid);
            //showToastMessage("xoa cached and update new expire");
            BkUserClientSettings.setExpireDate(fid);
            return Util.getClientSetting(fid,false,"");
        }
    }
    return Util.getClientSetting(fid,false,"");
};
BkUserClientSettings.updateUserSettingLogin = function (isPhoneUpdatable) {
    var setting = BkUserClientSettings.getSetting();
    if (setting == 0) {
        //Default setting
        setting = new BkUserClientSettings(isPhoneUpdatable, 1, 0);
        Util.setClientSetting(key.userSettingInfo + cc.username.toLowerCase(), JSON.stringify(setting));
    } else {
        /*if(setting.isPhoneUpdatable) {
            setting.isPhoneUpdatable = isPhoneUpdatable;
            BkUserClientSettings.updateSetting(setting);
        }*/
    }
    BkGlobal.UserSetting = setting;
    if(BkGlobal.UserSetting == undefined || BkGlobal.UserSetting == null){
        BkGlobal.UserSetting = new BkUserClientSettings(isPhoneUpdatable, 1, 0);
    }
};