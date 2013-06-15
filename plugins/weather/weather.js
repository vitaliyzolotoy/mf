var plugin = new function () {

    this.init = function(){
        console.log('weather init');
    },

        this.getName = function() {
            return 'weather';
        },

        this.getData = function(ready) {
            ready({
                text: ['Погода на сегодня', 'Одесса', 'На деребасовской хорошая погода'],
                data: {
                    title: 'Гороскоп',
                    html: 'HTML'
                }
            });
        }
};
ApplicationContext.initPlugin(plugin);