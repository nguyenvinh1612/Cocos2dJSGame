/**
 * Created by bs on 03/10/2015.
 */
BkSlider = ccui.Slider.extend({
    TRACKER_SPACE:58,
    NUM_OF_TRACKER:5,
    _tracker:null,
    OnClickListener:null,
    ctor:function(imgTrack, imgBall, imgProgress){
        this._super();
        this.init();
        this.setTouchEnabled(true);
        this.setScale9Enabled(true);
    },

    onTouchBegin: function (touch, event) {
    },

    onTouchMove: function (touch, event) {
        var touchPoint = touch.getLocation();
        var nsp = this.convertToNodeSpace(touchPoint);
        this.setPercent(this._getPercentWithBallPos(nsp.x));
        this._percentChangedEvent();
    },

    onTouchEnd: function (touch, event) {
    },
    
    _initRenderer: function () {
        //todo use Scale9Sprite

        this._barRenderer = new cc.Sprite();
        this._progressBarRenderer = new cc.Sprite();
        this._progressBarRenderer.setAnchorPoint(0.0, 0.5);

        var self = this;

        var touchBegin = function(touch,event) {
            self.onTouchBegin(touch,event);
        };
        var touchMove = function(touch,event) {
            self.onTouchMove(touch,event);
        };
        var touchEnd = function(touch,event) {
            self.onTouchEnd(touch,event);
        };

        this.addProtectedChild(this._barRenderer, ccui.Slider.BASEBAR_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._progressBarRenderer, ccui.Slider.PROGRESSBAR_RENDERER_ZORDER, -1);
        this._slidBallNormalRenderer = new cc.Sprite();
        this._slidBallPressedRenderer = new cc.Sprite();
        this._slidBallPressedRenderer.setVisible(false);
        this._slidBallDisabledRenderer = new cc.Sprite();
        this._slidBallDisabledRenderer.setVisible(false);

        this.OnClickListener = this.createTouchEvent(touchBegin, touchMove, touchMove);
        cc.eventManager.addListener(this.OnClickListener, this);

        this._tracker = [];
        for (var i=0; i< this.NUM_OF_TRACKER; i++) {
            this._tracker = new BkSprite("#" + res_name.slider_dot);
            this._tracker.x = 6 + i * this.TRACKER_SPACE;
            this._tracker.y = 5;
            this.addProtectedChild(this._tracker,ccui.Slider.BALL_RENDERER_ZORDER,-2);
        }

        this._slidBallRenderer = new cc.Node();
        this._slidBallRenderer.addChild(this._slidBallNormalRenderer);
        this._slidBallRenderer.addChild(this._slidBallPressedRenderer);
        this._slidBallRenderer.addChild(this._slidBallDisabledRenderer);
        this._slidBallRenderer.setCascadeColorEnabled(true);
        this._slidBallRenderer.setCascadeOpacityEnabled(true);

        this.addProtectedChild(this._slidBallRenderer, ccui.Slider.BALL_RENDERER_ZORDER, -1);
    },



    /**
     * Changes the progress direction of slider.
     * @param {number} percent
     */
    setPercent: function (percent) {
        if (percent > 100)
            percent = 100;
        if (percent < 0)
            percent = 0;
        this._percent = percent;
        var res = percent / 100.0;
        var dis = (this._barLength - 8) * res + 4;
        this._slidBallRenderer.setPosition(dis, this._contentSize.height / 2);
        if (this._scale9Enabled)
            this._progressBarRenderer.setPreferredSize(cc.size(dis, this._contentSize.height));
        else {
            var spriteRenderer = this._progressBarRenderer;
            var rect = spriteRenderer.getTextureRect();
            spriteRenderer.setTextureRect(
                cc.rect(rect.x, rect.y, dis / spriteRenderer._scaleX, rect.height),
                spriteRenderer.isTextureRectRotated()
            );
        }
    },

    updateSliderPos:function(index) {
        var percent = index * 25;
        this.setPercent(percent);
    },

    setEnable:function(isEnable) {
        this.setTouchEnabled(isEnable);
        this.setEnabled(isEnable);
        this.setBright(isEnable);
    }
});