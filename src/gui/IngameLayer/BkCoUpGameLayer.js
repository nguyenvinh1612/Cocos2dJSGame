/**
 * Created by VanChinh on 12/19/2015.
 */

BkCoUpGameLayer = BkChessBaseIngameLayer.extend({
    ruleText: null,
    takenList: null,
    thongbaoSprite: null,
    boxQuananSprite: null,
    ctor: function () {
        this._super();
        this.takenList = [];

        this.thongbaoSprite = getSpriteFromImage("#" + res_name.ThongBao);
        this.thongbaoSprite.setPosition(this.thongbaoSprite.width / 2 + 5, this.thongbaoSprite.height / 2 + 2);
        this.addChild(this.thongbaoSprite, 10);

        this.ruleText = new BkLabel("", "", 15);
        this.ruleText.setPosition(this.thongbaoSprite.x + 22, this.thongbaoSprite.y + 1.5);
        this.ruleText.setTextColor(cc.color.GRAY);
        this.addChild(this.ruleText, 11);

        this.boxQuananSprite = getSpriteFromImage("#" + res_name.BoxQuanAn);
        this.boxQuananSprite.setPosition(this.boxQuananSprite.width / 2 + 10, this.thongbaoSprite.y + this.thongbaoSprite.height / 2 + this.boxQuananSprite.height / 2 + 2);
        this.boxQuananSprite.setVisible(false);
        this.addChild(this.boxQuananSprite, 11);
    },

    OnGameTableSyn: function(packet) {
        this._super(packet);

        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();

        this.chessRule = packet.Buffer.readByte();
        Util.setClientSetting(key.showTakenPiece, this.chessRule == CO_UP_KHONG_LAT ? 0 : 1);
        var str = (this.chessRule == CO_UP_KHONG_LAT ? "không lật quân ăn" : "có lật quân ăn");
        this.updateRuleText();
        var xPos = cc.winSize.width / 2;
        var yPos = TOAST_MSG_YPOS;
        if(gameLogic.gameStatus == GAME_STATE_PLAYING) yPos = cc.winSize.height / 2;
        showToastMessage("Luật chơi: " + str, xPos, yPos, 2, 200);

        if (!gameLogic.isInGameProgress()) {
            if(currentPlayer && currentPlayer.isObserver) this.removeCountDownText();
            this.cancelTimer(true);
            this.resetPositionOfChessPieces();
            this.changeButtonState();
            return;
        }

        var oneTurnTimeRemain = 0;
        if (packet.Buffer.isReadable()) {
            this.updateGameStateAtBeginning(packet.Buffer.readByte(), packet.Buffer.readByte());

            oneTurnTimeRemain = packet.Buffer.readInt();

            var firstPlayer = gameLogic.getPlayer(this.firstPlayPosition);
            firstPlayer.isPlaying = true;
            firstPlayer.setRemainTime(packet.Buffer.readInt());

            var secondPlayer = gameLogic.getPlayer(this.lastPlayPosition);
            secondPlayer.isPlaying = true;
            secondPlayer.setRemainTime(packet.Buffer.readInt());

            this.currentColorPlaying = packet.Buffer.readByte();
            if (this.isReverse) {
                this.currentColorPlaying = 1 - this.currentColorPlaying;
            }
            var i, len, chessPiece;
            if (this.isReverse) {
                for (i = 0, len = this.chessPieces.length; i < len; i++) {
                    chessPiece = this.chessPieces[(i + 16) % 32];
                    chessPiece.colIndex = 8 - packet.Buffer.readByte();
                    chessPiece.rowIndex = 9 - packet.Buffer.readByte();
                    chessPiece.isDead = packet.Buffer.readByte() == 1;
                    chessPiece.faceState = packet.Buffer.readByte();
                    chessPiece.chessType = packet.Buffer.readByte();
                    chessPiece.reposition();
                    chessPiece.setBitmap();
                    if(!chessPiece.isDead && currentPlayer && !currentPlayer.isObserver && chessPiece.chessColor == currentPlayer.chessColor){
                        chessPiece.setEnableEventHover(true);
                    }
                }
            }
            else {
                for (i = 0, len = this.chessPieces.length; i < len; i++) {
                    chessPiece = this.chessPieces[i];
                    chessPiece.colIndex = packet.Buffer.readByte();
                    chessPiece.rowIndex = packet.Buffer.readByte();
                    chessPiece.isDead = packet.Buffer.readByte() == 1;
                    chessPiece.faceState = packet.Buffer.readByte();
                    chessPiece.chessType = packet.Buffer.readByte();
                    chessPiece.reposition();
                    chessPiece.setBitmap();
                    if(!chessPiece.isDead && currentPlayer && !currentPlayer.isObserver && chessPiece.chessColor == currentPlayer.chessColor){
                        chessPiece.setEnableEventHover(true);
                    }
                }
            }
            if(!this.takenList) this.takenList = [];
            this.updateTakenListWhenSyn();
        }

        this.startTimer(oneTurnTimeRemain);
        this.changeButtonState();
    },

    updateTakenListWhenSyn: function() {
        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();

        if (currentPlayer.status != PLAYER_STATE_NOT_READY && this.chessRule == CO_UP_CO_LAT) {
            var i, len;
            for ( i = 16, len = this.chessPieces.length; i < len; i++) {
                if (this.takenList.length >= MAX_TAKEN_PIECE_SHOW) {
                    break;
                }
                if (this.chessPieces[i].isDead) {
                    this.takenList.push(this.chessPieces[i]);
                }
            }

            //if (this.takenList.length > 0) {
            //    this.ruleText.setVisible(false);
            //}

            for (i = 0, len = this.takenList.length; i < len; i++) {
                var xPos = ((i<4?i:i-4) + 1) * 48 - 14;
                var yPos = (i<4?1:2) * 60 + 12;
                this.takenList[i].scale = 0.75;
                this.takenList[i].setOpacity(200);
                this.takenList[i].setPosition(xPos, yPos);
            }
        }
    },

    onRealTypeReturn: function(index, type){
        if (this.isReverse) {
            index = ((index + 16) % 32);
        }

        this.chessPieces[index].chessType = type;
        this.chessPieces[index].faceUp();
    },

    onChessRuleReturn: function(chessRule){
        this.chessRule = chessRule;
        Util.setClientSetting(key.showTakenPiece, this.chessRule == CO_UP_KHONG_LAT ? 0 : 1);
        var strRule = (chessRule == CO_UP_KHONG_LAT ? "không lật quân ăn" : "có lật quân ăn");
        this.updateRuleText();
        var xPos = cc.winSize.width / 2;
        var yPos = TOAST_MSG_YPOS;
        showToastMessage("Chủ bàn đổi luật thành: " + strRule, xPos, yPos, 2, 300);
    },

    updateRuleText: function() {
        if(this.chessRule == CO_UP_KHONG_LAT){
            this.ruleText.setString("Không lật quân ăn");
            this.boxQuananSprite.setVisible(false);
        }
        else if(this.chessRule == CO_UP_CO_LAT){
            this.ruleText.setString("Có lật quân ăn");
            this.boxQuananSprite.setVisible(true);
            var currentPlayer = this.getLogic().getMyClientState();
            if(currentPlayer && currentPlayer.isObserver === true){
                this.boxQuananSprite.setVisible(false);
            }
        }
    },

    /* override function of base layer */
    onObserverStatusChange: function(playerPosition, isObserver) {
        this._super(playerPosition, isObserver);
        var currentPlayer = this.getLogic().getMyClientState();
        if(currentPlayer && currentPlayer.serverPosition == playerPosition){
            if(currentPlayer.isObserver === false && this.chessRule == CO_UP_CO_LAT){
                this.boxQuananSprite.setVisible(true);
            }
            else this.boxQuananSprite.setVisible(false);
        }
    },

    /* override function of base layer */
    createChessPieces: function() {
        this._super();
        for (var i = 0; i < 32; i++) {
            if (this.chessPieces[i].chessType == BkChessType.VUA) {
                continue;
            }
            this.chessPieces[i].faceState = FACE_DOWN;
            this.chessPieces[i].setBitmap();
        }
    },

    /* override function of base layer */
    resetChessPieces: function() {
        for (var i = 0; i < 32; i++) {
            if (this.chessPieces[i].chessType != BkChessType.VUA) {
                this.chessPieces[i].faceState = FACE_DOWN;
            }
        }
        this._super();
    },

    /* override function of base layer */
    createPiece: function(index) {
        var piece = new BkCoUpPiece(index);
        piece.chessType = this.chessPieces[index].chessType;
        piece.colIndex = this.chessPieces[index].colIndex;
        piece.rowIndex = this.chessPieces[index].rowIndex;
        piece.isFaceUp = (this.chessPieces[index].faceState == FACE_UP);
        return piece;
    },

    /* override function of base layer */
    animateTakePiece: function(index) {
        if (index < 0) {
            return;
        }

        var currentPlayer = this.getLogic().getMyClientState();

        if (this.chessRule == CO_UP_KHONG_LAT || currentPlayer.status == PLAYER_STATE_NOT_READY || currentPlayer.chessColor != this.currentColorPlaying) {
            this._super(index);
            return;
        }

        this.chessPieces[index].isDead = true;

        if(!this.takenList) this.takenList = [];

        if (this.takenList.length >= MAX_TAKEN_PIECE_SHOW) {
            this.takenList[0].setPosition(-100, -100);
            this.takenList.splice(0, 1);
        }
        this.takenList.push(this.chessPieces[index]);
        for (var i = 0; i < this.takenList.length; i++) {
            var piece = this.takenList[i];
            var xPos = ((i<4?i:i-4) + 1) * 48 - 14;
            var yPos = (i<4?1:2) * 60 + 12;
            piece.scale = 0.75;
            piece.setOpacity(200);
            var move = cc.moveTo(0.5, xPos, yPos);
            piece.runAction(move);
        }
    },

    /* override function of base layer */
    removeOtherItemsFromTable: function() {
        this.takenList = [];
        this._super();
    },

    onPrepareNewGame: function() {
        this.removeOtherItemsFromTable();
        this._super();
    }
});