/**
 * Created by hoangthao on 22/10/2015.
 */

function BkFacebookMgr() {

    //TODO: Copy of facebook.js for fixed compiler ver 3.10~
    /**
     *
     * Facebook SDK for Web Platform <br/>
     * FacebookAgent...
     *
     * @property {String} name - plugin name
     * @property {String} version - API version
     */
    plugin.extend('facebook', {
        name: "",
        version: "",
        _userInfo: null,
        email:"",
        _isLoggedIn: false,
        canLoadMore:true,
        invitableList:[],
        next:"",

        /**
         * HTTP methods constants
         * @constant
         * @type {Object}
         */
        HttpMethod: {
            'GET': 'get',
            'POST': 'post',
            'DELETE': 'delete'
        },

        /**
         * Succeed code returned in callbacks
         * @constant
         * @type {Number}
         */
        CODE_SUCCEED: 0,

        /**
         * App event names constants
         * @constant
         * @type {Object}
         */
        AppEvent: {
            'ACTIVATED_APP': FB.AppEvents.EventNames.ACTIVATED_APP,
            'COMPLETED_REGISTRATION': FB.AppEvents.EventNames.COMPLETED_REGISTRATION,
            'VIEWED_CONTENT': FB.AppEvents.EventNames.VIEWED_CONTENT,
            'SEARCHED': FB.AppEvents.EventNames.SEARCHED,
            'RATED': FB.AppEvents.EventNames.RATED,
            'COMPLETED_TUTORIAL': FB.AppEvents.EventNames.COMPLETED_TUTORIAL,
            'ADDED_TO_CART': FB.AppEvents.EventNames.ADDED_TO_CART,
            'ADDED_TO_WISHLIST': FB.AppEvents.EventNames.ADDED_TO_WISHLIST,
            'INITIATED_CHECKOUT': FB.AppEvents.EventNames.INITIATED_CHECKOUT,
            'ADDED_PAYMENT_INFO': FB.AppEvents.EventNames.ADDED_PAYMENT_INFO,
            'PURCHASED': FB.AppEvents.EventNames.PURCHASED,
            'ACHIEVED_LEVEL': FB.AppEvents.EventNames.ACHIEVED_LEVEL,
            'UNLOCKED_ACHIEVEMENT': FB.AppEvents.EventNames.UNLOCKED_ACHIEVEMENT,
            'SPENT_CREDITS': FB.AppEvents.EventNames.SPENT_CREDITS
        },

        /**
         * App event parameter names constants
         * @constant
         * @type {Object}
         */
        AppEventParam: {
            'CURRENCY': FB.AppEvents.ParameterNames.CURRENCY,
            'REGISTRATION_METHOD': FB.AppEvents.ParameterNames.REGISTRATION_METHOD,
            'CONTENT_TYPE': FB.AppEvents.ParameterNames.CONTENT_TYPE,
            'CONTENT_ID': FB.AppEvents.ParameterNames.CONTENT_ID,
            'SEARCH_STRING': FB.AppEvents.ParameterNames.SEARCH_STRING,
            'SUCCESS': FB.AppEvents.ParameterNames.SUCCESS,
            'MAX_RATING_VALUE': FB.AppEvents.ParameterNames.MAX_RATING_VALUE,
            'PAYMENT_INFO_AVAILABLE': FB.AppEvents.ParameterNames.PAYMENT_INFO_AVAILABLE,
            'NUM_ITEMS': FB.AppEvents.ParameterNames.NUM_ITEMS,
            'LEVEL': FB.AppEvents.ParameterNames.LEVEL,
            'DESCRIPTION': FB.AppEvents.ParameterNames.DESCRIPTION
        },

        /**
         * App event parameter values constants
         * @constant
         * @type {Object}
         */
        AppEventParamValue: {
            'VALUE_YES': "1",
            'VALUE_NO': "0"
        },

        _checkLoginStatus: function()
        {
            var self = this;
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    //login
                    self._isLoggedIn = true;
                    //save user info
                    self._userInfo = response['authResponse'];
                    self._getEmail();
                } else {
                    // Reset cached status
                    self._isLoggedIn = false;
                    self._userInfo = {};
                    self.email = "";
                }
            });
        },
        _getEmail:function()
        {
            var self = this;
            FB.api("/me?fields=email",function (response)
            {
                if (response && !response.error)
                {
                    self.email = response['email'];
                    return self.email;
                } else
                {
                    return "";
                }
            });
        },
        //Vinh add invite friend
        _checkLoginAndPermissionStatus: function()
        {
            var self = this;
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected')
                {
                    self._isLoggedIn = true;
                    self._userInfo = response['authResponse'];
                } else
                {
                    // Reset cached status
                    self._isLoggedIn = false;
                    self._userInfo = {};
                }
                if(response.status == "unknown")
                {
                    logMessage("chưa đăng nhập");
                }
                if(response.status = "not_authorized" ||response.status == "unknown" )
                {
                    logMessage("chưa cấp quyền");
                    FB.login(function (response) {
                        if (response['authResponse']) {
                            //save user info
                            self._isLoggedIn = true;
                            self._userInfo = response['authResponse'];
                            BkFacebookMgr.getInvitableFriendList();
                        } else {
                            self._isLoggedIn = false;
                            self._userInfo = {};
                            typeof callback === 'function' && callback(response['error_code'] || 1, {
                                error_message: response['error_message'] || "Unknown error"
                            });
                        }
                    }, {
                        scope: "user_friends",
                        auth_type: "rerequest",
                    });
                }
            });
        },

        ctor: function (config) {
            this.name = "facebook";
            this.version = "1.0";
            this._userInfo = {};
            this._isLoggedIn = false;

            if (!FB) {
                return;
            }

            //This configuration will be read from the project.json.
            FB._https = true;
            FB.init(config);
            FB.Canvas.setAutoGrow();
            this._checkLoginStatus();

            plugin.FacebookAgent = this;
        },
        /**
         * Gets the current object
         * @returns {FacebookAgent}
         */
        getInstance: function () {
            return this;
        },
        /**
         * Login to facebook
         * @param {Function} callback
         * @param {Array} permissions
         * @example
         * //example
         * plugin.FacebookAgent.login();
         */
        login: function (permissions, callback, authtype) {
            var self = this;

            if (typeof permissions == 'function') {
                callback = permissions;
                permissions = [];
            }
            if (permissions.every(function (item) {
                    if (item != 'public_profile')
                        return true;
                })) {
                //permissions.push("email");
                //permissions.push("public_profile");
                //permissions.push("user_friends");
            }
            var permissionsStr = permissions.join(',');
            var fbScope = {
                scope: permissionsStr,
                return_scopes: true,
            };

            if(cc.isString(authtype)){
                fbScope = {
                    scope: permissionsStr,
                        return_scopes: true,
                    auth_type: authtype
                }
            }
            FB.login(function (response) {
                if (response['authResponse']) {
                    //save user info
                    self._isLoggedIn = true;
                    self._userInfo = response['authResponse'];
                    var permissList = permissions;
                    if(!cc.isUndefined(response['authResponse']['grantedScopes'])){
                        permissList = response['authResponse']['grantedScopes'].split(",");
                    }

                    typeof callback === 'function' && callback(0, {
                        accessToken: response['authResponse']['accessToken'],
                        permissions: permissList
                    });
                } else {
                    self._isLoggedIn = false;
                    self._userInfo = {};
                    typeof callback === 'function' && callback(response['error_code'] || 1, {
                        error_message: response['error_message'] || "Unknown error"
                    });
                }
            }, fbScope);
        },
        /**
         * Checking login status
         * @return {Bool} Whether user is logged in
         * @example
         * //example
         * plugin.FacebookAgent.isLoggedIn(type, msg);
         */
        isLoggedIn: function () {
            //this._checkLoginStatus();
            return this._isLoggedIn;
        },

        /**
         * Logout of facebook
         * @param {Function} callback
         * @example
         * //example
         * plugin.FacebookAgent.logout(callback);
         */
        logout: function (callback) {
            var self = this;
            FB.logout(function (response) {
                if (response['authResponse']) {
                    // user is now logged out
                    self._isLoggedIn = false;
                    self._userInfo = {};
                    typeof callback === 'function' && callback(0, {"isLoggedIn": false});
                } else {
                    typeof callback === 'function' && callback(response['error_code'] || 1, {
                        error_message: response['error_message'] || "Unknown error"
                    });
                }
            });
        },

        /**
         * Acquiring new permissions
         * @deprecated since v3.0
         * @param permissions
         * @param callback
         * @example
         * //example
         * plugin.FacebookAgent.requestPermissions(["manage_pages"], callback);
         */
        _requestPermissions: function (permissions, callback) {
            var permissionsStr = permissions.join(',');
            var self = this;
            FB.login(function (response) {
                if (response['authResponse']) {
                    var permissList = permissions;
                    if(!cc.isUndefined(response['authResponse']['grantedScopes'])){
                        permissList = response['authResponse']['grantedScopes'].split(",");
                    }
                    //save user info
                    self._isLoggedIn = true;
                    self._userInfo = response['authResponse'];
                    typeof callback === 'function' && callback(0, {
                        permissions: permissList
                    });
                } else {
                    self._isLoggedIn = false;
                    self._userInfo = {};
                    typeof callback === 'function' && callback(response['error_code'] || 1, {
                        error_message: response['error_message'] || "Unknown error"
                    });
                }
            }, {
                scope: permissionsStr,
                return_scopes: true
            });
        },

        /**
         * Acquiring AccessToken
         * @return {String}
         * @example
         * //example
         * var accessToken = plugin.FacebookAgent.getAccessToken();
         */
        getAccessToken: function () {
            return this._userInfo ? this._userInfo['accessToken'] : null;
        },

        /**
         * Acquiring User ID
         * @return {String}
         * @example
         * //example
         * var userID = plugin.FacebookAgent.getUserID();
         */
        getUserID: function () {
            return this._userInfo ? this._userInfo['userID'] : null;
        },
        getEmail: function () {
            if(this.email != "")
            {
                return this.email;
            }
            return this._getEmail();
        },

        _share: function (info, callback) {
            FB.ui({
                    method: 'share',
                    name: info['title'],
                    caption: info['caption'],
                    description: info['text'],
                    href: info['link'],
                    picture: info['imageUrl']
                },
                function (response) {
                    if (response) {
                        if (response['post_id'])
                            typeof callback === 'function' && callback(0, {
                                didComplete: true,
                                post_id: response['post_id']
                            });
                        else
                            typeof callback === 'function' && callback(response['error_code'] || 1, {
                                error_message: response['error_message'] || "Unknown error"
                            });
                    } else {
                        typeof callback === 'function' && callback(1, {
                            error_message: "Unknown error"
                        });
                    }
                });
        },

        /**
         * Request a web dialog for Facebook sharing
         * @param info
         * @param callback
         */
        dialog: function (info, callback) {
            if (!info) {
                typeof callback === 'function' && callback(1, {
                    error_message: "No info parameter provided"
                });
                return;
            }
            if (!this.canPresentDialog(info)) {
                typeof callback === 'function' && callback(1, {
                    error_message: "The requested dialog: " + info['dialog'] + " can not be presented on Web"
                });
                return;
            }

            // Preprocess properties
            info['name'] = info['name'] || info['site'];
            delete info['site'];

            info['href'] = info['href'] || info['link'] || info['siteUrl'];
            delete info['siteUrl'];
            delete info['link'];

            info['picture'] = info['picture'] || info['image'] || info['photo'] || info['imageUrl'] || info['imagePath'];
            delete info['imageUrl'];
            delete info['imagePath'];
            delete info['photo'];
            delete info['image'];

            info['caption'] = info['title'] || info['caption'];
            delete info['title'];

            info['description'] = info['text'] || info['description'];
            delete info['text'];

            var method = info['dialog'];
            delete info['dialog'];

            if (method === 'shareLink' || method == 'feedDialog') {
                info['method'] = 'share';
            } else if (method == 'messageLink') {
                info['method'] = 'send';
                info['link'] = info['href'];
            } else if (method == 'shareOpenGraph') {
                info['method'] = 'share_open_graph';

                if (info['url']) {
                    var obj = {};
                    if (info["preview_property_name"])
                        obj[info["preview_property_name"]] = info["url"];
                    else
                        obj["object"] = info["url"];

                    for (var p in info) {
                        if (p != "method" && p != "action_type" && p != "action_properties") {
                            info[p] && (obj[p] = info[p]);
                            delete info[p];
                        }
                    }

                    info['action_properties'] = JSON.stringify(obj);
                }
            }

            FB.ui(info,
                function (response) {
                    if (response && typeof callback === 'function') {
                        if (response['post_id'] || response['success']) {
                            callback(0, {
                                didComplete: true,
                                post_id: response['post_id'] || ""
                            });
                        }
                        else {
                            if (response['error_code']) {
                                callback(response['error_code'], {
                                    error_message : response['error_message'] || 'Unknown error'
                                });
                            }
                            else callback(0, response);
                        }
                    } else if (response == undefined && typeof callback === 'function') {
                        callback(1, {
                            error_message: "Unknown error"
                        });
                    }
                });
        },

        /**
         * Check whether the share request can be achieved
         * @param info
         */
        canPresentDialog: function (info) {
            if (info && info['dialog'] && (
                info['dialog'] === 'shareLink' ||
                info['dialog'] === 'feedDialog' ||
                info['dialog'] === 'shareOpenGraph' ||
                info['dialog'] === 'messageLink'))
                return true;
            else
                return false;
        },
        /**
         * FB.api
         * @param {String} path
         * @param {Number} httpmethod
         * @param {Object} params
         * @param {Function} callback
         */
        api: function (path, httpmethod, params, callback) {
            if (typeof params === 'function') {
                callback = params;
                params = {};
            }
            FB.api(path, httpmethod, params, function (response) {
                if (response.error) {
                    typeof callback === 'function' && callback(response['error']['code'], {
                        error_message: response['error']['message'] || 'Unknown error'
                    })
                } else {
                    typeof callback === 'function' && callback(0, response);
                }
            });
        },

        _getPermissionList: function (callback) {
            FB.api("/me/permissions", function (response) {
                if (response['data']) {
                    var permissionList = [];
                    for (var i = 0; i < response['data'].length; i++) {
                        if (response['data'][i]["status"] == "granted") {
                            permissionList.push(response['data'][i]['permission']);
                        }
                    }
                    typeof callback == 'function' && callback(0, {
                        permissions: permissionList
                    });
                } else {
                    if (!response['error'])
                        response['error'] = {};
                    typeof callback == 'function' && callback(response['error']['code'] || 1, {
                        error_message: response['error']['message'] || 'Unknown error'
                    });
                }
            })
        },

        destroyInstance: function () {
        },
        canvas:{
            /**
             * Payment request
             * @param {Object} info
             * @param {Function} callback
             */
            pay: function (info, callback) {
                /*
                 * Reference document
                 * https://developers.facebook.com/docs/payments/reference/paydialog
                 */
                info['method'] = 'pay';
                info['action'] = 'purchaseitem';

                FB.ui(info, function (response) {
                    if (response['error_code']) {
                        callback(response['error_code'] || 1, {
                            error_message: response['error_message'] || response['error_msg'] || 'Unknown error'
                        });
                    } else {
                        callback(0, response);
                    }
                })
            }
        },

        /**
         * Send an app requests to friends
         * @param {Object} info
         * @param {Function} callback
         */
        appRequest: function (friend_ids,callback)
        {
            FB.ui({
                    method: 'apprequests',
                    message: 'Chắn Vạn Văn game chắn dân gian Việt Nam. Thỏa sức tranh tài!',
                    to: friend_ids,
                },
                function (response) {
                    if (response)
                    {
                        cc.eventManager.setEnabled(true);
                        if (response['error_code'])
                        {

                            return;

                        }
                        else {
                            var invFr = response["to"];
                            typeof callback === 'function' && callback(invFr);
                        }
                    } else
                    {
                        typeof callback === 'function' && callback(1, {
                            error_message: "Unknown error"
                        });
                    }
                });
        },

        /**
         * Log an event
         * @param {String} eventName
         * @param {Number} valueToSum
         * @param {Object} parameters
         */
        logEvent: function (eventName, valueToSum, parameters) {
            if (eventName == undefined) return;
            if (valueToSum === undefined && parameters === undefined) {
                FB.AppEvents.logEvent(eventName, null, null);
            } else if (typeof valueToSum === "number" && parameters === undefined) {
                FB.AppEvents.logEvent(eventName, valueToSum);
            } else if (typeof valueToSum === "object" && parameters === undefined) {
                FB.AppEvents.logEvent(eventName, null, valueToSum);
            } else {
                FB.AppEvents.logEvent(eventName, valueToSum, parameters);
            }
        },

        /**
         * Activate App
         */
        activateApp: function () {
            FB.AppEvents.activateApp();
        },

        /**
         * Log a purchase
         * @param {Number} amount Amount of the purchase
         * @param {String} currency The currency
         * @param {Object} param Supplemental parameters
         */
        logPurchase:function(amount, currency, param){
            FB.AppEvents.logPurchase(amount, currency, param);
        }
    });

    BkFacebookMgr.App = BkFacebookMgr.App || (window["plugin"] ? window["plugin"]["FacebookAgent"]["getInstance"]() : null);
    BkFacebookMgr.facebookID = "";
    BkFacebookMgr.facebookToken = "";
    BkFacebookMgr.facebookAppId = cc.game.config.plugin.facebook.appId;
}


