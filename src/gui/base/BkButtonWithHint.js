/**
 * Created by vinhnq on 10/8/2015.
 */
BkButtonWithHint = BkButton.extend(/** @lends ccui.Button# */{
    arrowGuide: null,
    isUp:false,
    ctor: function (normalImage, selectedImage, disableImage,hover,texType)
    {
        this._super(normalImage, selectedImage, disableImage,hover,texType);
    },
    initArrowGuide: function(){
        if(this.arrowGuide == null)
        {
            this.arrowGuide = new BkSprite("#"+res_name.arrow);
        }
        this.arrowGuide.x =  this.width/2;
        this.arrowGuide.y = 50;
        this.arrowGuide.scaleX  = 0.5;
        this.arrowGuide.scaleY = 0.6;
        this.arrowGuide.visible = false;
        this.addChild(this.arrowGuide);
        this.isUp = false;
    },
    /*
    *   call from super
    * */
    _initMouseHover: function(){
        var self = this;
        this._eventHover = this.createHoverEvent(function(event){
            self._buttonHoverRenderer.setVisible(true);
            self._buttonNormalRenderer.setVisible(false);
            if (self._hoverCb!= null){
                self._hoverCb();
            }
        },function(event){
            self._buttonHoverRenderer.setVisible(false);
            self._buttonNormalRenderer.setVisible(true);
            if (self._outCb!= null){
                self._outCb();
            }
        },function(event){
            self._buttonHoverRenderer.setVisible(false);
        });
        cc.eventManager.addListener(this._eventHover, this._buttonNormalRenderer);
    },
    showArrowGuide: function(isShow)
    {
        if(isShow)
        {
            if(this.arrowGuide == null)
            {
                this.initArrowGuide();
            }
            this.arrowGuide.visible = isShow;
            this.animateArrowGuide (this.arrowGuide.x,this.arrowGuide.y,0.25);
            return;
        }
        this.stopArrowGuide();
    },
    stopArrowGuide:function()
    {
        if (this.arrowGuide!= null){
           this.arrowGuide.removeFromParent();
            this.arrowGuide = null;
        }
    },
    animateArrowGuide: function(xPos,yPos, dur)
    {
        var self = this;
        var callback = cc.callFunc(function onFinish(){
            this.isUp = !this.isUp;
            if(this.isUp)
            {
                yPos = yPos - 15;

            }else
            {
                yPos = yPos + 15;
            }
            this.animateArrowGuide(xPos,yPos,dur);
        }, this);
        var move = cc.moveTo(dur, xPos, yPos);
        var sequence = cc.sequence(move, callback);
        self.arrowGuide.runAction(sequence);
    }
});