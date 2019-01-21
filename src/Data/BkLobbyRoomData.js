/**
 * Created by bs on 24/10/2015.
 */
var MAX_TABLE_PER_ROOM = 20;
var FAKE_TABLE_ID       = 100000;
BkLobbyRoomData = cc.Class.extend({
    maxTableInRoom:null,

    listRoom:null,
    listTable:null,

    listTable1:null,
    listTable2:null,
    listTable3:null,
    listRoom1:null,
    ctor:function(){
        this.listRoom = null;
        this.listTable = null;

        this.listTable1 = null;
        this.listTable2 = null;
        this.listTable3 = null;
        this.listRoom1 = null;

        this.maxTableInRoom = -1;
    },
    devideListRoom:function(){
        logMessage("deviceListRoom:");
        this.listRoom1 = [];
        for (var i =0;i<this.listRoom.length;i++){
            var iRdt = this.listRoom[i];
            var iRdt1 = new BkRoomData;
            var iRdt2= new BkRoomData;

            var Random1 = Util.getRandom(8);
            var Random2 = Util.getRandom(8);

            var newPer1 = Math.floor((Math.abs(iRdt.percent - Random1)));
            if (newPer1 >100){
                newPer1 = 100;
            }
            var newPer2 = Math.floor((Math.abs(iRdt.percent + Random2)));
            if (newPer2 >100){
                newPer2 = 100;
            }
            iRdt1.roomID = iRdt.roomID;
            iRdt1.percent =newPer1;
            iRdt2.roomID = iRdt.roomID;
            iRdt2.percent = newPer2;

            this.listRoom1.push(iRdt);
            this.listRoom1.push(iRdt1);
            this.listRoom1.push(iRdt2);
        }
    },
    devideListTable:function(){
        this.listTable1 = [];
        this.listTable2 = [];
        this.listTable3 = [];
        logMessage("this.listTable length "+this.listTable.length);
        if (this.listTable!=null){
            // alway creat 3 tables 0
            //this.creatTable0();
            var maxPlayer = getMaxPlayer(BkGlobal.currentGameID);
            var i;
            var iNumberList;
            for (i=1;i<maxPlayer;i++){
                iNumberList = this.getListTableWithNumberPlayer(i);

                this._pushListTableData(iNumberList);
            }
            this._pushListTableData(this.getListTableWithNumberPlayer(0));
            this._pushListTableData(this.getListTableWithNumberPlayer(maxPlayer));
        }

        //logMessage("finish ============");
        //this.traceListTable();
    },
    creatTable0:function(){
        logMessage("creatTable0");
        var tdt1 = new BkTableData;
        tdt1.tableID = this.maxTableInRoom -1 + FAKE_TABLE_ID;
        tdt1.numberPlayer = 0;
        tdt1.betMoney = 0;
        tdt1.maxNumberPlayer = getMaxPlayer(BkGlobal.currentGameID);
        if (BkGlobal.isRoomTypeSolo()){
            tdt1.maxNumberPlayer = 2;
        }

        this.listTable1.push(tdt1.clone());
        this.listTable2.push(tdt1.clone());
        this.listTable3.push(tdt1.clone());
    },
    _pushListTableData:function(iNumberList){
        var tg =  Math.floor((iNumberList.length)/3);
        for (var j =0;j<tg;j++){
            var jtb1 = iNumberList[j];
            var jtb2 = iNumberList[j+tg];
            var jtb3 = iNumberList[j+2*tg];
            this.pushTableData1(jtb1.clone());
            this.pushTableData2(jtb2.clone());
            this.pushTableData3(jtb3.clone());
        }
        if (3*tg <iNumberList.length){
            for (var k = 3*tg;k<iNumberList.length;k++){
                var itb = iNumberList[k];
                this.pushTableData1(itb.clone());
            }
        }
    },
    traceListTable:function(){
        this.tracelistTable(this.listTable);
        this.tracelistTable(this.listTable1);
        this.tracelistTable(this.listTable2);
        this.tracelistTable(this.listTable3);
    },
    tracelistTable:function(list){
        logMessage("==============================");
        logMessage("leng: "+list.length);
        for (var i = 0;i<list.length;i++){
            var itb = list[i];
            logMessage(itb.toString());
        }
    },
    getListTableWithNumberPlayer:function(iNum){
        var rtn = [];
        for (var j=0;j<this.listTable.length;j++){
            var iTable = this.listTable[j];
            if (iTable.numberPlayer == iNum){
                rtn.push(iTable);
            }
        }
        logMessage("getListTableWithNumberPlayer "+iNum);
        //this.traceListTable(rtn);
        return rtn;
    },
    pushTableData1:function(iTableData){
        if (this.listTable1.length<MAX_TABLE_PER_ROOM){
            this.listTable1.push(iTableData);
        } else if(this.listTable2.length<MAX_TABLE_PER_ROOM){
            this.listTable2.push(iTableData);
        } else if(this.listTable3.length<MAX_TABLE_PER_ROOM) {
                this.listTable3.push(iTableData);
        }
    },
    pushTableData2:function(iTableData){
        if (this.listTable2.length<MAX_TABLE_PER_ROOM){
            this.listTable2.push(iTableData);
        } else if(this.listTable3.length<MAX_TABLE_PER_ROOM){
            this.listTable3.push(iTableData);
        } else if (this.listTable1.length<MAX_TABLE_PER_ROOM){
            this.listTable1.push(iTableData);
        }
    },
    pushTableData3:function(iTableData){
        if (this.listTable3.length<MAX_TABLE_PER_ROOM){
            this.listTable3.push(iTableData);
        } else if(this.listTable1.length<MAX_TABLE_PER_ROOM){
            this.listTable1.push(iTableData);
        } else if (this.listTable2.length<MAX_TABLE_PER_ROOM){
            this.listTable2.push(iTableData);
        }
    },
    updateGameTableStatus:function(tableID,isGameInProgress){
        this.updateGameTableStatusWithList(tableID,isGameInProgress,this.listTable);
        this.updateGameTableStatusWithList(tableID,isGameInProgress,this.listTable1);
        this.updateGameTableStatusWithList(tableID,isGameInProgress,this.listTable2);
        this.updateGameTableStatusWithList(tableID,isGameInProgress,this.listTable3);
    },
    updateGameTableStatusWithList:function(tableID,isGameInProgress,list){
        if (list == null){
            return;
        }
        var i;
        var iTableData;
        for (i=0;i<list.length;i++){
            iTableData = list[i];
            if (iTableData.tableID == tableID){
                iTableData.isInGameProgress = isGameInProgress;
                list[i] = iTableData;
                return;
            }
        }
    },
    updateNumberPlayersInTable:function(tableID,numberOfPlayers){
        this.updateNumberPlayersWithList(tableID,numberOfPlayers,this.listTable);
        this.updateNumberPlayersWithList(tableID,numberOfPlayers,this.listTable1);
        this.updateNumberPlayersWithList(tableID,numberOfPlayers,this.listTable2);
        this.updateNumberPlayersWithList(tableID,numberOfPlayers,this.listTable3);
    },
    updateNumberPlayersWithList:function(tableID,numberOfPlayers,list){
        if (list == null){
            return;
        }
        var i;
        var iTableData;
        for (i=0;i<list.length;i++){
            iTableData = list[i];
            if (iTableData.tableID == tableID){
                iTableData.numberPlayer = numberOfPlayers;
                if (numberOfPlayers == 0){
                    iTableData.betMoney = 0;
                    iTableData.isInGameProgress = 0;
                    iTableData.hasPassword = 0;
                }
                list[i] = iTableData;
                return;
            }
        }
    },
    updateTable:function(tbData){
        this.updateTableWithList(tbData,this.listTable);
        this.updateTableWithList(tbData,this.listTable1);
        this.updateTableWithList(tbData,this.listTable2);
        this.updateTableWithList(tbData,this.listTable3);
    },
    updateTableWithList:function(tbData,list){
        if (list == null){
            return;
        }
        var i;
        var iTableData;
        for (i=0;i<list.length;i++){
            iTableData = list[i];
            if (iTableData.tableID == tbData.tableID){
                iTableData = tbData;
                list[i] = iTableData;
                return;
            }
        }
    },
    updateLuatUGa:function (tableID,iHasGagop,isBaicMode,is411) {
        this.updateLuatULuatChoiGa(tableID,iHasGagop,isBaicMode,is411,this.listTable);
        this.updateLuatULuatChoiGa(tableID,iHasGagop,isBaicMode,is411,this.listTable1);
        this.updateLuatULuatChoiGa(tableID,iHasGagop,isBaicMode,is411,this.listTable2);
        this.updateLuatULuatChoiGa(tableID,iHasGagop,isBaicMode,is411,this.listTable3);
    },
    updateLuatULuatChoiGa:function (tableID,iHasGagop,isBM,is411,list) {
        if (list == null){
            return;
        }

        var i;
        var iTableData;
        for (i=0;i<list.length;i++){
            iTableData = list[i];
            if (iTableData.tableID === tableID){
                iTableData.HasGagop = iHasGagop;
                iTableData.isBaicMode = isBM;
                iTableData.is411 = is411;
                list[i] = iTableData;
                return;
            }
        }
    }
});