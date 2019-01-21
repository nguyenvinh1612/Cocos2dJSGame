/**
 * Created by Vu Viet Dung on 12/2/2015.
 */
var AVAR_MARGIN_TB = 70;
var AVAR_MARGIN_LR = 70;
var AVAR_MARGIN_AVAR_TABLE6 = 100;
POKER_SMALL_OFFSET=15;
POKER_FINISH_OFFSET = 20;
BkConstantIngame = {
    // khoang cach cac cay trong bai ha phom & bai danh
    PHOM_CARD_MARGIN_LEFT:20,
    PHOM_CARD_MARGIN_TOP:35,
    PHOM_AVAR_MOVE_LEFT:40,
    DEFAULT_CARD_MARGIN_AVAR:100,
    PHOM_DISCARD_MIN_ZORDER:10000
};



function _getAvatarLocationPos(iPos, numberPos, gameID){
    var size = cc.winSize;
    var xPos = 0;
    var yPos = 0;

    // Check for poker
    if (gameID == GID.POKER) {
        return _getPokerAvatarLocationPos(iPos);
    }
    if (gameID == GID.XITO) {
        return _getXiToAvatarLocationPos(iPos);
    }
    if (gameID == GID.XI_DZACH)
    {
        return _getXiDzachAvatarLocationPos(iPos);
    }
    if (gameID == GID.BA_CAY) {
        return _getBaCayAvatarLocationPos(iPos);
    }
    if(gameID == GID.LIENG)
    {
        return _getLiengAvatarLocationPos(iPos);
    }
    if (gameID == GID.MAU_BINH){
        return _getMauBinhAvatarLocaionPos(iPos);
    }
    if (numberPos == 2){
        xPos = size.width / 2;
        if (iPos == 0){
            yPos = AVAR_MARGIN_TB + 30;
        } else {
            yPos = size.height - AVAR_MARGIN_TB;
        }
    } else if (numberPos == 4){
        if (iPos == 0){
            xPos = AVAR_MARGIN_LR + 120; //170
            //yPos = AVAR_MARGIN_TB +40;
            yPos = AVAR_MARGIN_TB + 50;
        } else if (iPos == 1){
            xPos =  size.width - AVAR_MARGIN_LR;
            yPos = size.height/2 + 28;
        } else if (iPos == 2){
            xPos = size.width / 2;
            yPos = size.height - AVAR_MARGIN_TB + 0.5;
        } else if (iPos == 3){
            xPos = AVAR_MARGIN_LR;
            yPos = size.height/2 + 30 ;
        }
    } else if (numberPos == 6){
        if (iPos == 0){
            xPos = size.width / 2;
            //xPos = AVAR_MARGIN_LR + 90;
            yPos = AVAR_MARGIN_TB + 50;
        } else if (iPos == 1){
            xPos =  size.width - AVAR_MARGIN_LR;
            yPos = size.height/2 - AVAR_MARGIN_AVAR_TABLE6;
        } else if (iPos == 2){
            xPos =  size.width - AVAR_MARGIN_LR;
            yPos = size.height/2 + AVAR_MARGIN_AVAR_TABLE6;
        } else if (iPos == 3){
            xPos = size.width / 2;
            yPos = size.height - AVAR_MARGIN_TB;
        } else if (iPos == 4){
            xPos = AVAR_MARGIN_LR;
            yPos = size.height/2 + AVAR_MARGIN_AVAR_TABLE6;
        }else if (iPos == 5){
            xPos = AVAR_MARGIN_LR;
            yPos = size.height/2 - AVAR_MARGIN_AVAR_TABLE6;
        }
    }
    return cc.p(xPos,yPos);
}
function _getMauBinhAvatarLocaionPos(iPos){
    var xPos = 0;
    var yPos = 0;
    if (iPos == 0){
        xPos = 304;
        yPos = 129;
    } else if (iPos == 1){
        xPos = 890;
        yPos = 386 - 2;
    } else if (iPos == 2){
        xPos = 306;
        yPos = 555 - 2;
    } else if (iPos == 3){
        xPos = 71;
        yPos = 386 - 2;
    }
    return cc.p(xPos,yPos);
}

function _getXiDzachAvatarLocationPos(iPos) {
    var size = cc.winSize;
    var xPos = 0;
    var yPos = 0;
    if (iPos == 0){
        xPos = 385;
        yPos = 157;
    } else if (iPos == 1){
        xPos = 885;
        yPos = 263;
    } else if (iPos == 2){
        xPos = 885;
        yPos = 421;
    } else if (iPos == 3){
        xPos = 531;
        yPos = 543;
    } else if (iPos == 4){
        xPos = 70;
        yPos = 421;
    }else if (iPos == 5){
        xPos = 70;
        yPos = 263;
    }
    return cc.p(xPos,yPos);
}

