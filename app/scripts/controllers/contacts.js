'use strict';

angular.module('svardMailApp')
    .controller('ContactsCtrl', ['$scope', function ($scope) {
        $scope.contactId = 1;
        $scope.contacts = [
            {name: 'Annie Huang', address: 'juan.svard@gmail.com', id: $scope.contactId++},
            {name: 'Kristofer Svärd', address: 'kristofer.svard@gmail.com', id: $scope.contactId++}
        ];

        $scope.addContact = function () {
            $scope.contacts.push({name: '', address: '', id: $scope.contactId++});
        };
    }])

    .controller('ContactCtrl', ['$scope', function ($scope) {
        $scope.actionMenuVisible = false;
        $scope.actionMenuStyle = {display: 'none'};

        $scope.toggleActionMenu = function () {
            $scope.actionMenuVisible = !$scope.actionMenuVisible;
            if ($scope.actionMenuVisible) {
                $scope.actionMenuStyle.display = 'block';
            } else {
                $scope.actionMenuStyle.display = 'none';
            }
        };

        $scope.deleteContact = function (index) {
            $scope.contacts.splice(index, 1);
        };
    }]);
