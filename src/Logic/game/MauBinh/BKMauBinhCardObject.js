/**
 * Created by vinhnq on 5/20/2016.
 */
/**
 * Created by vinhnq on 1/20/2016.
 */

var FONT_SIZE_TEXT_TYPE = 14;

BkMauBinhCardObject = cc.Layer.extend({
    chi1:null,
    chi2:null,
    chi3:null,
    txtchi1type:null,
    txtchi2type:null,
    txtchi3type:null,
    arrow1:null,
    arrow2:null,
    arrow3:null,
    specialbg:null,
    txtBinhLung:null,
    cardSuite:null,
    bgSochi:null,
    ctor:function(){
        this._super();
    },
    addCardSuite:function(cardlist)
    {
         this.cardSuite = cardlist;
        //this.cardSuite = [];
        //for(var i = 0; i < cardlist.length; i++)
        //{
        //    this.cardSuite.push(cardlist[i]);
        //}
	
    },
    getChi1CardSuite:function(isPreProcess)
    {
        this.chi1 = new BkMauBinhCardSuite();
        for (var i = 8; i < 13; i++)
        {
            this.chi1.addCard(this.cardSuite[i]);
        }
        if(isPreProcess != undefined && isPreProcess == false)
        {
            return this.chi1;
        }
        this.chi1.preProcess();
        return this.chi1;
    },
    getChi2CardSuite:function(isPreProcess)
    {
        this.chi2 =  new BkMauBinhCardSuite();
        for (var i = 3; i < 8; i++)
        {
            this.chi2.addCard(this.cardSuite[i]);
        }

        if(isPreProcess != undefined && isPreProcess == false)
        {
            return this.chi2;
        }
        this.chi2.preProcess();
        return this.chi2;
    },
    getChi3CardSuite:function(isPreProcess)
    {
        this.chi3 = new BkMauBinhCardSuite();
        for (var i = 0; i < 3; i++)
        {
            this.chi3.addCard(this.cardSuite[i]);
        }
        if(isPreProcess != undefined && isPreProcess == false)
        {
            return this.chi3;
        }
        this.chi3.preProcess();
        return this.chi3;
    },
    removeCardTextType:function()
    {
        this.removeBgSoChi();
        this.removeSpecialBG();
        this.removeBinhLungText();
        this.removeChi1CardTextType();
        this.removeChi2CardTextType();
        this.removeChi3CardTextType();
    },
    removeBinhLungText:function() {
        if (this.txtBinhLung != null)
        {
            this.txtBinhLung.removeFromParent();
            this.txtBinhLung = null;
        }
    },
    removeChi1CardTextType:function() {
        if (this.txtchi1type != null) {
            this.txtchi1type.removeFromParent();
            this.txtchi1type = null;
        }

        if (this.arrow1 != null){
            this.arrow1.removeFromParent();
            this.arrow1 = null;
        }
    },
    removeChi2CardTextType:function() {
        if (this.txtchi2type != null) {
            this.txtchi2type.removeFromParent();
            this.txtchi2type = null;
        }

        if (this.arrow2 != null){
            this.arrow2.removeFromParent();
            this.arrow2 = null;
        }
    },
    removeChi3CardTextType:function() {
        if (this.txtchi3type != null) {
            this.txtchi3type.removeFromParent();
            this.txtchi3type = null;
        }

        if (this.arrow3 != null){
            this.arrow3.removeFromParent();
            this.arrow3 = null;
        }
    },
    removeBgSoChi:function(){
        if (this.bgSochi != null){
            this.bgSochi.removeFromParent();
            this.bgSochi = null;
        }
    },
    removeSpecialBG:function(){
        if (this.specialbg != null){
            this.specialbg.removeFromParent();
            this.specialbg = null;
        }
    },
    initBgSoChi:function(layerGui,x,y){
        logMessage("initBgSoChi");
        this.removeBgSoChi();
        this.bgSochi = new BkSprite("#"+res_name.bg_sochi);
        this.bgSochi.x = x;
        this.bgSochi.y = y;
        layerGui.addChild(this.bgSochi, layerGui.getLocalZOrder() + 1002);
    },
    getResNameByType:function(suiteType){
        switch (suiteType){
            case CULU:
                    return res_name.text_culu;
            case THUNG:
                    return res_name.text_thung;
            case SANH:
                    return res_name.text_sanh;
            case SAMCO:
                    return res_name.text_samco;
            case THU:
                    return res_name.text_thu;
            case DOI:
                    return res_name.text_doi;
            default:
                return res_name.text_mauthau;
            }
        return res_name.text_mauthau;
    },
    initTextTypeSoChi:function(layerGui,x,y,suiteType){
        logMessage("initTextTypeSoChi");
        this.initBgSoChi(layerGui,x,y);

        //var txtType = new cc.LabelBMFont("", res.BITMAP_GAME_FONT_TCM);
        //txtType.setScale(0.55);
        var strName = this.getResNameByType(suiteType);
        var txtType = new BkSprite("#"+strName);
        txtType.x = x;
        txtType.y =y;
        return txtType;
        //layerGui.addChild(txtType, layerGui.getLocalZOrder() + 1003);
    },
    getMauBinhSoChiSprite:function(chi){
        if (chi == 1){
            if (this.isTuQuyChi1()){
                return new BkSprite("#"+res_name.tuquy);
            }
            if (this.isTPSChi1()){
                return new BkSprite("#"+res_name.thungphasanh);
            }
        }
        if (chi == 2){
            if (this.isTuQuyChi2()){
                return new BkSprite("#"+res_name.tuquychi2);
            }
            if (this.isTPSChi2()){
                return new BkSprite("#"+res_name.thungphasanhchi2);
            }
            if (this.isCuLuChi2()){
                return new BkSprite("#"+res_name.culuchi2);
            }
        }

        if (chi == 3){
            if (this.isSamChiCuoi()){
                return new BkSprite("#"+res_name.samcochicuoi);
            }
        }
        return null;
    },
    initArrow:function(isGreen){
        if (isGreen == undefined || isGreen == null){
            isGreen = true;
        }
        if (isGreen){
            return new BkSprite("#"+res_name.arrow_green);
        } else {
            return new BkSprite("#"+res_name.arrow_orange);
        }
    },
    showAnimationMauBinhThuong:function(x,y,maubinhSprite,layerGui){
        if (this.specialbg != null){
            this.specialbg.removeFromParent();
            this.specialbg = null;
        }
        this.specialbg = maubinhSprite;
        this.specialbg.x = x;
        this.specialbg.y = y;
        layerGui.addChild(this.specialbg, layerGui.getLocalZOrder() + 1002);
        this.specialbg.setScale(4);
        var dur = 0.2;
        var move = cc.moveTo(dur, x, y);
        var scale = cc.scaleTo(dur,1);
        var mySp = cc.spawn(move,scale);
        this.specialbg.runAction(mySp);
    },
    showChi1CardTextType:function(layerGui,x,y,text,isXepBai)
    {
        this.removeChi1CardTextType();
        var maubinhSprite = this.getMauBinhSoChiSprite(1);
        var strText = this.getChi1CardSuite().getBiggestSuiteName();
        var suiteType = this.getChi1CardSuite().getBiggestSuiteType();
        if (isXepBai){
            if (this.txtchi1type == null)
            {
                this.txtchi1type = new BkLabel("", "", FONT_SIZE_TEXT_TYPE, true);
                if (maubinhSprite != null){
                    this.txtchi1type.setTextColor(BkColor.TEXT_MAUBINH_SUITE_MAU_BINH);
                    this.arrow1 = this.initArrow(false);
                } else {
                    this.txtchi1type.setTextColor(BkColor.TEXT_MAUBINH_SUITE);
                    this.arrow1 = this.initArrow(true);
                }
                layerGui.addChild(this.txtchi1type, layerGui.getLocalZOrder() + 1002);
                //layerGui.addChild(this.arrow1, layerGui.getLocalZOrder() + 1002);
            }
            this.txtchi1type.setString(strText);
            this.txtchi1type.x = x + this.txtchi1type.width/2;
            this.txtchi1type.y = y;
            this.arrow1.x = x - this.arrow1.width;
            this.arrow1.y = y;
        } else {
            // la so chi
            if (maubinhSprite != null){
                this.showAnimationMauBinhThuong(x,y,maubinhSprite,layerGui);
            } else {
                // la so chi binh thuong
                this.txtchi1type = this.initTextTypeSoChi(layerGui,x,y,suiteType);
                layerGui.addChild(this.txtchi1type, layerGui.getLocalZOrder() + 1003);
                //this.txtchi1type.setString(strText);
            }
        }
    },

    showChi2CardTextType:function(layerGui,x,y,text,isXepBai)
    {
        this.removeChi2CardTextType();
        var maubinhSprite = this.getMauBinhSoChiSprite(2);
        var strText = this.getChi2CardSuite().getBiggestSuiteName();
        var suiteType = this.getChi2CardSuite().getBiggestSuiteType();

        if (isXepBai){
            if (this.txtchi2type == null)
            {
                this.txtchi2type = new BkLabel("", "", FONT_SIZE_TEXT_TYPE, true);
                if (maubinhSprite != null){
                    this.txtchi2type.setTextColor(BkColor.TEXT_MAUBINH_SUITE_MAU_BINH);
                    strText = strText + " chi 2";
                    this.arrow2 = this.initArrow(false);
                } else {
                    this.txtchi2type.setTextColor(BkColor.TEXT_MAUBINH_SUITE);
                    this.arrow2 = this.initArrow(true);
                }
                layerGui.addChild(this.txtchi2type, layerGui.getLocalZOrder() + 1002);
                //layerGui.addChild(this.arrow2, layerGui.getLocalZOrder() + 1002);
            }
            this.txtchi2type.setString(strText);
            this.txtchi2type.x = x + this.txtchi2type.width/2;
            this.txtchi2type.y = y;
            this.arrow2.x = x - this.arrow2.width;
            this.arrow2.y = y;
        } else {
            // la so chi
            if (maubinhSprite != null){
                this.showAnimationMauBinhThuong(x,y,maubinhSprite,layerGui);
            } else {
                // la so chi binh thuong
                this.txtchi2type = this.initTextTypeSoChi(layerGui,x,y,suiteType);
                layerGui.addChild(this.txtchi2type, layerGui.getLocalZOrder() + 1003);
                //this.txtchi2type.setString(strText);
            }
        }
    },

    showChi3CardTextType:function(layerGui,x,y,text,isXepBai) {
        this.removeChi3CardTextType();
        var maubinhSprite = this.getMauBinhSoChiSprite(3);
        var strText = this.getChi3CardSuite().getBiggestSuiteName();
        var suiteType = this.getChi3CardSuite().getBiggestSuiteType();

        if (isXepBai){
            if (this.txtchi3type == null)
            {
                this.txtchi3type = new BkLabel("", "", FONT_SIZE_TEXT_TYPE, true);
                if (maubinhSprite != null){
                    this.txtchi3type.setTextColor(BkColor.TEXT_MAUBINH_SUITE_MAU_BINH);
                    strText = strText + " chi cuối";
                    this.arrow3 = this.initArrow(false);
                } else {
                    this.txtchi3type.setTextColor(BkColor.TEXT_MAUBINH_SUITE);
                    this.arrow3 = this.initArrow(true);
                }
                layerGui.addChild(this.txtchi3type, layerGui.getLocalZOrder() + 1002);
                //layerGui.addChild(this.arrow3, layerGui.getLocalZOrder() + 1002);
            }
            this.txtchi3type.setString(strText);
            this.txtchi3type.x = x + this.txtchi3type.width/2;
            this.txtchi3type.y = y;
            this.arrow3.x = x - this.arrow3.width;
            this.arrow3.y = y;
        } else {
            // la so chi
            if (maubinhSprite != null){
                this.showAnimationMauBinhThuong(x,y,maubinhSprite,layerGui);
            } else {
                // la so chi binh thuong
                this.txtchi3type = this.initTextTypeSoChi(layerGui,x,y,suiteType);
                layerGui.addChild(this.txtchi3type, layerGui.getLocalZOrder() + 1003);
                //this.txtchi3type.setString(strText);
            }
        }
    },
    showBinhLungTextType:function(layerGui,x,y) {
        this.removeCardTextType();
        if (this.txtBinhLung == null) {
            this.txtBinhLung = new BkSprite("#"+res_name.text_binhlung);
            this.txtBinhLung.setScale(0.6);
            this.txtBinhLung.x = x;
            this.txtBinhLung.y = y;
            layerGui.addChild(this.txtBinhLung, layerGui.getLocalZOrder() + 1000);
        }
    },
    getMaubinhAutoWinSprite:function(){
        if (this.isSanhRong()){
            return new BkSprite("#"+res_name.sanhrong);
        }
        if (this.is3CaiSanh()){
            return new BkSprite("#"+res_name.bacaisanh);
        }
        if (this.is3CaiThung()){
            return new BkSprite("#"+res_name.bacaithung);
        }
        if (this.isLucPheBon()){
            return new BkSprite("#"+res_name.lucphebon);
        }
        return null;
    },
    showSpecialCardTextType:function(layerGui,x,y,isXepbai) {
        if ((isXepbai == undefined) || (isXepbai == null)){
            isXepbai = false;
        }
        var rtnSprite = this.getMaubinhAutoWinSprite();
        if(rtnSprite != null) {
            this.removeCardTextType();
            this.removeBinhLungText();
            if (this.txtBinhLung == null) {
                this.txtBinhLung = rtnSprite;
                var scale = 1;
                if (isXepbai){
                    scale = 1.2;
                    x = x + 15;
                }
                this.txtBinhLung.x = x;
                this.txtBinhLung.y = y - 50;
                this.txtBinhLung.setScale(3);

                var dur = 0.3;
                var move = cc.moveTo(dur, x, y);
                var scaleAnimation = cc.scaleTo(dur,scale);
                var mySp = cc.spawn(move,scaleAnimation);

                layerGui.addChild(this.txtBinhLung, layerGui.getLocalZOrder() + 100);
                this.txtBinhLung.runAction(mySp);
            }
        }
    },
    removeMaskCard:function() {
        for (var i=0; i< this.cardSuite.length; i++) {
            this.cardSuite[i].showMask(false);
        }
    },
    showAllMaskCard:function() {
        for (var i=0; i< this.cardSuite.length; i++) {
            this.cardSuite[i].showMask(true);
        }
    },
    showMaskCard:function() {
        if (this.isMauBinh()){
            this.showAllMaskCard();
            return;
        }

        this.getChi1CardSuite().showMaskForSuite();
        this.getChi2CardSuite().showMaskForSuite();
        this.getChi3CardSuite().showMaskForSuite();
    },

    showcardTextType:function(layerGui,x3,y3,x2,y2,x1,y1)
    {
        this.removeCardTextType();
        if(this.isMauBinh()) {
            var me = layerGui.getLogic().getMyClientState();
            var pos = layerGui.getPosOfTextTypeWithData(me,1);
            this.showSpecialCardTextType(layerGui,pos.x,pos.y - 30,true);
        }else{
            if(!this.isNotBinhLung()) {
                var me = layerGui.getLogic().getMyClientState();
                var pos = layerGui.getPosOfTextTypeWithData(me,1);
                pos.y = pos.y - 25;
                pos.x = pos.x + 20;
                this.showBinhLungTextType(layerGui,pos.x,pos.y);
            }
            this.showChi1CardTextType(layerGui,x1,y1,null,true);
            this.showChi2CardTextType(layerGui,x2,y2,null,true);
            this.showChi3CardTextType(layerGui,x3,y3,null,true);
        }
    },
    isNotBinhLung:function()
    {
        if(this.isMauBinh())
        {
            return true;
        }
        return  !(this.getChi3CardSuite().isBiggerThanCardSuite(this.getChi2CardSuite()) || this.getChi2CardSuite().isBiggerThanCardSuite(this.getChi1CardSuite())||this.getChi3CardSuite().isBiggerThanCardSuite(this.getChi1CardSuite()));
    },
    //for special case maubinh Autowin
    isRongCuon:function()
    {
        return this.isSanhRong();
    },
    isSanhRong:function()
    {
        for( var i = 1; i <= 13; i++)
        {
            if(getNumberCount(this.cardSuite,i) != 1)
            {
                return false;
            }
        }
        return true;
    },
    is6Doi:function()
    {
        var countdoi = 0;
        for(i = 1; i <= 13; i++)
        {
            if(getNumberCount(this.cardSuite,i) == 2 || getNumberCount(this.cardSuite,i) == 3)
            {
                //logMessage("countdoi:" + i);
                countdoi ++;
            }
            if(getNumberCount(this.cardSuite,i) == 4)
            {
                //logMessage("count2doi:" + i);
                countdoi = countdoi + 2;
            }
        }
        return (countdoi == 6);
    },
    isLucPheBon: function ()
    {
        // 1 doi 2 thu
        var chi3type = this.getChi3CardSuite().getBiggestSuiteType();
        var chi2type = this.getChi2CardSuite().getBiggestSuiteType();
        var chi1type = this.getChi1CardSuite().getBiggestSuiteType();
        var is6doi = this.is6Doi();
        return(this.is6Doi() && chi3type == DOI && chi2type == THU && chi1type == THU);
    },
    is3CaiSanh:function()
    {
        return (this.getChi1CardSuite().isSanh()&& this.getChi2CardSuite().isSanh() &&this.getChi3CardSuite().isSanh());
    },
    is3CaiThung:function()
    {
        return (this.getChi1CardSuite().isThung() && this.getChi2CardSuite().isThung() && this.getChi3CardSuite().isThung());
    },

    isSamChiCuoi:function()
    {
        return (this.getChi3CardSuite().getBiggestSuiteType() == SAMCO);
    },

    isCuLuChi2:function()
    {
        return (this.getChi2CardSuite().getBiggestSuiteType() == CULU);
    },
    isTuQuyChi2:function()
    {
        return (this.getChi2CardSuite().getBiggestSuiteType() == TUQUY);
    },
    isTPSChi2:function()
    {
        return (this.getChi2CardSuite().getBiggestSuiteType() == THUNGPHASANH);
    },

    isTuQuyChi1:function()
    {
        return (this.getChi1CardSuite().getBiggestSuiteType() == TUQUY);
    },
    isTPSChi1:function()
    {
        return (this.getChi1CardSuite().getBiggestSuiteType() == THUNGPHASANH);
    },


    isMauBinh:function()
    {
        return this.isSanhRong() || this.is3CaiSanh() || this.is3CaiThung() || this.isLucPheBon() ;
    }
});