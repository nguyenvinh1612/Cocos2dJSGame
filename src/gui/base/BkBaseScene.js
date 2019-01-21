/**
 * Created by bs on 29/09/2015.
 */
var BkBaseScene = cc.Scene.extend({
    _className:"BkBaseScene",
    ctor:function () {
        this._super();
        this.init();
    }
});

//BkBaseScene.create = function () {
//    return new BkBaseScene();
//};