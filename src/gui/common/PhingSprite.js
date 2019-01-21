/**
 * Created by Vu Viet Dung on 12/7/2015.
 */
PhingSprite = BkSprite.extend({
    imgCoin:null,
    imgCoin1:null,
    lblMoney:null,
    money:0,
    callbackFunc:null,
    ctor: function (phingMoney) {
        this._super();
        if (IsNumeric(phingMoney)) {
            this.money = phingMoney;
        } else {
            this.money = 0;
        }
        this.lblMoney = new BkLabel("","",16);
        this.lblMoney.setTextColor(cc.color(255,255,0));
        this.lblMoney.x = 35;
        this.lblMoney.y = 5;
        this.addChild(this.lblMoney,101);

        this.imgCoin = new BkSprite(res.Coins, cc.rect(0, 0, 28, 28));
        this.imgCoin.scaleX =  0.7;
        this.imgCoin.scaleY =  0.7;
        this.imgCoin1 = new BkSprite(res.Coins, cc.rect(28, 0, 28, 28));
        this.imgCoin1.scaleX =  0.7;
        this.imgCoin1.scaleY =  0.7;
        this.imgCoin1.x = 10;
        this.imgCoin1.y = 13;
        this.addChild(this.imgCoin);
        this.addChild(this.imgCoin1);
        this.setMoney(phingMoney);
    },

    setMoney:function(newMoney) {
        this.money = newMoney;
        if (newMoney == 0) {
            this.visible = false;
        } else {
            this.visible = true;
            this.lblMoney.setString(newMoney);
            this.lblMoney.x = Math.floor(this.lblMoney.getContentSize().width / 2) + 20;
        }
    },

    addMoney:function(addmoney) {
        this.setMoney(this.money + addmoney);
    },

    getMoney:function() {
        return this.money;
    },

    setCallbackMoveFinish:function(func) {
        this.callbackFunc = func;
    },
    move:function(dur, x, y) {
        // Move phing
        var callback = cc.callFunc(this.animationFinish, this);
        var move = cc.moveTo(dur, x, y);
        var sequence = cc.sequence(move, callback);
        this.runAction(sequence);
    },

    animationFinish:function() {
        if (this.callbackFunc != null) {
            this.callbackFunc(this);
        }
        this.removeSelf();
    }
});
