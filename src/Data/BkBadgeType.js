/**
 * Created by vinhnq on 11/24/2015.
 */
BkBadgeType = cc.Class.extend
({
    index: null,
    ctor:function(index)
    {
        this.index = index;
    },

    getNext:function()
    {
        if (this.index >= BADGE_TYPE_VALUE.Length - 1)
        {
            return this;
        }
        return new BkBadgeType(this.index + 1);
    },
    getValue: function(){
        return BADGE_TYPE_VALUE[this.index];
    },
    toString:function()
    {
        return BADGE_DESC[this.index];
    },
});