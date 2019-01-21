  var bk = bk || {
                    httpHost: "http://localhost:63342/chanhtml5/",
                    fileVer: "3",
                    cpid: "500",
                    isFbApp: false,
                    userIp: "127.0.0.1",
                    isMobileOnly: false,
                    bonusPhone: false,
                    showHotNewsWdFlag: true,
                    showWebPushFlg:"1",
                    showCreateDesktopIconTutorial: "0",
                    isDesktopApp:true,
                    logintype:4
                };
function initClientInfo() {
	// Get client id
	// Client websocket format : ClientID;NetworkVersion;websocket version
	logMessage("initClientInfo");
	var cid = getCookie(c.WEB_CLIENT_ID);
	if (cid == null || cid == "" || cid == "undefined") {
		BkGlobal.isNewRegistraion = true;
		cid = generateClientId(8);
		logMessage("NEW CLIENT ID: " + cid);

		setCookie(c.WEB_CLIENT_ID, cid, 3650);
	} else {
		logMessage("CURRENT CLIENT ID: " + cid);
	}
	cc.bkClientId = Util.createClientIdSuffix(cid);
	// Get set cpid
	var cpidName = "xf_ProviderId";
	if (bk.isFbApp) {
		cpidName = "vv_cpid";
	}
	var cpid = getCookie(cpidName);
	// If coookie not found or expires
	if (cpid == null || cpid == "" || cpid == "undefined") {
		if (cc.isUndefined(bk.cpid) || bk.cpid == "") {
			bk.cpid = c.CPID_WEB;
		}
		logMessage("SET CLIENT CPID: " + cpidName + bk.cpid);
		setCookie(cpidName, bk.cpid, 30);
	}
	// user ip return from server
	cc.isShowWdByIp = true;
}

function onStartGame() {
	showProgressModalEx()
	BkFacebookMgr();
	initClientInfo();

	logMessage("onStartGame");

	// For desktop app
	if (bk.isDesktopApp) {
		preload_resources.push(addition_res.login_register_ss_plist);
		preload_resources.push(addition_res.login_register_ss_img);
	}

	Util.loadResource(preload_resources, function() {
		hideProgressModalEx();
		if (bk.isFbApp) {
			logMessage("--- LOGIN APP FACEBOOK MAIN: ");
			processLoginFb();
		} else if (bk.isDesktopApp) {
			logMessage("--- SHOW DESKTOP APP ");
			showDesktopApp();
		} else {
			// Chan web login type
			var userVV = [];
			if (typeof getUserVV == "function") {
				userVV = getUserVV().split(',');
			}
			if (userVV.length > 4 && userVV[0] != "") {
				logMessage("CLIENT ID: " + cc.bkClientId);
				if (cc.isString(userVV[4]) && userVV[4] == "4") {
					BkGlobal.isLoginFacebook = true;
				}
				var userInfo = {
					'username' : userVV[0],
					'password' : userVV[1],
					'isLoginFacebook' : BkGlobal.isLoginFacebook
				};
				Util.setClientSetting(key.userLoginInfo, JSON
						.stringify(userInfo));
				processAutoLogin(userInfo);
			} else {
				logMessage("--------------- getUserVV fail relogin: --------");
				// Logout xenforo and make new login
				logoutXf();
			}
		}
		// switchToSceneWithGameState(GS.PREPARE_GAME);
	});
}
function showDesktopApp() {
	var userInfo = Util.getClientSession(key.userLoginInfo, true);
	var isSaveSession = Util.getClientSession(key.isSaveUserSession);
	logMessage("Login saving session: " + isSaveSession);
	if (!cc.isUndefined(userInfo) && userInfo != null
			&& userInfo != DEFAULT_CLIENT_VALUE) {
		// Restore user login state from session
		if (isSaveSession == 1) {
			cc.username = userInfo.username;
			cc.password = userInfo.password;
			logMessage("UserLoginInfo: from logout -> prepare new game");
			switchToSceneWithGameState(GS.PREPARE_GAME);
		} else {
			logMessage("UserLoginInfo storage: " + userInfo.username);
			logMessage("UserLoginInfo session: " + userInfo.username);
			processAutoLogin(userInfo);
			return;
		}
	} else {
		// Get from saving user state
		userInfo = Util.getClientSetting(key.userLoginInfo, true);
		logMessage("Login saving client data: " + userInfo);
		if (userInfo) {
			if (isSaveSession == 1) {
				cc.username = userInfo.username;
				cc.password = userInfo.password;
				logMessage("UserLoginInfo: from logout -> prepare new game");
				switchToSceneWithGameState(GS.PREPARE_GAME);
			} else {
				logMessage("UserLoginInfo storage: " + userInfo.username);
				processAutoLogin(userInfo);
				return;
			}
		} else {
			logMessage("UserLoginInfo: NULL -> prepare new game");
			if (Util.isAutoCreateAccount()) {
				BkGlobal.isAutoCreateAccount = true;
				cc.rememberPassword = true;
				// For test
				// switchToSceneWithGameState(GS.PREPARE_GAME);
			} else {
				switchToSceneWithGameState(GS.PREPARE_GAME);
			}
		}
	}
}
function processAutoLogin(userInfo) {
	// var musern = "truongbs002";
	// var mpass = "qqqqqq";
	// userInfo.username = musern;
	// userInfo.password = mpass;

	cc.rememberPassword = true;
	cc.atLogin = true;
	logMessage("Auto login: " + userInfo.username);
	cc.username = userInfo.username;
	cc.password = userInfo.password;
	BkGlobal.isLoginFacebook = userInfo.isLoginFacebook;
	/*
	 * var lastGameChoose = Util.getClientSetting(key.lastGameChoose,false,-1);
	 * var pathname = window.location.pathname; cc.log("pathname:" + pathname );
	 * if(pathname == "/" && lastGameChoose != -1) { logMessage("last game
	 * choose:" + lastGameChoose ); var sublink =
	 * Util.getSubLinkUrl(parseInt(lastGameChoose)); if(sublink != "") {
	 * logMessage(sublink); var fullLink = bk.httpHost + sublink;
	 * window.location = fullLink; return; } }
	 */
	processInitLoginGame();
}

