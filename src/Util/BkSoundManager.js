/**
 * Created by vinhnq on 10/27/2015.
 */
getSound = function()
{
    return cc.audioEngine;
};
playJoinGameSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.join_game,false);
};
playLeaveGameSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.leave_game,false);
};
playDiscardSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.click,false);
};
playAlertSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.alert,false);
};
playLeaveTurnSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.click,false);
};
playBichatSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.laught,false);
};
playLaughtSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.laught,false);
};
playClickSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.click,false);
};
playDealCardSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.deal_card,false);
};
isSoundEnable = function()
{
    return BkLogicManager.getInGameLogic().isSoundEnable;
};

/* chess sound */
playChieuTuongSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.co_gong, false);
};

playCoAnQuanSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.co_an_quan, false);
};

playCoDiChuyenSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.co_di_chuyen, false);
};

playCoThangSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.co_thang, false);
};

playCoThuaSound = function ()
{
    if(!isSoundEnable())
    {
        return;
    }
    getSound().playMusic(sound_rest.co_thua, false);
};