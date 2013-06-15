$(function(){
    $.get('http://feeds.feedburner.com/americhka/oBlg', function(data){
        $(data).find('item').each(function(key, item){
            console.log($(item).find('title:first').text());
            //console.log($(item));
        });
    });
});
