/**
 * Created by hoangthao on 26/10/2015.
 */
BkLeaderBoardWindow = BkWindow.extend({
    sph:cc.spriteFrameCache,
    leaderBoardSprite:null,
    lbListSprite:null,
    topPlayerSprite:null,
    selectedBoardData:null,
    lbPageIndex:0,
    currentPageNum:1,
    ctor: function (parentNode) {
        this._super("Bảng xếp hạng", cc.size(939, 592), parentNode);
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this.setVisibleBottom(false);
        this.setVisibleOutBackgroundWindow(true);
        cc.spriteFrameCache.addSpriteFrames(res.leader_board_ss_plist, res.leader_board_ss_img);
        this.initWd();
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"LeaderBoardMain");
    },
    initWd: function () {

        var bgWd = new BkSprite("#"+res_name.popup_leaderboard_bg);
        bgWd.x = this.getWindowSize().width/2 - 0.5;
        bgWd.y = this.getWindowSize().height/2 - 0.5;
        this.addChildBody(bgWd, WD_ZORDER_BODY);
        this._btnClose.loadTextures(res_name.BtnClose_Window,res_name.BtnClose_Window,res_name.BtnClose_Window,res_name.BtnClose_Window_hover,ccui.Widget.PLIST_TEXTURE);
        this._btnClose.x = this._btnClose.x - 26;
        this._btnClose.y = this._btnClose.y - 47;
        this._windowTitle.setFontSize(22);
        this._windowTitle.x = this._windowTitle.x + this._windowTitle.getContentSize().width/2;
        this._windowTitle.y = this._windowTitle.y - 30;
        this._windowTitle.setVisible(true);

        this.initHandleonLoadComplete();
        this.requestChampionList();
    },

    drawLeaderBoard: function (leaderList) {
        if (this.leaderBoardSprite) {
            this.leaderBoardSprite.removeSelf();
            this.leaderBoardSprite = null;
        }
        this.leaderBoardSprite = new BkSprite();
        this.leaderBoardSprite.x = 30;
        this.leaderBoardSprite.y = this.getBodySize().height / 2 - 90;
        this.addChildBody(this.leaderBoardSprite);
        var self = this;
        var callTopWd = function (data) {
            var topWd = new BkTopPlayerWindow(data);
            topWd.setCallbackRemoveWindow(function () {
                self.setVisible(true);
            });
            topWd.setParentWindow(self);
            topWd.showWithParent();
            self.setVisible(false);
        };
        var daiGiaData = leaderList[0];

        var topDaiGiaBgHover = new cc.Scale9Sprite(res_name.top_bg_hover);
        topDaiGiaBgHover.setContentSize(cc.size(387, 79));
        topDaiGiaBgHover.x = 266;
        topDaiGiaBgHover.y = this.getWindowSize().height - 146;
        topDaiGiaBgHover.setVisible(false);
        var sprite1 = new BkSprite(res.Tranperent_IMG,cc.rect(0,0,topDaiGiaBgHover.width,topDaiGiaBgHover.height));
        sprite1.x = topDaiGiaBgHover.x;
        sprite1.y = topDaiGiaBgHover.y;
        this.addChildBody(sprite1);
        this.addChildBody(topDaiGiaBgHover);

        sprite1.setMouseOnHover(function(){
            topDaiGiaBgHover.setVisible(true);
        },function(){
            topDaiGiaBgHover.setVisible(false);
        });
        sprite1.setOnlickListenner(function(){
            callTopWd(daiGiaData);
        });

        var topDaiGiaNameBg = new BkSprite("#"+res_name.cao_thu_name_bg);
        topDaiGiaNameBg.x = 270;
        topDaiGiaNameBg.y = this.getWindowSize().height - 160;
        this.addChildBody(topDaiGiaNameBg);

        var topDaiGia = new BkLabel(daiGiaData.leaderName,"",15, true);
        topDaiGia.x = topDaiGiaNameBg.x;
        topDaiGia.y = topDaiGiaNameBg.y;
        this.addChildBody(topDaiGia);

        var nhietTinhData = leaderList[1];
        var topNhietTinhBgHover = new cc.Scale9Sprite(res_name.top_bg_hover);
        topNhietTinhBgHover.setContentSize(cc.size(387, 79));
        topNhietTinhBgHover.x = this.getWindowSize().width / 2  +202;
        topNhietTinhBgHover.y = topDaiGiaBgHover.y;
        topNhietTinhBgHover.setVisible(false);

        var sprite2 = new BkSprite(res.Tranperent_IMG,cc.rect(0,0,topDaiGiaBgHover.width,topDaiGiaBgHover.height));
        sprite2.x = topNhietTinhBgHover.x;
        sprite2.y = topNhietTinhBgHover.y;
        this.addChildBody(sprite2);
        this.addChildBody(topNhietTinhBgHover);


        sprite2.setMouseOnHover(function(){
            topNhietTinhBgHover.setVisible(true);
        },function(){
            topNhietTinhBgHover.setVisible(false);
        });
        sprite2.setOnlickListenner(function(){
            callTopWd(nhietTinhData);
        });

        var topNhietTinhBg = new BkSprite("#"+res_name.cao_thu_name_bg);
        topNhietTinhBg.x = this.getWindowSize().width / 2  +202;
        topNhietTinhBg.y = topDaiGiaNameBg.y;
        this.addChildBody(topNhietTinhBg);

        var topNhietTinh = new BkLabel(nhietTinhData.leaderName,"",15, true);
        topNhietTinh.x = topNhietTinhBg.x;
        topNhietTinh.y = topDaiGia.y;
        this.addChildBody(topNhietTinh);
        //Remove 2 item above
        leaderList.splice(0, 2);

        this.drawLeaderBoardList(leaderList);
    },

    drawLeaderBoardList: function (leaderList) {
        if (this.lbListSprite) {
            this.lbListSprite.removeSelf();
            this.lbListSprite = null;
        }
        this.lbListSprite = new BkSprite();
        this.leaderBoardSprite.addChild(this.lbListSprite);

        var maxGameRowNum = 4
        var maxGameColNum = 2;
        var pageNumber = (leaderList.length + maxGameRowNum - 1) / maxGameRowNum;
        var calPage = pageNumber/maxGameColNum;
        if (pageNumber > 1) {
            var self = this;
            var btnPrevious = Util.createBtnNav(res_name.btn_back_small, function () {
                if(self.currentPageNum < calPage){
                    self.currentPageNum +=1;
                    //self.lbPageIndex = self.currentPageNum * maxGameRowNum - maxGameRowNum;

                }else{
                    self.currentPageNum -= 1;
                    self.lbPageIndex = 0;
                }

                self.drawLeaderBoardList(leaderList);
            });
            btnPrevious.x = btnPrevious.width / 2 + 10;
            btnPrevious.y = this.leaderBoardSprite.y - 188;
            this.lbListSprite.addChild(btnPrevious);

            var btnNext = Util.createBtnNav(res_name.btn_next_small, function () {
                if(self.currentPageNum >= calPage){
                    self.currentPageNum = 1;
                    self.lbPageIndex = 0;
                }else{
                    self.currentPageNum += 1;
                }
                self.drawLeaderBoardList(leaderList);
            });
            btnNext.x = this.getBodySize().width - btnNext.width / 2 - 70;
            btnNext.y = this.leaderBoardSprite.y - 188;
            this.lbListSprite.addChild(btnNext);
        }
        var beginGameId = this.lbPageIndex;
        var pos = cc.p(105, this.getBodySize().height - 352);
        for (var i = beginGameId; i < leaderList.length; i++) {
            var item = leaderList[i];
            if(item.gid  == undefined){
                continue;
            }
            //Check new page
            if (i % maxGameRowNum * maxGameColNum == 0) {
                if (i >= beginGameId + maxGameRowNum * maxGameColNum) {
                    this.lbPageIndex = i;
                    break;
                }
            }

            var displayObject = new BkLeaderBoardItem(item, pos, this);
            displayObject.y = pos.y - LEADER_BOARD_HEIGHT_SPRITE - 6;
            //right pos
            if (i % 2) {
                displayObject.x = 497;
                this.lbListSprite.addChild(displayObject);
                pos.y = displayObject.y;
            } else {
                //left pos
                displayObject.x = 90;
                this.lbListSprite.addChild(displayObject);
            }
        }
    },

    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        switch (tag) {
            case c.NETWORK_GET_CHAMPION_LIST_RETURN:
                this.drawLeaderBoard(o);
                break;
        }
    },
    requestChampionList: function () {
        var packet = new BkPacket();
        packet.CreatePacketWithOnlyType(c.NETWORK_GET_CHAMPION_LIST);
        BkConnectionManager.send(packet);
        Util.showAnim();
    },
    onExit: function () {
        cc.spriteFrameCache.removeSpriteFramesFromFile(res.leader_board_ss_plist);
        this._super();
    }
});