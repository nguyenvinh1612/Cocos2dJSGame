/**
 * Created by bs on 04/05/2017.
 */

if(typeof CCard == "undefined")  {
    var CCard = {};

    CCard.CARD_STATUS_INIT 				= 0;

    CCard.CARD_STATUS_ONHAND_NORMAL		= 1;
    CCard.CARD_STATUS_ONHAND_UP			= 3;
    CCard.CARD_STATUS_ONTABLE_BOC			= 100;
    CCard.CARD_STATUS_ONTABLE_DANH		= 101;
    CCard.CARD_STATUS_ONTABLE_U			= 102;
    CCard.CARD_STATUS_ONTABLE_CHIU		= 103; // 4 cards an chiu
    CCard.CARD_STATUS_ONTABLE_CURRENT		= 104;
    CCard.CARD_STATUS_ONTABLE_SHOWU		= 105;

    CCard.CARD_SIZE_NORMAL_WIDTH 		= 32;
    CCard.CARD_SIZE_ON_HAND_WIDTH 		= 40;
    CCard.CARD_SIZE_NORMAL_HEIGHT 		= 118.4;
    CCard.CARD_SIZE_ON_HAND_HEIGHT 	    = 148;
    CCard.CARD_SIZE_U_HEIGHT 			= 130;

    // Client Encode:
    CCard.CLIENT_VAWN = 1;
    CCard.CLIENT_SACH = 2;
    CCard.CLIENT_VANJ = 3;
    CCard.CLIENT_CHICHI = 0;

    CCard.SERVER_VAWN =0;
    CCard.SERVER_VANJ =1;
    CCard.SERVER_SACH =2;
    CCard.SERVER_CHICHI = 10;

    CCard.BW_CARD					= 80;
    CCard.BH_CARD					= 296;
    // Rectangle card intable
    CCard.BW_CARD_1				= 32;
    CCard.BH_CARD_1				= 118.4;
    CCard.CARD_WIDTH            = CCard.BW_CARD_1;
    CCard.CARD_HEIGHT           = CCard.BH_CARD_1;
    CCard.BASE_HEIGHT 					= CCard.BH_CARD;

    CCard.DEGREES_PER_CARD 		= 12;
    CCard.MOVE_TAG              =101010;
}

