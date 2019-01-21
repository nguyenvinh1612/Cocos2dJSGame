/**
 * Created by vinhnq on 12/22/2016.
 */
BkTranDauItem = cc.Class.extend({
    idMatch:null,
    nameTeam1: null,
    nameTeam2: null,
    idTeam1:null,
    idTeam2:null,
    startTime: null,
    ratio1Win:null,
    ratioDraw:null,
    ratio2Win:null,
    ctor: function (idMatch, nameTeam1, nameTeam2,idTeam1,idTeam2,startTime,ratio1Win,ratioDraw,ratio2Win)
    {
        this.idMatch = idMatch;
        this.nameTeam1 = nameTeam1;
        this.nameTeam2 = nameTeam2;
        this.idTeam1 = idTeam1;
        this.idTeam2 = idTeam2;
        this.startTime = startTime;
        this.ratio1Win = ratio1Win;
        this.ratioDraw = ratioDraw;
        this.ratio2Win = ratio2Win;
    }
});
