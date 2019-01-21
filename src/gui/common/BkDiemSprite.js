/**
 * Created by bs on 15/02/2016.
 */
BkDiemSprite = BkSprite.extend({
    bgSprite:null,
    lbDiem:null,
    ctor: function (strdiem) {
        //strdiem = "chưa đủ tuổi";
        this._super();
        //this.bgSprite = new cc.Scale9Sprite(res_name.ToastBG_png);
        this.bgSprite = new BkSprite("#" + res_name.result_normal_bg);
        var mWid = 165;
        if (strdiem.length < 10){
            mWid = 110;
        }
        this.bgSprite.setScaleX(mWid/87);
        this.bgSprite.setScaleY(35/29);
        this.bgSprite.x = 0;//mWid/2;
        //this.bgSprite.height = 45;
        this.addChild(this.bgSprite);
        this.lbDiem = new cc.LabelBMFont(strdiem, res.BITMAP_GAME_FONT);
        this.lbDiem.x = this.bgSprite.x;
        this.lbDiem.y = this.bgSprite.y + 2;
        this.addChild(this.lbDiem);
    }
});