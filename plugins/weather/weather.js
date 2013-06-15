
var plugin = new function () {

    this.init = function () {
        console.log('weather init');
    };

    this.getName = function () {
        return 'weather';
    };
    this.getReadableName = function () {
        return 'Погода';
    };
    this.getData = function (ready) {
        ready({
            text: ['Погода в Одессе', 'Солнечно'],
            data: {
                title: 'Гороскоп',
                html: 'HTML'
            }
        });
    };
};

ApplicationContext.initPlugin(plugin);