/**
 * Created by VanChinh on 12/19/2015.
 */

BkCoUpInGameLogic = BkChessInGameLogic.extend({

    ctor: function(){
        this._super();
    },

    isQueueEvent:function(eventType){
        switch (eventType)
        {
            case c.NETWORK_REAL_TYPE_RETURN:
            case c.NETWORK_SETUP_RULE_RETURN:
                return true;
        }
        return this._super(eventType);
    },

    onRealTypeReturn: function(packet){
        var index = packet.Buffer.readByte(),
            type = packet.Buffer.readByte();
        this.getGameLayer().onRealTypeReturn(index, type);
    },

    onChessRuleReturn: function(packet){
        var chessRule = packet.Buffer.readByte();
        this.getGameLayer().onChessRuleReturn(chessRule);
    },

    processNetworkEvent:function(packet) {
        logMessage("BkCoUpInGameLogic -> processNetworkEvent " + packet.Type);
        switch(packet.Type) {
            case c.ANY:
                break;
            case c.NETWORK_REAL_TYPE_RETURN:
                this.onRealTypeReturn(packet);
                this.processNextEventInQueue();
                break;
            case c.NETWORK_SETUP_RULE_RETURN:
                this.onChessRuleReturn(packet);
                this.processNextEventInQueue();
                break;
            default:
                logMessage("BkCoUpInGameLogic not process packet with type: " + packet.Type + " -> call super process");
                this._super(packet);
                break;
        }
    }
});