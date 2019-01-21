/**
 * Created by VanChinh on 10/27/2015.
 */
AVATAR_NUMBER_OF_COLUMNES = 4;
BkAvatarSelectionWindow = VvWindow.extend({
    listAvatars:null,
    spriteListAvatars:null,
    parentNode: null,
    ctor: function (listAvatars, parent) {
        this._super("Chọn avatar", cc.size(560, 460));
        this.setVisibleOutBackgroundWindow(true);
        this.setMoveableWindow(false);
        if (listAvatars != null) {
            this.listAvatars = listAvatars;
            this.parentNode = parent;
            this.initUI();
        }
    },

    initUI: function (){
        this.setDefaultWdBodyBg();
        this.spriteListAvatars = new BkSprite();
        var len = this.listAvatars.length;
        var xPos = 0;
        var yPos = 310;
        var beginY = -40;
        var itemSize = 106;
        var rowCount = 1;
        var bodyContentWidth = this.getBodySize().width - WD_BODY_MARGIN_LR*2;
        var SPACE_COLUMN = (bodyContentWidth - AVATAR_NUMBER_OF_COLUMNES * itemSize) / (AVATAR_NUMBER_OF_COLUMNES + 1);
        if(len > 8){
            SPACE_COLUMN = 15;
        }
        if(len > 12){
            yPos = 440;
            beginY = -170;
        }
        var SPACE_ROW = 15;
        var self = this;

        for ( var i = 0; i < len; i++ )
        {
            var item = this.listAvatars[i];
            var avaSprite = new BkAvatarItem(item, self, self.parentNode);

            if(i == 0 )
            {
                xPos = itemSize / 2 + SPACE_COLUMN - 10;
            }
            else if(i % AVATAR_NUMBER_OF_COLUMNES == 0)
            {
                // new row, increase Y , reset X
                yPos = yPos - itemSize - SPACE_ROW;
                xPos =  itemSize / 2 + SPACE_COLUMN - 10;
                rowCount++;
            }
            else
            {
                xPos = xPos + itemSize + SPACE_COLUMN;
            }

            avaSprite.x = xPos + 28;
            avaSprite.y = yPos - WD_BODY_MARGIN_TB;
            this.spriteListAvatars.addChild(avaSprite);
        }

        if(rowCount >= 3 ){
            var containerHeight = rowCount * itemSize + (rowCount - 1)* SPACE_ROW;
            this.spriteListAvatars.setContentSize(450, containerHeight);
            this._windowSc = new BkScrollView(cc.size(500, 320), this.spriteListAvatars, this, true);

            this.addChildBody(this._windowSc);
            this._windowSc.y = 50;
            this._windowSc.x = 0;
            this._windowSc.setBeginY(beginY);
            this._windowSc.configPos(720,300);
            SPACE_COLUMN = 15;
        }
        else {
            this.spriteListAvatars.y = 10;
            this.addChildBody(this.spriteListAvatars);
        }
    }
});