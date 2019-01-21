/**
 * Created by vinhnq on 27/02/2018.
 */
function ServerSettings() {
}
ServerSettings.NEWS_IP = "chanvanvan.mobi";
ServerSettings.PROMOTE_APP_SERVER_IP = "123.30.208.147";
ServerSettings.PROMOTE_TIME_OUT = 3600*24*7;
ServerSettings.PING_MESSAGE_INTERVAL = 5000;
ServerSettings.CONNECTION_TIME_OUT = 8000;
ServerSettings.RESEND_TIMES = 2;
ServerSettings.RECONNECT_TIMES = 10;
ServerSettings.CALL_CENTER_NUMBER = "0903212956";
ServerSettings.SERVER_VERSION = "0.6.38";
ServerSettings.MIN_REQUIRED_VERSION = "0.0.0";
ServerSettings.PREVIEW_VERSION = "99.99.99";
ServerSettings.NEW_APPS = "";
ServerSettings.RECOMMEND_CHAN_INFO = "";
ServerSettings.GOOGLE_ADMOB_ID = "ca-app-pub-9777799453427252/4921415321";
CHAN_PACKAGE_NAME = "archer.chanvanvan";
ServerSettings.DAILY_BONUS = 1000;
ServerSettings.RATE_BONUS = 1000;
ServerSettings.FACEBOOK_CONNECT_BONUS = 500;
ServerSettings.FACEBOOK_INVITE_FRIEND_BONUS = 200;
ServerSettings.FACEBOOK_INVITE_FRIEND_BONUS_BASE = 200;
ServerSettings.FACEBOOK_LIKE_BONUS = 2000;
ServerSettings.FACEBOOK_ALLOW_POST_ON_WALL_BONUS = 2000;
ServerSettings.RECOMMENT_FRIEND_BONUS = 30000;
ServerSettings.INSTALL_NEW_GAME_BONUS = 30000;
ServerSettings.FB_FANPAGE = "http://www.facebook.com/gamechanvanvan";
ServerSettings.INFORM_TEXT = "";
ServerSettings.SERVER_UNDER_MAINTAINANCE = false;
ServerSettings.ALWAYS_SHOW_PAYMENT = false;
ServerSettings.ENABLE_LIKE_FACEBOOK = true;
ServerSettings.ENABLE_DAILY_ACHIEVEMENT = false;
ServerSettings.HIDE_MAIN_ITEMS = false;
ServerSettings.APP_STORE_URL = "http://appstore.com/chanvanvan";
ServerSettings.FORUMS_URL = "http://www.chanvanvan.com/forums/";
ServerSettings.UPDATE_FROM_WEB_URL = "http://chanvanvan.mobi";
ServerSettings.IS_WEB_UPDATE = 0;
ServerSettings.hasEvent = false;
ServerSettings.FACE_BOOK_SDK_VERSION = "v2.3";
ServerSettings.FACEBOOK_APP_ID = "612665302155689";
ServerSettings.FACEBOOK_ENABLE = true;
ServerSettings.NOTIFICATION_REG_URL = "http://chanvanvan.mobi/WebCommonChan/NotificationRegisterIOS.jsp";
ServerSettings.DF_SENDER_ID = "863431410797";
ServerSettings.ANDROID_COMMON_APP = "com.zing.zalo;com.vng.inputmethod.labankey;com.fplay.activity;com.zing.mp3;com.cherrylee.tienlen_multiplatform;gsn.game.zingplaynew1;ht.nct";
ServerSettings.PROMOTE_APP_ICON = "";
ServerSettings.PROMOTE_APP_NAME = "";
ServerSettings.PROMOTE_APP_URL = "";
ServerSettings.PROMOTE_APP_BUNDLEID = "";
ServerSettings.ROMOTE_APP_MONEY = 0;
ServerSettings.needToUpdateUI1 = false;
ServerSettings.isNewMonetaryPolicy = false;
ServerSettings.URL_INDEX = 0;

