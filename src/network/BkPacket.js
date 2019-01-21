/**
 * Created by bs on 29/09/2015.
 */

//var HEADER_SIZE = 7;
//var CONTENT_SIZE = 1000;
// var HEADER_SIZE = 3;
var HEADER_SIZE = 7;

BkPacket = cc.Class.extend({
    Header: null,
    Buffer: null,
    Length: null,
    Type: null,
    Index: null,

    ctor: function () {
        this.Header = new BkBuffer();
        this.Buffer = new BkBuffer();
    },
    // VV functions
    createPacketJoinChanGameRoom: function(roomTypeId, roomId){
        if (roomId === undefined) {
            roomId = -1;
        }
        // Set Type
        this.Type = c.NETWORK_JOIN_CHAN_GAME;

        // Buffer
        this.Buffer.writeByte(roomTypeId);
        this.Buffer.writeByte(roomId);

        this.Length = HEADER_SIZE + 2 - 2;
        this.CreateHeader();
    },

    getConentPacketSend: function () {
        var rtnArray = new Int8Array(HEADER_SIZE + this.Buffer.position);
        var i;
        for (i = 0; i < HEADER_SIZE; i++) {
            rtnArray[i] = this.Header.Buf[i];
        }

        for (i = 0; i < this.Buffer.position; i++) {
            rtnArray[i + HEADER_SIZE] = this.Buffer.Buf[i];
        }
        var dataSend = "|";
        for (i = 0; i < rtnArray.length; i++) {
            dataSend += rtnArray[i] + "|";
        }
        logMessage("data send " + dataSend);
        logMessage("send packet: Type = "+this.Type);
        return rtnArray;
    },
    parsePacketWithBuffer: function (buffPacket) {
        // Debug
        var i = 0;
        var strBuff = "";
        for (i=0; i< buffPacket.length; i++) {
            strBuff += "|" + buffPacket[i];
        }
        logMessage("Raw buffPacket: " + strBuff);

        for (i = 0; i < HEADER_SIZE; i++) {
            this.Header.Buf[i] = buffPacket[i];
        }

        for (i = 0; i < buffPacket.length - HEADER_SIZE; i++) {
            this.Buffer.writeByte(buffPacket[i + HEADER_SIZE]);
        }
        this.Length = this.Header.readShort();
        this.Type = this.Header.readByte();
        this.Index = this.Header.readInt();
        //this.Buffer.position = this.Buffer.Buf.length;
    },
    toString: function () {
        var headerStr = this.Header.toString() + " [Type :" + this.Type + "] [Length : " + this.Length + "] [Index: " + this.Index + "]";
        var content = this.Buffer.toString();
        var rtn = "Header: " + headerStr + "\nContent: " + content;
        return rtn;
    },
    CreateHeader: function () {
        this.Header.writeShort(this.Length);
        this.Header.writeByte(this.Type);
        if (this.Index == null){
            this.Index = 0;
        }
        this.Header.writeInt(this.Index)
    },
    createLoginPacket: function (user, pass, clientID) {
        logMessage("c.NETWORK_LOG_IN " + c.NETWORK_LOG_IN + "clientID:" + clientID);
        BkGlobal.clientID = clientID;
        this.Type = c.NETWORK_LOG_IN;
        var userLength = this.Buffer.writeString(user);
        var passLength = this.Buffer.writeString(pass);
        var clientIDLength = this.Buffer.writeString(clientID);
        this.Length = HEADER_SIZE + userLength + passLength + clientIDLength - 2;
        this.Index = 0;
        this.CreateHeader();
    },
    CreatePacketRegister: function (userName, pass, contentProviderId, iClientID, macAdd) {
        this.Type = c.NETWORK_REGISTER_USER;
        var lengUserName = this.Buffer.writeString(userName);
        var lengPass = this.Buffer.writeString(pass);
        var lengiClientID = this.Buffer.writeString(iClientID);
        logMessage("REGISTER CLIENT ID: " + iClientID);
        this.Buffer.writeInt(contentProviderId);
        var lengMacAdd = this.Buffer.writeString(macAdd);
        this.Length = HEADER_SIZE - 2 + lengUserName + lengPass + lengiClientID + 4 + lengMacAdd;
        //TODO: subProvider
        this.CreateHeader();
    },
    CreatePacketForgetPassword: function (username, clientID) {
        this.Type = c.NETWORK_FORGOT_PASSWORD;
        var lengUserName = this.Buffer.writeString(username);
        var lengClientID = this.Buffer.writeString(clientID);
        this.Length = HEADER_SIZE - 2 + lengUserName  + lengClientID;
        this.CreateHeader();
    },

    CreatePacketFbInviteFriends: function (userID,data) {
        this.Type = c.NETWORK_GET_FACEBOOK_INVITE_FRIENDS;
        var lengfacebookId = this.Buffer.writeString(userID);
        var lenguserName = 0;
        var length = data.data.length;
        this.Buffer.writeByte(length);
        for(var i = 0; i < length; i++)
        {
            var name = data.data[i].name;
            if(name != undefined)
            {
                lenguserName = lenguserName + this.Buffer.writeString(data.data[i].name);
            }
        }
        this.Length = HEADER_SIZE - 2 + 1 + lengfacebookId + lenguserName;
        this.CreateHeader();
    },

    /*
    * @subEvent refer fb.SUBEVENT_xxx
    * */
    CreatePacketLoginFacebook: function (facebookId, facebookToken, contentProviderId, clientID, macAdd) {
        //logMessage("facebookId: " + facebookId+ " facebookToken"+ facebookToken+" contentProviderId "+ " clientID "+ clientID+ " macAdd "+macAdd);
        this.Type = c.NETWORK_LOG_IN_FACEBOOK;
        var lfId = this.Buffer.writeString(facebookId);
        var lfToken = this.Buffer.writeString(facebookToken);
        var lClientID = this.Buffer.writeString(clientID);
        this.Buffer.writeInt(contentProviderId);
        this.Length = HEADER_SIZE +lfId + lfToken + lClientID + 2;
        this.CreateHeader();
    },

    CreatePacketLoginFbLinkLogin: function (user, pass, fbId, asTk) {
        this.Type = c.NETWORK_LOG_IN_FACEBOOK;
        this.Buffer.writeByte(fb.SUBEVENT_LINK_PLAYER);
        var fbIdLength = this.Buffer.writeString(fbId);
        var asTkLength = this.Buffer.writeString(asTk);
        var userLength = this.Buffer.writeString(user);
        var passLength = this.Buffer.writeString(pass);
        var clientIdLength = this.Buffer.writeString(cc.bkClientId);
        logMessage("FB link user clientID: " + cc.bkClientId)
        this.Length = HEADER_SIZE - 2 + 1 + fbIdLength + asTkLength + userLength + passLength + clientIdLength;
        this.CreateHeader();
    },

    CreatePacketLoginFbLinkSetup: function (user, pass) {
        this.Type = c.NETWORK_SETUP_FACEBOOK_ACCOUNT;
        this.Buffer.writeByte(fb.SUBEVENT_LINK_PLAYER);
        var userLength = this.Buffer.writeString(user);
        var passLength = this.Buffer.writeString(pass);
        this.Length = HEADER_SIZE - 2 +1+ userLength + passLength;
        this.CreateHeader();
    },
    CreatePacketLoginFbChangeName: function (newName) {
        // this.Type = c.NETWORK_SETUP_FACEBOOK_ACCOUNT;
        this.Type = c.UPDATE_PLAYER_NAME;
        // this.Buffer.writeByte(fb.SUBEVENT_RENAME);
        var userLength = this.Buffer.writeString(newName);
        this.Length = HEADER_SIZE - 2 + userLength;
        this.CreateHeader();
    },

    CreatePacketLoginFbCheckSetup: function () {
        this.Type = c.NETWORK_SETUP_FACEBOOK_ACCOUNT;
        this.Buffer.writeByte(fb.SUBEVENT_CHECK_ACCOUNT_SETUP);
        this.Length = HEADER_SIZE - 2 + 1;
        this.CreateHeader();
    },
    CreateJoinGame: function (gameID) {
        this.Type = c.NETWORK_GAME_JOIN;
        this.Buffer.writeByte(gameID);
        this.Length = HEADER_SIZE - 1;
        this.CreateHeader();
    },
    CreatTableJoinPacket: function (tableId,password) {
        this.Type = c.NETWORK_TABLE_JOIN;
        var lengBF = 1;
        this.Buffer.writeByte(tableId);
        if (password != undefined){
            if (password!= "") {
                //var lengPass = this.Buffer.writeString(password);
                lengBF += this.Buffer.writeString(password);
            }
        }
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },
    CreateLeaveTableAction: function (isInGame) {
        // Set Type
        this.Type = c.NETWORK_TABLE_LEAVE;

        // Buffer
        this.Buffer.writeByte(isInGame);

        // leng of packet
        this.Length = HEADER_SIZE + 1 - 2;

        // Set Index
        this.CreateHeader();
    },
    CreateBaCayBetMoneyAction: function (money) {
        this.Type = c.NETWORK_BET_BACAY;
        this.Length = HEADER_SIZE + 2;
        this.Buffer.writeInt(money);

        this.CreateHeader();
    },

    CreateRaiseMoneyAction: function (money) {
        this.Type = c.NETWORK_RAISE;
        this.Length = HEADER_SIZE + 2;
        this.Buffer.writeInt(money);

        this.CreateHeader();
    },

    CreateDiscardAction: function () {
        this.Type = c.NETWORK_DISCARD;
        this.Length = HEADER_SIZE - 2;

        this.CreateHeader();
    },
    CreateDiscardCards: function (selectedCards) {
        this.Type = c.NETWORK_DISCARD;
        var i;
        for (i = 0; i < selectedCards.length; i++) {
            var card = selectedCards[i];
            this.Buffer.writeByte(card.encode());
        }
        this.Length = HEADER_SIZE - 2 + selectedCards.length;
        this.CreateHeader();
    },

    // Chess
    CreateMovePiecePacket: function(startCol, startRow, finishCol, finishRow){
        this.Type = c.NETWORK_MOVE_PIECE;
        this.Buffer.writeByte(startCol);
        this.Buffer.writeByte(startRow);
        this.Buffer.writeByte(finishCol);
        this.Buffer.writeByte(finishRow);
        this.Length = HEADER_SIZE - 2 + 4;
        this.CreateHeader();
    },

    CreateChessOfferPacket: function(offer){
        this.Type = c.NETWORK_CHESS_OFFER;
        this.Buffer.writeByte(offer);
        this.Length = HEADER_SIZE - 2 + 1;
        this.CreateHeader();
    },

    CreateUpdateObserverStatusPacket: function(flag){
        this.Type = c.NETWORK_UPDATE_OBSERVER_STATUS;
        this.Buffer.writeByte(flag ? 1 : 0);
        this.Length = HEADER_SIZE - 2 + 1;
        this.CreateHeader();
    },

    CreateContinueGamePacket: function(flag){
        this.Type = c.NETWORK_CONTINUE_GAME;
        this.Length = HEADER_SIZE - 2;
        this.CreateHeader();
    },

    CreateSetupCoTablePacket: function(betMoney, chessRule){
        this.Type = c.NETWORK_SETUP_CO_TABLE;
        this.Buffer.writeInt(betMoney);
        this.Buffer.writeByte(chessRule);
        this.Length = HEADER_SIZE - 2 + 1 + 4;
        this.CreateHeader();
    },

    CreateGetTableInfo: function () {
        this.Type = c.NETWORK_GET_GAME_TABLE_INFO;
        this.Length = HEADER_SIZE - 2;
        this.CreateHeader();
    },
    GetTableInfoResult: function (o) {
        //var o =  { tableBetMoney:0, playerList:[]};
        o.tableBetMoney = this.Buffer.readInt();
        o.playerList = this.GetPlayersInfo();
    },
    GetPlayersInfo: function () {
        var PlayerList = [];
        while (this.Buffer.isReadable()) {
            var player = new BkPlayerInfoData();
            player.name = this.Buffer.ReadString();
            player.position = this.Buffer.readByte();
            player.status = this.Buffer.readByte();
            player.money = this.Buffer.readInt();
            player.avatarId = this.Buffer.readByte();
            player.level = this.Buffer.readInt();
            player.isMyFriend = (this.Buffer.readByte() == 1);
            if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
                player.isObserver = (this.Buffer.readByte() == 1);
            }
            PlayerList.push(player);
            logMessage("User Name:" + player.name + " Pos: " + player.position + " Status: " + player.status + " Money: " + player.money + " avatarId: " + player.avatarId + " level:" + player.level);
        }
        return PlayerList;
    },
    CreateUpdateUserInfoPacket: function(fullName, gender, eMail, birthDate, address, status) {
        this.Type = c.NETWORK_UPDATE_PROFILE;

        var lengBF = 0;
        var lengFullName = this.Buffer.writeString(fullName);
        lengBF += lengFullName;

        this.Buffer.writeByte(gender);
        lengBF += 1;

        var lengEmail = this.Buffer.writeString(eMail);
        lengBF += lengEmail;

        this.Buffer.writeLong(birthDate);
        lengBF += 8;

        var lengAddress = this.Buffer.writeString(address);
        lengBF += lengAddress;

        var lengStatus = this.Buffer.writeString(status);
        lengBF += lengStatus;

        this.Length = HEADER_SIZE - 2 + lengBF;

        this.CreateHeader();
    },
    CreatePacketUpdatePassword: function(pass, newPass){
        this.Type = c.NETWORK_UPDATE_PASSWORD;
        var lengPass = this.Buffer.writeString(pass);
        var lengNewPass = this.Buffer.writeString(newPass);
        this.Length = HEADER_SIZE - 2 + lengPass + lengNewPass;
        this.CreateHeader();
    },
    CreateFriendsListPacket: function () {
        this.Type = c.NETWORK_GET_FRIENDS;
        this.Length = HEADER_SIZE - 2;
        this.CreateHeader();
    },
    createPacketWithTypeAndByteData: function (t, bData) {
        this.CreatePacketWithTypeAndByteData(t, bData);
    },
    CreatePacketWithTypeAndByteData: function (t, bData) {
        this.Type = t;
        this.Buffer.writeByte(bData);
        this.Length = HEADER_SIZE + 1 - 2;
        this.CreateHeader();
    },
    CreatePacketWithOnlyType: function (t) {
        this.Type = t;
        this.Length = HEADER_SIZE - 2;
        this.CreateHeader();
    },
    CreateSendMailPacket: function (mailTitle, mailContent, receivers) {
        this.Type = c.NETWORK_SEND_MAIL;
        var lengthMailTitle = this.Buffer.writeString(mailTitle);
        var lengthMailContent = this.Buffer.writeString(mailContent);
        var lengthReceivers = this.Buffer.writeString(receivers);
        this.Length = HEADER_SIZE - 2 + lengthMailTitle + lengthMailContent + lengthReceivers;
        this.CreateHeader();
    },
    CreateGetMailPacket: function (mailId) {
        this.Type = c.NETWORK_GET_MAIL;
        var lengthMailId = this.Buffer.writeString(mailId);
        this.Length = HEADER_SIZE - 2 + lengthMailId;
        this.CreateHeader();
    },
    CreateDeleteMailPacket: function (mailId) {
        this.Type = c.NETWORK_DELETE_MAIL;
        var lengthMailId = this.Buffer.writeString(mailId);
        this.Length = HEADER_SIZE - 2 + lengthMailId;
        this.CreateHeader();
    },
    CreateSelectAvatarPacket: function(avatarId)
    {
        this.Type = c.NETWORK_SELECT_AVATAR;
        this.Buffer.writeByte(avatarId);
        this.Length = HEADER_SIZE  -2  + 1;
        this.CreateHeader();
    },
    CreateGetItemInfoPacket: function(itemId)
    {
        this.Type = c.NETWORK_GET_ITEM_INFO;
        var lenItemId = this.Buffer.writeByte(itemId);
        this.Length = HEADER_SIZE - 2 + 1;
        this.CreateHeader();
    },
    CreateBuyItemPacket: function (itemId){
        this.Type = c.NETWORK_BUY_ITEM;
        var lenItemId = this.Buffer.writeByte(itemId);
        this.Length = HEADER_SIZE - 2 + 1;
        this.CreateHeader();
    },
    ProcessGetItemInfo: function (obj) {
        while (this.Buffer.isReadable()) {
            var id = this.Buffer.readByte();
            var dayToLive = this.Buffer.readInt();
            var price = this.Buffer.readInt();
            obj.Id = id;
            obj.DayToLive = dayToLive;
            obj.Price = price;
        }
    },
    ProcessGetBoughtItemCost: function(obj){
        obj.itemCost =  this.Buffer.readInt();
    },
    ProcessBuyItemFailedReason: function(obj)
    {
        obj.reason = this.Buffer.readByte();
    },
    CreateGetProfilePacket: function (userName, mType, itemType) {
        // set Type
        this.Type = mType;

        // Buffer
        var userLength = this.Buffer.writeString(userName);
        if (itemType != undefined) {
            this.Buffer.writeByte(itemType);
            this.Length = HEADER_SIZE + userLength - 1;
        } else {
            this.Length = HEADER_SIZE + userLength - 2;
        }

        this.CreateHeader();
    },

    CreateInvitePlayerPacket:function (playerName) {
        this.Type = c.NETWORK_INVITE_PLAYER;
        //buffer
        var  LengthPlayerName =  this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + LengthPlayerName - 2;
        this.CreateHeader();
    },

    CreateRequestSearchFriend: function (playerName) {
        this.Type = c.NETWORK_FRIEND_SEARCH_BY_USERNAME;
        var lengBF = this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },

    ProcessSearchFriendReturn: function (playerList) {
        while (this.Buffer.isReadable()) {
            var isOnline = this.Buffer.readByte() == 1;
            var relationStatus = this.Buffer.readByte() == 1;
            var playerMoney = this.Buffer.readInt();
            var playerName = this.Buffer.ReadString();
            var avatar = this.Buffer.readByte();
            var gameId = this.Buffer.readByte();

            if (BkGlobal.UserInfo.getUserName().toLowerCase() == playerName.toLowerCase()) {
                continue;
            }
            var player = new BkUserData();
            player.setOnlineStatus(isOnline);
            player.setIsFriend(relationStatus);
            player.setMoney(playerMoney);
            player.setUserName(playerName);
            player.setAvatarId(avatar);
            player.setGameId(gameId);
            playerList.push(player);
        }
    },
    CreatePlayWithPacket: function (playerName) {
        this.Type = c.NETWORK_JOIN_FRIEND_TABLE;
        var lengBF = this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },
    CreateAcceptFriendRequestPacket: function (playerName) {
        this.Type = c.NETWORK_FRIEND_REQUEST_ACCEPT;
        var lengBF = this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },
    CreateRejectFriendRequestPacket: function (playerName) {
        this.Type = c.NETWORK_FRIEND_REQUEST_REJECT;
        var lengBF = this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },
    CreateRemoveFriendPacket: function (playerName) {
        this.Type = c.NETWORK_REMOVE_FRIEND;
        var lengBF = this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },
    GetJoinFriendTableFailureReturn:function(o) {
        var isFriendOnline = 0;
        var gameId = 0;
        while (this.Buffer.isReadable()) {
            isFriendOnline = this.Buffer.readByte();
            gameId = this.Buffer.readByte();
            o.isFriendOnline = isFriendOnline;
            o.gameId = gameId;
        }
    },
    GetMailListReturn: function (type, mailList) {
        var mailStatus = 1;
        while (this.Buffer.isReadable()) {
            var mailId = this.Buffer.readString();
            var date = this.Buffer.readLong();
            var strDate = BkTime.convertToLocalTime24h(date);

            var mail = new BkMailInfo();
            if (type == 1) {
                var sender = this.Buffer.readString();
                mail.setSender(sender);
            }
            else if (type == 2) {
                var receiver = this.Buffer.readString();
                mail.setReceiver(receiver);
            }

            var title = this.Buffer.readString();
            if (type == 1) {
                mailStatus = this.Buffer.readByte();
            }

            mail.setMailId(mailId);
            mail.setDate(strDate);
            mail.setTitle(title);
            mail.setMailStatus(mailStatus);

            mailList.push(mail);
        }
    },
    GetMailReturn: function (mail) {
        var date = 0;
        var strDate = "";
        var sender = "";
        var receiver = "";
        var title = "";
        var content = "";
        while (this.Buffer.isReadable()) {

            date = this.Buffer.readLong();
            strDate = BkTime.convertToLocalTime24h(date);
            sender = this.Buffer.readString();
            receiver = this.Buffer.readString();
            title = this.Buffer.readString();
            content = this.Buffer.readString();
        }

        mail.setDate(strDate);
        mail.setSender(sender);
        mail.setReceiver(receiver);
        mail.setTitle(title);
        mail.setContent(content);
    },
    CreateAddFriendPacket: function (playerName) {
        this.Type = c.NETWORK_FRIEND_REQUEST;
        var lengBF = this.Buffer.writeString(playerName);
        this.Length = HEADER_SIZE + lengBF - 2;
        this.CreateHeader();
    },
    ProcessRemoveFriendSuccess: function () {
        while (this.Buffer.isReadable()) {
            return this.Buffer.readString();
        }
    },
    CreateLuckyboxPacket: function (selectedBoxId, clientID) {
        this.Type = c.NETWORK_LUCKY_BOX_REQUEST;

        this.Buffer.writeByte(selectedBoxId);
        var lengBF = this.Buffer.writeString(clientID);
        this.Length = HEADER_SIZE - 2 + 1 + lengBF;
        this.CreateHeader();
    },
    ProcessInvitedListReturn:function() {
        var invitedIDs = [];
        var length = this.Buffer.readByte();
        if(length == -1)
        {
            showToastMessage("Bạn đã gửi tối đa số lời mời trong ngày");
            Util.removeAnim();
            return null;
        }
        for(var i = 0; i < length; i++)
        {

            invitedIDs[i] = this.Buffer.readByte();
        }
        return  invitedIDs;
    },

    GetContentProviderInfo: function (telcoId)
    {
        //this.Type = c.NETWORK_SERVER_REQUEST;
        //this.Buffer.writeByte(16);
        //this.Buffer.writeByte(PAYMENT_TYPE.ADD_MONEY_TYPE_CARD); // Card
        this.Type = c.NETWORK_GET_CONTENT_PROVIDER_INFO;
        this.Buffer.writeByte(telcoId);
        this.Length = HEADER_SIZE - 2 + 1;
        this.CreateHeader();
    },
    CheckGoogleIAPCommand:function()
    {
    	 this.Type = c.NETWORK_CHECK_GOOGLE_IAP;
         this.Buffer.writeByte(PACKET_NAME);
         this.Buffer.writeByte(PUBLIC_KEY_BASE64);
         this.Length = HEADER_SIZE - 2 + 2;
         this.CreateHeader();
    },
    getSMSProviderInfo:function()
    {
        this.Type = c.NETWORK_SERVER_REQUEST;
        this.Buffer.writeByte(16);
        this.Buffer.writeByte(PAYMENT_TYPE.ADD_MONEY_TYPE_SMS); // Card
        this.Length = HEADER_SIZE - 2 + 1 + 1;
        this.CreateHeader();
    },
    CreatePaymentPacket: function (MSTString, seriString, telCoID) {
        this.Type = c.NETWORK_NAP_THE_CAO;
        var lengMSTString = this.Buffer.writeString(MSTString);
        var lengseriString = this.Buffer.writeString(seriString);
        this.Buffer.writeByte(telCoID);
        this.Length = HEADER_SIZE + lengMSTString + lengseriString + 1 - 2;
        this.CreateHeader();
    },
    createFBInvitedListPacket: function (userId, friendIds, privateKey,fullName) {
        this.Type = c.NETWORK_FACEBOOK_INVITE_FRIENDS;
        this.Buffer.writeByte(Util.decodePrivateKey(privateKey));

        var lengfacebookId = this.Buffer.writeString(userId);
        // this.Buffer.writeByte(friendIds.length);

        // var lenguserName = 0;
        // var lenghtuserId = 0;
        // var arrlLength = Math.min(fullName.length,friendIds.length);
        // for(var i = 0; i < arrlLength; i++)
        // {
        //     lenguserName = lenguserName + this.Buffer.writeString(fullName[i]);
        //     lenghtuserId = lenghtuserId + this.Buffer.writeString(friendIds[i]);
        // }
        // this.Length = HEADER_SIZE - 2 + 2 + lengfacebookId + lenguserName + lenghtuserId ;
        var lenghtIds = 0;
        for (var i = 0; i < friendIds.length; i++) {
            lenghtIds = lenghtIds + this.Buffer.writeString(friendIds[i]);
        }

        this.Length = HEADER_SIZE - 2 + 1 + lengfacebookId + lenghtIds;

        this.CreateHeader();
    },

    creatQuickTableJoinPacket:function(roomID,tableID){
        this.Type = c.NETWORK_QUICK_TABLE_JOIN;

        // Buffer
        this.Buffer.writeByte(roomID);
        this.Buffer.writeByte(tableID);

        // leng of packet
        this.Length = HEADER_SIZE + 2 - 2;
        this.CreateHeader();
    },

    createPacketJoinWebGameRoom:function(gameId,roomTypeId,roomId){
        this.Type = c.NETWORK_JOIN_WEB_GAME_ROOM;
        this.Buffer.writeByte(gameId);
        this.Buffer.writeByte(roomTypeId);
        this.Buffer.writeByte(roomId);
        this.Length = HEADER_SIZE - 2 + 3;
        this.CreateHeader();
    },
    CreateSetupTablepacket:function(betMoney,maximumAllowedPlayers,password){
        this.Type = c.NETWORK_SETUP_TABLE;
        this.Buffer.writeInt(betMoney);
        this.Buffer.writeByte(maximumAllowedPlayers);
        if ((password!= "") && (password != undefined)){
            var lengPass = this.Buffer.writeString(password);
            this.Length = HEADER_SIZE +4 + 1 + lengPass - 2;
        } else {
            this.Length = HEADER_SIZE +4 + 1 - 2;
        }
        this.CreateHeader();
    },
    CreateMakeNewConnection:function(userName, password, gameID, roomID, tableID){
        this.Type = c.NETWORK_MAKE_NEW_CONNECTION;
        var lengUserName = this.Buffer.writeString(userName);
        var lengPass = this.Buffer.writeString(password);
        this.Buffer.writeByte(gameID);
        this.Buffer.writeByte(roomID);
        this.Buffer.writeByte(tableID);

        this.Length = HEADER_SIZE + lengPass + lengUserName + 3 - 2;
        this.CreateHeader();
    },
    CreateReconnect:function(username, password){
        this.Type = c.NETWORK_RECONNECT;
        var lengUserName = this.Buffer.writeString(username);
        var lengPass = this.Buffer.writeString(password);
        this.Length = HEADER_SIZE + lengPass + lengUserName - 2;
        this.CreateHeader();
    },
    createChatMessage: function (message) {
        this.Type = c.NETWORK_TABLE_CHAT;
        var lengthMsg = this.Buffer.writeString(message);
        this.Length = HEADER_SIZE + lengthMsg -2;
        // Set Index
        this.CreateHeader();
    },
    createShowPhomPacket:function(phomList){
        this.Type = c.NETWORK_SHOW_PHOM;
        for (var i=0;i<phomList.length;i++){
            var iCard = phomList[i];
            this.Buffer.writeByte(iCard.encode());
            this.Buffer.writeByte(iCard.phomIndex);
        }
        this.Length = HEADER_SIZE + 2 * phomList.length - 2;
        this.CreateHeader();
    },
    createShowUPacket:function(phomList){
        this.Type = c.NETWORK_SHOW_U;
        var count = 0;
        for (var i=0;i<phomList.length;i++){
            var iCard = phomList[i];
            if (iCard.phomIndex != 0){
                count ++;
                this.Buffer.writeByte(iCard.encode());
                this.Buffer.writeByte(iCard.phomIndex);
            }
        }
        this.Length = HEADER_SIZE + 2 * count - 2;
        this.CreateHeader();
    },
    createSendCardPacket:function(ca,receivedPlayerPosition,receivedPhomIndex){
        this.Type = c.NETWORK_SEND_CARD;
        this.Buffer.writeByte(ca.encode());
        this.Buffer.writeByte(receivedPlayerPosition);
        this.Buffer.writeByte(receivedPhomIndex);
        this.Length = HEADER_SIZE + 3 - 2;
        this.CreateHeader();
    },
    createXetBaiPacket:function(position)
    {
        this.Type = c.NETWORK_XET_BAI;
        this.Buffer.writeByte(position);
        this.Length = HEADER_SIZE  - 1;
        this.CreateHeader();
    },
    requestSendTokenToPhoneNumberPacket:function(phoneNumber){
        //this.Type = c.NETWORK_VALID_PLAYER_BY_PHONE_CHECK_AND_SEND_TOKEN;
        this.Type = c.NETWORK_SEND_TOKEN_TO_PHONE;
        var lphoneNumber = this.Buffer.writeString(phoneNumber);
        this.Length = HEADER_SIZE + lphoneNumber - 2;
        this.CreateHeader();
    },
    createUpdatePhoneNumberPacket:function(strToken){
        this.Type = c.NETWORK_UPDATE_PHONE_NUMBER;
        var lToken = this.Buffer.writeString(strToken);
        this.Length = HEADER_SIZE + lToken - 2;
        this.CreateHeader();
    },
    createGetMaxBetLodeMoney:function(){
        this.Type = c.NETWORK_BET_LOTTE_TICKET;
        this.Buffer.writeByte(LDNS.GET_MAX_BET_MONEY);
        this.Length = HEADER_SIZE + 1;
        this.CreateHeader();
    },
    createBetLotteTicket:function(betType,betMoney,numberList){
        this.Type = c.NETWORK_BET_LOTTE_TICKET;
        this.Buffer.writeByte(LDNS.PLACE_BET_LOTTE);
        this.Buffer.writeByte(betType);
        this.Buffer.writeInt(betMoney);
        this.Buffer.writeInt(numberList.length);
        var totalLeng = 0;
        for (var i=0;i < numberList.length;i++){
            totalLeng += this.Buffer.writeString(numberList[i]);
        }

        this.Length = HEADER_SIZE + 1 + 1 + 4 + 4 + totalLeng - 2;
        this.CreateHeader();
    },
    getAllGiaiDau:function(betFootballType)
    {
        this.Type = c.NETWORK_BET_FOOTBALL;
        this.Buffer.writeByte(betFootballType);
        this.Length = HEADER_SIZE - 1;
        this.CreateHeader();
    },
    getLastestCuocEvent:function(betFootballType)
    {
        this.Type = c.NETWORK_BET_FOOTBALL;
        this.Buffer.writeByte(betFootballType);
        this.Length = HEADER_SIZE - 1;
        this.CreateHeader();
    },
    createSendCuocFootball:function(betFootballType,betMoney,listOfCuocSprite)
    {
        var cuocLength = listOfCuocSprite.length;
        this.Type = c.NETWORK_BET_FOOTBALL;
        this.Buffer.writeByte(betFootballType);
        this.Buffer.writeInt(betMoney);
        this.Buffer.writeByte(cuocLength);
        for(var i = 0; i < cuocLength; i++ )
        {
            var cuoci = listOfCuocSprite[i];
            this.Buffer.writeInt(cuoci.data.matchId);
            this.Buffer.writeInt(cuoci.data.id);
        }
        this.Length = HEADER_SIZE + 1 + 4 + 1 + 8*cuocLength  - 2;
        this.CreateHeader();
    },
    createGetAllTranDauPacket:function(betFootballType,gdid)
    {
        this.Type = c.NETWORK_BET_FOOTBALL;
        this.Buffer.writeByte(betFootballType);
        this.Buffer.writeInt(gdid);
        this.Length = HEADER_SIZE + 1 + 4 -2 ;
        this.CreateHeader();
    },
    createGetAllKeoPacket:function(betFootballType,tdid)
    {
        this.Type = c.NETWORK_BET_FOOTBALL;
        this.Buffer.writeByte(betFootballType);
        this.Buffer.writeInt(tdid);
        this.Length = HEADER_SIZE + 1 + 4 -2 ;
        this.CreateHeader();
    },
    CreateBocAction:function(){
        this.CreatePacketWithOnlyType(c.NETWORK_PICK_CARD);
    },
    CreateDuoiAction:function(){
        this.CreatePacketWithOnlyType(c.NETWORK_FORFEIT);
    },
    CreatePacketXuongCuoc:function(cuoc)
    {
        this.Type = c.NETWORK_XUONG_CUOC;

        this.Length = HEADER_SIZE + 1 + cuoc.length -2;

        // Buffer
        this.Buffer.writeByte(cuoc.length);
        for (var i = 0; i < cuoc.length; i++)
        {
            this.Buffer.writeByte(cuoc[i]);
        }

        // Set Index
        Index = 0;
        this.CreateHeader();
    },
    CreateSetupChanTablePacket:function (isEnable411,isBasicMode,cuocGa) {
        this.Type = c.NETWORK_SETUP_CHAN_TABLE;

        // Buffer
        var i411 = 0;
        var ibm  = 0;

        if (isEnable411) i411 = 1;
        if (isBasicMode) ibm = 1;
        this.Buffer.writeByte(i411);
        this.Buffer.writeByte(ibm);

        for (var i = 0; i<cuocGa.length;i++){
            var iCuocGa = cuocGa[i];
            this.Buffer.writeByte(iCuocGa);
        }

        this.Length = HEADER_SIZE +1 + 1 + 4 - 2;
        // Set Index
        this.Index = 0;
        this.CreateHeader();
    },
    createVipInviteFriendMoneyRequest:function () {
        this.Type = c.NETWORK_VIP_FUNCTION;
        this.Buffer.writeByte(VC.VIP_INVITE_FRIEND_MONEY);
        this.Length = HEADER_SIZE - 2 + 1;
        this.Index = 0;
        this.CreateHeader();
    },
    vipMoneyBorrowRequest:function(money){
        this.Type = c.NETWORK_VIP_FUNCTION;
        this.Buffer.writeByte(VC.VIP_BORROW_MONEY);
        this.Buffer.writeInt(money);
        this.Length = HEADER_SIZE - 2 + 1 + 4;
        this.Index = 0;
        this.CreateHeader();
    },
    vipMoneyTransferRequest:function (playerName,money) {
        this.Type = c.NETWORK_VIP_FUNCTION;
        this.Buffer.writeByte(VC.VIP_TRANSFER_MONEY);
        var length = this.Buffer.writeString(playerName);
        this.Buffer.writeInt(money);
        this.Length = HEADER_SIZE - 2 + 1 + 4 + length ;
        this.Index = 0;
        this.CreateHeader();
    }
});
