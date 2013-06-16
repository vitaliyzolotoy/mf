var plugin = new function () {

    this.init = function () {
        console.log('initiating...');
    };

    this.getName = function () {
        return 'rss';
    };
    this.getReadableName = function () {
        return 'Новости';
    };
    this.getData = function (ready) {
        var feeds = ['Новости науки и техники'];
        $(function () {
            $.get('http://news.rambler.ru/rss/scitech/', function (data) {
                $(data).find('item').each(function (key, item) {
                    feeds.push($(item).find('title:first').text());
                });

                feeds = feeds.slice(0, 4);
                ready({
                    text: feeds,
                    data: {
                        title: '',
                        html: '<div class="list"><div class="list__title">' + feeds.join('</div><div class="list__item">') + '</li></div>'
                    }
                });
            });
        });
    }
};

ApplicationContext.initPlugin(plugin);