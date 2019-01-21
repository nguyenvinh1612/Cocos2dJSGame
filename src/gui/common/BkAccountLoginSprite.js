/**
 * Created by vinhnq on 1/12/2017.
 */
BkAccountLoginSprite = BkSprite.extend({
    parentNode: null,
    userName:null,
    passWord:null,
    lastLoginTime:null,
    handleclickCallback:null,
    ctor: function (userName,pwd, LastLoginTime,maxContainerHeight,isEndOfRow,parent)
    {
        this._super();
        this.userName = userName;
        this.passWord = pwd;
        this.lastLoginTime = LastLoginTime;
        this.parentNode = parent;
        this.initItem(isEndOfRow);
    },
    initItem: function (isEndOfRow)
    {
        this.bgHover = new cc.DrawNode();
        this.bgHover.drawRect(cc.p(-55,-39/2), cc.p(345, 39/2), BkColor.GRID_ITEM_HOVER_COLOR_VV, 0, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        this.bgHover.visible = false;
        this.addChild(this.bgHover, -1);

        this.initMouseAction();

        var lblUserName = new BkLabel(this.userName,"Arial",16);
        if(lblUserName.getContentSize().width > 210)
        {
            lblUserName.setString(this.userName.substr(0,15) + "...");
        }
        lblUserName.x = lblUserName.getContentSize().width/2 - 45;
        lblUserName.y = -6;
        this.addChild(lblUserName);

        this.btnDelete = createBkButtonPlist(res_name.icon_delete, res_name.icon_delete, res_name.icon_delete,
            res_name.icon_delete_hover,"");
        this.addChild(this.btnDelete);
        this.btnDelete.x = 330;
        this.btnDelete.y = lblUserName.y ;
        var self = this;
        this.btnDelete.addTouchEventListener(function () {
            self.deleteAccount();
        }, this);

        var lblLoginTime = new BkLabel(Util.getLoggedInTime(this.lastLoginTime), "Arial", 16);
        lblLoginTime.x = this.btnDelete.x - this.btnDelete.width/2 - 30 - lblLoginTime.getContentSize().width/2;
        lblLoginTime.y = lblUserName.y;
        this.addChild(lblLoginTime);
        //if(!isEndOfRow)
        //{
        var line = new cc.DrawNode();
        line.drawSegment(cc.p(-55,-20), cc.p(345,-20),0.3,BkColor.GRID_ROW_BORDER_COLOR_VV);
        this.addChild(line);
        //}
    },
    initMouseAction: function ()
    {
        var self = this;
        this.setMouseOnHover(
            function (event) {
                cc._canvas.style.cursor = "pointer";
                self.bgHover.setVisible(true);
            }, function (event) {
                self.bgHover.setVisible(false);
            });
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                logMessage(target.userName);
                if(target.bgHover.isVisible())
                {
                    logMessage("click on the target:" + target.userName );
                    if (target.handleclickCallback != null)
                    {
                        target.handleclickCallback.onSelectAccount(target);
                    }
                }
            },
        }, this);
    },

    deleteAccount:function()
    {
        if (this.handleclickCallback != null)
        {
            this.handleclickCallback.onDeleteAccount(this);
        }
        this.removeSelf();
    },
    setHandleClickCallBack:function (cb)
    {
        this.handleclickCallback = cb;
    },
});