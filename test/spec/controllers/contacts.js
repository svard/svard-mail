'use strict';

xdescribe('Controller: ContactsCtrl', function () {

    // load the controller's module
    beforeEach(module('svardMailApp'));

    var ContactsCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ContactsCtrl = $controller('ContactsCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});

describe('Controller: ContactCtrl', function () {
    // load the controller's module
    beforeEach(module('svardMailApp'));

    var ContactCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        scope.contactId = 0;
        scope.actionMenuVisible = false;
        scope.actionMenuStyle = {display: 'none'};
        scope.contacts = [
            {name: 'Annie Huang', address: 'juan.svard@gmail.com', id: scope.contactId++},
            {name: 'Kristofer Svärd', address: 'kristofer.svard@gmail.com', id: scope.contactId++}
        ];
        ContactCtrl = $controller('ContactCtrl', {
            $scope: scope
        });
    }));

    it('should delete one contact', function () {
        expect(scope.contacts.length).toBe(2);
        scope.deleteContact(0);
        expect(scope.contacts.length).toBe(1);
    });

    it('should toggle the action menu', function () {
        expect(scope.actionMenuVisible).toBe(false);
        expect(scope.actionMenuStyle.display).toEqual('none');

        scope.toggleActionMenu();

        expect(scope.actionMenuVisible).toBe(true);
        expect(scope.actionMenuStyle.display).toEqual('block');

        scope.toggleActionMenu();

        expect(scope.actionMenuVisible).toBe(false);
        expect(scope.actionMenuStyle.display).toEqual('none');
    });
});