/**
 * Created by bs on 10/10/2015.
 */
BkTLMNGameLayer = BkBaseIngameLayer.extend({
    btnDanh:null,
    btnBoLuot:null,
    btnXepBai:null,
    discardList:null,
    newSuggestedCard:[],
    CurrentSuggestedCard:[],
    ctor:function(){
        this._super();
        this.btnDanh = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Đánh");
        this.btnDanh.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnDanh.visible = false;
        this.btnDanh.x = cc.winSize.width/2 - 53 + 10;
        this.btnDanh.y = 38;
        var self = this;
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
        this.btnBoLuot.x = cc.winSize.width/2 + 53 + 10;
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
            if(BkTime.GetCurrentTime() - self.btnXepBai.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnXepBai.lastTimeClick = BkTime.GetCurrentTime();
            self.onXepBaiClick();
        });
    },
    onSettingClick:function(){
        this._super();
    },
    onXepBaiClick:function()
    {
        this.getLogic().sortOnHandCard();
        this.btnXepBai.visible = false;
        this.btnXepBai.setEnableEventButton(false);
    },
    onPrepareNewGame:function()
    {
        this._super();
        this.hideAllOngameCustomButton();
        var myClientState = this.getLogic().getMyClientState();
        if (myClientState != null){
            logMessage("disableCardSelection");
            disableCardSelection(this.getLogic().getMyClientState().getOnHandCard());
        }
    },
    onTableLeavePush:function(player)
    {
        this._super(player);
        this.clearImgCardCount(player);
    },
    showBoLuotMark:function(serverPos,status)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null) {
            pAvatar.setBoLuotStatus(status);
        }
    },
    showRankSplash:function(serverPos, rank)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showRank(rank,this.getLogic().numberOfPlayingPlayer);
        }
    },
    showColdLoseSplash:function(serverPos)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showColdLose();
        }
    },

    onFinishAnimationMoveCard:function(o) {
        if (o.tag == TAG_SELECT || o.tag == TAG_DESELECT) {
            this.onFinishAnimationProcess(o);
            var selectedCard = o;
            if (selectedCard.tag == TAG_DESELECT || selectedCard.tag == TAG_SELECT) {
                this.getLogic().processNextCardClickEvent();
            }
        }
    },

    onFinishAnimationProcess:function(o)
    {
        logMessage("onFinishAnimationProcess:");
        var currentDiscard = this.getLogic().currentDiscardSuite;
        var cardlist = this.getLogic().getOnHandCard(this.getLogic().getMyClientState());
        var onhandCardSuite = cardlist.slice();
        onhandCardSuite = sortCardByType(onhandCardSuite);
        var selectedCardList = getSelectedCard(onhandCardSuite);
        var selectedCard = o;
        logMessage("Finish animation card: " + selectedCard.id + " tag" + selectedCard.tag + " status:" + selectedCard.cardStatus);
        if(this.getLogic().isMyTurn() && this.getLogic().isNewTurn && selectedCard.tag == TAG_DESELECT)
        {
            if(this.CurrentSuggestedCard != null && isSanh(this.CurrentSuggestedCard) )
            {
                var selectedPos = getCardIndex(selectedCard.id,this.CurrentSuggestedCard) ;
                if(selectedPos >= 0)
                {
                    var leftCardList = getCardList(0,selectedPos,this.CurrentSuggestedCard);
                    var rightCardList = getCardList(selectedPos+1, this.CurrentSuggestedCard.length,this.CurrentSuggestedCard);
                    if(! isSanh(leftCardList) && !isSanh(rightCardList))
                    {
                        deSelectCards(this.CurrentSuggestedCard); // hạ tất khi cả bên trái và phải ko là sảnh
                        this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                        return;
                    }
                    if(isSanh(leftCardList) && !isSanh(rightCardList))
                    {
                        deSelectCards( rightCardList);
                        this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                        return;
                    }
                    if(!isSanh(leftCardList)&&isSanh(rightCardList) )
                    {
                        deSelectCards( leftCardList);
                        this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                        return;
                    }
                    if(isSanh(leftCardList)&&isSanh(rightCardList) )
                    {
                        //khong biet bo sanh nao => ko xu ly
                        //deSelectCards( rightCardList);
                        //this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
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
                    if(findDoiThong(selectedCard,onhandCardSuite,3))
                    {
                        return;
                    }
                    this.CurrentSuggestedCard = TLMNgetSmartSuggestNewturn(onhandCardSuite,selectedCardList);
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
                    if(isSanh(this.CurrentSuggestedCard))
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
                            //selectedCard.selectCard();
                            this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                            return;
                        }else
                        {
                            this.CurrentSuggestedCard = getSelectedCard(onhandCardSuite);
                            if(isSanh( this.CurrentSuggestedCard))
                            {
                                return;
                            }else
                            {
                                deSelectCards(this.CurrentSuggestedCard,selectedCard); // nếu chọn 1 quân ko liên quan thì bỏ chọn
                                this.CurrentSuggestedCard = [];
                                return;
                            }

                        }
                    }else if( findDoiThong(selectedCard,onhandCardSuite,3))
                    {
                        return;
                    }
                    else
                    {
                        if(isRac(getSelectedCard(onhandCardSuite))||isDoi(getSelectedCard(onhandCardSuite))||isBa(getSelectedCard(onhandCardSuite)) || isSanh(getSelectedCard(onhandCardSuite))||isTuQuy(getSelectedCard(onhandCardSuite)))
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
            this.newSuggestedCard = TLMNgetSmartSuggestedCards(currentDiscard,onhandCardSuite,selectedCard);
            if(this.newSuggestedCard != null && this.newSuggestedCard.length > 0)
            {
                if(!TLMNisabletoWin(this.newSuggestedCard,currentDiscard))
                {
                    return; // ko co kha nang thang
                }
                if(this.CurrentSuggestedCard != null && this.CurrentSuggestedCard.length > 0)
                {
                    // chỉ bổ sung những quân mới cần chọn
                    deSelectCards(findListDeselectCard(getSelectedCard(this.getLogic().getOnHandCard(me)),this.newSuggestedCard));
                    selectCard(findListSelectedCard(getSelectedCard(this.getLogic().getOnHandCard(me)),this.newSuggestedCard));
                   // this.CurrentSuggestedCard = this.newSuggestedCard;
                    this.CurrentSuggestedCard = getSelectedCard(this.getLogic().getOnHandCard(me));
                    return;
                }
                // nếu chưa có suggest list nào thì hiện danh sách mới luôn
                this.CurrentSuggestedCard = this.newSuggestedCard;
                selectCard(this.CurrentSuggestedCard);
            }
        }
    },

    onDiscardCardClick:function()
    {
        this.getLogic().netWorkProcessDiscardCard();
        this.resetSmartSuggest();
    },

    onBoLuotClick:function()
    {
        this.resetSmartSuggest();
        this.getLogic().processDiscard();
    },

    onFinishGame:function(cardSuite,player)
    {
        logMessage("onFinishGame: " + player.serverPosition);
        logMessage("mypos "+this.getLogic().getMyClientState().serverPosition);
        if(player.serverPosition != this.getLogic().getMyClientState().serverPosition)
        {
            logMessage("show discard delay");
            showDiscardList(cardSuite,player,1);
        }
        this.hideAllOngameCustomButton();
        this.clearAllImgCardCount();
    },

    onDiscardPush:function(cardList,activePlayer)
    {
        logMessage("onDiscardPush");
        this.ShowCicleCountDownTimeOnActivePlayer();
        showDiscardList(cardList,activePlayer);
        showOnHandCardList(activePlayer,true,this,450);
        this.showGameCustomButtons();
    },
    onAutoWin:function(autoWinPlayer, cardSuite)
    {
        var pAvatar = this.getAvatarByServerPos(autoWinPlayer.serverPosition);
        pAvatar.showAutoWin();
        this.OnFinishedGame();
        this.clearAllImgCardCount();
        this.getLogic().updateStateWhenAutoWin(autoWinPlayer);
        this.getLogic().updateMoneyWhenAutoWin(autoWinPlayer);
        if(autoWinPlayer.serverPosition != this.getLogic().getMyClientState().serverPosition)
        {
            // là mình thì ko cần show card
            autoWinPlayer.removeOnhandCard();
            autoWinPlayer.setOnhandCard(cardSuite);
            showDiscardList(cardSuite,autoWinPlayer);
        }
    },

    showPlayerOnhandCard:function()
    {
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            if(playeri.isPlaying)
            {
                showOnHandCardList(playeri,true,this,450);

            }
        }
    },

    onStartGame:function()
    {
        this._super();
        this.clearAllImgCardCount();
    },

    onReady:function()
    {
        this._super();
        this.clearAllImgCardCount();
    },

    onLeaveDuringGame:function(playerOutGame)
    {
        this.clearImgCardCount(playerOutGame);
        if(!playerOutGame.isFinishedGame)
        {
            this.hideAllOngameCustomButton();
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
    onTableSynReturn:function(currentDiscardSuite)
    {
        this.hideAllOngameCustomButton();
        this.showGameCustomButtons();
        var handList = this.getLogic().getMyClientState().getOnHandCard();
        if(handList != null && handList.length > 0)
        {
            for(var j = 0; j < handList.length; j++ )
            {
                this.addChild(handList[j]);
            }
        }
        this.showPlayerOnhandCard();
        showDiscardList(currentDiscardSuite,null);
    },
    onDealCardReturn:function()
    {
        var self = this;
        var fcb = function(playeri){
            showOnHandCardList(playeri,true, self,450);
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
            }
            if(self.getLogic().isInGameProgress())
            {
                self.ShowCicleCountDownTimeOnActivePlayer();
                self.showGameCustomButtons();
            }
            self.getLogic().processNextEventInQueue();
        };
        Util.animateDealCard(this.getLogic(),this,13,finishDealingCB,fcb,null,null,34.61,291);
    },
    clearCurrentGameGui:function()
    {
        this._super();
        removeCard(this.discardList);
    },
    resetSmartSuggest:function()
    {
        this.CurrentSuggestedCard = [];
        this.newSuggestedCard = [];
    },
    showSortButton:function(){
        if (this.getLogic().shouldShowButtonSort()){
            this.btnXepBai.setVisibleButton(true);
        } else {
            this.btnXepBai.setVisibleButton(false);
        }
    },
    showGameCustomButtons:function()
    {
        this.hideAllOngameCustomButton();
        if(!this.getLogic().isInGameProgress())
        {
            return;
        }

        this.showSortButton();

        if(this.getLogic().isMyTurn()) {
            this.btnDanh.setVisibleButton(true);
            if(!this.getLogic().isNewTurn) {
                this.btnBoLuot.setVisibleButton(true);
                this.btnBoLuot.showArrowGuide(this.getLogic().isMustLeaveTurn());
            }
        }
    },
    hideAllOngameCustomButton:function()
    {
        this.btnBoLuot.showArrowGuide(false);
        this.btnDanh.setVisibleButton(false);
        this.btnBoLuot.setVisibleButton(false);
        this.btnXepBai.setVisibleButton(false);
    },
    getCustomGameButtonList:function()
    {
       var rtnlist = [];
        rtnlist.push(this.btnDanh);
        rtnlist.push(this.btnBoLuot);
        rtnlist.push(this.btnXepBai);
        return rtnlist;
    }
});