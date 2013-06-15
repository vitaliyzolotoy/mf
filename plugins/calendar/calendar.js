function insertAgenda(events) {
    console.log();
    $(events.feed.entry).each(function(key, event){
        console.log(event.title.$t);
    });
}
$(function(){

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "http://www.google.com/calendar/feeds/developer-calendar@google.com/public/full?alt=json-in-script&callback=insertAgenda&orderby=starttime&max-results=15&singleevents=true&sortorder=ascending&futureevents=true";
    $("head").append(s);
    // alert('Calendar');
});


var plugin = new function () {

    this.init = function(){
        console.log('initiating...');
    },

        this.getName = function() {
            return 'calendar';
        },

        this.getData = function(ready) {
            var feeds = [];
            $(function(){
                $.get('http://feeds.feedburner.com/americhka/oBlg', function(data){
                    $(data).find('item').each(function(key, item){
                        feeds.push($(item).find('title:first').text());
                    });

                    ready({
                        text: feeds.join(', '),
                        data: {
                            title: 'Recent Feeds',
                            html: '<ul><li>'+feeds.join('</li><li>')+'</li></ul>'
                        }
                    });
                });
            });
        }
};

ApplicationContext.initPlugin(plugin);