/**
 * Created by vinhnq on 11/24/2015.
 */
BADGE_TYPE_VALUE = [0, 5, 20, 100, 500, 10000, 999999999];
BADGE_DESC = ["Chưa đạt được", "Lính mới", "Nghiệp dư", "Chuyên nghiệp", "Cao thủ", "Đại cao thủ", "Unreachable"];
BkBadge = BkSprite.extend
({
    category:null,
    type:null,
    nextBadgeTypeRecordLeft:0,
    gameID:null,
    badgeSprite:null,
    tooltip: null,
    background: null,
  //  backgroundHover: null,
    ctor:function(category,recordCount,gameID)
    {
        this._super();
        this.category = category;
        this.type = this.getBadgeType(recordCount);
        this.nextBadgeTypeRecordLeft = this.type.getNext().getValue() - recordCount;
        this.gameID = gameID;
        this.badgeSprite = new BkSprite(this.getBadgeFileName());
        this.addChild(this.badgeSprite);
        //init hover action
    },
    createToolTip:function(pr)
    {
        var tooltipHeight = 80;
        this.tooltip = createTooltip(this.getSimpleDescription(),14,tooltipHeight);
        this.tooltip.visible = false;
        this.tooltip.x = this.x;
        this.tooltip.y = this.y + tooltipHeight/2 + 25;
        this.getParent().addChild(this.tooltip);
        this.initMouseAction();

    },
    initMouseAction: function () {
        var self = this;
        this.badgeSprite.setMouseOnHover(function()
        {
            // mouse hover: show tooltip
            if(self.tooltip) self.tooltip.setVisible(true);
        },function(){
            // mouse out: hide tooltip
            if(self.tooltip) self.tooltip.setVisible(false);
        });
    },
    getBadgeType:function(recordCount)
    {
        for (var i = 1; i < BADGE_TYPE_VALUE.length ; i++)
        {
            if (recordCount < BADGE_TYPE_VALUE[i])
            {
                return new BkBadgeType(i - 1);
            }
        }
        return null;
    },
    getBadgeFileName:function()
    {
        cc.spriteFrameCache.addSpriteFrames(res.badges_plist, res.badges_img);
        var winFileName = ["#win_none.png", "#win_beginner.png", "#win_amateur.png", "#win_professional.png", "#win_expert.png", "#win_super.png"];
        var firstFileName = ["#firstspecial_none.png", "#firstspecial_beginner.png", "#firstspecial_amateur.png", "#firstspecial_professional.png", "#firstspecial_expert.png", "#firstspecial_super.png"];
        var secondFileName = ["#secondspecial_none.png", "#secondspecial_beginner.png", "#secondspecial_amateur.png", "#secondspecial_professional.png", "#secondspecial_expert.png", "#secondspecial_super.png"];
        this.index = this.type.index;
        this.index = Math.min(this.index, winFileName.length - 1);
        switch (this.category)
        {
            case BadgeCategory.Win:
                return winFileName[this.index];
            case BadgeCategory.FirstSpecial:
                return firstFileName[this.index];
        }
        return secondFileName[this.index];
    },
    getType:function()
    {
        return type;
    },

    setType:function(type)
    {
        this.type = type;
    },

    getBadgeCategoryName:function()
    {
        switch (this.category)
        {
            case BadgeCategory.Win:
                return "Số trận thắng";
            case BadgeCategory.FirstSpecial:
                switch (this.gameID)
                {
                    case GID.PHOM:
                        return "Cao thủ \"Ù\" ";
                    case GID.TLMN:
                    case GID.TLMN_DEM_LA:
                        return "Cao thủ \"Tới Trắng\"";
                    case GID.BA_CAY:
                        return "Cao thủ \"10 điểm\"";
                    case GID.POKER:
                    case GID.XITO:
                    case GID.LIENG:
                        return "Cao thủ \"Thắng Tố Tất\"";
                    case GID.XAM:
                        return "Cao thủ \"Thắng báo Sâm\"";
                    case GID.XI_DZACH:
                        return "Cao thủ \"Xì Bàng\"";
                    case GID.MAU_BINH:
                        return "Cao thủ \"Rồng Cuốn\"";
                    case GID.CHAN:
                        return "Cao thủ \"Thập thành\"";
                    case GID.CO_TUONG:
                    case GID.CO_UP:
                        return "Thắng hơn 100.000 xu";
                    default:
                        return "Theo số ván thắng cực đặc biệt ";
                }
            case BadgeCategory.SecondSpecial:
                switch (this.gameID)
                {
                    case GID.PHOM:
                        return "Cao thủ \"Ăn chốt\" ";
                    case GID.TLMN:
                        return "Cao thủ \"Thắng 3 bích cuối\"";
                    case GID.TLMN_DEM_LA:
                        return "Cao thủ \"Bắt cóng cả làng\"";
                    case GID.BA_CAY:
                        return "Cao thủ \"Thắng cả làng\"";
                    case GID.POKER:
                    case GID.XITO:
                        return "Cao thủ \"Thùng Phá sảnh\"";
                    case GID.LIENG:
                        return "Cao thủ \"Sáp\"";
                    case GID.XAM:
                        return "Cao thủ ăn \"Chặt 2\"";
                    case GID.XI_DZACH:
                        return "Cao thủ \"Thắng cả làng\"";
                    case GID.MAU_BINH:
                        return "Cao thủ \"Thắng Trắng\"";
                    case GID.CHAN:
                        return "Cao thủ \"Chì Bạch thủ\"";
                    case GID.CO_TUONG:
                    case GID.CO_UP:
                        return "Thắng dưới 5 phút";
                    default:
                        return "Theo số ván thắng khá đặc biệt";
                }
        }
        return "Số trận thắng ";
    },

    getCategory:function()
    {
        return this.category;
    },
    getSimpleDescription:function()
    {
        var sb = "";
        sb = sb + "Huân chương: " + this.getBadgeCategoryName() + "\n";
        sb = sb + "Cấp độ: " + this.type.toString();
        sb = sb + "\n "+this.getDetailDesc();
        return sb;
    },

    getDetailDesc: function () {
        var desc = "Cần thêm " + formatNumber(this.nextBadgeTypeRecordLeft) + " trận thắng";
        if (this.category != BadgeCategory.Win) {
            desc += " cùng loại"
        }else{
            desc += " nữa"
        }
        desc += "\n để đạt được huân chương mức cao hơn";
        return desc;
    },
});