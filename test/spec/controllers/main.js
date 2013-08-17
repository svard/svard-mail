'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('svardMailApp'));

    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope,
            headers: {
                totalMsg: 10,
                unreadMsg: 2,
                headers: []
            }
        });
    }));

    it('should fetch number of total and unread mail', function () {
        expect(MainCtrl).toBeDefined();
    });
});