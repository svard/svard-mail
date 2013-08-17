'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', 'headers', function ($scope, headers) {
        $scope.headers = headers;
    }]);