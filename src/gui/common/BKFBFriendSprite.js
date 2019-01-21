/**
 * Created by vinhnq on 6/16/2016.
 */
BKFBFriendSprite = BkSprite.extend({
    parentNode: null,
    name: null,
    img: null,
    id: null,
    handleclickCallback:null,
    handleLoadCallBack:null,
    isSelected:false,
    isLoaded:false,
    ctor: function (img,url,name,id) {
        this._super();
        this.imgSprite = new BkSprite(img);
        this.id = id;
        this.name = name;
        name = this.trimName(name);
        var userName = new BkLabel(name,"",13, true);
        userName.y = -54;
        this.addChild(this.imgSprite);
        this.addChild(userName);
        this.displayFrame();
        this.initMouseAction();
        var self = this;
        cc.loader.loadImg(url, { isCrossOrigin: true }, function (err, img)
        {
            self.updateAvatar(img);
            self.isLoaded = true;
            if(self.handleLoadCallBack != null)
            {
                self.handleLoadCallBack.onAvatarLoaded();
            }
        });
    },
    trimSpace:function(name)
    {
        for(var i = name.length -1; i >= 0; i--)
        {
            if(name[i] ===" " )
            {
                name = name.substring(0,i);
                return name;
            }
        }
        return name;
    },
    trimName:function(name)
    {
        var isTrime = false;
       while(name.length > 18)
       {
           name =  name.substring(0,name.length -1);
           isTrime = true;
       }
        if(isTrime)
        {
            return this.trimSpace(name);
        }
        return name;
    },
    initMouseAction: function ()
    {
        var self = this;
        this.imgSprite.setMouseOnHover
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
        this.imgSprite.setOnlickListenner(function () {
            if (self.handleclickCallback != null)
            {
                self.handleclickCallback.onFRClicked(self);
            }
        });
    },
    updateAvatar: function (img)
    {
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        if( this.imgSprite != null)
        {
            this.imgSprite.removeFromParent();
            this.imgSprite = null;
        }
        this.imgSprite = new BkSprite(texture2d,new cc.rect(0,0,texture2d.width,texture2d.height));
        this.initMouseAction();
        this.addChild(this.imgSprite,-1);
    },
    displayIconCheck:function()
    {
        this.displayFrame();
        if(this.icoCheck == undefined || this.icoCheck == null)
        {
            this.icoCheck = getSpriteFromImage("#"+res_name.icon_check);
            this.icoCheck.setScale(0.85);
            this.icoCheck.x =  this.width + 32 ;
            this.icoCheck.y = this.height + 38;
            this.addChild(this.icoCheck);
        }
        this.icoCheck.setVisible(this.isSelected);
    },
    displayFrame:function()
    {
        if(this.frame != undefined && this.frame != null)
        {
            this.frame.removeFromParent();
            this.frame = null;
        }
        if(this.isSelected)
        {
            this.frame = getSpriteFromImage("#"+res_name.green_frame);
        }else
        {
            this.frame = getSpriteFromImage("#"+res_name.gray_frame);
        }
       this.addChild(this.frame);
    },
    isOutsideTargetCheck: function (target, location) {
        target = (target.parentNode && target.parentNode._friendSc) ? target.parentNode._friendSc : null;
        if (target) {
            var locationInNode = target.convertToNodeSpace(location);
            var rect = cc.rect(0, 0, target._contentSize.width, target._contentSize.height);
            //Do nothing when outside list
            return cc.rectContainsPoint(rect, locationInNode);
        }
        return true;
    },
    setHandleClickCallBack:function (cb)
    {
        this.handleclickCallback = cb;
    },
    setHandleLoadedCallBack:function (cb)
    {
        this.handleLoadCallBack = cb;
    },
    setEnableEventListener:function(isEnable)
    {
        if(isEnable)
        {
            this.initMouseAction();
        }else
        {
            if (this.imgSprite.OnMouseMoveListener != null)
            {
                cc.eventManager.removeListener(this.imgSprite.OnMouseMoveListener);
            }
            if (this.imgSprite.OnClickListener != null) {
                cc.eventManager.removeListener(this.imgSprite.OnClickListener);
            }
        }
    },
});