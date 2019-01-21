/**
 * Created by bs on 02/10/2015.
 */
BkTableData = cc.Class.extend({
    tableID:null,
    betMoney:null,
    numberPlayer:null,
    maxNumberPlayer:null,
    hasPassword:null,
    isInGameProgress:null,
    HasGagop:null,
    isBaicMode:null,
    is411:null,
    cuocGa:[],
    ctor:function () {
        this.tableID = 0;
        this.betMoney = 0;
        this.numberPlayer = 0;
        this.maxNumberPlayer = 4;
        this.hasPassword = 0;
        this.isInGameProgress = 0;
        // truongbs++ add for chan data
        this.isBaicMode = true;
        this.is411 = false;
        this.HasGagop = 0;
        this.cuocGa = [];
    },
    toString:function(){
        return "[tableID: "+this.tableID+" - betMoney: "+this.betMoney+" - numberPlayer: "+this.numberPlayer
            +" - maxNumberPlayer: "+this.maxNumberPlayer+" - hasPassword: "+this.hasPassword
            +" - isInGameProgress: "+this.isInGameProgress+"- isBaicMode: "+this.isBaicMode+"- is411: "+this.is411+"]"
    },
    clone:function(){
        var rtn = new BkTableData;
        rtn.tableID = this.tableID;
        rtn.betMoney = this.betMoney;
        rtn.numberPlayer = this.numberPlayer;
        rtn.maxNumberPlayer = this.maxNumberPlayer;
        rtn.hasPassword = this.hasPassword;
        rtn.isInGameProgress = this.isInGameProgress;
        // truongbs++ add for chan data
        rtn.isBaicMode = this.isBaicMode;
        rtn.is411 = this.is411;
        rtn.cuocGa = this.cuocGa;
        rtn.HasGagop = this.HasGagop;
        return rtn;
    }
});