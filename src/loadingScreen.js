BASE_URL = "https://chanvanvan.com/test/ChanMobiJstest/";
CUR_GAME_VER = "0";
if(typeof FILE_TYPE == "undefined") {
    var FILE_TYPE = {};
    FILE_TYPE.PNG  = "png";
    FILE_TYPE.jpg  = "jpg";
    FILE_TYPE.plist = "plist";
    FILE_TYPE.js = "js";
}
var loadingLayer = cc.Layer.extend({
    lc:0,
    totalLoad:0,
    listRs:[],
    isTestMode:true,
	ctor:function () 
    {
        this._super();
        var size = cc.winSize;
        var label = new cc.LabelTTF("Loading...","",25);
        label.x = size.width / 2;
        label.y = size.height / 2;
        this.addChild(label);
		this.getListResource();
    },
    getListResource:function()
    {
    	var url =  BASE_URL + "resource.json";
    	var xhr = cc.loader.getXMLHttpRequest();
		var self = this;
        logMessage("get file from Url:" + url);
		xhr.open("GET", url + "?v=" + (new Date()).getTime());
		xhr.onreadystatechange = function() 
		{
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
			{
					var parsedObjArr = JSON.parse(xhr.responseText);
					for(i = 0; i < parsedObjArr.length; i++)
					{
				        var fileDir  = parsedObjArr[i].file; 
				        var ver =  parsedObjArr[i].ver; 
				        var resObj = {fdir:fileDir,ver:ver}
				        self.listRs.push(resObj);
					}
					self.loadResource();
			}
		}
		xhr.send(null);
    },
    loadResource:function()
	{
        var fVer = 0;
		var fileDir = "";
		var fileFullPath = "";
		var fileName = "";
		var i = 0;
        var isloading = false;
		NativeInterface.setHandleLoadCompleted(this);
		do
		{
			fileDir = this.listRs[i].fdir;
			fVer = this.listRs[i].ver;
        	fileName = getFileNameFromFileServerDir(fileDir);
        	var curVer = BkClientSettingManager.getClientSetting(fileName,false,"0");
	        if(fVer > parseInt(curVer))
	        {
	        	isloading = true;
	        	this.totalLoad++;
	        	var fileType = getFileExtension(fileName);
	        	fileFullPath = BASE_URL + fileDir;
	        	if(fileType == FILE_TYPE.plist || fileType == FILE_TYPE.js)
	        	{
		        	NativeInterface.loadFileFromUrl(fileFullPath,fVer);
	        	}else if(fileType == FILE_TYPE.PNG)
	        	{
					NativeInterface.loadImageFromUrl(fileFullPath, fileName,fVer );
	        	}
	        }else 
	        {
	        	logMessage("resource:" + fileName + " is up to date" );
	        }
			i++;
		}
		while(i < this.listRs.length)
		if(isloading == false)
		{
			this.updateSearchPath();
			cc.director.runScene(new loginScene());
			logMessage("isloading == false");

		}
	},
	onloadCompleted:function(fileName,ver)
	{
		logMessage("call onload completed:" + fileName + "ver:" + ver);
        BkClientSettingManager.setClientSetting(fileName,ver);
    	this.lc++;
		if(this.lc == this.totalLoad)
		{
			this.updateSearchPath();
	        cc.director.runScene(new loginScene());
		}else 
		{
			this.loadResource();
		}
	},
	updateSearchPath:function()
	{
		logMessage("call Update Search Path");
		if(this.isTestMode == true)
		{
			return;
		}
		for(var i = 0; i < this.listRs.length; i++)
		{
			var fdir = this.listRs[i].fdir;
			var fName = getFileNameFromFileServerDir(fdir);
			if(getFileExtension(fName) == FILE_TYPE.js)
		    {
				var fullPath = jsb.fileUtils.getWritablePath() + fName;
				if(jsb.fileUtils.isFileExist(fullPath))
				{
					require(fullPath);
					logMessage("Require:" + fullPath);

				}
		    }
		}
	},
});

var loadingScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new loadingLayer();
        this.addChild(layer);
    }
});


