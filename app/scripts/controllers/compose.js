'use strict';

angular.module('svardMailApp')
    .controller('ComposeCtrl', ['$scope', 'Mailer', function ($scope, Mailer) {
        $scope.body = {
            from: null,
            to: null,
            cc: null,
            subject: null,
            text: null
        };

        $scope.sendMail = function () {
            var mailer = new Mailer($scope.body);
            mailer.$send();
        };
    }])

    .controller('ComposeReplyCtrl', ['$scope', 'body', function ($scope, body) {
        $scope.body = body;

        $scope.getFromField = function () {
            return $scope.body.from[0].name + ' <' + $scope.body.from[0].address + '>';
        };
    }]);