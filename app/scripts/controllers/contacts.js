'use strict';

angular.module('svardMailApp')
    .controller('ContactsCtrl', ['$scope', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma',
            'My own stuff',
            'Another thing'
        ];

        $scope.addContact = function () {
            $scope.awesomeThings.push('New thing');
        };
    }]);
