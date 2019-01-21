/**
 * Created by vinhnq on 1/20/2016.
 */
BkMauBinhClientState = BkClientState.extend({
    maubinhCard:null,
    hasDiscard:false,
    finalMoney:null,
    moneyChi1:null,
    moneyChi2:null,
    moneyChi3:null,
    isAutoWin:false,
    isSap3Chi:false,
    sap3ChiMoney:0,
    autoWinMoney:0,
    ArrangeCardAnimation:null,
    highLightBG:null,
    imgMauBinh:null,
    imgHighLightListCard:null,
    ctor:function(){
        logMessage("BkMauBinhClientState");
        this._super();
    },
    setMauBinhCard:function(cardList)
    {
        if( this.maubinhCard == null)
        {
            this.maubinhCard = new BkMauBinhCardObject();
        }
        //this.maubinhCard.addCardSuite(cardList);
        this.maubinhCard.cardSuite = cardList;
    },
    getMauBinhCard:function()
    {
        return this.maubinhCard;
    },
    removeMauBinhCard:function()
    {
        this.maubinhCard.removeFromParent();
    },
    setMoneyChange:function(chi,mn)
    {
        switch(chi)
        {
            case 1:
                this.moneyChi1 = mn;
                break;
            case 2:
                this.moneyChi2 = mn;
                break;
            case 3:
                this.moneyChi3 = mn;
                break;
            default :
                this.moneyChi1 = mn;
                break;
        }
    },
    setFinalMoney:function(fn)
    {
        this.finalMoney = fn;
    },
    getFinalMoney:function()
    {
        return this.finalMoney;
    },
    getChi1Money:function()
    {
        return this.moneyChi1;
    },
    getChi2Money:function()
    {
       return this.moneyChi2;
    },
    getChi3Money:function()
    {
        return this.moneyChi3;
    },
    getSap3ChiMoney:function()
    {
        return this.sap3ChiMoney;
    },
    showArrangeCardAnimation: function (layerGui,serverpos,isXepXong)
    {
        logMessage("showArrangeCardAnimation");
        this._initArrangeCardAnimation(layerGui,serverpos,isXepXong);
        if(!isXepXong)
        {
            this.ArrangeCardAnimation.showArrangeCardAnimation();
            this.ArrangeCardAnimation.setInstructionText(false);
        }else
        {
            if(this.ArrangeCardAnimation != null)
            {
                this.ArrangeCardAnimation.stopTimerAndAnimation();
                this.ArrangeCardAnimation.setInstructionText(true);
            }
        }
    },
    _initArrangeCardAnimation:function(layerGui,serverpos,isXepXong)
    {
        if(this.ArrangeCardAnimation == null)
        {
            logMessage("this.ArrangeCardAnimation == null");
            logListCard(this.getOnHandCard());
            this.ArrangeCardAnimation = new BKArrangeCardAnimation(isXepXong,layerGui,this);
            var displayLocation = layerGui.getLogic().getPlayerDisplayLocation(serverpos);
            this.ArrangeCardAnimation.initCardBackMaskList(this.getOnHandCard());
            layerGui.addChild(this.ArrangeCardAnimation);
            var playerAvatari =  layerGui.getAvatarByServerPos(serverpos);

            var offsetX = 100;
            var offsetY = 100;
            if(playerAvatari != null)
            {
                if(displayLocation == 1)
                {
                    offsetX = playerAvatari.x - 170;
                    offsetY = playerAvatari.y + 10;
                }else if(displayLocation == 2)
                {
                    offsetX = playerAvatari.x + 50;
                    offsetY = playerAvatari.y +10;
                }else if(displayLocation == 3)
                {
                    offsetX = playerAvatari.x + 50;
                    offsetY = playerAvatari.y + 10;
                }
            }
            this.ArrangeCardAnimation.x = offsetX;
            this.ArrangeCardAnimation.y = offsetY;
        } else {
            logMessage("this.ArrangeCardAnimation != null");
        }
    },
    removeArrangeCardAnimation:function()
    {
        //logMessage("removeArrangeCardAnimation");
        if(this.ArrangeCardAnimation != null) {
            this.ArrangeCardAnimation.removeSelf();
            this.ArrangeCardAnimation = null;
        }
    },
    initHighLightBG:function(chi,gui){
        if (this.highLightBG == null){
            this.highLightBG = new BkSprite("#" + res_name.light_sochi);
            gui.addChild(this.highLightBG,50);
        }

        var isMe = false;
        if (this.serverPosition == gui.getLogic().getMyClientState().serverPosition){
            isMe = true;
        }

        //config size
        var width = 228 + 15;
        var hight = 91;
        if (chi == 3){
            width = 145 + 8;
        }

        if (isMe){
            width = 277 + 27;
            hight = 106;
            if (chi == 3){
                width = 170 + 18;
            }
        }

        this.highLightBG.setScale(width/302,hight/103);

        //config pos
        var st = gui.getStartPointForOnhand(this);

        var roff = ROW_OFFSET_XEP_XONG;
        var coff = CARD_OFFSET_XEP_XONG;
        if (!isMe){
            roff = ROW_OFFSET_OTHER_PLAYER;
            coff = CARD_OFFSET_OTHER_PLAYER;
        } else {
            st = gui.getMyStartPoint(true);
        }
        var endPoint = gui.getPosMBcardWithData(1,roff,coff,st);

        if (chi == 2){
            endPoint = gui.getPosMBcardWithData(5,roff,coff,st);
        }

        if (chi == 1){
            endPoint = gui.getPosMBcardWithData(10,roff,coff,st);
        }

        this.highLightBG.x = endPoint.x + 0.75;
        this.highLightBG.y = endPoint.y;
    },
    removeHighLightBG:function(){
        if (this.highLightBG != null){
            this.highLightBG.removeFromParent();
            this.highLightBG = null;
        }
    },
    getStartPointAnimationByClientPos:function(pos){
        return cc.p(cc.winSize.width/2,cc.winSize.height/2);
    },
    getEndPointAnimationByClientPos:function(pos){
        var avarPos = _getMauBinhAvatarLocaionPos(pos);
        return avarPos;
    },
    showHightLightListCard:function(isMe,gui){
        logMessage(" showHightLightListCard ");
        if (this.imgHighLightListCard != null){
            this.imgHighLightListCard.removeFromParent();
            this.imgHighLightListCard = null;
        }

        if (isMe){
            this.imgHighLightListCard = new BkSprite("#"+res_name.light_maubinh_big);
        } else {
            this.imgHighLightListCard = new BkSprite("#"+res_name.light_maubinh_small);
        }

        var st = gui.getStartPointForOnhand(this);
        var roff = ROW_OFFSET_XEP_XONG;
        var coff = CARD_OFFSET_XEP_XONG;
        if (!isMe){
            roff = ROW_OFFSET_OTHER_PLAYER;
            coff = CARD_OFFSET_OTHER_PLAYER;
        } else {
            st = gui.getMyStartPoint(true);
        }
        var endPoint = gui.getPosMBcardWithData(5,roff,coff,st);
        this.imgHighLightListCard.x = endPoint.x + 1;
        this.imgHighLightListCard.y = endPoint.y;
        gui.addChild(this.imgHighLightListCard,50);
    },
    showMaubinhAnimation:function(gui){
        this.removeMaubinhAutoWinImg();
        var isMe = (this.serverPosition == gui.getLogic().getMyPos());
        this.showHightLightListCard(isMe,gui);
        if (this.imgMauBinh == null){
            this.imgMauBinh = new BkSprite("#"+res_name.AutoWinmaubinh);
            gui.addChild(this.imgMauBinh,10000);
        }
        var displayPos = gui.getLogic().getPlayerDisplayLocation(this.serverPosition);
        var st = this.getStartPointAnimationByClientPos(displayPos);
        var ep = this.getEndPointAnimationByClientPos(displayPos);
        this.imgMauBinh.x = st.x;
        this.imgMauBinh.y = st.y;
        this.imgMauBinh.setScale(4);

        var dur = 1;
        var scalevl = 0.6;

        var move = cc.moveTo(dur, ep.x, ep.y);
        var scale = cc.scaleTo(dur,scalevl);
        var mySp = cc.spawn(move,scale);

        this.imgMauBinh.runAction(mySp);
    },
    removeMaubinhAutoWinImg:function(){
        if (this.imgMauBinh != null){
            this.imgMauBinh.removeFromParent();
            this.imgMauBinh = null;
        }

        if (this.imgHighLightListCard != null){
            this.imgHighLightListCard.removeFromParent();
            this.imgHighLightListCard = null;
        }
    },
    removeAllCurentCard:function(){
        this._super();
        this.removeArrangeCardAnimation();
        this.removeHighLightBG();
        this.removeMaubinhAutoWinImg();
        if(this.getMauBinhCard() != null)
        {
            this.getMauBinhCard().removeCardTextType();
        }
    },
    removeOnhandCard:function(){
        this._super();
        this.removeArrangeCardAnimation();
        this.removeHighLightBG();
        this.removeMaubinhAutoWinImg();
        if(this.getMauBinhCard() != null)
        {
            this.getMauBinhCard().removeCardTextType();
        }
    }
});
