/**
 * Created by bs on 05/05/2017.
 */
BkChanIngameLogic = BkInGameLogic.extend({
    isSetupChanTable:0,
    gaGop:0,
    tongGa:0,
    nhaiCount:0,
    nguoiVaoGaPosition:0,
    playerCountSyn:0,
    currentPlayerCount:0,
    NocNumber:0,
    currentCard:-1,
    playerHasCurrentCard:null,
    hasChiu:0,
    backupActivePlayerForChiu:null,
    traCuaPos:-1,
    isBasicMode:true,
    isPlayingLastGame:false,
    backupGuiActionState:null,
    baiUOnHand:null,
    baiUNoc:null,
    baiUAn:null,
    cuocGa:[],
    arrResultUpdateMoney:[],
    ctor:function()
    {
        this._super();
        this.maxPlayer = getMaxPlayer(GID.PHOM);
    },
    getPunishExitDuringGameMoney:function()
    {
        return 20* this.tableBetMoney;
    },
    processGameTableSyn:function(packet){
        this._super(packet);
        this.isSetupChanTable = 0;

        var Buffer = packet.Buffer;
        var i;
        this.gaGop = (Buffer.readByte() == 1);
        this.tongGa = Buffer.readInt();
        logMessage("ProcessGameTableSyn: tongGa = "+this.tongGa);
        this.nhaiCount = Buffer.readInt();
        this.nguoiVaoGaPosition = Buffer.readByte();
        var player;

        this.getGameLayer().OnUpdateTableMoneyStatus();

        this.basicTimeout = Buffer.readByte();
        this.advanceTimeout = Buffer.readByte();

        logMessage("Basic time out:" + this.basicTimeout + " advance time out:" + this.advanceTimeout);

        this.playerCountSyn = Buffer.readByte();
        logMessage("ProcessGameTableSyn: "+this.playerCountSyn);

        for (i = 0; i< this.playerCountSyn; i++) {
            var playerPos = Buffer.readByte();
            this.getPlayer(playerPos).tienGopGa = Buffer.readInt();
        }

        var isChiu;
        var chiuStatus = 0;
        var chiuPosition = 0;
        this.hasChiu = 0;
        this.getGameLayer().hideBaoChiuAnimation();
        this.currentPlayerCount = 0;
        if (this.isInGameProgress())
        {
            // Clear old infor
            for (i=0; i < this.PlayerState.length; i++)
            {
                player = this.getPlayerDirrectPos(i);
                player.clearCard();
                player.isPlaying = false;
            }

            // Get info for of current game
            this.activePlayerPosition = Buffer.readByte();
            this.pickCount = Buffer.readByte();
            this.setNoc(23 - this.pickCount);
            this.getGameLayer().showNoc();
            this.currentCard = Buffer.readByte();

            isChiu = Buffer.readByte();
            if (isChiu == 1) {
                chiuStatus = Buffer.readByte();
                chiuPosition = Buffer.readByte();
            }

            while (Buffer.isReadable())
            {
                var playerPosition = Buffer.readByte();
                if (playerPosition > 3 || playerPosition < 0) {
                    logMessage("Player :" + playerPosition);
                    logMessage("Pos:" + Buffer.position + " Length:" + Buffer.length);
                    logMessage("Buffer " + Buffer.toString());
                }
                logMessage("Player :" + playerPosition);
                player = this.getPlayer(playerPosition);
                player.setFault(Buffer.readByte() == 1);
                logMessage("Player name: " + player.getName() + " + " + player.Fault);
                player.clearCard();
                player.isPlaying = true;

                // truongbs++ reset chiuCount when table sync
                player.chiuCount = 0;

                this.currentPlayerCount++;

                if (player.Fault){
                    this.getGameLayer().OnPlayerError(player.serverPosition,"");
                }
                // Discasd
                var discasdsCount = Buffer.readByte();
                for (i = 0; i < discasdsCount; i++)
                {
                    player.addDiscardCard(Buffer.readByte(), CCard.CARD_STATUS_ONTABLE_DANH);
                }
                // Phom
                var phomsCount = Buffer.readByte();
                for (i = 0; i < phomsCount; i++)
                {
                    player.addEatCard(Buffer.readByte(), CCard.CARD_STATUS_ONTABLE_DANH);
                }

                if (playerPosition == this.getMyPos())
                {
                    var handCount = Buffer.readByte();
                    for (i = 0; i < handCount; i++) {
                        player.addOnHandCard(Buffer.readByte());
                    }
                }
            }

            // init numberOfPlayingPlayer for leaving durring game base class
            this.numberOfPlayingPlayer = this.currentPlayerCount;

            // Calculate player has current card
            if (this.gameStatus == STATE_WAIT_PICK_CARD)
            {
                this.playerHasCurrentCard = this.getPreviousPlayer();
            } else {
                this.playerHasCurrentCard = this.activePlayerPosition;
            }

            logMessage("Table State:" + this.gameStatus + "Player has current card:" + this.playerHasCurrentCard + "current card:" + new BkChanCard(this.currentCard).CardId);

        }

        if (this.currentPlayerCount == 0) {
            this.currentPlayerCount = this.playerCountSyn;
        }

        if (isChiu ==1) {
            if (chiuStatus == STATE_CHAN_WAIT_CHIU) {
                this.hasChiu = 1;
            } else {
                this.backupActivePlayerForChiu = this.activePlayerPosition;
                this.activePlayerPosition = chiuPosition;
            }
        }

        // Sort card
        player = this.getMyClientState();
        if (player.isPlaying) {
            player.sortCardOnHand();
        }

        this.getGameLayer().OnTableSys(isChiu, chiuStatus,chiuPosition);
        if (this.isInGameProgress()){
            if (!player.isPlaying){
                showToastMessage("Ván đấu đang diễn ra. Xin bạn vui lòng chờ đến hết ván để chơi.", c.WINDOW_WIDTH/2,400,5,500);
            }
        }
    },
    IAmActive:function()
    {
        return this.isMyTurn();
    },
    getPosInArray:function(serverPos)
    {
        var temp;
        for (var i = 0; i < this.PlayerState.length; i++)
        {
            temp = this.getPlayerDirrectPos(i);
            if (temp.serverPosition == serverPos) {
                return i;
            }
        }
        return -1;
    },
    getPreviousPlayer:function() {
        var pos = this.getPosInArray(this.activePlayerPosition);
        for (var i = 0; i < 4; i++) {
            pos = (pos - 1 + this.PlayerState.length) % this.PlayerState.length;
            if (this.getPlayerDirrectPos(pos).isPlaying) {
                return this.getPlayerDirrectPos(pos).serverPosition;
            }
        }
        return -1;
    },
    getPreviousPlayerByID:function(serverPos)
    {
        var pos = this.getPosInArray(serverPos);//serverPos;

        for (var i = 0; i < 4; i++) {
            pos = (pos - 1 + this.PlayerState.length) % this.PlayerState.length;
            if (this.getPlayerDirrectPos(pos).isPlaying) {
                return this.getPlayerDirrectPos(pos).serverPosition;
            }
        }
        return -1;
    },
    getPreviousPlayerState:function()
    {
        var pos = this.getPosInArray(this.activePlayerPosition);
        for (var i = 0; i < 4; i++) {
            pos = (pos - 1 + this.PlayerState.length) % this.PlayerState.length;
            if (this.getPlayerDirrectPos(pos).isPlaying) {
                return this.getPlayerDirrectPos(pos);
            }
        }
        return null;
    },
    setNoc:function(param0) {
        this.NocNumber = param0;
    },
    getPlayerDirrectPos:function(pos){
        return this.PlayerState[pos];
    },
    downListOnhand:function () {
        var onhandList = player.getListOnHandCards();
        for (var i=0;i<onhandList.length;i++){
            var ca = onhandList[i];
            if (ca.isOnHandUp()){
                logMessage("i "+i +" - id ["+ca.getServerCardID() + " - "+ca.getCardId()+"]");
                ca.CardOnhandMoveDown(false);
            }
        }
    },
    processPlayerDiscard:function(packet){
        // Ko con tra cua
        this.traCuaPos = -1;

        var player;
        player =  this.getActivePlayer();

        if (player == null){
            return;
        }

        var cardID = packet.Buffer.readByte();
        this.hasChiu = packet.Buffer.readByte();

        this.currentCard = cardID;
        this.playerHasCurrentCard = this.activePlayerPosition;



        var card;
        var isMe;
        isMe = this.IAmActive();
        if (isMe) {
            logMessage("Onhand card List" + player.getListOnHandCards().length);
            card= this.getOnHandSelectedCard();
            if ((card == null) || (card.getServerCardID() != cardID))
            {
                card = this.getOnHandCardByID(cardID);
            }
            player.removeCardOnHand(card);
            player.addDiscardCardObject(card, CCard.CARD_STATUS_ONTABLE_DANH);

            //this.downListOnhand();
        } else {
            player.addDiscardCard(cardID, CCard.CARD_STATUS_ONTABLE_DANH);
        }


        var id = player.getListPlayCards().length;
        card = player.getListPlayCards()[id-1];

        // truongbs ++ tinh lai zorder
        this.getGameLayer().sortDisplayLevel(player.getListPlayCards());

        // calculate current player
        this.changeToNextPlayer();
        this.updateSizeForCurrentCard();
        this.getGameLayer().OnDiscardCard(player.serverPosition, card, id -1, isMe);
        if (this.isSoundEnable) {
            BkSound.OnDiscardCard(this,player.serverPosition, card, id -1, isMe);
        }
    },
    getPreviousCard:function()
    {
        var player;
        var previousPlayerPost = this.getPreviousPlayerByID(this.playerHasCurrentCard);
        logMessage("previousPlayerPost: "+previousPlayerPost + " playerHasCurrentCard: "+this.playerHasCurrentCard);
        player =  this.getPlayer(previousPlayerPost);
        if (player != null) {
            return player.getLastPlayedCard();
        } else {
            return null;
        }
    },
    getLastCard:function()
    {
        logMessage("getLastCard");
        var player;
        player =  this.getPlayer(this.playerHasCurrentCard);
        if (player != null) {
            logMessage("playerHasCurrentCard: "+player.getName());
            return player.getLastPlayedCard();
        } else {
            logMessage("player mull");
            return null;
        }
    },
    setSizeCardNormal:function(){
        var preCard = this.getPreviousCard();
        if (preCard == undefined){
            preCard = null;
        }
        if (preCard!=null){
            logMessage("setSizePreviousCardNormal: "+preCard.CardId);
            preCard.SetSize(CCard.CARD_SIZE_NORMAL_HEIGHT);
        } else {
            logMessage("preCard null");
        }

        //this.setZoomInSizeLastCard();
    },
    setZoomOutSizeLastCard:function(){
        logMessage("setZoomOutSizeLastCard:func");
        var curCard = this.getLastCard();
        if (curCard == undefined){
            curCard = null;
        }
        if (curCard != null){
            logMessage("setZoomOutSizeLastCard: "+curCard.CardId );
            curCard.SetSize(CCard.CARD_SIZE_U_HEIGHT);
        } else {
            logMessage("curCard null");
        }
    },
    setZoomInSizeLastCard:function(){
        logMessage("setZoomInSizeLastCard:func");
        var curCard = this.getLastCard();
        if (curCard == undefined){
            curCard = null;
        }
        if (curCard != null){
            logMessage("setZoomInSizeLastCard: "+curCard.CardId);
            curCard.SetSize(CCard.CARD_SIZE_NORMAL_HEIGHT);
        } else {
            logMessage("curCard null");
        }
    },
    updateSizeForCurrentCard:function(){
        this.setSizeCardNormal();
        this.setZoomOutSizeLastCard();
    },
    ProcessPlayerBocAction:function()
    {
        // Send boc action to Server
        if (!this.IAmActive() || this.hasChiu == 1) {
            return
        }
        var Packet = new BkPacket();
        Packet.CreateBocAction();
        BkConnectionManager.send(Packet);
    },
    getNextPlayer:function(){
        var pos = this.getPosInArray(this.activePlayerPosition);
        for (var i = 0; i < 4; i++) {
            pos = (pos + 1) % this.PlayerState.length;
            var player = this.getPlayerDirrectPos(pos);
            if (player.isPlaying) {
                return player.serverPosition;
            }
        }
        return -1;
    },
    changeToNextPlayer:function()
    {
        this.activePlayerPosition = this.getNextPlayer();

        if (this.IAmActive()) {
            // Neu toi active va toi bi bao thi toi boc luon
            var player = this.getMyClientState();
            if (player.Fault) {
                this.ProcessPlayerBocAction();
            } else {
                this.getGameLayer().OnGotActive();
            }
        }
    },
    getOnHandSelectedCard:function()
    {
        var player = this.getMyClientState();
        if (player == null)
        {
            return null;
        }
        return player.getOnhandSelectedCard();
    },
    processPickCard:function(Packet){
        // Ko con tra cua
        this.traCuaPos = -1;

        var player;
        player =  this.getActivePlayer();//getPlayerByServerPos(activePlayer);
        if (player == null){
            return;
        }

        var cardID = Packet.Buffer.readByte();
        this.hasChiu = Packet.Buffer.readByte();

        this.NocNumber--;

        this.currentCard = cardID;
        this.playerHasCurrentCard = this.activePlayerPosition;
        logMessage("this.currentCard: "+this.currentCard+" this.activePlayerPosition:"+this.activePlayerPosition);
        player.addDiscardCard(cardID, CCard.CARD_STATUS_ONTABLE_BOC);
        var id = player.getListPlayCards().length;
        var card = player.getListPlayCards()[id-1];
        logMessage("last card ListPlayCards:"+card.CardId+" player active: "+player.getName());

        // truongbs ++ tinh lai zorder
        this.getGameLayer().sortDisplayLevel(player.getListPlayCards());

        this.getGameLayer().OnPickCard(player.serverPosition, card, id -1, this.IAmActive());

        var isNhai = false;

        var prePlayer = this.getPreviousPlayerState();
        var lastPlayCard = prePlayer.getLastPlayedCard();

        if (lastPlayCard != null) {
            if (lastPlayCard.CardId == card.CardId) {
                if (this.isSoundEnable) {
                    BkSound.OnNhaiEvent();
                }

                isNhai = true;
            }
        }

        if (isNhai) {
            if (this.gaGop) {
                this.nhaiCount += 1;

                var nhaiMoney = this.tableBetMoney * this.nhaiCount;
                if (card.CardId == 0) {
                    nhaiMoney = nhaiMoney * 2;
                }

                var totalNhaiMoney = 0;

                for (var i =0; i < this.PlayerState.length; i++) {
                    var tempPlayer = this.PlayerState[i];
                    if (tempPlayer.isPlaying && tempPlayer.serverPosition != this.activePlayerPosition) {
                        this.increaseMoney(tempPlayer,-1 * nhaiMoney,BkConstString.STR_NHAI_VAO_GA);
                        tempPlayer.tienGopGa += nhaiMoney;
                        totalNhaiMoney += nhaiMoney;
                        logMessage("vao ga nhai: name "+tempPlayer.getName()+" tien ga gop: "
                            + tempPlayer.tienGopGa + " tien hien tai: "+tempPlayer.getCurrentMoney());
                    }
                }

                this.tongGa += totalNhaiMoney;
                logMessage("tongGa: "+this.tongGa);
            }
        } else {
            this.nhaiCount = 0;
        }

        if (this.gaGop && isNhai) {
            this.getGameLayer().OnUpdateTableMoneyStatus();
        }

        if (!isNhai) {
            if (this.isSoundEnable) {
                BkSound.OnPickCard(player.serverPosition, card, id -1);
            }
        }

        if (this.IAmActive()) {
            // Neu toi active va toi bi bao thi toi duoi luon
            var myPlayer = this.getMyClientState();
            if (myPlayer.Fault) {
                this.ProcessPlayerDuoiAction();
            }
        }
    },
    ProcessPlayerDuoiAction:function()
    {
        if (!this.IAmActive() || this.hasChiu == 1) {
            return
        }
        var Packet = new BkPacket();
        Packet.CreateDuoiAction();
        BkConnectionManager.send(Packet);
    },
    increaseMoney:function(player, amount,reason){
        this.increaseCash(player, amount,reason)
    },
    getTimeForCountDown:function()
    {
        if (this.isBasicMode) {
            return this.basicTimeout;
        } else
        {
            return this.advanceTimeout;
        }
    },
    onTakeCard:function(Packet){
        // Reset Nhai
        this.nhaiCount = 0;

        // Ko con tra cua
        this.traCuaPos = -1;

        var player;
        player =  this.getActivePlayer();//getPlayerByServerPos(activePlayer);

        var cardID = Packet.Buffer.readByte();

        var isMe = this.IAmActive();
        var card;

        if (isMe) {
            card= this.getOnHandSelectedCard();
            if ((card == null) || (card.getServerCardID() != cardID))
            {
                card = this.getOnHandCardByID(cardID);
            }
            player.removeCardOnHand(card);
            player.addEatCardObject(card, CCard.CARD_STATUS_ONTABLE_DANH);
            player.sortCardOnHand();
        } else {
            player.addEatCard(cardID, CCard.CARD_STATUS_ONTABLE_DANH);
        }
        var currentCard = this.TakeCard(this.playerHasCurrentCard);
        player.addEatCardObject(currentCard, currentCard.getCardStatus());

        var id = player.getListEatCards().length-1;
        var card1 = player.getListEatCards()[id-1];
        var card2 = player.getListEatCards()[id];
        card2.SetSize(CCard.CARD_SIZE_NORMAL_HEIGHT);
        card1.setCardStatus(CCard.CARD_STATUS_ONTABLE_DANH);

        logMessage("Take Card: " + this.playerHasCurrentCard + " ActivePlayerID:"
            +  this.activePlayerPosition + " Card1: " + card1.CardId + " Card2:" + card2.CardId);

        if (this.isSoundEnable) {
            BkSound.OnTakeCard(this, player.serverPosition, card1, card2, id-1, isMe);
        }
        this.getGameLayer().OnTakeCard(player.serverPosition, card1, card2, id-1, isMe);
    },
    getOnHandCardByID:function(cardID){
        var card1;
        card1= this.getOnHandSelectedCard();
        if ((card1 != null) && (card1.getServerCardID() != cardID)){
            card1.CardOnhandMoveDown(false);
        }

        var player = this.getMyClientState();
        var card = player.getOnHandCardByID(cardID);
        return card;
    },
    TakeCard:function(playerPos)
    {
        var player;
        player =  this.getPlayer(playerPos);
        return player.removeLastPlayCard();
    },
    processDealCardReturn:function(packet){
        this._super(packet);
        // Reset nhai, chiu
        // TODO:post cuoc u implement laster
        //CPostOnForumWindow.strCuocU = "";
        //bytes = null;
        //bytesUData = null;
        this.hasChiu = 0;
        this.nhaiCount = 0;
        this.isPlayingLastGame = true;
        var player;
        var i;

        this.currentPlayerCount = 0;
        for (i = 0; i < this.PlayerState.length; i++)
        {
            player = this.PlayerState[i];
            player.isPlaying = true;
            this.currentPlayerCount++;

            if (this.gaGop) {
                this.increaseMoney(player, -1 * this.tableBetMoney,BkConstString.STR_VAO_GA);
                player.tienGopGa += this.tableBetMoney;
                this.tongGa += this.tableBetMoney;
                logMessage("gop ga dau van name: "+player.getName()+" tien ga gop "+player.tienGopGa
                    +" tien hien tai: "+player.getCurrentMoney());
            }
        }

        // init numberOfPlayingPlayer for leaving durring game base class
        this.numberOfPlayingPlayer = this.currentPlayerCount;


        if (this.gaGop) {
            logMessage("tongGa: "+this.tongGa);
            this.getGameLayer().OnUpdateTableMoneyStatus();
        }

        var buffer = packet.Buffer;

        this.activePlayerPosition = buffer.readByte();

        var cai = buffer.readByte();

        var bocCaiPos = buffer.readByte();

        player = this.getMyClientState();

        while (buffer.isReadable())
        {
            player.addOnHandCard(buffer.readByte());
        }

        player.sortCardOnHand();

        this.NocNumber = 23;

        this.gameStatus = STATE_WAIT_DISCARD;
        this.getGameLayer().OnDealCard(this.activePlayerPosition, bocCaiPos, cai, player.getListOnHandCards());

        // test checkmoney
        //this.checkMoney();
    },
    ProcessChiuReturn:function(Packet)
    {
        var chiuPlayerID = Packet.Buffer.readByte();
        var doChiu = Packet.Buffer.readByte();
        var i;
        var player;
        var card, card1, card2, card3, card4;

        // Reset Nhai
        this.nhaiCount = 0;

        // Danh dau khong con dang chiu
        this.hasChiu = 0;

        var isMe = (chiuPlayerID == this.getMyClientState().serverPosition);

        if (doChiu != 1)
        {
            // Neu nguoi choi khong chiu
            this.getGameLayer().resumeGameAfterNotChiu(chiuPlayerID);
            this.processNextEventInQueue();
            return;
        }

        player = this.getPlayer(chiuPlayerID);
        player.chiuCount++;

        // Add 3 quan bai cua player + 1 quan bai hien tai vao bai an cua nguoi chiu
        if (isMe)
        {
            logMessage("toi chiu");
            player.logListChanCard(player.getOnHandCard());
            player.logListChanCard(player.getListEatCards());
            card1 = this.getOnHandCardByID(this.currentCard);

            player.removeCardOnHand(card1);
            player.addEatCardObject(card1, CCard.CARD_STATUS_ONTABLE_CHIU);

            card2 = this.getOnHandCardByID(this.currentCard);
            player.removeCardOnHand(card2);
            player.addEatCardObject(card2, CCard.CARD_STATUS_ONTABLE_CHIU);

            card3 = this.getOnHandCardByID(this.currentCard);
            player.removeCardOnHand(card3);
            player.addEatCardObject(card3, CCard.CARD_STATUS_ONTABLE_CHIU);
            player.logListChanCard(player.getOnHandCard());
            player.logListChanCard(player.getListEatCards());
            card1.setRotation(0);
            card2.setRotation(0);
            card3.setRotation(0);
        } else {
            card1 = new BkChanCard(this.currentCard);
            player.addEatCardObject(card1, CCard.CARD_STATUS_ONTABLE_CHIU);

            card2 = new BkChanCard(this.currentCard);
            player.addEatCardObject(card2, CCard.CARD_STATUS_ONTABLE_CHIU);

            card3 = new BkChanCard(this.currentCard);
            player.addEatCardObject(card3, CCard.CARD_STATUS_ONTABLE_CHIU);
        }

        player.addEatCardObject(this.TakeCard(this.playerHasCurrentCard), CCard.CARD_STATUS_ONTABLE_CHIU);

        var id = player.getListEatCards().length-1;
        card4= player.getListEatCards()[id];
        logMessage("card4: "+card4.CardId);
        // Neu toi dang active && toi khong phai nguoi chiu
        if (this.IAmActive()){
            this.backupGuiActionState =  this.getGameLayer().OnLostActiveByChiu();
        }

        this.backupActivePlayerForChiu = this.activePlayerPosition;
        this.activePlayerPosition = chiuPlayerID;

        if (this.isSoundEnable) {
            BkSound.OnChiuCard(chiuPlayerID, this.getPreviousPlayerByID(chiuPlayerID), this.backupActivePlayerForChiu);
        }
        this.getGameLayer().OnChiuCard(chiuPlayerID, card1, card2, card3, card4, id-1, isMe);

        // Update tien ga
        if (this.gaGop)
        {
            var tempPlayer;
            var chiuMoney = this.tableBetMoney;
            var chiuTotalMoney;

            if (card1.CardId == 0) {
                // Neu quan chiu la chi chi -> Nhan doi tien
                chiuMoney *= 2;
            }

            // Neu la chiu cay tra cua
            if (this.traCuaPos != -1) {
                // Tru tien thang tra cua
                chiuTotalMoney = chiuMoney;
                tempPlayer = this.getPlayerByServerPos(this.traCuaPos);
                this.increaseMoney(tempPlayer, -1 * chiuMoney,BkConstString.STR_CHIU_VAO_GA);
                tempPlayer.tienGopGa += chiuMoney;
                logMessage("vao ga chiu cay tra cua: name "+tempPlayer.getName()
                    +" tien ga gop: "+tempPlayer.tienGopGa);
            } else if (this.backupActivePlayerForChiu == this.playerHasCurrentCard) {
                chiuTotalMoney = 0;
                // Quan bai boc -> tru tien tat ca
                for (i = 0; i< this.PlayerState.length; i++) {
                    tempPlayer = this.getPlayerDirrectPos(i);
                    if (tempPlayer.serverPosition != this.activePlayerPosition) {
                        if (tempPlayer.isPlaying) {
                            this.increaseMoney(tempPlayer, -1 * chiuMoney,BkConstString.STR_CHIU_VAO_GA);
                            tempPlayer.tienGopGa += chiuMoney;
                            chiuTotalMoney += chiuMoney;
                            logMessage("vao ga chiu cay boc: name "+tempPlayer.getName()
                                +" tien ga gop: "+tempPlayer.tienGopGa);
                        }
                    }
                }
            } else {
                // Tru tien thang danh
                chiuTotalMoney = chiuMoney;
                tempPlayer = this.getPlayerByServerPos(this.playerHasCurrentCard);
                this.increaseMoney(tempPlayer, -1 * chiuMoney,BkConstString.STR_CHIU_VAO_GA);
                tempPlayer.tienGopGa += chiuMoney;
                logMessage("vao ga chiu cay danh: name "+tempPlayer.getName()
                    +" tien ga gop: "+tempPlayer.tienGopGa);
            }
            this.tongGa += chiuTotalMoney;
            logMessage("tongGa: "+this.tongGa);
            this.getGameLayer().OnUpdateTableMoneyStatus();
        }
    },
    getPlayerByServerPos:function(serverPos){
        return this.getPlayer(serverPos);
    },
    ProcessTraCuaReturn:function(Packet)
    {
        var chiuPlayerID = Packet.Buffer.readByte();
        var cardID = Packet.Buffer.readByte();
        this.hasChiu = Packet.Buffer.readByte();

        this.traCuaPos = chiuPlayerID;
        // Tinh trang thai tra cua
        // Neu minh chiu khi minh active thi tra cua vao cua cua minh

        var toPlayerPos;
        toPlayerPos = this.playerHasCurrentCard;

        // Neu nguoi chiu la nguoi duoc active trong lan danh do, thi tra cua vao cua cua minh
        if (chiuPlayerID == this.backupActivePlayerForChiu) {
            toPlayerPos = chiuPlayerID;
        }

        var toPlayer = this.getPlayerByServerPos(toPlayerPos);

        var card;

        var fromPlayer = this.getPlayerByServerPos(chiuPlayerID);

        var isMe = (this.getMyPos() == chiuPlayerID);//(getPlayerDisplayLocation(chiuPlayerID) == 1);
        if (isMe) {
            card= this.getOnHandSelectedCard();
            if ((card == null) || (card.getServerCardID() != cardID))
            {
                card = this.getOnHandCardByID(cardID);
            }
            fromPlayer.removeCardOnHand(card);
        } else {
            card = new BkChanCard(cardID);
        }

        toPlayer.addDiscardCardObject(card, CCard.CARD_STATUS_ONTABLE_DANH);

        var id = toPlayer.getListPlayCards().length;

        // Neu toi chiu o cay o cua cua minh thi gui them su kien duoi
        if (isMe && chiuPlayerID == this.playerHasCurrentCard) {
            // Send goi tin duoi
            if (!this.hasChiu){
                this.ProcessPlayerDuoiActionForChiu();
            }else {
                this.ProcessForfeitReturn();
            }
        }

        // Neu la chiu cua lan an thuong,
        // thi thuc hien chuyen active player sang thang next
        logMessage("Tra cua: Chiu Player:" + chiuPlayerID + " Backup Active Player:" + this.backupActivePlayerForChiu
            + " Player Has Current Card " + this.playerHasCurrentCard);
        if (chiuPlayerID == this.backupActivePlayerForChiu && this.backupActivePlayerForChiu != this.playerHasCurrentCard)
        {
            this.changeToNextPlayer();
        } else {
            // Restore trang thai nut bam
            if (this.backupActivePlayerForChiu == this.getMyClientState().serverPosition) {
                // Neu client la nguoi bi chiu o cua tri, va ko phai chiu o cua cua minh
                //thi restore lai trang thai nut bam
                this.getGameLayer().OnResumePlayerButtonAfterChiu(this.backupGuiActionState);
            } else {
                this.getGameLayer().OnDiablePlayerButton();
            }

            this.activePlayerPosition = this.backupActivePlayerForChiu;
        }

        if (this.IAmActive()) {
            var tempPlayer = this.getPlayerByServerPos(this.activePlayerPosition);
            if (tempPlayer.Fault) {
                this.ProcessPlayerDuoiAction();
            }
        }

        // Update current card
        this.currentCard = cardID;
        this.playerHasCurrentCard = toPlayerPos;

        this.updateSizeForCurrentCard();
        this.getGameLayer().OnTraCua(toPlayerPos, chiuPlayerID,  card, id -1,isMe);

        if (this.isSoundEnable) {
            BkSound.OnTraCua(toPlayerPos, chiuPlayerID,  card, id -1,isMe);
        }
    },
    ProcessPlayerDuoiActionForChiu:function()
    {
        var Packet = new BkPacket();
        Packet.CreateDuoiAction();
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerAnAction:function()
    {
        if (!this.IAmActive() || this.hasChiu == 1) {
            return
        }
        var Packet = new BkPacket();
        var selectedCard = this.getOnHandSelectedCard();
        if (selectedCard == null) {
            showToastMessage(BkConstString.STR_NOT_SELECT_CARD_DISCARD, 620,350);
            return;
        }

        var currentCard = this.getLastCard();
        if (selectedCard.getCardNumber() != currentCard.getCardNumber()) {
            showToastMessage(BkConstString.STR_TAKE_CARD_NOT_VALID, 620,350);
            return;
        }
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_TAKE_CARD, selectedCard.getServerCardID());
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerDanhAction:function()
    {
        if (!this.IAmActive() || this.hasChiu == 1) {
            return;
        }

        var Packet = new BkPacket();
        var selectedCard = this.getOnHandSelectedCard();
        if (selectedCard == null) {
            showToastMessage(BkConstString.STR_NOT_SELECT_CARD_EAT, 620,350);
            return;
        }
        logMessage("Client code: " + selectedCard.getCardId() + " Server code:" + selectedCard.getServerCardID());
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_DISCARD, selectedCard.getServerCardID());
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerChiuAction:function(){
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_CHIU,1);
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerKoChiuAction:function(){
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_CHIU,0);
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerTraCuaAction:function()
    {
        var Packet = new BkPacket();
        var selectedCard = this.getOnHandSelectedCard();
        if (selectedCard == null) {
            showToastMessage("Cần chọn quân trước khi trả cửa", c.WINDOW_WIDTH/2,350);
            return;
        }
        logMessage("Client code: " + selectedCard.getCardId() + " Server code:" + selectedCard.getServerCardID());
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_TRA_CUA, selectedCard.getServerCardID());
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerUAction:function(){
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_SHOW_U_PUSH_RETURN, 1);
        BkConnectionManager.send(Packet);
    },
    ProcessPlayerKoUAction:function()
    {
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_SHOW_U_PUSH_RETURN, 0);
        BkConnectionManager.send(Packet);
        this.getGameLayer().HideUConfirmMenu();
        if (this.hasChiu == 1){
            var cardID = (new BkChanCard(this.currentCard)).getServerCardID();
            if (this.ICanChiu(cardID)){
                this.getGameLayer().displayChiu(cardID,true);
                return;
            }
        }

        this.getGameLayer().updatePlayerButton(this.getGameLayer().currentAction);
    },
    ICanChiu:function(serverCardID)
    {
        var player = this.getMyClientState();
        return (player.countCardOnHand(serverCardID) == 3);
    },
    ProcessForfeitReturn:function(Packet)
    {
        // Ko con tra cua
        this.traCuaPos = -1;

        var isMe = this.IAmActive();

        var playerPos = this.activePlayerPosition;
        var card = this.getPlayerByServerPos(playerPos).getLastPlayedCard();

        this.changeToNextPlayer();

        if (this.isSoundEnable) {
            BkSound.OnForfeit(this, playerPos, card);
        }

        this.getGameLayer().OnForfeit(isMe);
        this.processNextEventInQueue();
    },
    ProcessShowU:function(Packet)
    {
        var i;
        var serverPos = Packet.Buffer.readByte();
        var card;

        // Reset Nhai
        this.nhaiCount = 0;

        this.gameStatus = STATE_WAIT_XUONG;

        // Read Noc
        var NocCards = [];
        var num = Packet.Buffer.readByte();
        for (i=0; i < num; i++)
        {
            card = new BkChanCard(Packet.Buffer.readByte());
            card.setCardStatus(CCard.CARD_STATUS_ONTABLE_DANH);
            NocCards.push(card);
        }

        var onHandCard = [];
        var tempPlayer = new BkChanClientState();
        num = Packet.Buffer.readByte();
        for (i = 0; i < num; i++)
        {
            card = new BkChanCard(Packet.Buffer.readByte());
            card.setCardStatus(CCard.CARD_STATUS_ONTABLE_SHOWU);
            onHandCard.push(card);
        }
        onHandCard = tempPlayer.sortCard(onHandCard);

        // Read chan
        var TakenList = [];
        num = Packet.Buffer.readByte();
        for (i = 0; i < num; i++)
        {
            TakenList.push(new BkChanCard(Packet.Buffer.readByte()));
        }

        var uCard;
        if (Packet.Buffer.isReadable())
        {
            uCard = new BkChanCard(Packet.Buffer.readByte());
        }
        this.baiUOnHand = onHandCard;
        this.baiUNoc = NocCards;
        this.baiUAn = TakenList;

        if (this.baiUNoc!=null){
            logMessage("baiUNoc: != null");
        } else {
            logMessage("baiUNoc: == null");
        }
        var currentUCard;
        currentUCard = this.getLastCard();
        if (currentUCard != null) {
            currentUCard.setCardStatus(CCard.CARD_STATUS_ONTABLE_U);
        }

        var isMe;
        isMe = (serverPos == this.getMyClientState().serverPosition);

        if (this.isSoundEnable) {
            logMessage("Sound- U Roai");
            BkSound.OnU(serverPos, uCard, isMe);
        }

        this.getGameLayer().showU(serverPos, NocCards, onHandCard, TakenList, uCard);
        //if (currentUCard != null){
        //    if ((this.ICanU(currentUCard.getServerCardID())) && (!isMe)){
        //        logMessage("Toi Bi U de!");
        //        var iPoint = CConstIngame.getPlayerAvatarPos(1);
        //        var nameU = this.getPlayerByServerPos(serverPos).getName();
        //        showToastMessage(CConstString.STR_U_DE + nameU,iPoint.x,iPoint.y - 50,7);
        //    } else {
        //        CTrace.TraceDebug("isMe: "+isMe+" ICanU: "+ICanU(currentUCard.getServerCardID()));
        //    }
        //}

        this.processNextEventInQueue();
    },
    ProcessShowUConfirm:function(Packet)
    {
        this.getGameLayer().ShowUConfirmMenu();
        this.processNextEventInQueue();
    },
    onSetupChanTable:function(Packet){
        this.isSetupChanTable++;
        logMessage("setup CHAN table");
        this.isEnable4_11 = (Packet.Buffer.readByte() == 1);
        this.isBasicMode = (Packet.Buffer.readByte() == 1);
        for (var i = 0; i < 4; i++)
        {
            this.cuocGa[i] = Packet.Buffer.readByte();
            logMessage("cuocGa["+i+"]: "+this.cuocGa[i]);
        }

        this.getGameLayer().OnSetupTable();
        if (this.isSetupChanTable >1){
            showToastMessage(BkConstString.STR_SETTING_LUAT_CHANGE,170,550);
        } else {
            if (this.isEnable4_11){
                showToastMessage("Bàn này không chơi ù dưới 4 điểm.", c.WINDOW_WIDTH/2,400,5,300);
            }
        }
    },
    ProcessXuongCuocReturn:function(Packet)
    {
        this.getGameLayer().clearXuongCuocWindow();

        var serverPos = Packet.Buffer.readByte();
        var diem = Packet.Buffer.readByte();
        var ga = Packet.Buffer.readByte();
        var tongDiemDung = Packet.Buffer.readByte();
        var errCode = Packet.Buffer.readByte();
        var cuocSai = Packet.Buffer.readByte();
        var length = Packet.Buffer.readByte();
        var cuoc = [];
        for (var i = 0; i < length; i++)
        {
            cuoc[i] = Packet.Buffer.readByte();
        }

        logMessage("ProcessXuongCuocReturn: serverPos: "+serverPos+ " - " + " diem: "+ " - " +diem
            + " ga: "+ " - " +ga + " tongDiemDung: "+ " - " +tongDiemDung + " errCode: "+ " - " +errCode);

        this.gameStatus = STATE_FINISH;
        var tongDiem = diem + ga * 5;

        //bytesUData = CreateUDataForRenderImage(serverPos,tongDiem,tongDiemDung,errCode,cuocSai,length,cuoc);
        //CTrace.TraceDebug("bytesUData: "+bytesUData.toString()+" length "+bytesUData.length);
        // TODO:... show ket qua
        var htmlKetQuaXuongU = this.getMessageAfterXuongCuocHtml(errCode,diem,tongDiem,ga,cuocSai);
        var isXuongDung = this.updateMoneyAfterXuongCuoc(serverPos,tongDiem,tongDiemDung,errCode, cuoc,htmlKetQuaXuongU);

        if (this.isSoundEnable) {
            BkSound.OnXuongCuocResult(serverPos, tongDiem, ga, tongDiemDung, errCode, cuocSai, cuoc);
        }
        this.getGameLayer().OnXuongCuocResult(serverPos, tongDiem, ga, tongDiemDung, errCode, cuocSai, cuoc,isXuongDung);
        this.processNextEventInQueue();
    },
    getMessageAfterXuongCuocHtml:function(errCode,diem,tongDiem,ga,cuocSai){
        this.createListMessageAffterXuongCuoc(errCode,diem,tongDiem,ga,cuocSai);
        var mess= "";
        if (errCode == ChanError.KHONG_LOI || (diem < 4 && this.isEnable4_11 && errCode != ChanError.XUONG_CUOC_SAI)) {
            mess += " Xướng đúng: ";
            if (diem < 4 && this.isEnable4_11) {
                mess += "Không đủ 4 điểm ";
            }
            mess += tongDiem + " điểm";
            if (ga >0){
                mess +=", " + ga + " gà";
            }
        } else if (errCode == ChanError.XUONG_CUOC_SAI) {
            mess += " Xướng sai: ";
            var cData = CXuongCuocWindow.InitCuocFromCuocID(Math.abs(cuocSai));
            if (cuocSai < 0) {
                mess += "Thiếu cước " + cData.CuocText + " ";
            }
            else {
                mess += "Thừa cước " + cData.CuocText + " ";
            }
            mess += " " + tongDiem + " điểm";
            if (ga >0){
                mess +=", " + ga + " gà";
            }
        }
        else {
            mess += " Lỗi: " + ChanError.getErrorDescription(errCode);
            if (errCode == ChanError.AN_TREO_TRANH || errCode == ChanError.CHIU_LAI_AN_THUONG) {
                mess += "\n Không được ăn tiền ù";
            }
            else {
                mess += "\n Phải đền cho những người chơi khác";
            }
        }
        logMessage("html mess: "+mess);
        return mess;
    },
    createListMessageAffterXuongCuoc:function (errCode,diem,tongDiem,ga,cuocSai) {
        var mess= "";
        var ele;
        this.listMess = [];
        if (errCode == ChanError.KHONG_LOI || (diem < 4 && this.isEnable4_11 && errCode != ChanError.XUONG_CUOC_SAI)) {
            mess += " Xướng đúng: ";
            if (diem < 4 && this.isEnable4_11) {
                mess += "Không đủ 4 điểm ";
            }
            mess += tongDiem + " điểm";
            if (ga >0){
                mess +=", " + ga + " gà";
            }
            ele = BkRichTextUtil.creatElementText(this.listMess.length,cc.color.WHITE,mess,15);
            this.listMess.push(ele);
        } else if (errCode == ChanError.XUONG_CUOC_SAI) {
            mess += " Xướng sai: ";
            var cData = CXuongCuocWindow.InitCuocFromCuocID(Math.abs(cuocSai));
            if (cuocSai < 0) {
                mess += "Thiếu cước " + cData.CuocText + " ";
            }
            else {
                mess += "Thừa cước " + cData.CuocText + " ";
            }
            mess += " " + tongDiem + " điểm";
            if (ga >0){
                mess +=", " + ga + " gà";
            }
            ele = BkRichTextUtil.creatElementText(this.listMess.length,cc.color.WHITE,mess,15);
            this.listMess.push(ele);
        }
        else {
            mess += " Lỗi: " + ChanError.getErrorDescription(errCode);
            ele = BkRichTextUtil.creatElementText(this.listMess.length,cc.color.WHITE,mess,15);
            this.listMess.push(ele);
            if (errCode == ChanError.AN_TREO_TRANH || errCode == ChanError.CHIU_LAI_AN_THUONG) {
                ele = BkRichTextUtil.createLineBreakElement(this.listMess.length);
                this.listMess.push(ele);
                ele = BkRichTextUtil.creatElementText(this.listMess.length,cc.color.WHITE," Không được ăn tiền ù",15);
                this.listMess.push(ele);
            }
            else {
                ele = BkRichTextUtil.createLineBreakElement(this.listMess.length);
                this.listMess.push(ele);
                ele = BkRichTextUtil.creatElementText(this.listMess.length,cc.color.WHITE," Phải đền cho những người chơi khác",15);
                this.listMess.push(ele);
            }
        }

    },
    createListTextElement:function (uPosition,list,cuoc,htmlKetQuaU,isXuongDung) {
        this.listKqUTextElement = [];
        var uPlayer = this.getPlayerByServerPos(uPosition);
        if (uPlayer == null){
            return;
        }
        var ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.WHITE,uPlayer.getName()+" ",15);
        this.listKqUTextElement.push(ele);
        var i = 0;
        var data;
        for (i=0;i<this.listMess.length;i++){
            this.listKqUTextElement.push(this.listMess[i]);
        }
        // ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.WHITE,htmlKetQuaU,15);
        // this.listKqUTextElement.push(ele);

        ele = BkRichTextUtil.createLineBreakElement(this.listKqUTextElement.length);
        this.listKqUTextElement.push(ele);

        if (!isXuongDung){
            ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.WHITE,"Xướng: ",15);
            this.listKqUTextElement.push(ele);
        }

        ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.WHITE,CXuongCuocWindow.getStringXuongCuoc(cuoc),15);
        this.listKqUTextElement.push(ele);

        ele = BkRichTextUtil.createLineBreakElement(this.listKqUTextElement.length);
        this.listKqUTextElement.push(ele);

        ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.WHITE," ",15);
        this.listKqUTextElement.push(ele);

        ele = BkRichTextUtil.createLineBreakElement(this.listKqUTextElement.length);
        this.listKqUTextElement.push(ele);

        //FCDE63

        // test data
        // var test = true;
        // list[2] = list[1];
        // list[3] = list[1];


        var yellowColor = cc.color(0xFC,0xDE,0x63);
        for (i=0;i<list.length;i++) {
            data = list[i];
            if (data.moneyChange >0){
                ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,yellowColor,data.player.getName()+" : + " +data.moneyChange,15);
                this.listKqUTextElement.push(ele);
            } else {
                ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.WHITE,data.player.getName()+" : - " +Math.abs(data.moneyChange),15);
                this.listKqUTextElement.push(ele);
            }
            // if ((i==0) && (test)){
            //     data.moneyGaGop = 1000000;
            // }
            if (data.moneyGaGop>0){
                ele = BkRichTextUtil.createLineBreakElement(this.listKqUTextElement.length);
                this.listKqUTextElement.push(ele);
                ele = BkRichTextUtil.creatElementText(this.listKqUTextElement.length,cc.color.RED,"Ăn Gà Góp"+" : "+ data.moneyGaGop,15);
                this.listKqUTextElement.push(ele);
            }
            ele = BkRichTextUtil.createLineBreakElement(this.listKqUTextElement.length);
            this.listKqUTextElement.push(ele);
        }


    },
    getTextKetQuaU:function(uPosition,list,cuoc,htmlKetQuaU,isXuongDung){
        this.createListTextElement(uPosition,list,cuoc,htmlKetQuaU,isXuongDung);
        var htmlText = "";
        var i = 0;
        var data;

        var listAfterSort = [];
        //var whiteString:String  = "FFFFFF";
        //var redString:String  = "FF0000";
        //var blackString:String  = "000000";
        //var yellowString:String = "FCDE63";

        var uPlayer = this.getPlayerByServerPos(uPosition);
        if (uPlayer == null){
            return "";
        }
        htmlText += uPlayer.getName() +htmlKetQuaU+"\n";//CHtmlUtil.boldTextWithSizeAndColor(uPlayer.getName(),15,whiteString)+ " ";
        //htmlText += CHtmlUtil.setColor(htmlKetQuaU,whiteString) + "<br>";
        if (!isXuongDung){
            //htmlText += CHtmlUtil.setColor("Xướng: ",whiteString);
            htmlText += "Xướng: ";
        }
        htmlText += CXuongCuocWindow.getStringXuongCuoc(cuoc)+ "\n\n";

        for (i=0;i<list.length;i++){
            data = list[i];
            //var color =  whiteString;
            //if (data.moneyChange >0){ color = yellowString;}
            //var htmlStringBoldName = CHtmlUtil.boldTextWithSizeAndColor(data.player.getName(),15,color);
            if (data.moneyChange >0){
                htmlText+= data.player.getName()+" : + " +data.moneyChange;//htmlStringBoldName + CHtmlUtil.setColor(" : + " +data.moneyChange,color);
            } else {
                htmlText+= data.player.getName()+" : - " +Math.abs(data.moneyChange);//htmlStringBoldName + CHtmlUtil.setColor(" : - " +Math.abs(data.moneyChange),color);
            }
            if (data.moneyGaGop>0){
                //var colorStringAnGa:String = redString;
                htmlText+= "\n Ăn Gà Góp"+" : "+ data.moneyGaGop;//CHtmlUtil.boldTextWithSizeAndColor("Ăn Gà Góp",15,colorStringAnGa)
                    //+ CHtmlUtil.setFontSizeAndColor(" : "+ data.moneyGaGop,15,colorStringAnGa);
            }
            htmlText+= " \n";
        }
        logMessage(htmlText);
        return htmlText;
    },
    updateMoneyAfterXuongCuoc:function(uPosition,tongDiem,  tongDiemDung,  errCode, cuoc,htmlKetQuaXuongU)
    {
        var isXuongDung = false;
        this.arrResultUpdateMoney = [];
        var strNguoiU = "";
        var isMeU = false;
        if (this.getPlayerByServerPos(uPosition)!= null){
            strNguoiU = this.getPlayerByServerPos(uPosition).getName();
            if (strNguoiU == BkGlobal.UserInfo.getUserName()){
                isMeU = true;
            }
        }
        if (errCode == ChanError.KHONG_LOI) {
            // xuong dung + khong co loi gi khi danh
            if (tongDiem < 4 && this.isEnable4_11) {
                this.updateMoneyAfterXuongCuocSai(uPosition, 11, tongDiemDung);
                strNguoiU+=" Ù không đủ 4 điểm.";
                isXuongDung = false;
            }
            else {
                this.updateMoneyAfterXuongCuocDung(uPosition, tongDiem, cuoc);
                strNguoiU+=" Ù: " +CXuongCuocWindow.getStringXuongCuoc(cuoc);
                isXuongDung = true;
            }
        }
        else if (errCode == ChanError.XUONG_CUOC_SAI) {
            // xuong sai
            if (this.isEnable4_11) {
                tongDiem = Math.max(tongDiem, 11);
            }
            this.updateMoneyAfterXuongCuocSai(uPosition, tongDiem, tongDiemDung);
            strNguoiU+=" xướng sai";
            isXuongDung = false;
        }
        else if (errCode != ChanError.AN_TREO_TRANH && errCode != ChanError.CHIU_LAI_AN_THUONG) {
            // cac loi khac AN_TREO_TRANH va CHIU_LAI_AN_THUONG
            if (this.isEnable4_11) {
                tongDiem = Math.max(tongDiem, 11);
            }
            tongDiem = Math.max(tongDiem, tongDiemDung);
            this.updateMoneyAfterXuongCuocSai(uPosition, tongDiem, tongDiemDung);
            strNguoiU+=" bị báo";
            isXuongDung = false;
        }else{
            if (errCode == ChanError.AN_TREO_TRANH || errCode == ChanError.CHIU_LAI_AN_THUONG){
                if (errCode == ChanError.AN_TREO_TRANH){
                    strNguoiU+= " ăn treo tranh";
                } else {
                    strNguoiU+= " chíu được nhưng lại ăn thường";
                }
                if (tongDiem < 4 && this.isEnable4_11) {
                    this.updateMoneyAfterXuongCuocSai(uPosition, 11, tongDiemDung);
                    strNguoiU+=" Ù không đủ 4 điểm";
                    isXuongDung = false;
                }
            } else {
                logMessage("updateMoneyAfterXuongCuoc: Khong lam gi...");
            }
        }

        // show popup update money
        var txtKetQuaU = this.getTextKetQuaU(uPosition,this.arrResultUpdateMoney,cuoc,htmlKetQuaXuongU,isXuongDung);
        if (isMeU && (!isXuongDung)){
            isMeU = false;
        }
        this.getGameLayer().showPopupConfirmAfterUpdateMoney(this.arrResultUpdateMoney,txtKetQuaU,tongDiem,isMeU);
        this.getGameLayer().updateContentChatBoxAfterFinishgame(strNguoiU);
        this.ResetAllPlayer();
        return isXuongDung;

    },

    ResetAllPlayer:function(){
        for (var i=0; i < this.PlayerState.length; i++)
        {
            var player =  this.PlayerState[i];
            player.isPlaying = false;
            player.Fault = false;
            player.chiuCount = 0;
        }
    },
    updateMoneyAfterXuongCuocSai:function(uPosition, tongDiem, tongDiemDung) {
        var array=[];
        var resultUDt;

        logMessage(" updateMoneyAfterXuongCuocSai: uPosition: "+uPosition+" tongDiem: "+tongDiem
            +" tongDiemDung: "+tongDiemDung);
        var uMoneyChange = 0;
        var otherMoneyChange = 0;
        var numberOfCorrectPlayer = 0;
        var i;
        var iclientState;

        // count Number Of Correct Player
        for (i = 0; i < this.PlayerState.length; i++) {
            iclientState= this.PlayerState[i];
            if (iclientState.isPlaying && (!iclientState.Fault) && (iclientState.serverPosition != uPosition)){
                numberOfCorrectPlayer++;
            }

        }

        logMessage("numberOfCorrectPlayer: "+numberOfCorrectPlayer);

        if (numberOfCorrectPlayer == 0) {
            return;
        }

        var posClient = this.getPlayerByServerPos(uPosition);
        logMessage("posClient name: "+posClient.getName()+" current Money: "+posClient.getCurrentMoney());
        uMoneyChange = tongDiem * this.tableBetMoney * numberOfCorrectPlayer;
        if (uMoneyChange > posClient.getCurrentMoney()) {
            uMoneyChange = posClient.getCurrentMoney();
        }

        logMessage("uMoneyChange: "+uMoneyChange);
        otherMoneyChange = Math.floor(uMoneyChange * (1 -  c.TAX_RATE) / numberOfCorrectPlayer);
        uMoneyChange = -uMoneyChange;
        logMessage("otherMoneyChange: "+otherMoneyChange+" uMoneyChange: "+uMoneyChange);

        for (i = 0; i < this.PlayerState.length; i++) {
            iclientState= this.PlayerState[i];
            if ((iclientState.isPlaying) && (iclientState.serverPosition != uPosition) && (!iclientState.Fault)) {
                //increaseMoney(iclientState, otherMoneyChange);
                resultUDt = new ResultUData();
                resultUDt.player = iclientState;
                resultUDt.moneyChange = otherMoneyChange;
                //array.push(resultUDt);
                this.pushReultUToArray(array,resultUDt);

                logMessage("iclientState name: "+iclientState.getName()+" otherMoneyChange: "+otherMoneyChange);
            }
        }
        logMessage("posClient name: "+posClient.getName()+" uMoneyChange: "+uMoneyChange);
        //increaseMoney(posClient, uMoneyChange);
        resultUDt = new ResultUData();
        resultUDt.player = posClient;
        resultUDt.moneyChange = uMoneyChange;
        //array.push(resultUDt);
        this.pushReultUToArray(array,resultUDt);

        // Nguoi bao phai den
        for (i = 0; i < this.PlayerState.length; i++) {
            iclientState= this.PlayerState[i];
            // neu dang choi + pos != pos xuong sai va bi bao
            if ((iclientState.isPlaying)&&(iclientState.serverPosition != uPosition)&&(iclientState.Fault)) {
                // tinh tong so tien phai den toi da
                var denMoney = tongDiemDung * this.tableBetMoney * numberOfCorrectPlayer;
                // so tien den toi da = so tien hien co cua ng bi bao
                if (denMoney > iclientState.getCurrentMoney()) {
                    denMoney = iclientState.getCurrentMoney();
                }
                // nhung ng k bi loi se nhan dc so tien la
                otherMoneyChange =  Math.floor(denMoney * (1 - c.TAX_RATE) / numberOfCorrectPlayer);
                denMoney = -denMoney;
                for (var j = 0; j < this.PlayerState.length; j++) {
                    var jClientState = this.PlayerState[j];
                    if (jClientState.isPlaying) {
                        if ((jClientState.serverPosition != uPosition) && (!jClientState.Fault)) {
                            //increaseMoney(jClientState, otherMoneyChange);
                            resultUDt = new ResultUData();
                            resultUDt.player = jClientState;
                            resultUDt.moneyChange = otherMoneyChange;
                            //array.push(resultUDt);
                            this.pushReultUToArray(array,resultUDt);

                            logMessage("name: "+jClientState.getName()+" money: "+otherMoneyChange);
                        }
                    }
                }
                logMessage("name: "+iclientState.getName()+" money: "+denMoney);
                //increaseMoney(iclientState, denMoney);
                resultUDt = new ResultUData();
                resultUDt.player = iclientState;
                resultUDt.moneyChange = denMoney;
                this.pushReultUToArray(array,resultUDt);
            }
        }

        this.arrResultUpdateMoney = array;
    },
    pushReultUToArray:function(list,data){
        var isExist = false;
        for(var i =0;i<list.length;i++){
            var iData = list[i];
            if (data.player.getName() == iData.player.getName()){
                isExist = true;
                iData.moneyChange += data.moneyChange;
                iData.moneyGaGop += data.moneyGaGop;
            }
        }
        if (!isExist){
            list.push(data);
        }
    },
    updateMoneyAfterXuongCuocDung:function(uPosition, tongDiem, cuoc){
        var array = [];
        var resultUDt;
        logMessage("updateMoneyAfterXuongCuocDung");
        var uMoneyChange = 0;
        var otherMoneyChange = 0;

        // count player fault and ready
        var i;
        var faultCount = 0;
        var iclientState;
        for (i=0;i<this.PlayerState.length;i++){
            iclientState = this.PlayerState[i];
            if ((iclientState.Fault) && (iclientState.isPlaying)) {faultCount++;}
        }

        logMessage("faultCount: "+faultCount);

        for (i=0;i<this.PlayerState.length;i++){
            iclientState= this.PlayerState[i];
            if (iclientState.isPlaying){
                logMessage("iclientState.serverPosition "+iclientState.serverPosition +" uPosition: "+uPosition);
                if (iclientState.serverPosition != uPosition){
                    logMessage("khong phai nguoi U");
                    otherMoneyChange = tongDiem * this.tableBetMoney;
                    if (otherMoneyChange > iclientState.getCurrentMoney()) {
                        otherMoneyChange = iclientState.getCurrentMoney();
                    }
                    uMoneyChange += otherMoneyChange;
                    otherMoneyChange = -otherMoneyChange;
                    logMessage("name: "+iclientState.getName()+" cur: "+ iclientState.getCurrentMoney()
                        +" change: "+otherMoneyChange);
                    if (faultCount == 0) {
                        //increaseMoney(iclientState, otherMoneyChange);
                        resultUDt = new ResultUData();
                        resultUDt.player = iclientState;
                        resultUDt.moneyChange = otherMoneyChange;
                        //array.push(resultUDt);
                        this.pushReultUToArray(array,resultUDt);
                        logMessage("after Changing: "+ iclientState.getCurrentMoney());
                    }
                }
            }
        }

        if (faultCount > 0) {
            otherMoneyChange = uMoneyChange;
            uMoneyChange = 0;
            for (i = 0; i < this.PlayerState.length; i++) {
                iclientState= this.PlayerState[i];
                if (iclientState.isPlaying){
                    if (iclientState.Fault) {
                        var changeMoney = otherMoneyChange;
                        if (changeMoney > iclientState.getCurrentMoney()) {
                            changeMoney = iclientState.getCurrentMoney();
                        }
                        uMoneyChange += changeMoney;
                        resultUDt = new ResultUData();
                        resultUDt.player = iclientState;
                        resultUDt.moneyChange = -changeMoney;
                        this.pushReultUToArray(array,resultUDt);
                    }
                }
            }
        }


        uMoneyChange = Math.floor(uMoneyChange * (1 - c.TAX_RATE));
        logMessage("uMoneyChange: "+uMoneyChange);
        var posClient = this.getPlayerByServerPos(uPosition);
        if (posClient == null){
            return;
        }
        logMessage("name: "+posClient.getName()+" cur: "+ posClient.getCurrentMoney()
            +" change: "+uMoneyChange);
        //increaseMoney(posClient, uMoneyChange);
        resultUDt = new ResultUData();
        resultUDt.player = posClient;
        resultUDt.moneyChange = uMoneyChange;

        logMessage("after Changing: "+ posClient.getCurrentMoney());

        // check an ga
        if (this.gaGop && CXuongCuocWindow.isAnGaGop(cuoc) ) {
            iclientState = this.getPlayerByServerPos(uPosition);
            // set moneyGaGop khi la cuoc u duoc an ga gop
            logMessage("cuoc co chi bach thu duoc an ga: tong ga = "+this.tongGa);
            resultUDt.moneyGaGop = this.tongGa;
            this.resetGa();
        }
        this.pushReultUToArray(array,resultUDt);
        this.arrResultUpdateMoney = array;
        for (i=0;i<this.arrResultUpdateMoney.length;i++){
            var di = this.arrResultUpdateMoney[i];
            logMessage("name "+di.player.getName()+ " moneyChange: "+di.moneyChange+" moneyGaGop: "+di.moneyGaGop);
        }

    },
    resetGa:function()
    {
        logMessage("resetGa: tongGa = 0");
        this.tongGa = 0;
        var player;
        for (var i =0; i < this.PlayerState.length; i++) {
            player = this.PlayerState[i];
            player.tienGopGa = 0;
        }
        this.getGameLayer().OnUpdateTableMoneyStatus();
    },
    getNoc:function(){
        return this.NocNumber;
    },
    ICanU:function(serverCardID){
        var player = this.getMyClientState();
        if (player == null){
            return false;
        }
        if (!player.isPlaying){
            return false;
        }
        if (player.Fault){
            return false;
        }
        return player.canUWithCard(serverCardID);
    },
    processFinishGame:function(packet){
        this._super();
        this.ResetAllPlayer();
        this.getGameLayer().OnFinishedGame();
        this.getGameLayer().OnProcessFinishGame();
        this.processNextEventInQueue();
    },
    processPrepareNewGame:function(packet){
        this._super();
        this.ResetAllPlayer();
        this.getGameLayer().OnFinishedGame();
    },
    ProcessErrorReturn:function(packet){
        var b1 = packet.Buffer.readByte();// server pos
        var b2 = packet.Buffer.readByte();// errCode
        var strError = this.getStringErrorWhenTakeCardWith(b1,b2);
        logMessage("b1: " + b1 + " b2: " + b2);

        if (this.getMyPos() == b1) {
            showToastMessage(strError,c.WINDOW_WIDTH/2,c.WINDOW_HEIGHT/2);
        }

        if (this.isBasicMode) {
            return;
        }
        if (!ChanError.isTreotranh(b2)){
            //if (b2 >5 ) {
            var player = this.getPlayerByServerPos(b1);
            player.setFault(true);
            this.getGameLayer().OnPlayerError(b1,strError);
        }
    },
    getStringErrorWhenTakeCardWith:function(position,errCode){
        if (!this.isBasicMode) {
            return "Lỗi: " + ChanError.getErrorDescription(errCode);
        }
        else {
            var  str = "";
            if (ChanError.isTreotranh(errCode)) {
                str = "Bạn phạm lỗi: " + ChanError.getErrorDescription(errCode);
                return str;
            }

            if (this.isMyServerPos(position)) {
                str = "Bạn phạm lỗi: " + ChanError.getErrorDescription(errCode);
            }
            else {
                var posClient = this.getPlayerByServerPos(position);
                if (posClient != null){
                    str = posClient.getName()+ " phạm lỗi: " + ChanError.getErrorDescription(errCode);
                }
            }
            return str;
        }
        return "";
    },
    ProcessChangeGaGop:function(Packet)
    {
        this.gaGop = (Packet.Buffer.readByte() == 1);
        this.getGameLayer().OnUpdateTableMoneyStatus();
    },
    ProcessUpdatePlayerModel:function(Packet){
        var playerName;
        playerName = Packet.Buffer.ReadString();
        var vipLv = -1;
        var top1 = Packet.Buffer.readByte();
        var top2 = Packet.Buffer.readByte();
        var top3 = Packet.Buffer.readByte();
        if (IS_VIP_ENABLE){
            vipLv =Packet.Buffer.readByte();
        }

        this.getGameLayer().setPlayerModel(playerName,top1 ,top2,top3,vipLv);
        this.processNextEventInQueue();
    },
    clearPlayerCard:function (player)
    {
        if(player != null)
        {
            player.clearAllCard();
        }
    },
    SetUpHaveGaGop:function(state){
        var Packet = new BkPacket();
        Packet.CreatePacketWithTypeAndByteData(c.NETWORK_CHANGE_GA_GOP,state);
        BkConnectionManager.send(Packet);
    },

    ///////////////////////////////////////////////////////////
    // Function for sound
    ///////////////////////////////////////////////////////////

    // Function check doc An gi danh lay
    isAnGiDanhLay:function(serPos, discardCard){
    // Check chan cuoi cung
        var player = this.getPlayerByServerPos(serPos);

        if (player == null) {
            return false;
        }

        var card = player.getLastTakeCard();
        if (card == null) {
            return false;
        }

        //logMessage("Last Eat Card:" + CCardsUtils.getCardNameWithID(card.getCardId())
        //    + " Discard card:" + CCardsUtils.getCardNameWithID(discardCard.getCardId()));

        if (card.getCardNumber() == discardCard.getCardNumber()) {
            return true;
        } else {
            return false;
        }
    },

    // Function check doc nhat di nhi u
    getNextPlayerByID:function(svrPos)
    {
        var pos = this.getPosInArray(svrPos);
        for (var i = 0; i < 4; i++) {
        pos = (pos + 1) % this.PlayerState.length;
        var player = this.getPlayerDirrectPos(pos);
        if (player.isPlaying) {
            return player.serverPosition;
        }
    }
        return -1;
    },
    isNhatDiNhiU:function(serPos, discardCard)
    {
        var nextPlayerPos = this.getNextPlayerByID(serPos);

        if (nextPlayerPos == -1) {
            return false;
        }

        var player = this.getPlayerByServerPos(nextPlayerPos);

        return !player.canEatCard(discardCard);

    },

    // Function check doc danh chi ngoi cho chi dung
    isDanhChiNgoiChoChiDung:function(serverPos, discardCard)
    {
        if (discardCard.getCardId() == 51) {
            return true;
        }
        return false;
    },

    // Function check doc het bat het cuu...
    isHetQuanRoi:function(discardCard) {
        if (discardCard.getCardNumber() == 2 || discardCard.getCardNumber() == 0) {
            // Neu la nhi hoac chi chi thi ko doc loai nay
            return false;
        }

        var player;
        var i;
        var count = 0;
        for (i=0; i< this.PlayerState.length; i++) {
            player = this.PlayerState[i];
            if (player != null && player.isPlaying) {
                count += player.countCardByNumber(discardCard.getCardNumber());
            }
        }
        if (count > 4) {
            return true;
        }
        return false;
    },

    // Check an cho so
    isAnChoSo:function(serverPos, takeCard) {
        var player = this.getPlayerByServerPos(serverPos);
        if (takeCard.isRedCard()) {
            if (player.countRedCardEat() > 4) {
                return true;
            }
        }
        return false;
    },
    isCauLai:function(serverPos, takeCard)
    {
        var nextPlayerPos = this.getNextPlayerByID(serverPos);
        if (this.isAnChoSo(nextPlayerPos, takeCard)) {
            return true;
        }
        return false;
    },
    isDuoiChet:function(serverPos, card)
    {
        var nextPlayerPos = this.getNextPlayerByID(serverPos);
        var nextPlayer = this.getPlayerByServerPos(nextPlayerPos);
        if (nextPlayer == null){
            return false;
        }
        return !nextPlayer.canEatCard(card);
    },
    processLeaveDurringGame:function(packet){
        var playerPos = packet.Buffer.readByte();
        var cashChange = packet.Buffer.readInt();
        var playerOutGame = this.getPlayer(playerPos);

        this.processLeaveDurringGameWithData(playerPos,cashChange,playerOutGame);
        this.baseProcessLeaveDuringGame(playerOutGame);

        var isNext = this.isQueueEvent(c.NETWORK_LEAVE_DURING_GAME);


        // Chia ga thang thoat
        if (this.gaGop && this.tongGa >0 && playerOutGame.tienGopGa>0) {
            logMessage("ProcessLeaveDurringGame: Chia ga thang thoat");
            var amount = playerOutGame.tienGopGa / (this.currentPlayerCount -1);

            for (i=0; i< this.PlayerState.length; i++) {
                var tempPlayer = this.PlayerState[i];
                if (tempPlayer.isPlaying && tempPlayer.serverPosition != playerPos) {
                    tempPlayer.tienGopGa += amount;
                    logMessage("cong tien ga gop cho moi ng choi: name "+tempPlayer.getName()
                        +" tien ga gop: "+tempPlayer.tienGopGa);
                    if (this.currentPlayerCount == 2){
                        this.increaseMoney(tempPlayer, this.tongGa,"Trả gà");
                        this.resetGa();
                    }
                }
            }
            logMessage("tongGa: "+this.tongGa);
            playerOutGame.tienGopGa = 0;
        }

        this.getGameLayer().clearCurrentGameGui();
        if (isNext){
            this.processNextEventInQueue();
        }
    },
    ProcessOutGame:function(){
        if ((this.gaGop) && (!this.isInGameProgress())){
            logMessage("thoat hop le -> nhan lai tien ga "+this.getMyClientState().tienGopGa);
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney()+this.getMyClientState().tienGopGa);
        }
        this._super();

    },
    processTraTienGaKhiNguoiChoiKhacThoat:function(playerPos){
        var player = this.getPlayerByServerPos(playerPos);
        if (player != null){
            if (this.gaGop && !player.isPlaying && !this.isInGameProgress()) {
                if (player.tienGopGa > 0) {
                    // Tru tong ga cua player dang vua thoat
                    logMessage("tra tien ga cho ng choi ra: name "+player.getName()+" tien ga gop: "
                        + player.tienGopGa + " tien hien tai: "+player.getCurrentMoney());
                    logMessage("tongGa truoc khi tru: "+this.tongGa);
                    this.tongGa = this.tongGa - player.tienGopGa;
                    logMessage("tongGa sau khi tru: "+this.tongGa);
                    player.tienGopGa = 0;
                    this.getGameLayer().OnUpdateTableMoneyStatus();

                }
                // Neu sau khi thoat chi con lai 1 nguoi choi thi hoan tien ga
                var countPlayer = 0;
                var otherPlayer;
                for (var i= 0; i<4; i++) {
                    if (i!= playerPos) {
                        otherPlayer = this.getPlayerByServerPos(i);
                        if (otherPlayer != null && otherPlayer.tienGopGa >0) {
                            countPlayer++;
                        }
                    }
                }
                if (countPlayer == 1) {
                    logMessage("tra ga khi trong ban chi con 1 nguoi choi thuc su co tien ga >0");
                    for (i= 0; i<4; i++) {
                        if (i!= playerPos) {
                            otherPlayer = this.getPlayerByServerPos(i);
                            if (otherPlayer!= null && otherPlayer.tienGopGa >0) {
                                logMessage("tra tien ga cho ng choi ra: name "+otherPlayer.getName()+" tien ga gop: "
                                    + otherPlayer.tienGopGa + " tien hien tai: "+otherPlayer.getCurrentMoney());
                                logMessage("tongGa: "+this.tongGa);
                                otherPlayer.tienGopGa = 0;
                                this.increaseMoney(otherPlayer, this.tongGa,"Trả gà");
                            }
                        }
                    }
                    this.tongGa = 0;
                    logMessage("tongGa: "+this.tongGa);
                    this.getGameLayer().OnUpdateTableMoneyStatus();
                }
            }
        }
    },
    processTableLeavePush:function(Packet)
    {
        logMessage("processTableLeavePush ");
        var playerPos = Packet.Buffer.readByte();
        this.processTraTienGaKhiNguoiChoiKhacThoat(playerPos);
        this.processTableLeave(playerPos);

        if (this.isQueueEvent(Packet.Type)){
            this.processNextEventInQueue();
        }
    },
    avgGaGop:function(){
        // Gop ga cho player
        var previousGamePlayerCount =0;
        var avgGa = 0;
        var i = 0;
        var player;

        for (i = 0; i < this.PlayerState.length; i++)
        {
            player = this.PlayerState[i];
            if (player.tienGopGa > 0) {
                previousGamePlayerCount++;
            }
        }
        avgGa = Math.floor(this.tongGa / previousGamePlayerCount);
        logMessage("tongGa: "+this.tongGa + " avgGa: "+avgGa);
        return avgGa;
    },
    onGopGaReady:function(){
        var gaForNewPlayer = this.avgGaGop();
        var myPlayer = this.getMyClientState();
        myPlayer.tienGopGa = gaForNewPlayer;
        this.increaseMoney(myPlayer, -1 * gaForNewPlayer);
        this.tongGa += gaForNewPlayer;
        logMessage("onGopGaReady tongGa: "+this.tongGa);
        logMessage("gop ga cho ng choi moi: name "+myPlayer.getName()+" tien ga gop: "+myPlayer.tienGopGa
            +" tien hien tai: "+myPlayer.getCurrentMoney());
        this.getGameLayer().OnUpdateTableMoneyStatus();
        this.resetAllPlayerState();
        this.netWorkReadyGame();
    },
    //override readyAction for gop ga
    processPlayerReadyAction:function(){
        var self = this;
        var myPlayer = this.getMyClientState();
        if (this.gaGop && this.tongGa >0 && (myPlayer.tienGopGa == 0)) {
            var gaForNewPlayer = this.avgGaGop();
            if (gaForNewPlayer + 6 * this.tableBetMoney > myPlayer.getCurrentMoney())
            {
                this.getGameLayer().showPopUpInvitePayment();
            }
            else {
                var str = "Bàn đang chơi gà góp, Bạn phải vào gà " + gaForNewPlayer + "\n"
                    + "Bạn có đồng ý góp gà không?";
                this.getGameLayer().setVisibleCountDownText(false);
                showPopupConfirmWith(str,"",function(){
                    self.onGopGaReady();
                },function(){

                },function(){
                    // remove callback
                    self.getGameLayer().setVisibleCountDownText(true);
                });
            }
        } else {
            this.resetAllPlayerState();
            this.netWorkReadyGame();
        }
    },
    updateTienGaForOtherPlayer:function(player,status){
        if (this.gaGop && this.tongGa >0 && player.tienGopGa == 0 && status == CPlayer.READY) {
            var gaForNewPlayer = this.avgGaGop();
            player.tienGopGa = gaForNewPlayer;
            this.tongGa = this.tongGa + gaForNewPlayer;
            this.increaseMoney(player, -1 * gaForNewPlayer);
            this.getGameLayer().OnUpdateTableMoneyStatus();
            logMessage("vao ga nguoi choi moi: name "+player.getName()+" tien ga gop: "
                + player.tienGopGa + " tien hien tai: "+player.getCurrentMoney());
            logMessage("tongGa: "+this.tongGa);
        }
    },
    setupChanTable:function (isEnable411,isBasicMode,cuocGa) {
        var Packet = new BkPacket();
        Packet.CreateSetupChanTablePacket(isEnable411,isBasicMode,cuocGa);
        BkConnectionManager.send(Packet);
    },
    processNotifyPaymentBonus:function (Packet) {
        var type = Packet.Buffer.readByte();
        var bonusPercent;
        if(type == 2) {
            bonusPercent = Packet.Buffer.readInt();
            logMessage("bonusPercent "+bonusPercent);
            var header = Packet.Buffer.ReadString();
            var body1 = Packet.Buffer.ReadString();
            var body2 = Packet.Buffer.ReadString();
            var duration = Packet.Buffer.readInt();
            var func = -1;
            var numBtn = 1;
            var strUrl = "";
            if (Packet.Buffer.isReadable()){
                numBtn = Packet.Buffer.readByte();
                if (numBtn == 2){
                    func = Packet.Buffer.readByte();
                    if (func == 7){
                        strUrl = Packet.Buffer.ReadString();
                    }
                }
            }
            this.initPaymentBonusWD(bonusPercent,header,body1,body2,duration,numBtn,func,strUrl);
            // TODO... update UI Km Btn
            // CGlobal.Gui.updatePositionPaymentButton(bonusPercent);
            BkGlobal.paymentBonusPercent = bonusPercent;
            var crSce = getCurrentScene();
            if (crSce){
                crSce.getGameLayer().addPaymentBonusSticker();
            }
        }else if(type == 1) {
            bonusPercent = Packet.Buffer.readInt();
            logMessage("bonusPercent "+bonusPercent);
            // TODO... update UI Km Btn
            //CGlobal.Gui.updatePositionPaymentButton(bonusPercent);
            BkGlobal.paymentBonusPercent = bonusPercent;
            var crSce = getCurrentScene();
            if (crSce){
                crSce.getGameLayer().addPaymentBonusSticker();
            }
        }else if(type == 3) {
            var numberButton = Packet.Buffer.readByte();
            var funcBtn1 = Packet.Buffer.readByte();
            var strWeb1 = "";
            if (funcBtn1 == 7){
                strWeb1 = Packet.Buffer.readString();
            }
            var funcBtn2 = -1;
            var strWeb2 = "";
            if (numberButton == 2){
                funcBtn2 = Packet.Buffer.readByte();
                if (funcBtn2 == 7){
                    strWeb2 = Packet.Buffer.readString();
                }
            }
            var strContent = Packet.Buffer.readString();
            this.initNotifyContentWD(strContent,numberButton,funcBtn1,strWeb1,funcBtn2,strWeb2);
        }
    },
    processNotifyAddMoney:function (packet) {
        var mnChange = packet.Buffer.readInt();
        var strReason = packet.Buffer.readString();
        this.increaseMoney(this.getMyClientState(),mnChange);
        this.getGameLayer().setVisibleCountDownText(false);
        var  self = this;
        showPopupMessageWith(strReason,"Thông báo",function () {

        },function () {
            self.getGameLayer().setVisibleCountDownText(true);
        });
    },

    //============================================
    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_DISCARD_PUSH://OK
            case c.NETWORK_PICK_CARD_PUSH://OK
            case c.NETWORK_TAKE_CARD_PUSH://OK
            case c.NETWORK_FORFEIT_RETURN://OK
            case c.NETWORK_CHIU_RETURN://OK
            case c.NETWORK_TRA_CUA_RETURN://OK
            case c.NETWORK_SHOW_U://OK
            case c.NETWORK_SHOW_U_PUSH://OK
            case c.NETWORK_XUONG_CUOC_RETURN://OK
            case c.NETWORK_FINISH_GAME_RETURN://OK
            case c.NETWORK_DEAL_CARD_RETURN://OK
            case c.UPDATE_PLAYER_MODEL://OK
                return true;
        }
        return this._super(eventType);
    },
    processNetworkEvent:function(packet){
        logMessage("BkChanIngameLogic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_TABLE_SYN_RETURN:
                this.processGameTableSyn(packet);
                break;
            case c.NETWORK_DISCARD_PUSH:
                this.processPlayerDiscard(packet);
                break;
            case c.NETWORK_PICK_CARD_PUSH:
                this.processPickCard(packet);
                break;
            case c.NETWORK_TAKE_CARD_PUSH:
                this.onTakeCard(packet);
                break;
            case c.NETWORK_FORFEIT_RETURN:
                this.ProcessForfeitReturn(packet);
                break;

            case c.NETWORK_DEAL_CARD_RETURN:
                this.processDealCardReturn(packet);
                break;
            case c.NETWORK_CHIU_RETURN:
                this.ProcessChiuReturn(packet);
                break;
            case c.NETWORK_TRA_CUA_RETURN:
                this.ProcessTraCuaReturn(packet);
                break;
            case c.NETWORK_SHOW_U_PUSH:
                this.ProcessShowUConfirm(packet);
                break;
            case c.NETWORK_SHOW_U:
                this.ProcessShowU(packet);
                break;
            case c.NETWORK_SETUP_CHAN_TABLE:
                this.onSetupChanTable(packet);
                break;
            case c.NETWORK_XUONG_CUOC_RETURN:
                this.isContinueGame = true;
                this.ProcessXuongCuocReturn(packet);
                break;

            case c.NETWORK_FINISH_GAME_RETURN:
                this.hasChiu = 0;
                this.processFinishGame(packet);
                break;
            case c.NETWORK_PREPARE_NEW_GAME:
                this.processPrepareNewGame(packet);
                break;
            case c.NETWORK_ERROR_RETURN:
                this.ProcessErrorReturn(packet);
                break;
            case c.NETWORK_CHANGE_GA_GOP_PUSH:
                this.ProcessChangeGaGop(packet);
                break;
            case c.NETWORK_BOC_CAI:
                //var iByte = packet.Buffer.readByte();
                //this.ProcessChangeGaGop(packet);
                break;
            case c.UPDATE_PLAYER_MODEL:
                this.ProcessUpdatePlayerModel(packet);
                break;
            case c.NETWORK_LEAVE_DURING_GAME:
                this.processLeaveDurringGame(packet);
                break;
            case c.NETWORK_TABLE_LEAVE_PUSH:
                this.processTableLeavePush(packet);
                break;
            case c.NETWORK_NOTIFY_PAYMENT_BONUS:
                this.processNotifyPaymentBonus(packet);
                break;
            case c.NETWORK_NOTIFY_ADD_MONEY:
                this.processNotifyAddMoney(packet);
                break;
            default:{
                logMessage("BkChanIngameLogic not process packet with type: "+packet.Type + " -> call super process");
                this._super(packet);
            }
        }
    },

    //====================================================================
    // truongbs++ add check money for test
    countCheckMoney:0,
    isCheckMoney:false,
    checkMoney:function(){
        this.countCheckMoney = 0;
        this.isCheckMoney = true;
        for (var i = 0; i < this.PlayerState.length; i++){
            var playeri = this.PlayerState[i];
            if (playeri != null) {
                var name = playeri.getName();
                this.processOverViewPlayer(name);
            }
        }
    },

    isSaiTien:function(money){
        for (var i=0;i<this.maxPlayer;i++){
            var iplayer = this.getPlayer(i);
            if (iplayer != null){
                logMessage("name "+iplayer.getName()+ " money "+money+" current money "+iplayer.getCurrentCash());
                if (money == iplayer.getCurrentCash()){
                    return false;
                }
            }
        }
        return true;
    },
    ProcessOverviewProfile:function(Packet){
        logMessage("this.countCheckMoney: "+this.countCheckMoney + " this.isCheckMoney "+this.isCheckMoney);
        if (!this.isCheckMoney){
            this._super(Packet);
        } else {
            var userData = this.playerOverviewData;
            var avar =Packet.Buffer.readByte();
            var money = Packet.Buffer.readInt();
            if (this.isSaiTien(money)){
                showPopupMessageWith("có người sai tiền!","thông báo");
            }
            this.countCheckMoney++;
            if (this.countCheckMoney == this.numberOfPlayingPlayer){
                this.isCheckMoney = false;
            }
            logMessage("Ingame ProcessOverviewProfile count:" + this.countCheckMoney + " isCheckMoney: " + this.isCheckMoney);
        }
    }

});