function processLoadingResAfterLoginSuccess(callback) {
	Util.loadResource(base_resource, callback);
}

function processLoadingBaseRes(callback) {

	Util.loadResource(g_resources, callback);
}
/**
 * Created by hoangthao on 1/25/2016.
 */
processLoginRegistSuccessEx = function() {
	// cc.spriteFrameCache.addSpriteFrames(res.shop_item_plist,
	// res.shop_item_img);
	Util.setClientSession(key.isSaveUserSession, 0);
	hideProgressModalEx();
	Util.removeAnim();
	$('#contentNews').hide();
	$('#content-dl').show();

	// changeGameBg(BkGlobal.currentGameID,BkGlobal.currentGS);
};

processLoginRegistFailEx = function(msg) {
	var onOKClick = function() {
		cc.loader.releaseAll();
		logoutXf();
	};
	showPopupMessageConfirmEx(BkConstString.STR_LOGIN_FAILURE, function() {
		onOKClick();
	}, true);

	Util.removeClientSetting(key.userLoginInfo);
	Util.removeClientSession(key.userLoginInfo);
	cc.password = "";
	cc.atLogin = false;
	switchToSceneWithGameState(GS.PREPARE_GAME);

	hideProgressModalEx();
};

logoutXf = function() {
	var xfUrl = $('#vv_btn_LogOut').attr("href");
	if (!cc.isUndefined(xfUrl)) {
		openUrl(xfUrl);
	}
}

showPopupMessageEx = function(msg) {
	showPopupMessageConfirmEx(msg);
};

showPopupMessageConfirmEx = function(msg, callback, isAddCbOnClose) {
	var cb = function() {
		if ((callback != null) && (callback != undefined)) {
			callback();
		}
	};

	swal({
		title : "",
		text : msg,
		type : "",
		confirmButtonColor : '#6EC018',
		closeOnConfirm : true
	}, function() {
		cb();
	});
	/*
	 * var settings = $.extend({ dialogSize: 'm', onHide: cb, // This callback
	 * runs after the dialog was hidden isAddCbOnClose: isAddCbOnClose,
	 * isAddCancelBtn: false }, {});
	 * 
	 * bkMsgDialog.show(msg, settings);
	 */
};

showPopupMessageConfirmWithCancelEx = function(msg, callback) {
	var cb = function() {
		if ((callback != null) && (callback != undefined)) {
			callback();
		}
	};

	swal({
		text : msg,
		title : "",
		type : "",
		confirmButtonColor : '#6EC018',
		confirmButtonText : "Đồng ý",
		cancelButtonText : "Thôi",
		closeOnConfirm : true,
		showCancelButton : true,
		html : true
	}, function(isConfirm) {
		if (isConfirm) {
			cb();
		}
	});

	/*
	 * var settings = $.extend({ dialogSize: 'm', onHide: cb, // This callback
	 * runs after the dialog was hidden isAddCbOnClose: false, isAddCancelBtn:
	 * true }, {});
	 * 
	 * bkMsgDialog.show(msg, settings);
	 */
};

