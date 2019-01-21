
getFullImagePath = function(fileName){
	var imgPath = jsb.fileUtils.getWritablePath();
	imgPath += fileName;
	return imgPath;
};

httpRequest = function(url, callback)
{
	var request = cc.loader.getXMLHttpRequest();
    request.open("GET", url, true);
    request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            //get status text
            var httpStatus = request.statusText;
            var respondText = request.responseText;
            
            var byteArr = StringToByteArray(respondText);
            cc.log("byteArr "+byteArr.length+" "+byteArr[0]);
            
            if(callback != null){
                request.readyState === 4 && request.status === 200
                    ? callback(null, respondText) : callback(errInfo);

            }
        }
    };
    request.send();
};
getFileExtension = function(fileName)
{
	return fileName.split('.').pop();
};
addSpriteFrames = function(plistName,pngName)
{
	logMessage("addSpriteFrames:" + plistName + " pngName:" + pngName);
	var isPlistExist = jsb.fileUtils.isFileExist(getFullPathFile(plistName));
	var isPngExist = jsb.fileUtils.isFileExist(getFullPathFile(pngName));
	logMessage("isPlistExist:" + isPlistExist + "isPngExist:" + isPngExist);
	if(isPlistExist && isPngExist)
	{
        return cc.spriteFrameCache.addSpriteFrames(getFullPathFile(plistName),getFullPathFile(pngName));
	}
	if(isPlistExist)
	{
        return cc.spriteFrameCache.addSpriteFrames(getFullPathFile(plistName),pngName);
	}
	if(isPngExist)
	{
        return cc.spriteFrameCache.addSpriteFrames(plistName,getFullPathFile(pngName));
	}
	return cc.spriteFrameCache.addSpriteFrames(plistName,pngName);
};
getFullPathFile = function(fileName)
{
	var fName = getFileNameFromFileServerDir(fileName);
	return jsb.fileUtils.getWritablePath() + fName;
};
getFileNameFromFileServerDir = function(fileName)
{
	  var slashPos = fileName.lastIndexOf("/");
      return fileName.substring(slashPos + 1, fileName.length);
};
addClickButton = function (layer) {
    var clickEvent = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            //var location = touch.getLocation();
        	//logMessage("locationX:" + location.x);
        	//logMessage("locationY:" + location.y);
        	showToastMessage("X:" + location.x + " \nY:" + location.y ,location.x,location.y);
        }
    }, this);
    cc.eventManager.addListener(clickEvent, layer);
};
compareVersion = function(clientVersion, serverVersion, minRequiredVersion) 
{
   var clientVersionInfos = getVersionInfos(clientVersion);
   var serverVersionInfos = getVersionInfos(serverVersion);
   var minVersionInfos = getVersionInfos(minRequiredVersion);
    
    for (var i = 0; i < 3; i++) 
    {
        if (clientVersionInfos[i] < minVersionInfos[i]) 
        {
            return VersionCompareResult.MajorUpdate;
        }
        else if (clientVersionInfos[i] > minVersionInfos[i]) {
            break;
        }
    }
    
    for (var i = 0; i < 3; i++) {
        if (clientVersionInfos[i] < serverVersionInfos[i]) {
            return VersionCompareResult.MinorUpdate;
        }
        else if (clientVersionInfos[i] > serverVersionInfos[i]) {
            break;
        }
    }
    
    return VersionCompareResult.Same;
}

getVersionInfos = function(version) {
    var s = version;
    var firstPointPosition, secondPointPosition;
    firstPointPosition = s.indexOf(".");
    secondPointPosition = s.indexOf(".", firstPointPosition + 1);
    var s0 = s.substr(0, firstPointPosition);
    var s1 = s.substr(firstPointPosition + 1, secondPointPosition - firstPointPosition - 1);
    var s2 = s.substr(secondPointPosition + 1, s.length - secondPointPosition - 1);
    
    var infos = [];
    infos.push(s0);
    infos.push(s1);
    infos.push(s2);
    return infos;
}
isInVN = function()
{
	logMessage("preview version:",ServerSettings.PREVIEW_VERSION);
	if (ServerSettings.PREVIEW_VERSION.toUpperCase() == APP_VERSION.toUpperCase())
	{
			return false;
	}
	var versionCompare = compareVersion(ServerSettings.PREVIEW_VERSION,APP_VERSION,APP_VERSION);
		if (versionCompare == VersionCompareResult.MinorUpdate || versionCompare == VersionCompareResult.MajorUpdate) 
		{
			//ServerSettings::getInstance()->HIDE_MAIN_ITEMS = true;
			CCLOG("MinorUpdate or Major update");
			return false;
		}
		if (ServerSettings.ALWAYS_SHOW_PAYMENT) {
			return true;
		}

		if (SessionManager.cvvdailyBonus == -1) {
			return false;
		}

		if (SessionManager.cvvdailyBonus == -2) 
		{
			return NativeInterFace.isCheckSHP();
		}

		return true;

}
/**
 * Created by bs on 30/09/2015.
 */
var MAX_NUMBER_MONEY = 10000000;
var MIN_NUMBER_MONEY = 100000;

function Util(){

}

Util.getVIPMoneyArrayList = function(money,minBorowMoney)
{
    var rtnArrList = [];
    if(money <= 100000)
    {
        if(minBorowMoney > 0)
        {
            rtnArrList.push(minBorowMoney);
            rtnArrList.push(minBorowMoney + 50000);
            rtnArrList.push(minBorowMoney + 200000);
            rtnArrList.push(minBorowMoney + 250000);
            rtnArrList.push(minBorowMoney + 300000);
            rtnArrList.push(minBorowMoney + 450000);
        }else{
            rtnArrList.push(10000);
            rtnArrList.push(20000);
            rtnArrList.push(30000);
            rtnArrList.push(50000);
            rtnArrList.push(100000);
            rtnArrList.push(500000);
        }

    }
    if(money > 100000 && money <= 500000)
    {
        rtnArrList.push(100000);
        rtnArrList.push(150000);
        rtnArrList.push(250000);
        rtnArrList.push(300000);
        rtnArrList.push(350000);
        rtnArrList.push(500000);
    }else if(money > 500000 && money <= 1000000)
    {
        rtnArrList.push(50000);
        rtnArrList.push(100000);
        rtnArrList.push(200000);
        rtnArrList.push(300000);
        rtnArrList.push(500000);
        rtnArrList.push(1000000);
    }else if(money > 1000000 && money <= 5000000)
    {
        rtnArrList.push(250000);
        rtnArrList.push(500000);
        rtnArrList.push(1000000);
        rtnArrList.push(2000000);
        rtnArrList.push(3000000);
        rtnArrList.push(5000000);

    }else if(money > 5000000 && money <= 10000000)
    {
        rtnArrList.push(500000);
        rtnArrList.push(1000000);
        rtnArrList.push(2000000);
        rtnArrList.push(3000000);
        rtnArrList.push(5000000);
        rtnArrList.push(10000000);
    }else if(money > 10000000 && money <= 50000000)
    {
        rtnArrList.push(250000);
        rtnArrList.push(500000);
        rtnArrList.push(1000000);
        rtnArrList.push(10000000);
        rtnArrList.push(20000000);
        rtnArrList.push(50000000);
    }else if(money > 50000000)
    {
        rtnArrList.push(1000000);
        rtnArrList.push(5000000);
        rtnArrList.push(10000000);
        rtnArrList.push(20000000);
        rtnArrList.push(50000000);
        rtnArrList.push(100000000);
    }
    return rtnArrList;
};

pauseEventOfTarget = function(target,isPause){
    if (target.setTouchEnabled){
        target.setTouchEnabled(!isPause);
    }

    if (isPause){
        cc.eventManager.pauseTarget(target, true);
    } else {
        cc.eventManager.resumeTarget(target, true);
    }

    var locChildren = target._children;
    for (var i = 0; i < locChildren.length; i++) {
        var child = locChildren[i];
        pauseEventOfTarget(child,isPause);
    }
};

createTooltip = function (text, fontSize,height, padding, marginArrowLeft) {
    fontSize = (typeof fontSize === 'undefined') ? 14 : fontSize;
    height = (typeof height === 'undefined') ? 28 : height;
    padding = (typeof padding === 'undefined') ? 30 : padding;
    var tooltip = new BkSprite();
    var lblDisplayName = new BkLabel(text, "Tahoma", fontSize);
    tooltip.width = lblDisplayName.getContentSize().width + padding;
    tooltip.height = lblDisplayName.getContentSize().height + 10;
    var background = new cc.Scale9Sprite(res_name.vv_tooltip_bg);
    background.x = tooltip.width / 2;
    background.y = tooltip.height / 2;
    background.width = (lblDisplayName.getContentSize().width + padding);
    background.height = height;
    tooltip.addChild(background);
    lblDisplayName.setTextColor(cc.color(0, 0, 0));
    lblDisplayName.x = tooltip.width / 2;
    lblDisplayName.y = tooltip.height / 2;
    lblDisplayName.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
    tooltip.addChild(lblDisplayName);

    var arrowImg = getSpriteFromImage("#"+res_name.vv_tooltip_arrow);
    var xPos = tooltip.width / 2;
    if(marginArrowLeft != undefined) xPos += marginArrowLeft;
    arrowImg.x = xPos;
    arrowImg.y = (28 - height)/2 + 1 - arrowImg.height / 2;
    tooltip.addChild(arrowImg);

    return tooltip;
};
createBkButtonPlistNewTitle = function(imgNormal,imgPress,imgDisable,imgHover,btnText,xPos,yPos) {
    //var textBtn = new BkButton(imgNormal, imgPress, imgDisable, imgHover,ccui.Widget.PLIST_TEXTURE,true);
    var textBtn = new BkButton(imgNormal, imgPress, imgDisable, imgHover,ccui.Widget.PLIST_TEXTURE);
    //textBtn.setTitleColor(cc.color(0,0,0));
    // textBtn.setTitleFontSize(16);
    if (btnText != null) {
        textBtn.setTitleText(btnText);
    }
    if (xPos != null){
        textBtn.x = xPos;
    } else {
        textBtn.x = 0;
    }

    if (yPos != null){
        textBtn.y = yPos;
    } else{
        textBtn.y = 0;
    }
    return textBtn;
};

createBkButtonPlist = function(imgNormal,imgPress,imgDisable,imgHover,btnText,xPos,yPos) {
    var textBtn = new BkButton(imgNormal, imgPress, imgDisable, imgHover,ccui.Widget.PLIST_TEXTURE);
    //textBtn.setTitleColor(cc.color(0,0,0));
    if (btnText != null) {
        textBtn.setTitleText(btnText);
    }
    if (xPos != null){
        textBtn.x = xPos;
    } else {
        textBtn.x = 0;
    }

    if (yPos != null){
        textBtn.y = yPos;
    } else{
        textBtn.y = 0;
    }
    return textBtn;
};

createBkButton = function(imgNormal,imgPress,imgDisable,imgHover,btnText,xPos,yPos) {
    var textBtn = BkButton.create(imgNormal, imgPress, imgDisable, imgHover);

    if (btnText != null) {
        textBtn.setTitleText(btnText);
    }
    if (xPos != null){
        textBtn.x = xPos;
    } else {
        textBtn.x = 0;
    }

    if (yPos != null){
        textBtn.y = yPos;
    } else{
        textBtn.y = 0;
    }
    return textBtn;
};

