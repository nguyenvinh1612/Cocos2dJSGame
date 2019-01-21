/**
 * Created by bs on 12/10/2015.
 */
BkRadioButtonGroup = cc.Class.extend({
    listRadio:null,
    onSelectedCallBack:null,
    ctor:function(){
        this.listRadio = [];
    },
    addRadioButton:function(rd){
        this.listRadio.push(rd);

        if (this.listRadio.length == 1){
            // default select radiobutton 0
            rd.setSelected(true);
            rd.radio.setTouchEnabled(false);
            if (this.onSelectedCallBack != null){
                this.onSelectedCallBack();
            }
        }
    },
    onSelectedGroud:function(id){
        for (var i=0;i<this.listRadio.length;i++){
            var iRD = this.listRadio[i];
            if (iRD.getRadioButtonId() != id){
                iRD.setSelected(false);
                iRD.radio.setTouchEnabled(true);
            } else{
                iRD.radio.setTouchEnabled(false);
                if (this.onSelectedCallBack != null){
                    this.onSelectedCallBack();
                }
            }
        }
    },
    getRadioButtonSelected:function(){
        for (var i=0;i<this.listRadio.length;i++){
            var iRD = this.listRadio[i];
            if (iRD.isSelected()){
                return iRD;
            }
        }

        return null;
    },
    setEnableRadioGroup:function(isEnable){
        for (var i=0;i<this.listRadio.length;i++){
            var iRD = this.listRadio[i];
            iRD.setEnableRadioButton(isEnable);
        }
    },
    setOnSelectedCallback:function(cb){
        this.onSelectedCallBack = cb;
    },
    setRadioSelected:function(radio){
        for (var i=0;i<this.listRadio.length;i++){
            var iRD = this.listRadio[i];
            iRD.radio.setTouchEnabled(true);
            if (iRD.getRadioButtonId() != radio.getRadioButtonId()){
                iRD.setSelected(false);
            }
        }
        radio.setSelected(true);
    },

    setSelectRadio:function(val) {
        for (var i=0; i< this.listRadio.length; i++) {
            var iRD = this.listRadio[i];
            iRD.setSelected(iRD.getRadioButtonId() == val);
        }
    },
    getRadioButtonAt:function (i) {
        return this.listRadio[i];
    },
    getSelectedData:function () {
        var rd = this.getRadioButtonSelected();
        return rd.data.value;
    }
});