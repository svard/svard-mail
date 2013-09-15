'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', 'headers', function ($scope, headers) {
        $scope.box = headers;
    }])

    .controller('TableRowCtrl', ['$scope', '$location', function ($scope, $location) {
		$scope.previewSelected = false;
		$scope.header.from = $scope.header.from[0];

		$scope.togglePreview = function () {
            $scope.previewSelected = !$scope.previewSelected;
        };

        $scope.isPreviewSelected = function () {
            return $scope.previewSelected;
        };

        $scope.isUnseen = function() {
            if (_.contains($scope.header.flags, '\\Unseen')) {
                return 'svard-mail-unseen';
            }
        };

        $scope.readMail = function() {
            $location.path('/compose/' + $scope.header.uid);
        };
    }]);