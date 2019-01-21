/**
 * Created by bs on 08/10/2015.
 */

var IS_VIP_ENABLE = false;

BkCommonLogic = BkBaseLogic.extend({
    // for choosetable
    STTCurrentRoom: -1,
    lobbyData: null,
    tableData:null,
    crGame: null,
    oUser: null,
    dropWordWeekIndex: 0,
    updateprivateKey: null,
    inviteFriendLists: null,
    promotionInfo: null,
    lastTableBetMoney: null,
    kickReasonInGame: null,
    isDisableReceiveInvite: false,
    isDeleteLoginState: false,
    isInputPass: false,
    isLogged: false,
    isLogout:false,
    hasDailyBonus: false,
    isDoneLoadRes:false,
    dailyTaskList:null,
    ctor: function () {
        this._super();
        isVipEnable = true;
        //var isVipEnable = cc.game.config.app.isVipEnable;
        if (isVipEnable == 0){
            IS_VIP_ENABLE = false;
        } else {
            IS_VIP_ENABLE = true;
        }
        logMessage("IS_VIP_ENABLE "+IS_VIP_ENABLE);
        if (!this.promotionInfo) {
            this.promotionInfo = new BkPromotionInfo();
        }
    },

    // Chan Van Van functions
    doJoinChanGameRoom: function(roomTypeId,roomId){
        Util.showAnim();
        var packet = new BkPacket();
        packet.createPacketJoinChanGameRoom(roomTypeId,roomId);
        BkConnectionManager.send(packet);
    },

    processJoinChanGameReturn: function(packet){
        logMessage("onJoinChanGameRoom");
        Util.removeAnim();
        var currRoomID = packet.Buffer.readByte();
        var numberRoom = packet.Buffer.readByte();
        logMessage("currentRoomID: "+currRoomID+" numberRoom: " + numberRoom);

        BkGlobal.currentRoomID = currRoomID;

        var i;
        var rDT;
        var listRoom = [];
        for (i = 0; i < numberRoom; i++) {
            rDT = new BkRoomData;
            rDT.percent = packet.Buffer.readByte();
            rDT.roomID = packet.Buffer.readByte();
            logMessage("percent: " + rDT.percent + " roomID: " + rDT.roomID);
            listRoom.push(rDT);
        }

        // swap current room -> 0
        for (i = 0; i < numberRoom; i++) {
            rDT = listRoom[i];
            if (rDT.roomID == currRoomID) {
                var tgRoomDT = listRoom[0];
                listRoom[0] = rDT;
                listRoom[i] = tgRoomDT;
            }
        }

        var maxTable = packet.Buffer.readByte();
        logMessage("maxTable: " + maxTable);
        maxTable = Math.abs(maxTable);

        var listTable = [];
        while (packet.Buffer.isReadable()) {
            var tb = new BkTableData;
            tb.tableID = packet.Buffer.readByte();
            tb.betMoney = packet.Buffer.readInt();
            var tableInfo = packet.Buffer.readByte();
            var luatUGaInfo = packet.Buffer.readByte();

            tb.HasGagop = (luatUGaInfo & 1);
            tb.isBaicMode = (((luatUGaInfo & 4)>>2) == 0);
            tb.is411 = (((luatUGaInfo & 8)>>3) == 1);
            // logMessage("luatUGaInfo "+luatUGaInfo+" "+" "+((luatUGaInfo & 8)>>3)+((luatUGaInfo & 4)>>2));
            // logMessage("tb.isBaicMode "+tb.isBaicMode+"  tb.is411 "+ tb.is411);
            // calculator NumberPlayers,MaxNumberPlayers,HasPassword,IsGameInProgress from tableInfo
            // NumberPlayers =  3 bit cuoi tableInfo = tableInfo & 00000111
            tb.numberPlayer = (tableInfo & 7);
            // MaxNumberPlayers = 3 bit giua tableInfo = (tableInfo & 00111000)>>3
            tb.maxNumberPlayer = (tableInfo & 56) >> 3;
            // HasPassword = bit 6 cua tableInfo = (tableInfo & 01000000)>>6
            tb.hasPassword = (tableInfo & 64) >> 6;
            // IsGameInProgress = bit 7 cua tableInfo = (tableInfo & 10000000)>>7
            tb.isInGameProgress = (tableInfo & 128) >> 7;
            //logMessage(tb.toString());
            listTable.push(tb);
        }

        // set data cho logic
        if ((this.STTCurrentRoom == -1)||(this.STTCurrentRoom >= numberRoom * 3)){
            this.STTCurrentRoom = 0;
        } else {
            var iSTT = Math.floor(this.STTCurrentRoom / 3);
            logMessage("iSTT: " + iSTT + " STTCurrentRoom: " + this.STTCurrentRoom);
            var iSTTroomData = listRoom[iSTT];
            logMessage("iSTT roomID: " + iSTTroomData.roomID + " currRoomID: " + currRoomID);
            if (iSTTroomData.roomID != currRoomID){
                // swap in list room
                var posCurRoom;
                var posRoomData;
                for (i=0; i < numberRoom; i++){
                    var iRdt = listRoom[i];
                    if (iRdt.roomID == currRoomID){
                        posCurRoom = i;
                        posRoomData = iRdt;
                        break;
                    }
                }
                listRoom[iSTT] = posRoomData;
                listRoom[posCurRoom] = iSTTroomData;
            }
        }

        //listTable.sort(function(item1, item2) {
        //    return item2.betMoney - item1.betMoney;
        //});

        if (this.lobbyData == null) {
            this.lobbyData = new BkLobbyRoomData;
        }

        // set data cho logic
        this.lobbyData.maxTableInRoom = maxTable;
        this.lobbyData.listRoom = listRoom;
        this.lobbyData.devideListRoom();
        this.currentRoomID = currRoomID;

        // them cac ban trong vao listTable
        var listStatusTable = [];
        for (i = 0; i < maxTable; i++) {
            listStatusTable.push(false);
        }
        for (var i1 = 0; i1 < listTable.length; i1++) {
            var tdt = listTable[i1];
            listStatusTable[tdt.tableID] = true;
        }

        for (var j = 0; j < maxTable; j++) {
            var bl = listStatusTable[j];
            if (!bl) {
                var tdt1 = new BkTableData;
                tdt1.tableID = j;
                listTable.push(tdt1);
            }
        }

        this.lobbyData.listTable = listTable;
        this.lobbyData.devideListTable();

        // switch scene and update UI
        logMessage("switchToSceneWithGameState(GS.CHOOSE_TABLE)");
        if (BkGlobal.currentGS != GS.CHOOSE_TABLE){
            this.STTCurrentRoom = 0;
            switchToSceneWithGameState(GS.CHOOSE_TABLE);
        } else {
            logMessage("BkGlobal.currentGS != GS.CHOOSE_TABLE | currentGS: "+BkGlobal.currentGS);
            var crScene = getCurrentScene();
            if (crScene != null){
                if (crScene instanceof  VvLobby){
                    crScene.showGuiLobby();
                } else {
                    logMessage("crScene not instanceof  BkLobby -> error recheck!!!!!!!!!!!")
                }
            } else {
                logMessage("crScene == null")
            }
            //getCurrentScene().showGuiLobby();
        }
        // Util.setClientSetting(key.lastGameChoose,BkGlobal.currentGameID);
    },

    getGui: function () {
        return getCurrentScene();
    },
    doleaveGame: function () {
        Util.showAnim();
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GAME_LEAVE);
        BkConnectionManager.send(packet);
    },
    doJoinGame: function (gID) {
        this.crGame = gID;
        var packet = new BkPacket();
        packet.CreateJoinGame(gID);
        BkConnectionManager.send(packet);
    },
    ProcessGetRoomByRoomType: function (roomType) {
        var packet = new BkPacket();
        packet.CreatePacketWithTypeAndByteData(c.NETWORK_GET_GAME_ROOMS_BY_ROOM_TYPE, roomType);
        BkConnectionManager.send(packet);
    },
    ProcessGetRoomData: function (packet) {
        var listRoom = [];
        var numberRoom = packet.Buffer.readByte();

        var i;
        var roomID0;
        logMessage("roomSize: " + numberRoom);
        if (numberRoom > 0) {
            for (i = 0; i < numberRoom; i++) {
                // var rDT;
                var percent = packet.Buffer.readByte();
                var roomID = packet.Buffer.readByte();
            }
        }
        this.ProcessJoinRoom(1);
    },
    ProcessJoinRoom: function (roomID) {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_ROOM_JOIN, roomID);
        BkConnectionManager.send(Packet);
    },
    ProcessOnJoinRoomSuccess: function (packet) {
        var currentGameID = packet.Buffer.readByte();
        var currentRoomID = packet.Buffer.readByte();
        this.ProcessGetListTable();
    },
    ProcessGetListTable: function () {
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_GET_TABLES);
        BkConnectionManager.send(Packet);
    },
    ProcessOnRoomTablesUpdate: function (packet) {
        var maxTablesInRoom = packet.Buffer.readByte();
        logMessage("goes here" + maxTablesInRoom);
        this.doRequestJoinTable(1);

    },
    doRequestJoinTable: function (tableId, pass) {
        Util.showAnim();
        if (tableId > FAKE_TABLE_ID){
            tableId -= FAKE_TABLE_ID;
        }
        var Packet = new BkPacket();
        Packet.CreatTableJoinPacket(tableId, pass);
        BkConnectionManager.send(Packet);
    },
    ProcessLeaveRoom: function (leaveFromIngame) {
        this.isleaveFromIngame = leaveFromIngame;
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_ROOM_LEAVE);
        BkConnectionManager.send(Packet);
    },
    doLoginGame: function (userName, pass, clientID) {
        if(userName == undefined || pass == undefined){
            Util.reloadWebPage();
            return;
        }
        if (BkGlobal.UserInfo == null) {
            BkGlobal.UserInfo = new BkUserData();
        }
        var packet = new BkPacket();
        packet.createLoginPacket(userName, pass, clientID);
        BkConnectionManager.send(packet);
        //postUserTracker(2, userName, bk.cpid, cc.bkClientId,"", "doLoginGame");
    },
    onLoginSuccess: function (packet) {
        logMessage("LOG_IN_SUCCESS");
       // processLoginRegistSuccessEx();
        BkConnectionManager.conStatus = CONECTION_STATE.CONNECTION_NORMAL;
        this.isLogged = true;

        // parse data login
        var dailyBonus = packet.Buffer.readByte();
        this.hasDailyBonus = dailyBonus === 1;
        var bonusType = packet.Buffer.readByte();
        BkGlobal.addMoneyBonusType = bonusType;
        var money = packet.Buffer.readInt();
        var hasKick = packet.Buffer.readByte();
        var name = packet.Buffer.readString();
        var password = packet.Buffer.readString();
        var clientDevice = 0; //0 : web - 1:Mobile
        var isInGameCheck = packet.Buffer.readByte();
        if (BkGlobal.UserInfo == null) {
            BkGlobal.UserInfo = new BkUserData();
        }
        BkGlobal.UserInfo.setMoney(money);
        BkGlobal.UserInfo.setHasAllowKickWand(hasKick);
        BkGlobal.UserInfo.setUserName(name);
        logMessage("name: "+name+" BkGlobal.UserInfo.userName: "+BkGlobal.UserInfo.getUserName());
        BkGlobal.UserInfo.clientID = cc.bkClientId;
        BkGlobal.UserInfo.password = password;
        BkLogicManager.setGameLogic(null);
        SessionManager.isFirstLoginInSession = true;
		SessionManager.cvvdailyBonus = dailyBonus;
		SessionManager.isInsideVietnam = isInVN();
		
        logMessage("dailyBonus " + dailyBonus + " bonusType " + bonusType
            + " money " + money + " hasKick " + hasKick + " name: " + name);

//        var userSetting = {'username': name, 'password': password, 'isLoginFacebook': BkGlobal.isLoginFacebook};
        //For auto login
//        if(cc.rememberPassword) {
//            Util.setClientSetting(key.userLoginInfo, JSON.stringify(userSetting));
//        }else
//        {
//            //Remove remember password if not used
//            Util.removeClientSetting(key.userLoginInfo);
//        }
//        Util.setClientSession(key.userLoginInfo, JSON.stringify(userSetting));
//        if(bk.isDesktopApp)
//        {
//            BkUserClientSettings.updateListUserLoggedIn(name,password);
//        }
        var self = this;
        if (isInGameCheck == 1) 
        {
            BkGlobal.currentGameID = packet.Buffer.readByte();
            BkGlobal.currentRoomID = packet.Buffer.readByte();
            BkGlobal.currentTableID = packet.Buffer.readByte();

            // var cb = function () {
            //     processLogout(true);
            // };
            //if (BkGlobal.currentGameID == GID.CHAN) {
            //    showPopupMessageConfirmEx("Hiện tại chưa có game Chắn Bigkool trên máy tính, hãy truy cập từ di động của bạn để chơi tiếp!", cb);
            //    return;
            //}
            var fcb = function(){
                //changeGameBg(BkGlobal.currentGameID);

                self.readMoreDataInLoginPacket(packet);
                // player is playing -> switch to ingame scene
                logMessage("is ingame process");
                BkGlobal.isReceiveSyncEvent = false;

                // Xac dinh xem dang online game nao de load game tuong ung
                //switchToSceneWithGameState(GS.INGAME_GAME, false, false);
                //BkLogicManager.initGameLogic();

            };
           // this.processLoadBaseRes(fcb);
            return;
        } else 
        {
        	if(packet.Buffer.isReadable())
                self.readMoreDataInLoginPacket(packet);
        	var versionCompare = compareVersion(APP_VERSION,ServerSettings.SERVER_VERSION,ServerSettings.MIN_REQUIRED_VERSION);
        	if(versionCompare == VersionCompareResult.MinorUpdate)
        	{
        		logMessage("Đã có phiên bản mới hơn, hãy cập nhật để có trải nghiệm tốt hơn.");
        	}else if(versionCompare == VersionCompareResult.MajorUpdate)
        	{
        		logMessage("Phiên bản hiện tại đã quá cũ, bạn cần cập nhật!");
        	}
            //this.processLoadBaseRes();
          var scene = new mainScene();
          var timeTrans = 0.3;
          var trans = null;
          trans = new cc.TransitionProgressInOut(timeTrans, scene);
          cc.director.runScene(trans);
        }
//        if(packet.Buffer.isReadable())
//            self.readMoreDataInLoginPacket(packet);
        //postRegUpdUserState();

        /*
        if (BkGlobal.isNewRegistraion && BkGlobal.clientDeviceCheck == 0  && BkGlobal.isPhoneNumberUpdatable) {
            postUserTracker(3, name, bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, " NewRegistraion :" + money + " isPhoneUpdatable " + isPhoneNumberUpdatable);
        }else{
            postUserTracker(2, name, bk.cpid, cc.bkClientId, BkFacebookMgr.facebookID, " Money: " + money + " dailyBonusFlg " + dailyBonus + " isPhoneUpdatable " + isPhoneNumberUpdatable);
        }
        */

//        if (BkGlobal.currentGS != GS.CHOOSE_GAME) {
//            switchToSceneWithGameState(GS.CHOOSE_GAME);
//        } else {
//            switchToSceneWithGameState(GS.CHOOSE_GAME,false,false);
//        }
    },
    readMoreDataInLoginPacket:function (packet) {
        var isRenameAble = (packet.Buffer.readByte() == 1);
        var isPhoneNumberUpdateAble = (packet.Buffer.readByte() == 1);
        //isPhoneNumberUpdateAble = true;
        var isUpdatePassAble = (packet.Buffer.readByte() == 1);
        BkGlobal.UserInfo.VipLevel = -1;
        if (IS_VIP_ENABLE){
            if (packet.Buffer.isReadable()){
                BkGlobal.UserInfo.VipLevel = packet.Buffer.readByte();
            }
        }
        logMessage("readMoreDataInLoginPacket: "+isRenameAble+" - "+isPhoneNumberUpdateAble+" - "+isUpdatePassAble+" - "+BkGlobal.UserInfo.VipLevel);
        //Get update phone flag
        // var isPhoneNumberUpdatable = packet.Buffer.readByte() == 0;
        // BkGlobal.clientDeviceCheck = packet.Buffer.readByte();
        BkGlobal.isFbRenameable = isRenameAble;
        BkGlobal.isFbCreateablePass = isUpdatePassAble;
        BkGlobal.isPhoneNumberUpdatable = isPhoneNumberUpdateAble;
       // BkUserClientSettings.updateUserSettingLogin(isPhoneNumberUpdateAble);
    },
    processAfterLogin:function(){
        // khong get profile neu o trong ban game
        this.DoGetMainProfile();
        BkFacebookMgr.doFbLCheckSetup();
        //this.checktoShowPromotion();
    },
    getDailyTaskList:function()
    {
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GET_DAILY_TASK_LIST);
        BkConnectionManager.send(packet);
    },
    DoGetMainProfile: function () {
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_GET_MAIN_PROFILE);
        BkConnectionManager.send(Packet);
    },
    DoGetProfilePlayer: function (name) {
        logMessage("DoGetProfilePlayer " + name);
        this.oUser = new BkUserData();
        this.oUser.userName = name;
        var Packet = new BkPacket();
        Packet.CreateGetProfilePacket(name, c.NETWORK_GET_PROFILE);
        BkConnectionManager.send(Packet);
    },
    onMainProfileReturn: function (packet) {
        var numberOfUnreadMails = 0;
        var avatarId = 0;
        var numberOfUnreadEvent = 0;
        var dropWordWeekIndex = 0;

        if (packet.Buffer.isReadable()) {
            numberOfUnreadMails = packet.Buffer.readByte();
            avatarId = packet.Buffer.readByte();

            if (packet.Buffer.isReadable()) {
                numberOfUnreadEvent = packet.Buffer.readInt();
            }
            if (packet.Buffer.isReadable()) {
                dropWordWeekIndex = packet.Buffer.readByte();
            }
        }
        BkGlobal.UserInfo.setNumberOfUnreadMails(numberOfUnreadMails);
        BkGlobal.UserInfo.setnumberOfUnreadEvent(numberOfUnreadEvent);
        BkGlobal.UserInfo.setDropWordWeekIndex(dropWordWeekIndex);
        BkGlobal.UserInfo.setAvatarId(avatarId);
        this.dropWordWeekIndex = dropWordWeekIndex;
        this.processUpdateProfileUI();

        logMessage("numberOfUnreadMails: " + numberOfUnreadMails + " avatarId: " + avatarId + " numberOfUnreadEvent: "
            + numberOfUnreadEvent + " dropWordWeekIndex: " + dropWordWeekIndex);
        this.DoGetProfilePlayer(BkGlobal.UserInfo.getUserName());
    },
    onProfileReturn: function (packet) {
        this.oUser.lvUser = packet.Buffer.readInt();
        this.oUser.isFriend = packet.Buffer.readByte();
        this.oUser.playerMoney = packet.Buffer.readInt();
        this.oUser.avatarID = packet.Buffer.readByte();
        this.oUser.fullname = packet.Buffer.readString();
        this.oUser.gender = packet.Buffer.readByte();
        this.oUser.email = packet.Buffer.readString();
        this.oUser.birthDate = packet.Buffer.readLong();
        this.oUser.homeTown = packet.Buffer.readString();
        this.oUser.status = packet.Buffer.readString();
        var countCuoc = packet.Buffer.readByte();
        var myArrayCuoc = [];
        for (var i=0; i<countCuoc; i++){
            myArrayCuoc.push(packet.Buffer.readByte());
        }
        this.oUser.stringCuocU = CXuongCuocWindow.getStringXuongCuoc(myArrayCuoc);

        if(packet.Buffer.isReadable()){
            var tongDiem = packet.Buffer.readInt();
        }

        if(IS_VIP_ENABLE && packet.Buffer.isReadable()){
            this.oUser.VipLevel = packet.Buffer.readByte();
        }

        if (this.oUser.userName == BkGlobal.UserInfo.getUserName()) {
            BkGlobal.UserInfo.setAvatarId(this.oUser.avatarID);
            BkGlobal.UserInfo.setMoney(this.oUser.playerMoney);
            BkGlobal.UserInfo.setLevel(this.oUser.lvUser);
            BkGlobal.UserInfo.setCuocU(this.oUser.stringCuocU);
            this.DoGetPlayerItem(this.oUser.userName, AT.TYPE_AVATAR);
        }

        logMessage("name " + this.oUser.userName + " money: " + this.oUser.playerMoney + "- avID: " + this.oUser.avatarID + "- fullname: "
            + this.oUser.fullname + "- gender: " + this.oUser.gender + "- email:" + this.oUser.email + "- bird: "
            + this.oUser.birthDate + "- address: " + this.oUser.homeTown + "- status: " + this.oUser.status);

        this.DoGetAchievementPlayer(this.oUser.userName);
        this.pushOnLoadComplete(this.oUser, packet.Type);
        this.processUpdateProfileUI();
    },
    onLoadComplete: function(o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        console.log(tag);
        console.log(o);
        switch (tag) {
            case c.NETWORK_LOG_IN_SUCCESS:
                break;
            case c.NETWORK_REGISTER_FAILURE:
                BkGlobal.isAutoCreateAccount = false;
                break;
            case c.NETWORK_REGISTER_EXCEED_MAX:
                BkGlobal.isAutoCreateAccount = false;
                break;
        }
        Util.removeAnim();
    },
    processUpdateProfileUI: function () {
        if (((this.getGui() instanceof VVChooseGame)) || (this.getGui() instanceof VvLobby)) {
            this.getGui().updateAvatar(BkGlobal.UserInfo);
        } else {
            logMessage("gui not instanceof BkChooseGame and BkLobby-> don't process update UI user profile");
        }
    },
    DoGetAchievementPlayer: function (userNa) {
        var Packet = new BkPacket();
        Packet.CreateGetProfilePacket(userNa, c.NETWORK_GET_PLAYER_ACHIEVEMENT_NEW);
        BkConnectionManager.send(Packet);
    },
    onPlayerAchievementReturn: function (packet) {
        // parse data
        if(this.oUser == undefined){
            logMessage("this.oUser == undefined");
            this.oUser = new BkUserData();
        }
        while (packet.Buffer.isReadable()) {
            logMessage("parse data player achievement "+this.oUser.getUserName());
            this.oUser.gameId = packet.Buffer.readByte();
            this.oUser.winCount = packet.Buffer.readInt();
            this.oUser.gameCount = packet.Buffer.readInt();
            this.oUser.moneyEarn = packet.Buffer.readInt();
            this.oUser.bestHand = packet.Buffer.readInt();
            this.oUser.newLvPercent = packet.Buffer.readInt();
            this.oUser.playerLevel = packet.Buffer.readInt();
            var rank = packet.Buffer.readInt();
            if (rank != 0x7FFFFFFF) {
                rank += 1;
            }
            this.oUser.rank = rank;
            this.oUser.winCountRecord = packet.Buffer.readInt();
            this.oUser.firstSpecialCountRecord = packet.Buffer.readInt();
            this.oUser.secondSpecialCountRecord = packet.Buffer.readInt();

            logMessage("this.oUser.winCount "+this.oUser.winCount);
        }

        this.pushOnLoadComplete(this.oUser, packet.Type);

     /*   if (this.oUser.userName == BkGlobal.UserInfo.getUserName()) {
         this.DoGetPlayerItem(this.oUser.userName, 0);
         }*/
    },
    DoGetPlayerItem: function (userNa, itemType, oU) {
        var Packet = new BkPacket();
        Packet.CreateGetProfilePacket(userNa, c.NETWORK_GET_PLAYER_ITEMS, itemType);
        BkConnectionManager.send(Packet);
        if (oU != undefined) {
            this.oUser = oU;
        }
    },
    onPlayerItemReturn: function (packet) {
        // parse data
        var listItem = [];
        var b1 = packet.Buffer.readByte();

        while (packet.Buffer.isReadable()) {
            var itemDetail = new BkItemDetail();
            itemDetail.itemType = b1;
            itemDetail.itemID = packet.Buffer.readByte();
            itemDetail.RemainingDate = packet.Buffer.readLong();
            logMessage("b2: " + itemDetail.itemID + " RemainingDate:" + itemDetail.RemainingDate);
            listItem.push(itemDetail);
        }

        if (b1 == AT.TYPE_AVATAR) {
            this.oUser.listAvatar = listItem;
            this.oUser.addFreeAvatar();
            if (this.oUser.userName == BkGlobal.UserInfo.getUserName()) {
                BkGlobal.UserInfo.listAvatar = listItem;
                if (BkGlobal.UserInfo.listVatPham == null) {
                    this.DoGetPlayerItem(this.oUser.userName, AT.TYPE_VATPHAM);
                }
            }
        } else if (b1 == AT.TYPE_VATPHAM) {
            this.oUser.listVatPham = listItem;
            if (this.oUser.userName == BkGlobal.UserInfo.getUserName()) {
                BkGlobal.UserInfo.listVatPham = listItem;
                if (BkGlobal.UserInfo.listBaoBoi == null) {
                    this.DoGetPlayerItem(this.oUser.userName, AT.TYPE_BAOBOI);
                }
            }
        } else if (b1 == AT.TYPE_BAOBOI) {
            this.oUser.listBaoBoi = listItem;
            if (this.oUser.userName == BkGlobal.UserInfo.getUserName()) {
                BkGlobal.UserInfo.listBaoBoi = listItem;
                var isHasAllowKickWand = 0;
                var isHasX2 = 0;
                var isHasX5 = 0;
                var isHasX10 = 0;
                for (var i = 0; i < listItem.length; i++) {
                    var iItemDT = listItem[i];
                    if (iItemDT.itemID == 26) {
                        isHasAllowKickWand = 1;
                    }
                    if (iItemDT.itemID == 33) {
                        isHasX2 = 1;
                    }
                    if (iItemDT.itemID == 34) {
                        isHasX5 = 1;
                    }
                    if (iItemDT.itemID == 35) {
                        isHasX10 = 1;
                    }
                }
                BkGlobal.UserInfo.setHasAllowKickWand(isHasAllowKickWand);
                BkGlobal.UserInfo.setHasX2BetMoney(isHasX2);
                BkGlobal.UserInfo.setHasX5BetMoney(isHasX5);
                BkGlobal.UserInfo.setHasX10BetMoney(isHasX10);
            }
        }

        if (this.onLC && this.onLC.onLoadComplete) {
            //if (this.oUser.userName != BkGlobal.UserInfo.getUserName()) {
            //    this.onLC.onLoadComplete(listItem, packet.Type);
            //} else {
            //    if (b1 == AT.TYPE_AVATAR) {
            //        this.onLC.onLoadComplete(listItem, packet.Type);
            //    }
            //}
            this.onLC.onLoadComplete(listItem, packet.Type);
        }

        //TODO: implements promote buy item later...
    },
    doUpdatePassword: function (oldPass, newPass) {
        var packet = new BkPacket();
        packet.CreatePacketUpdatePassword(oldPass, newPass);
        BkConnectionManager.send(packet);
    },
    processGetFriendsListReturn: function (packet) {
        var o = {friendList: [], invitationList: []};
        this.getFriendsListReturn(packet, o);

        this.pushOnLoadComplete(o, packet.Type);
    },

    processFriendsListReturnState: function (packet) {
        while (packet.Buffer.isReadable()) {
            var playerName = packet.Buffer.readString();
        }
        this.pushOnLoadComplete(playerName, packet.Type);
    },

    getFriendsListReturn: function (packet, o) {
        var friendList = o.friendList;
        var invitationList = o.invitationList;
        var isOnline = 0;
        var isProspectFriend = 0;
        var playerMoney = 0;
        var playerName = "";
        var avatarId = 0;
        var gameId = 0;
        var vipLevel = 0;

        while (packet.Buffer.isReadable()) {
            isOnline = packet.Buffer.readByte() == 1;
            isProspectFriend = packet.Buffer.readByte();
            playerMoney = packet.Buffer.readInt();
            playerName = packet.Buffer.readString();
            avatarId = packet.Buffer.readByte();
            gameId = packet.Buffer.readByte();
            if(IS_VIP_ENABLE)
            {
                vipLevel = packet.Buffer.readByte();
            }
            var friend = new BkUserData();
            friend.setOnlineStatus(isOnline);
            friend.setMoney(playerMoney);
            friend.setUserName(playerName);
            friend.setAvatarId(avatarId);
            friend.setGameId(gameId);
            friend.VipLevel = vipLevel;
            friend.setIsFriend(!isProspectFriend);
            if (isProspectFriend == 1) {
                invitationList.push(friend);
            }
            else {
                friendList.push(friend);
            }
        }
    },

    processSearchFriendReturn: function (packet) {
        var friendList = [];
        packet.ProcessSearchFriendReturn(friendList);

        this.pushOnLoadComplete(friendList, packet.Type);
    },
    processJoinFriendTableFailure: function (packet) {
        var o = {isFriendOnline: -1, gameID: -1};
        packet.GetJoinFriendTableFailureReturn(o);
        if (o.isFriendOnline == 0 || o.gameId == -1) {
            showToastMessage(BkConstString.STR_TABLE_FRIEND_EXIT, cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2, null, 220);
        } else {
            showToastMessage("Không thể chơi cùng, xin hãy chọn bàn khác.", cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2, null, 250);
        }
    },
    processLuckyBoxRequestReturn: function (packet) {
        var o = {luckyResult: 0, bonus: 0};
        o.luckyResult = packet.Buffer.readByte();
        o.bonus = packet.Buffer.readInt();

        if (o.bonus > 0) {
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + o.bonus);
            //gui.updateUserInfoSprite(CGlobal.UserInfo);
            //getCurrentScene().updateAvatar(BkGlobal.UserInfo);
            this.processUpdateProfileUI();
        }
        this.pushOnLoadComplete(o, packet.Type);
    },
    getFaceBookInvitedFriends: function (userID,data) {
        if(userID == undefined || data == undefined )
        {
            return;
        }
        Util.showAnim();
        var packet = new BkPacket();
        packet.CreatePacketFbInviteFriends(userID,data);
        BkConnectionManager.send(packet);
    },
    processFacebookInviteFriendBonusReturn: function (packet) {
        var numberOfSuccessInvites = packet.Buffer.readInt();

        if (numberOfSuccessInvites > 0)
        {
            if (BkGlobal.currentGS == GS.INGAME_GAME) {
                var myClientState = BkLogicManager.getInGameLogic().getMyClientState();
                if (myClientState != null){
                    BkLogicManager.getInGameLogic().increaseCash(myClientState, numberOfSuccessInvites * Util.getFriendCost(), "");
                }
            } else {
                var currentMoney = BkGlobal.UserInfo.getMoney() + numberOfSuccessInvites * Util.getFriendCost();
                BkGlobal.UserInfo.setMoney(currentMoney);
                this.processUpdateProfileUI();
            }
            this.processSuccessInvitation(numberOfSuccessInvites);
        }
        else {
            showToastMessage("Bạn đã nhận thưởng cho lời mời này rồi", 300, 300);
        }

        if(packet.Buffer.isReadable()){
            var canInviteMore = (packet.Buffer.readByte() == 0);
            this.pushOnLoadComplete(canInviteMore,packet.Type);
        }
    },
    processFacebookInvitedListReturn: function (packet) {
        var invitedIDs = packet.ProcessInvitedListReturn();
        if(invitedIDs != null)
        {
            for(var i = 0; i < invitedIDs.length; i++)
            {
                if(invitedIDs[i] == 0)
                {
                        if(BkFacebookMgr.invitableList[i] != undefined)
                        {
                            BkFacebookMgr.invitableList[i].id = "";
                        }
                }
            }
        }else
        {
            return;
        }
        // hiển thị những thằng có thể mời ra windows
        var invitedList = [];
        for(var i = BkFacebookMgr.invitableList.length -1; i >= 0  ; i-- )
        {
            if(BkFacebookMgr.invitableList[i].id == "")
            {
                invitedList.push(BkFacebookMgr.invitableList[i].name);
                BkFacebookMgr.invitableList.splice(i,1);
            }
        }
        if(invitedList.length > 0)
        {
            BkUserClientSettings.updateListFBInvited(BkFacebookMgr.App._userInfo.userID,invitedList); // cached result to used later
        }
        //Util.removeAnim();
        if(BkFacebookMgr.invitableList.length > 0)
        {
                BkFacebookMgr.onGetInvitableListFinished(); // tạo cửa sổ window lần đầu
                this.pushOnLoadComplete(BkFacebookMgr.invitableList, packet.Type); // vẽ lên UI
        }
    },
    sendInvitedListToServer: function (userID, friendIds,fullName) {
        if (friendIds == undefined || friendIds == null || friendIds.length == 0 || fullName == undefined || fullName.length == 0) {
            return;
        }
        var packet = new BkPacket();
        packet.createFBInvitedListPacket(userID, friendIds, this.updateprivateKey,fullName);
        BkConnectionManager.send(packet);
    },

    savePrivateKey: function (packet) {
        this.updateprivateKey = packet.Buffer.readByte();
    },
    processSuccessInvitation: function (numberOfSuccessInvites) {
        showToastMessage("Bạn được cộng thêm " + numberOfSuccessInvites * Util.getFriendCost() + " " + BkConstString.getGameCoinStr() + " vào tài khoản", cc.winSize.width / 2, cc.winSize.height / 2);
    },
    showPromotionAtChooseGame:function(taskList)
    {
      var pWD = new BkPromotionWd(taskList);
      pWD.showWithParent();
    },
    getTaskCompletedCount:function(taskList)
    {
        var count = 0;
        if(taskList == null || taskList.length == 0)
        {
            return 0;
        }
        for(var i = 0; i < taskList.length; i++)
        {
            var taski = taskList[i];
            if(taski.targetAmount == taski.currentAmount && !taski.isGetBonus)
            {
                count++;
            }
        }
        return count;
    },
    showPromotion: function (strPromotion) {
        var self = this;
        if (strPromotion != "") {

            var onOKclick = function () {
                if (self.promotionInfo.isShowNapTien) {
                    var payment = new VvPaymentWindow();
                    payment.showWithParent();
                    logMessage("initPaymentWD");
                }
                else if (self.promotionInfo.isShowFaceBookInviteFB) {
                    BkLogicManager.getLogic().onClickInviteFBFriend();
                }
                else if (self.promotionInfo.isShowRegisterPhone) {
                    var regPhoneWd = new VvRegisterPhoneNumberWindow();
                    regPhoneWd.showWithParent();
                    logMessage("initRegisterPhoneNumberWD");
                }
            };
            var onHideclick = function () {
                // will not show popup if user has rejected 3 times.
                if (self.promotionInfo.isShowNapTien) {
                    self.promotionInfo.suggestNapTienCount++;
                }
                else if (self.promotionInfo.isShowFaceBookInviteFB) {
                    self.promotionInfo.suggestInviteFriendFBCount++;
                }
                else if (self.promotionInfo.isShowRegisterPhone) {
                    self.promotionInfo.suggestRegisterPhoneCount++;
                }
            };

            showPopupConfirmWith(strPromotion, "", onOKclick, null, onHideclick);
        }
    },
    showPromotionKick: function () {
        var reason = BkLogicManager.getInGameLogic().getLeaveGameReason();
        logMessage("showPromotionKick "+reason);
        if(reason == PLAYER_LEAVE_GAME){
            return;
        }

        var self = this;
        var receiveInviteFunc = function () {
            self.setDisableReceiveInviteState(false);
        };

        var showInviteBuyFunc = function () {
            logMessage("showInviteBuy");
            //self.setDisableReceiveInviteState(true);
            self.getGui().showInviteBuyPromo(receiveInviteFunc);
        };
        switch (reason) {
            case OWNER_KICK:
            case RUN_OUT_OF_CASH_KICK:
            case LOW_CASH:
                self.setDisableReceiveInviteState(true);
                if (BkGlobal.UserInfo.getMoney() >= MIN_MONEY_SALE) {
                    logMessage("STR_INVITE_BUY_UNKICKABLE");
                    showPopupConfirmWith(BkConstString.STR_INVITE_BUY_UNKICKABLE, "", showInviteBuyFunc, receiveInviteFunc, receiveInviteFunc);
                } else {
                    showPopupMessageWith(BkConstString.STR_IS_KICKED, "", receiveInviteFunc, receiveInviteFunc);
                }
                break;
            case TIME_OUT_KICK:
            case UNREADY_TIMEOUT:
                self.setDisableReceiveInviteState(true);
                showPopupMessageWith(BkConstString.STR_MESS_SERVER_KICK, "", receiveInviteFunc, receiveInviteFunc);
                //showToastMessage(BkConstString.STR_MESS_SERVER_KICK, 100, 100);
                break;
        }
        BkLogicManager.getInGameLogic().setLeaveGameReason(PLAYER_LEAVE_GAME);
    },

    processCheckGooogleIAPReturn:function(packet)
    {
    	var obj = {};
    	obj.bonusPercent = packet.Buffer.readByte();
    	if (packet.Buffer.isReadable())
    	{
    		obj.bonusFlag = packet.Buffer.readByte();
    	}
        this.pushOnLoadComplete(obj, packet.Type);
    },
    processContentProviderInfoReturn: function(packet){
        var obj = {}; //{ dauSo15K:String, dauSo10K:String, smsContent:String, numberOfUnavailableSMSTelcos,unavailableSMSTelcos,smsInfoList};
        obj.dauSo15K = packet.Buffer.readString();
        obj.dauSo10K = packet.Buffer.readString();
        obj.smsContent = packet.Buffer.readString();
        var numberOfUnavailableSMSTelcos = packet.Buffer.readByte();
        var unavailableSMSTelcos = [];
        var unavailableTheCaoTelcos = [];
        var telcoIndex = -1;
        var i;
        if (packet.Buffer.isReadable())
        {
            for (i = 0; i < numberOfUnavailableSMSTelcos; i++)
            {
                telcoIndex = packet.Buffer.readByte();
                unavailableSMSTelcos.push(telcoIndex);
            }
            var numberOfUnavailableTheCaoTelcos = packet.Buffer.readByte();
            for (i = 0; i < numberOfUnavailableTheCaoTelcos; i++)
            {
                telcoIndex = packet.Buffer.readByte();
                unavailableTheCaoTelcos.push(telcoIndex);
            }
            if (packet.Buffer.isReadable())
            {
                var SmsInfoList = [];
                var smsSize = packet.Buffer.readByte();
                for (i = 0; i < smsSize; i++)
                {
                    var newSms  = {};
                    newSms.serviceNumber = packet.Buffer.readString();
                    newSms.content = packet.Buffer.readString();
                    newSms.moneyVnd = packet.Buffer.readInt();
                    newSms.moneyXu = packet.Buffer.readInt();

                    SmsInfoList.push(newSms);

                }
                obj.smsInfoList = SmsInfoList;
            } else {
                obj.smsInfoList = null;
            }

        }
        obj.unavailableSMSTelcos = unavailableSMSTelcos;
        obj.unavailableTheCaoTelcos = unavailableTheCaoTelcos;

        var maxBonus =0;
        if(packet.Buffer.isReadable())
        {
            var numOfTheCao = packet.Buffer.readByte();
            var listc = [];
            for ( i = 0; i < numOfTheCao; i++)
            {
                var thei =  packet.Buffer.readInt();
                listc.push(thei);
            }
            obj.listTheCao = listc;

            var listMGMobi = [];
            var listMGKMMobi = [];
            for ( i = 0; i < numOfTheCao; i++)
            {
                var menhGiaMobii = packet.Buffer.readInt();
                listMGMobi.push(menhGiaMobii);
                var menhGiakmi =  packet.Buffer.readInt();
                listMGKMMobi.push(menhGiakmi);
            }
            obj.BonusTheMobi = packet.Buffer.readInt();
            obj.listMenhGiaMobi = listMGMobi;
            obj.listMenhGiaKMMobi = listMGKMMobi;
            var listMGVina = [];
            var listMGKMVina = [];
            for (i = 0; i < numOfTheCao; i++)
            {
                var menhGiaVinai =  packet.Buffer.readInt();
                var menhGiaVinkmai =  packet.Buffer.readInt();
                listMGVina.push(menhGiaVinai);
                listMGKMVina.push(menhGiaVinkmai);
            }
            obj.BonusTheVina = packet.Buffer.readInt();
            obj.listMenhGiaVina = listMGVina;
            obj.listMenhGiaKMVina = listMGKMVina;

            var listMGViettel = [];
            var listMGKMViettel = [];
            for (i = 0; i < numOfTheCao; i++)
            {
                var menhGiaVietteli =  packet.Buffer.readInt();
                var menhGiaKMVietteli =  packet.Buffer.readInt();
                listMGViettel.push(menhGiaVietteli);
                listMGKMViettel.push(menhGiaKMVietteli);
            }
            obj.listMenhGiaVT = listMGViettel;
            obj.listMenhGiaKMVT = listMGKMViettel;
            obj.BonusTheVT = packet.Buffer.readInt();

            obj.BonusSMS = packet.Buffer.readInt();
            obj.BonusIAP = packet.Buffer.readInt();
            obj.BonusVip = packet.Buffer.readInt();

            maxBonus = Math.max(maxBonus,obj.BonusTheMobi,obj.BonusTheVina,obj.BonusTheVT,obj.BonusSMS,obj.BonusVip,obj.BonusIAP);
        }
        BkGlobal.paymentBonusPercent =  maxBonus;
        this.updatePaymentBonusSticker();
        this.pushOnLoadComplete(obj, packet.Type);
    },
    setDisableReceiveInviteState: function (isDisable) {
        this.promotionInfo.receiveInviteState = isDisable;
        //if (isDisable) {
        //    this.promotionInfo.receiveInviteState = this.isDisableReceiveInvite;
        //    this.isDisableReceiveInvite = isDisable;
        //} else {
        //    this.isDisableReceiveInvite = this.promotionInfo.receiveInviteState;
        //}
    },

    processQuickJointTable: function (roomId, tableId) {
        var packet = new BkPacket();
        packet.creatQuickTableJoinPacket(roomId, tableId);
        BkConnectionManager.send(packet);
    },

    getDailyTaskListReturn: function (packet) {
        var itemList = [];
        var itemCount = packet.Buffer.readByte();
        while (packet.Buffer.isReadable())
        {
            var id = packet.Buffer.readByte();
            var bonusMoney = packet.Buffer.readInt();
            var targetAmount = packet.Buffer.readInt();
            var currentAmount = packet.Buffer.readInt();
            var isGetBonus = (packet.Buffer.readByte() == 1);
            var taskName = packet.Buffer.readString();
            var item = new BkDailyTaskData();
            item.setDailyTaskItem(id, bonusMoney, targetAmount, currentAmount, isGetBonus, taskName);
            itemList.push(item);
        }
        return itemList;
    },

    getDailyTaskBonus: function (packet) {
        var bonusTask = new BkDailyTaskData();
        var id = packet.Buffer.readByte();
        var bonusMoney = packet.Buffer.readInt();
        var nextid = packet.Buffer.readByte();
        var nextBonusMoney = packet.Buffer.readInt();
        var nextTargetAmount = packet.Buffer.readInt();
        var currentAmount = packet.Buffer.readInt();
        var isGetBonus = (packet.Buffer.readByte() == 1);
        var nextTaskName = packet.Buffer.readString();
        bonusTask.setBonusDailyTaskItem(id, bonusMoney, nextid, nextBonusMoney, nextTargetAmount, currentAmount, isGetBonus, nextTaskName);
        return bonusTask;
    },
    processGetMailInboxListData: function () {
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GET_INBOX_MAILS);
        BkConnectionManager.send(packet);
    },

    processGetMailInboxListReturn: function (packet) {
        var mailInboxList = [];
        packet.GetMailListReturn(1, mailInboxList);
        this.pushOnLoadComplete(mailInboxList, packet.Type);
    },

    processGetMailOutboxListData: function () {
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GET_OUTBOX_MAILS);
        BkConnectionManager.send(packet);
    },

    processGetMailOutboxListReturn: function (packet) {
        var mailOutboxList = [];
        packet.GetMailListReturn(2, mailOutboxList);
        this.pushOnLoadComplete(mailOutboxList, packet.Type);
    },

    processSendMailData: function (mailTitle, mailContent, receivers) {
        var packet = new BkPacket();
        packet.CreateSendMailPacket(mailTitle, mailContent, receivers);
        BkConnectionManager.send(packet);
    },

    processSendMailReturn: function (type) {
        this.pushOnLoadComplete(null, type);
    },

    processGetMailData: function (mailId) {
        var packet = new BkPacket();
        packet.CreateGetMailPacket(mailId);
        BkConnectionManager.send(packet);
    },

    processGetMailReturn: function (packet) {
        var mail = new BkMailInfo();
        packet.GetMailReturn(mail);
        this.pushOnLoadComplete(mail, packet.Type);
    },

    processDeleteMail: function (mailId) {
        var packet = new BkPacket();
        packet.CreateDeleteMailPacket(mailId);
        BkConnectionManager.send(packet);
    },

    processGetItemInfo: function (itemId) {
        var packet = new BkPacket();
        packet.CreateGetItemInfoPacket(itemId);
        BkConnectionManager.send(packet);
    },

    processGetItemInfoReturn: function (packet) {
        var obj = {Id: null, DayToLive: null, Price: null};
        packet.ProcessGetItemInfo(obj);
        this.pushOnLoadComplete(obj, packet.Type);
    },

    processBuyItem: function (itemId) {
        var packet = new BkPacket();
        packet.CreateBuyItemPacket(itemId);
        BkConnectionManager.send(packet);
    },

    processBuyItemSuccess: function (packet) {
        var obj = {itemCost: 0};
        packet.ProcessGetBoughtItemCost(obj);
        this.pushOnLoadComplete(obj.itemCost, packet.Type);
    },

    processBuyItemFail: function (packet) {
        var obj = {reason: null};
        packet.ProcessBuyItemFailedReason(obj);
        this.pushOnLoadComplete(obj.reason, packet.Type);
    },
    doJoinWebGameRoom: function (gameId, roomTypeId, roomId) {
        Util.showAnim();
        this.crGame = gameId;
        var packet = new BkPacket();
        //roomId = -1;
        packet.createPacketJoinWebGameRoom(gameId, roomTypeId, roomId);
        BkConnectionManager.send(packet);
    },
    onJoinWebGameRoom: function (Packet)
    {
        logMessage("onJoinWebGameRoom");
        Util.removeAnim();
        BkGlobal.currentGameID = this.crGame;
        var currRoomID = Packet.Buffer.readByte();
        var numberRoom = Packet.Buffer.readByte();
        logMessage("currentRoomID: "+currRoomID+" numberRoom: "+numberRoom
            + " currentGameID: "+BkGlobal.currentGameID+" crGame: "+this.crGame);
        BkGlobal.currentRoomID = currRoomID;

        var i;
        var rDT;
        var listRoom = [];
        for (i = 0; i < numberRoom; i++) {
            rDT = new BkRoomData;
            rDT.percent = Packet.Buffer.readByte();
            rDT.roomID = Packet.Buffer.readByte();
            logMessage("percent: " + rDT.percent + " roomID: " + rDT.roomID);
            listRoom.push(rDT);
        }

        // swap current room -> 0
        for (i = 0; i < numberRoom; i++) {
            rDT = listRoom[i];
            if (rDT.roomID == currRoomID) {
                var tgRoomDT = listRoom[0];
                listRoom[0] = rDT;
                listRoom[i] = tgRoomDT;
            }
        }

        var maxTable = Packet.Buffer.readByte();
        logMessage("maxTable: " + maxTable);
        maxTable = Math.abs(maxTable);

        var listTable = [];
        while (Packet.Buffer.isReadable()) {
            var tb = new BkTableData;
            tb.tableID = Packet.Buffer.readByte();
            tb.betMoney = Packet.Buffer.readInt();
            var tableInfo = Packet.Buffer.readByte();
            // calculator NumberPlayers,MaxNumberPlayers,HasPassword,IsGameInProgress from tableInfo
            // NumberPlayers =  3 bit cuoi tableInfo = tableInfo & 00000111
            tb.numberPlayer = (tableInfo & 7);
            // MaxNumberPlayers = 3 bit giua tableInfo = (tableInfo & 00111000)>>3
            tb.maxNumberPlayer = (tableInfo & 56) >> 3;
            // HasPassword = bit 6 cua tableInfo = (tableInfo & 01000000)>>6
            tb.hasPassword = (tableInfo & 64) >> 6;
            // IsGameInProgress = bit 7 cua tableInfo = (tableInfo & 10000000)>>7
            tb.isInGameProgress = (tableInfo & 128) >> 7;
            //logMessage(tb.toString());
            listTable.push(tb);
        }

        // them cac ban trong vao listTable
        var listStatusTable = [];
        for (i = 0; i < maxTable; i++) {
            listStatusTable.push(false);
        }
        for (var i1 = 0; i1 < listTable.length; i1++) {
            var tdt = listTable[i1];
            listStatusTable[tdt.tableID] = true;
        }

        var countTable = 0;
        for (var j = 0; j < maxTable; j++) {
            var bl = listStatusTable[j];
            if (!bl) {
                var tdt1 = new BkTableData;
                tdt1.tableID = j;
                tdt1.maxNumberPlayer = getMaxPlayer(BkGlobal.currentGameID);
                if (BkGlobal.isRoomTypeSolo()) {
                    tdt1.maxNumberPlayer = 2;
                }
                listTable.push(tdt1);
                countTable++;
            }
        }

        if (countTable < 3) {

        }

        // set data cho logic
        if ((this.STTCurrentRoom == -1) || (this.STTCurrentRoom >= numberRoom * 3)) {
            this.STTCurrentRoom = 0;
        } else {
            var iSTT = Math.floor(this.STTCurrentRoom / 3);
            logMessage("iSTT: " + iSTT + " STTCurrentRoom: " + this.STTCurrentRoom);
            var iSTTroomData = listRoom[iSTT];
            logMessage("iSTT roomID: " + iSTTroomData.roomID + " currRoomID: " + currRoomID);
            if (iSTTroomData.roomID != currRoomID) {
                // swap in list room
                var posCurRoom;
                var posRoomData;
                for (i = 0; i < numberRoom; i++) {
                    var iRdt = listRoom[i];
                    if (iRdt.roomID == currRoomID) {
                        posCurRoom = i;
                        posRoomData = iRdt;
                        break;
                    }
                }
                listRoom[iSTT] = posRoomData;
                listRoom[posCurRoom] = iSTTroomData;
            }
        }

        listTable.sort(function(item1, item2) {
            return item2.betMoney - item1.betMoney;
        });

        if (this.lobbyData == null) {
            this.lobbyData = new BkLobbyRoomData;
        }

        this.lobbyData.maxTableInRoom = maxTable;
        this.lobbyData.listRoom = listRoom;
        this.lobbyData.devideListRoom();

        this.lobbyData.listTable = listTable;
        this.lobbyData.devideListTable();

        // switch scene and update UI
        logMessage("switchToSceneWithGameState(GS.CHOOSE_TABLE)");
        if (BkGlobal.currentGS != GS.CHOOSE_TABLE){
            this.STTCurrentRoom = 0;
            switchToSceneWithGameState(GS.CHOOSE_TABLE);
        } else {
            logMessage("BkGlobal.currentGS != GS.CHOOSE_TABLE | currentGS: "+BkGlobal.currentGS);
            var crScene = getCurrentScene();
            if (crScene != null){
                if (crScene instanceof  VvLobby){
                    crScene.showGuiLobby();
                } else {
                    logMessage("crScene not instanceof  BkLobby -> error recheck!!!!!!!!!!!")
                }
            } else {
                logMessage("crScene == null")
            }
            //getCurrentScene().showGuiLobby();
        }
        Util.setClientSetting(key.lastGameChoose,BkGlobal.currentGameID);
    },
    ProcessWhenClickRoomWith: function (rDT) {
        if (rDT.roomID != BkGlobal.currentRoomID) {
            this.doJoinChanGameRoom(BkRoomTypeUtils.getRoomTypeById(rDT.roomID),rDT.roomID);
            //this.doJoinWebGameRoom(BkGlobal.currentGameID, BkRoomTypeUtils.getRoomTypeById(rDT.roomID), rDT.roomID);
        } else {
            //BkGlobal.lobbyScene.showGuiLobby();
            this.getGui().showGuiLobby();
        }
    },
    processSelectAvatarPacket: function (itemId) {
        var packet = new BkPacket();
        packet.CreateSelectAvatarPacket(itemId);
        BkConnectionManager.send(packet);
    },

    onTableStatusChange: function (packet) {
        if (this.lobbyData == null) {
            logMessage("onReceive packet before receiving packet get list table -> reject packet");
            return;
        }

        var tableID = packet.Buffer.readByte();
        var isGameInProgress = packet.Buffer.readByte();
        this.lobbyData.updateGameTableStatus(tableID, isGameInProgress);

        if (!(this.getGui() instanceof VvLobby)) {
            logMessage("BkLobby not onEnterTransitionDidFinish -> reject packet");
            return;
        }
        this.getGui().UpdateStatusOfTableWith(tableID, isGameInProgress);
    },
    onTableSizeUpdatePush: function (packet) {
        if (this.lobbyData == null) {
            logMessage("onReceive packet before receiving packet get list table -> reject packet");
            return;
        }

        var tID = packet.Buffer.readByte();
        var numberOfPlayers = packet.Buffer.readByte();
        this.lobbyData.updateNumberPlayersInTable(tID, numberOfPlayers);

        if (!(this.getGui() instanceof VvLobby)) {
            logMessage("BkLobby not onEnterTransitionDidFinish -> reject packet");
            return;
        }
        this.getGui().UpdateSizeOfTableWith(tID, numberOfPlayers);
    },
    onTableSettingUpdatePush: function (Packet) {
        if (this.lobbyData == null) {
            logMessage("onReceive packet before receiving packet get list table -> reject packet");
            return;
        }

        var tb = new BkTableData;
        tb.tableID = Packet.Buffer.readByte();
        tb.betMoney = Packet.Buffer.readInt();
        var tableInfo = Packet.Buffer.readByte();
        tb.HasGagop = Packet.Buffer.readByte();
        // calculator NumberPlayers,MaxNumberPlayers,HasPassword,IsGameInProgress from tableInfo
        // NumberPlayers =  3 bit cuoi tableInfo = tableInfo & 00000111
        tb.numberPlayer = (tableInfo & 7);
        // MaxNumberPlayers = 3 bit giua tableInfo = (tableInfo & 00111000)>>3
        tb.maxNumberPlayer = (tableInfo & 56) >> 3;
        // HasPassword = bit 6 cua tableInfo = (tableInfo & 01000000)>>6
        tb.hasPassword = (tableInfo & 64) >> 6;
        // IsGameInProgress = bit 7 cua tableInfo = (tableInfo & 10000000)>>7
        tb.isInGameProgress = (tableInfo & 128) >> 7;

        logMessage("onTableSettingUpdatePush: "+tb.toString());
        this.lobbyData.updateTable(tb);

        if (!(this.getGui() instanceof VvLobby)) {
            logMessage("BkLobby not onEnterTransitionDidFinish -> reject packet");
            return;
        }
        this.getGui().UpdateTableWith(tb);
    },
    ProcessTopUToReturn:function (packet) {
        var Buffer = packet.Buffer;
        var myLV = Buffer.readInt();
        var myPoint = Buffer.readInt();
        var myPosition = Buffer.readInt() + 1;
        var myAvar = Buffer.readByte();
        var cuocCount = Buffer.readByte();
        var myArrayCuoc = [];
        var i;
        for (i=0;i<cuocCount;i++){
            myArrayCuoc.push(Buffer.readByte());
        }
        var myStringCuoc = CXuongCuocWindow.getStringXuongCuoc(myArrayCuoc);
        var myVipLevel = -1;
        if (IS_VIP_ENABLE){
            myVipLevel = Buffer.readByte();
        }

        logMessage("myVipLV:" + myVipLevel + "myLV: "+myLV+" myPoint: "+myPoint+" myPosition: "+myPosition+" myAvar: "+myAvar
            +" cuocCount: "+cuocCount+ " myStringCuoc: "+myStringCuoc );
        var playerMe = new BkUserData;
        playerMe.setUserName(BkGlobal.UserInfo.getUserName());
        playerMe.setMoney(BkGlobal.UserInfo.getMoney());
        playerMe.setAvatarId(myAvar);
        playerMe.setLevel(myLV);
        playerMe.setRank(myPosition);
        playerMe.setmaxUPoint(myPoint);
        playerMe.setCuocU(myStringCuoc);
        playerMe.VipLevel = myVipLevel;
        var listTop = [];

        while (Buffer.isReadable()){
            var playerName = Buffer.readString();
            var point = Buffer.readInt();
            var avatar = Buffer.readByte();
            var level = Buffer.readInt();
            var money = Buffer.readInt();
            var isFriend = Buffer.readByte();

            var playerCuocCount = Buffer.readByte();
            var playerArrayCuocs = [];
            for (i = 0; i < playerCuocCount; i++) {
                playerArrayCuocs.push( Buffer.readByte());
            }
            var playeriVipLV = -1;
            if(IS_VIP_ENABLE)
            {
                playeriVipLV = Buffer.readByte();
            }
            var playerStringCuoc = CXuongCuocWindow.getStringXuongCuoc(playerArrayCuocs);
            logMessage("playerName: "+playerName+" point: "+point+" avatar: "+avatar+" level: "+level
                +" money: "+money+" isFriend: "+isFriend+" playerCuocCount: "+playerCuocCount
                +" playerStringCuoc:" +playerStringCuoc + " VipLevel:" + playeriVipLV);

            var playerTop = new BkUserData;
            playerTop.setUserName(playerName);
            playerTop.setAvatarId(avatar);
            playerTop.setLevel(level);
            playerTop.setMoney(money);
            playerTop.setRank(listTop.length+1);
            playerTop.setmaxUPoint(point);
            playerTop.setCuocU(playerStringCuoc);
            playerTop.VipLevel = playeriVipLV;
            listTop.push(playerTop);
        }
        listTop.push(playerMe);

        var o = {playerList: listTop};
        this.pushOnLoadComplete(o, packet.Type);
    },
    processTopRichestChan:function (packet) {
        var richestPlayerList = [];
        var mySelf = new BkUserData();
        mySelf.rank = packet.Buffer.readInt(); // max interger
        if (mySelf.rank != 0x7FFFFFFF) {
            mySelf.rank = mySelf.rank + 1;
        }
        mySelf.avatarID = packet.Buffer.readByte();
        mySelf.lvUser = packet.Buffer.readInt();
        if (IS_VIP_ENABLE){
            mySelf.VipLevel = packet.Buffer.readByte();
        }

        mySelf.setUserName(BkGlobal.UserInfo.getUserName());
        mySelf.setMoney(BkGlobal.UserInfo.getMoney());

        var rank = 0;
        while (packet.Buffer.isReadable()) {
            rank++;
            var player = new BkUserData();
            player.userName = packet.Buffer.readString();
            player.playerMoney = packet.Buffer.readInt();
            player.avatarID = packet.Buffer.readByte();
            player.isFriend = packet.Buffer.readByte() == 1;
            player.lvUser = packet.Buffer.readInt();
            if (IS_VIP_ENABLE){
                player.VipLevel = packet.Buffer.readByte();
            }
            player.rank = rank;
            richestPlayerList.push(player);
        }

        var o = {mySelf: mySelf, richestPlayerList: richestPlayerList};

        this.pushOnLoadComplete(o, packet.Type);
    },
    processTopRichestPlayerReturn: function (packet) {
        var richestPlayerList = [];
        var mySelf = new BkUserData();
        mySelf.rank = packet.Buffer.readInt(); // max interger
        if (mySelf.rank != 0x7FFFFFFF) {
            mySelf.rank = mySelf.rank + 1;
        }
        mySelf.avatarID = packet.Buffer.readByte();
        if (IS_VIP_ENABLE){
            mySelf.VipLevel = packet.Buffer.readByte();
        }

        mySelf.setUserName(BkGlobal.UserInfo.getUserName());
        mySelf.setMoney(BkGlobal.UserInfo.getMoney());

        var rank = 0;
        while (packet.Buffer.isReadable()) {
            rank++;
            var player = new BkUserData();
            player.userName = packet.Buffer.readString();
            player.playerMoney = packet.Buffer.readInt();
            player.avatarID = packet.Buffer.readByte();
            player.isFriend = packet.Buffer.readByte() == 1;
            if (IS_VIP_ENABLE){
                player.VipLevel = packet.Buffer.readByte();
            }
            player.rank = rank;
            richestPlayerList.push(player);
        }

        var o = {mySelf: mySelf, richestPlayerList: richestPlayerList};

        this.pushOnLoadComplete(o, packet.Type);
    },
    processTopPlayerReturn: function (packet) {
        var playerList = [];
        var mySelf = new BkUserData();
        mySelf.setLevel(packet.Buffer.readInt());
        mySelf.setWinCount(packet.Buffer.readInt());
        mySelf.rank = packet.Buffer.readInt(); // max interger
        if (mySelf.rank != 0x7FFFFFFF) {
            mySelf.rank = mySelf.rank + 1;
        }
        mySelf.avatarID = packet.Buffer.readByte();
        if (IS_VIP_ENABLE){
            mySelf.VipLevel = packet.Buffer.readByte();
        }

        mySelf.setUserName(BkGlobal.UserInfo.getUserName());
        mySelf.setMoney(BkGlobal.UserInfo.getMoney());
        var rank = 0;
        while (packet.Buffer.isReadable()) {
            rank++;
            var player = new BkUserData();
            player.userName = packet.Buffer.readString();
            player.setWinCount(packet.Buffer.readInt());
            player.avatarID = packet.Buffer.readByte();
            player.lvUser = packet.Buffer.readInt();
            player.playerMoney = packet.Buffer.readInt();
            player.isFriend = packet.Buffer.readByte() == 1;

            if (IS_VIP_ENABLE){
                player.VipLevel = packet.Buffer.readByte();
            }

            player.rank = rank;
            player.logPlayer();
            playerList.push(player);
        }

        var o = {mySelf: mySelf, playerList: playerList};

        this.pushOnLoadComplete(o, packet.Type);
    },

    processTableJoinFailure: function (packet) {
        Util.removeAnim();
        var errorType = packet.Buffer.readByte();
        logMessage("NETWORK_TABLE_JOIN_FAILURE with errorType: " + errorType);
        var strPromotion = "";
        var now = new Date();
        if (errorType == BkJoinTableError.FAILED_NOT_ENOUGH_MONEY || errorType == BkJoinTableError.FAILED_NOT_ENOUGH_MONEY_TO_JOIN_DAI_GIA_ROOM) {
            if (this.promotionInfo.isJoinFromInviteFriend) {
                this.promotionInfo.isJoinFromInviteFriend = false;
                showToastMessage(BkConstString.PLAYER_NOT_ENOUGH_MONEY);
                return;
            }

            if (this.tableData == null){
                showToastMessage(Util.getStringErrorJoinTableFail(errorType));
                return;
            }

            if(this.tableData.HasGagop == 1)
            {
                this.tableData = null;
                // Nap tien
                if (this.promotionInfo.suggestNapTienCount <= BkConstants.PROMO_MAX_SUGGEST_TIMES && Util.calculateTimeInterval(this.promotionInfo.lastAskingTimeInvitePayment, now.valueOf()) >= BkConstants.PROMO_ASKING_INTERVAL) {
                    this.promotionInfo.lastAskingTimeInvitePayment = now.valueOf();
                    this.promotionInfo.isShowNapTien = true;
                    strPromotion = BkConstString.PLAYER_NOT_ENOUGH_MONEY;
                    this.showPromotion(strPromotion);
                    return;
                }
                showToastMessage(BkConstString.PLAYER_NOT_ENOUGH_MONEY);
                return;
            }

            if(this.tableData.HasGagop == 0)
            {
                var moneyNeed = 0;
                var numOfInviteNeeded = 0;
                var minBetMoney = 0;
                var playerMoney = BkGlobal.UserInfo.getMoney();
                var tableMoney = 5 * this.tableData.betMoney;

                var roomType = VvRoomTypeUtils.getRoomTypeById(BkGlobal.currentRoomID);

                if(roomType == RT.ROOM_TYPE_DINH_THU_QUAN)
                {
                    minBetMoney = 5 * c.MIN_BET_MONEY_DINH_THU_QUAN;
                }
                else if(roomType == RT.ROOM_TYPE_NHA_TRANH)
                {
                    minBetMoney = 5 * c.MIN_BET_MONEY_NHA_TRANH;
                }
                else
                {
                    minBetMoney = 5 * c.MIN_BET_MONEY_DAU_TAY_DOI;
                }

                if(tableMoney - playerMoney < 0)
                {
                    // đủ tiền bàn nhưng không đủ tiền tối thiểu
                    moneyNeed = minBetMoney - playerMoney;
                }
                else
                {
                    // không đủ tiền bàn
                    if(tableMoney < minBetMoney)
                    {
                        //tiền bàn nhỏ hơn tiền tối thiểu
                        moneyNeed = minBetMoney - playerMoney;
                    }else
                    {
                        moneyNeed = tableMoney - playerMoney;
                    }
                }

                if(moneyNeed <= 0)
                {
                    showToastMessage(BkConstString.PLAYER_NOT_ENOUGH_MONEY);
                    return;
                }

                this.promotionInfo.isShowNapTien = false;
                this.promotionInfo.isShowFaceBookInviteFB = false;
                this.promotionInfo.isShowRegisterPhone = false;
                numOfInviteNeeded = Util.calculateNumOfFriendNeed(moneyNeed);
                logMessage("processTableJoinFailure - minMoney: " + minMoney + " - moneyNeed: "+ moneyNeed + " - numOfInviteNeeded: "+ numOfInviteNeeded);

                var minMoney = convertStringToMoneyFormat((playerMoney + moneyNeed)) + " " + BkConstString.STR_GAME_COIN.toLocaleLowerCase();
                // show register phone window
                if (moneyNeed <= BkConstants.BONUS_REGISTER_PHONE && BkGlobal.isPhoneNumberUpdatable &&
                    this.promotionInfo.suggestRegisterPhoneCount <= BkConstants.PROMO_MAX_SUGGEST_TIMES &&
                    Util.calculateTimeInterval(this.promotionInfo.lastAskingTimeRegisterPhone, now.valueOf()) >= BkConstants.PROMO_ASKING_INTERVAL) {
                    this.promotionInfo.isShowRegisterPhone = true;
                    this.promotionInfo.lastAskingTimeRegisterPhone = now.valueOf();

                    strPromotion = "Bàn này cần tối thiểu " + minMoney + ".\nHãy đăng ký số điện thoại để nhận thưởng " + Util.getRegPhoneBonus() + " " + BkConstString.STR_GAME_COIN.toLowerCase() + ".";
                    this.showPromotion(strPromotion);
                    return;
                }

                // Facebook invite Friend
                // if (moneyNeed <= BkConstants.FACEBOOK_BONUS_AMOUNT && this.promotionInfo.suggestInviteFriendFBCount <= BkConstants.PROMO_MAX_SUGGEST_TIMES && Util.calculateTimeInterval(this.promotionInfo.lastAskingTimeInviteFacebook, now.valueOf()) >= BkConstants.PROMO_ASKING_INTERVAL) {
                //     this.promotionInfo.lastAskingTimeInviteFacebook = now.valueOf();
                //     this.promotionInfo.isShowFaceBookInviteFB = true;
                //     strPromotion = "Bàn này cần tối thiểu " + minMoney + ".\nHãy giới thiệu " + numOfInviteNeeded + " bạn qua Facebook để vào bàn.";
                //     this.showPromotion(strPromotion);
                //     return;
                // }

                // Nap tien
                if (this.promotionInfo.suggestNapTienCount <= BkConstants.PROMO_MAX_SUGGEST_TIMES && Util.calculateTimeInterval(this.promotionInfo.lastAskingTimeInvitePayment, now.valueOf()) >= BkConstants.PROMO_ASKING_INTERVAL) {
                    this.promotionInfo.lastAskingTimeInvitePayment = now.valueOf();
                    this.promotionInfo.isShowNapTien = true;
                    strPromotion = "Bàn này cần tối thiểu " + minMoney + ".\nHãy nạp " + BkConstString.STR_GAME_COIN.toLowerCase() + " để vào bàn.";
                    this.showPromotion(strPromotion);
                    return;
                }
                // finally show toast 
                showToastMessage("Bàn này cần tối thiểu " + minMoney + ".\nHãy nạp " + BkConstString.STR_GAME_COIN.toLowerCase() + " để vào bàn.");
                return;
            }
        } else {
            showToastMessage(Util.getStringErrorJoinTableFail(errorType));
        }
    },
    setLastTableBetMoney: function (money) {
        this.lastTableBetMoney = money;
    },
    processReceiveInvitation: function (Packet) {
        if (!(this.getGui() instanceof VvLobby)) {
            logMessage("BkLobby not onEnterTransitionDidFinish -> reject packet");
            return;
        }
        var offeredRoomId = Packet.Buffer.readByte();
        var offeredTableId = Packet.Buffer.readByte();
        var betMoney = Packet.Buffer.readInt();
        var invitationPlayer = Packet.Buffer.readString();
        logMessage("offeredRoomId: " + offeredRoomId + " offeredTableId: " + offeredTableId
            + " betMoney: " + betMoney + " invitationPlayer: " + invitationPlayer);
        this.getGui().showReceiveInvitationMessage(offeredRoomId, offeredTableId, betMoney, invitationPlayer);
    },
    ProcessTableJoinSuccess: function (packet) {
        Util.removeAnim();
        BkGlobal.currentGameID = packet.Buffer.readByte();
        BkGlobal.currentRoomID = packet.Buffer.readByte();
        BkGlobal.currentTableID = packet.Buffer.readByte();
        //this.maxPlayer = getMaxPlayer( BkGlobal.currentGameID);
        BkGlobal.isReceiveSyncEvent = false;
        switchToSceneWithGameState(GS.INGAME_GAME);
    },
    updateMyMoney: function (amount, updType,otherMess) {
        var inGameMsg = "";
        var lobbyMsg = "";
        if (updType == AM.TYPE_ADMIN_ADD) {
            lobbyMsg = "Bạn vừa được Admin cộng " + convertStringToMoneyFormat(amount) + " vào tài khoản.";
            inGameMsg = "Admin cộng tiền";
        } else if (updType == AM.TYPE_SMS_ADD) {
            lobbyMsg = "Gửi tin nhắn thành công. Bạn được cộng " + convertStringToMoneyFormat(amount) + " vào tài khoản.";
            inGameMsg = "Nạp SMS thành công";

            var bonusRegPhone = Util.getRegPhoneBonus();
            if(amount == bonusRegPhone){
                lobbyMsg = "Đăng ký số điện thoại thành công. Bạn được cộng " + convertStringToMoneyFormat(amount) + " vào tài khoản.";
                inGameMsg = "Đăng ký số điện thoại thành công.";
            } else {
                logMessage("send sms success -> get data bonus");
                var packet = new BkPacket();
                packet.GetContentProviderInfo(0);
                BkConnectionManager.send(packet);
            }
        } else if (updType == AM.TYPE_NAP_THE) {
            lobbyMsg = "Nạp thẻ thành công. Bạn được cộng " + convertStringToMoneyFormat(amount) + " vào tài khoản.";
            inGameMsg = "Nạp thẻ thành công";
        }else if(updType == AM.TYPE_PAY_BET_FOOTBALL_WIN_MONEY)
        {
            lobbyMsg = "Bạn vừa nhận được " + convertStringToMoneyFormat(amount) + " từ dự đoán bóng đá. Vui lòng xem chi tiết trong mục thống kê.";
            inGameMsg = "Bạn vừa nhận được " + convertStringToMoneyFormat(amount) + " từ dự đoán bóng đá. Vui lòng xem chi tiết trong mục thống kê.";
        }

        if (otherMess != undefined){
            lobbyMsg = otherMess;
            inGameMsg = otherMess;
        }
        if (BkGlobal.currentGS == GS.INGAME_GAME) {
            logMessage("incress money ingame");
            var myClientState = BkLogicManager.getInGameLogic().getMyClientState();
            if (myClientState != null){
                BkLogicManager.getInGameLogic().increaseCash(myClientState, amount, inGameMsg);
            } else {
                BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + amount);
            }
        } else {
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + amount);
            showPopupMessageWith(lobbyMsg);
            this.processUpdateProfileUI();
        }
    },
    processOnReceiveKDL: function (packet) {
        var minute = packet.Buffer.readByte();
        var txt = BkConstString.insertIntoStringWithListString(BkConstString.STR_SERVER_SHUTTING_DOWN, [minute]);
        showPopupMessageWith(txt);
    },

    processReceiveMessageToClient: function (packet) {
        var notifyMessage = packet.Buffer.readString();
        showPopupMessageWith(notifyMessage);
    },
    processReceiveServerRequestMessage:function(packet)
    {
        var subEventCode = packet.Buffer.readByte();
        if(subEventCode == SERVER_REQUEST.SERVER_REQUEST_RECOMMEND_CASH_BONUS )
        {
            var title = packet.Buffer.readString();
            var content = packet.Buffer.readString();
            var percent = packet.Buffer.readInt();
            var remainingTime = packet.Buffer.readLong()/1000;
            if(BkGlobal.currentGS == GS.CHOOSE_TABLE)
            {
                var bonusObj = {
                    title: null,
                    content: null,
                    percent: null,
                    remainingTime: null,
                };
                bonusObj.title = title;
                bonusObj.content = content;
                bonusObj.percent = percent;
                bonusObj.remainingTime = remainingTime;
               BkGlobal.bonusObj = bonusObj;
            }else
            {
                var paymentPromotionWD = new BkPaymentPromotionWD(title,content,percent,remainingTime);
                var pr = getCurrentScene();
                if(pr != null)
                {
                    paymentPromotionWD.setParentWindow(pr);
                }
                paymentPromotionWD.showWithParent();
            }
            return;
        }
        if(subEventCode == SERVER_REQUEST.SERVER_REQUEST_UPDATE_CASH_BONUS)
        {
            var bonusPercent = packet.Buffer.readInt();
            var bonusByType = Util.getBonusPercent(BkGlobal.addMoneyBonusType);
            BkGlobal.addMoneyBonusType = Util.getBonusType(bonusPercent);
            BkGlobal.paymentBonusPercent = Math.max(bonusPercent,bonusByType);
            var crSce = getCurrentScene();
            if (crSce){
                crSce.getGameLayer().addPaymentBonusSticker();
            }
            // if (((this.getGui() instanceof BkChooseGame)) || (this.getGui() instanceof VvLobby))
            // {
            //     this.getGui().updatebtnPayment();
            // }
            // return;
        }
        if(subEventCode == SERVER_REQUEST.SERVER_REQUEST_GET_PAYMENT_INFO)
        {
            this.pushOnLoadComplete(packet,packet.Type);
            return;
        }
    },
    doRegisterUser: function (userName, pass, clientID) {
        if (BkGlobal.UserInfo == null) {
            BkGlobal.UserInfo = new BkUserData();
        }
        BkGlobal.isLoginFacebook = false;
        BkGlobal.UserInfo.userName = userName;
        BkGlobal.UserInfo.password = pass;
        BkGlobal.UserInfo.clientID = clientID;
        var packet = new BkPacket();
        packet.CreatePacketRegister(userName, pass, bk.cpid, clientID, bk.userIp);
        BkConnectionManager.send(packet);
        //postUserTracker(3, userName, bk.cpid, cc.bkClientId,"", "doRegisterUser");
    },

    processForgotPass: function (userName, clientID) {
        var packet = new BkPacket();
        packet.CreatePacketForgetPassword(userName, clientID);
        BkConnectionManager.send(packet);
    },

    doLogout: function () {
        this.isLogout = true;
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_LOG_OUT);
        BkConnectionManager.send(packet);
    },
    getAllGiaiDau:function(betFootballType){
        var packet = new BkPacket();
        packet.getAllGiaiDau(betFootballType);
        BkConnectionManager.send(packet);
    },
    sendCuocFootball:function(betFootballType,betMoney,listOfCuocSprite){
        var packet = new BkPacket();
        packet.createSendCuocFootball(betFootballType,betMoney,listOfCuocSprite);
        BkConnectionManager.send(packet);
    },
    getLastestCuocEvent:function(betFootballType)
    {
        var packet = new BkPacket();
        packet.getLastestCuocEvent(betFootballType);
        BkConnectionManager.send(packet);
    },
    getAllTranDau:function(betFootballType,gdid){
        var packet = new BkPacket();
        packet.createGetAllTranDauPacket(betFootballType,gdid);
        BkConnectionManager.send(packet);
    },
    getAllKeo:function(betFootballType,tdid)
    {
        var packet = new BkPacket();
        packet.createGetAllKeoPacket(betFootballType,tdid);
        BkConnectionManager.send(packet);
    },
    processReceiveFbUser: function (packet) {
        hideProgressModalEx();
        Util.removeAnim();
        bk.isClickedFbLogin = false;
        var subEvent = packet.Buffer.readByte();
        logMessage("processReceiveFbUser: " + subEvent);

        var self = this;

        if(subEvent == fb.SUBEVENT_CHECK_ACCOUNT_SETUP) {
            BkGlobal.isFbCreateablePass = packet.Buffer.readByte();
            BkGlobal.isFbLinkable = packet.Buffer.readByte();
            BkGlobal.isFbRenameable = packet.Buffer.readByte();

            logMessage("FB CHECK_ACCOUNT_SETUP: isFbCreateablePass: " + BkGlobal.isFbCreateablePass + " isFbLinkable: " + BkGlobal.isFbLinkable + " isFbRenameable: " + BkGlobal.isFbRenameable);
            //this.pushOnLoadComplete("", subEvent);
            return;
        } else if (subEvent == fb.SUBEVENT_INPUT_USER) {
            var suggestName = packet.Buffer.readString();
            logMessage("LOGIN FACEBOOK INPUT NAME: "+ suggestName);
            showPopupConfirmWith("Bạn đã đăng ký tài khoản: "+ suggestName+", bạn có muốn liên kết với tài khoản đó không?"
                ,"Liên kết tài khoản",
                function() {
                    var linkUserWd = new BkFbUserSetupWindow(FB_SETUP_LINK_USER, suggestName,
                        BkFacebookMgr.App.getUserID(), BkFacebookMgr.App.getAccessToken()
                    );
                    linkUserWd.setParentWindow(self.getGui());
                    linkUserWd.showWithParent();
                },function() {
                    BkFacebookMgr.doRegisterFbUser(BkFacebookMgr.App.getUserID(),BkFacebookMgr.App.getAccessToken()
                        ,cc.bkClientId);
                });
        }else{
            logMessage("LOGIN FACEBOOK EVENT NOT PROCESS: "+ subEvent);
        }
        var fbStatus = packet.Buffer.readByte();
        this.pushOnLoadComplete(fbStatus, subEvent);
    },

    processRegisterPhoneNumber : function (packet) {
        logMessage("processRegisterPhoneNumber");
        // var o = {result: 0,bonus:0};
        // o.result = packet.Buffer.readByte();
        // if(packet.Buffer.isReadable()){
        //     o.bonus = packet.Buffer.readString();
        // }
        this.pushOnLoadComplete(packet, packet.Type);
    },

    currentLodeBetMoney:0,
    sendLodePacket:function(lodeType,betMoney,listNumber){
        this.currentLodeBetMoney = betMoney;
        var packet = new BkPacket();
        packet.createBetLotteTicket(lodeType,betMoney,listNumber);
        BkConnectionManager.send(packet);
    },
    processLodeReturn:function(packet){
        logMessage("processLodeReturn");
        var type = packet.Buffer.readByte();
        if (type == LDNS.PLACE_BET_LOTTE){
            var delta = packet.Buffer.readInt();
            logMessage("delta "+delta);
            if (delta>0){
                this.updateMyMoney(delta,undefined,"Trúng lô");
            } else if (delta< -10){
                showToastMessage("Đặt cược thành công.Chúc mừng bạn!");
                this.updateMyMoney(delta);
            } else {
                delta = -delta;
                if ((delta >=0) && (delta < LDNS.NUMBER_LODE_CODE)){
                    showToastMessage(LDNS.LODE_ERR_CODE[delta]);
                }
            }
        }
    },
    processBetFootballReturn:function(packet)
    {
        this.pushOnLoadComplete(null, packet);
        return;
    },
    processLoadBaseRes:function(cb){
        var self = this;
        self.isDoneLoadRes = false;
        processLoadingBaseRes(function(){
            logMessage("done load processLoadingBaseRes");
            self.isDoneLoadRes = true;
            Util.removeAnim();
            if ((cb != undefined)&& (cb !=null)){
                cb();
            }
        });
    },
    onClickInviteFBFriend: function ()
    {
        logMessage("onClickInviteFBFriend");
        if(this.FBInviteWD != null)
        {
            logMessage("this.FBInviteWD != null -> removeSelf");
            // this.FBInviteWD.removeSelf();
            this.FBInviteWD = null;
        }
        BkFacebookMgr.setCallBack(this);
        BkFacebookMgr.prepareBeforeInviteFriend();
    },
    //Call from bigkool desktop version
    onClickInviteFBFriendDesktop: function ()
    {
        logMessage("onClickInviteFBFriendDesktop");
        if(this.FBInviteWD != null)
        {
            logMessage("this.FBInviteWD != null -> removeSelf");
            // this.FBInviteWD.removeSelf();
            this.FBInviteWD = null;
        }
        BkFacebookMgr.setCallBack(this);
        BkFacebookMgr.facebookID = BkFacebookMgr.App.getUserID();
        if(!cc.isUndefined(BkFacebookMgr.facebookID)){
            //BkFacebookMgr.facebookToken = BkFacebokMgr.App.getAccessToken();
            BkFacebookMgr.getInvitableFriendList();
            //BkFacebookMgr.prepareBeforeInviteFriend();
        }
    },
    onGetInvitableListFinished:function()
    {
        logMessage("onGetInvitableListFinished");
        if(this.FBInviteWD == null)
        {
            logMessage("init BkFBInviteFriendWD");
            this.FBInviteWD = new BkFBInviteFriendWD();
            if(bk.isFbApp && cc.screen.fullScreen())
            {
                cc.screen.exitFullScreen();
            }
            this.FBInviteWD.showWithParent();
            this.FBInviteWD.visible = false;
        }
    },
    doGetVipBenifit:function () {
        var packet = new BkPacket();
        packet.CreatePacketWithTypeAndByteData(c.NETWORK_VIP_FUNCTION,VC.VIP_BENEFIT);
        BkConnectionManager.send(packet);
    },
    getVipBenefitReturn:function (Packet) {

        var nextVipBenefit = new VvVipBenefitInfo();
        var currVipBenefit = new VvVipBenefitInfo();
        if(Packet.Buffer.isReadable())
        {
            var nextLevelScore = Packet.Buffer.readInt();
            if(BkGlobal.UserInfo.VipLevel != 0)
            {
                currVipBenefit.maxBorrowMoney = Packet.Buffer.readInt();
                currVipBenefit.mnTransferPercent = Packet.Buffer.readByte();
                currVipBenefit.mnBoxPercent = Packet.Buffer.readByte();
                currVipBenefit.paymentBonus = Packet.Buffer.readInt();
                currVipBenefit.FBinviteBonus = Packet.Buffer.readInt();
                if(currVipBenefit.FBinviteBonus < Util.getFriendCost() ) {
                    currVipBenefit.FBinviteBonus = Util.getFriendCost();
                }
            }else {
                currVipBenefit.maxBorrowMoney = -1;
                currVipBenefit.mnTransferPercent = -1;
                currVipBenefit.mnBoxPercent = 0;
                currVipBenefit.paymentBonus = 0;
                currVipBenefit.FBinviteBonus = Util.getFriendCost();
            }
            if(Packet.Buffer.isReadable())
            {
                //{nextLevelScore, maxBorrowMoney, mnTransferPercent,mnBoxPercent,paymentBonus,FBinviteBonus};
                nextVipBenefit.nextLevelScore = nextLevelScore;
                nextVipBenefit.maxBorrowMoney = Packet.Buffer.readInt();
                nextVipBenefit.mnTransferPercent = Packet.Buffer.readByte();
                nextVipBenefit.mnBoxPercent = Packet.Buffer.readByte();
                nextVipBenefit.paymentBonus = Packet.Buffer.readInt();
                nextVipBenefit.FBinviteBonus = Packet.Buffer.readInt();
                if(nextVipBenefit.FBinviteBonus < Util.getFriendCost()) {
                    nextVipBenefit.FBinviteBonus = Util.getFriendCost();
                }
            }
            var vipBenefit = {currVipBenefit:currVipBenefit,nextVipBenefit:nextVipBenefit};
            this.pushOnLoadComplete(vipBenefit,VC.VIP_BENEFIT);
        }
    },
    getVipBenefitDetailsReturn:function (Packet) {
        if(Packet.Buffer.isReadable())
        {
            var vipBenefiti = new VvVipBenefitInfo();
            vipBenefiti.maxBorrowMoney = -1;
            vipBenefiti.mnTransferPercent = -1;
            vipBenefiti.mnBoxPercent = 0;
            vipBenefiti.paymentBonus = 0;
            vipBenefiti.FBinviteBonus = Util.getFriendCost();

            listDataVipBenefit.push(vipBenefiti);

            for(var i = 0; i < 10; i++)
            {
                vipBenefiti = new VvVipBenefitInfo();

                vipBenefiti.maxBorrowMoney = Packet.Buffer.readInt();
                vipBenefiti.mnTransferPercent = Packet.Buffer.readByte();
                vipBenefiti.mnBoxPercent = Packet.Buffer.readByte();
                vipBenefiti.paymentBonus = Packet.Buffer.readInt();
                vipBenefiti.FBinviteBonus = Packet.Buffer.readInt();
                var vlInviSetting = Util.getFriendCost();
                if (cc.game.config.app && cc.game.config.app.inviteFrBonus) {
                    vlInviSetting = cc.game.config.app.inviteFrBonus;
                }
                if(vipBenefiti.FBinviteBonus < vlInviSetting) {
                    vipBenefiti.FBinviteBonus = vlInviSetting;
                }

                listDataVipBenefit.push(vipBenefiti);
            }
        }

        this.pushOnLoadComplete(null,VC.VIP_BENEFIT_DETAIL);
    },
    getVipTransferInfo:function (Packet) {
        var tax = Packet.Buffer.readByte();
        var minTranfer = Packet.Buffer.readInt();
        var o = {tax:tax,minTranfer:minTranfer};
        this.pushOnLoadComplete(o,VC.VIP_TRANSFER_INFO);
    },
    vipTransferMoneyReturn:function (Packet) {
        var transferResult = Packet.Buffer.readByte();
        var o = {transferResult:transferResult};
        this.pushOnLoadComplete(o,VC.VIP_TRANSFER_MONEY);
    },
	getVipBorrowInfoReturn:function(Packet){
        var maxBorrowMoney = Packet.Buffer.readInt();
        var currentBorrowMoney = Packet.Buffer.readInt();
        var deadLine =  Packet.Buffer.readLong();
        var minBorrowMoney = Packet.Buffer.readInt();

        var obj = {maxBorrowMoney:maxBorrowMoney, currentBorrowMoney:currentBorrowMoney,deadLine:deadLine*1000, minBorrowMoney:minBorrowMoney};
        this.pushOnLoadComplete(obj,VC.VIP_BORROW_INFO);
    },
    vipBorrowMoneyReturn:function(Packet){
        var result = Packet.Buffer.readByte();
        var deadLine = 0;
        if(result == 0)
        {
            deadLine = Packet.Buffer.readLong();
        }

        var obj = {result:result, deadline:deadLine*1000};
        this.pushOnLoadComplete(obj,VC.VIP_BORROW_MONEY);
    },
    getVipBorrowNotifyReturn:function(Packet){
        var currentBorrowMoney = Packet.Buffer.readInt();
        var maxBorrowMoney = Packet.Buffer.readInt();
        var deadLine =  Packet.Buffer.readLong();
        var currentMoneyBox = Packet.Buffer.readInt();
        var needRepay = (Packet.Buffer.readByte() == 1);

        var obj = {currentBorrowMoney:currentBorrowMoney, maxBorrowMoney:maxBorrowMoney,deadLine:deadLine*1000, currentMoneyBox:currentMoneyBox, needRepay:needRepay};
        // show qua han window
        var layer = new VvVipNotifyMoneyBorrowWindow(obj);
        layer.showWithParent();
    },
    getNewVipLevel:function (Packet) {
        var newVipLV = Packet.Buffer.readByte();
        BkGlobal.UserInfo.VipLevel = newVipLV;
        var str = "Chúc mừng bạn đã trở thành VIP "+newVipLV;
        showToastMessage(str,cc.winSize.width/2,cc.winSize.height/2,5);
        var crLayer = this.getGui().getGameLayer();
        crLayer.updateImgVip();
    },
    processVipEvent:function (Packet) {
        var funcType = Packet.Buffer.readByte();
        if(funcType == VC.VIP_BENEFIT)
        {
            this.getVipBenefitReturn(Packet);
            return;
        }

        if(funcType == VC.VIP_BENEFIT_DETAIL)
        {
            this.getVipBenefitDetailsReturn(Packet);
            return;
        }

        if(funcType == VC.VIP_TRANSFER_INFO)
        {
            this.getVipTransferInfo(Packet);
            return;
        }

        if(funcType == VC.VIP_TRANSFER_MONEY)
        {
            this.vipTransferMoneyReturn(Packet);
            return;
        }

        if(funcType == VC.VIP_BORROW_INFO)
        {
            this.getVipBorrowInfoReturn(Packet);
            return;
        }
        if(funcType == VC.VIP_BORROW_MONEY)
        {
            this.vipBorrowMoneyReturn(Packet);
            return;
        }
        if(funcType == VC.VIP_BORROW_NOTIFY)
        {
            this.getVipBorrowNotifyReturn(Packet);
            return;
        }
        if(funcType == VC.VIP_RETURN_BORROWED_MONEY)
        {
            var payResult = Packet.Buffer.readByte();
            if(payResult == 0)
            {
                var returnMoney = Packet.Buffer.readInt();
                this.pushOnLoadComplete(returnMoney,VC.VIP_RETURN_BORROWED_MONEY);
            }else if(payResult == 1)
            {
                showToastMessage("Bạn không vay quan từ hệ thống",300,300);

            }else if(payResult == 2)
            {
                showToastMessage("Bạn không đủ quan để trả",300,100);
            }
            return;
         }

        if(funcType == VC.VIP_LEVEL_CHANGE) {
            this.getNewVipLevel(Packet);
            return;
        }

        if(funcType == VC.VIP_INVITE_FRIEND_MONEY) {
            var newMoney = Packet.Buffer.readInt();
            BkConstants.FRIEND_COST = newMoney;
            var bonusWindow = new VvBonusWindow();
            bonusWindow.showWithParent();
            return;
        }
    },
    initPaymentBonusWD:function (bonusPercent,header,body1,body2,duration,numBtn,func,strUrl) {
        var layer = new VvPaymentBonusWindow(bonusPercent,header,body1,body2,duration,numBtn,func,strUrl);
        layer.showWithParent();
    },
    initNotifyContentWD:function (strContent,numberButton,funcBtn1,strWeb1,funcBtn2,strWeb2) {
        var layer = new VvNotifyContentWindow(strContent,numberButton,funcBtn1,strWeb1,funcBtn2,strWeb2);
        layer.showWithParent();
    },
    storePacket:null,
    processNotifyPaymentBonus:function (Packet) {
        this.storePacket = Packet;
        if (BkGlobal.currentGS == GS.WAITTING_JOIN_ROOM_FROM_INGAME){
            logMessage("BkGlobal.currentGS == GS.WAITTING_JOIN_ROOM_FROM_INGAME -> store function");
            return;
        }

        var crSce = getCurrentScene();
        if (crSce){
            if (crSce.getGameLayer) {
            } else {
                return;
            }
        }

        var type = Packet.Buffer.readByte();
        var bonusPercent;
        if(type == 2) {
            bonusPercent = Packet.Buffer.readInt();
            logMessage("bonusPercent "+bonusPercent);
            var header = Packet.Buffer.ReadString();
            var body1 = Packet.Buffer.ReadString();
            var body2 = Packet.Buffer.ReadString();
            var duration = Packet.Buffer.readInt();
            var func = -1;
            var numBtn = 1;
            var strUrl = "";
            if (Packet.Buffer.isReadable()){
                numBtn = Packet.Buffer.readByte();
                if (numBtn == 2){
                    func = Packet.Buffer.readByte();
                    if (func == 7){
                        strUrl = Packet.Buffer.ReadString();
                    }
                }
            }
            this.initPaymentBonusWD(bonusPercent,header,body1,body2,duration,numBtn,func,strUrl);
            this.storePacket = null;

            var bonusByType = Util.getBonusPercent(BkGlobal.addMoneyBonusType);
            BkGlobal.addMoneyBonusType = Util.getBonusType(bonusPercent);
            BkGlobal.paymentBonusPercent = Math.max(bonusPercent,bonusByType);

            this.updatePaymentBonusSticker();
        }else if(type == 1) {
            bonusPercent = Packet.Buffer.readInt();
            logMessage("bonusPercent "+bonusPercent);
            var bonusByType = Util.getBonusPercent(BkGlobal.addMoneyBonusType);
            BkGlobal.addMoneyBonusType = Util.getBonusType(bonusPercent);
            BkGlobal.paymentBonusPercent = Math.max(bonusPercent,bonusByType);
            this.updatePaymentBonusSticker();
        }else if(type == 3) {
            var numberButton = Packet.Buffer.readByte();
            var funcBtn1 = Packet.Buffer.readByte();
            var strWeb1 = "";
            if (funcBtn1 == 7){
                strWeb1 = Packet.Buffer.readString();
            }
            var funcBtn2 = -1;
            var strWeb2 = "";
            if (numberButton == 2){
                funcBtn2 = Packet.Buffer.readByte();
                if (funcBtn2 == 7){
                    strWeb2 = Packet.Buffer.readString();
                }
            }
            var strContent = Packet.Buffer.readString();
            this.initNotifyContentWD(strContent,numberButton,funcBtn1,strWeb1,funcBtn2,strWeb2);
        }
    },
    updatePaymentBonusSticker:function () {
        var crSce = getCurrentScene();
        if (crSce){
            if (crSce.getGameLayer) {
                crSce.getGameLayer().addPaymentBonusSticker();
            }
        }
    },
    updateGagop:function (tableID,isHasGagop) {
        var crSce = getCurrentScene();
        if (crSce instanceof  VvLobby){
            crSce.getGameLayer().updateGagop(tableID,isHasGagop);
        }
    },
    processUpdateLuatUTable:function (Packet) {
        if (this.lobbyData == null) {
            logMessage("onReceive packet before receiving packet get list table -> reject packet");
            return;
        }
        var tableID = Packet.Buffer.readByte();
        var LuatUGaInfo = Packet.Buffer.readByte();
        var iHasGagop = (LuatUGaInfo & 1);
        var isBaicMode = (((LuatUGaInfo & 4)>>2) == 0);
        var is411 = (((LuatUGaInfo & 8)>>3) == 1);
        // update data logic
        this.lobbyData.updateLuatUGa(tableID,iHasGagop,isBaicMode,is411);
        // update UI
        var crScene = this.getGui();
        if (crScene instanceof VvLobby){
            crScene.getGameLayer().updateLuatUGa(tableID,iHasGagop,isBaicMode,is411);
        }

    },
    processUpdatePlayerNameReturn:function (packet) {
        var result = packet.Buffer.readByte();
        this.pushOnLoadComplete(result, packet.Type);
    },
    processNotifyAddMoney:function (packet) {
        var mnChange = packet.Buffer.readInt();
        var strReason = packet.Buffer.readString();
        var curMoney = BkGlobal.UserInfo.getMoney();
        BkGlobal.UserInfo.setMoney(curMoney+mnChange);
        this.processUpdateProfileUI();
        showPopupMessageWith(strReason,"Thông báo");
    },
    /*
     * handle all normal event
     * */
    processNetworkEvent: function (packet) {
        if ((packet.Type != -42) && (packet.Type != 46)) {
            logMessage("BkCommonLogic -> processNetworkEvent " + packet.Type);
        }

        /*
         if (BkGlobal.currentGS != GS.CHOOSE_GAME && BkGlobal.currentGS != GS.CHOOSE_TABLE) {
         logMessage("Not process event because not correct zone");
         return;
         }
         */

        var self = this;
        switch (packet.Type) {

            case c.NETWORK_JOIN_CHAN_GAME:
                this.processJoinChanGameReturn(packet);
                break;

            case c.ANY:
                break;
            case c.NETWORK_LOG_IN_SUCCESS:
                /*
                if(!bk.isFbApp) {
                    var currS = getCurrentScene();
                    if (currS != undefined && currS instanceof BkPrepareGame) {
                        currS.visibleLoginFormLayer();
                    }
                }
                if (bk.isSubFbApp){
                    self.isDoneLoadRes = true;
                    processLoadingBaseRes(function(){
                        self.onLoginSuccess(packet);
                    });
                } else {
                    self.onLoginSuccess(packet);
                    /*
                    processLoadingResAfterLoginSuccess(function () {
                        self.onLoginSuccess(packet);
                    });
                 }
                    */
                if(bk.isFbApp)
                {

                    Util.logEvent(EVENT_LOGIN,KEY_CPID,bk.cpid);
                }
                self.onLoginSuccess(packet);
                break;
            case c.NETWORK_LOG_IN_FAILURE:
                logMessage("LOG_IN_FAILURE");
                this.pushOnLoadComplete(null, packet.Type);
                processLoginRegistFailEx();
                break;
            case c.NETWORK_REGISTER_FAILURE:
                logMessage("NETWORK_REGISTER_FAILURE");
                //this.onRegisterFailure(packet);
                //If auto register fail, return login form
                if(Util.isAutoCreateAccount() &&  BkGlobal.isAutoCreateAccount){
                    hideProgressModalEx();
                    switchToSceneWithGameState(GS.PREPARE_GAME);
                    return;
                }
                this.pushOnLoadComplete(packet, packet.Type);
                break;
            case c.NETWORK_FORGOT_PASSWORD:
                //Recovery pass by phone
                this.pushOnLoadComplete(null, packet.Type);
                break;
            case c.NETWORK_FORGOT_PASSWORD_RETURN:
                //Recovery pas by client Id
                var currentPassword = packet.Buffer.readString();
                this.pushOnLoadComplete(currentPassword, packet.Type);
                //showRecoveryPassResult(currentPassword);
                break;
            case c.NETWORK_WRONG_USERNAME_OR_CLIENT_ID:
                this.pushOnLoadComplete(null, packet.Type);
                //showRecoveryPassResult();
                break;
            case c.NETWORK_REGISTER_EXCEED_MAX:
                //processLoginRegistFailEx("Đăng ký vượt quá giới hạn ngày hôm nay");
                this.pushOnLoadComplete(null, packet.Type);
                break;
            case c.NETWORK_AUTO_FIND_TABLE_NOT_FOUND_RETURN:
                logMessage("NETWORK_AUTO_FIND_TABLE_NOT_FOUND_RETURN");
                showToastMessage(BkConstString.STR_AUTO_FIND_TABLE_FOUND, cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2);
                break;
            case c.NETWORK_TABLE_JOIN_SUCCESS:
                logMessage("NETWORK_TABLE_JOIN_SUCCESS");
                BkLogicManager.getLogic().ProcessTableJoinSuccess(packet);
                break;
            case c.NETWORK_TABLE_JOIN_FAILURE:
                // Table Join failure
                this.processTableJoinFailure(packet);
                break;
            case c.NETWORK_GAME_JOIN_SUCCESS:
                logMessage("NETWORK_GAME_JOIN_SUCCESS");
                BkGlobal.currentGameID = this.crGame;
                BkLogicManager.initGameLogic();
                BkLogicManager.getLogic().ProcessGetRoomByRoomType(0);
                break;
            case c.NETWORK_GET_GAME_ROOMS_BY_ROOM_TYPE_RETURN:
                logMessage("NETWORK_GET_GAME_ROOMS_BY_ROOM_TYPE_RETURN");
                BkLogicManager.getLogic().ProcessGetRoomData(packet);
                break;
            case c.NETWORK_ROOM_JOIN_SUCCESS:
                logMessage("NETWORK_ROOM_JOIN_SUCCESS");
                BkLogicManager.getLogic().ProcessOnJoinRoomSuccess(packet);
                break;
            case c.NETWORK_TIME_OUT_LEAVE:
                logMessage("NETWORK_ROOM_JOIN_SUCCESS");
                break;
            case c.NETWORK_ROOM_TABLES_UPDATE:
                logMessage("NETWORK_ROOM_TABLES_UPDATE");
                BkLogicManager.getLogic().ProcessOnRoomTablesUpdate(packet);
                break;
            case c.NETWORK_MAIN_PROFILE_RETURN:
                logMessage("NETWORK_MAIN_PROFILE_RETURN");
                this.onMainProfileReturn(packet);
                break;
            case c.NETWORK_PROFILE_RETURN:
                logMessage("NETWORK_PROFILE_RETURN");
                this.onProfileReturn(packet);
                break;
            case c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN:
                logMessage("NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN");
                this.onPlayerAchievementReturn(packet);
                break;
            case c.NETWORK_UPDATE_PASSWORD_FAILED:
            case c.NETWORK_UPDATE_PASSWORD_SUCCESS:
                this.pushOnLoadComplete(null, packet.Type);
                break;
            case c.NETWORK_SELECT_AVATAR_SUCCESS:
                this.pushOnLoadComplete(null, packet.Type);
                this.processUpdateProfileUI();
                break;
            case c.NETWORK_UPDATE_PROFILE_SUCCESS:
                this.pushOnLoadComplete(null, packet.Type);
                break;
            case c.NETWORK_GET_CHAMPION_LIST_RETURN:
                logMessage("NETWORK_GET_CHAMPION_LIST_RETURN");
                var leaderList = [];
                while (packet.Buffer.isReadable()) {
                    var o = new BkLeaderBoardData(packet.Buffer.readByte(), packet.Buffer.readString());
                    logMessage("Type " + o.type + " champion " + o.leaderName);
                    if (o.typeName != undefined && o.gid != GID.MAU_BINH) { // remove All MauBinh
                        leaderList.push(o);
                    }
                }
                this.pushOnLoadComplete(leaderList, packet.Type);
                break;
            case c.NETWORK_TOP_U_TO_RETURN:
                this.ProcessTopUToReturn(packet);
                break;
            case c.NETWORK_GET_TOP_PLAYER_RETURN:
                logMessage("NETWORK_GET_TOP_PLAYER_RETURN");
                this.processTopPlayerReturn(packet);
                break;
            case c.GET_TOP_RICHEST_CHAN_PLAYER:
                this.processTopRichestChan(packet);
                break;
            case c.NETWORK_GET_TOP_RICHEST_PLAYER_RETURN:
                this.processTopRichestPlayerReturn(packet);
                logMessage("NETWORK_GET_TOP_RICHEST_PLAYER_RETURN");
                break;
            case c.NETWORK_PLAYER_ITEMS_RETURN:
                logMessage("NETWORK_PLAYER_ITEMS_RETURN");
                this.onPlayerItemReturn(packet);
                break;
            case c.NETWORK_GET_FRIENDS_RETURN:
                logMessage("NETWORK_GET_FRIENDS_RETURN");
                this.processGetFriendsListReturn(packet);
                break;
            case c.NETWORK_FRIEND_SEARCH_BY_USERNAME:
                logMessage("NETWORK_FRIEND_SEARCH_BY_USERNAME");
                this.processSearchFriendReturn(packet);
                break;
            case c.NETWORK_ACCEPT_FRIEND_SUCCESS:
            case c.NETWORK_REMOVE_FRIEND_SUCCESS:
            case c.NETWORK_REQUEST_FRIEND_SUCCESS:
                this.processFriendsListReturnState(packet);
                logMessage("processFriendsListReturnState");
                break;
            case c.NETWORK_JOIN_FRIEND_TABLE_FAILURE:
                this.processJoinFriendTableFailure(packet);
                break;
            case c.NETWORK_LUCKY_BOX_REQUEST_RETURN:
                this.processLuckyBoxRequestReturn(packet);
                logMessage("NETWORK_LUCKY_BOX_REQUEST_RETURN");
                break;
            case c.NETWORK_FACEBOOK_INVITE_FRIENDS:
                this.processFacebookInviteFriendBonusReturn(packet);
                break;
            case c.NETWORK_GET_FACEBOOK_INVITE_FRIENDS:
                this.processFacebookInvitedListReturn(packet);
                break;
            case c.NETWORK_UPDATE_PRIVATE_KEY:
                this.savePrivateKey(packet);
                break;
            case c.NETWORK_GET_DAILY_TASK_LIST_RETURN:
                var dailyTaskList = this.getDailyTaskListReturn(packet);
                this.pushOnLoadComplete(dailyTaskList, packet.Type);
                break;
            case c.NETWORK_REQUEST_DAILY_TASK_BONUS_RETURN:
                var bonusTask = this.getDailyTaskBonus(packet);
                this.pushOnLoadComplete(bonusTask, packet.Type);
                break;
            case c.NETWORK_CONTENT_PROVIDER_INFO_RETURN:
                this.processContentProviderInfoReturn(packet);
                break;
            case c.NETWORK_CHECK_GOOGLE_IAP:
            	this.processCheckGooogleIAPReturn(packet);
            	break;
            case c.NETWORK_NAP_THE_CAO_BANNED:
            case c.NETWORK_NAP_THE_CAO_FAILED:
            case c.NETWORK_SERVICE_NAP_THE_BUSY:
                this.pushOnLoadComplete(packet, packet.Type);
                break;
            case c.NETWORK_NAP_THE_CAO_SUCCESS:
                var totalMoney = packet.Buffer.readInt();

                while (packet.Buffer.isReadable())
                {
                    var realMoney = packet.Buffer.readInt();
                    Util.logPurchase(realMoney,"Thecao");
                }
                if (BkGlobal.currentGS == GS.CHOOSE_GAME || BkGlobal.currentGS == GS.CHOOSE_TABLE) {
                    BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + totalMoney);
                    this.getGui().updateAvatar(BkGlobal.UserInfo);
                    if(this.onLC == null){
                        var strConfirm = "Nạp thẻ thành công.\nBạn được cộng " + totalMoney + BkConstString.getGameCoinStr() + " vào tài khoản.";
                        BkDialogWindowManager.showPopupWith(strConfirm,"Thông báo",null,null,null,TYPE_MESSAGE_BOX,null);
                        break;
                    }
                }
                if (BkGlobal.currentGS == GS.INGAME_GAME) {
                    logMessage("nap the ingame");
                    var myClientState = BkLogicManager.getInGameLogic().getMyClientState();
                    if (myClientState != null){
                        BkLogicManager.getInGameLogic().increaseCash(myClientState, totalMoney, "Nạp thẻ thành công.");
                    } else {
                        BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + totalMoney);
                    }

                    if(this.onLC == null){
                        BkLogicManager.getInGameLogic().getGameLayer().setVisibleCountDownText(false);
                        var strConfirm = "Nạp thẻ thành công.\nBạn được cộng " + totalMoney + BkConstString.getGameCoinStr() + " vào tài khoản.";
                        showPopupMessageWith(strConfirm,"Thông báo",function () {

                        },function () {
                            BkLogicManager.getInGameLogic().getGameLayer().setVisibleCountDownText(true);
                        });
                        break;
                    }
                }

                this.pushOnLoadComplete(totalMoney, packet.Type);
                break;
            case c.NETWORK_INBOX_MAILS_RETURN:
                logMessage("NETWORK_INBOX_MAILS_RETURN");
                this.processGetMailInboxListReturn(packet);
                break;
            case c.NETWORK_OUTBOX_MAILS_RETURN:
                logMessage("NETWORK_OUTBOX_MAILS_RETURN");
                this.processGetMailOutboxListReturn(packet);
                break;
            case c.NETWORK_PLAYER_NOT_EXIST:
            case c.NETWORK_SEND_MAIL_SUCCESS:
                this.processSendMailReturn(packet.Type);
                break;
            case c.NETWORK_MAIL_RETURN:
                logMessage("NETWORK_MAIL_RETURN");
                this.processGetMailReturn(packet);
                break;
            case c.NETWORK_GET_ITEM_INFO:
                this.processGetItemInfoReturn(packet);
                break;
            case c.NETWORK_BUY_ITEM_SUCCESS:
                logMessage("NETWORK_BUY_ITEM_SUCCESS");
                this.processBuyItemSuccess(packet);
                break;
            case c.NETWORK_BUY_ITEM_FAILURE:
                logMessage("NETWORK_BUY_ITEM_FAILURE");
                this.processBuyItemFail(packet);
                break;

            case c.NETWORK_JOIN_WEB_GAME_ROOM:
                this.onJoinWebGameRoom(packet);
                break;

            case c.NETWORK_GAME_LEAVE_SUCCESS:
                Util.removeAnim();
                BkLogicManager.setGameLogic(null);
                BkGlobal.currentGameID = -1;
                BkGlobal.currentRoomID = -1;
                BkGlobal.currentTableID = -1;
                switchToSceneWithGameState(GS.CHOOSE_GAME, true);
                break;

            case c.NETWORK_TABLE_STATUS_CHANGE:
                this.onTableStatusChange(packet);
                break;
            case c.NETWORK_TABLE_SIZE_UPDATE_PUSH:
                this.onTableSizeUpdatePush(packet);
                break;

            case c.NETWORK_TABLE_SETTINGS_UPDATE_PUSH:
                this.onTableSettingUpdatePush(packet);
                break;
            case c.NETWORK_RECEIVE_INVITATION:
                this.processReceiveInvitation(packet);
                break;
            case c.NETWORK_ADMIN_CHANGED_MONEY_RETURN:
                var moneyChange = packet.Buffer.readInt();
                if(packet.Buffer.isReadable())
                {
                    var adminMoneyType = packet.Buffer.readByte();
                    if(adminMoneyType == 1)
                    {
                        this.updateMyMoney(moneyChange, AM.TYPE_PAY_BET_FOOTBALL_WIN_MONEY);
                    }
                }else
                {
                    this.updateMyMoney(moneyChange, AM.TYPE_ADMIN_ADD);
                }
                break;
            case c.NETWORK_ADD_MONEY_RETURN:
                var moneyAdd = packet.Buffer.readInt();
                this.pushOnLoadComplete(moneyAdd, packet.Type);
                this.updateMyMoney(moneyAdd, AM.TYPE_SMS_ADD);
                while(packet.Buffer.isReadable())
                {
                    var realMoney = packet.Buffer.readInt();
                    var moneyType = packet.Buffer.readByte();
                    if(moneyType == 0)
                    {
                        Util.logPurchase(realMoney,"SMS");
                    }else if(moneyType == 1)
                    {
                        Util.logPurchase(realMoney,"SMS+");
                    }else if(moneyType == 2)
                    {
                        Util.logPurchase(realMoney,"Thecao");
                    }
                }
                break;
            case c.NETWORK_KDL:
                this.processOnReceiveKDL(packet);
                break;
            case c.NETWORK_SEND_MESSAGE_TO_CLIENT:
                this.processReceiveMessageToClient(packet);
                break;
            case c.NETWORK_SERVER_REQUEST:
                this.processReceiveServerRequestMessage(packet);
                break;
            case c.NETWORK_ON_HAS_ALLOW_KICK_WAND:
                BkGlobal.UserInfo.setHasAllowKickWand(true);
                break;
            case c.NETWORK_LOG_IN_FACEBOOK:
            case c.NETWORK_SETUP_FACEBOOK_ACCOUNT:
            case c.NETWORK_SETUP_CHAN_TABLE:
                this.processUpdateLuatUTable(packet);

                logMessage("process NETWORK_SETUP_CHAN_TABLE, type: " + c.NETWORK_SETUP_CHAN_TABLE);
                break;
            case c.NETWORK_SEND_TOKEN_TO_PHONE:
            // case c.NETWORK_VALID_PLAYER_BY_PHONE_CHECK_AND_SEND_TOKEN:
            case c.NETWORK_UPDATE_PHONE_NUMBER:
                this.processRegisterPhoneNumber(packet);
                break;
            case c.NETWORK_BET_LOTTE_TICKET:
                this.processLodeReturn(packet);
                break;
            case c.NETWORK_BET_FOOTBALL_RETURN:
                if(BkGlobal.currentGS == GS.CHOOSE_GAME)
                {
                    this.processBetFootballReturn(packet);
                    break;
                }
            case c.NETWORK_VIP_FUNCTION:
                this.processVipEvent(packet);
                break;
            case c.NETWORK_NOTIFY_PAYMENT_BONUS:
                this.processNotifyPaymentBonus(packet);
                break;
            case c.NETWORK_CHANGE_GA_GOP_PUSH:
                this.updateGagop(packet.Buffer.readByte(),packet.Buffer.readByte());
                break;
            case c.NETWORK_NOTIFY_ADD_MONEY:
                this.processNotifyAddMoney(packet);
                break;
            case c.UPDATE_PLAYER_NAME:
                if(BkGlobal.currentGS == GS.CHOOSE_GAME || BkGlobal.currentGS == GS.CHOOSE_TABLE)
                {
                    this.processUpdatePlayerNameReturn(packet);
                    break;
                }
            case c.NETWORK_UPDATE_STATUS:
            	{
            		SessionManager.isForceSP = packet.Buffer.readByte();
            		logMessage("NETWORK_UPDATE_STATUS:" + SessionManager.isForceSP);
            	}
            case c.NETWORK_CLIENT_SETTING:
        	{
            	//Vinh Need to check this as the parseSetting requires parsed JSON as input param  
        		var strSetting = packet.Buffer.readString();
        		var parsedObj = JSON.parse(strSetting)
        		ServerSettings.parseSetting(parsedObj);
        		SessionManager.isInsideVietnam = isInVN();
        		logMessage("NETWORK_CLIENT_SETTING:" + parsedObj);
        		
        	}
            default:
            {
                logMessage("BkLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    }
});
