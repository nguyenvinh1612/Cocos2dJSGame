/**
 * Created by bs on 03/10/2015.
 */
var WIDTH_ROOM_SPRITE = 106;
var HEIGHT_ROOM_SPRITE = 43;

var ROOM_MARGIN_LEFT    = 145;
var ROOM_MARGIN_TOP     = 50;

BkRoomSprite = BkSprite.extend({
    roomData:null,
    //iconLeft:null,
    hoverSprite:null,
    selectedSprite:null,
    sttInList:null,
    labelRoom:null,
    bgPercent:null,
    sPercent:null,
    ctor:function (data,iSTT) {
        this.roomData = data;
        this.sttInList = iSTT;
        this._super(res.Tranperent_IMG,cc.rect(0,0,WIDTH_ROOM_SPRITE,HEIGHT_ROOM_SPRITE));
        this._initRoomSprite();
    },
    _initRoomSprite:function(){
        //this.iconLeft = new BkSprite("#"+res_name.Room_No_Active_IMG);
        //this.iconLeft.x = this.iconLeft.getWidth()/2 + 20 - 0.5;
        //this.iconLeft.y = HEIGHT_ROOM_SPRITE / 2 + 5;
        //this.addChild(this.iconLeft,1);

        this.labelRoom = new BkLabel("Phòng "+(this.sttInList+1),"",16);
        this.labelRoom.x = this.labelRoom.getContentSize().width/2 + 20;//this.iconLeft.x + this.iconLeft.getWidth()/2 + 5 + this.labelRoom.getContentSize().width/2;
        this.labelRoom.y = HEIGHT_ROOM_SPRITE / 2 - 3;
        this.addChild(this.labelRoom,1);

        this._configPercentRoom();

        this.hoverSprite = new BkSprite("#"+res_name.Room_Hover_IMG);
        this.hoverSprite.x = this.hoverSprite.getWidth()/2;
        this.hoverSprite.y = this.hoverSprite.getHeight()/2 -5;
        this.addChild(this.hoverSprite,0);
        this.hoverSprite.setVisible(false);

        this.selectedSprite = new BkSprite("#"+res_name.Room_Select_IMG);
        this.selectedSprite.x = this.hoverSprite.x;
        this.selectedSprite.y = this.hoverSprite.y ;
        this.addChild(this.selectedSprite,0);
        this.selectedSprite.setVisible(false);

        if (BkLogicManager.getLogic().STTCurrentRoom == this.sttInList){
            this.labelRoom.setTextColor(cc.color(255,255,255));
            //this.iconLeft.initWithSpriteFrameName(res_name.Room_Door_IMG);
            this.selectedSprite.setVisible(true);
        } else {
            this.labelRoom.setTextColor(cc.color(14,213,249));
            //this.iconLeft.initWithSpriteFrameName(res_name.Room_No_Active_IMG);
        }

        this._initEventForRoomSprite();

    },
    _initEventForRoomSprite:function(){
        var self = this;
        this.setOnlickListenner(function(touch, event){
            logMessage("click room with data "+self.roomData.roomID + " and stt room in list "+self.sttInList);
            if (BkLogicManager.getLogic().STTCurrentRoom != self.sttInList){
                BkLogicManager.getLogic().STTCurrentRoom = self.sttInList;
                BkLogicManager.getLogic().ProcessWhenClickRoomWith(self.roomData);
            }
        });

        this.setMouseOnHover(function(event){
            if (BkLogicManager.getLogic().STTCurrentRoom != self.sttInList){
                self.hoverSprite.setVisible(true);
            } else {
                cc._canvas.style.cursor = "default";
            }
        },function(event){
            self.hoverSprite.setVisible(false);
        });
    },
    configPosRoom:function(){
        this.x = ROOM_MARGIN_LEFT + this.sttInList * (WIDTH_ROOM_SPRITE + 0);
        this.y = 32;
    },
    _configPercentRoom:function(){
        var draw = new cc.DrawNode();
        var bgColor = cc.color(60, 61, 61, 255);
        var startX = 12;
        var startY = 4;
        var witd = 80;
        this.addChild(draw, 1);
        draw.drawSegment( cc.p(startX,startY), cc.p(startX + witd,startY), 3, bgColor );
        var statusColor;
        var currentPercent = this.roomData.percent;
        var Random = Util.getRandom(10);
        if (currentPercent > 95){
            currentPercent -= (15+Random);
        }

        //if ((currentPercent < 97) && (currentPercent > 85)){
        //    currentPercent -= (15);
        //}
        if (currentPercent <= 70){
            statusColor = cc.color(5, 196, 73 , 255);
        } else if (currentPercent <= 85){
            statusColor = cc.color(246, 157, 3 , 255);
        } else {
            statusColor = cc.color(204, 3 , 4 , 255);
        }

        var newWid = witd * currentPercent / 100;
        draw.drawSegment( cc.p(startX,startY), cc.p(startX + newWid ,startY), 3, statusColor );
    }
});