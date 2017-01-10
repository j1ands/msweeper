'use strict';

describe('Directive: gameBoard', function () {

  // load the directive's module
  beforeEach(module('msweeperApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should accept size as an isolate scope variable', inject(function($compile) {
      element = angular.element('<game-board size="9"></game-board>');
      element = $compile(element)(scope);
      expect(element).toBeDefined();
        
  }));
});
