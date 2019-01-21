/**
 * Created by VanChinh on 11/10/2015.
 */

BkCoTuongGameLayer = BkChessBaseIngameLayer.extend({
    ctor: function(){
        this._super();
    },

    OnGameTableSyn: function(packet) {
        this._super(packet);

        var gameLogic = this.getLogic();
        var currentPlayer = gameLogic.getMyClientState();

        if(!gameLogic.isInGameProgress()){
            if(currentPlayer && currentPlayer.isObserver) this.removeCountDownText();
            this.cancelTimer(true);
            this.resetPositionOfChessPieces();
            this.changeButtonState();
            return;
        }

        var oneTurnTimeRemain = 0;
        while (packet.Buffer.isReadable()) {
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
                    chessPiece.reposition();
                    if(!chessPiece.isDead && currentPlayer && !currentPlayer.isObserver && chessPiece.chessColor == currentPlayer.chessColor)chessPiece.setEnableEventHover(true);
                }
            }
            else {
                for (i = 0, len = this.chessPieces.length; i < len; i++) {
                    chessPiece = this.chessPieces[i];
                    chessPiece.colIndex = packet.Buffer.readByte();
                    chessPiece.rowIndex = packet.Buffer.readByte();
                    chessPiece.isDead = packet.Buffer.readByte() == 1;
                    chessPiece.reposition();
                    if(!chessPiece.isDead && currentPlayer && !currentPlayer.isObserver && chessPiece.chessColor == currentPlayer.chessColor)chessPiece.setEnableEventHover(true);
                }
            }
        }
        this.startTimer(oneTurnTimeRemain);
        this.changeButtonState();
    }
});