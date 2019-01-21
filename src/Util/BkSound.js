/**
 * Created by bs on 17/05/2017.
 */
BkSound = {
    HEADER_LINK:"res/sound/vvSound/",
    queue:null,
    CARD_SOUND:null,
    lastTimePlay:0,
    getSound:function(){
        return cc.audioEngine;
    },
    playSimpleSound:function(soundName){
        soundName = this.HEADER_LINK +soundName;
        logMessage("playSimpleSound "+soundName);
        if(!this.isSoundEnable()) {
            return;
        }
        this.lastTimePlay = BkTime.GetCurrentTime();
        this.getSound().playMusic(soundName, false);
    },
    getTimeDelaySound:function(soundName){
        var value1 = 1.5;
        var value2 = 1;
        var value3 = 0.7;
        if (soundName == sound_rest.hoaroicuaphat){
            return value1;
        }
        if (soundName == sound_rest.bachthuchi){
            return value1;
        }
        if (soundName == sound_rest.cothienkhai){
            return value1;
        }
        if (soundName == sound_rest.kinhtuchi){
            return value1;
        }

        if (soundName == sound_rest.caloisandinh){
            return value1;
        }

        if (soundName == sound_rest.haithienkhai){
            return value1;
        }

        if (soundName == sound_rest.bathienkhai){
            return value1;
        }

        if (soundName == sound_rest.bonthienkhai){
            return value1;
        }

        if (soundName == sound_rest.xuong){
            return value3;
        }
        if (soundName == sound_rest.thong){
            return value3;
        }
        if (soundName == sound_rest.chi){
            return value3;
        }
        if (soundName == sound_rest.leo){
            return value3;
        }
        if (soundName == sound_rest.tom){
            return value3;
        }
        return value2;
    },
    playSound:function(soundName,cbFunc){
        if (cbFunc == undefined){
            cbFunc = null;
        }
        if (cbFunc == null){
            this.playSimpleSound(soundName);
        } else {
            var crSc = getCurrentScene();
            if (crSc!= null){
                var callback = cc.callFunc(function(){
                    cbFunc();
                }, null);
                var self = this;
                var mdelay = cc.delayTime(this.getTimeDelaySound(soundName));
                var playsound = cc.callFunc(function(){
                    self.playSimpleSound(soundName)
                });
                var sq =cc.sequence(playsound,mdelay,callback);
                crSc.runAction(sq);
            }
        }
    },
    playContinuousSound:function(fileList){

        if (this.queue == null) {
            this.queue = [];
        }
        for (var i = 0; i < fileList.length; i++){
            this.queue.push(fileList[i]);
        }

        this.playContinuous();
    },
    playContinuous:function()
    {
        logMessage("Play playontinuous");
        if (this.queue == null) {
            return;
        }

        if (this.queue.length > 0) {
            var fileName = this.queue[0];
            this.queue.splice(0,1);

            var sound = fileName;//this.HEADER_LINK + fileName;
            var self = this;
            var f = function(){
                self.playContinuous();
            };
            this.playSound(sound,f);
        }
    },
    initSoundForCard:function()
    {
        this.CARD_SOUND = [];
        this.CARD_SOUND[21] = ["nhivan.mp3"];
        this.CARD_SOUND[22] = ["nhisach.mp3", "chonggay.mp3"];
        this.CARD_SOUND[23] = ["nhivanj.mp3", "nhidao.mp3"];

        this.CARD_SOUND[31] = ["tamvan.mp3"];
        this.CARD_SOUND[32] = ["tamsach.mp3"];
        this.CARD_SOUND[33] = ["tamvanj.mp3"];

        this.CARD_SOUND[41] = ["tuvan.mp3", "tubung.mp3"];
        this.CARD_SOUND[42] = ["tusach.mp3"];
        this.CARD_SOUND[43] = ["tuvanj.mp3", "tuxebo.mp3"];

        this.CARD_SOUND[51] = ["nguvan.mp3", "nguvangoichichi.mp3"];
        this.CARD_SOUND[52] = ["ngusach.mp3"];
        this.CARD_SOUND[53] = ["nguvanj.mp3", "nguchua.mp3"];

        this.CARD_SOUND[61] = ["lucvan.mp3"];
        this.CARD_SOUND[62] = ["lucsach.mp3"];
        this.CARD_SOUND[63] = ["lucvanj.mp3", "cuocdat.mp3", "luccuoc.mp3"];

        this.CARD_SOUND[71] = ["thatvan.mp3"];
        this.CARD_SOUND[72] = ["thatsach.mp3"];
        this.CARD_SOUND[73] = ["thatvanj.mp3"];

        this.CARD_SOUND[81] = ["batvan.mp3", "cakheo.mp3"];
        this.CARD_SOUND[82] = ["batsach.mp3"];
        this.CARD_SOUND[83] = ["batvanj.mp3", "batchep.mp3"];

        this.CARD_SOUND[91] = ["cuuvan.mp3"];
        this.CARD_SOUND[92] = ["cuusach.mp3"];
        this.CARD_SOUND[93] = ["cuuvanj.mp3"];

        this.CARD_SOUND[0] = ["chichi.mp3", "cumuot.mp3"];
    },

    playCardName:function(card){
        if (this.CARD_SOUND == null){
            this.initSoundForCard();
        }
        var soundForCard = this.CARD_SOUND[card.CardId];

        return this.playRandomSound(soundForCard);
    },
    playRandomSound:function(fileList, needToPlay )
    {
        var tempList = [];

        var i;
        for (i = 0; i < fileList.length; i++) {
            tempList.push(fileList[i]);
        }
        if (tempList.length >0) {
            var index = Util.getRandom(tempList.length - 1);
            var tempSound = tempList[index];
            this.playSimpleSound(tempSound);
        }
    },

    OnDiscardCard:function(logic, ServerPos, card, param2, isMe){
        if (this.isRandomMute(10)){
            logMessage("isRandomMute");
            return;
        }
        var soundList = [];
        // Neu la cay do thi doc bom do -- done
        if (card.isRedCard()) {
            soundList.push("bomdo.mp3");
        }

        // Check doc an ji danh nay chang may ma u -- done
        if (logic.isAnGiDanhLay(ServerPos, card)) {
            soundList.push("angidanhnaychangmaymau.mp3");
            soundList.push("angidanhnay.mp3");
        }

        // Check doc bao ve cheo canh

        // Check doc dem van ngay van

        // Check doc chay ro thoi

        // Check doc cu di da, nhat di nhi u -- done
        if (logic.isNhatDiNhiU(ServerPos, card)) {
            soundList.push("nhatdinhiu.mp3");
            soundList.push("cudida.mp3");
        }

        // Check doc danh ca ca luon -- Ko check dc voi du lieu hien tai

        // Check doc danh chi ngoi cho chi dung -- done
        if (logic.isDanhChiNgoiChoChiDung(ServerPos, card)) {
            soundList.push("danhchingoichochidung.mp3");
        }
        // Check doc di not luon -- Check ko chinh xac do khong xac dinh duoc list quan player danh di - chua check

        // Check doc het bat, het cuu, het tam.... -- done
        if (logic.isHetQuanRoi(card)) {
            var hetQuan = this.getHetQuanSound(card.getCardNumber());
            if (hetQuan != null && hetQuan != "") {
                soundList.push(hetQuan);
            }
        }

        // Check doc ra rong thoi -- phai check duoc event ngay truoc do la event an - chua lam duoc

        // Check doc rong cao hep thap
        for (var i =0; i < soundList.length; i++) {
            logMessage("i:" + soundList[i]);
        }

        if (soundList.length > 0) {
            this.playRandomSound(soundList);
        } else {
            this.playCardName(card);
        }
    },
    getHetQuanSound:function(cardNumber)
    {
        var soundFile = "";
        switch(cardNumber)
        {
            case 3:
            {
                soundFile = "hettamroi.mp3";
                break;
            }
            case 4:
            {
                soundFile = "hetturoi.mp3";
                break;
            }
            case 5:
            {
                soundFile = "hetnguroi.mp3";
                break;
            }
            case 6:
            {
                soundFile = "hetlucroi.mp3";
                break;
            }
            case 7:
            {
                soundFile = "hetthatroi.mp3";
                break;
            }
            case 8:
            {
                soundFile = "hetbatroi.mp3";
                break;
            }
            case 9:
            {
                soundFile = "hetcuuroi.mp3";
                break;
            }

            default:
            {
                break;
            }
        }
        return "";
    },
    OnNhaiEvent:function(){
        this.playSimpleSound("nhairoi.mp3");
    },
    OnPickCard:function(ServerPosition, card, param2){
        if (this.isRandomMute()){
            logMessage("isRandomMute");
            return;
        }
        var soundList = ["boc.mp3", "boccao.mp3", "bocquacua.mp3", "khidivodancaotayboc.mp3"];
        var temp = Util.getRandom(3);
        if (temp > 1) {
            this.playRandomSound(soundList);
        } else {
            this.playCardName(card);
        }
    },
    OnTakeCard:function(logic, ServerPosition, card1, card2, id, isMe){
        if (this.isRandomMute(10)){
            logMessage("isRandomMute");
            return;
        }
        var soundList = [];
        // Check an cho so - Moi cai logic an nhieu do
        if (logic.isAnChoSo(ServerPosition, card2)) {
            soundList.push("anngon.mp3");
            soundList.push("anchoso.mp3");
        }

        // Check cau lai
        if (logic.isCauLai(ServerPosition, card2)) {
            soundList.push("caulai.mp3");
        }

        if (soundList.length >0) {
            this.playRandomSound(soundList);
        } else {
            soundList = ["an.mp3","anluon.mp3"];
            this.playRandomSound(soundList);
        }
    },
    OnChiuCard:function(chiuPlayerID, previousChiuPlayer, currentActivePlayer)
    {
        var soundList = [];
        if (previousChiuPlayer == currentActivePlayer || chiuPlayerID == currentActivePlayer) {
            // Chiu gan
            soundList = ["chiu.mp3",
                "chiuchiu.mp3"
            ];
        } else {
            // Chiu xa
            soundList = ["chiu.mp3",
                "chiuchiu.mp3","chiuxabangbachiugan.mp3"
            ];
        }
        this.playRandomSound(soundList);
    },
    OnTraCua:function(backupChiuPlayer, serPos, card, param3, isMe){
        this.playCardName(card);
    },
    OnForfeit:function(logic, sererPos, card)
    {
        if (this.isRandomMute()){
            logMessage("isRandomMute");
            return;
        }
        var soundList = [];

        if (logic.isDuoiChet(sererPos, card)) {
            soundList.push("duoichet.mp3");
        }

        if (soundList.length > 0) {
            this.playRandomSound(soundList);
        } else {
            soundList = ["duoi.mp3",
                "duoian.mp3",
                "duoidung.mp3",
                "duoiluon.mp3"];
            this.playRandomSound(soundList);
        }
    },
    OnU:function(serverPos, uCard, isMe){
        var soundList = ["uroi.mp3"];
        if (isMe) {
            soundList = ["uroi.mp3", "uluon.mp3"];
        }
        this.playRandomSound(soundList);
    },
    OnXuongCuocResult:function(serverPos, diem, ga, tongDiemDung, errCode, cuocSai, cuoc)
    {
        var soundList= CXuongCuocWindow.getArraySoundFrom(cuoc);
        this.playContinuousSound(soundList);
    },
    isRandomMute:function(per){
        if (this.getSound().isMusicPlaying()){
            logMessage("k doc neu dang doc file khac");
            return true;
        }
        if (per == undefined){
            per = 20;
        }
        var num = Util.getRandom(100);
        if (num<per){
            return true;
        }

        var crTime = BkTime.GetCurrentTime();
        if (crTime - this.lastTimePlay < 1500){
            return true;
        }
        return false;
    },
    isSoundEnable : function() {
        return BkLogicManager.getInGameLogic().isSoundEnable;
    }
};