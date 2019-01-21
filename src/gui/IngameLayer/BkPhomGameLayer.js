/**
 * Created by bs on 10/12/2015.
 */
var PHOM_CARD_SCALE_INGAME = 0.75;
var PHOM_CARD_SCALE_INGAME_CURRENT_CARD = 0.85;
var PHOM_DURATION_ANIMATION = 0.2;

var PHOM_TAG_FINISHMOVE_DRAG_DROP = 1001;
var PHOM_DELTAY_CENTER = 28;

BkPhomGameLayer = BkBaseIngameLayer.extend({
    btnAn:null,
    btnDanh:null,
    btnBoc:null,
    btnU:null,
    btnHa:null,
    btnGui:null,
    NocCard:null,
    NocText:null,
    ctor:function(){
        this._super();
        this.initMenuCustomButton();
    },
    initMenuCustomButton:function(){
        var self = this;
        var delta = -110;
        this.btnDanh = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Đánh");
        this.btnDanh.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnDanh.x = 600 - 80;
        this.btnDanh.y = 38;
        this.addChild(this.btnDanh);
        this.btnDanh.addClickEventListener(function(){
            // truongbs++ don't send duplicate packet in 1 sec
            if (BkTime.GetCurrentTime() - self.btnDanh.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnDanh.lastTimeClick = BkTime.GetCurrentTime();
            self.onDiscardCardClick();
        });

        //this.btnAn = new BkButtonWithHint(res_name.btn_big_normal, res_name.btn_big_normal, res_name.btn_big_normal,
        //    res_name.btn_big_hover,ccui.Widget.PLIST_TEXTURE);

        this.btnAn = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press, res_name.btnXethet,
            res_name.btnXethet_hover,"Ăn");
        Util.setBkButtonShadow(this.btnAn);
        this.btnAn.setTitleText("Ăn");
        this.btnAn.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnAn.x = this.btnDanh.x + delta;
        this.btnAn.y = this.btnDanh.y;
        this.addChild(this.btnAn,100);
        this.btnAn.addClickEventListener(function()
        {
            // truongbs++ don't send duplicate packet in 1 sec
            if(BkTime.GetCurrentTime() - self.btnAn.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnAn.lastTimeClick = BkTime.GetCurrentTime();
            self.onAnClick();
        });

        this.btnBoc = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Bốc");
        this.btnBoc.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnBoc.x =  this.btnDanh.x;
        this.btnBoc.y = this.btnDanh.y;
        this.addChild(this.btnBoc);
        this.btnBoc.addClickEventListener(function(){
            // truongbs++ don't send duplicate packet in 1 sec
            if (BkTime.GetCurrentTime() - self.btnBoc.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnBoc.lastTimeClick = BkTime.GetCurrentTime();
            self.onBocClick();
        });
        //this.btnU = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_normal, res_name.btn_big_normal,
        //    res_name.btn_big_hover,"Ù");

        this.btnU = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press, res_name.btnXethet,
            res_name.btnXethet_hover," Ù ");
        Util.setBkButtonShadow(this.btnU);
        this.btnU.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnU.x = this.btnBoc.x + delta;
        this.btnU.y = this.btnDanh.y;
        this.addChild(this.btnU);
        this.btnU.addClickEventListener(function(){
            // truongbs++ don't send duplicate packet in 1 sec
            if (BkTime.GetCurrentTime() - self.btnU.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnU.lastTimeClick = BkTime.GetCurrentTime();
            self.onUClick();
        });

        this.btnHa = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Hạ Phỏm");
        this.btnHa.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnHa.x = this.btnDanh.x;
        this.btnHa.y = this.btnDanh.y;
        this.addChild(this.btnHa);
        this.btnHa.addClickEventListener(function(){
            // truongbs++ don't send duplicate packet in 1 sec
            if (BkTime.GetCurrentTime() - self.btnHa.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnHa.lastTimeClick = BkTime.GetCurrentTime();
            self.onHaClick();
        });

        this.btnGui = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Tự động gửi");
        this.btnGui.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnGui.x = this.btnDanh.x + delta;
        this.btnGui.y = this.btnDanh.y;
        this.addChild(this.btnGui);
        this.btnGui.addClickEventListener(function(){
            // truongbs++ don't send duplicate packet in 1 sec
            if (BkTime.GetCurrentTime() - self.btnHa.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnHa.lastTimeClick = BkTime.GetCurrentTime();
            self.onGuiClick();
        });

        this.hideAllOngameCustomButton();
        this.initNoc();

        this.btnStartGame.y = 328;
        this.btnReady.y = 328;
    },
    displayPlayerAvatar:function()
    {
        this._super();
        var myAvar = this.PlayerAvatar[0];
        var myLocation = this._getLocationPos(0);
        myAvar.x = myLocation.x + BkConstantIngame.PHOM_AVAR_MOVE_LEFT;
    },
    initNoc:function(){
        if (this.NocCard == null){
            this.NocCard = new BkSprite("#"+res_name.verticalBack);
            this.NocCard.x = cc.winSize.width/2;
            this.NocCard.y = cc.winSize.height/2 + PHOM_DELTAY_CENTER;
            this.addChild(this.NocCard);
        }
        if (this.NocText == null){
            this.NocText = new BkLabel("","",25,true);
            this.NocText.x = this.NocCard.x;//cc.winSize.width/2;
            this.NocText.y = this.NocCard.y;//cc.winSize.height/2;
            this.addChild(this.NocText);
        }
        this.hideNoc();
    },
    onPrepareNewGame:function(){
        this._super();
        this.hideNoc();
        this.hideAllOngameCustomButton();
    },
    hideNoc:function(){
        this.NocText.visible = false;
        this.NocCard.visible = false;
    },
    showNoc:function(){
        this.hideNoc();
        if (!this.getLogic().isInGameProgress()){
            return;
        }
        var nocCount = this.getLogic().getNocCount();
        if (nocCount == 0){
            return;
        }
        this.NocText.y = this.NocCard.y  + 2;
        if (nocCount>9){
            this.NocText.x = this.NocCard.x - 2;
        } else {
            this.NocText.x = this.NocCard.x;
        }
        this.NocText.setString(""+nocCount);
        this.NocText.visible = true;
        this.NocCard.visible = true;
    },
    reorderChild1:function(target,zOrd){
        if (target.getLocalZOrder() != zOrd){
            target.setLocalZOrder(zOrd);
        }
    },
    clearCurrentGameGui:function(){
        this._super();
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            playeri.removeDisCardList();
            playeri.removePhomList();
            playeri.removeTakenList();
            playeri.removeListBtnGui();
            this.clearImgCardCount(playeri);
        }
        this.hideAllOngameCustomButton();
    },
    getIndexOfCardOnhanhWith:function(xPos){
        xPos = Math.round(xPos);
        var startX = this.getStartXOnhand();//this.getAvatarByServerPos(this.getLogic().getMyClientState().serverPosition).x + 115;
        var deltaX = 35;
        if (xPos < startX){
            return 0;
        }
        var onHandLeng = this.getLogic().getMyClientState().getOnHandCard().length;
        if (xPos> (startX + (onHandLeng - 1)*deltaX)){
            return onHandLeng - 1;
        }
        var index = 0;
        var sx = startX;
        logMessage("begin: xPos: "+xPos+" sx: "+sx+" index: "+index);
        while(xPos > sx){
            index ++;
            sx += deltaX;
            logMessage("xPos: "+xPos+" sx: "+sx+" index: "+index);
        }
        return index;
    },
    getIndexOfCardOnhanhWithid:function(id){
        var onHand = this.getLogic().getMyClientState().getOnHandCard();
        for (var i =0;i<onHand.length;i++){
            if (onHand[i].id == id){
                return i;
            }
        }
        return 0;
    },
    getStartXOnhand:function(){
        return this.getAvatarByServerPos(this.getLogic().getMyClientState().serverPosition).x + BkConstantIngame.DEFAULT_CARD_MARGIN_AVAR;
    },
    getPosCardOnHandWithIndex:function(mIndex,isSelect){
        var startX = this.getStartXOnhand();
        var deltaX = 35;
        var yPos = YPOS_ONHAND_DOWN;
        if (isSelect!= undefined){
            if (isSelect){
                yPos = YPOS_ONHAND_UP;
            }
        }

        return cc.p(startX + mIndex*deltaX,yPos);
    },
    initDragDropForCard:function(card){
        var self = this;
        var cbMove = function(target,isMoving){
            if (isMoving){
                self.reorderChild1(target,self.getLogic().getMyClientState().getMaxZoderOnhand());
            }
        };
        var cbBegan = function(target){
        };
        var cbEnd = function(target,xPos,yPos){
            var newTagerZorder = self.getIndexOfCardOnhanhWith(xPos)-1;
            if (newTagerZorder<0){
                newTagerZorder = 0;
            }
            self.reorderChild1(target,newTagerZorder);
            var iid = self.getIndexOfCardOnhanhWith(xPos);
            var mPos = self.getPosCardOnHandWithIndex(iid,target.isSelected());
            logMessage("mPos "+mPos.x+" - "+mPos.y + " curxy: "+target.x+" - "+target.y);
            target.move(PHOM_DURATION_ANIMATION,mPos.x,mPos.y,PHOM_TAG_FINISHMOVE_DRAG_DROP);
        };
        card.setIsQueueAnimation(true);
        card.initDragDropEventListener(cbBegan,cbEnd,cbMove);
    },
    onGuiClick:function(){
        this.getLogic().autoSend();
    },
    onHaClick:function(){
        this.getLogic().onShowPhomClick();
    },
    onUClick:function(){
        this.getLogic().onUClick();
    },
    onAnClick:function(){
        this.getLogic().onTakeCardClick();
    },
    onBocClick:function(){
        this.getLogic().onPickCardClick();
    },
    onDiscardCardClick:function(){
        this.getLogic().onDiscardCardClick();
    },
    onDealCardReturn:function(){
        logMessage("onDealCardReturn Phom");
        var self = this;
        var fcb = function(playeri){
            self.showOnHandCardListDealCard(playeri);
        };
        var finishDealingCB = function()
        {
            // init handle move handle with my onhandcard
            logMessage("finishDealingCB phom");
            self.getLogic().getMyClientState().sortOnhandCardAfterPickOrTake();
            var myOnhandCard = self.getLogic().getMyClientState().getOnHandCard();
            for (var i=0;i<myOnhandCard.length;i++){
                var card = myOnhandCard[i];
                card.removeCardBackMask();
                card.showMask(false);
                card.setMoveHandle(self);
                self.initDragDropForCard(card);
            }
            if(self.getLogic().isInGameProgress())
            {
                self.ShowCicleCountDownTimeOnActivePlayer();
            }
            self.clearAllImgCardCount(false);
            self.showOngameCustomButton();
            self.getLogic().processNextEventInQueue();
            self.showNoc();
        };
        Util.animateDealCard(this.getLogic(),this,10,finishDealingCB,fcb);
    },
    clearAllImgCardCount:function(isRemoveAll)
    {
        var isRemove = true;
        if (isRemoveAll!= undefined){
            isRemove = isRemoveAll;
        }

        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            this.clearImgCardCount(playeri,isRemove);
        }
    },
    clearImgCardCount:function(playeri,isRemoveAll)
    {
        var isRemove = true;
        if (isRemoveAll!= undefined){
            isRemove = isRemoveAll;
        }
        var displayPos = this.getLogic().getPlayerDisplayLocation(playeri.serverPosition);
        switch(displayPos) {
            case 0: // me
                break;

            case 1:{
                if (isRemove){
                    if(this.imgPlayer1CardCount != null) {
                        this.imgPlayer1CardCount.removeFromParent();
                        this.imgPlayer1CardCount = null;
                    }
                }
                if(this.lblPlayer1CardCount != null) {
                    this.lblPlayer1CardCount.removeFromParent();
                    this.lblPlayer1CardCount = null;
                }
                break;
            }

            case 2:{
                if (isRemove) {
                    if (this.imgPlayer2CardCount != null) {
                        this.imgPlayer2CardCount.removeFromParent();
                        this.imgPlayer2CardCount = null;
                    }
                }
                if(this.lblPlayer2CardCount != null) {
                    this.lblPlayer2CardCount.removeFromParent();
                    this.lblPlayer2CardCount = null;
                }
                break;
            }

            case 3:{
                if (isRemove) {
                    if (this.imgPlayer3CardCount != null) {
                        this.imgPlayer3CardCount.removeFromParent();
                        this.imgPlayer3CardCount = null;
                    }
                }
                if(this.lblPlayer3CardCount != null) {
                    this.lblPlayer3CardCount.removeFromParent();
                    this.lblPlayer3CardCount = null;
                }
                break;
            }

            default :{
                logMessage("can not get player display postion");
            }
        }
    },
    initCardOnHandOfOtherPlayer:function(playeri,cardCount){
        if(playeri == null) {
            return;
        }

        var playerAvatarPosi =  this.getAvatarByServerPos(playeri.serverPosition);
        if(playerAvatarPosi == null) {
            return;
        }

        var startPoint = new cc.Point(playerAvatarPosi.x,playerAvatarPosi.y);
        var displayPos = this.getLogic().getPlayerDisplayLocation(playeri.serverPosition);

        if(displayPos == 1) {
            if(this.imgPlayer1CardCount == null) {
                this.imgPlayer1CardCount = new BkSprite("#"+res_name.verticalBack);
                this.imgPlayer1CardCount.x = startPoint.x - 75;
                this.imgPlayer1CardCount.y = startPoint.y;
                this.addChild(this.imgPlayer1CardCount);
            }
            if(this.lblPlayer1CardCount == null) {
                this.lblPlayer1CardCount = new BkLabel("","Tahoma",20);
                this.lblPlayer1CardCount.x = this.imgPlayer1CardCount.x;
                this.lblPlayer1CardCount.y = this.imgPlayer1CardCount.y;
                this.lblPlayer1CardCount.setTextColor(cc.color(255,255,255));
                this.addChild(this.lblPlayer1CardCount);
            }
            if (cardCount!= undefined){
                this.lblPlayer1CardCount.setString(cardCount);
            }

        }
        if(displayPos == 2) {
            if(this.imgPlayer2CardCount == null) {
                this.imgPlayer2CardCount = new BkSprite("#"+res_name.verticalBack);
                this.imgPlayer2CardCount.x = startPoint.x - 78;
                this.imgPlayer2CardCount.y = startPoint.y ;
                this.addChild(this.imgPlayer2CardCount);
            }
            if(this.lblPlayer2CardCount == null) {
                this.lblPlayer2CardCount = new BkLabel("","Tahoma",20);
                this.lblPlayer2CardCount.x = this.imgPlayer2CardCount.x;
                this.lblPlayer2CardCount.y = this.imgPlayer2CardCount.y ;
                this.lblPlayer2CardCount.setTextColor(cc.color(255,255,255));
                this.addChild(this.lblPlayer2CardCount);
            }
            if (cardCount!= undefined) {
                this.lblPlayer2CardCount.setString(cardCount);
            }
        }
        if(displayPos == 3) {
            if(this.imgPlayer3CardCount == null) {
                this.imgPlayer3CardCount = new BkSprite("#"+res_name.verticalBack);
                this.imgPlayer3CardCount.x = startPoint.x + 75;
                this.imgPlayer3CardCount.y = startPoint.y;
                this.addChild(this.imgPlayer3CardCount);
            }
            if(this.lblPlayer3CardCount == null) {
                this.lblPlayer3CardCount = new BkLabel("","Tahoma",20);
                this.lblPlayer3CardCount.x = this.imgPlayer3CardCount.x;
                this.lblPlayer3CardCount.y = this.imgPlayer3CardCount.y;
                this.lblPlayer3CardCount.setTextColor(cc.color(255,255,255));
                this.addChild(this.lblPlayer3CardCount);
            }
            if (cardCount!= undefined) {
                this.lblPlayer3CardCount.setString(cardCount);
            }
        }
    },
    showOnHandCardListDealCard:function(playeri)
    {
        if(playeri == null) {
            return;
        }

        var playerAvatarPosi =  this.getAvatarByServerPos(playeri.serverPosition);
        if(playerAvatarPosi != null) {
            this.getLogic().cancelCardClickEvent();
            var startPoint = new cc.Point(playerAvatarPosi.x,playerAvatarPosi.y);
            var displayPos = this.getLogic().getPlayerDisplayLocation(playeri.serverPosition);
            var startX = startPoint.x;
            //var startY = startPoint.y;
            var startY = YPOS_ONHAND_DOWN;
            var onHandCard = this.getLogic().getOnHandCard(playeri);
            var card;
            if(displayPos == 0 && !this.getLogic().isDealingCard) {
                startX = this.getStartXOnhand();//startX + 115;
                for(var i = 0; i < onHandCard.length; i++) {
                    card = onHandCard[i];
                    card.setMoveHandle(null);
                    card.stopMoveAction();
                    card.setMoveHandle(this);
                    card.cardStatus = 0;
                    card.showMask(false);
                    card.x = startX + i* 35;
                    card.y = startY;
                }
                return;
            }
            if(playeri.getCardsCount() == 0) {
                return;
            }
            var cardCount = playeri.getCardsCount();
            if (cardCount >9){
                cardCount = 9;
            }
            this.initCardOnHandOfOtherPlayer(playeri,cardCount);
        }
    },
    onFinishAnimationProcess:function(o) {

    },
    showOngameCustomButton:function(gs){
        if (gs == undefined){
            gs = this.getLogic().gameStatus;
        }
        logMessage("showOngameCustomButton "+gs);
        this.hideAllOngameCustomButton();
        if (!this.getLogic().isMyTurn()){
            logMessage("!my turn");
            return;
        }

        if(!this.getLogic().isInGameProgress())
        {
            logMessage("! isInGameProgress");
            return;
        }
        switch (gs){
            case GAME_STATE_PHOM_WAIT_TAKE_OR_PICK_CARD:
                if (this.getLogic().ableToTakeCard()){
                    this.enableOngameButton(this.btnAn);
                }
                this.enableOngameButton(this.btnBoc);
                break;
            case GAME_STATE_PHOM_WAIT_DISCARD:
                logMessage("GAME_STATE_PHOM_WAIT_DISCARD");
                if (this.getLogic().getMyClientState().canU()){
                    logMessage("canU");
                    this.enableOngameButton(this.btnU);
                } else if (this.getLogic().hasSendedCard){
                    this.enableOngameButton(this.btnGui);
                }
                logMessage("hasSendedCard "+this.getLogic().hasSendedCard);
                this.enableOngameButton(this.btnDanh);
                break;
            case GAME_STATE_WAIT_SHOW_PHOM:
                logMessage("GAME_STATE_WAIT_SHOW_PHOM");
                if (this.getLogic().getMyClientState().checkCurrentOnhandListHasPhom()){
                    this.enableOngameButton(this.btnHa);
                } else {
                    this.enableOngameButton(this.btnDanh);
                }
                if (this.getLogic().hasSendedCard){
                    this.enableOngameButton(this.btnGui);
                }
                break;
        }
    },
    disableOngameButton:function(btn){
        btn.setVisibleButton(false);
    },
    enableOngameButton:function(btn){
        btn.setVisibleButton(true);
    },
    hideAllOngameCustomButton:function(){
        this.disableOngameButton(this.btnDanh);
        this.disableOngameButton(this.btnAn);
        this.disableOngameButton(this.btnBoc);
        this.disableOngameButton(this.btnU);
        this.disableOngameButton(this.btnHa);
        this.disableOngameButton(this.btnGui);
    },
    onTableSynReturn:function(){
        logMessage("onTableSynReturn Phom -> show current state table");
        var maxPlayer = this.getLogic().maxPlayer;
        for (var i=0;i<maxPlayer;i++){
            var iplayer = this.getLogic().getPlayer(i);
            if ((iplayer != null) && (iplayer.isPlaying)){
                var displayPos = this.getLogic().getPlayerDisplayLocation(iplayer.serverPosition);
                var takenList = iplayer.getTakenList();
                this.showListTaken(displayPos,takenList);
                var discardList = iplayer.getDiscardList();
                this.showListDiscard(displayPos,discardList);

                this.initCardOnHandOfOtherPlayer(iplayer);

                var phomList = iplayer.getPhomList();
                if (phomList!= null){
                    if (phomList.length >0){
                        this.showPhomOfPlayer(phomList,iplayer,true);
                    }
                }

                if (displayPos == 0){
                    // la minh -> set status cho cac cay cac tren tay neu la card an va xep lai bai
                    this.getLogic().getMyClientState().sortOnhandCardAfterPickOrTake();
                    var onHand = iplayer.getOnHandCard();
                    for (var k=0;k<takenList.length;k++) {
                        var kCard = takenList[k];
                        for (var j = 0; j < onHand.length; j++) {
                            var jCard = onHand[j];
                            if (jCard.encode() == kCard.encode()){
                                jCard.setCardStatus(CARD_STATUS_TAKEN,true);
                            }
                        }
                    }

                    var pos;
                    for (j = 0; j < onHand.length; j++) {
                        jCard = onHand[j];
                        this.reorderChild1(jCard,j);
                        pos = this.getPosCardOnHandWithIndex(j,false);
                        jCard.x = pos.x;
                        jCard.y = pos.y;
                        jCard.showMask(false);
                        jCard.setMoveHandle(this);
                        this.initDragDropForCard(jCard);
                    }
                }
            }
        }

        this.clearAllImgCardCount(false);
        this.ShowCicleCountDownTimeOnActivePlayer();
        this.showOngameCustomButton();
        this.showNoc();
    },
    prepareToShowPhoms:function(){
        logMessage("prepareToShowPhoms");
        var me = this.getLogic().getMyClientState();
        var onhand = me.getOnHandCard();

        if (!me.havePhoms()){
            logMessage("khong co phom show -> gui comand mom");
            deSelectCards(onhand);
            this.getLogic().sendShowPhomPacket();
        } else{
            logMessage("co phom-> suggest phom ha");
            var isHasPhom = false;
            logMessage("stopAllAnimationOnhand");
            me.stopAllAnimationOnhand();
            for (var i=0;i<onhand.length;i++){
                var iCard = onhand[i];
                if (iCard.phomIndex != 0){
                    iCard.selectCard();
                    isHasPhom = true;
                } else {
                    iCard.deSelect();
                }
            }

            if (this.getLogic().getMyClientState().getPhomList().length >0){
                logMessage("minh duoc tai -> suggest gui");
                if (!isHasPhom){
                    logMessage("minh k co them phom de ha -> gui goi tin k co phom");
                    deSelectCards(onhand);
                    this.getLogic().sendShowPhomPacket();

                    logMessage("kiem tra xem co gui them duoc k");
                    this.getLogic().hasSendedCard =this.getLogic().recommendSendedCard();
                    logMessage("hasSendedCard "+this.getLogic().hasSendedCard);
                    this.showOngameCustomButton();
                }
            }
        }
    },
    showListTaken:function(displayPos,takenList){
        logMessage("showListTaken");
        if (takenList == null){
            return;
        }
        if (displayPos == 0){
            logMessage("la minh -> not showListTaken");
            return;
        }
        for (var i = 0;i<takenList.length;i++){
            var cardPos = getTakenLocationPhomGame(displayPos,this.getLogic().maxPlayer,i);
            var card = takenList[i];
            card.setCardStatus(CARD_STATUS_TAKEN);
            this.addChild(card);
            card.x = cardPos.x;
            card.y = cardPos.y;
        }
    },
    showListDiscard:function(displayPos,discardList){
        logMessage("showListDiscard");
        if (discardList == null){
            return;
        }
        for (var i = 0;i<discardList.length;i++){
            var cardPos = getDiscardLocationPhomGame(displayPos,i);
            var card = discardList[i];
            var currentCardID = -1;
            if (this.currentDiscard != null){
                currentCardID = this.currentDiscard.encode();
            }
            if (card.encode() != currentCardID){
                logMessage("card.setScale(PHOM_CARD_SCALE_INGAME");
                card.setScale(PHOM_CARD_SCALE_INGAME);
            } else {
                var isMe = (displayPos == 0);
                card.setCardStatus(CARD_STATUS_CURRENT,isMe);
            }
            this.addChild(card,BkConstantIngame.PHOM_DISCARD_MIN_ZORDER + i);
            card.x = cardPos.x;
            card.y = cardPos.y;
        }

        if (discardList.length == 4){
            logMessage("player nay da ha -> show mask discard List");
            for (var k=0;k<discardList.length;k++){
                //discardList[k].showMask(true);
                discardList[k].showBlackMask();
            }
        }
    },
    removeAllListButtonGui:function(){
        for (var j =0;j<this.getLogic().maxPlayer;j++){
            var jPlayer = this.getLogic().getPlayer(j);
            if ((jPlayer != null) && (jPlayer.isPlaying)) {
                jPlayer.removeListBtnGui();
            }
        }
    },
    onDiscard:function(card,isU){
        if (isU == undefined){
            isU = false;
        }
        logMessage("onDiscard - isU :"+isU + " gameStatus: "+this.getLogic().gameStatus);
        if ((!this.getLogic().isInGameProgress()) && (!isU)){
            return;
        }
        playDealCardSound();
        this.getLogic().updateGameStatusAfterDiscard();

        var activePlayer = this.getLogic().getActivePlayer();
        var pAvar = this.getAvatarByServerPos(activePlayer.serverPosition);
        var discardList = activePlayer.getDiscardList();
        var displayPos = this.getLogic().getPlayerDisplayLocation(activePlayer.serverPosition);
        var cardLoc = getDiscardLocationPhomGame(displayPos,discardList.length);
        var maxZindex = BkConstantIngame.PHOM_DISCARD_MIN_ZORDER;
        var self = this;

        for(var i=0;i<discardList.length;i++){
            if (maxZindex < discardList[i].getLocalZOrder()){
                maxZindex = discardList[i].getLocalZOrder();
            }
        }
        if (this.getLogic().isMyTurn()){
            // la minh danh
            var onhandList = activePlayer.getOnHandCard();
            var myDisCard = findCard(card.number,card.type,onhandList);
            myDisCard.showMask(false);
            removeCardIdFromArrCardListOnly(myDisCard.encode(),onhandList);
            addBkCard(myDisCard,discardList);
            this.reorderChild1(myDisCard,maxZindex + 1);
            myDisCard.setScale(PHOM_CARD_SCALE_INGAME);
            myDisCard.setSelectable(false);
            this.getLogic().updateCurrentCard(myDisCard);

            if (!isU){
                this.getLogic().getMyClientState().sortOnhandCardAfterPickOrTake();
                this.configPosOnhandCard();
                this.changeActivePlayer();
                logMessage("remove button gui");
                for (var j =0;j<this.getLogic().maxPlayer;j++){
                    var jPlayer = this.getLogic().getPlayer(j);
                    if ((jPlayer != null) && (jPlayer.isPlaying)) {
                        jPlayer.removeListBtnGui();
                    }
                }
            }

            myDisCard.setCallBackMoveFinish(function(ca){
                ca.setCallBackMoveFinish(null);
                if (!isU){
                    self.getLogic().processNextEventInQueue();
                }
            });
            myDisCard.move(PHOM_DURATION_ANIMATION,cardLoc.x,cardLoc.y);
        } else {
            addBkCard(card,discardList);
            card.setScale(PHOM_CARD_SCALE_INGAME);
            card.setSelectable(false);
            this.addChild(card,maxZindex + 1);
            card.x =pAvar.x;
            card.y =pAvar.y;
            self.getLogic().updateCurrentCard(card);
            self.changeActivePlayer();
            card.setCallBackMoveFinish(function(ca){
                logMessage("fn move discard: -> process Next event");
                ca.setCallBackMoveFinish(null);
                self.getLogic().processNextEventInQueue();
            });
            card.move(PHOM_DURATION_ANIMATION,cardLoc.x,cardLoc.y);
            //this.getLogic().updateCurrentCard(card);
            //this.changeActivePlayer();
            //this.getLogic().processNextEventInQueue();
        }

        // update discardList -> showmask
        if (discardList.length == 4){
            logMessage("player nay da ha -> show mask discard List");
            for (var k=0;k<discardList.length;k++){
                discardList[k].showBlackMask();
            }
        }
    },
    ShowCicleCountDownTimeOnActivePlayer:function(timeShow){
        if (this.getLogic().isAllPlayerFinishGame()){
            logMessage("all player fn game -> not show count down time");
            return;
        }
        this._super(timeShow);
    },
    changeActivePlayer:function(){
        logMessage("changeActivePlayer current active player pos: "+this.getLogic().activePlayerPosition);
        this.getLogic().getNextActivePlayerPosition();
        logMessage("active player pos after changing: "+this.getLogic().activePlayerPosition);
        this.ShowCicleCountDownTimeOnActivePlayer();
        this.showOngameCustomButton();
    },
    findIndexLastCardOnHandDoAnimation:function(exCa){
        var  self = this;
        var me = self.getLogic().getMyClientState();
        var onhandList = me.getOnHandCard();

        if(onhandList.length == 0){

            return -1;
        }
        var storeIndex = -1;
        var delta = 0.1;
        for (var i=0;i<onhandList.length;i++){
            var pos = this.getPosCardOnHandWithIndex(i, onhandList[i].isSelected());
            if ( (Math.abs(onhandList[i].x - pos.x)>delta) || (Math.abs(onhandList[i].y - pos.y) > delta) ) {
                if (exCa.id != onhandList[i].id){
                    storeIndex = i;
                }
            }
        }

        return -1;
    },
    configPosOnhandCard:function(isCallNextEvent,funcCB,isHandleFinish,exceptCard){
        logMessage("configPosOnhandCard");

        if (exceptCard == undefined){
            exceptCard = decode(-1);
        }

        var  self = this;
        self.showOngameCustomButton();
        var me = self.getLogic().getMyClientState();
        var onhandList = me.getOnHandCard();

        if(onhandList.length == 0)
        {
            logMessage("bai tren tay k con cay nao");
            if (isCallNextEvent != undefined) {
                if (isCallNextEvent) {
                    self.getLogic().processNextEventInQueue();
                }
            }
            return;
        }

        var iCard;
        var i;
        var storeIndex = onhandList.length - 1;
        var storeCard = onhandList[storeIndex];

        if (storeCard.id == exceptCard.id){
            if (onhandList.length >= 2){
                storeIndex = onhandList.length - 2;
                storeCard = onhandList[storeIndex];
            }
        }

        var pos;
        var delta = 0.1;
        logListCard(onhandList);

        for (i=0;i<onhandList.length;i++){
            pos = this.getPosCardOnHandWithIndex(i, onhandList[i].isSelected());
            if ( (Math.abs(onhandList[i].x - pos.x)>delta) || (Math.abs(onhandList[i].y - pos.y) > delta) ) {
                if (exceptCard.id != storeCard.id){
                    storeCard = onhandList[i];
                    storeIndex = i;
                }
            }
        }

        for (i=0;i<onhandList.length;i++){
            iCard = onhandList[i];
            self.reorderChild1(iCard,i);
            pos = this.getPosCardOnHandWithIndex(i,iCard.isSelected());
            logMessage("i "+i+" pos:["+pos.x+"-"+pos.y+"]");
            if (iCard.id != storeCard.id){
                if (iCard.id != exceptCard.id){
                    iCard.move(PHOM_DURATION_ANIMATION,pos.x,pos.y);
                }
            }
        }

        var isHandle = true;
        if (isHandleFinish!= undefined){
            isHandle = isHandleFinish;
        }

        logMessage("storeIndex "+storeIndex+" storeCard: "+storeCard.id);
        if (isHandle) {
            storeCard.setCallBackMoveFinish(function (ca) {
                logMessage("last card onhand finish move-> call next process");
                ca.setCallBackMoveFinish(null);
                if (isCallNextEvent != undefined) {
                    if (isCallNextEvent) {
                        self.getLogic().processNextEventInQueue();
                    }
                }

                if (funcCB != undefined) {
                    if (funcCB != null) {
                        funcCB();
                    }
                }
            });
        }

        var storePos = this.getPosCardOnHandWithIndex(storeIndex,storeCard.isSelected());
        storeCard.move(PHOM_DURATION_ANIMATION,storePos.x,storePos.y);
    },
    configPosOnhandNotAnimation:function(){
        var  self = this;
        var me = self.getLogic().getMyClientState();
        var onhandList = me.getOnHandCard();
        var iCard;
        var i;
        var pos;

        if(onhandList.length == 0)
        {
            logMessage("bai tren tay k con cay nao");
            return;
        }
        for (i=0;i<onhandList.length;i++){
            iCard = onhandList[i];
            self.reorderChild1(iCard,i);
            pos = this.getPosCardOnHandWithIndex(i,iCard.isSelected());
            iCard.x = pos.x;
            iCard.y = pos.y;
        }
    },
    processAfterConfigPosOnhand:function(){
        var  self = this;
        var me = self.getLogic().getMyClientState();
        if (me.canU()) {
            logMessage("i can U -> Gui packet U - takenCardsCount: "+me.takenCardsCount);
            if (me.takenCardsCount == 3){
                logMessage("an 3 cay -> tu dong bao u");
                self.getLogic().sendShowUPacket();
                return;
            }

            self.enableOngameButton(this.btnU);
            if (self.getLogic().isNeedShowPhom()){
                var onhand = me.getOnHandCard();
                for (var i=0;i<onhand.length;i++){
                    var iCard = onhand[i];
                    if (iCard.phomIndex != 0){
                        iCard.selectCard();
                    } else {
                        iCard.deSelect();
                    }
                }
            }
        } else if (self.getLogic().isNeedShowPhom()) {
            self.prepareToShowPhoms();
        }
    },
    reShowOnHandCard:function(isCallNextEvent){
        logMessage("reShowOnHandCard");
        var  self = this;
        self.getLogic().getMyClientState().sortOnhandCardAfterPickOrTake();
        self.configPosOnhandCard(isCallNextEvent, self.processAfterConfigPosOnhand());
    },
    doAnimationChuyenPhom:function(){
        logMessage("doAnimationChuyenPhom");
        var curCard = this.getLogic().currentDiscard;
        var prePlayer = curCard.playerHasCard;
        var displayPos = this.getLogic().getPlayerDisplayLocation(prePlayer.serverPosition);
        logMessage("player lost card: "+prePlayer.getName());
        if (this.getLogic().firstFinishPlayer != prePlayer.serverPosition) {
            // lay cay card se chuyen phom
            var firtFinishPlayer = this.getLogic().getPlayer(this.getLogic().firstFinishPlayer);
            var discardListOfFirtFinishPlayer = firtFinishPlayer.getDiscardList();
            var cardMove = discardListOfFirtFinishPlayer[discardListOfFirtFinishPlayer.length -1];
            logListCard(discardListOfFirtFinishPlayer);
            // move card
            var discardList = prePlayer.getDiscardList();
            //var cardLoc = cc.p(curCard.x,curCard.y);
            var cardLoc = getDiscardLocationPhomGame(displayPos,discardList.length - 1);
            logMessage("ng nhan card "+prePlayer.getName()+" cardLoc "+cardLoc.x+" - "+cardLoc.y +" cardMove: "+cardMove.encode());
            var zIndex = discardList[discardList.length -1].getLocalZOrder();
            this.reorderChild1(cardMove,zIndex+1);
            cardMove.move(PHOM_DURATION_ANIMATION,cardLoc.x,cardLoc.y);
            addBkCard(cardMove,discardList);
            removeCardIdFromArrCardListOnly(cardMove.encode(),discardListOfFirtFinishPlayer);
        }
    },
    onTakeCard:function(){
        if (!this.getLogic().isInGameProgress()){
            logMessage("onTakeCard khong trong van choi -> reject packet");
            return;
        }
        logMessage("onTakeCard");

        playBichatSound();

        // chuyen phom
        this.doAnimationChuyenPhom();

        this.getLogic().updateStateAfterTakeCard();
        this.getLogic().updateFirstFinishPlayerAfterTakeCard();
        this.getLogic().updateGameStatusAfterPickOrTakeCard();
        this.getLogic().updatePlayersMoneyAfterTakeCard();

        var curCard = this.getLogic().currentDiscard;

        logMessage("new update currentDiscard -> null from cardID "+curCard.id);
        this.getLogic().currentDiscard = null;

        var activePlayer = this.getLogic().getActivePlayer();
        var takenList = activePlayer.getTakenList();
        var displayPos = this.getLogic().getPlayerDisplayLocation(activePlayer.serverPosition);

        // neu da ha roi ma an them dc -> cay an o dong tiep theo phom ha
        var indexOfTakeCard = takenList.length;
        if (activePlayer.getNumberPhomInPhomList() >0){
            indexOfTakeCard = activePlayer.getNumberPhomInPhomList();
        }

        var cardLoc = getTakenLocationPhomGame(displayPos,this.getLogic().maxPlayer,indexOfTakeCard);
        var prePlayer = curCard.playerHasCard;
        var preDiscardist = prePlayer.getDiscardList();
        removeCardIdFromArrCardListOnly(curCard.encode(),preDiscardist);

        curCard.setCardStatus(CARD_STATUS_TAKEN,this.getLogic().isMyTurn());
        curCard.showMask(false);
        curCard.removeBlackMask();
        if (this.getLogic().isMyTurn()){
            this.processMyOnhandAfterPickOrTakeCard(curCard);
        } else {
            var newZorder = activePlayer.getMaxZoderTakenList();
            logMessage("phomList.leng: "+activePlayer.getPhomList().length+" - newZorder "+newZorder);
            if (activePlayer.getPhomList().length >0){
                logMessage("ng an da co phom -> tinh lai zOder");
                var maxZoderPhomlist = activePlayer.getMaxZoderPhomList();
                logMessage(" maxZoderPhomlist: "+maxZoderPhomlist);
                if (newZorder < maxZoderPhomlist){
                    newZorder = maxZoderPhomlist;
                }
            }
            logMessage(" newZorder: "+newZorder);
            //this.reorderChild1(curCard,activePlayer.getMaxZoderTakenList());
            this.reorderChild1(curCard,newZorder);
            addBkCard(curCard,takenList);
            logMessage("list taken of : "+activePlayer.getName());
            logListCard(takenList);
            var self = this;
            curCard.setCallBackMoveFinish(function(ca){
                logMessage("finish movecard take card");
                ca.setCallBackMoveFinish(null);
                self.getLogic().processNextEventInQueue();
            });
            curCard.move(PHOM_DURATION_ANIMATION,cardLoc.x,cardLoc.y);
        }
    },
    onFinishAnimationMoveCard:function(ca){
        logMessage("onFinishAnimationMoveCard "+ca.id);
        var self = this;
        var myClientState = self.getLogic().getMyClientState();
        if (myClientState == null){
            return;
        }

        if (ca.tag == PHOM_TAG_FINISHMOVE_DRAG_DROP){
            logMessage("PHOM_TAG_FINISHMOVE_DRAG_DROP");
            var iid = self.getIndexOfCardOnhanhWith(ca.x);
            var currentID = self.getIndexOfCardOnhanhWithid(ca.id);
            logMessage("iid: "+iid+" currentID: "+currentID+" id: "+ca.id+" x: "+ca.x);
            var onhand = self.getLogic().getMyClientState().getOnHandCard();
            if (iid != currentID) {
                var min = Math.min(iid,currentID);
                var max = Math.max(iid,currentID);
                logMessage("min "+min+" max "+max);
                var isMoveLeft = true;
                if (currentID > iid){
                    isMoveLeft = false;
                }
                var cloneOnhand = self.getLogic().getMyClientState().getOnHandCard().slice();

                var i;
                if (!isMoveLeft){
                    for (i= min;i<max;i++){
                        cloneOnhand[i+1] = onhand[i];
                    }
                    cloneOnhand[min] = onhand[max];
                } else {
                    for (i= min;i<max;i++){
                        cloneOnhand[i] = onhand[i+1];
                    }
                    cloneOnhand[max] = onhand[min];
                }
                logListCard(onhand);
                logListCard(cloneOnhand);
                self.getLogic().getMyClientState().setOnhandCard(cloneOnhand);
            } else {
                logMessage("iid == currentID");
                logListCard(onhand);
            }
            self.configPosOnhandCard(false,null,false);
            return;
        }

        if ((this.btnGui.visible)||(this.btnHa.visible) || (this.btnU.visible)){
            return;
        } else {
            if (ca.isSelected()){
                deSelectCards(this.getLogic().getMyClientState().getOnHandCard(),ca);
            }
        }
    },
    onPickCard:function(card){
        if (!this.getLogic().isInGameProgress()){
            logMessage("onPickCard khong trong van choi -> reject packet");
            return;
        }
        logMessage("onPickCard");

        playDealCardSound();

        //var self = this;
        // co ng pickcard -> khong con current card
        if (this.getLogic().currentDiscard != null){
            logMessage("currentDiscard.setScale(PHOM_CARD_SCALE_INGAME) -> "+this.getLogic().currentDiscard.id);
            this.getLogic().currentDiscard.setScale(PHOM_CARD_SCALE_INGAME);
        } else {
            logMessage("currentDiscard is null.........");
        }
        logMessage("update currentDiscard -> null");
        this.getLogic().currentDiscard = null;
        var activePlayer = this.getLogic().getActivePlayer();
        //if (activePlayer == null){
        //    return;
        //}
        var pAvar = this.getAvatarByServerPos(activePlayer.serverPosition);
        this.getLogic().updateStateAfterPickCard();
        this.getLogic().updateGameStatusAfterPickOrTakeCard();
        if (card!= null){
            logMessage("la minh add card vao onhand");
            this.processMyOnhandAfterPickOrTakeCard(card,true);
        } else {
            card = new BkCard(14,1);
            logMessage("card.setScale(PHOM_CARD_SCALE_INGAME)");
            card.setScale(PHOM_CARD_SCALE_INGAME);
            card.x = cc.winSize.width/2;
            card.y = cc.winSize.height/2 + PHOM_DELTAY_CENTER;
            this.addChild(card);
            var self = this;
            card.setCallBackMoveFinish(function(ca){
                ca.setCallBackMoveFinish(null);
                card.removeFromParent();
                self.getLogic().processNextEventInQueue();
            });
            card.move(PHOM_DURATION_ANIMATION,pAvar.x,pAvar.y);
        }

        if (this.getLogic().gameStatus == GAME_STATE_WAIT_SHOW_PHOM){
            this.ShowCicleCountDownTimeOnActivePlayer();
            this.showOngameCustomButton();
        }

        this.showNoc();
    },
    processMyOnhandAfterPickOrTakeCard:function(card,isPickcard){
        logMessage("processMyOnhandAfterPickOrTakeCard "+card.id);
        var self = this;
        var activePlayer = this.getLogic().getActivePlayer();
        var onhandList = activePlayer.getOnHandCard();
        card.setSelectable(true);
        card.setMoveHandle(this);
        this.initDragDropForCard(card);
        card.showMask(false);
        card.cardStatus = 0;
        addBkCard(card,onhandList);
        if (isPickcard == undefined){
            isPickcard = false;
        }
        if (isPickcard){
            card.x = cc.winSize.width/2;
            card.y = cc.winSize.height/2 + PHOM_DELTAY_CENTER;
        }

        self.getLogic().getMyClientState().sortOnhandCardAfterPickOrTake();

        var indexInlist = this.getIndexOfCardOnhanhWithid(card.id);
        var startPoint0 = this.getPosCardOnHandWithIndex(indexInlist,false);
        if (isPickcard){
            self.addChild(card,indexInlist);
        }

        var indexLastCard = this.findIndexLastCardOnHandDoAnimation(card);

        if (indexLastCard == -1){
            logMessage("khong co card nao doi toa do tru cay vua them vao");
            self.configPosOnhandCard(false, undefined,false,card);
            card.setCallBackMoveFinish(function(){
                logMessage("card move finish");
                card.setCallBackMoveFinish(null);
                self.processAfterConfigPosOnhand();
                self.getLogic().processNextEventInQueue();
            });
            card.move(PHOM_DURATION_ANIMATION,startPoint0.x,startPoint0.y);
        } else {
            logMessage("bai tren tay co thay doi vi tri");
            card.move(PHOM_DURATION_ANIMATION,startPoint0.x,startPoint0.y);
            self.configPosOnhandCard(true, self.processAfterConfigPosOnhand(),true,card);
        }
    },
    getListSamePhomIndex:function(card,phomList,isAddCard){
        var rtnList = [];
        var index = -1;
        for (var j1=0;j1<phomList.length;j1++) {
            var jTakenCard = phomList[j1];
            if  (jTakenCard.encode() == card.encode()){
                //rtnList.push(jTakenCard);
                index = jTakenCard.phomIndex;
            }
        }

        for (j1=0;j1<phomList.length;j1++) {
            var TakenCard = phomList[j1];
            if (TakenCard.phomIndex == index){
                if (TakenCard.encode() != card.encode()){
                    rtnList.push(TakenCard);
                } else {
                    if (isAddCard != undefined){
                        if (isAddCard){
                            rtnList.push(TakenCard);
                        }
                    }
                }
            }
        }
        return rtnList;
    },
    sortPhomListByPhomIndex:function(list){
        var rtnList = [];
        for (var i=1;i<4;i++){
            for (var j=0;j<list.length;j++){
                if (list[j].phomIndex == i){
                    rtnList.push(list[j]);
                }
            }
        }
        return rtnList;
    },
    showPhomOfOtherPlayer:function(phomList,player,isTableSysn){
        logMessage("showPhomOfOtherPlayer "+player.getName());
        var self = this;
        var pAvar = this.getAvatarByServerPos(player.serverPosition);
        var displayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        var i;
        var j;
        var maxZindex = 0;
        var phomListOfPlayer = [];
        var listIndexSaw = [false,false,false,false];
        // hoan thien phom an
        var takenList = player.getTakenList();
        var cardLoc;
        logMessage("hoan thien phom an "+ takenList.length +" phom");
        logListCard(takenList);
        for (i = 0;i<takenList.length;i++){
            cardLoc = getTakenLocationPhomGame(displayPos,this.getLogic().maxPlayer,i + player.getMaxPhomIndexInPhomList());
            var iTakenCard = takenList[i];
            logMessage("iTakenCard.id "+iTakenCard.id);
            var sameCardInPhomList = findCard(iTakenCard.getNumber(),iTakenCard.getType(),phomList);
            if (sameCardInPhomList == null){
                logMessage("invalid show phom");
                self.getLogic().networkGetTableInfo();
                return;
            }
            iTakenCard.phomIndex = sameCardInPhomList.phomIndex;
            phomListOfPlayer.push(iTakenCard);
            var iPhomCard = this.getListSamePhomIndex(iTakenCard,phomList);
            this.reorderChild1(iTakenCard,iTakenCard.getLocalZOrder() + 10*i);
            logMessage("iTakenCard.id "+iTakenCard.id+" zo: "+iTakenCard.getLocalZOrder());
            if (displayPos == 1){
                //var newX = iTakenCard.x - (iPhomCard.length +1) * BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
                var newX = iTakenCard.x - (iPhomCard.length) * BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
                iTakenCard.move (PHOM_DURATION_ANIMATION,newX,iTakenCard.y);
            }
            for (j=0;j<iPhomCard.length;j++){
                var jCard = iPhomCard[j];
                jCard.setSelectable(false);
                this.addChild(jCard,iTakenCard.getLocalZOrder() + 10 * i +j+1);

                logMessage("jCard.id "+jCard.id+" zo: "+jCard.getLocalZOrder());

                listIndexSaw[jCard.phomIndex] = true;
                jCard.setScale(PHOM_CARD_SCALE_INGAME);
                jCard.x = pAvar.x;
                jCard.y = pAvar.y;
                //var cardPos = cc.p(iTakenCard.x + BkConstantIngame.PHOM_CARD_MARGIN_LEFT * (j+1),iTakenCard.y);
                var cardPos = cc.p(cardLoc.x + BkConstantIngame.PHOM_CARD_MARGIN_LEFT * (j+1),cardLoc.y);
                if (displayPos == 1){
                    cardPos.x -= (iPhomCard.length) * BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
                }
                if (maxZindex < jCard.getLocalZOrder()){
                    maxZindex = jCard.getLocalZOrder();
                }
                phomListOfPlayer.push(jCard);
                if (phomListOfPlayer.length == phomList.length){
                    logMessage("card cuoi cung trong phom -> handle fn and call next Event");
                    jCard.setCallBackMoveFinish(function(ca){
                        ca.setCallBackMoveFinish(null);
                        self.getLogic().processNextEventInQueue();
                    });
                }
                jCard.move (PHOM_DURATION_ANIMATION,cardPos.x,cardPos.y);
            }
        }

        var count = takenList.length;
        removeListDataLogicOnly(takenList);
        // ha phom tu co
        for (i=0;i<phomList.length;i++){
            var itCard = phomList[i];
            if (!listIndexSaw[itCard.phomIndex]){
                iPhomCard = this.getListSamePhomIndex(itCard,phomList,true);
                for (j=0;j<iPhomCard.length;j++){
                    jCard = iPhomCard[j];
                    jCard.setSelectable(false);
                    this.addChild(jCard,maxZindex + 10 * jCard.phomIndex + j +1);
                    listIndexSaw[jCard.phomIndex] = true;
                    jCard.setScale(PHOM_CARD_SCALE_INGAME);
                    jCard.x = pAvar.x;
                    jCard.y = pAvar.y;
                    var countID = count;
                    if (!isTableSysn){
                        if (player.getNumberPhomInPhomList() > 0){
                            //logMessage("da co phom ha san roi -> phom moi phai o duoi phom ha");
                            countID = player.getNumberPhomInPhomList();
                            var newMaxZorder = player.getMaxZoderPhomList();
                            this.reorderChild1(jCard,newMaxZorder + 10 * jCard.phomIndex + 1);
                            logMessage("da co phom ha san roi -> phom moi phai o duoi phom ha countID: "+countID);
                        }
                    }
                    cardPos = getTakenLocationPhomGameWithNumberCardIndex(displayPos,this.getLogic().maxPlayer,countID,j,iPhomCard.length);
                    phomListOfPlayer.push(jCard);
                    if (phomListOfPlayer.length == phomList.length){
                        logMessage("card cuoi cung trong phom -> handle fn and call next Event");
                        jCard.setCallBackMoveFinish(function(ca){
                            ca.setCallBackMoveFinish(null);
                            self.getLogic().processNextEventInQueue();
                        });
                    }
                    jCard.move (PHOM_DURATION_ANIMATION,cardPos.x,cardPos.y);
                }
                count++;
            }
        }

        if (!isTableSysn){
            for (i=0;i< phomListOfPlayer.length;i++){
                player.getPhomList().push(phomListOfPlayer[i]);
            }
        }
        logMessage("list phom card cua player: "+player.getName());
        logListCard(player.getPhomList());
    },
    showMyPhom:function(phomList,isTableSysn){
        logMessage("showMyPhom ");
        var self = this;
        var player = this.getLogic().getMyClientState();
        var phomIndex  = -1;
        var rowPhom = 0;
        var onhand = player.getOnHandCard();
        var myphomList = player.getPhomList();
        var numberPhom = player.getNumberPhomInPhomList();

        //var pAvar = this.getAvatarByServerPos(player.serverPosition);
        var displayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        if (isTableSysn){
            logMessage("isTableSysn -> show my phomlist da ha");
            for (var j=0;j<phomList.length;j++) {
                var jCa = phomList[j];
                if (jCa.phomIndex != phomIndex){
                    rowPhom = 0;
                    phomIndex = jCa.phomIndex;
                } else {
                    rowPhom ++;
                }
                this.addChild(jCa,j);
                //var caPos = getTakenLocationPhomGameWithNumberCardIndex(displayPos,this.getLogic().maxPlayer,
                //    jCa.phomIndex -1,rowPhom+1);

                var caPos = getMyTakenLocationPhomGameWithNumberCardIndex(jCa.phomIndex -1,rowPhom+1,numberPhom);

                if (j == (phomList.length-1)){
                    jCa.setCallBackMoveFinish(function(ca){
                        ca.setCallBackMoveFinish(null);
                        self.reShowOnHandCard(true);
                        //self.disableOngameButton(self.btnHa);
                    });
                }
                jCa.setSelectable(false);
                jCa.setScale(PHOM_CARD_SCALE_INGAME);
                jCa.move(PHOM_DURATION_ANIMATION,caPos.x,caPos.y);
            }

            if (this.getLogic().isMyTurn()){
                logMessage("minh da ha phom -> kiem tra xem co gui duoc k -> neu gui dc -> suggest");
                this.getLogic().hasSendedCard = this.getLogic().recommendSendedCard();
                this.showOngameCustomButton();
            }
            return;
        }
        // trong truong hop dc tai co them phom
        var i;
        for (i=0;i<phomList.length;i++){
            if (numberPhom< phomList[i].phomIndex){
                numberPhom = phomList[i].phomIndex;
            }
        }
        if (myphomList.length >0){
            logMessage("minh dc tai -> co them phom -> reshow card in phomlist");
            for (i=0;i<myphomList.length;i++){
                myphomList[i].y += BkConstantIngame.PHOM_CARD_MARGIN_TOP;
            }
        }

        for (i=0;i<phomList.length;i++){
            var iC = phomList[i];
            var icInOnhand = findCard(iC.getNumber(),iC.getType(),onhand);
            if (icInOnhand!= null){
                icInOnhand.resetQueueAnimation();
                icInOnhand.removeAllEventListener();
                icInOnhand.showMask(false);
                removeCardIdFromArrCardListOnly(icInOnhand.encode(),onhand);
                if (iC.phomIndex != icInOnhand.phomIndex){
                    icInOnhand.phomIndex = iC.phomIndex;
                }
                addBkCard(icInOnhand,myphomList);
                if (iC.phomIndex != phomIndex){
                    rowPhom = 0;
                    phomIndex = iC.phomIndex;
                } else {
                    rowPhom ++;
                }
                //var mycardPos = getTakenLocationPhomGameWithNumberCardIndex(displayPos,this.getLogic().maxPlayer,
                //    iC.phomIndex -1,rowPhom+1);

                var mycardPos = getMyTakenLocationPhomGameWithNumberCardIndex(iC.phomIndex -1,rowPhom+1,numberPhom);
                logMessage("card: "+icInOnhand.encode()+" mycardPos "+mycardPos.x +" - "+mycardPos.y);
                if (i == (phomList.length-1)){
                    icInOnhand.setCallBackMoveFinish(function(ca){
                        ca.setCallBackMoveFinish(null);
                        self.configPosOnhandCard(true,function(){
                            logMessage("minh da ha phom -> kiem tra xem co gui duoc k -> neu gui dc -> suggest");
                            self.getLogic().hasSendedCard = self.getLogic().recommendSendedCard();
                            self.showOngameCustomButton();
                        });
                        self.disableOngameButton(self.btnHa);
                    });
                }
                this.reorderChild1(icInOnhand,10 * iC.phomIndex +i);
                icInOnhand.setSelectable(false);
                icInOnhand.setScale(PHOM_CARD_SCALE_INGAME);
                icInOnhand.move(PHOM_DURATION_ANIMATION,mycardPos.x,mycardPos.y);
            } else{
                logMessage("icInOnhand == null -> co loiiiiiiiii........................");
                logMessage("minh da ha phom -> kiem tra xem co gui duoc k -> neu gui dc -> suggest");
                this.getLogic().hasSendedCard = this.getLogic().recommendSendedCard();
                this.showOngameCustomButton();
                this.getLogic().processNextEventInQueue();
            }
        }
        logMessage("list phom card cua player: "+player.getName());
        logListCard(player.getPhomList());
    },
    showPhomOfPlayer:function(phomList,player,isTableSysn){
        logMessage("showPhomOfPlayer "+player.getName());
        if (isTableSysn == undefined){
            isTableSysn = false;
        }
        if (phomList.length == 0){
            this.getLogic().processNextEventInQueue();
            return;
        }
        logListCard(phomList);
        phomList = this.sortPhomListByPhomIndex(phomList);
        logMessage("phomlist after sort");
        logListCard(phomList);
        var isMe = false;
        if (this.getLogic().getMyPos() == player.serverPosition){
            isMe = true;
        }

        if (!isTableSysn){
            playDealCardSound();
        }

        if (isMe){
            this.showMyPhom(phomList,isTableSysn);
            //this.getLogic().processNextEventInQueue();
        } else {
            this.showPhomOfOtherPlayer(phomList,player,isTableSysn);
        }
    },
    onShowPhom:function(phomList){
        var activePlayer = this.getLogic().getActivePlayer();
        logMessage("onShowPhom "+activePlayer.getName());
        this.showPhomOfPlayer(phomList,activePlayer);
        //this.getLogic().processNextEventInQueue();
    },
    showOnhandNotAnimation:function(){
        var myonhand = this.getLogic().getMyClientState().getOnHandCard();
        if (myonhand == null){
            return;
        }
        for (var i=0;myonhand.length;i++){
            var iPos = this.getPosCardOnHandWithIndex(i,false);
            var iCard = myonhand[i];
            if ((iCard != null) && (iCard != undefined)){
                this.reorderChild1(iCard,i);
                iCard.x = iPos.x;
                iCard.y = iPos.y;
            }

        }
    },
    showListCardFinish:function(playerPosition,cardSuite){
        var pAvar = this.getAvatarByServerPos(playerPosition);

        if (pAvar == null){
            return;
        }

        var clientPos = this.getLogic().getPlayerDisplayLocation(playerPosition);
        var diem = 0;
        var i;
        for (i=0;i<cardSuite.length;i++){
            diem+= cardSuite[i].number;
        }

        var iPlayer = this.getLogic().getPlayer(playerPosition);
        logMessage("name "+iPlayer.getName()+" - "+diem+" diem");

        var hasPhom = (iPlayer.getPhomList().length > 0);

        if (clientPos == 0){
            if (hasPhom){
                logMessage("chi tinh diem khi co phom");
                iPlayer.diemSprite = new BkDiemSprite(diem+" điểm");
                var onhandList = iPlayer.getOnHandCard();
                if (onhandList.length >0){
                    var myStartX = this.getStartXOnhand();
                    var startCardOnhandX = myStartX - onhandList[0].width/2  + ((onhandList.length -1)*35 + onhandList[0].width)/2;
                    logMessage("startCardOnhandX "+startCardOnhandX +" - onhandList.length: "
                        +onhandList.length + " - onhandList[0].width: "+onhandList[0].width + " - onhandList[0] "+onhandList[0].id
                        + " - onhandList[0].x: "+onhandList[0].x);

                    iPlayer.diemSprite.x = startCardOnhandX;
                    iPlayer.diemSprite.y = 95;
                    this.addChild(iPlayer.diemSprite,1001);
                }
            }
            //iPlayer.removeEventAndStopAnimationOnhand();
            //this.showOnhandNotAnimation();
            logMessage("la minh k can show bai "+diem);
            return;
        }
        var startX = pAvar.x;
        var startY = pAvar.y;
        var delta = 25;
        var d1 = 80;
        var deltaX =0;
        var deltaY =0;
        var diemPointX = 0;
        var diemPointY = 0;

        if (clientPos == 1) {
            startY +=cardSuite.length * delta/2;
            startX -=d1;
            deltaY = -delta;
            diemPointX = startX;
            diemPointY = pAvar.y - 30.5;
        }
        if (clientPos == 3){
            startX +=d1;
            startY +=cardSuite.length * delta/2;
            deltaY = -delta;
            diemPointX = startX;
            diemPointY = pAvar.y - 30.5;
        }

        if (clientPos == 2){
            startX = pAvar.x - cardSuite.length * delta - 50;
            startY  = pAvar.y;
            deltaX = delta;
            if (cardSuite.length >0){
                var newWidCard = cardSuite[0].width * PHOM_CARD_SCALE_INGAME;
                diemPointX = startX - newWidCard/2  + ((cardSuite.length -1)*deltaX  + newWidCard)/2;
                diemPointY = startY - 30;
            } else {
                diemPointX = pAvar.x;
                diemPointY = pAvar.y - 30;
            }

        }

        for (i=0;i<cardSuite.length;i++){
            var card = cardSuite[i];
            if ((clientPos == 1) || (clientPos == 3)){
                card.initSubType();
            }
            card.removeAllEventListener();
            card.setScale(PHOM_CARD_SCALE_INGAME);
            card.showMask(false);
            card.x = startX + i * deltaX;
            card.y = startY + i * deltaY;
            this.addChild(card,1000);
        }

        if (hasPhom) {
            logMessage("chi tinh diem khi co phom");
            iPlayer.diemSprite = new BkDiemSprite(diem+" điểm");
            iPlayer.diemSprite.x = diemPointX;
            iPlayer.diemSprite.y = diemPointY + 10;
            this.addChild(iPlayer.diemSprite, 1001);
        }
    },
    onSendCard:function(sendCard,userReceiveCard,phomReceiveCard){
        logMessage("onSendCard "+sendCard.encode()+" userReceiveCard "+userReceiveCard+" phomReceiveCard "+phomReceiveCard);
        var activePlayer = this.getLogic().getActivePlayer();
        var pAvar = this.getAvatarByServerPos(activePlayer.serverPosition);
        var playerRei = this.getLogic().getPlayer(userReceiveCard);
        logMessage(" userReceive name "+playerRei.getName());
        var avarRei = this.getAvatarByServerPos(userReceiveCard);
        var phomList = playerRei.getPhomList();
        var clientPosRei = this.getLogic().getPlayerDisplayLocation(userReceiveCard);

        logListCard(phomList);
        // tim card cuoi cung trong list co phom index = phomReceiveCard
        var lastCard = null;
        var zIndex = 0;
        var firtCard = null;
        var numberCardInPhomIndex =0;
        var i;
        for (i=0;i<phomList.length;i++){
            var iCard = phomList[i];
            if (iCard.phomIndex == phomReceiveCard){
                numberCardInPhomIndex++;
                if (firtCard == null){
                    firtCard = iCard;
                }
                lastCard = iCard;
                zIndex = lastCard.getLocalZOrder();
            }
        }
        var pos = cc.p(avarRei.x,avarRei.y);

        if (lastCard != null){
            if (firtCard!= null){
                logMessage(" firtCard "+firtCard.encode()+" pos "+firtCard.x + " - "+firtCard.y +" numberCardInPhomIndex: "+numberCardInPhomIndex);
                pos = cc.p(firtCard.x + BkConstantIngame.PHOM_CARD_MARGIN_LEFT * numberCardInPhomIndex,firtCard.y);
                if (clientPosRei == 1){
                    pos = cc.p(firtCard.x + BkConstantIngame.PHOM_CARD_MARGIN_LEFT * (numberCardInPhomIndex - 1),firtCard.y);
                }
            }
        } else {
            logMessage("logic error -> can't find phom to send -> .....................")
        }

        // la pos 1 -> move all card in phom
        if (clientPosRei == 1){
            for (i=0;i<phomList.length;i++){
                var iC = phomList[i];
                if (iC.phomIndex == phomReceiveCard){
                    iC.x -= BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
                }
            }
        }

        logMessage("pos card: ["+pos.x+","+pos.y+"]");
        var self = this;
        if (this.getLogic().isMyTurn()){
            logMessage("i onSendCard : "+sendCard.encode());
            if (this.getLogic().isAutoSend){
                this.removeAllListButtonGui();
                this.disableOngameButton(this.btnGui);
            }
            var onhand = this.getLogic().getMyClientState().getOnHandCard();
            logListCard(onhand);
            var caSend = findCard(sendCard.getNumber(),sendCard.getType(),onhand);
            if (caSend!= null){
                caSend.showMask(false);
                caSend.setSelectable(false);
                this.reorderChild1(caSend,zIndex +1);
                caSend.phomIndex = phomReceiveCard;
                addBkCard(caSend,phomList);
                caSend.setScale(PHOM_CARD_SCALE_INGAME);

                caSend.setCallBackMoveFinish(function(ca){
                    logMessage("i finish animation send card -> do smt");
                    ca.setCallBackMoveFinish(null);
                    removeCardIdFromArrCardListOnly(sendCard.encode(),onhand);
                    self.getLogic().precessAfterSendCard();
                    self.configPosOnhandCard(true);
                });
                caSend.move(PHOM_DURATION_ANIMATION,pos.x,pos.y);

            } else {
                logMessage("can't find card "+sendCard.encode()+" in onhand -> waringing need recheck here.................");
                this.getLogic().processNextEventInQueue();
            }
        } else {
            // neu k phai minh gui thi can add card vao scene
            logMessage("nguoi khac gui: "+sendCard.encode());
            this.addChild(sendCard,zIndex +1);
            sendCard.setSelectable(false);
            sendCard.setScale(PHOM_CARD_SCALE_INGAME);
            sendCard.x = pAvar.x;
            sendCard.y = pAvar.y;
            sendCard.phomIndex = phomReceiveCard;
            addBkCard(sendCard,phomList);
            sendCard.move(PHOM_DURATION_ANIMATION,pos.x,pos.y);
            sendCard.setCallBackMoveFinish(function(ca){
                ca.setCallBackMoveFinish(null);
                self.getLogic().processNextEventInQueue();
            });
            //this.getLogic().processNextEventInQueue();
        }
    },
    onShowU:function(playerPosition,denPlayerPosition,cardSuite){
        logMessage("onShowU playerPosition "+playerPosition+" denPlayerPosition "+denPlayerPosition);
        var player  = this.getLogic().getPlayer(playerPosition);

        var lastCard = null;

        if (this.getLogic().getMyPos() == playerPosition){
            logMessage("la minh -> stop all animation onhand");
            player.stopAllAnimationOnhand();

            var onHand = player.getOnHandCard();
            for (var i=0;i<onHand.length;i++){
                if (onHand[i].phomIndex == 0){
                    lastCard = onHand[i];
                }
            }
        }

        this.clearImgCardCount(player,true);

        if (lastCard!= null){
            logMessage("lastCard "+lastCard.id);
            this.onDiscard(lastCard,true);
        }

        var pavar = this.getAvatarByServerPos(playerPosition);
        pavar.showSplashU();
        var denAvar = this.getAvatarByServerPos(denPlayerPosition);
        if (denAvar!= null){
            denAvar.showUDen();
        }

        this.hideAllOngameCustomButton();
        this.hideNoc();

        this.showPhomOfPlayer(cardSuite,player);
    },
    showRankSplash:function(playerPos, rank)
    {
        var pAvatar = this.getAvatarByServerPos(playerPos);
        if (pAvatar != null)
        {
            pAvatar.showRank(rank,this.getLogic().numberOfPlayingPlayer);
        }
    },
    canSendCardTo:function(player,phomIndex){
        logMessage("add btn gui");
        if (player.listPhomAddedButton[phomIndex]){
            logMessage("phom "+ phomIndex +" da add btn -> k can add lai");
            return;
        }
        if (player.listBtnGui == null){
            player.listBtnGui = [];
        }
        var pList = player.getPhomList();
        var maxZindex =0;
        var firtCard = null;
        for (var i=0;i<pList.length;i++){
            if (pList[i].phomIndex == phomIndex){
                if (maxZindex < pList[i].getLocalZOrder()){
                    maxZindex = pList[i].getLocalZOrder();
                }
                if (firtCard == null){
                    firtCard = pList[i];
                }
            }
        }
        var disPlayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        var btn;

        if (disPlayPos == 1){
            btn = createBkButtonPlist(res_name.btnGui2_IMG,res_name.btnGui2_IMG,res_name.btnGui2_IMG,res_name.btnGui2_hover_IMG);
            btn.x = 745 + 30;
        } else {
            btn = createBkButtonPlist(res_name.btnGui1_IMG,res_name.btnGui1_IMG,res_name.btnGui1_IMG,res_name.btnGui1_hover_IMG);
            btn.x = firtCard.x - 50;
        }

        btn.y = firtCard.y + firtCard.height/2 - btn.height /2 - 15;

        this.addChild(btn,maxZindex + 1);
        var self = this;
        logMessage("push btn inlist");
        player.listBtnGui.push(btn);
        player.listPhomAddedButton[phomIndex] = true;
        btn.addClickEventListener(function(){
            self.getLogic().onclickButtonGuiWithPhomindexAndPlayer(player,phomIndex);
        });
    },
    getCustomGameButtonList:function()
    {
        var rtnlist = [];
        rtnlist.push(this.btnAn);
        rtnlist.push(this.btnBoc);
        rtnlist.push(this.btnDanh);
        return rtnlist;
    }
});