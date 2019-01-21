/**
 * Created by bs on 05/05/2017.
 */
BkChanClientState = BkClientState.extend({
    ListEatCards:null,
    ListPlayCards:null,
    tienGopGa:0,
    Fault:false,
    chiuCount:0,
    onHandSelectedCard:null,
    Fault:false,
    ctor:function(){
        this._super();
        this.ListEatCards = [];
        this.ListPlayCards = [];
    },
    getListOnHandCards:function()
    {
        return this.onhandCardList;
    },
        getListEatCards:function()
    {
        return this.ListEatCards;
    },
    getListPlayCards:function()
    {
        return this.ListPlayCards;
    },
    addOnHandCard:function(cardNum){
        var card = new BkChanCard(cardNum);
        card.setCardStatus(CCard.CARD_STATUS_ONHAND_NORMAL);
        card.setPlayer(this);
        this.onhandCardList.push(card);
    },
    addEatCardObject:function(card, status)
    {
        card.setPlayer(this);
        this.ListEatCards.push(card);
        card.setCardStatus(status);
    },
    addEatCard:function(cardNum, status)
    {
        var card = new BkChanCard(cardNum);
        card.setPlayer(this);
        card.setCardStatus(status);
        this.ListEatCards.push(card);
    },
    addDiscardCard:function(cardNum, status)
    {
        var card = new BkChanCard(cardNum);
        card.setPlayer(this);
        card.setCardStatus(status);
        this.ListPlayCards.push(card);
    },
    addDiscardCardObject:function(card, status)
    {
        card.setPlayer(this);
        card.setCardStatus(status);
        this.ListPlayCards.push(card);
    },
    removeCardInList:function(list,card){
        //logMessage("removeCardInList "+card.CardId);
        //this.logListChanCard(list);
        for (var i=0;i<list.length;i++){
            var tempCard = list[i];
            if (tempCard == card){
                list.splice(i,1);
                //logMessage("after remove");
                //this.logListChanCard(list);
                return;
            }
        }
    },
    removeLastPlayCard:function(){
        var pos = this.ListPlayCards.length-1;
        var card = this.ListPlayCards[pos];
        this.ListPlayCards.splice(pos,1);
        return card;
    },
    OnHandMouseUp:function(selectedCard)
    {
        this.onHandSelectedCard = selectedCard;

        if (this.onHandSelectedCard.isOnHandUp()) {
            this.onHandSelectedCard.CardOnhandMoveDown();
            this.onHandSelectedCard = null;
            return;
        }

        for (var i =0; i< this.onhandCardList.length; i++)
        {
            var card = this.onhandCardList[i];
            if (card.isOnHandUp()) {
                card.CardOnhandMoveDown();
            }
        }
        this.onHandSelectedCard.CardOnhandMoveUp();
    },
    getOnhandSelectedCard:function() {
        if (this.onHandSelectedCard != null && this.onHandSelectedCard.isOnHandUp()) {
            return this.onHandSelectedCard;
        } else {
            return null;
        }
    },
    getOnHandCardByID:function(cardServerID) {
        this.logListChanCard(this.onhandCardList);
        var str = "CardID:" + cardServerID + " Card On Hand =";
        for (var i =this.onhandCardList.length -1; i>= 0; i--) {
            var temp = this.onhandCardList[i];
            str = str + "("+ i + "|" + temp.CardId + "|" + temp.getServerCardID()  + ")";
            if (temp.getServerCardID() == cardServerID) {
                logMessage(str + "Ok");
                return temp;
            }
        }
        logMessage(str + "NG");
        return null;
    },
    // S�p x?p card theo th? t? t�ng d?n
    sortIncreaseCard:function(ListCard) {
        var tempList = [];
        for (var i = 2; i < 10; i++)
        {
            var card;
            while (true)
            {
                card = this.getCardByNumber(ListCard,i);
                if (card == null) {
                    break;
                } else {
                    tempList.push(card);
                    this.removeCardInList(ListCard,card);
                }
         }
        }

        while (true)
        {
            card = this.getCardByNumber(ListCard,0);
            if (card == null) {
                break;
            } else {
                tempList.push(card);
                this.removeCardInList(ListCard,card);
            }
        }
        return tempList;
    },
    getCardByNumber:function(ListCards,cardID){
        var retVar = null;
        for (var i =0; i < ListCards.length; i++) {
            var temp = ListCards[i];
            if (temp.getCardNumber() == cardID) {
                if (retVar == null || retVar.getCardId() > temp.getCardId()) {
                    retVar = temp;
                }
            }
        }
        return retVar;
    },
    sortCard:function(lstCard){
        var str= "List card:";
        if (lstCard == null){
            return null;
        }
        str = str + "Origin Length:" + lstCard.length;
        var ListCard;
        ListCard = this.sortIncreaseCard(lstCard);
        str = str + " After get increase :" + ListCard.length;

        var tempList1 = [];
        var tempList2 = [] ;
        var tempList3 = [] ;
        var i;
        var card1;
        var card2;
        var card3;

        i = 0;
        // Lay chan
        while (i < ListCard.length -1)
        {
            card1 = ListCard[i];
            card2 = ListCard[i+1];
            if (card1.CardId == card2.CardId) {
                tempList1.push(card1);
                tempList1.push(card2);
                this.removeCardInList(ListCard,card1);
                this.removeCardInList(ListCard,card2);
            } else {
                i = i+1;
            }
        }

        i=0;
        // Lay 3 dau
        while (i < ListCard.length -2)
        {
            card1 = ListCard[i];
            card2 = ListCard[i+1];
            card3 = ListCard[i+2];
            if ((card1.getCardNumber() == card2.getCardNumber()) && (card1.getCardNumber() == card3.getCardNumber())) {
                tempList2.push(card1);
                tempList2.push(card2);
                tempList2.push(card3);
                this.removeCardInList(ListCard,card1);
                this.removeCardInList(ListCard,card2);
                this.removeCardInList(ListCard,card3);
            } else {
                i = i+1;
            }
        }

        i=0;
        // Lay ca
        while (i < ListCard.length -1)
        {
            card1 = ListCard[i];
            card2 = ListCard[i+1];
            if (card1.getCardNumber() == card2.getCardNumber()) {
                tempList3.push(card1);
                tempList3.push(card2);
                this.removeCardInList(ListCard,card1);
                this.removeCardInList(ListCard,card2);
            } else {
                i = i+1;
            }
        }

        // Add lai bai vao tempList1
        // Add ca vao
        while (tempList3.length >0) {
            card1 = tempList3[0];
            tempList1.push(card1);
            tempList3.splice(0,1);
        }
        // Add 3 dau
        while (tempList2.length >0) {
            card1 = tempList2[0];
            tempList1.push(card1);
            tempList2.splice(0,1);
        }
        // Add normal card
        while (ListCard.length >0) {
            card1 = ListCard[0];
            tempList1.push(card1);
            ListCard.splice(0,1);
        }
        str = str + " card:";
        for (i=0; i<tempList1.length; i++){
            card1 = tempList1[i];
            str = str + card1.getCardId() + "|";
        }
        logMessage(str);
        return tempList1;
    },
    sortCardOnHand:function(){
        this.onhandCardList = this.sortCard(this.onhandCardList);
    },
    removeCardOnHand:function(card) {
        if(card == null){
            return;
        }
        card.setCardStatus(CCard.CARD_STATUS_ONTABLE_DANH);

        this.removeCardInList(this.onhandCardList,card);
    },
    countCardOnHand:function(serverCardID) {
        var count = 0;
        for (var i =0; i < this.onhandCardList.length; i++) {
        var card = this.onhandCardList[i];
            if (card.getServerCardID() == serverCardID) {
                count++;
            }
        }
        return count;
    },
    getLastPlayedCard:function() {
        logMessage("getLastPlayedCard");
        this.logListChanCard(this.ListPlayCards);
        if (this.ListPlayCards == null || this.ListPlayCards.length == 0) {
            return null;
        } else {
            var length = this.ListPlayCards.length;
            var rtnCard = this.ListPlayCards[length -1];
            logMessage("rtnCard: "+rtnCard.CardId);
            return rtnCard;
        }
    },
    getLeftMostOnHandCards:function() {
        if (this.onhandCardList == null) {
            return null;
        } else {
            return this.onhandCardList[this.onhandCardList.length -1];
        }
    },
    hideCardOnHand:function() {
        if (this.onhandCardList == null) {
            return;
        }
        var card;
        for (var i =0; i < this.onhandCardList.length; i++) {
            card = this.onhandCardList[i];
            card.setVisible(false);
        }
    },
    countCaNumber:function(list){
        var ListCard;
        ListCard = this.sortIncreaseCard(list);

        var tempList3 = [];
        var i;
        var card1;
        var card2;

        i=0;
        // Lay ca
        while (i < ListCard.length -1)
        {
            card1 = ListCard[i];
            card2 = ListCard[i+1];
            if (card1.getCardNumber() == card2.getCardNumber()) {
                tempList3.push(card1);
                tempList3.push(card2);
                this.removeCardInList(ListCard,card1);
                this.removeCardInList(ListCard,card2);
            } else {
                i = i+1;
            }
        }

        var NoCa = Math.floor(tempList3.length * 0.5);
        logMessage("So Ca: "+NoCa);
        return NoCa;
    },
    countChanNumber:function(list){
        var ListCard;
            ListCard = this.sortIncreaseCard(list);

            var tempList1 = [];
            var i;
            var card1;
            var card2;

            i = 0;
            // Lay chan
            while (i < ListCard.length -1) {
                card1 = ListCard[i];
                card2 = ListCard[i+1];
                if (card1.CardId == card2.CardId) {
                    tempList1.push(card1);
                    tempList1.push(card2);
                    this.removeCardInList(ListCard,card1);
                    this.removeCardInList(ListCard,card2);
                } else {
                    i = i+1;
                }
            }

            var NoChan = Math.floor(tempList1.length * 0.5);
            logMessage("So Chan: "+NoChan);
            return NoChan;
    },
    canUWithCard:function(cardID) {
        var numOfChan = 0;
        var numOfCa = 0;

        var tempCard = new BkChanCard(cardID);
        var lastCard;
        var card1;
        var card2;

        lastCard = this.onhandCardList[this.onhandCardList.length -1];
        if (lastCard.getCardNumber() != tempCard.getCardNumber()) {
            return false;
        }

        var i = 0;
        while (i < this.onhandCardList.length -1) {
            card1 = this.onhandCardList[i];
            card2 = this.onhandCardList[i +1];
            if (card1.getCardId() == card2.getCardId()) {
                numOfChan++;
                i = i +2;
                continue;
            }

            if (card1.getCardNumber() == card2.getCardNumber()) {
                numOfCa++;
                i = i+2;
                continue;
            }
            break;
        }

        for (i=0; i< this.ListEatCards.length /2; i++) {
            card1 = this.ListEatCards[i * 2];
            card2 = this.ListEatCards[i* 2 + 1];
            if (card1.getCardId() == card2.getCardId()) {
                numOfChan++;
            } else {
                numOfCa++;
            }
        }

        if (numOfChan + numOfCa < 9) {
            return false;
        }

        if ((numOfChan < 5) || ((numOfChan ==5) && lastCard.getCardId() != tempCard.getCardId()))
        {
            return false;
        }

        return true;
    },
    getLastTakeCard:function(){
        if (this.ListEatCards != null) {
            return this.ListEatCards[this.ListEatCards.length -1];
        }
        return null;
    },
    canEatCard:function(discardCard)
    {
        if (discardCard == null){
            return false;
        }
        // Check
        if (this.daDanhCardID(discardCard.getCardId())) {
            return false;
        }
        if (this.daCoCa(discardCard.getCardNumber())) {
            return false;
        }
        return true;
    },
    daAnCa:function() {
        if (this.ListEatCards == null) {
            return false;
        }

        var i;
        for (i=0; i < this.ListEatCards.length / 2; i++) {
            var card1 = this.ListEatCards[i*2];
            var card2 = this.ListEatCards[i* 2 + 1];
            if (card1.getCardId() != card2.getCardId()) {
                return true;
            }
        }
        return false;
    },
    daCoCa:function(cardNumber)
    {
        if (this.ListEatCards == null) {
            return false;
        }

        var i;
        for (i=0; i < this.ListEatCards.length / 2; i++) {
            var card1 = this.ListEatCards[i*2];

            if (card1.getCardNumber() != cardNumber) {
                continue;
            }

            var card2 = this.ListEatCards[i* 2 + 1];
            if (card1.getCardId() != card2.getCardId()) {
                return true;
            }
        }
        return false;
    },
    daDanhCardNumber:function(cardNumber) {
        if (this.ListPlayCards == null) {
            return false;
        }

        var i;
        for (i=0; i<this.ListPlayCards.length; i++) {
            var card = this.ListPlayCards[i];
            if (card.getCardNumber() == cardNumber) {
                return true;
            }
        }
        return false;
    },
    daDanhCardID:function(cardID) {
        if (this.ListPlayCards == null) {
            return false;
        }

        var i;
        for (i=0; i<this.ListPlayCards.length; i++) {
            var card = this.ListPlayCards[i];
            if (card.getCardId() == cardID) {
                return true;
            }
        }
        return false;
    },
    countCardByNumber:function(cardNumber) {
        var count = 0;
        var i;
        var card;
        if (this.ListPlayCards != null) {
            for (i=0; i < this.ListPlayCards.length; i++) {
                card = this.ListPlayCards[i];
                if (card.getCardNumber() == cardNumber) {
                    count++;
                }
            }
        }
        if (this.ListEatCards != null) {
            for (i=0; i < this.ListEatCards.length; i ++) {
                card = this.ListEatCards[i];
                if (card.getCardNumber() == cardNumber) {
                    count++;
                }
            }
        }
        return count;
    },
    countRedCardEat:function() {
        var count = 0;
        if (this.ListEatCards != null) {
            for (var i = 0; i < this.ListEatCards.length; i++) {
                var card = this.ListEatCards[i];
                if (card.isRedCard()) {
                    count++;
                }
            }
        }
        return count;
    },
    clearCard:function()
    {
        this.onhandCardList = [];
        this.ListEatCards = [];
        this.ListPlayCards = [];
    },
    setFault:function(isFault){
        this.Fault = isFault;
    },
    logListChanCard:function(list){
        var str = "["+list.length+"]|";
        for (var i=0;i<list.length;i++){
            str+=list[i].CardId+"|"
        }
        logMessage(str);
    },
    clearListCard:function(lists){
        if(lists == null)
        {
            return;
        }
        var card;
        while(lists.length > 0)
        {
            card = lists[0];
            lists.splice(0,1);
            card.removeFromParent();
        }
    },
    clearAllCard:function(){
        this.clearListCard(this.onhandCardList);
        this.clearListCard(this.ListEatCards);
        this.clearListCard(this.ListPlayCards);
    },
    removeAllCurentCard:function(){
        this._super();
        this.clearAllCard();
    }
});