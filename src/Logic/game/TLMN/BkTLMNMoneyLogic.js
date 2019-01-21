/**
 * Created by vinhnq on 10/19/2015.
 */
BkTLMNMoneyLogic = cc.Class.extend({
    ctor:function()
    {

    },
    cashChangeWhenFinishGame:function(betMoney,rank, numberOfPlayers)
    {
        if (numberOfPlayers == 4)
        {
            switch (rank)
            {
                case 0:
                    return Math.floor(4 * betMoney * (1 - TAX_RATE));
                case 1:
                    return Math.floor(3 * betMoney * (1 - TAX_RATE));
                case 2:
                    return Math.floor(betMoney * (1 - TAX_RATE));
                default:
                    return 0;
            }
        }
        if (numberOfPlayers == 3)
        {
            switch (rank)
            {
                case 0:
                    return Math.floor(4 * betMoney * (1 - TAX_RATE));
                case 1:
                    return Math.floor(2 * betMoney * (1 - TAX_RATE));
                default:
                    return 0;
            }
        }
        switch (rank)
        {
            case 0:
                return Math.floor(4 * betMoney * (1 - TAX_RATE));
            default:
                return 0;
        }
    },

    cashLostWhenBet:function(betMoney)
    {
        return -2 * betMoney;
    },

    cashLostWhenBiDanh3Cuoi:function (betMoney )
    {
        return -Math.floor(betMoney);
    },

    cashLostWhenThoi3:function(betMoney, numberOfPlayers)
    {
        return -Math.floor((numberOfPlayers - 1) * betMoney);
    },

    cashWinWhenThoi:function (betMoney, thoiCount)
    {
        return Math.floor(thoiCount * betMoney * (1 - TAX_RATE));
    },

    cashLostWhenThoi:function(betMoney, thoiCount)
    {
        return - Math.floor(thoiCount * betMoney);
    },

    cashWinWhenChat:function(betMoney, cardSuite)
    {
        var rate;
        if ((cardSuite.length == 1) && ((cardSuite[0].type == BICH) || (cardSuite[0].type == NHEP)))
        {
            rate = 1;
        }
        else
        {
            rate = 2;
        }
        return Math.floor(rate * betMoney * (1 - TAX_RATE));
    },

    cashLostWhenChat:function(betMoney, cardSuite)
    {
        var rate;
        if ((cardSuite.length == 1) && ((cardSuite[0].type == BICH) || (cardSuite[0].type == NHEP)))
        {
            rate = 1;
        }
        else
        {
            rate = 2;
        }
        return -Math.floor(rate * betMoney);
    },

    cashLostWhenColdLose:function(betMoney)
    {
        return -Math.floor(2 * betMoney);
    },

    cashWinWhenColdLose:function(betMoney)
    {
        return Math.floor(2 * betMoney * (1 - TAX_RATE));
    },

    cashWinWhenAutoWin:function(betMoney, numberOfPlayers)
    {
        return Math.floor(numberOfPlayers * 2 * betMoney * (1 - TAX_RATE));
    },

    cashChangeWhenLeaveDuringGame:function(moneyBet, playerCount)
    {
        return Math.floor(moneyBet * 6 * (playerCount - 1));
    },

    cashReturnToOtherPlayersWhenStopGame:function(moneyBet,cashChange)
    {
        return Math.floor((cashChange + 2 * moneyBet) * (1 - TAX_RATE));
    }
});