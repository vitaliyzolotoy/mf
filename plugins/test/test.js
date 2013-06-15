
var plugin= new function () {
    var self = this;
    var _pluginSettingsStorage, _globalSettings;
    this.init = function(pluginSettingsStorage, globalSettings) {
        _pluginSettingsStorage = pluginSettingsStorage;
        _globalSettings = globalSettings;
    }
    this.getName = function() {
        return 'test';
    }
    this.getSettingsForm = function(pluginSettingsStorage, globalSettings) {
        //get settings object from storage
        var settings =  _pluginSettingsStorage.getSettings();
        return '<form></form>';
    }
    this.getData = function(onCompleted) {
        onCompleted({
            text: 'Привет, я тестовый слайд, и я умею говорить',
            data: {
                title: 'Алоха!',
                html: 'Я первый тестовый слайд'
            }
        });
    }
    this.submitInitialization = function(pluginSettingsStorage, globalSettings) {
        //get settings object from form
        var settings = {};
        _pluginSettingsStorage.setSettings(settings);
    }

}
ApplicationContext.initPlugin(plugin);