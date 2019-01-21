/**
 * Created by VanChinh on 10/20/2015.
 */

BkItemInfo = cc.Class.extend({
    itemType: -1,
    itemId: -1,
    itemName: "",
    isSpecialItem: false,
    isFree: false,
    dayToLive: 0,
    price: 0,
    displayName: "",
    description: "",
    ctor:function(type, id, itemName, displayName, description, price, dayToLive, isSpecialItem, isFree)
    {
        this.itemType = type;
        this.itemId = id;
        this.itemName = itemName;
        this.displayName = displayName;
        this.description = description;
        this.price = price;
        this.dayToLive = dayToLive;
        this.isSpecialItem = isSpecialItem;
        this.isFree	= isFree;
    },
    setType: function(type){
        this.itemType = type;
    },
    getType: function(){
        return this.itemType;
    },

    setId: function(itemId){
        this.itemId = itemId;
    },
    getId: function(){
        return this.itemId;
    },

    setName: function(name){
        this.itemName = name;
    },
    getName: function(){
        return this.itemName;
    },

    setDisplayName: function(displayName){
        this.displayName = displayName;
    },
    getDisplayName: function(){
        return this.displayName;
    },

    setDescription: function(description){
        this.description = description;
    },
    getDescription: function(){
        return this.description;
    },

    setPrice: function(price){
        this.price = price;
    },
    getPrice: function(){
        return this.price;
    },

    setDayToLive: function(dayToLive){
        this.dayToLive = dayToLive;
    },
    getDayToLive: function(){
        return this.dayToLive;
    },

    setIsSpecialItem: function(isSpecialItem){
        this.isSpecialItem = isSpecialItem;
    },
    getIsSpecialItem: function(){
        return this.isSpecialItem;
    },

    setIsFree: function(isFree){
        this.isFree = isFree;
    },
    getIsFree: function(){
        return this.isFree;
    },

});
