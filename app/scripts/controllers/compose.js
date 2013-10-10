'use strict';

angular.module('svardMailApp')
    .controller('ComposeCtrl', ['$scope', 'Mailer', '$location', 'MailUtils', 'mail', function ($scope, Mailer, $location, MailUtils, mail) {
        var mailCopy = {};
        angular.copy(mail, mailCopy);
        $scope.mail = MailUtils.initMail(mailCopy, $scope.profile);

        $scope.sendMail = function () {
            var mailer = new Mailer($scope.mail);

            mailer.$send();
            $location.path('/');
        };

        $scope.formatReply = function () {
            $scope.mail.text = MailUtils.formatReplyText($scope.mail);
            $scope.mail.to = $scope.mail.from;
            $scope.mail.from = MailUtils.formatAddress($scope.profile.name, $scope.profile.username);
            $scope.mail.subject = MailUtils.formatReplySubject($scope.mail.subject);
        };
    }]);