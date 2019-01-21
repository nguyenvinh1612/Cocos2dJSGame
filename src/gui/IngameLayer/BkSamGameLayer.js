/**
 * Created by bs on 01/12/2015.
 */
BkSamGameLayer = BkBaseIngameLayer.extend({
    className:String,
    btnDanh:null,
    btnBoLuot:null,
    btnXepBai:null,
    btnBaoSam:null,
    btnKhongBaoSam:null,
    ctor:function(){
        this._super();
        this.initMenuCustomButton();
    },
    initMenuCustomButton:function(){
        var self = this;
        this.btnDanh = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Đánh");
        this.btnDanh.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnDanh.x = cc.winSize.width/2 - 53;
        this.btnDanh.y = 38;
        this.btnDanh.visible = false;
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

        this.btnBoLuot = new BkButtonWithHint(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnBoLuot.setTitleText("Bỏ lượt");
        this.btnBoLuot.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnBoLuot.x = cc.winSize.width/2 + 53;
        this.btnBoLuot.y = this.btnDanh.y;
        this.btnBoLuot.visible = false;
        this.addChild(this.btnBoLuot,100);
        this.btnBoLuot.addClickEventListener(function()
        {
            // truongbs++ don't send duplicate packet in 1 sec
            if(BkTime.GetCurrentTime() - self.btnBoLuot.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnBoLuot.lastTimeClick = BkTime.GetCurrentTime();
            self.onBoLuotClick();
        });

        this.btnXepBai = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Xếp bài");
        this.btnXepBai.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnXepBai.x = this.btnDanh.x - this.btnDanh.width - 10;
        this.btnXepBai.y = this.btnDanh.y;
        this.btnXepBai.visible = false;
        this.addChild(this.btnXepBai);
        this.btnXepBai.addClickEventListener(function()
        {
            self.onXepBaiClick();
        });

        // bao sam menu button
        this.btnBaoSam = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press, res_name.btnXethet,
            res_name.btnXethet_hover,"Báo Sâm");
        Util.setBkButtonShadow(this.btnBaoSam);
        this.btnBaoSam.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnBaoSam.visible = false;
        this.btnBaoSam.x = cc.winSize.width/2 - 53;
        this.btnBaoSam.y = 250;
        this.addChild(this.btnBaoSam);
        this.btnBaoSam.addClickEventListener(function(){
            // truongbs++ don't send duplicate packet in 1 sec

            if (BkTime.GetCurrentTime() - self.btnBaoSam.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnBaoSam.lastTimeClick = BkTime.GetCurrentTime();
            self.onBaoSamClick();
        });

        this.btnKhongBaoSam = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Không báo");
        this.btnKhongBaoSam.setTitleText("Không báo");
        this.btnKhongBaoSam.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnKhongBaoSam.visible = false;
        this.btnKhongBaoSam.x = cc.winSize.width/2 + 53;
        this.btnKhongBaoSam.y =  this.btnBaoSam.y;
        this.addChild(this.btnKhongBaoSam,100);
        this.btnKhongBaoSam.addClickEventListener(function()
        {
            // truongbs++ don't send duplicate packet in 1 sec
            if(BkTime.GetCurrentTime() - self.btnKhongBaoSam.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnKhongBaoSam.lastTimeClick = BkTime.GetCurrentTime();
            self.onKhongBaoSamClick();
        });
        this.hideAllOngameCustomButton();
        this.hideSortButton();
    },
    onDealCardReturn:function(){
        var self = this;
        var fcb = function(playeri){
            showOnHandCardList(playeri,true,self,450);
        };
        var finishDealingCB = function()
        {
            // init handle move handle with my onhandcard
            var myOnhandCard = self.getLogic().getMyClientState().getOnHandCard();
            for (var i=0;i<myOnhandCard.length;i++){
                var card = myOnhandCard[i];
                card.removeCardBackMask();
                card.setMoveHandle(self);
                card.setIsQueueAnimation(true);
                initDragDropForCard(card,self,450);
                showOnHandCardList(self.getLogic().getMyClientState(),true,self,450);
            }
            self.showBaoSamMenuButton();
            self.showCountDownWithBG(30-2);
            self.clearAllImgCardCount();

            logMessage("finish dealcard sam -> process next event");
            self.getLogic().processNextEventInQueue();
        };
        Util.animateDealCard(this.getLogic(),this,10,finishDealingCB,fcb,null,null,45);
    },
    onXepBaiClick:function(){
        this.getLogic().sortOnHandCard();
    },
    onDiscardCardClick:function(){
        logMessage("onDiscardCardClick");
        this.resetSmartSuggest();
        this.getLogic().netWorkProcessDiscardCard();
    },
    onBoLuotClick:function(){
        logMessage("onBoLuotClick");
        this.getLogic().processDiscard();
    },
    onBaoSamClick:function()
    {
        var self = this;
        showPopupConfirmWith("Bạn có chắc chắn muốn báo Sâm không ?","Báo Sâm",function(){
            logMessage("onBaoSamClick");
            self.getLogic().netWorkBaoSam();
        });
        //return;
    },
    onKhongBaoSamClick:function(){
        var self = this;
        logMessage("onKhongBaoSamClick");
       self.getLogic().netWorkKhongBaoSam();
    },
    showBaoSamMenuButton:function(){
        this.hideAllOngameCustomButton();
        this.btnBaoSam.setVisibleButton(true);
        this.btnKhongBaoSam.setVisibleButton(true);
    },
    resetSmartSuggest:function()
    {
        this.CurrentSuggestedCard = [];
        this.newSuggestedCard = [];
    },
    hideSortButton:function(){
        this.btnXepBai.setVisibleButton(false);
    },
    showSortButton:function(){
        if (this.getLogic().shouldShowButtonSort()){
            this.btnXepBai.setVisibleButton(true);
        } else {
            this.hideSortButton();
        }
    },
    showGameCustomButtons:function() {
        this.hideAllOngameCustomButton();
        if(!this.getLogic().isInGameProgress()) {
            return;
        }

        this.showSortButton();

        if(this.getLogic().isMyTurn())
        {
            this.btnDanh.setVisibleButton(true);
            if(!this.getLogic().isNewTurn) {
                this.btnBoLuot.setVisibleButton(true);
                this.btnBoLuot.showArrowGuide(this.getLogic().isMustLeaveTurn());
            }
        }
    },
    hideAllOngameCustomButton:function() {
        this.btnDanh.setVisibleButton(false);
        this.btnBoLuot.setVisibleButton(false);
        this.btnBoLuot.showArrowGuide(false);

        this.btnBaoSam.setVisibleButton(false);
        this.btnKhongBaoSam.setVisibleButton(false);
    },
    onBaoSam:function(serverPos,flag){
        if (!this.isValdiGameTableWhenReceiveBaoxam()){
            this.getLogic().networkGetTableInfo();
            return false;
        }

        var pAvar = this.getAvatarByServerPos(serverPos);

        if ((flag) || (this.getLogic().getMyPos() == serverPos)){
            pAvar.stopCountDown();
            this.hideAllOngameCustomButton();
        }

        if (this.getLogic().getMyPos() == serverPos){
            this.getLogic().updateGameStatus(GAME_STATE_WAIT_OTHER_BAO_XAM)
        }

        pAvar.baoSam(flag);

        var player = this.getLogic().getPlayer(serverPos);
        player.isBaoSam = flag;
        if (flag || this.getLogic().allPlayersBaoXam()) {
            logMessage("het bao xam -> play van choi");
            this.removeCountDownText();
            this.getLogic().resetTurn();
            this.resetImageBaoSam();
            this.getLogic().updateGameStatus(GAME_STATE_WAIT_XAM_DISCARD);
            this.ShowCicleCountDownTimeOnActivePlayer();
            if (this.getLogic().isMyTurn()){
                this.showGameCustomButtons();
            }
        }
    },
    resetImageBaoSam:function(){
        for (var i=0;i<this.getLogic().maxPlayer;i++){
            var iPlayer = this.getLogic().getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying) && (i != this.getLogic().baoXamPlayerPosition)){
                var pAvar = this.getAvatarByServerPos(i);
                pAvar.clearBaoSam();
            }
        }
    },
    resetImageBaoSamForBaoSamPlayer:function()
    {
        for (var i=0;i<this.getLogic().maxPlayer;i++){
            var iPlayer = this.getLogic().getPlayer(i);
            if ((iPlayer != null) && (iPlayer.isPlaying) && (i == this.getLogic().baoXamPlayerPosition)){
                var pAvar = this.getAvatarByServerPos(i);
                pAvar.clearBaoSam();
            }
        }
    },
    isValdiGameTableWhenReceiveBaoxam:function(){
        var gs = this.getLogic().gameStatus;
        return !((gs == GAME_STATE_READY) || (gs == GAME_STATE_FINISH));
    },
    showColdLoseSplash:function(serverPos)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showColdLose();
        }
    },
    showBoLuotMark:function(serverPos,status)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null) {
            pAvatar.setBoLuotStatus(status);
        }
    },
    showWinSplash:function(serverPos)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showWinSplash();
        }
    },
    onDiscardPush:function(cardList,activePlayer)
    {
        this.showGameCustomButtons();
        this.ShowCicleCountDownTimeOnActivePlayer();
        var listClone = cardList.slice();
        if (BkSamCardUtil.isSanh(listClone)){
            if (getNumberCount(listClone,3) > 0){
                // la sanh nho (sanh co 3) -> sort lai card
                BkSamCardUtil.sortSanh(listClone,true);
            }
        }
        showDiscardList(listClone,activePlayer);
        showOnHandCardList(activePlayer,false,this,450);
    },
    onTableSynReturn:function(currentDiscardSuite)
    {
        showDiscardList(currentDiscardSuite,null);
        var handList = this.getLogic().getMyClientState().getOnHandCard();
        if(handList != null && handList.length > 0)
        {
            for(var j = 0; j < handList.length; j++ )
            {
                this.addChild(handList[j]);
            }
        }
        this.hideAllOngameCustomButton();
        this.showPlayerOnhandCard();
        this.showGameCustomButtons();
    },
    showPlayerOnhandCard:function()
    {
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            if(playeri.isPlaying)
            {
                showOnHandCardList(playeri,false,this,450);
            }
        }
    },
    showBaoXamMark:function(serverPos,isBao)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null) {
            pAvatar.baoSam(isBao);
        }
    },
    alert1Card:function(serverPos,isAlert)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null) {
            pAvatar.alert1Card(isAlert);
        }
    },
    onLeaveDuringGame:function(playerOutGame)
    {
        if(!playerOutGame.isFinishedGame)
        {
            this.hideAllOngameCustomButton();
        }
    },
    clearCurrentGameGui:function()
    {
        this._super();
        removeCard(this.discardList);
    },
    onFinishAnimationMoveCard:function(o){
        if (o.tag == TAG_SELECT || o.tag == TAG_DESELECT){
            this.onFinishAnimationProcess(o);
            var selectedCard = o;
            if (selectedCard.tag == TAG_DESELECT || selectedCard.tag == TAG_SELECT) {
                this.getLogic().processNextCardClickEvent();
            }
        }
    },
    onPrepareNewGame:function()
    {
        this._super();
        this.hideAllOngameCustomButton();
        this.hideSortButton();
        disableCardSelection(this.getLogic().getMyClientState().getOnHandCard());
    },
    onFinishAnimationProcess:function(o)
    {
        var currentDiscard = this.getLogic().currentDiscardSuite;
        var cardlist = this.getLogic().getOnHandCard(this.getLogic().getMyClientState());
        var onhandCardSuite = cardlist.slice();
        onhandCardSuite = sortCardByType(onhandCardSuite);
        var selectedCardList = getSelectedCard(onhandCardSuite);
        var selectedCard = o;
        logMessage("Finish animation card: " + selectedCard.id + " tag" + selectedCard.tag + " status:" + selectedCard.cardStatus);
        if(this.getLogic().isMyTurn() && this.getLogic().isNewTurn && selectedCard.tag == TAG_DESELECT)
        {
            if(this.CurrentSuggestedCard != null && BkSamCardUtil.isSanh(this.CurrentSuggestedCard) )
            {
                this.CurrentSuggestedCard = BkSamCardUtil.sortSanh(this.CurrentSuggestedCard,true);
                var selectedPos = getCardIndex(selectedCard.id,this.CurrentSuggestedCard) ;
                if(selectedPos >= 0)
                {
                    var leftCardList = getCardList(0,selectedPos,this.CurrentSuggestedCard);
                    if(leftCardList != null && leftCardList.length >= 3)
                    {
                        leftCardList = BkSamCardUtil.sortSanh(leftCardList,false);
                    }
                    var rightCardList = getCardList(selectedPos+1, this.CurrentSuggestedCard.length,this.CurrentSuggestedCard);
                    if(rightCardList != null && rightCardList.length >= 3)
                    {
                        rightCardList = BkSamCardUtil.sortSanh(rightCardList,false);
                    }
                    if(! BkSamCardUtil.isSanh(leftCardList) && !BkSamCardUtil.isSanh(rightCardList))
                    {
                        deSelectCards(this.CurrentSuggestedCard); // hạ tất khi cả bên trái và phải ko là sảnh
                        this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                        return;
                    }
                    if(BkSamCardUtil.isSanh(leftCardList) && !BkSamCardUtil.isSanh(rightCardList))
                    {
                        deSelectCards( rightCardList);
                        this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                        return;
                    }
                    if(!BkSamCardUtil.isSanh(leftCardList)&&BkSamCardUtil.isSanh(rightCardList) )
                    {
                        deSelectCards( leftCardList);
                        this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                        return;
                    }
                    if(BkSamCardUtil.isSanh(leftCardList)&&BkSamCardUtil.isSanh(rightCardList) )
                    {
                        return;
                    }
                }
            }
        }

        if(selectedCard.tag == TAG_SELECT)
        {
            var me = this.getLogic().getMyClientState();
            if(this.getLogic().isMyTurn() && this.getLogic().isNewTurn) // luợt đánh mới
            {
                currentDiscard = null;
                if(selectedCardList.length == 2)
                {
                    this.CurrentSuggestedCard = this.getLogic().getSmartSuggestNewturn(onhandCardSuite,selectedCardList);
                    if(this.CurrentSuggestedCard != null)
                    {
                        selectCard(this.CurrentSuggestedCard);
                        return;
                    }else
                    {
                        deSelectCards(onhandCardSuite,selectedCard);
                    }
                }else if(this.CurrentSuggestedCard != null && this.CurrentSuggestedCard.length > 0 )  // đã có suggest card rồi
                {
                    if(BkSamCardUtil.isSanh(this.CurrentSuggestedCard))
                    {
                        //trường hợp là sảnh muốn chọn quân khác
                        var deselectCard = findBiggestCardWithSameNumber(selectedCard.number,this.CurrentSuggestedCard);
                        if(deselectCard!= null)
                        {
                            if(deselectCard.id == selectedCard.id)
                            {
                                return;
                            }
                            deselectCard.deSelect();
                            this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                            return;
                        }else
                        {
                            this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                            if(BkSamCardUtil.isSanh( this.CurrentSuggestedCard))
                            {
                                return;
                            }else
                            {
                                deSelectCards(this.CurrentSuggestedCard,selectedCard); // nếu chọn 1 quân ko liên quan thì bỏ chọn
                                this.CurrentSuggestedCard = [];
                                return;
                            }

                        }
                    }
                    else
                    {
                        if(isRac(getSelectedCard(onhandCardSuite))||isDoi(getSelectedCard(onhandCardSuite))||isBa(getSelectedCard(onhandCardSuite)) || BkSamCardUtil.isSanh(getSelectedCard(onhandCardSuite))||isTuQuy(getSelectedCard(onhandCardSuite)))
                        {
                            this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite); // new code
                            return;
                        }
                        deSelectCards(this.CurrentSuggestedCard); // nếu chọn 1 quân ko liên quan thì bỏ chọn
                        this.CurrentSuggestedCard = [];
                    }
                }
            }

            if(selectedCard == null || currentDiscard == null || currentDiscard.length == 0 )
            {
                return;
            }
            this.CurrentSuggestedCard = getSelectedCard(this.getLogic().getOnHandCard(me));
            this.newSuggestedCard = this.getLogic().getSmartSuggestedCards(currentDiscard,onhandCardSuite,selectedCard);
            if(this.newSuggestedCard != null && this.newSuggestedCard.length > 0)
            {
                if(!this.getLogic().isabletoWin(this.newSuggestedCard,currentDiscard))
                {
                    return; // ko co kha nang thang
                }
                if(this.CurrentSuggestedCard != null && this.CurrentSuggestedCard.length > 0)
                {
                    // chỉ bổ sung những quân mới cần chọn
                    deSelectCards(findListDeselectCard(getSelectedCard(this.getLogic().getOnHandCard(me)),this.newSuggestedCard));
                    selectCard(findListSelectedCard(getSelectedCard(this.getLogic().getOnHandCard(me)),this.newSuggestedCard));
                    this.CurrentSuggestedCard = getSelectedCard(this.getLogic().getOnHandCard(me));
                    return;
                }
                // nếu chưa có suggest list nào thì hiện danh sách mới luôn
                this.CurrentSuggestedCard = this.newSuggestedCard;
                selectCard(this.CurrentSuggestedCard);
            }
        }
    },
    showListCardFinish:function(playerPosition,cardSuite){
        var pAvar = this.getAvatarByServerPos(playerPosition);
        if (pAvar == null){
            return;
        }
        var clientPos = this.getLogic().getPlayerDisplayLocation(playerPosition);
        var startX = pAvar.x;
        var startY = pAvar.y;
        var deltaX =0;
        var deltaY =0;
        var dt = 25;
        var hCardList = ((cardSuite.length -1) * dt)/2;
        var wCardList = ((cardSuite.length -1) * dt)/2;

        if (clientPos == 1) {
            startY += hCardList;//cardSuite.length * 18;
            startX -=100;
            deltaY = -dt;
        }
        if (clientPos == 3){
            startX +=100;
            startY += hCardList;//cardSuite.length * 18;
            deltaY = -dt
        }

        if (clientPos == 2){
            startX -= wCardList;//cardSuite.length * 18;
            startY -= 100;
            deltaX = dt;
        }

        for (var i=0;i<cardSuite.length;i++){
            var card = cardSuite[i];
            if ((clientPos == 1) || (clientPos == 3)){
                card.initSubType();
            }
            card.removeAllEventListener();
            card.showMask(false);
            card.setScale(0.8);
            card.x = startX + i * deltaX;
            card.y = startY + i * deltaY;
            this.addChild(card,1000);
        }
    },
    clearAllImgCardCount:function()
    {
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            this.clearImgCardCount(playeri);
        }
    },
    clearImgCardCount:function(playeri)
    {
        var displayPos = this.getLogic().getPlayerDisplayLocation(playeri.serverPosition);
        switch(displayPos)
        {
            case 0: // me
                break;
            case 1:
            {
                if(this.imgPlayer1CardCount != null)
                {
                    this.imgPlayer1CardCount.removeFromParent();
                    this.imgPlayer1CardCount = null;
                }
                if(this.lblPlayer1CardCount != null)
                {
                    this.lblPlayer1CardCount.removeFromParent();
                    this.lblPlayer1CardCount = null;
                }
                break;
            }
            case 2:
            {
                if(this.imgPlayer2CardCount != null)
                {
                    this.imgPlayer2CardCount.removeFromParent();
                    this.imgPlayer2CardCount = null;
                }
                if(this.lblPlayer2CardCount != null)
                {
                    this.lblPlayer2CardCount.removeFromParent();
                    this.lblPlayer2CardCount = null;
                }
                break;
            }
            case 3:
            {
                if(this.imgPlayer3CardCount != null)
                {
                    this.imgPlayer3CardCount.removeFromParent();
                    this.imgPlayer3CardCount = null;
                }
                if(this.lblPlayer3CardCount != null)
                {
                    this.lblPlayer3CardCount.removeFromParent();
                    this.lblPlayer3CardCount = null;
                }
                break;
            }
            default :
            {
                logMessage("can not get player display postion");
            }
        }
    },
    getCustomGameButtonList:function()
    {
        var rtnlist = [];
        rtnlist.push(this.btnBaoSam);
        rtnlist.push(this.btnBoLuot);
        rtnlist.push(this.btnKhongBaoSam);
        rtnlist.push(this.btnXepBai);
        return rtnlist;
    }
});