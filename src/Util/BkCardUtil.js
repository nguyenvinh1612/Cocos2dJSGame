/**
 * Created by vinhnq on 10/10/2015.
 */
function BkSamCardUtil() {
}
function BkMauBinhCardUtil() {
}
decode = function(value)
{
    var number = Math.floor(value / 4);
    var type = value % 4;
    return new BkCard(number,type);
};
isCardAnimationFinish = function(cardList)
{
    if(cardList == null)
    {
        return true;
    }
    for(var i = 0; i < cardList.length; i++)
    {
        var cardi = cardList[i];
        if(cardi.isAnimation)
        {
            return false;
        }
    }
    return true;
};
deSelectCards = function(CardList,exceptCard)
{
    if(CardList == null || CardList.length == 0)
    {
        return;
    }
    for(var i = 0; i < CardList.length; i++)
    {
        var cardi = CardList[i];
        if(cardi.isSelected())
        {
            if(exceptCard != undefined && (exceptCard.id == cardi.id ))
            {
                continue;
            }
            cardi.deSelect();
            logMessage("deselect card:" + cardi.id);
        }
    }
};
selectCard = function(CardList)
{
    if(CardList == null)
    {
        return;
    }
    for(var i = 0; i < CardList.length; i++)
    {
        var cardi = CardList[i];
        if(!cardi.isSelected())
        {
            cardi.selectCard();
            logMessage("select card:" + cardi.number);
        }
    }
};
getCardList = function(startPos,endPos,cardList)
{
    var rtnList = [];
    for(var i = startPos; i < endPos; i++)
    {
        var cardi = cardList[i];
        rtnList.push(cardi);
    }
    if(rtnList.length > 0)
    {
        return rtnList;
    }
    return null;
};
getCardIndex = function(cardId, cardList)
{
    for(var i = 0; i < cardList.length; i++)
    {
        var cardi = cardList[i];
        if(cardi != null && cardi.id === cardId)
        {
            return i;
        }
    }
    return -1;
};
getCardPos = function (cardID,carList)
{
    if(carList == null || carList.length ==0)
    {
        return null;
    }
    var card = decode(cardID);
    for(var i =0; i < carList.length; i++)
    {
        var cardi = carList[i];
        if(cardi.type == card.type && cardi.number == card.number)
        {
           return new cc.Point(cardi.x,cardi.x);
        }
    }
    return null;
};
removeCardId = function(cardID, cardList)
{
    if(cardList == null || cardList.length == 0 )
    {
        return;
    }
    var i;
    var card;
    for (i=0; i< cardList.length; i++)
    {
        card = cardList[i];
        if (card.encode() == cardID) {
            cardList.splice(i,1);
            card.removeSelf();
        }
    }
};
addCardId = function(cardID, cardList)
{
    if(cardList == null) {
        logMessage("can't add card null into List");
        return;
    }
    var card = decode(cardID);
    cardList.push(card);
};
addBkCard = function(card, cardList)
{
    if(cardList == null) {
        logMessage("can't add card null into List");
        return;
    }
    cardList.push(card);
};
removeCardIdFromArrCardListOnly = function(cardID, cardList) // not remove from Scene
{
    if(cardList == null || cardList.length == 0 )
    {
        return;
    }
    var i;
    var card;
    for (i=0; i< cardList.length; i++)
    {
        card = cardList[i];
        if (card.encode() == cardID) {
            cardList.splice(i,1);
        }
    }
};
////tested
isDoithong3 = function (cardSuite)
{
    return (cardSuite!= null && cardSuite.length == 6) && isDoithong(cardSuite);
};

////tested
isDoithong4 = function (cardSuite)
{
    return (cardSuite!= null && cardSuite.length == 8) && isDoithong(cardSuite);
};
////tested
isDoithong5 = function (cardSuite)
{
    return (cardSuite!= null && cardSuite.length == 10) && isDoithong(cardSuite);
};
// 6 đôi bất kì
//tested
is6Doi = function (cardSuite)
{
    if (cardSuite == null || cardSuite.length != 12) {
        return false;
    }
    for (var i = 0; i < cardSuite.length / 2; i++)
    {
        var cardi = cardSuite[2*i];
        var coupleCardi = cardSuite[2 * i + 1] ;
        if (cardi.number != coupleCardi.number)
        {
            return false;
        }
    }
    return true;
};
//tested
isTuQuy3 = function (cardSuite)
{
    if(cardSuite == null)
    {
        return false;
    }
    var startCard = cardSuite[0];
    return (startCard.number == 3) && isTuQuy(cardSuite);
};
//tested
isDoithongCo3 = function (cardSuite)
{
    if(cardSuite == null)
    {
        return false;
    }
    var startCard = cardSuite[0];
    return (startCard.number == 3) && isDoithong(cardSuite);
};
//tested
isRac2 = function (cardSuite)
{
    if(cardSuite == null)
    {
        return false;
    }
    var startCard = cardSuite[0];
    return isRac(cardSuite) && (startCard.number == 2);
};
//tested
isDoi2 = function (cardSuite)
{
    if(cardSuite == null)
    {
        return false;
    }
    var startCard = cardSuite[0];
    return isDoi(cardSuite) && (startCard.number == 2);
};
isBa2 = function (cardSuite)
{
    if(cardSuite == null)
    {
        return false;
    }
    var startCard = cardSuite[0];
    return isBa(cardSuite) && (startCard.number == 2);
};
//tested
isTuQuy2 = function (cardSuite)
{
    if(cardSuite == null || cardSuite.length != 4)
    {
        return false;
    }
    var startCard = cardSuite[0];
    return isTuQuy(cardSuite) &&(startCard.number == 2);
};
getNumberCount =  function (cardSuite ,number)
{
    if(cardSuite == null || cardSuite.length == 0)
    {
        return 0;
    }
    var count = 0;
    var cardi;
    for (var i = 0; i < cardSuite.length; i++)
    {
        cardi = cardSuite[i];
        if(cardi.number == number)
        {
            count++;
        }
    }
    return count;
};
//tested
isRac = function (currentDiscardSuite)
{
    return (currentDiscardSuite != null && currentDiscardSuite.length == 1);
};
//tested
isDoi = function (cardSuite)
{
    if(cardSuite != null && cardSuite.length == 2)
    {
        var card1 = cardSuite[0];
        var card2 = cardSuite[1];
        if(card1.number == card2.number)
        {
            return true;
        }
    }
    return false;
};
//tested
isBa = function (cardSuite)
{
    if (cardSuite != null && cardSuite.length == 3)
    {
        var card = cardSuite[0];
        if(getNumberCount(cardSuite,card.number) == 3)
        {
            return true;
        }
    }
    return false;
};
//tested
isTuQuy = function (cardSuite)
{
    if (cardSuite != null && cardSuite.length == 4)
    {
        var card = cardSuite[0];
        if(getNumberCount(cardSuite,card.number) == 4)
        {
            return true;
        }
    }
    return false;
};