BkFacebookMgr.appLogin = function (callback) {
    logMessage("Call BkFacebookMgr.appLogin");
    var fbUserId = "";
    var fbToken = "";
    hideThongBao();
    hideProgressModalEx();
    try {
        if (BkFacebookMgr.App.isLoggedIn()) {
            //logMessage("logged in token: " + BkFacebookMgr.App.getAccessToken() + " UID: " + BkFacebookMgr.App.getUserID());
            fbUserId = BkFacebookMgr.App.getUserID();
            fbToken = BkFacebookMgr.App.getAccessToken();
            BkFacebookMgr.email = BkFacebookMgr.App.getEmail();
            BkFacebookMgr.facebookID = fbUserId;
            logMessage("BkFacebookMgr.App.isLoggedIn " + fbUserId);
            if (cc.isFunction(callback)) {
                callback(fbUserId, fbToken);
            }
        }
        else {
            BkFacebookMgr.App.login(["public_profile", "email"], function (type, msg) {
                //logMessage("type is " + type + " msg is " + JSON.stringify(msg));
                if (type == 0 && callback) {
                    fbUserId = BkFacebookMgr.App.getUserID();
                    fbToken = BkFacebookMgr.App.getAccessToken();
                    BkFacebookMgr.facebookID = fbUserId;
                    BkFacebookMgr.facebookToken = fbToken;
                    BkFacebookMgr.email = BkFacebookMgr.App.getEmail();
                    if (cc.isFunction(callback)) {
                        callback(fbUserId, fbToken, msg);
                    }
                } else {
                    switchToSceneWithGameState(GS.PREPARE_GAME);
                    var fbMsg = "Để chơi game bằng tài khoản Facebook bạn cần cấp quyền truy cập ứng dụng";
                    showPopupMessageEx(fbMsg + ". Xin hãy đăng nhập lại!");
                    /*if (bk.isFbApp) {
                     showThongBaoWithAction(fbMsg,
                     "Đăng nhập bằng tài khoản Facebook",
                     function () {
                     processLoginFb();
                     }
                     );
                     } else {
                     showPopupMessageEx(fbMsg + ". Xin hãy đăng nhập lại!");
                     }*/
                }
            });
        }
    }catch (e){
        console.log(e);
        showPopupMessageEx("Không thể cấp quyền đăng nhập Facebook, hãy đảm bảo trình duyệt web của bạn không chặn mở popup.");
    }
};

