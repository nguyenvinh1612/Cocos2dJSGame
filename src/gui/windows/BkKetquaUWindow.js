/**
 * Created by bs on 12/05/2017.
 */
BkKetquaUWindow = VvWindow.extend({
    cuocU:null,
    tongDiem:null,
    tfCuocXuong:null,
    listData:[],
    ctor:function(cuocU,diemU,isVisibleSharebtn)
    {
        this.cuocU = cuocU;
        this.tongDiem = diemU;
        this._super("", cc.size(460, 190));
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this._bgBody.visible = false;
        // this.setVisibleBottom(false);
        this.setVisibleOutBackgroundWindow(false);
        this.setMoveableWindow(true);
        this._btnClose.visible = false;

        this.bgWd = new BkSprite("#"+res_name.cuocho_bg);
        this.bgWd.x = this.getWindowSize().width/2;
        this.bgWd.y = -100;
        this.addChildBody(this.bgWd, WD_ZORDER_BODY);
        var fSize = 15;
        if (cuocU.length > 280){
            fSize = 14;
        }
        this.tfCuocXuong = new cc.LabelTTF(cuocU, "Tahoma", fSize*2,cc.size (415 * 2 , 0), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        this.tfCuocXuong.setScale(0.5);
        this.tfCuocXuong.x  = this.bgWd.x;
        this.tfCuocXuong.y  = this.bgWd.y + 5;
        this.addChildBody(this.tfCuocXuong);

        this.btnTiepTuc = createBkButtonPlistNewTitle(res_name.vv_btn_big_normal, res_name.vv_btn_big_press
            , res_name.vv_btn_big_normal, res_name.vv_btn_big_hover,"Tiếp tục",0,0);
        this.btnTiepTuc.setTitleFontSize(14);
        this.btnTiepTuc.setTitleColor(cc.color.BLACK);
        this.btnTiepTuc.x = this.bgWd.x;
        this.btnTiepTuc.y = this.bgWd.y - 80;
        this.addChildBody(this.btnTiepTuc, WD_ZORDER_BODY);
        var self = this;
        this.btnTiepTuc.addClickEventListener(function()
        {
            if(BkTime.GetCurrentTime() - self.btnTiepTuc.lastTimeClick < 1000){
                logMessage("click 2 lan trong 1 sec -> don't process action");
                return;
            }
            self.btnTiepTuc.lastTimeClick = BkTime.GetCurrentTime();
            self.onClickTiepTuc();
        });
        if(isVisibleSharebtn)
        {
            this.btnChiaSe = createBkButtonPlistNewTitle(res_name.vv_btn_big_normal, res_name.vv_btn_big_press
                , res_name.vv_btn_big_normal, res_name.vv_btn_big_hover,"Chia sẻ",0,0);
            this.btnChiaSe.setTitleFontSize(14);
            this.btnChiaSe.setTitleColor(cc.color.BLACK);
            this.btnTiepTuc.x = this.bgWd.x - 50;
            this.btnChiaSe.x = this.bgWd.x + 50;
            this.btnChiaSe.y = this.btnTiepTuc.y;
            this.addChildBody(this.btnChiaSe, WD_ZORDER_BODY);
            var self = this;
            this.btnChiaSe.addClickEventListener(function()
            {
                if(BkTime.GetCurrentTime() - self.btnChiaSe.lastTimeClick < 1000){
                    logMessage("click 2 lan trong 1 sec -> don't process action");
                    return;
                }
                self.btnChiaSe.lastTimeClick = BkTime.GetCurrentTime();
                self.onClickChiaSe();
            });
        }
    },
    onClickChiaSe:function()
    {
        if( BkLogicManager.getInGameLogic().UBytesData == null)
        {
            Util.showAnim();
            return;
        }
        var postFR = new VvPostOnForumWindow(this,BkLogicManager.getInGameLogic().getGameLayer().strCuoc,this.tongDiem);
        postFR.showWithParent();
    },
    onClickTiepTuc:function(){
        logMessage("onClickTiepTuc");
        //this.removeSelf();
        this.getParentWindow().onClickTiepTucKQU();
    },
    setListElementText:function (lData) {
        this.listData = lData;
        this.tfCuocXuong.visible = false;
        var richText = new ccui.RichText();
        richText.ignoreContentAdaptWithSize(false);
        richText._textHorizontalAlignment = cc.TEXT_ALIGNMENT_CENTER;
        richText.width = 415;
        richText.height = 200;
        richText.x  = this.bgWd.x;
        richText.y  = this.bgWd.y - 30;
        richText.setLineBreakOnSpace(true);
        for (var i=0;i<lData.length;i++){
            richText.pushBackElement(lData[i]);
        }
        this.addChildBody(richText);
    }
});