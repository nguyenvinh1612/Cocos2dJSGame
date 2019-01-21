/**
 * Created by Vu Viet Dung on 12/7/2015.
 */
COIN_X = [0,  0,  0, -15, -15, -15, -2, -1, 0];
COIN_Y = [4, 2, 0,   8,    6,   4,  20,  18,  16];
TOTAL_COIN_OFFSET_X = 0;
TOTAL_COIN_OFFSET_Y = 19;


BkPhingSprite = BkSprite.extend({
    imgCoinArr:null,
    lblMoney:null,
    money:0,
    callbackFunc:null,
    type:0,         // 0: poker normal player bet money, 1: total bet money, 2:xito player bet money
    moneyBg:null,

    BASE_COIN_RATE:100,
    MAX_COIN_IN_COLUMN:3,
    COIN_COLUMN:3,


    ctor: function (phingMoney, type) {
        this._super();
        if (IsNumeric(phingMoney)) {
            this.money = phingMoney;
        } else {
            this.money = 0;
        }
        this.type =0;
        if (type != null) {
            this.type = type;
        }

        this.initCoin();

        this.initMoneyBg(type);
        this.lblMoney = new BkLabel("","",16);
        this.lblMoney.setTextColor(cc.color(255,255,0));
        this.addChild(this.lblMoney,1);
        this.setMoney(phingMoney);
    },

    getCoin:function(baseMoney) {
        var count = 0;
        while (baseMoney >= (this.MAX_COIN_IN_COLUMN + 1)) {
            count++;
            baseMoney = baseMoney / (this.MAX_COIN_IN_COLUMN + 1);
        }
        count = Math.min(count, 14);
        //slogMessage("get Coin money:" + baseMoney + " count:" + count);
        return new BkSprite(res.Coins, cc.rect(28 * count, 0, 28, 28));
    },

    removeCoin:function() {
        if (this.imgCoinArr != null) {
            while (this.imgCoinArr.length >0) {
                var coin = this.imgCoinArr.pop();
                coin.removeFromParent();
            }
        }
        this.imgCoinArr = null;
    },

    initPokerNormalBetCoin:function() {
        this.removeCoin();

        // init phinh
        this.imgCoinArr = [];
        var imgCoin = this.getCoin(this.money / this.BASE_COIN_RATE);
        imgCoin.scaleX =  0.7;
        imgCoin.scaleY =  0.7;
        imgCoin.y = 20;
        this.imgCoinArr.push(imgCoin);
        this.addChild(imgCoin,2);
    },

    initXitoNormalBetCoin:function() {
        this.removeCoin();

        // init phinh
        this.imgCoinArr = [];
        var imgCoin = this.getCoin(this.money / this.BASE_COIN_RATE);
        imgCoin.scaleX =  0.7;
        imgCoin.scaleY =  0.7;
        imgCoin.x = -15;
        imgCoin.y = 0;
        this.imgCoinArr.push(imgCoin);
        this.addChild(imgCoin,2);
    },

    buildAColumnChip:function(index, potMoney) {
        var count = 0;
        var baseMoney = potMoney;
        while (baseMoney >= (this.MAX_COIN_IN_COLUMN + 1)) {
            count++;
            baseMoney = Math.floor(baseMoney / (this.MAX_COIN_IN_COLUMN + 1));
        }
        count = Math.min(count, 14);
        for (var i = 0; i < this.MAX_COIN_IN_COLUMN; i++) {
            if (i >= baseMoney) {
                break;
            }
            var imgCoin = new BkSprite(res.Coins, cc.rect(28 * count, 0, 28, 28));
            imgCoin.scaleX =  0.7;
            imgCoin.scaleY =  0.7;
            imgCoin.x = COIN_X[index + i] + TOTAL_COIN_OFFSET_X;
            imgCoin.y = COIN_Y[index + i] + TOTAL_COIN_OFFSET_Y;
            this.imgCoinArr.push(imgCoin);
        }
        return Math.pow((this.MAX_COIN_IN_COLUMN + 1), count) * baseMoney;
    },

    initPokerTotalBetCoin:function() {
        this.removeCoin();

        // init phinh
        this.imgCoinArr = [];
        var potTemp = this.money / this.BASE_COIN_RATE;
        for (var i = 0; i < this.COIN_COLUMN; i++) {
            potTemp -= this.buildAColumnChip(i * this.MAX_COIN_IN_COLUMN, potTemp);
        }
        for (var i=this.imgCoinArr.length-1; i>=0; i--) {
            var imgCoin = this.imgCoinArr[i];
            this.addChild(imgCoin,2);
        }
    },

    initCoin:function() {
        switch (this.type) {
            case 0:
                this.initPokerNormalBetCoin();
                break;
            case 1:
                this.initPokerTotalBetCoin();
                break;
            case 2:
                this.initXitoNormalBetCoin();
                break;
        }
    },

    updatePhingType:function(type) {
        this.type = type;
        this.initCoin();
        this.initMoneyBg();
    },

    initMoneyBg:function(type) {
        // Remove current backgroud
        if (this.moneyBg != null) {
            this.moneyBg.removeFromParent();
            this.moneyBg = null;
        }

        if (this.type ==0) {
            this.moneyBg = new BkSprite("#" + res_name.bet_money_bg0);
        } else if (this.type == 1){
            this.moneyBg = new BkSprite("#"+res_name.bet_money_bg1);
        }
        if (this.moneyBg != null) {
            this.addChild(this.moneyBg);
        }
    },


    setMoney:function(newMoney) {
        this.money = newMoney;
        this.initCoin();
        if (newMoney == 0) {
            this.visible = false;
        } else {
            this.visible = true;
            this.lblMoney.setString(convertStringToMoneyFormat(newMoney));
            if (this.type == 2) {
                this.lblMoney.x = (this.lblMoney.getContentSize().width / 2);
            }
        }
    },

    getWidth:function() {
        if (this.lblMoney == null) {
            return 0;
        }
        var retVal = this.lblMoney.getContentSize().width;
        if (this.imgCoinArr != null) {
            retVal += Math.abs(this.imgCoinArr[0].x);
        }
        return  retVal;
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