/*
 * visibleLoginRegistForm = function (visible) { if (visible) {
 * $('#loginRegistDialog').modal('show'); } else {
 * $('#loginRegistDialog').modal('hide'); } };
 */

visibleGameCanvas = function(visible) {
	if (visible) {
		$('#Cocos2dGameContainer').show();
	} else {
		$('#Cocos2dGameContainer').hide();
	}
};

/*
 * validateLogin = function (username, password) { if (username == "") {
 * showControlError("Bạn phải nhập tên tài khoản", '#username'); return false; }
 * else if (username.length < 2 || username.length > 20) {
 * showControlError(BkConstString.STR_INVALID_NAME +
 * BkConstString.STR_VALID_LENGTH_NAME, '#username'); return false; } var errMsg =
 * isValidUsername(username); if (errMsg != "") { showControlError(errMsg,
 * '#username'); return false; }
 * 
 * if (password == "") { showControlError("Bạn phải nhập mật khẩu",
 * '#password'); return false; } else if (isEasyPassword(password)) {
 * //showControlError("Mật khẩu quá đơn giản (ví dụ: 123456, abcdef), hãy chọn
 * mật khẩu khác", '#password'); showPopupMessageConfirmWithCancelEx("Vì mật
 * khẩu của bạn quá đơn giản nên không thể đăng nhập được vào game, hãy vào di
 * động và đổi mật khẩu sau đó quay lại đây để đăng nhập. Bạn có muốn xem hướng
 * dẫn không?", function () { cc.sys.openURL(cc.game.config.app.pwdHelp); });
 * sendGA(BKGA.CHECK_LOGIN_REGIST, "ErrorSimplePass", username); return false; }
 * errMsg = isValidPassword(password); if (errMsg != "") {
 * showControlError(errMsg, '#password'); return false; } return true; };
 */

isValidUsername = function(username, isCheckDisallow) {
	var errorPrefix = BkConstString.STR_INVALID_NAME;
	var illegalChars = /\W/;
	if (illegalChars.test(username)) {
		return errorPrefix + BkConstString.STR_LOGIN_NAME
				+ BkConstString.STR_VALID_CHAR;
	}
	if (username.length < 3) {
		return errorPrefix + BkConstString.STR_VALID_LENGTH_NAME;
	}
	if (cc.isUndefined(isCheckDisallow)) {
		return isDisallowedUsername(username);
	}
	return "";
};

isDisallowedUsername = function(value) {
	var username = value.replace('/\W/i', '');
	var disallowedList = [ "admin", "admln", "bigkool", "bigk00l", "bigko0l",
			"b1gkool", "b1gkoo1", "bigkooi", "bigkooi", "bigkoo1", "quantri",
			"quantrl", "chamsockhachhang" ];
	if (cc.game.config.app != undefined
			&& cc.game.config.app.disallowedList != undefined) {
		disallowedList = cc.game.config.app.disallowedList;
	}
	for (var i = 0; i < disallowedList.length; i++) {
		if (username.toLowerCase().indexOf(disallowedList[i]) != -1) {
			return 'Tên đăng nhập không được chứa các từ khóa gây hiểu lầm cho người chơi khác(vd: admin, bigkool)';
		}
	}
	return "";
};
isValidPassword = function(password) {
	var errorPrefix = "Mật khẩu ";
	var illegalChars = /\W/;
	if (password.length < 6) {
		return errorPrefix + "phải có độ dài tối thiểu là 6 ký tự";
	} else if (password.length > 20) {
		return errorPrefix + "không được dài quá 20 kí tự";
	}
	/*
	 * else if (username.toUpperCase() == password.toUpperCase()) { return
	 * errorPrefix + "không được trùng với tên đăng nhập"; }else if
	 * (isEasyPassword(pass)) { return errorPrefix + "quá đơn giản (ví dụ:
	 * 123456, abcdef), hãy chọn mật khẩu khác"; }
	 */
	else if (illegalChars.test(password)) {
		return errorPrefix + BkConstString.STR_VALID_CHAR;
	}
	return "";
};

var EASY_PASSWORD = [ "abcdef", "123456", "qwerty", "012345", "1234567",
		"12345678", "123456789", "1234567890", "asdfgh", "zxcvbn", "poiuyt",
		"lkjhgf", "mnbvcx" ];

