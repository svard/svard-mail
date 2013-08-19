'use strict';

angular.module('svardMailApp')
    // .controller('MainCtrl', ['$scope', 'headers', function ($scope, headers) {
    .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
        // $scope.box = headers;
        $http.get('../../mockmail.json').success(function(data) {
            $scope.box = data;
        });
    }]);