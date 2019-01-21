/**
 * Created by bs on 09/05/2017.
 */
CuocData = cc.Class.extend({
    CuocID:0,
    CuocText:null,
    isCuocTypeCheck:false,
    CuocNumber:0,
    Diem:0,
    Dich:0,
    isCheck:false,
    Priority:0,
    ctor:function(id,txt,icb,d,dic)
    {
        this.CuocID=id;
        this.CuocText = txt;
        this.isCuocTypeCheck = icb;
        this.Diem = d;
        this.Dich = dic;
        this. CuocNumber = 0;
        this.isCheck = false;
    }
});