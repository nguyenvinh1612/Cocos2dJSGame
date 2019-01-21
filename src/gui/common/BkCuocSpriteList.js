/**
 * Created by vinhnq on 12/28/2016.
 */
NUM_OF_CUOC_ROWS = 3;
BkCuocSpriteList = BkSprite.extend({
    listOfCuocSprite:[],
    currentPageNumCuoc:1,
    ctor: function()
    {
        this._super();
        this.lblChonKeo = new BkLabel("Chưa chọn kèo", "Arial", 16);
        this.lblChonKeo.setTextColor(cc.color(255,255,0));
        this.lblChonKeo.x = 730;
        this.lblChonKeo.y = 470;
        this.addChild(this.lblChonKeo);

        this.tfCuoc = createEditBox(cc.size(220, 30), res_name.edit_text);
        this.tfCuoc.x = 693;
        this.tfCuoc.y = 170;
        this.tfCuoc.setAutoFocus(true);
        this.tfCuoc.setMaxLength(10);
        this.tfCuoc.setNumericMode();
        this.tfCuoc.setPlaceholderFontColor(BkColor.TEXT_INPUT_PLACEHOLDER_COLOR);
        this.tfCuoc.setFontColor(BkColor.TEXT_INPUT_COLOR);
        this.tfCuoc.setDelegate(this);
        this.addChild(this.tfCuoc);
        this.tfCuoc.setTabStop();

        this.lblTyLeChung  = new BkLabel("Tỷ lệ chung:","Arial", 16);
        this.lblTyLeChung.x = this.tfCuoc.x - 68;
        this.lblTyLeChung.y = this.tfCuoc.y - 30;
        this.addChild(this.lblTyLeChung);

        this.tyLeChungValue  = new BkLabel("0.00","Arial", 16);
        this.tyLeChungValue.x = this.lblTyLeChung.x + this.tyLeChungValue.getContentSize().width + 35;
        this.tyLeChungValue.y = this.lblTyLeChung.y;
        this.addChild(this.tyLeChungValue);

        this.lblTienThang  = new BkLabel("Tiền thắng:","Arial", 16);
        this.lblTienThang.setTextColor(cc.color(255,255,0));
        this.lblTienThang.x = this.tfCuoc.x - 70;
        this.lblTienThang.y = this.tfCuoc.y - 55;
        this.addChild(this.lblTienThang);

        this.tienThangValue  = new BkLabel("0$","Arial", 16);
        this.tienThangValue.setTextColor(cc.color(255,255,0));
        this.tienThangValue.x = 700;
        this.tienThangValue.y = this.lblTienThang.y;
        this.addChild(this.tienThangValue);

        if(this.btnBet == undefined || this.btnBet == null)
        {
            this.btnBet = createBkButtonPlist(res_name.btn_big_normal, res_name.btn_big_press, res_name.btn_big_normal,
                res_name.btn_big_hover,"Đặt cược");
            this.btnBet.setTitleFontSize(BTN_INGAME_SIZE);
            this.btnBet.x = 695;
            this.btnBet.y = 78;
            this.addChild(this.btnBet);
            var self = this;
            this.btnBet.addClickEventListener(function()
            {
                self.onDatCuoc();
            });
        }
        this.btnPreviousCuoc = createBkButtonPlist(res_name.btn_back_small, res_name.btn_back_small, res_name.btn_back_small,
            res_name.btn_back_small,"");
        this.btnPreviousCuoc.addClickEventListener(function()
        {
            if (self.currentPageNumCuoc > 1) {
                self.currentPageNumCuoc--;
            } else
            {
                self.currentPageNumCuoc = Math.round(self.listOfCuocSprite.length / NUM_OF_CUOC_ROWS);
                if (self.currentPageNumCuoc == 1)
                {
                    self.currentPageNumCuoc++;
                }
            }
            self.updateListOfcuocUI();
        });
        this.btnPreviousCuoc.x = 570;
        this.btnPreviousCuoc.y = 327;
        this.btnPreviousCuoc.setVisibleButton(false);
        this.addChild(this.btnPreviousCuoc);


        this.btnNextCuoc = createBkButtonPlist(res_name.btn_next_small, res_name.btn_next_small, res_name.btn_next_small,
            res_name.btn_next_small,"");
        this.btnNextCuoc.addClickEventListener(function()
        {
            self.currentPageNumCuoc++;
            self.updateListOfcuocUI();
        });

        this.btnNextCuoc.x = 890;
        this.btnNextCuoc.y = this.btnPreviousCuoc.y;
        this.btnNextCuoc.setVisibleButton(false);
        this.addChild(this.btnNextCuoc);
    },
    editBoxTextChanged: function (sender, text)
    {
        this.updateTienThangValue();
    },
    onDatCuoc:function()
    {
        var betMoney = Number(this.tfCuoc.getString());
        if(this.listOfCuocSprite.length < 1)
        {
            showToastMessage("Bạn chưa chọn kèo.",777,210);
            return;
        }
        if(betMoney < 500)
        {
            showToastMessage("Bạn phải cược ít nhất 500$.",777,215);
            return;
        }
        var self = this;
        var str = "Bạn có chắc chắn muốn đặt cược không ?";
        self.hideEditText();
        showPopupConfirmWith(str,"Đặt cược",function()
        {
            var bkCommonLogic = BkLogicManager.getLogic();
            bkCommonLogic.setOnLoadComplete(self);
            bkCommonLogic.sendCuocFootball(BET_FOOTBALL.PLACE_CUOC_EVENT,betMoney,self.listOfCuocSprite);
            Util.showAnim();
            self.showEditText();
        },function(){self.showEditText()},function(){self.showEditText()},self);
    },
    showEditText:function()
    {
        this.tfCuoc.visible = true;
    },
    hideEditText:function()
    {
        this.tfCuoc.visible = false;
    },
    onLoadComplete:function(o, packet)
    {
        BkLogicManager.getLogic().setOnLoadComplete(null);
        Util.removeAnim();
        var betFootballType = packet.Buffer.readByte();
        switch (betFootballType)
        {
            case BET_FOOTBALL.PLACE_CUOC_EVENT:
                this.getBettingResult(packet);
                break;
            default:
                break;
        }
    },
    getBettingResult:function(packet)
    {
        var betResult = packet.Buffer.readByte();
        var strMsg = "Bạn đã đặt cược thành công";
        if(betResult == BET_FOOTBALL.PLACE_BET_SUCCESS)
        {
            var betMoney = packet.Buffer.readInt();
            BkGlobal.UserInfo.setMoney(BkGlobal.UserInfo.getMoney() - betMoney);
            BkLogicManager.getLogic().processUpdateProfileUI();
            this.updateUIAfterDatCuocSuccess();
            //Todo vinhnq
        }else if(betResult == BET_FOOTBALL.PLACE_BET_WRONG)
        {
            strMsg = packet.Buffer.readString();
        }
        showToastMessage(strMsg,777,215);
    },
    resumeHoverEvent:function()
    {
        this.btnBet.setVisibleButton(true);
    },
    updateUIAfterDatCuocSuccess:function()
    {
        if (this.listOfCuocSprite!= null && this.listOfCuocSprite.length >0)
        {
            for (var i =0; i < this.listOfCuocSprite.length; i++)
            {
                var cuoci = this.listOfCuocSprite[i];
                cuoci.removeSelf();
            }
            while(this.listOfCuocSprite.length > 0)
            {
                this.listOfCuocSprite.splice(0,this.listOfCuocSprite.length);
            }
            this.listOfCuocSprite = [];
        }
        this.updateListOfcuocUI();
        this.updateLblKeo();
        this.updateTyLeChungValue();
        this.updateTienThangValue();
        this.handleclickCallback.removeAllKeo();
    },
    onClickedKeo:function(keo)
    {
        if(keo.isSelected)
        {
            var betSprite = new BkBetItemSprite(keo.data);
            betSprite.setHandleClickCallBack(this);
            betSprite.visible = false;
            this.listOfCuocSprite.push(betSprite);
            this.addChild(betSprite);
        }
        else
        {
          this.removeBetById(keo.data.id);
        }
        this.removeAllBetWithMatchId(keo.data.matchId,keo.data.id);
        this.updateListOfcuocUI();
        this.updateLblKeo();
        this.updateTyLeChungValue();
        this.updateTienThangValue();
    },
    updateListOfcuocUI:function()
    {
        this.setInvisibleAllCuoc();
        if(this.btnPreviousCuoc != undefined && this.btnPreviousCuoc != null)
        {
            this.btnPreviousCuoc.setVisibleButton(this.listOfCuocSprite.length > NUM_OF_CUOC_ROWS);
            this.btnNextCuoc.setVisibleButton(this.listOfCuocSprite.length > NUM_OF_CUOC_ROWS);
        }
        var count = 0;
        var startX = 730;
        var startY = 415;
        var cuocSpritei;
        var offset = 2;
        var start = (this.currentPageNumCuoc - 1)*NUM_OF_CUOC_ROWS;
        if(start >= this.listOfCuocSprite.length)
        {
            start = 0;
            this.currentPageNumCuoc = 1;
        }
        var end = start + NUM_OF_CUOC_ROWS;
        if(end > this.listOfCuocSprite.length )
        {
            end = this.listOfCuocSprite.length;
        }
        for(var i = start; i < end; i ++)
        {
            cuocSpritei = this.listOfCuocSprite[i];
            cuocSpritei.visible = true;
            cuocSpritei.x = startX;
            cuocSpritei.y = startY - count*(offset + 80) ;
            count++;
        }
    },
    setInvisibleAllCuoc:function()
    {
        for(var i = 0; i < this.listOfCuocSprite.length; i++)
        {
            this.listOfCuocSprite[i].visible = false;
        }
    },
    updateLblKeo:function()
    {
        if(this.listOfCuocSprite.length > 0 )
        {
            if(this.listOfCuocSprite.length == 1)
            {
                this.lblChonKeo.setString("Cược đơn");
            }else
            {
                this.lblChonKeo.setString("Cược xiên (" + this.listOfCuocSprite.length +")");
            }
        }else
        {
            this.lblChonKeo.setString("Chưa chọn kèo");
        }
    },
    onRemoveCuoc:function(bet)
    {
        this.removeBetById(bet.data.id);
        this.updateListOfcuocUI();
        this.updateLblKeo();
        this.updateTyLeChungValue();
        this.updateTienThangValue();
        this.handleclickCallback.onRemoveCuoc(bet);

    },
    setHandleKeoClickCallback:function(cb)
    {
        this.handleclickCallback = cb;
    },
    removeBetById:function(id)
    {
        for(var i = 0; i < this.listOfCuocSprite.length; i++)
        {
            var beti = this.listOfCuocSprite[i];
            if(beti.data.id == id)
            {
                this.listOfCuocSprite.splice(i,1);
                beti.removeSelf();
            }
        }
    },
    updateTyLeChungValue:function()
    {
        var strTlc = (Math.floor(this.getTyLeChungValue() * 100) / 100).toFixed(2);
        this.tyLeChungValue.setString(strTlc);
        this.tyLeChungValue.x = this.lblTyLeChung.x + this.lblTyLeChung.getContentSize().width/2 + this.tyLeChungValue.getContentSize().width/2 + 5;
    },
    updateTienThangValue:function()
    {
        var tt = Math.floor(this.getTyLeChungValue()*Number(this.tfCuoc.getString()));
        this.tienThangValue.setString(convertStringToMoneyFormat(tt,true) + "$");
        this.tienThangValue.x = this.lblTienThang.x + this.lblTienThang.getContentSize().width/2 + this.tienThangValue.getContentSize().width/2 + 5;
    },
    removeAllBetWithMatchId:function(matchid,keoId)
    {
        for(var i = 0; i < this.listOfCuocSprite.length; i++)
        {
            var beti = this.listOfCuocSprite[i];
            if(beti.data.matchId == matchid && beti.data.id != keoId )
            {
                this.listOfCuocSprite.splice(i,1);
                beti.removeSelf();
            }
        }
    },
    getTyLeChungValue:function()
    {
        var val = 1;
        for(var i = 0; i < this.listOfCuocSprite.length; i++ )
        {
            var beti = this.listOfCuocSprite[i];
            val = val*beti.data.winningRate;
        }
        if(val != 1)
        {
            return val;
        }
        return "0.00";
    },
});