
getFullImagePath = function(fileName){
	var imgPath = jsb.fileUtils.getWritablePath();
	//var sp = [];
	//sp.push(imgPath);
	//jsb.fileUtils.setSearchPaths(sp);
	imgPath += fileName;
	return imgPath;
};

saveTexture = function(texture,fileName){
	var mySprite = new cc.Sprite();
	var size = cc.winSize;
    mySprite.initWithTexture(texture);
//	mySprite.attr({
//		x: size.width / 2,
//		y: size.height / 2
//	});
    var mySpWid = mySprite.getContentSize().width;
    var mySpHei = mySprite.getContentSize().height;
    var tex = new cc.RenderTexture(mySpWid, mySpHei, cc.Texture2D.PIXEL_FORMAT_RGBA8888);
    tex.setPosition(cc.p(mySpWid / 2, mySpHei / 2));
    tex.begin();
    mySprite.visit();
    tex.end();
    
    var imgPath = jsb.fileUtils.getWritablePath();
    if (imgPath.length == 0) {
    	logMessage("can't get imgPath");
        return "";
    }
    
    var result = tex.saveToFile(fileName, cc.IMAGE_FORMAT_JPEG);//IMAGE_FORMAT_PNG;IMAGE_FORMAT_JPEG
    if (result) {
        imgPath += fileName;
        logMessage("save image success to: " + imgPath);
        return imgPath;
    } else {
    	logMessage("save image fail:");
    	return "";
    }
    
};

logMessage = function(mess){

    if (cc.lastLog == null){
        cc.lastLog = [];
    }

    if(cc.lastLog.length > 200){
        cc.lastLog.shift();
    }
    cc.lastLog.push(mess);

    cc.log(mess);
};


showToastMessage = function(mess,xPos,yPos,timeAutoHide,mWid){
    BkToolTipManager.showToastMessage(mess,xPos,yPos,timeAutoHide,mWid);
};
hideToastMessage = function(){
    BkToolTipManager.hideToastMessage();
};
/*
 * creat singleton tooltip object
 * */
var BkToolTipManager = {
    toolTip:null,
    showToastMessage:function(mess,xPos,yPos,timeAutoHide,mWid){
        // if (this.toolTip != null){
        //     this.toolTip.finishAutoHide();
        // }
        //
        // var currScene = getCurrentScene();
        // if((BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP) && currScene && currScene instanceof BkIngame){
        //     this.toolTip = new BkToolTip(res_name.ChessToast);
        //     this.toolTip.setTextColor(cc.color.WHITE);
        // }
        // else{
        //     // this.toolTip = new BkToolTip(res_name.ToastBG_png);
        //     // this.toolTip.setTextColor(cc.color(0x9c,0xf3,0xfb));
        //
        //     this.toolTip = new BkToolTip(res_name.vv_toast_background);
        //     this.toolTip.setTextColor(cc.color(255,255,255));
        //
        // }
        //
        // if ((mWid != undefined)&& (mWid != null)){
        //     this.toolTip.setWidthToolTip(mWid);
        // }
        // /*
        //  else{
        //  mWid = mess.length * 3;
        //  if(mWid > 180) {
        //  this.toolTip.setWidthToolTip(mWid);
        //  }
        //  }*/
        // //#9cf3fd
        // this.toolTip.setContentText(mess);
        //
        // var timeAH = 3;
        // if ((timeAutoHide != undefined)&& (timeAutoHide != null)){
        //     timeAH = timeAutoHide;
        // }
        // var self = this;
        // this.toolTip.setRemoveCallback(function(){
        //     self.toolTip = null;
        // });
        // this.toolTip.setAutoHideAfter(timeAH);
        //
        // // truongbs++ test customFont & invisible background toast & fix position of toast
        // //this.toolTip.textLabel.setFontName(res_name.GAME_FONT_BOLD);
        // //this.toolTip.textLabel.enableStroke(cc.color(0,0,0),2);
        // //this.toolTip.background.setVisible(false);
        // if (xPos == undefined){
        //     xPos = cc.winSize.width /2 ;//- this.toolTip.textLabel.getContentSize().width/2;
        //     yPos = cc.winSize.height/2 + 90;
        // }
        // this.toolTip.show(xPos,yPos);
    },
    hideToastMessage:function(){
        // if (this.toolTip != null){
        //     this.toolTip.finishAutoHide();
        // }
    }
};


cc.Sequence.createWithArray = function(arr) {
    if (arr.length === 0) {
        return cc.sequence();
    } else if (arr.length === 1) {
        return cc.sequence(arr[0]);
    } else if (arr.length === 2) {
        return cc.sequence(arr[0], arr[1]);
    } else {
        var last = arr.pop();
        return cc.sequence(cc.Sequence.createWithArray(arr), last);
    }
};



