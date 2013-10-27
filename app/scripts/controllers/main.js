'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', 'mailbox', function ($scope, mailbox) {
        $scope.box = mailbox;
    }])

    .controller('TableRowCtrl', ['$scope', '$location', function ($scope, $location) {
		$scope.previewSelected = false;

		$scope.togglePreview = function () {
            $scope.previewSelected = !$scope.previewSelected;
        };

        $scope.isPreviewSelected = function () {
            return $scope.previewSelected;
        };

        $scope.isUnseen = function() {
            if (_.contains($scope.message.flags, '\\Recent')) {
                return 'svard-mail-unseen';
            }
        };

        $scope.readMail = function() {
            $location.path('/compose/' + $scope.message.uid);
        };
    }]);