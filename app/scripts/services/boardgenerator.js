'use strict';

/**
 * @ngdoc service
 * @name msweeperApp.boardGenerator
 * @description
 * # boardGenerator
 * Factory in the msweeperApp.
 */
angular.module('msweeperApp')
  .factory('boardGenerator', function () {

    var board = {};
    var mineChecks = {};
    var clickedBoxes = {};
    var markedBoxes = {};
    var service = {
      generate: generate,
      handleTileSelection: handleTileSelection,
      mineChecks: mineChecks
    };

    mineChecks = {
      above: function(size, position, count) {
        return board.mines.reduce(function(total, mine) {
          return position - size === mine ||
            position - size - 1 === mine ||
            position - size + 1 === mine ? total + 1 : total;
        }, count);
      },
      below: function(size, position, count) {
        return board.mines.reduce(function(total, mine) {
          return position + size === mine ||
            position + size - 1 === mine ||
            position + size + 1 === mine ? total + 1 : total;
        }, count);
      },
      left: function(position, count) {
        return board.mines.reduce(function(total, mine) {
          return position - 1 === mine ? total + 1 : total;
        }, count);
      },
      right: function(position, count) {
        return board.mines.reduce(function(total, mine) {
          return position + 1 === mine ? total + 1 : total;
        }, count);
      }
    };

    function generateMines(size) {
      var numOfMines = Math.floor(Math.random() * (size) + size / 2);
      board.mines = [];
      var mineSettings = {
        row: {
          0: {
            skip: 1,
            rowDiff: 0
          }
        },
        col: {
          0 : {
            skip: 2,
            rowDiff: 1 
          }
        }
      };
      mineSettings[row][size-1] = {
        skip: 4,
        rowDiff: 1
      };
      mineSettings[col][size-1] = {
        skip: 3,
        rowDiff: 1
      };

      for(var i = 0; i < numOfMines; i++) {
        board.mines.push((size * Math.floor(Math.random() * size)) + (Math.floor(Math.random() * size)));
      }
    }

    function generate(size, click) {
      generateMines(size);
      var squareCalc = (size * +click.target.dataset.row) + (+click.target.dataset.col);
      var uniqueMines = {};
      board.size = Math.pow(size, 2);
      board.mines = board.mines.filter(function(mine) {
        if(!uniqueMines[mine] && mine !== squareCalc) {
          uniqueMines[mine] = true;
          return true;
        }
        return false;
      });
      handleTileSelection(size, click.target, true);
    }

    function checkMine(size, position, option) {
      switch (option) {
        case 'above':
          return mineChecks.below(size, position, mineChecks.left(position, mineChecks.right(position, 0)));
      
        case 'below':
          return mineChecks.above(size, position, mineChecks.left(position, mineChecks.right(position, 0)));
        
        case 'left':
          return mineChecks.below(size, position, mineChecks.above(size, position, mineChecks.right(position, 0)));

        case 'right':
          return mineChecks.below(size, position, mineChecks.left(position, mineChecks.above(size, position, 0)));

        default:
          return mineChecks.above(size, position, mineChecks.below(size, position, mineChecks.left(position, mineChecks.right(position, 0))));
      }
    }

    function handleTileSelection(size, square, first) {
      var squareCalc = (size * +square.dataset.row) + (+square.dataset.col);
      clickedBoxes[squareCalc] = true;
      if(!first && board.mines.indexOf(squareCalc) > -1) {
        square.className = 'mine';
      }  else {
        square.innerHTML = squarePosition(size, squareCalc);
      }      
      if(Object.keys(markedBoxes).length + Object.keys(clickedBoxes).length === board.size) {
        alert('success!');
      }
    }

    function squarePosition(size, squareCalc) {
        if(squareCalc < size) {
          return checkMine(size, squareCalc, 'above').toString();
        } else if(squareCalc % size === 0) {
          return checkMine(size, squareCalc, 'left').toString();
        } else if((squareCalc - size + 1) % size === 0) {
          return checkMine(size, squareCalc, 'right').toString();
        } else if(squareCalc >= (Math.pow(size, 2) - size)) {
          return checkMine(size, squareCalc, 'below').toString();
        } else {
          return checkMine(size, squareCalc, 'none').toString();
        }
    }

    window.oncontextmenu = function(click) {
      click.target.className = 'marked';
      markedBoxes[click.target.dataset.row + click.target.dataset.col] = true;
      if(Object.keys(markedBoxes).length + Object.keys(clickedBoxes).length === board.size) {
        alert('Success!');
      }
      return false;
    };

    return service;
  });
