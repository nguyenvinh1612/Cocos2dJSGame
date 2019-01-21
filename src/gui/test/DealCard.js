/**
 * Created by vinhnq on 9/30/2015.
 */

    generateCard = function()
    {
        var card1 = new BkCard(3,1);
        var card2 = new BkCard(3,2);

        var card3 = new BkCard(4,2);
        var card4 = new BkCard(4,3);
        var card5 = new BkCard(5,0);
        var card6 = new BkCard(5,1);
        var card7 = new BkCard(6,2);

        var card8 = new BkCard(6,1);
        var card9 = new BkCard(7,1);
        var card10 = new BkCard(7,1);
        var card11 = new BkCard(8,1);
        var card12= new BkCard(8,1);
        var card13 = new BkCard(9,1);

        var carlist = [];
        carlist.push(card1);
        carlist.push(card2);
        carlist.push(card3);

        carlist.push(card4);
        carlist.push(card5);
        carlist.push(card6);
        carlist.push(card7);
        carlist.push(card8);
        carlist.push(card9);
        carlist.push(card10);
        carlist.push(card11);
        carlist.push(card12);
        carlist.push(card13);
        return carlist;
    };
RunTestCard = function()
{
    var testCard = [];
    var cardList = generateCard();
    var startNumber = 3;
    var selectedcard = new BkCard(6,1);
    var Firstselectedcard = new BkCard(3,1);
    var Secondselectedcard = new BkCard(2,1);

   // testCard = findTuQuy(selectedcard,cardList);
  //  testcard = getSanh(startNumber,4,cardList,Secondselectedcard,Firstselectedcard);
   // testcard = findBigestDoiWithNum(3,cardList);
    testcard = findDoiThong(selectedcard,cardList,4);
    testcard = findBiggestSanh(3,selectedcard,3,cardList);
    //testCard = findBigestDoiWithNum();
    //testCard = findBiggestSanh()
    var tlmn = new BkTLMNMoneyLogic();
    var test = tlmn.cashWinWhenThoi(56,1);
    logMessage("done");

};
