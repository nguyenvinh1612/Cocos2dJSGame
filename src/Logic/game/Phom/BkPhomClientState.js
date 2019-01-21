/**
 * Created by bs on 10/12/2015.
 */
var MOM_POINT = 10000;
BkPhomClientState = BkClientState.extend({
    discardList:null,
    phomsList:null,
    takenList:null,
    takenCardsCount:0,
    phomFlag:null,
    bestFinalPoint:0,
    currentBestPoint:1000,
    validListCardFlag:false,
    playerPoint:-1,
    listBtnGui:null,
    listPhomAddedButton:null,
    diemSprite:null,
    ctor:function(){
        logMessage("phom client state");
        this._super();
        this.discardList = [];
        this.phomsList = [];
        this.takenList = [];
        this.phomFlag = [];
        this.listBtnGui = [];
        this.listPhomAddedButton = [false,false,false,false];
    },
    removeAllCurentCard:function(){
        logMessage("removeAllCurentCard");
        this._super();
        this.removeDisCardList();
        this.removePhomList();
        this.removeTakenList();
        this.removeListBtnGui();
    },
    setDisCardList:function(handList)
    {
        this.discardList = handList;
        logListCard(this.discardList);
    },
    getDiscardList:function(){
        return this.discardList;
    },
    setPhomList:function(handList)
    {
        this.phomsList = handList;
        logListCard(this.phomsList);
    },
    getPhomList:function(){
        return this.phomsList;
    },
    setTakenList:function(handList)
    {
        this.takenList = handList;
        logListCard(this.takenList);
    },
    getTakenList:function(){
        return this.takenList;
    },
    removeDisCardList:function()
    {
        if(this.discardList == null)
        {
            return;
        }
        var card;
        while(this.discardList.length > 0)
        {
            card = this.discardList[0];
            this.discardList.splice(0,1);
            card.removeFromParent();
        }
    },
    removePhomList:function()
    {
        if(this.phomsList == null)
        {
            return;
        }
        var card;
        while(this.phomsList.length > 0)
        {
            card = this.phomsList[0];
            this.phomsList.splice(0,1);
            card.removeFromParent();
        }
    },
    removeTakenList:function()
    {
        if(this.takenList == null)
        {
            return;
        }
        var card;
        while(this.takenList.length > 0)
        {
            card = this.takenList[0];
            this.takenList.splice(0,1);
            card.removeFromParent();
        }
    },
    removeListBtnGui:function()
    {
        //logMessage("removeListBtnGui");
        if(this.listBtnGui == null)
        {
            //logMessage("this.listBtnGui == null");
            return;
        }
        var btn;
        //logMessage("this.listBtnGui.length: "+this.listBtnGui.length);
        while(this.listBtnGui.length > 0)
        {
            btn = this.listBtnGui[0];
            this.listBtnGui.splice(0,1);
            btn.removeFromParent();
        }
        this.listBtnGui = null;
        this.listPhomAddedButton = [false,false,false,false];
    },
    removeOnhandCard:function(){
        this._super();
        this.removeDiemSprite();
    },
    removeDiemSprite:function(){
      if (this.diemSprite != null){
          this.diemSprite.removeFromParent();
          this.diemSprite = null;
      }
    },
    /*
    * implement to support sort onhand phom
    * */
    countNumberTakenCard:function(){
        var count =0;
        for (var i=0;i<this.onhandCardList.length;i++) {
            var iCard = this.onhandCardList[i];
            if (iCard.cardUIStatus == CARD_STATUS_TAKEN){
                count++;
            }
        }
        return count;
    },
    isRacPhom:function(card){
        /*
        * check card k co ca hoac phom trong list onhand
        * */
        if (card.phomIndex != 0){
            // o trong phom thi k la rac
            return false;
        }
        for (var j=0;j<this.onhandCardList.length;j++){
            var jCard = this.onhandCardList[j];
            if (jCard.encode() != card.encode()){
                var listCheckCa = [];
                listCheckCa.push(jCard);
                listCheckCa.push(card);
                if (findBestPhomCard.isPhomOrCa(listCheckCa)){
                    // trong list bai co cay tao thanh ca -> khong la rac
                    return false;
                }
            }
        }
        return true;
    },
    isCa:function(ca1,ca2){
        if (ca1.getNumber() == ca2.getNumber()){
            return true;
        }
        var diffId = Math.abs(ca1.encode() - ca2.encode());
        if ( (diffId == 4) || (diffId == 8) ){
            return true;
        }
        return false
    },
    isRacInList:function(card,list){
        for (var j=0;j<list.length;j++){
            var jCard = list[j];
            if (jCard.encode() != card.encode()){
                if (this.isCa(jCard,card)){
                    return false;
                }
            }
        }
        return true;
    },
    sortOnhandCardAfterPickOrTake:function(callbackFN) {
        var list = [];
        var listRac = [];
        var i,j;
        var pointRac = 0;
        sortCardByID(this.onhandCardList);
        for (i=0;i<this.onhandCardList.length;i++){
            var iC = this.onhandCardList[i];
            if (this.isRacPhom(iC)){
                listRac.push(iC);
                pointRac += iC.getNumber();
            } else {
                list.push(iC);
            }
        }

        findBestPhomCard.findWithData(list);
        if (this.currentBestPoint > (findBestPhomCard.bestFinalPoint + pointRac) ) {
            logMessage("tim duoc phuong an tot hon -> store ket qua");
            // tim duoc phuong an xep tot hon
            this.currentBestPoint = findBestPhomCard.bestFinalPoint + pointRac;//findBestPhomCard.bestFinalPoint;
            list = findBestPhomCard.listFind;
            for (i=0;i<listRac.length;i++){
                list.push(listRac[i]);
            }
            this.onhandCardList = list;
        }

        var rtnList = [];
        sortCardByID(this.onhandCardList);
        for (i = 1; i < 4; i++) {
            for (j = 0; j < this.onhandCardList.length; j++) {
                if (this.onhandCardList[j].phomIndex == i) {
                    rtnList.push(this.onhandCardList[j]);
                }
            }
        }

        var listCaVaRac = []; // list bai con lai khong la phom
        var listCardRac = []; // cac cay bai rac trong list con lai
        var listCa = []; // cac cay co ca trong list con lai

        // lay cac cay k la phom trong list
        for (j = 0; j < this.onhandCardList.length; j++) {
            if (this.onhandCardList[j].phomIndex == 0) {
                listCaVaRac.push(this.onhandCardList[j]);
            }
        }
        sortCardByID(listCaVaRac);

        // check trong list con lai neu la ca thi cho vao list ca khong thi cho vao list rac
        for (j = 0; j < listCaVaRac.length; j++) {
            if (this.isRacInList(listCaVaRac[j],listCaVaRac)) {
                listCardRac.push(listCaVaRac[j]);
            } else {
                listCa.push(listCaVaRac[j]);
            }
        }

        sortCardByID(listCa);
        var newListCa = this.sortListCaOnHand(listCa);
        for (j = 0; j < newListCa.length; j++) {
            rtnList.push(newListCa[j]);
        }

        sortCardByID(listCardRac);
        for (j = 0; j < listCardRac.length; j++) {
            rtnList.push(listCardRac[j]);
        }
        logListCard(this.onhandCardList);
        this.onhandCardList = rtnList;
        logListCard(this.onhandCardList);

        if ((callbackFN != undefined) && (callbackFN)){
            callbackFN();
        }
    },
    findBestNextIndex:function(mid,arr,countKC){
        var next = -1;
        var minStore = 1000;
        for (var i=0;i< 10;i++){
            if (arr[mid * 10 + i] == 1){
                if (minStore>countKC[i]){
                    next = i;
                    minStore = countKC[i];
                }
            }
        }
        return next;
    },
    sortListCaOnHand:function(list){
        var maxLengListCard = 10;
        var i,j;
        // arr: neu card i va card j la ca -> arr[i * maxLengListCard + j] = 1 (<=>a[i,j]=1)
        var arr = [];
        // countKC[i] luu so luong cac card co the ghep thanh ca voi card thu i trong list
        var countKC = [];
        // tinh cac gia tri ban dau
        for (i=0;i<list.length;i++){
            countKC[i] = 0;
        }
        for (i=0;i< maxLengListCard*maxLengListCard;i++){
            arr[i] = 0;
        }
        for (i=0;i<list.length;i++){
            for (j=0;j<list.length;j++){
                if ((i != j) && (this.isCa(list[i],list[j]))){
                    arr[i*maxLengListCard + j] = 1;
                    countKC[i] ++;
                }
            }
        }

        var rtnList = [];

        var mID = -1;
        var Next = -1;
        var self = this;

        var updateData = function(mID){
            var strLog  = "countKC: |";
            for (i=0;i<list.length;i++){
                strLog+=countKC[i]+"|";
            }
            //logMessage(strLog);
            rtnList.push(list[mID]);
            if (countKC[mID]>0){
                // tim card tot nhat tiep theo de add vao list
                // la card ket hop voi card hien tai thanh ca va co countKC nho nhat
                Next = self.findBestNextIndex(mID,arr,countKC);
            } else {
                // k tim dc next -> reset Next
                Next = -1;
            }

            //logMessage("Next: "+Next + " mid "+mID + " count "+countKC[mID]);
            // update lai data
            for (i=0;i<list.length;i++){
                if (arr[mID* maxLengListCard + i] == 1){
                    countKC[i]--;
                }
            }
            countKC[mID] = 100;
        };

        while (rtnList.length < list.length){
            //tim card hop ly nhat dua vao list
            if (rtnList.length == 0){
                // tim card nam trong it ca nhat trong list
                mID = findIndexOfMinValueInList(countKC);
                if (mID>=0){
                    // tim duoc -> update data
                    updateData(mID);
                }
            } else{
                if (Next != -1){
                    updateData(Next);
                } else {
                    mID = findIndexOfMinValueInList(countKC);
                    if (mID>=0){
                        updateData(mID);
                    }
                }
            }
        }
        return rtnList;
    },
    checkCurrentOnhandListHasPhom:function(){
        for (var j = 0; j < this.onhandCardList.length; j++) {
            if (this.onhandCardList[j].phomIndex != 0) {
                return true;
            }
        }
        return false;
    },
    havePhoms:function(){
        for (var j = 0; j < this.onhandCardList.length; j++) {
            if (this.onhandCardList[j].phomIndex != 0) {
                return true;
            }
        }
        if (this.getPhomList().length >0){
            return true;
        }
        return false;
    },
    canU:function(){
        var count =0;
        for (j = 0; j < this.onhandCardList.length; j++) {
            if (this.onhandCardList[j].phomIndex != 0) {
                count++;
            }
        }
        return ((this.onhandCardList.length - count)<=1);
    },
    ableToDiscard:function(card){
        if (card == null){
            return false;
        }
        var newList = this.onhandCardList.slice();
        removeCardIdFromArrCardListOnly(card.encode(),newList);
        findBestPhomCard.isValidListCard(newList);
        logMessage("ableToDiscard "+findBestPhomCard.validListCardFlag);
        return findBestPhomCard.validListCardFlag;
    },
    ableToTakeCard:function(card){
        if (card == null){
            return false;
        }
        var caClone = decode(card.encode());
        var newList = this.onhandCardList.slice();
        caClone.cardUIStatus = CARD_STATUS_TAKEN;
        newList.push(caClone);
        findBestPhomCard.isValidListCard(newList);
        return findBestPhomCard.validListCardFlag;
    },
    calculatePoint:function(listCard){
        var playerPoint = 0;
        for (var j = 0; j < listCard.length; j++) {
            playerPoint += listCard[j].number;
        }
        if (this.getPhomList().length == 0) {
            playerPoint = MOM_POINT;
        }
        return playerPoint;
    },
    isMom:function(){
        return (this.playerPoint == MOM_POINT);
    },
    getMaxZoderOnhand:function(){
        if (this.onhandCardList == null){
            return 1000;
        }
        var max =-1;
        for (var i=0;i<this.onhandCardList.length;i++){
            var iC = this.onhandCardList[i];
            if (iC.getLocalZOrder() > max){
                max = iC.getLocalZOrder();
            }
        }
        if (max == -1){
            return 1000
        }
        return max
    },
    getMaxZoderPhomList:function(){
        if (this.phomsList == null){
            return 1000;
        }
        var max =-1;
        for (var i=0;i<this.phomsList.length;i++){
            var iC = this.phomsList[i];
            if (iC.getLocalZOrder() > max){
                max = iC.getLocalZOrder();
            }
        }
        if (max == -1){
            return 1000
        }
        return max + 10;
    },
    getMaxZoderTakenList:function(){
        if (this.takenList == null){
            return 1000;
        }
        var max =-1;
        for (var i=0;i<this.takenList.length;i++){
            var iC = this.takenList[i];
            if (iC.getLocalZOrder() > max){
                max = iC.getLocalZOrder();
            }
        }
        if (max == -1){
            return 1000
        }
        return max
    },
    getNumberPhomInPhomList:function(){
        var countPhom = 0;
        for (var i=0;i<this.phomsList.length;i++){
            if (this.phomsList[i].phomIndex >countPhom){
                countPhom = this.phomsList[i].phomIndex;
            }
        }
        return countPhom;
    },
    isPhomNgang:function(pIndex){
        if (this.phomsList == null){
            return false;
        }
        var pl = [];
        for (var i=0;i<this.phomsList.length;i++){
            if (this.phomsList[i].phomIndex == pIndex){
                pl.push(this.phomsList[i]);
            }
        }
        if (pl.length <3){
            return false;
        }

        return (pl[0].getNumber() == pl[1].getNumber())
    },
    getMaxPhomIndexInPhomList:function(){
        if (this.phomsList == null){
            return 0;
        }
        var rtn =0;
        for (var i=0;i<this.phomsList.length;i++){
            if (this.phomsList[i].phomIndex > rtn){
                rtn = this.phomsList[i].phomIndex;
            }
        }
        return rtn;
    },
    stopAllAnimationOnhand:function(){
        for (var i =0;i<this.onhandCardList.length;i++){
            if (this.onhandCardList[i].isAnimation){
                this.onhandCardList[i].stopMoveAction();
            }
        }
    },
    removeEventAndStopAnimationOnhand:function(){
        if (this.onhandCardList == null){
            return;
        }
        for (var i =0;i<this.onhandCardList.length;i++){
            this.onhandCardList[i].stopMoveActionNotCallbackFN();
            this.onhandCardList[i].resetQueueAnimation();
            this.onhandCardList[i].removeAllEventListener();
        }
    }

});





















