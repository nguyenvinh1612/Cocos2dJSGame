/**
 * Created by hoangthao on 19/10/2015.
 */
BkSmsInfo = cc.Class.extend({
    serviceNumber: null,
    content: null,
    moneyVnd: null,
    moneyXu: null,

    ctor: function (sn, ct, mVnd, mX) {
        this.serviceNumber = sn;
        this.content = ct;
        this.moneyVnd = mVnd;
        this.moneyXu = mX;
    }
});
