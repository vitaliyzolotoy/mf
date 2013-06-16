var plugin = new function () {

    this.init = function () {
        console.log('horoscope ready');
    };

    this.getName = function () {
        return 'horoscope';
    };
    this.getReadableName = function () {
        return 'Гороскоп';
    };
    this.getData = function (ready) {
        $(function () {
            $.get('http://horoscope.ra-project.net/api/3/', function (data) {
                ready({
                    text: 'Гороскоп на сегодня. Близнецы' + $(data).find('text').text(),
                    data: {
                        title: '',
                        html: '<div class="plugin-icon"><i class="icon-big icon-magic"></i></div>'
                    }
                });

            });
        });
    }
};
ApplicationContext.initPlugin(plugin);