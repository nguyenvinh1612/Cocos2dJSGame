/**
 * Created by bs on 10/05/2017.
 */
BkCuocSprite= BkSprite.extend({
    MARGIN_TB:0,
    MARGIN_LR:5,

    MAX_TEXT_WIDTH:160,
    COLOR_TEXT_NORMAL:cc.color(0xD8,0xC8,0xC7),
    COLOR_TEXT_OVER:cc.color(0xFC,0xDE,0x63),
    tfTextCuoc:null,
    imgCheck:null,
    imgOne:null,
    imgTwo:null,
    imgThree:null,
    imgFour:null,
    imgFive:null,
    imgBGOver:null,
    hvEvent:null,
    clEvent:null,
    Cdata:null,
    myPr:null,
    ishoverNumberCuoc:false,
    ctor: function (data,pr) {
        this._super();
        this.myPr = pr;

        this.imgBGOver = new BkSprite("#"+res_name.cuoc_u_hover_bt);
        this.addChild(this.imgBGOver);
        this.imgBGOver.visible = false;

        this.tfTextCuoc = new cc.LabelTTF("","BRUSHSBI",22*2);//new BkLabel("","",18);
        this.tfTextCuoc.setScale(0.5);
        this.tfTextCuoc.x = this.imgBGOver.x;
        this.tfTextCuoc.y = this.imgBGOver.y;
        this.tfTextCuoc.setString( data.CuocText);
        this.addChild(this.tfTextCuoc);

        this.imgCheck = new BkSprite("#"+res_name.imgcheck);
        this.config(this.imgCheck);
        this.imgOne = new BkSprite("#"+res_name.img1);
        this.config(this.imgOne);
        this.imgTwo = new BkSprite("#"+res_name.img2);
        this.config(this.imgTwo);
        this.imgThree = new BkSprite("#"+res_name.img3);
        this.config(this.imgThree);
        this.imgFour = new BkSprite("#"+res_name.img4);
        this.config(this.imgFour);
        this.imgFive = new BkSprite("#"+res_name.img5);
        this.config(this.imgFive);
        this.Cdata = data;


        var self = this;

        this.imgBGOver.setMouseOnHover(function () {
            self.doOverCuocSprite();
        }, function () {
            self.doOutCuocSprite();
        });
        this.imgBGOver.setOnlickListenner(function () {
            self.doClickCuocSprite();
        });
    },
    doOverCuocSprite:function(){
        this.setVisibleBGOver(true);
        this.myPr.onOverCuocSpriteItem(this);
    },
    doOutCuocSprite:function(){
        if (this.ishoverNumberCuoc){
            this.setVisibleBGOver(true);
            return;
        }
        this.setVisibleBGOver(false);
    },
    doClickCuocSprite:function(){
        logMessage("click doClickCuocSprite"+this.Cdata.CuocText);
        this.myPr.UpdateUICuocSprite(this);
    },
    config:function(oBM){
        oBM.visible = false;
        oBM.x = this.imgBGOver.x + this.MAX_TEXT_WIDTH / 2 - 2;
        oBM.y = this.imgBGOver.y ;
        this.addChild(oBM);
    },
    setVisibleBGOver:function(isVisi){

        this.imgBGOver.visible = isVisi;
        if (isVisi){
            this.tfTextCuoc.setFontFillColor(this.COLOR_TEXT_OVER);
            //this.tfTextCuoc.setTextColor(this.COLOR_TEXT_OVER);
        } else {
            this.tfTextCuoc.setFontFillColor(this.COLOR_TEXT_NORMAL);
            //this.tfTextCuoc.setTextColor(this.COLOR_TEXT_NORMAL);
        }
    },
    updateData:function(data){
        this.Cdata = data;
        this.updateUI();
    },
    hideAllImage:function(){
        this.imgCheck.visible = false;
        this.imgOne.visible = false;
        this.imgTwo.visible = false;
        this.imgThree.visible = false;
        this.imgFour.visible = false;
        this.imgFive.visible = false;
    },
    updateUI:function(){
        this.hideAllImage();
        if (this.Cdata.isCheck){
            //trace("Cdata.isCuocTypeCheck: " + Cdata.isCuocTypeCheck);
            if (this.Cdata.isCuocTypeCheck){
                this.imgCheck.visible = true;
                return;
            } else{
                //trace("Cdata.CuocNumber: " + Cdata.CuocNumber);
                switch(this.Cdata.CuocNumber)
                {
                    case 1:
                    {
                        this.imgOne.visible = true;
                        return;
                    }

                    case 2:
                    {
                        this.imgTwo.visible = true;
                        return;
                    }
                    case 3:
                    {
                        this.imgThree.visible = true;
                        return;
                    }
                    case 4:
                    {
                        this.imgFour.visible = true;
                        return;
                    }
                    case 5:
                    {
                        this.imgFive.visible = true;
                        return;
                    }
                    default:
                    {
                        this.hideAllImage();
                        return;
                    }
                }
            }
        }
    }
});