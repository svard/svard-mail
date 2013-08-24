'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', 'headers', function ($scope, headers) {
        $scope.box = headers;
    }])

    .controller('TableCtrl', ['$scope', function ($scope) {
        $scope.sortReverse = {
            name: false,
            subject: false,
            date: false
        };

        $scope.reverse = $scope.sortReverse.date;

        $scope.toggleSortOrder = function(target) {
            $scope.sortReverse[target] = !$scope.sortReverse[target];
            $scope.reverse = $scope.sortReverse[target];
            $scope.$broadcast('sortFuncChanged', target);
        };

        $scope.getCaretDirection = function(target) {
            if ($scope.sortReverse[target]) {
                return 'icon-caret-up';
            } else {
                return 'icon-caret-down';
            }
        };
    }]);