/**
 * Created by bs on 06/10/2015.
 */
BkUserData = cc.Class.extend({
    userName:null,
    password:null,
    clientID:null,
    playerMoney:null,
    lvUser:null,
    isFriend:null,
    avatarID:null,
    fullname:null,
    gender:null,
    email:null,
    birthDate:null,
    homeTown:null,
    status:null,

    gameId:null,
    gameCount:null,
    moneyEarn:null,
    bestHand:null,
    newLvPercent:null,
    rank:null,
    winCountRecord:null,
    firstSpecialCountRecord:null,
    secondSpecialCountRecord:null,

    // player achievements in games
    playerAchievements:null,

    // other
    winCount:0,
    loseCount:null,

    // basic user info
    IsOnline:false,
    numberOfUnreadMails:0,
    numberOfUnreadEvent:0,
    dropWordWeekIndex:0,
    HasAllowKickWand:false,
    HasX2BetMoney:0,
    HasX5BetMoney:0,
    HasX10BetMoney:0,
    NumberGame:0,
    maxUPoint:0,
    stringCuocU:"",
    VipLevel:-1,
    // Item Type
    listAvatar:null,
    listVatPham:null,
    listBaoBoi:null,

    topDaiGia:-1,
    topCaoThu:-1,
    topDangLen:-1,
    ctor:function(){
        this.userName = "";
        this.playerMoney = 0;
        this.avatarID = -1;
    },
    getUserName:function(){
        return this.userName;
    },
    setUserName:function(name){
        this.userName = name;
    },
    setWinCount:function(win) {
      this.winCountRecord = win;
    },
    setFirstSpecialCountRecord:function(firstSpecialCountRecord)
    {
        this.firstSpecialCountRecord = firstSpecialCountRecord;
    },
    setSecondSpecialCountRecord:function(secondSpecialCountRecord)
    {
        this.secondSpecialCountRecord = secondSpecialCountRecord;
    },
    getFirstSpecialCountRecord:function()
    {
        return this.firstSpecialCountRecord;
    },
    getSecondSpecialCountRecord:function()
    {
        return this.secondSpecialCountRecord;
    },
    getWinCount:function() {
        return this.winCountRecord;
    },
    setLoseCount:function(lose) {
      this.loseCount = lose;
    },
    getLoseCount:function(){
        return this.loseCount;
    },
    setMoney:function(mn){
        this.playerMoney=mn;
    },
    getMoney:function(){
        return this.playerMoney;
    },
    setAvatarId:function(avarID){
        this.avatarID = avarID;
    },
    getAvatarId:function(){
        return this.avatarID;
    },
    setLevel:function(lv){
        this.lvUser = lv;
    },
    getLevel:function(){
        return this.lvUser;
    },
    setIsFriend:function(ifriend){
        this.isFriend = ifriend;
    },
    getIsFriend:function(){
        return this.isFriend;
    },
    setGameId:function(gid){
        this.gameId = gid;
    },

    getGameId:function(){
       return this.gameId;
    },

    setOnlineStatus:function(isOnline){
        this.IsOnline = isOnline;
    },
    isOnline:function(){
        return this.IsOnline;
    },
    setRank:function(ra){
        this.rank = ra;
    },
    getRank:function(){
        return this.rank;
    },
    setNumberGame:function(num){
        this.gameCount = num;
    },
    getNumberGame:function(){
        return this.gameCount;
    },
    setNumberOfUnreadMails:function(num){
        this.numberOfUnreadMails = num;
    },
    getNumberOfUnreadMails:function(){
        return this.numberOfUnreadMails;
    },
    getnumberOfUnreadEvent:function(){
        return this.numberOfUnreadEvent;
    },
    setnumberOfUnreadEvent:function(num){
        this.numberOfUnreadEvent = num;
    },
    getDropWordWeekIndex:function(){
        return this.dropWordWeekIndex;
    },
    setDropWordWeekIndex:function(index){
        this.dropWordWeekIndex = index;
    },
    getHasAllowKickWand:function(){
        return this.HasAllowKickWand;
    },
    setHasAllowKickWand:function(isHas){
        this.HasAllowKickWand = isHas;
    },
    getHasX2BetMoney:function(){
        return this.HasX2BetMoney;
    },
    setHasX2BetMoney:function(hx2){
        this.HasX2BetMoney = hx2;
    },
    getHasX5BetMoney:function(){
        return this.HasX5BetMoney;
    },
    setHasX5BetMoney:function(hx5){
        this.HasX5BetMoney = hx5;
    },
    getHasX10BetMoney:function(){
        return this.HasX10BetMoney;
    },
    setHasX10BetMoney:function(hx10){
        this.HasX10BetMoney = hx10;
    },

    getmaxUPoint:function()
    {
        return this.maxUPoint;
    },
    setmaxUPoint:function(point)
    {
        this.maxUPoint = point ;
    },
    addFreeAvatar:function(){
        if (this.listAvatar == null){
            this.listAvatar = [];
        }
        for ( var FreeAvID = 2; FreeAvID <= 5; FreeAvID++)
        {
            if(this.isFreeAvatarExist(FreeAvID) == false)
            {
                var freeAvatar = new BkItemDetail();
                freeAvatar.itemID = FreeAvID;
                this.listAvatar.unshift(freeAvatar);
            }
        }
    },
    isFreeAvatarExist:function(avatarID){
        if (this.listAvatar == null){
            return false;
        }
        for(var j = 0; j < this.listAvatar.length; j++ )
        {
            var temp = this.listAvatar[j];
            if(temp.itemID == avatarID )
            {
                return true;
            }
        }
        return false;
    },
    hasBought: function(id, type) {
        var hasBought = false;
        var itemList = [];
        switch (type){
            case AT.TYPE_AVATAR:
                itemList = this.listAvatar;
                break;
            case AT.TYPE_VATPHAM:
                itemList = this.listVatPham;
                break;
            case AT.TYPE_BAOBOI:
                itemList = this.listBaoBoi;
                break;
            default :
                itemList = [];
                break;
        }

        if(itemList != null && itemList.length > 0)
        {
            for(var i = 0, len = itemList.length; i < len; i++)
            {
                var itemDetail = itemList[i];
                if(itemDetail.itemID == id)
                {
                    hasBought = true;
                }
            }
        }
        return hasBought;
    },
    logPlayer:function () {
        logMessage("[ name: "+this.getUserName()+" - lv: "+this.getLevel()+" avar: "+this.getAvatarId()+" rank: "+this.getRank()+"]");
    },
    setCuocU:function(cuocu){
        this.stringCuocU = cuocu;
    },
    getCuocU:function(){
        return this.stringCuocU;
    },
    isTopCaoThu:function(){
        if (this.topCaoThu != -1){
            return true;
        }
        return false;
    },
    isTopDangLen:function(){
        if (this.topDangLen != -1){
            return true;
        }
        return false;
    },
    isTopDaiGia:function(){
        if (this.topDaiGia != -1){
            return true;
        }
        return false;
    },
    isTop:function(){
        if ((this.isTopCaoThu()) || (this.isTopDaiGia()) || (this.isTopDangLen())){
            return true;
        }
        return false;
    },
    getTopType:function() {
    if (this.topDaiGia == -1 && this.topCaoThu == -1 && this.topDangLen == -1) {
        return CIngameAvatar.ROW_NORMAL;
    }
    var row = CIngameAvatar.ROW_NORMAL;
    var minLevel = 4;
    // Top dai gia
    if (this.topDaiGia < minLevel && this.topDaiGia != -1) {
        minLevel = this.topDaiGia;
        row = CIngameAvatar.ROW_DAI_GIA;
    }
    // Top cao thu
    if (this.topCaoThu < minLevel && this.topCaoThu != -1) {
        minLevel = this.topCaoThu;
        row = CIngameAvatar.ROW_CAO_THU;
    }
    // Nhiet tinh
        if (this.topDangLen < minLevel && this.topDangLen != -1) {
            minLevel = this.topDangLen;
            row = CIngameAvatar.ROW_DANG_LEN;
        }
        return row;
    },
    getTopTypeString:function() {
        if (this.topDaiGia == -1 && this.topCaoThu == -1 && this.topDangLen == -1) {
            return "";
        }
        var rtn = "";
        var minLevel = 4;
        // Top dai gia
        if (this.topDaiGia < minLevel && this.topDaiGia != -1) {
            minLevel = this.topDaiGia;
            rtn = "đại gia";
        }
        // Top cao thu
        if (this.topCaoThu < minLevel && this.topCaoThu != -1) {
            minLevel = this.topCaoThu;
            rtn = "cao thủ";
        }
        // Nhiet tinh
        if (this.topDangLen < minLevel && this.topDangLen != -1) {
            minLevel = this.topDangLen;
            rtn = "đang lên";
        }
        return rtn;
    },
    getMinRank:function() {
        var minRank = 4;
        if (this.topDaiGia < minRank && this.topDaiGia != -1) {
            minRank = this.topDaiGia + 1;
        }
        if (this.topCaoThu < minRank && this.topCaoThu != -1) {
            minRank = this.topCaoThu + 1;
        }
        if (this.topDangLen < minRank && this.topDangLen != -1) {
            minRank = this.topDangLen + 1;
        }
        return minRank;
    },
    isMultiTop:function(){
        var count = 0;
        if (this.isTopCaoThu()){
            count ++;
        }

        if (this.isTopDaiGia()){
            count ++;
        }

        if (this.isTopDangLen()){
            count ++;
        }
        if (count>1){
            return true;
        }
        return false;
    }
});