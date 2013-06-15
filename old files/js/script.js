$(function() {

    function getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getPositionHTML5, getPositionIP);
        } else {
            getPositionIP();
        }    
    }
    
    function getPositionHTML5(position) {
        getWeather(position.coords.latitude,position.coords.longitude);
    }

    function getPositionIP() {
        $.ajax($.extend({
            'url': 'http://api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-',
            'success' : 
                function(){
                    ymaps.ready(function() {
                        getWeather(ymaps.geolocation.latitude, ymaps.geolocation.longitude);
                    });      
                },
            'dataType' : 'script'
        }));
    }

    function getWeather(latitude, longitude) {
        var forecast = 'https://api.forecast.io/forecast/64c1bf92287684b567c7c2dc9d489808/'+latitude+','+longitude+'?callback=?';
        
        $.getJSON(forecast, function(data){
            var tempNow = tempConverter(data.currently.temperature)+' °C',
                iconNow = data.currently.icon,
                timeNow = timeConverter(data.currently.time);
            if (timeNow.hour > 20 || timeNow.hour < 7) $('.now').addClass('night');
            $('.now .temperature').append(tempNow);
            $('.now .icon').addClass(iconNow);

            textTranslate('Сейчас '+tempConverter(data.currently.temperature)+' градуса тепла, но ' + data.hourly.summary, 'weather');
        });
    }

    function tempConverter(tempF){
        var tempC = Math.ceil((tempF-32)*5/9);
        return (tempC > 0) ? '+'+tempC : tempC;
    }

    function timeConverter(timestamp){
        var a = new Date(timestamp*1000),
            time = {
                'date': a.getDate(),
                'month': a.getMonth(), 
                'year': a.getFullYear(), 
                'hour': a.getHours(), 
                'min': a.getMinutes(), 
                'sec': a.getSeconds()
            }
         return time;
    }

    function textTranslate(text, item){
        var translate = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20130607T142527Z.cf86b12ec895a7b8.dfebb107ab4ed0b6bb45333fce71bb199b5476ab&lang=en-ru&text='+text;
        
        $.getJSON(translate, function(data){
            textToSpeech('Погода...' + data.text[0], item);
        });
    }

    function textToSpeech(text, item){    
        var textEn = encodeURIComponent((text+'').replace(/\+/g, '%20')),
            get = 'EID=2&LID=21&VID=1&TXT='+textEn+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=3726736&API=2314851&SESSION=',
            checksum = md5('2'+'21'+'1'+text+'mp3'+''+''+'3726736'+'2314851'+''+'6234a0145fd449cea3c9dafca979ce66'),
            url = 'http://www.vocalware.com/tts/gen.php?'+get+'&CS='+checksum+'&callback=?';
        playAudio(url, item);
    }

    function playAudio(url, item){
        var newAudio = $('<audio/>', {
            'src': url,
            'autoplay': 'autoplay',
            'controls': 'controls'
        }).appendTo('body');
        
        if (item == 'clock') {
            $('audio').bind('ended', function(){
                $('.clock').remove();
                this.remove();
                getPosition();
            });
        }    

        if (item == 'weather') {
            $('audio').bind('ended', function(){
                $('.weather').remove();
                this.remove();
                getHoroscope(3, 'horoscope');
            });
        }
        if (item == 'horoscope') {
            $('audio').bind('ended', function(){
                $('.horoscope').remove();
                this.remove();
            });
        }
        
    }

    function getHoroscope(sign, item){
        var horoscope = 'proxy.php?url=http://horoscope.ra-project.net/api/'+sign+'/';

        $.getJSON(horoscope, function(data){
            var text = 'Близнецы...' +  /<text>(.*?)<\/text>/gi.exec(data.contents)[1],
                textIn = 'Близнецы' + '<br/><br/>' + /<text>(.*?)<\/text>/gi.exec(data.contents)[1];
            $('.horoscope').html(textIn);
            textToSpeech(text, item);
        });
    }

    function setTimer(time) {
        $('.clock').countdown(time + new Date().valueOf(), function(event) {
            if(event.type != 'seconds') return;
            var timeLeft = [
              event.lasting.hours + event.lasting.days * 24,
              event.lasting.minutes,
              event.lasting.seconds
            ];
            for(var i = 0; i < timeLeft.length; ++i) {
                timeLeft[i] = (timeLeft[i] < 10 ? '0' : '') + timeLeft[i].toString();
            }
            if (timeLeft[0] == '00' && timeLeft[1] == '00' && timeLeft[2] == '00') {
                playAudio('sun.mp3', 'clock');
            }

            $(this).html(timeLeft.join(':'));
        });
    }

    setTimer(1 * 10 * 1000);
});