BkFacebookMgr.appInviteRequest = function (param, callbackFun) {
    BkFacebookMgr.App.appRequest(param, function (resultcode, msg)
    {
        if (callbackFun != null) {
            var invFr = BkFacebookMgr.processResInvitation(msg);
            callbackFun(invFr);
        }
        logMessage("appRequest: " + JSON.stringify(msg));
    });
};

BkFacebookMgr.appInviteRequestWithLogin = function (param, callbackFun) {
    try {
        if (!BkFacebookMgr.App.isLoggedIn()) {
            BkFacebookMgr.App.login(["public_profile"],function (type, msg) {
                //logMessage("appInviteRequestWithLogin: type is " + type + " msg is " + JSON.stringify(msg));
                if (type == 0) {
                    BkFacebookMgr.appInviteRequest(param, callbackFun);
                }
            });
        } else {
            BkFacebookMgr.appInviteRequest(param, callbackFun);
        }
    }
    catch (e) {
        //postUserTracker(4, BkGlobal.UserInfo.getUserName(),bk.cpid, cc.bkClientId, "", "appInviteRequestWithLogin:  "+ e);
        showPopupMessageWith(BkConstString.INVITE_FRIEND_ERROR, "Mời bạn facebook lỗi!");
    }
};
BkFacebookMgr.setCallBack = function(cb)
{
    this.cbHandle = cb;
},
BkFacebookMgr.prepareBeforeInviteFriend = function()
{
    try
    {
        BkFacebookMgr.askPermission();
    }
    catch (e)
    {
       // postUserTracker(4, BkGlobal.UserInfo.getUserName(),bk.cpid, cc.bkClientId, "", "prepareBeforeInviteFriend:  "+ e);
        showPopupMessageWith(BkConstString.INVITE_FRIEND_ERROR, "Mời bạn facebook lỗi!");
    }
};
BkFacebookMgr.createInviteParam = function (excludeList) {

    var title = "Mời bạn chơi Bigkool nhận tiền thưởng";
    var message = "Game dân gian trên điện thoại - Bigkool";
    logMessage("excludeList: "+excludeList.toString());
    if (excludeList != null) {

        return {
            "message": message,
            "title": title,
            "exclude_ids": excludeList,
            "max_recipients": 50,
            filters: ['app_non_users']
        };
    }

    return {
        "message": message,
        "title": title,
        filters: ['app_non_users']
    };
};
BkFacebookMgr.processResInvitation = function (response) {
    if (response && response.to) {
        var ids = response["to"];
        var inviteFriendLists = "" + ids.length;
        for (var i = 0; i < ids.length; ++i) {
            if (i == 0) {
                inviteFriendLists = ids[i];
            } else {
                inviteFriendLists = inviteFriendLists + "," + ids[i];
            }
        }
        return inviteFriendLists;
    } else {
        return "";
    }
};

