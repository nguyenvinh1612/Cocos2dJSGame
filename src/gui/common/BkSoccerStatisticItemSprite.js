/**
 * Created by vinhnq on 1/4/2017.
 */
BkSoccerStatisticItemSprite = BkSprite.extend({
    parentNode: null,
    handleclickCallback:null,
    isSelected:false,
    cuocId:null,
    playerName:null,
    placeTime:null,
    cuocType:null,
    betMoney:null,
    winingMoney:null,
    ctor: function (cuocId,playerName,placeTime,cuocType,betMoney,winningMoney,type) {
        this._super();
        this.cuocId = cuocId;
        this.playerName = playerName;
        this.placeTime = placeTime;
        this.cuocType = cuocType;
        this.betMoney = betMoney;
        this.winingMoney = winningMoney;
        this.initItem(type);
        this.initMouseAction();
    },

    initItem: function (type)
    {
        this.bg = new BkSprite("#" + res_name.bg_trandauSprite_small);
        this.bg.x =0;
        this.bg.setScale(1,0.8);
        this.bg.y = 0;
        this.addChild(this.bg,-1);

        this.bgHover = new cc.Scale9Sprite(res_name.top_bg_hover);
        this.bgHover.setContentSize(cc.size(this.bg.width , 66));
        this.bgHover.x = 0;
        this.bgHover.y = 0;
        this.bgHover.setVisible(false);
        this.addChild(this.bgHover);


        var playerName = new BkLabel(this.playerName, "Arial", 16);
        playerName.x = this.bg.x - this.bg.width/2 + playerName.getContentSize().width/2 + 15;
        playerName.y = 17;
        this.addChild(playerName);

        var lblPlay =  new BkLabel("đánh", "Arial", 16);
        lblPlay.x =  playerName.x + playerName.getContentSize().width/2 + 15 + lblPlay.getContentSize().width/2;
        lblPlay.y =  playerName.y;
        this.addChild(lblPlay);

        if(type == 2)
        {
            playerName.visible = false;
            lblPlay.x = this.bg.x - this.bg.width/2 + lblPlay.getContentSize().width/2 + 15;
        }
        var lblBetMoney = new BkLabel(convertStringToMoneyFormat(this.betMoney,true) + "$", "Arial", 16);
        lblBetMoney.x =  lblPlay.x + lblPlay.getContentSize().width/2 + 10 + lblBetMoney.getContentSize().width/2;
        lblBetMoney.y =  playerName.y;
        this.addChild(lblBetMoney);

        var lblCuocType = new BkLabel(" -   " + this.getCuocStrFromCuocType(this.cuocType), "Arial", 16);
        lblCuocType.x =  lblBetMoney.x + lblBetMoney.getContentSize().width/2 + 10 + lblCuocType.getContentSize().width/2;
        lblCuocType.y =  playerName.y;
        this.addChild(lblCuocType);

        var lblPlaceTime;
        if(type == 1)
        {
            lblPlaceTime = new BkLabel(BkTime.secondsToTimecode(this.placeTime), "Arial", 16);

        }else
        {
            lblPlaceTime = new BkLabel(Util.getStartTime(this.placeTime,true), "Arial", 16);
        }
        lblPlaceTime.x =  playerName.x - playerName.getContentSize().width/2 + lblPlaceTime.getContentSize().width/2;
        lblPlaceTime.y = -17;
        lblPlaceTime.setTextColor(cc.color(255,255,0));
        this.addChild(lblPlaceTime);

        if(type == 2 || type == 3)
        {
            if(type == 2)
            {
                lblPlaceTime.x =  lblCuocType.x + lblCuocType.getContentSize().width/2 + 10 + lblPlaceTime.getContentSize().width/2;
                lblPlaceTime.y = 17;
            }
            var strWinning = "Chưa xử lý";
            if(this.winingMoney != -1)
            {
                if(this.winingMoney == 0)
                {
                    strWinning = "Thua";
                }else if(this.winingMoney == -2)
                {
                    strWinning = "Trận đấu hoãn, đã trả lại tiền";
                }else
                {
                    strWinning = "Thắng " + convertStringToMoneyFormat(this.winingMoney,true) + "$";
                }
            }
            var lblWinning = new BkLabel(strWinning, "Arial", 16);
            lblWinning.x =  lblPlay.x - lblPlay.getContentSize().width/2 + lblWinning.getContentSize().width/2;
            if(type == 3)
            {
                lblPlaceTime.x = lblCuocType.x + lblCuocType.getContentSize().width/2 + lblPlaceTime.getContentSize().width/2 + 15;
                lblPlaceTime.y = 17;
                lblWinning.x = this.bg.x - this.bg.width/2 + lblWinning.getContentSize().width/2 + 15;
            }
            lblWinning.y = -17;
            lblWinning.setTextColor(cc.color(255,255,0));
            this.addChild(lblWinning);
        }
        var cuocId = new BkLabel("MS: " + this.cuocId,"Arial",16);
        cuocId.x = this.bg.x + this.bg.width/2 -  cuocId.getContentSize().width/2 - 15;
        cuocId.y = -17;
        this.addChild(cuocId);
    },

    getCuocStrFromCuocType:function(type)
    {
        if(type == 1)
        {
            return "Cược Đơn,";
        }
        return "Cược Xiên,";
    },
    initMouseAction: function () {
        var self = this;
        this._eventHover = this.createHoverEvent(function (event) {
            self.bgHover.setVisible(true);
        }, function (event) {
            self.bgHover.setVisible(false);
        }, function (event) {
            if (self.bgHover.isVisible())
            {
                if (self.handleclickCallback != null)
                {
                    self.handleclickCallback.onClickStaticItem(self);
                }
            }
        });
        cc.eventManager.addListener(this._eventHover, this);
    },
    setHandleClickCallBack:function (cb)
    {
        this.handleclickCallback = cb;
    },
    setEnableEventListener:function(isEnable)
    {
        if(isEnable)
        {
            this.initMouseAction();
        }else
        {
            if (this._eventHover != null)
            {
                cc.eventManager.removeListener(this._eventHover);
            }
            if (this.handleclickCallback != null)
            {
                this.handleclickCallback = null;
            }
        }
    },
});