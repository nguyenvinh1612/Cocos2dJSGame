/**
 * Created by VanChinh on 5/8/2017.
 */
var BK_LOBBY_MAX_ROOM_VV = 9;
var VvLobbyLayer = BkBaseLayer.extend({
    TableSprite:null,
    roomType:null,
    listTableData:[],
    listTableUI:[],
    RoomSprite:null,
    listRoomData:[],
    invitePlayGame:null,
    playerAvatar:null,
    ctor: function (roomType) {
        this._super(GS.CHOOSE_TABLE);
        if(roomType != undefined){
            this.roomType = roomType;
        }

        this.configBackground();
        this.initHeaderButton();
        this.configTopButton(GS.CHOOSE_TABLE);
        this.initAvatar();
        this.configAvatarPos();
        this.initButtonVip();
    },
    configBackground: function(){

        if (this.roomType == RT.ROOM_TYPE_DAU_TAY_DOI){
            this.setBackground(res.BG_Lobby_Solo);
        } else if (this.roomType == RT.ROOM_TYPE_DINH_THU_QUAN){
            this.setBackground(res.BG_Lobby_DTQ);
        } else {
            this.setBackground(res.BG_Lobby_NT);
        }
    },
    configAvatarPos: function(){
        this.playerAvatar.x = 235 + 10;
        this.playerAvatar.y = this.btnBack.y;
    },
    updateAvatar: function (data) {
        logMessage("updateAvatar layer");
        if (this.playerAvatar != null) {
            this.playerAvatar.setPlayerdata(data);
        } else {
            logMessage("this.playerAvatar == null");
        }
        //this.updateMailNum(data);
    },
    updateListRoom:function(listData){
        this.listRoomData = listData;
        if (this.RoomSprite == null){
            this.RoomSprite = new BkSprite();
            this.addChild(this.RoomSprite);
        } else{
            this.RoomSprite.removeAllChildren();
        }

        //var iLine;

        for (var i = 0; i < this.listRoomData.length; i++){
            var iRdt = this.listRoomData[i];
            var iRoomUI = new VvRoomSprite(iRdt,i);
            iRoomUI.configPosRoom();
            this.RoomSprite.addChild(iRoomUI);
        }
        var totalWid = this.listRoomData.length * WIDTH_ROOM_SPRITE;
        this.RoomSprite.y = 461;
    },
    updateListTable:function(listData){
        logMessage("initListTableLayer");
        if (this.TableSprite == null){
            this.TableSprite = new BkSprite();
            this.addChild(this.TableSprite);
        } else {
            this.TableSprite.removeAllChildren();
        }
        this.listTableData = listData;

        this.listTableData.sort(function(item1, item2){
            if (item1.betMoney < item2.betMoney){
                return 1;
            } else{
                return -1;
            }
        });

        logMessage("length "+this.listTableData.length);
        for (var i=0;i<this.listTableData.length;i++){
            var iData = this.listTableData[i];
            var iTableUI = new VvTableSprite(this.roomType, iData);
            iTableUI.configPosTable(i);
            this.TableSprite.addChild(iTableUI);
            this.listTableUI[i] = iTableUI;
        }
    },
    updateStatusOfTableWith:function(tableID,isGameInProgress){
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.UpdateStatusOfTableWith(tableID,isGameInProgress);
            }
        }
    },
    updateSizeOfTableWith:function(tableID,numberOfPlayers){
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.UpdateSizeOfTableWith(tableID,numberOfPlayers);
            }
        }
    },
    updateTableWith:function(tableData){
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.updateTableWithData(tableData);
            }
        }
    },
    updateGagop:function (tableID,isHasGagop) {
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.updateGagop(tableID,isHasGagop);
            }
        }
    },
    updateLuatUGa:function (tableID,iHasGagop,isBaicMode,is411) {
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.updateLuatUGa(tableID,iHasGagop,isBaicMode,is411);
            }
        }
    }
});

