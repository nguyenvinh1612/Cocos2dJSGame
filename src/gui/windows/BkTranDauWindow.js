/**
 * Created by vinhnq on 12/21/2016.
 */
GDS_NUM_OF_TRANDAU = 5;
BkTranDauWindow = BkWindow.extend({
    parentNode: null,
    ctor: function(parent,td,isClean)
    {
        this.currentMatchName = td.tranDauData.nameTeam1  + " - "+ td.tranDauData.nameTeam2;
        this.currentMatchId = td.tranDauData.idMatch;
        this._super(this.currentMatchName, cc.size(930, 570),null,null,isClean);
        this._btnClose.loadTextures(res_name.icon_soccer_back,res_name.icon_soccer_back,res_name.icon_soccer_back
            ,res_name.icon_soccer_back_hover,ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x = 40;
        this._btnClose.y = 532;
        this.setVisibleOutBackgroundWindow(false);
        this.setMoveableWindow(false);
        this.parentNode = parent;
        this.setDefaultWdBodyBg();
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
    getAllKeo: function(betFootballType,gdid) {
        var bkCommonLogic = BkLogicManager.getLogic();
        bkCommonLogic.setOnLoadComplete(this);
        bkCommonLogic.getAllKeo(betFootballType,gdid);
        Util.showAnim();
    },
    onLoadComplete:function(o, packet)
    {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        var betFootballType = packet.Buffer.readByte();
        switch (betFootballType)
        {
            case BET_FOOTBALL.GET_ALL_KEOS_EVENT:
                this.getAllKeoReturn(packet);
                break;
            default:
                break;
        }
    },
    getAllKeoReturn:function(packet)
    {
        var listOfKeoItem = [];
        while(packet.Buffer.isReadable())
        {
            var keoId = packet.Buffer.readInt();
            var winningRate = packet.Buffer.readInt()/10000;
            winningRate = parseFloat(winningRate).toFixed(2);

            var keoItem = new BkKeoItem(keoId,winningRate,this.currentMatchId,this.currentMatchName);
            listOfKeoItem.push(keoItem);
            //logMessage("keoid:" + keoId + "winningRate:" + winningRate + "keoName:" + keoItem.keoName + "groupName:" + keoItem.groupName );
        }
        if(listOfKeoItem.length > 0)
        {
            if(this.keoLayer != undefined && this.keoLayer != null)
            {
                this.keoLayer.removeSelf();
            }
            this.keoLayer = new BkKeoSpriteList(listOfKeoItem);
            this.keoLayer.y = 2;
            this.keoLayer.updateSelectedKeo(this.parentNode.cuocLayer.listOfCuocSprite);
            this.keoLayer.setHandleKeoClickCallback(this.parentNode.cuocLayer);
            this.parentNode.cuocLayer.setHandleKeoClickCallback(this.keoLayer);
            this.addChildBody(this.keoLayer);
        }
    },
    onClickedTranDau:function(td)
    {
        this.getAllKeo(BET_FOOTBALL.GET_ALL_KEOS_EVENT,td.tranDauData.idMatch);
        this.currentMatchId = td.tranDauData.idMatch;
    },

});