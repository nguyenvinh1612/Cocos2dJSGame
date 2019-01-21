/**
 * Created by hoangthao on 23/10/2015.
 */
DAILY_TASK_HEIGHT_SPRITE =90;
DAILY_TASK_SCALE_BUTTON =0.9;

DAILY_TASK_PADDING_X = 80;
DAILY_TASK_PADDING_Y = 20;

DAILY_TASK_TEXT_COLOR = cc.color(255,178,102);

BkDailyTaskItem = BkSprite.extend({
    sph: cc.spriteFrameCache,
    parentNode: null,
    selectedTask: null,

    ctor: function (taskItem, pos, isEndOfRow, parent) {
        this._super();
        this.selectedTask = taskItem;
        this.parentNode = parent;
        this.sph.addSpriteFrames(res.tien_thuong_plist, res.tien_thuong_img);
        this.initItem(pos, isEndOfRow);
    },

    initItem: function (pos) {
        var item_bg = new BkSprite("#" + res_name.task_bg_item);
        item_bg.x = item_bg.getWidth() / 2;
        item_bg.y = item_bg.getHeight() / 2 + 14;
        this.addChild(item_bg);

        var iconTaskRes = this.sph.getSpriteFrame(res_name.daily_task_close);
        if (this.selectedTask.isGetBonus) {
            iconTaskRes = this.sph.getSpriteFrame(res_name.daily_task_open);
        }
        var iconTask = new BkSprite(iconTaskRes);
        iconTask.x = iconTask.width / 2 + 10;
        iconTask.y = iconTask.height + 5;
        this.addChild(iconTask);

        var lbName = new BkLabel(this.selectedTask.taskName, "Tahoma", 16);
        lbName.setTextColor(cc.color(251, 254, 0));
        lbName.x = DAILY_TASK_PADDING_X + lbName.getContentSize().width / 2;
        lbName.y = DAILY_TASK_HEIGHT_SPRITE - 15;
        this.addChild(lbName);

        var lbMoneyBonus = new BkLabel("Mức thưởng: " + convertStringToMoneyFormat(this.selectedTask.bonusMoney) + BkConstString.getGameCoinStr(), "Tahoma", 14);
        lbMoneyBonus.x = DAILY_TASK_PADDING_X + lbMoneyBonus.getContentSize().width / 2;
        lbMoneyBonus.y = DAILY_TASK_HEIGHT_SPRITE - 35;
        this.addChild(lbMoneyBonus);

        var lbProgress = new BkLabel("Đã thực hiện: " + convertStringToMoneyFormat(this.selectedTask.currentAmount) + " / " + convertStringToMoneyFormat(this.selectedTask.targetAmount), "Tahoma", 14);
        lbProgress.x = DAILY_TASK_PADDING_X + lbProgress.getContentSize().width / 2;
        lbProgress.y = DAILY_TASK_HEIGHT_SPRITE - 55;
        this.addChild(lbProgress);

        var lbStatus = new BkLabel("Chưa xong", "Tahoma", 15);
        lbStatus.setTextColor(cc.color(255, 255, 255));
        lbStatus.x = item_bg.getWidth() - lbStatus.getContentSize().width / 2 - 20;
        lbStatus.y = DAILY_TASK_HEIGHT_SPRITE / 2 + 10;
        this.addChild(lbStatus);

        var btnGetTaskResult = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive, res_name.BtnDialog_Hover);
        btnGetTaskResult.setTitleText("Chưa xong");
        btnGetTaskResult.setEnableButton(false);
        btnGetTaskResult.setVisible(false);
        if (this.selectedTask.currentAmount == this.selectedTask.targetAmount) {
            if(this.selectedTask.isGetBonus){
                lbStatus.setString("Đã hoàn thành");
                lbStatus.x = item_bg.getWidth() - lbStatus.getContentSize().width /2 - 20;
            }else {
                lbStatus.setVisible(false);
                btnGetTaskResult.setEnableButton(true);
                btnGetTaskResult.setVisible(true);
                btnGetTaskResult.setTitleText("Nhận");
                btnGetTaskResult.addTouchEventListener(function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        this.onClickGetTaskResult();
                    }
                }, this);
                if(this.selectedTask.taskName == "")
                {
                    btnGetTaskResult.setEnableButton(false);
                    btnGetTaskResult.setVisible(false);
                }
            }
        }
        btnGetTaskResult.setScale(DAILY_TASK_SCALE_BUTTON);
        btnGetTaskResult.x = item_bg.getWidth() - btnGetTaskResult.width / 2 - 15;
        btnGetTaskResult.y = DAILY_TASK_HEIGHT_SPRITE / 2 + btnGetTaskResult.height / 2 - 7;
        this.addChild(btnGetTaskResult);
        this.configPos(pos);
    },

    configPos: function (pos) {
        this.x = 0;
        this.y = pos - DAILY_TASK_HEIGHT_SPRITE;
    },

    onClickGetTaskResult: function () {
        this.initHandleonLoadComplete();
        var packet = new BkPacket();
        packet.CreatePacketWithTypeAndByteData(c.NETWORK_REQUEST_DAILY_TASK_BONUS, this.selectedTask.id);
        BkConnectionManager.send(packet);
    },
    initHandleonLoadComplete: function () {
        BkLogicManager.getLogic().setOnLoadComplete(this.parentNode);
    },
    onExit: function () {
        this.sph.removeSpriteFramesFromFile(res.tien_thuong_plist);
        this._super();
    }
});