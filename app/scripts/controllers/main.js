'use strict';

angular.module('svardMailApp')
    .controller('MainCtrl', ['$scope', 'mailbox', 'SearchMail', '$rootScope', function ($scope, mailbox, SearchMail, $rootScope) {
        $scope.clearMailbox = function () {
            $scope.box = null;
        };

        $scope.searchMail = function () {
            $scope.box.selectedMailBoxContent.messages = [];
            $rootScope.$broadcast('loadingStarted');
            SearchMail.search({mailbox: $scope.activeMailbox, query: $scope.search.query}, function (response) {
                $scope.box.selectedMailBoxContent.messages = response;
                $rootScope.$broadcast('loadingFinished');
            });
        };

        $scope.search = {
            query: ''
        };
        $scope.box = mailbox;
    }])

    .controller('TableRowCtrl', ['$scope', '$location', function ($scope, $location) {
		$scope.previewSelected = false;
        $scope.message.delete = false;

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