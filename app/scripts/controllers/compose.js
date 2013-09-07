'use strict';

angular.module('svardMailApp')
    .controller('ComposeCtrl', ['$scope', function ($scope) {
        $scope.body = {};
    }])

    .controller('ComposeReplyCtrl', ['$scope', 'body', function ($scope, body) {
        $scope.body = body;

        $scope.getFromField = function () {
            return $scope.body.from[0].name + ' <' + $scope.body.from[0].address + '>';
        };
    }]);