/**
 * Created by vinhnq on 12/21/2016.
 */
NUM_OF_GIAIDAU = 5;
NUM_OF_TRANDAU = 4;

BkMainSoccerWindow = BkWindow.extend({
    parentNode: null,
    listOfGiaiDau:null,
    listOfTranDau:null,
    lblNumOfTranDau:null,
    currentPageNumGiaiDau:1,
    currentPageNumTrandau:1,
    cuocLayer:null,
    ctor: function(parent)
    {
        this._super("Danh sách giải đấu", cc.size(930, 570));
        this.setVisibleOutBackgroundWindow(false);
        this.setMoveableWindow(false);
        this.parentNode = parent;
        this.initUI();
    },

    initUI: function () {
        var self = this;
        this.setDefaultWdBodyBg();
        this.btnLiveScore = createBkButtonPlist(res_name.icon_liveScore, res_name.icon_liveScore, res_name.icon_liveScore,
            res_name.icon_liveScore_hover,"");
        this.btnLiveScore.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnLiveScore.x = 770;
        this.btnLiveScore.y = 568;
        this.addChild(this.btnLiveScore);
        this.btnLiveScore.addClickEventListener(function()
        {
            cc.sys.openURL("http://www.livescore.com/");
            sendGA(BKGA.GAME_CHOOSE, "btn liveScore", BkGlobal.clientDeviceCheck);
        });
        this.btnHelp = createBkButtonPlist(res_name.icon_help_football, res_name.icon_help_football, res_name.icon_help_football,
                res_name.icon_help_football_hover,"");
        this.btnHelp.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnHelp.x = 810;
        this.btnHelp.y = 568;
        this.addChild(this.btnHelp);
        this.btnHelp.addClickEventListener(function()
        {
            cc.sys.openURL(cc.game.config.app.guideBongDaUrl);
        });

        this.statistic = createBkButtonPlist(res_name.icon_footbalStatistic, res_name.icon_footbalStatistic, res_name.icon_footbalStatistic,
            res_name.icon_footbalStatistic_hover,"");
        this.statistic.setTitleFontSize(BTN_INGAME_SIZE);
        this.statistic.x = 850;
        this.statistic.y = 568;
        this.addChild(this.statistic);
        this.statistic.addClickEventListener(function()
        {
            var statisticWD = new BkSoccerStatisticWD(self);
            statisticWD.setParentWindow(self);
            statisticWD.showWithParent();
        });
        this.getAllGiaiDau(BET_FOOTBALL.GET_ALL_GIAI_DAUS_EVENT);

        this.btnPreviousGiaiDau = Util.createBtnNav(res_name.btn_back_small, function () {
            if(self.currentPageNumGiaiDau > 1)
            {
                self.currentPageNumGiaiDau--;
                self.updatelistOfGiaiDauUI();
            }else
            {
                self.currentPageNumGiaiDau = Math.round(self.listOfGiaiDau.length/NUM_OF_GIAIDAU);
                if(self.currentPageNumGiaiDau == 1)
                {
                    self.currentPageNumGiaiDau++;
                }
                self.updatelistOfGiaiDauUI();
            }
        });
        this.btnPreviousGiaiDau.x =  45;
        this.btnPreviousGiaiDau.y =  435;
        this.btnPreviousGiaiDau.visible = false;
        this.addChildBody(this.btnPreviousGiaiDau);

        this.btnPreviousTranDau = Util.createBtnNav(res_name.btn_back_small, function () {
            if(self.currentPageNumTrandau > 1)
            {
                self.currentPageNumTrandau--;
                self.updatelistOfTranDauUI();
            }else
            {
                self.currentPageNumTrandau = Math.round(self.listOfTranDau.length/NUM_OF_TRANDAU);
                if(self.currentPageNumTrandau == 1)
                {
                    self.currentPageNumTrandau++;
                }
                self.updatelistOfTranDauUI();
            }
        });
        this.btnPreviousTranDau.x =  this.btnPreviousGiaiDau.x;
        this.btnPreviousTranDau.y =  200;
        this.btnPreviousTranDau.visible = false;
        this.addChildBody(this.btnPreviousTranDau);


        this.btnNextGiaiDau = Util.createBtnNav(res_name.btn_next_small, function ()
        {
            //logMessage("btnNextGiaiDau Clicked");
            self.currentPageNumGiaiDau++;
            self.updatelistOfGiaiDauUI();
        });
        this.btnNextGiaiDau.x = 885 ;
        this.btnNextGiaiDau.y = this.btnPreviousGiaiDau.y;
        this.btnNextGiaiDau.visible = false;
        this.addChildBody(this.btnNextGiaiDau);

        this.btnNextTranDau = Util.createBtnNav(res_name.btn_next_small, function ()
        {
            self.currentPageNumTrandau++;
            self.updatelistOfTranDauUI();
        });
        this.btnNextTranDau.x = this.btnNextGiaiDau.x ;
        this.btnNextTranDau.y =  this.btnPreviousTranDau.y;
        this.btnNextTranDau.visible = false;
        this.addChildBody(this.btnNextTranDau);
        this.setCallbackRemoveWindow(self.onRemoveWD);
    },
    getAllGiaiDau: function(betFootballType) {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        bkCommonLogic.getAllGiaiDau(betFootballType);
        Util.showAnim();
    },
    onLoadComplete:function(o, packet)
    {
        if(packet.Type != c.NETWORK_BET_FOOTBALL_RETURN)
        {
            return;
        }
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        var betFootballType = packet.Buffer.readByte();
        switch (betFootballType) {
            case BET_FOOTBALL.GET_ALL_GIAI_DAUS_EVENT:
                this.getAllGiaidauReturn(packet);
                break;
            default:
                break;
        }
    },
    getAllGiaidauReturn:function(packet)
    {
        BkGlobal.currentServerTime =  packet.Buffer.readLong()/1000;
        this.schedule(this.onTick,1);
        var numberOfGiaidau =  packet.Buffer.readInt();
        this.listOfGiaiDau = [];
        for(var i = 0; i < numberOfGiaidau; i++)
        {
            var id = packet.Buffer.readInt();
            var name = packet.Buffer.readString();
            var url = Util.getGiaidauLogoUrl(id);
            var giaiDauItem = new BkGiaiDauItem(name,id,url);
            var gaiDauItemSprite = new BkGiaiDauItemSprite(giaiDauItem);
            logMessage("ten giai dau:" + name + "id:" + id + "url:" + url);
            this.listOfGiaiDau.push(gaiDauItemSprite);
        }
        this.sortListOfgiaiDauById();
        var numberOfTrandau = packet.Buffer.readInt();
         this.listOfTranDau = [];
        for( var j = 0; j < numberOfTrandau; j++)
        {
            var idMatch =  packet.Buffer.readInt();
            var startTime = packet.Buffer.readLong()/1000;
            var idTeam1 = packet.Buffer.readInt();
            var nameTeam1 = packet.Buffer.readString();
            var idTeam2 = packet.Buffer.readInt();
            var nameTeam2 = packet.Buffer.readString();
            var ratio1Win = packet.Buffer.readInt()/10000;
            ratio1Win = parseFloat(ratio1Win).toFixed(2);

            var ratioDraw = packet.Buffer.readInt()/10000;
            ratioDraw = parseFloat(ratioDraw).toFixed(2);

            var ratio2Win = packet.Buffer.readInt()/10000;
            ratio2Win = parseFloat(ratio2Win).toFixed(2);

            var matchInfo = new BkTranDauItem(idMatch,nameTeam1,nameTeam2,idTeam1,idTeam2,startTime,ratio1Win,ratioDraw,ratio2Win);
            var matchInfoSprite = new BkTranDauItemSprite(matchInfo);
            this.listOfTranDau.push(matchInfoSprite);
            //logMessage("idMatch:" + idMatch + "startTime:" + startTime + "idTeam1:" + idTeam1 +"nameTeam1:" + nameTeam1 + "idTeam2:" + idTeam2 + "nameTeam2:" + nameTeam2 + "ratio1Win:"
             //   + ratio1Win + "ratioDraw:" + ratioDraw + "ratio2Win:" + ratio2Win );
        }
        if(this.listOfGiaiDau.length > 0)
        {
            this.initListOfGiaiDauUI();
            this.updatelistOfGiaiDauUI();
        }
        this.lblNumOfTranDau = new BkLabel("Trận cầu đinh("+ this.listOfTranDau.length + " trận)", "Arial", 16);
        this.lblNumOfTranDau.x = 465;
        this.lblNumOfTranDau.y = 355;
        this.addChildBody(this.lblNumOfTranDau);

        if(this.listOfTranDau.length > 0)
        {
            this.initListOfTranDauUI();
            this.updatelistOfTranDauUI();
        }
    },
    sortListOfgiaiDauById:function()
    {
        for(var i = 0; i < this.listOfGiaiDau.length - 1; i++)
        {
            for(var j = i + 1; j < this.listOfGiaiDau.length; j++)
            {
                var tmpgd;
                if(this.listOfGiaiDau[i].giaiDauData.id > this.listOfGiaiDau[j].giaiDauData.id)
                {
                    tmpgd = this.listOfGiaiDau[i];
                    this.listOfGiaiDau[i] = this.listOfGiaiDau[j];
                    this.listOfGiaiDau[j] = tmpgd;
                }
            }
        }
    },
    initListOfTranDauUI:function()
    {
        var trandauSpritei;
        for(var i = 0; i < this.listOfTranDau.length; i ++)
        {
            trandauSpritei = this.listOfTranDau[i];
            this.addChildBody(trandauSpritei);
            trandauSpritei.visible = false;
        }
    },
    initListOfGiaiDauUI:function()
    {
        var giaidauSpritei;
        for(var i = 0; i < this.listOfGiaiDau.length; i ++)
        {
            giaidauSpritei = this.listOfGiaiDau[i];
            this.addChildBody(giaidauSpritei);
            giaidauSpritei.visible = false;
        }
    },
    onTick:function()
    {
        BkGlobal.currentServerTime++;
    },
    updatelistOfGiaiDauUI:function()
    {
        this.setInvisibleAllGiaidau();
        this.btnPreviousGiaiDau.visible = (this.listOfGiaiDau.length > NUM_OF_GIAIDAU);
        this.btnNextGiaiDau.visible = (this.listOfGiaiDau.length > NUM_OF_GIAIDAU);
        var count = 0;
        var startX = 90;
        var startY = 445;
        var ITEM_WIDTH  = 80;
        var width = 930;
        var numOfItem = 5;
        var offset = (width - 2*startX  - numOfItem*ITEM_WIDTH)/(numOfItem - 1);
        var start = (this.currentPageNumGiaiDau - 1)*NUM_OF_GIAIDAU;
        if(start >= this.listOfGiaiDau.length)
        {
            start = 0;
            this.currentPageNumGiaiDau = 1;
        }
        var end = start + NUM_OF_GIAIDAU;
        if(end > this.listOfGiaiDau.length )
        {
            end = this.listOfGiaiDau.length;
        }
        for(var i = start; i < end; i ++)
        {
            var giaidauSpritei =  this.listOfGiaiDau[i];
            giaidauSpritei.visible = true;
            giaidauSpritei.setHandleClickCallBack(this);
            giaidauSpritei.setEnableEventListener(true);
            {
                giaidauSpritei.x = startX  + count*(ITEM_WIDTH + offset) + ITEM_WIDTH/2;

            }
            giaidauSpritei.y = startY;
            count++;
        }
    },
    updatelistOfTranDauUI:function()
    {
        this.setInvisibleAllTrandau();
        if(this.btnPreviousTranDau != undefined && this.btnPreviousTranDau != null)
        {
            this.btnPreviousTranDau.visible = (this.listOfTranDau.length > NUM_OF_TRANDAU);
            this.btnNextTranDau.visible = (this.listOfTranDau.length > NUM_OF_TRANDAU);
        }
        var count = 0;
        var startX = 65;
        var startY = 260;
        var trandauSpritei;
        var offset = 2;
        var start = (this.currentPageNumTrandau - 1)*NUM_OF_TRANDAU;
        if(start >= this.listOfTranDau.length)
        {
            start = 0;
            this.currentPageNumTrandau = 1;
        }
        var end = start + NUM_OF_TRANDAU;
        if(end > this.listOfTranDau.length )
        {
            end = this.listOfTranDau.length;
        }
        for(var i = start; i < end; i ++)
        {
            trandauSpritei = this.listOfTranDau[i];
            trandauSpritei.visible = true;
            trandauSpritei.setHandleClickCallBack(this);
            trandauSpritei.setEnableEventListener(true);
            trandauSpritei.x = startX;
            trandauSpritei.y = startY - count*(offset + 80) ;
            count++;
        }
    },
    setInvisibleAllTrandau:function()
    {
        for(var i = 0; i < this.listOfTranDau.length; i++)
        {
            this.listOfTranDau[i].visible = false;
            this.listOfTranDau[i].setEnableEventListener(false);
        }
    },
    setInvisibleAllGiaidau:function()
    {
        for(var i = 0; i < this.listOfGiaiDau.length; i++)
        {
            this.listOfGiaiDau[i].visible = false;
            this.listOfGiaiDau[i].setHandleClickCallBack(null);
            this.listOfGiaiDau[i].setEnableEventListener(false);
        }
    },
    onClickedGiaiDau:function(gd)
    {
        sendGA(BKGA.GAME_CHOOSE, "Click GiaiDau:" + gd.giaiDauData.name, BkGlobal.clientDeviceCheck);
        this.giaidauWD = new BkGiaiDauWindow(this,gd,false);
        this.giaidauWD.setParentWindow(this);
        this.giaidauWD.showWithParent();
    },
    onClickedTranDau:function(td)
    {
        var trandauWD = new BkTranDauWindow(this,td,false);
        trandauWD.showWithParent();
        trandauWD.setParentWindow(this);
        trandauWD.onClickedTranDau(td)
    },
    onRemoveWD:function()
    {
        if(this.cuocLayer != undefined && this.cuocLayer != null)
        {
            Util.removeArrList(this.cuocLayer.listOfCuocSprite);
        }
        Util.removeArrList(this.listOfGiaiDau);
        Util.removeArrList(this.listOfTranDau);
    },
});