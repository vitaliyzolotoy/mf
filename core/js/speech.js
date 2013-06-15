function TextToSpeach(text, onCompleted)
{
    var getAudioUrl = function(text){
        var textEn = encodeURIComponent((text+'').replace(/\+/g, '%20')),
            get = 'EID=2&LID=21&VID=1&TXT='+textEn+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=3726736&API=2314851&SESSION=',
            checksum = md5('2'+'21'+'1'+text+'mp3'+''+''+'3726736'+'2314851'+''+'6234a0145fd449cea3c9dafca979ce66'),
            url = 'http://www.vocalware.com/tts/gen.php?'+get+'&CS='+checksum+'&callback=?';
        return url;
    };

    var playAudio = function(url, call)
    {
        $('<audio/>', {
            src: url,
            autoplay: 'autoplay'
        }).appendTo('body').bind('ended', function(){
            call();
        });
    };

    playAudio(getAudioUrl(text), onCompleted);
}