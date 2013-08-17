'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.currentMailCount = {
            total: 0,
            unread: 0
        };
    }]);