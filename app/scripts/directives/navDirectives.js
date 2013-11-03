'use strict';

angular.module('svardMailApp')
    .directive('navToggle', function () {
        return {
            link: function (scope, element) {
                var buttonElem = angular.element(element.children().eq(0)),
                    listElem = angular.element(element.children().eq(1)),

                    toggle = function() {
                        listElem.toggleClass('hide-all');
                    };

                buttonElem.bind('click', toggle);
                listElem.bind('click', toggle);
            }
        };
    })

    .directive('navMailBoxes', ['$location', function ($location) {
        return {
            template: '<ul class="menu vertical shadowed blue">' +
                    '<li ng-repeat="boxName in box.mailBoxes" ng-class="{active: isActive(boxName)}" ng-click="changeMailbox(boxName)"><a>{{boxName}}</a></li>' +
                '</ul>',
            link: function postLink(scope) {
                scope.changeMailbox = function(name) {
                    scope.setActiveMailbox(name);
                    scope.clearMailbox();
                    $location.path('/mailbox/' + name);
                };

                scope.isActive = function(name) {
                    return name === scope.activeMailbox;
                };
            }
        };
    }]);