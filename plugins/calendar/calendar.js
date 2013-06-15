// Global function needed to proccess loaded events
function morningFriendInsertAgenda(events) {
    calendar.processData(events);
}

var calendar = new function () {

    var self = this;

    this.init = function(){
        moment.lang('ru');

        // load calendar events with including script
        $(function(){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'http://www.google.com/calendar/feeds/developer-calendar@google.com/public/full?alt=json-in-script&callback=morningFriendInsertAgenda&orderby=starttime&max-results=15&singleevents=true&sortorder=ascending&futureevents=true';
            $('head').append(script);
        });
    },

    this.getName = function() {
        return 'calendar';
    },
    this.getReadableName = function () {
        return 'Календарь';
    },
    this.processData = function(response){
        var events = [];
        $(response.feed.entry).each(function(key, event) {
            events.push(event.title.$t + ' ' + moment().calendar())
        });

        self.ready({
            text: ['Календарь', 'Прогон презентации Морнинг Френд', 'Завтра о 12:20' ,'Еще одно событие', 'В понедельнык в 7:35'],
            data: {
                title: 'Recent Feeds',
                html: '<ul><li>'+events.join('</li><li>')+'</li></ul>'
            }
        });
    },

    this.getData = function(ready) {
        self.ready = ready;
    }
};

ApplicationContext.initPlugin(calendar);