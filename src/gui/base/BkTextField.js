/**
 * Created by bs on 12/10/2015.
 */
BkTextField = BkSprite.extend({
    bg:null,
    tf:null,
    ctor: function (bgImage,placeholder, fontName, fontSize) {
        this._super();
        this.bg = new BkSprite(bgImage);
        this.bg.setPositionCenter();
        this.addChild(this.bg,0);

        this.tf = new ccui.TextField(placeholder, fontName, fontSize);
        this.tf.ignoreContentAdaptWithSize(false);
        //this.tf.getVirtualRenderer().setLineBreakWithoutSpace(true);
        this.tf.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.tf.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.tf.setContentSize(this.bg.getContentSize().width - 10,this.bg.getContentSize().height - 10);
        this.tf.setPosition(this.bg.x,this.bg.y);
        this.addChild(this.tf);
        this.tf.addEventListener(this.textFieldEvent, this);

    },
    textFieldEvent: function(textField, type) {
        var widgetSize = this.bg.getContentSize();
        switch (type) {
            case ccui.TextField.EVENT_ATTACH_WITH_IME:
                //textField.runAction(cc.moveTo(0.225, cc.p(widgetSize.width / 2, widgetSize.height / 2 - 15)));
                textField.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                textField.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
                break;
            case ccui.TextField.EVENT_DETACH_WITH_IME:
                //textField.runAction(cc.moveTo(0.175, cc.p(widgetSize.width / 2, widgetSize.height / 2)));
                textField.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                textField.setTextVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                break;
            case ccui.TextField.EVENT_INSERT_TEXT:
                break;
            case ccui.TextField.EVENT_DELETE_BACKWARD:
                break;
            default:
                break;
        }
    }

});