/**
 * Created by vinhnq on 12/21/2016.
 */
GDS_NUM_OF_TRANDAU = 5;
BkGiaiDauWindow = BkWindow.extend({
    parentNode:null,
    lblNumOfTranDau:null,
    currentPageNumTrandau:1,
    ctor: function(parent,gd,isClean)
    {
        this._super(gd.giaiDauData.name, cc.size(930, 570),null,null,isClean);
        this._btnClose.loadTextures(res_name.icon_soccer_back,res_name.icon_soccer_back,res_name.icon_soccer_back
            ,res_name.icon_soccer_back_hover,ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x = 40;
        this._btnClose.y = 532;
        this.setVisibleOutBackgroundWindow(false);
        this.setMoveableWindow(false);
        this.parentNode = parent;
        this.initUI(gd);
        if(this.parentNode.cuocLayer == null)
        {
            this.parentNode.cuocLayer = new BkCuocSpriteList();
            this.addChildBody(this.parentNode.cuocLayer);
        }
        else
        {
            this.parentNode.cuocLayer.removeFromParent(false);
            this.addChildBody(this.parentNode.cuocLayer);
        }
        this.statistic = createBkButtonPlist(res_name.icon_footbalStatistic, res_name.icon_footbalStatistic, res_name.icon_footbalStatistic,
            res_name.icon_footbalStatistic_hover,"");
        this.statistic.setTitleFontSize(BTN_INGAME_SIZE);
        this.statistic.x = 850;
        this.statistic.y = 568;
        this.addChild(this.statistic);
        var self = this;
        this.statistic.addClickEventListener(function()
        {
            var statisticWD = new BkSoccerStatisticWD(self);
            statisticWD.setParentWindow(self);
            statisticWD.showWithParent();
        });
    },

    initUI: function (gd)
    {
        var self = this;
        this.setDefaultWdBodyBg();
        this.getAllTranDau(BET_FOOTBALL.GET_ALL_TRAN_DAUS_EVENT, gd.giaiDauData.id);
        this.btnPreviousTranDau = Util.createBtnNav(res_name.btn_back_small, function () {
            if (self.currentPageNumTrandau > 1) {
                self.currentPageNumTrandau--;
                self.updatelistOfTranDauUI();
            } else {
                self.currentPageNumTrandau = Math.round(self.listOfTranDau.length / GDS_NUM_OF_TRANDAU);
                if (self.currentPageNumTrandau == 1) {
                    self.currentPageNumTrandau++;
                }
                self.updatelistOfTranDauUI();
            }
        });
        this.btnPreviousTranDau.x = 50;
        this.btnPreviousTranDau.y = 250;
        this.btnPreviousTranDau.visible = false;
        this.addChildBody(this.btnPreviousTranDau);

        this.btnNextTranDau = Util.createBtnNav(res_name.btn_next_small, function () {
            logMessage("btnNextTranDau Clicked");
            self.currentPageNumTrandau++;
            self.updatelistOfTranDauUI();

        });
        this.btnNextTranDau.x = 560;
        this.btnNextTranDau.y = this.btnPreviousTranDau.y;
        this.btnNextTranDau.visible = false;
        this.addChildBody(this.btnNextTranDau);
    },
    getAllTranDau: function(betFootballType,gdid) {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        bkCommonLogic.getAllTranDau(betFootballType,gdid);
        Util.showAnim();
    },
    onLoadComplete:function(o, packet)
    {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        var betFootballType = packet.Buffer.readByte();
        switch (betFootballType)
        {
            case BET_FOOTBALL.GET_ALL_TRAN_DAUS_EVENT:
                this.getAllTranDauReturn(packet);
                break;
            default:
                break;
        }
    },
    getAllTranDauReturn:function(packet)
    {
        BkGlobal.currentServerTime =  packet.Buffer.readLong()/1000;
        var numberOfTrandau = packet.Buffer.readInt();
        Util.removeArrList(this.listOfTranDau);
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
            ratio1Win  = parseFloat(ratio1Win).toFixed(2);

            var ratioDraw = packet.Buffer.readInt()/10000;
            ratioDraw  = parseFloat(ratioDraw).toFixed(2);

            var ratio2Win = packet.Buffer.readInt()/10000;
            ratio2Win  = parseFloat(ratio2Win).toFixed(2);

            var matchInfo = new BkTranDauItem(idMatch,nameTeam1,nameTeam2,idTeam1,idTeam2,startTime,ratio1Win,ratioDraw,ratio2Win);
            var matchInfoSprite = new BKTranDauItemSmallSprite(matchInfo);
            matchInfoSprite.setHandleClickCallBack(this);
            this.listOfTranDau.push(matchInfoSprite);
            logMessage("idMatch:" + idMatch + "startTime:" + startTime + "idTeam1:" + idTeam1 +"nameTeam1:" + nameTeam1 + "idTeam2:" + idTeam2 + "nameTeam2:" + nameTeam2 + "ratio1Win:"
                + ratio1Win + "ratioDraw:" + ratioDraw + "ratio2Win:" + ratio2Win );
        }
        if(this.lblNoMatch == undefined && this.lblNoMatch == null)
        {
            this.lblNoMatch = new BkLabel("Không có trận đấu nào.","Arial",16);
            this.lblNoMatch.setTextColor(cc.color(255,255,0));
            this.lblNoMatch.x = 465;
            this.lblNoMatch.y = 265;
            this.lblNoMatch.visible = false;
            this.addChildBody(this.lblNoMatch);
        }
        if(this.listOfTranDau.length > 0)
        {
            this.lblNoMatch.visible = false;
            this.lblNumOfTranDau = new BkLabel("Trận cầu đinh("+ this.listOfTranDau.length + " trận)", "Arial", 16);
            this.lblNumOfTranDau.x = 320;
            this.lblNumOfTranDau.y = 470;
            this.addChildBody(this.lblNumOfTranDau);
            this.initListOfTranDauUI();
            this.updatelistOfTranDauUI();
        }else
        {
            this.lblNoMatch.visible = true;
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
    updatelistOfTranDauUI:function()
    {
        this.setInvisibleAllTrandau();
        this.btnPreviousTranDau.visible = (this.listOfTranDau.length > GDS_NUM_OF_TRANDAU);
        this.btnNextTranDau.visible = (this.listOfTranDau.length > GDS_NUM_OF_TRANDAU);
        var count = 0;
        var startX = 65;
        var startY = 375;
        var trandauSpritei;
        var offset = 2;
        var start = (this.currentPageNumTrandau - 1)*GDS_NUM_OF_TRANDAU;
        if(start >= this.listOfTranDau.length)
        {
            start = 0;
            this.currentPageNumTrandau = 1;
        }
        var end = start + GDS_NUM_OF_TRANDAU;
        if(end > this.listOfTranDau.length )
        {
            end = this.listOfTranDau.length;
        }
        for(var i = start; i < end; i ++)
        {
            trandauSpritei = this.listOfTranDau[i];
            trandauSpritei.visible = true;
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
    onClickedTranDau:function(td)
    {
        var trandauWD = new BkTranDauWindow(this.parentNode,td,false);
        var self = this;
        trandauWD.setParentWindow(this);
        trandauWD.showWithParent();
        trandauWD.onClickedTranDau(td);
        trandauWD.setCallbackRemoveWindow(function()
        {
            if(self.parentNode.cuocLayer == null)
            {
                self.parentNode.cuocLayer = new BkCuocSpriteList();
                self.addChildBody(self.parentNode.cuocLayer);
            }else
            {
                self.parentNode.cuocLayer.removeFromParent(false);
                self.addChildBody(self.parentNode.cuocLayer);
            }
            if(trandauWD.keoLayer != undefined && this.keoLayer != null)
            {
                trandauWD.keoLayer.removeSelf();
            }
        });
    },
});