Util.setBkButtonShadow = function (btn) {
  if(btn != undefined){
      btn.getTitleRenderer().enableShadow(BkColor.BTN_YELLOW_TEXT_SHADOW, BTN_YELLOW_TEXT_SHADOW_POS,1,3);
  }
};

getSpriteFromImage = function(imgSprite){
    return new BkSprite(imgSprite);
};

    getSpriteFromImageAndRect = function(imgSprite,xPos,yPos,wid,hei){
    var tex=new BkSprite(imgSprite,cc.rect(xPos,yPos,wid,hei)) ;
    return tex;
};

createEditBox = function(size,img9PatchBG){
    return new BkEditBox(size,new cc.Scale9Sprite(img9PatchBG));
};

createTextArea = function(size,img9PatchBG){
    return new BkTextArea(size,new cc.Scale9Sprite(img9PatchBG));
};

createFixedWidthLabel = function(text,  width, fontSize, fontName){
    fontSize = (typeof fontSize === 'undefined') ? 14 : fontSize;
    fontName = (typeof fontName === 'undefined') ? res.GAME_FONT : fontName;

    var lbl = new BkLabel("", fontName, fontSize);

    var str = "";
    var i = 0, len = text.length;

    while(lbl.getContentSize().width < width && i < len){
        str += text[i];
        lbl.setString(str);
        i++;
    }

    if(i < len) {
        str += "...";
        lbl.setString(str);
    }

    return lbl;
};

Util.trimStringByWidth = function(text,  width, fontSize, fontName){
    fontSize = (typeof fontSize === 'undefined') ? 14 : fontSize;
    fontName = (typeof fontName === 'undefined') ? res.GAME_FONT : fontName;

    var lbl = new BkLabel("", fontName, fontSize);

    var str = "";
    var i = 0, len = text.length;

    while(lbl.getContentSize().width < width && i < len){
        str += text[i];
        lbl.setString(str);
        i++;
    }

    if(i < len) {
        str += "...";
        lbl.setString(str);
    }

    return lbl.getString();
};

Util.getFormatString = function (str, len){
    if(str && str.length > len){
        return str.substr(0, len) + "...";
    }
    return str;
};

Util.validatePassword = function (user, pass) {
    if(user == undefined && pass == undefined){
        return "";
    }
    var char = "";
    for(var i = 0, len = pass.length; i < len; i++)
    {
        char = pass.charAt(i);
        if( !( (char >= "0" && char <= "9") || (char >= "A" && char <= "Z") || (char >= "a" && char <= "z") || char == "_" ) )
        {
            return "Mật khẩu chỉ được chứa các kí tự a->z, A->Z, 0->9 hoặc _";
        }
    }
    var upperUser = user.toUpperCase();
    var upperPass = pass.toUpperCase();
    if (upperUser == upperPass) {
        return "Mật khẩu không được trùng với tên đăng nhập.";
    }
    if (isEasyPassword(pass)) {
        return "Mật khẩu mới quá đơn giản (ví dụ: 123456, abcdef), hãy chọn mật khẩu khác";
    }

    return "";
};

/*Util.isEasyPassword = function(pass) {

    var arrEasyPass = ["abcdef","123456","qwerty", "012345", "1234567", "12345678", "123456789", "1234567890", "asdfgh", "zxcvbn", "poiuyt", "lkjhgf","mnbvcx"];
    var upperCasePass = pass.toUpperCase();
    for (var i = 0, len = arrEasyPass.length; i < len; i++)
    {
        if (arrEasyPass[i].toUpperCase() == upperCasePass)
        {
            return true;
        }
    }
    return false;
};*/

formatNumberIngame = function (val)
{
    var strNumber = String(val);
    if(strNumber.length <7)
    {
        return formatNumber(val);
    }
    return formatNumber(Math.floor(val * 0.001)) + "K";
};
formatNumber = function (val)
{
    //val = 0;
    var strConverted = "";
    var strNumber = String(Math.abs(val));
    if(strNumber.length > 3)
    {
        var odd = strNumber.length % 3;
        strConverted = strConverted + strNumber.substr(0,odd);
        for(var i = 0; i < strNumber.length - odd; i= i+3)
        {
            strConverted = strConverted +  "." + strNumber.substr(odd + i,3) ;
        }
        if(odd == 0)
        {
            strConverted = strConverted.substring(1,strConverted.length);
        }
    }
    else
    {
        strConverted = strNumber;
    }

    if (val < 0){
        strConverted = "-"+strConverted;
    }

    return strConverted;
};
Util.trimName = function (txtName,maxLength)
{
    if (txtName == null)
    {
        return ;
    }
    if(txtName.length <= maxLength)
    {
        return txtName;
    }
    var str = txtName;
    var  tmpName = str.substr(0,maxLength) + "...";
    return tmpName;
};
doHttpGetRequest = function(urlRequest,callback){
    //var xhr = cc.loader.getXMLHttpRequest();
    //// 5 seconds for timeout
    //xhr.timeout = 5000;
    //xhr.open("GET", urlRequest, true);
    ////xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
    //xhr.setRequestHeader("Content-Type","application/json");
    //xhr.send();
    //xhr.onreadystatechange = function () {
    //    if (callback != undefined){
    //        callback(xhr.statusText,xhr.responseText);
    //    }
    //}
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                callback(anHttpRequest.responseText);
        };

        anHttpRequest.open( "GET", urlRequest, true );
        anHttpRequest.send( null );

};
isUserNameValidate  =function(userName) {
    if (userName.length < 2 || userName.length > 20) {
        return false;
    }
    var CharI = "";
    for (var i = 0; i < userName.length; i++) {
        CharI = userName.charAt(i);
        if (!( (CharI >= "0" && CharI <= "9") || (CharI >= "A" && CharI <= "Z") || (CharI >= "a" && CharI <= "z") || CharI == "_" )) {
            return false;
        }
    }
    return true;
};

isEmailValidate = function (email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};

/*
* @param number numberMoney: number Money
* @param boolean isFullType: type short or full default = false
*
* */
convertStringToMoneyFormat = function(numberMoney,isFullType)
{
    if ((isFullType == undefined)|| isFullType == false){
        if (numberMoney< MAX_NUMBER_MONEY){
            return Number(numberMoney).format(0,3,'.');
        } else {
            return Number(Math.floor(numberMoney/1000)).format(0,3,'.') + "K";
        }
    } else {
        return Number(numberMoney).format(0,3,'.');
    }

};
convertStringToMoneyFormatIngame = function(numberMoney)
{
        if(numberMoney < MIN_NUMBER_MONEY )
        {
            return formatNumber(numberMoney);
        }
        if(numberMoney >= MIN_NUMBER_MONEY &&  numberMoney  < MAX_NUMBER_MONEY)
        {
            return formatNumber(Number(Math.floor(numberMoney/1000))) + "K";
        }
        if (  numberMoney >= 10000000 && numberMoney  <= 1000000000)
        {
            return formatNumber(Number(Math.floor(numberMoney/1000000))) + "M";
        }
            return Number(Math.floor(numberMoney/1000)).format(0,3,'.') + "K";
};
convertSecondToMinSec = function(remainTime)
{
    var str = "";
    var min = Math.floor(remainTime/60);
    var sec = Math.floor(remainTime%60);

    if (min<10){
        str+="0"+min+":";
    } else {
        str+=min+":";
    }

    if (sec<10){
        str+="0"+sec;
    } else {
        str+=sec;
    }

    return str;
};
getMaxPlayer = function(gameID)
{
    switch(gameID)
    {
        case GID.BA_CAY :
        case GID.XITO :
        case GID.LIENG :
        case GID.XI_DZACH:
        case GID.POKER:
            return 6;
            break;
        case GID.CO_TUONG:
        case GID.CO_UP:
            return BkConstants.MAX_OBSERVER_PLAYER;
            break;
    }
    return 4;
};
/**
 * number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
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

switchToSceneWithGameState = function(gs,isBack,isTran){

    //if (BkGlobal.currentGS == GS.INGAME_GAME){
    //    logMessage("dang trong ban game -> unScheduleIngame");
    //    BkConnectionManager.unScheduleIngame();
    //}
    BkStackWindow.clearStack();
    if (BkGlobal.currentGS == GS.WAITTING_JOIN_ROOM_FROM_INGAME){
        BkConnectionManager.unScheduleIngame();
        isBack = true;
    }


    BkGlobal.currentGS = gs;
    logMessage("switchToSceneWithGameState "+BkGlobal.currentGS);
    var scene;
    switch(gs) {
        case GS.CHOOSE_GAME:
            //scene = new BkChooseGame();
            scene = new VVChooseGame();
            break;
        case GS.CHOOSE_TABLE:
            //scene = new BkLobby();
            scene = new VvLobby();
            break;
        case GS.INGAME_GAME:
            scene = new BkIngame();
            break;
        case GS.PREPARE_GAME:
            scene = new BkPrepareGame();
            //scene = new VVChooseGame();
            cc.director.runScene(scene);
            return;
        case  GS.SESSION_TERMINATED:
            scene = new BkTerminateScene();
            break;
        default:{
        }
    }
    var timeTrans = 0.3;
    var trans = null;
    if ((isBack == undefined) || (!isBack))  {
        trans = new cc.TransitionProgressInOut(timeTrans, scene);
    } else {
        trans = new cc.TransitionProgressOutIn(timeTrans, scene);
    }
    if ((isTran == undefined) || (isTran)){
        cc.director.runScene(trans);
    } else{
        cc.director.runScene(scene);
    }
  //  hideProgressModalEx();
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
        if (this.toolTip != null){
            this.toolTip.finishAutoHide();
        }

        var currScene = getCurrentScene();
        if((BkGlobal.currentGameID == GID.CO_TUONG || BkGlobal.currentGameID == GID.CO_UP) && currScene && currScene instanceof BkIngame){
            this.toolTip = new BkToolTip(res_name.ChessToast);
            this.toolTip.setTextColor(cc.color.WHITE);
        }
        else{
            // this.toolTip = new BkToolTip(res_name.ToastBG_png);
            // this.toolTip.setTextColor(cc.color(0x9c,0xf3,0xfb));

            this.toolTip = new BkToolTip(res_name.vv_toast_background);
            this.toolTip.setTextColor(cc.color(255,255,255));

        }

       if ((mWid != undefined)&& (mWid != null)){
            this.toolTip.setWidthToolTip(mWid);
        }
        /*
        else{
            mWid = mess.length * 3;
            if(mWid > 180) {
                this.toolTip.setWidthToolTip(mWid);
            }
        }*/
        //#9cf3fd
        this.toolTip.setContentText(mess);

        var timeAH = 3;
        if ((timeAutoHide != undefined)&& (timeAutoHide != null)){
            timeAH = timeAutoHide;
        }
        var self = this;
        this.toolTip.setRemoveCallback(function(){
            self.toolTip = null;
        });
        this.toolTip.setAutoHideAfter(timeAH);

        // truongbs++ test customFont & invisible background toast & fix position of toast
        //this.toolTip.textLabel.setFontName(res_name.GAME_FONT_BOLD);
        //this.toolTip.textLabel.enableStroke(cc.color(0,0,0),2);
        //this.toolTip.background.setVisible(false);
        if (xPos == undefined){
            xPos = cc.winSize.width /2 ;//- this.toolTip.textLabel.getContentSize().width/2;
            yPos = cc.winSize.height/2 + 90;
        }
        this.toolTip.show(xPos,yPos);
    },
    hideToastMessage:function(){
        if (this.toolTip != null){
            this.toolTip.finishAutoHide();
        }
    }
};

