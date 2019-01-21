/**
 * Created by bs on 01/06/2017.
 */
var listDataVipBenefit = [];
VvVipBenefitDetailsWindow = VvWindow.extend({
    widSprite: 150,
    guidleSprite:null,
    sprite1:null,
    sprite2:null,
    sprite3:null,
    crPage:0,
    btnBack:null,
    btnNext:null,
    ctor: function (pr) {
        this._super("Danh sách quyền lợi VIP", cc.size(670, 390),pr);
        this.setVisibleOutBackgroundWindow(true);
        this.drawButton();

        this.doGetVipBenifitDetails();

    },
    doGetVipBenifitDetails:function () {
        if (listDataVipBenefit.length == 0){
            Util.showAnim();
            BkLogicManager.getLogic().setOnLoadComplete(this);
            var packet = new BkPacket();
            packet.CreatePacketWithTypeAndByteData(c.NETWORK_VIP_FUNCTION,VC.VIP_BENEFIT_DETAIL);
            BkConnectionManager.send(packet);
        } else {
            logMessage("listDataVipBenefit.length>0 ->drawUI");
            this.drawUI();
        }
    },
    onClickNext:function () {
        logMessage("onClickNext");
        if (this.crPage == 8){
            return;
        }
        this.crPage++;
        this.drawPage(this.crPage);
    },
    onClickBack:function () {
        logMessage("onClickBack");
        if (this.crPage == 0){
            return;
        }
        this.crPage--;
        this.drawPage(this.crPage);
    },
    drawButton:function () {
        this.btnNext = createBkButtonPlist(res_name.arrow_next,res_name.arrow_next
            ,res_name.arrow_next,res_name.arrow_next,"",0,0);
        this.btnNext.x = 620;
        this.btnNext.y = 265;
        this.addChildBody(this.btnNext);
        var self = this;
        this.btnNext.addClickEventListener(function () {
            self.onClickNext();
        });

        this.btnBack = createBkButtonPlist(res_name.arrow_previous,res_name.arrow_previous
            ,res_name.arrow_previous,res_name.arrow_previous,"",0,0);
        this.btnBack.x = 50;
        this.btnBack.y = this.btnNext.y;
        this.addChildBody(this.btnBack);
        this.btnBack.addClickEventListener(function () {
            self.onClickBack();
        });
    },
    drawUI:function () {
        var listLine = new BkSprite("#"+res_name.listvip_line);
        listLine.x = this.getWindowSize().width/2;
        listLine.y = 220;
        this.addChildBody(listLine);



        this.guidleSprite = this.creatSpriteWithData(-1,"Nạp quan","Vay quan","Chuyển quan","Mời bạn FB");
        this.guidleSprite.x = this.getWindowSize().width/2 - 1.5 * this.widSprite;
        this.guidleSprite.y = this.getWindowSize().height/2 + 80;
        this.addChildBody(this.guidleSprite);
        var curVipLv = BkGlobal.UserInfo.VipLevel;
        this.crPage = curVipLv;
        if (this.crPage>0){
            this.crPage-=1;
        }
        if (this.crPage>8){
            this.crPage = 8;
        }
        this.drawPage(this.crPage);
        this.drawLine();
    },
    drawLine:function () {
        var startXItem = this.getWindowSize().width/2 - this.widSprite;
        var startYItem = 40;
        var lineHeight = 170;
        var line = new cc.DrawNode();
        line.drawSegment(cc.p(startXItem,startYItem), cc.p(startXItem, startYItem +lineHeight),1, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        startXItem+= this.widSprite;
        line.drawSegment(cc.p(startXItem,startYItem), cc.p(startXItem, startYItem +lineHeight),1, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        startXItem+= this.widSprite;
        line.drawSegment(cc.p(startXItem,startYItem), cc.p(startXItem, startYItem +lineHeight),1, BkColor.GRID_ITEM_HOVER_COLOR_VV);
        this.addChildBody(line);
    },
    removeAllSprite:function () {
        if (this.sprite1!= null){
            this.sprite1.removeFromParent();
        }
        if (this.sprite2!= null){
            this.sprite2.removeFromParent();
        }
        if (this.sprite3!= null){
            this.sprite3.removeFromParent();
        }
    },
    getLineContentWithData:function (numberVip,line) {
        if (numberVip >10){
             return;
        }
        var data = listDataVipBenefit[numberVip];
        if (line == 1){
            if (data.paymentBonus<0){
                return "+0%"
            } else {
                return"+"+data.paymentBonus+"%";
            }
        }

        if (line == 2){
            if (data.maxBorrowMoney<0){
                return "0";
            } else {
                return formatNumber(data.maxBorrowMoney);
            }
        }

        if (line == 3){
            if (data.mnTransferPercent<0){
                return "Không";
            } else {
                return "Phí chuyển "+data.mnTransferPercent+"%";
            }
        }

        if (line ==4){
            return formatNumber(data.FBinviteBonus) +" / lời mời";
        }
    },
    showBtnArrow:function () {
        this.btnBack.visible = true;
        this.btnNext.visible = true;
        if (this.crPage == 0){
            this.btnBack.visible = false;
        }

        if (this.crPage == 8){
            this.btnNext.visible = false;
        }
    },
    drawPage:function (page) {
        this.showBtnArrow();
        this.removeAllSprite();
        var numberVip = page;
        this.sprite1 = this.creatSpriteWithData(numberVip,this.getLineContentWithData(numberVip,1)
            ,this.getLineContentWithData(numberVip,2)
            ,this.getLineContentWithData(numberVip,3)
            ,this.getLineContentWithData(numberVip,4));
        this.sprite1.x = this.guidleSprite.x + this.widSprite;
        this.sprite1.y = this.guidleSprite.y;
        this.addChildBody(this.sprite1);

        numberVip = page+1;
        this.sprite2 = this.creatSpriteWithData(numberVip,this.getLineContentWithData(numberVip,1)
            ,this.getLineContentWithData(numberVip,2)
            ,this.getLineContentWithData(numberVip,3)
            ,this.getLineContentWithData(numberVip,4));
        this.sprite2.x = this.guidleSprite.x + 2*this.widSprite;
        this.sprite2.y = this.guidleSprite.y;
        this.addChildBody(this.sprite2);

        numberVip = page+2;
        this.sprite3 = this.creatSpriteWithData(numberVip,this.getLineContentWithData(numberVip,1)
            ,this.getLineContentWithData(numberVip,2)
            ,this.getLineContentWithData(numberVip,3)
            ,this.getLineContentWithData(numberVip,4));
        this.sprite3.x = this.guidleSprite.x + 3*this.widSprite;
        this.sprite3.y = this.guidleSprite.y;
        this.addChildBody(this.sprite3);
    },
    creatSpriteWithData:function (vipLV,line1,line2,line3,line4) {
        var rtnSp = new BkSprite;
        var crLv = vipLV;
        var colorText = cc.color(0xfc,0xe5,0x78);
        if (vipLV<0){
            // is guilde
            crLv = 0;
            colorText = cc.color(0x94,0x4d,0x18);
        }

        var vipSp = VvAvatarImg.getVipFromID(crLv,true);
        vipSp.setScale(0.8);
        rtnSp.addChild(vipSp);
        if (vipLV<0){
            vipSp.visible = false;
            var lbGuidle = new BkLabel("Quyền lợi","",20);
            lbGuidle.setTextColor(colorText);
            lbGuidle.y= vipSp.y;
            rtnSp.addChild(lbGuidle);
        }
        var deltaY1 = 80;
        var deltaY2 = 40;
        var fontSize = 14;

        var lb1 = new BkLabel(line1,"",fontSize);
        lb1.setTextColor(colorText);
        lb1.y= vipSp.y -deltaY1;
        rtnSp.addChild(lb1);

        var lb2 = new BkLabel(line2,"",fontSize);
        lb2.setTextColor(colorText);
        lb2.y= lb1.y -deltaY2;
        rtnSp.addChild(lb2);

        var lb3 = new BkLabel(line3,"",fontSize);
        lb3.setTextColor(colorText);
        lb3.y= lb2.y -deltaY2;
        rtnSp.addChild(lb3);

        var lb4 = new BkLabel(line4,"",fontSize);
        lb4.setTextColor(colorText);
        lb4.y= lb3.y -deltaY2;
        rtnSp.addChild(lb4);

        if (vipLV == BkGlobal.UserInfo.VipLevel){
            var bgTop = new BkSprite("#"+res_name.listvip_viphientai_top);
            rtnSp.addChild(bgTop,-1);

            var bgBottom = new BkSprite("#"+res_name.listvip_viphientai_bottom);
            bgBottom.setScaleY(0.7);
            bgBottom.y = bgTop.y -138;//- bgTop.height/2 - bgBottom.height/2 + 37;
            rtnSp.addChild(bgBottom,-1);
        }



        return rtnSp;
    },

    //====================================================
    onLoadComplete: function (obj, tag) {
        logMessage("onLoadComplete "+tag);
        Util.removeAnim();
        BkLogicManager.getLogic().setOnLoadComplete(null);
        switch (tag) {
            case VC.VIP_BENEFIT_DETAIL:
                this.drawUI();
                break;
        }
    }
});