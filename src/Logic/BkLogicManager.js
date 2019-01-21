/**
 * Created by bs on 08/10/2015.
 */
BkLogicManager = {
    logic:null,
    gameLogic:null,
    initLogic:function(){
        if (this.logic == null){
            this.logic = new BkCommonLogic();
        }
    },
    setGameLogic:function(mLogic){
        this.gameLogic = mLogic;
    },
    getLogic:function(){
        if (this.logic == null){
            this.initLogic();
        }
        return this.logic;
    },
    getInGameLogic:function(){
        if (this.gameLogic == null){
            this.initGameLogic();
        }
        return this.gameLogic;
    },
    isQueueEvent:function(eventType){
        if (BkGlobal.currentGS != GS.INGAME_GAME){
            return false;
        }
        return this.getInGameLogic().isQueueEvent(eventType);
    },
    /*
    * init game logic when join game success, note set BkGlobal.currentGameID before calling it
    * */
    initGameLogic:function(){
        logMessage("initGameLogic with current gameID "+BkGlobal.currentGameID);
        var gLogic = null;
        //TODO: init ingame logic depend current gameID
        switch (BkGlobal.currentGameID) {
            case GID.TLMN:
                gLogic = new BkTLMNInGameLogic();
                break;
            case GID.CO_TUONG:
                gLogic = new BkChessInGameLogic();
                break;
            case GID.CO_UP:
                gLogic = new BkCoUpInGameLogic();
                break;
            case GID.PHOM:
                gLogic = new BkPhomIngameLogic();
                break;
            case GID.BA_CAY:
                gLogic = new BkBaCayInGameLogic();
                break;
            case GID.XAM:
                gLogic = new BkSAMIngameLogic();
                break;
            case GID.TLMN_DEM_LA:
                gLogic = new BkTLMNDemLaInGameLogic();
                break;
            case GID.XITO:
                gLogic = new BkXiToInGameLogic();
                break;
            case GID.POKER:
                gLogic = new BkPokerInGameLogic();
                break;
            case GID.XI_DZACH:
                gLogic = new BkXiDzachInGameLogic();
                break;

			case GID.LIENG:
                gLogic = new BkLiengInGameLogic();
                break;
			case GID.MAU_BINH:
                gLogic = new BkMauBinhInGameLogic();
                break;
			default:
                gLogic = new BkInGameLogic();
                break;
        }
        gLogic = new BkChanIngameLogic();
        this.setGameLogic(gLogic)
    }

};