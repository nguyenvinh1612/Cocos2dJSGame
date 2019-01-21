/**
 * Created by bs on 16/05/2017.
 */
BkQueueEvent = cc.Class.extend({
    eventType:-1,
    eventTimer:0,
    ctor:function(type){
        this.eventType = type;
        this.eventTimer = BkTime.GetCurrentTime();
    }
});