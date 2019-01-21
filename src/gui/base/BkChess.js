/**
 * Created by VanChinh on 11/10/2015.
 */

TYPE_VALUE = [ 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6 ];
COL_VALUE = [ 4, 3, 5, 2, 6, 0, 8, 1, 7, 1, 7, 0, 2, 4, 6, 8 ];
ROW_VALUE = [ 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 3, 3, 3, 3, 3 ];

LO_MAT_VUA = 0;
LOI_HET_CO = 1;
CHIEU = 2;
CHIEU_HET = 3;
LAP_3_LAN = 4;
HET_GIO = 5;
DAU_HANG = 6;

TAG_AN_QUAN = 0;

BkChessType = {
    VUA: 0,         // Tướng
    SI: 1,          // Si
    TUONG: 2,       // Tượng
    XE: 3,          // Xe
    PHAO: 4,        // Pháo
    MA: 5,          // Mã
    TOT: 6          // Tốt
};

function getChessInfoDescription(code) {
    switch (code) {
        case LO_MAT_VUA:
            return "Lỗi lộ mặt tướng";
            break;
        case LOI_HET_CO:
            return "Lỗi mất tướng";
            break;
        case CHIEU:
            return "Chiếu tướng";
            break;
        case LAP_3_LAN:
            return "Lỗi đi lặp 3 lần";
            break;
        case HET_GIO:
            return " hết thời gian";
            break;
        case DAU_HANG:
            return " đầu hàng";
            break;
        case CHIEU_HET:
            return "Chiếu hết";
            break;
        default:
            return "Lỗi không xác định";
            break;
    }
}

