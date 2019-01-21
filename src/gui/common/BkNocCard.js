/**
 * Created by bs on 16/05/2017.
 */
BkNocCard = BkSprite.extend({
    OPACITY_HOVER:122,
    durShowNoc:0.2,
    MIN_DURATION:0.2,
    MAX_DELAY_DURATION:0.2,
    MAX_LENGTH_BAIU:400,
    baiUNoc:[],
    btnShowNoc:null,
    baiNoc:null,
    startX:0,
    eventQueue:[],
    isAnimation:false,
    isHover:false,
    isOut:false,
    isHiding:false,
    ctor:function (nocCards) {
        this._super();
        this.baiUNoc = nocCards;
        this.eventQueue = [];
        this.isAnimation = false;
        this.initNocCard();
    },

    updatePosYTextXemNoc:function () {
        this.btnShowNoc.getTitleRenderer().y += 3;
    },
    isOutBtnShowNoc:function(){
        if (!this.isOut){
            return true;
        }
    },

    isHoverBtnShowNoc:function(){
        if (!this.isHover){
            return true;
        }
        var curOpa = this.btnShowNoc.getOpacity();
        if ((curOpa == this.OPACITY_HOVER) && (!this.baiNoc.visible)){
            return true;
        }
        return false;
    },
    initNocCard:function(){
        this.btnShowNoc = createBkButtonPlistNewTitle(res_name.btn_xemnoc, res_name.btn_xemnoc_press, res_name.btn_xemnoc,
            res_name.btn_xemnoc_hover,"Xem nọc",0,0);

        this.btnShowNoc.setTitleFontName("BRUSHSBI");
        var fontsize = 20;
        this.btnShowNoc.setTitleFontSize(fontsize);

        this.addChild(this.btnShowNoc);
        var self = this;
        var myEv = this.btnShowNoc.createHoverEvent(function(){
                self.isOut = false;
                if (self.isHoverBtnShowNoc()){
                    self.isHover = true;
                    self.onHoverShowNoc();
                }
        },function(){
                self.isHover = false;
                if (self.isOutBtnShowNoc()){
                    self.isOut = true;
                    self.onOutShowNoc();
                }

        });
        cc.eventManager.addListener(myEv, this.btnShowNoc);
        this.startX = this.btnShowNoc.x;
        this.baiNoc = new BkSprite();
        this.addChild(this.baiNoc);
        var i;
        for (i =0 ;i<this.baiUNoc.length;i++){
            var cCa= this.baiUNoc[i];
            cCa.x = this.btnShowNoc.x;
            cCa.y = this.btnShowNoc.y + 70;
            cCa.visible = false;
            this.baiNoc.addChild(cCa);
        }
    },
    ShowNocCard:function(){
        var self = this;
        if (this.baiUNoc!=null && this.baiUNoc.length > 0){
            var cCa1 = this.baiUNoc[0];
            var cardSize = CCard.BW_CARD_1 - CConstIngame.DELTA_X;
            var numOfCard = this.baiUNoc.length;
            if (cardSize * numOfCard > this.MAX_LENGTH_BAIU ) {
                cardSize = this.MAX_LENGTH_BAIU / numOfCard;
            }

            for (var i =0 ;i<this.baiUNoc.length;i++)
            {
                cCa1= this.baiUNoc[i];
                var f = null;
                if (i == this.baiUNoc.length -1){
                    f = function(){
                        self.Process();
                    }
                }
                cCa1.visible = true;
                var newX = this.startX+ i* cardSize + 1;
                cCa1.moveFromTo(this.startX,newX,cCa1.y,cCa1.y,this.durShowNoc,f);
            }
        }
    },
    HideNocCard:function(){
        this.isHiding = true;
        var self = this;
        if (this.baiUNoc!=null){
            for (var i =0 ;i<this.baiUNoc.length;i++)
            {
                var cCa2= this.baiUNoc[i];
                var f = null;
                if (i == this.baiUNoc.length -1){
                    f = function(){
                        self.isHiding = false;
                        self.Process();
                        if (self.eventQueue.length == 0){
                            self.baiNoc.visible = false;
                        }
                    }
                }
                cCa2.visible = true;
                cCa2.moveFromTo(cCa2.x,this.startX,cCa2.y,cCa2.y,this.durShowNoc,f);
            }
        }
    },
    ProcessNextEvent:function(event){
        var currentTime = BkTime.GetCurrentTime();

        if (event.eventType == 1) {
            // Roll Over
            this.ShowNocCard();
        } else {
            // Roll Out
            this.HideNocCard();
        }
    },
    Process:function(){
        if (this.eventQueue.length > 0) {
            var event= this.eventQueue[0];
            this.eventQueue.splice(0,1);

            // Loai bo bot event neu co qua nhieu event trong queue
            if (event.eventType == 1 && this.eventQueue.length >=1) {
                // Neu thoi gian move chuot qua ngan
                var currentTime = BkTime.GetCurrentTime();
                var nextEvent = this.eventQueue[0];
                if (nextEvent.eventType ==2 && ((nextEvent.eventTimer - event.eventTimer < this.MIN_DURATION) || (currentTime - event.eventTimer > this.MAX_DELAY_DURATION))) {
                    this.eventQueue.splice(0,1);
                    this.Process();
                    return;
                }
            }

            this.isAnimation = true;
            this.ProcessNextEvent(event);
        } else {
            this.isAnimation = false;
        }
    },
    QueueEvent:function(event)
    {
        this.eventQueue.push(event);
        if (!this.isAnimation) {
            this.Process();
        }
    },
    onHoverShowNoc:function(){
        this.baiNoc.visible = true;
        this.btnShowNoc.setOpacity(this.OPACITY_HOVER);
        this.QueueEvent(new BkQueueEvent(1));
    },
    onOutShowNoc:function(){
        this.btnShowNoc.setOpacity(255);
        this.QueueEvent(new BkQueueEvent(2));
    }
});