/**
 * Created by bs on 08/10/2015.
 */
BkBaseLogic = cc.Class.extend({
    onLC:null,
    ctor:function(){
        var self = this;
    },
    processOnError:function(){
        logMessage("onerror ");

        if(cc.screen.fullScreen()){
            logMessage("is fullscreen -> exit fullscreen");
            exitFullScreen();
        }

        var onOKClick = function () {
            cc.loader.releaseAll();
            Util.reloadWebPage();
        };
        showPopupMessageConfirmEx(BkConstString.STR_NETWORK_EXCEPTION
            , function () {onOKClick();},true);
    },
    clearQueue:function(){
        BkConnectionManager.clearQueue();
    },
    processNextEventInQueue:function(){
        BkConnectionManager.processNextEventInQueue();
    },
    setOnLoadComplete:function(o){
        this.onLC = o;
    },
    pushOnLoadComplete:function(o, packetType){
        if (this.onLC != null) {
            this.onLC.onLoadComplete(o, packetType);
        } else {
            logMessage("BkBaseLogic not push packet with type =" + packetType);
        }
    },
    processNetworkEvent:function(packet){
        logMessage("BkBaseLogic -> processNetworkEvent "+packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;

            default:{
                logMessage("BkBaseLogic not process packet with type: "+packet.Type);
            }
        }
    }
});