/**
 * Created by hoangthao on 22/10/2015.
 */
BkDailyTaskData = cc.Class.extend({
    id: -1,
    bonusMoney: 0,
    targetAmount: 0,
    currentAmount: 0,
    isGetBonus: false,
    taskName: "",
    idNextTask: -1,
    nextBonusMoney: 0,
    nextTargetAmount: 0,
    nextTaskName: "",
    ctor: function () {

    },
    setDailyTaskItem: function (id, bonusMoney, targetAmount, currentAmount, isGetBonus, taskName) {
        this.id = id;
        this.bonusMoney = bonusMoney;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
        this.isGetBonus = isGetBonus;
        this.taskName = taskName;
    },

    setBonusDailyTaskItem: function (id, bonusMoney, idNextTask,
                                     nextBonusMoney, nextTargetAmount, currentAmount, isGetBonus, nextTaskName) {
        this.id = id;
        this.bonusMoney = bonusMoney;
        this.idNextTask = idNextTask;
        this.currentAmount = currentAmount;
        this.nextBonusMoney = nextBonusMoney;
        this.nextTargetAmount = nextTargetAmount;
        this.isGetBonus = isGetBonus;
        this.nextTaskName = nextTaskName;
    },

    copyNextItem: function () {
        this.id = this.idNextTask;
        this.bonusMoney = this.nextBonusMoney;
        this.targetAmount = this.nextTargetAmount;
        this.isGetBonus = this.isGetBonus;
        this.taskName = this.nextTaskName;
    }
});