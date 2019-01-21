/**
 * Created by bs on 09/12/2015.
 */
BkPhomMoneyLogic = cc.Class.extend({
    LAST_CARD_LOSS_RATE : 4,
    U_RATE : 5,
    MOM_RATE : 4,
    ctor: function () {

    },
    cashEarnWhenTakeCard:function(moneyBet, takenCount) {
        return Math.floor((moneyBet * takenCount) * (1 - TAX_RATE));
    },
    cashLostWhenTakeCard:function(moneyBet, takenCount)
    {
        return Math.floor(-moneyBet * takenCount);
    },
    cashEarnWhenTakeLastCard:function(moneyBet)
    {
        return Math.floor((moneyBet * this.LAST_CARD_LOSS_RATE) * (1 - TAX_RATE));
    },
    cashLostWhenTakeLastCard:function( moneyBet)
    {
        return Math.floor(-moneyBet * this.LAST_CARD_LOSS_RATE);
    },
    cashLostWhenU:function( moneyBet)
    {
        return Math.floor(-moneyBet * this.U_RATE);
    },
    cashEarnWhenU:function( moneyBet,  playerCount)
    {
        return Math.floor(moneyBet * this.U_RATE * (playerCount - 1) * (1 - TAX_RATE));
    },
    cashLostWhenUDen:function(moneyBet, playerCount)
    {
        return Math.floor(-moneyBet * this.U_RATE * (playerCount - 1));
    },
    cashEarnWhenUDen:function( moneyBet,  playerCount)
    {
        return Math.floor(moneyBet * this.U_RATE * (playerCount - 1) * (1 - TAX_RATE));
    },
    cashLostWhenMom:function( moneyBet)
    {
        return Math.floor(-moneyBet * this.MOM_RATE);
    },
    cashLostWhenLose:function( moneyBet,  rank)
    {
        return Math.floor(-moneyBet * rank);
    },
    cashEarnWhenWin:function(totalLossInTable)
    {
        return Math.floor(totalLossInTable * (1 - TAX_RATE));
    },
    cashChangeWhenLeaveDuringGame:function( moneyBet,  playerCount)
    {
        return Math.floor(moneyBet * this.U_RATE * (playerCount - 1));
    }
});