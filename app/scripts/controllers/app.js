'use strict';

angular.module('svardMailApp')
    .controller('AppCtrl', ['$scope', function ($scope) {
        $scope.profile = {username: 'kristofer@svard.net', name: 'Kristofer Svärd'};
    }]);