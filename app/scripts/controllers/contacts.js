'use strict';

angular.module('svardMailApp')
    .controller('ContactsCtrl', ['$scope', function ($scope) {
        $scope.addContact = function () {
            $scope.profile.savedContacts.push({name: '', email: ''});
        };
    }])

    .controller('ContactCtrl', ['$scope', '$timeout', 'Contact', function ($scope, $timeout, Contact) {
        $scope.actionMenuVisible = false;
        $scope.actionMenuStyle = {display: 'none'};
        $scope.savedToastVisible = false;

        $scope.toggleActionMenu = function () {
            $scope.actionMenuVisible = !$scope.actionMenuVisible;
            if ($scope.actionMenuVisible) {
                $scope.actionMenuStyle.display = 'block';
            } else {
                $scope.actionMenuStyle.display = 'none';
            }
        };

        $scope.saveContact = function (index) {
            var contact = new Contact({
                name: $scope.contact.name,
                email: $scope.contact.email
            });

            if ($scope.profile.savedContacts[index]._id === undefined) {
                contact.$save().then(function (response) {
                    $scope.profile.savedContacts[index]._id = response._id;
                    $scope.showToast();
                });
            } else {
                contact.$update({id: $scope.profile.savedContacts[index]._id}).then(function () {
                    $scope.showToast();
                });
            }

            $scope.toggleActionMenu();
        };

        $scope.deleteContact = function (index) {
            var contact = new Contact();
            contact.$delete({id: $scope.profile.savedContacts[index]._id});
            $scope.profile.savedContacts.splice(index, 1);

            $scope.toggleActionMenu();
        };

        $scope.showToast = function () {
            $scope.savedToastVisible = !$scope.savedToastVisible;
            $timeout(function () {
                $scope.savedToastVisible = !$scope.savedToastVisible;
            }, 2000);
        };

        $scope.toggleSavedToast = function () {
            if ($scope.savedToastVisible) {
                return 'svard-mail-contact-saved-visible';
            } else {
                return 'svard-mail-contact-saved-invisible';
            }
        };
    }]);