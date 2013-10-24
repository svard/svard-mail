'use strict';

angular.module('svardMailApp')
    .controller('AppCtrl', ['$scope', 'ProfileLoader', function ($scope, ProfileLoader) {
        // $scope.profile = {username: 'kristofer@svard.net', name: 'Kristofer Svärd'};
        new ProfileLoader().then(function (profile) {
            $scope.profile = profile;
        });
    }]);