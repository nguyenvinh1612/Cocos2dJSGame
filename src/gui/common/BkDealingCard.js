/**
 * Created by bs on 18/05/2017.
 */
BkDealingCard = cc.Class.extend({
    // const
    DELTA_X:							    15,
    MAX_DIVIDE_CARDS: 					    20,
    TIME_AUTO_CHOOSE_NOC: 			        1.5,
    START_RIGHT_SHARE: 					    17,
    MARGIN_CENTER: 					        100,
    CENTER_POINT: 					        cc.p(c.WINDOW_WIDTH/2,c.WINDOW_HEIGHT/2),
    TIME_DELAY_MOVE:					    1,
    BASE_DUARATION_ANIMATION: 		        0.3,
    ALPHA_DEGREES: 					        40,

    // init data ctor
    ingame:null,
    gameTable:null,
    bocCaiCard:null,
    bocCaiPoint:null,
    bocCaiPos:null,


    rotateCount:null,
    PlayerAvatar:null,

    // init custom data
    NumCardRight:0,
    NumCardLeft:0,
    currentPosRight: -1,
    currentPosLeft :1,
    IsMoveLeftToCenter : false,
    IsMoveRightToCenter : false,
    isClickChooseNoc : false,
    isClickChooseBaiCai : false,
    listAddCards : [],
    listVisibleCards : [],
    MoRight  : null,
    MoLeft  : null,
    moBocCai:0,
    numberFN:0,

    ctor:function(gt,ig,bcC,bcName,bcP,bcPos,rc,PlAvatar){
        this.ingame = ig;
        this.bocCaiCard = bcC;
        this.bocCaiName = bcName;
        this.bocCaiPoint = bcP;
        this.bocCaiPos = bcPos;
        this.gameTable = gt;
        this.rotateCount = rc;
        this.PlayerAvatar= PlAvatar;

        this.ingame.addChild(this.bocCaiCard,10000000+1);
        this.bocCaiCard.visible = false;
    },
    doAnimationDealCard:function(){
        this.initForDealCards();
        this.dealRightCards();
        this.dealLeftCards();
    },
    initMocardWith:function(cc,po,isVisiable,sc){
        if (po == undefined){po = null}
        if (isVisiable == undefined){isVisiable = false}
        if (sc == undefined){sc = 0.6}

        cc.visible = isVisiable;
        if(po!=null){
            cc.x = po.x;
            cc.y= po.y;
        }
        cc.setRotation(this.ALPHA_DEGREES);
        cc.setScale(sc);
        this.ingame.addChild(cc,100);
    },
    initForDealCards:function(){
        this.NumCardRight = this.MAX_DIVIDE_CARDS;
        this.NumCardLeft = this.MAX_DIVIDE_CARDS;
        this.currentPosRight = 1;
        this.currentPosLeft =1;
        this.IsMoveLeftToCenter = false;
        this.IsMoveRightToCenter = false;
        this.isClickChooseNoc = false;
        this.isClickChooseBaiCai = false;
        this.listAddCards = [];
        this.listVisibleCards = [];
        this.MoRight  = new BkChanCard(-13);
        this.initMocardWith(this.MoRight);

        this.MoLeft  = new BkChanCard(-13);
        this.initMocardWith(this.MoLeft);
    },
    addActionDealCardRight:function(tempR){
        var pos = ((this.MAX_DIVIDE_CARDS - tempR) % 5) + 1;
        var bP;
        var eP;
        bP = CConstIngame.getBeginPointFrom(pos,1);
        eP = CConstIngame.getEndPointFrom(pos,1);
        this.MoRight.x = bP.x;
        this.MoRight.y = bP.y;
        this.MoRight.listAction.push(cc.moveTo(this.BASE_DUARATION_ANIMATION,eP.x,eP.y));
        this.MoRight.listAction.push(cc.callFunc(this.onCompleteMoveRight,this));
    },
    dealRightCards:function(){
        if (!this.MoRight.visible){
            this.MoRight.visible = true;
        }
        this.MoRight.listAction = [];
        var idealRightCards;
        for (idealRightCards=this.MAX_DIVIDE_CARDS;idealRightCards>0;idealRightCards--){
            this.addActionDealCardRight(idealRightCards);
        }
        this.MoRight.listAction.push(cc.callFunc(this.finisDealRight,this));
        this.MoRight.runListAction();
    },
    onCompleteMoveRight:function(){
        var AddCard = new BkChanCard(-16);
        AddCard.setScale(0.6);
        this.ingame.addChild(AddCard,1);
        this.listAddCards.push(AddCard);
        if (this.currentPosRight == 1 || this.currentPosRight == 2){
            this.listVisibleCards.push(true);
        } else {
            this.listVisibleCards.push(false);
        }
        this.numberFN++;

        var deltaX,deltaY,deltaAnpha;
        if (this.numberFN % 4 ==0){
            deltaX = 2; deltaY =2; deltaAnpha = -3;
        } else if (this.numberFN % 4 ==1) {
            deltaX = 2; deltaY = -2; deltaAnpha = 3;
        } else if (this.numberFN % 4 ==2) {
            deltaX = -2; deltaY = -2; deltaAnpha = 3;
        } else if (this.numberFN % 4 ==3) {
            deltaX = -2; deltaY = 2; deltaAnpha = -3;
        }
        AddCard.x = CConstIngame.getEndPointFrom(this.currentPosRight,1).x+deltaX;
        AddCard.y = CConstIngame.getEndPointFrom(this.currentPosRight,1).y+deltaY;
        AddCard.setRotation(this.ALPHA_DEGREES + deltaAnpha);
        this.NumCardRight--;
        if (this.currentPosRight==5){
            this.currentPosRight=1;
        } else {
            this.currentPosRight +=1;
        }
    },
    finisDealRight:function(){
        this.MoRight.moveFromTo(this.MoRight.x,c.WINDOW_WIDTH/2 + this.DELTA_X
            ,this.MoRight.y,c.WINDOW_HEIGHT/2,this.BASE_DUARATION_ANIMATION);
    },
    onCallbackStartMoveLeft:function () {
        this.MoLeft.visible = true;
    },
    dealLeftCards:function(){
        var ii;
        var seq = cc.sequence(cc.delayTime((this.MAX_DIVIDE_CARDS-this.START_RIGHT_SHARE) *this.BASE_DUARATION_ANIMATION)
            ,cc.callFunc(this.onCallbackStartMoveLeft,this));
        this.MoLeft.listAction.push(seq);
        for (ii=this.MAX_DIVIDE_CARDS;ii>0;ii--){
            this.addListActionDealCardLeft(ii);
        }
        this.MoLeft.listAction.push(cc.callFunc(this.finisDealLeft,this));
        this.MoLeft.runListAction();
    },
    addListActionDealCardLeft:function(temp){
        var pos = ((this.MAX_DIVIDE_CARDS - temp) % 5) + 1;
        var bP;
        var eP;
        bP = CConstIngame.getBeginPointFrom(pos,0);
        eP = CConstIngame.getEndPointFrom(pos,0);
        this.MoLeft.x = bP.x;
        this.MoLeft.y = bP.y;
        this.MoLeft.listAction.push(cc.moveTo(this.BASE_DUARATION_ANIMATION,eP.x,eP.y));
        this.MoLeft.listAction.push(cc.callFunc(this.onCompleteMoveLeft,this));
    },
    onCompleteMoveLeft:function(){
        var AddCard = new BkChanCard(-16);
        AddCard.setScale(0.6);

        this.ingame.addChild(AddCard,1);
        this.listAddCards.push(AddCard);

        if (this.currentPosLeft == 3 || this.currentPosLeft == 4 || this.currentPosLeft == 5){
            this.listVisibleCards.push(true);
        } else {
            this.listVisibleCards.push(false);
        }

        this.numberFN++;
        var deltaX,deltaY,deltaAnpha;
        if (this.numberFN % 4 ==0){
            deltaX = 2; deltaY =2; deltaAnpha = -3;
        } else if (this.numberFN % 4 ==1) {
            deltaX = 2; deltaY = -2; deltaAnpha = 3;
        } else if (this.numberFN % 4 ==2) {
            deltaX = -2; deltaY = -2; deltaAnpha = 3;
        } else if (this.numberFN % 4 ==3) {
            deltaX = -2; deltaY = 2; deltaAnpha = -3;
        }

        AddCard.x = CConstIngame.getEndPointFrom(this.currentPosLeft,0).x+deltaX;
        AddCard.y = CConstIngame.getEndPointFrom(this.currentPosLeft,0).y+deltaY;
        AddCard.setRotation(this.ALPHA_DEGREES + deltaAnpha);
        if (this.currentPosLeft==5){
            this.currentPosLeft=1;
        } else {
            this.currentPosLeft +=1;
        }
        this.NumCardLeft--;
    },
    finisDealLeft:function(){
        var self = this;
        var f = function(){
            self.joinCards();
        };
        this.MoLeft.moveFromTo(this.MoLeft.x,this.CENTER_POINT.x + this.DELTA_X,this.MoLeft.y
            ,this.CENTER_POINT.y,this.BASE_DUARATION_ANIMATION,f);
    },
    joinCards:function(){
        this.MoLeft.visible = false;
        this.listJoinCard1  = new BkChanCard(-11);
        this.initMocardWith(this.listJoinCard1,null,true);
        this.listJoinCard2  = new BkChanCard(-12);
        this.initMocardWith(this.listJoinCard2,null,true);
        this.listJoinCard3  = new BkChanCard(-13);
        this.initMocardWith(this.listJoinCard3,null,true);
        this.listJoinCard4  = new BkChanCard(-14);
        this.initMocardWith(this.listJoinCard4,null,true);
        this.listJoinCard5  = new BkChanCard(-15);
        this.initMocardWith(this.listJoinCard5,null,true);

        var ccd;
        for (var i=0;i<this.listAddCards.length;i++){
            if (this.listVisibleCards[i]){
                ccd = this.listAddCards[i];
                if (ccd!= null){
                    ccd.visible = false;
                }
            }
        }
        var self = this;
        var f = function(){
            self.listJoinCard1.visible = false;
            self.listJoinCard2.visible = false;
            self.listJoinCard3.visible = false;
            self.listJoinCard4.visible = false;
            self.listJoinCard5.visible = false;
            self.doChonNoc();
        };
        var deltaTime  = 3;
        this.listJoinCard1.moveFromTo(CConstIngame.point21.x,CConstIngame.point14.x,CConstIngame.point21.y
            ,CConstIngame.point14.y,deltaTime * this.BASE_DUARATION_ANIMATION);
        this.listJoinCard2.moveFromTo(CConstIngame.point11.x,CConstIngame.point22.x,CConstIngame.point11.y
            ,CConstIngame.point22.y,deltaTime * this.BASE_DUARATION_ANIMATION);
        this.listJoinCard3.moveFromTo(CConstIngame.point12.x,CConstIngame.point23.x,CConstIngame.point12.y
            ,CConstIngame.point23.y,deltaTime * this.BASE_DUARATION_ANIMATION);
        this.listJoinCard4.moveFromTo(CConstIngame.point25.x,CConstIngame.point11.x,CConstIngame.point25.y
            ,CConstIngame.point11.y,deltaTime * this.BASE_DUARATION_ANIMATION);
        this.listJoinCard5.moveFromTo(CConstIngame.point24.x,CConstIngame.point15.x,CConstIngame.point24.y
            ,CConstIngame.point15.y,deltaTime * this.BASE_DUARATION_ANIMATION,f);
    },
    doChonNoc:function(){
        logMessage("doChonNoc");
        var cdc;
        var i;
        if (this.listAddCards!= null){
            for ( i= 0;i<this.listAddCards.length;i++){
                cdc = this.listAddCards[i];
                if (cdc!= null){
                    cdc.removeSelf();
                }
            }
            this.listAddCards = null;
        }

        this.moCards1 = new BkChanCard(-11);
        this.initMocardWith(this.moCards1,CConstIngame.point11,true,0.62);
        this.moCards2 = new BkChanCard(-13);
        this.initMocardWith(this.moCards2,CConstIngame.point15,true,0.62);
        this.moCards3 = new BkChanCard(-12);
        this.initMocardWith(this.moCards3,CConstIngame.point14,true,0.62);
        this.moCards4 = new BkChanCard(-14);
        this.initMocardWith(this.moCards4,CConstIngame.point23,true,0.62);
        this.moCards5 = new BkChanCard(-15);
        this.initMocardWith(this.moCards5,CConstIngame.point22,true,0.62);
        var self = this;
        if (this.isMeBocCai()){
            showToastMessage(BkConstString.STR_CHOOSE_MO_NOC,this.bocCaiPoint.x,this.bocCaiPoint.y,5);

            var f = function (taget){
                moveMoNocToCenter(taget);
            };
            this.moCards1.createCustomEventClick(f);
            this.moCards2.createCustomEventClick(f);
            this.moCards3.createCustomEventClick(f);
            this.moCards4.createCustomEventClick(f);
            this.moCards5.createCustomEventClick(f);
        } else {
            showToastMessage(BkConstString.STR_CHO_BC_1+this.bocCaiName+BkConstString.STR_CHO_BC_3,this.bocCaiPoint.x
                ,this.bocCaiPoint.y,5);
        }

        this.isClickChooseNoc = false;
        var moveMoNocToCenter = function(cdc){
            self.isClickChooseNoc = true;
            ActionChooseNoc(cdc);
            var i =1;
            if (cdc==self.moCards2)i=2;
            if (cdc==self.moCards3)i=3;
            if (cdc==self.moCards4)i=4;
            if (cdc==self.moCards5)i=5;
            processRotationAfterChoosingNoc(i);
        };
        ActionChooseNoc = function(cc){
            removeScheduleAutoChooseNoc();
            var ff = function(){
                cc.visible = false;
            };
            cc.moveFromTo(cc.x,self.MoLeft.x,cc.y,self.MoLeft.y,self.BASE_DUARATION_ANIMATION,ff);
            if (self.isMeBocCai()){
                self.moCards1.removeClickEvent();
                self.moCards2.removeClickEvent();
                self.moCards3.removeClickEvent();
                self.moCards4.removeClickEvent();
                self.moCards5.removeClickEvent();
            }
        };
        processRotationAfterChoosingNoc = function(i){
            if (i == 1){
                self.moveCardAfterChonNoc(self.moCards2,self.moCards3,self.moCards4,self.moCards5);
            } else if (i == 2){
                self.moveCardAfterChonNoc(self.moCards1,self.moCards3,self.moCards4,self.moCards5);
            } else if (i == 3){
                self.moveCardAfterChonNoc(self.moCards1,self.moCards2,self.moCards4,self.moCards5);
            } else if (i == 4){
                self.moveCardAfterChonNoc(self.moCards1,self.moCards2,self.moCards3,self.moCards5);
            } else{
                self.moveCardAfterChonNoc(self.moCards1,self.moCards2,self.moCards3,self.moCards4);
            }
        };
        creatRandomWith = function(tg){
            logMessage("tg "+tg);
            if (tg == 1){
                ActionChooseNoc(self.moCards1);
                processRotationAfterChoosingNoc(1);
            } else if (tg == 2){
                ActionChooseNoc(self.moCards2);
                processRotationAfterChoosingNoc(2);
            } else if (tg == 3){
                ActionChooseNoc(self.moCards3);
                processRotationAfterChoosingNoc(3);
            } else if (tg == 4){
                ActionChooseNoc(self.moCards4);
                processRotationAfterChoosingNoc(4);
            } else {
                ActionChooseNoc(self.moCards5);
                processRotationAfterChoosingNoc(5);
            }
        };

        finishTimeAutoChooseNoc = function(){
            if (!self.isClickChooseNoc){
                if (self.isMeBocCai()){
                    ActionChooseNoc(self.moCards1);
                    processRotationAfterChoosingNoc(1);
                } else {
                    var tg = Math.floor(BkTime.GetCurrentTime()/10000);
                    var rdTime = tg >> 0;
                    creatRandomWith(rdTime%5);
                }
            }
        };
        var ftacn = function(){
            removeScheduleAutoChooseNoc();
            finishTimeAutoChooseNoc();
        };

        removeScheduleAutoChooseNoc = function(){
            self.ingame.unschedule(ftacn)
        };
        this.ingame.scheduleOnce(ftacn,this.TIME_AUTO_CHOOSE_NOC);
    },


    moveCardAfterChonNoc:function(m1, m2, m3, m4){
        var self = this;
        var f = function(){
            self.doBocCai();
        };
        m1.moveFromTo(m1.x,this.CENTER_POINT.x + this.DELTA_X,m1.y
            ,this.CENTER_POINT.y + this.MARGIN_CENTER,3 * this.BASE_DUARATION_ANIMATION);
        m2.moveFromTo(m2.x,this.CENTER_POINT.x + this.MARGIN_CENTER + this.DELTA_X
            ,m2.y,this.CENTER_POINT.y ,3 * this.BASE_DUARATION_ANIMATION);
        m3.moveFromTo(m3.x,this.CENTER_POINT.x + this.DELTA_X
            ,m3.y,this.CENTER_POINT.y - this.MARGIN_CENTER,3 * this.BASE_DUARATION_ANIMATION);
        m4.moveFromTo(m4.x,this.CENTER_POINT.x - this.MARGIN_CENTER + this.DELTA_X
            ,m4.y,this.CENTER_POINT.y,3 * this.BASE_DUARATION_ANIMATION,f);
        if (this.listMoCard!= null){
            this.listMoCard = null;
        }

        this.listMoCard = [];
        this.listMoCard.push(m1);
        this.listMoCard.push(m4);
        this.listMoCard.push(m3);
        this.listMoCard.push(m2);
    },
    doBocCai:function(){
        var self = this;
        var i;
        var iCCard;
        if (this.isMeBocCai()){
            showToastMessage(BkConstString.STR_CHOOSE_BAI_CAI,this.bocCaiPoint.x,this.bocCaiPoint.y,5);
        } else {
            showToastMessage(BkConstString.STR_CHO_BC_1+this.bocCaiName+BkConstString.STR_CHO_BC_2,this.bocCaiPoint.x
                ,this.bocCaiPoint.y,5);
        }
        this.isClickChooseBaiCai = false;
        if (this.isMeBocCai()){
            for (i=0;i<this.listMoCard.length;i++){
                iCCard = this.listMoCard[i];
                var f = function(taget){
                    onClickCardToBocCai(taget);
                };
                iCCard.createCustomEventClick(f);
            }
        }

        onClickCardToBocCai = function(tg){
            self.isClickChooseBaiCai = true;
            for (i=0;i<self.listMoCard.length;i++){
                iCCard = self.listMoCard[i];
                if (tg == iCCard){
                    self.moBocCai = i;
                }
            }
            ActionChooseBaiCai(tg);
        };

        ActionChooseBaiCai = function(cc){
            var zo = 20000000;
            self.bocCaiCard.visible = true;
            self.bocCaiCard.x =  cc.x;
            self.bocCaiCard.y = cc.y;
            self.bocCaiCard.SetSize(108);
            self.bocCaiCard.setLocalZOrder(zo);
            for (i=0;i<self.listMoCard.length;i++){
                iCCard = self.listMoCard[i];
                if (self.isMeBocCai()){
                    iCCard.removeClickEvent();
                }
                iCCard.setLocalZOrder(zo);
            }

            self.processMoveCardToPlayer();
        };

        var fcbc = function(){
            removeScheduleChooseBaiCai();
            if (!self.isClickChooseBaiCai){
                if (self.listMoCard!= null){
                    ActionChooseBaiCai(self.listMoCard[0]);
                    self.moBocCai = 0;
                }
            }
        };

        removeScheduleChooseBaiCai = function(){
            self.ingame.unschedule(fcbc)
        };
        this.ingame.scheduleOnce(fcbc,this.TIME_AUTO_CHOOSE_NOC);
    },
    adjustLocation:function(rotateCount){
        var rtn = CConstIngame.getPlayerAvatarPos(rotateCount);
        rtn.y -= CPlayer.MAX_HEIGHT_SP*0.25;
        rtn.x +=CPlayer.MAX_WIDTH_SP*0.5;
        return rtn;
    },
    finalMoveCard:function(){
        var i;
        var tg;
        var iMoCard;
        var pos;
        var iFinish = 0;
        var pAvatar;
        var iPoint;

        for (i=1;i<4;i++){
            pos = i + this.rotateCount;
            if (pos > 4) {
                pos = pos - 4;
            }

            pAvatar = this.PlayerAvatar[pos-1];
            if (pAvatar != null && pAvatar.getPlayerName() != null) {
                iFinish = i;
            }
        }

        for (i=1;i<4;i++){
            tg = i+this.moBocCai;
            if (tg>=4){ tg-=4;}
            iMoCard = this.listMoCard[tg];

            pos = i + this.rotateCount;
            if (pos > 4) {
                pos = pos - 4;
            }

            pAvatar = this.PlayerAvatar[pos-1];
            if (pAvatar != null && pAvatar.getPlayerName() != null) {
                iPoint = this.adjustLocation(pos);
                if (i != iFinish){
                    iMoCard.moveFromTo(iMoCard.x,iPoint.x,iMoCard.y,iPoint.y,3 * this.BASE_DUARATION_ANIMATION);
                } else {
                    var self = this;
                    var f = function(){
                        self.finishDealing();
                    };
                    iMoCard.moveFromTo(iMoCard.x,iPoint.x,iMoCard.y,iPoint.y,3 * this.BASE_DUARATION_ANIMATION,f);
                }
            }
        }
    },
    removeDealingCard:function(){
        var i;
        var cdc;
        if (this.listAddCards != null){
            for (i =0;i<this.listAddCards.length;i++){
                cdc = this.listAddCards[i];
                this.removeCCard(cdc);
            }
            this.listAddCards = null;
        }

        if (this.listMoCard!= null){
            for (i=0;i<this.listMoCard.length;i++){
                cdc = this.listMoCard[i];
                this.removeCCard(cdc);
                this.listMoCard[i] = null;
            }
            this.listMoCard = null;
        }
        if (this.listVisibleCards != null){
            this.listVisibleCards = null;
        }

        this.removeCCard(this.moCards1);
        this.removeCCard(this.moCards2);
        this.removeCCard(this.moCards3);
        this.removeCCard(this.moCards4);
        this.removeCCard(this.moCards5);

        this.removeCCard(this.listJoinCard1);
        this.removeCCard(this.listJoinCard2);
        this.removeCCard(this.listJoinCard3);
        this.removeCCard(this.listJoinCard4);
        this.removeCCard(this.listJoinCard5);

        this.removeCCard(this.MoRight);
        this.removeCCard(this.MoLeft);
        this.removeCCard(this.bocCaiCard);
    },
    removeCCard:function(cca){
        if (cca != null){
            cca.removeSelf();
            cca = null;
        }
    },
    finishDealing:function(){
        this.removeDealingCard();
        var player = this.gameTable.getMyClientState();
        if (player!=null){
            this.ingame.InitAfterDealingCards(player.getListOnHandCards());
        }
    },
    processMoveCardToPlayer:function(){
        var timeMoveToPosPlayer = 3 * this.BASE_DUARATION_ANIMATION;
        var iPoint = this.adjustLocation(this.rotateCount);
        var iCCard = this.listMoCard[this.moBocCai];
        iCCard.runAction(cc.sequence(cc.delayTime(this.TIME_DELAY_MOVE),cc.moveTo(timeMoveToPosPlayer,iPoint.x,iPoint.y)));
        this.bocCaiCard.runAction(cc.sequence(cc.delayTime(this.TIME_DELAY_MOVE),cc.moveTo(timeMoveToPosPlayer,iPoint.x,iPoint.y),
            cc.callFunc(this.finalMoveCard,this)));
    },
    isMeBocCai:function(){
        // if (BkGlobal.UserInfo.getUserName() == this.bocCaiName){
        //     return true;
        // }
        return false;
    }
});
