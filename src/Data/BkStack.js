/**
 * Created by bs on 02/06/2017.
 */
BkStack = cc.Class.extend({
    stackArr:[],
    ctor:function(){
        this.stackArr = [];
    },
    pushItem:function (o) {
        this.stackArr.push(o);
    },
    /*
    *   only get top Item not remove
    * */
    getTopIem:function () {
        if (this.stackArr.length == 0){
            return null;
        }
        return this.stackArr[this.stackArr.length - 1];
    },
    /*
    *   get and remove topItem
    * */
    pop:function () {
        return this.stackArr.pop();
    },
    getLength:function () {
        return this.stackArr.length;
    },
    itemAtIndex:function (index) {
        if (index>=this.stackArr.length){
            return null;
        }
        return this.stackArr[index];
    }

});