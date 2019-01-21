/**
 * Created by Vu Viet Dung on 12/3/2015.
 */
BkQueue = cc.Class.extend({
    queue:null,
    isRunning:false,
    firstObject:null,
    ctor:function(){
        this.queue = [];
    },

    resetQueue:function(){
        this.firstObject = null;
        this.queue = [];
        this.isRunning = false;
    },

    traceQueue:function() {
        traceCardList(this.queue, "Queue card: ");
    },

    lastElement:function() {
        if (this.queue == null || this.queue.length ==0) {
            return null;
        }
        return this.queue[this.queue.length-1];
    },

    push:function(item) {
        if (this.queue == null) {
            this.queue = [];
        }
        this.queue.push(item);
    },

    pop:function() {

        if (this.queue == null) {
            this.firstObject = null;
        } else {
            this.firstObject = this.queue.shift();
        }
        return this.firstObject;
    },

    getLastCard:function(){
        return this.firstObject;
    },

    isEmpty: function () {
        if (this.queue == null) {
            return true;
        } else {
            return this.queue.length == 0;
        }
    },

    isRunningAction:function() {
        return this.isRunning;
    },

    setRunningState:function(state){
        this.isRunning = state;
    }
});