BkChessPiece = cc.Class.extend({
    rowIndex: null,
    colIndex: null,
    chessColor: 0,
    chessType: 0,
    isDead: null,

    ctor: function(listIndex){
        this.chessType = TYPE_VALUE[listIndex % 16];
        this.color = (listIndex / 16);

        if (listIndex < 16) {
            this.colIndex = COL_VALUE[listIndex % 16];
            this.rowIndex = ROW_VALUE[listIndex % 16];
        }
        else {
            this.colIndex = 8 - COL_VALUE[listIndex % 16];
            this.rowIndex = 9 - ROW_VALUE[listIndex % 16];
        }
        this.isDead = false;
    },

    getRowIndex: function(positionCode) {
        return Math.floor(positionCode / 9);
    },

    getColIndex: function(positionCode) {
        return positionCode % 9;
    },

    outOfBoard: function(positionCode) {
        return (positionCode < 0) || (positionCode > 89);
    },

    isInsideCastle: function(colIndex, rowIndex, color) {
        var CASTLE_ROW = [0, 0, 0, 1, 1, 1, 2, 2, 2, 9, 9, 9, 8, 8, 8, 7, 7, 7];
        var CASTLE_COL = [3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5];

        for (var i = 0; i < 9; i++) {
            if (colIndex == CASTLE_COL[i + color * 9] && rowIndex == CASTLE_ROW[i + color * 9]) {
                return true;
            }
        }
        return false;
    },

    isInsideRiver: function(rowIndex, color) {
        if (color == 0) {
            return rowIndex <= 4;
        }
        return rowIndex >= 5;
    },

    isAcceptablePosition: function(colIndex, rowIndex) {
        if (this.chessType == BkChessType.VUA || this.chessType == BkChessType.SI) {
            return this.isInsideCastle(colIndex, rowIndex, this.chessColor);
        }
        if (this.chessType == BkChessType.TUONG) {
            return this.isInsideRiver(rowIndex, this.chessColor);
        }
        return true;
    },

    isVuaValidMove: function(startCol, startRow, deskCol, deskRow) {
        if (startCol == deskCol) {
            return Math.abs(startRow - deskRow) == 1;
        }
        if (startRow == deskRow) {
            return Math.abs(startCol - deskCol) == 1;
        }
        return false;
    },

    isSiValidMove: function(startCol, startRow, deskCol, deskRow) {
        return Math.abs((startCol - deskCol) * (startRow - deskRow)) == 1;
    },

    isTuongValidMove: function(startCol, startRow, deskCol, deskRow, board) {
        var validPosition = (Math.abs(startRow - deskRow) == 2) && (Math.abs(startCol - deskCol) == 2);
        if (validPosition) {
            var centerCol = (startCol + deskCol) / 2;
            var centerRow = (startRow + deskRow) / 2;
            if (board[centerCol][centerRow] < 0) {
                return true;
            }
        }
        return false;
    },

    isXeValidMove: function(startCol, startRow, deskCol, deskRow, board) {
        var startIndex = 0;
        var deskIndex = 0;
        var i = 0;
        if (startCol == deskCol) {
            startIndex = Math.min(startRow, deskRow) + 1;
            deskIndex = Math.max(startRow, deskRow) - 1;
            for (i = startIndex; i <= deskIndex; i++) {
                if (board[startCol][i] >= 0) {
                    return false;
                }
            }
            return true;
        }
        if (startRow == deskRow) {
            startIndex = Math.min(startCol, deskCol) + 1;
            deskIndex = Math.max(startCol, deskCol) - 1;
            for (i = startIndex; i <= deskIndex; i++) {
                if (board[i][startRow] >= 0) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    isPhaoValidMove: function(startCol, startRow, deskCol, deskRow, board) {
        if (board[deskCol][deskRow] < 0) {
            return this.isXeValidMove(startCol, startRow, deskCol, deskRow, board);
        }

        var i = 0;
        var startIndex = 0;
        var deskIndex = 0;
        var count = 0;

        if (startCol == deskCol) {
            startIndex = Math.min(startRow, deskRow) + 1;
            deskIndex = Math.max(startRow, deskRow) - 1;
            for (i = startIndex; i <= deskIndex; i++) {
                if (board[startCol][i] >= 0) {
                    count++;
                }
            }
            return count == 1;
        }
        if (startRow == deskRow) {
            startIndex = Math.min(startCol, deskCol) + 1;
            deskIndex = Math.max(startCol, deskCol) - 1;
            count = 0;
            for (i = startIndex; i <= deskIndex; i++) {
                if (board[i][startRow] >= 0) {
                    count++;
                }
            }
            return count == 1;
        }
        return false;
    },

    isMaValidMove: function(startCol, startRow, deskCol, deskRow, board) {
        var  COL_DIFF = [-1, 1, 2, 2, 1, -1, -2, -2];
        var  ROW_DIFF = [2, 2, 1, -1, -2, -2, -1, 1];

        var  COL_BLOCK = [0, 0, 1, 1, 0, 0, -1, -1];
        var  ROW_BLOCK = [1, 1, 0, 0, -1, -1, 0, 0];

        for (var i = 0; i < COL_DIFF.length; i++) {
            if ((deskCol - startCol == COL_DIFF[i]) && (deskRow - startRow == ROW_DIFF[i])) {
                if (board[startCol + COL_BLOCK[i]][startRow + ROW_BLOCK[i]] < 0) {
                    return true;
                }
                break;
            }
        }

        return false;
    },

    isTotValidMove: function(startCol, startRow, deskCol, deskRow, color) {
        if (color == 0) {
            if ((startCol == deskCol) && (startRow + 1 == deskRow)) {
                return true;
            }
            if (startRow >= 5) {
                if ((startRow == deskRow) && (Math.abs(startCol - deskCol) == 1)) {
                    return true;
                }
            }
        }
        else {
            if ((startCol == deskCol) && (startRow - 1 == deskRow)) {
                return true;
            }
            if (startRow <= 4) {
                if ((startRow == deskRow) && (Math.abs(startCol - deskCol) == 1)) {
                    return true;
                }
            }
        }
        return false;
    },

    canMoveTo: function(positionCode, board) {
        if (this.outOfBoard(positionCode)) {
            return false;
        }

        var deskColIndex = this.getColIndex(positionCode);
        var deskRowIndex = this.getRowIndex(positionCode);

        if (deskColIndex == this.colIndex && deskRowIndex == this.rowIndex) {
            return false;
        }
        if (!this.isAcceptablePosition(deskColIndex, deskRowIndex)) {
            return false;
        }

        var hasSameColorPiece = false;
        if (board[deskColIndex][deskRowIndex] >= 0) {
            var deskColor = Math.floor(board[deskColIndex][deskRowIndex] / 16);
            hasSameColorPiece = (deskColor == this.chessColor);
        }
        if (hasSameColorPiece) {
            return false;
        }
        switch (this.chessType) {
            case BkChessType.VUA:
                return this.isVuaValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex);
                break;
            case BkChessType.SI:
                return this.isSiValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex);
                break;
            case BkChessType.TUONG:
                return this.isTuongValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex, board);
                break;
            case BkChessType.XE:
                return this.isXeValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex, board);
                break;
            case BkChessType.PHAO:
                return this.isPhaoValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex, board);
                break;
            case BkChessType.MA:
                return this.isMaValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex, board);
                break;
            case BkChessType.TOT:
                return this.isTotValidMove(this.colIndex, this.rowIndex, deskColIndex, deskRowIndex, this.chessColor);
                break;
            default:
                break;
        }
    
        return false;
    }
});

BkCoUpPiece = BkChessPiece.extend({
    isFaceUp: null,
    realType: null,

    ctor: function(listIndex){
        this._super(listIndex);
        this.isFaceUp = this.chessType == BkChessType.VUA;
    },

    /* Override function of base class */
    isAcceptablePosition: function(colIndex, rowIndex) {
        if (!this.isFaceUp || this.chessType == BkChessType.VUA) {
            return this._super(colIndex, rowIndex);
        }
        return true;
    }
});

var CHESS_WIDTH = 58;
var CHESS_HEIGHT = 58;
var TYPE_BITMAP = [4, 3, 2, 0, 6, 1, 5];
var FACE_UP = 1;
var FACE_DOWN = 0;
var MAX_TAKEN_PIECE_SHOW = 8;

