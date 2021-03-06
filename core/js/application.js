﻿var ApplicationContext = new function () {
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

        $('.actions__left .icon:first').click(function () {
            var cssClass = $(this).attr('class');
            if ($(this).hasClass('icon-pause')) {
                _ctx.UI.audioPlayer.pause();
                $(this).removeClass('icon-pause').addClass('icon-play');
            }
            else {
                _ctx.UI.audioPlayer.play();
                $(this).removeClass('icon-play').addClass('icon-pause');
            }


        });
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
                $mainWrapper.attr('id', 'time');
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
                var $timeCounterWrapper = $('<div class="time" />');
                var $hours = $('<span class="time__hours" />');
                var $minutes = $('<span class="time__minutes" />');
                var $seconds = $('<span class="time__seconds" />');
                $timeCounterWrapper.append($hours).append(':').append($minutes).append(':').append($seconds);
                $contentWrapper.html($timeCounterWrapper);
                var interval = window.setInterval(function () {
                    displayTimeCounterStep();
                }, 1000);
                displayTimeCounterStep();
            }
            var timeUpdateInterval;
            function playMusic(music, onCompleted) {
                if (music) {
                    $mainWrapper.attr('id', 'alarm');
                    // console.log(music);
                    var currentHours = new Date().getHours();
                    var currentMinutes = new Date().getMinutes();
                    var $alarmContentWrapper = $('<div class="alarm" />');
                    var $alarmDateLabel = $('<div class="alarm__date">Воскресение, 16 июня</div>');
                    var $alarmTimeLabel = $('<div class="alarm__timer">' + (currentHours <= 9 ? '0' + currentHours : currentHours) + ':' + (currentMinutes <= 9 ? '0' + currentMinutes : currentMinutes) + '</div>');
                    var alarmTimerCounter = 0;
                    if (timeUpdateInterval) {
                        clearInterval(timeUpdateInterval);
                    }
                    timeUpdateInterval = setInterval(function () {
                        if ($('.alarm__timer').size()) {
                            var currentHours = new Date().getHours();
                            var currentMinutes = new Date().getMinutes();
                            alarmTimerCounter++;
                            $('.alarm__timer').text((currentHours <= 9 ? '0' + currentHours : currentHours) + (alarmTimerCounter % 2 == 0 ? ' ' : ':') + (currentMinutes <= 9 ? '0' + currentMinutes : currentMinutes));
                        }
                    }, 2000);                    
                    var $alarmButtonStop = $('<button class="button button_type_stop">Остановить</button>');
                    $alarmButtonStop.click(function () {
                        _ctx.UI.audioPlayer.stop();
                        onCompleted();
                        // console.log('clicked stop');
                    });
                    var $alarmButtonYet = $('<button class="button">Еще 5 минут :-)</button>');
                    $alarmButtonYet.click(function () {
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
            var _currentPluginName;
            $contentWrapper.html($pluginsContainerWrapper);
            var $horoscopeCrumb = $('.horoCrumb').click(function () {
                _ctx.UI.audioPlayer.stop();
                executePlugin('horoscope', _settings.pluginSettings.useVoice, function () { });
            });
            var $weatherCrumb = $('.weatherCrumb').click(function () {
                _ctx.UI.audioPlayer.stop();
                executePlugin('weather', _settings.pluginSettings.useVoice, function () { });
            });
            var $calendarCrumb = $('.calendarCrumb').click(function () {
                _ctx.UI.audioPlayer.stop();
                executePlugin('calendar', _settings.pluginSettings.useVoice, function () { });
            });
            var $rssCrumb = $('.rssCrumb').click(function () {
                _ctx.UI.audioPlayer.stop();
                executePlugin('rss', _settings.pluginSettings.useVoice, function () { });
            });
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
                if (pluginName == _currentPluginName) {
                    return;
                }
                $mainWrapper.attr('id', pluginName);
                _currentPluginName = pluginName;
                function executePluginContent(pluginData, readableName, text) {
                    var $pluginContentWrapper = $('<div class="plugin-content"></div>');
                    var $pluginContentTitle = $('<div class="plugin-content"></div>');
                    var $pluginContent = $('<div class="plugin-content"></div>');
                    $pluginContentWrapper.append($pluginContentTitle).append($pluginContent);
                    $pluginContentTitle.text(pluginData.title);
                    $pluginContent.html(pluginData.html);
                    cachedPluginContents.push({ title: pluginName, readableName: readableName, $content: $pluginContentWrapper, data: pluginData, text: text });
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
            $mainWrapper.attr('id', 'end');
            $contentWrapper.html('');
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
                if (source || !_currentPlayer) {
                    $('.actions__left .icon:first').removeClass('icon-play').addClass('icon-pause');
                    _currentPlayer = $('<audio/>', {
                        src: source,
                        autoplay: 'autoplay'
                    }).appendTo('body').bind('ended', function () {
                        onCompleted();
                    })[0];
                }
                else {
                    if (_currentPlayer) {
                        _currentPlayer.play();
                    }
                }
                this.pause = function () {
                    if (_currentPlayer) {

                        if (!_currentPlayer.paused) {
                            _currentPlayer.pause();
                        }
                    }
                }
            };
            this.stop = function () {
                if (_currentPlayer) {
                    $(_currentPlayer).remove();
                }
            }
        }
    }
}
