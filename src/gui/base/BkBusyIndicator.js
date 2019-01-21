/**
 * Created by bs on 21/10/2015.
 */
var NUMBER_TIMOUT_BUSY_IND      = 15 * 10;
BkBusyIndicator = cc.Layer.extend({
    bgInd:null,
    Ind:null,
    lbInd:null,
    rotateAngle:0,
    count:0,
    isHasTimeOut:true,
    ctor:function(){
        this._super();
        var size = cc.winSize;
        this.Ind = new BkSprite("#"+res_name.busy_indicator);
        this.Ind.setScale(0.65);
        this.Ind.x = size.width/2;
        this.Ind.y = size.height/2;
        this.addChild(this.Ind);

        this.lbInd = new cc.LabelTTF("Đang tải .....", "", 30, cc.size (0, 0), cc.TEXT_ALIGNMENT_LEFT, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.lbInd.x = this.Ind.x + this.Ind.width + 50;
        this.lbInd.y = size.height/2;
        //this.addChild(this.lbInd);
    },
    setIsHasTimeOut:function(flag){
        this.isHasTimeOut = flag;
    },
    showIndicator:function(){
        var scene = getCurrentScene();
        if (scene != null){
            scene.addChild(this,TagOfLayer.AMIN);
        } else {
            logMessage("current Scene null -> don't show");
            return;
        }
      //  cc._canvas.style.cursor = "default";
        this.rotateAngle = 0;
        this.count = 0;
        logMessage("showIndicator -> pause all event");
        cc.eventManager.setEnabled(false);
        this.schedule(this.onTick,0.07);
        this.count = 0;
    },
    onTick:function(){
        var str = "Đang tải      ";
        if ((this.count%6) == 0){
            str = "Đang tải      ";
        } else if ((this.count%6) == 1){
            str = "Đang tải .    "
        } else if ((this.count%6) == 2){
            str = "Đang tải ..   "
        } else if ((this.count%6) == 3){
            str = "Đang tải ...  "
        }
        else if ((this.count%6) == 4){
            str = "Đang tải .... "
        }
        else if ((this.count%6) == 5){
            str = "Đang tải .....";
        }
        this.count++;
        if (this.count == NUMBER_TIMOUT_BUSY_IND){
            logMessage("time out");
            if (this.isHasTimeOut){
                this.removeIndicator();
            }
        }
        this.lbInd.setString(str);
        this.Ind.setRotation(this.rotateAngle);
        this.rotateAngle += 30;//360/7;
    },
    removeIndicator:function(){
        logMessage("removeIndicator -> enable all event");
        this.unschedule(this.onTick);
        this.removeFromParent();
        cc.eventManager.setEnabled(true);
    }
});