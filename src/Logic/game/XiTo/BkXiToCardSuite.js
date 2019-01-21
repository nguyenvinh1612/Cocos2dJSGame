/**
 * Created by Vu Viet Dung on 12/21/2015.
 */
BkXiToCardSuite = BkPokerCardSuite.extend({
    ctor:function(){
        this._super();
    },

    getXitoCardNumber:function(number) {
        if (number == 1) {
            return 14;
        }
        return number;
    },

    isXiToBigger:function(card1, card2) {
        var cardNumber1 = this.getXitoCardNumber(card1.number);
        var cardNumber2 = this.getXitoCardNumber(card2.number);
        if (cardNumber1 > cardNumber2) {
            return true;
        }
        if ((cardNumber1 == cardNumber2) && (card1.type > card2.type)) {
            return true;
        }
        return false;
    },


    getBiggestCard:function() {
        if (this.cardSuite == null || this.cardSuite.length ==0) {
            return null;
        }
        var tempCard = this.cardSuite[0];
        for (var i = 1; i < this.cardSuite.length; i++) {
            if (this.isXiToBigger(this.cardSuite[i], tempCard)) {
                tempCard = this.cardSuite[i];
            }
        }
        return tempCard;
    },


    getTuQuyCardNumber:function(){
        for (var i =1; i<14; i++) {
            if (this.numberCount[i] == 4) {
                return i;
            }
        }
        return -1;
    },

    getXiToDoiMaxCard:function() {
        var number = this.getDoiMaxNumber();
        var tempCard = null;
        for (var i=0; i<this.cardSuite.length; i++) {
            if (this.cardSuite[i].number == number) {
                if (tempCard == null) {
                    tempCard = this.cardSuite[i];
                    continue;
                }
                if (this.isXiToBigger(this.cardSuite[i], tempCard)) {
                    tempCard = this.cardSuite[i];
                }
            }
        }
        return tempCard;
    },

    compareSimpleSuite:function(otherSuite) {
        for (var i = this.cardSuite.length - 1; i >= 0; i--) {
            var number1 = this.getXitoCardNumber(this.cardSuite[i].number);
            var number2 = this.getXitoCardNumber(otherSuite.cardSuite[i].number);
            if (number1 > number2) {
                return true;
            }
            if (number1 < number2) {
                return false;
            }
        }
        return this.cardSuite[this.cardSuite.length - 1].type > otherSuite.cardSuite[this.cardSuite.length - 1].type;
    },

    getThuOddCardNumber:function() {
        for (var i=1; i< 14; i++) {
            if (this.numberCount[i] ==1) {
                return i;
            }
        }
        return -1;
    },

    compareDoiSuite:function(otherSuite) {
        var number1 = this.getXitoCardNumber(this.getDoiMaxNumber());
        var number2 = otherSuite.getXitoCardNumber(otherSuite.getDoiMaxNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        number1 = this.getXitoCardNumber(this.getThuOddCardNumber());
        number2 = otherSuite.getXitoCardNumber(otherSuite.getThuOddCardNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        return this.isXiToBigger(this.getXiToDoiMaxCard(), otherSuite.getXiToDoiMaxCard());
    },

    compareThuSuite:function(otherSuite) {
        var number1 = this.getXitoCardNumber(this.getDoiMaxNumber());
        var number2 = otherSuite.getXitoCardNumber(otherSuite.getDoiMaxNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        number1 = this.getXitoCardNumber(this.getDoiSecondNumber());
        number2 = otherSuite.getXitoCardNumber(this.getDoiSecondNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }

        number1 = this.getXitoCardNumber(this.getThuOddCardNumber());
        number2 = otherSuite.getXitoCardNumber(otherSuite.getThuOddCardNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        return this.isXiToBigger(this.getXiToDoiMaxCard(), otherSuite.getXiToDoiMaxCard());
    },

    isBiggerThanCardSuite:function(otherSuite) {
        var myType = this.getBiggestSuiteType();
        var otherType = otherSuite.getBiggestSuiteType();
        if (myType > otherType) {
            return true;
        }

        if (myType < otherType) {
            return false;
        }

        if (myType == THUNGPHASANH) {
            var card1 = this.getThungPhaSanhSuite()[4];
            var card2 = otherSuite.getThungPhaSanhSuite()[4];
            return this.isXiToBigger(card1, card2);
        }
        if (myType == TUQUY) {
            var number1 = this.getXitoCardNumber(this.getTuQuyCardNumber());
            var number2 = this.getXitoCardNumber(otherSuite.getTuQuyCardNumber());
            return number1 > number2;
        }
        if (myType == CULU || myType == SAMCO) {
            var number1 = this.getXitoCardNumber(this.getBoBaMaxNumber());
            var number2 = this.getXitoCardNumber(otherSuite.getBoBaMaxNumber());
            return number1 > number2;
        }
        if (myType == THUNG || myType == SANH || myType == MAUTHAU) {
            return this.compareSimpleSuite(otherSuite);
        }
        if (myType == THU) {
            return this.compareThuSuite(otherSuite);
        }
        if (myType == DOI) {
            return this.compareDoiSuite(otherSuite);
        }

        // never come here
        return true;
    }

});