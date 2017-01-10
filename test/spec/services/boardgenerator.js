'use strict';

describe('Service: boardGenerator', function () {

  // load the service's module
  beforeEach(module('msweeperApp'));

  // instantiate service
  var boardGenerator;
  beforeEach(inject(function (_boardGenerator_) {
    boardGenerator = _boardGenerator_;
  }));

  
  // it('should be able to set and get the board', function() {
  //   boardGenerator.setBoard({});
  //   expect(boardGenerator.getBoard()).toBeDefined();
  // });
  
  // it('should generate a board', function() {
  //   boardGenerator.generate(9);
  //   expect(boardGenerator.getBoard()).toBeDefined(); 
  // });
    
  // it('should ignore bomb on first click', function() {
  //   boardGenerator.firstClick({location: 9});
  //   expect(boardGenerator.generate).toHaveBeenCalled();
  // });
    

});
