'use strict';

angular.module('svardMailApp')
    .directive('mailTable', function () {
        return {
            templateUrl: 'views/templates/mailTable.html',
            scope: {
                headers: '=headers'
            },
            controller: 'TableCtrl',
            // link: function postLink($scope, element) {
            // }
        };
    })

    .directive('mailTableRow', function () {
        return {
            templateUrl: 'views/templates/mailTableRow.html',
            require: '^mailTable',
            link: function postLink($scope) {
                var nameSort = function(mail) {
                    return mail.from[0].name;
                };

                var subjectSort = function(mail) {
                    return mail.subject;
                };

                var dateSort = function(mail) {
                    return -new Date(mail.date).getTime();
                };

                $scope.sortFunc = dateSort;

                $scope.$on('sortFuncChanged', function(event, target) {
                    switch(target) {
                        case 'name':
                            $scope.sortFunc = nameSort;
                            break;
                        case 'subject':
                            $scope.sortFunc = subjectSort;
                            break;
                        case 'date':
                            $scope.sortFunc = dateSort;
                            break;
                    }
                });

                $scope.isUnseen = function(header) {
                    if (_.contains(header.flags, '\\Unseen')) {
                        return 'svard-mail-unseen';
                    }
                };
            }
        };
  });
