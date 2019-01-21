/**
 * Created by VanChinh on 11/3/2015.
 */

BkPlayerAchievement = cc.Class.extend({
    winCount: null,
    gameCount: null,
    bestHand: null,
    moneyEarn: null,
    gameId: null,
    level: null,
    newLevelPercent: null,
    rank: null,
    Badges: null,

    ctor: function(winCount, gameCount, bestHand, moneyEarn, gameId, level, newLevelPercent, rank){
        this.winCount = winCount;
        this.gameCount = gameCount;
        this.bestHand = bestHand;
        this.moneyEarn = moneyEarn;
        this.gameId = gameId;
        this.level = level;
        this.newLevelPercent = newLevelPercent;
        this.rank = rank;
    }
});