ServerSettings.loadSettings = function()
{  
	var urlStr = "";
	if(ServerSettings.URL_INDEX == 0)
	{
		urlStr = "chanvanvan.mobi";
	}else if(ServerSettings.URL_INDEX == 1)
	{
		urlStr = "letranduc.com";
	}else if(ServerSettings.URL_INDEX == 2)
	{
		urlStr = "choichan.info";
	}else if(ServerSettings.URL_INDEX == 3) 
	{
		urlStr = "chanviet.biz";
	}else if(ServerSettings.URL_INDEX == 4)
	{
		urlStr = ServerSetting.getPrivateLink();
	}else 
	{
		return;
	}
	logMessage("urlStr:" + urlStr);

	//  urlStr = CCString::createWithFormat(fileURLFormat, "letranduc.com", appId.c_str(), clientId.c_str(), cpid, version, rand())->getCString();
	//var url = "http://%s/WebCommonChan/config?appid=%s&clientid=%s&providerid=%d&ostype=android&version=%s&time=%d";
			

	var cpid = NativeInterface.getContentProviderId();
    var clientId = NativeInterface.getOldClientId();
    var appId = NativeInterface.getAppId();
    var version = APP_VERSION;
    var time = (new Date()).getTime();
	var clientID = NativeInterface.getClientID();
	clientId = "123";
	appId = "456";
	cpid = "123";
	version ="0.5";
	var url = "http://"+urlStr+"/WebCommonChan/config?appid="+ appId+"&clientid=" + clientId + "&providerid=" + cpid + "&ostype=android&version="+version + "?v="+time;
	var xhr = cc.loader.getXMLHttpRequest();
	var self = this;
	xhr.open("GET", url);
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
		{
				logMessage("parseJSON.responseText " + xhr.responseText);
				var parsedObjArr = JSON.parse(xhr.responseText);
				//ServerSettings.parseSetting(xhr.responseText);
				ServerSettings.parseSetting(parsedObjArr);

				//ServerSettings.SERVER_VERSION = parsedObjArr.promoteappmoney;
				//ServerSettings.ALWAYS_SHOW_PAYMENT = parsedObjArr.isShowPayment;
				//logMessage("gamever:" + ServerSettings.SERVER_VERSION);
		}else 
		{
			ServerSettings.loadSettingFromNextUrl();
		}
	}
	 xhr.send(null);
};
ServerSettings.reloadData = function()
{
	ServerSettings.URL_INDEX = 1;
	ServerSettings.loadSettings();
};
ServerSettings.loadSettingFromNextUrl = function()
{
	ServerSettings.URL_INDEX++;
	ServerSettings.loadSettings();
};
ServerSettings.getPrivateLink = function()
{
	return NativeInterface.getStringForKey("plu","https://raw.githubusercontent.com/5play/bk/master/chanconf.txt");
};
ServerSettings.getValByKey = function(jsonObj,key)
{
	switch(key)
	{
		case "phonenumber":
			return jsonObj.phonenumber;
		case "version":
			return jsonObj.version;
		case "minversion":
			return jsonObj.minversion;
		case "previewversion":
			return jsonObj.previewversion;
		case "promotetimeout":
			return jsonObj.promotetimeout;
		case "timeout":
			return jsonObj.timeout;
		case "pinginterval":
			return jsonObj.pinginterval;
		case "resendtime":
			return jsonObj.resendtime;
		case "reconnecttime":
			return jsonObj.reconnecttime;
		case "dailybonus":
			return jsonObj.dailybonus;
		case "port":
			return jsonObj.port;
		case "fbcbonus":
			return jsonObj.fbcbonus;
		case "fblbonus":
			return jsonObj.fblbonus;
		case "fbabonus":
			return jsonObj.fbabonus;
		case "recommentbonus":
			return jsonObj.recommentbonus;
		case "newgamebonus":
			return jsonObj.newgamebonus;
		case "serveripaddress":
			return jsonObj.serveripaddress;
		case "newsip":
			return jsonObj.newsip;
		case "promoteappserverip":
			return jsonObj.promoteappserverip;
		case "admobid":
			return jsonObj.admobid;
		case "fbfanpage":
			return jsonObj.fbfanpage;
		case "informtext":
			return jsonObj.informtext;
		case "promoteschemaapps":
			return jsonObj.promoteschemaapps;
		case "recommendchan":
			return jsonObj.recommendchan;
		case "alwaysshowpayment":
			return jsonObj.alwaysshowpayment;
		case "fblike":
			return jsonObj.fblike;
		case "hidemainitem":
			return jsonObj.hidemainitem;
		case "appstoreurl":
			return jsonObj.appstoreurl;
		case "forumurl":
			return jsonObj.forumurl;
		case "updateweburl":
			return jsonObj.updateweburl;
		case "packagename":
			return jsonObj.packagename;
		case "hasevent":
			return jsonObj.hasevent;
		case "iswebupdate":
			return jsonObj.iswebupdate;
		case "AndroidCommonApp":
			return jsonObj.AndroidCommonApp;
		case "promoteappicon":
			return jsonObj.promoteappicon;
		case "promoteappurl":
			return jsonObj.promoteappurl;
		case "promoteappname":
			return jsonObj.promoteappname;
		case "promotepackagename":
			return jsonObj.promotepackagename;
		case "promoteappmoney":
			return jsonObj.promoteappmoney;
		case "dailyachievement":
			return jsonObj.dailyachievement;
		case "fbsdkversion":
			return jsonObj.fbsdkversion;
		case "fbappId":
			return jsonObj.fbappId;
		case "facebook_enable":
			return jsonObj.facebook_enable;
		case "notification_url":
			return jsonObj.notification_url;
		case "sender_id":
			return jsonObj.sender_id;
		case "myip":
			return jsonObj.myip;
		case "privatelink":
			return jsonObj.privatelink;
	}
	return undefined;
};
ServerSettings.getString = function(root,key,defaultValue)
{
	//var post = root.indexOf(key);
	var val = ServerSettings.getValByKey(root,key);
	logMessage("key: " + key + " val: " + val);

	if(val != undefined)
	{
		return val;
	}
	return defaultValue;	
};
ServerSettings.getInt = function(root,key,defaultValue)
{
	var val = ServerSettings.getString(root,key,defaultValue); 
	if(val !="")
	{
		return defaultValue;
	}
	return parseInt(val);
};
ServerSettings.parseSetting = function(strConent)
{
	logMessage("callparseSetting:" + strConent );
	var root = strConent;
	var tmp;
	var tmpStr;
	ServerSettings.CALL_CENTER_NUMBER = ServerSettings.getString(root, "phonenumber", ServerSettings.CALL_CENTER_NUMBER);
	ServerSettings.SERVER_VERSION = ServerSettings.getString(root, "version", ServerSettings.SERVER_VERSION);
	ServerSettings.MIN_REQUIRED_VERSION = ServerSettings.getString(root, "minversion", ServerSettings.MIN_REQUIRED_VERSION);
	ServerSettings.PREVIEW_VERSION = ServerSettings.getString(root, "previewversion", ServerSettings.PREVIEW_VERSION);
	ServerSettings.PROMOTE_TIME_OUT = ServerSettings.getInt(root, "promotetimeout", ServerSettings.PROMOTE_TIME_OUT);
	ServerSettings.CONNECTION_TIME_OUT = ServerSettings.getInt(root, "timeout", ServerSettings.CONNECTION_TIME_OUT);
	ServerSettings.PING_MESSAGE_INTERVAL = ServerSettings.getInt(root, "pinginterval", ServerSettings.PING_MESSAGE_INTERVAL);
	ServerSettings.RESEND_TIMES = ServerSettings.getInt(root, "resendtime", ServerSettings.RESEND_TIMES);
	ServerSettings.RECONNECT_TIMES = ServerSettings.getInt(root, "reconnecttime", ServerSettings.RECONNECT_TIMES);
	ServerSettings.DAILY_BONUS = ServerSettings.getInt(root, "dailybonus", ServerSettings.DAILY_BONUS);
	tmp = ServerSettings.getInt(root, "port", -1);
	logMessage("tmp:" + tmp);
	if (tmp >= 0) {
		PORT = tmp;
		BkClientSettingManager.setClientSetting("port",PORT);
	}
	ServerSettings.FACEBOOK_CONNECT_BONUS = ServerSettings.getInt(root, "fbcbonus", ServerSettings.FACEBOOK_CONNECT_BONUS);
	ServerSettings.FACEBOOK_LIKE_BONUS = ServerSettings.getInt(root, "fblbonus", ServerSettings.FACEBOOK_LIKE_BONUS);
	ServerSettings.FACEBOOK_INVITE_FRIEND_BONUS = ServerSettings.getInt(root, "fbivfbonus",ServerSettings.FACEBOOK_INVITE_FRIEND_BONUS);
	ServerSettings.FACEBOOK_ALLOW_POST_ON_WALL_BONUS = ServerSettings.getInt(root, "fbabonus",ServerSettings.FACEBOOK_ALLOW_POST_ON_WALL_BONUS);
	ServerSettings.RECOMMENT_FRIEND_BONUS = ServerSettings.getInt(root, "recommentbonus",ServerSettings.RECOMMENT_FRIEND_BONUS);
	ServerSettings.INSTALL_NEW_GAME_BONUS = ServerSettings.getInt(root, "newgamebonus",ServerSettings.INSTALL_NEW_GAME_BONUS);
	tmpStr = ServerSettings.getString(root, "serveripaddress", "");
	if (tmpStr!= "") 
	{
		ServerSettings.GAME_SERVER_IP = tmpStr;
		BkClientSettingManager.setClientSetting("serip",ServerSettings.GAME_SERVER_IP);
		ServerSettings.RELOADED = true;
	}
	ServerSettings.NEWS_IP = ServerSettings.getString(root, "newsip", ServerSettings.NEWS_IP);
	ServerSettings.PROMOTE_APP_SERVER_IP = ServerSettings.getString(root, "promoteappserverip",ServerSettings.PROMOTE_APP_SERVER_IP);
	ServerSettings.GOOGLE_ADMOB_ID = ServerSettings.getString(root, "admobid", ServerSettings.GOOGLE_ADMOB_ID);
	ServerSettings.FB_FANPAGE = ServerSettings.getString(root, "fbfanpage", ServerSettings.FB_FANPAGE);
	ServerSettings.INFORM_TEXT = ServerSettings.getString(root, "informtext", "");
	ServerSettings.NEW_APPS = ServerSettings.getString(root, "promoteschemaapps", "");
	ServerSettings.RECOMMEND_CHAN_INFO = ServerSettings.getString(root, "recommendchan", "");
	ServerSettings.ALWAYS_SHOW_PAYMENT = ServerSettings.getInt(root, "alwaysshowpayment", 0) != 0;
	ServerSettings.ENABLE_LIKE_FACEBOOK = ServerSettings.getInt(root, "fblike", 1) != 0;
	ServerSettings.HIDE_MAIN_ITEMS = ServerSettings.getInt(root, "hidemainitem", 0) != 0;
	ServerSettings.APP_STORE_URL = ServerSettings.getString(root, "appstoreurl", ServerSettings.APP_STORE_URL);
	ServerSettings.FORUMS_URL = ServerSettings.getString(root, "forumurl", ServerSettings.FORUMS_URL);
	ServerSettings.UPDATE_FROM_WEB_URL = ServerSettings.getString(root, "updateweburl", ServerSettings.UPDATE_FROM_WEB_URL);
	ServerSettings.CHAN_PACKAGE_NAME = ServerSettings.getString(root, "packagename", ServerSettings.CHAN_PACKAGE_NAME);
	ServerSettings.hasEvent = ServerSettings.getInt(root, "hasevent", 0) != 0;
	ServerSettings.IS_WEB_UPDATE = ServerSettings.getInt(root, "iswebupdate", 0);
	ServerSettings.ANDROID_COMMON_APP = ServerSettings.getString(root, "AndroidCommonApp", ServerSettings.ANDROID_COMMON_APP);
	ServerSettings.PROMOTE_APP_ICON = ServerSettings.getString(root, "promoteappicon", ServerSettings.PROMOTE_APP_ICON);
	ServerSettings.PROMOTE_APP_URL = ServerSettings.getString(root, "promoteappurl", ServerSettings.PROMOTE_APP_URL);
	ServerSettings.PROMOTE_APP_NAME = ServerSettings.getString(root, "promoteappname", ServerSettings.PROMOTE_APP_NAME);
	ServerSettings.PROMOTE_APP_BUNDLEID = ServerSettings.getString(root, "promotepackagename",ServerSettings.PROMOTE_APP_BUNDLEID);
	ServerSettings.PROMOTE_APP_MONEY = ServerSettings.getInt(root, "promoteappmoney", 0);
	ServerSettings.ENABLE_DAILY_ACHIEVEMENT = ServerSettings.getInt(root, "dailyachievement", 0) != 0;
	ServerSettings.FACE_BOOK_SDK_VERSION = ServerSettings.getString(root, "fbsdkversion",ServerSettings.FACE_BOOK_SDK_VERSION);
	ServerSettings.FACEBOOK_APP_ID = ServerSettings.getString(root, "fbappId", ServerSettings.FACEBOOK_APP_ID);
	ServerSettings.FACEBOOK_ENABLE = ServerSettings.getInt(root, "facebook_enable", 1) == 1;
	ServerSettings.NOTIFICATION_REG_URL = ServerSettings.getString(root, "notification_url",ServerSettings.NOTIFICATION_REG_URL);
	ServerSettings.DF_SENDER_ID = ServerSettings.getString(root, "sender_id", ServerSettings.DF_SENDER_ID);
	
	//todo later
	// call funtion setting appID FB in native
//	const char* kHelperPakageName = FBJavaHandle;
//	JniMethodInfo t;
//	if (JniHelper::getStaticMethodInfo(t, kHelperPakageName, "setFBAppID",
//			"(Ljava/lang/String;)V")) {
//		jstring appID = t.env->NewStringUTF(FACEBOOK_APP_ID.c_str());
//		//t.env->CallStaticIntMethod(t.classID, t.methodID,appID);
//		t.env->CallStaticVoidMethod(t.classID, t.methodID, appID);
//		t.env->DeleteLocalRef(appID);
//	}

	BkClientSettingManager.setClientSetting("SENDER_ID",ServerSettings.DF_SENDER_ID);
	var defaultFileServerIP = BkClientSettingManager.getClientSetting("fsip",false,"letranduc.com");
	logMessage("defaultFileServerIP:" + defaultFileServerIP);
	var newIP = ServerSettings.getString(root, "myip", defaultFileServerIP);
	BkClientSettingManager.setClientSetting("fsip",newIP);
	var pvLink = BkClientSettingManager.getClientSetting("plu",false,"https://raw.githubusercontent.com/5play/bk/master/chanconf.txt");
	var newPVlink =  ServerSettings.getString(root, "privatelink", pvLink);
	BkClientSettingManager.setClientSetting("plu",newPVlink);
	
	needToUpdateUI = true;
	needToUpdateUI1 = true;
	ServerSettings.FACEBOOK_INVITE_FRIEND_BONUS_BASE = ServerSettings.FACEBOOK_INVITE_FRIEND_BONUS;
	logMessage("finished load settings");
}