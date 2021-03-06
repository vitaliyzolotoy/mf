﻿function TextToSpeach(text, onCompleted)
{
    var getAudioUrl = function(text){
        var textEn = encodeURIComponent((text+'').replace(/\+/g, '%20')),
            get = 'EID=2&LID=21&VID=1&TXT='+textEn+'&EXT=mp3&FX_TYPE=&FX_LEVEL=&ACC=3741404&API=2316305&SESSION=',
            checksum = md5('2'+'21'+'1'+text+'mp3'+''+''+'3741404'+'2316305'+''+'5291110377fe17fe591cfa20a922cb9c'),
            url = 'http://www.vocalware.com/tts/gen.php?'+get+'&CS='+checksum+'&callback=?';
        return url;
    };

    var playAudio = function (url, call) {
        ApplicationContext.UI.audioPlayer.play(url, function () {
            setTimeout(function () {
                call();
            }, 10);
        });
    };

    if (text instanceof Array)
    {
        if (text.length > 1)
        {
            playAudio(getAudioUrl(text[0]), function(){
                text = text.splice(1, text.length);
                TextToSpeach(text, onCompleted);
            });
        }
        else
        {
            playAudio(getAudioUrl(text[0]), onCompleted);
        }
    }
    else
    {
        playAudio(getAudioUrl(text), onCompleted);
    }
}