isEasyPassword = function(password) {
	if (cc.game.config.app != undefined
			&& cc.game.config.app.easypwd != undefined) {
		EASY_PASSWORD = cc.game.config.app.easypwd;
	}
	var upperCasePass = password.toUpperCase();
	for (var index = 0; index < EASY_PASSWORD.length; ++index) {
		if (EASY_PASSWORD[index].toUpperCase() == upperCasePass) {
			return true;
		}
	}
	return false;
};

makeClientUID = function(leng) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < leng; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};
getClientTimestamps = function() {
	return new Date().getTime();
};
generateClientId = function(leng) {
	var text = 'vvw_';
	text = text + makeClientUID(leng) + getClientTimestamps() + "_"
			+ getBrowserName();
	return text;
};

isBrowserIE = function() {
	return (getBrowserName() == 'ie');
};

getBrowserName = function() {
	// Fix client id max 45 digit
	if (cc.sys.browserType.length > 7) {
		return cc.sys.browserType.substring(0, 6);
	}
	return cc.sys.browserType;
};
setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	if (cc.game.config.debugMode != cc.game.DEBUG_MODE_NONE) {
		document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
	} else {
		document.cookie = cname + "=" + cvalue + "; " + expires
				+ ";domain=.chanvanvan.com;path=/";
	}
};

getCookie = function(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(name) != -1)
			return c.substring(name.length, c.length);
	}
	return "";
};

postRegFbUser = function(url, fbid, fbAppId, fbToken, fbName, fbEmail,
		username, clientId, providerId) {
	var endpoint = Util.getClientSetting(key.endpoint);
	try {
		if (cc.game.config.debugMode != cc.game.DEBUG_MODE_NONE) {
			return;
		}
		/*
		 * $.ajax({ type: "POST", url: url, dataType: 'json', async: true, data:
		 * JSON.stringify({ "fbId": fbid, "fbAppId": fbAppId, "fbToken":
		 * fbToken, "fbName": fbName, "fbEmail": fbEmail, "username": username,
		 * "clientId": clientId, "providerId": providerId, "regPhoneFlag":
		 * BkGlobal.isPhoneNumberUpdatable, "fbAppIndex": bk.fbAppIndex,
		 * "userMoney": BkGlobal.UserInfo.getMoney(), "clientDv":
		 * BkGlobal.clientDeviceCheck, "endPoint":endpoint }) }).done(function
		 * (data) { //return data && data.retVal > 0 ? true : false; return
		 * true; });
		 */
	} catch (err) {
		logMessage(err);
	}
};
// Update for all user
postRegUpdUserState = function() {
	var pUrl = createPostApiUrl("user/upd");
	var email = BkFacebookMgr.App.getEmail();
	if (email == undefined) {
		email = "";
	}
	if (BkGlobal.isNewRegistraion) {
		logMessage("Save fb user register:" + BkFacebookMgr.facebookID);
		pUrl = createPostApiUrl("user/reg");
		postRegFbUser(pUrl, BkFacebookMgr.facebookID,
				BkFacebookMgr.facebookAppId, BkFacebookMgr.facebookToken, "",
				email, BkGlobal.UserInfo.getUserName(), cc.bkClientId, bk.cpid);
	} else {
		postRegFbUser(pUrl, BkFacebookMgr.facebookID,
				BkFacebookMgr.facebookAppId, BkFacebookMgr.facebookToken, "",
				email, BkGlobal.UserInfo.getUserName(), cc.bkClientId, bk.cpid);
	}
};
/*
 * log type: 2: login 3: register
 */
