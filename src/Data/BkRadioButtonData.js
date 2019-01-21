/**
 * Created by bs on 12/10/2015.
 */
BkRadioButtonData = cc.Class.extend({
    id:null,
    value:null,
    description:null,
    ctor:function(mID,mValue,des){
        this.id = mID;
        this.value = mValue;
        if (des != undefined){
            this.description = des;
        } else {
            this.description = "";
        }
    }
});