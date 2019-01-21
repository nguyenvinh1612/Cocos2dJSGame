/**
 * Created by bs on 10/05/2017.
 */
BkNumberCuoc = BkSprite.extend({
    imgOverBG:null,
    imgSelectBG:null,
    imgNumber:null,
    imgNumberOver:null,
    NoData:0,
    hvEvent:null,
    myPr:null,
    ctor: function (No,pr) {
        this._super();
        this.NoData = No;
        this.myPr = pr;
        this.imgOverBG = new BkSprite("#"+res_name.cuoc_u_hover_bt_2);
        this.addChild(this.imgOverBG);

        this.imgSelectBG = new BkSprite("#"+res_name.vv_select);
        this.addChild(this.imgSelectBG);

        this.imgOverBG.visible = false;
        this.imgSelectBG.visible = false;

        if (No == 0) { this.imgNumber = new BkSprite("#"+res_name.img0_OVER);}
        if (No == 1) { this.imgNumber = new BkSprite("#"+res_name.img1_OVER);}
        if (No == 2) { this.imgNumber = new BkSprite("#"+res_name.img2_OVER);}
        if (No == 3) { this.imgNumber = new BkSprite("#"+res_name.img3_OVER);}
        if (No == 4) { this.imgNumber = new BkSprite("#"+res_name.img4_OVER);}
        if (No == 5) { this.imgNumber = new BkSprite("#"+res_name.img5_OVER);}

        if (No == 0) { this.imgNumberOver = new BkSprite("#"+res_name.img0);}
        if (No == 1) { this.imgNumberOver = new BkSprite("#"+res_name.img1);}
        if (No == 2) { this.imgNumberOver = new BkSprite("#"+res_name.img2);}
        if (No == 3) { this.imgNumberOver = new BkSprite("#"+res_name.img3);}
        if (No == 4) { this.imgNumberOver = new BkSprite("#"+res_name.img4);}
        if (No == 5) {this. imgNumberOver = new BkSprite("#"+res_name.img5);}


        this.addChild(this.imgNumberOver);
        this.imgNumberOver.visible = false;

        this.addChild(this.imgNumber);

        this.imgNumber.x = this.imgOverBG.x;//(imgOverBG.width - imgNumber.width) * 0.5;
        this.imgNumber.y = this.imgOverBG.y;//(imgOverBG.height - imgNumber.height) * 0.5;

        this.imgNumberOver.x = this.imgNumber.x;
        this.imgNumberOver.y = this.imgNumber.y;

        //setCusorMouseWithObjectCanClick(true,onOver,onOut);
        var self = this;
        function onOver(){
            self.imgOverBG.visible = true;
            self.imgNumberOver.visible = true;
            self.imgNumber.visible = false;
        }

        function onOut(){
            self.imgOverBG.visible = false;
            self.imgNumberOver.visible = false;
            self.imgNumber.visible = true;
        }

        this.imgOverBG.setMouseOnHover(function () {
            onOver();
        }, function () {
            onOut();
        });
        this.imgOverBG.setOnlickListenner(function () {
            self.myPr.onClickNumberCuoc(self);
        });
    },
    setSelectedSprite:function(){
        this.imgSelectBG.visible = true;
        this.imgOverBG.visible = false;
        this.imgNumberOver.visible = true;
        this.imgNumber.visible = false;
    },
    hideAll:function(){
        this.imgSelectBG.visible = false;
        this.imgOverBG.visible = false;
        this.imgNumberOver.visible = false;
        this.imgNumber.visible = true;
    }
});