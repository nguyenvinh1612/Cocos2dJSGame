/**
 * Created by vinhnq on 12/26/2016.
 */
BkBetItemSprite = BkSprite.extend({
    parentNode: null,
    data:null,
    handleclickCallback:null,
    ctor: function (data) {
        this._super();
        this.data = data;
        this.initItem();
    },

    initItem: function ()
    {
        this.betkeobg = new BkSprite("#" + res_name.betKeo_bg);
        this.betkeobg.setScale(0.75,0.62);
        this.addChild(this.betkeobg);
        var matchName = new BkLabel(this.data.matchName,"Arial",16);
            matchName.x = matchName.getContentSize().width/2 - 130;
        matchName.y = 28;
        this.addChild(matchName);
        var groupName = new BkLabel(this.data.groupName, "Arial", 16);
        groupName.x = matchName.x + (groupName.getContentSize().width - matchName.getContentSize().width )/2;
        groupName.y = matchName.y - 28;
        this.addChild(groupName);
        var KeoName = new BkLabel(this.data.keoName, "Arial", 16);
        KeoName.x = groupName.x + (KeoName.getContentSize().width - groupName.getContentSize().width )/2;;
        KeoName.y = groupName.y - 28;
        this.addChild(KeoName);
        var winningRate = new BkLabel(this.data.winningRate,"Arial",16);
        winningRate.x = this.betkeobg.x + this.betkeobg.width/2 -  winningRate.getContentSize().width/2 - 60;
        winningRate.y = KeoName.y;
        this.addChild(winningRate);
        this.btnClose = createBkButtonPlist(res_name.btn_close_cuoc, res_name.btn_close_cuoc, res_name.btn_close_cuoc,
            res_name.btn_close_cuoc_hover,"");
        this.addChild(this.btnClose);
        this.btnClose.x = 131;
        this.btnClose.y = 24;
        //this.btnClose.setScale(0.8);
        var self = this;
        this.btnClose.addClickEventListener(function()
        {
            self.removeBet();
        });
    },
    removebtnClose:function()
    {
        this.btnClose.removeFromParent();
    },
    removeBet:function()
    {
        if (this.handleclickCallback != null)
        {
            this.handleclickCallback.onRemoveCuoc(this);
        }
        this.removeSelf();
    },
    setHandleClickCallBack:function (cb)
    {
        this.handleclickCallback = cb;
    },
});