var plugin = new function () {
    var self = this;
    var _pluginSettingsStorage, _globalSettings;
    this.init = function (pluginSettingsStorage, globalSettings) {
        _pluginSettingsStorage = pluginSettingsStorage;
        _globalSettings = globalSettings;
    }
    this.getName = function () {
        return 'test';
    }
    this.getReadableName = function () {
        return 'Первый нах';
    }
    this.getSettingsForm = function (pluginSettingsStorage, globalSettings) {
        //get settings object from storage
        var settings = _pluginSettingsStorage.getSettings();
        return '<form></form>';
    }
    this.getData = function (onCompleted) {
        onCompleted({
            text: 'Привет, я тестовый слайд, и я умею говорить',
            data: {
                title: 'Алоха!',
                html: '<div class="test-plugin1"></div>'
            }
        });
    }
    this.submitInitialization = function (pluginSettingsStorage, globalSettings) {
        //get settings object from form
        var settings = {};
        _pluginSettingsStorage.setSettings(settings);
    }
}
ApplicationContext.initPlugin(plugin);

var plugin2 = new function () {
    var self = this;
    var _pluginSettingsStorage, _globalSettings;
    this.init = function (pluginSettingsStorage, globalSettings) {
        _pluginSettingsStorage = pluginSettingsStorage;
        _globalSettings = globalSettings;
    }
    this.getName = function () {
        return 'test2';
    }
    this.getReadableName = function () {
        return 'Второй нах';
    }
    this.getSettingsForm = function (pluginSettingsStorage, globalSettings) {
        //get settings object from storage
        var settings = _pluginSettingsStorage.getSettings();
        return '<form></form>';
    }
    this.getData = function (onCompleted) {
        onCompleted({
            text: 'Привет, я тестовый слайд, и я умею говорить',
            data: {
                title: 'Алоха2!',
                html: '<div class="test-plugin2"></div>'
            }
        });
    }
    this.submitInitialization = function () {
        //get settings object from form
        var settings = {};
        _pluginSettingsStorage.setSettings(settings);
    }
}
ApplicationContext.initPlugin(plugin2);