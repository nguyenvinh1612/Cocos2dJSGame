/**
 * Created by hoangthao on 26/10/2015.
 */
BkLeaderBoardData = cc.Class.extend({
    type: null,
    typeName: "",
    leaderName: null,
    gid: null,
    gameName:null,
    ctor: function (type, name) {
        this.type = type;
        if(type > 1) {
            this.typeName = "Cao thủ";
        }
        this.gid = this.getIdFromType(type);
        this.gameName = Util.getGameLabel(this.gid);
        this.leaderName = name;
    },
    //LeaderBoard id list
    getIdFromType: function (type) {
        var  gameIdList = [-1, -2, GID.PHOM, GID.BA_CAY, GID.XITO, GID.POKER, GID.TLMN, GID.XAM, GID.LIENG, GID.XI_DZACH, GID.MAU_BINH, GID.CHAN, GID.CO_TUONG, GID.CO_UP, GID.TLMN_DEM_LA, GID.MAU_BINH_OLD];
        return gameIdList[type];
    }
});