/**
 * Created by bs on 21/03/2016.
 */
BkNumberCBSprite = BkSprite.extend({
    ldNumber:-1,
    ldCheckbox:null,
    lbText:null,
    transBG:null,
    changeCB:null,
    ctor:function (data) {
        this._super(res.Tranperent_IMG);
        this.ldNumber = data;
        this.ldCheckbox = new BkCheckBox();

        var self = this;

        var onCheckChange = function(sender, type) {
            logMessage("onCheckChange");
            if (self.ldCheckbox.isSelected()){
                self.lbText.setColor(cc.color(255,255,0));
            } else {
                self.lbText.setColor(cc.color(255,255,255));
            }
            if (self.changeCB != null){
                self.changeCB(self);
            }
        };
        this.ldCheckbox.addEventListener(onCheckChange, this);
        this.ldCheckbox.x = 0;
        this.ldCheckbox.y = 0;
        var str = ""+data;
        if (data <10){
            str = "0"+data;
        }

        this.lbText = new BkLabel(str,"",16);
        this.lbText.x = this.ldCheckbox.x + 20;
        this.lbText.y = this.ldCheckbox.y;
        this.addChild(this.ldCheckbox);
        this.addChild(this.lbText);
        this.setContentSize(cc.size(this.ldCheckbox.width + this.lbText.width/2,this.ldCheckbox.height));

        this.transBG = new BkSprite("#"+res_name.btn_ready_normal);
        this.transBG.opacity = 0;
        var vlScaX = (this.ldCheckbox.width + this.lbText.width) / this.transBG.getContentSize().width;
        var vlScaY = (this.ldCheckbox.height) / this.transBG.getContentSize().height;
        this.transBG.setScale(vlScaX,vlScaY);
        this.transBG.x = (this.ldCheckbox.width + this.lbText.width - 20)/2;
        this.addChild(this.transBG,1);

        this.transBG.setMouseOnHover();
        this.transBG.setOnlickListenner(function () {
            logMessage("OnlickListenner "+self.ldNumber);
            if (self.ldCheckbox.isSelected()){
                self.lbText.setColor(cc.color(255,255,255));
            } else {
                self.lbText.setColor(cc.color(255,255,0));
            }
            self.ldCheckbox.setSelected(!self.ldCheckbox.isSelected());
            if (self.changeCB != null){
                self.changeCB(self);
            }
        });
    },
    isSelected:function(){
        return this.ldCheckbox.isSelected();
    },
    setCheckboxOnChangeCallback:function(cb){
        this.changeCB = cb;
    }

});