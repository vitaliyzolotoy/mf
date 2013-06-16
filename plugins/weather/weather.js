
var plugin = new function () {

    var self = this;

    this.init = function(){
        console.log('weather init');
    };

    this.getName = function () {
        return 'weather';
    };

    this.getReadableName = function () {
        return 'Погода';
    };

    this.getData = function(ready) {

        self.getLocation(function(latitude, longitude){
            self.getWeather(latitude, longitude, function(weather, icon){
                weather = self.transalate(weather);
                ready({
                    text: weather,
                    data: {
                        title: '',
                        html: '<div class="plugin-icon"><i class="i-weather '+icon+'"></i></div><div class="weather">'+weather+'</div'
                    }
                });
            });
        });
    };

    this.getLocation = function(ready) {
        $.ajax({
            'url': 'http://api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-',
            'success' :
                function(){
                    ymaps.ready(function() {
                        ready(ymaps.geolocation.latitude, ymaps.geolocation.longitude);
                    });
                },
            'dataType' : 'script'
        });
    };

    this.getWeather = function(latitude, longitude, ready) {
        var url = 'https://api.forecast.io/forecast/64c1bf92287684b567c7c2dc9d489808/'+latitude+','+longitude+'?callback=?';
        $.getJSON(url, function(data) {
            ready('Сейчас ' + self.toCelsium(data.currently.temperature) + ' градуса тепла. ' + data.hourly.summary, data.currently.icon);
        });
    };

    this.toCelsium = function(f){
        var c = Math.ceil((f-32)*5/9);
        return (c > 0) ? '+'+c : c;
    };

    this.transalate = function(text){
        var translate = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20130607T142527Z.cf86b12ec895a7b8.dfebb107ab4ed0b6bb45333fce71bb199b5476ab&lang=en-ru&text='+text;
        var translated = '';
        $.ajax({
            type: 'GET',
            url: translate,
            dataType: 'json',
            success: function(data) { translated = data.text[0]; },
            data: {},
            async: false
        });
        return translated;
    };
};

ApplicationContext.initPlugin(plugin);