BkSamCardUtil.isSanh = function(cardSuite)
{

    if(cardSuite == null || cardSuite.length < 3)
    {
        return false;
    }
    if(getNumberCount(cardSuite,3) == 1) // 12345, 34567...
    {
        var listCloneCard = cardSuite.slice();
        listCloneCard = sortCardByNumber(listCloneCard);
        for(var i = 0; i < listCloneCard.length -1 ; i ++)
        {
            if(listCloneCard[i].number + 1 != listCloneCard[i+1].number)
            {
                return false;
            }
        }
        return true;
    }
    if(getNumberCount(cardSuite,3) == 0) // 10JQKA
    {
        return isSanh(cardSuite);
    }
    return false;
};
//tested
isSanh = function (cardList)
{
    if(cardList == null || cardList.length < 3 || getNumberCount(cardList,2) > 0)
    {
        return false;
    }
    var cardSuite = cardList.slice();
    cardSuite = sortCardByType(cardSuite);
    for (var i = 0; i < cardSuite.length -1; i++)
    {
        var cardi = cardSuite[i];
        var nextCard = cardSuite[i +1];
        if(cardi.number == 13 && nextCard.number == 1)
        {
            continue;
        }
        if((cardi.number + 1) != nextCard.number )
        {
            return false;
        }
    }
    return true;
};

//tested
isDoithong = function(cardList)
{
    if (cardList == null || cardList.length % 2 == 1 || cardList.length < 6 || getNumberCount(cardList,2) > 0)
    {
        return false;
    }
    var cardSuite = cardList.slice();
    cardSuite = sortCardByType(cardSuite);
    for (var i = 0; i < cardSuite.length / 2; i++)
    {
        var cardi = cardSuite[2*i];
        var coupleCard = cardSuite[2 * i + 1];
        if(cardi.number != coupleCard.number )
        {
            return false;
        }
    }
    for (var j = 1; j < cardSuite.length / 2; j++)
    {
        var curentNumber = cardSuite[2 * j - 2].number;
        var nextNumber = cardSuite[2 * j].number;
        if(nextNumber == 1)
        {
            nextNumber = 14;
        }
        if(curentNumber + 1 != nextNumber)
        {
            return false;
        }
    }
    return true;
};
isThoi3Bich = function (cardList)
{
    return((cardList!= null &&(cardList.length == 1) && (cardList[0].number == 3) && (cardList[0].type == BICH)));
};
getSelectedCard = function (cardList)
{
    if (cardList == null) {
        return null;
    }
    var retArr = [];
    for (var i = 0; i < cardList.length; i++) {
        var card = cardList[i];
        if (card.isSelected()) {
            retArr.push(card);
        }
    }
    return retArr;
};
findBa = function (selectedCard,cardSuite)
{
    if(getNumberCount(cardSuite,selectedCard.number) < 3)
    {
        return null;
    }
    var cardList = cardSuite.slice();
    cardList = sortCardByType(cardList);
    var rtnList = [];
    var cardi = null;
    var Smallestcard = findSmallestCardWithSameNumber(selectedCard.number,cardList);
    var pos = findCardPos(Smallestcard.number,cardList);
    if(getNumberCount(cardList,selectedCard.number) == 3) // vừa đủ 3 thằng
    {
        // get pos of smallest card
        for(var i = pos; i < pos + 3; i++ )
        {
            cardi = cardList[i];
            rtnList.push(cardi);
        }
        return rtnList;
        // add to return list
    }
    if(getNumberCount(cardList,selectedCard.number) == 4) // tứ quý
    {
        // CƠ, RÔ, NHÉP , BÍCH
        for( var j = pos; j < pos + 4; j++ )
        {
            cardi = cardList[j];
            rtnList.push(cardi);
        }
        if(selectedCard.type == RO || selectedCard.type  == BICH || selectedCard.type == NHEP)
        {
            removeCardIdFromArrCardListOnly(findCard(selectedCard.number,CO,rtnList).encode(),rtnList);
        }
        if(selectedCard.type == CO)
        {
            removeCardIdFromArrCardListOnly(findCard(selectedCard.number,RO,rtnList).encode(),rtnList);

        }
        return rtnList;
    }
    return null;
};
findCard = function(number, type,cardList)
{
    if(cardList == null)
    {
        return null;
    }
    for(var i = 0; i < cardList.length; i++ )
    {
        var Cardi = cardList[i];
        if(Cardi.type == type && Cardi.number == number)
        {
            return Cardi;
        }
    }
    return null;
};
////tested
findSmallestCardWithSameNumber = function (number,cardList)
{
    var card;
    card = findCard(number, BICH,cardList);
    if(card!= null)
    {
        return card;
    }
    card = findCard(number, NHEP ,cardList);
    if(card!= null)
    {
        return card;
    }
    card = findCard(number, RO,cardList);
    if(card!= null)
    {
        return card;
    }
    card = findCard(number, CO,cardList);
    if(card != null)
    {
        return card;
    }
    return null;
};
findBiggestCardWithSameNumber =  function (number,cardList)
{
    var card = findCard(number, CO,cardList);
    if(card!= null)
    {
        return card;
    }
    card = findCard(number, RO,cardList);
    if(card!= null)
    {
        return card;
    }
    card = findCard(number, NHEP,cardList);
    if(card!= null)
    {
        return card;
    }
    card = findCard(number, BICH,cardList);
    if(card != null)
    {
        return card;
    }
    return null;
};
findBigestDoi = function(selectedCard,cardList)
{
    if(getNumberCount(cardList,selectedCard.number) < 2)
    {
        return null;
    }
    var rtnList = [];
    var suggestedCard = findBiggestCardWithSameNumber(selectedCard.number,cardList);
    if(suggestedCard != null)
    {
        if(suggestedCard.type == selectedCard.type) // Quân được chọn là quân lớn nhất luôn
        {
            // tìm quân nhỏ nhất còn lại
            var secondSuggestedCard = findSmallestCardWithSameNumber(selectedCard.number,cardList);
            if(secondSuggestedCard != null)
            {
                rtnList.push(secondSuggestedCard);
                rtnList.push(selectedCard);
                return rtnList;
            }
        }else // quân lới nhất tìm thấy ko phải quân được chọn
        {
            rtnList.push(selectedCard);
            rtnList.push(suggestedCard);
            return rtnList;
        }
    }
    return null;
};
sortCardByType = function(cardList)
{
    var i;
    var j;
    for(i = 0; i < cardList.length - 1; i++)
    {
        for(j = i + 1; j < cardList.length; j++)
        {
            var tmpcard;
            if(cardList[i].number > cardList[j].number)
            {
                tmpcard = cardList[i];
                cardList[i] = cardList[j];
                cardList[j] = tmpcard;
            }
            if (cardList[i].number == cardList[j].number)
            {
                if (cardList[i].type  == CO)
                {
                    tmpcard = cardList[i];
                    cardList[i] = cardList[j];
                    cardList[j] = tmpcard;
                }
                if(cardList[i].type == RO)
                {
                    if(cardList[j].type == NHEP || cardList[j].type == BICH)
                    {
                        tmpcard = cardList[i];
                        cardList[i] = cardList[j];
                        cardList[j] = tmpcard;
                    }
                }
                if(cardList[i].type == NHEP)
                {
                    if(cardList[j].type == BICH)
                    {
                        tmpcard = cardList[i];
                        cardList[i] = cardList[j];
                        cardList[j] = tmpcard;
                    }
                }
            }
        }
    }
    // chuyen At va 2 xuong cuoi
    var totalcount = getNumberCount(cardList,1) + getNumberCount(cardList,2);
    var sortedCard = [];
    var card;
    for(i = totalcount; i < cardList.length; i ++)
    {
        card = cardList[i];
        sortedCard.push(card);
    }
    for(j = 0; j < totalcount; j++)
    {
        card = cardList[j];
        sortedCard.push(card);
    }
    return sortedCard;
};
sortMauBinhCardByType = function(cardList)
{
    var i;
    var j;
    for(i = 0; i < cardList.length - 1; i++)
    {
        for(j = i + 1; j < cardList.length; j++)
        {
            var tmpcard;
            if(cardList[i].number > cardList[j].number)
            {
                tmpcard = cardList[i];
                cardList[i] = cardList[j];
                cardList[j] = tmpcard;
            }
            if (cardList[i].number == cardList[j].number)
            {
                if (cardList[i].type  == CO)
                {
                    tmpcard = cardList[i];
                    cardList[i] = cardList[j];
                    cardList[j] = tmpcard;
                }
                if(cardList[i].type == RO)
                {
                    if(cardList[j].type == NHEP || cardList[j].type == BICH)
                    {
                        tmpcard = cardList[i];
                        cardList[i] = cardList[j];
                        cardList[j] = tmpcard;
                    }
                }
                if(cardList[i].type == NHEP)
                {
                    if(cardList[j].type == BICH)
                    {
                        tmpcard = cardList[i];
                        cardList[i] = cardList[j];
                        cardList[j] = tmpcard;
                    }
                }
            }
        }
    }
    return cardList;
};
sortCardByNumber = function(cardList)
{
    for(var i = 0; i < cardList.length - 1; i++)
    {
        for(var j = i + 1; j < cardList.length; j++)
        {
            var tmpcard;
            if(cardList[i].number > cardList[j].number)
            {
                tmpcard = cardList[i];
                cardList[i] = cardList[j];
                cardList[j] = tmpcard;
            }
        }
    }
    return cardList;
};
findSmallestDoi = function (selectedCard,cardList)
{
    if(getNumberCount(cardList,selectedCard.number) < 2)
    {
        return null;
    }
    var rtnList = [];
    var suggestedCard = findSmallestCardWithSameNumber(selectedCard.number,cardList);
    if(suggestedCard != null)
    {
        if(suggestedCard.type == selectedCard.type) // Quân được chọn là quân nhỏ nhất
        {
            // tìm quân nhỏ nhất còn lại
            var secondSuggestedCard = getCardAtPos(findCardPos(selectedCard.number,cardList) + 1, cardList);
            if(secondSuggestedCard != null)
            {
                rtnList.push(selectedCard);
                rtnList.push(secondSuggestedCard);
                return rtnList;
            }
        }else
        {
            rtnList.push(suggestedCard);
            rtnList.push(selectedCard);
            return rtnList;
        }
    }
    return null;
};

