'use strict';

angular.module('svardMailApp')
    .directive('loader', ['$rootScope', '$window', function ($rootScope, $window) {
        return {
            template: '<div class="loader loader-2" ng-style="getViewportCenter()"></div>',
            restrict: 'E',
            replace: true,
            link: function postLink(scope, element) {
                element.addClass('svard-mail-hide');

                $rootScope.$on('$routeChangeStart', function () {
                    element.removeClass('svard-mail-hide');
                });

                $rootScope.$on('$routeChangeSuccess', function () {
                    element.addClass('svard-mail-hide');
                });

                $rootScope.$on('loadingStarted', function () {
                    element.removeClass('svard-mail-hide');
                });

                $rootScope.$on('loadingFinished', function () {
                    element.addClass('svard-mail-hide');
                });

                scope.getViewportCenter = function () {
                    var top = ($window.innerHeight / 2) - 20,
                        left = ($window.innerWidth / 2) - 20;

                    return {
                        top: top + 'px',
                        left: left + 'px'
                    };
                };
            }
        };
    }]);