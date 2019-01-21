/**
 * Created by bs on 09/05/2017.
 */
 ChanError = {
     KHONG_LOI:0,
     AN_TREO_TRANH: 1, 			// OK - Ko bi bao
     CHIU_LAI_AN_THUONG:2, 	// OK - Ko bi bao
     AN_CHON_CA: 3, // OK
     AN_CA_CHUYEN_CHO:4, // OK
     CO_CHAN_CAU_CA: 5, // OK
     BO_AN_CHAN: 6, // OK
     BO_CA_AN_CA: 8, // OK
     BO_CHAN_DANH_CHAN: 9, // OK
     DANH_CA_ROI_AN_CA: 10, // OK
     XE_CA_AN_CA: 11, // OK
     DANH_ROI_AN_LAI: 12, // OK
     DANH_DOI_CHAN: 13, // OK
     AN_ROI_DANH_LAI: 14, // OK
     AN_CA_ROI_AN_CHAN_CUNG_HANG: 15, // OK
     AN_CA_ROI_DANH_CA: 16, // OK
     AN_CA_DANH_CON_CUNG_HANG: 17, //OK
     TRA_CUA_ROI_AN_LAI: 18,
     KHONG_TIM_THAY_BAI: 20,
     KHONG_PHAI_CA: 21,
     CHO_CHI_RONG: 22,
     XUONG_CUOC_SAI: 30,

    isTreotranh:function(errCode)
    {
        if ((errCode < 6) && (errCode > 0)) {
            return true;
        }
        if (errCode == this.CHO_CHI_RONG) {
            return true;
        }
        return false;
    },
    getErrorDescription:function(errCode)
    {
        var  des = "không xác định";
        switch (errCode) {
            case this.AN_TREO_TRANH:
                des = "ăn treo tranh";
                break;
            case this.CHIU_LAI_AN_THUONG:
                des = "chíu được nhưng lại ăn thường";
                break;
            case this.AN_CHON_CA:
                des = "lấy cạ có sẵn để ăn cạ";
                break;
            case this.AN_CA_CHUYEN_CHO:
                des = "ăn cạ chuyển chờ";
                break;
            case this.CO_CHAN_CAU_CA:
                des = "lấy quân trong chắn để ăn cạ";
                break;
            case this.BO_AN_CHAN:
                des = "bỏ chắn ăn chắn hoặc cạ";
                break;
            case this.BO_CA_AN_CA:
                des = "bỏ cạ ăn cạ";
                break;
            case this.BO_CHAN_DANH_CHAN:
                des = "bỏ chắn đánh chắn";
                break;
            case this.DANH_CA_ROI_AN_CA:
                des = "đã đánh cạ rồi lại ăn cạ";
                break;
            case this.XE_CA_AN_CA:
                des = "xé cạ ăn cạ";
                break;
            case this.DANH_ROI_AN_LAI:
                des = "đánh rồi ăn lại đúng cây đó";
                break;
            case this.DANH_DOI_CHAN:
                des = "đánh cả 2 cây trong chắn";
                break;
            case this.AN_ROI_DANH_LAI:
                des = "ăn rồi đánh lại đúng cây đó";
                break;
            case this.AN_CA_ROI_AN_CHAN_CUNG_HANG:
                des = "ăn cạ rồi ăn chắn cùng hàng";
                break;
            case this.AN_CA_ROI_DANH_CA:
                des = "đã ăn cạ rồi lại đánh cạ";
                break;
            case this.AN_CA_DANH_CON_CUNG_HANG:
                des = "ăn cạ đánh con cùng hàng";
                break;
            case this.KHONG_PHAI_CA:
                des = "ăn bài không tạo thành cạ hoặc chắn";
                break;
            case this.KHONG_TIM_THAY_BAI:
                des = "không tìm thấy quân đánh";
                break;
            case this.TRA_CUA_ROI_AN_LAI:
                des = "ăn lại quân mình trả cửa";
                break;
            case this.CHO_CHI_RONG:
                des = "chờ chi rộng";
                break;
        }
        return des;
    }
 };

