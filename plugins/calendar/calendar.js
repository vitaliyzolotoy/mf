// Global function needed to proccess loaded events
function morningFriendInsertAgenda(events) {
    calendar.processData(events);
}

var calendar = new function () {

    var self = this;

    this.init = function(){
        // moment.lang('ru');

        // // load calendar events with including script
        // $(function(){
        //     var script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     script.src = 'http://www.google.com/calendar/feeds/developer-calendar@google.com/public/full?alt=json-in-script&callback=morningFriendInsertAgenda&orderby=starttime&max-results=15&singleevents=true&sortorder=ascending&futureevents=true';
        //     $('head').append(script);
        // });
    },

    this.getName = function() {
        return 'calendar';
    },
    this.getReadableName = function () {
        return 'Календарь';
    },
    this.processData = function(response){
        // var events = [];
        // $(response.feed.entry).each(function(key, event) {
        //     events.push(event.title.$t + ' ' + moment().calendar())
        // });

    },

    this.getData = function(ready) {
        ready({
            text: ['Ближайшие события', 'Прогон презентации Морнинг Френд', 'Сегодня в 12:20', 'Оформить документы по коммандировке', '13:15', 'Встреча с колегами', 'Сегодня в 14:26', 'Начало презентаций', '17:25', 'Ужин с друзьями', '20:32'],
            data: {
                title: 'Календарь',
                html: '<div class="list"><div class="list__item">Прогон презентации Морнинг Френд - Сегодня о 12:20</div><div class="list__item">Оформить документы по коммандировке – 13:15</div><div class="list__item">Встреча с колегами – Сегодня в 14:26</div><div class="list__item">Начало презентаций – 17:25</div><div class="list__item">Ужин с друзьями – 20:32</div></div>'
            }
        });

    }
};

ApplicationContext.initPlugin(calendar);