/**
 * Created by vinhnq on 12/22/2016.
 */
BkGiaiDauItemSprite = BkSprite.extend({
    parentNode: null,
    giaiDauData:null,
    logo:null,
    handleclickCallback:null,
    ctor: function (data) {
        this._super();
        this.giaiDauData = data;
        this.initItem();
        var self = this;
        cc.loader.loadImg(data.url, { isCrossOrigin: true }, function (err, img)
        {
            self.updateLogo(img);
        });
        //sendGA(BKGA.GAME_CHOOSE, "Click GiaiDau:" +this.giaiDauData.name, BkGlobal.clientDeviceCheck);
        this.initMouseAction();
    },

    initItem: function () {
        this.logo = new BkSprite("#" + res_name.default_Avatar);
        this.logo.setScale(0.5, 0.5);
        this.addChild(this.logo);
        if (this.giaiDauData.name.length > 18)
        {
            var strName1 = this.getName1(this.giaiDauData.name);
            var strName2 = this.getName2(this.giaiDauData.name);
            if(strName1.length > 0)
            {
                var name1 = new BkLabel(strName1, "Arial", 15);
                name1.x = this.logo.x ;
                name1.y = -50;
                this.addChild(name1);

            }
            if(strName2.length > 0)
            {
                var name2 = new BkLabel(strName2, "Arial", 15);
                name2.x = this.logo.x ;
                name2.y = -65;
                this.addChild(name2);
            }
        }else
        {
            var name = new BkLabel(this.giaiDauData.name, "Arial", 15);
            name.x = this.logo.x ;
            name.y = -50;
            this.addChild(name);
        }
    },
    getName1:function(name)
    {
        for(var i = name.length -1; i >= 0; i--)
        {
            if(name[i] ===" " )
            {
                var name1 = name.substring(0,i);
                return name1;
            }
        }
    },
    getName2:function(name)
    {
        for(var i = name.length -1; i >= 0; i--)
        {
            if(name[i] ===" " )
            {
                var name2 = name.substring(i+1,name.length);
                return name2;
            }
        }
    },
    initMouseAction: function ()
    {
        var self = this;
        this.logo.setMouseOnHover
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
        this.logo.setOnlickListenner(function ()
        {
            if (self.handleclickCallback != null)
            {
                logMessage("lick logo");
                self.handleclickCallback.onClickedGiaiDau(self);
            }
        });
    },
    isOutsideTargetCheck: function (target, location) {
        //target = (target.parentNode && target.parentNode._friendSc) ? target.parentNode._friendSc : null;
        if (target) {
            var locationInNode = target.convertToNodeSpace(location);
            var rect = cc.rect(0, 0, target._contentSize.width, target._contentSize.height);
            //Do nothing when outside list
            return cc.rectContainsPoint(rect, locationInNode);
        }
        return true;
    },
    updateLogo: function (img)
    {
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        if( this.logo != null)
        {
            this.logo.removeFromParent();
            this.logo = null;
        }
        this.logo = new BkSprite(texture2d,new cc.rect(0,0,texture2d.width,texture2d.height));
        this.logo.setScale(0.5,0.5);
        this.initMouseAction();
        this.addChild(this.logo,-1);
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
            if (this.logo.OnMouseMoveListener != null)
            {
                cc.eventManager.removeListener(this.logo.OnMouseMoveListener);
            }
            if (this.logo.OnClickListener != null)
            {
                cc.eventManager.removeListener(this.logo.OnClickListener);
            }
            if (this.handleclickCallback != null)
            {
                this.handleclickCallback = null;
            }
        }
    },
});