BkChessPieceSprite = BkSprite.extend({
    index: null,
    chessType: null,
    chessColor: null,
    rowIndex: null,
    colIndex: null,
    isDead: null,
    faceState: FACE_UP,
    isReverseColor: false,
    currentTiledRow: null,
    currentTiledCol: null,
    canBeTakenSprite: null,
    isSelected: false,
    isAnimation: false,
    isMoveAnimationScheduled: false,

    ctor: function(listIndex){
        this._super(res.ChessPieces);
        this.index = listIndex;
        this.initByListIndex(listIndex);
        this.initEventHover();

        if(listIndex == 0 || listIndex == 16){
            this.canBeTakenSprite = new BkSprite("#" + res_name.ChieuTuongPiece);
            this.canBeTakenSprite.x = this.width / 2 - 1;
            this.canBeTakenSprite.y = this.height / 2 + 3;
        }
        else
        {
            this.canBeTakenSprite = new BkSprite("#" + res_name.CanTakenPiece);
            this.canBeTakenSprite.x = this.width / 2;
            this.canBeTakenSprite.y = this.height / 2;
        }

        this.canBeTakenSprite.setVisible(false);
        this.addChild(this.canBeTakenSprite, 33);
    },

    initByListIndex: function(listIndex) {
        this.chessType = TYPE_VALUE[listIndex % 16];
        this.chessColor =  Math.floor(listIndex / 16);

        if (listIndex < 16) {
            this.colIndex = COL_VALUE[listIndex % 16];
            this.rowIndex = ROW_VALUE[listIndex % 16];
        }
        else {
            this.colIndex = (8 - COL_VALUE[listIndex % 16]);
            this.rowIndex = (9 - ROW_VALUE[listIndex % 16]);
        }
        this.isDead = false;

        this.setBitmap();
    },

    initEventHover: function () {
        this._eventHoverListener = this.createHoverEvent();
        cc.eventManager.addListener(this._eventHoverListener, this);
    },

    setEnableEventHover:function(isEnable){
        if (isEnable){
            this._eventHoverListener.setEnabled(true);
        } else{
            cc._canvas.style.cursor = "default";
            this._eventHoverListener.setEnabled(false);
        }
    },

    setBitmap: function() {
        if (this.faceState == FACE_DOWN && this.chessType != BkChessType.VUA) {
            // get face down piece
            this.setTextureRect(cc.rect(7 * CHESS_WIDTH, 0, CHESS_WIDTH, CHESS_HEIGHT - 1));
        }
        else {
            var rect;
            if(this.isReverseColor){
                rect = cc.rect(TYPE_BITMAP[this.chessType] * CHESS_WIDTH, (this.chessColor == 0? 1: 0) * CHESS_HEIGHT, CHESS_WIDTH, CHESS_HEIGHT - 1);
                this.setTextureRect(rect);
            }
            else{
                rect = cc.rect(TYPE_BITMAP[this.chessType] * CHESS_WIDTH, this.chessColor * CHESS_HEIGHT, CHESS_WIDTH, CHESS_HEIGHT - 1);
                this.setTextureRect(rect);
            }
        }
    },

    showCanBeTakenSprite: function(isVisible) {
        this.canBeTakenSprite.setVisible(isVisible);
        if(isVisible && (this.index == 0 || this.index == 16)) {
            var action1 = new cc.FadeTo(0.5, 100);
            var action2 = new cc.FadeTo(0.5, 255);
            //this.canBeTakenSprite.setOpacity(155);
            this.canBeTakenSprite.runAction(cc.sequence(action1, action2)).repeatForever();
        }
    },

    getGameLayer:function()
    {
        return BkGlobal.ingameScene.getGameLayer();
    },

    reposition: function() {
        var gameLayer = this.getGameLayer();
        if (this.isDead) {
            this.setPosition(-100, -100);
            return;
        }
        this.setPosition(gameLayer.getPosX(this.colIndex), gameLayer.getPosY(this.rowIndex));
    },

    moveTo: function(col, row) {
        this.colIndex = col;
        this.rowIndex = row;

        var gameLayer = this.getGameLayer();

        this.move(0.2 , gameLayer.getPosX(col), gameLayer.getPosY(row));
    },

    move: function (dur, x, y)
    {
        if(this.isAnimation && this.isMoveAnimationScheduled == false )
        {
            this.schedule(
                function ontimer() {
                    this.move(dur,x,y);
                    this.isMoveAnimationScheduled = true;
                    this.unschedule(ontimer);
                }
            ,0.1);
            return true;
        }

        var callback = cc.callFunc(this.chessAnimationFinish, this);
        var move = cc.moveTo(dur, cc.p(x, y), 0);
        var sequence = cc.sequence(move, callback);
        if(this.y != y || this.x != x) {
            this.runAction(sequence);
            this.isAnimation = true;
        }
    },

    chessAnimationFinish: function () {
        this.isAnimation = false;
        this.setLocalZOrder(this.index);
    },

    faceUp: function() {
        this.faceState = FACE_UP;
        this.setBitmap();
    }


});