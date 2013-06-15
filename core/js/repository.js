function DataRepository()
{
    var commonSettingsKey = 'morningFriend_commonSettings';
    var pluginsSettingsKey = 'morningFriend_pluginsSettings';
    var alarmSettingsKey = 'morningFriend_alarmSettings';
    var pluginSettingsKey = 'morningFriend_pluginSettings';

    this.getCommonSettings = function () {
        var item = localStorage.getItem(commonSettingsKey);
        if (!item) {
            item = {
            language: 'ru',
                pluginDisplayTime: 3,
                recycle: false
            };
        }
        return item;
    }
    this.getPluginsSettings = function () {
        var item = localStorage.getItem(commonSettingsKey);
        if (!item) {
            item = { 
                useVoice: false,
                enabledPlugins: ['weather', 'calendar', 'horoscope', 'rss', 'test']
            };
        }
        return item;
    }
    this.getPluginSettings = function (pluginName) {
        var item = localStorage.getItem(pluginSettingsKey);
        for (var i = 0; i < item.length; i++) {
            if (item.pluginName == pluginName) {
                return item.data;
            }
        }
    }
    this.getAlarmSettings = function () {
        var item = localStorage.getItem(alarmSettingsKey);
        if (!item) {
            var t = new Date();
            var wakeupTime = new Date(t.setSeconds(t.getSeconds() + 3));
            item = { 
                enableAlarm: true,
                wakeupTime: wakeupTime,
                playMusic: true,
                wakeupMusicSource: "sun.mp3",
                showTimeCounter: true
            };
        }
        return item;
    }
    this.setCommonSettings = function (data) {
        localStorage.setItem(commonSettingsKey, data);
    }
    this.setPluginsSettings = function (data) {
        localStorage.setItem(commonSettingsKey, data);
    }
    this.setPluginSettings = function (pluginName, data) {
        var item = localStorage.getItem(pluginSettingsKey);
        if (item) {
            for (var i = 0; i < item.length; i++) {
                if (item.pluginName == pluginName) {
                    item.data = data;
                    return;
                }
            }
        }
        else {
            item = [];
        }
        item.push({ pluginName: pluginName, data: data });
        localStorage.setItem(pluginSettingsKey, item);
    }
    this.setAlarmSettings = function (data) {
        localStorage.setItem(alarmSettingsKey, data);
    }
}