BkFacebookMgr.doLoginFbUser = function (facebookId, facebookToken, clientID) {
    showProgressModalEx();
    if (BkGlobal.UserInfo == null) {
        BkGlobal.UserInfo = new BkUserData();
    }
    //fb relogin to get new fb token
    if(facebookToken == ""){
        logMessage("----- facebookToken is EMPTY-> relogin");
        $('#progress-text').text("Đang đăng nhập lại facebook...");
        processLoginRegistFailEx();
        return;
    }
    BkGlobal.isLoginFacebook = true;
    var contentProviderId = bk.cpid;
    var packet = new BkPacket();
    packet.CreatePacketLoginFacebook(facebookId, facebookToken, contentProviderId, clientID, bk.userIp);
    logMessage("BkFacebookMgr.doLoginFbUser "+ facebookId);
    BkConnectionManager.send(packet);
    //postUserTracker(2, facebookId, bk.cpid, cc.bkClientId, "", "doLoginFbUser facebookToken: " + facebookToken);
};
BkFacebookMgr.doRegisterFbUser = function (facebookId, facebookToken, clientID) {
    if (BkGlobal.UserInfo == null) {
        BkGlobal.UserInfo = new BkUserData();
    }
    BkGlobal.isLoginFacebook = true;
    var contentProviderId = bk.cpid;
    var packet = new BkPacket();
    packet.CreatePacketLoginFacebook(fb.SUBEVENT_REGISTER_PLAYER, facebookId, facebookToken, contentProviderId, clientID, bk.userIp);
    BkConnectionManager.send(packet);
};

