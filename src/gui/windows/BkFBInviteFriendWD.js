/**
 * Created by vinhnq on 18/06/2016.
 */
NUMBER_OF_COLUMNES = 5;
ROW_SPACE = 50;
ITEM_SIZE = 80;
MAX_FRIEND_TO_INVITE = 50;
NUM_OF_FR_PER_PAGE = 15;
BkFBInviteFriendWD = VvWindow.extend({
     listAllFriendLoaded: [],
     currentPageFriendList:[],
     txtSelectedFR:null,
     txtPage:null,
     frSelectedCount:0,
     currentPage:1,
     ctor: function () {
//        this._super("Mời bạn", cc.size(693, 535));
//        this.setVisibleOutBackgroundWindow(true);
//        this.setMoveableWindow(false);
//        // this.setDefaultWdBodyBg();
//        this.setVisibleDefaultWdBodyBg();
//        this.bgHover = new cc.DrawNode();
//        this.bgHover.drawRect(cc.p(0,0), cc.p(this.getBodySize().width - 45,45), cc.color(100, 25, 5), 1, cc.color(200, 140, 50));
//        this.bgHover.x = 155.5;
//        this.bgHover.y = 466.5;
//        this.addChild(this.bgHover);
//
//        this.txtSelectedFR = new BkLabel("Bạn đã chọn: " + this.frSelectedCount + "/50","",15, true);
//        this.txtSelectedFR.y =  490;
//        this.txtSelectedFR.x = 260;
//        this.addChild(this.txtSelectedFR);
//
//        this.btnBack = createBkButtonPlist(res_name.btn_previous_normal, res_name.btn_previous_press, res_name.btn_previous_disable,
//            res_name.btn_previous_hover,"");
//        this.btnBack.setTitleFontSize(BTN_INGAME_SIZE);
//        this.btnBack.x =  this.txtSelectedFR.x + 110;
//        this.btnBack.y =  this.txtSelectedFR.y;
//        this.addChild(this.btnBack);
//        this.btnBack.addClickEventListener(function()
//        {
//            self.btnBack.lastTimeClick = BkTime.GetCurrentTime();
//            if(self.currentPage > 1)
//            {
//                self.goBack();
//            }
//        });
//
//        this.txtPage = new BkLabel("Trang: " + this.currentPage,"",15, false);
//        this.txtPage.y = this.btnBack.y;
//        this.txtPage.x = this.btnBack.x + 50;
//        this.addChild(this.txtPage);
//
//        this.btnNext = createBkButtonPlist(res_name.btn_next_normal, res_name.btn_next_press, res_name.btn_next_disable,
//            res_name.btn_next_hover,"");
//        this.btnNext.setTitleFontSize(BTN_INGAME_SIZE);
//        this.btnNext.x =  this.txtPage.x + 50;
//        this.btnNext.y = this.txtPage.y;
//        this.addChild(this.btnNext);
//        this.btnNext.addClickEventListener(function()
//        {
//            self.btnNext.lastTimeClick = BkTime.GetCurrentTime();
//            self.goNext();
//        });
//
//        var checkBoxClickArea = new BkSprite(res.Tranperent_IMG);
//        this.addChild(checkBoxClickArea);
//        var lblCheckAll = new BkLabel("Chọn tất cả", "Arial", 15);
//        lblCheckAll.setTextColor(BkColor.GRID_ITEM_TEXT_COLOR);
//        lblCheckAll.x = lblCheckAll.getContentSize().width/2;
//        lblCheckAll.y = lblCheckAll.getContentSize().height/2;
//        checkBoxClickArea.addChild(lblCheckAll);
//        this.checkall = new BkCheckBox();
//        this.checkall.x = lblCheckAll.x + lblCheckAll.getContentSize().width/2 + this.checkall.width;
//        this.checkall.y = lblCheckAll.y;
//        checkBoxClickArea.addChild(this.checkall);
//        checkBoxClickArea.setContentSize(cc.size(this.checkall.width + lblCheckAll.getContentSize().width,this.checkall.height));
//        checkBoxClickArea.x =  this.btnNext.x +130;
//        checkBoxClickArea.y = this.btnNext.y + 3;
//        this.checkall.setSelected(false);
//        checkBoxClickArea.setMouseOnHover();
//        checkBoxClickArea.setOnlickListenner(function () {
//            self.checkall.setSelected(!self.checkall.isSelected());
//            self.selectAllFR(self.checkall.isSelected());
//        });
//        this.checkall.addEventListener(function() {
//            self.selectAllFR(self.checkall.isSelected());
//        });
//
//        this.btnInviteFR = createBkButtonPlist(res_name.vv_btn_dongy, res_name.vv_btn_dongy,res_name.vv_btn_dongy,
//            res_name.vv_btn_dongy_hover,"Mời");
//        this.btnInviteFR.setTitleColor(BkColor.TEXT_INPUT_COLOR);
//        this.btnInviteFR.setTitleFontSize(BTN_INGAME_SIZE);
//        this.btnInviteFR.setScale(0.85);
//        this.btnInviteFR.x = 726;
//        this.btnInviteFR.y = this.txtSelectedFR.y;
//        this.addChild(this.btnInviteFR);
//        var self = this;
//        this.btnInviteFR.addClickEventListener(function(){
//            if (BkTime.GetCurrentTime() - self.btnInviteFR.lastTimeClick < 1000){
//                return;
//            }
//            self.btnInviteFR.lastTimeClick = BkTime.GetCurrentTime();
//            self.inviteFriend();
//        });
//        this.initHandleonLoadComplete();
    },
//    goBack:function()
//    {
//        this.currentPage--;
//        this.drawUI();
//        this.checkall.setSelected(this.isSelectAllFR());
//        this.btnBack.setEnableButton(this.currentPage > 1);
//        this.btnNext.setEnableButton(true);
//    },
//    initHandleonLoadComplete: function () {
//        BkLogicManager.getLogic().setOnLoadComplete(this);
//    },
//    showToastMaxInvited:function()
//    {
//        showToastMessage("Bạn chỉ được mời tối đa " + MAX_FRIEND_TO_INVITE + " người bạn trong mỗi lần mời", cc.winSize.width / 2, cc.winSize.height / 2);
//    },
//    selectAllFR:function(isSelected)
//    {
//        var start = (this.currentPage-1)*15;
//        var end =   this.currentPage*15;
//        if(end > this.listAllFriendLoaded.length)
//        {
//            end = this.listAllFriendLoaded.length;
//        }
//        for(var i = start; i < end; i++)
//        {
//            if(isSelected)
//            {
//                if(!this.listAllFriendLoaded[i].isSelected)
//                {
//                    if(this.frSelectedCount >= MAX_FRIEND_TO_INVITE)
//                    {
//                        this.showToastMaxInvited();
//                        this.txtSelectedFR.setString("Bạn đã chọn: " + this.frSelectedCount + "/50");
//                        return;
//                    }
//                    this.listAllFriendLoaded[i].isSelected = true;
//                    this.listAllFriendLoaded[i].displayIconCheck();
//                    this.frSelectedCount++;
//                }
//            }else if(!isSelected)
//            {
//                if(this.listAllFriendLoaded[i].isSelected)
//                {
//                    this.listAllFriendLoaded[i].isSelected = false;
//                    this.listAllFriendLoaded[i].displayIconCheck();
//                    if(this.frSelectedCount > 0)
//                    {
//                        this.frSelectedCount--;
//                    }
//                }
//            }
//        }
//        this.txtSelectedFR.setString("Bạn đã chọn: " + this.frSelectedCount + "/50");
//    },
//    goNext:function()
//    {
//        this.currentPage++;
//        if(this.isNeedLoadMore())
//        {
//            this.checkall.setSelected(false);
//            if(BkFacebookMgr.canLoadMore)
//            {
//                BkFacebookMgr.getInvitableFriendList();
//            }else
//            {
//                this.drawUI();
//            }
//        }else
//        {
//            this.drawUI();
//            this.checkall.setSelected(this.isSelectAllFR());
//            this.btnBack.setEnableButton(this.currentPage > 1);
//        }
//    },
//    isSelectAllFR:function()
//    {
//        var start = (this.currentPage -1)*15;
//        var end = this.currentPage*15;
//        if(end > this.listAllFriendLoaded.length)
//        {
//            end = this.listAllFriendLoaded.length;
//        }
//        for(var i = start; i < end; i++)
//        {
//            if(!this.listAllFriendLoaded[i].isSelected)
//            {
//                return false;
//            }
//        }
//        return true;
//    },
//    inviteFriend:function()
//    {
//        var friend_ids = "";
//        var count = 0;
//        for(var i = 0; i < this.listAllFriendLoaded.length; i++)
//        {
//            if(this.listAllFriendLoaded[i].isSelected)
//            {
//                if(count == 0)
//                {
//                    friend_ids = this.listAllFriendLoaded[i].id;
//                }else
//                {
//                    friend_ids = friend_ids + "," + this.listAllFriendLoaded[i].id;
//                }
//                count++;
//            }
//        }
//        if(friend_ids == "")
//        {
//            showToastMessage("Bạn chưa chọn ai để gửi lời mời.", cc.winSize.width / 2, cc.winSize.height / 2);
//            return;
//        }
//        var self = this;
//        var processInvitedRequest = function (returnInvFr)
//        {
//            cc.eventManager.setEnabled(true);
//            if (returnInvFr != "")
//            {
//                var fullNameArr = [];
//                for(var i = 0; i < self.listAllFriendLoaded.length; i++)
//                {
//                    if(self.listAllFriendLoaded[i].isSelected)
//                    {
//                        fullNameArr.push(self.listAllFriendLoaded[i].name);
//                    }
//                }
//                if(fullNameArr.length > 0)
//                {
//                    BkUserClientSettings.updateListFBInvited(BkFacebookMgr.App._userInfo.userID,fullNameArr); // cached result to used later
//                    BkLogicManager.getLogic().sendInvitedListToServer(BkFacebookMgr.App.getUserID(), returnInvFr,fullNameArr);
//                    self.updateUIafterinvited();
//                }
//            }
//        };
//        BkFacebookMgr.App.appRequest(friend_ids,processInvitedRequest);
//        cc.eventManager.setEnabled(false);
//    },
//    onLoadComplete: function (o, tag) {
//        switch (tag) {
//            case c.NETWORK_GET_FACEBOOK_INVITE_FRIENDS:
//            {
//                this.currentPageFriendList = o;
//                this.loadAvatar();
//                break;
//            }
//            case c.NETWORK_FACEBOOK_INVITE_FRIENDS:
//            {
//                this.updateUIafterinvited();
//                if(o == false)
//                {
//                    showToastMessage("Bạn đã dùng hết lượt mời bạn Facebook hôm nay. Hãy quay lại ngày mai!", 300, 300);
//                    this.btnInviteFR.setEnableButton(false);
//                    return;
//                }
//                break;
//            }
//        }
//    },
//    isNeedLoadMore:function()
//    {
//        return (this.currentPage*NUM_OF_FR_PER_PAGE >= this.listAllFriendLoaded.length);
//    },
//    updateUIafterinvited:function()
//    {
//        for(var i = this.listAllFriendLoaded.length -1 ; i >=0; i--)
//        {
//            if(this.listAllFriendLoaded[i].isSelected)
//            {
//                this.listAllFriendLoaded[i].removeFromParent();
//                this.listAllFriendLoaded.splice(i,1);
//            }
//        }
//        this.checkall.setSelected(false);
//        this.frSelectedCount = 0;
//        this.txtSelectedFR.setString("Bạn đã chọn: " + this.frSelectedCount + "/50");
//        if(this.isNeedLoadMore() && BkFacebookMgr.canLoadMore)
//        {
//            BkFacebookMgr.getInvitableFriendList();
//        }else
//        {
//            this.drawUI();
//        }
//    },
//    loadAvatar:function()
//    {
//        for(var i = 0; i < this.currentPageFriendList.length; i++)
//        {
//            var frSprite = new BKFBFriendSprite("#" + res_name.default_Avatar,this.currentPageFriendList[i].picture.data.url,this.currentPageFriendList[i].name,this.currentPageFriendList[i].id);
//            frSprite.setHandleClickCallBack(this);
//            frSprite.setHandleLoadedCallBack(this);
//            frSprite.visible = this.isNeedLoadMore();
//            frSprite.setEnableEventListener(false);
//            this.addChildBody(frSprite);
//            this.listAllFriendLoaded.push(frSprite);
//        }
//        if(this.isNeedLoadMore() &&  BkFacebookMgr.canLoadMore )
//        {
//            BkFacebookMgr.getInvitableFriendList();
//            //return;
//        }
//        else
//        {
//            Util.removeAnim();
//        }
//        this.drawUI();
//    },
//    onAvatarLoaded:function()
//    {
//        var count = 0;
//        for(var i =0; i < this.listAllFriendLoaded.length; i++)
//        {
//            if(this.listAllFriendLoaded[i].isLoaded)
//            {
//                count++;
//            }
//        }
//        if(count >= this.currentPage*NUM_OF_FR_PER_PAGE)
//        {
//            Util.removeAnim();
//        }
//    },
//    onFRClicked:function(fr)
//    {
//        logMessage(fr.name + fr.id);
//        if(this.frSelectedCount >= MAX_FRIEND_TO_INVITE && !fr.isSelected)
//        {
//            this.showToastMaxInvited();
//            return;
//        }
//        fr.isSelected = !fr.isSelected;
//        fr.displayIconCheck();
//        if(fr.isSelected)
//        {
//            this.frSelectedCount ++;
//        }else
//        {
//            this.frSelectedCount--;
//        }
//        this.txtSelectedFR.setString("Bạn đã chọn: " + this.frSelectedCount + "/50");
//    },
//    setInvisibleAll:function()
//    {
//      for(var i = 0; i < this.listAllFriendLoaded.length; i++)
//      {
//          this.listAllFriendLoaded[i].visible = false;
//          this.listAllFriendLoaded[i].setEnableEventListener(false);
//      }
//    },
//    drawUI:function()
//    {
//        if(!this.visible)
//        {
//            this.visible = true; // for the 1st time loading.
//        }
//        //Util.removeAnim();
//        this.setInvisibleAll();
//        this.txtPage.setString("Trang: " + this.currentPage);
//        this.btnNext.setEnableButton(true);
//        if(!BkFacebookMgr.canLoadMore)
//        {
//            this.btnNext.setEnableButton(!this.isNeedLoadMore());
//        }
//        this.btnBack.setEnableButton(this.currentPage > 1);
//        var bodyContentWidth = this.getBodySize().width - WD_BODY_MARGIN_LR*2;
//        var SPACE_COLUMN = (bodyContentWidth - NUMBER_OF_COLUMNES * ITEM_SIZE) / (NUMBER_OF_COLUMNES + 1);
//        var OFFSET_X = 105;
//        var start = (this.currentPage-1)*NUM_OF_FR_PER_PAGE;
//        var end = this.currentPage*NUM_OF_FR_PER_PAGE;
//        var count = 0;
//        var xPos = 0;
//        var yPos = 350;
//        if(end > this.listAllFriendLoaded.length)
//        {
//            end = this.listAllFriendLoaded.length;
//        }
//        if(start < 0)
//        {
//            logMessage("invalid start:" + start);
//            start = 0;
//        }
//        logMessage(" call drawUI isNeedLoadMore:" + this.isNeedLoadMore() + "canLoadMore:" + BkFacebookMgr.canLoadMore + "currentPage:" + this.currentPage + "listAllFriendLoad:" + this.listAllFriendLoaded.length + "start:" + start + "end:" + end);
//        for(var i = start; i < end;i++)
//        {
//            //logMessage("i:" + i);
//            if(count == 0 )
//            {
//                xPos = OFFSET_X;
//            }
//            else if(count % NUMBER_OF_COLUMNES == 0)
//            {
//                xPos = OFFSET_X;
//                yPos = yPos - ITEM_SIZE - ROW_SPACE;
//            }
//            else
//            {
//                xPos = xPos + ITEM_SIZE + SPACE_COLUMN;
//            }
//            this.listAllFriendLoaded[i].x = xPos;
//            this.listAllFriendLoaded[i].y = yPos;
//            this.listAllFriendLoaded[i].setEnableEventListener(true);
//            this.listAllFriendLoaded[i].visible = true;
//            count++;
//        }
//    },
//    removeSelf:function()
//    {
//        BkFacebookMgr.resetToDefaultValue();
//        this.removeObj(this.listAllFriendLoaded);
//        this.currentPage = 1;
//        this.currentPageFriendList = [];
//        this._super();
//    },
//    removeObj:function(arrList)
//    {
//        if (arrList!= null && arrList.length >0)
//        {
//            for (var i =0; i < arrList.length; i++)
//            {
//                var obji = arrList[i];
//                obji.removeSelf();
//            }
//            while(arrList.length > 0)
//            {
//                arrList.splice(0,arrList.length);
//            }
//            arrList = null;
//        }
//    },
});