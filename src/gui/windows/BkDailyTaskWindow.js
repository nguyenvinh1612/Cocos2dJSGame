/**
 * Created by hoangthao on 22/10/2015.
 */
DAILY_TASK_BEGIN_ITEM_Y = 1.14;

BkDailyTaskWindow = BkWindow.extend({
    dailyTaskSprite: null,
    taskList:null,
    ctor: function (parentNode)
    {
        this._super("Nhiệm vụ hằng ngày", cc.size(550, 360), parentNode);
        this.setMoveableWindow(true);
        this.setVisibleOutBackgroundWindow(true);
        this.initWd();
    },
    initWd: function () {
        this.setDefaultWdBodyBg();
        this.getDailyTaskList();
    },

    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this);
    },

    onLoadComplete: function (o, tag) {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case c.NETWORK_GET_DAILY_TASK_LIST_RETURN:
                this.taskList = o;
                this.drawDailyTaskList(o);
                break;
            case c.NETWORK_REQUEST_DAILY_TASK_BONUS_RETURN:
                if(this.taskList != null) {
                    this.drawDailyTaskBonusList(this.taskList, o);
                }
                break;
        }
        Util.removeAnim();
    },
    getDailyTaskList: function () {
        Util.showAnim();
        this.initHandleonLoadComplete();
        BkLogicManager.getLogic().getDailyTaskList();
    },

    drawDailyTaskList: function (itemList) {
        if (this.dailyTaskSprite != null) {
            this.dailyTaskSprite.removeSelf();
            this.dailyTaskSprite = null;
        }
        this.dailyTaskSprite = new BkSprite();
        this.addChildBody(this.dailyTaskSprite);

        if (itemList.length > 0) {
            this.dailyTaskSprite.x = 20;
            this.dailyTaskSprite.y = 0;
            var rowH = this.getBodySize().height/ DAILY_TASK_BEGIN_ITEM_Y;
            for (var i = 0; i < itemList.length; i++) {
                var taskItem = itemList[i];
                var isEndOfRow = i == (itemList.length-1);
                var displayObject = new BkDailyTaskItem(taskItem, rowH,isEndOfRow, this);
                displayObject.x= 10;
                rowH = displayObject.y;
                this.dailyTaskSprite.addChild(displayObject);
            }
        }
        else {
            var tfDisplayMessage = new BkLabel("Bạn không còn nhiệm vụ nào cần làm.", "Tahoma", 18);
            tfDisplayMessage.x = this.getBodySize().width / 2;
            tfDisplayMessage.y = this.getBodySize().height / 2;
            this.dailyTaskSprite.addChild(tfDisplayMessage);
        }
    },
    drawDailyTaskBonusList:function(itemList, nextItem) {
        if (this.dailyTaskSprite != null) {
            this.dailyTaskSprite.removeSelf();
            this.dailyTaskSprite = null;
        }

        this.dailyTaskSprite = new BkSprite();
        this.addChildBody(this.dailyTaskSprite);
        this.dailyTaskSprite.x = 20;
        this.dailyTaskSprite.y = 0;
        var rowH = this.getBodySize().height/ DAILY_TASK_BEGIN_ITEM_Y;
        for (var i = 0; i < itemList.length; i++) {
            var item = itemList[i];
            var isEndOfRow = i == (itemList.length-1);
            if (item.id == nextItem.id) {
                showPopupMessageWith("Chúc mừng bạn đã hoàn thành nhiệm vụ.\nBạn vừa được thưởng "
                    + item.bonusMoney + BkConstString.getGameCoinStr()
                    , "Thưởng hằng ngày",null,null,this);
                BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() + item.bonusMoney);
                BkLogicManager.getLogic().processUpdateProfileUI();
                //Copy data of next item to display
                item = nextItem;
                item.copyNextItem();
                itemList[i] = item;
            }
            var displayObject = new BkDailyTaskItem(item, rowH, isEndOfRow, this);
            displayObject.x= 10;
            rowH = displayObject.y;
            displayObject.x= 10;
            this.dailyTaskSprite.addChild(displayObject);
        }
    },
    removeSelf: function ()
    {
        this._super();
        BkLogicManager.getLogic().getDailyTaskList();
        BkLogicManager.getLogic().setOnLoadComplete(getCurrentScene().chooseGameLayer);
    }
});