findIndexCardByIdInList = function(cardId,cardList)
{
    if(cardList == null)
    {
        return -1;
    }
    for(var i = 0; i < cardList.length; i++)
    {
        var cardi = cardList[i];
        if(cardi.id === cardId)
        {
            return i;
        }
    }
    return -1;
};

getCardById = function(cardId,cardList)
{
    if(cardList == null)
    {
        return null;
    }
    for(var i = 0; i < cardList.length; i++)
    {
        var cardi = cardList[i];
        if(cardi.id === cardId)
        {
            return cardi;
        }
    }
    return null;
};
getCardAtPos =  function(i, cardList)
{
    if(cardList == null)
    {
        return null;
    }
    var Cardi = cardList[i];
    if(Cardi != null)
    {
        return Cardi;
    }
    return null;
};
getCardNumberAtPos = function (i, cardList)
{
    if(cardList == null)
    {
        return -1;
    }
    var Cardi = cardList[i];
    if(Cardi != null)
    {
        return Cardi.number;
    }
    return -1;
};
findSmallestDoiWithNum = function (cardNum, cardSuite)
{
    var cardList = cardSuite.slice();
    cardList = sortCardByType(cardList);
    if(cardNum == 14 || cardNum == 15)
    {
        cardNum = cardNum - 13;
    }
    if(getNumberCount(cardSuite,cardNum) < 2)
    {
        return null;
    }
    var rtnList = [];
    var suggestedCard1 = findSmallestCardWithSameNumber(cardNum,cardList);
    var suggestedCard2 = getCardAtPos(findCardPos(cardNum,cardList) + 1,cardList);
    if(suggestedCard1 != null && suggestedCard2 != null )
    {
        rtnList.push(suggestedCard1);
        rtnList.push(suggestedCard2);
        return rtnList;
    }
    return null;
};
findRac =  function(selectedCard)
{
    var rtnList = [];
    rtnList.push(selectedCard);
    return rtnList;
};
findCardPos = function (cardNumber,cardList)
{
    if(cardList == null)
    {
        return -1;
    }
    for(var i = 0; i < cardList.length; i++)
    {
        var cardi = cardList[i];
        if(cardi.number == cardNumber)
        {
            return i;
        }
    }
    return -1;
};
findTuQuy =  function(selectedCard,cardSuite)
{
    var cardList = cardSuite.slice();
    cardList = sortCardByType(cardList);
    if(getNumberCount(cardList,selectedCard.number ) == 4)
    {
        var rtnList = [];
        var pos = findCardPos(selectedCard.number,cardList);
        for(var i = pos; i < pos + 4; i++)
        {
            var cardi = cardList[i];
            rtnList.push(cardi);
        }
        return rtnList;
    }
    return null;
};
isContain =  function isContain(Card, Sanh)
{
    if(Card == null)
    {
        return true;
    }
    for(var i = 0; i < Sanh.length; i++)
    {
        var Cardi = Sanh[i];
        if((Cardi.type == Card.type) && (Cardi.number == Card.number) )
        {
            return true;
        }
    }
    return false;
};
isDiscardLast3Bich = function(CardSuite)
{
    if(CardSuite == null)
    {
        return false;
    }
    var lastCard = CardSuite[0];
    return (CardSuite.length== 1) && (lastCard.number == 3) && (lastCard.type == BICH);
};
findDoiThong = function (selectedCard,cardsuite,count)
{
    var cardList = cardsuite.slice();
    cardList = sortCardByType(cardList);
    if(cardList.length < count*2 || selectedCard.number == 2 || findBigestDoi(selectedCard,cardList) < 2)
    {
        return null;
    }
    var selectedNumber = selectedCard.number;
    if(selectedNumber == 1)
    {
        selectedNumber = 14; // Quân Át
    }
    var startPos = 0;
    var endPos = cardList.length;
    do
    {
        // var tmpcardList = getCardlist(startPos,2*count,cardList );
        startPos++;
        var StartNumber = getCardNumberAtPos(startPos,cardList);
        var StartNumber1 = StartNumber + 1;
        var StartNumber2 = StartNumber + 2;
        var StartNumber3 = StartNumber + count -1;
        if(StartNumber >= 14)
        {
            StartNumber = 1;
        }
        if(StartNumber1 >= 14)
        {
            StartNumber1 = 1;
        }
        if(StartNumber2 >= 14)
        {
            StartNumber2 = 1;
        }
        if(StartNumber3 >= 14)
        {
            StartNumber3 = 1;
        }
    }
    while(startPos < endPos  && (getNumberCount(cardList,StartNumber) < 2 ||getNumberCount(cardList,StartNumber1) < 2 ||getNumberCount(cardList,StartNumber2 ) < 2||getNumberCount(cardList,StartNumber3) <2));
    if(startPos + count*2 - 1 > endPos)
    {
        return null;
    }
    var rtnDoiThong = [];
    var startNum = getCardNumberAtPos(startPos,cardList);
    var doii = [];
    for(var i = startNum; i < startNum + count; i++)
    {
        if(i != 3)
        {
            if(i != selectedCard.number)
            {
                doii = findSmallestDoiWithNum(i,cardList);
            }else
            {
                doii = findSmallestDoi(selectedCard,cardList);
            }
        }
        else// đánh 3 bích cuối được công tiền => suggest để lại 3 bích cuối by default nếu người dùng ko chọn 3 bích
        {

            if(getNumberCount(cardList,3) > 2) // phải có từ 3 con 3 trở lên
            {
                //nếu người dùng chủ động chọn card 3 bích => suggest bình thường
                if(selectedNumber == 3 && selectedCard.type == BICH)
                {
                    doii = findSmallestDoi(selectedCard,cardList);
                }
                else // để 3 bích lại
                {
                    var card3Nhep = findCard(3, NHEP, cardList);
                    var card3Ro = findCard(3, RO, cardList);
                    var card3Co = findCard(3, CO, cardList);
                    if(selectedCard.number == 3)
                    {
                        doii.push(selectedCard); // thêm card đầu tiên
                        var card3Bich = findCard(3,BICH,cardList);
                        if(card3Bich != null) // có 3 bích
                        {

                            if (card3Nhep != null && card3Nhep.type != selectedCard.type && doii.length < 2)
                            {
                                doii.push(card3Nhep);
                            }
                            if(card3Ro != null && card3Ro.type != selectedCard.type && doii.length < 2)
                            {
                                doii.push(card3Ro);
                            }
                            if(card3Co != null && card3Co.type != selectedCard.type && doii.length < 2)
                            {
                                doii.push(card3Co);
                            }
                        }else
                        {
                            doii = findSmallestDoi(selectedCard,cardList);
                        }
                    }
                    else
                    {
                        if (card3Nhep != null && doii.length < 2)
                        {
                            doii.push(card3Nhep);
                        }
                        if(card3Ro != null && doii.length < 2 )
                        {
                            doii.push(card3Ro);
                        }
                        if(card3Co != null && doii.length < 2)
                        {
                            doii.push(card3Co);
                        }
                    }
                }
            }else
            {
                doii = findSmallestDoiWithNum(3,cardList);
            }
        }
        if(doii != null && doii.length == 2)
        {
            var card1 = doii[0];
            var card2 = doii[1];
            if(card1.number != 2 && card2.number != 2)
            {
                rtnDoiThong.push(card1);
                rtnDoiThong.push(card2);
            }
        }
    }
    if(rtnDoiThong != null && rtnDoiThong.length == 2*count && isContain(selectedCard,rtnDoiThong))
    {
        return rtnDoiThong;
    }
    return null;
};

