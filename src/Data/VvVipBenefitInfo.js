/**
 * Created by bs on 31/05/2017.
 */
VvVipBenefitInfo = cc.Class.extend({
    maxBorrowMoney:0,
    mnTransferPercent:0,
    mnBoxPercent:0,
    paymentBonus:0,
    FBinviteBonus:0,
    nextLevelScore:0,
    logInfo:function () {
        logMessage("maxBorrowMoney: "+this.maxBorrowMoney+" - mnTransferPercent: "+this.mnTransferPercent+" - mnBoxPercent: "
            +this.mnBoxPercent +" - paymentBonus: "+this.paymentBonus+" - FBinviteBonus: "+this.FBinviteBonus
            +" - nextLevelScore: "+this.nextLevelScore)
    }
});