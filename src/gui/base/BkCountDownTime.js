/**
 * Created by bs on 01/10/2015.
 */
var TIME_ONTICK_CDT = 0.1;
var ALARM_TIMER = 15;
BkCountDownTime = cc.ProgressTimer.extend({
    greenSp:null,
    yellowSp:null,
    redSp:null,
    callback:null,
    alarmCallBack: null,
    alarmPercentage: null,
    timeCount:0,
    numberCount:300,
    lightSprite:null,
    centerPoint:null,
    wSp:0,
    hSp:0,
    BanKinh:0,
    ctor:function (greenFrame) {
        //this.greenSp = new BkSprite(greenFrame);
        this.greenSp = new BkSprite("#vv_circle.png");
        this._super(this.greenSp);
        this.type = cc.ProgressTimer.TYPE_RADIAL;
        this.x = this.greenSp.getWidth()/2;
        this.y = this.greenSp.getHeight()/2;
        this.setReverseProgress(true);

        if(!BkGlobal.isGameCo())
        {
            this.lightSprite = new BkSprite("#"+res_name.lightdot);
            this.lightSprite.x = this.greenSp.getWidth()/2;
            this.lightSprite.y = this.greenSp.getHeight();
            this.lightSprite.visible = false;
            this.addChild(this.lightSprite);
        }
        this.wSp = 89;//this.greenSp.getWidth();
        this.hSp = 89;//this.greenSp.getHeight();
        this.centerPoint = cc.p(this.wSp/2,this.hSp/2);

        this.BanKinh = this.wSp / 2 - 2;
    },
    setCallback:function(f){
        this.callback = f;
    },
    setAlarmCallBack: function(f){
        this.alarmCallBack = f;
    },
    showCountDown:function(time){
        this.alarmPercentage = Math.floor(ALARM_TIMER * 100/time);
        if(time < ALARM_TIMER && this.alarmCallBack != null) this.alarmCallBack();
        var to = cc.progressFromTo(time, 100, 0);
        this.timeCount = 0;
        this.numberCount = time /TIME_ONTICK_CDT - 1;
        this.runAction(to.repeat(1));
        logMessage("showCountDown: + current GID:" + BkGlobal.currentGameID);
        this.schedule(this.onTick,TIME_ONTICK_CDT);
    },
    onTick:function(){
        if(!BkGlobal.isGameCo() && BkGlobal.currentGameID != -1)
        {
            //logMessage(" onTick: currentGameID:" + BkGlobal.currentGameID);
            this.updaLightSpritePosCircle(this.getPercentage());
        }
        if(this.alarmPercentage && (Math.floor(this.getPercentage()) == this.alarmPercentage)){
            if(this.alarmCallBack != null) this.alarmCallBack();
        }
        this.timeCount ++;
        if (this.timeCount >=this.numberCount){
            logMessage("finish timer -> remove schedule");
            if (this.callback != null){
                this.callback();
            }
            this.removeCountDown();
        }
    },
    updaLightSpritePosCircle:function(per){
        per = 100 - per;
        //logMessage("per: "+per);
        if (per == 100){
            if (this.lightSprite != null){
                this.lightSprite.removeFromParent();
                this.lightSprite = null;
            }
            return;
        }
        var xPos,yPos;
        if (per == 0){
            xPos = this.centerPoint.x ;
            yPos = this.hSp;
        } else if (per == 50){
            xPos = this.centerPoint.x ;
            yPos = 0;
        } else {
            var alpha, k,ts1;
            alpha = 2* Math.PI * per/100;
            alpha = Math.PI/2 -alpha;
            k = Math.tan(alpha);
            ts1 = this.BanKinh/ (Math.sqrt(k*k+1));
            if ((per<25) && (per >=0)){
                xPos = this.centerPoint.x + ts1;
                yPos = k*(xPos - this.centerPoint.x) + this.centerPoint.y;
            } else if ((per>=50)&&(per<75)){
                xPos = this.centerPoint.x - ts1;
                yPos = k*(xPos - this.centerPoint.x) + this.centerPoint.y;
            } else {
                alpha = -alpha + Math.PI ;
                k = - Math.tan(alpha);
                ts1 = this.BanKinh/ (Math.sqrt(k*k+1));
                if (per>=75){
                    xPos = this.centerPoint.x - ts1;
                } else {
                    xPos = this.centerPoint.x + ts1;
                }
                yPos = k*(xPos - this.centerPoint.x) + this.centerPoint.y;
            }
        }
        if (!this.lightSprite.visible){
            this.lightSprite.visible = true;
        }
        this.lightSprite.x = xPos;
        this.lightSprite.y = yPos;
    },
    removeCountDown:function(){
        if (this.lightSprite != null){
            this.lightSprite.removeFromParent();
            this.lightSprite = null;
        }

        this.removeFromParent();
        this.unschedule(this.onTick);
    }
});