var findBestPhomCard = {
    phomFlag:null,
    bestFinalPoint:0,
    listFind:null,
    validListCardFlag:false,

    /*
    * find best phom card
    * */
    findWithData:function(list,cb){
        logMessage("findWithData");
        logListCard(list);
        this.listFind = [];
        this.listFind = list.slice();
        //logMessage("list before sort");
        //logListCard(this.listFind);
        sortCardByID(this.listFind);
        //logMessage("list after sort");
        //logListCard(this.listFind);
        this.phomFlag = [];
        for (var i=0;i<11;i++){
            this.phomFlag[i] = 0;
        }
        this.bestFinalPoint = 1000;
        var listCard = [];
        logMessage("time start findBestPhoms "+BkTime.GetCurrentTime() );
        logListCard(this.listFind);
        this.tryFindBestPhom(0,0,listCard,1);
        logMessage("time start findBestPhoms "+BkTime.GetCurrentTime() );
        logListCard(this.listFind);
        if (cb!= undefined){
            cb();
        }
    },
    tryFindBestPhom:function(startPosition, currentPosition, listCard, currentCaIndex){
        //logListCard(listCard);
        if (!this.isPhomOrCa(listCard)){
            //logMessage("khong la phom ca");
            return;
        }
        if (listCard.length>=3){
            this.tryFindBestPhom(startPosition+1,startPosition+1,[],currentCaIndex+1);
        } else {
            if (currentPosition>= this.listFind.length){
                this.updateBestPhomsResult(currentCaIndex);
                return;
            }
        }

        var flag = true;
        for (var i = currentPosition; i < this.listFind.length; i++) {
            if (this.phomFlag[i] == 0) {
                if (listCard.length == 0) {
                    startPosition = i;
                }
                listCard.push(this.listFind[i]);
                this.phomFlag[i] = currentCaIndex;
                this.tryFindBestPhom(startPosition, i + 1, listCard, currentCaIndex);
                this.phomFlag[i] = 0;
                listCard.pop();
                flag = false;
            }
        }
        if (flag) {
            this.updateBestPhomsResult(currentCaIndex);
        }
    },
    updateBestPhomsResult:function(currentCaIndex){
        if (!this.isValidPhomFlag(currentCaIndex)) {
            return;
        }
        // Count point
        var point = 0;
        for (var i = 0; i < this.listFind.length; i++) {
            if ((this.phomFlag[i] == 0) || (this.phomFlag[i] == currentCaIndex)) {
                point += this.listFind[i].number;
            }
        }
        // Cap nhat ket qua tot nhat
        if (point < this.bestFinalPoint) {
            for (i = 0; i < this.listFind.length; i++) {
                if (this.phomFlag[i] == currentCaIndex) {
                    this.listFind[i].phomIndex = 0;
                }
                else {
                    this.listFind[i].phomIndex = this.phomFlag[i];
                }
            }
            this.bestFinalPoint = point;
        }
    },
    /*
    * check list card isValid
    * */
    isValidListCard:function(list){
        this.listFind = list.slice();
        sortCardByID(this.listFind);
        this.phomFlag = [];
        for (var i=0;i<11;i++){
            this.phomFlag[i] = 0;
        }

        this.validListCardFlag = false;
        this.tryCheckValidListCard(0, 0,[], 1);
        return this.validListCardFlag;
    },
    tryCheckValidListCard:function(startPosition, currentPosition, listCard, currentCaIndex){
        if (this.validListCardFlag){
            return;
        }

        //logListCard(listCard);
        if (!this.isPhomOrCa(listCard)){
            //logMessage("khong la phom ca");
            return;
        }
        if (listCard.length>=3){
            this.tryCheckValidListCard(startPosition+1,startPosition+1,[],currentCaIndex+1);
        } else {
            if (currentPosition>= this.listFind.length){
                this.updateValidListCardResult(currentCaIndex);
                return;
            }
        }

        var flag = true;
        for (var i = currentPosition; i < this.listFind.length; i++) {
            if (this.phomFlag[i] == 0) {
                if (listCard.length == 0) {
                    startPosition = i;
                }
                listCard.push(this.listFind[i]);
                this.phomFlag[i] = currentCaIndex;
                this.tryCheckValidListCard(startPosition, i + 1, listCard, currentCaIndex);
                this.phomFlag[i] = 0;
                listCard.pop();
                flag = false;
            }
        }
        if (flag) {
            this.updateValidListCardResult(currentCaIndex);
        }
    },
    updateValidListCardResult:function(currentCaIndex){
        if (!this.isValidPhomFlag(currentCaIndex)) {
            return;
        }
        this.validListCardFlag = true;
    },
    /*
    *
    * */
    isValidPhomFlag:function(currentCaIndex){
        var f = [];
        for (var i = 1; i < 5; i++) {
            f[i] = 0;
        }
        for (i = 0; i < this.listFind.length; i++) {
            if (this.listFind[i].cardUIStatus == CARD_STATUS_TAKEN) {
                if ((this.phomFlag[i] == 0) || (this.phomFlag[i] == currentCaIndex)) {
                    return false;
                }
                else {
                    f[this.phomFlag[i]]++;
                }
            }
        }
        for (i = 1; i < 5; i++) {
            if (f[i] > 1) {
                return false;
            }
        }
        return true;
    },
    isPhomOrCa:function(listCard){
        var newList = listCard.slice();
        sortCardByID(newList);
        //logListCard(newList);
        if (newList.length > 1) {
            var flag = true;
            for (var i = 1; i < newList.length; i++) {
                if (newList[i].number != newList[i - 1].number) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                return true;
            }
            flag = true;
            for (i = 1; i < newList.length; i++) {
                //logMessage("delta NUmber "+(newList[i].number - newList[i - 1].number));
                if ((newList[i].type != newList[i - 1].type) || (Math.abs(newList[i].number - newList[i - 1].number) !=  1)) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        return true;
    }
};