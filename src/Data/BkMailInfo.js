/**
 * Created by VanChinh on 10/14/2015.
 */

BkMailInfo = cc.Class.extend({
    mailId: null,
    date: null,
    sender: null,
    receiver: null,
    title: null,
    mailStatus: null,
    mailContent: null,

    ctor:function(){

    },

    setMailId: function(mailid){
        this.mailId = mailid;
    },
    getMailId: function(){
        return this.mailId;
    },

    setDate: function(date){
        this.date = date;
    },
    getDate: function(){
        return this.date;
    },

    setSender: function(sender){
        this.sender = sender;
    },
    getSender: function(){
        return this.sender;
    },

    setReceiver: function(receiver){
        this.receiver = receiver;
    },
    getReceiver: function(){
        return this.receiver;
    },

    setTitle: function(title){
        this.title = title;
    },
    getTitle: function(){
        return this.title;
    },

    setMailStatus: function(mailsts){
        this.mailStatus = mailsts;
    },
    getMailStatus: function(){
        return this.mailStatus;
    },

    setContent: function(mailContent){
        this.mailContent = mailContent;
    },
    getContent: function(){
        return this.mailContent;
    }

});