/**
 * Created by vinhnq on 1/20/2016.
 */


var ROW_OFFSET_OTHER_PLAYER = 45;
var CARD_OFFSET_OTHER_PLAYER = 40 + 4;

var ROW_OFFSET = 74 + 2;
var CARD_OFFSET = 62 + 2;

var ROW_OFFSET_XEP_XONG = 55;
var CARD_OFFSET_XEP_XONG = 50 + 6;

var CARD_TEXT_TYPE_Y = 262;
var CARD_TEXT_TYPE_X = 708;
var DUR = 0.3;
var MY_CARD_SCALE_DEAL_CARD = 0.8;
var MY_CARD_SCALE_COMPARE = 0.8;
var MY_CARD_SCALE_XEP_BAI = 0.9;

var SCALE_FAKE_CARD = 0.5;
var OTHER_CARD_SCALE = 0.7;
var TIME_SHOW_ANIMATION = 0.08;

BkMauBinhGameLayer = BkBaseIngameLayer.extend({
    xepxongTextPos:cc.p(403,280),//403,280 - 403,325
    xepxongBtnPos:cc.p(403,33),//403,33 - 620,270
    btnXepXong:null,
    txtSochi:null,
    bgTxtSochi:null,
    isAutoSend:false,
    bgXepBai:null,
    myTextXepXong:null,
    ctor:function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.maubinh_plist, res.maubinh_img);
        this.configPosforStartGamebutton();
        //this.btnAn = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press, res_name.btnXethet,res_name.btnXethet_hover,"Ăn");
        this.btnXepXong = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press
            , res_name.btnXethet,res_name.btnXethet_hover,"Xếp Xong");
        this.btnXepXong.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnXepXong.visible = false;
        this.btnXepXong.x = this.xepxongBtnPos.x;
        this.btnXepXong.y = this.xepxongBtnPos.y;
        var self = this;
        this.addChild(this.btnXepXong,10000);
        this.btnXepXong.addClickEventListener(function(){
            if (BkTime.GetCurrentTime() - self.btnXepXong.lastTimeClick < 1000){
                return;
            }
            self.btnXepXong.lastTimeClick = BkTime.GetCurrentTime();
            self.onXepXongClick();
        });

        this.initMyTextXepXong();
    },
    configPosforStartGamebutton:function()
    {
        this.btnStartGame.x = cc.winSize.width/2;
        this.btnStartGame.y = cc.winSize.height/2;
        this.btnReady.x = cc.winSize.width/2;
        this.btnReady.y = cc.winSize.height/2;
    },
    onXepXongClick:function()
    {
        var self = this;
        if(self.getLogic().getMyMauBinhCardSuite().isNotBinhLung() || self.getLogic().getMyClientState().hasDiscard)
        {
            self.getLogic().discardCommand();
            return;
        }
        showPopupConfirmWith("Bạn binh lủng.\nBạn chắc chắn muốn dừng xếp?","Binh lủng",function()
        {
            self.getLogic().discardCommand();
        });
    },
    alertDiscardSuccess:function(serverPos,isXepXong)
    {
        var playeri = this.getLogic().getPlayer(serverPos);
        if (playeri != null){
            if(playeri != this.getLogic().getMyClientState() && playeri.isPlaying)
            {
                playeri.showArrangeCardAnimation(this,serverPos,isXepXong);
            }
        }

    },
    initMyTextXepXong:function(){

    },
    showMyTextXepXong:function(isXepXong){
        if (this.myTextXepXong != null){
            this.myTextXepXong.removeFromParent();
            this.myTextXepXong = null;
        }
        if(!this.getLogic().isInGameProgress())
        {
            return;
        }

        if (!isXepXong){
            return;
        }
        this.myTextXepXong = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM);
        this.myTextXepXong.setScale(0.55);
        this.myTextXepXong.x = this.xepxongTextPos.x;
        this.myTextXepXong.y = this.xepxongTextPos.y;
        var Zod = 0;//this.getLocalZOrder() + 10000;
        this.addChild(this.myTextXepXong,Zod);
        this.myTextXepXong.setString("Xếp xong");
    },
    onDiscardSuccess:function(serverPos,isXepXong)
    {
        logMessage("onDiscardSuccess");
        if (this.getLogic().isProcessingFinishGame){
            logMessage("isProcessingFinishGame -> dont process");
            return;
        }
        this.alertDiscardSuccess(serverPos,isXepXong);
        if(this.getLogic().getMyClientState().serverPosition == serverPos) {
            this.getLogic().getMyClientState().hasDiscard = isXepXong;
            this.showGameCustomButtons();
            this.getLogic().getMyClientState().getMauBinhCard().removeCardTextType();
            var myOnhandCard = this.getLogic().getMyClientState().getOnHandCard();
            this.getLogic().sortCard(this.getLogic().getMyClientState());
            this.showMyTextXepXong(isXepXong);
            if(isXepXong) {
                this.removeAllEventListener(myOnhandCard);
                this.removeAllClickMark(myOnhandCard);
            } else {
                this.getLogic().initDragDrop(myOnhandCard);
                this.showCardTextType(this.getLogic().getMyClientState(),CARD_TEXT_TYPE_X,CARD_TEXT_TYPE_Y);
            }
            this.showMyOnhand(isXepXong);
            //this.showMyOnhandAfterDiscardSuccess(isXepXong);
            if (this.isAutoSend){
                this.showMyTextXepXong(false);
                this.hideAllOngameCustomButton();
            }
        }
    },
    removeAllEventListener:function(cardList)
    {
        for(var i = 0; i < cardList.length; i++)
        {
            cardList[i].removeAllEventListener();
        }
    },
    removeAllClickMark:function(cardList)
    {
        for(var i = 0; i < cardList.length; i++)
        {
            cardList[i].cardUIStatus = CARD_STATUS_CURRENT;
            cardList[i].unShowTakenMask();
        }
    },
    onTableLeavePush:function(player)
    {
        this._super(player);
    },
    onFinishAnimationMoveCard:function(o)
    {
        if (o.tag == TAG_SELECT || o.tag == TAG_DESELECT)
        {
        }
    },
    removeBgXepBai:function(){
        if (this.bgXepBai != null){
            this.bgXepBai.removeFromParent();
            this.bgXepBai = null;
        }
    },
    initBGXepBai:function(isXepXong){
        var self = this;
        this.removeBgXepBai();
        if (!isXepXong){
            var endPoint = this.getPosMBcardWithData(5,ROW_OFFSET,CARD_OFFSET,this.getMyStartPoint(isXepXong));
            if (self.bgXepBai == null){
                self.bgXepBai = new BkSprite("#"+res_name.bg_tenchi);
                self.bgXepBai.x = endPoint.x + 82;
                self.bgXepBai.y = 182;
                self.addChild(self.bgXepBai);
            }
        }
    },
    showMyOnhandAfterDiscardSuccess:function(isXepXong){
        this.getLogic().stopAllAnimationMyOnhand();
        this.initBGXepBai(isXepXong);
        var scale = MY_CARD_SCALE_XEP_BAI;
        var roff = ROW_OFFSET;
        var coff = CARD_OFFSET;
        var dur = DUR;
        var onHand = this.getLogic().getMyClientState().getOnHandCard();
        for (var i = 0; i < onHand.length; i++) {
            var newPos = this.getPosMBcardWithData(i,roff,coff,this.getMyStartPoint(false));
            var cardi = onHand[i];
            cardi.moveAndScale(dur,newPos.x,newPos.y,"",false,scale);
        }
    },
    showMyOnhand:function(isXepXong,isDoAni){
        var self = this;
        if ((isXepXong == undefined) || (isXepXong == null)){
            isXepXong = false;
        }
        logMessage("showMyOnhand "+isXepXong);
        this.getLogic().stopAllAnimationMyOnhand();
        this.initBGXepBai(isXepXong);
        var scale = MY_CARD_SCALE_XEP_BAI;
        var roff = ROW_OFFSET;
        var coff = CARD_OFFSET;
        var dur = DUR;
        if (isXepXong){
            scale = MY_CARD_SCALE_COMPARE;
            roff = ROW_OFFSET_XEP_XONG;
            coff = CARD_OFFSET_XEP_XONG;
        }

        var onHand = this.getLogic().getMyClientState().getOnHandCard();
        var isDoAnimation = false;
        var newPos;
        var cardi;
        var i;

        if (isDoAni!= undefined){
            if (!isDoAni){
                //logMessage("only config pos "+onHand.length);
                for (i = 0; i < onHand.length; i++) {
                    newPos = this.getPosMBcardWithData(i,roff,coff,this.getMyStartPoint(isXepXong));
                    //logMessage("newPos ["+newPos.x+","+newPos.y+"]");
                    cardi = onHand[i];
                    cardi.x = newPos.x;
                    cardi.y = newPos.y;
                    cardi.setScale(scale);
                }
                return;
            }
        }

        if (onHand!= null){
            if (onHand.length > 0){
                var currentScale = onHand[0].getScale();
                //logMessage("currentScale "+currentScale +" scale: "+scale);
                if (currentScale != scale){
                    isDoAnimation = true;
                }

                for (i = 0; i < onHand.length; i++) {
                    newPos = this.getPosMBcardWithData(i,roff,coff,this.getMyStartPoint(isXepXong));
                    cardi = onHand[i];
                    //logMessage("["+cardi.x+","+cardi.y+"] - ["+newPos.x+","+newPos.y+"]");
                    if ((cardi.x != newPos.x) || (cardi.y != newPos.y)){
                        isDoAnimation = true;
                    }
                }
            }
        }

        if (isDoAnimation){
            logMessage("do animation move");
            for (i = 0; i < onHand.length; i++) {
                newPos = this.getPosMBcardWithData(i,roff,coff,this.getMyStartPoint(isXepXong));
                cardi = onHand[i];
                cardi.moveAndScale(dur,newPos.x,newPos.y,"",false,scale);
            }
        } else {
            logMessage("not need do animation");
        }
    },
    animateShowcard:function(cardList,dur,scale)
    {
        for (var i = 0; i < cardList.length; i++)
        {
            var cardi = cardList[i];
            //var newPos = this.getPosMBcardWithData(i,ROW_OFFSET_XEP_XONG,CARD_OFFSET_XEP_XONG);
            cardi.moveAndScale(dur,cardi.x,cardi.y,"",false,scale);
        }
    },
    hidetextSochi:function() {
        if (this.txtSochi != null) {
            this.txtSochi.visible = false;
        }
        if (this.bgTxtSochi != null){
            this.bgTxtSochi.visible = false;
        }
    },
    showtext:function(text)
    {
        var xPos = cc.winSize.width/2;
        var yPos = cc.winSize.height / 2 + 30;
        if (this.bgTxtSochi == null){
            this.bgTxtSochi = new BkSprite("#"+res_name.bg_thongbaogiuaban);
            this.bgTxtSochi.x = xPos;
            this.bgTxtSochi.y = yPos;
            this.addChild(this.bgTxtSochi, this.getLocalZOrder() + 1);
        }
        if (this.txtSochi == null) {
            this.txtSochi = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM);//new BkLabel("", "", 20);
            this.txtSochi.setScale(0.7);
            this.txtSochi.x = xPos;
            this.txtSochi.y = yPos;
            this.addChild(this.txtSochi, this.getLocalZOrder() + 2);
        }
        this.bgTxtSochi.visible = true;
        this.txtSochi.visible = true;
        this.txtSochi.setString(text);
    },
    showBinhLung:function(){
        for(var i= 0; i < 4; i++) {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri!= null && playeri.isPlaying) {
                if (!playeri.getMauBinhCard().isNotBinhLung()){
                    logMessage("show binh lung");
                    playeri.getMauBinhCard().showAllMaskCard();
                    if(playeri != this.getLogic().getMyClientState()) {
                        playeri.ArrangeCardAnimation.removeAllbackMask();
                    }
                    this.updateChiCardTextType(playeri,1);
                }
            }
        }
    },
    showAutoWin:function()
    {
        for(var i= 0; i < 4; i++) {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri != null && playeri.autoWinMoney!= undefined && playeri.autoWinMoney != 0) {
                logMessage("showAnimationUpdateMoney:" + playeri.getName() );
                this.showAnimationUpdateMoney(playeri.autoWinMoney,"", this.getAvatarByServerPos(i));
            }
            if(playeri != null && playeri.isAutoWin) {
                this.showMauBinh(playeri);
                this.showCardMask(playeri.getOnHandCard(),false);
                if(playeri != this.getLogic().getMyClientState()) {
                    playeri.ArrangeCardAnimation.removeAllbackMask();
                }
                var endPoint = this.getPosOfTextTypeWithData(playeri,1);
                if (playeri == this.getLogic().getMyClientState()){
                    endPoint.y = endPoint.y - 30;
                } else {
                    endPoint.y = endPoint.y - 30;
                }
                playeri.getMauBinhCard().showSpecialCardTextType(this,endPoint.x,endPoint.y);
            }
        }
    },
    showOtherPlayerCard:function() // NOT MAU BINH
    {
        for(var i= 0; i < 4; i++) {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri != null && !playeri.isAutoWin && playeri != this.getLogic().getMyClientState()) {
                if (playeri.ArrangeCardAnimation!= null){
                    playeri.ArrangeCardAnimation.removeAllbackMask();
                }
                this.showCardMask(playeri.getOnHandCard(),true);
            }
        }
    },
    showOtherZeroMoneyAnimation:function()
    {
        for(var i= 0; i < 4; i++)
        {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri != null && playeri.isPlaying  && !playeri.isAutoWin)
            {
                this.showAnimationUpdateMoney(null,"", this.getAvatarByServerPos(i));
            }
        }
    },
    showOtherPlayerCardTextType:function()
    {
        for(var i= 0; i < 4; i++)
        {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri != null && playeri.isPlaying && !playeri.isAutoWin)
            {
                var pos = this.getPosOfTextTypeWithData(playeri,1);
                pos.y = pos.y - 20;
                playeri.getMauBinhCard().showBinhLungTextType(this,pos.x,pos.y);
            }
        }
    },
    updateCardZOrder:function(cardSuite,chi) {
        setZOrder(cardSuite);
        for(var i = 0; i < cardSuite.length; i++) {
            if (chi == 1){
                if(i > 7) {
                    cardSuite[i].showMask(false);
                    cardSuite[i].setLocalZOrder( 100 + i);
                }
            } else if(chi == 2) {
                if(i >= 3 && i <= 7) {
                    cardSuite[i].showMask(false);
                    cardSuite[i].setLocalZOrder( 100 + i);
                }
            } else if(chi == 3) {
                if(i < 3) {
                    cardSuite[i].showMask(false);
                    cardSuite[i].setLocalZOrder( 100 + i);
                }
            }
        }
    },
    setCardScale:function(cardsuite,scale)
    {
      for(var i = 0; i < cardsuite.length; i++)
      {
          cardsuite[i].setScale(scale);
      }
    },
    prepareForShowChi:function(){
        for(var i = 0; i < 4; i++) {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri!= null && playeri.isPlaying) {
                if (!this.getLogic().isMyServerPos(playeri.serverPosition)){
                    playeri.ArrangeCardAnimation.prepareForShowChi(playeri,this);
                }
            }
        }
    },
    getListMBCardByChi:function(playeri,chi){
        var listCard = [];
        if (chi == 1){
            listCard = playeri.getMauBinhCard().getChi1CardSuite().cardSuite
        }
        if (chi == 2){
            listCard = playeri.getMauBinhCard().getChi2CardSuite().cardSuite
        }
        if (chi == 3){
            listCard = playeri.getMauBinhCard().getChi3CardSuite().cardSuite
        }
        return listCard;
    },
    updateMoneyForPlayer:function(playeri,chi){
        var money = 0;
        if (chi == 1){
            money = playeri.getChi1Money();
        }

        if (chi == 2){
            money = playeri.getChi2Money();
        }

        if (chi == 3){
            money = playeri.getChi3Money();
        }

        var me = this.getLogic().getMyClientState();
        if(playeri != me) {
            this.showAnimationUpdateMoney(-money,"", this.getAvatarByServerPos(playeri.serverPosition));
        }else {
            this.showAnimationUpdateMoney(money,"", this.getAvatarByServerPos(playeri.serverPosition));
        }
    },
    getPosOfTextTypeWithData:function(playeri,chi){
        var st = this.getStartPointForOnhand(playeri);
        var i = 10;
        if (chi == 2){
            i = 5;
        }
        if (chi == 3){
            i = 1;
        }
        var isMe = false;
        var me = this.getLogic().getMyClientState();
        if (me != null&& (playeri.serverPosition == me.serverPosition))
        {
            isMe = true;
        }

        var roff = ROW_OFFSET;
        var coff = CARD_OFFSET;
        if (!isMe){
            roff = ROW_OFFSET_OTHER_PLAYER;
            coff = CARD_OFFSET_OTHER_PLAYER;
        } else {
            st = this.getMyStartPoint(true);
            roff = ROW_OFFSET_XEP_XONG;
            coff = CARD_OFFSET_XEP_XONG;
        }

       return this.getPosMBcardWithData(i,roff,coff,st);
    },
    updateChiCardTextType:function(playeri,chi){
        var pos = this.getPosOfTextTypeWithData(playeri,chi);
        if (playeri.serverPosition == this.getLogic().getMyPos()){
            pos.y = pos.y - 25;
        } else {
            pos.y = pos.y - 20;
        }

        if (playeri.getMauBinhCard() == null){
            logMessage("playeri.getMauBinhCard() == null");
            return;
        }

        if (playeri.getMauBinhCard().cardSuite == null){
            logMessage("playeri.getMauBinhCard().cardSuite == null");
            return;
        } else {
            if (playeri.getMauBinhCard().cardSuite.length == 0){
                logMessage("cardSuite.length == 0");
                return;
            }
        }
        logMessage("cardSuite.length = "+playeri.getMauBinhCard().cardSuite.length);

        if(playeri.getMauBinhCard().isNotBinhLung()) {
            var mbCard = playeri.getMauBinhCard();
            mbCard.removeCardTextType();
            if (chi == 1){
                mbCard.showChi1CardTextType(this,pos.x,pos.y);
            }

            if (chi == 2){
                mbCard.showChi2CardTextType(this,pos.x,pos.y);
            }

            if (chi == 3){
                mbCard.showChi3CardTextType(this,pos.x,pos.y);
            }

        } else {
            if (chi == 1) {
                playeri.getMauBinhCard().showBinhLungTextType(this,pos.x,pos.y);
            }
        }
    },
    animateCompareCardSuite:function() {
        var me = this.getLogic().getMyClientState();
        var playeri;
        this.showCardMask(me.getOnHandCard(),true);
        var self = this;

        var fShowChi = function(chi){
            for(var i = 0; i < 4; i++) {
                playeri = self.getLogic().getPlayer(i);
                if(playeri!= null &&playeri.isPlaying && !playeri.isAutoWin) {
                    if (playeri.getMauBinhCard().isNotBinhLung()){
                        var mbListCard = self.getListMBCardByChi(playeri,chi);
                        self.updateMoneyForPlayer(playeri,chi);
                        if (playeri == me){
                            self.updateChiCardTextType(playeri,chi);
                            self.showCard(mbListCard);
                            self.showCardMask(me.getOnHandCard(),true);
                            self.updateCardZOrder(me.getOnHandCard(),chi);
                        } else {
                            playeri.ArrangeCardAnimation.showAnimateCardWithData(chi,self);
                        }
                        playeri.initHighLightBG(chi,self);
                    }
                }
            }
        };

        this.scheduleOnce(function showChi1() {
            self.unschedule(showChi1);
            self.showtext("So Chi 1");
            fShowChi(1);
            self.scheduleOnce(function showChi2() {
                self.unschedule(showChi2);
                self.showtext("So Chi 2");
                fShowChi(2);
                self.scheduleOnce(function showChi3() {
                    self.unschedule(showChi3);
                    self.showtext("So Chi 3");
                    fShowChi(3);
                    if(this.isNeedToShowSap3Chi()) {
                        this.showSap3Chi(3);
                    }else {
                        this.showSummary(3);
                    }
                },5);
            },5);
        },1);
    },
    isAllPlayerBinhLung:function()
    {
        for (var i = 0; i < 4; i++)
        {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri!= null && playeri.isPlaying && playeri.getMauBinhCard().isNotBinhLung())
            {
                return false;
            }
        }
        return true;
    },
    isNeedToShowSap3Chi:function()
    {
        for (var i = 0; i < 4; i++)
        {
            var playeri = this.getLogic().getPlayer(i);
            if (playeri != null && playeri.isPlaying && playeri.isSap3Chi)
            {
                return true;
            }
        }
        return false;
    },
    showSap3Chi:function(time) {
        this.scheduleOnce(function showSap3Chi()
        {
            for (var i = 0; i < 4; i++)
            {
                var playeri = this.getLogic().getPlayer(i);
                if (playeri != null && playeri.isPlaying )
                {
                    this.removeCardTextType(playeri);
                    playeri.removeHighLightBG();
                    setZOrder(playeri.getOnHandCard());
                    this.showCardMask(playeri.getMauBinhCard().cardSuite, false);
                    if(playeri.isSap3Chi)
                    {
                        this.showSap3ChiSplash(playeri);
                    }
                    if(playeri.sap3ChiMoney != undefined && playeri.sap3ChiMoney != 0)
                    {
                        this.showAnimationUpdateMoney(playeri.getSap3ChiMoney(),"", this.getAvatarByServerPos(i));
                    }
                }
            }
			this.showSummary(3);
        },time);
    },
    showSummary:function(timeShowSumary) {
        logMessage("showSummary "+timeShowSumary);
        var self = this;
        this.scheduleOnce(function showsumary() {
            self.processFinishShowSumary();
        },timeShowSumary);
    },
    processFinishShowSumary:function(){
        var self = this;
        self.getLogic().isProcessingFinishGame = false;
        for(var i = 0; i < 4; i++) {
            var playeri = self.getLogic().getPlayer(i);
            if(playeri!= null && playeri.isPlaying) {
                var onHand = playeri.getOnHandCard();
                setZOrder(onHand);
                self.showCardMask(playeri.getMauBinhCard().cardSuite, false);
                playeri.removeHighLightBG();
                var finalMoney = playeri.getFinalMoney();
                if(playeri.getMauBinhCard().isNotBinhLung() && !playeri.isAutoWin) {
                    playeri.getMauBinhCard().removeCardTextType();
                }
                if(finalMoney > 0) {
                    self.getLogic().increaseCash(playeri,Math.round(finalMoney*(1 - TAX_RATE)),"Thắng",finalMoney);
                } else {
                    self.getLogic().increaseCash(playeri,finalMoney,"Thua");
                }
            }
        }
        self.hidetextSochi();
        self.getLogic().showCountDownForMe();
        if(self.getLogic().getMyClientState() != null)
        {
            if(self.getLogic().getMyClientState().isLeaveRegistered)
            {
                self.scheduleOnce(self.getout,3);
            }
        }
        self.getLogic().processNextEventInQueue();
    },
    cancelSchedule:function()
    {
        var self = this;
        this.unschedule(self.getout);
    },
    getout:function()
    {
        var self = this;
        if (self.getLogic().getMyClientState() != null) {
            self.getLogic().getMyClientState().isLeaveRegistered = false;
            self.showRegExitSplash(false);
            self.getLogic().networkOutTable(0);
        }
    },
    scheduleGetOut:function(time)
    {
        var self = this;
        this.scheduleOnce(self.getout
            ,time);
    },
    isNeedToCompareSuite:function() {
        var count = 0;
        for(var i = 0; i < 4; i++)
        {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri != null && playeri.isPlaying && !playeri.isAutoWin) {
                count++;
            }
        }
        return (count > 1 && !this.isAllPlayerBinhLung());
    },
    showMauBinh:function(playeri) {
        playeri.showMaubinhAnimation(this);
    },
    showSap3ChiSplash:function(playeri)
    {
        this.getAvatarByServerPos(playeri.serverPosition).showSap3Chi();
    },
    showCardMask:function(carlist,isShow) {
        for(var i = 0 ; i < carlist.length; i++)
        {
            carlist[i].showMask(isShow);
        }
    },
    showCard:function(carlist) {
        for(var i = 0 ; i < carlist.length; i++)
        {
            carlist[i].showMask(false);
            carlist[i].cardImage.visible = true;
            carlist[i].cardImage.setOpacity(255);
        }
    },

    hideMask:function(cardSuite)
    {
        for(var i = 0; i < cardSuite.length; i++) {
            cardSuite[i].showMask(false);
        }
    },

    removeMaskCard:function(playeri) {
        playeri.getMauBinhCard().removeMaskCard();
    },

    showMaskCard:function(playeri) {
        logMessage("show card mask");
        playeri.getMauBinhCard().showMaskCard();
    },

    showCardTextType:function(playeri,cardTextTypeX,cardTextTypeY) {
        // showCardTextType-> show ten bai khi xep bai
        if(playeri.getMauBinhCard() == null) {
            return;
        }

        var deltaY = ROW_OFFSET + 2;
        playeri.getMauBinhCard().showcardTextType(this,cardTextTypeX,cardTextTypeY,cardTextTypeX,cardTextTypeY - deltaY,cardTextTypeX,cardTextTypeY - 2*deltaY);
    },

    removeCardTextType:function(playeri) {
        playeri.getMauBinhCard().removeCardTextType();
    },

    getPosMBcardWithData:function(index,rowOffset,cardOffset,startPoint){
        if ((startPoint == undefined) || (startPoint == null)){
            startPoint = this.getStartPointForOnhand(this.getLogic().getMyClientState());//new cc.Point(290,190);
        }
        if(startPoint == undefined || startPoint == null)
        {
            return;
        }
        var newy = startPoint.y;
        var newX = 0;
        if (index>7){
            newy = startPoint.y - 2 * rowOffset;
            newX = startPoint.x + (index - 8)*cardOffset;
        } else if (index>2){
            newy = startPoint.y - rowOffset;
            newX = startPoint.x + (index - 3)*cardOffset;
        } else {
            newX = startPoint.x + index*cardOffset;
        }
        return cc.p(newX,newy);
    },
    getMyStartPoint:function(isXepXong){
        if ((isXepXong == undefined) || (isXepXong == null)){
            isXepXong = false;
        }
        var xPos = 390;
        if (isXepXong){
            return new cc.Point(xPos,215);
        }

        return new cc.Point(xPos,258);
    },
    getStartPointForOnhand:function(playeri){
        if(playeri == null)
        {
            return;
        }
        var avatarPos =  this.getAvatarByServerPos(playeri.serverPosition);
        var displayPos = this.getLogic().getPlayerDisplayLocation(playeri.serverPosition);
        var deltaY = 19;
        if(avatarPos != null)
        {
            var startPoint;
            if(displayPos == 0)
            {
                startPoint = this.getMyStartPoint();//new cc.Point(370,260);
            }
            if(displayPos == 1)
            {
                startPoint = new cc.Point(avatarPos.x - 255 ,avatarPos.y + deltaY);
            }
            if(displayPos == 2)
            {
                startPoint = new cc.Point(avatarPos.x + 80 ,avatarPos.y + deltaY);
            }
            if(displayPos == 3)
            {
                startPoint = new cc.Point(avatarPos.x + 80 ,avatarPos.y + deltaY);
            }
            return startPoint
        }
        return null;
    },
    onPrepareNewGame:function()
    {
        this._super();
        this.hideAllOngameCustomButton();
    },
    initOnhandCardOtherPlayer:function(playeri){
        logMessage("initOnhandCardOtherPlayer");
        var logic = this.getLogic();
        if ((playeri != null)
            && (playeri.isPlaying)
            && (playeri.serverPosition != logic.getMyPos()) ) {
            logMessage("init fake card");
            var listOnhand = [];
            for (var j=0;j<13;j++){
                var card = new BkCard(14,1);
                card.showBackMask(true);
                card.setScale(SCALE_FAKE_CARD);
                this.addChild(card);
                card.setSelectable(false);
                var playerAvatari =  this.getAvatarByServerPos(playeri.serverPosition);
                var displayPos = logic.getPlayerDisplayLocation(playeri.serverPosition);
                var startPoint = this.getStartPointMBCardForDealCard(playerAvatari,displayPos);
                var enpoint = this.getPosMBCardForDealcard(j,startPoint);
                card.x = enpoint.x;
                card.y = enpoint.y;
                listOnhand.push(card);
            }
            playeri.setOnhandCard(listOnhand);
        }
    },
    onTableSynReturn:function()
    {
        this.isAutoSend = false;
        var me = this.getLogic().getMyClientState();
        this.showMyTextXepXong(me.hasDiscard);
        this.showGameCustomButtons();
    },
    addCardToScene:function(cardList)
    {
        setZOrder(cardList);
        for(var i = 0; i < cardList.length; i ++)
        {
            this.addChild(cardList[i]);
        }
    },

    onFinishGame:function() {
        this.showMyTextXepXong(false);
        this.removeCountDownText();
        this.hideAllOngameCustomButton();

        this.prepareForShowChi();
        //show các thằng được mậu binh
        this.showAutoWin();
        this.showBinhLung();

        if(this.isNeedToCompareSuite()) // nếu còn ít nhất 2 thằng cần so bài
        {
            logMessage("isNeedToCompareSuite");
            this.initCardBackMask();
            this.animateCompareCardSuite();
        }else // show bai cac thằng còn lại và show summary
        {
            this.showOtherPlayerCard();
            if(this.isAllPlayerBinhLung())
            {
                this.showOtherPlayerCardTextType();
                this.showOtherZeroMoneyAnimation();
            }
            this.showSummary(5);
        }
    },
    initCardBackMask:function() {
        for(var i= 0; i < 4; i++)
        {
            var playeri = this.getLogic().getPlayer(i);
            if(playeri != null && playeri.isPlaying && !playeri.isAutoWin && playeri != this.getLogic().getMyClientState()) {
                if (playeri.getMauBinhCard().isNotBinhLung()){
                    var plOnhand = playeri.getOnHandCard();
                    for(var j = 0; j < plOnhand.length; j++) {
                        plOnhand[j].initCardBackMask();
                    }
                }
            }
        }
    },
    resetToDefaultValue:function(playeri)
    {
        playeri.hasDiscard = false;
        playeri.finalMoney = 0;
        playeri.moneyChi1 = 0;
        playeri.moneyChi2 = 0;
        playeri.moneyChi3 = 0;
        playeri.isAutoWin = false;
        playeri.isSap3Chi = false;
        playeri.sap3ChiMoney = 0;
        playeri.autoWinMoney = 0;
        playeri.ArrangeCardAnimation = null;
    },
    initMyOnhandCard:function(){
        var myCS = this.getLogic().getMyClientState();
        var onHand = myCS.getOnHandCard();
        for(var i = 0; i < onHand.length; i++)
        {
            var cardi = onHand[i];
            cardi.cardStatus = cardi.CARD_STATUS_ONHAND_NORMAL;
            cardi.setIsQueueAnimation(true);
            cardi.removeCardBackMask();
            cardi.setEnableClick(true);
            cardi.setMoveHandle(this);
            cardi.setCustomCallbackMouseClick(this.onMouseClickMyCard);
        }
        myCS.setMauBinhCard(onHand);
    },

    onMouseClickMyCard:function(ca){
        logMessage("click "+ca.id + " status "+ca.cardStatus);

        var logic = BkLogicManager.getInGameLogic();
        var layerGui = logic.getGameLayer();
        var myCS = BkLogicManager.getInGameLogic().getMyClientState();
        var onHand = myCS.getOnHandCard();

        if (listCardInAnimation(onHand)){
            logMessage("list card isAnimation -> dont process click");
            return;
        }

        var id1 = getIndexOfCardOnhanhWithid(ca.id,onHand);
        var xpos1 = layerGui.getPosMBcardWithData(id1,ROW_OFFSET,CARD_OFFSET).x;
        var yPos1 = layerGui.getPosMBcardWithData(id1,ROW_OFFSET,CARD_OFFSET).y;

        var getCurrentMyCardSelect = function(){
            if (myCS!= null){
                var card;
                for (var i=0;i<onHand.length;i++){
                    card = onHand[i];
                    if (card.isSelected()){
                        return card;
                    }
                }
            }
            return null;
        };

        if (ca.cardStatus == ca.CARD_STATUS_ONHAND_NORMAL) {
            var currentSelectCard = getCurrentMyCardSelect();
            if (currentSelectCard!= null){
                logMessage("doi cho 2 card "+currentSelectCard.id+" va "+ca.id);
                logListCard(onHand);
                resetCardStatusOnhandMB(onHand);

                var id2 = getIndexOfCardOnhanhWithid(currentSelectCard.id,onHand);
                onHand[id1] = currentSelectCard;
                onHand[id2] = ca;
                logMessage("list card sau khi doi cho:id1 "+id1+" id2: "+id2);
                logListCard(onHand);
                setZOrder(onHand);

                var xpos2 = layerGui.getPosMBcardWithData(id2,ROW_OFFSET,CARD_OFFSET).x;
                var yPos2 = layerGui.getPosMBcardWithData(id2,ROW_OFFSET,CARD_OFFSET).y;
                ca.move(0.1,xpos2,yPos2);
                currentSelectCard.setCallBackMoveFinish(function(card){
                    card.setCallBackMoveFinish(null);
                    layerGui.processAfterSwapCard();
                });
                currentSelectCard.move(0.1,xpos1,yPos1);
                myCS.setMauBinhCard(onHand);
            }
            else {
                ca.cardStatus = ca.CARD_STATUS_ONHAND_UP;
                ca.y = yPos1 +15;
                ca.showTakenMask();
            }
        } else {
            ca.cardStatus = ca.CARD_STATUS_ONHAND_NORMAL;
            ca.y = yPos1;
            ca.unShowTakenMask();
        }
    },
    processAfterSwapCard:function(isReshowOnhand){
        if ((isReshowOnhand == undefined) || (isReshowOnhand == null)){
            isReshowOnhand = true;
        }
        var myCS = this.getLogic().getMyClientState();
        setZOrder(myCS.getOnHandCard());
        if (isReshowOnhand){
            this.showMyOnhand(false,false);
        }

        this.showCardTextType(myCS,CARD_TEXT_TYPE_X,CARD_TEXT_TYPE_Y);
        if(!myCS.getMauBinhCard().isNotBinhLung()) {
            myCS.getMauBinhCard().removeMaskCard();
        } else {
            myCS.getMauBinhCard().showMaskCard();
        }
    },
    getPosMBCardForDealcard:function(count,st){
        var deltaY = 30;
        var deltaX = 24;
        return this.getPosMBcardWithData(count,deltaY,deltaX,st);
    },
    getStartPointMBCardForDealCard:function(playerAvatari,displayPos){

        var st;
        var deltaY = 30;
        if(displayPos == 0) {
            st = this.getStartPointForOnhand(this.getLogic().getMyClientState());
        }
        if(displayPos == 1) {
            st =  new cc.Point(playerAvatari.x - 170,playerAvatari.y + deltaY);
        }
        if(displayPos == 2) {
            st = new cc.Point(playerAvatari.x + 75,playerAvatari.y + deltaY);
        }
        if(displayPos == 3) {
            st = new cc.Point(playerAvatari.x + 75,playerAvatari.y + deltaY);
        }
        return st;
    },
    onDealCardReturn:function()
    {
        this.isAutoSend = false;
        var startPoint0 = null;
        var startPoint1 = null;
        var startPoint2 = null;
        var startPoint3 = null;
        var player1 = null;
        var player2 = null;
        var player3 = null;
        var count = -1;
        var numOfCard = 13;
        this.getLogic().isDealingCard = true;
        var Interval = 1.5;
        var centerPoint = new cc.Point(cc.director.getWinSize().width/2,cc.director.getWinSize().height/2);
        var logic = this.getLogic();
        var myOnhandCard = [];

        //var deltaY = 20;
        //var deltaX = 20;

        // tinh location
        for(var i = 0;  i <= logic.maxPlayer ; i++) // server pos
        {
            var playeri = logic.getPlayer(i);
            if(playeri != null)
            {
                this.resetToDefaultValue(playeri);
                playeri.isPlaying = true;
                var playerAvatari =  this.getAvatarByServerPos(i); // xem server pos nào có người ngồi
                var displayPos = logic.getPlayerDisplayLocation(i); // xem đang ngồi chỗ nào
                if(displayPos == 0) {
                    startPoint0 =  this.getStartPointMBCardForDealCard(playerAvatari,displayPos);//new cc.Point(playerAvatari.x + 100 ,playerAvatari.y + 80 );
                    myOnhandCard  = playeri.getOnHandCard();
                }
                if(displayPos == 1) {
                    startPoint1 =  this.getStartPointMBCardForDealCard(playerAvatari,displayPos);//new cc.Point(playerAvatari.x - 140,playerAvatari.y);
                    player1 = playeri;
                }
                if(displayPos == 2) {
                    startPoint2 = this.getStartPointMBCardForDealCard(playerAvatari,displayPos);//new cc.Point(playerAvatari.x + 65,playerAvatari.y + 15);
                    player2 = playeri;
                }
                if(displayPos == 3) {
                    startPoint3 = this.getStartPointMBCardForDealCard(playerAvatari,displayPos);//new cc.Point(playerAvatari.x + 60,playerAvatari.y);
                    player3 = playeri;
                }
            }
        }
        var rowcount = -1;
        this.schedule(function onDealCard()
        {
            count++;
            var card;
            if(startPoint0 != null) // me
            {
                if (count < myOnhandCard.length)
                {
                    card = myOnhandCard[count];
                    this.addChild(card);
                    card.setMoveHandle(this);
                    card.x = centerPoint.x ;
                    card.y = centerPoint.y;
                    rowcount++;
                    if( count >= 3 && count <= 7)
                    {
                        if(count == 3)
                        {
                            startPoint0.y  = startPoint0.y - ROW_OFFSET;
                        }
                        rowcount = count - 3;
                    }
                    if(count > 7)
                    {
                        if(count == 8)
                        {
                            startPoint0.y = startPoint0.y - ROW_OFFSET;
                        }
                        rowcount = count - 8;

                    }
                    card.move(Interval/numOfCard, startPoint0.x + rowcount*CARD_OFFSET*0.8,startPoint0.y);
                    card.visible = true;
                }
            }
            playDealCardSound();

            if(startPoint1 != null)
            {
                card = new BkCard(14,1);
                card.showBackMask(true);
                this.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                var enpoint1 = this.getPosMBCardForDealcard(count,startPoint1);
                card.moveAndScale(Interval/numOfCard,enpoint1.x,enpoint1.y,"",false,SCALE_FAKE_CARD);
                player1.getOnHandCard().push(card);
            }
            if(startPoint2 != null)
            {
                card = new BkCard(14,1);
                card.showBackMask(true);
                this.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                var enpoint2 = this.getPosMBCardForDealcard(count,startPoint2);
                card.moveAndScale(Interval/numOfCard,enpoint2.x,enpoint2.y,"",false,SCALE_FAKE_CARD);
                player2.getOnHandCard().push(card);
            }
            if(startPoint3 != null){
                card = new BkCard(14,1);
                card.showBackMask(true);
                this.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                var enpoint3 = this.getPosMBCardForDealcard(count,startPoint3);//this.getPosMBcardWithData(count,deltaY,deltaX,startPoint3);
                card.moveAndScale(Interval/numOfCard,enpoint3.x,enpoint3.y,"",false,SCALE_FAKE_CARD);
                player3.getOnHandCard().push(card);
            }
            if(count == (numOfCard-1))
            {
                var self = this;
                this.unschedule(onDealCard);
                this.schedule(function onDealCardfinished()
                {
                    self.unschedule(onDealCardfinished);
                    logic.isDealingCard = false;
                    setZOrder(myOnhandCard);
                    self.showCountDownWithBG(60);
                    self.showGameCustomButtons();
                    this.showMyOnhand(false);
                    logic.initDragDrop(myOnhandCard);
                    this.processAfterSwapCard(false);
                    self.animateArrangeCard();
                    logic.processNextEventInQueue();
                },1);
                playDealCardSound();
            }
        },Interval/numOfCard);
    },
    animateArrangeCard:function()
    {
      for(var i = 0; i < this.getLogic().PlayerState.length; i++)
      {
          var playeri = this.getLogic().PlayerState[i];
          if(playeri != null && playeri.isPlaying && playeri != this.getLogic().getMyClientState())
          {
              playeri.showArrangeCardAnimation(this,playeri.serverPosition,false);
          }
      }
    },
    clearCurrentGameGui:function()
    {
        logMessage("clearCurrentGameGui Mau binh");
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            if(playeri != null)
            {
                playeri.removeArrangeCardAnimation();
                playeri.removeHighLightBG();
                playeri.removeMaubinhAutoWinImg();
                if(playeri.getMauBinhCard() != null)
                {
                    playeri.getMauBinhCard().removeCardTextType();
                }
            }
        }
        this._super();
    },
    showGameCustomButtons:function()
    {
        if(!this.getLogic().isInGameProgress())
        {
            return;
        }
        this.btnXepXong.visible = this.getLogic().getMyClientState().isPlaying;
        this.btnXepXong.setEnableEventButton(true);
        if(this.getLogic().getMyClientState().hasDiscard) {
            this.btnXepXong.loadTextures(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
                res_name.btn_big_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnXepXong.setTitleText("Xếp lại");
        } else {
            this.btnXepXong.loadTextures(res_name.btnXethet, res_name.btnXethet_press
                , res_name.btnXethet,res_name.btnXethet_hover,ccui.Widget.PLIST_TEXTURE);
            this.btnXepXong.setTitleText("Xếp xong");
        }
    },
    onAutoSendDiscard:function()
    {
        logMessage("Autosend command");
        var me = this.getLogic().getMyClientState();
        if(me == null)
        {
            return;
        }
        if(!me.hasDiscard)
        {
            this.isAutoSend = true;
            this.getLogic().discardCommand();
        }
    },
    hideAllOngameCustomButton:function()
    {
        this.btnXepXong.visible = false;
        this.btnXepXong.setEnableEventButton(false);
    },
    getCustomGameButtonList:function()
    {
        var rtnlist = [];
        rtnlist.push(this.btnXepXong);
        return rtnlist;
    }
    //,
    //showStartGameButton:function(reShowCountDown){
    //    //this.hideStartGameButton();
    //    //if(this.getLogic().isProcessingFinishGame)
    //    //{
    //    //    return;
    //    //}
    //    this._super(reShowCountDown);
    //}
});