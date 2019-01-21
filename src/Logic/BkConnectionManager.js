/**
 * Created by bs on 06/10/2015.
 */

var EXPECT_TIME_DURATION = 8;

var PING_TIMER_DURATION = 8;
var NUMBER_PING = 2;
var RECONNECT_TIMER_DURATION = 5;
var NUMBER_RECONNECT = 2;
var MAKE_NEW_CONNECTION_DURATION = 5;
var NUMBER_REPEAT_MNC = 2;

var MAX_TIME_PROCESSING_IN_QUEUE = 10000;
var MAX_TIME_PROCESSING_IN_QUEUE_MAU_BINH = 30000;
var MAX_EVENT_INQUEUE = 30;
var IP = "cws.bigkool.net";
var DEFAULT_SOCKET_URL = "://" + IP + "/ws/";


//var IP = "123.30.171.84";
//var DEFAULT_SOCKET_URL = "://" + IP + ":18092/";


var BkConnectionManager = {
    connection: null,
    lastPacket: null,
    countScheduleMNC: 0,
    countReconnect: 0,
    countPing: 0,
    countClose: 0,
    conStatus: null,
    qPacket:null,
    isProcessing:false,
    lastTimeProcessing:-1,
    isIDLETimeOut:false,
    expectPacketType:null,
    isSendingLastPacket:false,
    initWithUrl: function (url) {
        this.connection = BkSocket;
        if (this.connection != null) {
            this.connection.closeConnection();
        }
        if (url != undefined) {
            BkSocket.init(url);
        } else {
/*          var wsProtocol = "ws";
            if (window.location.protocol == "https:"){
                wsProtocol = "wss";
            }
            */
            var wsProtocol = "wss";
            var socketUrl = wsProtocol + DEFAULT_SOCKET_URL;
            logMessage("Socket url: " + socketUrl);
            if(cc.game.config.app != undefined && cc.game.config.app.gamews != undefined){
                socketUrl = wsProtocol + cc.game.config.app.gamews;
            }
            BkSocket.init(socketUrl);
        }
        this.connection.initSocket();
        this.connection.setDelegate(this);
    },

    prepareConnection: function () {
        if (!this.isOpenConnection()) {
            this.initWithUrl();
        }
    },

    reLogin:function(){

    },
    bkUserName : "",
    bkUserPass : "",
    doLogin:function (userName,pass) {
        logMessage("doLogin userName: "+userName + " pass: " + pass);
        this.bkUserName = userName;
        this.bkUserPass = pass;
        var url = "wss://ws.bigkool.net/";
        url = "ws://125.212.225.24:18090";
        this.initWithUrl(url);
    },
    onOpen: function (evt) {
        logMessage("onOpen callback this.conStatus: ");
        var packet = new BkPacket();
        var clientID = NativeInterface.getClientID();
        packet.createLoginPacket(this.bkUserName, this.bkUserPass,clientID);
        BkConnectionManager.send(packet);

        // if (this.conStatus == CONECTION_STATE.MAKING_NEW_CONNECTION){
        //     logMessage("MAKING_NEW_CONNECTION");
        //     this.sendMakeNewConnectionPacket();
        //     return;
        // }
        //
        // if (this.conStatus == CONECTION_STATE.RECONNECTING){
        //     logMessage("RECONNECTING");
        //     this.sendReconnetPacket();
        //     return;
        // }
        //
        // if (this.conStatus == CONECTION_STATE.RELOGIN){
        //     logMessage("RELOGIN");
        //     this.reLogin();
        //     return;
        // }
        //
        // logMessage("cac th khac");
        // if (this.connection.pendingPacket != null) {
        //     this.send(this.connection.pendingPacket);
        // }
        // else {
        //     this.reLogin();
        // }
    },
    onError: function (evt) {
        logMessage("onError callback");
    },
    onClose: function (evt) {
        // if (BkLogicManager.getLogic().isLogout){
        //     BkLogicManager.getLogic().isLogout = false;
        //     Util.removeAnim();
        //     Util.reloadWebPage();
        //     return;
        // }
        //
        // logMessage("onClose callback "+this.countClose + "- this.conStatus: "+this.conStatus);
        // if (this.isIDLETimeOut){
        //     logMessage("isIDLETimeOut -> wait action click popup renew connection");
        //     this.isIDLETimeOut = false;
        //     return;
        // }
        // if(this.conStatus == CONECTION_STATE.RELOGIN) {
        //     this.countClose++;
        //     this.processOnClose();
        // }
    },
    processOnClose: function () {
        // var self = this;
        // if (this.countClose >= 3) {
        //     logMessage("can't reconnect -> show thong bao");
        //     this.countClose = 0;
        //     var onOKClick = function () {
        //         Util.reloadWebPage();
        //     };
        //     Util.removeAnim();
        //     //sendGA(BKGA.ERR_LOG, "OnClose", bk.cpid);
        //     showPopupMessageConfirmEx(BkConstString.STR_NETWORK_LOST_CONNECT, function () {
        //         onOKClick();
        //     },true);
        // } else {
        //     logMessage("try reconnect -> " + this.countClose);
        //     Util.showAnim(false);
        //     self.initWithUrl();
        // }
    },
    getConnection: function () {
        return this.connection;
    },
    send: function (packet) {
        this.prepareForSend(packet);
        this.connection.sendPacket(packet);
    },
    isOpenConnection: function () {
        if (this.connection == null) {
            return false;
        }
        return this.connection.isOpen;
    },
    /*
     * implement for makenew connention
     * */
    prepareForSend: function (packet) {
        // if (Util.isUserActionPacket(packet) && this.isMakeNewConnectionState(packet)) {
        //     logMessage("Last packet: " + packet.Type);
        //     this.lastPacket = packet;
        //     this.scheduleMakeNewConnection();
        // }
    },
    isMakeNewConnectionState: function (packet) {
        // if (BkGlobal.currentGS != GS.INGAME_GAME) {
        //     return true;
        // } else {
        //     if (packet.Type == c.NETWORK_TABLE_LEAVE) {
        //         return true;
        //     }
        // }
        return false;
    },
    doMakeNewConnection: function () {
        // logMessage("Making new connection....");
        // Util.showAnim(false);
        // this.conStatus = CONECTION_STATE.MAKING_NEW_CONNECTION;
        // this.initWithUrl();
    },
    sendMakeNewConnectionPacket:function(){
        // var gameID = -1;
        // var roomID = -1;
        // var tableID = -1;
        // switch (BkGlobal.currentGS) {
        //     case GS.CHOOSE_TABLE:
        //         gameID = BkGlobal.currentGameID;
        //         roomID = BkGlobal.currentRoomID;
        //         break;
        //     case GS.INGAME_GAME:
        //         gameID = BkGlobal.currentGameID;
        //         roomID = BkGlobal.currentRoomID;
        //         tableID = BkGlobal.currentTableID;
        //         break;
        //     default:
        //         break;
        // }
        // if (BkGlobal.UserInfo == null) {
        //     logMessage("user null -> can't make new connection");
        //     Util.reloadWebPage();
        //     return;
        // }
        // logMessage(BkGlobal.UserInfo.userName+" - "+ BkGlobal.UserInfo.password+" - "+ gameID+" - "+ roomID+" - "+ tableID);
        // var packet = new BkPacket();
        // packet.CreateMakeNewConnection(BkGlobal.UserInfo.userName, BkGlobal.UserInfo.password, gameID, roomID, tableID);
        // this.send(packet);
    },
    onMakeNewConnection: function () {
        // BkConnectionManager.countScheduleMNC++;
        // logMessage("new onMakeNewConnection " + BkConnectionManager.countScheduleMNC);
        // //BkConnectionManager.initWithUrl();
        // if (BkConnectionManager.countScheduleMNC >= (NUMBER_REPEAT_MNC + 1)) {
        //     logMessage("finish schedule");
        //     BkConnectionManager.countScheduleMNC = 0;
        //     BkConnectionManager.renewConnection(BkConstString.STR_NETWORK_LOST_CONNECT);
        // } else {
        //     BkConnectionManager.doMakeNewConnection();
        // }
    },
    scheduleMakeNewConnection: function () {
        // logMessage("scheduleMakeNewConnection");
        // this.countScheduleMNC = 0;
        // this.unScheduleMakeNewConnection(false);
        // if (!this.isOpenConnection()){
        //     this.onMakeNewConnection();
        // }
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.schedule(this.onMakeNewConnection, MAKE_NEW_CONNECTION_DURATION, NUMBER_REPEAT_MNC);
        // }
    },
    unScheduleMakeNewConnection: function (isRemoveAnim) {
        // if (isRemoveAnim == undefined){
        //     isRemoveAnim = true;
        // }
        // if (isRemoveAnim){
        //     Util.removeAnim();
        // }
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.unschedule(this.onMakeNewConnection);
        // }
    },
    onPing: function () {
        // BkConnectionManager.countPing++;
        // logMessage("onPing " + BkConnectionManager.countPing);
        // if (BkConnectionManager.countPing == 2) {
        //     logMessage("show Anim");
        //     Util.showAnim(false);
        // }
        //
        // if (BkConnectionManager.countPing == (NUMBER_PING + 1)) {
        //     logMessage("onFinishPing");
        //     BkConnectionManager.scheduleReconnect();
        // } else {
        //
        //     if (!BkGlobal.isTabActive){
        //         logMessage("tab inActive -> don't send ping");
        //         return;
        //     }
        //     logMessage("onPing -> send ping packet");
        //     var Packet = new BkPacket();
        //     Packet.CreatePacketWithOnlyType(c.NETWORK_PING_MESSAGE);
        //     BkConnectionManager.send(Packet);
        // }
    },
    unScheduleIngame:function(){
        // this.unSchedulePing();
        // this.unScheduleReconnect();
    },
    unSchedulePing: function () {
        // logMessage("unSchedulePing");
        // Util.removeAnim();
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.unschedule(this.onPing);
        // }
    },
    schedulePing: function () {
        // BkConnectionManager.countPing = 0;
        // this.unSchedulePing();
        // this.unScheduleReconnect();
        // if (BkGlobal.currentGS == GS.INGAME_GAME) {
        //     var scene = getCurrentScene();
        //     if (scene != null) {
        //         scene.schedule(this.onPing, PING_TIMER_DURATION, NUMBER_PING);
        //     }
        // }
    },
    renewConnection: function (str) {
        // logMessage("renewConnection");
        // var self = this;
        // this.unScheduleMakeNewConnection();
        // this.unSchedulePing();
        //
        // if (this.conStatus == CONECTION_STATE.RECONNECTING) {
        //     this.unScheduleReconnect();
        // }
        // logMessage("CONECTION_STATE.RELOGIN");
        // this.conStatus = CONECTION_STATE.RELOGIN;
        // var onOKClick = function () {
        //     if (BkGlobal.currentGS != GS.INGAME_GAME){
        //         logMessage("khong phai ingame -> reload page");
        //         Util.reloadWebPage();
        //         return;
        //     }
        //     Util.showAnim(false);
        //     self.initWithUrl();
        // };
        // //sendGA(BKGA.ERR_LOG, "RELOGIN", bk.cpid);
        // showPopupMessageConfirmEx(str, onOKClick,true);
    },
    scheduleReconnect: function () {
        // BkConnectionManager.countReconnect = 0;
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.schedule(this.onReconnect, RECONNECT_TIMER_DURATION, NUMBER_RECONNECT);
        // }
    },
    unScheduleReconnect: function () {
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.unschedule(this.onReconnect);
        // }
    },
    onReconnect: function () {
        // BkConnectionManager.unSchedulePing();
        // BkConnectionManager.countReconnect++;
        // Util.showAnim(false);
        // logMessage("onReconnect " + BkConnectionManager.countReconnect);
        // if (BkConnectionManager.countReconnect >= (NUMBER_RECONNECT + 1)) {
        //     logMessage("finish reconnect");
        //     BkConnectionManager.countReconnect = 0;
        //     BkConnectionManager.renewConnection(BkConstString.STR_NETWORK_LOST_CONNECT);
        // } else {
        //     logMessage("onReconnect");
        //     if (BkGlobal.currentGS != GS.INGAME_GAME || this.conStatus == CONECTION_STATE.RELOGIN) {
        //         return;
        //     }
        //     if (BkGlobal.currentGS == GS.INGAME_GAME) {
        //         logMessage("Reconnecting....");
        //         BkConnectionManager.initWithUrl();
        //         BkConnectionManager.conStatus = CONECTION_STATE.RECONNECTING;
        //     }
        // }
    },
    sendReconnetPacket: function (){
        // logMessage("sendReconnetPacket");
        // if (BkGlobal.UserInfo == null) {
        //     logMessage("user null -> can't make new connection");
        //     return;
        // }
        //
        // var packet = new BkPacket();
        // packet.CreateReconnect(BkGlobal.UserInfo.userName, BkGlobal.UserInfo.password);
        // BkConnectionManager.send(packet);
    },
    onReconnectSuccess: function () {
        // logMessage("onReconnectSuccess -> send SYNS");
        // Util.removeAnim();
        // BkConnectionManager.unScheduleReconnect();
        // BkLogicManager.getInGameLogic().onReconnectSuccess();
    },
    onNetworkDisconnect: function () {
        // this.unScheduleMakeNewConnection();
        // this.unSchedulePing();
        // if (BkGlobal.currentGS != GS.INGAME_GAME) {
        //     if (!isBrowserIE()){
        //         //this.renewConnection(BkConstString.STR_NETWORK_LOST_CONNECT);
        //     } else {
        //         logMessage("isBrowserIE");
        //     }
        // } else {
        //     this.scheduleReconnect();
        // }
    },
    onIdleTimeOut: function () {
        // this.unScheduleMakeNewConnection();
        // this.unSchedulePing();
        // //if (this.conStatus == CONECTION_STATE.CONNECTION_NORMAL) {
        // this.isIDLETimeOut = true;
        // if (this.isOpenConnection()) {
        //     this.renewConnection(BkConstString.STR_NETWORK_IDLE_TIME_OUT);
        // } else {
        //     this.renewConnection(BkConstString.STR_NETWORK_LOST_CONNECT_LONG_TIME);
        // }
    },
    onException: function () {
        // if (BkGlobal.currentGS != GS.INGAME_GAME) {
        //     this.renewConnection(BkConstString.STR_NETWORK_EXCEPTION);
        // } else {
        //     this.connection.closeConnection();
        // }
    },
    onTerminate: function () {
        // this.unScheduleMakeNewConnection();
        // this.unSchedulePing();
        //
        // this.connection.closeConnection();
        // Util.removeClientSession(key.userLoginInfo);
        // Util.removeClientSetting(key.userLoginInfo);
        //
        // if(cc.screen.fullScreen()){
        //     exitFullScreen();
        // }
        //
        // var onOKClick = function () {
        //     processLogout();
        //     Util.reloadWebPage();
        // };
        // //showPopupMessageWith(BkConstString.STR_NETWORK_TERMINATED,"", onOKClick,onOKClick);
        // showPopupMessageConfirmEx(BkConstString.STR_NETWORK_TERMINATED,onOKClick);
    },
    closeConn: function () {
        if (this.connection != null) {
            this.connection.closeConnection();
        }
    },
    processNetworkLockedClient: function () {
        // this.closeConn();
        // Util.removeClientSetting(key.userLoginInfo);
        // //postUserTracker(2, cc.username, bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, "LOCKED_CLIENT");
        // var onOKClick = function () {
        //     openUrl(bk.httpHost + "/misc/contact/");
        // };
        // showPopupMessageConfirmEx(BkConstString.STR_LOCKED_CLIENT, onOKClick);
    },
    processConnectionEvent: function (packet) {
        // this.unSchedulePing();
        // switch (packet.Type) {
        //     case c.NETWORK_RECONNECT_SUCCESS:
        //         this.conStatus = CONECTION_STATE.CONNECTION_NORMAL;
        //         this.onReconnectSuccess();
        //         break;
        //     case c.NETWORK_RECONNECT_FAILURE:
        //         this.conStatus = CONECTION_STATE.LOST_CONNECTION;
        //         Util.removeAnim();
        //         this.renewConnection(BkConstString.STR_NETWORK_LOST_CONNECT);
        //         break;
        //     case c.NETWORK_MAKE_NEW_CONNECTION_SUCCESS:
        //         logMessage("NETWORK_MAKE_NEW_CONNECTION_SUCCESS "+this.isSendingLastPacket);
        //         this.conStatus = CONECTION_STATE.CONNECTION_NORMAL;
        //         Util.removeAnim();
        //
        //         if (this.isSendingLastPacket){
        //             logMessage("isSendingLastPacket -> show popup reload page");
        //             this.isSendingLastPacket = false;
        //             Util.removeAnim();
        //             var onOKClick = function () {
        //                 Util.reloadWebPage();
        //             };
        //             Util.removeAnim();
        //             //sendGA(BKGA.ERR_LOG, "OnClose", bk.cpid);
        //             showPopupMessageConfirmEx(BkConstString.STR_NETWORK_LOST_CONNECT, function () {
        //                 onOKClick();
        //             },true);
        //             return;
        //         }
        //
        //         if (this.lastPacket != null) {
        //             logMessage("resend last packet with type" + this.lastPacket.Type);
        //             this.isSendingLastPacket = true;
        //             Util.showAnim();
        //             this.send(this.lastPacket);
        //         }
        //         break;
        //     case c.NETWORK_MAKE_NEW_CONNECTION_FAILED:
        //         logMessage("NETWORK_MAKE_NEW_CONNECTION_FAILED");
        //         Util.removeAnim();
        //         this.renewConnection(BkConstString.STR_NETWORK_LOST_CONNECT);
        //         break;
        //     case c.NETWORK_DISCONNECT:
        //         this.onNetworkDisconnect();
        //         break;
        //     case c.NETWORK_EXCEPTION:
        //         this.onException();
        //         break;
        //     case c.NETWORK_SESSION_TERMINATED:
        //         this.onTerminate();
        //         break;
        //     case c.NETWORK_WRITER_IDLE_TIMEOUT:
        //         this.onIdleTimeOut();
        //         break;
        //     case c.NETWORK_LOCKED_CLIENT:
        //         this.processNetworkLockedClient();
        //         break;
        // }
    },
    initExpectPacketBeforeSend:function(packetType){
        // logMessage("initExpectPacketBeforeSend with packetType: "+packetType);
        // this.expectPacketType = packetType;
        // this.scheduleForExpectPacket();
    },
    scheduleForExpectPacket:function(){
        // logMessage("scheduleForExpectPacket");
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.scheduleOnce(this.onSendExpectPacketTimeOut, EXPECT_TIME_DURATION);
        // }
    },
    onSendExpectPacketTimeOut:function(){
        // logMessage("onSendExpectPacketTimeOut");
        // BkConnectionManager.unscheduleForExpectPacket();
        // var onOKClick = function () {
        //     Util.reloadWebPage();
        // };
        // showPopupMessageConfirmEx(BkConstString.STR_NETWORK_EXCEPTION, onOKClick,true);
    },
    unscheduleForExpectPacket:function(){
        // logMessage("unscheduleForExpectPacket");
        // this.expectPacketType = null;
        // var scene = getCurrentScene();
        // if (scene != null) {
        //     scene.unschedule(this.onSendExpectPacketTimeOut);
        // }
    },



    /*handle all network event*/
    onReceive: function (packet) {
        // if (this.isSendingLastPacket && (packet.Type != c.NETWORK_MAKE_NEW_CONNECTION_SUCCESS)){
        //     this.isSendingLastPacket = false;
        //     Util.removeAnim();
        // }

        if ((packet.Type != -42) && (packet.Type != 46)) {
            logMessage("onReceive: "+packet.toString());
        }

        this.processNextPackage(packet);

        // if (BkGlobal.currentGS == GS.INGAME_GAME) {
        //     if (Util.isSynchEvent(packet.Type)) {
        //         BkLogicManager.getInGameLogic().updateLastEventIndex();
        //     }
        // }
        //
        // if (this.conStatus != CONECTION_STATE.CONNECTION_NORMAL) {
        //     this.conStatus = CONECTION_STATE.CONNECTION_NORMAL;
        // }
        //
        // this.unScheduleMakeNewConnection(false);
        // if (BkGlobal.currentGS == GS.INGAME_GAME){
        //     this.schedulePing();
        // }
        //
        // // add for expect packet
        // if (this.expectPacketType != null){
        //     if (packet.Type == this.expectPacketType){
        //         logMessage("receive expectPacketType-> reset state");
        //         this.unscheduleForExpectPacket();
        //     }
        // }
        //
        // if (!BkLogicManager.isQueueEvent(packet.Type)){
        //     //logMessage("khong la event can queue -> xu ly luon");
        //     this.processNextPackage(packet);
        //     return;
        // }
        //logMessage("queuePackage : ["+packet.Type+"]");
        // this.queuePackage(packet);
    },
    processNextEventInQueue:function(){
        // if (this.qPacket == null){
        //     this.qPacket = [];
        //     this.isProcessing = false;
        // }
        // logMessage("processNextEventInQueue "+ this.qPacket.length);
        // if (this.qPacket.length > 0){
        //     this.lastTimeProcessing = BkTime.GetCurrentTime();
        //     this.isProcessing = true;
        //     var packet = this.qPacket.shift();
        //     logMessage("process Packet with Type: "+packet.Type+" - time: "+this.lastTimeProcessing);
        //     this.processNextPackage(packet);
        // } else {
        //     this.isProcessing = false;
        // }
    },
    clearQueue:function(){
        // if(this.qPacket == null) {
        //     return;
        // }
        // //while(this.qPacket.length > 0) {
        // //    this.qPacket.splice(0,1);
        // //}
        // //this.qPacket.splice(0,this.qPacket.length);
        // this.qPacket = [];
        // this.isProcessing = false;
    },
    forceProcessPacket:function(){
        // if (!BkGlobal.isTabActive){
        //     logMessage("tab inactive -> don't forceProcessPacket");
        //     return;
        // }
        //
        // var currentTime = BkTime.GetCurrentTime();
        // var deltaTime = currentTime - this.lastTimeProcessing;
        // logMessage("deltaTime "+deltaTime);
        // var maxTime = MAX_TIME_PROCESSING_IN_QUEUE;
        // if (BkGlobal.currentGameID == GID.MAU_BINH){
        //     maxTime = MAX_TIME_PROCESSING_IN_QUEUE_MAU_BINH;
        // }
        // if (deltaTime > maxTime){
        //     logMessage("tac queue -> auto call process next event");
        //     //logTracker("ERROR: tac queue -> ReCheck","");
        //     this.processNextEventInQueue();
        // }
    },
    queuePackage:function(packet){
        // if (this.qPacket == null){
        //     this.qPacket = [];
        //     this.isProcessing = false;
        // }
        // this.qPacket.push(packet);
        // logMessage("isProcessing: "+this.isProcessing);
        // var listPacketInQueue="[";
        // for (var i=0;i<this.qPacket.length;i++){
        //     listPacketInQueue+=this.qPacket[i].Type+"]["
        // }
        // logMessage(listPacketInQueue);
        //
        // if (!BkGlobal.isTabActive){
        //     logMessage("tab in active -> only queue event");
        //     if (this.qPacket.length > MAX_EVENT_INQUEUE){
        //         logMessage("tab in active long time -> show popup & close connection");
        //         switchToSceneWithGameState(GS.PREPARE_GAME,false,false);
        //         if (this.connection != null) {
        //             this.connection.closeConnection();
        //         }
        //         var onOKClick = function () {
        //             Util.reloadWebPage();
        //         };
        //         showPopupMessageConfirmEx(BkConstString.STR_NETWORK_IDLE_TIME_OUT
        //             , function () {onOKClick();},true);
        //     }
        //     return;
        // }
        //
        // if (!this.isProcessing){
        //     this.processNextEventInQueue();
        // } else {
        //     this.forceProcessPacket();
        // }
    },
    processNextPackage:function(packet){
        logMessage("processNextPackage : ["+packet.Type+"]");

        switch (packet.Type) {
 //           case c.NETWORK_LOG_IN_SUCCESS:
//                var scene = new mainScene();
//                var timeTrans = 0.3;
//                var trans = null;
//                trans = new cc.TransitionProgressInOut(timeTrans, scene);
//                cc.director.runScene(trans);
//                break;
            case c.NETWORK_RECONNECT_SUCCESS:
            case c.NETWORK_RECONNECT_FAILURE:
            case c.NETWORK_MAKE_NEW_CONNECTION_SUCCESS:
            case c.NETWORK_MAKE_NEW_CONNECTION_FAILED:
            case c.NETWORK_DISCONNECT:
            case c.NETWORK_EXCEPTION:
            case c.NETWORK_SESSION_TERMINATED:
            case c.NETWORK_WRITER_IDLE_TIMEOUT:
            case c.NETWORK_LOCKED_CLIENT:
                this.processConnectionEvent(packet);
                break;
       
            //case c.NETWORK_NOTIFY_ADD_MONEY:
            case c.NETWORK_LOG_IN_FACEBOOK:
            case c.NETWORK_SETUP_FACEBOOK_ACCOUNT:
                //BkLogicManager.getLogic().processNetworkEvent(packet);
                //break;
            case c.NETWORK_DEAL_CARD_RETURN:
            case c.NETWORK_FRIEND_SEARCH_BY_USERNAME:
            case c.NETWORK_JOIN_WEB_GAME_ROOM:
            case c.NETWORK_JOIN_CHAN_GAME:
            case c.NETWORK_GET_GOLD_BOX_REMAIN_TIME:
            case c.NETWORK_GET_GOLD_BOX_REMAIN_TIME_RETURN:
            case c.NETWORK_MOVE_PIECE_RETURN:
            case c.NETWORK_UPDATE_OBSERVER_STATUS:
            case c.NETWORK_CHESS_OFFER_RETURN:
            case c.NETWORK_CONTINUE_GAME_RETURN:
            case c.NETWORK_INFOR_RETURN:
            case c.NETWORK_REAL_TYPE_RETURN:
            case c.NETWORK_SETUP_RULE_RETURN:
            case c.NETWORK_SHOW_U_PUSH:
            case c.NETWORK_SHOW_U_PUSH_RETURN:
            case c.NETWORK_REQUEST_DAILY_TASK_BONUS_RETURN:
            case c.NETWORK_SEND_TOKEN_TO_PHONE:
            case c.NETWORK_VALID_PLAYER_BY_PHONE_CHECK_AND_SEND_TOKEN:
            case c.NETWORK_UPDATE_PHONE_NUMBER:
            case c.NETWORK_SETUP_CHAN_TABLE:
            case c.NETWORK_CHANGE_GA_GOP_PUSH:
            case c.GET_TOP_RICHEST_CHAN_PLAYER:
            case c.NETWORK_NOTIFY_ADD_MONEY:
            case c.UPDATE_PLAYER_NAME:
            case c.NETWORK_TRA_CUA_RETURN:
                if (BkGlobal.currentGS == GS.INGAME_GAME) {
                    if (packet.Type==c.NETWORK_TABLE_INFO_RETURN){
                        BkGlobal.isReceiveSyncEvent = true;
                    }
                    if (!BkGlobal.isReceiveSyncEvent){
                        logMessage("chua nhan dc event sysn -> reject packet");
                        if (BkLogicManager.getInGameLogic().isQueueEvent(packet.Type)){
                            this.processNextEventInQueue();
                        }
                        return;
                    }
                    BkLogicManager.getInGameLogic().processNetworkEvent(packet);
                    break;
                } else {
                    BkLogicManager.getLogic().processNetworkEvent(packet);
                    break;
                }
       
            case c.NETWORK_LOG_IN_FAILURE:
            case c.NETWORK_REGISTER_FAILURE:
            case c.NETWORK_FORGOT_PASSWORD:
            case c.NETWORK_FORGOT_PASSWORD_RETURN:
            case c.NETWORK_WRONG_USERNAME_OR_CLIENT_ID:
            case c.NETWORK_REGISTER_EXCEED_MAX:
            {
                this.conStatus = CONECTION_STATE.CLOSED_CONNECTION;
                BkLogicManager.getLogic().processNetworkEvent(packet);
                break;
            }
       
            case c.NETWORK_LOG_IN_SUCCESS:
            case c.NETWORK_AUTO_FIND_TABLE_NOT_FOUND_RETURN:
            case c.NETWORK_TABLE_JOIN_FAILURE:
            case c.NETWORK_GAME_JOIN_SUCCESS:
            case c.NETWORK_GET_GAME_ROOMS_BY_ROOM_TYPE_RETURN:
            case c.NETWORK_ROOM_JOIN_SUCCESS:
            case c.NETWORK_ROOM_TABLES_UPDATE:
            case c.NETWORK_PROFILE_RETURN:
            case c.NETWORK_MAIN_PROFILE_RETURN:
            case c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN:
            case c.NETWORK_PLAYER_ITEMS_RETURN:
            case c.NETWORK_UPDATE_PASSWORD_FAILED:
            case c.NETWORK_UPDATE_PASSWORD_SUCCESS:
            case c.NETWORK_SELECT_AVATAR_SUCCESS:
            case c.NETWORK_UPDATE_PROFILE_SUCCESS:
            case c.NETWORK_INBOX_MAILS_RETURN:
            case c.NETWORK_OUTBOX_MAILS_RETURN:
            case c.NETWORK_SEND_MAIL_SUCCESS:
            case c.NETWORK_PLAYER_NOT_EXIST:
            case c.NETWORK_MAIL_RETURN:
            case c.NETWORK_GET_ITEM_INFO:
            case c.NETWORK_BUY_ITEM_SUCCESS:
            case c.NETWORK_BUY_ITEM_FAILURE:
            case c.NETWORK_GET_FRIENDS_RETURN:
            case c.NETWORK_ACCEPT_FRIEND_SUCCESS:
            case c.NETWORK_REMOVE_FRIEND_SUCCESS:
            case c.NETWORK_REQUEST_FRIEND_SUCCESS:
            case c.NETWORK_LUCKY_BOX_REQUEST_RETURN:
            case c.NETWORK_CONTENT_PROVIDER_INFO_RETURN:
            case c.NETWORK_CHECK_GOOGLE_IAP:
            case c.NETWORK_NAP_THE_CAO_BANNED:
            case c.NETWORK_NAP_THE_CAO_FAILED:
            case c.NETWORK_NAP_THE_CAO_SUCCESS:
            case c.NETWORK_SERVICE_NAP_THE_BUSY:
            case c.NETWORK_FACEBOOK_INVITE_FRIENDS:
            case c.NETWORK_GET_FACEBOOK_INVITE_FRIENDS:
            case c.NETWORK_UPDATE_PRIVATE_KEY:
            case c.NETWORK_GET_DAILY_TASK_LIST_RETURN:
            case c.NETWORK_JOIN_FRIEND_TABLE_FAILURE:
            case c.NETWORK_GET_CHAMPION_LIST_RETURN:
            case c.NETWORK_GET_TOP_PLAYER_RETURN:
            case c.NETWORK_TOP_U_TO_RETURN:
            case c.NETWORK_GET_TOP_RICHEST_PLAYER_RETURN:
            case c.NETWORK_GAME_LEAVE_SUCCESS:
            case c.NETWORK_TABLE_STATUS_CHANGE:
            case c.NETWORK_TABLE_SIZE_UPDATE_PUSH:
            case c.NETWORK_TABLE_SETTINGS_UPDATE_PUSH:
            case c.NETWORK_RECEIVE_INVITATION:
            case c.NETWORK_TABLE_JOIN_SUCCESS:
            case c.NETWORK_ADMIN_CHANGED_MONEY_RETURN:
            case c.NETWORK_ADD_MONEY_RETURN:
            case c.NETWORK_KDL:
            case c.NETWORK_SEND_MESSAGE_TO_CLIENT:
            case c.NETWORK_ON_HAS_ALLOW_KICK_WAND:
            case c.NETWORK_BET_LOTTE_TICKET:
            case c.NETWORK_SERVER_REQUEST:
            case c.NETWORK_VIP_FUNCTION:
            case c.NETWORK_NOTIFY_PAYMENT_BONUS:
            case c.NETWORK_UPDATE_STATUS:
            case c.NETWORK_CLIENT_SETTING:
            {
                BkLogicManager.getLogic().processNetworkEvent(packet);
                break;
            }
            case c.NETWORK_BET_FOOTBALL_RETURN:
            {
                if(BkGlobal.currentGS == GS.CHOOSE_GAME)
                {
                    BkLogicManager.getLogic().processNetworkEvent(packet);
                    break;
                }
            }
            case c.NETWORK_TABLE_INFO_RETURN:
            case c.NETWORK_TABLE_SYN_RETURN:
            case c.NETWORK_BET_MONEY_OPTIONS:
            case c.NETWORK_BET_MONEY_UPDATE:
            case c.NETWORK_SETUP_TABLE_FAILED:
            case c.NETWORK_TABLE_LEAVE_SUCCESS:
            case c.NETWORK_TABLE_LEAVE_FAILURE:
            case c.NETWORK_TABLE_JOIN_PUSH:
            case c.NETWORK_TABLE_LEAVE_PUSH:
            case c.NETWORK_PLAYER_STATUS_RETURN:
            case c.NETWORK_OVERVIEW_OTHER_PROFILE_RETURN:
            case c.NETWORK_WAITING_PLAYERS_RETURN:
            case c.NETWORK_GET_FRIENDS_TO_INVITE_RETURN:
            case c.NETWORK_TIME_OUT_LEAVE:
            case c.NETWORK_UNABLE_TO_KICK:
            case c.NETWORK_PROTECTED_FROM_UNKICKABLE_WAND:
            case c.NETWORK_KICK_PLAYER_PUSH:
            case c.NETWORK_ERROR_RETURN:
            //case c.NETWORK_GET_GOLD_BOX_REMAIN_TIME:
            case c.NETWORK_GET_GOLD_BOX_REWARD_RETURN:
            //case c.NETWORK_GET_GOLD_BOX_REMAIN_TIME_RETURN:
            case c.NETWORK_PLAYER_MONEY_CHANGE_PUSH:
            case c.NETWORK_PLAYER_HAS_BONUS:
            case c.NETWORK_PLAYER_NEW_LEVEL:
            case c.NETWORK_TABLE_CHAT_RETURN:
            case c.NETWORK_ASSIGN_AS_TABLE_OWNER:
            //case c.NETWORK_RECONNECT_SUCCESS:
            case c.NETWORK_PREPARE_NEW_GAME:
            case c.NETWORK_FINISH_GAME_RETURN:
            case c.NETWORK_DISCARD_PUSH:
            case c.NETWORK_TLMN_THOI_PUSH:
            case c.NETWORK_TLMN_AUTO_WIN_PUSH:
            case c.NETWORK_LEAVE_DURING_GAME:
            case c.NETWORK_DISCARD_SUCCESS:
            case c.NETWORK_BAO_XAM_RETURN:
            //case c.NETWORK_TABLE_CHAT_RETURN:
            case c.NETWORK_PICK_CARD_RETURN:
            case c.NETWORK_BET_BACAY_RETURN:
            case c.NETWORK_RAISE_RETURN:
            case c.NETWORK_SEND_CARD_RETURN:
            case c.NETWORK_TAKE_CARD_PUSH:
            //case c.NETWORK_PICK_CARD_RETURN:
            case c.NETWORK_PICK_CARD_PUSH:
            case c.NETWORK_SHOW_PHOM_RETURN:
            //case c.NETWORK_SHOW_U_PUSH:
            case c.NETWORK_TLMN_SLASH:
            case c.NETWORK_FORFEIT_RETURN:
            case c.NETWORK_SHOW_U:
            case c.NETWORK_XUONG_CUOC_RETURN:
            case c.NETWORK_BOC_CAI:
            //case c.NETWORK_CHANGE_GA_GOP_PUSH:
            case c.UPDATE_PLAYER_MODEL:
            case c.NETWORK_QUAY_NOTIFY:
       
            {
                if (BkGlobal.currentGS != GS.INGAME_GAME) {
                    logMessage("Not process event because not correct zone " + BkGlobal.currentGS);
                    if (BkLogicManager.getInGameLogic().isQueueEvent(packet.Type)){
                        this.processNextEventInQueue();
                    }
                    return;
                }
                if (packet.Type==c.NETWORK_TABLE_INFO_RETURN){
                    BkGlobal.isReceiveSyncEvent = true;
                }
                if (!BkGlobal.isReceiveSyncEvent){
                    logMessage("chua nhan dc event sysn -> reject packet & processNextEventInQueue");
                    if (BkLogicManager.getInGameLogic().isQueueEvent(packet.Type)){
                        this.processNextEventInQueue();
                    }
                    return;
                }
       
                BkLogicManager.getInGameLogic().processNetworkEvent(packet);
                break;
            }
            default:
            {
                if ((packet.Type != -42) && (packet.Type != 46)) {
                    logMessage("BkConnectionManager not process packet with type: " + packet.Type);
                }
            }
        }
    }
};