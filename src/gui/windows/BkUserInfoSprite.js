/**
 * Created by VanChinh on 11/2/2015.
 */
UP_ITEM_PADDING_Y = 9;
UP_ITEM_PX_VALUE = 80;
UP_ITEM_EDIT_WIDTH_VALUE = 240;
UP_ITEM_EDIT_HEIGHT_VALUE = 22;
UP_ITEM_EDIT_CSS_BORDER = "1px solid #9c8643";
UP_ITEM_EDIT_CSS_BACKGROUND = "#fbb040";
USER_INFO_SPRITE_FONT_SIZE = 13;
BkUserInfoSprite = BkSprite.extend({
    userInfo: null,
    updatedInfo: null,
    isEditMode: false,
    parentNode: null,
    viewSprite: null,
    editSprite: null,

    ctor: function (userInfo, parent) {
        this._super();
        this.userInfo = userInfo;
        this.parentNode = parent;
        this.initUI();
    },

    initUI: function () {
        this.removeAllChildren();
        this.viewSprite = new BkSprite();
        this.viewSprite.setPosition(0, 0);

        var startY = 200;

        // if (this.userInfo.userName == BkGlobal.UserInfo.userName && BkGlobal.currentGS == GS.CHOOSE_GAME) {
        //     startY = 200;
        // }

        var lblFullName = new BkLabel("Họ tên:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblFullName.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblFullName.x = lblFullName.getContentSize().width / 2;
        lblFullName.y = startY - lblFullName.getContentSize().height / 2;
        this.viewSprite.addChild(lblFullName);

        var fullName = Util.getFormatString(this.parentNode.getFullName());
        var contentFullName = new BkLabel(fullName, "", USER_INFO_SPRITE_FONT_SIZE);
        contentFullName.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        contentFullName.x = contentFullName.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        contentFullName.y = lblFullName.y;
        this.viewSprite.addChild(contentFullName);

        var lblGender = new BkLabel("Giới tính:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblGender.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblGender.x = lblGender.getContentSize().width / 2;
        lblGender.y = contentFullName.y - contentFullName.getContentSize().height / 2 - lblGender.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.viewSprite.addChild(lblGender);

        var contentGender = new BkLabel(this.parentNode.getGender(), "", USER_INFO_SPRITE_FONT_SIZE);
        contentGender.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        contentGender.x = contentGender.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        contentGender.y = lblGender.y;
        this.viewSprite.addChild(contentGender);

        var lblBirthday = new BkLabel("Ngày sinh:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblBirthday.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblBirthday.x = lblBirthday.getContentSize().width / 2;
        lblBirthday.y = contentGender.y - contentGender.getContentSize().height / 2 - lblBirthday.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.viewSprite.addChild(lblBirthday);

        var contentBirthday = new BkLabel(this.parentNode.getBirthday(), "", USER_INFO_SPRITE_FONT_SIZE);
        contentBirthday.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        contentBirthday.x = contentBirthday.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        contentBirthday.y = lblBirthday.y;
        this.viewSprite.addChild(contentBirthday);

        var lblAddress = new BkLabel("Địa chỉ:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblAddress.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblAddress.x = lblAddress.getContentSize().width / 2;
        lblAddress.y = contentBirthday.y - contentBirthday.getContentSize().height / 2 - lblAddress.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.viewSprite.addChild(lblAddress);

        var address = Util.getFormatString(this.parentNode.getAddress(), 32);
        var contentAddress = new BkLabel(address, "", USER_INFO_SPRITE_FONT_SIZE);
        contentAddress.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        contentAddress.x = contentAddress.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        contentAddress.y = lblAddress.y;
        this.viewSprite.addChild(contentAddress);

        var lblEmail = new BkLabel("Hộp thư:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblEmail.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblEmail.x = lblEmail.getContentSize().width / 2;
        lblEmail.y = contentAddress.y - contentAddress.getContentSize().height / 2 - lblEmail.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.viewSprite.addChild(lblEmail);

        var email = Util.getFormatString(this.parentNode.getEmail(), 25);
        var contentEmail = new BkLabel(email, "", USER_INFO_SPRITE_FONT_SIZE);
        contentEmail.setTextColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        contentEmail.x = contentEmail.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        contentEmail.y = lblEmail.y;
        this.viewSprite.addChild(contentEmail);

        if (this.userInfo.userName == BkGlobal.UserInfo.userName && BkGlobal.currentGS == GS.CHOOSE_GAME) {
            var btnEditProfile = createBkButtonPlist(res_name.btn_user_info_edit,res_name.btn_user_info_edit,res_name.btn_user_info_edit,res_name.btn_user_info_edit_hover);
            //btnEditProfile.setTitleText("Sửa");
            btnEditProfile.getTitleRenderer().disableShadow();
            btnEditProfile.setTitleColor(cc.color(0,0,0));
            btnEditProfile.x = btnEditProfile.width / 2 + UP_ITEM_EDIT_WIDTH_VALUE + 105;
            btnEditProfile.y = lblFullName.y;
            this.viewSprite.addChild(btnEditProfile);

            var self = this;
            btnEditProfile.addTouchEventListener(
                function (sender, type) {
                    if (type == ccui.Widget.TOUCH_ENDED) {
                        self.initEditMode();
                    }
                },
                this);
        }

        this.addChild(this.viewSprite);
    },

    backToViewMode: function () {
        if (this.editSprite) this.removeChild(this.editSprite);
        if (this.viewSprite) this.viewSprite.setVisible(true);
    },

    initEditMode: function () {
        if (this.viewSprite) this.viewSprite.setVisible(false);
        if (this.editSprite) {
            this.removeChild(this.editSprite);
        }
        this.editSprite = new BkSprite();
        this.editSprite.setPosition(0, 0);

        var lblFullName = new BkLabel("Họ tên:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblFullName.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblFullName.x = lblFullName.getContentSize().width / 2;
        lblFullName.y = 200 - lblFullName.getContentSize().height / 2;
        this.editSprite.addChild(lblFullName);

        //var fullName = this.parentNode.userInfo.fullname;
        var fullName = Util.getFormatString(this.parentNode.getFullName());
        var txtFullName = createEditBox(cc.size(UP_ITEM_EDIT_WIDTH_VALUE, UP_ITEM_EDIT_HEIGHT_VALUE));
        txtFullName.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtFullName.setMaxLength(128);
        txtFullName.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        txtFullName.setPaddingLeft("5px");
        txtFullName.setHeight(UP_ITEM_EDIT_HEIGHT_VALUE +"px");
        if (fullName != BkConstString.STR_NO_INFO) {
            txtFullName.setString(fullName);
        }
        else
        {
            txtFullName.setPlaceHolder(fullName);
        }
        txtFullName.x = txtFullName.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        txtFullName.y = lblFullName.y + 10.5;
        this.editSprite.addChild(txtFullName);
        txtFullName.setTabStopToPrevious();
        txtFullName.setAutoFocus(true);

        var lblGender = new BkLabel("Giới tính:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblGender.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblGender.x = lblGender.getContentSize().width / 2;
        lblGender.y = lblFullName.y - lblFullName.getContentSize().height / 2 - lblGender.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.editSprite.addChild(lblGender);

        var rdMaleGenderData = new BkRadioButtonData(0, 0, "Nam");
        var radioMaleGender = new BkRadioButton(rdMaleGenderData.description, BkColor.WINDOW_CONTENT_TEXT_COLOR);
        radioMaleGender.setData(rdMaleGenderData);

        radioMaleGender.x = 87;
        radioMaleGender.y = lblGender.y - 7;
        this.editSprite.addChild(radioMaleGender,1);

        var rdFemaleGenderData = new BkRadioButtonData(1, 1, "Nữ");
        var radioFemaleGender = new BkRadioButton(rdFemaleGenderData.description, BkColor.WINDOW_CONTENT_TEXT_COLOR);
        radioFemaleGender.setData(rdFemaleGenderData);

        radioFemaleGender.x = 177;
        radioFemaleGender.y = lblGender.y - 7;
        this.editSprite.addChild(radioFemaleGender,1);

        this.rdGroupGender = new BkRadioButtonGroup();
        radioMaleGender.setGroup(this.rdGroupGender);
        radioFemaleGender.setGroup(this.rdGroupGender);
        if (this.parentNode.userInfo.gender == 1){
            this.rdGroupGender.setRadioSelected(radioFemaleGender);
        }else{
            this.rdGroupGender.setRadioSelected(radioMaleGender);
        }

        var lblBirthday = new BkLabel("Ngày sinh:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblBirthday.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblBirthday.x = lblBirthday.getContentSize().width / 2;
        lblBirthday.y = lblGender.y - lblGender.getContentSize().height / 2 - lblBirthday.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.editSprite.addChild(lblBirthday);

        var birthday = this.parentNode.getBirthday();
        var date = new Date(this.parentNode.userInfo.birthDate);
        var txtBirthday_Day = createEditBox(cc.size(40, UP_ITEM_EDIT_HEIGHT_VALUE));
        txtBirthday_Day.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtBirthday_Day.setMaxLength(2);
        txtBirthday_Day.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        txtBirthday_Day.setPaddingLeft("5px");
        txtBirthday_Day.setHeight(UP_ITEM_EDIT_HEIGHT_VALUE +"px");
        txtBirthday_Day.setNumericMode();
        if (birthday != BkConstString.STR_NO_INFO) {
            var day = date.getDate();

            var strday = "";
            if (day < 10) {
                strday = "0" + day;
            } else {
                strday = day.toString();
            }

            txtBirthday_Day.setString(strday);
        }
        txtBirthday_Day.setPlaceHolder("dd");
        txtBirthday_Day.x = txtBirthday_Day.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        txtBirthday_Day.y = lblBirthday.y + 10;
        this.editSprite.addChild(txtBirthday_Day, 0);

        var txtBirthday_Month = createEditBox(cc.size(40, UP_ITEM_EDIT_HEIGHT_VALUE));
        txtBirthday_Month.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtBirthday_Month.setMaxLength(2);
        txtBirthday_Month.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        txtBirthday_Month.setPaddingLeft("5px");
        txtBirthday_Month.setHeight(UP_ITEM_EDIT_HEIGHT_VALUE +"px");
        txtBirthday_Month.setNumericMode();
        if (birthday != BkConstString.STR_NO_INFO) {
            var monthNames_array = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            var month = monthNames_array[date.getMonth()];
            txtBirthday_Month.setString(month);
        }
        txtBirthday_Month.setPlaceHolder("mm");
        txtBirthday_Month.x = txtBirthday_Day.x + txtBirthday_Day.getContentSize().width / 2 + txtBirthday_Month.getContentSize().width / 2 + UP_ITEM_PADDING_Y;
        txtBirthday_Month.y = txtBirthday_Day.y;
        this.editSprite.addChild(txtBirthday_Month, 0);

        var txtBirthday_Year = createEditBox(cc.size(50, UP_ITEM_EDIT_HEIGHT_VALUE));
        txtBirthday_Year.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtBirthday_Year.setMaxLength(4);
        txtBirthday_Year.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        txtBirthday_Year.setPaddingLeft("5px");
        txtBirthday_Year.setHeight(UP_ITEM_EDIT_HEIGHT_VALUE +"px");
        txtBirthday_Year.setNumericMode();
        if (birthday != BkConstString.STR_NO_INFO) {
            var year = date.getFullYear();
            txtBirthday_Year.setString(year);
        }
        txtBirthday_Year.setPlaceHolder("yyyy");
        txtBirthday_Year.x = txtBirthday_Month.x + txtBirthday_Month.getContentSize().width / 2 + txtBirthday_Year.getContentSize().width / 2 + UP_ITEM_PADDING_Y;
        txtBirthday_Year.y = txtBirthday_Month.y;
        this.editSprite.addChild(txtBirthday_Year, 0);

        var lblAddress = new BkLabel("Địa chỉ:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblAddress.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblAddress.x = lblAddress.getContentSize().width / 2;
        lblAddress.y = lblBirthday.y - lblBirthday.getContentSize().height / 2 - lblAddress.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.editSprite.addChild(lblAddress);

        var address = this.parentNode.getAddress();
        var txtAddress = createEditBox(cc.size(UP_ITEM_EDIT_WIDTH_VALUE, UP_ITEM_EDIT_HEIGHT_VALUE));
        txtAddress.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtAddress.setMaxLength(128);
        txtAddress.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        txtAddress.setPaddingLeft("5px");
        txtAddress.setHeight(UP_ITEM_EDIT_HEIGHT_VALUE +"px");
        if (address != BkConstString.STR_NO_INFO) {
            txtAddress.setString(address);
        }
        else txtAddress.setPlaceHolder(address);
        txtAddress.x = txtAddress.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        txtAddress.y = lblAddress.y + 9;
        this.editSprite.addChild(txtAddress);

        var lblEmail = new BkLabel("Hộp thư:", "", USER_INFO_SPRITE_FONT_SIZE);
        lblEmail.setTextColor(BkColor.COLOR_HEADER_TEXT);
        lblEmail.x = lblEmail.getContentSize().width / 2;
        lblEmail.y = lblAddress.y - lblAddress.getContentSize().height / 2 - lblEmail.getContentSize().height / 2 - UP_ITEM_PADDING_Y;
        this.editSprite.addChild(lblEmail);

        var email = this.parentNode.getEmail();
        var txtEmail = createEditBox(cc.size(UP_ITEM_EDIT_WIDTH_VALUE, UP_ITEM_EDIT_HEIGHT_VALUE));
        txtEmail.setFontColor(BkColor.WINDOW_CONTENT_TEXT_COLOR);
        txtEmail.setMaxLength(128);
        txtEmail.setBorder(UP_ITEM_EDIT_CSS_BORDER);
        txtEmail.setPaddingLeft("5px");
        txtEmail.setHeight(UP_ITEM_EDIT_HEIGHT_VALUE +"px");
        txtEmail.setInputMode(cc.EDITBOX_INPUT_MODE_EMAILADDR);
        if (email != BkConstString.STR_NO_INFO) {
            txtEmail.setString(email);
        }
        else txtEmail.setPlaceHolder(email);
        txtEmail.x = txtEmail.getContentSize().width / 2 + UP_ITEM_PX_VALUE;
        txtEmail.y = lblEmail.y + 8;
        this.editSprite.addChild(txtEmail);
        txtEmail.setTabStopToNext();

        var btnUpdateProfile = createBkButtonPlist(res_name.btn_user_info_save,res_name.btn_user_info_save,res_name.btn_user_info_save,res_name.btn_user_info_save_hover);
        btnUpdateProfile.getTitleRenderer().disableShadow();
        btnUpdateProfile.setTitleColor(cc.color(0,0,0));
        btnUpdateProfile.setTitleFontSize(14);
        btnUpdateProfile.x = btnUpdateProfile.width / 2 + UP_ITEM_EDIT_WIDTH_VALUE + 105;
        btnUpdateProfile.y = lblFullName.y + 1;
        this.editSprite.addChild(btnUpdateProfile);

        var self = this;
        btnUpdateProfile.addTouchEventListener(
            function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    var _fullName = txtFullName.getString();
                    var _male = radioMaleGender.isSelected();
                    var _female = radioFemaleGender.isSelected();

                    var _gender = 2;
                    if (_male) _gender = 0;
                    else if (_female) _gender = 1;

                    var _day = txtBirthday_Day.getString();
                    var _month = txtBirthday_Month.getString();
                    var _year = txtBirthday_Year.getString();
                    var bDate = new Date(_month + "/" + _day + "/" + _year);
                    var currentScene = cc.director.getRunningScene();

                    if (!(_day.length == 0 && _month.length == 0 && _year.length == 0) && bDate.toString() == "Invalid Date") {
                        showToastMessage("Ngày sinh không hợp lệ!", currentScene.width / 2, currentScene.height / 2 - 70, 2, 250);
                        txtBirthday_Day.setFocus();
                        return;
                    }

                    var _address = txtAddress.getString();
                    var _email = txtEmail.getString();

                    // validate input data
                    if (_email.trim().length > 0 && !isEmailValidate(_email)) {
                        showToastMessage("Địa chỉ email không hợp lệ!", currentScene.width / 2, currentScene.height / 2 - 70, 2, 250);
                        return;
                    }

                    var _birthday = 0;
                    if(!isNaN(bDate.getTime())) {
                        _birthday = bDate.getTime();
                    }

                    self.updatedInfo = self.userInfo;
                    self.updatedInfo.fullname = _fullName;
                    self.updatedInfo.gender = _gender;
                    self.updatedInfo.email = _email;
                    self.updatedInfo.birthDate = _birthday;
                    self.updatedInfo.homeTown = _address;
                    var userStatus = self.userInfo.status ? self.userInfo.status: "";
                    // send update player details packet
                    var packet = new BkPacket();
                    packet.CreateUpdateUserInfoPacket(_fullName, _gender, _email, _birthday, _address, userStatus);
                    BkLogicManager.getLogic().setOnLoadComplete(self.parentNode);
                    BkConnectionManager.send(packet);
                    Util.showAnim();
                }
            },
            this);

        this.addChild(this.editSprite);
        txtFullName.setFocus();
    }
});