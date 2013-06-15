
var plugin = new function () {

    this.init = function(){
        console.log('weather init');
    };

    this.getName = function() {
       return 'weather';
    };

    this.getData = function(ready) {
        $.ajax($.extend({
            'url': 'http://api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-',
            'success' :
                function(){
                    ymaps.ready(function() {
                        console.log(ymaps.geolocation.latitude, ymaps.geolocation.longitude);
                    });
                },
            'dataType' : 'script'
        }));
//
//
//        ready({
//            text: ['Погода в Одессе', 'Солнечно'],
//            data: {
//                title: 'Гороскоп',
//                html: 'HTML'
//            }
//        });
    };
};

ApplicationContext.initPlugin(plugin);