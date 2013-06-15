var ApplicationContext = new function () {
    var _ctx = this;
    //private variables
    var _plugins = [];
    var _settings = {};

    //private functions
    function validatePlugin(plugin) {
        var isValid = true;
        if (!isValid) {
            throw 'invalidate plugin';
        }
    }

    //public 
    this.initPlugin = function (plugin) {
        validatePlugin(plugin);
        _plugins.push(plugin);
    }
    this.applicationStart = function () {
        //load settings, plugins
        var repository = new DataRepository();
        _settings.alarmSettings = repository.getAlarmSettings();
        _settings.pluginSettings = repository.getPluginsSettings();
        _settings.commonSettings = repository.getCommonSettings();

        //init ui handlers
        var $contentWrapper = $('.morning-friend-inner .content-wrapper');
        var $soundActionButton = $('.soundAction');
        var $settingActionButton = $('.settingAction');

        //start application

        //---Alarm
        function executeAlarm() {
            function displayTimeCounter(targetDate, onCompleted) {
                function displayTimeCounterStep() {
                    function displayTimeItem(item, $container) {
                        if (item < 10) {
                            item = '0' + item;
                        }
                        $container.text(item);
                    }
                    var currentMiliseconds = new Date().getTime();
                    var targetMiliseconds = targetDate.getTime();
                    if (targetMiliseconds >= currentMiliseconds) {
                        var diff = targetMiliseconds - currentMiliseconds;
                        var diffSeconds = diff / 1000;
                        var hours = Math.floor(diffSeconds / 3600);
                        var minutes = Math.floor((diffSeconds - (hours * 3600)) / 60);
                        var seconds = Math.floor(diffSeconds - ((hours * 3600) + (minutes * 60)));
                        displayTimeItem(hours, $hours);
                        displayTimeItem(minutes, $minutes);
                        displayTimeItem(seconds, $seconds);
                    }
                    else {
                        window.clearInterval(interval);
                        onCompleted();
                    }
                }
                var $timeCounterWrapper = $('<div class="time-counter-wrapper" />');
                var $hours = $('<span class="time-counter-hours" />');
                var $minutes = $('<span class="time-counter-minutes" />');
                var $seconds = $('<span class="time-counter-seconds" />');
                $timeCounterWrapper.append($hours).append(':').append($minutes).append(':').append($seconds);
                $contentWrapper.html($timeCounterWrapper);
                var interval = window.setInterval(function () {
                    displayTimeCounterStep();
                }, 1000);
                displayTimeCounterStep();
            }
            function playMusic(music, onCompleted) {
                if (music) {
                    _ctx.UI.audioPlayer.play(music, $contentWrapper, onCompleted);
                }
            }

            var alarmSettings = _settings.alarmSettings;
            if (alarmSettings.wakeupTime) {
                if (alarmSettings.showTimeCounter) {
                    displayTimeCounter(alarmSettings.wakeupTime, function () {
                        if (alarmSettings.playMusic) {
                            playMusic(alarmSettings.wakeupMusicSource, function () {
                                executePlugins();
                            });
                        }
                        else {
                            executePlugins();
                        }
                    });
                }
                else {
                    executePlugins();
                }
            }
            else {
                executePlugins();
            }
        }
        //---Plugins
        function executePlugins() {
            //private variables 
            var currentIndex = 0;
            var pluginData = _settings.pluginSettings;
            //private functions 
            function executePluginByIndex(index) {
                if (index < enabled.length) {
                    executePlugin(enabled[index], _settings.pluginSettings.useVoice, function () {
                        executePluginByIndex(index + 1);
                    });
                }
                else if (_settings.commonSettings.recycle) {
                    executePluginByIndex(0);
                }
                else {
                    endPluginsExecuting();
                }
            }
            function executePlugin(pluginName, useVoice, onExecuted) {
                function displayPluginContent(pluginData) {
                    var $pluginContentWrapper = $('<div class="plugin-content"></div>');
                    var $pluginContentTitle = $('<div class="plugin-content"></div>');
                    var $pluginContent = $('<div class="plugin-content"></div>');
                    $pluginContentWrapper.append($pluginContentTitle).append($pluginContent);
                    if (pluginData.background) {
                        $pluginContentWrapper.css(pluginData.background);
                    }
                    $pluginContentTitle.text(pluginData.title);
                    $pluginContent.text(pluginData.content);
                    $contentWrapper.html($pluginContentWrapper);
                }
                var plugin = _ctx.utils.findPluginByName(pluginName);
                if (plugin) {
                    //init plugins storage
                    var pluginDataStorage = {
                        getSettings: function () {
                            return repository.getPluginSettings(pluginName)
                        },
                        setSettings: function (json) {
                            return repository.setPluginSettings(pluginName, json);
                        }
                    };
                    //init global settings
                    var globalSettings = {
                        language: _settings.commonSettings.language
                    };
                    //init plugin
                    plugin.init(pluginDataStorage, globalSettings);
                    //get plugin data object
                    plugin.getData(function (data) {
                        if (useVoice) {
                            displayPluginContent(data.data);
                            _ctx.utils.speech(data.text, function () {
                                onExecuted();
                            });
                        }
                        else {
                            displayPluginContent(data.data);
                            window.setTimeout(function () {
                                onExecuted();
                            }, _settings.commonSettings.pluginDisplayTime * 1000);
                        }
                    });
                }
                else {
                    onExecuted();
                }
            }

            //go
            var enabled = _settings.pluginSettings.enabledPlugins;
            if (enabled.length) {
                executePluginByIndex(0);
            }
        }
        function endPluginsExecuting() {
            $contentWrapper.html('end');
        }

        if (_settings.alarmSettings.enableAlarm) {
            executeAlarm();
        }
        else {
            executePlugins();
        }
    }
    this.utils = {
        findPluginByName: function (name) {
            for (var i = 0; i < _plugins.length; i++) {
                var plugin = _plugins[i];
                if (plugin.getName() == name) {
                    return plugin;
                }
            }
        },
        speech: function (text, onCompleted) {
            onCompleted();
        }
    }
    this.UI = new function () {
        this.audioPlayer = new function () {
            this.play = function (source, $wrapper, onCompleted) {
                // var $playerWrapper = $('<div class="player-wrapper" />');
                // var $player = $('<div id="player" class="cp-jplayer"></div>');
                // var $playerContainer = $('.player-container-template').clone().attr('id', 'playerContainer');
                // $playerWrapper.append($player).append($playerContainer);
                // $wrapper.html($playerWrapper);
                // var player = new CirclePlayer("#player",
	               //  {
	               //      mp3: source
	               //  }, {
	               //      supplied: "mp3",
	               //      cssSelectorAncestor: "#playerContainer",
	               //      swfPath: "Content",
	               //      wmode: "window",
	               //      keyEnabled: true,
	               //      ready: function () {
	               //          $("#playerContainer").jPlayer("play");
	               //      },
                //         ended: function() {  
                //              onCompleted();
                //         },
	               //  });

                onCompleted();

            }
        }
    }
}

var PluginSettngsStorageInterface = {
    getSettings: function () {
        return {};
        //returns the json string from the storage
    },
    setSettings: function (data) {
        //json will be saved in the storage
    }
}

var PluginDataObjectInterface = {
    title: 'title',
    content: 'content',
    background: 'background'
}

function DataRepository() {
    var commonSettingsKey = 'morningFriend_commonSettings';
    var pluginsSettingsKey = 'morningFriend_pluginsSettings';
    var alarmSettingsKey = 'morningFriend_alarmSettings';
    var pluginSettingsKey = 'morningFriend_pluginSettings';

    this.getCommonSettings = function () {
        var item = localStorage.getItem(commonSettingsKey);
        if (!item) {
            item = {
            language: 'ru',
                pluginDisplayTime: 10,
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
                enabledPlugins: ['test']
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
            var wakeupTime = new Date(t.setSeconds(t.getSeconds() + 10));
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