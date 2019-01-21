/**
 * Created by bs on 03/10/2015.
 */
BkCheckBox = ccui.CheckBox.extend({
    ctor:function(){
        this._super();
        this.setTouchEnabled(true);
        //cc.spriteFrameCache.addSpriteFrames(res.btn_sprite_sheet_plist, res.btn_sprite_sheet_img);
        //this.loadTextures("res/CheckBoxAsset/checkbox_unchecked.png",
        //    "res/CheckBoxAsset/checkbox_unchecked_hover.png",
        //    "res/CheckBoxAsset/checkbox_checked.png",
        //    "res/CheckBoxAsset/checkbox_unchecked_disable.png",
        //    "res/CheckBoxAsset/checkbox_checked_disable.png");

        this.loadTextures(res_name.checkbox_unchecked,
            res_name.checkbox_unchecked_hover,
            res_name.checkbox_checked,
            res_name.checkbox_unchecked_disable,
            res_name.checkbox_checked_disable,ccui.Widget.PLIST_TEXTURE);
    },
    setEnableCheckBox:function(isEnable){
        this.setBright(isEnable);
        this.setTouchEnabled(isEnable);
    }
});