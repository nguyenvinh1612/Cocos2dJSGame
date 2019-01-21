/**
 * Created by bs on 29/09/2015.
 */
//BkBuffer = Uint8Array.extend({
//var BUFFER_SIZE = 65000
BkBuffer = cc.Class.extend({
    Buf:null,
    position:null,
    posRead:null,
    ctor:function () {
        //this.Buf = new Int8Array(size);
        this.Buf = [];
        this.position = 0;
        this.posRead = 0;
    },

    writeByte:function(mByte){
        this.Buf[this.position] = mByte;
        this.position +=1;
    },
    writeShort:function(mShort){
        var bytes = ShortToByteArray(mShort);
        //for ( var index = 0; index < bytes.length; index ++ ) {
        for ( var index = bytes.length -1; index >=0; index -- ) {
            //cc.log(" "+bytes[index]);
            this.writeByte(bytes[index]);
        }
    },
    writeInt:function(mInt){
        var bytes = IntToByteArray(mInt);
        //for ( var index = 0; index < bytes.length; index ++ ) {
        for ( var index = bytes.length -1; index >=0; index -- ) {
            this.writeByte(bytes[index]);
        }
    },
    writeLong:function(mLong){
        var bytes = longToByteArray(mLong);
        //for ( var index = 0; index < bytes.length; index ++ ) {
        for ( var index = bytes.length -1; index >=0; index -- ) {
            this.writeByte(bytes[index]);
        }
    },
    writeString:function(mStr){
        var bytes = StringToByteArray(mStr);
        this.writeShort(bytes.length);
        for ( var index = 0; index < bytes.length; index ++ ) {
        //for ( var index = bytes.length -1; index >=0; index -- ) {
            this.writeByte(bytes[index]);
        }
        return (bytes.length +2);
    },
    readByte:function(){
        var rtnByte = this.Buf[this.posRead];//this.Buf.getInt8(this.posRead);
        this.posRead +=1;
        return rtnByte;
    },
    readShort:function(){
        //var bytes = this.Buf.subarray(this.posRead,this.posRead + 2);
        var bytes = this.getSubArrayFromPosReadWithLength(2);
        this.posRead +=2;
        //return byteArrayToLong(bytes);
        return shortFromBytes(bytes);
    },
    readInt:function(){
        //var bytes = this.Buf.subarray(this.posRead,this.posRead + 4);
        var bytes = this.getSubArrayFromPosReadWithLength(4);
        this.posRead +=4;
        //return byteArrayToLong(bytes);
        return intFromBytes(bytes);
    },
    readLong:function(){
        //var bytes = this.Buf.subarray(this.posRead,this.posRead + 8);
        var bytes = this.getSubArrayFromPosReadWithLength(8);
        this.posRead +=8;
        //return byteArrayToLong(bytes);
        return longFromBytes(bytes);
    },
    readString:function(){
        var lengthStr = this.readShort();
        //var rtn = this.Buf.subarray(this.posRead,this.posRead + lengthStr);
        var rtn = this.getSubArrayFromPosReadWithLength(lengthStr);
        this.posRead += lengthStr;
        //return byteArrayToString(rtn);
        return intArrayToString(rtn);
    },
    ReadString:function(){
        return this.readString();
        //var lengthStr = this.readShort();
        ////var rtn = this.Buf.subarray(this.posRead,this.posRead + lengthStr);
        //var rtn = this.getSubArrayFromPosReadWithLength(lengthStr);
        //this.posRead += lengthStr;
        //return byteArrayToString(rtn);
    },
    toString:function(){
        var rtn = "["+this.getLengthBuffer()+"] |";
        for ( var i = 0; i < this.Buf.length; i++) {
            rtn += this.Buf[i] + "|";
        }
        return rtn;
    },
    getSubArrayFromPosReadWithLength:function(length){
        var rtnArr = [];
        for (var i=0;i<length;i++){
            rtnArr.push(this.Buf[i+ this.posRead])
        }
        return rtnArr;
    },
    getLengthBuffer:function(){
        return this.Buf.length;
    },
    isReadable:function(){
        if (this.posRead < this.getLengthBuffer()){
            return true;
        }
        return false;
    }
});

