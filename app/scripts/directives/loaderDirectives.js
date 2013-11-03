'use strict';

angular.module('svardMailApp')
    .directive('loader', ['$rootScope', function ($rootScope) {
        return {
            template: '<div class="svard-mail-loader">' +
                    '<h2>Loading</h2>' +
                    '<span></span>' +
                    '<span></span>' +
                    '<span></span>' +
                    '<span></span>' +
                    '<span></span>' +
                    '<span></span>' +
                    '<span></span>' +
                '</div>',
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
            }
        };
    }]);