/**
 * Created by hoangthao on 26/11/2015.
 */
BkLabelSprite = cc.Sprite.extend({
    //width:null,
    //height:null,
    ctor: function (labelList) {
        this._super();
        this.createListLabel(labelList);
        this.anchorX = 0;
        this.anchorY = 0;
    },
    createListLabel: function (labelList) {
        var maxWidth = 0;
        var maxHeight = 0;
        var prevLabel = new BkLabel("");
        var prevAtt = labelList[0];
        for (var i = 0; i < labelList.length; i++) {
            var att = labelList[i];
            var label = new BkLabel(att.string, "Tahoma", att.fontSize, att.isBold);
            label.setTextColor(att.color);
            if (i == 0) {
                label.x = prevLabel.getContentSize().width + label.getContentSize().width / 2;
                label.y = label.getContentSize().height / 2;
                maxHeight += label.getContentSize().height;
            }
            //new line
            else if (prevAtt.line != att.line) {
                label.x = label.getContentSize().width / 2;
                label.y = prevLabel.y - label.getContentSize().height / 2 - 10;
                maxHeight += label.getContentSize().height;
            } else if (prevAtt.line == att.line) {
                label.x = prevLabel.x + prevLabel.getContentSize().width / 2 + label.getContentSize().width / 2;
                label.y = prevLabel.y;
            } else {
                logMessage("Check other case");
            }
            if(label.getContentSize().width > maxWidth){
                maxWidth = label.getContentSize().width;
            }

            this.addChild(label);
            prevLabel = label;
            prevAtt = att;
        }
        this.width = maxWidth;
        this.height = maxHeight;
    },
});

BkLabelItem = cc.Class.extend({
    string: null,
    fontSize: null,
    color: null,
    isBold: null,
    line: null,
    x: null,
    y: null,
    ctor: function (string, fontSize, color, line, isBold, x, y) {
        this.string = string;
        this.fontSize = fontSize;
        this.color = color;
        this.isBold = isBold;
        this.line = line;
        this.x = x;
        this.y = y;
    }
});