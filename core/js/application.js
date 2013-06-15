var ApplicationContext = new function () {
    var _ctx = this;
    //private variables
    var _plugins = [];
    var _settings = {};

    //private functions
    function validatePlugin(plugin) {
        var isValid = true;
        if (!isValid) {
            throw new Error('invalidate plugin');
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
        var $mainWrapper = $('.morningFriend');
        var $contentWrapper = $('.morning-friend__body');
        var $soundActionButton = $('.soundAction');
        var $settingActionButton = $('.settingAction');
        var $appTitle = $('.actions__title');
        //start application

        //---Alarm
        function setAppTitle(text) {
            $appTitle.text(text);
        }
        function executeAlarm() {
            setAppTitle('Будильник');

            function onCounterCompleted() {
                if (alarmSettings.playMusic) {
                    playMusic(alarmSettings.wakeupMusicSource, function () {
                        executePlugins();
                    });
                }
                else {
                    executePlugins();
                }
            }
            function displayTimeCounter(targetDate, onCompleted) {
                // var onCompletedInitial = onCompleted;
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
                    // console.log(music);
                    var currentHours = new Date().getHours();
                    var currentMinutes = new Date().getMinutes();
                    var $alarmContentWrapper = $('<div class="alarm" />');
                    var $alarmDateLabel = $('<div class="alarm__date">Воскресение, 16 июня</div>');
                    var $alarmTimeLabel = $('<div class="alarm__timer">'+currentHours+':'+currentMinutes+'</div>');
                    var $alarmButtonStop = $('<button class="button button_type_stop">Остановить</button>');
                    $alarmButtonStop.click(function(){
                        _ctx.UI.audioPlayer.stop();
                        onCompleted();
                        // console.log('clicked stop');
                    });
                    var $alarmButtonYet = $('<button class="button">Еще 5 минут :-)</button>');
                    $alarmButtonYet.click(function(){
                        _ctx.UI.audioPlayer.stop();
                        //onCompleted()
                        var t = new Date();
                        var wakeupTimeMore = new Date(t.setSeconds(t.getSeconds() + 5));

                        displayTimeCounter(wakeupTimeMore, onCounterCompleted);
                        // console.log('clicked more');
                    });
                    $alarmContentWrapper.append($alarmDateLabel).append($alarmTimeLabel).append($alarmButtonStop).append($alarmButtonYet);
                    $contentWrapper.html($alarmContentWrapper);
                    _ctx.UI.audioPlayer.play(music, onCompleted);
                }
            }

            var alarmSettings = _settings.alarmSettings;
            if (alarmSettings.wakeupTime) {
                if (alarmSettings.showTimeCounter) {
                    displayTimeCounter(alarmSettings.wakeupTime, onCounterCompleted);
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
            var $pluginsContainerWrapper = $('<div class="plugins-container"></div>');
            var $pluginsContainer = $('<div class="plugins-container__inner"></div>');
            $pluginsContainerWrapper.append($pluginsContainer);
            var cachedPluginContents = [];
            var $currentPluginContent;
            $contentWrapper.html($pluginsContainerWrapper);
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
                $mainWrapper.attr('id', pluginName);

                function executePluginContent(pluginData, readableName, text) {
                    var $pluginContentWrapper = $('<div class="plugin-content"></div>');
                    var $pluginContentTitle = $('<div class="plugin-content"></div>');
                    var $pluginContent = $('<div class="plugin-content"></div>');
                    $pluginContentWrapper.append($pluginContentTitle).append($pluginContent);
                    $pluginContentTitle.text(pluginData.title);
                    $pluginContent.html(pluginData.html);
                    cachedPluginContents.push({ title: pluginName, readableName: readableName, $content: $pluginContentWrapper, data: pluginData });
                    displayPluginContent($pluginContentWrapper, pluginData, readableName, text);
                }
                function displayPluginContent($pluginContent, data, readableName, text) {
                    setAppTitle(readableName);
                    function speech() {
                        // console.log('useVoice = ', useVoice, data, text);
                        if (text && useVoice) {
                            // console.log('before');
                            _ctx.utils.speech(text, function () {
                                // console.log('in voice');
                                onExecuted();
                            });
                        }
                        else {
                            window.setTimeout(function () {
                                onExecuted();
                            }, 2000);
                        }
                    }

                    if (!$currentPluginContent) {
                        $pluginsContainer.append($pluginContent);
                        $currentPluginContent = $pluginContent;
                        speech();
                    }
                    else {
                        $pluginsContainer.append($pluginContent.css('margin-left', '263px'));
                        $currentPluginContent.animate({ 'margin-left': '-263px' }, 500, function () {
                            $currentPluginContent.remove();
                        });
                        $pluginContent.animate({ 'margin-left': '0px' }, 500, function () {
                            $currentPluginContent = $pluginContent;
                            speech();
                        });
                    }
                }
                function getCachedContent(pluginName) {
                    for (var i = 0; i < cachedPluginContents.length; i++) {
                        if (pluginName == cachedPluginContents[i].title) {
                            return cachedPluginContents[i];
                        }
                    }
                }
                var pluginContent = getCachedContent(pluginName);
                if (pluginContent) {

                    displayPluginContent(pluginContent.$content, pluginContent.data, pluginContent.readableName, pluginContent.text);
                }
                else {
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
                        setAppTitle(plugin.getReadableName());
                        plugin.getData(function (data) {

                            executePluginContent(data.data, plugin.getReadableName(), data.text);
                        });
                    }
                    else {
                        onExecuted();
                    }
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
            TextToSpeach(text, onCompleted);
        }
    }
    this.UI = new function () {
        this.audioPlayer = new function () {
            var _currentPlayer = '';
            this.play = function (source, onCompleted) {
                $('<audio/>', {
                    src: source,
                    autoplay: 'autoplay'
                }).appendTo('body').bind('ended', function(){
                        onCompleted();
                    });
            };
            this.pause = function () {
                if (_currentPlayer) {
                    _currentPlayer.remove();
                }
            };
            this.stop = function () {
                $('audio').remove();
                if (_currentPlayer) {
                    _currentPlayer.remove();
                }
            }
        }
    }
}