findListSelectedCard =  function (CurrentSuggestedCard, NewSuggestedCard)
{
    var rtnList = [];
    if(NewSuggestedCard == null)
    {
        return;
    }
    for(var i = 0; i < NewSuggestedCard.length; i++ ) // có trong danh sách mới mà ko có trong danh sách cũ
    {
        var CardNew =  NewSuggestedCard[i];
        if(!isContain(CardNew,CurrentSuggestedCard))
        {
            rtnList.push(CardNew);
        }
    }
    return rtnList;
};
BkSamCardUtil.getSanh = function(startNumber,count,cardList,secondselectCard,fistSelectedCard)
{
    var startPos = findCardPos(startNumber,cardList);
    if(fistSelectedCard == undefined)
    {
        fistSelectedCard = null;
    }
    if(startPos == -1)
    {
        return null;
    }
    var finishPos = startPos + count ;
    var sanh = [];
    var card;
    for (var i = startPos; i < finishPos; i++)
    {
        card = findSmallestCardWithSameNumber(startNumber,cardList);
        if(i == (finishPos -1))
        {
            card = findBiggestCardWithSameNumber(startNumber,cardList);
        }
        if(card != null)
        {
            if(card.number == 2)
            {
                return null;
            }
            if(card.number == secondselectCard.number)
            {
                sanh.push(secondselectCard);
            }
            else if(fistSelectedCard != null && card.number == fistSelectedCard.number )
            {
                sanh.push(fistSelectedCard);
            }else
            {
                sanh.push(card);
            }
        }
        startNumber++;
        if(startNumber == 14)
        {
            startNumber = 1;
        }
    }
    if(sanh.length == count)
    {
        return sanh;
    }
    return null;
};
getSanh = function(startNumber,count,cardList,secondselectCard,fistSelectedCard)
{
    var startPos = findCardPos(startNumber,cardList);
    if(fistSelectedCard == undefined)
    {
        fistSelectedCard = null;
    }
    if(startPos == -1)
    {
        return null;
    }
    if (startPos + count > 13)
    {
        return null;
    }
    var finishPos = startPos + count ;
    var sanh = [];
    var card;
    for (var i = startPos; i < finishPos; i++)
    {
        card = findSmallestCardWithSameNumber(startNumber,cardList);
        if(i == (finishPos -1))
        {
            card = findBiggestCardWithSameNumber(startNumber,cardList);
        }
        if(card != null)
        {
            if(card.number == 2)
            {
                return null;
            }
            if(card.number == secondselectCard.number)
            {
                sanh.push(secondselectCard);
            }
            else if(fistSelectedCard != null && card.number == fistSelectedCard.number )
            {
                sanh.push(fistSelectedCard);
            }else
            {
                sanh.push(card);
            }
        }
        startNumber++;
        if(startNumber == 14)
        {
            startNumber = 1;
        }
    }
    if(sanh.length == count)
    {
        return sanh;
    }
    return null;

};
findListDeselectCard = function (CurrentSuggestedCard, NewSuggestedCard)
{
    var rtnList = [];
    if(CurrentSuggestedCard == null)
    {
        return rtnList;
    }
    for(var i = 0; i < CurrentSuggestedCard.length; i++ ) // có trong danh sách cũ mà ko có trong danh sách mới
    {
        var CardOld =  CurrentSuggestedCard[i];
        if(!isContain(CardOld,NewSuggestedCard))
        {
            rtnList.push(CardOld);
        }
    }
    return rtnList;
};
updateCardPos = function(card,newPos,cardList)
{
    var oldPos = getCardIndex(card.id,cardList);
    cardList.splice(oldPos, 1);
    cardList.splice(newPos, 0, card);
    return cardList;
};
BkSamCardUtil.sortSanh = function(cardList,isAssending) // isAssending => 12345 else 34512
{
    if(cardList == null || cardList.length < 3)
    {
        return cardList;
    }
    if(isAssending) //34512 => 12345;
    {
        var lastCard = cardList[cardList.length - 1];
        if(lastCard.number == 2)
        {
            cardList = updateCardPos(lastCard,0,cardList);
            lastCard = cardList[cardList.length - 1];
            if(lastCard.number == 1 )
            {
                cardList = updateCardPos(lastCard,0,cardList);

            }
        }
    }else if(!isAssending) // 12345 = > 34512
    {
        var firstCard = cardList[0];
        if(firstCard.number == 1)
        {
            cardList = updateCardPos(firstCard,cardList.length -1,cardList);
            firstCard = cardList[0];
        }
        if(firstCard.number == 2)
        {
            cardList = updateCardPos(firstCard,cardList.length -1,cardList);
        }

    }
    return cardList;
};
BkSamCardUtil.isBiggerSanh = function(newSanh,currentSanh)
{
    if (BkSamCardUtil.isSanh(newSanh))
    {
        if(BkSamCardUtil.isSanh(currentSanh))
        {
            if(newSanh.length == currentSanh.length)
            {
                var newSanhLastCardNumber = newSanh[newSanh.length - 1].number;
                var currentSanhLastCardNumber = currentSanh[currentSanh.length - 1].number;

                if (currentSanhLastCardNumber == 1)
                {
                    currentSanhLastCardNumber = currentSanhLastCardNumber + 13;
                }
                if (newSanhLastCardNumber == 1)
                {
                    newSanhLastCardNumber = newSanhLastCardNumber + 13;
                }
                if(newSanhLastCardNumber == 2 && currentSanhLastCardNumber == 2)
                {
                    var newSanhSecondLastCardNumber = newSanh[newSanh.length - 2].number;
                    var currentSanhSecondLastCardNumber = currentSanh[currentSanh.length - 2].number;
                    return(newSanhSecondLastCardNumber > currentSanhSecondLastCardNumber);
                }
                return (newSanhLastCardNumber > currentSanhLastCardNumber);
            }
        }
    }
    return false;
};
BkSamCardUtil.findSanh = function (startNumber,selectedCard,secondSelectedCard,count,cardList)
{
    var startNum = startNumber;
    var endNum = startNumber + count -1;
    var rtnList = [];
    var card;
    do
    {
        var convertedNum = startNum;
        if(startNum > 13 )
        {
            convertedNum = startNum - 13;
        }
        card = findSmallestCardWithSameNumber(convertedNum,cardList);
        if(rtnList.length == count - 1)
        {
            card = findBiggestCardWithSameNumber(convertedNum,cardList);
        }
        if(convertedNum == selectedCard.number)
        {
            card = selectedCard;
        }
        if(secondSelectedCard != null && convertedNum == secondSelectedCard.number)
        {
             card = secondSelectedCard;
        }
        if(card != null)
        {
            rtnList.push(card);
        }
        startNum++;
    }
    while(rtnList.length < count && startNum <= endNum);
    if(rtnList != null && rtnList.length == count && rtnList[0].number == 1)
    {
        rtnList = updateCardPos(rtnList[0],rtnList.length -1,rtnList);
    }
    if(rtnList != null &&  rtnList.length == count && rtnList[0].number == 2)
    {
        rtnList = updateCardPos(rtnList[0],rtnList.length -1,rtnList);
    }
    if(BkSamCardUtil.isSanh(rtnList) && rtnList.length == count && isContain(selectedCard,rtnList) && isContain(secondSelectedCard,rtnList) )
    {
        return rtnList;
    }
    else
    {
        return null;
    }
};
BkSamCardUtil.findBiggestSanh = function(selectedCard,secondSelectedCard,count,cardList)
{
    var sanh = [];
    var biggestSanh = [];
    for(var startNumber = 1; startNumber < 13; startNumber++)
    {
        sanh = BkSamCardUtil.findSanh(startNumber,selectedCard,secondSelectedCard,count,cardList);
        if((biggestSanh != null && biggestSanh.length == 0 && sanh != null && sanh.length > 0) || BkSamCardUtil.isBiggerSanh(sanh,biggestSanh))
        {
            biggestSanh = sanh;
        }
    }
    if(biggestSanh != null && biggestSanh.length == count)
    {
        return biggestSanh;
    }else
    {
        return null;
    }
};
findBiggestSanh = function (startNumber,selectedCard,count,cardList)
{
    var selectedNumber = selectedCard.number;
    if(selectedNumber == 1) // quân Át
    {
        selectedNumber = 14;
    }
    if(selectedNumber >= 14)
    {
        selectedNumber = 14;
    }
    var rtnSanh = [];
    if(startNumber > selectedNumber )
    {
        return null;
    }
    do
    {
        rtnSanh = getSanh(selectedNumber,count,cardList,selectedCard);
        selectedNumber--;
    }
    while(rtnSanh == null && selectedNumber > selectedCard.number - count );
    return rtnSanh;
};
removeCard = function(carList)
{
    if (carList!= null && carList.length >0)
    {
        for (var i =0; i < carList.length; i++)
        {
            var card = carList[i];
            card.removeSelf();
        }
        while(carList.length > 0)
        {
            carList.splice(0,carList.length);
        }
        carList = null;

    }
};
showDiscardList = function(cardList,player,delay)
{
    logMessage("showDiscardList");
    if(cardList == null)
    {
        return;
    }
    var logic = BkLogicManager.getInGameLogic();
    var CARD_ONHAND_OFFSET = 35;
    var endX =  (cc.director.getWinSize().width - CARD_ONHAND_OFFSET*cardList.length + 36 )/2 ;
    var endY = 339;//cc.director.getWinSize().height/2 + 26;
    if(delay != undefined && delay > 0 )
    {
        logMessage(" delay: "+delay);
        logic.getGameLayer().schedule(function showcard()
        {
            logMessage(" showcard ...");
            showDiscardList(cardList,player);
            logic.getGameLayer().unschedule(showcard);
        },delay);
        return;
    }
    var card;
    if(cardList.length > 0 || logic.isNewTurn)
    {
        logMessage("remove current discardList");
        removeCard(logic.getGameLayer().discardList);
        logic.getGameLayer().discardList = [];
        for (var i=0; i< cardList.length; i++)
        {
            card = cardList[i];
            if(card != null)
            {
                if(player == null) {
                    logMessage("is table sync");
                    card.x = endX;
                    card.y = endY;
                    logic.getGameLayer().addChild(card);
                } else if(!(logic.isMyServerPos(player.serverPosition))) {
                    logMessage("ka ng khac danh");
                    var startPoint = logic.getGameLayer().getAvatarByServerPos(player.serverPosition);
                    card.x = startPoint.x;
                    card.y = startPoint.y;
                    logic.getGameLayer().addChild(card);
                }

                card.setLocalZOrder(i);
                card.hideSelectedMask();
                card.setSelectable(false);
                logic.getGameLayer().discardList.push(card);
                card.move(0.15,endX + i*CARD_ONHAND_OFFSET + 0.5,endY);
            }
        }
    }
};

