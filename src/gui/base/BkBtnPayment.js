/**
 * Created by hoangthao on 06/01/2016.
 */
P_ITEM_PADDING_X = 8;
P_BTN_HEIGHT = 38;
P_BTN_TEXT_COLOR = cc.color(255, 239, 131);
P_BTN_TEXT_COLOR_HOVER = cc.color(252, 246, 95);
BkBtnPayment = BkSprite.extend(/** @lends BkSprite# */{

    btnSize : null,
    bonusPercent: null,
    gameState:null,
    ctor:function (gameState, bonusType) {
        var bonusP = Util.getAddBonusPercent(bonusType);
        var btnRect = cc.rect(106,P_BTN_HEIGHT,106,P_BTN_HEIGHT);
        logMessage("Game state: " + gameState);
        if(gameState == GS.CHOOSE_GAME){
            if(bonusP > BT.ZERO_PERCENT){
                btnRect = cc.rect(146,P_BTN_HEIGHT,146,P_BTN_HEIGHT);
            }
        }else{
            if(bonusP > BT.ZERO_PERCENT){
                btnRect = cc.rect(76,P_BTN_HEIGHT,76,P_BTN_HEIGHT);
            }else{
                btnRect = cc.rect(42,P_BTN_HEIGHT,42,P_BTN_HEIGHT);
            }
        }
        this._super();
        this.setContentSize(cc.size(btnRect.width,btnRect.height));
        this.btnSize = btnRect;
        this.bonusPercent = bonusP;
        this.gameState = gameState;
        this.initBtn();
    },
    updateBonusPercent:function()
    {
        var bonusP = BkGlobal.bonusPercent;
        var btnRect = cc.rect(106,P_BTN_HEIGHT,106,P_BTN_HEIGHT);
        if(BkGlobal.currentGS == GS.CHOOSE_GAME)
        {
            if(bonusP > BT.ZERO_PERCENT)
            {
                btnRect = cc.rect(146,P_BTN_HEIGHT,146,P_BTN_HEIGHT);
            }
        }else{
            if(bonusP > BT.ZERO_PERCENT){
                btnRect = cc.rect(76,P_BTN_HEIGHT,76,P_BTN_HEIGHT);
            }else{
                btnRect = cc.rect(42,P_BTN_HEIGHT,42,P_BTN_HEIGHT);
            }
        }
        this.setContentSize(cc.size(btnRect.width,btnRect.height));
        this.btnSize = btnRect;
        this.bonusPercent = bonusP;
        this.gameState = BkGlobal.currentGS;
        this.initBtn();

    },
    initBtn: function()  {
        var bgBtn;
        var bgBlinking;
        if(Util.isNeedToChangeIcon())
        {
            bgBtn = new cc.Scale9Sprite(res_name.bg_addMoney_chess);
        }else
        {
            bgBtn = new cc.Scale9Sprite(res_name.bg_addMoney);
            bgBlinking = new cc.Scale9Sprite(res_name.blinkingPayment);
            bgBlinking.width = this.btnSize.width - 0.5;
            bgBlinking.height = this.btnSize.height- 0.5;
            if(BkGlobal.currentGS != GS.INGAME_GAME)
            {
                this.setBlinking(true,bgBlinking);
            }
        }
        bgBtn.width = this.btnSize.width;
        bgBtn.height = this.btnSize.height;
        bgBtn.visible = true;
        bgBtn.x = this.width / 2;
        bgBtn.y = this.height / 2;
        this.addChild(bgBtn, -1);

        var iconBtn = new BkSprite("#" + res_name.icon_addMoney);
        iconBtn.x = iconBtn.width / 2 + 12;
        iconBtn.y = bgBtn.height / 2 + 0.5;
        if(BkGlobal.currentGS === GS.CHOOSE_GAME || BkGlobal.currentGS === GS.CHOOSE_TABLE)
        {
            var an = new BkAnimation();
            an.gameIconEffect1(iconBtn);
            var star1 = new BkSprite("#" + res_name.starWhite);
            star1.x = 5;
            star1.y = 5;
            star1.visible = false;
            an.starEffect(0,star1);
            this.addChild(star1,2);
            var star2 = new BkSprite("#" + res_name.starWhite);
            star2.x = 30;
            star2.y = 30;
            star2.visible = false;
            an.starEffect(2,star2);
            this.addChild(star2,2);
            var star3 = new BkSprite("#" + res_name.starWhite);
            star3.x = 60;
            star3.y = 10;
            star3.visible = false;
            an.starEffect(3,star3);
            this.addChild(star3,2);
            var star4 = new BkSprite("#" + res_name.starWhite);
            an.starEffect(3.5,star4);
            star4.x = 100;
            star4.y = 25;
            star4.visible = false;
            this.addChild(star4,2);
            if(BkGlobal.currentGS === GS.CHOOSE_TABLE)
            {
                star1.x = 5;
                star2.x = 10;
                star3.x = 30;
                star3.y = 30;
                star4.x = 30;
                star4.y = 5;
            }
        }
        this.addChild(iconBtn,2);
        var lblAddPercent = new BkLabel(this.bonusPercent + "%", "", 15, true);
        lblAddPercent.setTextColor(cc.color(250, 24, 2));
        lblAddPercent.enableOutline(cc.color.WHITE, 3);
        if (this.gameState == GS.CHOOSE_GAME) {
            var lblNapTien = new BkLabel("Nạp quan", "", 16);
            lblNapTien.x =  iconBtn.x + iconBtn.width / 2 + lblNapTien.getContentSize().width / 2 + P_ITEM_PADDING_X;
            lblNapTien.y = iconBtn.y;
            lblNapTien.setColor(P_BTN_TEXT_COLOR);
            this.addChild(lblNapTien,2);

            lblAddPercent.x = lblNapTien.x + lblNapTien.getContentSize().width / 2 + lblAddPercent.getContentSize().width / 2 + 5;
            lblAddPercent.y = lblNapTien.y;
        } else {
            lblAddPercent.x = iconBtn.x + iconBtn.width / 2 + lblAddPercent.getContentSize().width / 2 + 5;
            lblAddPercent.y = iconBtn.y;
        }
        if (this.bonusPercent > BT.ZERO_PERCENT)
        {
            if(lblNapTien) {
                lblNapTien.setFontSize(15);
            }
            this.addChild(lblAddPercent,2);
        }
        //event
        var frame;
        var self = this;
        this.setMouseOnHover(
            function ()
            {
                if(Util.isNeedToChangeIcon())
                {
                    frame = cc.spriteFrameCache.getSpriteFrame(res_name.bg_addMoney_hover_chess);

                }else
                {
                    frame = cc.spriteFrameCache.getSpriteFrame(res_name.bg_addMoney_hover);
                }
                bgBtn.initWithSpriteFrame(frame);
                bgBtn.width = self.btnSize.width;
                bgBtn.height = self.btnSize.height;
                if (lblNapTien) {
                    lblNapTien.setColor(P_BTN_TEXT_COLOR_HOVER);
                }
                iconBtn.initWithSpriteFrameName(res_name.icon_addMoney_hover);
            }, function () {
                if(Util.isNeedToChangeIcon())
                {
                    frame = cc.spriteFrameCache.getSpriteFrame(res_name.bg_addMoney_chess);
                }else
                {
                    frame = cc.spriteFrameCache.getSpriteFrame(res_name.bg_addMoney);
                }
                bgBtn.initWithSpriteFrame(frame);
                bgBtn.width = self.btnSize.width;
                bgBtn.height = self.btnSize.height;
                if (lblNapTien) {
                    lblNapTien.setColor(P_BTN_TEXT_COLOR);
                }
                iconBtn.initWithSpriteFrameName(res_name.icon_addMoney);
            });
    },
    setBlinking:function(isBlinking,blinkingImg)
    {
        if(isBlinking)
        {
            if(this.blinkingImage == null)
            {
                this.blinkingImage = blinkingImg;
                this.blinkingImage.x = this.blinkingImage.width/2;
                this.blinkingImage.y = this.blinkingImage.height/2;
                this.addChild(this.blinkingImage,1);
                var action = cc.fadeIn(1.5);
                var actionBack =  action.reverse();
                var delay = cc.delayTime(2);
                var rep = cc.sequence(action, delay, actionBack).repeatForever();
                this.blinkingImage.runAction(rep);
            }
        }
        else
        {
            if(this.blinkingImage != null)
            {
                this.blinkingImage.stopAllActions();
                this.blinkingImage.removeFromParent();
                this.blinkingImage = null;
            }
        }
    },
});