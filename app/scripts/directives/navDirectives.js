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

    .directive('navMailBoxes', function () {
        return {
            template: '<ul class="menu vertical shadowed blue">' +
                    '<li ng-repeat="boxName in boxNames" ng-class="{active: isActive(boxName)}"><a href="">{{boxName}}</a></li>' +
                '</ul>',
            scope: {boxNames: '=boxNames'},
            link: function postLink(scope, element) {
                var list = element.children();
                scope.active = 'INBOX';

                list.bind('click', function(e) {
                    scope.$apply(function() {
                        console.log(e.target.text);
                        scope.active = e.target.text;
                    });
                });

                scope.isActive = function(name) {
                    return name === scope.active;
                };
            }
        };
    });