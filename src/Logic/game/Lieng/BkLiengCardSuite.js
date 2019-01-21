/**
 * Created by Vu Viet Dung on 12/17/2015.
 */
    MAUTHAU = 0;
    DI = 1;
    LIENG = 2;
    SAP = 3;

BkLiengCardSuite =  cc.Class.extend({
    cardSuite:null,
    ctor:function(){
        this.cardSuite = [];
    },

    addCard:function(card) {
        if (this.cardSuite == null) {
            this.cardSuite = [];
        }
        this.cardSuite.push(card);
        logMessage("Add one card id:" + card.id);
        traceCardList(this.cardSuite,"");
    },


    setCardSuite:function(suite) {
        logMessage("Add " + suite.length + " card to cardSuite");
        if (this.cardSuite == null) {
            this.cardSuite = [];
        }
        for (var i=0; i < suite.length; i++) {
            this.cardSuite.push(suite[i]);
        }
        traceCardList(this.cardSuite,"");
    },
    
    getSuiteName: function () {
        if (this.isSap()) {
            return "Sáp";
        }
        if (this.isLieng()){
            return "Liêng"
        }
        if (this.isDi()) {
            return "Đĩ";
        }
        return this.getPoint() + " Điểm";
    },


    getLiengCardNumber:function(number) {
        if (number > 9) {
            return 0;
        }
        return number;
    },

    getPoint:function() {
        var point = 0;
        for (var i=0; i < this.cardSuite.length; i++) {
            point += this.getLiengCardNumber(this.cardSuite[i].number);
        }
        return point % 10;
    },

    isSap:function() {
        if ((this.cardSuite[0].number == this.cardSuite[1].number) &&
            (this.cardSuite[0].number == this.cardSuite[2].number)) {
            return true;
        }
        return false;
    },

    isLieng:function() {
        // sort card
        for (var i=0; i< this.cardSuite.length -1; i++) {
            for (var j=i+1; j< this.cardSuite[i].length; j++) {
                if (this.cardSuite[i].number < this.cardSuite[j].number) {
                    var temp = this.cardSuite[i];
                    this.cardSuite[i] = this.cardSuite[j];
                    this.cardSuite[j] = temp;
                }
            }
        }

        // check lieng
        if ((this.cardSuite[0].number + 1 == this.cardSuite[1].number)
            && (this.cardSuite[0].number + 2 == this.cardSuite[2].number)) {
            return true;
        }
        if ((this.cardSuite[0].number == 1) && (this.cardSuite[1].number == 12)
            && (this.cardSuite[2].number == 13)) {
            return true;
        }
        return false;
    },

    isDi:function() {

        for  (var i=0; i < this.cardSuite.length; i++) {
            if (this.cardSuite[i].number < 11) {
                return false;
            }
            return true;
        }
    },

});