function traceCardList(cardList, suffix) {
    var str= " card list:";
    if (suffix != null) {
        str = suffix + str;
    }
    for (var i=0; i < cardList.length; i++) {
        str = str + cardList[i].id + "|";
    }
    logMessage(str);
}
sortCardByID = function(cardList)
{
    for (var i=0;i<cardList.length;i++){
        for (var j = i+1;j<cardList.length;j++){
            if (cardList[i].encode() > cardList[j].encode()){
                var tg = cardList[i];
                cardList[i] = cardList[j];
                cardList[j] = tg;
            }
        }
    }
    return cardList;
    //return   cardList.sort(sortCardIDPriority);
};
sortCardIDPriority = function(card1, card2){
    if (card1.encode() > card2.encode()){
        return 1;
    } else {
        return -1;
    }
};


logListCard = function(list){
    if (list == null){
        return;
    }
    var rtn = "|";
    for (var i=0;i<list.length;i++){
        var card = list[i];
        if(card != undefined) {
            var cardID = card.encode();
            rtn += cardID + "-" + card.phomIndex + "|";
        }
    }
    logMessage(rtn);
};
removeListDataLogicOnly = function(list){
    if(list == null)
    {
        return;
    }
    while(list.length > 0)
    {
        list.splice(0,1);
    }
};
isHasCardInList = function(list,card){
    if (list == null){
        return false;
    }
    if (card == null){
        return false;
    }
    for (var i=0;i<list.length;i++){
        if (card.id == list[i].id){
            return true;
        }
    }
    return false;
};
findIndexOfMinValueInList = function(list){
    if (list == null){
        return -1;
    }

    if (list.length == 0){
        return -1;
    }
    var minValue = list[0];
    var sindex = 0;
    for (var i=1;i<list.length;i++){
        if (list[i]<minValue){
            minValue = list[i];
            sindex = i;
        }
    }
    return sindex;
};

