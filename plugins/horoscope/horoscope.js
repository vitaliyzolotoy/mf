var plugin = new function () {

    this.init = function(){
        console.log('horoscope ready');
    },

    this.getName = function() {
        return 'horoscope';
    },

    this.getData = function(ready) {
        $(function(){
            $.get('http://horoscope.ra-project.net/api/3/', function(data){
                ready({
                    text: 'Гороскоп на сегодня. Близнецы' + $(data).find('text').text(),
                    data: {
                        title: 'Гороскоп',
                        html: 'HTML'
                    }
                });

            });
        });
    }
};
ApplicationContext.initPlugin(plugin);