function _getPokerAvatarLocationPos(iPos) {
    var size = cc.winSize;
    var xPos = 0;
    var yPos = 0;
    if (iPos == 0){
        xPos = 184.2;
        yPos = 187.2;
    } else if (iPos == 1){
        xPos = 815.8;
        yPos = 217.2;
    } else if (iPos == 2){
        xPos = 878.8;
        yPos = 435.8;
    } else if (iPos == 3){
        xPos = 556;
        yPos = 572;
    } else if (iPos == 4){
        xPos = 330;
        yPos = 572;
    }else if (iPos == 5){
        xPos = 78;
        yPos = 433;
    }
    return cc.p(xPos,yPos);
}
function _getLiengAvatarLocationPos(iPos)
{
    var size = cc.winSize;
    var xPos = 0;
    var yPos = 0;
    if (iPos == 0){
        xPos = 410;
        //yPos = 186;
        yPos = 230;
    } else if (iPos == 1){
        xPos = 861;
        yPos = 259;
    } else if (iPos == 2){
        xPos = 861;
        yPos = 415;
    } else if (iPos == 3){
        xPos = 548;
        //yPos = 536;
        yPos = 546;
    } else if (iPos == 4){
        xPos = 95;
        yPos = 416;
    }else if (iPos == 5){
        xPos = 95;
        yPos = 259;
    }
    return cc.p(xPos,yPos);
}
function _getBaCayAvatarLocationPos(iPos) {
    var size = cc.winSize;
    var xPos = 0;
    var yPos = 0;
    if (iPos == 0){
        xPos = 410;
        //yPos = 186;
        yPos = 216;
    } else if (iPos == 1){
        xPos = 861;
        yPos = 259;
    } else if (iPos == 2){
        xPos = 861;
        yPos = 415;
    } else if (iPos == 3){
        xPos = 548;
        //yPos = 536;
        yPos = 546;
    } else if (iPos == 4){
        xPos = 95;
        yPos = 416;
    }else if (iPos == 5){
        xPos = 95;
        yPos = 259;
    }
    return cc.p(xPos,yPos);
}

function _getXiToAvatarLocationPos(iPos) {
    var size = cc.winSize;
    var xPos = 0;
    var yPos = 0;
    if (iPos == 0){
        xPos = 405;
        yPos = 235;
    } else if (iPos == 1){
        xPos = 897;
        yPos = 294;
    } else if (iPos == 2){
        xPos = 897;
        yPos = 444;
    } else if (iPos == 3){
        xPos = 565;
        yPos = 566;
    } else if (iPos == 4){
        xPos = 65;
        yPos = 444;
    }else if (iPos == 5){
        xPos = 65;
        yPos = 294;
    }
    return cc.p(xPos,yPos);
}

function getPokerDealerLocation(iPos) {
    var avatarLoc = _getPokerAvatarLocationPos(iPos);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 45;
            retPos.y = avatarLoc.y + 55;
            break;
        case 1:
            retPos.x = avatarLoc.x - 55;
            retPos.y = avatarLoc.y + 55;
            break;
        case 2:
            retPos.x = avatarLoc.x - 118;
            retPos.y = avatarLoc.y + 10;
            break;
        case 3:
            retPos.x = avatarLoc.x + 70;
            retPos.y = avatarLoc.y - 95;
            break;
        case 4:
            retPos.x = avatarLoc.x + 70;
            retPos.y = avatarLoc.y - 95;
            break;
        case 5:
            retPos.x = avatarLoc.x + 125;
            retPos.y = avatarLoc.y + 5;
            break;
    }
    return retPos;
}


function getPhingLocation(gameID, iPos, maxPlayer) {
    if (gameID == GID.POKER) {
        return getPokerPhinhLocation(iPos, maxPlayer);
    }
    if (gameID == GID.XITO) {
        return getXitoPhinhLocation(iPos, maxPlayer);
    }
    if (gameID == GID.LIENG) {
        return getLiengPhinhLocation(iPos, maxPlayer);
    }
}
function getXitoPhinhLocation(iPos, maxPlayer) {
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.XITO);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var OFFSET_Y = 55;
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 178;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 1:
            retPos.x = avatarLoc.x - 178;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 2:
            retPos.x = avatarLoc.x - 178;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 3:
            retPos.x = avatarLoc.x - 178;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 4:
            retPos.x = avatarLoc.x + 178;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 5:
            retPos.x = avatarLoc.x + 178;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
    }
    return retPos;
}

