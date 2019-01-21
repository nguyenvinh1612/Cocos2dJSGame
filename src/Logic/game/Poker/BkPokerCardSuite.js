/**
 * Created by Vu Viet Dung on 12/17/2015.
 */

    THUNGPHASANH = 8;
    TUQUY = 7;
    CULU = 6;
    THUNG = 5;
    SANH = 4;
    SAMCO = 3;
    THU = 2;
    DOI = 1;
    MAUTHAU = 0;

BkPokerCardSuite =  cc.Class.extend({
    cardSuite:null,
    numberCount:null,
    typeCount:null,
    ctor:function(){
        this.cardSuite = [];
        this.numberCount = [];
        this.typeCount = [];
    },

    getBiggestSuiteName:function() {
        var type = this.getBiggestSuiteType();
        switch (type) {
            case THUNGPHASANH:
                return "Thùng phá sảnh";
            case TUQUY:
                return "Tứ quý";
            case CULU:
                return "Cù Lũ";
            case THUNG:
                return "Thùng";
            case SANH:
                return "Sảnh";
            case SAMCO:
                return "Sám cô";
            case THU:
                return "Thú";
            case DOI:
                return "Đôi";
            default:
                return "Mậu thầu";
        }
        return "Mậu thầu";
    },

    addCard:function(card) {
        if (this.cardSuite == null) {
            this.cardSuite = [];
        }
        this.cardSuite.push(card);
        logMessage("Add one card id:" + card.id);
        traceCardList(this.cardSuite,"");
        this.preProcess();
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
        this.preProcess();
    },

    // ******************* Get Thung pha sanh ********************
    getThungPhaSanhSuite:function() {
        var suite = null;
        var startNumber = -1;
        for (var i=0; i<this.cardSuite.length; i++) {
            var card = this.cardSuite[i];
            var tempSuite = this.getThungPhaSanhFromCard(card);
            if (tempSuite != null) {
                if (card.number > startNumber) {
                    suite = tempSuite;
                    startNumber = card.number;
                }
            }
        }
        return suite;
    },

    getThungPhaSanhFromCard:function(card) {
        if (card.number > 10) {
            return null;
        }
        var tempRet = [];
        tempRet.push(card);
        for (var i=1; i<5; i++) {
            var nextNumber = card.number + i;
            if (nextNumber == 14) {
                nextNumber =1;
            }
            var tempCard = this.getCard(nextNumber, card.type);
            if (tempCard == null) {
                return null;
            }
            tempRet.push(tempCard);
        }
        return tempRet;
    },

    getCard:function(number, type) {
        for (var i=0; i<this.cardSuite.length; i++) {
            if (this.cardSuite[i].number == number && this.cardSuite[i].type == type) {
                return this.cardSuite[i];
            }
        }
        return null;
    },

    // ******************* Get Tu Quy ********************
    getTuQuySuite:function() {
        var tuQuyNumber = -1;
        for (var i=1; i < 14; i++) {
            if (this.numberCount[i] ==4) {
                tuQuyNumber = i;
                break;
            }
        }

        if (tuQuyNumber == -1) {
            return null;
        }
        var tempRet = [];
        // Get Tu Quy
        for (var type=0; type < 4; type++) {
            var tempCard = this.getCard(tuQuyNumber, type);
            tempRet.push(tempCard);
        }

        // Get Max card
        for (var i = 14; i > 1; i--) {
            var number= i;
            if (number == 14) {
                number =1;
            }
            if (number == tuQuyNumber) {
                continue;
            }
            if (this.numberCount[number] != 0) {
                var tempCard = this.getCardByNumber(number);
                tempRet.push(tempCard);
                return tempRet;
            }
        }
        return tempRet;
    },

    // ******************* Get Cu Lu ********************
    getCuLuSuite:function() {
        var numberXamCo = this.getBoBaMaxNumber();
        if (numberXamCo < 0) {
            return null;
        }
        var tempRet = [];
        for (var type = 0; type < 4; type++) {
            var tempCard = this.getCard(numberXamCo, type);
            if (tempCard != null) {
                tempRet.push(tempCard);
            }
        }
        for (var i = 14; i > 1; i--) {
            var number = i;
            if (number == 14) {
                number = 1;
            }
            if (number == numberXamCo) {
                continue;
            }
            if (this.numberCount[number] >= 2) {
                for (var type = 0; type < 4; type++) {
                    var tempCard = this.getCard(number, type);
                    if (tempCard != null) {
                        tempRet.push(tempCard);
                        if (tempRet.length == 5) {
                            return tempRet;
                        }
                    }
                }
            }
        }
        return null;
    },

    // ******************* Get Thung ********************
    getThungSuite:function() {
        var thungType = -1;
        for (var type =0; type < 4; type++) {
            if (this.typeCount[type] >= 5) {
                thungType = type;
                break;
            }
        }
        if (thungType < 0) {
            return null;
        }
        var retSuite = [];
        for (var i = 14; i> 1; i--) {
            var number = i;
            if (number ==14) {
                number =1;
            }
            if (this.numberCount[number] == 0) {
                continue;
            }
            var retCard = this.getCard(number,thungType);
            if (retCard != null) {
                retSuite.push(retCard);
                if (retSuite.length == 5) {
                    return retSuite;
                }
            }
        }
        return retSuite;
    },

    // ******************* Get Sanh ********************
    getSanhSuite:function() {
        var tempRet = [];
        for (var i=10; i>0; i--) {
            if (this.hasSanhStartWith(i)) {
                //logMessage("Found sanh from card number:" + i);
                for (var j=0; j<5; j++) {
                    var number = i+j < 14? i+j : 1;
                    var tempCard = this.getCardByNumber(number);
                    tempRet.push(tempCard);
                }
                return tempRet;
            }
        }
        return null;
    },

    getCardByNumber:function(cardNumber) {
        var num = cardNumber;
        if (num == 14) {
            num = 1;
        }
        for (var i=0; i< this.cardSuite.length; i++) {
            if (this.cardSuite[i].number == num) {
                return this.cardSuite[i];
            }
        }
        return null;
    },

    // ******************* Get Sam Co ********************
    getSamCoSuite:function() {
        var numberXamCo = this.getBoBaMaxNumber();
        if (numberXamCo < 0) {
            return null;
        }
        var tempRet = [];
        for (var type = 0; type < 4; type++) {
            var tempCard = this.getCard(numberXamCo, type);
            if (tempCard != null) {
                tempRet.push(tempCard);
            }
        }

        // Push 2 other biggest card
        for (var i = 14; i > 1; i--) {
            var number = i < 14 ? i : 1;
            if (number == numberXamCo) {
                continue;
            }
            if (this.numberCount[number] > 0) {
                var tempCard = this.getCardByNumber(number);
                tempRet.push(tempCard);
                if (tempRet.length == 5) {
                    return tempRet;
                }
            }
        }
        return tempRet;
    },

    getThuSuite:function() {
        var bigerNumber = this.getDoiMaxNumber();
        var smallerNumber = this.getDoiSecondNumber();
        if (bigerNumber < 0 || smallerNumber <0) {
            return null;
        }
        var tempRet = [];
        for (var type = 0; type < 4; type++) {
            var tempCard = this.getCard(bigerNumber, type);
            if (tempCard != null) {
                tempRet.push(tempCard);
            }
        }
        for (var type = 0; type < 4; type++) {
            var tempCard = this.getCard(smallerNumber, type);
            if (tempCard != null) {
                tempRet.push(tempCard);
            }
        }

        // Push 1 other biggest card
        for (var i = 14; i > 1; i--) {
            var number = i;
            if (i == 14) {
                number =1;
            }
            if (number == bigerNumber || number == smallerNumber) {
                continue;
            }
            if (this.numberCount[number] > 0) {
                var tempCard = this.getCardByNumber(number);
                if (tempCard != null) {
                    tempRet.push(tempCard);
                    if (tempRet.length == 5) {
                        return tempRet;
                    }
                }
            }
        }
        return tempRet;
    },

    getDoiSuite:function() {
        var doiNumber = this.getDoiMaxNumber();
        if (doiNumber < 0) {
            return null;
        }
        var tempRet = [];
        for (var type = 0; type < 4; type++) {
            var tempCard = this.getCard(doiNumber, type);
            if (tempCard != null) {
                tempRet.push(tempCard);
            }
        }
        // Get 3 other card
        for (var i = 14; i > 1; i--) {
            var number = i;
            if (i == 14) {
                number =1;
            }
            if (number == doiNumber) {
                continue;
            }
            if (this.numberCount[number] > 0) {
                var tempCard = this.getCardByNumber(number);
                if (tempCard != null) {
                    tempRet.push(tempCard);
                    if (tempRet.length == 5) {
                        return tempRet;
                    }
                }
            }
        }
        return tempRet;
    },

    getMauThauSuite:function() {
        var tempRet = [];
        var count = 0;
        for (var i = 14; i > 1; i--) {
            var number = i;
            if (i == 14) {
                number =1;
            }
            if (this.numberCount[number] > 0) {
                var tempCard = this.getCardByNumber(number);
                if (tempCard != null) {
                    tempRet.push(tempCard);
                    if (tempRet.length == 5) {
                        return tempRet;
                    }
                }
            }
        }
        return tempRet;
    },



    getBiggestSuiteType:function() {
        //traceCardList(this.cardSuite,"Poker get biggest suite type");
        if (this.getThungPhaSanhSuite() != null) {
            //logMessage("Biggest Suite Type:THUNGPHASANH");
            return THUNGPHASANH;
        }
        if (this.getTuQuySuite() != null) {
            //logMessage("Biggest Suite Type:TUQUY");
            return TUQUY;
        }

        if (this.getCuLuSuite() != null) {
            //logMessage("Biggest Suite Type:CULU");
            return CULU;
        }

        if (this.getThungSuite() != null) {
            //logMessage("Biggest Suite Type:THUNG");
            return THUNG;
        }
        if (this.getSanhSuite() != null){
            //logMessage("Biggest Suite Type:SANH");
            return SANH;
        }

        if (this.getSamCoSuite() != null) {
            //logMessage("Biggest Suite Type:SAMCO");
            return SAMCO;
        }

        var doiMaxNumber = this.getDoiMaxNumber();
        var doiSecondNumber = this.getDoiSecondNumber();
        if (doiMaxNumber >0 && doiSecondNumber >0) {
            //logMessage("Biggest Suite Type:THU");
            return THU;
        }

        if (doiMaxNumber >0) {
            //logMessage("Biggest Suite Type:DOI");
            return DOI;
        }

        //logMessage("Biggest Suite Type:MAUTHAU");
        return MAUTHAU;
    },

    getBiggestPokerSuite:function() {
        var tempRet;
        tempRet = this.getThungPhaSanhSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getTuQuySuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getCuLuSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getThungSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getSanhSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getSamCoSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getThuSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getDoiSuite();
        if (tempRet != null) {
            return tempRet;
        }
        tempRet = this.getMauThauSuite();
        if (tempRet != null) {
            return tempRet;
        }
    },

    getThungLastNumber:function() {
        for (var type =0; type < 4; type++) {
            if (this.typeCount[i] >= 5) {
                return this.getLastCardNumberByType(type);
            }
        }
        return -1;
    },

    getSanhLastNumber:function() {
        if (this.cardSuite.length < 5) {
            return -1;
        }
        for (var i=1; i<10; i++) {
            if (this.hasSanhStartWith(i)) {
                return i+4;
            }
        }
        if (this.hasSanhStartWith(10)) {
            return 1;
        }
        return -1;
    },

    getBoBaMaxNumber:function() {
        if (this.numberCount[1] == 3) {
            return 1;
        }
        for (var i=13; i>0; i--) {
            if (this.numberCount[i] == 3) {
                return i;
            }
        }
        return -1;
    },

    getDoiMaxNumber:function() {
        if (this.numberCount[1] == 2) {
            return 1;
        }
        for (var i=13; i>0; i--) {
            if (this.numberCount[i] == 2) {
                return i;
            }
        }
        return -1;
    },

    getDoiSecondNumber:function() {
        var secondNumber = -1;
        var maxNumber = this.getDoiMaxNumber();
        if (maxNumber < 0) {
            return -1;
        }
        for (var i=1; i<14; i++) {
            if (i != maxNumber) {
                if (this.numberCount[i] == 2 && i > secondNumber) {
                    secondNumber = i;
                }
            }
        }
        return secondNumber;
    },

    sortCardByNumber:function() {
        for (var i = 0; i< this.cardSuite.length; i++) {
            for (var j= i + 1; j< this.cardSuite.length; j++)
            {
                if(this.cardSuite[i] == null || this.cardSuite[j] == null)
                {
                    return;
                }
                var number1 = this.cardSuite[i].number == 1? 14 : this.cardSuite[i].number;
                var number2 = this.cardSuite[j].number == 1? 14 : this.cardSuite[j].number;
                if (number1 > number2) {
                    var temp = this.cardSuite[i];
                    this.cardSuite[i] = this.cardSuite[j];
                    this.cardSuite[j] = temp;
                }
            }
        }
    },

    preProcess:function() {
        // sort card by number
        this.sortCardByNumber();
        // Count card number
        for (var i= 1; i< 14; i++) {
            this.numberCount[i] = 0;
        }
        for (var i=0; i < this.cardSuite.length; i++) {
            this.numberCount[this.cardSuite[i].number]++;
        }
        // Count card type
        for (var i=0; i< 4; i++) {
            this.typeCount[i] = 0;
        }
        for (var i=0; i < this.cardSuite.length; i++) {
            this.typeCount[this.cardSuite[i].type]++;
        }
    },

    getLastCardNumberByType:function(cardType) {
        var cardId = -1;
        for (var i=0; i<this.cardSuite.length; i++) {
            if (this.cardSuite[i].type == cardType) {
                var cardNumber = this.cardSuite[i].number;
                if (cardNumber == 1) {
                    // if card == AT -> finish searching
                    return 1;
                }
                if (cardNumber > cardId) {
                    cardId = cardNumber;
                }
            }
        }
        return cardId;
    },

    hasSanhStartWith:function(cardNumber) {
        for (var i=0; i<5; i++) {
            var number = cardNumber + i;
            if (number == 14) {
                number =1;
            }
            if (this.numberCount[number] == 0){
                return false;
            }
        }
        return true;
    },

    getCardNotInSuiteCard:function() {
        var cardList = [];
        if (this.cardSuite == null) {
            return cardList;
        }
        var biggestSuite = this.getBiggestPokerSuite();
        for (var i=0; i < this.cardSuite.length; i++) {
            if (!cardInCardSuite(this.cardSuite[i], biggestSuite)) {
                cardList.push(this.cardSuite[i]);
            }
        }
        return cardList;
    }

});