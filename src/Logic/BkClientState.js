/**
 * Created by bs on 08/10/2015.
 */
BkClientState = cc.Class.extend({
    UserInfo:null,
    serverPosition:null,
    status:null,//STATE_TABLE_OWNER:int = 0, STATE_READY:int = 1, STATE_NOT_READY:int = 2,STATE_FINISH_GAME:int = 3;
    rank:-1,
    onhandCardList:null,
    isLeftTurn:false,
    cardsCount:0,
    isPlaying:false,
    isFinishedGame:false,
    totalChangedMoney:0,
    betMoney:0,
    totalBetMoney:0,
	isBaoSam:false,
    isFlip:false,
    isLeaveRegistered:false,
    // Use for xito
    ruleCardSuite:null,

	ctor:function(){
        this.onhandCardList = [];
    },
    removeAllCurentCard:function(){
        this.removeOnhandCard();
    },
    addRuleCardSuite:function(card) {
        if (this.ruleCardSuite == null) {
            this.ruleCardSuite = new BkXiToCardSuite();
        }
        this.ruleCardSuite.addCard(card);
    },

    getRuleCardSuite:function() {
        return this.ruleCardSuite;
    },

    setClientInfo:function(o)
    {
        this.UserInfo = new BkUserData();
        logMessage("setClientInfo of player: "+o.name);
        this.UserInfo.setUserName(o.name);
        this.serverPosition = o.position;
        this.status = o.status;
        this.UserInfo.setMoney(o.money);
        this.UserInfo.setAvatarId(o.avatarId);
        this.UserInfo.setLevel(o.level);
        this.UserInfo.setIsFriend(o.isMyFriend);
    },

    setTotalBetMoney:function(money) {
        this.totalBetMoney = money;
    },

    setBetMoney:function(money) {
        this.betMoney = money;
    },

    getUserInfo:function(){
        return this.UserInfo;
    },
    isColdLose:function()
    {
        return this.coldLose;
    },
    increaseCash:function(moneyChange)
    {
        var currentMoney = this.UserInfo.getMoney();
        this.UserInfo.setMoney(currentMoney+moneyChange);
        if (this.UserInfo.getUserName() == BkGlobal.UserInfo.getUserName()){
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney()+moneyChange);
        }
    },
    getCurrentMoney:function() {
        if (this.UserInfo == null) {
            return 0;
        }
        return this.UserInfo.getMoney();
    },

    getName:function(){
        return this.UserInfo.userName;
    },
    leaveTurn:function (isleave)
    {
        this.isLeftTurn = isleave;
    },
    isLeaveTurn:function()
    {
        return this.isLeftTurn;
    },
    setRank:function(rank)
    {
        this.rank = rank;
    },
    setName:function(name)
    {
        this.UserInfo.setUserName(name);
    },
    getRank:function()
    {
        return this.rank;
    },
    setColdLose:function (isCL)
    {
        this.coldLose = isCL;
    },
    updateOnhandCard:function(cardid, index) {
        if (this.onhandCardList == null || this.onhandCardList.length < (index +1)) {
            return null;
        }
        var card = this.onhandCardList[index];
        card.reloadByID(cardid);
        card.showBackMask(false);
        return card;
    },
    addOnhandCard:function(card) {
        if (this.onhandCardList == null) {
            this.onhandCardList = [];
        }
        this.onhandCardList.push(card);
    },
    setOnhandCard:function(handList)
    {
        this.onhandCardList = handList;
    },
    getOnHandCard:function(){
        return this.onhandCardList;
    },
    getCardsCount:function()
    {
        return this.cardsCount;
    },
    getCurrentCash:function()
    {
        if (this.UserInfo != null) {
            return this.UserInfo.getMoney();
        }
        return 0;
    },
    removeOnhandCard:function()
    {
        if(this.onhandCardList == null)
        {
            return;
        }
        var card;
        while(this.onhandCardList.length > 0)
        {
            card = this.onhandCardList[0];
            this.onhandCardList.splice(0,1);
            card.removeFromParent();
        }
    },
    resetPlayerData:function()
    {
        this.removeOnhandCard();
        this.cardsCount = 0;
        this.isPlaying = false;
        this.isFinishedGame = false;
        this.rank = -1;
        this.coldLose = false;
        this.isLeftTurn = false;
 		this.totalChangedMoney = 0;
    },
    setCardsCount:function(cardcount)
    {
         this.cardsCount = cardcount;
    }
});