postUserTracker = function(type, username, providerId, clientId, fbid, msg) {
	try {
		if (cc.game.config.debugMode != cc.game.DEBUG_MODE_NONE) {
			return;
		}
		var postUrl = createPostApiUrl("action/" + type);
		var fbAppIndex = "";
		if (bk.fbAppIndex != "") {
			fbAppIndex = " fbAppIndex: " + bk.fbAppIndex;
		}

		$.ajax({
			type : "POST",
			url : postUrl,
			dataType : 'json',
			async : true,
			data : JSON.stringify({
				"username" : username,
				"providerId" : providerId + fbAppIndex,
				"clientId" : clientId,
				"fbid" : fbid,
				"message" : msg,
			})
		}).done(function(data) {
			return data && data.retVal > 0 ? true : false;
		});
	} catch (err) {
		logMessage(err);
	}
};
function changeGameBg(gid, gs) {
	if (bk.isFbApp) {
		return;
	}
	if (cc.screen.fullScreen()) {
		$(BODY_CLASS_CSS).css('background-image', '');
	} else {
		// var bg = getBackgroundImg(gid,gs);
		// $('body').css('background-image', 'url(res/' + bg + '?v=' +
		// bk.fileVer + ')');
		// var bgPath = 'res/' +getBackgroundImg(gid,gs) + '?v=' + bk.fileVer;
		// makeChangeBgTransition(bgPath);
		if (cc.sys.browserType != cc.sys.BROWSER_TYPE_CHROME) {
			swichBackgroundImg(gs);
		} else {
			var bg = getBackgroundImg(gid, gs);
			$(BODY_CLASS_CSS).css('background-image',
					'url(' + createResUrl(bg) + ')');
		}
		/*
		 * var bg = getBackgroundImg(gid, gs);
		 * $(BODY_CLASS_CSS).css('background-image', 'url(' + createResUrl(bg) +
		 * ')');
		 */
	}
}

/*
 * function makeChangeBgTransition(bgPath) { $('body').animate({ opacity: 0.8 },
 * 900, function () { // Callback $('body').css("background-image", "url(" +
 * bgPath + ")").promise().done(function () { // Callback of the callback
 * $('body').animate({ opacity: 1 }, 200) }); }); }
 */

function goToChanWeb() {
	if (cc.screen.fullScreen()) {
		logMessage("is fullscreen -> exit fullscreen");
		exitFullScreen();
	}
	var goUrl = cc.game.config.app.promoChanAppUrl;
	if (bk.isFbApp) {
		sendGA(BKGA.GAME_CHOOSE, "Click " + Util.getGameLabel(GID.CHAN),
				BkGlobal.clientDeviceCheck);
		cc.sys.openURL(goUrl);
		return;

	}
	// showPopupMessageConfirmWithCancelEx("Bạn sẽ được chuyển sang chơi game
	// Chắn Vạn Văn online. Bạn có muốn chuyển không?",
	// function () {
	goUrl = cc.game.config.app.promoChanUrl;
	sendGA(BKGA.GAME_CHOOSE, "Click " + Util.getGameLabel(GID.CHAN),
			BkGlobal.clientDeviceCheck);
	cc.sys.openURL(goUrl);
	// });
}

bk.isClickedFbLogin = false;
function processLoginFb() {
	showProgressModalEx();
	BkFacebookMgr.appLogin(function(fbUserId, fbToken, msg) {
		cc.username = fbUserId;
		BkConnectionManager.prepareConnection();
		BkFacebookMgr.doLoginFbUser(fbUserId, fbToken, cc.bkClientId);
	});
}
function processLogout(isDeleteLoginState) {
	if (isDeleteLoginState || BkGlobal.isLoginFacebook) {
		// Delete all saving data
		Util.removeClientSetting(key.userLoginInfo);
		if (isDeleteLoginState && bk.isDesktopApp) {
			var listUserArr = BkUserClientSettings.getListUserLoggedIn();
			var userIndex = BkUserClientSettings.getUserIndex(cc.username,
					listUserArr);
			if (userIndex > -1) // user existed
			{
				listUserArr.splice(userIndex, 3);
			}
			Util.setClientSetting(key.ListLoggedInUsers, JSON
					.stringify(listUserArr));
		}
	}
	Util.setClientSession(key.isSaveUserSession, 1);
	Util.removeClientSession(key.userLoginInfo);
	logoutXf();
	// Util.reloadWebPage();
}
function processInitLoginGame() {
	if (!BkLogicManager.getLogic().isLogged) {
		if (BkGlobal.UserInfo == null) {
			BkGlobal.UserInfo = new BkUserData();
		}
		BkGlobal.UserInfo.setUserName(cc.username);
		BkGlobal.UserInfo.clientID = cc.bkClientId;
		BkGlobal.UserInfo.password = cc.password;
		BkConnectionManager.conStatus = CONECTION_STATE.RELOGIN;
	}
	BkConnectionManager.prepareConnection();

}

function openUrl(link) {
	// window.top.location = link;
	top.location.href = link;
}

function getUrlParameterByName(name) {
	var url = window.location.href;
	// console.log(url);
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex
			.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createPostApiUrl(param) {
	return "https://api.bigkool.net/chan/" + param;
	// return bk.httpHost + "api/"+param;
}

function createFbUrl(param) {
	return bk.httpHost + "app/" + param;
	// return bk.httpHost + param;
}