/**
 * Created by vinhnq on 1/4/2017.
 */
BkSoccerStatisticWD = BkTabWindow.extend({
    _tabBodyLayout: null,
    _tabList: ["Ai vừa chơi", "Cược của bạn", "Top lãi nhất"],
    listUIItem:null,
    keoList:null,
    ticketList:null,
    currentPageNumTicket:1,
    ctor: function ()
    {
        this.WINDOW_WIDTH = 680;
        this.WINDOW_HEIGHT = 570;
        this.NUM_OF_ROW = 7;
        this._super("Thống kê", cc.size(this.WINDOW_WIDTH, this.WINDOW_HEIGHT), this._tabList.length, this._tabList);
        sendGA(BKGA.GAME_CHOOSE, "btn Soccer Statistic", BkGlobal.clientDeviceCheck);
        this.initUI();
    },
    onLoadComplete:function(o, packet)
    {
        if(packet.Type != c.NETWORK_BET_FOOTBALL_RETURN)
        {
            logMessage("received unexpected event")
            return;
        }
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        var betFootballType = packet.Buffer.readByte();
        switch (betFootballType)
        {
            case BET_FOOTBALL.GET_LATEST_CUOCS_EVENT:
            case BET_FOOTBALL.GET_ALL_PLAYER_CUOCS_EVENT:
            case BET_FOOTBALL.GET_TOP_WINNING_CUOCS_EVENT:
                this.getTickets(packet);
                break;
            case BET_FOOTBALL.GET_CUOC_EVENT:
                this.getCuocEvent(packet);
            default:
                break;
        }
    },
    initUI: function () {
        this.setMoveableWindow(false);
        this.setVisibleOutBackgroundWindow(true);
        this.addTabChangeEventListener(this.selectedTabEvent, this);
        this.drawUIWithTab(1);
    },

    selectedTabEvent: function (sender, tabIndex) {
        this.drawUIWithTab(tabIndex);
    },

    drawUIWithTab: function(tabIndex) {
        this.cleanGUI();
        this._tabBodyLayout = new cc.Layer();
        this._tabBodyLayout.setContentSize(this.getBodySize().width, this.getBodySize().height);
        this.addChildBody(this._tabBodyLayout,3);
        switch (tabIndex){
            case 1:
                this.getLastestCuocEvent();
                break;
            case 2:
                this.getMyCuocEvent();
                break;
            case 3:
                this.getTopWinningEvent();
                break;
            default :
                break;
        }
    },
    getLastestCuocEvent:function()
    {
        BkLogicManager.getLogic().setOnLoadComplete(this);
        BkLogicManager.getLogic().getLastestCuocEvent(BET_FOOTBALL.GET_LATEST_CUOCS_EVENT);
        Util.showAnim();
    },
    getMyCuocEvent:function()
    {
        BkLogicManager.getLogic().setOnLoadComplete(this);
        BkLogicManager.getLogic().getLastestCuocEvent(BET_FOOTBALL.GET_ALL_PLAYER_CUOCS_EVENT);
        Util.showAnim();
    },
    getTopWinningEvent:function()
    {
        BkLogicManager.getLogic().setOnLoadComplete(this);
        BkLogicManager.getLogic().getLastestCuocEvent(BET_FOOTBALL.GET_TOP_WINNING_CUOCS_EVENT);
        Util.showAnim();
    },
    getTickets:function(packet)
    {
        Util.removeArrList(this.ticketList);
        this.ticketList = [];
        while(packet.Buffer.isReadable())
        {
            var cuocId = packet.Buffer.readInt();
            var playerName = packet.Buffer.readString();
            var placeTime = packet.Buffer.readLong()/1000;
            var cuocType = packet.Buffer.readByte();
            var betMoney = packet.Buffer.readInt();
            var winningMoney =  packet.Buffer.readInt();
            var currentTab = this.getCurrentTab();
            var cuocItem = new BkSoccerStatisticItemSprite(cuocId,playerName,placeTime,cuocType,betMoney,winningMoney,this.getCurrentTab());
            logMessage("cuocId:" + cuocId + "playerName:" + playerName + "placeTime:" + placeTime + "cuocType:" + cuocType+ "betMoney:" + betMoney + "winningMoney" + winningMoney );
            this.addChildBody(cuocItem);
            this.ticketList.push(cuocItem);
        }
        this.drawTicketUI();
    },
    drawTicketUI:function()
    {
        var self = this;
        if(this.ticketList.length > this.NUM_OF_ROW)
        {
            if(this.btnPreviousTicket == undefined || this.btnPreviousTicket == null)
            {
                this.btnPreviousTicket = Util.createBtnNav(res_name.btn_back_small, function () {
                    if (self.currentPageNumTicket > 1) {
                        self.currentPageNumTicket--;
                        self.updatelistOfTicket();
                    } else {
                        self.currentPageNumTicket = Math.round(self.ticketList.length / self.NUM_OF_ROW);
                        if (self.currentPageNumTicket == 1) {
                            self.currentPageNumTicket++;
                        }
                        self.updatelistOfTicket();
                    }
                });
                this.btnPreviousTicket.x = 40;
                this.btnPreviousTicket.y = 250;
                this.btnPreviousTicket.visible = true;
                this.addChildBody(this.btnPreviousTicket);
            }

            if(this.btnNextTicket == undefined || this.btnNextTicket == null)
            {
                this.btnNextTicket = Util.createBtnNav(res_name.btn_next_small, function () {
                    self.currentPageNumTicket++;
                    self.updatelistOfTicket();

                });
                this.btnNextTicket.x = 640;
                this.btnNextTicket.y = this.btnPreviousTicket.y;
                this.btnNextTicket.visible = true;
                this.addChildBody(this.btnNextTicket);
            }

        }
        this.updatelistOfTicket();
    },
    showTicket:function()
    {
        if(this.ticketList.length == 0)
        {
            if(this.lblNoticket == undefined || this.lblNoticket == null)
            {
                this.lblNoticket = new BkLabel("Danh sách trống","arial",16);
                this.lblNoticket.x = this.WINDOW_WIDTH/2;
                this.lblNoticket.y = this.WINDOW_HEIGHT/2;
                this.addChildBody(this.lblNoticket);
            }
            this.lblNoticket.visible = true;
            return;
        }else
        {
            if(this.lblNoticket != undefined && this.lblNoticket != null)
            {
                this.lblNoticket.visible = false;
            }
        }
        var count = 0;
        var startY = 450;
        var offsetY = 66;
        var ticketi;
        var start = (this.currentPageNumTicket - 1)*this.NUM_OF_ROW;
        if(start >= this.ticketList.length)
        {
            start = 0;
            this.currentPageNumTicket = 1;
        }
        var end = start + this.NUM_OF_ROW;
        if(end > this.ticketList.length )
        {
            end = this.ticketList.length;
        }
        for(var i = start; i < end; i ++)
        {
            ticketi = this.ticketList[i];
            ticketi.visible = true;
            ticketi.setHandleClickCallBack(this);
            ticketi.setEnableEventListener(true);
            ticketi.x = this.WINDOW_WIDTH/2;
            ticketi.y = startY - count*(offsetY) ;
            count++;
        }

    },
    updatelistOfTicket:function()
    {
        this.setInvisibleAllTicket();
        if(this.btnPreviousTicket != undefined && this.btnPreviousTicket != null)
        {
            this.btnPreviousTicket.visible = (this.ticketList.length > this.NUM_OF_ROW);
            this.btnNextTicket.visible = (this.ticketList.length > this.NUM_OF_ROW);
        }
        this.showTicket();
    },
    setInvisibleAllTicket:function()
    {
        for(var i = 0; i < this.ticketList.length; i++)
        {
            this.ticketList[i].visible = false;
            this.ticketList[i].setEnableEventListener(false);
        }
    },
    onClickStaticItem:function(item)
    {
        logMessage(item.cuocId);
        var cuocDetailsWD = new BkCuocDetailsWD(this,item);
        cuocDetailsWD.setParentWindow(this);
        cuocDetailsWD.showWithParent();
    },
    cleanGUI: function () {
        if (this._tabBodyLayout != null) {
            this._tabBodyLayout.removeFromParent();
        }
    }
});