function getLiengPhinhLocation(iPos, maxPlayer) {
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.LIENG);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var OFFSET_Y = 60;
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 85;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 1:
            retPos.x = avatarLoc.x - 90;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 2:
            retPos.x = avatarLoc.x - 90;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 3:
            retPos.x = avatarLoc.x - 90;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 4:
            retPos.x = avatarLoc.x + 85;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
        case 5:
            retPos.x = avatarLoc.x + 85;
            retPos.y = avatarLoc.y - OFFSET_Y;
            break;
    }
    return retPos;
}

function getPokerPhinhLocation(iPos, maxPlayer) {
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.POKER);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 88;
            retPos.y = avatarLoc.y + 36;
            break;
        case 1:
            retPos.x = avatarLoc.x - 91;
            retPos.y = avatarLoc.y - 21;
            break;
        case 2:
            retPos.x = avatarLoc.x - 91;
            retPos.y = avatarLoc.y - 21;
            break;
        case 3:
            retPos.x = avatarLoc.x + 35;
            retPos.y = avatarLoc.y - 120;
            break;
        case 4:
            retPos.x = avatarLoc.x + 35;
            retPos.y = avatarLoc.y - 120;
            break;
        case 5:
            retPos.x = avatarLoc.x + 80;
            retPos.y = avatarLoc.y - 21;
            break;
    }
    return retPos;
}
function getPokerCardLocation(iPos, maxPlayer, i) {
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.POKER);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var CARD_ONHAND_OFFSET = 35;

    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 90 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y - 30;
            break;
        case 1:
            retPos.x = avatarLoc.x - 89 + i * POKER_SMALL_OFFSET;
            retPos.y = avatarLoc.y - 58;
            break;
        case 2:
            retPos.x = avatarLoc.x - 90 + i * POKER_SMALL_OFFSET;
            retPos.y = avatarLoc.y - 58;
            break;
        case 3:
            retPos.x = avatarLoc.x - 32 + i * POKER_SMALL_OFFSET;
            retPos.y = avatarLoc.y - 108;
            break;
        case 4:
            retPos.x = avatarLoc.x - 32 + i * POKER_SMALL_OFFSET;
            retPos.y = avatarLoc.y - 108;
            break;
        case 5:
            retPos.x = avatarLoc.x + 75 + i * POKER_SMALL_OFFSET;
            retPos.y = avatarLoc.y - 58;
            break;
    }
    return retPos;
}
function getLiengCardDisplayLocation(iPos, maxPlayer, i){
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.LIENG);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var CARD_ONHAND_OFFSET = 35;
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 90 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 1:
            retPos.x = avatarLoc.x - 160 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 2:
            retPos.x = avatarLoc.x - 160 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 3:
            retPos.x = avatarLoc.x - 160 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 4:
            retPos.x = avatarLoc.x + 90 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 5:
            retPos.x = avatarLoc.x + 90 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
    }
    return retPos;
}

function getBaCayCardDisplayLocation(iPos, maxPlayer, i){
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.BA_CAY);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var CARD_ONHAND_OFFSET = 35;
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 1:
            retPos.x = avatarLoc.x - 150 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 2:
            retPos.x = avatarLoc.x - 150 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 3:
            retPos.x = avatarLoc.x - 150 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 4:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 5:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
    }
    return retPos;
}


function getXitoCardDisplayLocation(iPos, maxPlayer, i){
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, GID.XITO);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var CARD_ONHAND_OFFSET = 24;
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 75 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 1:
            retPos.x = avatarLoc.x - 170 + i * CARD_ONHAND_OFFSET;
            break;
        case 2:
            retPos.x = avatarLoc.x - 170 + i * CARD_ONHAND_OFFSET;
            break;
        case 3:
            retPos.x = avatarLoc.x - 170 + i * CARD_ONHAND_OFFSET;
            break;
        case 4:
            retPos.x = avatarLoc.x + 75 + i * CARD_ONHAND_OFFSET;
            break;
        case 5:
            retPos.x = avatarLoc.x + 75 + i * CARD_ONHAND_OFFSET;
            break;
    }
    return retPos;
}

