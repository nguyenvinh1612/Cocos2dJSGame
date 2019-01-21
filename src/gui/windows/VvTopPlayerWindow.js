/**
 * Created by bs on 25/05/2017.
 */
VvTopPlayerWindow = VvTabWindow.extend({
    STR_NUM_OF_GAME: 			 "VÁN CHƠI",
    STR_NUM_OF_GAME_PER_WEEK: 	 "VÁN CHƠI/TUẦN",
    STR_NUM_OF_WIN: 		     "VÁN THẮNG",
    STR_NUM_OF_WIN_PER_WEEK: 	 "VÁN THẮNG/TUẦN",
    STR_MONEY: 					 "QUAN TIỀN",
    STR_MONEY_PER_WEEK: 		 "QUAN TIỀN/TUẦN",
    STR_GATO: 					 "ĂN GÀ TO",
    STR_GATO_PER_WEEK: 			 "ĂN GÀ TO/TUẦN",
    STR_UTO: 					 "Ù TO",
    STR_UTO_PER_WEEK: 			 "Ù TO/TUẦN",

    spriteSheet: cc.spriteFrameCache,
    _tabList: ["Cao thủ", "Nhiệt tình", "Đại gia","Gà to","Cước ù"],
    btnDanDau:null,
    btnDangLen:null,
    nameResDDDL:"",
    selectTabContent:null,
    listCaoThuDanDau:  null,
    listCaoThuDangLen:  null,
    listNhietTinhDanDau:  null,
    listNhietTinhDangLen:  null,
    listDaiGia:  null,
    listDaiGiaDangLen:  null,
    listGaToDanDau:  null,
    listGaToDangLen:  null,
    listCuocUDanDau:  null,
    listCuocUDangLen:  null,

    Top1CaoThuDanDau:  null,
    Top1CaoThuDangLen:  null,
    Top1NhietTinhDanDau:  null,
    Top1NhietTinhDangLen:  null,
    Top1DaiGia:  null,
    Top1DaiGiaDangLen:  null,
    Top1GaToDanDau:  null,
    Top1GaToDangLen:  null,
    Top1CuocUDanDau:  null,
    Top1CuocUDangLen:  null,

    ItemPlayer: null,
    itemRow:null,
    itemMe:null,
    listUITop10:null,
    PLSprite:null,
    isLoadingPlayerNo1:false,
    strRank1NumberofGame:"",

    tfThanhTich:null,

    ctor: function () {
        cc.spriteFrameCache.addSpriteFrames(res.vv_top_cao_thu_plist, res.vv_top_cao_thu_img);

        // cc.spriteFrameCache.addSpriteFrames(res.vv_trang_ca_nhan_plist, res.vv_trang_ca_nhan_img);
        // cc.spriteFrameCache.addSpriteFrames(res.vv_huan_chuong_plist, res.vv_huan_chuong_img);

        this._super("", cc.size(872, 625), this._tabList.length, this._tabList);
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this._bgBody.visible = false;
        this.visibleBodyContent(false);
        this.setVisibleOutBackgroundWindow(true);

        this.addTabChangeEventListener(this.selectedTabEvent, this);

        this.TbgWd = new BkSprite("#"+res_name.header_2);
        this.TbgWd.x = this.getWindowSize().width/2;
        this.TbgWd.y = 625-137/2;
        this.addChildBody(this.TbgWd, WD_ZORDER_BODY);

        this.bgWd = new BkSprite("#"+res_name.vv_tct_content_bg);
        this.bgWd.x = this.getWindowSize().width/2;
        this.bgWd.y = this.TbgWd.y -624/2;
        this.addChildBody(this.bgWd, WD_ZORDER_BODY);

        this.configPosXButton(155);
        this.configPosYButton(465);
        this._btnClose.loadTextures(res_name.btn_close_circle,res_name.btn_close_circle_press,res_name.btn_close_circle
            ,res_name.btn_close_circle_hover,ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x -= 35;
        this._btnClose.y -= 20;
    },
    initBtnDDDL:function () {
        if (this.btnDanDau !==null){
            return;
        }

        var self = this;
        this.nameResDDDL = res_name.img_bnt_dd_dl_2;
        this.btnDanDau = new BkButton(this.nameResDDDL,this.nameResDDDL,this.nameResDDDL
            ,this.nameResDDDL,ccui.Widget.PLIST_TEXTURE);
        this.btnDanDau.setTitleText("Dẫn đầu");
        this.btnDanDau.x = 248;
        this.btnDanDau.y = 470;
        this.addChildBody(this.btnDanDau);
        this.btnDanDau.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnDanDau.lastTimeClick < 1000){
                return;
            }
            self.btnDanDau.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickDanDau();
        });

        var startXItem = this.btnDanDau.x + 375/2;
        var startYItem = 457;
        var line = new cc.DrawNode();
        line.drawSegment(cc.p(startXItem,startYItem), cc.p(startXItem, startYItem +22),1, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        this.addChildBody(line);

        this.btnDangLen = new BkButton(this.nameResDDDL,this.nameResDDDL,this.nameResDDDL
            ,this.nameResDDDL,ccui.Widget.PLIST_TEXTURE);
        this.btnDangLen.setTitleText("Đang lên");
        this.btnDangLen.x = this.btnDanDau.x + 376;
        this.btnDangLen.y = this.btnDanDau.y;
        this.addChildBody(this.btnDangLen);
        this.btnDangLen.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnDangLen.lastTimeClick < 1000){
                return;
            }
            self.btnDangLen.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickDangLen();
        });
        this.selectTabContent = new BkSprite("#"+res_name.select_tab_content);
        this.selectTabContent.x = this.btnDanDau.x;
        this.selectTabContent.y = this.btnDanDau.y - 15;
        this.addChildBody(this.selectTabContent);
    },
    updateTfGuilde:function (currentTab,isDangLen) {
        if (isDangLen == undefined){
            isDangLen = false;
        }
        if (this.tfThanhTich == null){
            this.tfThanhTich = new BkLabel("","",13,true);
            this.addChildBody(this.tfThanhTich);
        }
        var content = "";
        var colorText = cc.color(255,255,255);
        if (currentTab == 1){
            colorText = CTopPlayerItem.COLOR_VAN_THANG;
            if (!isDangLen){
                content = this.STR_NUM_OF_WIN;
            } else {
                content = this.STR_NUM_OF_WIN_PER_WEEK;
            }
        }
        if (currentTab == 2){
            colorText = CTopPlayerItem.COLOR_VAN_CHOI;
            if (!isDangLen){
                content = this.STR_NUM_OF_GAME;
            } else {
                content = this.STR_NUM_OF_GAME_PER_WEEK;
            }
        }

        if (currentTab == 3){
            colorText = CTopPlayerItem.COLOR_QUAN_TIEN;
            if (!isDangLen){
                content = this.STR_MONEY;
            } else {
                content = this.STR_MONEY_PER_WEEK;
            }
        }

        if (currentTab == 4){
            colorText = CTopPlayerItem.COLOR_QUAN_TIEN;
            if (!isDangLen){
                content = this.STR_GATO;
            } else {
                content = this.STR_GATO_PER_WEEK;
            }
        }

        if (currentTab == 5){
            colorText = CTopPlayerItem.COLOR_U_TO;
            if (!isDangLen){
                content = this.STR_UTO;
            } else {
                content = this.STR_UTO_PER_WEEK;
            }
        }

        this.tfThanhTich.setString(content);
        this.tfThanhTich.setTextColor(colorText);
        this.tfThanhTich.x = 785-this.tfThanhTich.getContentSize().width/2;
        this.tfThanhTich.y = 440;
    },
    updateUILoading:function () {
        var currentTab = this.getCurrentTab();
        if (this.PLSprite != null){
            this.PLSprite.updateUILoading(currentTab);
        }
        if (this.listUITop10 != null){
            for (var i=0;i<this.listUITop10.length;i++){
                var itemRow = this.listUITop10[i];
                if (itemRow != null){
                    itemRow.updateDataLoading();
                }
            }
        }
    },
    saveListData:function (listPlayer,isRichest) {

        var currentTab = this.getCurrentTab();
        if (currentTab == 1){
            if (this.btnDanDau.isSelected()){
                this.listCaoThuDanDau = listPlayer;
            } else {
                this.listCaoThuDangLen = listPlayer;
            }
        } else if (currentTab == 2){
            if (this.btnDanDau.isSelected()){
                this.listNhietTinhDanDau = listPlayer;
            } else {
                this.listNhietTinhDangLen = listPlayer;
            }
        } else if (currentTab == 3){
            if (this.btnDanDau.isSelected()){
                this.listDaiGia = listPlayer;
            } else {
                this.listDaiGiaDangLen = listPlayer;
            }
        } else if (currentTab == 4){
            if (this.btnDanDau.isSelected()){
                this.listGaToDanDau = listPlayer;
            } else {
                this.listGaToDangLen = listPlayer;
            }
        } else if (currentTab == 5){
            if (this.btnDanDau.isSelected()){
                this.listCuocUDanDau = listPlayer;
            } else {
                this.listCuocUDangLen= listPlayer;
            }
        }
    },
    getProfileTopPlayer:function (playerName) {
        this.isLoadingPlayerNo1 = true;
        this.initHandleonLoadComplete();
        BkLogicManager.getLogic().DoGetProfilePlayer(playerName);
        Util.showAnim();
    },
    getDataCurrentTop:function () {
        var currentTab = this.getCurrentTab();
        if (currentTab == 3){
            if (this.btnDanDau.isSelected()){
                return this.Top1DaiGia;
            } else {
                return this.Top1DaiGiaDangLen;
            }
        } else if (currentTab == 1){
            if (this.btnDanDau.isSelected()){
                return this.Top1CaoThuDanDau;
            } else {
                return this.Top1CaoThuDangLen;
            }
        } else if (currentTab == 2){
            if (this.btnDanDau.isSelected()){
                return this.Top1NhietTinhDanDau;
            } else {
                return this.Top1NhietTinhDangLen;
            }
        } else if (currentTab == 4){
            if (this.btnDanDau.isSelected()){
                return this.Top1GaToDanDau;
            } else {
                return this.Top1GaToDangLen;
            }
        } else if (currentTab == 5){
            if (this.btnDanDau.isSelected()){
                return this.Top1CuocUDanDau;
            } else {
                return this.Top1CuocUDangLen;
            }
        }
        return null;
    },
    saveDataTop1PLayer:function (TopPlayer) {
        var currentTab = this.getCurrentTab();
        if (currentTab == 3){
            if (this.btnDanDau.isSelected()){
                this.Top1DaiGia = TopPlayer;
            } else {
                this.Top1DaiGiaDangLen = TopPlayer;
            }
        } else if (currentTab == 1){
            if (this.btnDanDau.isSelected()){
                this.Top1CaoThuDanDau = TopPlayer;
            } else {
                this.Top1CaoThuDangLen = TopPlayer;
            }
        } else if (currentTab == 2){
            if (this.btnDanDau.isSelected()){
                this.Top1NhietTinhDanDau = TopPlayer;
            } else {
                this.Top1NhietTinhDangLen = TopPlayer;
            }
        } else if (currentTab == 4){
            if (this.btnDanDau.isSelected()){
                this.Top1GaToDanDau = TopPlayer;
            } else {
                this.Top1GaToDangLen = TopPlayer;
            }
        } else if (currentTab == 5){
            if (this.btnDanDau.isSelected()){
                this.Top1CuocUDanDau = TopPlayer;
            } else {
                this.Top1CuocUDangLen = TopPlayer;
            }
        }
    },
    DrawTopPlayerInfo:function (TopPlayer) {
        this.saveDataTop1PLayer(TopPlayer);
        var currentTab = this.getCurrentTab();
        if (this.PLSprite == null){
            this.PLSprite = new VvTop1PlayerItem(TopPlayer,currentTab,this.strRank1NumberofGame,this);
            this.PLSprite.x = 188;
            this.PLSprite.y = 428;
            this.addChildBody(this.PLSprite);
        } else {
            this.PLSprite.updateUITop1Player(TopPlayer,currentTab,this.strRank1NumberofGame);
        }
    },
    drawUIWithListPlayer:function (listPlayer,isRichest) {
        if (isRichest === undefined){
            isRichest = false;
        }
        this.saveListData(listPlayer,isRichest);

        if (this.listUITop10 === null){
            this.listUITop10 = [];
        }
        if (this.ItemPlayer === null){
            this.ItemPlayer = new BkSprite();
            this.addChildBody(this.ItemPlayer);
        }
        logMessage("listPlayer: "+listPlayer.length);
        var NumberRealTop = listPlayer.length - 1;
        logMessage();
        // Draw top 10
        var i;
        var iPlayerTop = null;
        var cY = 0;
        var currentTab = this.getCurrentTab();

        for (i= 0;i<listPlayer.length - 1;i++){
            iPlayerTop =listPlayer[i];
            iPlayerTop.logPlayer();
            if (this.listUITop10[i] == null){
                var itemRow = new VvTopPlayerItem(this,currentTab,iPlayerTop,isRichest);
                this.ItemPlayer.addChild(itemRow);
                this.listUITop10[i] = itemRow;
            } else {
                itemRow = this.listUITop10[i];
                itemRow.updateData(currentTab,iPlayerTop,isRichest,this.btnDangLen.isSelected());
            }
            itemRow.y = cY ;
            cY -= CTopPlayerItem.BH_ITEM + 1;
        }

        for (i =listPlayer.length-1;i<10;i++ ){
            if (this.listUITop10[i]){
                itemRow = this.listUITop10[i];
                itemRow.updateDataLoading();
            }
        }

        this.ItemPlayer.x= 305;
        this.ItemPlayer.y = 397;

        // draw me
        var plMe = listPlayer[listPlayer.length-1];
        if (this.listUITop10[10] == null){
            this.itemMe = new VvTopPlayerItem(this,currentTab,plMe,isRichest,false);
            this.addChildBody(this.itemMe);
            this.listUITop10[10] = this.itemMe;
        } else {
            this.itemMe = this.listUITop10[10];
            this.itemMe.updateData(currentTab,plMe,isRichest,this.btnDangLen.isSelected());
        }

        this.itemMe.x = 210;
        this.itemMe.y = 50;

        // Draw 1st Player profile
        var TopPlayer = listPlayer[0];
        var currentTop;
        currentTop = this.getDataCurrentTop();
        if (currentTop === null){
            this.getProfileTopPlayer(TopPlayer.getUserName());
        } else {
            this.DrawTopPlayerInfo(currentTop);
        }

        if (!this.visible){
            this.visible = true;
        }
    },

    onClickDanDau:function () {
        logMessage("onClickDanDau");
        // if (this.btnDanDau.isSelected()){
        //     logMessage("isSelected ->return");
        //     return;
        // }
        this.setSelectBtnDDDL(this.btnDanDau,true);
        this.setSelectBtnDDDL(this.btnDangLen,false);
        this.selectTabContent.x = this.btnDanDau.x;
        var currentTab = this.getCurrentTab();
        this.updateTfGuilde(currentTab);
        logMessage("currentTab "+currentTab);
        if (currentTab === 1) {
            if (this.listCaoThuDanDau === null){
                logMessage("this.listCaoThuDanDau === null");
                this.updateUILoading();
                this.DoGetTopPlayer(11,2);
            } else {
                this.drawUIWithListPlayer(this.listCaoThuDanDau);
            }

        } else if (currentTab === 2){
            if (this.listNhietTinhDanDau === null){
                this.updateUILoading();
                this.DoGetTopPlayer(1,2);
            } else {
                this.drawUIWithListPlayer(this.listNhietTinhDanDau);
            }
        } else if (currentTab === 3){
            if (this.listDaiGia === null){
                this.updateUILoading();
                this.DoGetTopRichestPlayer();
            } else {
                this.drawUIWithListPlayer(this.listDaiGia,true);
            }
        } else if (currentTab === 4){
            if (this.listGaToDanDau === null){
                this.updateUILoading();
                this.DoGetTopPlayer(14,2);
            } else {
                this.drawUIWithListPlayer(this.listGaToDanDau);
            }
        } else if (currentTab === 5){
            if (this.listCuocUDanDau === null){
                this.updateUILoading();
                this.DoGetTopPlayer(13,2);
            } else {
                this.drawUIWithListPlayer(this.listCuocUDanDau);
            }
        }
    },
    onClickDangLen:function () {
        logMessage("onClickDangLen");
        // if (this.btnDangLen.isSelected()){
        //     logMessage("isSelected ->return");
        //     return;
        // }

        this.setSelectBtnDDDL(this.btnDanDau,false);
        this.setSelectBtnDDDL(this.btnDangLen,true);
        this.selectTabContent.x = this.btnDangLen.x;

        var currentTab = this.getCurrentTab();
        this.updateTfGuilde(currentTab,true);

        if (currentTab === 1) {
            if (this.listCaoThuDangLen === null){
                logMessage("loadList dang len");
                this.updateUILoading();
                this.DoGetTopPlayer(11,1);
            } else {
                this.drawUIWithListPlayer(this.listCaoThuDangLen);
            }
        } else if (currentTab === 2){
            if (this.listNhietTinhDangLen === null){
                this.updateUILoading();
                this.DoGetTopPlayer(1,1);
            } else {
                this.drawUIWithListPlayer(this.listNhietTinhDangLen);
            }
        } else if (currentTab === 3){
            if (this.listDaiGiaDangLen === null){
                this.updateUILoading();
                this.DoGetTopPlayer(0,1);
            } else {
                this.drawUIWithListPlayer(this.listDaiGiaDangLen,true);
            }
        } else if (currentTab === 4){
            if (this.listGaToDangLen === null){
                this.updateUILoading();
                this.DoGetTopPlayer(14,1);
            } else {
                this.drawUIWithListPlayer(this.listGaToDangLen);
            }
        } else if (currentTab === 5){
            if (this.listCuocUDangLen === null){
                this.updateUILoading();
                this.DoGetTopPlayer(13,1);
            } else {
                this.drawUIWithListPlayer(this.listCuocUDangLen);
            }
        }
    },
    setSelectBtnDDDL:function (btn,isSelect) {
        if(!btn){
            return;
        }
        btn.setIsSelected(isSelect);
        if(isSelect){
            btn.loadTextures(this.nameResDDDL,this.nameResDDDL,this.nameResDDDL
                ,this.nameResDDDL,ccui.Widget.PLIST_TEXTURE);
        }else{
            btn.loadTextures(this.nameResDDDL,this.nameResDDDL,this.nameResDDDL
                ,this.nameResDDDL,ccui.Widget.PLIST_TEXTURE);
            btn.setTitleColor(cc.color(0xA8, 0x92, 0x86));
        }
    },

    processDoneLoadProfile:function (userData) {
        logMessage("processDoneLoadProfile");
        this.DrawTopPlayerInfo(userData);
    },

    /*
     @type: index of champion list
     @periodId= 1: dang len 2: dan dau
     */
    DoGetTopPlayer: function (type, periodId) {
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.Type = c.NETWORK_GET_TOP_PLAYER;
        packet.Buffer.writeByte(type);
        packet.Buffer.writeByte(periodId);
        packet.Length = HEADER_SIZE;
        packet.CreateHeader();
        BkConnectionManager.send(packet);
    },
    DoGetTopRichestPlayer: function () {
        var packet = new BkPacket();
        //packet.CreatePacketWithOnlyType(c.NETWORK_GET_TOP_RICHEST_PLAYER);
        packet.CreatePacketWithOnlyType(c.GET_TOP_RICHEST_CHAN_PLAYER);
        BkConnectionManager.send(packet);
    },
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },
    onLoadComplete: function (o, tag) {

        switch (tag) {
            case c.NETWORK_GET_TOP_PLAYER_RETURN:
                BkLogicManager.getLogic().setOnLoadComplete(null);
                o.playerList.push(o.mySelf);
                this.drawUIWithListPlayer(o.playerList);
                break;
            case c.GET_TOP_RICHEST_CHAN_PLAYER:
                BkLogicManager.getLogic().setOnLoadComplete(null);
                o.richestPlayerList.push(o.mySelf);
                this.drawUIWithListPlayer(o.richestPlayerList,true);
                break;
            case c.NETWORK_GET_TOP_RICHEST_PLAYER_RETURN:
                BkLogicManager.getLogic().setOnLoadComplete(null);
                o.richestPlayerList.push(o.mySelf);
                this.drawUIWithListPlayer(o.richestPlayerList,true);
                break;
            case c.NETWORK_PROFILE_RETURN:
                //this.initHandleonLoadComplete();
                break;
            case c.NETWORK_GET_PLAYER_ACHIEVEMENT_RETURN:
                BkLogicManager.getLogic().setOnLoadComplete(null);
                this.processDoneLoadProfile(o);
                break;
            case c.NETWORK_TOP_U_TO_RETURN:
                BkLogicManager.getLogic().setOnLoadComplete(null);
                this.drawUIWithListPlayer(o.playerList);
                break;
        }
        Util.removeAnim();
    },
    selectedTabEvent: function (sender, tabIndex) {
        this.DrawUIWithTab(tabIndex);

    },

    DrawUIWithTab: function (i) {
        logMessage("DrawUIWithTab "+i);
        this.initHandleonLoadComplete();
        this.initBtnDDDL();
        this.onClickDanDau();
    }
});