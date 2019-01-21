/**
 * Created by bs on 08/05/2017.
 */


if(typeof CIngameAvatar == "undefined") {
    var CIngameAvatar = {};
    CIngameAvatar.SIZE_TYPE_NORMAL		= 0;
    CIngameAvatar.SIZE_TYPE_SMALL			= 1;
    // Normal Avatar
    CIngameAvatar.BASE_NORMAL_WIDTH 	= 110;
    CIngameAvatar.BASE_NORMAL_HEIGHT 	= 110;

    CIngameAvatar.ROW_NORMAL				= 0;
    CIngameAvatar.ROW_DANG_LEN			= 2;
    CIngameAvatar.ROW_CAO_THU				= 1;
    CIngameAvatar.ROW_DAI_GIA				= 3;

    CIngameAvatar.COL_BIG_INVITE			= 0;
    CIngameAvatar.COL_BIG_AVATAR			= 1;
    CIngameAvatar.COL_BIG_BORDER 			= 2;
    CIngameAvatar.COL_BIG_TRANS			= 3;
    CIngameAvatar.COL_BIG_BIBAO			= 4;
    CIngameAvatar.COL_BIG_MARKER			= 5;

    CIngameAvatar.COL_TOP_AVATAR1			= 0;
    CIngameAvatar.COL_TOP_AVATAR2			= 1;
    CIngameAvatar.COL_TOP_AVATAR3			= 3;
    CIngameAvatar.COL_TOP_AVATAR1_BG		= 2;
    CIngameAvatar.COL_TOP_AVATAR2_BG		= 2;
    CIngameAvatar.COL_TOP_AVATAR3_BG		= 4;
    CIngameAvatar.COL_TOP_TRAN			= 5;

    // Small avatar
    CIngameAvatar.BASE_SMALL_WIDTH			= 68;
    CIngameAvatar.BASE_SMALL_HEIGHT			= 68;

    CIngameAvatar.COL_SMALL_AVATAR			= 0;
    CIngameAvatar.COL_SMALL_BORDER 			= 1;
    CIngameAvatar.COL_SMALL_DISABLE			= 2;
    CIngameAvatar.COL_SMALL_BIBAO				= 3;

    // Small avatar
    CIngameAvatar.SMALL_BOUNDER_WITH			= 130;
    CIngameAvatar.SMALL_BOUNDER_HEIGHT 		= 40;
}
if(typeof CPlayer == "undefined") {
    var CPlayer = {};
    CPlayer.BASE_WIDTH 					    = 110;
    CPlayer.BASE_WIDTH_SMALL 			    = 130;
    CPlayer.AVATAR_BASE_SIZE 				= 97;
    CPlayer.AVATAR_NORMAL_SIZE 				= 97;
    CPlayer.AVATAR_SMALL_SIZE 				= 52;
    CPlayer.AVATAR_BOUNDER_SIZE 			= 130;
    CPlayer.MAX_WIDTH_SP 				    = 110;
    CPlayer.MAX_HEIGHT_SP 				    = 160;
    CPlayer.MAX_WIDTH_ICON 				    = 90;
    CPlayer.MAX_HEIGHT_ICON 				= 90;
    CPlayer.MAX_NAME_NORMAL_WIDTH 		    = 80;
    CPlayer.MAX_HEIGHT_TF 				    = 0;
    CPlayer.WIDTH_MN 					    = 15;
    CPlayer.HEIGHT_MN 					    = 15;
    CPlayer.MAX_LENGTH_NAME 				= 12;
    CPlayer.COLOR_MONEY 					= 0xF3C246;
    CPlayer.COLOR_NAME 					    = 0xF5F5F5;
    CPlayer.MARGIN_LEFT 					= 2;

    CPlayer.TABLE_OWNER 					= 0;
    CPlayer.READY							= 1;
    CPlayer.NOT_READY 						= 2;

    CPlayer.CIRCLE_COLOR 					= 0xffffff;
    CPlayer.ANGLE_COLOR 					= 0xFAFA00;

    CPlayer.TYPE_NORMAL_AVATAR 				= 0;
    CPlayer.TYPE_SMALL_AVATAR 				= 1;

}

