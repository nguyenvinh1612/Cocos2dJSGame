/**
 * Created by bs on 14/10/2015.
 */
BkCountDownText = BkSprite.extend({
    background:null,
    instructionText:null,
    cdtext:null,
    callBackFinishFunc:null,
    callbackMaubinhFunc:null,
    isAutoStart:false,
    tCD:null,
    ctor:function(size,hasBG,isAts,isGameCo){
        this._super();
        var isHasBG = false;
        if (hasBG != undefined){
            isHasBG = hasBG;
        }
        isGameCo = true;
        if (isGameCo){
            this.background = new BkSprite("#"+res_name.bg_count_down_co);
            this.addChild(this.background);
        }else if (isHasBG){
            this.background = new BkSprite("#"+res_name.BG_Stop_Watch);
            this.addChild(this.background);
        }
        var fSize = 40;
        if (size != undefined){
            fSize = size;
        }
        if (isGameCo == undefined){
            isGameCo = false;
        }

        if (!isGameCo){
            //this.cdtext = new BkLabel("","",fSize,true);
            //this.cdtext.setTextColor(cc.color(252,255,255));
            //if(!isHasBG)
            //{
                //this.cdtext.enableOutline(cc.color(1,46,138),5);
            //}
            this.cdtext = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM);
            //this.cdtext = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_CHAN);
            if (isHasBG){
                this.cdtext.setScale(0.9);
                this.cdtext.y = this.background.y + 3;
            }
            this.addChild(this.cdtext,100);
        } else {
            //this.cdtext = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_CO);
            //this.cdtext = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_CHAN);
            this.cdtext = new cc.LabelTTF("","BRUSHSBI",50*2);
            this.cdtext.setFontFillColor(cc.color(0xB2,0x19,0x19));
            this.cdtext.setScale(0.5);

            this.cdtext.x = this.background.x;
            this.cdtext.y = this.background.y - 20 + 20;
            this.addChild(this.cdtext);
        }

        if(isAts != undefined && isAts == true)
        {
            this.isAutoStart = true;
            this.instructionText = new BkSprite("#" + res_name.autoReadyImg);
            this.instructionText.y = 15;
            this.addChild(this.instructionText);
            this.cdtext.x = this.instructionText.x + this.instructionText.getContentSize().width/2 - 60;
            this.cdtext.y = this.instructionText.y - 2;
        }
        this.setVisible(false);
    },
    setCallbackForMauBinh:function(f){
        this.callbackMaubinhFunc = f;
    },
    setCallBackfunction:function(f){
        this.callBackFinishFunc = f;
    },
    setTextSize:function(size){
        this.cdtext.setFontSize(size);
    },
    setTextColor:function(color){
        if (this.cdtext && this.cdtext.setTextColor){
            this.cdtext.setTextColor(color);
        } else if (this.cdtext && this.cdtext.setFontFillColor){
            this.cdtext.setFontFillColor(color);
        }
    },
    showCountDownText:function(cdTime){
        this.setVisible(true);
        this.tCD = cdTime;
        this.cdtext.setString(this._getStringFrom(this.tCD));
        this.schedule(this.onTick,1);
    },
    onTick:function() {
        this.tCD--;
        this.cdtext.setString(this._getStringFrom(this.tCD));
        if (this.tCD == 1){
            if (this.callbackMaubinhFunc != null){
                this.callbackMaubinhFunc();
            }
        }

        if (this.tCD == 0){
            if (this.callBackFinishFunc != null){
                this.callBackFinishFunc();
            } else {
                logMessage("Must set callback function to handle onTimerComplete");
            }
            this.removeCountDown();
        }

    },
    _getStringFrom:function(t){
        var str = " ";
        if (t < 10){
            str = " 0";
        } else if (t < 100){
            str = " ";
        }
        str += t;
        str+= " ";
        return str;
    },
    removeCountDown:function(){
        this.removeFromParent();
        this.unschedule(this.onTick);
    }
});