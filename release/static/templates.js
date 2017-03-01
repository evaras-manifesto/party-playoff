angular.module('app').run(['$templateCache', function($templateCache) {$templateCache.put('notification.html','<div class="notification" ng-class="{active:$ctrl.Notifications.visible}">\n    {{$ctrl.Notifications.message}}\n</div>');
$templateCache.put('header.html','<div class="header flex flex-row flex-align" ng-class="{active:$ctrl.Settings.showHeader()}">\n    \n    <div class="header-icon flex flex-align flex-justify" ng-click="$ctrl.Settings.back()">\n        <span class="icon icon-arrow-left3"></span>\n    </div>\n\n    <div class="header-logo" ui-sref="voting-home">\n        Party Cards\n    </div>\n\n\n    <div class="header-icon flex flex-align flex-justify" ui-sref="settings">\n        <span class="icon icon-menu"></span>\n    </div>\n</div>\n');
$templateCache.put('tabs.html','<div class="tabs flex flex-row" ng-style="$ctrl.moveTabs()" ng-transclude="tabs">\n\n</div>\n\n<div class="tab-nav flex flex-min flex-row flex-align">\n    <div class="tab-icon flex flex-align flex-justify"\n         ng-repeat="icon in $ctrl.icons track by $index"\n         ng-click="$ctrl.setTab($index)"\n         ng-class="{active:$ctrl.isActive($index)}"\n    >\n        <span class="icon-{{icon}}"></span>\n    </div>\n</div>');
$templateCache.put('home-screen.html','<div screen="home">\n    <div class="question flex flex-align flex-justify">\n        <small>Welcome to</small>\n        <div class="super-huge-text logo-text">Party Cards</div>\n        <div style="height: 30px"></div>\n\n        <md-button class="md-raised" ui-sref="voting-home">Enter</md-button>\n    </div>\n</div>');
$templateCache.put('voting-game-screen.html','<div screen="voting-game">\n    <tabs-component icons="[\'gamepad3\', \'podium\', \'stack-text\', \'bubble-dots3\', \'info\']">\n        <tabs class="tabs flex flex-row">\n            <div class="tab flex">\n                <div ng-if="$ctrl.isStatus(\'new\')" class="back-primary flex flex-align flex-justify">\n                    <div>Game ID:</div>\n                    <div class="huge-text" style="margin-bottom: 30px;">\n                         {{$ctrl.game._id}}\n                    </div>\n                    <p ng-if="$ctrl.isHost() && !$ctrl.canStart()">Waiting for more players...</p>\n                    <p ng-if="!$ctrl.isHost()">Waiting for admin to start...</p>\n                    <p ng-if="!$ctrl.hasJoined()">\n                        <md-button class="md-raised" ng-click="$ctrl.joinGame()">Join Game</md-button>\n                    </p>\n                    <p ng-if="$ctrl.canStart()">\n                        <md-button class="md-raised" ng-click="$ctrl.startGame()">Start Game</md-button>\n                    </p>\n                </div>\n                <div ng-if="$ctrl.isStatus(\'started\')" class="back-primary flex flex-align flex-justify">\n\n                    <p ng-if="$ctrl.isTurn()">\n                        <small>This is your question.</small>\n                    </p>\n                    <p class="large-text">\n                        Who {{$ctrl.getCard()}}?\n                    </p>\n\n                    <!--card-->\n                    <div class="flex flex-min" ng-if="$ctrl.isLocalState(\'voting\')">\n                        <div ng-if="!$ctrl.hasVoted() && $ctrl.hasJoined()" class="flex flex-min">\n                            <md-input-container>\n                                <label>Select</label>\n                                <md-select ng-model="$ctrl.voteFor">\n                                    <md-option ng-value="">Select</md-option>\n                                    <md-option\n                                            ng-repeat="player in $ctrl.getOtherPlayers()"\n                                            ng-value="player"\n                                    >{{player}}\n                                    </md-option>\n                                </md-select>\n                            </md-input-container>\n\n                            <div style="height: 45px">\n                                <md-button class="md-raised" ng-if="$ctrl.voteFor" ng-click="$ctrl.vote($ctrl.voteFor)">Vote!</md-button>\n                            </div>\n                        </div>\n\n                        <div></div>\n                        <p ng-if="$ctrl.hasVoted() || !$ctrl.hasJoined()">\n                            <small>\n                                Waiting for the others... &nbsp; <span class="spinner icon-cog"></span>\n                            </small>\n                        </p>\n                    </div>\n\n                    <!--guess-->\n                    <!--<div class="flex flex-min" ng-if="$ctrl.isLocalState(\'guessing\')">-->\n                        <!--<div></div>-->\n                        <!--<p>-->\n                            <!--<small>Who nominated you?</small></p>-->\n\n                        <!--&lt;!&ndash;<div ng-if="!$ctrl.hasGuessed()" class="flex flex-min">&ndash;&gt;-->\n                        <!--<md-input-container  ng-repeat="vote in $ctrl.getMyVotes()">-->\n                            <!--<label>Select</label>-->\n                            <!--<md-select ng-model="$ctrl.guessFor">-->\n                                <!--<md-option ng-value="">Select</md-option>-->\n                                <!--<md-option-->\n                                        <!--ng-repeat="player in $ctrl.getOtherPlayers()"-->\n                                        <!--ng-value="player"-->\n                                <!--&gt;{{player}}-->\n                                <!--</md-option>-->\n                            <!--</md-select>-->\n                        <!--</md-input-container>-->\n                    <!--</div>-->\n\n\n                    <div class="flex flex-min" ng-show="$ctrl.isLocalState(\'finished\')">\n                        <div></div>\n                        <p class="large-text show-winner" ng-class="{active:$ctrl.isLocalState(\'finished\')}">\n                            {{$ctrl.getWinnersList()}}.\n                        </p>\n                        <p style="margin-top:30px">\n                            <md-button class="md-raised" ng-if="$ctrl.isHost()" ng-click="$ctrl.newRound()">Next Round!</md-button>\n                        </p>\n                    </div>\n                </div>\n            </div>\n\n            <div class="tab">\n                <!--<div class="section-title block">Players</div>-->\n                <div class="container">\n                    <div class="section">\n                        <div class="scoreboard">\n                            <div class="player flex flex-row"\n                                 ng-repeat="player in $ctrl.game.players"\n                            >\n                                <div class="indicator">\n                                    <span class="icon-arrow-right3" ng-if="$ctrl.isTurn(player)"></span>\n                                </div>\n                                <div class="name">{{player}} &nbsp; <small ng-if="$ctrl.isHost(player)">(host)</small></div>\n                                <div class="score">{{$ctrl.getPlayerCards(player).length}}</div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class="tab">\n                <div class="section-title block">My Cards</div>\n                <div class="container">\n                    <div class="question-cards flex flex-wrap">\n                        <div class="question-card flex flex-align flex-justify"\n                             ng-repeat="card in $ctrl.getPlayerCards()"\n                        >\n                            Who {{card}}?\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n\n            <div class="tab flex">\n                <div class="section-title block">Chat</div>\n                <div class="chat-items flex">\n                    <div class="chat-floater">\n                        <div ng-repeat="message in $ctrl.game.messages">\n                            <div class="p-label">{{message.username}}</div>\n                            <div class="p-text">{{message.text}}</div>\n                        </div>\n                    </div>\n\n                </div>\n\n                <div class="chat-box flex flex-row">\n                    <textarea name="" id="" rows="4" ng-model="$ctrl.chatMessage"></textarea>\n                    <div class="chat-butn" ng-click="$ctrl.sendChat()"><span class="icon-paperplane"></span></div>\n\n                </div>\n            </div>\n\n            <div class="tab">\n                <div class="section-title block">Settings</div>\n                <div class="container">\n                    <div class="list">\n                        <div class="list-item">\n                            <div class="item-label">Game Id</div>\n                            <div class="item-content">{{$ctrl.game._id}}</div>\n                        </div>\n                        <div class="list-item">\n                            <div class="item-label">Round</div>\n                            <div class="item-content">{{$ctrl.game.currentRound}}</div>\n                        </div>\n                        <div class="list-item">\n                            <div class="item-label">Host</div>\n                            <div class="item-content">{{$ctrl.game.host}}</div>\n                        </div>\n                        <div ng-if="$ctrl.hasJoined() && !$ctrl.isHost() && $ctrl.isStatus(\'new\')"\n                             class="butn block"\n                             ng-click="$ctrl.leaveGame()"\n                        >\n                            Leave Game\n                        </div>\n                    </div>\n\n\n\n\n\n                </div>\n            </div>\n\n        </tabs>\n    </tabs-component>\n</div>');
$templateCache.put('settings-screen.html','<div screen="settings">\n    <!--<tabs-component icons="[\'pencil\', \'diamond\']">-->\n        <!--<tabs class="tabs flex flex-row">-->\n            <!--<div class="tab flex">-->\n                <div class="question flex flex-align flex-justify">\n                    <div class="large-text">Enter a unique player name.</div>\n                    <md-input-container style="margin-right: 10px;">\n                            <label style="bottom: 63px">Name</label>\n                            <input ng-model="$ctrl.Settings.username" ng-change="$ctrl.saveUsername()">\n                    </md-input-container>\n\n                    <md-button class="md-raised" ng-disabled="$ctrl.Settings.username .length < 4" ui-sref="voting-home">Confirm</md-button>\n                </div>\n            <!--</div>-->\n            <!--<div class="tab">-->\n                <!--<div class="section-title block">Games</div>-->\n                <!--<div class="container">-->\n                    <!--<div class="section">-->\n\n                        <!--<div class="game flex flex-align flex-justify" ui-sref="voting-settings">-->\n                            <!--The Voting Game-->\n                        <!--</div>-->\n\n                        <!--<div class="game flex flex-align flex-justify">-->\n                            <!--Cards Against Humanity-->\n                        <!--</div>-->\n\n                    <!--</div>-->\n                <!--</div>-->\n\n            <!--</div>-->\n        <!--</tabs>-->\n    </tabs-component>\n\n\n\n\n</div>');
$templateCache.put('voting-home-screen.html','<div screen="voting-home">\n\n    <tabs-component icons="[\'search\', \'menu3\']">\n        <tabs class="tabs flex flex-row">\n            <div class="tab flex">\n                <div class="question flex flex-align flex-justify">\n                    <div class="large-text">Join Game</div>\n                    <md-input-container style="margin-right: 10px;">\n                        <label style="bottom: 63px">Game ID</label>\n                        <input ng-model="$ctrl.gameId">\n                    </md-input-container>\n\n                    <md-button class="md-raised" ng-disabled="!$ctrl.gameId" ng-click="$ctrl.getGame()">Connect!</md-button>\n                </div>\n\n            </div>\n            <div class="tab flex">\n                <div class="section-title block">My Games</div>\n                <div ng-show="!$ctrl.games.length" class="back-primary flex flex-align flex-justify transparent">\n                    <div class="large-text">No games joined yet!</div>\n                    <div style="height: 30px"></div>\n                </div>\n\n                <div class="container-fluid">\n                    <div class="section">\n                        <div class="game flex flex-align flex-justify"\n                             ng-repeat="game in $ctrl.games"\n                             ng-bind="\'Game \' + game._id"\n                             ui-sref="voting-game({gameId:game._id})"\n                        ></div>\n\n                    </div>\n                </div>\n            </div>\n        </tabs>\n    </tabs-component>\n\n    <div class="floating-button flex flex-align flex-justify high white" ng-click="$ctrl.addGame()">\n        <span class="icon-plus3"></span>\n    </div>\n</div>');}]);