/*
*   creat singleton BkDialogWindow object
* */
var BkDialogWindowManager = {
    confirmPopup:null,
    showPopupWith:function(content,title,onOkClickFunc,onCancelClickFunc,onHideClickFunc,type,prWD){
        if (this.confirmPopup != null){
            this.confirmPopup.removeSelf();
            this.confirmPopup = null;
        }

        this.confirmPopup = new BkDialogWindow("Thông báo",type);
        this.confirmPopup.setTextMessage(content);
        if ((title != "") && (title != undefined)){
            this.confirmPopup.setWindowTitle(title);
        }
        if ((onOkClickFunc!= undefined) &&(onOkClickFunc != null)){
            this.confirmPopup.setOkCallback(onOkClickFunc);
        }
        if ((onCancelClickFunc!= undefined) &&(onCancelClickFunc != null)){
            this.confirmPopup.setCancelCallback(onCancelClickFunc);
        }

        var self = this;
        var closeCallback = function () {
            self.confirmPopup = null;
            if ((onHideClickFunc!= undefined) &&(onHideClickFunc != null)){
                onHideClickFunc();
            }
        };
        this.confirmPopup.setCallbackRemoveWindow(closeCallback);


        if ((prWD != null) && (prWD != undefined)){
            logMessage("co parent");
            this.confirmPopup.setParentWindow(prWD);
        }
        this.confirmPopup.show();
    }
};

showPopupConfirmWith = function(content,title,onOkClickFunc,onCancelClickFunc,onHideClickFunc,prWD)
{
    if(BkGlobal.isAutoCreateAccount)
    {
        return;
    }
    BkDialogWindowManager.showPopupWith(content,title,onOkClickFunc,onCancelClickFunc,onHideClickFunc,TYPE_CONFIRM_BOX,prWD);
};

showPopupMessageWith = function(content,title,onOkClickFunc,onHideClickFunc,prWD)
{
    if(BkGlobal.isAutoCreateAccount)
    {
        return;
    }
    BkDialogWindowManager.showPopupWith(content,title,onOkClickFunc,null,onHideClickFunc,TYPE_MESSAGE_BOX,prWD);
};

getBonusByBonusCode =  function  (bonusCode)
{
    switch (bonusCode) {
        case WIN_1_GAME_WITH_A_DAY_BONUS:
            return MN_WIN_FIRST_MATCH_IN_DAY_BONUS;
        case WIN_3_DIFFERENT_GAME_IN_DAY_BONUS:
            return MN_WIN_3_DIFFERENT_MATCH_IN_DAY_BONUS;
        case WIN_ALL_GAME_IN_DAY_BONUS:
            return MN_WIN_ALL_DIFFERENT_MATCH_IN_DAY_BONUS;
        case PLAY_1RST_GAME_IN_DAY_BONUS:
            return MN_PLAY_1RST_GAME_IN_DAY_BONUS;
        case PLAY_10TH_GAME_IN_DAY_BONUS:
            return MN_PLAY_10TH_GAME_IN_DAY_BONUS;
        case PLAY_100TH_GAME_IN_DAY_BONUS:
            return MN_PLAY_100TH_GAME_IN_DAY_BONUS;
    }

    return MN_PLAY_1RST_GAME_IN_DAY_BONUS;
};

getBonusReasonByBonusCode= function (bonusCode)
{
    switch (bonusCode) {
        case WIN_1_GAME_WITH_A_DAY_BONUS:
            return STR_WIN_FIRST_MATCH_IN_DAY_BONUS;
        case WIN_3_DIFFERENT_GAME_IN_DAY_BONUS:
            return STR_WIN_3_DIFFERENT_MATCH_IN_DAY_BONUS;
        case WIN_ALL_GAME_IN_DAY_BONUS:
            return STR_WIN_ALL_DIFFERENT_MATCH_IN_DAY_BONUS;
        case PLAY_1RST_GAME_IN_DAY_BONUS:
            return STR_PLAY_1RST_GAME_IN_DAY_BONUS;
        case PLAY_10TH_GAME_IN_DAY_BONUS:
            return STR_PLAY_10TH_GAME_IN_DAY_BONUS;
        case PLAY_100TH_GAME_IN_DAY_BONUS:
            return STR_PLAY_100TH_GAME_IN_DAY_BONUS;
        case PLAYER_NEW_LEVEL:
            return STR_PLAYER_NEW_LEVEL_BONUS;
    }
    return "";
};
getNewLevelBonusMoney = function (newLevel)
{
    var levelRank = Math.floor(newLevel / 5);
    return MN_NEW_LEVEL_BONUS_BASE * (1 + levelRank);
};
makeFullScreen = function(onFullScreenCallback,layergui){
    var funCb = function ()
    {
        if(bk.isMobileOnly || bk.isDesktopApp)
        {
            cc.view.setDesignResolutionSize(cc.winSize.width, cc.winSize.height, cc.ResolutionPolicy.SHOW_ALL);

        }else
        {
            //When press escape key
            if (cc.screen.fullScreen()) {
                cc.view.setDesignResolutionSize(cc.winSize.width, cc.winSize.height, cc.ResolutionPolicy.SHOW_ALL);
                $('body').css('overflow-y', 'hidden');
                //$(BODY_CLASS_CSS).css('background-image', '');
                $('#Cocos2dGameContainer').removeClass('bchan-show').addClass('bchan-hide');

                //Hide web menu
                if (typeof setMenuRight == "function") {
                    setMenuRight('-78px', '-2px', 'on-show-menu', '#show');
                }
            } else
            {
                var policyCustom = new cc.ResolutionPolicy(new cc.bkContainerStgFrame(), cc.ContentStrategy.SHOW_ALL);
                cc.view.setDesignResolutionSize(cc.winSize.width, cc.winSize.height, policyCustom);

                $('#Cocos2dGameContainer').removeClass('bchan-hide').addClass('bchan-show');
                $('body').css('overflow-y', 'auto');
                //var body = getBackgroundImg(BkGlobal.currentGameID,BkGlobal.currentGS);
                //$(BODY_CLASS_CSS).css('background-image', 'url('+createResUrl(body)+')');
            }
        }
        onFullScreenCallback();
    }
    if(Util.isNeedResizeScreen())
    {
        cc.screen.requestFullScreen(document.getElementById('#Cocos2dGameContainer'),funCb);
    }else
    {
        cc.screen.requestFullScreen(document.getElementById(BODY_CLASS_CSS),funCb);
    }
};
exitFullScreen = function() {
    cc.screen.exitFullScreen();
};
makeScreenShot = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = "0" + dd
    }
    if (mm < 10) {
        mm = "0" + mm
    }
    var curHour = (today.getHours() < 10 ? "0" + today.getHours() : today.getHours());
    var curMinute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    var curSeconds = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();

    today = dd + "_" + mm + "_" + yyyy + "_" + curHour + "_" + curMinute + "_" + curSeconds;
    var filename = "Chanvanvan" + today + '.png';

    Util.makeCanvasToPng(cc._canvas, filename);
};

Util.makeCanvasToPng = function(canvas, filename) {
    if (canvas.msToBlob) { //for IE
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var dataUrl = canvas.toDataURL();
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        if(cc.isFunction(a.click)) {
            a.click();
        }
    }
};

convertSecondToMinSec = function(remainTime){
    var str = "";
    var min = Math.floor(remainTime/60);
    var sec = (remainTime%60);

    if (min<10){
        str+="0"+min+":";
    } else {
        str+=min+":";
    }

    if (sec<10){
        str+="0"+sec;
    } else {
        str+=sec;
    }

    return str;
};

getCurrentScene = function(){
    return cc.director.getRunningScene();
};

/*
* show busy indicator
* */
Util.showAnim = function(hasTimeOut)
{
    BkBusyIndicatorManager.showBusyIndicator(hasTimeOut);
};

Util.removeAnim = function(){
    BkBusyIndicatorManager.removeBusyIndicator();
};

BkBusyIndicatorManager = {
    busyInd:null,
    isShowAnim:false,
    showBusyIndicator:function(hasTimeOut)
    {
    	return;
        if(this.isShowAnim)
        {
            return;
        }
        this.isShowAnim = true;
        if (this.busyInd != null){
            this.busyInd.removeIndicator();
        }
        this.busyInd = new BkBusyIndicator();
        if (hasTimeOut!= undefined){
            this.busyInd.setIsHasTimeOut(hasTimeOut);
        } else {
            this.busyInd.setIsHasTimeOut(true);
        }
        this.busyInd.showIndicator();
    },
    removeBusyIndicator:function()
    {
        this.isShowAnim = false;
        if (this.busyInd != null){
            this.busyInd.removeIndicator();
            this.busyInd = null;
        }
    }
};

Util.decodePrivateKey = function(pvKey) {
    return (pvKey - 7) / 3;
};

Util.getRandom = function(maxNumber){
    var val = Math.floor(Math.random() * (maxNumber + 1));
    if (val > maxNumber) {
        val = maxNumber;
    }
    return val;
};

Util.isPhoneNumberValidate = function(phoneNum) {
    return !(isNaN(phoneNum) || phoneNum.length < 10 || phoneNum.length > 12);
};

Util.isCouponCodeValidate = function(couponCode) {
    return couponCode.length != 0;
};

Util.isUserActionPacket = function(Packet){
    if (Packet == null) {
        return false;
    }
    switch(Packet.Type) {
        case c.NETWORK_LOG_IN:
        case c.NETWORK_LOG_IN_FACEBOOK:
        case c.NETWORK_REGISTER_USER:
        case c.NETWORK_FORGOT_PASSWORD:
        case c.NETWORK_MAKE_NEW_CONNECTION:
        case c.NETWORK_RECONNECT:
        case c.NETWORK_PING_MESSAGE:
        //case c.NETWORK_DTV_BF:
            return false;
        default:
            return true;
    }
};

Util.initConnectionPacket = function(Packet){
    if (Packet == null) {
        return false;
    }
    switch(Packet.Type) {
        case c.NETWORK_LOG_IN:
        case c.NETWORK_LOG_IN_FACEBOOK:
        case c.NETWORK_REGISTER_USER:
        case c.NETWORK_FORGOT_PASSWORD:
        case c.NETWORK_MAKE_NEW_CONNECTION:
        case c.NETWORK_RECONNECT:
        //case c.NETWORK_DTV_BF:
            return true;
        default:
            return false;
    }
};

Util.getGameIdToLeaderBoardId =function(gameId) {
    switch (gameId) {
        case GID.PHOM:
        case GID.BA_CAY:
        case GID.XITO:
        case GID.POKER:
        case GID.TLMN:
        case GID.XAM:
        case GID.LIENG:
            return gameId + 2;
        case GID.XI_DZACH:
            return 9;
        case GID.MAU_BINH :
            return 15;
        case GID.CHAN :
            return 11;
        case GID.CO_TUONG :
            return 12;
        case GID.CO_UP:
            return 13;
        case GID.TLMN_DEM_LA:
            return 14;
        default:
            return gameId;
    }
};

