/**
 * Created by bs on 02/10/2015.
 */
var VV_BASE_WIDTH_TABLE = 135;
var VV_BASE_HEIGHT_TABLE = 98;
var VV_NUMBER_COLUMN_LIST_TB = 5;

var LIST_TABLE_MARGIN_LEFT = 230;
var LIST_TABLE_MARGIN_TOP = -90;

var vv_point_player_1 = new cc.p(24.5, 49);
var vv_point_player_2 = new cc.p(84, 37);
var vv_point_player_3 = new cc.p(93, 21);
var vv_point_player_4 = new cc.p(16, 21);

var vv_point_player_Solo_1 = new cc.p(24,28);
var vv_point_player_Solo_2 = new cc.p(88,28);

VvTableSprite = BkSprite.extend({
    tableData:null,
    _hoverSprite:null,
    _bgSprite:null,
    iconIngameProgress:null,
    lbMoney:null,
    icoMoney:null,
    iconLock:null,
    iconGa:null,
    lblLuatCoBan:null,
    lblU411:null,
    isUpdateMoney:null,
    roomType:null,
    bmSlot2:null,
    bmSlot3:null,
    bmSlot4:null,
    bmSlotSolo1:null,
    bmSlotSolo2:null,
    bmPlayer1:null,
    bmPlayer2:null,
    bmPlayer3:null,
    bmPlayer4:null,
    bmPlayerSolo1:null,
    bmPlayerSolo2:null,
    ctor:function (rType, data) {
        this.isUpdateMoney = true;
        this.roomType = rType;
        this.tableData = data;
        //logMessage("this.tableData "+this.tableData);
        this._super();
        this.initTable();
    },
    isErrorPos:function(xPos,yPos){
        var isError = false;
        if (yPos == 0){
            if (xPos>= 3*VV_BASE_WIDTH_TABLE){
                isError = true;
            }
        }
        if (yPos == VV_BASE_HEIGHT_TABLE){
            if (xPos>= 4*VV_BASE_WIDTH_TABLE){
                isError = true;
            }
        }
        if (yPos == 2* VV_BASE_HEIGHT_TABLE){
            if (xPos>= 5 *VV_BASE_WIDTH_TABLE){
                isError = true;
            }
        }

        if (yPos == 3* VV_BASE_HEIGHT_TABLE){
            if (xPos>= 6 *VV_BASE_WIDTH_TABLE){
                isError = true;
            }
        }

        if (yPos == 5* VV_BASE_HEIGHT_TABLE){
            if (xPos>= 3 *VV_BASE_WIDTH_TABLE){
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
    initTable:function(){

        this.iconIngameProgress = new BkSprite("#"+res_name.icon_playing);

        this.addChild(this.iconIngameProgress);
        this.configStatusTable();

        this.iconLock = new BkSprite("#"+res_name.icon_lock);
        this.addChild(this.iconLock);
        if (this.tableData.hasPassword == 1){
            this.iconLock.setVisible(true);
        } else{
            this.iconLock.setVisible(false);
        }

        var resBg = this.getTableSpriteResource();

        this._bgSprite = new BkSprite("#" + resBg);
        this._bgSprite.setPositionCenter();
        this.addChild(this._bgSprite,-1);

        this.initPosSlot();
        this.initPosPlayer();
        this.configViewTables();

        this._hoverSprite = new BkSprite("#" + res_name.table_hover);
        this._hoverSprite.x = this._bgSprite.x;
        this._hoverSprite.y = this._bgSprite.y - 15;
        this.addChild(this._hoverSprite,-2);
        this._hoverSprite.setVisible(false);

        this.lblLuatCoBan = new BkLabel("","",14,true);
        this._hoverSprite.addChild(this.lblLuatCoBan);

        this.lblU411 = new BkLabel("","",14,true);
        this._hoverSprite.addChild(this.lblU411);

        this.setVisibleLuatU(false);
        this.setTextLuatCoBanLuatU411(this.tableData.isBaicMode,this.tableData.is411);

        this.iconIngameProgress.x = this._bgSprite.x;
        this.iconIngameProgress.y = this._bgSprite.y;

        this.iconLock.x = this._bgSprite.x ;//+ this._hoverSprite.width/2 - this.iconLock.width/2 - 7;
        this.iconLock.y = this._bgSprite.y ;//- this._hoverSprite.height/2 + this.iconLock.height/2 + 7;

        var resGa = res_name.gagop_roomlist;
        if (this.roomType == RT.ROOM_TYPE_NHA_TRANH){
            resGa = res_name.gagop_roomlist_nhatranh;
        }
        this.iconGa = new BkSprite("#" + resGa);
        this.iconGa.x = this._bgSprite.x;
        this.iconGa.y = this._bgSprite.y + 25;
        this.addChild(this.iconGa);

        if(this.tableData.HasGagop == 0){
            this.iconGa.setVisible(false);
        }
        else this.iconGa.setVisible(true);

        this.lbMoney = new BkLabel(convertStringToMoneyFormat(this.tableData.betMoney),"",13,true);

        this.lbMoney.x = this._bgSprite.x + 10;
        this.lbMoney.y = this._bgSprite.y - this._bgSprite.height/2 - 5;
        this.lbMoney.setTextColor(cc.color(255, 229, 118));
        this.addChild(this.lbMoney);

        this.icoMoney = new BkSprite("#" + res_name.icon_coin);
        this.icoMoney.x = this.lbMoney.x - this.lbMoney.getContentSize().width/2 - 10;
        this.icoMoney.y = this.lbMoney.y;
        this.addChild(this.icoMoney);

        if (this.tableData.betMoney == 0){
            this.lbMoney.setVisible(false);
            this.icoMoney.setVisible(false);
        }

        var self = this;
        this._bgSprite.setMouseOnHover(function(event){
            self._hoverSprite.setVisible(true);
            if (self.tableData.numberPlayer > 0){
                self.setVisibleLuatU(true);
            }
        },function(event){
            self._hoverSprite.setVisible(false);
            self.setVisibleLuatU(false);
        });

        this._bgSprite.setOnlickListenner(function(touch, event){
                if (self.tableData.hasPassword == 0) {
                    BkLogicManager.getLogic().setLastTableBetMoney(self.tableData.betMoney);
                    BkLogicManager.getLogic().tableData = self.tableData;
                    BkLogicManager.getLogic().doRequestJoinTable(self.tableData.tableID);
                } else{
                    var layer = new BkInputPassWindow("",self.tableData);
                    layer.showWithParent();
                }
        });
    },

    setVisibleLuatU: function(isVi){
        this.lblLuatCoBan.setVisible(isVi);
        this.lblU411.setVisible(isVi);
    },

    setTextLuatCoBanLuatU411:function(isBasicMode,isU411){
        //logMessage("isBasicMode "+isBasicMode+" isU411: "+isU411);
        var margin = 5;
        var txtLuatCoBan = "Nâng Cao";
        if (isBasicMode){ txtLuatCoBan = "Cơ Bản";}
        var txtU411 = "Ù Xuông";
        if (isU411){ txtU411 = "Ù 4-11";}
        this.lblLuatCoBan.setString(txtLuatCoBan);
        this.lblLuatCoBan.x = margin + this.lblLuatCoBan.width/2;
        this.lblLuatCoBan.y = margin + this.lblLuatCoBan.height/2;
        
        this.lblU411.setString(txtU411);
        this.lblU411.x = this._hoverSprite.width - margin - this.lblU411.width/2;
        this.lblU411.y = this.lblLuatCoBan.y;
    },

    initPosSlot:function(){
        this.bmSlot2 = new BkSprite("#" + res_name.table_ghe_cho);
        this.bmSlot2.x = vv_point_player_2.x;
        this.bmSlot2.y = vv_point_player_2.y;
        this._bgSprite.addChild(this.bmSlot2);

        this.bmSlot3 = new BkSprite("#" + res_name.table_ghe_cho);
        this.bmSlot3.x = vv_point_player_3.x;
        this.bmSlot3.y = vv_point_player_3.y;
        this._bgSprite.addChild(this.bmSlot3);

        this.bmSlot4 = new BkSprite("#" + res_name.table_ghe_cho);
        this.bmSlot4.x = vv_point_player_4.x;
        this.bmSlot4.y = vv_point_player_4.y;
        this._bgSprite.addChild(this.bmSlot4);

        this.bmSlotSolo1 = new BkSprite("#" + res_name.table_ghe_cho);
        this.bmSlotSolo1.x = vv_point_player_Solo_1.x;
        this.bmSlotSolo1.y = vv_point_player_Solo_1.y;
        this._bgSprite.addChild(this.bmSlotSolo1);

        this.bmSlotSolo2 = new BkSprite("#" + res_name.table_ghe_cho);
        this.bmSlotSolo2.x = vv_point_player_Solo_2.x;
        this.bmSlotSolo2.y = vv_point_player_Solo_1.y;
        this._bgSprite.addChild(this.bmSlotSolo2);
    },

    initPosPlayer:function(){
        var preResName = "";
        if (this.roomType == RT.ROOM_TYPE_DINH_THU_QUAN){
            preResName = "#4_users_";
        } else if (this.roomType == RT.ROOM_TYPE_DAU_TAY_DOI){
            preResName = "#4_users_dtd_";
        } else {
            preResName = "#4_users_nt_";
        }

        this.bmPlayer1 = new BkSprite(preResName + "01.png");
        this.bmPlayer1.x = vv_point_player_1.x;
        this.bmPlayer1.y = vv_point_player_1.y;
        this._bgSprite.addChild(this.bmPlayer1);

        this.bmPlayer2 = new BkSprite(preResName + "02.png");
        this.bmPlayer2.x = vv_point_player_2.x;
        this.bmPlayer2.y = vv_point_player_2.y + 12;
        this._bgSprite.addChild(this.bmPlayer2);
        
        this.bmPlayer3 = new BkSprite(preResName + "03.png");
        this.bmPlayer3.x = vv_point_player_3.x - 3;
        this.bmPlayer3.y = vv_point_player_3.y + 12;
        this._bgSprite.addChild(this.bmPlayer3);

        this.bmPlayer4 = new BkSprite(preResName + "04.png");
        this.bmPlayer4.x = vv_point_player_4.x + 2;
        this.bmPlayer4.y = vv_point_player_4.y + 12;
        this._bgSprite.addChild(this.bmPlayer4);

        this.bmPlayerSolo1 = new BkSprite(preResName + "02.png");
        this.bmPlayerSolo1.x = vv_point_player_Solo_1.x;
        this.bmPlayerSolo1.y = vv_point_player_Solo_1.y + 12;
        this._bgSprite.addChild(this.bmPlayerSolo1);

        this.bmPlayerSolo2 = new BkSprite(preResName + "01.png");
        this.bmPlayerSolo2.x = vv_point_player_Solo_2.x;
        this.bmPlayerSolo2.y = vv_point_player_Solo_2.y + 12;
        this._bgSprite.addChild(this.bmPlayerSolo2);

        this.bmSlot2.visible = true;
        this.bmSlot3.visible = true;
        this.bmSlot4.visible = true;
        this.bmSlotSolo1.visible = false;
        this.bmSlotSolo1.visible = false;
        this.bmSlotSolo2.visible = false;

        this.bmPlayer1.visible = true;
        this.bmPlayer2.visible = true;
        this.bmPlayer3.visible = true;
        this.bmPlayer4.visible = true;
        this.bmPlayerSolo1.visible = false;
        this.bmPlayerSolo2.visible = false;
    },
    getTableSpriteResource: function(){
        if (this.roomType == RT.ROOM_TYPE_DINH_THU_QUAN){
            return res_name.table_no_user;
        } else if (this.roomType == RT.ROOM_TYPE_DAU_TAY_DOI){
            return res_name.table_no_user_dautaydoi;
        } else {
            return res_name.table_no_user_nhatranh;
        }
        return "";
    },
    configViewTables: function(){
        this.hideAllSLot();
        this.hideAllPlayer();
        this.showViewPlayer();
    },
    hideAllSLot:function(){
        this.bmSlot2.visible = false;
        this.bmSlot3.visible = false;
        this.bmSlot4.visible = false;
        this.bmSlotSolo1.visible = false;
        this.bmSlotSolo2.visible = false;
    },
    hideAllPlayer:function(){
        this.bmPlayer1.visible = false;
        this.bmPlayer2.visible = false;
        this.bmPlayer3.visible = false;
        this.bmPlayer4.visible = false;
        this.bmPlayerSolo1.visible = false;
        this.bmPlayerSolo2.visible = false;
    },
    showViewPlayer: function()
    {
        if(this.tableData == undefined) return;
        var numberPlayers = this.tableData.numberPlayer;
        if (this.roomType == RT.ROOM_TYPE_DAU_TAY_DOI){
            this.bmSlotSolo1.visible = true;
            this.bmSlotSolo2.visible = true;
            if (numberPlayers == 2){
                this.bmPlayerSolo1.visible = true;
                this.bmPlayerSolo2.visible = true;
                this.bmSlotSolo1.visible = false;
                this.bmSlotSolo2.visible = false;
            } else if (numberPlayers == 1){
                this.bmPlayerSolo1.visible = true;
                this.bmSlotSolo1.visible = false;
            }
        } else {
            if (numberPlayers == 0){
                return;
            }
            this.showSlotWith(this.tableData.maxNumberPlayer);
            if (numberPlayers == 4){
                this.bmPlayer1.visible = true;
                this.bmPlayer2.visible = true;
                this.bmPlayer3.visible = true;
                this.bmPlayer4.visible = true;
                this.hideAllSLot();
            } else if (numberPlayers == 3){
                this.bmPlayer1.visible = true;
                this.bmPlayer2.visible = true;
                this.bmPlayer4.visible = true;
                this.bmSlot2.visible = false;
                this.bmSlot4.visible = false;
            } else if (numberPlayers == 2){
                this.bmPlayer1.visible = true;
                this.bmPlayer2.visible = true;
                this.bmSlot2.visible = false;
            } else {
                this.bmPlayer1.visible = true;
            }
        }
    },

    showSlotWith: function(maxNo)
    {
        if (maxNo==4){
            this.bmSlot2.visible = true;
            this.bmSlot3.visible = true;
            this.bmSlot4.visible = true;
        } else if (maxNo==3){
            this.bmSlot2.visible = true;
            this.bmSlot4.visible = true;
        } else {
            this.bmSlot2.visible = true;
        }
    },
    updateTableWithData:function(data){
        if (this.tableData.tableID == data.tableID){
            this.tableData = data;

            if (this.tableData.betMoney == 0){
                this.lbMoney.setVisible(false);
                this.icoMoney.setVisible(false);
            } else{
                this.lbMoney.setVisible(true);
                this.icoMoney.setVisible(true);
                this.lbMoney.setString(convertStringToMoneyFormat(this.tableData.betMoney));
                this.icoMoney.x = this.lbMoney.x - this.lbMoney.getContentSize().width/2 - 10;
                this.icoMoney.y = this.lbMoney.y;
            }

            if (this.tableData.numberPlayer == 0){
                this.lbMoney.setVisible(false);
                this.icoMoney.setVisible(false);
            }

            if (this.tableData.hasPassword == 1){
                this.iconLock.setVisible(true);
            } else{
                this.iconLock.setVisible(false);
            }

            if(this.tableData.HasGagop == 0){
                this.iconGa.setVisible(false);
            }
            else this.iconGa.setVisible(true);

            this.configStatusTable();
            this.configViewTables();
            this.setTextLuatCoBanLuatU411(this.tableData.isBaicMode,this.tableData.is411);
        }
    },
    UpdateStatusOfTableWith:function(tableID,isGameInProgress){
        if (this.tableData.tableID == tableID){
            //logMessage("UpdateStatusOfTableWith tableID: "+tableID+" isGameInProgress: "+isGameInProgress);
            this.tableData.isInGameProgress = isGameInProgress;
            this.configStatusTable();
        }
    },
    updateGagop:function (tableID,isHasGagop) {
        if (this.tableData.tableID == tableID){
            this.tableData.HasGagop = isHasGagop;
            if(this.tableData.HasGagop == 0){
                this.iconGa.setVisible(false);
            }
            else this.iconGa.setVisible(true);
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
                this.tableData.HasGagop = 0;
                this.tableData.isBaicMode = true;
                this.tableData.is411 = false;
                if (BkGlobal.isRoomTypeSolo()){
                    this.tableData.maxNumberPlayer = 2;
                }
            }

            this.updateTableWithData(this.tableData);
        }
    },
    updateLuatUGa:function (tableID,iHasGagop,isBaicMode,is411) {
        if (this.tableData.tableID == tableID){
            this.tableData.HasGagop = iHasGagop;
            this.tableData.isBaicMode = isBaicMode;
            this.tableData.is411 = is411;
            this.updateTableWithData(this.tableData);
        }
    },
    configStatusTable:function(){
        if (!this.tableData.isInGameProgress){
            this.iconIngameProgress.setVisible(false);
        } else {
            this.iconIngameProgress.setVisible(true);
        }
        if (this.tableData.hasPassword == 1){
            this.iconIngameProgress.setVisible(false);
        }
    },
    configPosTable:function(stt){
        var deltaX = 10;
        var deltaY = 40;
        var i = Math.floor(stt / VV_NUMBER_COLUMN_LIST_TB);
        var j = stt % VV_NUMBER_COLUMN_LIST_TB;
        this.x = j * (VV_BASE_WIDTH_TABLE + deltaX) + this.getContentSize().width/2 + LIST_TABLE_MARGIN_LEFT;
        this.y = (4-i) * (VV_BASE_HEIGHT_TABLE + deltaY) + this.getContentSize().height/2 + LIST_TABLE_MARGIN_TOP;
    }
});