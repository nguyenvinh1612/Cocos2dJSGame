/**
 * Created by vinhnq on 1/20/2016.
 */

BkMauBinhCardSuite = BkPokerCardSuite.extend({
    ctor:function(){
        this._super();
    },
    addCard:function(card) {
        if (this.cardSuite == null) {
            this.cardSuite = [];
        }
        this.cardSuite.push(card);
    },
    addCardSuite:function(cardlist) {
        this.cardSuite = [];
        for(var i = 0; i < cardlist.length; i++)
        {
            this.cardSuite.push(cardlist[i]);
        }
    },
    showMaskForSuite:function() {
        var cardList = this.getBiggestPokerSuite();
        var cardType = this.getBiggestSuiteType();
        var numOfMaskCard = this.getNumOfMaskCardForByType(cardType);
        for (var i=0; i< cardList.length; i++) {
            cardList[i].showMask(i < numOfMaskCard);
        }
    },

    getNumOfMaskCardForByType:function(type) {
        switch (type) {
            case THUNG:
            case SANH:
            case THUNGPHASANH:
            case CULU:
                return 5;
            case TUQUY:
            case THU:
                return 4;
            case SAMCO:
                return 3;
            case DOI:
                return 2;
            case MAUTHAU:
                return 1;
        }
        return 1;
    },
    sortMauBinhSuite:function() {
        var suiteType =this.getBiggestSuiteType();
        var tempSuite = this.getBiggestPokerSuite();
        if (suiteType == SANH || suiteType == THUNGPHASANH) {
            this.reorderSanh(tempSuite);
        }

        if (suiteType == SAMCO || suiteType == CULU || suiteType == TUQUY){
            tempSuite = this.reorderListByType(tempSuite,suiteType);
        }

        if (suiteType == DOI || suiteType == THU){
            tempSuite = this.reorderThuDoi(tempSuite,suiteType);
        }

        if (tempSuite != null && tempSuite) {
            return tempSuite;
        }
        return this.cardSuite;
    },
    sortOnPriority:function(item1, item2){
        var type1 = item1.type;
        var  type2 = item2.type;
        if (type1 == NHEP){
            type1 = 100;
        }
        if (type1>type2){
            return 1;
        } else {
            return -1;
        }
    },
    reorderThuDoi:function(listcard,suiteType){
        var sortTypelist = [];
        var maxLeng = 2;
        var i;
        for (i=0;i<2;i++){
            sortTypelist.push(listcard[i]);
        }
        sortTypelist.sort(this.sortOnPriority);

        if (suiteType == THU){
            maxLeng = 4;
            var list2 = [];
            list2.push(listcard[2]);
            list2.push(listcard[3]);
            list2.sort(this.sortOnPriority);
            sortTypelist.push(list2[0]);
            sortTypelist.push(list2[1]);
        }
        for (i=maxLeng;i<listcard.length;i++){
            sortTypelist.push(listcard[i]);
        }
        return sortTypelist;
    },
    reorderListByType:function(listcard,suiteType){
        logMessage("reorderListByType");
        var sortTypelist = [];
        var maxLeng = 3;
        var i;
        if (suiteType == TUQUY){
            maxLeng = 4;
        }
        for (i=0;i<maxLeng;i++){
            sortTypelist.push(listcard[i]);
        }
        sortTypelist.sort(this.sortOnPriority);

        if (suiteType == CULU){
            var list2 = [];
            list2.push(listcard[3]);
            list2.push(listcard[4]);
            list2.sort(this.sortOnPriority);
            sortTypelist.push(list2[0]);
            sortTypelist.push(list2[1]);
        } else {
            for (i=maxLeng;i<listcard.length;i++){
                sortTypelist.push(listcard[i]);
            }
        }

        return sortTypelist;
    },
    reorderSanh:function(listcard) {
        if (listcard.length != 5) {
            return;
        }
        // swap card 0-4
        var temp = listcard[0];
        listcard[0] = listcard[4];
        listcard[4] = temp;

        // swap card 1-3
        temp = listcard[1];
        listcard[1] = listcard[3];
        listcard[3] = temp;
    },
    isBiggerThanCardSuite:function(otherSuite)
    {
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
            return this.isMauBinhBigger(card1, card2);
        }
        var number1;
        var number2;
        if (myType == TUQUY) {
             number1 = this.getMauBinhCardNumber(this.getTuQuyCardNumber());
             number2 = this.getMauBinhCardNumber(otherSuite.getTuQuyCardNumber());
            return number1 > number2;
        }
        if (myType == CULU || myType == SAMCO) {
             number1 = this.getMauBinhCardNumber(this.getBoBaMaxNumber());
             number2 = this.getMauBinhCardNumber(otherSuite.getBoBaMaxNumber());
            return number1 > number2;
        }
        if (myType == THUNG || myType == MAUTHAU) {
            return this.compareSimpleSuite(otherSuite);
        }
        if (myType == SANH)
        {
            if (getNumberCount(this.cardSuite,3) > 0)
            {
                BkMauBinhCardUtil.sortSanh(this.cardSuite, true);
            }
            if (getNumberCount(otherSuite.cardSuite,3) > 0)
            {
                BkMauBinhCardUtil.sortSanh(otherSuite.cardSuite, true);
            }
            return BkSamCardUtil.isBiggerSanh(this.cardSuite,otherSuite.cardSuite);
        }
        if (myType == THU) {
            return this.compareThuSuite(otherSuite);
        }
        if (myType == DOI) {
            return this.compareDoiSuite(otherSuite);
        }
        // never come here
        return true;
    },
    compareDoiSuite:function(otherSuite) {
        var number1 = this.getMauBinhCardNumber(this.getDoiMaxNumber());
        var number2 = otherSuite.getMauBinhCardNumber(otherSuite.getDoiMaxNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        number1 = this.getMauBinhCardNumber(this.getThuOddCardNumber());
        number2 = otherSuite.getMauBinhCardNumber(otherSuite.getThuOddCardNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        return this.isMauBinhBigger(this.getMauBinhDoiMaxCard(), otherSuite.getMauBinhDoiMaxCard());
    },

    compareSimpleSuite:function(otherSuite)
    {
        var number1;
        var number2;
        var count = 0;
        do
        {
            count++;
            number1 = this.cardSuite[this.cardSuite.length - count].number;
            number2 = otherSuite.cardSuite[otherSuite.cardSuite.length - count].number;
            if(number1 == 1)
            {
                number1 = 14;
            }
            if(number2 == 1)
            {
                number2 = 14;
            }
            if(number1 > number2)
            {
                return true;
            }
            if(number1 < number2)
            {
                return false;
            }
        }
        while(count < this.cardSuite.length && count < otherSuite.cardSuite.length);
        return(this.cardSuite.length > otherSuite.cardSuite.length);
    },
    isMauBinhBigger:function(card1, card2) {
        var cardNumber1 = this.getMauBinhCardNumber(card1.number);
        var cardNumber2 = this.getMauBinhCardNumber(card2.number);
        return (cardNumber1 > cardNumber2);
    },
    getMauBinhCardNumber:function(number) {
        if (number == 1) {
            return 14;
        }
        return number;
    },
    compareThuSuite:function(otherSuite) {
        var number1 = this.getMauBinhCardNumber(this.getDoiMaxNumber());
        var number2 = otherSuite.getMauBinhCardNumber(otherSuite.getDoiMaxNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        number1 = this.getMauBinhCardNumber(this.getDoiSecondNumber());
        number2 = otherSuite.getMauBinhCardNumber(this.getDoiSecondNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }

        number1 = this.getMauBinhCardNumber(this.getThuOddCardNumber());
        number2 = otherSuite.getMauBinhCardNumber(otherSuite.getThuOddCardNumber());
        if (number1 > number2) {
            return true;
        } else if (number1 < number2) {
            return false;
        }
        return this.isMauBinhBigger(this.getMauBinhDoiMaxCard(), otherSuite.getMauBinhDoiMaxCard());
    },
    getThuOddCardNumber:function() {
        for (var i=1; i< 14; i++) {
            if (this.numberCount[i] ==1) {
                return i;
            }
        }
        return -1;
    },
    getTuQuyCardNumber:function(){
        for (var i =1; i<14; i++) {
            if (this.numberCount[i] == 4) {
                return i;
            }
        }
        return -1;
    },
    getMauBinhDoiMaxCard:function()
    {
        var number = this.getDoiMaxNumber();
        var tempCard = null;
        for (var i=0; i<this.cardSuite.length; i++) {
            if (this.cardSuite[i].number == number) {
                if (tempCard == null) {
                    tempCard = this.cardSuite[i];
                    continue;
                }
                if (this.isMauBinhBigger(this.cardSuite[i], tempCard)) {
                    tempCard = this.cardSuite[i];
                }
            }
        }
        return tempCard;
    },
    isSanh:function()
    {
        return BkSamCardUtil.isSanh(this.cardSuite);
    },
    isThung:function()
    {
        for(var i = 0; i < this.cardSuite.length; i++)
        {
            if(this.cardSuite[i].type != this.cardSuite[0].type)
            {
                return false;
            }
        }
        return true;
    },
    isTuQuy:function()
    {
        return (this.cardSuite.getBiggestSuiteType() == TUQUY);
    },
    isSam:function()
    {
        return (this.cardSuite.getBiggestSuiteType() == SAMCO);
    },
    isCuLu:function()
    {
        return (this.cardSuite.getBiggestSuiteType() == CULU);
    }
});