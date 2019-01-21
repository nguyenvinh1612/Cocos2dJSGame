/**
 * Created by vinhnq on 12/22/2016.
 */
BkKeoItem = cc.Class.extend({
    matchId:null,
    id: null,
    winningRate: null,
    groupName:null,
    keoName:null,
    matchName:null,
    ctor: function (id, winningRate,matchid,matchName)
    {
        this.id = id;
        this.matchId = matchid;
        this.winningRate = winningRate;
        this.groupName = this.getGroupNameById(id);
        this.keoName = this.getKeoNameById(id);
        this.matchName = matchName;

    },
    getGroupNameById:function(id)
    {
        return GROUP_NAME[id];
    },
    getKeoNameById:function(id)
    {
        return KEO_NAME[id];
    },
});
