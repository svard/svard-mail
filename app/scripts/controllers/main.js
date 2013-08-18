'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', 'headers', function ($scope, headers) {
        $scope.mailBox = headers;
        $scope.selectedBox = {
            inbox: true,
            sent: false,
            trash: false
        };
    }]);