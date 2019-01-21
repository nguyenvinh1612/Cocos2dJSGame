/**
 * Created by bs on 27/06/2017.
 */
BkRichTextUtil = {
    creatElementText:function (tag,color,text,fontSize,fontName,opacity) {
        if (!fontName){
            fontName = "";
        }
        if (!fontSize){
            fontSize = 14;
        }
        if (!opacity){
            opacity = 255;
        }
        return new ccui.RichElementText(tag, color, opacity, text, fontName, fontSize);
    },
    createLineBreakElement:function (tag) {
        return this.creatElementText(tag,cc.color.WHITE,"\n");
    }
};