/**
 * Created by vinhnq on 10/28/2015.
 */
BkSettingWindow = BkWindow.extend({
    playerData: null,
    rdGroupSound:null,
    rdGroupChat:null,
    rdGroupNumOfPlayer:null,
    rdGroupTablePass:null,

    ctor: function() {
        var wSize = cc.size(460, 341);
        if(Util.isGameCo()) {
            wSize = cc.size(350, 260);
        }
        this._super("Cài Đặt", wSize, null);
        this.initWindow();
        Util.logEvent(EVENT_SWITCH_SCREEN,KEY_SCREEN_NAME,"ConfigScene");
    },

    initWindow: function ()
    {
        this.setDefaultWdBodyBg();
        var self = this;
        var size = cc.winSize;

        // Am thanh
        var lblSound = new BkLabel("Âm thanh" , "Tahoma", 15);
        lblSound.setTextColor(cc.color(255,255,255));
        lblSound.x = lblSound.getContentSize().width/2 + WD_BODY_MARGIN_LR *2;
        lblSound.y = this.getBodySize().height - lblSound.getContentSize().height/2 - WD_BODY_MARGIN_TB * 2;
        this.addChildBody(lblSound);

        var rdDataBatSound = new BkRadioButtonData(0,1,"");
        var rdBatSound = new BkRadioButton(rdDataBatSound.description);
        rdBatSound.setData(rdDataBatSound);
        rdBatSound.x = lblSound.x + 70;
        rdBatSound.y = lblSound.y - 12;
        this.addChildBody(rdBatSound);

        ////Icon bat sound
        var imgBatSound = new BkSprite("#"+res_name.icon_sound_on);
        imgBatSound.x = rdBatSound.x + 35;
        imgBatSound.y = rdBatSound.y + 12;
        this.addChildBody(imgBatSound);

        var rdDataTatSound = new BkRadioButtonData(1,0,"");
        var rdTatSound = new BkRadioButton(rdDataTatSound.description);
        rdTatSound.setData(rdDataTatSound);
        rdTatSound.x = imgBatSound.x + 50;
        rdTatSound.y = rdBatSound.y;
        this.addChildBody(rdTatSound);

        //Icon tat sound
        var imgTatSound = new BkSprite("#"+res_name.icon_sound_off);
        imgTatSound.x = rdTatSound.x + 35;
        imgTatSound.y = imgBatSound.y;
        this.addChildBody(imgTatSound);

        this.rdGroupSound = new BkRadioButtonGroup();
        rdBatSound.setGroup(this.rdGroupSound);
        rdTatSound.setGroup(this.rdGroupSound);

        if(BkGlobal.UserSetting.soundEnable == 1)
        {
            this.rdGroupSound.setRadioSelected(rdBatSound);
            BkLogicManager.getInGameLogic().isSoundEnable = true;
        }else
        {
            this.rdGroupSound.setRadioSelected(rdTatSound);
            BkLogicManager.getInGameLogic().isSoundEnable = false;

        }

        ////Hien thi chat
        var lblchat = new BkLabel("Hiển thị chat" , "Tahoma", 15);
        lblchat.setTextColor(cc.color(255,255,255));
        lblchat.x = lblSound.x + 7;
        lblchat.y = lblSound.y - 35;
        this.addChildBody(lblchat);

        var rdDataBatChat = new BkRadioButtonData(2,1,"Bật");
        var rdBatChat = new BkRadioButton(rdDataBatChat.description);
        rdBatChat.setData(rdDataBatChat);
        rdBatChat.x = rdBatSound.x;
        rdBatChat.y = lblchat.y - 12;
        this.addChildBody(rdBatChat);

        var rdDataTatChat = new BkRadioButtonData(3,0,"Tắt");
        var rdTatChat = new BkRadioButton(rdDataTatChat.description);
        rdTatChat.setData(rdDataTatChat);
        rdTatChat.x = rdTatSound.x;
        rdTatChat.y = rdBatChat.y;
        this.addChildBody(rdTatChat);

        this.rdGroupChat = new BkRadioButtonGroup();
        rdBatChat.setGroup(this.rdGroupChat);
        rdTatChat.setGroup(this.rdGroupChat);

        if(BkGlobal.UserSetting.isChatEnable == 1)
        {
            this.rdGroupChat.setRadioSelected(rdBatChat);
        }else
        {
            this.rdGroupChat.setRadioSelected(rdTatChat);
        }

        if ((BkGlobal.currentGameID != GID.CO_TUONG) && ((BkGlobal.currentGameID != GID.CO_UP)))
        {
            // config display num of player
            // Số người chơi
            var maxPlayer = getMaxPlayer(BkGlobal.currentGameID);
            if (BkLogicManager.getInGameLogic().maxAllowedPlayer == 0) {
                 BkLogicManager.getInGameLogic().maxAllowedPlayer = maxPlayer;
            }
            if (maxPlayer > 0) {
                var lblSoNguoiChoi = new BkLabel("Số người chơi", "Tahoma", 15);
                lblSoNguoiChoi.setTextColor(cc.color(255, 255, 255));
                lblSoNguoiChoi.x = lblchat.x;
                lblSoNguoiChoi.y = lblchat.y - 35;
                this.addChildBody(lblSoNguoiChoi);

                var rdData2Player = new BkRadioButtonData(4, 2, "2");
                var rd2Player = new BkRadioButton(rdData2Player.description);
                rd2Player.setData(rdData2Player);
                rd2Player.x = rdBatChat.x;
                rd2Player.y = lblSoNguoiChoi.y - 8;
                this.addChildBody(rd2Player);

                var rdData3Player = new BkRadioButtonData(5, 3, "3");
                var rd3Player = new BkRadioButton(rdData3Player.description);
                rd3Player.setData(rdData3Player);
                rd3Player.x = rd2Player.x + 85;
                rd3Player.y = rd2Player.y;
                this.addChildBody(rd3Player);

                var rdData4Player = new BkRadioButtonData(6, 4, "4");
                var rd4Player = new BkRadioButton(rdData4Player.description);
                rd4Player.setData(rdData4Player);
                rd4Player.x = rd3Player.x + 85;
                rd4Player.y = rd2Player.y;
                this.addChildBody(rd4Player);

                this.rdGroupNumOfPlayer = new BkRadioButtonGroup();
                rd2Player.setGroup(this.rdGroupNumOfPlayer);
                rd3Player.setGroup(this.rdGroupNumOfPlayer);
                rd4Player.setGroup(this.rdGroupNumOfPlayer);
                // this.rdGroupNumOfPlayer.setRadioSelected(rd4Player);

                if (maxPlayer > 4) {
                    rd3Player.x = rd2Player.x + 60;
                    rd4Player.x = rd3Player.x + 60;

                    var rdData5Player = new BkRadioButtonData(7, 5, "5");
                    var rd5Player = new BkRadioButton(rdData5Player.description);
                    rd5Player.setData(rdData5Player);
                    rd5Player.x = rd4Player.x + 60;
                    rd5Player.y = rd2Player.y;
                    this.addChildBody(rd5Player);

                    var rdData6Player = new BkRadioButtonData(8, 6, "6");
                    var rd6Player = new BkRadioButton(rdData6Player.description);
                    rd6Player.setData(rdData6Player);
                    rd6Player.x = rd5Player.x + 60;
                    rd6Player.y = rd2Player.y;
                    this.addChildBody(rd6Player);

                    rd5Player.setGroup(this.rdGroupNumOfPlayer);
                    rd6Player.setGroup(this.rdGroupNumOfPlayer);
                    //this.rdGroupNumOfPlayer.setRadioSelected(rd6Player);

                }
                switch (BkLogicManager.getInGameLogic().maxAllowedPlayer) {
                    case 2:
                        this.rdGroupNumOfPlayer.setRadioSelected(rd2Player);
                        break;
                    case 3:
                        this.rdGroupNumOfPlayer.setRadioSelected(rd3Player);
                        break;
                    case 4:
                        this.rdGroupNumOfPlayer.setRadioSelected(rd4Player);
                        break;
                    case 5:
                        this.rdGroupNumOfPlayer.setRadioSelected(rd5Player);
                        break;
                    case 6:
                        this.rdGroupNumOfPlayer.setRadioSelected(rd6Player);
                        break;
                    default:
                        this.rdGroupNumOfPlayer.setRadioSelected(rd4Player);
                        break;

                }
            }
            // lbl Mật khẩu bàn
            var lblMatKhauBan = new BkLabel("Mật khẩu bàn", "Tahoma", 15);
            lblMatKhauBan.setTextColor(cc.color(255, 255, 255));
            lblMatKhauBan.x = lblchat.x;
            lblMatKhauBan.y = lblSoNguoiChoi.y - 35;
            this.addChildBody(lblMatKhauBan);

            // RB Mật khẩu bàn Yes
            var rdDataMKBYes = new BkRadioButtonData(9, 1, "Có");
            var rdMKBYes = new BkRadioButton(rdDataMKBYes.description);
            rdMKBYes.setData(rdDataMKBYes);
            rdMKBYes.x = rdBatSound.x;
            rdMKBYes.y = lblMatKhauBan.y - 8;
            this.addChildBody(rdMKBYes);

            // text box Mật khẩu bàn
            this.tablePass = createEditBox(cc.size(180, 35), res_name.edit_text);
            this.tablePass.setFontColor(BkColor.TEXT_INPUT_COLOR);
            this.tablePass.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
            this.tablePass.setMaxLength(20);
            this.tablePass.x = rdMKBYes.x + 150;
            this.tablePass.y = rdMKBYes.y + 8 + 0.5;
            this.tablePass.setTabStop();
            this.addChildBody(this.tablePass);

            // RB Mật khẩu bàn No
            var rdDataMKBNo = new BkRadioButtonData(10, 0, "Không");
            var rdMKBNo = new BkRadioButton(rdDataMKBNo.description);
            rdMKBNo.setData(rdDataMKBNo);
            rdMKBNo.x = rdMKBYes.x;
            rdMKBNo.y = lblMatKhauBan.y - 43;
            this.addChildBody(rdMKBNo);

            this.rdGroupTablePass = new BkRadioButtonGroup();
            rdMKBYes.setGroup(this.rdGroupTablePass);
            rdMKBNo.setGroup(this.rdGroupTablePass);
            if (BkLogicManager.getInGameLogic().pass == "") {
                this.tablePass.setPlaceHolder("Nhập mật khẩu...");
                this.tablePass.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
                this.rdGroupTablePass.setRadioSelected(rdMKBNo);
                this.tablePass.setDisabled(true);
            } else {
                //this.tablePass.setPlaceHolder(BkLogicManager.getInGameLogic().pass);
                this.tablePass.setString(BkLogicManager.getInGameLogic().pass);
                this.rdGroupTablePass.setRadioSelected(rdMKBYes);
                this.tablePass.setDisabled(false);

            }
            this.rdGroupTablePass.setOnSelectedCallback(function () {
                var selectRB = self.rdGroupTablePass.getRadioButtonSelected();
                if (selectRB.getValue() == 1) {
                    self.tablePass.setDisabled(false);
                    self.tablePass.setAutoFocus(true);
                } else {
                    self.tablePass.setDisabled(true);
                }
            });
            if (BkLogicManager.getInGameLogic().isInGameProgress() || BkGlobal.isRoomTypeSolo() || !BkLogicManager.getInGameLogic().isMeBossTable()) {
                if (BkGlobal.isRoomTypeSolo()) {
                    this.rdGroupNumOfPlayer.setRadioSelected(rd2Player);
                }
                this.rdGroupNumOfPlayer.setEnableRadioGroup(false);
                if (BkLogicManager.getInGameLogic().isInGameProgress() || !BkLogicManager.getInGameLogic().isMeBossTable()) {
                    this.rdGroupTablePass.setEnableRadioGroup(false);
                    this.tablePass.setDisabled(true);
                }
            }
        }

        // Show taken pieces setting
        if(BkGlobal.currentGameID == GID.CO_UP && BkLogicManager.getInGameLogic().isMeBossTable() && BkLogicManager.getInGameLogic().gameStatus != GAME_STATE_PLAYING){
            var lblShowTakePiece = new BkLabel("Lật quân ăn" , "Tahoma", 15);
            lblShowTakePiece.setTextColor(cc.color(255,255,255));
            lblShowTakePiece.x = lblShowTakePiece.getContentSize().width/2 + WD_BODY_MARGIN_LR *2;
            lblShowTakePiece.y = lblchat.y - 35;
            this.addChildBody(lblShowTakePiece);

            var rdDataLatQuanAn = new BkRadioButtonData(0,1,"Có");
            var rdLatQuanAn = new BkRadioButton(rdDataLatQuanAn.description);
            rdLatQuanAn.setData(rdDataLatQuanAn);
            rdLatQuanAn.x = rdBatSound.x;
            rdLatQuanAn.y = lblShowTakePiece.y - 12;
            this.addChildBody(rdLatQuanAn);

            var rdDataKoLatQuanAn = new BkRadioButtonData(1,0,"Không");
            var rdKoLatQuanAn = new BkRadioButton(rdDataKoLatQuanAn.description);
            rdKoLatQuanAn.setData(rdDataKoLatQuanAn);
            rdKoLatQuanAn.x = rdTatSound.x;
            rdKoLatQuanAn.y = rdLatQuanAn.y;
            this.addChildBody(rdKoLatQuanAn);

            this.rdGroupShowTakePiece = new BkRadioButtonGroup();
            rdLatQuanAn.setGroup(this.rdGroupShowTakePiece);
            rdKoLatQuanAn.setGroup(this.rdGroupShowTakePiece);

            if(Util.getClientSetting(key.showTakenPiece) == 1) {
                this.rdGroupShowTakePiece.setRadioSelected(rdLatQuanAn);
            } else {
                this.rdGroupShowTakePiece.setRadioSelected(rdKoLatQuanAn);
            }
        }

        var bottomBodyBg = new cc.DrawNode();
        bottomBodyBg.drawRect(cc.p(0, 0), cc.p(this._wdBodyInnerSize.width, 50), BkColor.BG_PANEL_COLOR, 0, BkColor.BG_BODY_BORDER_COLOR);
        bottomBodyBg.x = WD_BODY_MARGIN_LR;
        bottomBodyBg.y = 0;
        //this.addChildBody(bottomBodyBg, -1);

        var btnThietLap = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Thiết lập",size.width/2,size.height/2);
        btnThietLap.x = this.getBodySize().width/2 - 50;
        btnThietLap.y = WD_BODY_MARGIN_TB + 5;
        this.addChildBody(btnThietLap);
        btnThietLap.addClickEventListener(function()
        {
            var chatRadioSelected = self.rdGroupChat.getRadioButtonSelected();
            var soundRadioSelected = self.rdGroupSound.getRadioButtonSelected();
            if (chatRadioSelected != null){
                BkGlobal.UserSetting.isChatEnable = chatRadioSelected.getValue();
            } else {
                logMessage("chatRadioSelected == null -> check loi");
            }

            if (soundRadioSelected != null){
                BkGlobal.UserSetting.soundEnable = soundRadioSelected.getValue();
            } else {
                logMessage("soundRadioSelected == null -> check loi");
            }

            //BkGlobal.UserSetting.isChatEnable = self.rdGroupChat.getRadioButtonSelected().getValue();
            //BkGlobal.UserSetting.soundEnable = self.rdGroupSound.getRadioButtonSelected().getValue();
            BkUserClientSettings.updateSetting(BkGlobal.UserSetting);
            getCurrentScene().updateUpDownChatBoxState(BkGlobal.UserSetting.isChatEnable);

            if(BkGlobal.UserSetting.soundEnable == 1)
            {
                BkLogicManager.getInGameLogic().isSoundEnable = true;
            }else
            {
                BkLogicManager.getInGameLogic().isSoundEnable = false;
            }

            // So nguoi choi
            if ((BkGlobal.currentGameID != GID.CO_TUONG) && ((BkGlobal.currentGameID != GID.CO_UP))) {
                var numberOfPlayers = self.rdGroupNumOfPlayer.getRadioButtonSelected().getValue();
                if (numberOfPlayers >= BkLogicManager.getInGameLogic().PlayerState.length) {
                    BkLogicManager.getInGameLogic().maxAllowedPlayer = numberOfPlayers;
                    var pass = self.tablePass.getString();
                    if (self.rdGroupTablePass.getRadioButtonSelected().getValue() == 1) {
                        if (self.tablePass.getString() != "") {
                            BkLogicManager.getInGameLogic().pass = self.tablePass.getString();
                        } else {
                            showToastMessage("Mật khẩu bàn không hợp lệ", cc.winSize.width / 2, cc.winSize.height/3+ 5, null, 200);
                            return;
                        }
                    } else {
                        BkLogicManager.getInGameLogic().pass = "";
                    }
                    var bMoney = BkLogicManager.getInGameLogic().tableBetMoney;
                    BkLogicManager.getInGameLogic().setupTable(bMoney, numberOfPlayers, BkLogicManager.getInGameLogic().pass);
                } else {
                    showToastMessage(BkConstString.STR_MAX_PLAYER_INVALID);
                    return;
                }
            }

            // Show taken pieces setting
            if (BkGlobal.currentGameID == GID.CO_UP && BkLogicManager.getInGameLogic().isMeBossTable()) {
                var bMoney = BkLogicManager.getInGameLogic().tableBetMoney;
                if(self.rdGroupShowTakePiece){
                    BkLogicManager.getInGameLogic().processBetMaxMoney(bMoney, self.rdGroupShowTakePiece.getRadioButtonSelected().getValue());
                }
            }

            self.removeSelf();
        });
        // Bo qua
        var btnBoQua = createBkButtonPlist(res_name.BtnDialog_Normal, res_name.BtnDialog_Pressed, res_name.BtnDialog_Inactive,
            res_name.BtnDialog_Hover,"Bỏ qua",size.width/2,size.height/2);
        btnBoQua.x = btnThietLap.x + btnThietLap.width/2 + 50;
        btnBoQua.y = btnThietLap.y;
        this.addChildBody(btnBoQua);
        btnBoQua.addClickEventListener(function()
        {
            self.removeSelf();
        });
    }
});