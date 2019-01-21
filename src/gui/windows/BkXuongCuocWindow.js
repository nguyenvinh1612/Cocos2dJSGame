/**
 * Created by bs on 09/05/2017.
 */
CXuongCuocWindow = {
    XUONG: 0,
    CHI: 1,
    THONG: 2,
    TOM: 3,
    LEO: 4,
    BACH_THU: 5,
    BACH_DINH: 6,
    TAM_DO: 7,
    BACH_THU_CHI: 8,
    CO_CHIU: 9,
    THIEN_KHAI: 10,
    CO_BON: 11,
    THIEN_U: 12,
    DIA_U: 13,
    CHIU_U: 14,
    U_BON: 15,
    THAP_THANH: 16,
    KINH_TU_CHI: 17,
    HOA_ROI_CUA_PHAT: 18,
    CA_LOI_SAN_DINH: 19,
    getStringFromCuocID:function(cID,nC)
    {
        if (nC == undefined){
            nC = 0;
        }
        if (cID == this.BACH_DINH) return "Bạch Định";
        if (cID == this.BACH_THU) return "Bạch Thủ";
        if (cID == this.BACH_THU_CHI) return "Bạch Thủ Chi";
        if (cID == this.CA_LOI_SAN_DINH) return "Cá Lội Sân Đình";
        if (cID == this.CHI) return "Chì";
        if (cID == this.CHIU_U) return "Chíu Ù";
        if (cID == this.CO_BON) {
            if (nC == 1){
                return "Có Ăn Bòn";
            } else {
                return ""+nC+" Ăn Bòn";
            }
        }

        if (cID == this.CO_CHIU) {
            if (nC == 1){
                return "Có Chíu";
            } else {
                return ""+nC+" Chíu";
            }
        }

        if (cID == this.DIA_U) return "Địa Ù";
        if (cID == this.HOA_ROI_CUA_PHAT) return "Hoa Rơi Cửa Phật";
        if (cID == this.KINH_TU_CHI) return "Kính Tứ Chi";
        if (cID == this.LEO) {
            if (nC == 1){
                return "Có Lèo";
            } else {
                return ""+nC+" Lèo";
            }
        }

        if (cID == this.TAM_DO) return "Tám Đỏ";
        if (cID == this.THAP_THANH) return "Thập Thành";
        if (cID == this.THIEN_KHAI) {
            if (nC == 1){
                return "Có Thiên Khai";
            } else {
                return ""+nC+" Thiên Khai";
            }
        }
        if (cID == this.THIEN_U) return "Thiên Ù";
        if (cID == this.THONG) return "Thông";
        if (cID == this.TOM)  {
            if (nC == 1){
                return "Có Tôm";
            } else {
                return ""+nC+" Tôm";
            }
        }
        if (cID == this.U_BON) return "Ù Bòn";
        if (cID == this.XUONG) return "Xuông";

        return "";
    },
    isCuocTypeCheck:function(cID){
        if (cID == this.TOM||cID == this.THIEN_KHAI||cID == this.LEO||cID == this.CO_CHIU||cID == this.CO_BON){
            return true;
        }
        return false;
    },
    InitCuocFromCuocID:function(cID)
    {
        var cData;
        if (cID == this.XUONG){
            cData = new CuocData(this.XUONG,"Xuông",true,2,0);
            cData.Priority = 0;
        }
        else if (cID == this.CHI){
            cData = new CuocData(this.CHI,"Chì",true,3,1);
            cData.Priority = 2;
        }
        else if (cID == this.THONG){
            cData = new CuocData(this.THONG,"Thông",true,3,1);
            cData.Priority = 1;
        }
        else if (cID == this.TOM){
            cData = new CuocData(this.TOM,"Tôm",false,4,1);
            cData.Priority = 16;
        }
        else if (cID == this.LEO){
            cData =new CuocData(this.LEO,"Lèo",false,5,2);
            cData.Priority = 15;
        }
        else if (cID == this.BACH_THU){
            cData = new CuocData(this.BACH_THU,"Bạch thủ",true,4,1);
            cData.Priority = 9;
        }
        else if (cID == this.BACH_DINH){
            cData = new CuocData(this.BACH_DINH,"Bạch định",true,7,4);
            cData.Priority = 12;
        }
        else if (cID == this.TAM_DO){
            cData = new CuocData(this.TAM_DO,"Tám đỏ",true,8,5);
            cData.Priority = 13;
        }
        else if (cID == this.BACH_THU_CHI){
            cData = new CuocData(this.BACH_THU_CHI,"Bạch thủ chi",true,6,3);
            cData.Priority = 10;
        }
        else if (cID == this.CO_CHIU){
            cData = new CuocData(this.CO_CHIU,"Có chíu",false,3,1);
            cData.Priority = 17;
        }
        else if (cID == this.THIEN_KHAI){
            cData = new CuocData(this.THIEN_KHAI,"Có thiên khai",false,3,1);
            cData.Priority = 18;
        }
        else if (cID == this.CO_BON){
            cData = new CuocData(this.CO_BON,"Có ăn bòn",false,3,1);
            cData.Priority = 19;
        }
        else if (cID == this.THIEN_U){
            cData = new CuocData(this.THIEN_U,"Thiên ù",true,3,1);
            cData.Priority = 3;
        }
        else if (cID == this.DIA_U){
            cData = new CuocData(this.DIA_U,"Địa ù",true,3,1);
            cData.Priority = 4;
        }
        else if (cID == this.CHIU_U){
            cData = new CuocData(this.CHIU_U,"Chíu ù",true,3,1);
            cData.Priority = 5;
        }
        else if (cID == this.U_BON){
            cData = new CuocData(this.U_BON,"Ù bòn",true,3,1);
            cData.Priority = 6;
        }
        else if (cID == this.THAP_THANH){
            cData = new CuocData(this.THAP_THANH,"Thập thành",true,12,9);
            cData.Priority = 11;
        }
        else if (cID == this.KINH_TU_CHI){
            cData = new CuocData(this.KINH_TU_CHI,"Kính tứ chi",true,12,9);
            cData.Priority = 14;
        }
        else if (cID == this.HOA_ROI_CUA_PHAT){
            cData = new CuocData(this.HOA_ROI_CUA_PHAT,"Hoa rơi cửa phật",true,20,17);
            cData.Priority = 7;
        }
        else if (cID == this.CA_LOI_SAN_DINH){
            cData = new CuocData(this.CA_LOI_SAN_DINH,"Cá lội sân đình",true,20,17);
            cData.Priority = 8;
        }
        return cData
    },
    convertArrayCuocToArrayCuocData:function(cuoc){

        var rtn = [];
        var pos =0;
        var lCuoc = cuoc.length;
        var i;
        var countCuoc;
        var iCuoc;
        while (pos<lCuoc){
            var cID = cuoc[pos];
            if (this.isCuocTypeCheck(cID)){
                countCuoc = 1;
                for (i=pos+1;i<lCuoc;i++){
                    var icID = cuoc[i];
                    if (icID==cID){
                        countCuoc++;
                    } else {
                        break;
                    }
                }
                iCuoc = this.InitCuocFromCuocID(cID);
                iCuoc.CuocNumber = countCuoc;
                rtn.push(iCuoc);
                pos+=countCuoc;
            } else {
                iCuoc = this.InitCuocFromCuocID(cID);
                rtn.push(iCuoc);
                pos++;
            }
        }

        // sort Array
        rtn.sort(sortOnPriority);
        function sortOnPriority(cuoc1,cuoc2){
            if (cuoc1.Priority > cuoc2.Priority){
                return 1;
            } else if(cuoc1.Priority < cuoc2.Priority){
                return -1;
            } else{
                return 0;
            }
        }
        return rtn;
    },
    getStringXuongCuoc:function(cuoc)
    {
        var arr = this.convertArrayCuocToArrayCuocData(cuoc);
        return this.getStringXuongCuocWithListCuoc(arr);
    },
    getStringXuongCuocWithListCuoc:function(arr)
    {
        var rtn = "";
        for(var i = 0;i<arr.length;i++){
            var iLC = arr[i];
            if(iLC.isCuocTypeCheck){
                rtn+= this.getStringFromCuocID(iLC.CuocID)+", ";
            } else {
                rtn+= this.getStringFromCuocID(iLC.CuocID,iLC.CuocNumber)+", ";
            }
        }
        return rtn.substring(0,rtn.length-2);
    },


// list sound name
// XUONG: "xuong.vv" , "uxuongbatcaitien.vv"
// CHI: "chi.vv"
// THONG: "thong.vv"
// TOM: "tom.vv", "haitom.vv", "batom.vv", "bontom.vv"
// LEO: "leo.vv", "haileo.vv", "baleo.vv", "bonleo.vv"
// BACH_THU: "bachthu.vv"
// BACH_DINH: "bachdinh.vv" , "bachdinhchonhimottithilen.vv"
// TAM_DO: "tamdo.vv"
// BACH_THU_CHI: "bachthuchi.vv"
// CO_CHIU: "cochiu.vv", "haichiu.vv", "bachiu.vv", "bonchiu.vv",
// THIEN_KHAI: "cothienkhai.vv", "haithienkhai.vv", "bathienkhai.vv", "bonthienkhai.vv"
// CO_BON: "cobon.vv", "haibon.vv", "babon.vv", "bonbon.vv"
// THIEN_U: "thienu.vv"
// DIA_U: "dia_u.vv"
// CHIU_U: "chiuu.vv"
// U_BON: "ubon.vv"
// THAP_THANH: "thapthanh.vv"
// KINH_TU_CHI: "kinhtuchi.vv"
// HOA_ROI_CUA_PHAT: "hoaroicuaphat.vv"
// CA_LOI_SAN_DINH: "caloisandinh.vv"

    getArraySoundFrom:function(arrCuoc){
        var rtn = [];
        var arr = this.convertArrayCuocToArrayCuocData(arrCuoc);
        for(var i = 0;i<arr.length;i++){
            var iLC = arr[i];
            var strSoundName = this.getStringSoundNameWith(iLC);
            logMessage("cuoc "+ iLC.CuocText+" so cuoc: "+iLC.CuocNumber+" file sound: "+ strSoundName);
            rtn.push(strSoundName);
        }
        return rtn;
    },
    getStringSoundNameWith:function(data){

        if (data.CuocID == this.XUONG) { return "xuong.mp3";}
        if (data.CuocID == this.CHI) { return "chi.mp3";}
        if (data.CuocID == this.THONG) { return "thong.mp3";}
        if (data.CuocID == this.BACH_THU) { return "bachthu.mp3";}
        if (data.CuocID == this.BACH_DINH) { return "bachdinh.mp3";}
        if (data.CuocID == this.TAM_DO) { return "tamdo.mp3";}
        if (data.CuocID == this.BACH_THU_CHI) { return "bachthuchi.mp3";}
        if (data.CuocID == this.THIEN_U) { return "thienu.mp3";}
        if (data.CuocID == this.DIA_U) { return "dia_u.mp3";}
        if (data.CuocID == this.CHIU_U) { return "chiuu.mp3";}
        if (data.CuocID == this.U_BON) { return "ubon.mp3";}
        if (data.CuocID == this.THAP_THANH) { return "thapthanh.mp3";}
        if (data.CuocID == this.KINH_TU_CHI) { return "kinhtuchi.mp3";}
        if (data.CuocID == this.HOA_ROI_CUA_PHAT) { return "hoaroicuaphat.mp3";}
        if (data.CuocID == this.CA_LOI_SAN_DINH) { return "caloisandinh.mp3";}



        if (data.CuocID == this.TOM) { return this.getTomWithNumber(data.CuocNumber);}
        if (data.CuocID == this.LEO) { return this.getLeoWithNumber(data.CuocNumber);}
        if (data.CuocID == this.CO_CHIU) { return this.getChiuWithNumber(data.CuocNumber);}
        if (data.CuocID == this.THIEN_KHAI) { return this.getThienKhaiWithNumber(data.CuocNumber);}
        if (data.CuocID == this.CO_BON) { return this.getBonWithNumber(data.CuocNumber);}

        return "";
    },
    getBonWithNumber:function(cn)
    {
        // CO_BON: "cobon.vv", "haibon.vv", "babon.vv", "bonbon.vv"
        if (cn == 1){ return "cobon.mp3";}
        if (cn == 2){ return "haibon.mp3";}
        if (cn == 3){ return "babon.mp3";}
        if (cn == 4){ return "bonbon.mp3";}
        return "";
    },
    getThienKhaiWithNumber:function(cn)
    {
        // THIEN_KHAI: "cothienkhai.vv", "haithienkhai.vv", "bathienkhai.vv", "bonthienkhai.vv"
        if (cn == 1){ return "cothienkhai.mp3";}
        if (cn == 2){ return "haithienkhai.mp3";}
        if (cn == 3){ return "bathienkhai.mp3";}
        if (cn == 4){ return "bonthienkhai.mp3";}
        return "cothienkhai.mp3";
    },
    getChiuWithNumber:function(cn)
    {
        // CO_CHIU: "cochiu.vv", "haichiu.vv", "bachiu.vv", "bonchiu.vv",
        if (cn == 1){ return "cochiu.mp3";}
        if (cn == 2){ return "haichiu.mp3";}
        if (cn == 3){ return "bachiu.mp3";}
        if (cn == 4){ return "bonchiu.mp3";}
        return "cochiu.mp3";
    },
    getLeoWithNumber:function(cn)
    {
        // LEO: "leo.vv", "haileo.vv", "baleo.vv", "bonleo.vv"
        if (cn == 1){ return "leo.mp3";}
        if (cn == 2){ return "haileo.mp3";}
        if (cn == 3){ return "baleo.mp3";}
        if (cn == 4){ return "bonleo.mp3";}
        return "leo.mp3";
    },
    getTomWithNumber:function(cn)
    {
        // TOM: "tom.vv", "haitom.vv", "batom.vv", "bontom.vv"
        if (cn == 1){ return "tom.mp3";}
        if (cn == 2){ return "haitom.mp3";}
        if (cn == 3){ return "batom.mp3";}
        if (cn == 4){ return "bontom.mp3";}
        return "tom.mp3";
    },
    isAnGaGop:function(arrCuoc)
    {
        for (var i =0;i<arrCuoc.length;i++){
            var cuocID = arrCuoc[i];
            if (this.isCLSD(cuocID) || this.isHRCP(cuocID)){
                return true;
            }
        }

        if ( (this.haveCuocChi(arrCuoc)) && (this.haveBachThu(arrCuoc)) ){
            return true;
        }
        return false;
    },
    isCLSD:function(cuocID){
        if (cuocID == this.CA_LOI_SAN_DINH){
            return true;
        }
        return false;
    },
    isHRCP:function(cuocID){
        if (cuocID == this.HOA_ROI_CUA_PHAT){
            return true;
        }
        return false;
    },
    haveCuocChi:function(arrCuoc){
        for (var i =0;i<arrCuoc.length;i++){
            var cuocID = arrCuoc[i];
            if (cuocID == this.CHI){
                return true;
            }
        }
        return false;
    },
    haveBachThu:function(arrCuoc)
    {
        for (var i =0;i<arrCuoc.length;i++){
            var cuocID = arrCuoc[i];
            if ((cuocID == this.BACH_THU) || (cuocID == this.BACH_THU_CHI)){
                return true;
            }
        }
        return false;
    }
};
BkXuongCuocWindow = VvWindow.extend({
    listCuoc:null,
    bgWd:null,
    numberSprite:null,
    curentCuocSprite:null,
    ctor:function(){
        this._super("",cc.size(183,600));
        this.setVisibleTop(false);
        this.setVisibleBgBody(false);
        this._bgBody.visible = false;

        this.setVisibleOutBackgroundWindow(false);
        this.setMoveableWindow(true);
        this.bgWd = new BkSprite("#"+res_name.danhsachcuocu_header);
        this.bgWd.x = this.getWindowSize().width/2;
        this.bgWd.y = this.getWindowSize().height - this.bgWd.getContentSize().height/2;
        this.addChildBody(this.bgWd, WD_ZORDER_BODY);
        var bgWdBody = new BkSprite("#"+res_name.danhsachcuocu_body);
        bgWdBody.x = this.getWindowSize().width/2;
        bgWdBody.y = this.bgWd.y - this.bgWd.getContentSize().height/2 - bgWdBody.getContentSize().height/2;
        this.addChildBody(bgWdBody, WD_ZORDER_BODY);
        this._btnClose.visible = false;
        this.initListCuoc();
        this.drawUI();
    },
    initListCuoc:function()
    {
        this.listCuoc = [];
        var cuocXuong = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.XUONG);
        this.listCuoc.push(cuocXuong);

        var cuocThong = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.THONG);
        this.listCuoc.push(cuocThong);

        var cuocChi = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.CHI);
        this.listCuoc.push(cuocChi);

        var cuocLeo = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.LEO);
        this.listCuoc.push(cuocLeo);

        var cuocTom = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.TOM);
        this.listCuoc.push(cuocTom);

        var cuocBachThu = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.BACH_THU);
        this.listCuoc.push(cuocBachThu);

        var cuocBachThuChi = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.BACH_THU_CHI);
        this.listCuoc.push(cuocBachThuChi);

        var cuocTamDo = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.TAM_DO);
        this.listCuoc.push(cuocTamDo);

        var cuocBachDinh = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.BACH_DINH);
        this.listCuoc.push(cuocBachDinh);

        var cuocChiu = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.CO_CHIU);
        this.listCuoc.push(cuocChiu);

        var cuocThienKhai = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.THIEN_KHAI);
        this.listCuoc.push(cuocThienKhai);

        var cuocBon = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.CO_BON);
        this.listCuoc.push(cuocBon);

        var cuocChiuU = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.CHIU_U);
        this.listCuoc.push(cuocChiuU);

        var cuocUBon = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.U_BON);
        this.listCuoc.push(cuocUBon);

        var cuocKinhTuChi = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.KINH_TU_CHI);
        this.listCuoc.push(cuocKinhTuChi);

        var cuocThapThanh = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.THAP_THANH);
        this.listCuoc.push(cuocThapThanh);

        var cuocThienU = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.THIEN_U);
        this.listCuoc.push(cuocThienU);

        var cuocDiaU = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.DIA_U);
        this.listCuoc.push(cuocDiaU);

        var cuocHRCP = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.HOA_ROI_CUA_PHAT);
        this.listCuoc.push(cuocHRCP);

        var cuocCLSD = CXuongCuocWindow.InitCuocFromCuocID(CXuongCuocWindow.CA_LOI_SAN_DINH);
        this.listCuoc.push(cuocCLSD);
    },
    drawUI:function()
    {
        var lastY = this.bgWd.y - this.bgWd.getContentSize().height/2 - 20;
        var lastX = 92;
        for (var i = 0; i<this.listCuoc.length; i++){
            var iCuocData = this.listCuoc[i];
            var iCuocSprite;
            iCuocSprite = new BkCuocSprite(iCuocData,this);
            iCuocSprite.y = lastY;
            iCuocSprite.x = lastX;
            lastY -= 27;//iCuocSprite.getContentSize().height - 2;
            this.addChildBody(iCuocSprite);
        }
    },
    onOverCuocSpriteItem:function(cS){
        //logMessage("set curentCuocSprite "+cS.Cdata.CuocText);
        this.curentCuocSprite = cS;
        var nCData;
        nCData = cS.Cdata;
        if (nCData.isCuocTypeCheck){
            if ((this.numberSprite!=null)){
                //this.numberSprite.visible = false;
                this.numberSprite.removeFromParent();
            }
        }else{
            this.createUINumber(nCData.CuocID ==CXuongCuocWindow.THIEN_KHAI);
        }
    },
    UpdateUICuocSprite:function(icp) {
        if (this.curentCuocSprite == null){
            logMessage("this.curentCuocSprite = null");
            return;
        }
        var nCData = icp.Cdata;

        // remove old data
        if (nCData.isCuocTypeCheck){
            nCData.isCheck = !nCData.isCheck;
        } else {
            var maxValue = 4;
            var isThienKhai = false;
            if (nCData.CuocID == CXuongCuocWindow.THIEN_KHAI){
                maxValue = 5;
                isThienKhai = true;
            }
            if (nCData.CuocNumber < maxValue){
                nCData.isCheck = true;
                nCData.CuocNumber+=1;
            } else {
                nCData.isCheck = false;
                nCData.CuocNumber = 0;
            }

            if (this.listSpriteNumber == null){
                this.createUINumber(isThienKhai);
            }
            this.updateColorBG(this.curentCuocSprite.Cdata.CuocNumber);
        }
        this.doUpdateUICuocSprite(icp,nCData);
    },

    createUINumber:function(isThienKhai){
        var iNoCuocSprite;
        var i;
        if (this.numberSprite != null){
            this.numberSprite.removeFromParent();
        }
        this.numberSprite = new BkSprite();
        if (this.listSpriteNumber!=null){
            this.listSpriteNumber= null;
        }

        this.listSpriteNumber = [];
        var beginY =-45;
        var tfMarginLeft = 5;
        var maxChild;
        if (isThienKhai){
            // set image BG thien khai
            this.imgCuocNumberHoverBG = new BkSprite("#"+ res_name.cuoc_u_hover_6);
            maxChild = 6;
            beginY = - 55;
        } else {
            // set image BG not thien khai
            this.imgCuocNumberHoverBG = new BkSprite("#"+ res_name.cuoc_u_hover_5);
            maxChild = 5;
        }

        var self = this;
        var isHover= false;
        this.imgCuocNumberHoverBG.setMouseOnHover(function () {
            logMessage("data = "+self.curentCuocSprite.Cdata.CuocText);
            self.curentCuocSprite.ishoverNumberCuoc = true;
            if (self.numberSprite){
                self.numberSprite.visible = true;
            }
            isHover = true;
        },function () {
            self.curentCuocSprite.ishoverNumberCuoc = false;
            if (isHover){
                self.numberSprite.removeFromParent();
                self.numberSprite = null;
                isHover = false;
            } else {
                self.numberSprite.visible = false;
            }
            self.curentCuocSprite.setVisibleBGOver(false);
        });

        //imgCuocNumberHoverBG.smoothing= true;
        this.numberSprite.addChild(this.imgCuocNumberHoverBG);
        for ( i=0;i<maxChild;i++){
            iNoCuocSprite = new BkNumberCuoc(i,this);
            iNoCuocSprite.x = tfMarginLeft;
            iNoCuocSprite.y = beginY+i*22;//iNoCuocSprite.height;
            this.numberSprite.addChild(iNoCuocSprite);
            this.listSpriteNumber[i] = iNoCuocSprite;
        }
        var iNo;

        // config pos for menu Number
        this.numberSprite.x = this.curentCuocSprite.x + 120;// + curentCuocSprite.width - 18;
        this.numberSprite.y = this.curentCuocSprite.y ;//+ curentCuocSprite.height * 0.5 - numberSprite.height * 0.5;// - 55;
        this.addChildBody(this.numberSprite);
        this.updateColorBG(this.curentCuocSprite.Cdata.CuocNumber);

        var self = this;
        function onOverNumberSprite(){
            self.curentCuocSprite.setVisibleBGOver(true);
        }
        function onOutNumberSprite(){
            self.curentCuocSprite.setVisibleBGOver(false);
        }

        var myEvent = this.numberSprite.createHoverEvent(function (event) {
            onOverNumberSprite();
        }, function (event) {
            onOutNumberSprite();
        }, function (event) {

        });


    },
    onClickNumberCuoc:function(o){
        var nCData = this.curentCuocSprite.Cdata;
        nCData.CuocNumber = o.NoData;
        if (o.NoData == 0){
            nCData.isCheck = false;
        } else {
            nCData.isCheck = true;
        }
        this.doUpdateUICuocSprite(this.curentCuocSprite,nCData);

        this.curentCuocSprite.ishoverNumberCuoc = false;
        this.curentCuocSprite.setVisibleBGOver(false);
        if (this.numberSprite != null){
            this.numberSprite.removeFromParent();
        }
    },
    updateColorBG:function(No){
        if (this.listSpriteNumber){
            var iNoCuocSprite;
            for (var i=0;i<this.listSpriteNumber.length;i++){
                iNoCuocSprite = this.listSpriteNumber[i];
                iNoCuocSprite.hideAll();
            }
            iNoCuocSprite = this.listSpriteNumber[No];
            iNoCuocSprite.setSelectedSprite();
        }
    },
    doUpdateUICuocSprite:function(icp,nCData){
        for (var i= 0; i<this.listCuoc.length;i++){
            var iCuocData = this.listCuoc[i];
            if (iCuocData.CuocID == nCData.CuocID){
                this.listCuoc[i] = nCData;
                break;
            }
        }
        //listCuoc[nCData.CuocID] = nCData;
        icp.updateData(nCData);
        this.getParentWindow().xctw.setTextContent(this.getStringXuong());
    },
    getStringXuong:function(){
        var arr = this.getArrayCuocCheckAfterSort();
        return CXuongCuocWindow.getStringXuongCuocWithListCuoc(arr);
    },
    getArrayCuocCheckAfterSort:function(){
        var arr = [];
        for(var i = 0;i<this.listCuoc.length;i++){
            var iLC = this.listCuoc[i];
            if(iLC.isCheck){
                arr.push(iLC);
            }
        }

        // sort array
        arr.sort(sortOnPriority);
        function sortOnPriority(cuoc1,cuoc2){
            if (cuoc1.Priority > cuoc2.Priority){
                return 1;
            } else if(cuoc1.Priority < cuoc2.Priority){
                return -1;
            } else{
                return 0;
            }
        }
        return arr;
    },
    getArrayXuong:function(){
        var rtn = [];
        var arr = this.getArrayCuocCheckAfterSort();

        for(var i = 0;i<arr.length;i++){
            var iLC = arr[i];
            if(iLC.isCuocTypeCheck){
                rtn.push(iLC.CuocID);
            } else {
                for (var j = 0;j<iLC.CuocNumber;j++){
                    rtn.push(iLC.CuocID);
                }
            }
        }
        return rtn;
    }
});