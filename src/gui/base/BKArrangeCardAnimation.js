/**
 * Created by vinhnq on 4/4/2016.
 */
BKArrangeCardAnimation = cc.Layer.extend({
    //cardBackMaskList:null,
    instructionText:null,
    isXX:false,
    myParent:null,
    player:null,
    ctor:function(isXepXong,pr,pl){
        this._super();
        this.myParent = pr;
        this.player = pl;
        this.isXX = isXepXong;
        this.setVisible(true);
    },
    initInstructionText:function(isXepXong)
    {
        var cardBackMaskList = this.player.getOnHandCard();
        if(cardBackMaskList == null || cardBackMaskList == undefined )
        {
            return;
        }
        if (this.instructionText != null){
            this.instructionText.removeFromParent();
            this.instructionText = null;
        }
        if(this.instructionText == null)
        {
            if (isXepXong){
                this.instructionText = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM);
                this.instructionText.setScale(0.55);
            } else {
                this.instructionText = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM_THUA);
                this.instructionText.setScale(0.4);
            }

            this.myParent.addChild(this.instructionText,100);
            this.instructionText.x = cardBackMaskList[10].x;
            this.instructionText.y = cardBackMaskList[10].y - 5;
        }
        if(isXepXong != undefined && isXepXong == false )
        {
            this.isXX = false;
        } else {
            this.isXX = true;
        }
    },
    setInstructionText:function(isXX)
    {
        this.initInstructionText(isXX);
        if (isXX){
            this.instructionText.setString("Xếp xong");
        } else {

            this.instructionText.setString("Đang xếp...");
        }
    },
    initCardBackMaskList:function(list)
    {
        logMessage("initCardBackMaskList");
        var cardBackMaskList = this.player.getOnHandCard();
        logListCard(cardBackMaskList);
        setZOrder(cardBackMaskList);
        this.initInstructionText(this.isXX);
    },
    showArrangeCardAnimation:function() {
        //logMessage("showArrangeCardAnimation ------");
        var time;
        do
        {
            time = Util.getRandom(6);
        }
        while(time < 2);
        do
        {
            this.cardindex1 = Util.getRandom(12);
            this.cardindex2 = Util.getRandom(12);
        }
        while(this.cardindex1 < 0 || this.cardindex2 < 0 || (this.cardindex1 == this.cardindex2));
        //logMessage("time "+time);
        var self = this;
        var f = function(){
            self.unscheduleAllCallbacks();
            self.onTick(self);
        };
        this.scheduleOnce(f,time);
    },
    onTick:function(self)
    {
        //logMessage("onTick ------");

        if (!self.isXX){
            //logMessage("chua stop fake swap card animation");
            self.showArrangeCardAnimation();
        }
        var cardBackMaskList = self.player.getOnHandCard();
        //logListCard(cardBackMaskList);
        var dur = 0.3;
        var card1 =  cardBackMaskList[self.cardindex1];
        var card2 =  cardBackMaskList[self.cardindex2];
        var tmp = cardBackMaskList[self.cardindex1].getLocalZOrder();
        cardBackMaskList[self.cardindex1].setLocalZOrder(cardBackMaskList[self.cardindex2].getLocalZOrder());
        cardBackMaskList[self.cardindex2].setLocalZOrder(tmp);
        var card1x = card1.x;
        var card1y = card1.y;
        card1.move(dur, card2.x, card2.y);
        card2.move(dur, card1x, card1y);

        cardBackMaskList[self.cardindex1] = card2;
        cardBackMaskList[self.cardindex2] = card1;
        setZOrder(cardBackMaskList);
    },
    stopTimerAndAnimation:function() {
        this.unscheduleAllCallbacks();
        var cardBackMaskList = this.player.getOnHandCard();
        for(var i = 0; i < cardBackMaskList.length; i++) {
            cardBackMaskList[i].stopMoveAction();
        }
    },
    prepareForShowChi:function(playeri,gui){
        this.stopTimerAndAnimation();
        this.maskListCard();
        this.instructionText.visible = false;
        this.moveAndScaleListCard(playeri,gui);
    },
    moveAndScaleListCard:function(playeri,gui){
        var cardBackMaskList = this.player.getOnHandCard();
        //logMessage("this.cardBackMaskList "+cardBackMaskList.length);
        for (var i=0;i<13;i++){

            var cardi = cardBackMaskList[i];
            cardi.stopMoveAction();

            var scale = 80/CARD_HEIGHT;//0.6;
            var dur = 0.2;
            var st = gui.getStartPointForOnhand(playeri);
            var endPoint = gui.getPosMBcardWithData(i,ROW_OFFSET_OTHER_PLAYER,CARD_OFFSET_OTHER_PLAYER,st);
            cardi.moveAndScale(dur,endPoint.x,endPoint.y,"",false,scale);
        }
    },
    maskListCard:function(){
        var cardBackMaskList = this.player.getOnHandCard();
        setZOrder(cardBackMaskList);
        for (var i=0;i<13;i++){
            cardBackMaskList[i].showMask(true);
        }
    },
    showAnimateCardWithData:function(chi,gui){
        logMessage("showAnimateCardWithData "+chi);
        var listCardOfChi = [];
        var minIndex = 0;
        var numCard = 5;
        if (chi == 3){
            minIndex = 0;
            numCard = 3;
        }
        if (chi == 2){
            minIndex = 3;
        }
        if (chi == 1){
            minIndex = 8;
        }

        this.maskListCard();
        var cardBackMaskList = this.player.getOnHandCard();

        for (var i= minIndex;i<minIndex+numCard;i++){
            listCardOfChi[i-minIndex] = cardBackMaskList[i];
            listCardOfChi[i-minIndex].setLocalZOrder(100+i);
            listCardOfChi[i-minIndex].showMask(false);
        }
        var self = this;
        var mbSochi = null;
        if (this.player.getMauBinhCard() != null){
            mbSochi = this.player.getMauBinhCard().getMauBinhSoChiSprite(chi);
        }

        var isMaubinh = (mbSochi != null);
        if (isMaubinh){
            logMessage("la mau binh -> show luon");
            gui.updateChiCardTextType(self.player,chi);
        }
        var timeOnTick = 0.1;
        var count =0;
        var f = function(){
            //listCardOfChi[count].showBackMask(false);
            listCardOfChi[count].doFlipAnimation();
            count ++;
            if (count == numCard){
                gui.unschedule(f);
                if (!isMaubinh){
                    logMessage("khong la mau binh -> show sau khi lat bai");
                    gui.updateChiCardTextType(self.player,chi);
                }
            }
        };
        gui.schedule(f,timeOnTick);
    },
    removeSelf:function(){
        this.stopTimerAndAnimation();
        this.instructionText.removeFromParent();
        this.instructionText = null;
        this.removeFromParent();
    },
    removeAllbackMask:function(){
        var cardBackMaskList = this.player.getOnHandCard();
        for (var i= 0;i<13;i++){
            cardBackMaskList[i].showBackMask(false);
        }
    }
});