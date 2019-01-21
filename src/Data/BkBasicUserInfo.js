/**
 * Created by bs on 06/10/2015.
 */
BkBasicUserInfo = cc.Class.extend({
    userName:null,
    avatarID:null,
    playerMoney:null,

    ctor:function(name,money,avatarid){
        this.userName = name;
        this.playerMoney = money;
        this.avatarID = avatarid;
    },
    getUserName:function(){
        return this.userName;
    },
    setUserName:function(name){
        this.userName = name;
    },
    setMoney:function(mn){
        this.playerMoney=mn;
    },
    getMoney:function(){
        return this.playerMoney;
    },
    setAvatarId:function(avarID){
        this.avatarID = avarID;
    },
    getAvatarId:function(){
        return this.avatarID;
    },
});