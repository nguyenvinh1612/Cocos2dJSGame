/**
 * Created by bs on 28/10/2015.
 */
BkLoaderScene = cc.Scene.extend({
    isPauseEvent:false,
    _interval : null,
    _label : null,
    _className:"LoaderScene",
    cb: null,
    target: null,
    background:null,

    init : function(){
        var self = this;

        //logo
        var logoWidth = 160;
        var logoHeight = 200;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(255, 255, 255, 0));
        logMessage("custom BG");
        //var bgLayer = self._bgLayer = new cc.Layer();
        //var size = cc.winSize;
        //var background = new BkSprite(res.Bg_Default);
        //background.scaleX = size.width / background.getWidth();//this.background._contentSize.width;
        //background.scaleY = size.height / background.getHeight();//this.background._contentSize.height;
        //background.attr({
        //    x: size.width / 2,
        //    y: size.height / 2
        //});
        //bgLayer.addChild(background, 0);

        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        var fontSize = 24, lblHeight =  -logoHeight / 2 + 100;
        if(cc._loaderImage){
            //loading logo
            //cc.loader.loadImg(cc._loaderImage, {isCrossOrigin : false }, function(err, img){
            //    logoWidth = img.width;
            //    logoHeight = img.height;
            //    self._initStage(img, cc.visibleRect.center);
            //});
            fontSize = 14;
            lblHeight = -logoHeight / 2 - 10;
        }
        //loading percent
        var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(this._label, 10);
        return true;
    },

    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        //self._bgLayer.addChild(logo, 10);
    },
    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
        if (!BkConnectionManager.isOpenConnection()){
            BkConnectionManager.initWithUrl();
        }
    },
    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.releaseAll();
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString("Loading... " + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
            });
    }
});

var bkloaderScene = null;
BkLoaderScene.preload = function(resources, cb, target){
    if(!bkloaderScene) {
        bkloaderScene = new BkLoaderScene;
        bkloaderScene.init();
    }
    cc.director.runScene(bkloaderScene);

    bkloaderScene.initWithResources(resources, cb, target);


    return bkloaderScene;
};