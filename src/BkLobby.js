/**
 * Created by bs on 01/10/2015.
 */

var BK_LOBBY_MAX_ROOM = 7;
var BK_LOBBY_TAB_MARGIN_TOP = 93.8;
var BK_LOBBY_TAB_MARGIN_LEFT = 205;

var BkLobbyLayer = cc.Layer.extend({
    textButtonTabGameBAI : ["BÌNH DÂN","SOLO","NGẪU NHIÊN"],
    textButtonTabGameCO : ["CỜ CHẬM","CỜ NHANH","PHÒNG HOT"],
    TableSprite:null,
    listTableData:[],
    listTableUI:[],
    RoomSprite:null,
    listRoomData:[],
    background:null,
    invitePlayGame:null,
    btnTopPlayer:null,
    btnScreenShot:null,
    btnFullScreen:null,
    btnBack:null,
    btnPayment:null,
    btnBinhDan:null,
    btnSolo:null,
    btnRandom:null,
    btnChoiNgay:null,
    imgNameGame:null,
    playerAvatar:null,
    ctor: function () {
        logMessage("ctor BkLobbyLayer");
        this._super();
        var size = cc.winSize;
        var resBg = res.Bg_chooTable;
        if (Util.isGameCo()){
            resBg = res.Bg_CoTable;
        }
        this.background = new BkSprite(resBg);
        this.background.scaleX = size.width / this.background.getWidth();
        this.background.scaleY = size.height / this.background.getHeight();
        this.background.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.background, 0);
        this.initTopBar();
        //changeGameBg(BkGlobal.currentGameID,BkGlobal.currentGS);
    },
    configTextOfTab:function(){
        var arrText = this.textButtonTabGameBAI;
        if (Util.isGameCo()){
            arrText = this.textButtonTabGameCO;
        }
        this.btnBinhDan.setTitleText(arrText[0]);
        this.btnSolo.setTitleText(arrText[1]);
        this.btnRandom.setTitleText(arrText[2]);
    },
    selectButonTab:function(btn){
        this.deselectAllTab();
        this.setSelectedForButton(btn,true);
    },
    deselectAllTab:function(){
        this.setSelectedForButton(this.btnBinhDan,false);
        this.setSelectedForButton(this.btnSolo,false);
        this.setSelectedForButton(this.btnRandom,false);
    },
    setSelectedForButton: function (btn, isEnable) {
        if(!btn){
            return;
        }
        btn.setIsSelected(isEnable);
        if(isEnable){
            btn.loadTextures(res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,ccui.Widget.PLIST_TEXTURE)
        }else{
            btn.loadTextures(res_name.ImgTabChooGameDeSelect,res_name.ImgTabChooGameDeSelect,res_name.ImgTabChooGameDeSelect,res_name.ImgTabChooGameDeSelectHover,ccui.Widget.PLIST_TEXTURE)
        }
    },
    initTopBar:function(){
        // truongbs ++ : add top bar button
        var winSize = cc.director.getWinSize();
        var btnTopRightMarginRight = 30;
        var btnTopRightMarginTop = 27;
        var btnTopRightPadding = 5;
        //cc.spriteFrameCache.addSpriteFrames(res.btn_sprite_sheet_plist, res.btn_sprite_sheet_img);
        var self= this;
        if (cc.screen.fullScreen())
        {
            if(Util.isNeedToChangeIcon())
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_over_chess, ccui.Widget.PLIST_TEXTURE);

            }else
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2_over, ccui.Widget.PLIST_TEXTURE);
            }
        } else
        {
            if(Util.isNeedToChangeIcon())
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_over_chess, ccui.Widget.PLIST_TEXTURE);
            }else
            {
                this.btnFullScreen = new BkButton(res_name.btn_scale, res_name.btn_scale, res_name.btn_scale, res_name.btn_scale_over, ccui.Widget.PLIST_TEXTURE);
            }
        }
        this.btnFullScreen.x = winSize.width - btnTopRightMarginRight;
        this.btnFullScreen.y = winSize.height - btnTopRightMarginTop;
        this.addChild(this.btnFullScreen);
        this.btnFullScreen.addClickEventListener(function () {
            logMessage("clock btnFullScreen Lobby");
            if (!cc.screen.fullScreen())
            {
                makeFullScreen(function () {
                    if (cc.screen.fullScreen())
                    {
                        if(Util.isNeedToChangeIcon())
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_chess, res_name.btn_scale2_over_chess, ccui.Widget.PLIST_TEXTURE);

                        }else
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2, res_name.btn_scale2_over, ccui.Widget.PLIST_TEXTURE);
                        }
                    } else {
                        if(Util.isNeedToChangeIcon())
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_over_chess, ccui.Widget.PLIST_TEXTURE);
                        }else
                        {
                            self.btnFullScreen.loadTextures(res_name.btn_scale, res_name.btn_scale, res_name.btn_scale, res_name.btn_scale_over, ccui.Widget.PLIST_TEXTURE);
                        }
                    }
                },self);
                return;
            }
            exitFullScreen();
            if(Util.isNeedToChangeIcon())
            {
                self.btnFullScreen.loadTextures(res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_chess, res_name.btn_scale_over_chess, ccui.Widget.PLIST_TEXTURE);

            }else
            {
                self.btnFullScreen.loadTextures(res_name.btn_scale, res_name.btn_scale, res_name.btn_scale, res_name.btn_scale_over, ccui.Widget.PLIST_TEXTURE);
            }
        });
        if(Util.isNeedToChangeIcon())
        {
            this.btnScreenShot = new BkButton(res_name.btn_guide_chess, res_name.btn_guide_chess, res_name.btn_guide_chess, res_name.btn_guide_hover_chess, ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.btnScreenShot = new BkButton(res_name.btn_guide, res_name.btn_guide, res_name.btn_guide, res_name.btn_guide_hover, ccui.Widget.PLIST_TEXTURE);
        }
        this.btnScreenShot.x = this.btnFullScreen.x - this.btnFullScreen.width - btnTopRightPadding;
        this.btnScreenShot.y = this.btnFullScreen.y;
        this.btnScreenShot.addClickEventListener(function(){
            logMessage("click btnScreenShot");
            //makeScreenShot();
            showHelpMenu(BkGlobal.currentGameID);
        });
        this.addChild(this.btnScreenShot);
        if(Util.isNeedToChangeIcon())
        {
            this.btnTopPlayer = new BkButton(res_name.btn_caothu_chess, res_name.btn_caothu_chess, res_name.btn_caothu_chess, res_name.btn_caothu_over_chess, ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.btnTopPlayer = new BkButton(res_name.btn_caothu, res_name.btn_caothu, res_name.btn_caothu, res_name.btn_caothu_over, ccui.Widget.PLIST_TEXTURE);
        }
        this.btnTopPlayer.x = this.btnScreenShot.x - this.btnScreenShot.width - btnTopRightPadding;
        this.btnTopPlayer.y = this.btnFullScreen.y;
        this.btnTopPlayer.addClickEventListener(function(){
            self.invitePlayGame = 1;
            logMessage("click topPlayer");

            var layer = new BkTopPlayerWindow();
            layer.setCallbackRemoveWindow(function () {
                self.imgNameGame.setVisible(true);
                self.invitePlayGame = null;
            });
            layer.showWithParent();
            self.imgNameGame.setVisible(false);
        });
        this.addChild(this.btnTopPlayer);

        var size = cc.winSize;
        if(Util.isNeedToChangeIcon())
        {
            this.btnBack = new BkButton(res_name.ImgLeave_chess,res_name.ImgLeave_chess,res_name.ImgLeave_chess,res_name.ImgLeaveHover_chess,ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.btnBack = new BkButton(res_name.ImgLeave,res_name.ImgLeave,res_name.ImgLeave,res_name.ImgLeaveHover,ccui.Widget.PLIST_TEXTURE);
        }
        this.btnBack.x = this.btnBack.getContentSize().width/2 + 12;
        this.btnBack.y = this.btnFullScreen.y;
        this.addChild(this.btnBack);
        var self = this;
        this.btnBack.addClickEventListener(function(){
            BkLogicManager.getLogic().doleaveGame();
            if(Util.isNeedtoShowPushPopup())
            {
                Util.openPushWindow();
            }
        });

        this.updatebtnPayment();
        this.btnTopPlayer.x = this.btnFullScreen.x - this.btnFullScreen.width - btnTopRightPadding;
        this.btnScreenShot.x = this.btnTopPlayer.x - this.btnScreenShot.width/2 - this.btnTopPlayer.width/2 - btnTopRightPadding;
        this.btnPayment.x = this.btnScreenShot.x - this.btnScreenShot.width/2 - this.btnPayment.width/2 - 5;

        //this.btnBinhDan = new BkButton(res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,ccui.Widget.PLIST_TEXTURE);
        this.btnBinhDan = new BkButton(res_name.ImgTabChooGameNormal,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameDeSelect,res_name.ImgTabChooGameDeSelectHover,ccui.Widget.PLIST_TEXTURE);

        this.btnBinhDan.setTitleFontSize(16);
        this.btnBinhDan.setTitleFontName(res_name.GAME_FONT_BOLD);
        this.btnBinhDan.getTitleRenderer().enableShadow(cc.color(13,59,85), cc.p(2, -2));
        this.btnBinhDan.x = BK_LOBBY_TAB_MARGIN_LEFT - 125;
        this.btnBinhDan.y = size.height - BK_LOBBY_TAB_MARGIN_TOP + 2.1;
        this.addChild(this.btnBinhDan);
        this.btnBinhDan.setHoverCallback(function(){
            if (BkGlobal.getCurrentRoomType() == RT.ROOM_TYPE_BINH_DAN){
                cc._canvas.style.cursor = "default";
            }
        },null);
        this.btnBinhDan.addClickEventListener(function(){
            if (BkGlobal.getCurrentRoomType() == RT.ROOM_TYPE_BINH_DAN){
                return;
            }
            self.selectButonTab(self.btnBinhDan);
            logMessage("BkLobby btnBinhDan");
            Util.showAnim();
            BkLogicManager.getLogic().doJoinWebGameRoom(BkGlobal.currentGameID,RT.ROOM_TYPE_BINH_DAN,-1);
            Util.setClientSetting(key.userLastRoomType+"_"  + BkGlobal.currentGameID+"_"  + cc.username.toLowerCase()
                , JSON.stringify(RT.ROOM_TYPE_BINH_DAN));
        });

        this.btnSolo = new BkButton(res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,ccui.Widget.PLIST_TEXTURE);
        this.btnSolo.setTitleFontSize(16);
        this.btnSolo.setTitleFontName(res_name.GAME_FONT_BOLD);
        this.btnSolo.getTitleRenderer().enableShadow(cc.color(13,59,85), cc.p(2, -2));
        this.btnSolo.x = this.btnBinhDan.x + this.btnBinhDan.width + 5;
        this.btnSolo.y = this.btnBinhDan.y;
        this.addChild(this.btnSolo);
        this.btnSolo.setHoverCallback(function(){
            if (BkGlobal.getCurrentRoomType() == RT.ROOM_TYPE_SOLO){
                cc._canvas.style.cursor = "default";
            }
        },null);
        this.btnSolo.addClickEventListener(function(){
            if (BkGlobal.getCurrentRoomType() == RT.ROOM_TYPE_SOLO){
                return;
            }
            self.selectButonTab(self.btnSolo);
            logMessage("BkLobby btnSolo");
            Util.showAnim();
            BkLogicManager.getLogic().doJoinWebGameRoom(BkGlobal.currentGameID,RT.ROOM_TYPE_SOLO,-1);
            Util.setClientSetting(key.userLastRoomType +"_" + BkGlobal.currentGameID+"_"  + cc.username.toLowerCase()
                , JSON.stringify(RT.ROOM_TYPE_SOLO));
        });

        this.btnRandom = new BkButton(res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,res_name.ImgTabChooGameSelect,ccui.Widget.PLIST_TEXTURE);
        this.btnRandom.setTitleFontSize(16);
        this.btnRandom.setTitleFontName(res_name.GAME_FONT_BOLD);
        this.btnRandom.x = this.btnSolo.x + this.btnBinhDan.width + 5;
        this.btnRandom.y = this.btnBinhDan.y;
        //this.addChild(this.btnRandom);
        this.btnRandom.addClickEventListener(function(){
            logMessage("onclick btnRandom");
        });
        this.configTextOfTab();
        this.deselectAllTab();

        //if (BkGlobal.isGameCo()){
        //    this.btnSolo.x = BK_LOBBY_TAB_MARGIN_LEFT;
        //    this.btnBinhDan.x = this.btnSolo.x + this.btnSolo.width + 5;
        //}

        this.btnChoiNgay = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Chơi ngay");
        this.btnChoiNgay.x = this.btnTopPlayer.x + 12    ;
        this.btnChoiNgay.y = this.btnBinhDan.y + 5;
        this.addChild(this.btnChoiNgay);
        this.btnChoiNgay.addClickEventListener(function(){
            logMessage("-----------------------click choi ngay-----------------------");
            var Packet = new BkPacket();
            Packet.CreatePacketWithOnlyType(c.NETWORK_AUTO_FIND_TABLE);
            BkConnectionManager.send(Packet);
        });

        // init game label
        this.imgNameGame = new BkSprite(res.nameGameIMG,this._getGamenameRect());
        this.imgNameGame.x = cc.winSize.width/2;
        this.imgNameGame.y = this.btnBinhDan.y + 65.5;
        this.addChild(this.imgNameGame);

        // init player
        if (this.playerAvatar == null){
            this.playerAvatar = new BkAvatar(null);
            this.addChild(this.playerAvatar);
        }

        if (BkGlobal.UserInfo != null){
            this.updateAvatar(BkGlobal.UserInfo);
        }
        this.playerAvatar.x = 81;
        this.playerAvatar.y = this.btnBack.y; // size.height - this.playerAvatar.height/2 - AVAR_TOP_ALIGN_HEIGHT + 4;

    },
    updatebtnPayment:function()
    {
        if(this.btnPayment != undefined && this.btnPayment != null)
        {
            this.btnPayment.removeSelf();
        }
        this.btnPayment = new BkBtnPayment(GS.CHOOSE_TABLE, BkGlobal.addMoneyBonusType);
        this.btnPayment.x = this.btnScreenShot.x - this.btnPayment.width / 2 - this.btnScreenShot.width / 2 - 5;
        this.btnPayment.y =  this.btnTopPlayer.y;

        this.btnPayment.setOnlickListenner(function () {
            self.invitePlayGame = 1;
            var layer = new BkPaymentWindow();
            layer.setCallbackRemoveWindow(function () {
                self.invitePlayGame = null;
            });
            layer.showWithParent();
            sendGA(BKGA.LOBBY, "click btnPayment", BkGlobal.clientDeviceCheck);
        });
        if(cc.isShowWdByIp) {
            this.addChild(this.btnPayment);
        }
    },
    _getGamenameRect:function(){
        var wid = 300;
        var hei = 56;
        var xPos = 0;
        var yPos =0;
        switch (BkGlobal.currentGameID)
        {
            case GID.TLMN:
                yPos = 0;
                break;
            case GID.CO_TUONG:
                yPos = hei;
                break;
            case GID.CO_UP:
                yPos = 2 * hei;
                break;
            case GID.CHAN:
                yPos = 3 * hei;
                break;
            case GID.PHOM:
                yPos = 4 * hei;
                break;
            case GID.BA_CAY:
                yPos = 5 * hei;
                break;
            case GID.XITO:
                yPos = 6 * hei;
                break;
            case GID.XAM:
                yPos = 7 * hei;
                break;
            case GID.POKER:
                yPos = 8 * hei;
                break;
            case GID.LIENG:
                yPos = 9 * hei;
                break;
            case GID.XI_DZACH:
                yPos = 10 * hei;
                break;
            case GID.MAU_BINH:
                yPos = 11 * hei;
                break;
            case GID.TLMN_DEM_LA:
                yPos = 12 * hei;
                break;
        }
        return new cc.rect(xPos,yPos,wid,hei);
    },
    updateAvatar:function(data) {
        logMessage("updateAvatar layer");
        if (this.playerAvatar != null) {
            this.playerAvatar.setPlayerdata(data);
        }else {
            logMessage("this.playerAvatar == null");
        }
    },
    configButtonTab:function(){
        if (BkGlobal.isRoomTypeSolo()){
            this.selectButonTab(this.btnSolo);
        } else {
            this.selectButonTab(this.btnBinhDan);
        }
        //else if (BkGlobal.getCurrentRoomType() == RT.ROOM_TYPE_BINH_DAN){
        //    this.selectButonTab(this.btnBinhDan);
        //}
    }
    ,
    updateListRoom:function(listData){
        this.listRoomData = listData;
        if (this.RoomSprite == null){
            this.RoomSprite = new BkSprite();
            this.addChild(this.RoomSprite);
        } else{
            this.RoomSprite.removeAllChildren();
        }

        var iLine;

        for (var i=0;i<this.listRoomData.length;i++){
            var iRdt = this.listRoomData[i];
            var iRoomUI = new BkRoomSprite(iRdt,i);
            iRoomUI.configPosRoom();
            this.RoomSprite.addChild(iRoomUI);

            if (i == 0){
                iLine = new BkSprite("#"+res_name.chooseTable_line_between_IMG);
                iLine.x = iRoomUI.x - iRoomUI.width/2;
                iLine.y = iRoomUI.y - 6;
                this.RoomSprite.addChild(iLine);
            }

            iLine = new BkSprite("#"+res_name.chooseTable_line_between_IMG);
            iLine.x = iRoomUI.x + iRoomUI.width/2;
            iLine.y = iRoomUI.y - 6;
            this.RoomSprite.addChild(iLine);
        }

        //if (this.listRoomData.length < BK_LOBBY_MAX_ROOM){
        var totalWid = this.listRoomData.length * WIDTH_ROOM_SPRITE;
        //this.RoomSprite.x = (cc.winSize.width /2 - totalWid/2 - ROOM_MARGIN_LEFT + WIDTH_ROOM_SPRITE/2);
        this.RoomSprite.y = 461;
        this.configButtonTab();
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
            var iTableUI = new BkTableSprite(iData);
            iTableUI.configPosTable(i);
            this.TableSprite.addChild(iTableUI);
            this.listTableUI[i] = iTableUI;
        }
    },
    UpdateStatusOfTableWith:function(tableID,isGameInProgress){
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.UpdateStatusOfTableWith(tableID,isGameInProgress);
            }
        }
    },
    UpdateSizeOfTableWith:function(tableID,numberOfPlayers){
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.UpdateSizeOfTableWith(tableID,numberOfPlayers);
            }
        }
    },
    UpdateTableWith:function(tableData){
        if (this.listTableUI!= null){
            for (var i= 0;i<this.listTableUI.length;i++){
                var iTableItem = this.listTableUI[i];
                iTableItem.updateTableWithData(tableData);
            }
        }
    }
});

