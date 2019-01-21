/**
 * Created by vinhnq on 9/30/2015.
 */
 DELAYX = 0;
 DELAYY = 0;
 //CARD_HEIGHT = 99;
 //CARD_WIDTH = 72;
 CARD_HEIGHT = 116;
 CARD_WIDTH = 84;

 TAG_SELECT = 1;
 TAG_DESELECT = 2;
 TAG_DEAL_CARD = 3;
 NHEP = 0;
 RO = 1;
 CO = 2;
 BICH = 3;
CARD_STATUS_TAKEN = 2;
CARD_STATUS_CURRENT = 3;
CARD_STATUS_DISCARD =4;

YPOS_ONHAND_DOWN = 119;
YPOS_ONHAND_UP = YPOS_ONHAND_DOWN + 15;

BkCard = BkSprite.extend({
    id:-1,
    cardImage: null,
    subTypeImage:null,
    MOVE_ACTION_TAG:1000,
    CARD_STATUS_ONHAND_NORMAL: 0,
    CARD_STATUS_ONHAND_UP: 1,
    cardStatus: 0,
    cardUIStatus:0,
    isSelectable:null,
    isEnableClick:true,
    handle:null,
    endPointActionMove:null,
   // isEnableShowSelectedMask:false,
    phomIndex:0,
    playerHasCard:null,
    cbMoveFinish:null,
    type:0,
    number:0,
    onHoverListener:null,
    OnClickListener:null,
    onDragDropListener:null,
    queueAnimation:null,
    isQueueAnimation:false,
    isProcessQueueAnimation:false,
    currentAnimation:null,

    blackMask:null,
    _cbMouseClick:null,

    ctor: function (number, cardtype) {
        this._super();
        this.number = number;
        this.type = cardtype; // 0: nhep, 1: Ro, 2 Co , 3 Bich
        this.id = this.encode();
        this.init(number, cardtype);
    },

    init: function (number, type) {
        this.cardStatus = this.CARD_STATUS_ONHAND_NORMAL;
        this.initCardImage(number, type);
        this.isSelectable = false;
        this.isAnimation = false;
        this.isEnableClick = true;
        this.isQueueAnimation = false;
    },

    setIsQueueAnimation:function(iqueue) {
        this.isQueueAnimation = iqueue;
    },
    reloadByID:function(cardID) {
        this.number = Math.floor(cardID / 4);
        this.type = cardID % 4;
        this.id = cardID;
        //logMessage("Reload card by Id:" + cardID + " number:" + this.number + " type:" + this.type);
        if (this.cardImage != null) {
            this.cardImage.removeSelf();
        }
        this.cardImage = null;
        this.initCardImage(this.number, this.type);
    },

    initCardImage: function (number, type) {
        if (type == 0) {
            type =4;
        }
        if(this.cardImage == null)
        {
            this.cardImage = new BkSprite(res.Cards, cc.rect(DELAYX * number + CARD_WIDTH * (number - 1), DELAYY * type + CARD_HEIGHT * (type - 1), CARD_WIDTH, CARD_HEIGHT));
        }
        this.cardImage.x = CARD_WIDTH / 2;
        this.cardImage.y = CARD_HEIGHT / 2;
        //this.cardImage.width = CARD_WIDTH;
        //this.cardImage.height = CARD_HEIGHT;
        this.width = CARD_WIDTH;
        this.height = CARD_HEIGHT;
        this.addChild(this.cardImage);
        //this.initSubTypeWithGameID(BkGlobal.currentGameID);
    },
    initSubType:function(){
        this.subTypeImage = this.getSubTypeImage();
        if (this.subTypeImage != null){
            this.subTypeImage.x = 45;
            this.subTypeImage.y = 95;
            this.addChild(this.subTypeImage);
        }
    },
    initSubTypeWithGameID:function(gid){
        var isInitSubType = false;
        switch (gid){
            case GID.XAM:
            case GID.TLMN_DEM_LA:
            case GID.PHOM:
                isInitSubType = true;
                break;
        }

        if ((this.number<1) || (this.number > 13)){
            isInitSubType = false;
        }

        if (isInitSubType){
            this.subTypeImage = this.getSubTypeImage();
            if (this.subTypeImage != null){
                this.subTypeImage.x = 45;
                this.subTypeImage.y = 95;
                this.addChild(this.subTypeImage);
            }
        }
    },

    getSubTypeImage:function(){
        var mW = 24;
        var mH = 22;
        var delta = 1;
        var rect = null;
        switch (this.type){
            case RO:
                rect = cc.rect(delta,0,mW,mH);
                break;
            case CO:
                rect = cc.rect(delta + mW,0,mW,mH);
                break;
            case BICH:
                rect = cc.rect(delta + 2* mW,0,mW,mH);
                break;
            case NHEP:
                rect = cc.rect(delta + 3 * mW,0,mW,mH);
                break;
        }
        if (rect == null){
            return null;
        }
        return new BkSprite(res.chat_nho,rect);
    },
    initCardBackMask:function()
    {
        if(this.cardBackMask == null)
        {
            this.cardBackMask = new BkSprite(res.Cards, cc.rect(DELAYX * 14 + CARD_WIDTH * (14 - 1), DELAYY * 1 + CARD_HEIGHT * (1 - 1), CARD_WIDTH, CARD_HEIGHT));
            this.addChild(this.cardBackMask,100);
        }
        this.cardBackMask.x = CARD_WIDTH / 2;
        this.cardBackMask.y = CARD_HEIGHT / 2;
        this.cardBackMask.width = CARD_WIDTH;
        this.cardBackMask.height = CARD_HEIGHT;
        this.cardBackMask.visible = true;
    },
    setCallBackMoveFinish:function(cb){
        this.cbMoveFinish =cb;
    },
    removeCardBackMask:function()
    {
       if(this.cardBackMask != null)
       {
           this.cardBackMask.removeFromParent();
           this.cardBackMask = null;
       }
    },
    initCardSelectedMask:function()
    {
        if(this.selectedMask == null)
        {
            this.selectedMask = new BkSprite("#"+res_name.card_mask);
            //this.selectedMask = new BkSprite(res.card_black_mask);
            this.addChild(this.selectedMask);
        }
        this.selectedMask.x = CARD_WIDTH / 2 - 1;
        this.selectedMask.y = CARD_HEIGHT / 2;
        this.selectedMask.width = CARD_WIDTH -2;
        this.selectedMask.height = CARD_HEIGHT;
        this.selectedMask.visible = true;
    },

    removeBlackMask:function () {
        if(this.blackMask != null) {
            this.blackMask.removeFromParent();
            this.blackMask = null;
        }
    },

    isShowBlackMask:function() {
        return (this.blackMask != null);
    },

    showBlackMask:function() {
        this.removeBlackMask();
        this.blackMask = new BkSprite("#" + res_name.card_black_mask);
        this.blackMask.x = CARD_WIDTH / 2;
        this.blackMask.y = CARD_HEIGHT / 2;
        this.addChild(this.blackMask);
    },

    hideSelectedMask:function()
    {
        if(this.selectedMask != null)
        {
            this.selectedMask.visible = false;
        }
    },
    _initEventListener: function () {
        var self = this;
        //logMessage("_initEventListener" + this.id);
        this.onHoverListener = this.createHoverEvent();
        cc.eventManager.addListener(this.onHoverListener, this);
            this.OnClickListener = this.createTouchEvent(function(touch, event){
                var target = event.getCurrentTarget();
                //target.OnCardMouseClick();
                BkLogicManager.getInGameLogic().processCardClickEvent(target);

            },function(touch, event){
            },function(touch, event){
            });
            cc.eventManager.addListener(this.OnClickListener, this);
    },
    initDragDropEventListener:function(callbackTouchBegan,callbackTouchEnd,callbackTouchMove,dt){
        //this.isDragMode = true;
        //logMessage("initDragDropEventListener cardId" + this.id);
        this.removeEventHoverAndClick();
        var delta = 10;
        if(dt != undefined && dt >= 0)
        {
            delta = dt;
        }
        var beginTouchPoint = null;
        var beginTime = 0;
        var deltaTime = 0;
        this.onHoverListener = this.createHoverEvent();
        cc.eventManager.addListener(this.onHoverListener, this);

        this.onDragDropListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    //cc.log("sprite began... x = " + target.x + ", y = " + target.y + " id "+target.id);
                    //target.opacity = 180;
                    if (callbackTouchBegan!= undefined){
                        if (callbackTouchBegan != null){
                            callbackTouchBegan(target);
                        }
                    }
                    beginTouchPoint = cc.p(target.x,target.y);
                    return true;
                }
                return false;
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var delta1 = touch.getDelta();
                target.x += delta1.x;
                target.y += delta1.y;
                //logMessage("target ["+target.x+" - "+target.y+"] - beginTouchPoint: ["+beginTouchPoint.x+" - "+beginTouchPoint.y+"]");
                if ((Math.abs(target.x - beginTouchPoint.x)>delta) || (Math.abs(target.y - beginTouchPoint.y)>delta)){
                    if (callbackTouchMove!= undefined){
                        if (callbackTouchMove != null){
                            callbackTouchMove(target,true);
                        }
                    }
                }
            },
            onTouchEnded: function (touch, event) {
                var curTime = BkTime.GetCurrentTime();
                var target = event.getCurrentTarget();
                //cc.log("sprite onTouchesEnded.. "+target.x+" - "+target.y+ " id "+target.id);
                //target.setOpacity(255);
                if ((Math.abs(target.x - beginTouchPoint.x)>delta) || (Math.abs(target.y - beginTouchPoint.y)>delta)){
                    if (callbackTouchEnd != undefined){
                        if (callbackTouchEnd!= null){
                            callbackTouchEnd(target,target.x,target.y);
                        }
                    }
                } else {
                    if (target.isEnableClick)
                    {
                        //logMessage("is click");
                        target.x = beginTouchPoint.x;
                        target.y = beginTouchPoint.y;
                        BkLogicManager.getInGameLogic().processCardClickEvent(target);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.onDragDropListener, this);
    },
    isSelected:function()
    {
        return (this.cardStatus == this.CARD_STATUS_ONHAND_UP);
    },
    deSelect:function(tag)
    {
        logMessage("deSelect "+this.toString());
        this.cardOnhandMoveDown(tag);
    },
    selectCard:function(tag)
    {
        //logMessage("selectCard "+this.toString());
        this.cardOnhandMoveUp(tag);
    },
    enableEventHoverAndClick:function(){
        this.removeAllEventListener();
        logMessage("enableEventHoverAndClick:" + this.id);
        this._initEventListener();
    },
    removeEventHoverAndClick:function(){
        cc.eventManager.removeListener(this.OnClickListener);
        cc.eventManager.removeListener(this.onHoverListener);
    },
    removeAllEventListener:function()
    {
        cc.eventManager.removeListener(this.OnClickListener);
        cc.eventManager.removeListener(this.onHoverListener);
        if (this.onDragDropListener != null){
            cc.eventManager.removeListener(this.onDragDropListener);
        }
    },
    setMoveHandle:function (handle)
    {
        this.handle = handle;
    },
    setCustomCallbackMouseClick:function(cb){
        this._cbMouseClick = cb;
    },
    OnCardMouseClick:function()
    {
        //logMessage("OnCardMouseClick cardStatus "+this.cardStatus);
        if(this.isAnimation) {
            logMessage("return");
            return;
        }

        if (this._cbMouseClick != null){
            this._cbMouseClick(this);
            return;
        }

        if (this.cardStatus == this.CARD_STATUS_ONHAND_NORMAL) {
            this.selectCard(TAG_SELECT);
        } else {
            this.deSelect(TAG_DESELECT);
        }
    },
    stopAllActionOfCard:function(){
        this.resetQueueAnimation();
        this.stopAllActions();
        this.cardAnimationFinish();
    },
    stopMoveActionNotCallbackFN:function(){
        this.stopActionByTag(this.MOVE_ACTION_TAG);
        if (this.endPointActionMove != null){
            this.x = this.endPointActionMove.x;
            this.y = this.endPointActionMove.y;
        }
    },
    stopMoveAction:function(){
        this.stopMoveActionNotCallbackFN();
        this.cardAnimationFinish();
    },
    cardMoveAndScaleFinish:function()
    {
        this.isAnimation = false;
        this.removeFromParent();
    },
    processNextAnimationInQueue:function(){
        //logMessage("processNextAnimationInQueue");
        if (this.queueAnimation == null){
            this.queueAnimation = [];
            this.isProcessQueueAnimation = false;
        }
        //logMessage("processNextEventInQueue "+ this.qPacket.length);
        if (this.queueAnimation.length > 0){
            this.isProcessQueueAnimation = true;
            var o = this.queueAnimation.shift();
            this.doAnimationMove(o.durationTime, o.xPos, o.yPos, o.tag);
        } else {
            this.isProcessQueueAnimation = false;
        }
    },
    resetQueueAnimation:function(){
        if (this.isQueueAnimation){
            this.queueAnimation = [];
            this.isProcessQueueAnimation = false;
        }
    },
    processQueueAnimation:function(o){
        if (this.queueAnimation == null){
            this.queueAnimation = [];
            this.isProcessQueueAnimation = false;
        }
        this.queueAnimation.push(o);
        var isProcessNext = !this.isProcessQueueAnimation;
        //logMessage("this.queueAnimation.length "+this.queueAnimation.length+" - this.isAnimation: "+this.isAnimation);
        if ((this.queueAnimation.length == 1) && (!this.isAnimation)){
            // trong queue chi co 1 phan tu vua push vao va hien tai card k thuc hien animation nao
            isProcessNext = true;
        }
        if (isProcessNext){
            this.processNextAnimationInQueue();
        }
    },
    move: function (dur, x, y, tag)
    {
        if (this.isQueueAnimation){
            //logMessage("queue animation cardID:"+this.id +"[ "+this.x+","+this.y+"] to ["+x+","+y+"]");
            var o = new BkAnimationCardData(dur, x, y, tag);
            this.processQueueAnimation(o);
            return;
        }
        this.doAnimationMove(dur, x, y, tag);
    },
    doAnimationMove:function(dur, x, y, tag){
        if (this.isAnimation){
            logMessage("stopMoveAction");
            this.stopMoveAction();
        }
        //x = Math.round(x);
        //y = Math.round(y);
        var callback = cc.callFunc(this.cardAnimationFinish, this);
        //var mdelay = cc.delayTime(0.1);
        this.tag = tag;
        var move = cc.moveTo(dur, x, y);
        var sequence = cc.sequence(move,callback);
        sequence.tag = this.MOVE_ACTION_TAG;
        if(this.y != y || this.x != x) {
            //logMessage("do move from ["+this.x+","+this.y+"] to ["+x+","+y+"] cardID:"+this.id);
            this.currentAnimation = new BkAnimationCardData(dur, x, y, tag);
            this.endPointActionMove = cc.p(x,y);
            this.isAnimation = true;
            this.runAction(sequence);
        } else {
            logMessage("x,y not change -> call cardAnimationFinish not run action");
            this.cardAnimationFinish();
        }
    },
    moveAndScale: function (dur, x, y, tag,isAutoRelease,sc)
    {
        //x = Math.round(x);
        //y = Math.round(y);
        var self = this;
        var callback = cc.callFunc(this.cardMoveAndScaleFinish, this,1.2);
        var callback1 = cc.callFunc(function(){
            self.isAnimation= false;
        },this,1.2);
        this.tag = tag;
        var valueScale = 0.5;
        if(sc != undefined)
        {
            valueScale = sc;
        }
        var move = cc.moveTo(dur, x, y);
        var scale = cc.scaleTo(dur,valueScale);
        var mySp = cc.spawn(move,scale);
        var sequence = cc.sequence(mySp, callback);
        if(isAutoRelease != undefined && isAutoRelease == false )
        {
            sequence = cc.sequence(mySp,callback1);
        }
        this.isAnimation = true;
        this.runAction(sequence);
    },
    cardAnimationFinish: function () {
        //logMessage("cardAnimationFinish "+BkTime.GetCurrentTime());
        if (this.cbMoveFinish != null){
            this.cbMoveFinish(this);
        } else {
            //logMessage("cbMoveFinish == null -> not callback");
        }

        if (this.handle != null) {
            this.handle.onFinishAnimationMoveCard(this);
        }

        this.isAnimation = false;
        this.endPointActionMove = null;
        this.currentAnimation = null;

        if (this.isQueueAnimation){
            this.processNextAnimationInQueue();
        }
    },
    cardOnhandMoveUp:function(tag,isMoveupFromCurrentPos)
    {
        var newX = this.x;
        if (this.isAnimation){
            if (this.currentAnimation != null){
                newX = this.currentAnimation.xPos;
            }
        }
        var newY = YPOS_ONHAND_UP;
        if (isMoveupFromCurrentPos != undefined){
            if (isMoveupFromCurrentPos){
                newY = this.y + 15;
            }
        }

        if (tag == undefined){
            tag = "";
        }
        this.tag = tag;
        this.cardStatus = this.CARD_STATUS_ONHAND_UP;
        this.move(0.1,newX,newY,tag);
        this.showBackMask(false);
        this.showMask(true);
    },

    cardOnhandMoveDown:function(tag,isMovedownFromCurrentPos)
    {
        if (tag == undefined){
            tag = "";
        }
        var newX = this.x;
        if (this.isAnimation){
            if (this.currentAnimation != null){
                newX = this.currentAnimation.xPos;
            }
        }
        var newY = YPOS_ONHAND_DOWN;
        if (isMovedownFromCurrentPos != undefined){
            if (isMovedownFromCurrentPos){
                newY = this.y -15;
            }
        }
        this.tag = tag;
        this.cardStatus = this.CARD_STATUS_ONHAND_NORMAL;
        this.move(0.1,newX,newY,tag);
        this.showBackMask(false);
        this.showMask(false);
    },

    setEnableClick:function(isEnable)
    {
      this.isEnableClick = isEnable;
    },
    setSelectable:function(isSelectable)
    {
        this.isSelectable = isSelectable;
        if(!isSelectable)
        {
            this.removeAllEventListener();
        }else
        {
            //logMessage("set Selectable card:" + this.id);
            this.removeAllEventListener();
            this._initEventListener();
        }
    },

    showMask:function(isShown)
    {
        if(this.selectedMask == null)
        {
            this.initCardSelectedMask();
        }
        this.selectedMask.visible = isShown;
    },
    showBackMask:function(isShown) {
        if (isShown) {
            if (this.cardBackMask == null) {
                this.initCardBackMask();
            }
            this.cardBackMask.visible = true;
        } else {
            this.removeCardBackMask();
        }
    },

    setSize: function (width, height) {
        this._windowSize = cc.size(width, height);
    },
    encode:function()
    {
        return this.number * 4 + this.type;
    },
    getNumber: function () {
        return this.number;
    },
    getType: function () {
        return this.type;
    },
    showTakenMask:function(){
        if(this.takenMask == null) {
            this.takenMask = new BkSprite("#" + res_name.EatCard_IMG);
            this.addChild(this.takenMask);
        }

        //this.takenMask.setScale((CARD_WIDTH + 6)/CARD_WIDTH,(CARD_HEIGHT + 6)/CARD_HEIGHT);
        this.takenMask.x = this.takenMask.getContentSize().width / 2;
        this.takenMask.y = this.takenMask.getContentSize().height / 2;
        this.takenMask.visible = true;
    },

    unShowTakenMask:function(){
        if(this.takenMask != null)
        {
            this.takenMask.visible = false;
        }
    },
    setCardStatus:function(newStt,isMe){

        if (isMe == undefined){
            isMe = false;
        }
        logMessage("setCardStatus "+newStt + " isMe "+isMe);
        this.cardUIStatus = newStt;
        switch (this.cardUIStatus){
            case CARD_STATUS_TAKEN:
                if (!isMe){
                    this.setScale(PHOM_CARD_SCALE_INGAME);
                } else {
                    this.setScale(1);
                }
                this.showTakenMask();
                break;
            case CARD_STATUS_CURRENT:
                if (!isMe){
                    this.setScale(PHOM_CARD_SCALE_INGAME_CURRENT_CARD);
                } else {
                    this.setScale(1);
                }
                break;
        }
    },
    toString:function(){
        //var rtn = "[number: "+this.number+" - type: "+this.type+" satus: "+this.cardStatus+"]";
        return "[cardID: "+this.encode()+" - number: "+this.number+" - type: "+this.type+" satus: "+this.cardStatus
            +" - y:"+this.y+ "]";
    },
    doFlipAnimation:function(){
        var time = 0.1;
        var actionBy = cc.rotateBy(time, 0, -5);
        var self = this;
        var callback = cc.callFunc(function(){
            self.setRotation(0);
            self.showBackMask(false);
        }, this);
        this.runAction(cc.sequence(actionBy,callback));
    }
});