function getPokerFinishCardLocation(iPos, maxPlayer, i) {
    var cardLoc = getPokerCardLocation(iPos, maxPlayer, 0);
    var retPos = cc.p(cardLoc.x,cardLoc.y);
    var CARD_ONHAND_OFFSET = 30;

    switch(iPos) {
        case 0:
            retPos.x = cardLoc.x + i * POKER_SMALL_OFFSET;
            retPos.y = cardLoc.y;
            break;
        case 1:
            retPos.x = cardLoc.x - 40 + i * POKER_FINISH_OFFSET;
            retPos.y = cardLoc.y + 15;
            break;
        case 2:
            retPos.x = cardLoc.x - 25 + i * POKER_FINISH_OFFSET;
            retPos.y = cardLoc.y + 15;
            break;
        case 3:
            retPos.x = cardLoc.x  - 20 + i * POKER_FINISH_OFFSET;
            retPos.y = cardLoc.y - 15;
            break;
        case 4:
            retPos.x = cardLoc.x - 20 + i * POKER_FINISH_OFFSET;
            retPos.y = cardLoc.y - 15;
            break;
        case 5:
            retPos.x = cardLoc.x + 20 + i * POKER_FINISH_OFFSET;
            retPos.y = cardLoc.y + 15;
            break;
    }
    return retPos;
}
function getCardDisplayLocation(gameID, iPos, maxPlayer, i){
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer, gameID);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var CARD_ONHAND_OFFSET = 35;
    switch(iPos) {
        case 0:
            retPos.x = avatarLoc.x + 90 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y - 30;
            break;
        case 1:
            retPos.x = avatarLoc.x - 180 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 2:
            retPos.x = avatarLoc.x - 180 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 3:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 4:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 5:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        case 6:
            retPos.x = avatarLoc.x + 80 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
            break;
        default:
            retPos.x = avatarLoc.x + 20 + i * CARD_ONHAND_OFFSET;
            retPos.y = avatarLoc.y;
    }
    return retPos;
}


function getPokerCenterPoint(iPos){
    var size = cc.winSize;
    var retPos = cc.p(size.width/ 2, size.height / 2);
    retPos.x += (iPos - 2) * 83;
    retPos.y += 35;
    return retPos;
}

function getDiscardLocationPhomGame(iPos,i){
    var delta = BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
    var retPos = cc.p(0,0);
    switch(iPos) {
        case 0:
            retPos.x = 540 + i *delta;
            retPos.y = 235;
            break;
        case 1:
            retPos.x = 680 + i *delta;
            retPos.y = 435;
            break;
        case 2:
            retPos.x = 350 + i *delta;
            retPos.y = 445;
            break;
        case 3:
            retPos.x = 220 + i *delta;
            retPos.y = 275 -10;
            break;
    }
    return retPos;
}

function getMyTakenLocationPhomGame(i,numberPhom){
    var deltaY = BkConstantIngame.PHOM_CARD_MARGIN_TOP;
    var retPos = cc.p(0,0);
    retPos.x = 345;
    retPos.y = 230 - i *deltaY + (numberPhom - 1) * deltaY;
    return retPos;
}
/*
* iPos -> client position
* maxPlayer -> maxplayer of game
* i -> phom thu i (i = 0, 1, 2)
* */



function getTakenLocationPhomGame(iPos,maxPlayer,i){
    var avatarLoc = _getAvatarLocationPos(iPos, maxPlayer);
    var retPos = cc.p(avatarLoc.x,avatarLoc.y);
    var deltaY = 38;
    switch(iPos) {
        case 0:
            retPos.x = 10;//avatarLoc.x + 80;
            retPos.y = avatarLoc.y + 50 - i *deltaY;//avatarLoc.y + 130 - i *deltaY;
            break;
        case 1:
            retPos.x = 745 - BkConstantIngame.PHOM_CARD_MARGIN_LEFT;//avatarLoc.x - 80;
            retPos.y = 325 - i *deltaY;//avatarLoc.y - i *deltaY - 140;
            break;
        case 2:
            retPos.x = 535;
            retPos.y = 445 - i *deltaY;
            break;
        case 3:
            retPos.x = 220;
            retPos.y = 390 - i *deltaY + 10;
            break;
    }
    return retPos;
}

function getMyTakenLocationPhomGameWithNumberCardIndex(i,index,numberPhom){
    var retPos = getMyTakenLocationPhomGame(i,numberPhom);
    var deltaX = BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
    retPos.x += index * deltaX;
    return retPos;
}

function getTakenLocationPhomGameWithNumberCardIndex(iPos,maxPlayer,i,index,leng){
    var retPos = getTakenLocationPhomGame(iPos,maxPlayer,i);
    var deltaX = BkConstantIngame.PHOM_CARD_MARGIN_LEFT;
    switch(iPos) {
        case 0:
            retPos.x += index * deltaX;
            break;
        case 1:
            retPos.x -= (leng - 1) * deltaX;
            retPos.x += index * deltaX;
            break;
        case 2:
            retPos.x += index * deltaX;
            break;
        case 3:
            retPos.x += index * deltaX;
            break;
    }
    return retPos;
}