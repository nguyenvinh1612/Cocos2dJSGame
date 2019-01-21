/**
 * Created by vinhnq on 12/22/2016.
 */
BkKeoItemSprite = BkSprite.extend({
    parentNode: null,
    data:null,
    handleclickCallback:null,
    isSelected:false,
    ctor: function (data) {
        this._super();
        this.data = data;
        this.initItem();
        this.initMouseAction();
    },

    initItem: function ()
    {
        this.bg = new  BkSprite("#" + res_name.keo_bg);
        this.bg.visible = !this.isSelected;
        this.addChild(this.bg);
        this.bgSelected = new BkSprite("#" + res_name.keo_bgSelected);
        this.bgSelected.visible = this.isSelected;
        this.addChild(this.bgSelected);
        var name = new BkLabel(this.data.keoName, "Arial", 16);
        name.x = name.getContentSize().width/2 - 60;
        name.y = 0;
        this.addChild(name);
        var winningRate = new BkLabel(this.data.winningRate,"Arial",16);
        winningRate.x = this.bg.x + this.bg.width/2 -  winningRate.getContentSize().width/2 - 15;
        winningRate.y = name.y;
        winningRate.setTextColor(cc.color(255,255,0));
        this.addChild(winningRate);
    },

    initMouseAction: function ()
    {
        var self = this;
        this.bg.setMouseOnHover
        (
            function (event)
            {
                var target = event.getCurrentTarget();
                if (!self.isOutsideTargetCheck(target, event.getLocation())) {
                    cc._canvas.style.cursor = "default";
                    return false;
                }
                cc._canvas.style.cursor = "pointer";
            });
        this.bg.setOnlickListenner(function ()
        {
            self.isSelected = !self.isSelected;
            self.bg.visible = !self.isSelected;
            self.bgSelected.visible = self.isSelected;
            logMessage("goes here");

            if (self.handleclickCallback != null)
            {
                logMessage("handleclickCallback not null");
                self.handleclickCallback.onClickedKeo(self);
            }
        });
    },
    isOutsideTargetCheck: function (target, location) {
        if (target) {
            var locationInNode = target.convertToNodeSpace(location);
            var rect = cc.rect(0, 0, target._contentSize.width, target._contentSize.height);
            return cc.rectContainsPoint(rect, locationInNode);
        }
        return true;
    },
    select:function(isSelect)
    {
        this.isSelected = isSelect;
        this.bg.visible = !isSelect;
        this.bgSelected.visible = isSelect;
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
            if (this.bg.OnMouseMoveListener != null)
            {
                cc.eventManager.removeListener(this.bg.OnMouseMoveListener);
            }
            if (this.bg.OnClickListener != null)
            {
                cc.eventManager.removeListener(this.bg.OnClickListener);
            }
            if (this.handleclickCallback != null)
            {
                this.handleclickCallback = null;
            }
        }
    },
});