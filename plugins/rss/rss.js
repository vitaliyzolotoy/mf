$(function(){
    $.get('http://feeds.feedburner.com/americhka/oBlg', function(data){
        $(data).find('item').each(function(key, item){
            console.log($(item).find('title:first').text());
        });
    });
});
//

var plugin= new function () {
    var self = this;
    var _pluginSettingsStorage, _globalSettings;
    this.init = function(pluginSettingsStorage, globalSettings) {
        _pluginSettingsStorage = pluginSettingsStorage;
        _globalSettings = globalSettings;
    }
    this.getName = function() {
        return 'rss';
    }
    this.getSettingsForm = function(pluginSettingsStorage, globalSettings) {
        //get settings object from storage
        var settings =  _pluginSettingsStorage.getSettings();
        return '<form></form>';
    }
    this.getData = function(onCompleted) {
        var text = '<ul>';
        $(function(){
            $.get('http://feeds.feedburner.com/americhka/oBlg', function(data){
                $(data).find('item').each(function(key, item){
                    text += '<li>'+$(item).find('title:first').text()+'</li>';
                });
                text += '</ul>';

                    onCompleted({
                    text: text,
                    data: {
                        title: 'Feeds',
                        html: text
                    }
                });
            });
        });
    }
    this.submitInitialization = function(pluginSettingsStorage, globalSettings) {
        //get settings object from form
        var settings = {};
        _pluginSettingsStorage.setSettings(settings);
    }

}
ApplicationContext.initPlugin(plugin);