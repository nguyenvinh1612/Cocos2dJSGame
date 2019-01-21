/**
 * Created by bs on 08/10/2015.
 */
MIN_TIME_INTERACTION = 30000;
BkInGameLogic = BkBaseLogic.extend({
    playerOverviewData:null,
    activePlayerPosition: -1,
    PlayerState:[],
    //eventQueue:CQueue = new CQueue();
    isProcessingGui:false,
    lastEventIndex:0,
    //game table info
    gameStatus:0,
    pass:"",
    userData:null,
    startTimeInviteFriend:0,
    isContinueGame:false,
    numberOfPlayingPlayer:0, // Số người chơi khi bắt đầu ván => dùng để tính tiền nhất bét
    currentPlayerRank:0,
    kieuBan:0,
    maxAllowedPlayer:0, // số người được phép chơi tối đa theo tableid và Setting của chủ bàn
    maxPlayer:0, // sô người chơi tối đa theo game( 4 hoặc 6 người).
    // other
    IsShowFBInviteFRInaGame:true,
    isKicked:false,
    isSoundEnable:true,
    isShowChat:true,
    betMoneyList:[],
    finishedPlayerCount:0,
    moneyLogic:null,
    cardClickQueue:null,
    isDealingCard: false,
    lastTableBetMoney:0,
    lastTimeSendChat:0,
    timeTabChange:-1,
    ctor:function(){
        this._super();
        this.cardClickQueue = new BkQueue();
        this.initEventsTabChange();
    },
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_PLAYER_STATUS_RETURN:
            case c.NETWORK_PREPARE_NEW_GAME:
            case c.NETWORK_LEAVE_DURING_GAME:

            case c.NETWORK_PLAYER_MONEY_CHANGE_PUSH:
            case c.NETWORK_PLAYER_NEW_LEVEL:
            case c.NETWORK_PLAYER_HAS_BONUS:

            case c.NETWORK_TABLE_LEAVE_PUSH:
            case c.NETWORK_TABLE_JOIN_PUSH:
            case c.NETWORK_KICK_PLAYER_PUSH:
            case c.NETWORK_TABLE_LEAVE_SUCCESS:
            case c.NETWORK_TIME_OUT_LEAVE:
                return true;
        }
        return false;
    },
    getlastTimeClick:function()
    {
        var btnList = this.getGameLayer().getCustomGameButtonList();
        var minTime = MIN_TIME_INTERACTION;
        var deltaTime = 0;
        if(btnList != null && btnList.length > 0)
        {
            for (var i = 0; i < btnList.length; i++)
            {
                deltaTime = BkTime.GetCurrentTime() - btnList[i].lastTimeClick;
                if(deltaTime < minTime)
                {
                    minTime = deltaTime;
                }
            }
        }
        return Math.min(minTime,BkTime.GetCurrentTime() - this.getGameLayer().btnReady.lastTimeClick);
    },

    /*
    * return ingame scene
    * */
    getGui:function()
    {
        return BkGlobal.ingameScene;
    },

    getGameLayer:function()
    {
        if(this.getGui() == null)
        {
            logMessage("BkGlobal.ingameScene is null");
            return null;
        }
        return this.getGui().getGameLayer();
    },

    processCardClickEvent:function(card) {
        //logMessage("Base class process click event");
        card.OnCardMouseClick();
    },
    processNextCardClickEvent:function(){
        //logMessage("Base class process next event");
        // No need to implement
    },
    /*
    * return curent main layer
    * if GameID = TLMN -> return TLMNLayer, if gameID = PHOM -> return PHOMLayer...
    * */
    //convert player serverpos to player clientPos
    getPlayerDisplayLocation:function(playerServerPos)
    {
        var myServerPos = this.getMyPos();
        return  (playerServerPos - myServerPos + this.maxPlayer) % this.maxPlayer;
    },
    isMyServerPos:function(severPos)
    {
        var player = this.getMyClientState();
        if (player == null){
            return false;
        }
        return (severPos == player.serverPosition);
    },
    getNextActivePlayerPosition:function()
    {
        var count = 0;
        do
        {
            this.activePlayerPosition = Math.floor(this.activePlayerPosition + 1)% this.maxPlayer; // modified
            count++;
            var player = this.getPlayer(this.activePlayerPosition);
            if(player != null && !player.isFinishedGame && player.isPlaying && !player.isLeaveTurn())
            {
                return this.activePlayerPosition;
            }
        }
        while( count < 10);
        return -1;
    },
    backReadyPosition:function(position) {
        var count = 0;
        do
        {
            count++;
            position = Math.floor((position - 1 + this.maxPlayer) % this.maxPlayer);
            var player = this.getPlayer(position);
            if(player != null && !player.isFinishedGame && player.isPlaying && !player.isLeaveTurn())
            {
                return position;
            }
        }
        while (count<10);
        return position;
    },
    nextReadyPosition:function(position){
        var count = 0;
        do
        {
            count++;
            position = Math.floor((position + 1) % this.maxPlayer);
            var player = this.getPlayer(position);
            if(player != null && !player.isFinishedGame && player.isPlaying && !player.isLeaveTurn())
            {
                return position;
            }
        }
        while (count < 10);
        return -1;
    },
    logArrayClientState:function(){
        logMessage("is Invalid my clientstate -> getableinfo & sync");
        logMessage("getMyClientState - myName: "+BkGlobal.UserInfo.getUserName());
        logMessage("this.PlayerState.length: "+this.PlayerState.length);

        for (var i = 0; i< this.PlayerState.length; i++) {
            var playeri = this.PlayerState[i];
            logMessage("player "+i+" name :"+playeri.getName()+" serverPos: "+playeri.serverPosition)
        }
    },
    isEnoughMoneyToStartGame:function()
    {
        var player = this.getMyClientState();
        if (player == null){
            this.logArrayClientState();
            this.networkGetTableInfo();
            return true;
        }
        if(player.getCurrentCash() >= getMinTableBetMoney(BkGlobal.currentGameID,this.tableBetMoney) * this.tableBetMoney)
        {
            return true;
        }
        return false;
    },
    getNumOfPlayingPlayer:function()
    {
        var count = 0;
        for(var i = 0; i < this.PlayerState.length; i++)
        {
            var playeri = this.PlayerState[i];
            if(playeri.isPlaying && !playeri.isFinishedGame)
            {
                count++;
            }
        }
        return count;
    },
    processLeaveDurringGame:function(packet)
    {
        var playerPos = packet.Buffer.readByte();
        var cashChange = packet.Buffer.readInt();
        var playerOutGame = this.getPlayer(playerPos);
        this.baseProcessLeaveDuringGame(playerOutGame);
        this.processLeaveDurringGameWithData(playerPos,cashChange,playerOutGame);
        var isNext = this.isQueueEvent(c.NETWORK_LEAVE_DURING_GAME);
        if (isNext){
            this.processNextEventInQueue();
        }
    },
    processLeaveDurringGameWithData:function(playerPos,cashChange,playerOutGame){
        //TODO: overide this function in custom game logic if need
        logMessage("must implement this function in custom game logic if need "+cashChange);
        var cashLost = this.getLoseMoneyOfPlayerOutGameLeavingDuringGame(cashChange);//-cashChange * (this.numberOfUnfinishedPlayer - 1);
        cashLost = Math.max(cashLost, - playerOutGame.getCurrentCash());
        logMessage("cashLost: "+cashLost);
        this.increaseCash(playerOutGame,cashLost,"Phạt");
        for (var  i = 0 ; i < this.PlayerState.length; i++)
            {
                var betMoney = this.getTableBetMoney();
                var playeri = this.PlayerState[i];
                if (playeri.serverPosition != playerOutGame.serverPosition )
                {
                    if (playeri.isPlaying){
                        this.increaseCash(playeri,this.getReturnMoneyWhenLeavingDuringGame(betMoney, cashChange));
                    }
                }
            }
        //this.getGameLayer().hideAllOngameCustomButton();
    },
    getLoseMoneyOfPlayerOutGameLeavingDuringGame:function(cashChange){
        return -cashChange * (this.numberOfPlayingPlayer - 1);
    },
    getReturnMoneyWhenLeavingDuringGame:function(betMoney, cashChange){
        return Math.floor(cashChange *(1 -TAX_RATE));
    },

    processPlayerStatusUpdate:function(Packet)
    {
        var serverPos = Packet.Buffer.readByte();
        var status = Packet.Buffer.readByte();
        var player = this.getPlayer(serverPos);
        var isNext = this.isQueueEvent(Packet.Type);

        if (player == null) {
            logMessage("player == null -> error");
            if (isNext){
                this.processNextEventInQueue();
            }
            return;
        }
        player.status = status;
        if (this.isMyServerPos(serverPos)){
            if (status == PLAYER_STATE_NOT_READY || status == PLAYER_STATE_TABLE_OWNER ){
                this.getGameLayer().showStartGameButton();
            }
            else
            {
                this.getGameLayer().removeCountDownText();
                this.getGameLayer().hideStartGameButton();
            }
        }
        var displayPos;
        if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP) {
            displayPos = player.serverPosition;
        }
        else displayPos = this.getPlayerDisplayLocation(serverPos);
        logMessage("name "+player.getName()+" displayPos: "+displayPos+" serverPos: "+serverPos+" status: "+status);
        this.getGameLayer().onPlayerStatusUpdate(displayPos, status);

        if (isNext){
            this.processNextEventInQueue();
        }
        //this.processNextEventInQueue();
    },

    isMeBossTable:function()
    {
       return (this.getMyClientState() != null && this.getMyClientState().status == PLAYER_STATE_TABLE_OWNER);
    },
    isMyTurn:function()
    {
        return (this.getMyPos() == this.activePlayerPosition);
    },
    getDeafaultClientState:function(){
        var player;
        if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
            player = new BkChessPlayerClientState();
        } else if (BkGlobal.currentGameID == GID.PHOM){
            player = new BkPhomClientState();
        } else if (BkGlobal.currentGameID == GID.MAU_BINH) {
            player = new BkMauBinhClientState();
        } else {
            player = new BkClientState();
        }
        return player;
    },
    isInvalidMyClientState:function(){
        var myCS = this.getMyClientState();
        if (myCS == null){
            this.networkGetTableInfo();
            return true;
        }
        return false;
    },
    getMyClientState:function()
    {
        var myPlayer = this.getPlayerByName(BkGlobal.UserInfo.getUserName());
        if (myPlayer == null){
            this.logArrayClientState();
        }
        return this.getPlayerByName(BkGlobal.UserInfo.getUserName());
    },
    getPlayerByName:function(name)
    {
        for (var i = 0; i< this.PlayerState.length; i++)
        {
            var playeri = this.PlayerState[i];
            if (playeri.getName() == name) {
                return playeri;
            }
        }
        return null;
    },
    //get myServer Pos
    getMyPos:function ()
    {
        var temp;
        for (var i = 0; i < this.PlayerState.length; i++)
        {
            temp = this.PlayerState[i];
            if (temp.getName() == BkGlobal.UserInfo.getUserName()) {
                return temp.serverPosition;
            }
        }
        return -1;
    },
    // SortPlayer by Server Pos
    SortPlayer:function()
    {
        var tempState = [];
        for (var i = 0; i < this.maxPlayer; i++ )
        {
            var tempPlayer = this.getPlayer(i);

            if (tempPlayer != null)
            {
                tempState.push(tempPlayer);
               // this.PlayerState.splice(i,1);
            }
        }
        this.PlayerState = tempState;
    },
    removePlayer:function(serverPos)
    {
        for (var i = 0; i < this.PlayerState.length; i++)
        {
            var playeri = this.PlayerState[i];
            if (playeri.serverPosition === serverPos )
            {
                this.PlayerState.splice(i,1);
            }
        }
    },
    // server pos
    getPlayer: function(serverPos)
    {
        var playeri = null;
        for (var i = 0; i< this.PlayerState.length; i++)
        {
            playeri = this.PlayerState[i];
            if ( playeri.serverPosition == serverPos)
            {
                return playeri;
            }
        }
        return null;
    },
    isAllPlayerReady:function()
    {
        for(var i = 0; i < this.PlayerState.length; i++)
        {
            var playeri = this.PlayerState[i];
            if(playeri.status == PLAYER_STATE_NOT_READY)
            {
                showToastMessage("player" + playeri.getName() + "is not ready");
                return false;
            }
        }
        return true;
    },
    isNeedInvitePlayers:function(){
        return this.PlayerState.length < 2;
    },
    isIAmActive:function() {
        if (this.getMyPos() == this.activePlayerPosition) {
            return true;
        }
        return false;
    },
    getActivePlayer:function()
    {
        return this.getPlayer(this.activePlayerPosition);
    },

    getActivePlayerPos:function()
    {
        return this.activePlayerPosition;
    },

    //
    getPlayerDisplayAt:function (clientPos)
    {
        for (var i = 0; i< this.PlayerState.length; i++)
        {
            var temp;
            temp = this.PlayerState[i];
            if (this.getPlayerDisplayLocation(temp.serverPosition) == clientPos)
            {
                return temp;
            }
        }
        return null;
    },

    increaseCash:function(player, amount,reason,animateAmount)
    {
        var rs = "";
        if(reason != undefined)
        {
            rs = reason;
        }
        player.increaseCash(amount);
        playAlertSound();
        if(animateAmount != undefined && animateAmount != null)
        {
            this.getGameLayer().UpdatePlayerMoney(player,amount,rs,animateAmount);
        }else
        {
            this.getGameLayer().UpdatePlayerMoney(player,amount,rs);
        }
        logMessage("Player:" + player.getName() + " amount:" + amount + " reason:" + rs + " MoneyAfter:" + player.getCurrentMoney());
    },

    processTableLeaveFailure:function()
    {
        showToastMessage("Không thể rời bàn, hãy thử lại", 200,200);
        //removeAnim();
    },
    processTableJoinPush:function(Packet)
    {
        var playerList = Packet.GetPlayersInfo();
        var player;

        for (var i =0; i < playerList.length; i++)
        {
            //player = this.getPlayerByName(playerList[i].name);
            logMessage("processTableJoinPush with pos: "+playerList[i].position);
            player = this.getPlayer(playerList[i].position);
            if (player== null)
            {
                if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
                    player = new BkChessPlayerClientState();
                }else if (BkGlobal.currentGameID == GID.PHOM){
                    player = new BkPhomClientState();
                }else if (BkGlobal.currentGameID == GID.MAU_BINH)
                {
                    player = new BkMauBinhClientState();
                }
                else
                {
                    player = new BkClientState();
                }
                player = new BkChanClientState();
                player.setClientInfo(playerList[i]);
                this.PlayerState.push(player);
                this.SortPlayer();
                this.getGameLayer().onTableJoin(player,this.getPlayerDisplayLocation(player.serverPosition));
                ///this.getGui().updateChatBox(player.getName()+" vào bàn","",CChatBox.TYPE_CHAT_ADMIN);
            } else {
                logMessage("invalid packet table join push with "+playerList[i].position+" -> get table info & sync");
                //logTracker("ERROR: invalid packet table join push -> ReCheck","");
                this.networkGetTableInfo();
                return;
            }
        }
        playJoinGameSound();
        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },
    processPlayerMoneyChangePush: function (Packet)
    {
        var playerName = Packet.Buffer.ReadString();
        var change = Packet.Buffer.readInt();
        logMessage("playerName: "+playerName+" change: "+change);
        var clientS = this.getPlayerByName(playerName);
        if (clientS!=null)
        {
            this.increaseCash(clientS,change);
        }
        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },
    processGoldBoxEvent:function(Packet)
    {
        if (Packet.Type == c.NETWORK_GET_GOLD_BOX_REMAIN_TIME_RETURN)
        {
            var remainTime = Packet.Buffer.readInt();
            this.getGameLayer().showGoldBoxWithRemainTime(remainTime);
        } else if (Packet.Type == c.NETWORK_GET_GOLD_BOX_REWARD_RETURN){
            var reward =  Packet.Buffer.readInt();
            // update my money
            logMessage("reward: "+reward);
            if (reward>0){
                var myClient = this.getMyClientState();
                this.getGameLayer().removeGoldBox();
                this.increaseCash(myClient,reward);
                showToastMessage("Bạn vừa nhận được "+ formatNumber(reward) + BkConstString.getGameCoinStr() + " từ hộp quà.",cc.winSize.width/2,cc.winSize.height/2,5,300);
            } else {
                showToastMessage("Còn "+ convertSecondToMinSec(-reward)+" Bạn mới có thể nhận quà!"
                    ,cc.winSize.width/2,cc.winSize.height/2,3,300);
            }
        }
    },
    processWhenPlayerHasBonus:function(Packet)
    {
        var bonusCode = Packet.Buffer.readByte();
        var clientS = this.getMyClientState();
        if (clientS!=null){
            var moneyBonus;
            if (bonusCode == PLAYER_NEW_LEVEL){
                moneyBonus = getNewLevelBonusMoney(clientS.getUserInfo().getLevel());
            } else {
                moneyBonus = getBonusByBonusCode(bonusCode);
            }
            this.increaseCash(clientS,moneyBonus,getBonusReasonByBonusCode(bonusCode));
        }
        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },
    processWhenPlayerNewLevel:function(Packet)
    {
        var playerPosition = Packet.Buffer.readByte();
        var newLevel = Packet.Buffer.readInt();
        var clientS = this.getPlayer(playerPosition);
        if(clientS!=null)
        {
            var currLevel = clientS.getUserInfo().getLevel();
            var increasedLevel = newLevel - currLevel;
            clientS.getUserInfo().setLevel(newLevel);
            if (clientS.getName() == BkGlobal.UserInfo.getUserName()){
                BkGlobal.UserInfo.setLevel(newLevel);
            }
            // update level icon for client
            var pAvatar = this.getGameLayer().getAvatarByServerPos(playerPosition);
            this.getGameLayer().showAnimationUpdateMoney(increasedLevel,"Level",pAvatar);
            this.getGameLayer().onUpdatePlayerLevel(clientS.serverPosition,clientS.getUserInfo());
        }

        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }

    },
    processTableLeaveSuccess:function(Packet)
    {
        if (Packet.Buffer.isReadable()) {
            var LeaveReason = Packet.Buffer.readByte();
        }
        this.ProcessOutGame();
        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },
    setupTable:function(betMoney,maximumAllowedPlayers,password)
    {
        var Packet = new BkPacket();
        Packet.CreateSetupTablepacket(betMoney,maximumAllowedPlayers,password);
        BkConnectionManager.send(Packet,false);
    },
    clearTableData:function()
    {
        this.pass = "";
        this.maxAllowedPlayer = "";
        this.gameStatus = GAME_STATE_NOT_READY;
        this.tableBetMoney = 0;
        while(this.PlayerState.length > 0)
        {
            this.PlayerState.splice(0,1);
        }
    },
    ProcessKickPlayerAction:function(playerName)
    {
        var Packet = new BkPacket();
        var player = this.getPlayerByName(playerName);
        if (player != null) {
        var playerPos = player.serverPosition;
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_KICK_PLAYER, playerPos);
        BkConnectionManager.send(Packet);
        }
    },
    ProcessOutGame:function()
    {
        this.clearQueue();
        this.resetAllPlayerState();
        this.getGameLayer().clearCurrentGameGui();
        this.clearTableData();
        this.getGameLayer().removeCountDownText();
        BkGlobal.currentGS = GS.WAITTING_JOIN_ROOM_FROM_INGAME;
        //BkLogicManager.getLogic().doJoinWebGameRoom(BkGlobal.currentGameID,BkGlobal.getCurrentRoomType(),BkGlobal.currentRoomID);
        BkLogicManager.getLogic().doJoinChanGameRoom(BkGlobal.getCurrentRoomType());
    },
    getOnHandCard:function(player)
    {
        if (player!= null) {
            return player.getOnHandCard();
        }
        return null;
    },
    updateGameStatus:function(gameStatus )
    {
        this.gameStatus = gameStatus;
    },
    getTableBetMoney:function()
    {
        return this.tableBetMoney;
    },
    getPlayerState:function ()
    {
        return this.PlayerState;
    },
    showCountDownForMe:function()
    {
        logMessage("call show count down");
        var mPL = this.getMyClientState();
        if (mPL == null) { return;}
        if (mPL.status == PLAYER_STATE_READY || this.isInGameProgress()) { return;}
        if (this.isMeBossTable())
        {
            this.getGameLayer().showCountDownForMe(TIME_AUTO_START_GAME);
        }
        else
        {
            if(this.isContinueGame && (this.lastTableBetMoney == this.getTableBetMoney()))
            {
                this.getGameLayer().showCountDownForMe(7,true);
            }else
            {
                this.getGameLayer().showCountDownForMe(TIME_AUTO_READY -1);
            }
        }
    },
    processAssignAsTableOwner:function(packet)
    {
        if(this.getMyClientState() == null)
        {
            return;
        }
        this.getMyClientState().status = PLAYER_STATE_TABLE_OWNER;
        this.maxAllowedPlayer = packet.Buffer.readByte();
        if(packet.Buffer.isReadable())
        {
            this.pass = packet.Buffer.ReadString();
        }
        this.showCountDownForMe();
        this.getGameLayer().showStartGameButton();

        // update my avar
        var displayPos = 0;
        this.getGameLayer().onPlayerStatusUpdate(displayPos, PLAYER_STATE_TABLE_OWNER);
        if (this.isQueueEvent(packet.Type)){
            this.processNextEventInQueue();
        }
    },
    networkGetTableInfo:function()
    {
        logMessage("do get table info -> clear queue & set isReceiveSyncEvent = false");
        BkGlobal.isReceiveSyncEvent = false;
        BkConnectionManager.initExpectPacketBeforeSend(c.NETWORK_TABLE_INFO_RETURN);
        this.clearQueue();
        var Packet = new BkPacket();
        Packet.CreateGetTableInfo();
        BkConnectionManager.send(Packet);
    },
    readPlayerInfo:function(Packet){
        var player = new BkPlayerInfoData();
        player.name = Packet.Buffer.ReadString();
        player.position = Packet.Buffer.readByte();
        player.status = Packet.Buffer.readByte();
        player.money = Packet.Buffer.readInt();
        player.avatarId = Packet.Buffer.readByte();
        player.level = Packet.Buffer.readInt();
        player.isMyFriend = (Packet.Buffer.readByte() == 1);
        logMessage("User Name:" + player.name + " Pos: " + player.position + " Status: " + player.status + " Money: "
            + player.money + " avatarId: " + player.avatarId + " level:" + player.level);
        return player;
    },
    resetListPlayerState:function(){
        if (this.PlayerState != null){
            for(var i = 0; i < this.PlayerState.length; i++)
            {
                var playeri = this.PlayerState[i];
                if (playeri!= null){
                    playeri.removeAllCurentCard();
                }
            }
            this.PlayerState = [];
        }
    },
    ProcessGameTableInfo:function(Packet){
        logMessage("ProcessGameTableInfo");
        this.lastEventIndex =0;
        //var o =  {tableBetMoney:0, playerList:[]};
        //Packet.GetTableInfoResult(o);
        this.tableBetMoney = Packet.Buffer.readInt();
        //this.getGui().updateChatBox(BkGlobal.UserInfo.getName() + " vào bàn","",CChatBox.TYPE_CHAT_ADMIN);
        var playerList = [];
        var plInfo;
        while (Packet.Buffer.isReadable()) {
            plInfo = this.readPlayerInfo(Packet);
            playerList.push(plInfo);
        }
        var player;
        this.resetListPlayerState();
        //this.PlayerState = [];
        for (var i =0; i < playerList.length; i++)
        {
            logMessage("BkGlobal.currentGameID "+BkGlobal.currentGameID);
            if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
                player = new BkChessPlayerClientState();
            } else if (BkGlobal.currentGameID == GID.PHOM){
                player = new BkPhomClientState();
            }
            else if (BkGlobal.currentGameID == GID.MAU_BINH)
            {
                player = new BkMauBinhClientState();
            }else if (BkGlobal.currentGameID == GID.CHAN)
            {
                logMessage("is chan game");
                player = new BkChanClientState();
            }
            else player = new BkClientState();
            //player.setClientInfo(o.playerList[i]);
            player.setClientInfo(playerList[i]);
            this.PlayerState.push(player);

            if (playerList[i].name == BkGlobal.UserInfo.userName){
                // la minh -> update lai avartarID
                BkGlobal.UserInfo.avatarID = playerList[i].avatarId;
            }
        }
         this.SortPlayer();
         this.getGameLayer().onTableInfoReturn();
    },
    isInGameProgress:function()
    {
        return (this.gameStatus != GAME_STATE_READY) && (this.gameStatus != GAME_STATE_FINISH);
    },
    netWorkStartGame:function ()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_DEAL_CARD);
        BkConnectionManager.send(Packet);
    },

    resetAllPlayerState:function ()
    {
        for(var i = 0; i < this.PlayerState.length; i++)
        {
            var playeri = this.PlayerState[i];
            if(playeri != null)
            {
                playeri.resetPlayerData();
            }
        }
    },

    ProcessPlayerStartGame:function()
    {
        this.resetAllPlayerState();
        this.netWorkStartGame();
    },

    netWorkReadyGame:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_PLAYER_STATUS, PLAYER_STATE_READY);
        BkConnectionManager.send(Packet);
    },
    processPlayerReadyAction:function()
    {
        this.resetAllPlayerState();
        this.netWorkReadyGame();
    },

    //
    processGetWaitingListReturn:function(packet) {
        var friendList = [];
        // Get friend list
        while (packet.Buffer.isReadable())
        {
            var playerMoney = packet.Buffer.readInt();
            var playerName = packet.Buffer.ReadString();
            var avatar = packet.Buffer.readByte();
            var pl = new BkBasicUserInfo(playerName, playerMoney, avatar);
            friendList.push(pl);
        }
        this.getGui().showInviteFriend(friendList,1);
    },

    invitePlayer:function(PlayerName) {
        var packet = new BkPacket();
        packet.CreateInvitePlayerPacket(PlayerName);
        logMessage("Invite Player" + PlayerName);
        BkConnectionManager.send(packet);
    },
    processGetFriendsInviteReturn:function(packet) {
        var friendList = [];
        // Get friend list
        while (packet.Buffer.isReadable())
        {
            playerMoney = packet.Buffer.readInt();
            playerName = packet.Buffer.ReadString();
            avatar = packet.Buffer.readByte();
            var pl = new BkBasicUserInfo(playerName, playerMoney, avatar);
            friendList.push(pl);
        }
        this.getGui().showInviteFriend(friendList,2);
    },

    processGetOnlineFriendList:function() {
        Util.showAnim();
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_GET_FRIENDS_TO_INVITE);
        BkConnectionManager.send(Packet);

    },

    processGetWaitingPlayerList:function() {
        // Get waiting player list
        Util.showAnim();
        var Packet = new BkPacket();
        Packet.CreatePacketWithOnlyType(c.NETWORK_GET_WAITING_PLAYERS);
        BkConnectionManager.send(Packet);
    },

    processShowInviteWindows:function() {
        this.getGui().showInviteWindows(this);
        this.processGetWaitingPlayerList();
    },

    processOverViewPlayer:function(userName){
        logMessage("processOverViewPlayer "+userName);
        var Packet = new BkPacket();
        Packet.CreateGetProfilePacket(userName,c.NETWORK_GET_OVERVIEW_OTHER_PROFILE);
        BkConnectionManager.send(Packet);
    },
    ProcessOverviewProfile:function(Packet) {
        if (this.playerOverviewData == null) {
            return;
        }
        var userData = this.playerOverviewData;
        userData.setAvatarId(Packet.Buffer.readByte());
        userData.setMoney(Packet.Buffer.readInt());
        userData.setLevel(Packet.Buffer.readInt());
        userData.setWinCount(Packet.Buffer.readInt());
        userData.setLoseCount(Packet.Buffer.readInt());
        userData.setRank(Packet.Buffer.readInt());

        var winCountRecord = Packet.Buffer.readInt();
        var firstSpecialCountRecord = Packet.Buffer.readInt();
        var secondSpecialCountRecord = Packet.Buffer.readInt();


        var gameID = BkGlobal.currentGameID;
        userData.setWinCount(winCountRecord);
        userData.setFirstSpecialCountRecord(firstSpecialCountRecord);
        userData.setSecondSpecialCountRecord(secondSpecialCountRecord);
        userData.setGameId(gameID);
        this.getGui().showPlayerOverviewInfo(userData);
    },

    processGameTableSyn:function(Packet)
    {
        this.getGameLayer().clearCurrentGameGui();
        this.clearQueue();
        if(BkGlobal.UserSetting.soundEnable == 1)
        {
            this.isSoundEnable = true;
        }else
        {
            this.isSoundEnable = false;
        }

        this.gameStatus = Packet.Buffer.readByte();

        // init state for all player
        for (var i=0; i< this.PlayerState.length; i++) {
            this.PlayerState[i].isPlaying = false;

        }
        logMessage("Base Logic table Syn: status" + this.gameStatus);
        this.getGameLayer().OnGameTableSyn(Packet);
    },

    getPunishExitDuringGameMoney:function()
    {
        logMessage("getPunishExitDuringGameMoney -> must implement this function with other game");
        return 0;
    },
    processLeaveTableRequest:function()
    {
        if(this.isDealingCard)
        {
            return; // ko thoát lúc đang chia bài
        }
        var player = this.getMyClientState();
        var self = this;
        if (player != null && player.isPlaying && !player.isFinishedGame)
        {
            // Neu đang trong game thi show thong bao
            if (this.isInGameProgress())
            {
                var str = "Nếu bạn rời bàn chơi bạn sẽ bị phạt " +
                    convertStringToMoneyFormat(this.getPunishExitDuringGameMoney(),true) + " " + BkConstString.STR_GAME_COIN.toLowerCase() +
                    ".\nBạn có thực sự muốn thoát không?";
                showPopupConfirmWith(str,"Thoát khi đang chơi",function(){
                    self.networkOutTable(1);
                });
                return;
            }
        }else if(player != null && player.isPlaying && player.isFinishedGame)
        {
            this.networkOutTable(1);
            return;
        }
        this.networkOutTable(0);
    },

    processTableLeave:function(playerPos)
    {
        logMessage("processTableLeavePush pos "+playerPos);
        if (this.isMyServerPos(playerPos)){
            logMessage("la minh -> goi tin sai -> reject & reLogin");
            this.networkGetTableInfo();
            return;
            //logMessage("la minh moi clear queue");
            //this.clearQueue();
        }
        var player = this.getPlayer(playerPos);
        if (player != null)
        {
            this.clearPlayerCard(player);
            this.getGameLayer().onTableLeavePush(player);
            this.removePlayer(playerPos);
            this.getGameLayer().removePlayerAvatar(this.getPlayerDisplayLocation(playerPos));
        }
        playLeaveGameSound();
    },

    processTableLeavePush:function(Packet)
    {
        logMessage("processTableLeavePush ");
        var playerPos = Packet.Buffer.readByte();
        this.processTableLeave(playerPos);

        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },

    clearPlayerCard:function (player)
    {
        if(player != null)
        {
            player.removeOnhandCard();
            logMessage("clearPlayerCard:" + player.getName() );
        }
    },

    baseProcessLeaveDuringGame:function(playerOutGame)
    {
        this.clearPlayerCard(playerOutGame);
        playerOutGame.isPlaying = false;
        this.getGameLayer().onLeaveDuringGame(playerOutGame);
        if(!playerOutGame.isFinishedGame)
        {
            var gid = BkGlobal.currentGameID;
            if(gid == GID.TLMN || gid == GID.TLMN_DEM_LA || gid == GID.XAM || gid == GID.PHOM)
            {
                this.gameStatus = GAME_STATE_FINISH;
            }
            if (this.isMyServerPos(playerOutGame.serverPosition))
            {
                this.ProcessOutGame();
            }
        }
    },

    processSetupTable:function (Packet)
    {
        var isShowConfirm = false;
        if(Packet.Type == c.NETWORK_BET_MONEY_UPDATE)
        {
            var newbetMoney = Packet.Buffer.readInt();
            logMessage("NETWORK_BET_MONEY_UPDATE "+newbetMoney);
            if((newbetMoney  >= BkGlobal.UserInfo.playerMoney *getTableMoneyWarning(BkGlobal.currentGameID) || this.tableBetMoney <= newbetMoney*0.1) && !this.isMeBossTable())
            {
                isShowConfirm = true;
            }
            this.tableBetMoney = newbetMoney;
            var strConfirm = "Tiền bàn đã được thiết lập thành "
                + convertStringToMoneyFormat(this.tableBetMoney) + " "  + BkConstString.getGameCoinStr();
            if(isShowConfirm)
            {
                BkDialogWindowManager.showPopupWith(strConfirm,"Thông báo",null,null,null,TYPE_MESSAGE_BOX,null);
                //showPopupConfirmWith(strConfirm,"Thông báo",null,null,null);
            }else
            {
                if(BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP){
                    showToastMessage(strConfirm, cc.winSize.width / 2,TOAST_MSG_YPOS,3,340);
                }
                else
                {
                    showToastMessage(strConfirm, 150,cc.winSize.height - 75,3,180);
                }
            }
            this.getGameLayer().onUpdateTableMoneyStatus();
            if(!this.isMeBossTable())
            {
                this.getGameLayer().showCountDownForMe(TIME_AUTO_READY -1);
            }
        }else{
            logMessage("setup table fail");
            var setupTableResult = Packet.Buffer.readByte();
            var requiredMoney = Packet.Buffer.readInt();
            logMessage("requiredMoney: " + requiredMoney + " setupTableResult: " + setupTableResult);
            this.setupTableResultFailed(setupTableResult,requiredMoney);
        }
    },

    setupTableResultFailed:function(setupTableResult, requiredMoney)
    {
        logMessage("setupTableResult:" + setupTableResult);
        if (setupTableResult == 2)
        {
            showToastMessage("Bạn chỉ có thể đặt tối đa là: " + requiredMoney +" quan",cc.winSize.width/2,cc.winSize.height/2 + 100, 5);
        }
        if (setupTableResult == 0)
        {
            showToastMessage("Không thể đặt tiền cho bàn, số tiền nhỏ nhất có thể đặt: " + requiredMoney +" quan",cc.winSize.width/2,cc.winSize.height/2 + 100, 5);
        }
        if (setupTableResult == 1)
        {
            showToastMessage("Không thể đặt tiền cho bàn, số tiền tối đa có thể đặt: " + requiredMoney +" quan",cc.winSize.width/2,cc.winSize.height/2 + 100, 5);
        }
    },

    processKickPushReturn:function(Packet)
    {
        if (Packet.Type == c.NETWORK_UNABLE_TO_KICK)
        {
            showToastMessage(BkConstString.STR_UNABLE_KICK,cc.winSize.width/2,cc.winSize.height/2 + 70,5,300);
        } else if(Packet.Type == c.NETWORK_PROTECTED_FROM_UNKICKABLE_WAND)
        {
            showToastMessage(BkConstString.STR_PROTECTED_FROM_UNKICKABLE_WAND,cc.winSize.width/2,cc.winSize.height/2 + 20 ,5,350);
        } else if(Packet.Type == c.NETWORK_KICK_PLAYER_PUSH)
        {
            this.setLeaveGameReason(OWNER_KICK);
            if (Packet.Buffer.isReadable())
            {
                this.setLeaveGameReason(Packet.Buffer.readByte());
            }
            if (Packet.Buffer.isReadable())
            {
                this.setLeaveGameReason(Packet.Buffer.readByte());
            }
            if (this.getLeaveGameReason() == TIME_OUT_KICK || this.getLeaveGameReason() == UNREADY_TIMEOUT)
            {
                showToastMessage(BkConstString.STR_MESS_SERVER_KICK, cc.winSize.width/2,cc.winSize.height/2,5,250);
            }
            this.ProcessOutGame();
        } else if (Packet.Type == c.NETWORK_TIME_OUT_LEAVE){
            var reason;
            if (Packet.Buffer.isReadable()){ reason = Packet.Buffer.readByte();}
            logMessage("NETWORK_TIME_OUT_LEAVE: reason: "+reason);
            showToastMessage(BkConstString.STR_MESS_SERVER_KICK, cc.winSize.width/2,cc.winSize.height/2,5,250);
            this.ProcessOutGame();
        }

        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },

    processErrorReturn:function(Packet)
    {
        showToastMessage("processErrorReturn not implement" + Packet.Type,cc.winSize.width/2,cc.winSize.height/2);
    },

    processPrepareNewGame:function()
    {
        this.lastEventIndex =0;
        this.lastTableBetMoney = this.getTableBetMoney();
        if(this.getlastTimeClick() < MIN_TIME_INTERACTION )
        {
            this.isContinueGame = true;
        }else
        {
            this.isContinueGame = false;
        }
        this.gameStatus = GAME_STATE_READY;
        this.getGameLayer().onPrepareNewGame();
        var isNext = this.isQueueEvent(c.NETWORK_PREPARE_NEW_GAME);
        if (isNext){
            this.processNextEventInQueue();
        }
    },
    processFinishGame:function()
    {
        this.gameStatus = GAME_STATE_FINISH;
        playAlertSound();
        this.getGameLayer().OnFinishedGame();
    },

    processDealCardReturn:function(Packet)
    {
        this.gameStatus = GAME_STATE_PLAYING;
        this.numberOfPlayingPlayer = 0;
        this.currentPlayerRank = 0;
        this.getGameLayer().onDealCard();
    },

    updateLastEventIndex:function(){
        logMessage("INGAME_GAME isSynchEvent -> updateLastEventIndex | crIndex: "+this.lastEventIndex);
        this.lastEventIndex++;
    },

    onReconnectSuccess:function(){
        logMessage("onReconnectSuccess ingame logic");
        this.networkGetTableInfo();

        // var Packet = new BkPacket();
        // Packet.CreatePacketWithTypeAndByteData(c.NETWORK_SYNC,this.lastEventIndex);
        // BkConnectionManager.send(Packet);
    },
    processBetOptionsReturn:function(Packet){
        // TODO: processBetOptionsReturn implement laster if need
        var  count = Packet.Buffer.readByte();
        var numberArray = [];
        var index = 0;
        while (Packet.Buffer.isReadable())
        {
            numberArray[index] = Packet.Buffer.readInt();
            index++;
        }

        if (numberArray.length >0){
            //LIST_SETTING_BET_MONEY_BD = numberArray;
        }

    },

    getLeaveGameReason: function () {
      return BkGlobal.leavingGameReason;
    },
    setLeaveGameReason: function (value) {
        BkGlobal.leavingGameReason = value;
    },
    processTableChatReturn:function(packet) {
        var playerPosition = packet.Buffer.readByte();
        var chatMsg = packet.Buffer.ReadString();
        var player = this.getPlayer(playerPosition);
        if (player != null) {
            this.getGui().updateChatBox(chatMsg, playerPosition);
        }
    },

    networkOutTable:function(isInGame)
    {
        Util.showAnim();
        var Packet = new BkPacket();
        Packet.CreateLeaveTableAction(isInGame);
        BkConnectionManager.send(Packet);
    },
    initEventsTabChange:function () {
        logMessage("initEventsTabChange");
        var self = this;
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
            self.onTabHide();
        });
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
            self.onTabShow();
        });
    },
    onTabShow:function(){
        logMessage("onShow");
        var curentTabState = BkGlobal.isTabActive;
        BkGlobal.isTabActive = true;
        if (curentTabState != BkGlobal.isTabActive){
            logMessage("real activetab -> process event in queue if !isProcessing");
            if (!BkConnectionManager.isOpenConnection()){
                if (BkGlobal.currentGS == GS.INGAME_GAME){
                    logMessage("mat ket noi -> reconnect");
                    BkConnectionManager.scheduleReconnect();
                    BkConnectionManager.onReconnect();
                    return;
                }
            }

            if (!BkConnectionManager.isProcessing){
                this.processNextEventInQueue();
            } else {
                logMessage("dang process packet -> reset lastTimeProcessing");
                BkConnectionManager.lastTimeProcessing = BkTime.GetCurrentTime();
            }
        }
    },
    onTabHide:function(){
        logMessage("onHide");
        BkGlobal.isTabActive = false;
        this.timeTabChange = BkTime.GetCurrentTime();
    },
    /*
     * handle all ingame event
     * */
    processNetworkEvent:function(packet){
        // Check zone
        logMessage("BkInGameLogic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.NETWORK_OVERVIEW_OTHER_PROFILE_RETURN:
                this.ProcessOverviewProfile(packet);
                break;
            case c.ANY:
                break;
            case c.NETWORK_TABLE_JOIN_SUCCESS:
                logMessage("NETWORK_TABLE_JOIN_SUCCESS");
                this.ProcessTableJoinSuccess(packet);
                break;
            case c.NETWORK_TABLE_INFO_RETURN:
                logMessage("NETWORK_TABLE_INFO_RETURN");
                this.ProcessGameTableInfo(packet);
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_BET_MONEY_OPTIONS:
                this.processBetOptionsReturn(packet);
                break;
            case c.NETWORK_BET_MONEY_UPDATE:
            case c.NETWORK_SETUP_TABLE_FAILED:
                this.processSetupTable(packet);
                break;
            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;

            case c.NETWORK_TABLE_LEAVE_SUCCESS:
                this.processTableLeaveSuccess(packet);
                break;

            case c.NETWORK_TABLE_LEAVE_FAILURE:
                this.processTableLeaveFailure();
                break;

            case c.NETWORK_TABLE_JOIN_PUSH:
                this.processTableJoinPush(packet);
                break;

            case c.NETWORK_TABLE_LEAVE_PUSH:
                this.processTableLeavePush(packet);
                break;

            case c.NETWORK_PLAYER_STATUS_RETURN:
                this.processPlayerStatusUpdate(packet);
                break;

            case c.NETWORK_GET_FRIENDS_TO_INVITE_RETURN:
                this.processGetFriendsInviteReturn(packet);
                break;
            case c.NETWORK_WAITING_PLAYERS_RETURN:
                this.processGetWaitingListReturn(packet);
                break;
            case c.NETWORK_TIME_OUT_LEAVE:
            case c.NETWORK_UNABLE_TO_KICK:
            case c.NETWORK_PROTECTED_FROM_UNKICKABLE_WAND:
            case c.NETWORK_KICK_PLAYER_PUSH:
                this.processKickPushReturn(packet);
                break;
            case c.NETWORK_ERROR_RETURN:
                this.processErrorReturn(packet);
                break;

            case c.NETWORK_GET_GOLD_BOX_REWARD_RETURN:
            case c.NETWORK_GET_GOLD_BOX_REMAIN_TIME_RETURN:
                this.processGoldBoxEvent(packet);
                break;

            case c.NETWORK_PLAYER_MONEY_CHANGE_PUSH:
                this.processPlayerMoneyChangePush(packet);
                break;

            case c.NETWORK_PLAYER_HAS_BONUS:
                this.processWhenPlayerHasBonus(packet);
                break;

            case c.NETWORK_PLAYER_NEW_LEVEL:
                this.processWhenPlayerNewLevel(packet);
                break;

            case c.NETWORK_TABLE_CHAT_RETURN:
                this.processTableChatReturn(packet);
                break;
            case c.NETWORK_ASSIGN_AS_TABLE_OWNER:
                this.processAssignAsTableOwner(packet);
                break;
            case c.NETWORK_RECONNECT_SUCCESS:
                //this.SynEvent();
                break;
            case c.NETWORK_PREPARE_NEW_GAME:
                this.processPrepareNewGame();
                break;

            case c.NETWORK_FINISH_GAME_RETURN:
                this.processFinishGame();
                break;

            case c.NETWORK_LEAVE_DURING_GAME:
                this.processLeaveDurringGame(packet);
                break;
            default:{
                logMessage("BkInGameLogic not process packet with type: "+packet.Type+ " -> call super process");
                this._super(packet);
            }
        }
    }
});