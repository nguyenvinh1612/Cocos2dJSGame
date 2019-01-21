/**
 * Created by bs on 19/10/2015.
 */
var BkTime = {
    /*
    * return current timestamp miliseconds
    * */
    GetCurrentTime:function(){
        var ThisTime = new Date();
        return ThisTime.getTime();
    },
    /*
    * convert time milisecond to date time 24h
    * params date: unit milisec
    * example: date = 1445222592*1000 -> return 19/10/2015-09:43
    * */
    convertToLocalTime24h:function(date){
        var receiveTime = new Date(date);
        var day = receiveTime.getDate();
        var strday = "";
        if(day < 10)
        {
            strday = "0" + day;
        }else
        {
            strday = day.toString();
        }
        var year = receiveTime.getFullYear();
        var monthNames_array = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var month = monthNames_array[receiveTime.getMonth()];

        var hour = receiveTime.getHours();
        var minute = receiveTime.getMinutes();
        var strHour = "";
        var strMinute ="";
        if(hour < 10)
        {
            strHour = "0" + hour;
        }
        else
        {
            strHour = hour.toString();
        }

        if(minute < 10)
        {
            strMinute = "0" + minute;
        }
        else
        {
            strMinute = minute.toString();
        }
        var strDate = (strday + "/" + month + "/" + year + " " + strHour +":" + strMinute);
        return strDate;
    },
    /*
    * convert seconds to timecode
    * param seconds: unit sec
    * example:  seconds = 24*60*40 + 13*60*60 + 48*60 -> return 1 ngày 13 giờ trước
    *           seconds = 13*60*60 + 48*60 -> return 13 giờ 48 phút trước
    * */
    secondsToTimecode:function(seconds){
        var minutes          = Math.floor(seconds/60);
        var remainingSec     = seconds % 60;
        var remainingMinutes = minutes % 60;
        var hours            = Math.floor(minutes/60);
        var floatSeconds     = Math.floor((remainingSec - Math.floor(remainingSec))*100);
        remainingSec         = Math.floor(remainingSec);

        var remainingDay 	= Math.floor(hours / 24);
        var remainingHour 	= hours % 24;
        var rtn="";
        if (remainingDay > 0){
            if (remainingHour > 0){
                rtn =remainingDay + " ngày " + remainingHour + " giờ trước";
            } else {
                rtn =remainingDay + " ngày trước";
            }
        } else if (remainingHour > 0){
            if (remainingMinutes > 0){
                rtn = remainingHour + " giờ " + remainingMinutes + " phút trước"
            } else {
                rtn = remainingHour + " giờ trước";
            }
        } else if (remainingMinutes > 0){
            rtn = remainingMinutes + " phút trước"
        } else {
            rtn = remainingSec + " giây trước";
        }
        return rtn;
    },

    parseToTimestamp: function(day, month, year){
        var newDate = month + "/" + day + "/" + year;
        return new Date(newDate).getTime();
    },
    /*
    * convert seconds to hh:mm:ss
    * seconds<3600 -> mm:ss
    * */
    formatSeconds:function(seconds)
    {
        var date = new Date(1970,0,1);
        date.setSeconds(seconds);
        var rtn = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        if (seconds < 3600){
            rtn = rtn.substring(3);
        }
        return rtn;
    }
};