longToByteArray = function(/*long*/long) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = long & 0xff;
        byteArray [ index ] = byte;
        long = (long - byte) / 256 ;
    }

    return byteArray;
};

byteArrayToLong = function(/*byte[]*/byteArray) {
    var value = 0;
    //for ( var i = byteArray.length - 1; i >= 0; i--) {
    for ( var i = 0; i < byteArray.length; i++) {

        var iByte = byteArray[i];
        var bit1;
        if (i!= 0){
            iByte = new Uint8Array([iByte])[0];
        } else {
            bit1 = (iByte & 0x80)>>7;
            iByte = iByte & 0x7f;
        }
        logMessage("iByte "+ iByte+ " bit1 "+bit1);
        //value = (value * 256) + byteArray[i];
        value = (value * 256) + iByte;
        if (bit1 == 1){
            value = -value;
        }
    }

    return value;
};

ShortToByteArray = function(/*int*/mShort) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = mShort & 0xff;
        byteArray [ index ] = byte;
        mShort = (mShort - byte) / 256 ;
    }

    return byteArray;
};



IntToByteArray = function(/*int*/mInt) {
    // we want to represent the input as a 8-bytes array
    var byteArray = [0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
        var byte = mInt & 0xff;
        byteArray [ index ] = byte;
        mInt = (mInt - byte) / 256 ;
    }

    return byteArray;
};

//byteArrayToInt = function(/*byte[]*/byteArray) {
//    var value = 0;
//    for ( var i = byteArray.length - 1; i >= 0; i--) {
//        value = (value * 256) + byteArray[i];
//    }
//
//    return value;
//};

StringToByteArray = function (/*String*/mStr){
    //var bytes = [];
    //bytesfor (var i = 0; i < mStr.length; ++i) {
    //    bytes.push(mStr.charCodeAt(i));
    //}
    //return bytes;
    return toUTF8Array(mStr);
};

toUTF8Array = function(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                0x80 | ((charcode>>12) & 0x3f),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
};

byteArrayToString = function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
        c = array[i++];
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
};

intArrayToString = function (intArray) {
    //covert intArray to uintArray
    var uintArray = new Uint8Array(intArray.length);
    for (var i=0;i<intArray.length;i++){
        var temp = new Uint8Array([intArray[i]])[0];
        //uintArray.push(temp);
        uintArray[i] = temp;
    }
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
};

longFromBytes = function ( bytesArray/* length bytes = 8*/ ){
    /*read unsign long*/
    var temp1 = new Int32Array([0])[0];
    temp1 = ((bytesArray[0] & 0xff)<<24)|
        ((bytesArray[1] & 0xff)<<16)|
        ((bytesArray[2] & 0xff)<<8)|
        (bytesArray[3] & 0xff);
    temp1 = new Uint32Array([temp1])[0];

    var temp2 = new Int32Array([0])[0];
    temp2 = ((bytesArray[4] & 0xff)<<24)|
        ((bytesArray[5] & 0xff)<<16)|
        ((bytesArray[6] & 0xff)<<8)|
        (bytesArray[7] & 0xff);
    temp2 = new Uint32Array([temp2])[0];

    var num = Number(0);
    num = Number(temp1* (0xffffffff +1)) + Number(temp2);
    return num;
};

intFromBytes = function ( bytesArray/* length bytes = 4*/ ){
    var value = new Int32Array([0])[0];
    value = ((bytesArray[0] & 0xff)<<24)|
            ((bytesArray[1] & 0xff)<<16)|
            ((bytesArray[2] & 0xff)<< 8)|
            (bytesArray[3] & 0xff);
    return value;
};

shortFromBytes = function ( bytesArray/* length bytes = 2*/ ){
    var value = new Int16Array([0])[0];
    value = ((bytesArray[0] & 0xff)<< 8)|
        (bytesArray[1] & 0xff);
    return value;
};