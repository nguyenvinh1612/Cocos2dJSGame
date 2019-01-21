/**
 * Created by bs on 19/10/2015.
 */
var CHANGE_MONEY_DURATION_ANIMATION     = 1.5;
var CHANGE_MONEY_MOVE_TOP_Y             = 120;
BkTextFieldChangeMoney = BkSprite.extend({
    player:null,
    delay:null,
    tfMoneyChange:null,
    amountChange:0,
    ctor:function(pl,amount){
        this._super();
        this.amountChange = amount;
        this.player = pl;
        if (this.amountChange>0){
            this.tfMoneyChange = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM);
        } else {
            this.tfMoneyChange = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM_THUA);
        }

        this.tfMoneyChange.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.tfMoneyChange.boundingWidth = 290;
        this.tfMoneyChange.setScale(0.75);
        //this.tfMoneyChange.setScale(0.6);
        this.setVisible(false);
        this.addChild(this.tfMoneyChange);
    },
    setScaleTF:function (value) {
        this.tfMoneyChange.setScale(value);
    },
    setContentText:function(txt){
        this.tfMoneyChange.setString(txt,true);
        this.tfMoneyChange.x = this.tfMoneyChange.getContentSize().width/2;
        logMessage("txt.length: "+txt.length);
    },
    doChangeMoney:function(){
        //config show
        this.x = this.player.x - this.tfMoneyChange.getContentSize().width/2;
        this.y = this.player.y - this.player.height - 50 ;

        var crScene = getCurrentScene();//cc.director.getRunningScene();
        crScene.addChild(this);
        var timeDelay = 0.5;
        this.delay = 0;
        if (this.player.numberHasBonus >0){
            this.delay = this.player.numberHasBonus * (CHANGE_MONEY_DURATION_ANIMATION + timeDelay);
        }
        var callback = cc.callFunc(this.onCompleteFunc, this);
        var onStart = cc.callFunc(this.onStartAnimation, this);
        var fDelay = cc.delayTime(timeDelay);

        var acMove = cc.moveTo(CHANGE_MONEY_DURATION_ANIMATION,cc.p(this.tfMoneyChange.x,this.tfMoneyChange.y + CHANGE_MONEY_MOVE_TOP_Y));
        var fadeOut = cc.fadeTo(CHANGE_MONEY_DURATION_ANIMATION,0);
        var mySpawn = cc.spawn(acMove);
        var sequence = cc.sequence(onStart, mySpawn, fDelay, callback);


        if (this.delay == 0){
            this.tfMoneyChange.runAction(sequence);
        } else {
            this.tfMoneyChange.runAction(cc.sequence(cc.delayTime(this.delay),sequence));
        }
        this.player.numberHasBonus ++;
    },
    onCompleteFunc:function(){
        this.player.numberHasBonus --;
        this.setVisible(false);
        this.removeFromParent();
    },
    onStartAnimation:function(){
        this.tfMoneyChange.opacity = 255;
        this.setVisible(true);
    }
});