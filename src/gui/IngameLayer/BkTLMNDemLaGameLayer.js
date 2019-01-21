/**
 * Created by vinhnq on 11/12/2015.
 */
BkTLMNDemLaGameLayer = BkTLMNGameLayer.extend({
    ctor:function(){
        this._super();
    },
    showWinSplash:function(serverPos)
    {
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if (pAvatar != null)
        {
            pAvatar.showWinSplash();
        }
    },
    onFinishGame:function(cardSuite,player)
    {
        if(player.serverPosition != this.getLogic().getMyClientState().serverPosition)
        {
            this.showListCardFinish(player.serverPosition,cardSuite);
        }
        this.hideAllOngameCustomButton();
        this.clearAllImgCardCount();
    },
    showListCardFinish:function(playerPosition,cardSuite)
    {
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
    onAutoWin:function(autoWinPlayer, cardSuite,cashWin)
    {
        var pAvatar = this.getAvatarByServerPos(autoWinPlayer.serverPosition);
        pAvatar.showAutoWin();
        this.OnFinishedGame();
        this.clearAllImgCardCount();
        this.getLogic().updateStateWhenAutoWin(autoWinPlayer);
        this.getLogic().updateMoneyWhenAutoWin(autoWinPlayer,cashWin);
        if(autoWinPlayer.serverPosition != this.getLogic().getMyClientState().serverPosition)
        {
            // l� m�nh th� ko c?n show card
            autoWinPlayer.removeOnhandCard();
            autoWinPlayer.setOnhandCard(cardSuite);
            showDiscardList(cardSuite,autoWinPlayer);
        }
    },
});