/**
 * Created by bs on 29/09/2015.
 */
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

var SOCKET_IS_OPEN = true;
var SOCKET_IS_CLOSE = false;

var BkSocket ={
    cn:null,
    urlSocket:null,
    isOpen:false,
    pendingPacket:null,
    _delegate:null,
    init:function (url) {
        this.urlSocket = url;
        this.isOpen = SOCKET_IS_CLOSE;
    },
    initSocket:function(){
        this.cn = new WebSocket(this.urlSocket);
        logMessage("initSocket "+this.urlSocket);
        //this.cn = new WebSocket("ws://chanvanvan.mobi:18090/");
        // this.cn = new WebSocket("ws://10.154.148.106:18090/");
        this.cn.binaryType = "arraybuffer";
        var self = this;
        this.cn.onopen = function(evt) {
            logMessage("Send Binary WS was opened.");
            self.isOpen = SOCKET_IS_OPEN;
            if (self._delegate && self._delegate.onOpen){
                self._delegate.onOpen(evt);
            }

        };

        this.cn.onmessage = function(evt) {
            var binary = new Int8Array(evt.data);
            var packet = new BkPacket();
            packet.parsePacketWithBuffer(binary);
            if (self._delegate && self._delegate.onReceive){
                self._delegate.onReceive(packet);
            }
        };

        this.cn.onerror = function(evt) {
            logMessage("sendBinary Error was fired");
            if (self._delegate && self._delegate.onError){
                self._delegate.onError(evt);
            }
        };

        this.cn.onclose = function(evt) {
            logMessage("_wsiSendBinary websocket instance closed.");
            self.isOpen = SOCKET_IS_CLOSE;
            if (self._delegate && self._delegate.onClose){
                self._delegate.onClose(evt);
            }
        };
    },
    sendPacket:function(packet/*buffer packet*/){
        if (this.cn != null){
            if (this.isOpen){
                this.pendingPacket = null;
                this.cn.send(packet.getConentPacketSend().buffer);
            } else {
                logMessage("socket is close -> reopen socket");
                if (this.pendingPacket == null){
                    this.pendingPacket = packet;
                }
                if (this.urlSocket!= null){
                    //this.initSocket();
                }
            }
        } else {
            logMessage("socket = null -> inital socket");
        }
    },
    setDelegate:function(cDelegate){
        this._delegate = cDelegate;
    },
    closeConnection:function(){
        if(this.cn != null){
            this.cn.close();
            this.cn = null;
        }
        this.setDelegate(null);
    }
};