CConstIngame={
    MARGIN_LEFT_RIGHT 		    : 5,
    MAX_NUMBER_DISCARD_CARDS 	: 8,
    DELTA_X                     : 1,

    point11 					:  cc.p(535 + 10,625 - 175 - 10),
    point12 					:  cc.p(670,625 -130),
    point13 					:  cc.p(755,625 -230),
    point14	 				    :  cc.p(670,625 -340),
    point15 					:  cc.p(605,625 -260),

    point21 					:  cc.p(305,625 -275),
    point22 					:  cc.p(370,625 -360),
    point23 					:  cc.p(450,625 -440),
    point24 					:  cc.p(320,625 -490),
    point25 					:  cc.p(235,625 -415),
    getEndPointFrom:function(cPos, typePos)
    {
        var rtnPoint;
        if (typePos == 1){
            switch(cPos)
            {
                case 1:
                {
                    return this.point12;
                }
                case 2:
                {
                    return this.point13;
                }
                case 3:
                {
                    return this.point14;
                }
                case 4:
                {
                    return this.point15;
                }
                case 5:
                {
                    return this.point11;
                }

                default:
                {
                    break;
                }
            }
        } else {
            switch(cPos)
            {
                case 1:
                {
                    return this.point22;
                }
                case 2:
                {
                    return this.point23;
                }
                case 3:
                {
                    return this.point24;
                }
                case 4:
                {
                    return this.point25;
                }
                case 5:
                {
                    return this.point21;
                }

                default:
                {
                    break;
                }
            }
        }

        return rtnPoint;
    },
    getBeginPointFrom:function(cPs, typePos)
    {
        if (typePos == 1){
            switch(cPs)
            {
                case 1:
                {
                    return this.point11;
                }
                case 2:
                {
                    return this.point12;
                }
                case 3:
                {
                    return this.point13;
                }
                case 4:
                {
                    return this.point14;
                }
                case 5:
                {
                    return this.point15;
                }

                default:
                {
                    break;
                }
            }
        } else {
            switch(cPs)
            {
                case 1:
                {
                    return this.point21;
                }
                case 2:
                {
                    return this.point22;
                }
                case 3:
                {
                    return this.point23;
                }
                case 4:
                {
                    return this.point24;
                }
                case 5:
                {
                    return this.point25;
                }

                default:
                {
                    break;
                }
            }
        }
        return null;
    },
    getPlayedCardPos:function(playerPos, number)
    {
        var ret;
        var beginX;
        var beginY;
        var dx;
        dx = CCard.CARD_SIZE_NORMAL_WIDTH - this.DELTA_X;
        switch(playerPos)
        {
            case 1:
            {
                beginX = 640 + 15;
                beginY = c.WINDOW_HEIGHT- CCard.BH_CARD_1/2-373;
                break;
            }

            case 2:
            {
                beginX = 805;
                beginY = c.WINDOW_HEIGHT- CCard.BH_CARD_1/2-253;
                dx = -dx;
                break;
            }

            case 3:
            {
                beginX = 375 + 15;
                beginY = c.WINDOW_HEIGHT- CCard.BH_CARD_1/2-150;
                dx = -dx;
                break;
            }

            case 4:
            {
                beginX = 115;
                beginY = c.WINDOW_HEIGHT- CCard.BH_CARD_1/2-295;
                break;
            }

            default:
            {
                break;
            }
        }
        //ret.y =beginY + 30;
        //ret.x = beginX+number*dx + 20;
        ret = cc.p(beginX+number*dx + 20,beginY + 30);
        return ret;
    },

    /*
     * truongbs++ add param chiuNumber
     * chiuNumber = -1 -> khong la cay bai chiu
     * chiuNumber = i (i = 0,1,2,3) -> cay bai chiu thu i
     */
    getEatCardPos:function(pos, number,playerChiuCount,chiuNumber)
    {

        if (playerChiuCount == undefined){
            playerChiuCount = 0;
        }
        if (chiuNumber == undefined){
            chiuNumber = -1;
        }
        logMessage("pos "+pos+" number: "+number+" playerChiuCount:"+playerChiuCount+" chiuNumber:"+chiuNumber);
        var beginX;
        var beginY;
        var dx;
        var dy;

        dx = CCard.CARD_SIZE_NORMAL_WIDTH - this.DELTA_X;
        dy = -IGC.DELTA_HEIGHT_EATCARD;
        switch(pos)
        {
            case 1:
            {
                beginX = 280;
                beginY = 200;//c.WINDOW_HEIGHT - 455;
                dx = -dx;
                break;
            }

            case 2:
            {
                beginX = 905;
                beginY = c.WINDOW_HEIGHT -35;
                dx = -dx;
                break;
            }

            case 3:
            {
                beginX = 535 +15;
                beginY = c.WINDOW_HEIGHT+ 40 - 35;
                break;
            }

            case 4:
            {
                beginX = 10;
                beginY = c.WINDOW_HEIGHT -15;
                break;
            }

            default:
            {
                break;
            }
        }

        var capI;
        capI = Math.floor(number/2);
        var tempY = beginY - 50 - CCard.BH_CARD_1/2;
        var ret = cc.p(0,0);
        ret.y = tempY;
        ret.x = beginX+capI*dx + 20;

        if (number%2 == 1 ){
            ret.y +=dy;
        }

        // truongbs++: tinh lai vi tri cay bai an neu la chiu
        if (chiuNumber != -1){
            capI = Math.floor((number - chiuNumber)/2);
            ret.x = beginX+capI*dx + 20;
            ret.y = tempY - chiuNumber * 20;

            if ((pos == 1)||(pos == 2)){
                ret.y += 30;
            }
        }

        if (playerChiuCount != 0){
            ret.x -= playerChiuCount* dx;
        }


        logMessage("ret.x: "+ret.x+"ret.y: "+ret.y);
        return ret;
    },
    getPlayerAvatarPos:function(id)
    {
        var centerX = c.WINDOW_WIDTH /2;
        var centerY = c.WINDOW_HEIGHT/2;

        var uPoint = cc.p(0,0);
        switch(id)
        {
            case 1:
                uPoint.x = centerX -CPlayer.MAX_WIDTH_SP/2 + 15;
                uPoint.y = c.WINDOW_HEIGHT - CPlayer.MAX_HEIGHT_SP;
                break;

            case 2:
                uPoint.x = c.WINDOW_WIDTH - CPlayer.MAX_WIDTH_SP - this.MARGIN_LEFT_RIGHT;
                uPoint.y=centerY - CPlayer.MAX_HEIGHT_SP/2;
                break;

            case 3:
                uPoint.x = centerX -CPlayer.MAX_WIDTH_SP/2 + 15;
                uPoint.y = 10;
                break;

            case 4:
                uPoint.x = 0 + this.MARGIN_LEFT_RIGHT;
                uPoint.y=centerY - CPlayer.MAX_HEIGHT_SP/2;
                break;
        }
        return this.convertYPosFlashToYPosCocosJS(uPoint);
        //return uPoint;
    },
    // for card
    convertYPosFlashToYPosCocosJS:function(p){
        p.y =  c.WINDOW_HEIGHT- CCard.CARD_HEIGHT /2 - p.y;
        return p;
    },
    convertYPosFlashToYPosCocosJSForSprite:function(p){
        p =  c.WINDOW_HEIGHT - p;
        return p;
    },
    getPlayerOnHandPos:function(id)
    {
        var centerX = c.WINDOW_WIDTH /2;
        var centerY = c.WINDOW_HEIGHT/2;

        var uPoint = cc.p(0,0);
        switch(id)
        {
            case 1:
                uPoint.x = centerX;
                uPoint.y = c.WINDOW_HEIGHT - CPlayer.MAX_HEIGHT_SP;
                break;

            case 2:
                uPoint.x = c.WINDOW_WIDTH - CPlayer.MAX_WIDTH_SP - MARGIN_LEFT_RIGHT;
                uPoint.y=centerY;
                break;

            case 3:
                uPoint.x = centerX;
                uPoint.y = 20 + CPlayer.MAX_HEIGHT_ICON;
                break;

            case 4:
                uPoint.x = 0 + this.MARGIN_LEFT_RIGHT + CPlayer.MAX_WIDTH_ICON;
                uPoint.y = centerY;
                break;
        }
        return uPoint;
    },
    getToolTipBocCaiPoint:function(id)
    {
        var rtnPoint = this.getPlayerAvatarPos(id);
        switch(id)
        {
            case 1:
                rtnPoint.x += CPlayer.MAX_WIDTH_SP + 5;
                rtnPoint.y += 20;
                break;

            case 2:
                rtnPoint.x += -100;
                rtnPoint.y += 0;
                break;

            case 3:
                rtnPoint.x += -40;
                rtnPoint.y -= 80;
                break;

            case 4:
                rtnPoint.x += 200;
                rtnPoint.y += 0;
                break;
        }
        return rtnPoint;
    }

};