listCardInAnimation = function(listCard){
    if (listCard != null && listCard != undefined){
        for (var i=0;i<listCard.length;i++){
            if (listCard[i].isAnimation){
                return true;
            }
        }
    }
    return false;
};
initDragDropForMauBinhCard = function(card,layerGui){
    var self = layerGui;
    var currentHighlightedIndex = -1;
    var onhand = layerGui.getLogic().getMyClientState().getOnHandCard();
    if(layerGui.getLogic().getMyClientState().getMauBinhCard().isNotBinhLung())
    {
        layerGui.getLogic().getMyClientState().getMauBinhCard().showMaskCard();
    }
    var cbMove = function(target,isMoving)
    {
        layerGui.getLogic().getMyClientState().getMauBinhCard().removeMaskCard();
        if (isMoving){
            reorderChild1(target,getMaxZoderOnhand(onhand));
            target.cardImage.setOpacity(100);
        }
        var currentIndex = getIndexOfCardOnhanhWithid(target.id,onhand);
        var newIndex = getIndexOfCardMauBinhOnhanhWith(target,target.x,target.y,onhand);
        if (newIndex != currentIndex)
        {
            if(currentHighlightedIndex != -1)
            {
                onhand[currentHighlightedIndex].showMask(false);
            }
            onhand[newIndex].showMask(true);
            currentHighlightedIndex = newIndex;
        }else
        {
            if(currentHighlightedIndex != -1)
            {
                onhand[currentHighlightedIndex].showMask(false);
            }
        }
    };
    var cbBegan = function(target){

    };
    var cbEnd = function(target,xPos,yPos)
    {
        logMessage("cbEnd");
        resetCardStatusOnhandMB(onhand);
        var currentIndex = getIndexOfCardOnhanhWithid(target.id,onhand);
        var newIndex = getIndexOfCardMauBinhOnhanhWith(target,xPos,yPos,onhand);
        var newPos = layerGui.getPosMBcardWithData(newIndex,ROW_OFFSET,CARD_OFFSET);//mauBinhGetCardPosWithIndex(newIndex,onhand);
        var oldPos = layerGui.getPosMBcardWithData(currentIndex,ROW_OFFSET,CARD_OFFSET);
        if (newIndex == currentIndex){
            target.move(0.25,oldPos.x,oldPos.y);
            target.cardImage.setOpacity(255);
            setZOrder(onhand);
            layerGui.showMaskCard(layerGui.getLogic().getMyClientState());
            return;
        }

        var logic = layerGui.getLogic();
        var me = layerGui.getLogic().getMyClientState();
        target.move(0.25,newPos.x,newPos.y);
        target.cardImage.setOpacity(255);
        onhand[newIndex].showMask(false);
        if(currentHighlightedIndex != -1)
        {
            onhand[currentHighlightedIndex].showMask(false);
        }
        onhand[newIndex].move(0.25,oldPos.x,oldPos.y);
        onhand[newIndex].setCallBackMoveFinish(function() {
            onhand[newIndex].setCallBackMoveFinish(null);
            layerGui.processAfterSwapCard();
        });
        logMessage("currentIndex: "+currentIndex+" newIndex: "+newIndex);
        logListCard(onhand);
        var tg = onhand[currentIndex];
        onhand[currentIndex] = onhand[newIndex];
        onhand[newIndex] = tg;
        logListCard(onhand);
        setZOrder(onhand);
        layerGui.getLogic().getMyClientState().setMauBinhCard(onhand);
    };
    card.initDragDropEventListener(cbBegan,cbEnd,cbMove,0);
};
resetCardStatusOnhandMB= function(onHand){
    var card;
    for (var i=0;i<onHand.length;i++){
        onHand[i].cardStatus = onHand[i].CARD_STATUS_ONHAND_NORMAL;
        onHand[i].cardImage.setOpacity(255);
        onHand[i].unShowTakenMask();
    }
};
setZOrder = function(onhand)
{
    for(var i = 0; i < onhand.length; i++)
    {
        onhand[i].setLocalZOrder(i+1);
    }
};
mauBinhGetCardPosWithIndex = function(index,onhand)
{
    return cc.p(onhand[index].x,onhand[index].y);
};
initDragDropForCard = function(card,layerGui,width){
    var self = layerGui;
    var onhand = layerGui.getLogic().getMyClientState().getOnHandCard();
    var cbMove = function(target,isMoving){
        //logMessage("cbMove");
        if (isMoving){
            reorderChild1(target,getMaxZoderOnhand(onhand));
        }
    };
    var cbBegan = function(target){
        logMessage("cbBegan");
    };
    var cbEnd = function(target,xPos,yPos){
        var onhand = layerGui.getLogic().getMyClientState().getOnHandCard();
        logMessage("cbEnd "+xPos+" - "+yPos + " index "+sortCardByType(xPos,onhand,width));
        var newTagerZorder = getIndexOfCardOnhanhWith(xPos,onhand)-1;
        if (newTagerZorder<0){
            newTagerZorder = 0;
        }
        reorderChild1(target,newTagerZorder);
        var iid = getIndexOfCardOnhanhWith(xPos,onhand);
        var currentID = getIndexOfCardOnhanhWithid(target.id,onhand);
        var fnMove = function(ca){
            ca.setCallBackMoveFinish(null);
            if (iid == currentID){
                // vi tri card k doi

            } else {
                var min = Math.min(iid,currentID);
                var max = Math.max(iid,currentID);
                logMessage("min "+min+" max "+max+" leng: "+onhand.length);
                if (max>= onhand.length){
                    logMessage("co loi khi move -> chi show lai bai");
                    showOnHandCardList(self.getLogic().getMyClientState(),true,self,width);
                    return;
                }

                var isMoveLeft = true;
                if (currentID > iid){
                    isMoveLeft = false;
                }
                var cloneOnhand = onhand.slice();
                var i;
                if (!isMoveLeft){
                    for (i= min;i<max;i++){
                        cloneOnhand[i+1] = onhand[i];
                    }
                    cloneOnhand[min] = onhand[max];
                } else {
                    for (i= min;i<max;i++){
                        cloneOnhand[i] = onhand[i+1];
                    }
                    cloneOnhand[max] = onhand[min];
                }
                logListCard(onhand);
                logListCard(cloneOnhand);
                self.getLogic().getMyClientState().setOnhandCard(cloneOnhand);
                showOnHandCardList(self.getLogic().getMyClientState(),true,self,width);
            }
            if (layerGui.showSortButton){
                layerGui.showSortButton();
            }

        };
        target.setCallBackMoveFinish(fnMove);
        var mPos = getPosCardOnHandWithIndex(iid,target.isSelected(),layerGui,width);
        logMessage("mPos "+mPos.x+" - "+mPos.y);
        target.move(0.15,mPos.x,mPos.y);
    };

    card.initDragDropEventListener(cbBegan,cbEnd,cbMove);
};
getIndexOfCardMauBinhOnhanhWith = function(target,xPos,yPos,onHandCard)
{
    var deltaX = 36;
    var deltaY = 55;
    for(var i = 0; i < onHandCard.length; i++)
    {
        var cardi = onHandCard[i];
        if(cardi.id != target.id)
        {
            if(Math.abs(cardi.x - xPos) < deltaX && Math.abs(cardi.y - yPos) < deltaY)
            {
                return i;
            }
        }
    }
    return getIndexOfCardOnhanhWithid(target.id,onHandCard);
};
getIndexOfCardOnhanhWith = function(xPos,onHandCard,width)
{
    var mWidth = 386;
    if(width != undefined)
    {
        mWidth = width;
    }
    var cardOffset = mWidth/onHandCard.length;
    if(cardOffset >= 72)
    {
        cardOffset = 72;
    }
    var startX =  (cc.director.getWinSize().width - cardOffset*onHandCard.length + 72 )/2 ;
    if (xPos < startX){
        return 0;
    }
    var onHandLeng = onHandCard.length;
    if (xPos> (startX + (onHandLeng - 1)*cardOffset)){
        return onHandLeng - 1;
    }
    var index = 0;
    var sx = startX;
    while(xPos > sx){
        index ++;
        sx += cardOffset;
    }
    return index;
};
getIndexOfCardOnhanhWithid = function(id,onHand){
    for (var i =0;i<onHand.length;i++){
        if (onHand[i].id == id){
            return i;
        }
    }
    return 0;
};
getPosCardOnHandWithIndex = function(mIndex,isSelect,layerGui,width)
{
    var onHandCard = layerGui.getLogic().getMyClientState().getOnHandCard();
    var mWidth = 386;
    if(width != undefined)
    {
        mWidth = width;
    }
    var cardOffset = mWidth/onHandCard.length;
    if(cardOffset >= 72)
    {
        cardOffset = 72;
    }
    var startX =  (cc.director.getWinSize().width - cardOffset*onHandCard.length + 72 )/2 ;
    var yPos = YPOS_ONHAND_DOWN;
    if (isSelect!= undefined){
        if (isSelect){
            yPos = YPOS_ONHAND_UP;
        }
    }

    return cc.p(startX + mIndex*cardOffset,yPos);
};
reorderChild1 = function(target,zOrd){
    if(target.getLocalZOrder() != zOrd)
    {
        target.setLocalZOrder(zOrd);
    }
};
getMaxZoderOnhand = function(onhandCardList)
{
    if (onhandCardList == null)
    {
        return 1000;
    }
    var max =-1;
    for (var i=0;i< onhandCardList.length;i++){
        var iC = onhandCardList[i];
        if (iC.getLocalZOrder() > max)
        {
            max = iC.getLocalZOrder();
        }
    }
    if (max == -1)
    {
        return 1000;
    }
    return max;
};
function disableCardSelection(suite)
{
    if (suite == null) {
        return;
    }
    for (var i=0; i < suite.length; i++)
    {
      suite[i].setSelectable(false);
    }
};
function cardInCardSuite(card, suite) {
    if (suite == null) {
        return false;
    }
    for (var i=0; i < suite.length; i++) {
        if (suite[i].id == card.id) {
            return true;
        }
    }
    return false;
};
TLMNgetSmartSuggestedCards = function (discardSuite, onhandCardSuite, selectedCard) {
    if (discardSuite != null && discardSuite.length > 0) // in a turn
    {
        var startCard = discardSuite[0];
        if (startCard instanceof BkCard){
            logMessage("card is instance of BKCard");
        }else
        {
            logMessage("card is instance of BKCard-> error recheck");
        }
        var startNumber = startCard.number;
        // new code implemented
        var currentSelectedCard = getSelectedCard(onhandCardSuite);
        if (TLMNisabletoWin(currentSelectedCard, discardSuite)) {
            return currentSelectedCard;
        }
        //ended
        if (isRac(discardSuite)) {
            if (isRac2(discardSuite)) {
                if (findDoiThong(selectedCard, onhandCardSuite, 3) && findTuQuy(selectedCard, onhandCardSuite)) {
                    return null; // ko biết user chọn đôi thông hay tứ quý
                }
                if (findDoiThong(selectedCard, onhandCardSuite, 4) != null) {
                    return findDoiThong(selectedCard, onhandCardSuite, 4);
                }
                if (findTuQuy(selectedCard, onhandCardSuite) != null) {
                    return findTuQuy(selectedCard, onhandCardSuite);
                }
                if (findDoiThong(selectedCard, onhandCardSuite, 3) != null) {
                    return findDoiThong(selectedCard, onhandCardSuite, 3);
                }
            }
            return findRac(selectedCard);
        }
        if (isDoi(discardSuite)) {
            if (isDoi2(discardSuite)) {
                if (findDoiThong(selectedCard, onhandCardSuite, 4) != null) {
                    return findDoiThong(selectedCard, onhandCardSuite, 4);
                }
                if (findTuQuy(selectedCard, onhandCardSuite) != null) {
                    return findTuQuy(selectedCard, onhandCardSuite);
                }
            }
            return findSmallestDoi(selectedCard, onhandCardSuite);
        }
        if (isBa(discardSuite)) {
            return findBa(selectedCard, onhandCardSuite);
        }
        if (isTuQuy(discardSuite)) {
            if (findDoiThong(selectedCard, onhandCardSuite, 4) != null) {
                return findDoiThong(selectedCard, onhandCardSuite, 4);
            }
            return findTuQuy(selectedCard, onhandCardSuite);
        }
        if (isSanh(discardSuite)) {
            var rtnSanh = findBiggestSanh(startNumber, selectedCard, discardSuite.length, onhandCardSuite);
            if (rtnSanh != null && getCardIndex(selectedCard.id, rtnSanh) != -1) {
                if(TLMNisabletoWin(rtnSanh,discardSuite))
                {
                    return rtnSanh;
                }
            }
            return null;
        }
        if (isDoithong(discardSuite)) {
            if (isDoithong4(discardSuite)) {
                return findDoiThong(selectedCard, onhandCardSuite, 4);
            }
            if (isDoithong3(discardSuite)) {
                if (findDoiThong(selectedCard, onhandCardSuite, 4) != null) {
                    return findDoiThong(selectedCard, onhandCardSuite, 4);
                }
                if (findTuQuy(selectedCard, onhandCardSuite) != null) {
                    return findTuQuy(selectedCard, onhandCardSuite);
                }
                return findDoiThong(selectedCard, onhandCardSuite, 3);
            }
        }
    }
    return null;
};

