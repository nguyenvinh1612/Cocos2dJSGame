/**
 * Created by vinhnq on 12/28/2016.
 */
BkKeoSpriteList = BkSprite.extend({
    listKeoItem:null,
    listOfKeoSprite:[],
    numOfChapBongRow:1,
    numOfTSBRow:1,
    currentChapBongRow:1,
ctor: function (data) {
        this._super();
        this.listOfKeoSprite = [];
        this.listKeoItem = data;
        this.initListKeoSprite();
    },
    goNextCB:function()
    {
        this.currentChapBongRow++;
        if(this.currentChapBongRow > this.numOfChapBongRow)
        {
            this.currentChapBongRow = 1;
        }
        this.updateChapBongUI();
    },
    goBackCB:function()
    {
        this.currentChapBongRow--;
        if(this.currentChapBongRow < 1)
        {
            this.currentChapBongRow = this.numOfChapBongRow;
        }
        this.updateChapBongUI();
    },
    goNextTSB:function()
    {
        this.currentTSBRow++;
        if(this.currentTSBRow > this.numOfTSBRow - 2)
        {
            this.currentTSBRow = 1;
        }
        this.updateTSBUI();
    },
    goBackTSB:function()
    {
        this.currentTSBRow--;
        if(this.currentTSBRow < 1)
        {
            this.currentTSBRow = this.numOfTSBRow - 2;
        }
        this.updateTSBUI();
    },
    updateChapBongUI:function()
    {
        for(var i = 0; i < this.listCB.length; i++)
        {
                var keoi = this.getKeoById(this.listCB[i].id);
                if(keoi == null)
                {
                    return;
                }
                keoi.visible = false;
                keoi.setHandleClickCallBack(null);
                keoi.setEnableEventListener(false);
                if(i < this.listCB.length/2)
                {
                    if(i == this.currentChapBongRow - 1)
                    {
                        keoi.visible = true;
                        keoi.setHandleClickCallBack(this);
                        keoi.setEnableEventListener(true);
                    }
                }
                if(i >= this.listCB.length/2)
                {
                    if(i == this.listCB.length - this.currentChapBongRow)
                    {
                        keoi.visible = true;
                        keoi.setHandleClickCallBack(this);
                        keoi.setEnableEventListener(true);
                    }
                }

        }
    },
    updateTSBUI:function()
    {
        var keoi;
        for(var i = 0; i < this.listTSB.length; i++)
        {
            keoi = this.getKeoById(this.listTSB[i].id);
            if( keoi.y <= 450 - 6*29)
            {
                keoi.visible = false;
                keoi.setHandleClickCallBack(null);
                keoi.setEnableEventListener(false);
            }
        }
        for(var i = 0; i < this.listTSB.length; i++)
        {
            keoi = this.getKeoById(this.listTSB[i].id);
            if(i < this.listTSB.length/2)
            {
                if(i == this.currentTSBRow + 1)
                {
                    keoi.visible = true;
                    keoi.setHandleClickCallBack(this);
                    keoi.setEnableEventListener(true);
                }
            }
            if(i >= this.listTSB.length/2)
            {
                if(i == this.numOfTSBRow +  this.currentTSBRow + 1)
                {
                    keoi.visible = true;
                    keoi.setHandleClickCallBack(this);
                    keoi.setEnableEventListener(true);
                }
            }

        }
    },
    initListKeoSprite: function ()
    {
        this.sortListKeobyId();
        Util.removeArrList(this.listTSB);
        Util.removeArrList(this.listCB);
        this.listTSB = [];
        var listTYSB = [];
        this.listCB = [];
        var keoi;
        var startX = 145;
        var startY = 450;
        var OffsetY = 29;
        var keoWidth = 150;
        var totalRowOffset = 0;
        var MAX_ROW_OFFSET = 15;
        var lblkqh1 = new BkLabel("Kết quả hiệp 1","Arial",16);
        lblkqh1.x  = 120;
        lblkqh1.y = 474;
        this.addChild(lblkqh1);

        var lblkqct = new BkLabel("Kết quả cả trận","Arial",16);
        lblkqct.x = lblkqh1.x + (lblkqct.getContentSize().width/2 - lblkqh1.getContentSize().width/2 );
        lblkqct.y = lblkqh1.y - OffsetY - 28;
        this.addChild(lblkqct);

        for(var i = 0; i < this.listKeoItem.length; i++ )
        {
            if( i <= 5) // KQH1, KQCT
            {
                keoi = new BkKeoItemSprite(this.listKeoItem[i]);
                keoi.setHandleClickCallBack(this);
                keoi.visible = true;
                keoi.setEnableEventListener(true);
                this.listOfKeoSprite.push(keoi);
                this.addChild(keoi);
                keoi.x = this.getKeoPosByIndex(i).x;
                keoi.y = this.getKeoPosByIndex(i).y;
            }
            var keoid = this.listKeoItem[i].id;
            if(keoid >= 6 && keoid <= 19)
            {
                this.listTSB.push(this.listKeoItem[i]);
            }
            if(keoid >= 20 && keoid <= 60)
            {
                listTYSB.push(this.listKeoItem[i]);
            }
            if(keoid >= 61 && keoid <= 91)
            {
                this.listCB .push(this.listKeoItem[i]);
            }
        }
        // Tổng số bóng
        var lbltsb = new BkLabel("Tổng số bóng","Arial",16);
        lbltsb.x = lblkqh1.x + (lbltsb.getContentSize().width/2 - lblkqh1.getContentSize().width/2 );
        lbltsb.y = lblkqct.y - OffsetY - 28;
        this.addChild(lbltsb);
        if(this.listTSB.length > 0)
        {
            this.numOfTSBRow = this.listTSB.length/2;
            for(var i = 0; i < this.listTSB.length; i++)
            {
                keoi = new BkKeoItemSprite(this.listTSB[i]);
                this.listOfKeoSprite.push(keoi);
                this.addChild(keoi);
                if(i < this.numOfTSBRow)
                {
                    keoi.x = startX;
                    keoi.y = startY  - (4 + i)*OffsetY ;
                }else
                {
                    keoi.x = startX + keoWidth;
                    keoi.y = startY  - (i - this.numOfTSBRow + 4)*OffsetY ;
                }
                if(this.numOfTSBRow > 3 && this.listKeoItem.length > 29)
                {
                    var maxY = startY - 6*OffsetY;
                    if(keoi.y < maxY)
                    {
                        keoi.y = maxY;
                        keoi.visible = false;
                        keoi.setHandleClickCallBack(null);
                        keoi.setEnableEventListener(false);
                    }else
                    {
                        keoi.visible = true;
                        keoi.setHandleClickCallBack(this);
                        keoi.setEnableEventListener(true);
                    }
                }else
                {
                    keoi.visible = true;
                    keoi.setHandleClickCallBack(this);
                    keoi.setEnableEventListener(true);
                }
            }
            if(this.numOfTSBRow > 3)
            {
                this.initTSBNavigateBtn();
            }
        }
        // Ty so bong
        var lbltisb = new BkLabel("Tỷ số bóng","Arial",16);
        lbltisb.x = lblkqh1.x + (lbltisb.getContentSize().width/2 - lblkqh1.getContentSize().width/2 );
        if(this.listTSB.length/2 < 4)
        {
            totalRowOffset = 5 +  this.listTSB.length/2;
            lbltisb.y = lbltsb.y - (this.listTSB.length/2)*OffsetY - 30;
        }else
        {
            totalRowOffset = 8;
            lbltisb.y = lbltsb.y - 3*OffsetY - 30;
        }
        this.addChild(lbltisb);
        if(listTYSB.length > 0)
        {
            for(var i = 0; i < listTYSB.length; i++)
            {
                var keoi = new BkKeoItemSprite(listTYSB[i]);
                if(i <= 5)
                {
                    keoi.x = startX;
                    keoi.y = startY -(i+totalRowOffset)*OffsetY;
                }
                if(i>5 && i <= 8 )
                {
                    keoi.x = startX + keoWidth ;
                    keoi.y = startY -(i+totalRowOffset - 6)*OffsetY;
                }
                if(i > 8 && i <=14)
                {
                    keoi.x = startX + 2*keoWidth ;
                    keoi.y = startY -(i+ totalRowOffset - 9)*OffsetY;
                }
                keoi.setHandleClickCallBack(this);
                this.listOfKeoSprite.push(keoi);
                this.addChild(keoi);
            }
        }
        // chap Bong
        if(listTYSB.length > 0)
        {
            totalRowOffset = totalRowOffset + (listTYSB.length - 3)/2;
        }
        this.lblChapBong = new BkLabel("Chấp bóng","Arial",16);
        this.lblChapBong.x = lblkqh1.x  +(this.lblChapBong.getContentSize().width/2 - lblkqh1.getContentSize().width/2 );
        this.lblChapBong.y = startY - totalRowOffset*OffsetY - 5;
        this.addChild(this.lblChapBong);
        this.numOfChapBongRow = this.listCB.length/2;
        var rowOffset = totalRowOffset + 1;
        var maxCBY = startY - MAX_ROW_OFFSET*OffsetY;
        for(var i = 0; i < this.listCB.length/2; i++)
        {
            var keoi = new BkKeoItemSprite(this.listCB[i]);
            keoi.x = startX ;
            this.listOfKeoSprite.push(keoi);
            this.addChild(keoi);
            keoi.y = startY - (rowOffset)*OffsetY;
            rowOffset = rowOffset + 1;
            if(keoi.y >= maxCBY || i == 0)
            {
                keoi.visible = true;
                keoi.setHandleClickCallBack(this);
                keoi.setEnableEventListener(true);
            }else
            {
                keoi.y = maxCBY;
                keoi.visible = false;
                keoi.setHandleClickCallBack(null);
                keoi.setEnableEventListener(false);
                this.initCBNavigateBtn();

            }
        }
        rowOffset = totalRowOffset + 1;
        for(var j = this.listCB.length-1; j >= this.listCB.length/2; j--)
        {
            var keoj = new BkKeoItemSprite(this.listCB[j]);
            keoj.x = startX + keoWidth ;
            this.listOfKeoSprite.push(keoj);
            this.addChild(keoj);
            keoj.y = startY - (rowOffset)*OffsetY;
            rowOffset = rowOffset + 1;
            if (keoj.y >= maxCBY || j == this.listCB.length-1)
            {
                keoj.visible = true;
                keoj.setHandleClickCallBack(this);
                keoj.setEnableEventListener(true);
            }else
            {
                keoj.y = maxCBY;
                keoj.visible = false;
                keoj.setHandleClickCallBack(null);
                keoj.setEnableEventListener(false);
            }

        }
    },
    initTSBNavigateBtn:function()
    {
        this.currentTSBRow = 1;
        this.btnBackTSB = createBkButtonPlist(res_name.btn_previous_normal, res_name.btn_previous_press, res_name.btn_previous_disable,
            res_name.btn_previous_hover,"");
        this.btnBackTSB.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnBackTSB.x =  55;
        this.btnBackTSB.y = 276;
        this.addChild(this.btnBackTSB);
        this.btnBackTSB.addClickEventListener(function()
        {
            self.goBackTSB();
        });

        this.btnNextTSB = createBkButtonPlist(res_name.btn_next_normal, res_name.btn_next_press, res_name.btn_next_disable,
            res_name.btn_next_hover,"");
        this.btnNextTSB.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnNextTSB.x =  385;
        this.btnNextTSB.y = this.btnBackTSB.y;
        this.addChild(this.btnNextTSB);
        var self = this;
        this.btnNextTSB.addClickEventListener(function()
        {
            self.goNextTSB();
        });
    },
    initCBNavigateBtn:function()
    {
        this.currentChapBongRow = 1;
        this.btnBackCB = createBkButtonPlist(res_name.btn_previous_normal, res_name.btn_previous_press, res_name.btn_previous_disable,
            res_name.btn_previous_hover,"");
        this.btnBackCB.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnBackCB.x =  55;
        this.btnBackCB.y = 16;
        this.addChild(this.btnBackCB);
        this.btnBackCB.addClickEventListener(function()
        {
            self.goBackCB();
        });

        this.btnNextCB = createBkButtonPlist(res_name.btn_next_normal, res_name.btn_next_press, res_name.btn_next_disable,
            res_name.btn_next_hover,"");
        this.btnNextCB.setTitleFontSize(BTN_INGAME_SIZE);
        this.btnNextCB.x =  385;
        this.btnNextCB.y = this.btnBackCB.y;
        this.addChild(this.btnNextCB);
        var self = this;
        this.btnNextCB.addClickEventListener(function()
        {
            self.goNextCB();
        });
    },
    sortListKeobyId:function()
    {

        for(var i = 0; i < this.listKeoItem.length - 1; i++)
        {
            for(var j = i + 1; j < this.listKeoItem.length; j++)
            {
                var tmpKeo;
                if(this.listKeoItem[i].id > this.listKeoItem[j].id)
                {
                    tmpKeo = this.listKeoItem[i];
                    this.listKeoItem[i] = this.listKeoItem[j];
                    this.listKeoItem[j] = tmpKeo;
                }
            }
        }
    },
    getKeoById:function(id)
    {
        for(var i = 0; i < this.listOfKeoSprite.length; i++)
        {
           var keoi = this.listOfKeoSprite[i];
            if(keoi.data.id == id)
            {
                return keoi;
            }
        }
        return null;
    },
    getKeoPosByIndex:function(index)
    {
        var startX = 145;
        var startY = 450;
        var OffsetY = 29;
        var keoWidth = 150;
        switch(index)
        {
            // KetQuaHiep1
            case 0:
                return  cc.p(startX,startY);
            case 1:
                return cc.p(startX + keoWidth ,startY);
            case 2:
                return cc.p(startX + 2*keoWidth ,startY);
            //Ket Qua ca Tran
            case 3:
                return cc.p(startX ,startY - 2*OffsetY);
            case 4:
                return cc.p(startX +keoWidth ,startY - 2*OffsetY);
            case 5:
                return cc.p(startX + 2*keoWidth ,startY - 2*OffsetY);
            default:
                logMessage(" cant not get pos of keo id:" + id);
                return cc.p(startX + keoWidth ,startY - 15*OffsetY );
        }
    },
    setHandleKeoClickCallback:function(cb)
    {
        this.handleclickCallback = cb;
    },
    onClickedKeo:function(keo)
    {
        logMessage("click keo:" + keo.data.id);
        var keoid = keo.data.id;
        var matchId = keo.data.matchId;
        this.handleclickCallback.onClickedKeo(keo);
        this.unselectAllKeoWithMatchId(matchId,keoid);
    },
    onRemoveKeo:function(bet)
    {
        for(var i = 0; i < this.listOfKeoSprite.length; i++)
        {
            var keoi = this.listOfKeoSprite[i];
            if(keoi.data.id == bet.data.id)
            {
                keoi.select(false);
            }
        }
    },
    removeAllKeo:function()
    {
        for(var i = 0; i < this.listOfKeoSprite.length; i++)
        {
            var keoi = this.listOfKeoSprite[i];
             keoi.select(false);
        }
    },
    onRemoveCuoc:function(cuoc)
    {
        for(var i = 0; i < this.listOfKeoSprite.length; i++)
        {
            var keoi = this.listOfKeoSprite[i];
            if(keoi.data.id == cuoc.data.id)
            {
                keoi.select(false);
            }
        }
    },
    updateSelectedKeo:function(cuocList)
    {
        for(var i = 0; i < cuocList.length; i++)
        {
            var cuoci = cuocList[i];
            for(var j = 0; j < this.listOfKeoSprite.length; j++)
            {
                var keoj = this.listOfKeoSprite[j];
                if(keoj.data.id == cuoci.data.id && keoj.data.matchId == cuoci.data.matchId)
                {
                    keoj.select(true);
                }
            }
        }
    },
    unselectAllKeoWithMatchId:function(matchid,keoId)
    {
        for(var i = 0; i < this.listOfKeoSprite.length; i++)
        {
            var keoi = this.listOfKeoSprite[i];
            if(keoi.data.matchId == matchid && keoi.data.id != keoId)
            {
                keoi.select(false);
            }
        }
    },
});