BkFacebookMgr.doFbLinkUser = function (facebookId, facebookToken, clientID) {
    if (BkGlobal.UserInfo == null) {
        BkGlobal.UserInfo = new BkUserData();
    }
    var contentProviderId = bk.cpid;
    var packet = new BkPacket();
    packet.CreatePacketLoginFacebook(facebookId, facebookToken, contentProviderId, clientID, bk.userIp);
    BkConnectionManager.send(packet);
};

BkFacebookMgr.doFbLCheckSetup = function () {
    var packet = new BkPacket();
    packet.CreatePacketLoginFbCheckSetup();
    BkConnectionManager.send(packet);
};

BkFacebookMgr.processLoginFbResult = function (packet) {
    var subEvent = packet.Buffer.readByte();
    logMessage("processLoginFbResult: " + subEvent);
    switch (subEvent) {
        case fb.SUBEVENT_LOGIN:
        case fb.SUBEVENT_REGISTER_PLAYER:
        case fb.SUBEVENT_LINK_PLAYER:
        case fb.SUBEVENT_CHECK_ACCOUNT_SETUP:
        case fb.SUBEVENT_INPUT_USER:
        case fb.SUBEVENT_RENAME:
        case fb.SUBEVENT_AUTH_FB:
    }
};

BkFacebookMgr.updateFacebookClient = function () {
    var pUrl = createPostApiUrl("user/upd");
    if (BkGlobal.isNewRegistraion) {
        logMessage("Save fb user register:" + BkFacebookMgr.facebookID);
        pUrl = createPostApiUrl("user/reg");
        postRegFbUser(pUrl, BkFacebookMgr.facebookID, BkFacebookMgr.facebookAppId, BkFacebookMgr.facebookToken, "","", BkGlobal.UserInfo.getUserName(), cc.bkClientId, bk.cpid);
    }else {
        postRegFbUser(pUrl, BkFacebookMgr.facebookID, BkFacebookMgr.facebookAppId, BkFacebookMgr.facebookToken, "","", BkGlobal.UserInfo.getUserName(), cc.bkClientId, bk.cpid);
    }
};

