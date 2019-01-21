/**
 * Created by bs on 20/10/2015.
 */
BkGoldBoxSprite = BkSprite.extend({
    //sBG:null,
    sBox:null,
    tfTime:null,
    remainTime:0,
    isEnableStroke:false,
    ctor:function(){
        this._super();
        this.sBG = new BkSprite("#"+res_name.vv_btn_big_normal);
        this.sBG.opacity = 0;
        this.sBG.x += this.sBG.width/4;
        this.addChild(this.sBG);
        this.sBox = new BkSprite("#"+res_name.Img_Gold_Box);
        //this.sBox.x = this.sBG.x - this.sBG.width/2 - 10;
        //this.sBox.y = this.sBG.y + 5;
        this.addChild(this.sBox);

        this.tfTime = new BkLabelTTF("00:00", "", 14, cc.size (0, 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.tfTime.y += 0.5;
        this.tfTime.x = this.sBox.x + this.sBox.width + 1;
        this.addChild(this.tfTime);

        this.setMouseOnHover();
        var self = this;
        var f = function (touch,event){
            if (self.remainTime>0){
                showToastMessage("Còn "+convertSecondToMinSec(self.remainTime)+" Bạn mới có thể nhận quà!"
                    ,cc.winSize.width - 290,cc.winSize.height -80,3,140);
            } else{
                var Packet = new BkPacket();
                Packet.CreatePacketWithOnlyType(c.NETWORK_GET_GOLD_BOX_REWARD);
                BkConnectionManager.send(Packet);
                //self.removeSelf();
            }
        };
        this.sBox.setOnlickListenner(f);
        this.sBG.setOnlickListenner(f);
    },
    showGoldBoxWith:function(remainTimeSecond){
        this.remainTime = remainTimeSecond;
        if (this.remainTime<1){
            this.showFinishCountDown();
        } else {
            this.showCountDown();
        }
    },
    onTickFinish:function(){
        if (this.tfTime._strokeEnabled){
            this.tfTime.disableStroke();
        } else{
            this.tfTime.enableStroke(cc.color(255,0,0),2);
        }
    },
    showFinishCountDown:function(){
        this.tfTime.setString(convertSecondToMinSec(0));
        this.unschedule(this.onTick);
        this.schedule(this.onTickFinish,0.5);
    },
    showCountDown:function(){
        this.tfTime.setString(convertSecondToMinSec(this.remainTime));
        this.schedule(this.onTick,1);
    },
    onTick:function(){
        this.remainTime--;
        if (this.remainTime>0){
            this.tfTime.setString(convertSecondToMinSec(this.remainTime));
        } else {
            this.showFinishCountDown();
        }
    },
    removeSelf:function(){
        this.sBox.removeSelf();
        //this.sBG.removeSelf();
        this.unscheduleAllCallbacks();
        this._super();
    },
    startCountDown:function(){
        this.stopCountDown();
        this.schedule(this.onTick,1);
    },
    stopCountDown:function(){
        this.unschedule(this.onTick);
    }
});