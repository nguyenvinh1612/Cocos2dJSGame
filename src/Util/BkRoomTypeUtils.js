/**
 * Created by bs on 24/10/2015.
 */

var BINH_DAN_ROOM_MAX_ID = 30;
var DAI_GIA_ROOM_MAX_ID = 35;
var VIP_ROOM_MAX_ID = 40;
var SOLO_ROOM_MAX_ID = 80;
var RAMDOM_ROOM_MAX_ID = 120;
BkRoomTypeUtils = {
    getRoomTypeById:function(roomId){
        if (roomId <= BINH_DAN_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_BINH_DAN;
        }
        else if (roomId <= DAI_GIA_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_DAI_GIA;
        }
        else if (roomId <= VIP_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_VIP;
        }
        else if (roomId <= SOLO_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_SOLO;
        }
        else if (roomId <= RAMDOM_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_RANDOM;
        }
        return RT.ROOM_TYPE_BINH_DAN;
    }
};