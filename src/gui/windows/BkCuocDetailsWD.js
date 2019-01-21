/**
 * Created by vinhnq on 1/5/2017.
 */
BkCuocDetailsWD = BkWindow.extend({
    currentPageNumKeo:1,
    ctor: function (parentNode,cuoc)
    {
        this.cuoc = cuoc;
       // this.WINDOW_WIDTH = 550;
        this.WINDOW_WIDTH = 580;

        this._super("Thông tin cược", cc.size(this.WINDOW_WIDTH, 360), parentNode);
        this.setMoveableWindow(true);
        this.setVisibleOutBackgroundWindow(true);
        this.initWd(cuoc);
        this.NUM_OF_ROW = 3;
    },
    initWd: function (cuoc) {
        this.setDefaultWdBodyBg();
        this.getCuocDetails(cuoc.cuocId);
    },
    onLoadComplete:function(o, packet)
    {
        if(packet.Type != c.NETWORK_BET_FOOTBALL_RETURN)
        {
            logMessage("received unexpected event");
            return;
        }
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        var betFootballType = packet.Buffer.readByte();
        switch (betFootballType)
        {
            case BET_FOOTBALL.GET_CUOC_EVENT:
                this.getCuocEvent(packet);
            default:
                break;
        }
    },
    getCuocEvent: function (packet) {
        var cuocId = packet.Buffer.readInt();
        var betMoney = packet.Buffer.readInt();
        var placedTime = packet.Buffer.readLong();
        var winningMoney = packet.Buffer.readInt();
        var isOpening = winningMoney == -1;
        var size = packet.Buffer.readByte();
        var isCuocDon = (size == 1);
        if(isCuocDon)// cuoc don
        {
            this.lblCuocType = new BkLabel("Cược Đơn","Arial",20);
        }else
        {
            this.lblCuocType = new BkLabel("Cược Xiên","Arial",20);
        }
        this.lblCuocType.x = 110;
        this.lblCuocType.y = 230;
        this.addChildBody(this.lblCuocType);

        this.lblTienCuoc = new BkLabel("Tiền cược: " + convertStringToMoneyFormat(this.cuoc.betMoney,true) + "$","Arial",16);
        this.lblTienCuoc.x = this.lblCuocType.x - this.lblCuocType.getContentSize().width/2 - 30 + this.lblTienCuoc.getContentSize().width/2;  ;
        this.lblTienCuoc.y = 200;
        this.addChildBody(this.lblTienCuoc);

        Util.removeArrList(this.keoList);
        this.keoList = [];
        var totalRate = 1;
        while (packet.Buffer.isReadable()) {
            var keoId = packet.Buffer.readInt();
            var tylechung = packet.Buffer.readInt() / 10000;
            totalRate = totalRate*tylechung;
            var matchName = packet.Buffer.readString();
            matchName += " - ";
            matchName += packet.Buffer.readString();
            var betItem = new BkKeoItem(keoId, tylechung, null, matchName);
            var keoSprite = new BkBetItemSprite(betItem);
            keoSprite.removebtnClose();
            this.addChildBody(keoSprite);
            this.keoList.push(keoSprite);
        }
        totalRate = (Math.floor(totalRate * 100) / 100).toFixed(2);
        this.lblTyLeChung = new BkLabel("Tỷ lệ chung: " + totalRate,"Arial",16);
        this.lblTyLeChung.x = this.lblTienCuoc.x - this.lblTienCuoc.getContentSize().width/2 + this.lblTyLeChung.getContentSize().width/2  ;
        this.lblTyLeChung.y = 170;
        this.addChildBody(this.lblTyLeChung);

        var strWin = "Chưa xử lý";
        if(!isOpening)
        {
            if(winningMoney == 0)
            {
                strWin = "Thua";
            }else if(winningMoney == -2)
            {
                strWin = "Trận đấu hoãn, đã trả lại tiền";
            }else
            {
                strWin = "Tiền thắng: " +  convertStringToMoneyFormat(winningMoney,true) + "$";
            }
        }
        this.lblTienThang = new BkLabel(strWin,"Arial",16);
        this.lblTienThang.setTextColor(cc.color(255,255,0));
        this.lblTienThang.x = this.lblTyLeChung.x - this.lblTyLeChung.getContentSize().width/2 + this.lblTienThang.getContentSize().width/2 ;
        this.lblTienThang.y = 140;
        this.addChildBody(this.lblTienThang);
        this.drawCuocUI();
    },
    drawCuocUI:function()
    {
        var self = this;
        if(this.keoList.length > this.NUM_OF_ROW)
        {
            if(this.btnPreviousKeo == undefined || this.btnPreviousKeo == null)
            {
                this.btnPreviousKeo = Util.createBtnNav(res_name.btn_back_small, function () {
                    if (self.currentPageNumKeo > 1) {
                        self.currentPageNumKeo--;
                        self.updatelistOfKeo();
                    } else {
                        self.currentPageNumKeo = Math.round(self.keoList.length / self.NUM_OF_ROW);
                        if (self.currentPageNumKeo == 1) {
                            self.currentPageNumKeo++;
                        }
                        self.updatelistOfKeo();
                    }
                });
                this.btnPreviousKeo.x = 233;
                this.btnPreviousKeo.y = 150;
                this.btnPreviousKeo.visible = true;
                this.addChildBody(this.btnPreviousKeo);
            }

            if(this.btnNextKeo == undefined || this.btnNextKeo == null)
            {
                this.btnNextKeo = Util.createBtnNav(res_name.btn_next_small, function () {
                    self.currentPageNumKeo++;
                    self.updatelistOfKeo();

                });
                this.btnNextKeo.x = 547;
                this.btnNextKeo.y = this.btnPreviousKeo.y;
                this.btnNextKeo.visible = true;
                this.addChildBody(this.btnNextKeo);
            }

        }
        this.updatelistOfKeo();
    },
    showKeo:function()
    {
        var count = 0;
        var startY = 230;
        var offsetY = 86;
        var keoi;
        var start = (this.currentPageNumKeo - 1)*this.NUM_OF_ROW;
        if(start >= this.keoList.length)
        {
            start = 0;
            this.currentPageNumKeo = 1;
        }
        var end = start + this.NUM_OF_ROW;
        if(end > this.keoList.length )
        {
            end = this.keoList.length;
        }
        for(var i = start; i < end; i ++)
        {
            keoi = this.keoList[i];
            keoi.visible = true;
            keoi.x = this.WINDOW_WIDTH/2 + 100;
            keoi.y = startY - count*(offsetY) ;
            count++;
        }

    },
    updatelistOfKeo:function()
    {
        this.setInvisibleAllKeo();
        if(this.btnPreviousKeo != undefined && this.btnPreviousKeo != null )
        {
            this.btnPreviousKeo.visible = (this.keoList.length > this.NUM_OF_ROW);
            this.btnNextKeo.visible = (this.keoList.length > this.NUM_OF_ROW);
        }
        this.showKeo();
    },

    setInvisibleAllKeo:function()
    {
        for(var i = 0; i < this.keoList.length; i++)
        {
            this.keoList[i].visible = false;
        }
    },
    getCuocDetails: function (cuocID)
    {
        Util.showAnim();
        BkLogicManager.getLogic().setOnLoadComplete(this);
        BkLogicManager.getLogic().getAllTranDau(BET_FOOTBALL.GET_CUOC_EVENT,cuocID);
    },
    removeSelf: function ()
    {
        this._super();
    },
});