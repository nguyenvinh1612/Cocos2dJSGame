/**
 * Created by vinhnq on 10/19/2015.
 */
XAM_RATE = 20;
COLD_LOSE_RATE = 14;
THOI_2_RATE = 20;
SLASH_RATE = 20;
LEAVE_PUNISH_RATE = 20;
BkSamMoneyLogic = cc.Class.extend({
    ctor:function()
    {

    },
cashLostWhenColdLose:function(moneyBet)
{
    return -moneyBet * COLD_LOSE_RATE;
},

cashLostWhenLose:function(moneyBet, remainCardsCount)
{
    return -moneyBet * remainCardsCount;
},

cashLostWhenThoi2:function(moneyBet)
{
    return -moneyBet * THOI_2_RATE;
},

cashLostWhen2Cuoi:function(moneyBet,discardCardsCount)
{
    return -moneyBet * discardCardsCount;
},
    cashEarnWhen2Cuoi:function(moneyBet,discardCardsCount)
{
    return moneyBet * discardCardsCount * (1 - TAX_RATE);
},
    cashLostWhenDenXam:function (moneyBet,numberOfReadyPlayers)
{
    return -moneyBet * XAM_RATE * (numberOfReadyPlayers - 1);
},

cashLostWhenXamLose:function(moneyBet)
{
    return -moneyBet * XAM_RATE;
},

cashEarnWhenXam:function(moneyBet,numberOfReadyPlayers)
{
    return moneyBet * XAM_RATE * (numberOfReadyPlayers - 1) * (1 - TAX_RATE);
},

cashLostWhenSlash:function(moneyBet)
{
    return -moneyBet * SLASH_RATE;
},
cashChangeWhenLeaveDuringGame:function(moneyBet,playerCount)
{
    return moneyBet * LEAVE_PUNISH_RATE * (playerCount - 1);
}
});