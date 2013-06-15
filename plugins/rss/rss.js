var plugin = new function () {

    this.init = function(){
        console.log('initiating...');
    },

    this.getName = function() {
        return 'rss';
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