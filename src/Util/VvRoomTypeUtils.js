/**
 * Created by VanChinh on 5/9/2017.
 */

var  BINH_DAN_ROOM_MAX_ID = 60;
var  DAI_GIA_ROOM_MAX_ID = 90;
var  VIP_ROOM_MAX_ID = 91;
var  SOLO_ROOM_MAX_ID = 125;
var  RAMDOM_ROOM_MAX_ID = 126;

var DEFAULT_BET_MONEY_RATE = 4;
var MAXIMUM_BET_MONEY_RATE = 200;

var DAI_GIA_ROOM_MIN_BET_MONEY = 500;
var RANDOM_ROOM_MIN_BET_MONEY = 200;
var VIP_ROOM_MIN_BET_MONEY = 15000;
var BINH_DAN_ROOM_MIN_BET_MONEY = 50;
VvRoomTypeUtils = {
    getRoomTypeById:function(roomId){
        if (roomId <= BINH_DAN_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_NHA_TRANH;
        }
        else if (roomId <= DAI_GIA_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_DINH_THU_QUAN;
        }
        else if (roomId <= VIP_ROOM_MAX_ID) {
            return -1;
        }
        else if (roomId <= SOLO_ROOM_MAX_ID) {
            return RT.ROOM_TYPE_DAU_TAY_DOI;
        }
        else if (roomId <= RAMDOM_ROOM_MAX_ID) {
            return -1;
        }

        return c.ROOM_TYPE_NHA_TRANH;
    },

    getDefaultBetMoney: function(roomType) {
        var minMoney = BINH_DAN_ROOM_MIN_BET_MONEY;
        switch (roomType) {
            case c.ROOM_TYPE_DINH_THU_QUAN:
                minMoney = DAI_GIA_ROOM_MIN_BET_MONEY;
                break;
        }

        return minMoney * DEFAULT_BET_MONEY_RATE;
    }
};