var VvLobby = cc.Scene.extend({
    isPauseEvent:false,
    lobbyLayer:null,
    onEnter:function () {
        this._super();
        this.initLobbyLayer();
    },
    initLobbyLayer:function(){
        logMessage("initLobbyLayer");
        if (this.lobbyLayer != null){
            this.lobbyLayer.removeFromParent();
            this.lobbyLayer = null;
        }

        var roomType = VvRoomTypeUtils.getRoomTypeById(BkGlobal.currentRoomID);

        this.lobbyLayer = new VvLobbyLayer(roomType);
        this.addChild(this.lobbyLayer,0);
        BkGlobal.lobbyScene = this;
    },
    onEnterTransitionDidFinish:function()
    {
        this._super();
        logMessage("VvLobby onEnterTransitionDidFinish");
        BkLogicManager.setGameLogic(null);
        this.showGuiLobby();
    },
    showGuiLobby:function(){
        if (this.lobbyLayer == null){
            this.initLobbyLayer();
        }
        this.lobbyLayer.updateListRoom(this.getListRoom());
        this.lobbyLayer.updateListTable(this.getListTable());
        this.scheduleUpdate();
        var self = this;
        this.scheduleOnce(self.callback,2);

        // send Offer Random table
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GET_OFFER_RANDOM_TABLE);
        BkConnectionManager.send(packet);


    },
    callback:function()
    {
        if(BkGlobal.bonusObj != null)
        {
            var obj = BkGlobal.bonusObj;
            var paymentPromotionWD = new BkPaymentPromotionWD(obj.title,obj.content,obj.percent,obj.remainingTime);
            paymentPromotionWD.showWithParent();
            BkGlobal.bonusObj = null;
        }
    },
    update:function(){
        logMessage("update ");
        var currS = getCurrentScene();
        if (currS != null){
            if (currS instanceof VvLobby){
                if (this.getLogic().storePacket != null){
                    logMessage("recall showPaymentBonusFunction");
                    var self = this;
                    self.getLogic().processNotifyPaymentBonus(self.getLogic().storePacket);
                }

                logMessage("currS instanceof VvLobby -> showPromotionKick");
                BkLogicManager.getLogic().showPromotionKick();
                this.unscheduleUpdate();
            }
        }
    },
    getListRoom:function(){
        var dt = this.getLogic().lobbyData;
        if (dt == null){
            logMessage("hasn't list room data -> get data");
            return;
        }
        var listRoomData = dt.listRoom1;
        if (listRoomData == null){
            logMessage("hasn't list room data -> get data");
            return;
        }
        var lengthListRoom = listRoomData.length;
        if (lengthListRoom> BK_LOBBY_MAX_ROOM_VV){
            lengthListRoom = BK_LOBBY_MAX_ROOM_VV;
        }
        var rtn = [];
        for (var i=0;i<lengthListRoom;i++) {
            rtn.push(listRoomData[i])
        }
        return rtn;
    },
    getListTable:function(){
        var dt = this.getLogic().lobbyData;
        if (dt == null){
            logMessage("hasn't list table data -> get data");
            return;
        }
        var stt = this.getLogic().STTCurrentRoom;
        logMessage("stt "+stt);
        var i = Math.floor (stt%3);
        logMessage("getListTableWithSTT: "+i);
        if (i==0){
            return dt.listTable1;
        }
        if (i==1){
            return dt.listTable2;
        }
        if (i==2){
            return dt.listTable3;
        }
        return [];
    },
    getLogic:function(){
        return BkLogicManager.getLogic();
    },
    UpdateStatusOfTableWith:function(tableID,isGameInProgress){
        this.lobbyLayer.updateStatusOfTableWith(tableID,isGameInProgress);
    },
    UpdateSizeOfTableWith:function(tableID,numberOfPlayers){
        this.lobbyLayer.updateSizeOfTableWith(tableID,numberOfPlayers);
    },
    UpdateTableWith:function(tableData){
        this.lobbyLayer.updateTableWith(tableData);
    },
    showReceiveInvitationMessage:function(offeredRoomId,offeredTableId,betMoney,invitationPlayer){
        var self = this;
        var selfLayer = this.lobbyLayer;
        logMessage("No money: "+BkGlobal.UserInfo.getMoney());
        if(BkGlobal.UserInfo.getMoney() == 0){
            return;
        }

        if (BkGlobal.isGameCo()){
            if (BkGlobal.getCurrentRoomType() != VvRoomTypeUtils.getRoomTypeById(offeredRoomId)){
                logMessage("loi moi game co sai zone");
                return;
            }
        }

        logMessage("isDisableReceiveInvite: "+self.getLogic().isDisableReceiveInvite);
        if (self.getLogic().isDisableReceiveInvite) {
            return;
        }

        logMessage("receiveInviteState: "+self.getLogic().promotionInfo.isDisableReceiveInvite);
        if (self.getLogic().promotionInfo.receiveInviteState){
            return;
        }

        if (self.getLogic().isInputPass) {
            logMessage("inputing pass -> don't show popup ivite");
            return;
        }
        var moneyF = convertStringToMoneyFormat(betMoney) + " " + BkConstString.getGameCoinStr();
        if (selfLayer.invitePlayGame!= null || selfLayer.playerAvatar.isShowPlayerDetailWD()) {
            logMessage("dang hien thi loi moi or wd khac -> k lam gi");
            return;
        }

        selfLayer.invitePlayGame = new BkInvitePopup("Mời chơi",TYPE_CONFIRM_BOX);
        selfLayer.invitePlayGame.setTextMessage(invitationPlayer + " mời bạn chơi Chắn " + moneyF
            + ".\nBạn có đồng ý không?");

        selfLayer.invitePlayGame.setOkCallback(function() {
            self.getLogic().processQuickJointTable(offeredRoomId, offeredTableId);
        });
        selfLayer.invitePlayGame.setCallbackRemoveWindow(function() {
            selfLayer.invitePlayGame = null;
        });

        selfLayer.invitePlayGame.show();
    },
    showInviteBuyPromo: function (closeFunc) {

        cc.spriteFrameCache.addSpriteFrames(res.vv_shopping_items_plist, res.vv_shopping_items_img);
        var itemDetailsWindow = new VvItemDetailsWindow(25);
        var f = function () {
            cc.spriteFrameCache.removeSpriteFramesFromFile(res.vv_shopping_items_plist);
            if (closeFunc){
                closeFunc();
            }
        };
        itemDetailsWindow.setCallbackRemoveWindow(f);
        itemDetailsWindow.showWithParent();
    },
    updateAvatar:function(data) {
        this.lobbyLayer.updateAvatar(data);
    },
    updatebtnPayment: function ()
    {
        if (this.lobbyLayer != null) {
            this.lobbyLayer.updatebtnPayment();
        }
    },
    getGameLayer:function () {
        return this.lobbyLayer;
    }
});