/**
 * Created by VanChinh on 11/30/2015.
 */

BkChessPlayerClientState = BkClientState.extend({
    remainTime: 0,
    remainTimeText: "",
    chessColor: -1,
    king: null,
    tablePosition: - 1,
    isObserver: null,
    stopTotalCountDown: false,

    ctor: function(){
        this._super();
        this.remainTimeText = new BkLabel("00:00", "", 15);
        this.remainTimeText.setVisible(false);
        this.chessColor = 0;
        this.king = new BkSprite();
        this.king.setVisible(false);
    },

    setRemainTime: function(time) {
        this.remainTime = time;
        this.remainTimeText.setVisible(true);
        this.remainTimeText.setString(convertSecondToMinSec(this.remainTime));
    },

    setClientInfo:function(o)
    {
        this._super(o);
        this.isObserver = o.isObserver;
    },

    showTotalCountDownTime: function(){
        if(this.remainTime){
            this.stopTotalCountDown = false;
            var self = this;
            this.remainTimeText.setString(convertSecondToMinSec(this.remainTime));
            this.remainTimeText.schedule(function onTick(){
                if (self.remainTime > 0 && !self.stopTotalCountDown){
                    self.remainTime--;
                    self.remainTimeText.setString(convertSecondToMinSec(self.remainTime));
                } else {
                    self.remainTimeText.unschedule(onTick);
                }
            }, 1);
        }
    },

    stopTotalCountDownTime:function(){
        this.stopTotalCountDown = true;
    }
});