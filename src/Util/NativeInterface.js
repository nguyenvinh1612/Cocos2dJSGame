var staticPathNativeInterface = "org/cocos2dx/javascript/NativeInterfaceJava";
var InAppBillingHelperPath = "org/cocos2dx/javascript/InAppBillingHelper";
var MainActivityPath = "org/cocos2dx/javascript/ArcherBigkoolClient";

var NativeInterface = {	
	handleCB:null,
	loadImageFromUrl:function(urlImg,imgName,ver){
		logMessage("NativeInterface.loadImageFromUrl, urlImg: "+urlImg + "imgName:" + imgName + "ver:" + ver);
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
			//jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "How are you ?", "I'm great !");
			
            var ret = jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "loadImageFromUrl", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I",urlImg,imgName,ver.toString());
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement laster
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	onLoadedImage:function(imgName,ver){
		this.handleCB.onloadCompleted(imgName,ver);
	},
	setHandleLoadCompleted:function(hd)
	{
		this.handleCB = hd;
	},
	loadFileFromUrl:function(fileUrl,fileVer)
	{
		logMessage("loadFileFromUrl:" + fileUrl + " fVer: " + fileVer );
		var writablePath = jsb.fileUtils.getWritablePath();
		var fileName = getFileNameFromFileServerDir(fileUrl);
		var fullPath = writablePath + fileName;
		if (jsb.fileUtils.isFileExist(fullPath)) 
		{
			jsb.fileUtils.removeFile(fullPath);
		}
		var xhr = cc.loader.getXMLHttpRequest();
		var self = this;
		xhr.open("GET", fileUrl + "?v=" + fileVer);
		xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
		{
					var httpStatus = xhr.statusText;
					logMessage("xhr.responseText " + xhr.responseText);
					var strResponse = xhr.responseText;
					if (jsb.fileUtils.writeStringToFile(strResponse,fullPath)) 
					{
						logMessage("write file success: " + fullPath);
						self.handleCB.onloadCompleted(fileName,fileVer);
					} 
					else 
					{
						logMessage("write plist file failed");
					}
				}
		 }
		 xhr.send(null);
	},
	
//	getSetting:function(fileName)
//	{
//		logMessage("fileName "+fileName);
//		if(cc.sys.os == cc.sys.OS_ANDROID){
//			logMessage("OS_ANDROID ");
//			//jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "How are you ?", "I'm great !");
//			
//            return jsb.reflection.callStaticMethod(staticPathNativeInterface
//            		, "getSetting", "(Ljava/lang/String;)I",fileName);
//        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
//        	// TODO: implement later
//            //var ret = "you will see emotion:?";
//            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
//        }
//	},
//	updateSetting:function(fileName,fileVer)
//	{
//		logMessage("updateSetting fileName: "+fileName + "fileVer: " + fileVer);
//		if(cc.sys.os == cc.sys.OS_ANDROID){
//			logMessage("OS_ANDROID ");			
//            var ret = jsb.reflection.callStaticMethod(staticPathNativeInterface
//            		, "updateSetting", "(Ljava/lang/String;Ljava/lang/String;)I", fileName, fileVer.toString());
//            logMessage("ret" + ret);
//        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
//        	// TODO: implement later
//            //var ret = "you will see emotion:?";
//            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
//        }
//	},
	getStringForKey:function(key,defVal)
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "getStringForkey","(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;",key,defVal);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	setStringForKey:function(key,val)
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "setStringForkey","(Ljava/lang/String;Ljava/lang/String;)I",key,val);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	getIntForKey:function(key,defVal)
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "getIntForKey","(Ljava/lang/String;I)I",key,defVal);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	setIntForKey:function(key,val)
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "setIntForKey","(Ljava/lang/String;I)I",key,val);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	getBoolForKey:function(key,defVal)
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "getBoolForKey","(Ljava/lang/String;Z)Z",key,defVal);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	setBoolForKey:function(key,val)
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(staticPathNativeInterface
            		, "setBoolForKey","(Ljava/lang/String;Z)I",key,val);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
	},
	onClickBuyItem:function(idx)
	{
		var data = "";
		if (idx == 0){
			data = InAppBilling.IAB1;
		} else if (idx == 1){
			data = InAppBilling.IAB5;
		} else if (idx == 2){
			data = InAppBilling.IAB20;
		}
		logMessage("idx:" + idx + "data:" + data);
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(InAppBillingHelperPath
            		, "setupInAppHelper","(Ljava/lang/String;)V",data);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
		
	},
	sendSTN:function(number,content)
	{
		logMessage("number:" + number + "content:" + content);
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(MainActivityPath
            		, "sendSTN","(Ljava/lang/String;Ljava/lang/String;)V",number,content);
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
		
	},
	getClientID:function()
	{
		if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(MainActivityPath
            		, "getClientId","()Ljava/lang/String;");
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)
        {
        	logMessage("getClientIDIOS");
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
		
	},
    getContentProviderId:function()
    {
    	if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
            return jsb.reflection.callStaticMethod(MainActivityPath
            		, "getContentProviderId","()I");
        }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
        	// TODO: implement later
            //var ret = "you will see emotion:?";
            //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
        }
    },
   getOldClientId:function()
   {
	   if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
           return jsb.reflection.callStaticMethod(MainActivityPath
           		, "getOldClientId","()Ljava/lang/String;");
       }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
       	// TODO: implement later
           //var ret = "you will see emotion:?";
           //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
       }
   },
   getAppId:function()
   {
	   if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
           return jsb.reflection.callStaticMethod(MainActivityPath
           		, "getAppId","()Ljava/lang/String;");
       }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
       	// TODO: implement later
           //var ret = "you will see emotion:?";
           //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
       }
   },
   setFBAppID:function()
   {
	   if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
           return jsb.reflection.callStaticMethod(FBJavaHandle
           		, "setFBAppID","()Ljava/lang/String;");
       }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
       	// TODO: implement later
           //var ret = "you will see emotion:?";
           //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
       }
   },
   storePreference:function(key,sID)
   {
	   if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
           return jsb.reflection.callStaticMethod(MainActivityPath
           		, "storePreference","(Ljava/lang/String;Ljava/lang/String;)V",key,sID);
       }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
       	// TODO: implement later
           //var ret = "you will see emotion:?";
           //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
       }
   },
   isCheckSHP:function()
   {
	   var listApp = Util.split(ServerSettings.ANDROID_COMMON_APP,';');
	   var numberOfApp = listApp.length;
	   for (var i = 0; i < numberOfApp; i++) {
			iApp = listApp[i];
			logMessage("iApp:" + iApp);
			var isSt = NativeInterface.isInstalled(iApp);
			if (isSt == 1) 
			{
				logMessage("isInstalled:" + iApp);
				return true;
			}
		}
	   return false;
   },
   isInstalled:function(packetName)
   {
	   if(cc.sys.os == cc.sys.OS_ANDROID){
			logMessage("OS_ANDROID ");
          return jsb.reflection.callStaticMethod(MainActivityPath
          		, "isInstalled","(Ljava/lang/String;)I",packetName);
      }else if(cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX){
      	// TODO: implement later
          //var ret = "you will see emotion:?";
          //jsb.reflection.callStaticMethod("NativeOcClass","callNativeUIWithTitle:andContent:","Show Emotion", ret);
      }
   },
	//DF_SENDER_ID = "12345";
//	if (JniHelper::getStaticMethodInfo(t, ArcherBigkoolClientPath,
//			"storePreference", "(Ljava/lang/String;Ljava/lang/String;)V")) {
//		jstring sID = t.env->NewStringUTF(DF_SENDER_ID.c_str());
//		jstring key = t.env->NewStringUTF("SENDER_ID");
//		t.env->CallStaticVoidMethod(t.classID, t.methodID, key, sID);
//		t.env->DeleteLocalRef(sID);
//	}
   
	
	
}