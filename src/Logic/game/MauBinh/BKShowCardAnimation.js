/**
 * Created by vinhnq on 5/20/2016.
 */
BkShowCardAnimation = cc.Layer.extend({
    cardList:null,
    count:0,
    ctor:function(){
        this._super();
    },
    addCardList:function(cl)
    {
        this.cardList = [];
        for(var i = 0; i < cl.length; i++)
        {
            this.cardList.push(cl[i]);
        }
    },
    showCardAnimation:function(time,cardList)
    {
        this.time = time;
        this.addCardList(cardList);
        this.animateCard(this.cardList,this.time);
    },
    animateCard:function()
    {
        this.schedule(this.onTick,this.time);
    },
    onTick:function()
    {
        logMessage("onTick:" + this.count);
        if(this.count >=  this.cardList.length )
        {
            this.unschedule(this.onTick);
            return;
        }
        this.cardList[this.count].showBackMask();
        this.count++;
    },
});