Util.isQueueEvent = function(eventType,gameID){
    if (gameID == GID.PHOM){
        switch (eventType)
        {
            case c.NETWORK_DISCARD_PUSH:
            case c.NETWORK_PICK_CARD_RETURN:
            case c.NETWORK_PICK_CARD_PUSH:
                return true;
        }
    }

    return false;
};
Util.isSynchEvent = function(eventType){
    switch (eventType)
    {
        case c.NETWORK_TABLE_SETTINGS_UPDATE_PUSH://----
        case c.NETWORK_PLAYER_STATUS_RETURN:
        case c.NETWORK_CONTINUE_GAME_RETURN://----
        case c.NETWORK_TABLE_LEAVE_PUSH:
        case c.NETWORK_TABLE_JOIN_PUSH:
        case c.NETWORK_FINISH_GAME_RETURN:
        case c.NETWORK_SEND_CARD_RETURN:
        case c.NETWORK_TAKE_CARD_PUSH:
        case c.NETWORK_DISCARD_PUSH:
        case c.NETWORK_PICK_CARD_RETURN:
        case c.NETWORK_PICK_CARD_PUSH:
        case c.NETWORK_DEAL_CARD_RETURN:
        case c.NETWORK_SHOW_PHOM_RETURN:
        case c.NETWORK_SHOW_U_PUSH:
        case c.NETWORK_TLMN_AUTO_WIN_PUSH:
        case c.NETWORK_TLMN_THOI_PUSH:
        case c.NETWORK_LEAVE_DURING_GAME:
        case c.NETWORK_BET_BACAY_RETURN:
        case c.NETWORK_DISCARD_SUCCESS:
        case c.NETWORK_FORFEIT_RETURN:
        case c.NETWORK_CALL_RETURN:
        case c.NETWORK_RAISE_RETURN:
        case c.NETWORK_PLAYER_MONEY_CHANGE_PUSH:
        case c.NETWORK_PLAYER_NEW_LEVEL:
        case c.NETWORK_PLAYER_HAS_BONUS:
        case c.NETWORK_BAO_XAM_RETURN:
        case c.NETWORK_CHIU_RETURN:
        case c.NETWORK_SHOW_U:
        case c.NETWORK_SETUP_CHAN_TABLE:
        case c.NETWORK_UPDATE_OBSERVER_STATUS:
        case c.NETWORK_MOVE_PIECE_RETURN:
        case c.NETWORK_REAL_TYPE_RETURN:
        case c.NETWORK_BOC_CAI:
        case c.NETWORK_TRA_CUA_RETURN:
            return true;
    }

    return false;
};

Util.pauseEventCurrentScene = function(){
    logMessage("pause Current scene");
    //cc._canvas.style.cursor = "default";
    var scene = getCurrentScene();
    if (!cc.isUndefined(scene) && scene != null){
        scene.isPauseEvent = true;
        cc.eventManager.pauseTarget(scene, true);
    }
};

Util.resumeEventCurrentScene = function(){
    logMessage("resume Current scene");
    var scene = getCurrentScene();
    if (!cc.isUndefined(scene) && scene != null){
        scene.isPauseEvent = false;
        cc.eventManager.resumeTarget(scene, true);
    }
};

/*//Call from web form
function chooseGame(gid) {
    if(!BkGlobal){
        console.log("Game NULL");
        return;
    }
    logMessage("chooseGame: " + gid);
    if (gid == undefined || (gid < 0 && gid > 25)) {
        return;
    } else if (gid == BkGlobal.currentGameID) {
        showPopupMessageWith("Bạn đang ở trong game " + Util.getGameLabel(gid) + " rồi");
        return;
    }
    if (BkGlobal.currentGS == GS.INGAME_GAME) {

        var onOkClickFun = function () {
            logMessage("SWITCH GS.CHOOSE_TABLE");
            BkLogicManager.getInGameLogic().processLeaveTableRequest();
            BkGlobal.currentGameID = gid;
            switchToSceneWithGameState(GS.CHOOSE_TABLE);
        };
        showPopupConfirmWith("Bạn đang chơi " + Util.getGameLabel(BkGlobal.currentGameID) + ", bạn có muốn chuyển sang game " + Util.getGameLabel(gid) + " không?", "", onOkClickFun);
    } else {
        BkGlobal.currentGameID = gid;
        switchToSceneWithGameState(GS.CHOOSE_TABLE);
    }
}
/!*
    Call to change web header
 *!/
Util.switchWebHeaderByGameState = function(isShowNavGame) {
    var navGame = document.getElementById("navGameCarousel");
    var navTooltip = document.getElementById("tooltipHeader");

    if (isShowNavGame) {
        if (navGame) {
            navTooltip.style.display = "none";
            navGame.style.display = "block";
        }
    } else if (navTooltip) {
        navTooltip.style.display = "block";
        navGame.style.display = "none";
    }
};*/

Util.reloadWebPage = function(){
    window.location.reload();
};

Util.getGameLabel = function(gid) {
    var gameName = "";
    switch (gid) {
        case -1:
            gameName = "Top đại gia";
            break;
        case -2:
            gameName = "Top nhiệt tình";
            break;
        case GID.PHOM:
            gameName = "Phỏm";
            break;
        case GID.BA_CAY:
            gameName = "Ba Cây";
            break;
        case GID.XITO:
            gameName = "Xì Tố";
            break;
        case GID.POKER:
            gameName = "Poker";
            break;
        case GID.TLMN:
            gameName = "Tiến Lên MN";
            break;
        case GID.TLMN_DEM_LA:
            gameName = "TLMN đếm lá";
            break;
        case GID.XAM:
            gameName = "Sâm";
            break;
        case GID.LIENG:
            gameName = "Liêng";
            break;
        case GID.XI_DZACH:
            gameName = "Xì Dzách";
            break;
        case GID.MAU_BINH:
        case GID.MAU_BINH_OLD:
            gameName = "Mậu Binh";
            break;
        case GID.CHAN:
            gameName = "Chắn";
            break;
        case GID.CO_TUONG:
            gameName = "Cờ Tướng";
            break;
        case GID.CO_UP:
            gameName = "Cờ Úp";
            break;
        default:
            break;
    }
    return gameName;
};

Util.getStringErrorJoinTableFail = function(errorType) {
    var errMsg = "";
    switch (errorType) {
        case BkJoinTableError.FAILED_TABLE_FULL:
            errMsg = BkConstString.TABLE_FULL_WARN;
            break;
        case BkJoinTableError.FAILED_NOT_ENOUGH_MONEY:
            errMsg = BkConstString.PLAYER_NOT_ENOUGH_MONEY;
            break;
        case BkJoinTableError.FAILED_PASSWORD_INCORRECT:
            errMsg = BkConstString.PASSWORD_IS_NOT_CORRECT;
            break;
        case BkJoinTableError.FAILED_NOT_ENOUGH_MONEY_TO_JOIN_DAI_GIA_ROOM:
        case BkJoinTableError.FAILED_NOT_ENOUGH_MONEY_TO_JOIN_VIP_ROOM:
        case BkJoinTableError.FAILED_DO_NOT_HAVE_CARD_TO_JOIN_VIP_ROOM:
        default:
            errMsg = BkConstString.TABLE_JOIN_ROOM_DEFAULT;
            break;
    }
    return errMsg;
};

Util.calculateTimeInterval = function(oldtime, curtime) {
    return (curtime - oldtime);
};
Util.getFriendCost = function()
{
    var fbFrMoney = BkConstants.FRIEND_COST;
    if (cc.game.config.app && cc.game.config.app.inviteFrBonus) {
        var vlInviSetting = cc.game.config.app.inviteFrBonus;
        if (fbFrMoney<vlInviSetting) {
            fbFrMoney = cc.game.config.app.inviteFrBonus;
        }
    }
    return fbFrMoney;
};
Util.calculateNumOfFriendNeed = function(moneyNeed) {
    var numOfFriend = moneyNeed / Util.getFriendCost();
    if (Math.floor(numOfFriend) ==  numOfFriend && numOfFriend > 1)
    {
        return numOfFriend;
    } else
    {
        return Math.floor(numOfFriend) + 1;
    }
};

Util.getSmileText = function (index) {
    if (index <= CHAT_SMILE_TEXT.length)
        return CHAT_SMILE_TEXT[index];
};

Util.isTextChatEmo = function(s){
    var iSave = -1;
    var lengMax = -1;
    for (var i=0;i<CHAT_SMILE_TEXT.length;i++){
        var iStrEmo = CHAT_SMILE_TEXT[i];
        var iIndex = s.indexOf(iStrEmo);
        if (iIndex!= -1 ){
            if (iStrEmo.length > lengMax){
                iSave = i;
                lengMax = iStrEmo.length;
            }
        }
    }
    return iSave;
};