BkFacebookMgr.shareLink = function (shareUrl) {
    if(shareUrl == undefined){
        return;
    }

    //console.log(shareUrl);
    var map = {
        "dialog": "shareLink",
        "link": shareUrl
    };
    if(BkFacebookMgr.App == undefined){
        postUserTracker(2, cc.username, bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, "BkFacebookMgr.App NULL");
        return;
    }

    if(cc.isFunction(BkFacebookMgr.App.canPresentDialog) &&  BkFacebookMgr.App.canPresentDialog(map)){
        BkFacebookMgr.App.dialog(map,function(errorCode,msg){
            logMessage(errorCode);
        });
    }else{
        map["dialog"] = "feedDialog";
        BkFacebookMgr.App.dialog(map,function(errorCode,msg){
            logMessage(errorCode);
        });
    }
};

BkFacebookMgr.shareAppFbLink = function (appUrl) {
    if (appUrl == undefined || appUrl == "") {
        var shareWeb = "https://bigkool.net?utm_source=fbwebshare&utm_medium=sharefbclick&utm_campaign=fbwebshare";
        if(!cc.isUndefined(cc.game.config.app) && !cc.isUndefined(cc.game.config.app.promoShareUrl)){
             shareWeb = cc.game.config.app.promoShareUrl;
        }

        BkFacebookMgr.shareLink(shareWeb);
        return;
    }
    BkFacebookMgr.shareLink("https://www.facebook.com/games/"+ appUrl);
};
BkFacebookMgr.askPermission = function(callback)
{
    var permissionList = ["user_friends"];
    //Nếu chưa login thì xin thêm quyền dăng nhập
    if (!BkFacebookMgr.App.isLoggedIn()) {
        permissionList.push("public_profile");
    }
    BkFacebookMgr.App.login(permissionList,function (response) {
        if (response == 0) {
            //save user info
            BkFacebookMgr.facebookID = BkFacebookMgr.App.getUserID();
            //BkFacebookMgr.facebookToken = BkFacebokMgr.App.getAccessToken();
            BkFacebookMgr.getInvitableFriendList();
        } else {
            showPopupMessageEx("Để mời bạn facebook bạn cần cấp quyền truy cập facebook, xin hãy thử lại.");
        }
    }, "rerequest");
},
BkFacebookMgr.getInvitableFriendList = function()
{
    var self = this;
    if (BkFacebookMgr.App == undefined)
    {
        return;
    }
    var requestStr = "";
    if(self.next!= undefined && self.next != "")
    {
        requestStr = self.next;
    }else
    {
        requestStr = "/me/invitable_friends?fields=name,picture.width(80).height(80)&limit=50";
    }
    Util.showAnim();
    BkFacebookMgr.App.api(requestStr,  BkFacebookMgr.App.__proto__.HttpMethod   .GET, {}, function (type, data)
    {
        if (type == BkFacebookMgr.App.__proto__.CODE_SUCCEED)
        {
            self.invitableList = [];
            if(data.data.length == 0)
            {
                showToastMessage("Bạn không có bạn nào phù hợp để mời");
                Util.removeAnim();
                return;
            }
            if(data.paging.next != undefined && data.paging.next != "")
            {
                self.next = data.paging.next;
                self.canLoadMore = true;
            }else
            {
                self.canLoadMore = false;
            }
            // check with CACHE here;
            var cachedInvitedFB = BkUserClientSettings.getListFBInvited( BkFacebookMgr.facebookID);
            if(cachedInvitedFB.length > 0)
            {
                var cachedArr = JSON.parse(cachedInvitedFB);
                for(var j = 0; j < cachedArr.length; j++)
                {
                    var fbName = cachedArr[j];
                    for(var i = data.data.length -1; i >= 0; i--)
                    {
                        if(data.data[i].name == fbName)
                        {
                            data.data.splice(i,1);
                        }
                    }
                }
            }
            self.invitableList = data.data;
            if(self.invitableList.length == 0)
            {
                if(self.canLoadMore)
                {
                    BkFacebookMgr.getInvitableFriendList();
                    return;
                }else
                {
                    showToastMessage("Bạn không có bạn nào phù hợp để mời");
                    Util.removeAnim();
                    return;
                }
            }
            BkLogicManager.getLogic().getFaceBookInvitedFriends(BkFacebookMgr.facebookID,data);
        }
    });
    return true;
};
BkFacebookMgr.onGetInvitableListFinished = function()
{
  if(this.cbHandle != null)
  {
      this.cbHandle.onGetInvitableListFinished();
  }
},
BkFacebookMgr.resetToDefaultValue = function(callback)
{
    this.next = "";
    this.invitableList = [];
    this.canLoadMore = false;
    this._userInfo = {};
    this._isLoggedIn = false;
};