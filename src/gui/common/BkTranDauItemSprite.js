/**
 * Created by vinhnq on 12/22/2016.
 */
BkTranDauItemSprite = BkSprite.extend({
    parentNode: null,
    tranDauData:null,
    logoTeam1:null,
    logoTeam2:null,
    handleclickCallback:null,
    bg:null,
    bgHover:null,
    _eventHover: null,

    ctor: function (data)
    {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.leader_board_ss_plist, res.leader_board_ss_img);
        this.tranDauData = data;
        this.WD_WIDTH = 800;
        this.LOGO_WIDTH = 50;
        this.WD_HEIGHT = 80;
        this.initItem();
        var self = this;
        cc.loader.loadImg(Util.getImgDoiBongUrl(data.idTeam1), { isCrossOrigin: true }, function (err, img)
        {
            self.updateLogo1(img);
        });
        cc.loader.loadImg(Util.getImgDoiBongUrl(data.idTeam2), { isCrossOrigin: true }, function (err, img)
        {
            self.updateLogo2(img);
        });
        this.initMouseAction();
    },

    initItem: function ()
    {
        var OffsetX = 30;
        this.bg = new BkSprite("#" + res_name.bg_trandauSprite);
        this.bg.x = this.WD_WIDTH /2;
        this.bg.y = this.WD_HEIGHT/2;
        this.addChild(this.bg,-1);
        this.bgHover = new cc.Scale9Sprite(res_name.top_bg_hover);
        this.bgHover.setContentSize(cc.size(this.WD_WIDTH , this.WD_HEIGHT));
        this.bgHover.x = this.WD_WIDTH /2;
        this.bgHover.y = this.WD_HEIGHT/2;
        this.bgHover.setVisible(false);
        this.addChild(this.bgHover);

        //team 1
        var nameTeam1 = new BkLabel(this.tranDauData.nameTeam1, "Arial", 16);
        nameTeam1.x =  nameTeam1.getContentSize().width/2 + OffsetX ;
        nameTeam1.y = 68;
        this.addChild(nameTeam1);

        var lblChu = new BkLabel("Chủ", "Arial", 16);
        lblChu.x =   lblChu.getContentSize().width/2 + OffsetX;
        lblChu.y = 12;
        this.addChild(lblChu);

        var lblratio1Win = new BkLabel(this.tranDauData.ratio1Win,"Arial",16);
        lblratio1Win.x = lblChu.x + 35;
        lblratio1Win.y = lblChu.y;
        lblratio1Win.setTextColor(cc.color(255,255,0));
        this.addChild(lblratio1Win);


        this.logoTeam1 = new  BkSprite("#" + res_name.default_Avatar);
        this.logoTeam1.x = this.WD_WIDTH/2 - 90;
        this.logoTeam1.y = this.WD_HEIGHT/2;
        var scale = this.LOGO_WIDTH/this.logoTeam1.width;
        this.logoTeam1.setScale(scale);
        this.addChild(this.logoTeam1);

        // common

        var startTime = new BkLabel(Util.getStartTime(this.tranDauData.startTime),"Arial", 16);

        startTime.x = this.WD_WIDTH/2;
        startTime.y = nameTeam1.y;
        this.addChild(startTime);

        this.remainingTime  =  new BkLabel( "(" + Util.getRemainingTime(this.tranDauData.startTime) + ")", "Arial", 16);
        this.remainingTime.x = this.WD_WIDTH/2;
        this.remainingTime.y = startTime.y - 30;
        this.addChild(this.remainingTime);
        this.schedule(this.onTick,1);

        var lblHoa = new BkLabel("Hòa", "Arial", 16);
        lblHoa.x =   this.WD_WIDTH/2 - 20;
        lblHoa.y = lblChu.y;
        this.addChild(lblHoa);

        var lblratioDraw = new BkLabel(this.tranDauData.ratioDraw,"Arial",16);
        lblratioDraw.x = lblHoa.x + 35;
        lblratioDraw.y = lblHoa.y;
        lblratioDraw.setTextColor(cc.color(255,255,0));
        this.addChild(lblratioDraw);

        //team 2
        this.logoTeam2 = new  BkSprite("#" + res_name.default_Avatar);
        this.logoTeam2.x = this.WD_WIDTH/2 + 90;
        this.logoTeam2.y = this.logoTeam1.y;
        var scale = this.LOGO_WIDTH/this.logoTeam2.width;
        this.logoTeam2.setScale(scale);
        this.addChild(this.logoTeam2);

        var nameTeam2 = new BkLabel(this.tranDauData.nameTeam2, "Arial", 16);
        nameTeam2.x = this.WD_WIDTH - nameTeam2.getContentSize().width/2 - OffsetX ;
        nameTeam2.y = nameTeam1.y;
        this.addChild(nameTeam2);

        var lblratio2Win = new BkLabel(this.tranDauData.ratio2Win,"Arial",16);
        lblratio2Win.x = this.WD_WIDTH - lblratio2Win.getContentSize().width/2 - OffsetX ;
        lblratio2Win.y = lblChu.y;
        lblratio2Win.setTextColor(cc.color(255,255,0));
        this.addChild(lblratio2Win);

        var lblKhach = new BkLabel("Khách", "Arial", 16);
        lblKhach.x =   lblratio2Win.x - ( lblKhach.getContentSize().width + lblratio2Win.getContentSize().width)/2 - 15;
        lblKhach.y = lblChu.y;
        this.addChild(lblKhach);

    },
    onTick:function()
    {
        this.remainingTime.setString("(" + Util.getRemainingTime(this.tranDauData.startTime)+")");
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
                    self.handleclickCallback.onClickedTranDau(self);
                }
            }
        });
        cc.eventManager.addListener(this._eventHover, this);
    },
    updateLogo1: function (img)
    {
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        if( this.logoTeam1 != null)
        {
            this.logoTeam1.removeFromParent();
            this.logoTeam1 = null;
        }
        this.logoTeam1 = new BkSprite(texture2d,new cc.rect(0,0,texture2d.width,texture2d.height));
        this.logoTeam1.x = this.WD_WIDTH/2 - 90;
        this.logoTeam1.y = this.WD_HEIGHT/2;
        var scale = this.LOGO_WIDTH/this.logoTeam1.width;
        this.logoTeam1.setScale(scale);
        this.addChild(this.logoTeam1,-1);
    },
    updateLogo2: function (img)
    {
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        if( this.logoTeam2 != null)
        {
            this.logoTeam2.removeFromParent();
            this.logoTeam2 = null;
        }
        this.logoTeam2 = new BkSprite(texture2d,new cc.rect(0,0,texture2d.width,texture2d.height));
        this.logoTeam2.x = this.WD_WIDTH/2 + 90;
        this.logoTeam2.y = this.WD_HEIGHT/2;
        var scale = this.LOGO_WIDTH/this.logoTeam2.width;
        this.logoTeam2.setScale(scale);
        this.addChild(this.logoTeam2,-1);
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
            if (self.handleclickCallback != null)
            {
                self.handleclickCallback = null;
            }
        }
    },
});