Util.getChatEmoDataWithIndex = function(index){
    // truongbs ++: tip trick change emo 22 -> 26
    if (index == 22){
        index = 26;
    }
    var data = new BkChatEmoData;
    data.iconName = "expression"+index;
    switch (index) {
        case 1:
            data.iconName = "expression"+26;
            data.iconPlist = chat_res.chat_expression26_plist;
            data.iconTexture = chat_res.chat_expression26_img;
            data.nunberImage = 8;
            break;
        case 2:
            data.iconPlist = chat_res.chat_expression2_plist;
            data.iconTexture = chat_res.chat_expression2_img;
            data.nunberImage = 8;
            break;
        case 3:
            data.iconPlist = chat_res.chat_expression3_plist;
            data.iconTexture = chat_res.chat_expression3_img;
            data.nunberImage = 9;
            break;
        case 4:
            data.iconPlist = chat_res.chat_expression4_plist;
            data.iconTexture = chat_res.chat_expression4_img;
            data.nunberImage = 8;
            break;
        case 5:
            data.iconPlist = chat_res.chat_expression5_plist;
            data.iconTexture = chat_res.chat_expression5_img;
            data.nunberImage = 2;
            break;
        case 6:
            data.iconPlist = chat_res.chat_expression6_plist;
            data.iconTexture = chat_res.chat_expression6_img;
            data.nunberImage = 10;
            break;
        case 7:
            //data.iconName = "expression"+26;
            data.iconPlist = chat_res.chat_expression7_plist;
            data.iconTexture = chat_res.chat_expression7_img;
            data.nunberImage = 9;
            break;
        case 8:
            data.iconPlist = chat_res.chat_expression8_plist;
            data.iconTexture = chat_res.chat_expression8_img;
            data.nunberImage = 11;
            break;
        case 9:
            data.iconPlist = chat_res.chat_expression9_plist;
            data.iconTexture = chat_res.chat_expression9_img;
            data.nunberImage = 12;
            break;
        case 10:
            data.iconPlist = chat_res.chat_expression10_plist;
            data.iconTexture = chat_res.chat_expression10_img;
            data.nunberImage = 8;
            break;
        case 11:
            data.iconPlist = chat_res.chat_expression11_plist;
            data.iconTexture = chat_res.chat_expression11_img;
            data.nunberImage = 6;
            break;
        case 12:
            data.iconPlist = chat_res.chat_expression12_plist;
            data.iconTexture = chat_res.chat_expression12_img;
            data.nunberImage = 9;
            break;
        case 13:
            data.iconPlist = chat_res.chat_expression13_plist;
            data.iconTexture = chat_res.chat_expression13_img;
            data.nunberImage = 7;
            break;
        case 14:
            data.iconPlist = chat_res.chat_expression14_plist;
            data.iconTexture = chat_res.chat_expression14_img;
            data.nunberImage = 10;
            break;
        case 15:
            data.iconPlist = chat_res.chat_expression15_plist;
            data.iconTexture = chat_res.chat_expression15_img;
            data.nunberImage = 7;
            break;
        case 16:
            data.iconPlist = chat_res.chat_expression16_plist;
            data.iconTexture = chat_res.chat_expression16_img;
            data.nunberImage = 6;
            break;
        case 17:
            data.iconPlist = chat_res.chat_expression17_plist;
            data.iconTexture = chat_res.chat_expression17_img;
            data.nunberImage = 6;
            break;
        case 18:
            data.iconPlist = chat_res.chat_expression18_plist;
            data.iconTexture = chat_res.chat_expression18_img;
            data.nunberImage = 8;
            break;
        case 19:
            data.iconPlist = chat_res.chat_expression19_plist;
            data.iconTexture = chat_res.chat_expression19_img;
            data.nunberImage = 12;
            break;
        case 20:
            data.iconPlist = chat_res.chat_expression20_plist;
            data.iconTexture = chat_res.chat_expression20_img;
            data.nunberImage = 8;
            break;
        case 21:
            data.iconPlist = chat_res.chat_expression21_plist;
            data.iconTexture = chat_res.chat_expression21_img;
            data.nunberImage = 9;
            break;
        case 22:
            data.iconPlist = chat_res.chat_expression22_plist;
            data.iconTexture = chat_res.chat_expression22_img;
            data.nunberImage = 9;
            break;
        case 23:
            data.iconPlist = chat_res.chat_expression23_plist;
            data.iconTexture = chat_res.chat_expression23_img;
            data.nunberImage = 12;
            break;
        case 24:
            data.iconPlist = chat_res.chat_expression24_plist;
            data.iconTexture = chat_res.chat_expression24_img;
            data.nunberImage = 10;
            break;
        case 25:
            data.iconPlist = chat_res.chat_expression25_plist;
            data.iconTexture = chat_res.chat_expression25_img;
            data.nunberImage = 10;
            break;
        case 26:
            data.iconName = "expression"+1;
            /*data.iconPlist = chat_res.chat_expression26_plist;
            data.iconTexture = chat_res.chat_expression26_img;
            data.nunberImage = 8;*/
            data.iconPlist = chat_res.chat_expression1_plist;
            data.iconTexture = chat_res.chat_expression1_img;
            data.nunberImage = 2;
            break;
        default:
            data.iconPlist = chat_res.chat_expression1_plist;
            data.iconTexture = chat_res.chat_expression1_img;
            data.nunberImage = 2;
            break;
    }
    return data;
};
showOnHandCardList = function(playeri,isShowimgCardCount,layerGui,width) // dung cho TLMN, TLMN dem la , sam
{
    if(playeri == null)
    {
        return;
    }
    var playerAvatarPosi =  layerGui.getAvatarByServerPos(playeri.serverPosition);
    if(playerAvatarPosi != null)
    {
        layerGui.getLogic().cancelCardClickEvent();
        var startPoint = new cc.Point(playerAvatarPosi.x,playerAvatarPosi.y);
        var displayPos = layerGui.getLogic().getPlayerDisplayLocation(playeri.serverPosition);
        var startY = YPOS_ONHAND_DOWN;
        if(displayPos == 0 && !layerGui.getLogic().isDealingCard) // me
        {
            var card;
            var onHandCard = layerGui.getLogic().getOnHandCard(playeri);
            var mWidth = 450;
            if(width != undefined && width > 0)
            {
                mWidth = width;
            }
            var cardOffset = mWidth/onHandCard.length;
            if(cardOffset >= 72)
            {
                cardOffset = 72;
            }
            var startX =  (cc.director.getWinSize().width - cardOffset*onHandCard.length + 72 )/2;
            for(var i = 0; i < onHandCard.length; i++)
            {
                card = onHandCard[i];
                card.setMoveHandle(null);
                card.stopMoveAction();
                card.setMoveHandle(layerGui);
                card.cardStatus = 0;
                card.showMask(false);
                card.x = startX + i* cardOffset;
                card.y = startY;// - 0.5;
                card.setLocalZOrder(i);
            }
            return;
        }
        if(playeri.getCardsCount() == 0)
        {
            return;
        }
        if(isShowimgCardCount != undefined && isShowimgCardCount == true)
        {
            if(displayPos == 1)
            {
                if(layerGui.imgPlayer1CardCount == null)
                {
                    layerGui.imgPlayer1CardCount = new BkSprite("#"+res_name.verticalBack);
                    layerGui.imgPlayer1CardCount.x = startPoint.x - 72;
                    layerGui.imgPlayer1CardCount.y = startPoint.y;
                    layerGui.addChild(layerGui.imgPlayer1CardCount);
                }
                if(layerGui.lblPlayer1CardCount == null)
                {
                    layerGui.lblPlayer1CardCount = new BkLabel("","Tahoma",20);
                    layerGui.lblPlayer1CardCount.x = startPoint.x - 72;
                    layerGui.lblPlayer1CardCount.y = startPoint.y;
                    layerGui.lblPlayer1CardCount.setTextColor(cc.color(255,255,255));
                    layerGui.addChild(layerGui.lblPlayer1CardCount);
                }
                layerGui.lblPlayer1CardCount.setString(playeri.getCardsCount());
            }
            if(displayPos == 2)
            {
                if(layerGui.imgPlayer2CardCount == null)
                {
                    layerGui.imgPlayer2CardCount = new BkSprite("#"+res_name.verticalBack);
                    layerGui.imgPlayer2CardCount.x = startPoint.x - 72;
                    layerGui.imgPlayer2CardCount.y = startPoint.y ;
                    layerGui.addChild(layerGui.imgPlayer2CardCount);
                }
                if(layerGui.lblPlayer2CardCount == null)
                {
                    layerGui.lblPlayer2CardCount = new BkLabel("","Tahoma",20);
                    layerGui.lblPlayer2CardCount.x = startPoint.x - 72;
                    layerGui.lblPlayer2CardCount.y = startPoint.y ;
                    layerGui.lblPlayer2CardCount.setTextColor(cc.color(255,255,255));
                    layerGui.addChild(layerGui.lblPlayer2CardCount);
                }
                layerGui.lblPlayer2CardCount.setString(playeri.getCardsCount());
            }
            if(displayPos == 3)
            {
                if(layerGui.imgPlayer3CardCount == null)
                {
                    layerGui.imgPlayer3CardCount = new BkSprite("#"+res_name.verticalBack);
                    layerGui.imgPlayer3CardCount.x = startPoint.x + 75;
                    layerGui.imgPlayer3CardCount.y = startPoint.y;
                    layerGui.addChild(layerGui.imgPlayer3CardCount);
                }
                if(layerGui.lblPlayer3CardCount == null)
                {
                    layerGui.lblPlayer3CardCount = new BkLabel("","Tahoma",20);
                    layerGui.lblPlayer3CardCount.x = startPoint.x + 75;
                    layerGui.lblPlayer3CardCount.y = startPoint.y ;
                    layerGui.lblPlayer3CardCount.setTextColor(cc.color(255,255,255));
                    layerGui.addChild(layerGui.lblPlayer3CardCount);
                }
                layerGui.lblPlayer3CardCount.setString(playeri.getCardsCount());
            }
        }
    }
};

Util.animateDealCard = function(logic,layerGui,numberCard,finishDealingCB,onProgressDealingcb,isDelay,timeInterval,offset,startX){
    var startPoint0 = null;
    var startPoint1 = null;
    var startPoint2 = null;
    var startPoint3 = null;
    var startPoint4 = null;
    var startPoint5 = null;
    var CARD_ONHAND_OFFSET = 35;
    var count = -1;
    logic.isDealingCard = true;
    var Interval = 1;
    if (timeInterval!= undefined){
        Interval = timeInterval;
    }
    var centerPoint = new cc.Point(cc.director.getWinSize().width/2,cc.director.getWinSize().height/2);
    var isGame6Player = (logic.maxPlayer == 6);
    if  (isGame6Player){
        logMessage("isGame6Player "+logic.maxPlayer);
    }

    var isPhomGame = false;
    if (logic instanceof BkPhomIngameLogic){
        isPhomGame = true;
    }

    // tinh location
    for(var i = 0;  i <= logic.maxPlayer ; i++) // server pos
    {
        var playeri = logic.getPlayer(i);
        if(playeri != null)
        {
            logMessage(" playeri "+i + " != null");
            var playerAvatari =  layerGui.getAvatarByServerPos(i);
            var displayPos = logic.getPlayerDisplayLocation(i);
            if(displayPos == 0) // me
            {
                //startPoint0 =    new cc.Point(playerAvatari.x + 115 ,YPOS_ONHAND_DOWN);
                startPoint0 =    new cc.Point(playerAvatari.x +  BkConstantIngame.DEFAULT_CARD_MARGIN_AVAR,YPOS_ONHAND_DOWN);
                if (BkGlobal.currentGameID == GID.POKER) {
                    startPoint0 =    new cc.Point(playerAvatari.x + 90 ,YPOS_ONHAND_DOWN + 38);
                }
                if (BkGlobal.currentGameID == GID.XITO) {
                    startPoint0 = new cc.Point(playerAvatari.x + 80 , playerAvatari.y);
                }
                if (BkGlobal.currentGameID == GID.BA_CAY) {
                    startPoint0 = new cc.Point(playerAvatari.x + 80 ,playerAvatari.y);
                }
                if (BkGlobal.currentGameID == GID.LIENG) {
                    startPoint0 = new cc.Point(playerAvatari.x + 90 ,playerAvatari.y);
                }
                var myOnhandCard = playeri.getOnHandCard();
            }
            if(displayPos == 1)
            {
                startPoint1 =  new cc.Point(playerAvatari.x,playerAvatari.y);
                if (isPhomGame){
                    startPoint1 = new cc.Point(playerAvatari.x - 75,playerAvatari.y);
                }
                if (isGame6Player){
                    startPoint1 = new cc.Point(playerAvatari.x,playerAvatari.y);//getCardDisplayLocation(1,displayPos,logic.maxPlayer,0)
                }
                var player1 = logic.getPlayer(i);
            }
            if(displayPos == 2)
            {
                startPoint2 = new cc.Point(playerAvatari.x - 90,playerAvatari.y);
                if (isPhomGame){
                    startPoint2 = new cc.Point(playerAvatari.x - 78,playerAvatari.y);
                }
                if (isGame6Player){
                    startPoint2 = new cc.Point(playerAvatari.x,playerAvatari.y);//getCardDisplayLocation(1,displayPos,logic.maxPlayer,0)
                }
                var player2 = logic.getPlayer(i);

            }
            if(displayPos == 3)
            {
                startPoint3 = new cc.Point(playerAvatari.x,playerAvatari.y);

                if (isPhomGame){
                    startPoint3 = new cc.Point(playerAvatari.x + 75,playerAvatari.y);
                }

                if (isGame6Player){
                    startPoint3 = getCardDisplayLocation(1,displayPos,logic.maxPlayer,0)
                }
                var player3 = logic.getPlayer(i);
            }
            if(displayPos == 4)
            {
                if (isGame6Player){
                    startPoint4 = getCardDisplayLocation(1,displayPos,logic.maxPlayer,0)
                }
                var player4 = logic.getPlayer(i);
            }
            if(displayPos == 5)
            {
                if (isGame6Player){
                    startPoint5 = getCardDisplayLocation(1,displayPos,logic.maxPlayer,0)
                }
                var player5 = logic.getPlayer(i);
            }
        }
    }

    var doAnimationMovecardWithData = function(icount,endPoint,player){
        var card;
        if(endPoint != null) {
            card = new BkCard(14,1);
            layerGui.addChild(card);
            card.setSelectable(false);
            card.x = centerPoint.x;
            card.y = centerPoint.y;
            card.visible = true;
            card.moveAndScale(Interval/13,endPoint.x,endPoint.y);
            player.setCardsCount(icount + 1);
            if (onProgressDealingcb != undefined){
                onProgressDealingcb(player);
            }
        }
    };

    layerGui.schedule(function onDealCard() {
        count++;
        var card;
        if(startPoint0 != null) {
            if(offset != undefined && offset > 0) {
                CARD_ONHAND_OFFSET = offset;
            }
            if(startX != undefined && startX > 0) {
                startPoint0.x = startX;
            }
            if (count <myOnhandCard.length){
                card = myOnhandCard[count];
                layerGui.addChild(card);
                card.setSelectable(false);
                card.x = centerPoint.x ;
                card.y = centerPoint.y;
                card.move(Interval/13, startPoint0.x + count*CARD_ONHAND_OFFSET,startPoint0.y);
                card.visible = true;
            }
        }
        playDealCardSound();

        doAnimationMovecardWithData(count,startPoint1,player1);
        doAnimationMovecardWithData(count,startPoint2,player2);
        doAnimationMovecardWithData(count,startPoint3,player3);
        doAnimationMovecardWithData(count,startPoint4,player4);
        doAnimationMovecardWithData(count,startPoint5,player5);

        if(count == (numberCard-1)) {
            layerGui.unschedule(onDealCard);

            var f = function(){
                logic.isDealingCard = false;
                for(var i = 0; i < myOnhandCard.length; i++)
                {
                    var cardi = myOnhandCard[i];
                    cardi.setSelectable(true);
                    cardi.showMask(false);
                }
                finishDealingCB();
            };

            if ((isDelay == undefined)||(isDelay)){
                layerGui.schedule(function onDealCardfinished() {
                    layerGui.unschedule(onDealCardfinished);
                    f();
                },Interval);
            } else {
                f();
            }

            playDealCardSound();
        }
    },Interval/13);
};