TLMNgetSmartSuggestNewturn = function (onhandCardSuite, selectedList) {
    // đánh lượt mới
    if (selectedList.length != 2) {
        return null;
    }
    var firstselectedCard = selectedList[0];
    var secondSelectedCard = selectedList[1];
    if (isDoi(selectedList)) {
        if (findTuQuy(secondSelectedCard, onhandCardSuite) != null) {
            return findTuQuy(secondSelectedCard, onhandCardSuite);
        }
        if (findBa(secondSelectedCard, onhandCardSuite) != null) {
            return findBa(secondSelectedCard, onhandCardSuite);
        }
        return findSmallestDoi(secondSelectedCard, onhandCardSuite);
    }
    //không phải đôi, get sanh
    var Sanh = [];
    for (var startNubmber = 3; startNubmber < 14; startNubmber++)
        for (var sanhCount = onhandCardSuite.length; sanhCount >= 3; sanhCount--) {
            Sanh = getSanh(startNubmber, sanhCount, onhandCardSuite, secondSelectedCard, firstselectedCard);
            if (Sanh != null && isContain(firstselectedCard, Sanh) && isContain(secondSelectedCard, Sanh)) {
                return Sanh;
            }
        }
    return null;
};
TLMNisabletoWin = function (NewSuggestedCard, currentDiscard) {
    if (!isRac(NewSuggestedCard) && !isDoi(NewSuggestedCard) && !isBa(NewSuggestedCard) && !isTuQuy(NewSuggestedCard) && !isDoithong(NewSuggestedCard) && !isSanh(NewSuggestedCard)) {
        return false;
    }
    if ((currentDiscard == null || currentDiscard.length == 0) && (NewSuggestedCard != null && NewSuggestedCard.length > 0)) {
        return true;
    }
    if (isRac2(currentDiscard)) {
        if (isDoithong3(NewSuggestedCard) || isDoithong4(NewSuggestedCard) || isTuQuy(NewSuggestedCard)) {
            return true;
        }
    }
    if (isDoi2(currentDiscard) || isDoithong3(currentDiscard)) {
        if (isDoithong4(NewSuggestedCard) || isTuQuy(NewSuggestedCard)) {
            return true;
        }
    }
    if (isTuQuy(currentDiscard)) {
        if (isDoithong4(NewSuggestedCard)) {
            return true;
        }
    }
    //các trường hợp còn lại length phải bằng nhau. So sánh chất
    if (currentDiscard.length != NewSuggestedCard.length) {
        return false;
    }
    var SuggestedlastCard = NewSuggestedCard[NewSuggestedCard.length - 1];
    var DiscardLastCard = currentDiscard[currentDiscard.length - 1];
    var SuggestedlastCardNumber = SuggestedlastCard.number;
    var DiscardLastCardNumber = DiscardLastCard.number;
    if (DiscardLastCardNumber == 1 || DiscardLastCardNumber == 2) // xử lý quân At và 2
    {
        DiscardLastCardNumber = DiscardLastCardNumber + 13;
    }
    if (SuggestedlastCardNumber == 1 || SuggestedlastCardNumber == 2) {
        SuggestedlastCardNumber = SuggestedlastCardNumber + 13;
    }
    if (SuggestedlastCardNumber < DiscardLastCardNumber) {
        return false;
    }
    if (SuggestedlastCardNumber == DiscardLastCardNumber) {
        if (DiscardLastCard.type == CO) {
            return false;
        }
        if (DiscardLastCard.type == RO && (SuggestedlastCard.type == RO || SuggestedlastCard.type == NHEP || SuggestedlastCard.type == BICH)) {
            return false;
        }
        if (DiscardLastCard.type == NHEP && (SuggestedlastCard.type == NHEP || SuggestedlastCard.type == BICH)) {
            return false;
        }
        if (DiscardLastCard.type == BICH && (SuggestedlastCard.type == BICH )) {
            return false;
        }
    }
    return true;
};
showThoiBaiMark = function(player)
{
    var cardList = player.getOnHandCard();
    if(cardList == null || cardList.length == 0)
    {
        return;
    }
    var doiThong = [];
    for(var i = 0; i < cardList.length; i++)
    {
        var cardi = cardList[i];
        if(cardi.number == 2 || (cardList.length == 1 && cardi.number == 3 && cardi.type == BICH)) // thoi 2 va thoi 3 bich
        {
            cardi.setCardStatus(CARD_STATUS_TAKEN,true);
        }
        // thoi tu quy
        if(getNumberCount(cardList,cardi.number) == 4)
        {
            cardi.setCardStatus(CARD_STATUS_TAKEN,true);
        }
        // thoi doi thong
        doiThong = findDoiThong(cardi, cardList, 4);
        if(doiThong != null && doiThong.length > 0)
        {
            cardi.setCardStatus(CARD_STATUS_TAKEN,true);
        }else if( findDoiThong(cardi, cardList, 3))
        {
            cardi.setCardStatus(CARD_STATUS_TAKEN,true);
        }
    }
    // bỏ hightlight card to nhat trong truong hop doi thong va co 3 card vd : 4455566 => hạ 5 to nhat xuống
    for(var i = 0; i < cardList.length; i++)
    {
        cardi = cardList[i];
        if(cardi.number != 2 && getNumberCount(cardList,cardi.number) == 3 && cardi.cardUIStatus == CARD_STATUS_TAKEN)
        {
            cardi = findBiggestCardWithSameNumber(cardi.number,cardList);
            cardi.unShowTakenMask();
        }
    }
};
BkMauBinhCardUtil.sortSanh = function(cardList) // isAssending => 12345 else 34512
{
    if(cardList == null || cardList.length < 3)
    {
        return cardList;
    }
    var lastCard = cardList[cardList.length - 1];
    if(lastCard.number == 1)
    {
        cardList = updateCardPos(lastCard,0,cardList);
        lastCard = cardList[cardList.length - 1];
    }
    return cardList;
};
showCardAnimation = function(gui,dur,cardList)
{
  var bkShowCard = new BkShowCardAnimation();
    gui.addChild(bkShowCard);
    bkShowCard.showCardAnimation(dur,cardList);
};
