'use strict';

angular.module('svardMailApp')
    .controller('AppCtrl', ['$scope', 'ProfileLoader', function ($scope, ProfileLoader) {
        $scope.setActiveMailbox = function (name) {
            $scope.activeMailbox = name;
        };

        new ProfileLoader().then(function (profile) {
            $scope.profile = profile;
        });

        $scope.activeMailbox = 'INBOX';
    }]);