function IsNumeric(input)
{
    return (input - 0) == input && (''+input).trim().length > 0;
}
Util.getGameIconById = function(gid, prefixName,isProfile) {
    // rowNum, colNum bat dau tinh tu 0
    var iconWidth = 62; // = width iamge + 2 px (image plist)
    var iconHeight = 66;//134.5;
    var xPos = 0;
    var yPos = 0;
    var gData = null;
    // deltaX la khoang cach tu anh voi mep trai
    var deltaX = 1;
    switch (gid) {
        case GID.TLMN:
            gData = {
                rect: cc.rect(xPos, yPos, iconWidth, iconHeight),
                name: "TLMN"
            };
            break;
        case GID.TLMN_DEM_LA:
            gData = {
                rect: cc.rect(xPos, iconHeight, iconWidth, iconHeight),
                name: "Đếm Lá"
            };
            break;
        case GID.XAM:
            gData = {
                rect: cc.rect(xPos, 2*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.POKER:
            gData = {
                rect: cc.rect(xPos, 3*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.XITO:
            gData = {
                rect: cc.rect(xPos, 4*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.CO_UP:
            gData = {
                rect: cc.rect(xPos, 5*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.PHOM:
            gData = {
                rect: cc.rect(xPos, 6*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.MAU_BINH:
        case GID.MAU_BINH_OLD:
            gData = {
                rect: cc.rect(xPos, 7*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.BA_CAY:
            gData = {
                rect: cc.rect(xPos, 8*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.CHAN:
            gData = {
                rect: cc.rect(xPos, 9*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.LIENG:
            gData = {
                rect: cc.rect(xPos, 10*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.XI_DZACH:
            gData = {
                rect: cc.rect(xPos,11*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case GID.CO_TUONG:
            gData = {
                rect: cc.rect(xPos,12*iconHeight, iconWidth, iconHeight),
                name: Util.getGameLabel(gid)
            };
            break;
        case -1:
            gData = {
                gameIcon: res_name.icon_topDaiGia,
                rect: cc.rect(xPos,0, 63, 63),
                name: Util.getGameLabel(gid)
            };
            break;
        case -2:
            gData = {
                gameIcon: res_name.icon_topNhietTinh,
                rect: cc.rect(xPos, 0, 63, 63),
                name: Util.getGameLabel(gid)
            };
            break;
        default:
            return null;
    }
    var gameIconSp = new BkSprite();
    var gameIconImg = res.icon_all_gameIMG_top;
    if(gData.gameIcon != undefined){
        gameIconImg = "#"+gData.gameIcon;
    }
    var gameIcon = new BkSprite(gameIconImg, gData.rect);
    gameIconSp.addChild(gameIcon);
    var name = gData.name;
    if(prefixName != undefined && prefixName != ""){
        name = prefixName + "\n"+gData.name;
    }
    var lblGame;
    if(isProfile != undefined && isProfile == true)
    {
        lblGame = new BkLabel(name, "", 16,true);
    }else
    {
        lblGame = new BkLabel(name, "", 16);
    }
    gameIcon.x = gameIcon.x - 0.5;
    lblGame.x = gameIcon.getContentSize().width/2 + lblGame.getContentSize().width/2 +5;
    lblGame.y = gameIcon.y - 5;
    gameIconSp.addChild(lblGame);
    if(gid >= 0) {
        lblGame.x = lblGame.getContentSize().width/2 + 40;
        lblGame.y = 0;
    }
    return gameIconSp;
};

Util.createBtnNav = function (resName, callback) {
    var btn = new BkSprite("#" + resName);
    btn.setMouseOnHover(function () {
            btn.setScale(1.05);
        },
        function () {
            btn.setScale(1);
        });
    btn.setOnlickListenner(function () {
        callback();
    });
    return btn;
};

Util.arrayClone = function( arr ) {
    var i, copy;
    if( Array.isArray( arr ) ) {
        copy = arr.slice( 0 );
        for( i = 0; i < copy.length; i++ ) {
            copy[ i ] = Util.arrayClone( copy[ i ] );
        }
        return copy;
    } else if( typeof arr === 'object' ) {
        throw 'Cannot clone array containing an object!';
    } else {
        return arr;
    }
};

Util.copy = function(o) {
    var out, v, key;
    out = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        out[key] = (typeof v === "object") ? Util.copy(v) : v;
    }
    return out;
};

Util.createClientIdSuffix = function (clientId) {
    return clientId + ";"+c.NETWORK_VERSION + ";"+c.WEBJS_VERSION;
};
Util.replaceClientIdSuffix = function(clientid)
{
    //update clientId from version 1 to version 6 to apply new SMS bonus policy
    var newNWVer = ";"+c.NETWORK_VERSION;
    var rtnStr = clientid.replace(";1",newNWVer);
    return rtnStr;
};
Util.getAddBonusPercent = function (bonusType) {
    var percentList = [0, 30, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800];
    if (bonusType < percentList.length) {
        return percentList[bonusType];
    }
    return BT.ZERO_PERCENT;
};
Util.getBonusType = function(bonusPercent)
{
    var percentList = [0, 30, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800];
    for(var i = 0; i < percentList.length; i++)
    {
        if(percentList[i] == bonusPercent)
        {
            return i;
        }
    }
    return 0;
};
Util.getBonusPercent = function(bonusType)
{
    switch (bonusType) {
        case BT.THIRTY_PERCENT:
            return 30;
        case BT.FIFTY_PERCENT:
            return 50;
        case BT.HUNDRERD_PERCENT:
            return 100;
        case BT.HUNDRERD_FIFTY_PERCENT:
            return 150;
        case BT.TWO_HUNDRERD_PERCENT:
            return 200;
        case BT.THREE_HUNDRERD_PERCENT:
            return 300;
        case BT.FOUR_HUNDRERD_PERCENT:
            return 400;
        case BT.FIVE_HUNDRERD_PERCENT:
            return 500;
        case BT.SIX_HUNDRERD_PERCENT:
            return 600;
        case BT.SEVENT_HUNDRERD_PERCENT:
            return 700;
        case BT.EIGHT_HUNDRERD_PERCENT:
            return 800;
    }
    return 0;
};
Util.postDelay = function(target,timeDelay,cb){
    target.scheduleOnce(function soCallback(){
        cb();
        target.unschedule(soCallback);
    },timeDelay);
};

Util.getPokerSuiteResource = function(suiteType) {
    switch (suiteType) {
        case THUNGPHASANH:
            return res_name.winner_thungphasanh;
        case TUQUY:
            return res_name.winner_tuquy;
        case CULU:
            return res_name.winner_culu;
        case THUNG:
            return res_name.winner_thung;
        case SANH:
            return res_name.winner_sanh;
        case SAMCO:
            return res_name.winner_samco;
        case THU:
            return res_name.winner_thu;
        case DOI:
            return res_name.winner_doi;
        default:
            return res_name.winner_mauthau;
    }
    return res_name.winner_mauthau;
};

Util.getGameSettingList = function () {
    return [
        {
            res: {
                active: res_name.icon_CoUp_active,
                hover: res_name.icon_CoUp_hover,
                disable: res_name.icon_CoUp_active
            },
            order: 0,
            isEnable: true,
            gid: GID.CO_UP
        }
        ,{
            res: {
                active: res_name.icon_CoTuong_active,
                hover: res_name.icon_CoTuong_hover,
                disable: res_name.icon_CoTuong_active
            },
            order: 1,
            isEnable: true,
            gid: GID.CO_TUONG
        }
        ,{
            res: {
                active: res_name.icon_TLMNDL_active,
                hover: res_name.icon_TLMNDL_hover,
                disable: res_name.icon_TLMNDL_active
            },
            order: 2,
            isEnable: true,
            gid: GID.TLMN_DEM_LA
        }
        ,{
            res: {
                active: res_name.icon_TLMN_active,
                hover: res_name.icon_TLMN_hover,
                disable: res_name.icon_TLMN_active
            },
            order: 3,
            isEnable: true,
            gid: GID.TLMN
        }
        ,{
            res: {
                active: res_name.icon_Sam_active,
                hover: res_name.icon_Sam_hover,
                disable: res_name.icon_Sam_active
            },
            order: 4,
            isEnable: true,
            gid: GID.XAM
        }
        ,{
            res: {
                active: res_name.icon_Phom_active,
                hover: res_name.icon_Phom_hover,
                disable: res_name.icon_Phom_active
            },
            order: 5,
            isEnable: true,
            gid: GID.PHOM
        }
        ,{
            res: {
                active: res_name.icon_Poker_active,
                hover: res_name.icon_Poker_hover,
                disable: res_name.icon_Poker_active
            },
            order: 6,
            isEnable: true,
            gid: GID.POKER
        }
        ,{
            res: {
                active: res_name.icon_MauBinh_active,
                hover: res_name.icon_MauBinh_hover,
                disable: res_name.icon_MauBinh_active
            },
            order: 7,
            isEnable: true,
            gid: GID.MAU_BINH
        }
        ,{
            res: {
                active: res_name.icon_Lieng_active,
                hover: res_name.icon_Lieng_hover,
                disable: res_name.icon_Lieng_active
            },
            order: 8,
            isEnable: true,
            gid: GID.LIENG
        }
        ,{
            res: {
                active: res_name.icon_Chan_active,
                hover: res_name.icon_Chan_hover,
                disable: res_name.icon_Chan_active
            },
            order: 9,
            isEnable: true,
            gid: GID.CHAN
        }
        ,{
            res: {
                active: res_name.icon_Xizach_active,
                hover: res_name.icon_Xizach_hover,
                disable: res_name.icon_Xizach_active
            },
            order: 10,
            isEnable: true,
            gid: GID.XI_DZACH
        }
        ,{
            res: {
                active: res_name.icon_3Cay_active,
                hover: res_name.icon_3Cay_hover,
                disable: res_name.icon_3Cay_active
            },
            order: 11,
            isEnable: true,
            gid: GID.BA_CAY
        }
        ,{
            res: {
                active: res_name.icon_xiTo_active,
                hover: res_name.icon_xiTo_hover,
                disable: res_name.icon_xiTo_active
            },
            order: 13,
            isEnable: true,
            gid: GID.XITO
        }
        ,{
            res: {
                active: res_name.icon_soccer_active,
                hover: res_name.icon_soccer_hover,
                disable: res_name.icon_soccer_active
            },
            order: 14,
            isEnable: true,
            gid: GID.SOCCER
        }

    ];
};

Util.loadResource = function (resList, finishedCb) {
    var hasDlError = false;
    //load resources
    cc.loader.load(resList,
        function (result, totalCount, loadedCount) {
            //var percent = (totalCount / loadedCount * 100) | 0;
            var percent = ((loadedCount/resList.length) * 100) | 0;
            percent = Math.min(percent, 100);
            $('#progress-text').text("Đang tải..." + percent + "%");


            // chinh debug
            return;

            if (!result) {
                hasDlError = true;
                showPopupMessageConfirmEx("Có lỗi khi tải game, xin hãy kiểm tra kết nối sau đó bấm OK để thử lại.", function () {
                    Util.reloadWebPage();
                },true);
            }
        },
        function (result) {
            if (!hasDlError) {
                hideProgressModalEx();
                cc.spriteFrameCache.addSpriteFrames(res.btn_sprite_sheet_plist, res.btn_sprite_sheet_img);
                cc.spriteFrameCache.addSpriteFrames(res.vv_sprite_sheet_plist, res.vv_sprite_sheet_img);
                //cc.spriteFrameCache.addSpriteFrames(res.ingame_plist, res.ingame_img);
                if (finishedCb) finishedCb();
            }
        });
};

Util.isGameCo = function (currentGID) {
    var gid = BkGlobal.currentGameID;
    if(currentGID != undefined){
        gid = currentGID;
    }
    return (gid == GID.CO_TUONG) || (gid == GID.CO_UP);
};
getMinTableBetMoney = function(gameID,tableBetMoney)
{
    switch(gameID)
    {
        case GID.MAU_BINH:
            return 3;
            break;
        case GID.TLMN_DEM_LA:
        case GID.XAM :
            if(tableBetMoney < 1000)
            {
                return 5;
                break;
            }else
            {
                return 10;
                break;
            }
        case GID.TLMN:
        case GID.XI_DZACH:
        case GID.BA_CAY:
        case GID.PHOM:
            return 5;
            break;
        case GID.POKER:
            return 2;
            break;
        case GID.LIENG :
        case GID.XITO:
        case GID.CO_TUONG:
        case GID.CO_UP:
            return 1;
            break;
    }
    return 5;
};
getGameSettingById = function(gid)
{
    var gameList = Util.getGameSettingList();
    for(var i = 0; i < gameList.length; i++)
    {
        if(gameList[i].gid == gid )
        {
            return gameList[i];
        }
    }
    return null;
};
getOtherGameList = function(mainId)
{
    var gameList = Util.getGameSettingList();
    for(var i = 0; i < gameList.length; i++)
    {
        if(gameList[i].gid == mainId )
        {
            gameList.splice(i,1);
        }
    }
    return gameList;
};
getOtherGameListFromSublist = function(mainGameid,gameListString)
{
    if(gameListString == "")
    {
        return null;
    }
    var arrGameList =  gameListString.split(",");
    var gameList = Util.getGameSettingList();
    var rtnList = [];
    for(var i = 0; i < arrGameList.length; i++)
    {
        if(arrGameList[i] != mainGameid)
        {
            rtnList.push(getGameSettingById(arrGameList[i]));
        }
    }
    return rtnList;
};
stopTabToPrevious = function (event) {
    if (event.shiftKey && event.keyCode == 9) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
    return true;
};
stopTabToNext = function (event) {
    if (event.shiftKey && event.keyCode == 9) {
        return true;
    }
    if (event.keyCode === 9) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
    return true;
};

stopTab = function (event){
    if (event.shiftKey && event.keyCode == 9) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
    if (event.keyCode === 9) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
    return true;
};
getYposforToast = function(gid)
{
    switch(gid)
    {

        case GID.TLMN:
        case GID.TLMN_DEM_LA:
        case GID.XAM :
            return 300;
            break;
        case GID.XI_DZACH:
        case GID.BA_CAY:
        case GID.MAU_BINH:
            return 390;
        case GID.PHOM:
            return 420;
            break;
        case GID.POKER:
            return 300;
            break;
        case GID.LIENG :
            return 350;
            break;
        case GID.XITO:
            return 370;
            break;
        case GID.CO_TUONG:
        case GID.CO_UP:
            return 260;
            break;
    }
    return 300;
};

Util.getRegPhoneBonus = function(){

    var bonusMoney = BkConstants.BONUS_REGISTER_PHONE;
    if(cc.game.config.app && cc.game.config.app.regPhoneBonus){
        bonusMoney = cc.game.config.app.regPhoneBonus;
    }

    if(!cc.isUndefined(bk.bonusPhone) && bk.bonusPhone != ""){
        bonusMoney = bk.bonusPhone;
    }

    return bonusMoney;
}
getTableMoneyWarning = function(gid)
{
    switch(gid)
    {
        case GID.TLMN:
        case GID.TLMN_DEM_LA:
        case GID.XAM :
        case GID.MAU_BINH:
        case GID.PHOM:
            return 0.1;
            break;
        case GID.XI_DZACH:
        case GID.BA_CAY:
        case GID.POKER:
        case GID.LIENG :
        case GID.XITO:
            return 0.2;
            break;
        case GID.CO_TUONG:
        case GID.CO_UP:
            return 1;
            break;
    }
    return 1;
};
getBackgroundImg = function(gid,gs)
{
    var webbg = "bg-fbapp.png";
    if(bk.isFbApp)
    {
        return webbg;
    }
    switch(gs)
    {
        case GS.CHOOSE_GAME:
            webbg = "web_bg_chooseGame.jpg";
            break;
        case GS.CHOOSE_TABLE:
            webbg = "web_bg_chooseGame.jpg";
            if(Util.isGameCo())
            {
                webbg = "web_bg_chooseTable_Chess.jpg";
            }
            break;
        case GS.INGAME_GAME:
            webbg = "web_bg_ingame.png";
            if(Util.isGameCo())
            {
           
                webbg = "web_bg_chooseTable_Chess.jpg";
            }
            break;
        default:
            webbg = "web_bg_chooseGame.jpg";
    }
    return webbg;
};

/*using bgswitcher function to change bg images*/
swichBackgroundImg = function(gs)
{
    try {
        var bodyElement = $(BODY_CLASS_CSS);
        if (!cc.isFunction(bodyElement.bgswitcher)) {
            //console.log("bgswitcher func not found!");
            return;
        }
        switch (gs) {
            case GS.CHOOSE_GAME:
                bodyElement.bgswitcher("select", 0);
                break;
            case GS.CHOOSE_TABLE:
                if (Util.isGameCo()) {
                    bodyElement.bgswitcher("select", 1);
                }
                break;
            case GS.INGAME_GAME:
                if (Util.isGameCo()) {
                    bodyElement.bgswitcher("select", 1);
                } else {
                    bodyElement.bgswitcher("select", 2);
                }
                break;
            default:
                bodyElement.bgswitcher("select", 0);
        }
    }
        catch(e) {
            logMessage(e);
        }
}

Util.isNeedToChangeIcon = function()
{
    if(Util.isGameCo(BkGlobal.currentGameID) || bk.isSubFbApp)
    {
        return true;
    }
    return false;
};
Util.logPurchase = function(amount,type)
{
    //if(bk.isFbCanvas)
    //{
        var params = {};
        params[FB.AppEvents.ParameterNames.CONTENT_ID] = type;
        FB.AppEvents.logPurchase(amount/1000,"USD",params);
    //}
};
Util.logEvent = function(type,param1,param2)
{
    //if(bk.isFbCanvas)
    //{
        var params = {};
        params[param1] = param2;
        FB.AppEvents.logEvent(type,null,params);
        logMessage("Util.logEvent");
    //}
};
Util.isNeedResizeScreen = function()
{
    return(bk.isMobileOnly || (bk.isFbApp && window.screen.width <= 1024));
};
Util.resizeDivWebElement = function(modWidth)
{
    var cssWidth = cc._canvas.width;
    $('#contentNews').css('width', cssWidth - modWidth +'px');
    $('.appAdvertise-fb').css('width', cssWidth - modWidth+'px');
    $('.content-fb').css('width', cssWidth - modWidth  +'px');
    $("#Cocos2dGameContainer").addClass('bchan-show');
};
Util.openPushWindow = function()
{
    try {
        var link = bk.httpHost + "fbpush.html?username=" + BkGlobal.UserInfo.getUserName();
        window.open(link, "Register push", "width=450,height=378");
    } catch (err)
    {
    }
};
Util.isNeedtoShowPushPopup = function()
{
    var endpoint = Util.getClientSetting(key.endpoint,false,null);
    var popupCount = Util.getClientSetting(key.popupCount,false,1);
    var isShow = false;
    if(Util.isShowWebPush() && endpoint == DEFAULT_CLIENT_VALUE )
    {
        if(popupCount <= 3)
        {

            Util.setClientSetting(key.popupCount,parseInt(popupCount) + 1);
            isShow  = true;
            //sendGA(BKGA.GAME_CHOOSE, "forced Show Push Popup", popupCount);
        }
    }
    return isShow;
};
Util.isShowWebPush = function()
{
    return ((cc.sys.browserType == cc.sys.BROWSER_TYPE_FIREFOX || cc.sys.browserType == cc.sys.BROWSER_TYPE_CHROME) && bk.showWebPushFlg == 1);
};
Util.hasRegisterPush = function()
{
    var endpoint = Util.getClientSetting(key.endpoint,false,null);
    if(endpoint == DEFAULT_CLIENT_VALUE || endpoint == -1)
    {
        return false;
    }
    return true;
};
Util.isNeedtoShowRegisterPushButton = function()
{
    return(Util.isShowWebPush() && !Util.hasRegisterPush()) ;
};
Util.getNumOfBottomIcon = function()
{
   var numOfIcons = 5;
   if(bk.showCreateDesktopIconTutorial != 0)
   {
       numOfIcons = numOfIcons + 1;
   }
    if(Util.isNeedtoShowRegisterPushButton())
    {
        numOfIcons = numOfIcons + 1;
    }
   return  numOfIcons;
};
Util.getStartXOfBottomIcon = function(numOfIcons,isSubFbApp)
{
    var startX = 375.5;
    if(isSubFbApp)
    {
        if(numOfIcons == 6)
        {
            startX = 320;
        }
        if(numOfIcons == 7)
        {
            startX = 270;
        }
    }else
    {
        if(numOfIcons == 5)
        {
            startX = 270.5;
        }
        if(numOfIcons == 6)
        {
            startX = 215.5;
        }
        if(numOfIcons == 7)
        {
            startX = 167;
        }
    }
    //console.log("numOfIcons:" + numOfIcons + "startX:" + startX);
    return startX;
};
Util.getSubLinkUrl = function(gid)
{
    switch(gid)
    {
        case GID.BA_CAY :
            return "co-up";
            break;
        case GID.XITO :
            return "xi-to";
            break;
        case GID.LIENG :
            return "co-up";
            break;
        case GID.XI_DZACH:
            return "xi-dach";
            break;
        case GID.POKER:
            return "poker";
            break;
        case GID.CO_TUONG:
            return "co-tuong";
            break;
        case GID.CO_UP:
            return "co-up";
            break;
        case GID.TLMN:
            return "tien-len-mien-nam";
            break;
        case GID.TLMN_DEM_LA:
            return "tien-len-mien-nam-dem-la";
            break;
        case GID.PHOM:
            return "phom-ta-la";
            break;
        case GID.MAU_BINH:
            return "co-up";
            break;
        case GID.XAM:
            return "sam-loc";
            break;
    }
    return "";
};
Util.getGameRuleLinkUrl = function(gid)
{
    switch(gid)
    {
        case GID.BA_CAY :
            return "ba-cay/huong-dan-choi-ba-cay/";
            break;
        case GID.XITO :
            return "xi-to/huong-dan-choi-xi-to/";
            break;
        case GID.LIENG :
            return "lieng/huong-dan-luat-danh-bai-lieng";
            break;
        case GID.XI_DZACH:
            return "xi-dach/huong-dan-choi-xi-dach/";
            break;
        case GID.POKER:
            return "poker/huong-dan-choi-bai-poker-online/";
            break;
        case GID.CO_TUONG:
            return "co-tuong/huong-dan-choi-co-tuong/";
            break;
        case GID.CO_UP:
            return "co-up/huong-dan-choi-co-up/";
            break;
        case GID.TLMN:
            return "tien-len-mien-nam/huong-dan-choi-tien-len-mien-nam/";
            break;
        case GID.TLMN_DEM_LA:
            return "tien-len-mien-nam-dem-la/huong-dan-choi-tien-len-mien-nam-dem-la/";
            break;
        case GID.PHOM:
            return "phom-ta-la/huong-dan-choi-phom-ta-la/";
            break;
        case GID.MAU_BINH:
            return "mau-binh/huong-dan-choi-mau-binh/";
            break;
        case GID.XAM:
            return "sam-loc/huong-dan-choi-sam-loc/";
            break;
        case 98:
            return "tong-hop-cac-huong-dan-trong-game-bai-bigkool-online/";
            break;
    }
    return "";
};

Util.getFBAppLinkUrl = function(gid)
{
    switch(gid)
    {
        case GID.BA_CAY :
            return "https://apps.facebook.com/bacay-bigkool/";
            break;
        case GID.XITO :
            return "https://apps.facebook.com/xito-bigkool/";
            break;
        case GID.LIENG :
            return "https://apps.facebook.com/lieng-bigkool/";
            break;
        case GID.XI_DZACH:
            return "https://apps.facebook.com/xidzach-bigkool/";
            break;
        case GID.POKER:
            return "https://apps.facebook.com/poker-bigkool/";
            break;
        case GID.CO_TUONG:
            return "https://apps.facebook.com/cotuongcoup/";
            break;
        case GID.CO_UP:
            return "https://apps.facebook.com/choi-co-up-online/";
            break;
        case GID.TLMN:
            return "https://apps.facebook.com/tlmn-bigkool/";
            break;
        case GID.TLMN_DEM_LA:
            return "https://apps.facebook.com/tlmn-dem-la/";
            break;
        case GID.PHOM:
            return "https://apps.facebook.com/phom-bigkool/";
            break;
        case GID.MAU_BINH:
            return "https://apps.facebook.com/maubinh-bigkool/";
            break;
        case GID.XAM:
            return "https://apps.facebook.com/sam-bigkool/";
            break;
        case GID.CHAN:
            return "https://apps.facebook.com/chan_van_van/";
            break;
    }
    return "https://apps.facebook.com/archer_mobile_group/";
};

Util.showSnow = function(gui)
{
    gui._emitter = new BkSnow();
    gui.addChild(gui._emitter, 10);

    gui._emitter.life = 10;
    gui._emitter.lifeVar = 1;

    // gravity
    gui._emitter.gravity = cc.p(0, -20);

    // speed of particles
    gui._emitter.speed = 5;
    gui._emitter.speedVar = 30;

    var startColor = gui._emitter.startColor;
    startColor.r = 230;
    startColor.g = 230;
    startColor.b = 230;
    gui._emitter.startColor = startColor;

    var startColorVar = gui._emitter.startColorVar;
    startColorVar.b = 26;
    gui._emitter.startColorVar = startColorVar;

    gui._emitter.emissionRate = gui._emitter.totalParticles / gui._emitter.life;

    gui._emitter.texture = cc.textureCache.addImage(res.snow);
    gui._emitter.shapeType = cc.ParticleSystem.BALL_SHAPE;
    gui._emitter.x = 440.5;
    gui._emitter.y = 630;
};
Util.isFBCanvasDesktop = function()
{
    return(cc.sys.browserType == "facebookcanvasdesktop");
};
Util.isAutoCreateAccount = function()
{
    return (BkGlobal.isNewRegistraion && bk.isDesktopApp)
};
Util.getGiaidauLogoUrl = function(id)
{
    var url = "https://bigkool.net/resbong/index/bongda/giaidau/" + id + ".png";
    return url;
};
Util.getImgDoiBongUrl = function(id)
{
    var url = "https://bigkool.net/resbong/index/bongda/doibong/" + id + ".png";
    return url;
};
Util.getStartTime = function(time,isShowYear)
{
    var a = new Date(time * 1000);
    if(isShowYear != undefined && isShowYear == true)
    {
        var fullYear = a.getFullYear().toString();
        var year = fullYear.substring(2,4);
    }
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var month = months[a.getMonth()];
    var date = a.getDate();
    if(date.toString().length < 2)
    {
        date  = "0" + date;
    }
    var hour = a.getHours();
    if(hour.toString().length < 2)
    {
        hour  = "0" + hour;
    }
    var min = a.getMinutes();
    if(min.toString().length < 2)
    {
        min  = "0" + min;
    }
    var time = date+ '-' + month + ' '  + hour + ':' + min ;
    if(isShowYear != undefined && isShowYear == true)
    {
        return date+ '-' + month + '-' + year + ' '  + hour + ':' + min ;
    }
    return date+ '-' + month  + ' '  + hour + ':' + min ;
};
Util.getLoggedInTime = function(time)
{
    var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    var loggedTime = new Date(time);
    var date = loggedTime.getDate();
    var month = months[loggedTime.getMonth()];
    var year = loggedTime.getFullYear().toString();
    if(date.toString().length < 2)
    {
        date  = "0" + date;
    }
    var hour = loggedTime.getHours();
    if(hour.toString().length < 2)
    {
        hour  = "0" + hour;
    }
    var min = loggedTime.getMinutes();
    if(min.toString().length < 2)
    {
        min  = "0" + min;
    }
    var curTime = (new Date()).getTime();
    curTime = new Date(curTime);
    var today = curTime.getDate();
    var thisMonth = months[curTime.getMonth()];
    var curYear = curTime.getFullYear().toString();
    if(date == today && month == thisMonth && year == curYear )
    {
        return 'Hôm nay ('  + hour + ':' + min + ')';
    }
    return date+ ' th ' + month  + ' ('  + hour + ':' + min + ")";
};
Util.getRemainingTime = function(startTime)
{
    var remainTime = startTime -  BkGlobal.currentServerTime;
    return Util.secondsToTimecode(remainTime);
};
Util.secondsToTimecode = function(seconds){
    var minutes          = Math.floor(seconds/60);
    var remainingSec     = seconds % 60;
    var remainingMinutes = minutes % 60;
    var hours            = Math.floor(minutes/60);
    var floatSeconds     = Math.floor((remainingSec - Math.floor(remainingSec))*100);
    remainingSec         = Math.floor(remainingSec);

    var remainingDay 	= Math.floor(hours / 24);
    //logMessage("remainingDay:" +  remainingDay);
    var remainingHour 	= hours % 24;

    var strHour = remainingHour.toString();
    var strMinute = remainingMinutes.toString();
    var strSecond = remainingSec.toString();
    if(strHour.length < 2)
    {
        strHour = "0" + strHour;
    }
    if(strMinute.length < 2)
    {
        strMinute = "0" + strMinute;
    }
    if(strSecond.length < 2)
    {
        strSecond = "0" + strSecond;
    }
    var rtn="";
    if(remainingDay > 0)
    {
        rtn = remainingDay.toString() + "N" +  " " + strHour + ":" + strMinute + ":" + strSecond ;
    }else
    {
        rtn = strHour + ":" + strMinute + ":" + strSecond ;
    }
    return rtn;
};
Util.removeArrList = function(arrList)
{
    if (arrList!= null && arrList.length >0)
    {
        for (var i =0; i < arrList.length; i++)
        {
            var item = arrList[i];
            item.removeSelf();
        }
        while(arrList.length > 0)
        {
            arrList.splice(0,arrList.length);
        }
        arrList = null;
    }
};
//Util.split = function(source,delimiter)

Util.split = function(source,delimiter)
{
	var rtnOBJ = source.split(delimiter);
	return  source.split(delimiter);
};
Util.isShowDesktopPromo = function(){
    //return bk.showCreateDesktopIconTutorial == 3 && bk.isSubFbApp == false;
    return bk.showCreateDesktopIconTutorial == 1;
}