BkChanCard = BkSprite.extend({
    CardId:0,
    CardStatus:0,
    CardImage:null,
    IsAnimation:false,
    isDoingXoequat:false,
    //isFinishXoequat:false,
    CenterPoint:null,
    Radius:0,
    maskSpriteOnHandUp:null,
    maskSpriteOnTableBoc:null,
    onHoverListener:null,
    OnClickListener:null,
    player:null,
    lastCallbackFN:null,
    lastMoveAction:null,
    uMaskSprite:null,
    storeMoveAction:null,
    cbXoeQuatFN:null,
    listAction:[],
    ctor: function (serverID) {
        this._super();
        this.CardId = this.ClientEncode(serverID);
        //this.CardStatus = CCard.CARD_STATUS_ONHAND_NORMAL;
        this.initCardImage();
        this.initMask();
    },
    getName:function(){
        logMessage("implement laster if need");
    },
    getRectCardByID:function(){
        var xPos = 0;
        var yPos = 0;
        var cNumber = this.getCardNumber();
        if (cNumber == 0||cNumber == 2||cNumber == 3||cNumber == 4||cNumber == 5){
            yPos = 0;
        } else {
            yPos = CCard.BH_CARD;
        }

        // client Type
        //logMessage("this.CardId: "+this.CardId);
        var cType = this.CardId % 10;
        //logMessage("cNumber "+cNumber+" cType "+cType);
        if (cNumber != 0){
            if (cNumber<=5){
                if (cType == CCard.CLIENT_VAWN){
                    xPos = (cNumber-2)*3*CCard.BW_CARD + CCard.BW_CARD;
                }

                if (cType == CCard.CLIENT_SACH){
                    xPos = (cNumber-2)*3*CCard.BW_CARD + 3*CCard.BW_CARD;
                }

                if (cType == CCard.CLIENT_VANJ){
                    xPos = (cNumber-2)*3*CCard.BW_CARD + 2*CCard.BW_CARD;
                }
            } else {
                if (cType == CCard.CLIENT_VAWN){
                    xPos = (cNumber-6)*3*CCard.BW_CARD;
                }

                if (cType == CCard.CLIENT_SACH){
                    xPos = (cNumber-6)*3*CCard.BW_CARD + 2*CCard.BW_CARD;
                }

                if (cType == CCard.CLIENT_VANJ){
                    xPos = (cNumber-6)*3*CCard.BW_CARD + 1*CCard.BW_CARD;
                }
            }

        }
        //logMessage("xPos "+xPos+" yPos "+yPos);
        return cc.rect(xPos,yPos,CCard.BW_CARD,CCard.BH_CARD);
    },
    SetSize:function(MaxHeight)
    {
        this.setScale(MaxHeight/CCard.BASE_HEIGHT);
    },
    initCardImage:function(){
        //logMessage("initCardImage");
        if(this.cardImage == null) {
            if (this.CardId == -10){
                this.cardImage = new BkSprite(res.chan_chia);
            } else if (this.CardId == -11){
                this.cardImage = new BkSprite(res.chan_1_re);
            } else if (this.CardId == -12){
                this.cardImage = new BkSprite(res.chan_2_re);
            } else if (this.CardId == -13){
                this.cardImage = new BkSprite(res.chan_3_re);
            } else if (this.CardId == -14){
                this.cardImage = new BkSprite(res.chan_4_re);
            } else if (this.CardId == -15){
                this.cardImage = new BkSprite(res.chan_5_re);
            } else if (this.CardId == -16){
                this.cardImage = new BkSprite(res.CB);
            } else {
                this.cardImage = new BkSprite(res.CHAN_Cards,this.getRectCardByID());
            }

        }
        this.cardImage.x = CCard.BW_CARD / 2;
        this.cardImage.y = CCard.BH_CARD / 2;
        this.width = CCard.BW_CARD;
        this.height = CCard.BH_CARD;
        this.SetSize(CCard.CARD_HEIGHT);
        this.addChild(this.cardImage);
    },
    getCardNumber:function() {
        return  Math.floor(this.CardId / 10);
    },
    ServerEncode:function() {
        var number;
        var type;
        // Check if is chi chi - direct return
        if (this.CardId == 0) {
            return 40;
        }
        number =  Math.floor(this.CardId / 10);
        type = this.CardId % 10;
        type = this.convertTypeClientToServer(type);
        return number * 4 + type;
    },

    ClientEncode:function(serverID) {
        // Check if is chi chi - direct return
        if (serverID<0){
            return serverID;
        }
        if (serverID == 40) {
            return 0;
        }
        var number;
        var type;
        number = Math.floor(serverID / 4);
        type = serverID % 4;
        type = this.convertTypeServerToClient(type);
        return number * 10 + type;
    },
    // get set Card Type, Card Name
    getCardStatus:function(){
        return this.CardStatus;
    },
    getServerCardID:function() {
        return this.ServerEncode();
    },
    getCardId:function()
    {
        return this.CardId;
    },
    convertTypeClientToServer:function(type) {
        switch(type)
        {
            case CCard.CLIENT_VAWN:
                return CCard.SERVER_VAWN;
            case CCard.CLIENT_SACH:
                return CCard.SERVER_SACH;
            case CCard.CLIENT_VANJ:
                return CCard.SERVER_VANJ;
        }
        return -1;
    },
    convertTypeServerToClient:function(type) {
        switch(type)
        {
            case CCard.SERVER_VAWN:
                return CCard.CLIENT_VAWN;
            case CCard.SERVER_SACH:
                return CCard.CLIENT_SACH;
            case CCard.SERVER_VANJ:
                return CCard.CLIENT_VANJ;
        }
        return -1;
    },
    OnHandCardRotate:function(anphaCard, cPoint, radius,isAnimation){
        this.Radius = radius;
        this.CenterPoint = cPoint;
        this.IsAnimation = isAnimation;
        //this.CardStatus = CCard.CARD_STATUS_ONHAND_NORMAL;
        this.x = cPoint.x;
        this.y = cPoint.y;
        this.visible = true;
        //logMessage("x "+this.x+" y"+this.y + " anphaCard:"+anphaCard);
        // no animation
        if (!isAnimation){
            this.setRotation(anphaCard);
            this.x = this.CenterPoint.x + this.Radius * Math.sin(Math.PI * anphaCard / 180);
            this.y = this.CenterPoint.y + this.Radius * Math.cos(Math.PI * anphaCard / 180);
            return;
        }
        //TODO: animation xoe quat
        this.isDoingXoequat = true;
        this.scheduleUpdate();
        var rotate = cc.rotateTo(1,anphaCard);
        var callback = cc.callFunc(this.rotateFinish, this);
        var sequence = cc.sequence(rotate,callback);
        sequence.setTag(CCard.MOVE_TAG);
        this.runAction(sequence);
    },
    rotateFinish:function(){
        // logMessage("rotateFinish");
        this.isDoingXoequat = false;
        this.IsAnimation = false;
    },
    update:function(){
        if (this.isDoingXoequat){
            this.x = this.CenterPoint.x + this.Radius * Math.sin(Math.PI * this.getRotation() / 180);
            this.y = this.CenterPoint.y + this.Radius * Math.cos(Math.PI * this.getRotation() / 180);
        } else  {
            // logMessage("! isDoingXoequat -> unscheduleUpdate");
            this.unscheduleUpdate();
            if (this.cbXoeQuatFN != null){
                this.cbXoeQuatFN();
                this.cbXoeQuatFN = null;
            }
            if (this.storeMoveAction!= null){
                logMessage("this.storeMoveAction!= null -> recall moveAction");
                this.moveTo(this.storeMoveAction.xPos,this.storeMoveAction.yPos
                    ,this.storeMoveAction.durationTime,this.storeMoveAction.fnCallback);
                this.storeMoveAction = null;
            }
        }
    },
    setCallbackXoeQuatFinish:function (cb) {
        this.cbXoeQuatFN = cb;
    },
    // status for card
    setCardStatus:function(newStatus){
        this.finishCurrentAnimation();
        //if (this.CardStatus == newStatus) {
        //    return;
        //}
        this.CardStatus = newStatus;
        switch (this.CardStatus) {
        case CCard.CARD_STATUS_INIT:
            this.SetSize(CCard.CARD_SIZE_ON_HAND_HEIGHT);
            this.SetMoveable(false);
        break;

        case CCard.CARD_STATUS_ONHAND_NORMAL:
        case CCard.CARD_STATUS_ONHAND_UP:
            this.SetSize(CCard.CARD_SIZE_ON_HAND_HEIGHT);
            this.SetMoveable(true);
        break;
        case CCard.CARD_STATUS_ONTABLE_BOC:
        case CCard.CARD_STATUS_ONTABLE_DANH:
        case CCard.CARD_STATUS_ONTABLE_CHIU:
            this.setRotation(0);
            this.SetSize(CCard.CARD_SIZE_NORMAL_HEIGHT);
            this.SetMoveable(false);
        break;

        case CCard.CARD_STATUS_ONTABLE_U:
            this.SetSize(CCard.CARD_SIZE_U_HEIGHT);
            this.SetMoveable(false);
        break;

        case CCard.CARD_STATUS_ONTABLE_SHOWU:
            this.SetSize(CCard.CARD_SIZE_ON_HAND_HEIGHT);
            this.SetMoveable(false);
        break;
        }

        this.MaskCardWithStatus();
    },
    initMask:function() {
        var colorMaskOnHandUp = cc.color(51,204,255,50);//0x33CCFF;
        var colorMaskOnTableBoc = cc.color(0,0,0,50);//0x000000;
        var widMask = CCard.BW_CARD;
        var heiMask = CCard.BASE_HEIGHT;
        //logMessage("widMask "+widMask+" heiMask "+heiMask);
        var xPos = 0;//-CCard.CARD_WIDTH/2;
        var yPos = 0;//-CCard.CARD_HEIGHT/2;
        if (this.maskSpriteOnHandUp == null){
            this.maskSpriteOnHandUp = new cc.DrawNode();
            this.maskSpriteOnHandUp.drawRect(cc.p(xPos, yPos),cc.p(widMask,heiMask),colorMaskOnHandUp,1,colorMaskOnHandUp);
            this.addChild(this.maskSpriteOnHandUp);
        }
        if (this.maskSpriteOnTableBoc == null){
            this.maskSpriteOnTableBoc = new cc.DrawNode();
            this.maskSpriteOnTableBoc.drawRect(cc.p(xPos, yPos),cc.p(widMask,heiMask),colorMaskOnTableBoc,1,colorMaskOnTableBoc);
            this.addChild(this.maskSpriteOnTableBoc);
        }

        if (this.uMaskSprite == null){
            this.uMaskSprite = new BkSprite(res.uMaskCard);
            this.uMaskSprite = new BkSprite(res.uMaskCard);
            this.uMaskSprite.x = CCard.BW_CARD / 2;
            this.uMaskSprite.y = CCard.BH_CARD / 2;
            this.uMaskSprite.y = CCard.BH_CARD / 2;
            this.addChild(this.uMaskSprite);
        }
        this.hideAllMask();
    },
    hideAllMask:function(){
        if (this.maskSpriteOnHandUp!= null){
            this.maskSpriteOnHandUp.setVisible(false);
        }
        if (this.maskSpriteOnTableBoc!= null){
            this.maskSpriteOnTableBoc.setVisible(false);
        }
        if (this.uMaskSprite != null){
            this.uMaskSprite.setVisible(false);
        }
    },
    MaskCardWithStatus:function() {
        this.hideAllMask();
        switch (this.CardStatus) {
            case CCard.CARD_STATUS_ONHAND_NORMAL:
            case CCard.CARD_STATUS_ONTABLE_DANH:
        break;
        case CCard.CARD_STATUS_ONTABLE_BOC:
            this.maskSpriteOnTableBoc.setVisible(true);
        break;
        case CCard.CARD_STATUS_ONHAND_UP:
        case CCard.CARD_STATUS_ONTABLE_CHIU:
            this.maskSpriteOnHandUp.setVisible(true);
        break;
        case CCard.CARD_STATUS_ONTABLE_U:
            this.maskSpriteOnTableBoc.setVisible(true);
            this.showAnimationUCard();
        break;
        }
    },
    setPlayer:function(player)
    {
        this.player = player;
    },
    isRedCard:function() {
        switch (this.CardId) {
            case 82:
            case 83:
            case 92:
            case 93:
            case 0:
                return true;
        }
        return false;
    },
    // handle move card
    SetMoveable:function(isMoveable){
        //this.setSelectable(isMoveable);
        this.removeEventHoverAndClick();
        if (isMoveable){
            this.initEventListener();
        }
    },
    removeClickEvent:function(){
        cc.eventManager.removeListener(this.OnClickListener);
    },
    createCustomEventClick:function(onClickCallback){
        var self = this;
        this.OnClickListener = this.createTouchEvent(function(touch, event){
            if (onClickCallback){
                onClickCallback(self);
            }
        },function(touch, event){
        },function(touch, event){
        });
        cc.eventManager.addListener(this.OnClickListener, this);
    },
    initEventListener: function () {
        //logMessage("initEventListener");
        //this.onHoverListener = this.createHoverEvent();
        //cc.eventManager.addListener(this.onHoverListener, this);

        this.OnClickListener = this.createTouchEvent(function(touch, event){
            var target = event.getCurrentTarget();
            //target.OnCardMouseClick();
            BkLogicManager.getInGameLogic().processCardClickEvent(target);

        },function(touch, event){
        },function(touch, event){
        });
        cc.eventManager.addListener(this.OnClickListener, this);
    },
    removeEventHoverAndClick:function(){
        cc.eventManager.removeListener(this.OnClickListener);
        cc.eventManager.removeListener(this.onHoverListener);
    },
    isOnHandUp:function()
    {
        return (this.CardStatus == CCard.CARD_STATUS_ONHAND_UP);
    },
    moveTo:function(newX,newY,dur,cbFn){
        logMessage("card "+this.CardId+" newX:"+newX+" newY:"+newY);
        this.moveFromTo(this.x,newX,this.y,newY,dur,cbFn);
    },

    createActionMoveFromTo:function(x, newX,y,newY,dur,cbFn){
        if (cbFn == undefined){
            cbFn =  null;
        }
        this.x = x;
        this.y = y;
        var callback = cc.callFunc(function onMoveFN(){
            if (cbFn){
                cbFn();
            }
        });
        var move = cc.moveTo(dur, newX, newY);
        var sequence = cc.sequence(move,callback);
        // var self = this;
        // var rtnFunc =  cc.callFunc(function onMoveFN(){
        //     self.runAction(sequence);
        // });
        return sequence;
    },
    delayRunaction:function(action,timeDelay){
        var sq = cc.sequence(cc.delayTime(timeDelay),action);
        this.runAction(sq);
    },
    moveFromTo:function(x, newX,y,newY,dur,cbFn){
        if (this.isDoingXoequat){
            // dang animation xoe quat -> wait xoe quat finish roi goi lai animation
            logMessage("this.isDoingXoequat ->store animation");
            this.storeMoveAction = new BkAnimationCardData(dur, newX, newX, -1);
            this.storeMoveAction.fnCallback = cbFn;
            return;
        }

        if (this.IsAnimation){
            this.finishCurrentAnimation();
            if (this.lastMoveAction != null){
                this.x = this.lastMoveAction.x;
                this.y = this.lastMoveAction.y;
            }
            if (this.lastCallbackFN != null){
                this.lastCallbackFN();
            }
        }
        if (cbFn == undefined){
            cbFn =  null;
        }
        this.lastCallbackFN = cbFn;
        this.lastMoveAction = new BkAnimationCardData(dur, newX, newX, -1);
        if ((x == newX)&&(y == newY)){
            this.IsAnimation = false;
            if (cbFn){
                cbFn();
            }
            return;
        }
        var self = this;
        //this.setRotation(0);
        this.x = x;
        this.y = y;
        var callback = cc.callFunc(function onMoveFN(){
            self.lastCallbackFN = null;
            self.lastMoveAction = null;
            self.IsAnimation = false;
            if (cbFn){
                cbFn();
            }
        }, this);
        var move = cc.moveTo(dur, newX, newY);
        var sequence = cc.sequence(move,callback);
        this.isAnimation = true;
        this.runAction(sequence);
    },
    CardOnhandMoveDown:function(isAnimation)
    {
        if (isAnimation == undefined){
            isAnimation = true;
        }
        var newX = this.CenterPoint.x + this.Radius * Math.sin(Math.PI * this.getRotation() / 180);
        var newY = this.CenterPoint.y + this.Radius * Math.cos(Math.PI * this.getRotation() / 180);
        if (isAnimation){
            this.moveFromTo(this.x, newX,this.y,newY,0.1);
        } else {
            logMessage("CardOnhandMoveDown !isAnimation");
            this.x = newX;
            this.y = newY;
        }

        this.CardStatus = CCard.CARD_STATUS_ONHAND_NORMAL;
        this.MaskCardWithStatus();
    },
    CardOnhandMoveUp:function(){
        var newX = this.CenterPoint.x + (this.Radius + 20) * Math.sin(Math.PI * this.getRotation() / 180);
        var newY = this.CenterPoint.y + (this.Radius + 20) * Math.cos(Math.PI * this.getRotation() / 180);
        this.moveFromTo(this.x, newX,this.y,newY,0.1);
        this.CardStatus = CCard.CARD_STATUS_ONHAND_UP;
        this.MaskCardWithStatus();
    },
    OnCardMouseClick:function()
    {
        if (this.player == null) {
            return;
        }
        if (this.IsAnimation) {
            return;
        }
        this.player.OnHandMouseUp(this);

    },
    showAnimationUCard:function() {
        if (this.uMaskSprite != null){
            this.uMaskSprite.setVisible(true);
        }
    },
    finishCurrentAnimation:function(){
        this.stopAllActions();
    },
    addActionMoveFromTo:function(x, newX,y,newY,dur,cb){
        var cbFunc = cc.callFunc(function onMoveFN(){
            if (cb){
                cb();
            }
        });
        this.x = x;
        this.y = y;
        var move = cc.moveTo(dur, newX, newY);
        //var sq = cc.sequence(move,cbFunc);
        //this.listAction.push(sq);
        this.listAction.push(move);
        this.listAction.push(cbFunc);
    },
    addActionCallback:function (cb,target) {
        var rtnFunc =  cc.callFunc(function onMoveFN(){
            if (cb){
                cb(target);
            }
        });
        this.listAction.push(rtnFunc);
    },
    runListAction:function () {
        this.runAction(cc.sequence(this.listAction))
    }
});