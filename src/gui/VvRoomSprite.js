/**
 * Created by bs on 03/10/2015.
 */
var WIDTH_ROOM_SPRITE = 106;
var HEIGHT_ROOM_SPRITE = 47;

var ROOM_MARGIN_LEFT    = 95;
var ROOM_MARGIN_TOP     = -14;

VvRoomSprite = BkSprite.extend({
    roomData:null,
    hoverSprite:null,
    selectedSprite:null,
    sttInList:null,
    labelRoom:null,
    bgPercent:null,
    sPercent:null,
    ctor:function (data,iSTT) {
        this.roomData = data;
        this.sttInList = iSTT;
        this._super(res.Tranperent_IMG,cc.rect(2,2,WIDTH_ROOM_SPRITE,HEIGHT_ROOM_SPRITE));
        this._initRoomSprite();
    },
    _initRoomSprite:function(){
        this.labelRoom = new BkLabel("Phòng " + (this.sttInList+1),"",15);
        this.labelRoom.setTextColor(cc.color(255,255,255));
        this.labelRoom.x = this.labelRoom.getContentSize().width/2 + 40;
        this.labelRoom.y = HEIGHT_ROOM_SPRITE / 2 - 3;
        this.addChild(this.labelRoom,1);

        this._configPercentRoom();

        this.hoverSprite = new BkSprite("#"+res_name.room_name_hover);
        this.hoverSprite.x = this.hoverSprite.getWidth()/2;
        this.hoverSprite.y = this.hoverSprite.getHeight()/2 - 4.5;
        this.addChild(this.hoverSprite,0);
        this.hoverSprite.setVisible(false);

        this.selectedSprite = new BkSprite("#"+res_name.room_name_press);
        this.selectedSprite.x = this.hoverSprite.x;
        this.selectedSprite.y = this.hoverSprite.y ;
        this.addChild(this.selectedSprite,0);
        this.selectedSprite.setVisible(false);

        if (BkLogicManager.getLogic().STTCurrentRoom == this.sttInList){
            this.selectedSprite.setVisible(true);
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
        this.x = ROOM_MARGIN_LEFT ;
        this.y = ROOM_MARGIN_TOP - this.sttInList * (HEIGHT_ROOM_SPRITE + 0);
    },
    _configPercentRoom:function(){
        var draw = new cc.DrawNode();
        var bgColor = cc.color(81, 61, 11, 255);
        var startX = 22;
        var startY = 4;
        var width = 90;
        this.addChild(draw, 1);
        draw.drawSegment( cc.p(startX,startY), cc.p(startX + width,startY), 4, bgColor );
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

        var newWid = width * currentPercent / 100;
        draw.drawSegment( cc.p(startX,startY), cc.p(startX + newWid ,startY), 3, statusColor );
    }
});