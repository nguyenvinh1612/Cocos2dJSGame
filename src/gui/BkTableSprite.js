/**
 * Created by bs on 02/10/2015.
 */
var BASE_WIDTH_TABLE = 139 + 2;
var BASE_HEIGHT_TABLE = 76 + 2;
var NUMBER_COLUMN_LIST_TB = 5;
var NUMBER_ROW_LIST_TB = 4;

var LIST_TABLE_MARGIN_LEFT = 65;
var LIST_TABLE_MARGIN_TOP = -75;

BkTableSprite = BkSprite.extend({
    tableData:null,
    _hoverSprite:null,
    _bgSprite:null,
    iconIngameProgress:null,
    lbMoney:null,
    iconLock:null,
    ctor:function (data) {
        this.tableData = data;
        var rect = this._getRect();
        this._super(res.List_table,rect);
        this._initTable();
    },
    _getRect:function(){
        // get rect of table with table data
        var xPos =0;
        var yPos =0;
        if (this.tableData.maxNumberPlayer == 6){
            xPos = BASE_WIDTH_TABLE * this.tableData.numberPlayer;
            yPos = 4 * BASE_HEIGHT_TABLE;
        } else if (this.tableData.maxNumberPlayer == 4){
            xPos = BASE_WIDTH_TABLE * this.tableData.numberPlayer;
            yPos = 2 * BASE_HEIGHT_TABLE;
        } else if (this.tableData.maxNumberPlayer == 2) {
            xPos = BASE_WIDTH_TABLE * this.tableData.numberPlayer;
            if (this.tableData.numberPlayer >2){
                xPos = BASE_WIDTH_TABLE * 2;
            }
            yPos = 0;
        } else if (this.tableData.maxNumberPlayer == 3) {
            xPos = BASE_WIDTH_TABLE * this.tableData.numberPlayer;
            yPos = BASE_HEIGHT_TABLE;
        } else if (this.tableData.maxNumberPlayer == 5) {
            xPos = BASE_WIDTH_TABLE * this.tableData.numberPlayer;
            yPos = 3 * BASE_HEIGHT_TABLE;
        } else {
            xPos = BASE_WIDTH_TABLE * this.tableData.numberPlayer;
            yPos = 2 * BASE_HEIGHT_TABLE;
        }
        if ((BkGlobal.currentGameID == GID.CO_TUONG)|| ((BkGlobal.currentGameID == GID.CO_UP))){
            yPos = 5 * BASE_HEIGHT_TABLE;
            if (this.tableData.numberPlayer >2){
                xPos = BASE_WIDTH_TABLE * 2;
            }
        } else {
            var isError = this.isErrorPos(xPos,yPos);
            if (isError){
                logMessage("isErrorPos -> fake table");
                if (this.tableData.maxNumberPlayer < this.tableData.numberPlayer){
                    logMessage("loi so ng choi > max number table");
                    this.tableData.maxNumberPlayer = getMaxPlayer(BkGlobal.currentGameID);
                    return this._getRect();
                } else {
                    logMessage("loi khac check lai .....................................")
                }
            }
        }
        //logMessage("tableID: "+this.tableData.tableID+" - maxNumberPlayer: " +this.tableData.maxNumberPlayer
        //    +" - numberPlayer: "+this.tableData.numberPlayer+" xPos: "+xPos+" yPos: "+yPos);
        this.logMessageErrorLoseTable(xPos,yPos);
        return cc.rect(xPos,yPos,BASE_WIDTH_TABLE,BASE_HEIGHT_TABLE);
    },
    isErrorPos:function(xPos,yPos){
        var isError = false;
        if (yPos == 0){
            if (xPos>= 3*BASE_WIDTH_TABLE){
                isError = true;
            }
        }
        if (yPos == BASE_HEIGHT_TABLE){
            if (xPos>= 4*BASE_WIDTH_TABLE){
                isError = true;
            }
        }
        if (yPos == 2* BASE_HEIGHT_TABLE){
            if (xPos>= 5 *BASE_WIDTH_TABLE){
                isError = true;
            }
        }

        if (yPos == 3* BASE_HEIGHT_TABLE){
            if (xPos>= 6 *BASE_WIDTH_TABLE){
                isError = true;
            }
        }

        if (yPos == 5* BASE_HEIGHT_TABLE){
            if (xPos>= 3 *BASE_WIDTH_TABLE){
                isError = true;
            }
        }
        return isError;
    },
    logMessageErrorLoseTable:function(xPos,yPos){
        var isError = this.isErrorPos(xPos,yPos);
        if (isError){
            logMessage("get sai rect table-> errorrrrrrrrrrrrrrrrrrrrrrrr");
        }
    },
    _initTable:function(){
        if (Util.isGameCo()){
            this.iconIngameProgress = new BkSprite("#"+res_name.Chess_Running_IMG);
        } else{
            this.iconIngameProgress = new BkSprite("#"+res_name.Game_Running_IMG);
        }
        this.addChild(this.iconIngameProgress);
        this.configStatusTable();

        this.iconLock = new BkSprite("#"+res_name.Lock_IMG);
        this.addChild(this.iconLock);
        if (this.tableData.hasPassword == 1){
            this.iconLock.setVisible(true);
        } else{
            this.iconLock.setVisible(false);
        }

        if (Util.isGameCo()){
            this._bgSprite = getSpriteFromImageAndRect(res.List_table,5 * BASE_WIDTH_TABLE,0,BASE_WIDTH_TABLE,BASE_HEIGHT_TABLE);
        } else {
            this._bgSprite = getSpriteFromImageAndRect(res.List_table,3 * BASE_WIDTH_TABLE,0,BASE_WIDTH_TABLE,BASE_HEIGHT_TABLE);
        }

        this._bgSprite.setPositionCenter();
        if(Util.isGameCo())
        {
            this._bgSprite.visible = true;
        }else
        {
            this._bgSprite.visible = false;
        }
        this.addChild(this._bgSprite,-2);

        this._hoverSprite = getSpriteFromImageAndRect(res.List_table,4 * BASE_WIDTH_TABLE,0,BASE_WIDTH_TABLE,BASE_HEIGHT_TABLE);
        this._hoverSprite.setPositionCenter();
        this.addChild(this._hoverSprite,-1);
        this._hoverSprite.setVisible(false);

        this.iconIngameProgress.x = this._hoverSprite.x;
        if (Util.isGameCo()){
            this.iconIngameProgress.y = this._hoverSprite.y - 7;
        } else {
            this.iconIngameProgress.y = this._hoverSprite.y + 3;
        }


        this.iconLock.x = this._hoverSprite.x + this._hoverSprite.width/2 - this.iconLock.width/2 - 7;
        this.iconLock.y = this._hoverSprite.y - this._hoverSprite.height/2 + this.iconLock.height/2 + 7;

        this.lbMoney = new BkLabel(convertStringToMoneyFormat(this.tableData.betMoney),"",15,true);

        this.lbMoney.x = this._hoverSprite.x;
        this.lbMoney.y = this._hoverSprite.y - this._hoverSprite.height/2 - 9;
        this.lbMoney.setTextColor(cc.color(255,255,0));
        //this.lbMoney.enableOutline(cc.color(255,255,0),1);
        //this.lbMoney.enableShadow(cc.color(0,0,0),2);
        this.addChild(this.lbMoney);
        if (this.tableData.betMoney == 0){
            this.lbMoney.setVisible(false);
        }

        var self = this;
        this._bgSprite.setMouseOnHover(function(event){

            self._hoverSprite.setVisible(true);
        },function(event){
            self._hoverSprite.setVisible(false);
        });

        this._bgSprite.setOnlickListenner(function(touch, event){
                if (self.tableData.hasPassword == 0) {
                    BkLogicManager.getLogic().setLastTableBetMoney(self.tableData.betMoney);
                    BkLogicManager.getLogic().doRequestJoinTable(self.tableData.tableID);
                } else{
                    var layer = new BkInputPassWindow("",self.tableData);
                    layer.showWithParent();
                }
        });
    },
    updateTableWithData:function(data){
        if (this.tableData.tableID == data.tableID){
            this.tableData = data;
            //var img =cc.textureCache.addImage(res.List_table);
            //this.setTexture(img);
            var rect = this._getRect();
            this.setTextureRect(rect);

            if (this.tableData.betMoney == 0){
                this.lbMoney.setVisible(false);
            } else{
                this.lbMoney.setVisible(true);
                this.lbMoney.setString(convertStringToMoneyFormat(this.tableData.betMoney));
            }

            if (this.tableData.numberPlayer == 0){
                this.lbMoney.setVisible(false);
            }

            if (this.tableData.hasPassword == 1){
                this.iconLock.setVisible(true);
            } else{
                this.iconLock.setVisible(false);
            }

            this.configStatusTable();
        }
    },
    UpdateStatusOfTableWith:function(tableID,isGameInProgress){
        if (this.tableData.tableID == tableID){
            //logMessage("UpdateStatusOfTableWith tableID: "+tableID+" isGameInProgress: "+isGameInProgress);
            this.tableData.isInGameProgress = isGameInProgress;
            this.configStatusTable();
        }
    },
    UpdateSizeOfTableWith:function(tableID,numberOfPlayers){
        if (tableID == this.tableData.tableID){
            //logMessage("UpdateSizeOfTableWith tableID: "+tableID+" numberOfPlayers: "
            //    +numberOfPlayers+" lastNumber: "+this.tableData.numberPlayer);
            this.tableData.numberPlayer = numberOfPlayers;
            if (numberOfPlayers == 0){
                //logMessage("numberOfPlayers -> reset table data");
                this.tableData.betMoney = 0;
                this.tableData.isInGameProgress = 0;
                this.tableData.hasPassword = 0;
                this.tableData.maxNumberPlayer = getMaxPlayer(BkGlobal.currentGameID);
                if (BkGlobal.isRoomTypeSolo()){
                    this.tableData.maxNumberPlayer = 2;
                }
            }

            this.updateTableWithData(this.tableData);
        }
    },
    configStatusTable:function(){
        if (!this.tableData.isInGameProgress){
            this.iconIngameProgress.setVisible(false);
        } else {
            this.iconIngameProgress.setVisible(true);
        }
    },
    configPosTable:function(stt){
        var deltaX = 35;
        var deltaY = 35;
        var i = Math.floor(stt / NUMBER_COLUMN_LIST_TB);
        var j = stt % NUMBER_COLUMN_LIST_TB;
        this.x = j * (BASE_WIDTH_TABLE + deltaX) + this.getContentSize().width/2 + LIST_TABLE_MARGIN_LEFT;
        this.y = (4-i) * (BASE_HEIGHT_TABLE + deltaY) + this.getContentSize().height/2 + LIST_TABLE_MARGIN_TOP;
    }
});