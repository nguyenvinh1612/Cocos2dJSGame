/**
 * Created by VanChinh on 11/23/2015.
 */

PLAYER_AVAR_MARGIN_TP = 197.5;
PLAYER_AVAR_MARGIN_LF = 70.5;
PLAYER_AVAR_MARGIN_RIGHT = 147;
BOARD_HEIGHT_RIVER = 62;
BOARD_CELL_WIDTH = 57;
BOARD_CELL_HEIGHT = 57;
TOAST_MSG_YPOS = 190.5;
BkChessBaseIngameLayer = BkBaseIngameLayer.extend({
    padding: 0,
    colWidth: 0,
    rowHeight: 0,
    chessPieces: null,
    pieceSelected: -1,
    colorAllowTouch: -1, currentColorPlaying: -1, firstPlayPosition: null, lastPlayPosition: null,
    isReverse: null,
    batdauchoiSprite: null,
    defaultChessTime: null, oneTurnChessTime: null,
    btnObserver: null, btnBetMax: null, btnContinue: null,
    btnSurrender: null, btnOfferDraw: null,
    selectedSprite: null,
    lastMoveSpriteStart: null,
    lastMoveSpriteFinish: null,
    hoaSprite: null,
    chieutuongSprite: null,
    moveableShowSprite: null,
    chessRule: null,
    tableBetMoneyText: null,
    tableRedStatus: null,
    firstEmptyAvatar: null, secondEmptyAvatar: null,
    canTakenList: null,
    ctor: function () {
        this._super();
        this.initChessTable();
        this.createChessPieces();
        this.initButtons();
        this.initSelectedSprite();
        this.updateTableItem();
    },

    initTopBar: function(){
        this._super();

        this.imgCoin.x = Math.floor(this.btnBack.x + 105);
        this.imgCoin.scaleX = 0.85;
        this.txtBetMoney.x = this.imgCoin.x;
        this.txtBetMoney.setFontSize(16);

        this.btnPayment.x = this.btnPayment.x + 3;
        this.btnScreenShot.x = this.btnScreenShot.x + 3;
        this.btnSetting.x = this.btnSetting.x + 3;
        this.btnFullScreen.x = this.btnFullScreen.x + 3;
    },

    initChessTable: function() {
        cc.spriteFrameCache.addSpriteFrames(res.chess_common_plist, res.chess_common_img);

        var size = cc.winSize;
        this.background.setTexture(res.ChessTable);
        this.background.scaleX = size.height / this.background.getHeight();
        this.background.scaleY = size.height / this.background.getHeight();
        this.background.setPosition(cc.p(size.width / 2, size.height / 2 ));

        var self = this;
        this.background.setOnlickListenner(function(touch, event) {   // touch end event progress
            var target = event.getCurrentTarget();
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            self.touchUpHandle(locationInNode.x, locationInNode.y);
        });

        this.tableRedStatus = new BkSprite("#" + res_name.ChessRedStatus);
        this.tableRedStatus.x = cc.winSize.width / 2;
        this.tableRedStatus.y = cc.winSize.height / 2;
        this.tableRedStatus.setVisible(false);
        this.addChild(this.tableRedStatus);
    },

    touchUpHandle: function(touchX, touchY) {
        if (this.getLogic().gameStatus != GAME_STATE_PLAYING) {
            return;
        }
        if (this.colorAllowTouch < 0) {
            return;
        }
        if (this.currentColorPlaying != this.colorAllowTouch) {
            return;
        }

        var col = this.getColIndex(touchX);
        var row = this.getRowIndex(touchY);

        if (col < 0 || row < 0) {
            return;
        }

        var pieceIndex = -1;
        for (var i = 0; i < 32; i++) {
            if (this.chessPieces[i].isDead) {
                continue;
            }
            if (this.chessPieces[i].colIndex == col && this.chessPieces[i].rowIndex == row) {
                pieceIndex = i;
                break;
            }
        }
        if (pieceIndex >= 0 && this.chessPieces[pieceIndex].chessColor == this.colorAllowTouch) {
            if (pieceIndex != this.pieceSelected){
                this.unSelectPiece();
                this.selectPiece(pieceIndex);
            }
            else
                this.unSelectPiece();
            return;
        }
        if (this.pieceSelected >= 0) {
            var startCol = this.chessPieces[this.pieceSelected].colIndex;
            var finishCol = col;
            var startRow = this.chessPieces[this.pieceSelected].rowIndex;
            var finishRow = row;
            if (this.isReverse) {
                startRow = (9 - startRow);
                finishRow = (9 - finishRow);
                startCol = (8 - startCol);
                finishCol = (8 - finishCol);
            }

            // Send move piece request
            if(this.isMovablePoint(col, row))
                this.getLogic().processMovePiece(startCol, startRow, finishCol, finishRow);
        }
    },

    isMovablePoint: function(col, row){
        var i;
        for(i = 0; i < this.moveableShowSprite.length; i++){
            var movePiece = this.moveableShowSprite[i];
            if(movePiece && movePiece.x > 0){
                if(movePiece.col == col && movePiece.row == row) {
                    return true;
                }
            }
        }

        // is touch in can be taken piece
        for(i = 0; i < this.canTakenList.length; i++){
            var takePos = this.canTakenList[i];
            if(takePos[0] == col && takePos[1] == row) return true;
        }
        return false;
    },

    createChessPieces: function() {
        this.chessPieces = [];
        for (var i = 0; i < 32; i++) {
            var chessPiece = new BkChessPieceSprite(i);
            this.chessPieces.push(chessPiece);

            chessPiece.x = -100;
            chessPiece.y = -100;
            this.addChild(chessPiece, 32);
        }
    },

    initButtons: function() {

        this.reorderChild(this.btnStartGame, 36);
        this.reorderChild(this.btnReady, 36);
        this.btnStartGame.loadTextures(res_name.Chess_btn_batdau_normal, res_name.Chess_btn_batdau_pressed, res_name.Chess_btn_batdau_normal, res_name.Chess_btn_batdau_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnStartGame.setTitleText("");
        this.btnReady.loadTextures(res_name.Chess_btn_sansang_normal, res_name.Chess_btn_sansang_pressed, res_name.Chess_btn_sansang_normal, res_name.Chess_btn_sansang_hover, ccui.Widget.PLIST_TEXTURE);
        this.btnReady.setTitleText("");

        this.btnContinue = createBkButtonPlist(res_name.Chess_btn_tieptuc_normal, res_name.Chess_btn_tieptuc_pressed, res_name.Chess_btn_tieptuc_normal, res_name.Chess_btn_tieptuc_hover);
        this.btnContinue.setTitleText("");
        this.btnContinue.setPosition(-100, -100);
        this.addChild(this.btnContinue, 36);

        this.btnObserver = createBkButtonPlist(res_name.Chess_btn_ngoixuong_normal, res_name.Chess_btn_ngoixuong_pressed, res_name.Chess_btn_ngoixuong_normal, res_name.Chess_btn_ngoixuong_hover);
        this.btnObserver.setTitleText("");
        this.btnObserver.setPosition(-100, -100);
        this.addChild(this.btnObserver, 36);

        var self = this;

        this.btnBetMax = createBkButtonPlist(res_name.Chess_btn_cuoctat_normal, res_name.Chess_btn_cuoctat_pressed, res_name.Chess_btn_cuoctat_normal, res_name.Chess_btn_cuoctat_hover);
        this.btnBetMax.setTitleText("");
        this.btnBetMax.setPosition(-100, -100);
        this.addChild(this.btnBetMax, 36);
        this.btnBetMax.addClickEventListener(function () {
            self.getLogic().processBetMaxMoney(-1, self.chessRule);
        });

        this.btnSurrender = createBkButtonPlist(res_name.Chess_btn_xinthua_normal, res_name.Chess_btn_xinthua_pressed, res_name.Chess_btn_xinthua_normal, res_name.Chess_btn_xinthua_hover);
        this.btnSurrender.setTitleText("");
        this.btnSurrender.setPosition(-100, -100);
        this.btnSurrender.addClickEventListener(function() {
            var gameLogic = self.getLogic();
            var gameStatus = gameLogic.gameStatus;
            var currentPlayer = gameLogic.getMyClientState();
            if (gameStatus == GAME_STATE_PLAYING && currentPlayer.status != PLAYER_STATE_NOT_READY) {
                self.confirmSurrender();
            }
        });
        this.addChild(this.btnSurrender);

        this.btnOfferDraw = createBkButtonPlist(res_name.Chess_btn_cauhoa_normal, res_name.Chess_btn_cauhoa_pressed, res_name.Chess_btn_cauhoa_normal, res_name.Chess_btn_cauhoa_hover);
        this.btnOfferDraw.setTitleText("");
        this.btnOfferDraw.setPosition(-100, -100);
        this.btnOfferDraw.addClickEventListener(function() {
            var gameLogic = self.getLogic();
            var gameStatus = gameLogic.gameStatus;
            var currentPlayer = gameLogic.getMyClientState();
            if (gameStatus == GAME_STATE_PLAYING && currentPlayer.status != PLAYER_STATE_NOT_READY && currentPlayer.chessColor == self.currentColorPlaying) {
                self.confirmOfferDraw();
            }
            else if (gameStatus == GAME_STATE_PLAYING && currentPlayer.status != PLAYER_STATE_NOT_READY) {
                var winSize = cc.director.getWinSize();
                showToastMessage("Bạn chỉ được đề nghị hòa khi đến lượt đi", winSize.width / 2, winSize.height / 2, 3, 300);
            }
        });
        this.addChild(this.btnOfferDraw);
    },

    initSelectedSprite: function() {
        this.selectedSprite = getSpriteFromImage("#" + res_name.SelectedPiece);
        this.selectedSprite.setPosition(-100, -100);
        this.selectedSprite.scale = 0.9;
        this.addChild(this.selectedSprite);

        this.moveableShowSprite = [20];

        for (var i = 0; i < 20; i++) {
            this.moveableShowSprite[i] = getSpriteFromImage("#" + res_name.MovablePiece);
            this.moveableShowSprite[i].setPosition(-100, -100);
            this.moveableShowSprite[i].row = -1;
            this.moveableShowSprite[i].col = -1;
            this.moveableShowSprite[i].scaleX = this.background.scaleX;
            this.moveableShowSprite[i].scaleY = this.background.scaleY;
            this.addChild(this.moveableShowSprite[i]);
        }

        this.lastMoveSpriteStart = getSpriteFromImage("#" + res_name.LastMovePiece);
        this.lastMoveSpriteStart.setPosition(-100, -100);
        this.lastMoveSpriteStart.scale = 0.4;
        this.addChild(this.lastMoveSpriteStart);

        this.lastMoveSpriteFinish = getSpriteFromImage("#" + res_name.LastMovePiece);
        this.lastMoveSpriteFinish.setPosition(-100, -100);
        this.lastMoveSpriteFinish.scale = 0.95;
        this.addChild(this.lastMoveSpriteFinish);
    },

    updateTableItem: function() {
        this.hoaSprite = getSpriteFromImage("#" + res_name.HoaState);
        this.hoaSprite.setPosition(this.background.x, this.background.y);
        this.hoaSprite.setVisible(false);
        this.addChild(this.hoaSprite, 35);

        this.chieutuongSprite = getSpriteFromImage("#" + res_name.ChieuTuongState);
        this.chieutuongSprite.setPosition(this.background.x, this.background.y);
        this.chieutuongSprite.setVisible(false);
        this.addChild(this.chieutuongSprite, 35);

        this.batdauchoiSprite = getSpriteFromImage("#" + res_name.BatDauState);
        this.batdauchoiSprite.setPosition(this.background.x + 0.5, this.background.y + 0.5);
        this.batdauchoiSprite.setVisible(false);
        this.addChild(this.batdauchoiSprite, 40);
    },

    changeButtonState: function() {
        var gameLogic = this.getLogic();
        var gameStatus = gameLogic.gameStatus;
        var currentPlayer = gameLogic.getMyClientState();
        if(currentPlayer) {
        var playerRole = currentPlayer.status;
        var winSize = cc.director.getWinSize();
        switch (gameStatus) {
            case GAME_STATE_READY:
                this.hideSurrenderAndDrawButton();
                if (playerRole == PLAYER_STATE_TABLE_OWNER) {
                    this.hideChessTableButtons();
                    this.btnStartGame.setVisibleButton(true);
                    this.btnStartGame.setPosition(winSize.width / 2 - this.btnStartGame.width / 2 - 40, winSize.height / 2);
                    this.btnBetMax.setPosition(winSize.width / 2 + this.btnBetMax.width / 2 + 40, this.btnStartGame.y);
                }
                else if(playerRole == PLAYER_STATE_READY){
                    this.hideChessTableButtons();
                }
                else if (currentPlayer.tablePosition < 0) {
                    this.hideChessTableButtons();
                    if (this.canSitDown()) {
                        this.createSitDownButton();
                        this.btnObserver.setPosition(winSize.width / 2, winSize.height / 2);
                    }
                }
                else {
                    this.hideChessTableButtons();
                    this.createStandUpButton();
                    this.btnReady.setVisibleButton(true);
                    this.btnReady.setPosition(winSize.width / 2 - this.btnReady.width / 2 - 40, winSize.height / 2);
                    this.btnObserver.setPosition(winSize.width / 2 + this.btnObserver.width / 2 + 40, this.btnReady.y);
                }
                break;
            case GAME_STATE_PLAYING:
                this.hideChessTableButtons();
                this.hideSurrenderAndDrawButton();
                if (playerRole != PLAYER_STATE_NOT_READY)
                {
                    this.showSurrenderAndDrawButton();
                }
                break;
            case GAME_STATE_FINISH:
                if (currentPlayer.tablePosition < 0) {
                    if (this.canSitDown()) {
                        this.createSitDownButton();
                        this.btnObserver.setPosition(winSize.width / 2 - this.btnObserver.width / 2, winSize.height / 2);
                    }
                    else this.hideChessTableButtons();
                }
                else {
                    this.createStandUpButton();
                    this.createContinueButton();
                    this.btnContinue.setPosition(winSize.width / 2 - this.btnContinue.width / 2 - 40, winSize.height / 2);
                    this.btnObserver.setPosition(winSize.width / 2 + this.btnObserver.width / 2 + 40, this.btnContinue.y);
                }
                this.hideSurrenderAndDrawButton();
                break;
            }
        }
    },

    canSitDown: function() {
        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();
        if (currentPlayer.tablePosition >= 0) {
            return false;
        }
        var count = 0;
        for (var i = 0; i < gameLogic.maxPlayer; i++)
        {
            var player = gameLogic.PlayerState[i];
            if (player && player.tablePosition >= 0)
            {
                count++;
            }
        }

        return count < 2;
    },

    createContinueButton: function() {
        var self = this;
        this.btnContinue.addClickEventListener(function() {
            self.getLogic().processContinueGame();
        });
    },

    createStandUpButton: function() {
        var self = this;
        this.btnObserver.loadTextures(res_name.Chess_btn_dunglen_normal, res_name.Chess_btn_dunglen_pressed, res_name.Chess_btn_dunglen_normal, res_name.Chess_btn_dunglen_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnObserver.addClickEventListener(function () {
            self.getLogic().processUpdateObserverStatus(true);
        });
    },

    createSitDownButton: function() {
        var self = this;
        this.btnObserver.loadTextures(res_name.Chess_btn_ngoixuong_normal, res_name.Chess_btn_ngoixuong_pressed, res_name.Chess_btn_ngoixuong_normal, res_name.Chess_btn_ngoixuong_hover,ccui.Widget.PLIST_TEXTURE);
        this.btnObserver.addClickEventListener(function () {
            var gameLogic = self.getLogic();
            var currentPlayer = gameLogic.getMyClientState();
            if (currentPlayer.UserInfo.getMoney() < gameLogic.getTableBetMoney()) {
                showToastMessage("Bạn không đủ tiền để chơi", cc.winSize.width / 2, TOAST_MSG_YPOS, 3, 200);
            }
            else {
                gameLogic.processUpdateObserverStatus(false);
            }
        });
    },

    hideChessTableButtons: function() {
        this.btnStartGame.setPosition(-100, -100);
        this.btnReady.setPosition(-100, -100);
        this.btnBetMax.setPosition(-100, -100);
        this.btnObserver.setPosition(-100, -100);
        this.btnContinue.setPosition(-100, -100);
    },

    resetChessPieces: function() {
        for (var i = 0; i < 32; i++) {
            this.chessPieces[i].isReverseColor = this.isReverse;
            this.chessPieces[i].initByListIndex(i);
        }
    },

    removeOtherItemsFromTable: function() {
        this.unSelectPiece();
        this.hideLastMoveSprite();
    },

    hideLastMoveSprite: function() {
        this.lastMoveSpriteStart.setPosition(-100, -100);
        this.lastMoveSpriteFinish.setPosition(-100, -100);
    },

    getColIndex: function(touchX) {
        var marginX = this.background.x - this.background.width * this.background.scaleX / 2;
        for (var i = 0; i < 9; i++) {
            var x = this.getPosX(i);
            if ((touchX * this.background.scaleX + marginX > x - CHESS_WIDTH * this.background.scaleX / 2) && ((touchX * this.background.scaleX + marginX < x + CHESS_WIDTH * this.background.scaleX / 2))) {
                return i;
            }
        }
        return -1;
    },

    getRowIndex: function(touchY) {
        var marginY = this.background.y - this.background.height * this.background.scaleY / 2;
        for (var i = 0; i < 10; i++) {
            var y = this.getPosY(i);
            if (((touchY * this.background.scaleY + marginY) > (y - CHESS_HEIGHT * this.background.scaleY / 2)) && (((touchY * this.background.scaleY + marginY) < (y + CHESS_HEIGHT * this.background.scaleY / 2)))) {
                return i;
            }
        }
        return -1;
    },

    hideSurrenderAndDrawButton: function() {
        this.btnOfferDraw.setPosition(-100, -100);
        this.btnSurrender.setPosition(-100, -100);
    },

    showSurrenderAndDrawButton: function() {
        this.btnOfferDraw.setPosition(108.5, 330.5);
        this.btnSurrender.setPosition(110.5, 290.5);
    },

    selectPiece: function(index) {
        this.pieceSelected = index;
        this.selectedSprite.setPosition(
            this.getPosX(this.chessPieces[this.pieceSelected].colIndex),
            this.getPosY(this.chessPieces[this.pieceSelected].rowIndex) + 1);
        this.selectedSprite.runAction(cc.rotateBy(2, 360).repeatForever());
        this.showMovablePosition(index);
    },

    unSelectPiece: function() {
        if (this.pieceSelected < 0) return;
        this.selectedSprite.setPosition(-100, -100);
        this.selectedSprite.stopAction();
        this.hideMovablePosition();
        this.pieceSelected = -1;
    },

    showMovablePosition: function(index) {

        var board = new Array(9);
        for (var i = 0; i < 10; i++) {
            board[i] = new Array(10);
        }

        this.rebuildBoard(board);

        var piece = this.createPiece(index);

        this.canTakenList = [];

        var currentIndex = 0;
        for (var j = 0; j < 90; j++) {
            if (this.isMovablePosition(piece, index, j, board)) {
                var col = j % 9;
                var row = Math.floor(j / 9);

                if (this.isLoMatVua(piece, index, col, row, board) || this.isLoiHetCo(0, piece, index, col, row, board)) {
                    this.moveableShowSprite[currentIndex].setPosition(this.getPosX(col), this.getPosY(row));
                    this.moveableShowSprite[currentIndex].row = row;
                    this.moveableShowSprite[currentIndex].col = col;
                    this.moveableShowSprite[currentIndex].setVisible(false);
                }
                else{
                    var findCanTakePieces = false;
                    for (var tIndex = 16; tIndex < 32; tIndex++) {
                        if (!this.chessPieces[tIndex].isDead && this.chessPieces[tIndex].colIndex == col && this.chessPieces[tIndex].rowIndex == row) {
                            findCanTakePieces = true;
                            this.chessPieces[tIndex].showCanBeTakenSprite(true);
                            this.canTakenList.push([col, row]);
                            break;
                        }
                    }

                    if (!findCanTakePieces) {
                        this.moveableShowSprite[currentIndex].setPosition(this.getPosX(col), this.getPosY(row));
                        this.moveableShowSprite[currentIndex].row = row;
                        this.moveableShowSprite[currentIndex].col = col;
                        this.moveableShowSprite[currentIndex].setVisible(true);
                    }
                }

                currentIndex++;
            }
        }
    },

    rebuildBoard: function(board) {
        var i;
        for (i = 0; i < 9; i++) {
            for (var j = 0; j < 10; j++) {
                board[i][j] = -1;
            }
        }
        for (i = 0; i < 32; i++) {
            if (!this.chessPieces[i].isDead) {
                board[this.chessPieces[i].colIndex][this.chessPieces[i].rowIndex] = i;
            }
        }
    },

    createPiece: function(index) {
        var piece = new BkChessPiece(index);
        piece.chessType = this.chessPieces[index].chessType;
        piece.chessColor = this.chessPieces[index].chessColor;
        piece.colIndex = this.chessPieces[index].colIndex;
        piece.rowIndex = this.chessPieces[index].rowIndex;
        return piece;
    },

    hideMovablePosition: function() {
        for (var i = 0; i < 20; i++) {
            this.moveableShowSprite[i].setPosition(-100, -100);
            this.moveableShowSprite[i].row = -1;
            this.moveableShowSprite[i].col = -1;
        }
        for (var index = 16; index < 32; index++) {
            this.chessPieces[index].showCanBeTakenSprite(false);
        }
    },

    isMovablePosition: function(piece, index, positionCode, board) {
        if (!piece.canMoveTo(positionCode, board)) {
            return false;
        }
        //var col = positionCode % 9;
        //var row = Math.floor(positionCode / 9);
        //if (this.isLoMatVua(piece, index, col, row, board)) {
        //    return false;
        //}
        //if (this.isLoiHetCo(0, piece, index, col, row, board)){
        //    return false;
        //}
        return true;
    },

    isLoMatVua: function(piece, index, finishCol, finishRow, board) {
        var tmp = board[finishCol][finishRow];
        board[finishCol][finishRow] = index;
        board[piece.colIndex][piece.rowIndex] = -1;
        var tmpCol = piece.colIndex;
        var tmpRow = piece.rowIndex;
        piece.colIndex = finishCol;
        piece.rowIndex = finishRow;
        this.chessPieces[index].colIndex = finishCol;
        this.chessPieces[index].rowIndex = finishRow;

        var result = true;

        var vua0 = 0;
        var vua1 = 16;

        var vua0Col = this.chessPieces[vua0].colIndex;
        var vua1Col = this.chessPieces[vua1].colIndex;

        if (vua0Col != vua1Col) {
            result = false;
        }
        for (var i = this.chessPieces[vua0].rowIndex + 1; i < this.chessPieces[vua1].rowIndex; i++) {
            if ((board[vua0Col][i] >= 0)) {
                result = false;
            }
        }

        this.chessPieces[index].colIndex = tmpCol;
        this.chessPieces[index].rowIndex = tmpRow;
        piece.colIndex = tmpCol;
        piece.rowIndex = tmpRow;
        board[piece.colIndex][piece.rowIndex] = board[finishCol][finishRow];
        board[finishCol][finishRow] = tmp;

        return result;
    },

    isLoiHetCo: function(color, piece, index, finishCol, finishRow, board) {
        var result = false;

        var tmp = board[finishCol][finishRow];
        if (tmp >= 0) {
            this.chessPieces[tmp].isDead = true;
        }
        board[finishCol][finishRow] = index;
        board[piece.colIndex][piece.rowIndex] = -1;
        var tmpCol = piece.colIndex;
        var tmpRow = piece.rowIndex;
        piece.colIndex = finishCol;
        piece.rowIndex = finishRow;
        this.chessPieces[index].colIndex = finishCol;
        this.chessPieces[index].rowIndex = finishRow;

        if (this.isChieuTuong(1 - color, board)) {
            result = true;
        }

        this.chessPieces[index].colIndex = tmpCol;
        this.chessPieces[index].rowIndex = tmpRow;
        piece.colIndex = tmpCol;
        piece.rowIndex = tmpRow;
        board[piece.colIndex][piece.rowIndex] = board[finishCol][finishRow];
        if (tmp >= 0) {
            this.chessPieces[tmp].isDead = false;
        }
        board[finishCol][finishRow] = tmp;

        return result;
    },

    isChieuTuong: function(color, board) {
        var vuaDichIndex = this.getVuaListIndex(1 - color);
        var vuaDich = this.chessPieces[vuaDichIndex];

        if(vuaDich){
            var vuaPositionCode = this.encode(vuaDich.colIndex, vuaDich.rowIndex);

            for (var i = 0; i < 16; i++) {
                var pieceIndex = color * 16 + i;
                if (this.chessPieces[pieceIndex].isDead) {
                    continue;
                }
                var piece = this.createPiece(pieceIndex);
                if (piece.canMoveTo(vuaPositionCode, board)) {
                    return true;
                }
            }
        }

        return false;
    },

    encode: function(colIndex, rowIndex) {
        return rowIndex * 9 + colIndex;
    },

    getVuaListIndex: function(color) {
        return color * 16;
    },

    getPosX: function(colIndex) {
        if(colIndex < 0) return -200;
        return this.background.x + (colIndex - 4) * BOARD_CELL_WIDTH * this.background.scaleX;
    },

    getPosY: function(rowIndex) {
        if(rowIndex < 0) return -200;
        if(rowIndex > 4)
            return this.background.y + BOARD_HEIGHT_RIVER * this.background.scaleY / 2 + (rowIndex - 5) * BOARD_CELL_HEIGHT * this.background.scaleY;
        else
            return this.background.y - BOARD_HEIGHT_RIVER * this.background.scaleY / 2 + (rowIndex - 4) * BOARD_CELL_HEIGHT * this.background.scaleY;
    },

    getTakenPiecesIndex: function(finishCol, finishRow) {
        for (var i = 0; i < 32; i++) {
            if (this.chessPieces[i].isDead) {
                continue;
            }
            if (this.chessPieces[i].colIndex == finishCol && this.chessPieces[i].rowIndex == finishRow) {
                return i;
            }
        }
        return -1;
    },

    onObserverStatusChange: function(playerPosition, isObserver) {
        var gameLogic = this.getLogic();
        var player = gameLogic.getPlayer(playerPosition);
        var oldTablePosition = -1;
        if (player) oldTablePosition = player.tablePosition;

        gameLogic.updateObserverStatus(playerPosition, isObserver);
        var pAvatar = this.getAvatarByServerPos(player.serverPosition);
        if(pAvatar) pAvatar.setStatus(player.status);

        if (!isObserver) {
            oldTablePosition = gameLogic.getPlayer(playerPosition).tablePosition;
        }

        this.reposition(player, oldTablePosition, isObserver);

        this.updateMyPositionToLeftSide();

        if (gameLogic.gameStatus == GAME_STATE_FINISH) {
            this.continueGame();
        }
        else {
            this.resetChessTable();
            this.changeButtonState();
        }
    },

    reposition: function(player, oldTablePosition, isObserver) {
        if(!player) return;
        var pAvatar, ava;
        var gameLogic = this.getLogic();
        for ( var i= 0; i < this.PlayerAvatar.length; i++) {
            ava = this.PlayerAvatar[i];
            if ((ava!= null)) {
                if (ava.getPlayerName() == gameLogic.getPlayer(player.serverPosition).getName()) {
                    pAvatar = ava;
                    pAvatar.setPosition(this._getLocationPos(player.tablePosition));
                }
            }
        }

        if(isObserver) {
            if(pAvatar) {
                pAvatar.clearAllMask();
                pAvatar.clearImgReady();
                pAvatar.setPosition(-200, -200);
            }
            if(oldTablePosition == 0 && this.firstEmptyAvatar){
                this.firstEmptyAvatar.setPosition(this._getLocationPos(0));
                this.firstEmptyAvatar.setVisible(true);
            }
            if(oldTablePosition == 1 && this.secondEmptyAvatar){
                this.secondEmptyAvatar.setPosition(this._getLocationPos(1));
                this.secondEmptyAvatar.setVisible(true);
            }
        }
        else{
            if(pAvatar) {
                pAvatar.setPosition(this._getLocationPos(player.tablePosition));
            }
            else {
                pAvatar = new BkChessPlayer(player.getUserInfo(), player.status);
                pAvatar.setPosition(this._getLocationPos(player.tablePosition));
                pAvatar.setGameTable(gameLogic);
                pAvatar.setClientState(player);
                this.PlayerAvatar.push(pAvatar);
                this.addChild(pAvatar);
            }
            if(player.tablePosition == 0 && this.firstEmptyAvatar) {
                this.firstEmptyAvatar.setPosition(-200, -200);
                this.firstEmptyAvatar.setVisible(false);
            }
            if(player.tablePosition == 1 && this.secondEmptyAvatar) {
                this.secondEmptyAvatar.setPosition(-200, -200);
                this.secondEmptyAvatar.setVisible(false);
            }
        }
    },

    resetPositionOfChessPieces: function() {
        for (var i = 0; i < 32; i++) {
            var chessPiece = this.chessPieces[i];
            if(chessPiece.isDead){
                chessPiece.x = -100;
                chessPiece.y = -100;
            }
            else{
                chessPiece.scale = 0.8;
                chessPiece.setOpacity(255);
                chessPiece.x = this.getPosX(chessPiece.colIndex);
                chessPiece.y = this.getPosY(chessPiece.rowIndex);
                chessPiece.setEnableEventHover(false);
            }
        }
    },

    onContinueGame: function() {
        this.continueGame();
    },

    onPlayerStatusUpdate:function(serverPosition, status)
    {
        var pAvatar = this.getAvatarByServerPos(serverPosition);
        if (pAvatar == null) {
            return;
        }

        pAvatar.setStatus(status);

        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();
        if(currentPlayer == null)
        {
            return;
        }
        if(!gameLogic.isInGameProgress()) {
            this.showStartGameButton(false);
            if (currentPlayer.serverPosition == serverPosition) {
                this.changeButtonState();
                if(currentPlayer.status == PLAYER_STATE_READY){
                    this.resetChessTable();
                }
            }
        }
    },

    resetChessTable: function(){
        this.removeOtherItemsFromTable();
        this.chessPieces[0].showCanBeTakenSprite(false);
        this.chessPieces[16].showCanBeTakenSprite(false);
        this.resetChessPieces();
        this.resetPositionOfChessPieces();
    },

    showStartGameButton:function(reShowCountDown)
    {
        var gameLogic = this.getLogic();
        if(gameLogic.isInGameProgress())
        {
            return;
        }

        var currentPlayer = gameLogic.getMyClientState();

        if(currentPlayer && currentPlayer.isObserver === false)
        {
            var needReShowCD = true;
            if (reShowCountDown != undefined){
                needReShowCD = reShowCountDown;
            }
            if (needReShowCD){
                gameLogic.showCountDownForMe();
            }
        }

        if(this.getLogic().isMeBossTable())
        {
            this.btnStartGame.setVisibleButton(true);
        }
        else
        {
            var myClientState = this.getLogic().getMyClientState();
            if (myClientState!= null) {
                if (myClientState.status != PLAYER_STATE_READY) {
                    this.btnReady.setVisibleButton(true);
                }
            } else {
                this.btnReady.setVisibleButton(true);
            }
        }
    },

    onUpdatePlayerLevel:function(serverPos,userDT)
    {
        if (this.PlayerAvatar == null)
        {
            return;
        }
        var pAvatar = this.getAvatarByServerPos(serverPos);
        if(pAvatar) pAvatar.setPlayerdata(userDT);
    },

    UpdatePlayerMoney:function(player,amount,reason)
    {
        if(reason == undefined)
        {
            reason = "";
        }

        var pAvatar = this.getAvatarByServerPos(player.serverPosition);

        if (pAvatar) {
            pAvatar.updateMoney(player.getCurrentCash());
            this.showAnimationUpdateMoney(amount,reason,pAvatar);
        }
    },

    updateMyPositionToLeftSide: function() {
        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();
        var pAvatar;
        if (currentPlayer && currentPlayer.tablePosition == 1) {
            for (var i = 0; i < gameLogic.maxPlayer; i++) {
                var player = gameLogic.getPlayerByIndex(i);
                if (!player) {
                    continue;
                }
                if (player.tablePosition == 0) {
                    player.tablePosition = 1;
                    pAvatar = this.getAvatarByServerPos(player.serverPosition);
                    if(pAvatar) {
                        if(this.secondEmptyAvatar) {
                            this.secondEmptyAvatar.setPosition(-200, -200);
                            this.secondEmptyAvatar.setVisible(false);
                        }
                        pAvatar.setPosition(this._getLocationPos(player.tablePosition));
                    }
                    break;
                }
            }

            currentPlayer.tablePosition = 0;
            pAvatar = this.getAvatarByServerPos(currentPlayer.serverPosition);
            if(pAvatar) pAvatar.setPosition(this._getLocationPos(currentPlayer.tablePosition));
        }

        if(currentPlayer && currentPlayer.isObserver === true){
            this.removeCountDownText();
        }
        else {
            if(gameLogic.isMeBossTable())
            {
                this.showCountDownForMe(TIME_AUTO_START_GAME -1);
            }else
            {
                this.showCountDownForMe(TIME_AUTO_READY -1);
            }
        }
    },

    onDealCard: function(firstPosition, lastPosition) {
        this.hideStartGameButton();

        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();

        if (currentPlayer && currentPlayer.status == PLAYER_STATE_NOT_READY) {
            this.continueGame();
        }

        playChieuTuongSound();

        this.batdauchoiSprite.setOpacity(255);
        this.batdauchoiSprite.setVisible(true);
        var sequence = cc.sequence(cc.delayTime(2), cc.fadeOut(0.1));
        this.batdauchoiSprite.runAction(sequence);

        this.setTimeForAllPlayers();

        this.updateGameStateAtBeginning(firstPosition, lastPosition);
        gameLogic.updateGameStatus(GAME_STATE_PLAYING);

        if (currentPlayer.serverPosition == firstPosition) {
            showToastMessage("Đến lượt bạn", cc.winSize.width / 2, TOAST_MSG_YPOS, 2, 200);
        }

        this.startTimer(this.oneTurnChessTime);
        this.changeButtonState();
        this.clearAllMaskOfPlayers();
        this.clearPlayerReadyMark();
        this.removeCountDownText();
        if (currentPlayer && currentPlayer.isObserver === false){
            for (var i = 0; i < 32; i++) {
                var chessPiece = this.chessPieces[i];
                if(!chessPiece.isDead && chessPiece.chessColor == currentPlayer.chessColor){
                    chessPiece.setEnableEventHover(true);
                }
            }
            this.startGoldBox();
        }
        else this.stopGoldBox();
    },

    clearAllMaskOfPlayers:function()
    {
        if(this.PlayerAvatar == null)
        {
            return;
        }
        for(var i = 0; i < this.PlayerAvatar.length; i++)
        {
            var pAvatar = this.PlayerAvatar[i];
            if(pAvatar){
                pAvatar.clearImgReady();
                pAvatar.clearAllMask();
            }
        }
    },

    OnGameTableSyn: function(packet) {
        this._super();
        this.defaultChessTime = packet.Buffer.readInt();
        this.oneTurnChessTime = packet.Buffer.readInt();
        this.setTimeForAllPlayers();
        this.showViewer();

    },
    showViewer:function()
    {
        if(this.getLogic().PlayerState.length > 2)
        {
            if(this.viewer == undefined || this.viewer == null)
            {
                this.viewer = new BkSprite("#" + res_name.viewer);
                this.viewer.x = 886;
                this.viewer.y = 523;
                this.addChild(this.viewer);
            }
            if(this.txtNumOfView == null)
            {
                var textcolor = cc.color(243, 245, 245);
                this.txtNumOfView = new BkLabel(this.getLogic().PlayerState.length -2, "", 15, true);
                this.txtNumOfView.setTextColor(textcolor);
                this.txtNumOfView.x = 913;
                this.txtNumOfView.y = 523;
                this.addChild(this.txtNumOfView);
            }else
            {
                this.txtNumOfView.setString(this.getLogic().PlayerState.length -2);
            }

        }else
        {
            if(this.viewer != null)
            {
                this.viewer.removeFromParent();
                this.viewer = null;
            }
            if(this.txtNumOfView != null)
            {
                this.txtNumOfView.removeFromParent();
                this.txtNumOfView = null;
            }
        }
    },
    startTimer: function(oneTurnTime) {
        this.cancelTimer();
        var gameLogic = this.getLogic();
        for (var i = 0; i < gameLogic.PlayerState.length; i++) {
            var player = gameLogic.getPlayerByIndex(i);
            if (player && player.status != PLAYER_STATE_NOT_READY && player.chessColor == this.currentColorPlaying) {
                var pAvatar = this.getAvatarByServerPos(player.serverPosition);
                if(pAvatar) {
                    player.showTotalCountDownTime();
                    pAvatar.showCountDownTime(oneTurnTime);
                }
                continue;
            }

            if (player && player.status != PLAYER_STATE_NOT_READY && player.chessColor != this.currentColorPlaying) {
                player.stopTotalCountDownTime();
            }
        }
    },

    cancelTimer: function(hideRemainTimer) {
        this.tableRedStatus.setVisible(false);
        var gameLogic = this.getLogic();
        for (var i = 0; i < gameLogic.maxPlayer; i++) {
            var player = gameLogic.getPlayerByIndex(i);
            if (player) {
                if(hideRemainTimer){
                    player.king.setVisible(false);
                    player.remainTimeText.setVisible(false);
                }
                if(player.status != PLAYER_STATE_NOT_READY){
                    var tempAvatar = this.getAvatarByServerPos(player.serverPosition);
                    if (tempAvatar!= null) {
                        tempAvatar.stopCountDown();
                        if(tempAvatar.alarmEndTimeSprite){
                            tempAvatar.alarmEndTimeSprite.setOpacity(0);
                            tempAvatar.alarmEndTimeSprite.setVisible(false);
                        }
                    }
                }
            }
        }
    },

    continueGame: function() {
        var gameLogic = this.getLogic();

        // remove all player avatars - masks & invisible king
        var pAvatar, player;
        for ( var i= 0; i < gameLogic.PlayerState.length; i++) {
            player = gameLogic.getPlayerByIndex(i);
            if(player){
                pAvatar = this.getAvatarByServerPos(player.serverPosition);
                if ((pAvatar && player.tablePosition > 0)) {
                    pAvatar.clearAllMask();
                    pAvatar.clearImgReady();
                    pAvatar.clearWinSplash();
                    player.king.setVisible(false);
                }
            }
        }

        // init game logic
        gameLogic.gameStatus = GAME_STATE_READY;

        this.changeButtonState();
        this.resetChessTable();
    },

    setTimeForAllPlayers: function() {
        var gameLogic = this.getLogic();
        for (var i = 0; i < gameLogic.maxPlayer; i++) {
            var player = gameLogic.PlayerState[i];
            if(player) player.setRemainTime(this.defaultChessTime);
        }
    },

    updateGameStateAtBeginning: function(firstPosition, lastPosition) {
        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();

        if (currentPlayer && currentPlayer.status != PLAYER_STATE_NOT_READY) {
            this.colorAllowTouch = 0;
        }
        else {
            this.colorAllowTouch = -1;
        }

        this.isReverse = (currentPlayer.serverPosition == lastPosition);

        this.firstPlayPosition = firstPosition;
        this.lastPlayPosition = lastPosition;

        this.setKingColor(firstPosition, 0);
        this.setKingColor(lastPosition, 1);

        var firstPlayer = gameLogic.getPlayer(firstPosition);
        if(firstPlayer) firstPlayer.isPlaying = true;
        var lastPlayer = gameLogic.getPlayer(lastPosition);
        if(lastPlayer) lastPlayer.isPlaying = true;

        if (!this.isReverse) {
            firstPlayer.chessColor = 0;
            lastPlayer.chessColor = 1;
            this.currentColorPlaying = 0;
        }
        else {
            firstPlayer.chessColor = 1;
            lastPlayer.chessColor = 0;
            this.currentColorPlaying = 1;
        }

        if(firstPlayer.chessColor != firstPlayer.tablePosition){
            firstPlayer.tablePosition = firstPlayer.chessColor;
            lastPlayer.tablePosition = lastPlayer.chessColor;
            // set Avatar's position for players
            var firstAvatar = this.getAvatarByServerPos(firstPosition);
            if(firstAvatar) firstAvatar.setPosition(this._getLocationPos(firstPlayer.tablePosition));

            var secondAvatar = this.getAvatarByServerPos(lastPosition);
            if(secondAvatar) secondAvatar.setPosition(this._getLocationPos(lastPlayer.tablePosition));
        }

        this.resetChessPieces();
        this.resetPositionOfChessPieces();
    },

    setKingColor: function(iPos, chessColor) {
        var gameLogic = this.getLogic();
        var player = gameLogic.getPlayer(iPos);
        if(player){
            player.king.removeFromParent();
            player.king = getSpriteFromImage(chessColor == 0? "#" + res_name.TimeBoxRed : "#" + res_name.TimeBoxBlack);
            player.king.setVisible(true);

            var pAvatar = this.getAvatarByServerPos(iPos);
            var xPos = 75;
            var yPos = 21.5;
            player.king.setPosition(xPos, yPos);
            if(pAvatar) {
                pAvatar.addChild(player.king);
            }

            // set remain time
            player.setRemainTime(player.remainTime);
            xPos = 69.5 + player.remainTimeText.getContentSize().width / 2;
            var isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
            yPos = isFirefox === true? yPos: yPos + 0.5;
            player.remainTimeText.setPosition(xPos, yPos);
            player.remainTimeText.removeFromParent();
            if(pAvatar) pAvatar.addChild(player.remainTimeText);
        }
    },

    onMove: function(startCol, startRow, finishCol, finishRow, remainTime) {
        this.chessPieces[0].showCanBeTakenSprite(false);
        this.chessPieces[16].showCanBeTakenSprite(false);
        var colorTmp = this.colorAllowTouch;
        this.colorAllowTouch = -1;

        this.cancelTimer();
        var i;
        var gameLogic = this.getLogic();
        for (i = 0; i < gameLogic.maxPlayer; i++) {
            var player = gameLogic.getPlayerByIndex(i);
            if (player && player.status != PLAYER_STATE_NOT_READY && player.chessColor == this.currentColorPlaying) {
                player.setRemainTime(remainTime);
                break;
            }
        }

        if (this.isReverse) {
            startRow = 9 - startRow;
            finishRow = 9 - finishRow;
            startCol = 8 - startCol;
            finishCol = 8 - finishCol;
        }

        var takenPieceIndex = this.getTakenPiecesIndex(finishCol, finishRow);
        if (takenPieceIndex >= 0) {
            this.chessPieces[takenPieceIndex].isDead = true;
        }

        for (i = 0; i < 32; i++) {
            if (this.chessPieces[i].isDead) {
                continue;
            }
            if (this.chessPieces[i].colIndex == startCol && this.chessPieces[i].rowIndex == startRow) {
                this.pieceSelected = i;
                break;
            }
        }

        this.lastMoveSpriteStart.setPosition(this.getPosX(startCol), this.getPosY(startRow));
        this.lastMoveSpriteFinish.setPosition(this.getPosX(finishCol), this.getPosY(finishRow));

        var selectedPiece = this.chessPieces[this.pieceSelected];

        if(selectedPiece) {
            this.reorderChild(selectedPiece, 33);

            selectedPiece.colIndex = finishCol;
            selectedPiece.rowIndex = finishRow;
            var callback = cc.callFunc(this.animationFinish, this);
            var move = cc.moveTo(0.2, this.getPosX(finishCol), this.getPosY(finishRow));
            var sequence = cc.sequence(move, callback);
            selectedPiece.runAction(sequence);
        }
        this.unSelectPiece();

        var board = new Array(9);
        for (i = 0; i < 10; i++) {
            board[i] = new Array(10);
        }

        this.rebuildBoard(board);

        if (!this.isChieuTuong(this.currentColorPlaying, board)) {
            if (takenPieceIndex < 0) {
                playCoDiChuyenSound();
            }
            else {
                playCoAnQuanSound();
            }
        }
        if(takenPieceIndex < 0) {

        }
        else if(takenPieceIndex >= 0 && takenPieceIndex < 32) this.animateTakePiece(takenPieceIndex);

        this.currentColorPlaying = 1 - this.currentColorPlaying;

        this.startTimer(this.oneTurnChessTime);

        this.colorAllowTouch = colorTmp;
    },

    animationFinish:function() {
        this.getLogic().processNextEventInQueue();
    },

    animateTakePiece: function(index) {
        if (index < 0) {
            return;
        }

        this.chessPieces[index].isDead = true;
        var gameLogic = this.getLogic();
        var player;
        for (var i = 0; i < gameLogic.maxPlayer; i++) {
            player = gameLogic.getPlayerByIndex(i);
            if (player && player.status != PLAYER_STATE_NOT_READY && player.chessColor == this.currentColorPlaying) {
                this.moveTakenPiece(this.chessPieces[index],this._getLocationPos(player.tablePosition).x,this._getLocationPos(player.tablePosition).y);
                break;
            }
        }
    },

    moveTakenPiece: function(piece, x, y) {
        var callback = cc.callFunc(function() {
            piece.setPosition(-100, -100);
        }, this);
        var move = cc.moveTo(0.5, x, y);
        var sequence = cc.sequence(move, callback);
        piece.runAction(sequence);
    },

    onInforReturn: function(code, position) {
        if (code == CHIEU_HET) {
            return;
        }

        var player = this.getLogic().getPlayer(position);

        if(player == null) return;

        if (code == CHIEU) {
            playChieuTuongSound();

            if(this.chessPieces[0].chessColor == player.chessColor){
                this.chessPieces[16].showCanBeTakenSprite(true);
            }
            else{
                this.chessPieces[0].showCanBeTakenSprite(true);
            }

            this.chieutuongSprite.setOpacity(255);
            this.chieutuongSprite.setVisible(true);
            this.chieutuongSprite.runAction(cc.fadeOut(2));
            return;
        }

        var msg = getChessInfoDescription(code);
        if (code == HET_GIO || code == DAU_HANG) {
            msg = player.UserInfo.getUserName() + msg;
            showToastMessage(msg, cc.winSize.width / 2, TOAST_MSG_YPOS, 3, 250);
            return;
        }

        showToastMessage(msg, cc.winSize.width / 2, cc.winSize.height / 2, 3, 250);
    },

    onFinishGame: function(winnerPosition) {
        var gameLogic = this.getLogic();

        if (winnerPosition < 0) {
            this.hoaSprite.setOpacity(255);
            this.hoaSprite.setVisible(true);
            this.hoaSprite.runAction(cc.fadeOut(3));
        }

        if (winnerPosition >= 0) {
            this.updatePlayerMoneyWhenFinishGame(winnerPosition);
            this.getAvatarByServerPos(winnerPosition).showWinSplash();

            var currentPlayer = gameLogic.getMyClientState();
            if(currentPlayer == null)
            {
                return;
            }
            if (winnerPosition == currentPlayer.serverPosition) {
                playCoThangSound();
            }
            else if (currentPlayer.status != PLAYER_STATE_NOT_READY) {
                playCoThuaSound();
            }
        }

        gameLogic.updateGameStatus(GAME_STATE_FINISH);
        this.stopGoldBox();
        this.cancelTimer(true);
        this.changeButtonState();
        this.hideLastMoveSprite();
        this.unSelectPiece();
        this.hideMovablePosition();
    },

    updatePlayerMoneyWhenFinishGame: function(winnerPosition) {
        if (winnerPosition < 0) {
            return;
        }

        var gameLogic = this.getLogic();
        for (var i = 0; i < gameLogic.maxPlayer; i++) {
            var player = gameLogic.getPlayerByIndex(i);
            if (player && player.status != PLAYER_STATE_NOT_READY && player.serverPosition != winnerPosition) {
                var cashChange = Math.min(gameLogic.getTableBetMoney(), player.UserInfo.playerMoney);
                var cashWin = Math.floor(cashChange * (1 - TAX_RATE));
                gameLogic.increaseCash(player, -cashChange);
                var winPlayer = gameLogic.getPlayer(winnerPosition);
                gameLogic.increaseCash(winPlayer, cashWin);
                break;
            }
        }
    },

    onOfferReturn: function(offer) {
        switch (offer) {
            case CHESS_DRAW_REQUEST:
                this.offerDraw();
                break;
            case CHESS_DRAW_ACCEPT:
                this.onDrawAccept();
                break;
            case CHESS_DRAW_REFUSE:
                this.onDrawRefuse();
                break;
        }
    },

    confirmOfferDraw: function() {
        var self = this;
        var str = "Bạn chắc chắn muốn\nđề nghị hòa không?";
        showPopupConfirmWith(str,"",function() {
            self.getLogic().processChessOfferDraw(CHESS_DRAW_REQUEST);
        });
    },

    offerDraw: function() {
        var self = this;
        var str = "Đối phương muốn hòa.\n Bạn có đồng ý không?";
        showPopupConfirmWith(str,"",function() {
            self.getLogic().processChessOfferDraw(CHESS_DRAW_ACCEPT);
        }, function() {
            self.getLogic().processChessOfferDraw(CHESS_DRAW_REFUSE);
        });
    },

    onDrawAccept: function() {
        showToastMessage("Hai đối thủ đã bắt tay nhau đồng ý hòa", cc.winSize.width / 2, TOAST_MSG_YPOS, 3, 300);
    },

    onDrawRefuse: function() {
        showToastMessage("Đối phương đã từ chối hòa", cc.winSize.width / 2, cc.winSize.height / 2, 3, 200);
    },

    confirmSurrender: function() {
        var self = this;
        var str = "Bạn chắc chắn muốn chịu thua ?";
        showPopupConfirmWith(str,"",function() {
            self.getLogic().processChessOfferDraw(CHESS_SURRENDER);
        });
    },

    onTableInfoReturn:function()
    {
        this._super();
        this.updateMyPositionToLeftSide();
    },

    onTableLeavePush: function(player) {
        var pAvatar = this.getAvatarByServerPos(player.serverPosition);
        if(pAvatar) {
            pAvatar.removeFromParent();
            if (player.tablePosition == 0) {
                this.firstEmptyAvatar.setPosition(this._getLocationPos(0));
                this.firstEmptyAvatar.setVisible(true);
            }
            else if(player.tablePosition == 1) {
                this.secondEmptyAvatar.setPosition(this._getLocationPos(1));
                this.secondEmptyAvatar.setVisible(true);
            }
        }
    },

    /* override function of base layer */
    removePlayerAvatar:function() {
        this.changeButtonState();
        this.showViewer();
    },

    onTableJoin:function(player, displayPos){
        if(player && player.isObserver === false){
            this.displayPlayerAvatar();
            this.changeButtonState();
        }
        this.showViewer();
    },

    /* override function of base layer */
    displayPlayerAvatar:function() {
        if(!this.firstEmptyAvatar) this.initEmptyAvatars();
        this.hideEmptyAvatars();
        var gameLogic = this.getLogic();
        if (this.PlayerAvatar != null && this.PlayerAvatar.length > 0) {
            this.clearAllAvatar();
        }
        var player;
        var activePositionNumber = 0;
        var activePosition;

        for (var i = 0; i < gameLogic.PlayerState.length; i++) {
            player = gameLogic.getPlayerByIndex(i);
            if (player){
                if(gameLogic.gameStatus == GAME_STATE_READY) {
                    player.setRemainTime(this.defaultChessTime);
                }
                if(player && player.isObserver === false) {
                    if(player.tablePosition == -1) player.tablePosition = gameLogic.findTablePosition();

                    activePositionNumber ++;
                    activePosition = player.tablePosition;

                    var pAvatar = new BkChessPlayer(player.getUserInfo(), player.status);
                    pAvatar.setPosition(this._getLocationPos(player.tablePosition));
                    pAvatar.setGameTable(gameLogic);
                    pAvatar.setClientState(player);
                    //pAvatar.clearAllMask();
                    this.PlayerAvatar.push(pAvatar);
                    if(gameLogic.gameStatus == GAME_STATE_PLAYING){
                        pAvatar.clearImgReady();
                        this.setKingColor(player.serverPosition, player.chessColor);
                    }
                    this.addChild(pAvatar);
                }
                else player.tablePosition = -1;
            }
        }

        if(gameLogic.gameStatus == GAME_STATE_PLAYING) this.startTimer(this.oneTurnChessTime);

        if(activePositionNumber < 2) {
            if(1 - activePosition == 0 && this.firstEmptyAvatar || activePositionNumber == 0) {
                this.firstEmptyAvatar.setPosition(this._getLocationPos(0));
                this.firstEmptyAvatar.setVisible(true);
            }
            if(1 - activePosition == 1 && this.secondEmptyAvatar || activePositionNumber == 0) {
                this.secondEmptyAvatar.setPosition(this._getLocationPos(1));
                this.secondEmptyAvatar.setVisible(true);
            }
        }
    },

    initEmptyAvatars: function(){
        var gameLogic = this.getLogic();
        this.firstEmptyAvatar = new BkChessPlayer(null,-1);
        this.firstEmptyAvatar.setPosition(-200, -200);
        this.firstEmptyAvatar.setGameTable(gameLogic);
        this.firstEmptyAvatar.setVisible(false);
        this.addChild(this.firstEmptyAvatar);

        this.secondEmptyAvatar = new BkChessPlayer(null,-1);
        this.secondEmptyAvatar.setPosition(-200, -200);
        this.secondEmptyAvatar.setGameTable(gameLogic);
        this.secondEmptyAvatar.setVisible(false);
        this.addChild(this.secondEmptyAvatar);
    },

    hideEmptyAvatars: function(){
        this.firstEmptyAvatar.setPosition(-200, -200);
        this.secondEmptyAvatar.setPosition(-200, -200);
        this.firstEmptyAvatar.setVisible(false);
        this.secondEmptyAvatar.setVisible(false);
    },

    _getLocationPos:function(tablePosition) {
        var winSize = cc.winSize;
        var xPos = PLAYER_AVAR_MARGIN_LF;
        var yPos = winSize.height - PLAYER_AVAR_MARGIN_TP;
        if (tablePosition == 0) {
            xPos = PLAYER_AVAR_MARGIN_LF;
        } else if(tablePosition == 1) {
            xPos = winSize.width - PLAYER_AVAR_MARGIN_RIGHT;
        }

        return cc.p(xPos,yPos);
    },

    showCountDownForMe:function(xSec)
    {
        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();
        if(currentPlayer && currentPlayer.isObserver === true)
        {
            return;
        }

        this._super(xSec);
        if (this.countdownText != null) {
            this.countdownText.y = cc.winSize.height / 2 - 5;
        }
    }
});