var BkLobby = cc.Scene.extend({
    isPauseEvent:false,
    lobbyLayer:null,
    onEnter:function () {
        logMessage("onEnter");
        this._super();
        this.initLobbyLayer();
    },
    initLobbyLayer:function(){
        logMessage("initLobbyLayer");
        if (this.lobbyLayer != null){
            this.lobbyLayer.removeFromParent();
            this.lobbyLayer = null;
        }
        this.lobbyLayer = new BkLobbyLayer();
        this.addChild(this.lobbyLayer,0);
        BkGlobal.lobbyScene = this;
    },
    onEnterTransitionDidFinish:function()
    {
        this._super();
        logMessage("BkLobby onEnterTransitionDidFinish");
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
            if (currS instanceof BkLobby){
                logMessage("currS instanceof BkLobby -> showPromotionKick");
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
        if (lengthListRoom> BK_LOBBY_MAX_ROOM){
            lengthListRoom = BK_LOBBY_MAX_ROOM;
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
        this.lobbyLayer.UpdateStatusOfTableWith(tableID,isGameInProgress);
    },
    UpdateSizeOfTableWith:function(tableID,numberOfPlayers){
        this.lobbyLayer.UpdateSizeOfTableWith(tableID,numberOfPlayers);
    },
    UpdateTableWith:function(tableData){
        this.lobbyLayer.UpdateTableWith(tableData);
    },
    showReceiveInvitationMessage:function(offeredRoomId,offeredTableId,betMoney,invitationPlayer){
        var self = this;
        var selfLayer = this.lobbyLayer;
        logMessage("No money: "+BkGlobal.UserInfo.getMoney());
        if(BkGlobal.UserInfo.getMoney() == 0){
            return;
        }

        if (BkGlobal.isGameCo()){
            if (BkGlobal.getCurrentRoomType() != BkRoomTypeUtils.getRoomTypeById(offeredRoomId)){
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
        var gamename =  Util.getGameLabel(BkGlobal.currentGameID);
        var moneyF = convertStringToMoneyFormat(betMoney)+ BkConstString.getGameCoinStr();
        if (selfLayer.invitePlayGame!= null || selfLayer.playerAvatar.isShowPlayerDetailWD()) {
            logMessage("dang hien thi loi moi or wd khac -> k lam gi")
            return;
        }

        //if (this.invitePlayGame!= null) {
        //    this.invitePlayGame.removeFromParent();
        //}
        selfLayer.invitePlayGame = new BkInvitePopup("Mời bạn chơi",TYPE_CONFIRM_BOX);
        selfLayer.invitePlayGame.setTextMessage(invitationPlayer + " mời bạn chơi " + gamename
            + ",\n Cược " + moneyF + " bạn có đồng ý không?");

        selfLayer.invitePlayGame.setOkCallback(function() {
            self.getLogic().processQuickJointTable(offeredRoomId, offeredTableId);
        });
        selfLayer.invitePlayGame.setCallbackRemoveWindow(function() {
            selfLayer.invitePlayGame = null;
        });

        selfLayer.invitePlayGame.show();
    },
    showInviteBuyPromo: function (closeFunc) {
        var itemDetailsWindow = new BkItemDetailsWindow(25);
        if(closeFunc) {
            //itemDetailsWindow.setCallbackCloseButtonClick(closeFunc);
            itemDetailsWindow.setCallbackRemoveWindow(closeFunc);
        }
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
    }
});