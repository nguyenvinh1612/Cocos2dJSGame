/**
 * Created by vinhnq on 16/12/2015.
 */
var AVATAR_X_OFFSET = 120;
BkXiDzachGameLayer = BkBaseIngameLayer.extend({
    btnRutBai:null,
    btnXetHet:null,
    btnDang:null,
    ctor:function(){
        this._super();
        this.configPosforStartGamebutton();
        this.btnRutBai = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Rút Bài");
        this.btnRutBai.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnRutBai.visible = false;
        this.btnRutBai.x = 385;
        this.btnRutBai.y = 50;
        var self = this;
        this.addChild(this.btnRutBai);
        this.btnRutBai.addClickEventListener(function(){
            if (BkTime.GetCurrentTime() - self.btnRutBai.lastTimeClick < 1000){
                return;
            }
            self.btnRutBai.lastTimeClick = BkTime.GetCurrentTime();
            self.onRutBaiClick();
        });
        // Xet het
        this.btnXetHet = createBkButtonPlist(res_name.btnXethet, res_name.btnXethet_press, res_name.btnXethet,
            res_name.btnXethet_hover,"Xét hết");
        Util.setBkButtonShadow(this.btnXetHet);
        this.btnXetHet.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnXetHet.visible = false;
        this.btnXetHet.x = this.btnRutBai.x + 100;
        this.btnXetHet.y = this.btnRutBai.y;
        this.addChild(this.btnXetHet);
        this.btnXetHet.addClickEventListener(function(){
            if (BkTime.GetCurrentTime() - self.btnXetHet.lastTimeClick < 1000){
                return;
            }
            self.btnXetHet.lastTimeClick = BkTime.GetCurrentTime();
            self.onXetHetClick();
        });
        // Dang
        this.btnDang = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
            res_name.btn_big_hover,"Dằng");
        this.btnDang.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnDang.x = this.btnXetHet.x;
        this.btnDang.y = 50;
        this.btnDang.visible = false;
        this.addChild(this.btnDang,100);
        this.btnDang.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnDang.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnDang.lastTimeClick = BkTime.GetCurrentTime();
            self.onDangClick();
        });
    },
    configPosforStartGamebutton:function()
    {
        this.btnStartGame.x = cc.winSize.width/2;
        this.btnStartGame.y = cc.winSize.height/2;
        this.btnReady.x = cc.winSize.width/2;
        this.btnReady.y = cc.winSize.height/2;
    },
    onPrepareNewGame:function()
    {
        this._super();
        this.hideAllOngameCustomButton();
    },
    onTableLeavePush:function(player)
    {
        this._super(player);
        this.cleartxtScore(player);
    },
    onFinishAnimationMoveCard:function(o)
    {
        if (o.tag == TAG_SELECT || o.tag == TAG_DESELECT)
        {
        }
    },
    onRutBaiClick:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_PICK_CARD,1);
        BkConnectionManager.send(Packet);
    },
    onXetHetClick:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_XET_TAT,1);
        BkConnectionManager.send(Packet);
    },
    onDangClick:function()
    {
        var self = this;
        var myCard = this.getLogic().getMyClientState().getOnHandCard();
        if(!this.getLogic().isChuaDuTuoi(myCard))
        {
            self.getLogic().sendFofeitCommand();
            return;
        }
        showPopupConfirmWith("Bạn chưa đủ tuổi.\nBạn chắc chắn muốn dằng?","Dằng",function()
        {
            self.getLogic().sendFofeitCommand();
        });
    },
    showPlayerOnhandCard:function()
    {
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            var playeri = this.getLogic().PlayerState[i];
            if(playeri.isPlaying)
            {
                this.showOnHandCardList(playeri);
            }
        }
    },
    onLeaveDuringGame:function(playerOutGame)
    {
        this.clearBtnXetbai(playerOutGame.serverPosition);
    },
    showOnHandCardList:function(playeri)
    {
        if(playeri == null)
        {
            return;
        }
        var playerAvatarPosi =  this.getAvatarByServerPos(playeri.serverPosition);
        if(playerAvatarPosi != null)
        {
            var displayPos = this.getLogic().getPlayerDisplayLocation(playeri.serverPosition);
            var startX = playerAvatarPosi.x;
            var startY = playerAvatarPosi.y;
            var onHandCard = this.getLogic().getOnHandCard(playeri);
            var card;
            if(displayPos == 0)
            {
                startX = playerAvatarPosi.x + 90;
            }
            if(displayPos == 4 || displayPos == 5)
            {
                startX = playerAvatarPosi.x + 80;
            }
            if(displayPos == 1 || displayPos == 2 ||  displayPos == 3 )
            {
                startX = playerAvatarPosi.x - 50 - onHandCard.length*35 ;
            }
            for(var i = 0; i < onHandCard.length; i++)
            {
                card = onHandCard[i];
                card.x = startX + i* 35;
                card.y = startY;
            }
        }
    },
    onTableSynReturn:function()
    {
        this.ShowCicleCountDownTimeOnActivePlayer(60);
        this.hideAllOngameCustomButton();
        this.showPlayerOnhandCard();
        this.showGameCustomButtons();
        if(this.getLogic().getMyClientState().isPlaying)
        {
            this.showtxtScore(this.getLogic().getMyClientState());
        }
    },
    onPickCardReturn:function(card,player,isNeedReorder)
    {
        this.addChild(card);
        var tag = "score" + player.serverPosition;
        if(isNeedReorder != undefined && isNeedReorder == true)
        {
            if(this.getChildByName(tag) != null)
            {
                this.reorderChild(this.getChildByName(tag),this.getLocalZOrder()+ 1);
            }
        }
        this.animationMoveCard(card,player);
    },
    animationMoveCard:function(card,player)
    {
        var centerPoint = new cc.Point(cc.director.getWinSize().width/2,cc.director.getWinSize().height/2);
        var playerAvatarPosi = this.getAvatarByServerPos(player.serverPosition);
        if (playerAvatarPosi == null){
            logMessage("playerAvatarPosi == null");
            return;
        }
        var startPoint = new cc.Point(playerAvatarPosi.x,playerAvatarPosi.y);
        var displayPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        var startX = startPoint.x;
        var onHandCard = this.getLogic().getOnHandCard(player);
        if (card == null){
            logMessage("card == null");
        }
        card.x = centerPoint.x;
        card.y = centerPoint.y;
        var self = this;
        var lastCard = onHandCard[onHandCard.length -2];
        if (lastCard == null){
            logMessage("lastCard == null: "+onHandCard.length);
        }
        //if(displayPos == 0 || displayPos == 3 || displayPos == 4 || displayPos == 5)
        if(displayPos == 0 || displayPos == 4 || displayPos == 5)
        {
            startX = lastCard.x + 35 ;
        }
        if(displayPos == 1 || displayPos == 2 || displayPos == 3 )
        {
            startX = lastCard.x - 35 ;
        }
        card.move(0.2,startX,lastCard.y);
        card.setCallBackMoveFinish(function()
        {
            card.setCallBackMoveFinish(null);
            self.showOnHandCardList(player);
            if(player.serverPosition == self.getLogic().getMyClientState().serverPosition)
            {
                self.showtxtScore(self.getLogic().getMyClientState());
                self.showGameCustomButtons();
            }
        });
    },
    onTableSyn:function(player)
    {
        var cardList = player.getOnHandCard();
        this.addCardToScene(cardList);
        this.showOnHandCardList(player);
    },
    onXetBai:function(tableOwner,tableOwnerCardSuite,player,PlayerCardSuite)
    {
        if(player.serverPosition != this.getLogic().getMyClientState().serverPosition)
        {
            player.removeOnhandCard();
            player.setOnhandCard(PlayerCardSuite);
            this.addCardToScene(PlayerCardSuite);
        }
        if(tableOwner.serverPosition != this.getLogic().getMyClientState().serverPosition)
        {
            tableOwner.removeOnhandCard();
            tableOwner.setOnhandCard(tableOwnerCardSuite);
            this.addCardToScene(tableOwnerCardSuite);

        }
        this.clearBtnXetbai(player.serverPosition);
        this.showOnHandCardList(tableOwner);
        this.showOnHandCardList(player);
        this.showtxtScore(tableOwner);
        this.showtxtScore(player);
        player.isFinishedGame = true;
        this.getLogic().updateMoneyAfterXetbai(player.serverPosition);
        this.getLogic().processFinishGame();
    },
    clearBtnXetbai:function(tag)
    {
      if(this.getChildByTag(tag) != null)
      {
          this.getChildByTag(tag).setEnableEventButton(false);
          this.getChildByTag(tag).removeFromParent();
      }
    },
    addCardToScene:function(cardList)
    {
        for(var i = 0; i < cardList.length; i ++)
        {
            this.addChild(cardList[i],this.getLocalZOrder());
        }
    },
    onAutoWin:function(autoWinPlayer, cardSuite)
    {
        autoWinPlayer.removeOnhandCard();
        autoWinPlayer.setOnhandCard(cardSuite);
        autoWinPlayer.isFinishedGame = true;
        this.showOnHandCardList(autoWinPlayer);
        this.addCardToScene(cardSuite);
        this.showtxtScore(autoWinPlayer);
        this.showWinSplash(autoWinPlayer.serverPosition);
        this.getLogic().updateAutoWinMoney(autoWinPlayer);
        if(this.getLogic().getActivePlayer() == autoWinPlayer )
        {
            this.getLogic().getNextActivePlayerPosition();
        }
        this.ShowCicleCountDownTimeOnActivePlayer(60);
        this.showGameCustomButtons();
        this.getLogic().processFinishGame();
    },
    onDealCardReturn:function()
    {
        var self = this;
        var startPoint0 = null;
        var startPoint1 = null;
        var startPoint2 = null;
        var startPoint3 = null;
        var startPoint4 = null;
        var startPoint5 = null;
        var CARD_ONHAND_OFFSET = 35;
        var count = -1;
        var numOfCard = 2;
        var logic = this.getLogic();
        logic.isDealingCard = true;
        var Interval = 0.3;
        var centerPoint = new cc.Point(cc.director.getWinSize().width/2,cc.director.getWinSize().height/2);
        var layerGui = this;
        var myOnhandCard = [];
        // tinh location
        for(var i = 0;  i <= logic.maxPlayer ; i++) // server pos
        {
            var playeri = logic.getPlayer(i);
            if(playeri != null)
            {
                var playerAvatari =  layerGui.getAvatarByServerPos(i); // xem server pos nào có người ngồi
                var displayPos = logic.getPlayerDisplayLocation(i); // xem đang ngồi chỗ nào
                if(displayPos == 0) // me
                {
                    startPoint0 =    new cc.Point(playerAvatari.x + 90 ,playerAvatari.y - 0.5);
                    myOnhandCard  = playeri.getOnHandCard();
                }
                if(displayPos == 1)
                {
                    startPoint1 =  new cc.Point(playerAvatari.x - AVATAR_X_OFFSET,playerAvatari.y);
                    var player1 = logic.getPlayer(i);
                }
                if(displayPos == 2)
                {
                    startPoint2 = new cc.Point(playerAvatari.x - AVATAR_X_OFFSET,playerAvatari.y);
                    var player2 = logic.getPlayer(i);

                }
                if(displayPos == 3)
                {
                    startPoint3 = new cc.Point(playerAvatari.x - AVATAR_X_OFFSET,playerAvatari.y);
                    var player3 = logic.getPlayer(i);
                }
                if(displayPos == 4)
                {
                    startPoint4 =  new cc.Point(playerAvatari.x + 80,playerAvatari.y);
                    var player4 = logic.getPlayer(i);
                }
                if(displayPos == 5)
                {
                    startPoint5 =  new cc.Point(playerAvatari.x + 80,playerAvatari.y);
                    var player5 = logic.getPlayer(i);
                }
            }
        }

        layerGui.schedule(function onDealCard()
        {
            count++;
            var card;
            if(startPoint0 != null)
            {
                if (count < myOnhandCard.length)
                {
                    card = myOnhandCard[count];
                    layerGui.addChild(card);
                    card.setSelectable(false);
                    card.x = centerPoint.x ;
                    card.y = centerPoint.y;
                    card.move(Interval/numOfCard, startPoint0.x + count*CARD_ONHAND_OFFSET,startPoint0.y);
                    card.visible = true;
                }
            }
            playDealCardSound();
            ////Player 1
            if(startPoint1 != null)
            {
                card = new BkCard(14,1);
                layerGui.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                player1.getOnHandCard().push(card);
                card.moveAndScale(Interval/numOfCard,startPoint1.x + count*CARD_ONHAND_OFFSET,startPoint1.y,null,false,0.8);
            }
            ////Player2 Card
            if(startPoint2 != null)
            {
                card = new BkCard(14,1);
                layerGui.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                card.moveAndScale(Interval/numOfCard,startPoint2.x + count*CARD_ONHAND_OFFSET,startPoint2.y,null,false,0.8);
                player2.getOnHandCard().push(card);
            }
            ////Player3 Card
            if(startPoint3 != null) {
                card = new BkCard(14,1);
                card.setScale(0.8);
                layerGui.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                card.moveAndScale(Interval/numOfCard,startPoint3.x + count*CARD_ONHAND_OFFSET,startPoint3.y,null,false,0.8);
                player3.getOnHandCard().push(card);
            }

            ////Player4 Card
            if(startPoint4 != null) {
                card = new BkCard(14,1);
                layerGui.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                card.moveAndScale(Interval/numOfCard,startPoint4.x + count*CARD_ONHAND_OFFSET,startPoint4.y,null,false,0.8);
                player4.getOnHandCard().push(card);
            }

            ////Player5 Card
            if(startPoint5 != null) {
                card = new BkCard(14,1);
                layerGui.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x;
                card.y = centerPoint.y;
                card.moveAndScale(Interval/numOfCard,startPoint5.x + count*CARD_ONHAND_OFFSET,startPoint5.y,null,false,0.8);
                player5.getOnHandCard().push(card);
            }
            if(count == (numOfCard-1))
            {
                layerGui.unschedule(onDealCard);
                layerGui.schedule(function onDealCardfinished()
                {
                    layerGui.unschedule(onDealCardfinished);
                    logic.isDealingCard = false;
                    if(self.getLogic().isInGameProgress())
                    {
                        self.ShowCicleCountDownTimeOnActivePlayer(60);
                        this.showGameCustomButtons();
                        this.showtxtScore(logic.getMyClientState());
                    }
                    for(var i = 0; i < myOnhandCard.length; i++)
                    {
                        var cardi = myOnhandCard[i];
                        cardi.setSelectable(false);
                        cardi.removeCardBackMask();
                        cardi.setMoveHandle(self);
                    }
                    self.getLogic().processNextEventInQueue();
                },Interval);
                playDealCardSound();
            }
        },Interval/numOfCard);
    },
    showWinSplash:function(serverPos)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showWinSplash();
        }
    },
    showLoseSplash:function(serverPos)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showLoseSplash();
        }
    },
    showbtnXet:function(player)
    {
        var playerLocationPos = this.getLogic().getPlayerDisplayLocation(player.serverPosition);
        var onhandCard = player.getOnHandCard();
        var btnXet;
        var self = this;
        if(playerLocationPos == 4 || playerLocationPos == 5)
        {
            btnXet = createBkButtonPlist(res_name.btnXet1_IMG, res_name.btnXet1_IMG, res_name.btnXet1_IMG,res_name.btnXet1_hover_IMG);
            btnXet.addClickEventListener(function()
            {
                self.getLogic().processXetBai(player.serverPosition);
            });
            btnXet.x = onhandCard[onhandCard.length -1].x + 60;
            btnXet.y = onhandCard[onhandCard.length -1].y;
            this.addChild(btnXet,this.getLocalZOrder(),player.serverPosition);
        }
        if(playerLocationPos == 1 || playerLocationPos == 2 || playerLocationPos == 3)
        {
            btnXet = createBkButtonPlist(res_name.btnXet2_IMG, res_name.btnXet2_IMG, res_name.btnXet2_IMG,res_name.btnXet2_hover_IMG);
            btnXet.addClickEventListener(function()
            {
                self.getLogic().processXetBai(player.serverPosition);
            });
            btnXet.x = onhandCard[0].x - 60;
            btnXet.y = onhandCard[0].y;
            this.addChild(btnXet,this.getLocalZOrder(),player.serverPosition);
        }
    },
    showtxtScore:function(player)
    {
        var onhandCard = player.getOnHandCard();
        var score = this.getLogic().getScore(onhandCard);
        var scoreSprite = new BkDiemSprite(score);
        var tag = "score" + player.serverPosition;

        if(this.getChildByName(tag) != null)
        {
            this.getChildByName(tag).removeFromParent();
        }
        this.addChild(scoreSprite, this.getLocalZOrder(), tag);
        this.getChildByName(tag).x = onhandCard[0].x - onhandCard[0].width/2  + ((onhandCard.length -1)*35 + onhandCard[0].width)/2;
        this.getChildByName(tag).y = onhandCard[0].y - 20;
        this.reorderChild(this.getChildByName(tag),this.getLocalZOrder()+ 1);

    },
    cleartxtScore:function(player)
    {
        var tag = "score" + player.serverPosition;
        if(this.getChildByName(tag))
        {
            this.getChildByName(tag).removeFromParent();
        }
    },
    clearCurrentGameGui:function()
    {
        this._super();
        for(var i = 0; i < this.getLogic().PlayerState.length; i++)
        {
            this.cleartxtScore(this.getLogic().PlayerState[i]);
        }
    },
    showGameCustomButtons:function()
    {
        if(!this.getLogic().isInGameProgress())
        {
            return;
        }
        this.hideAllOngameCustomButton();
        var myOnhandCard = this.getLogic().getMyClientState().getOnHandCard();
        if(this.getLogic().isMyTurn())
        {
            var isQuac = this.getLogic().isQuac(myOnhandCard);
            this.btnRutBai.setVisibleButton(!isQuac);
            if(!this.getLogic().isMeBossTable())
            {
                this.btnDang.setVisibleButton(true);
            }else
            {
                var isDutuoi = this.getLogic().isDuTuoi(myOnhandCard);
                this.btnXetHet.setVisibleButton(isDutuoi);
                if(isDutuoi)
                {
                    for(var i = 0 ; i < this.getLogic().PlayerState.length; i++)
                    {
                        var playeri = this.getLogic().PlayerState[i];
                        if(playeri.isPlaying && !playeri.isFinishedGame && playeri != this.getLogic().getMyClientState() )
                        {
                            if(!this.getChildByTag(playeri.serverPosition))
                            {
                                this.showbtnXet(playeri);
                            }
                        }
                    }
                }

            }
        }
    },
    hideAllOngameCustomButton:function()
    {
        this.btnRutBai.setVisibleButton(false);
        this.btnXetHet.setVisibleButton(false);
        this.btnDang.setVisibleButton(false);
    },
    getCustomGameButtonList:function()
    {
        var rtnlist = [];
        rtnlist.push(this.btnXetHet);
        rtnlist.push(this.btnDang);
        rtnlist.push(this.btnRutBai);
        return rtnlist;
    },
});