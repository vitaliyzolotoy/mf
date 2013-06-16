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
//        $(function () {
//            $.get('http://horoscope.ra-project.net/api/3/', function (data) {
//                console.log(data);
//                var text = $(data).find('text').text();
                var text = 'Сегодня Вам необходимо сосредоточиться на работе, даже если для этого придется полностью отказаться от любых развлечений. Но не спешите расстраиваться — как только дело будет закончено, Вы сможете повеселиться на славу!';
                ready({
                    text: ['Гороскоп на сегодня. Близнецы.', text],
                    data: {
                        title: '',
                        html: '<div class="plugin-icon"><i class="icon-big icon-magic"></i></div><div class="horoscope">Близнецы – '+text+'</div>'
                    }
                });
//
//            });
//        });
    }
};
ApplicationContext.initPlugin(plugin);