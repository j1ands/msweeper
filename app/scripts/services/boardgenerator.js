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

    var board = {
      mines: [],
      size: null
    };
    var mineChecks = {};
    var clickedBoxes = {};
    var markedBoxes = {};
    var minePlacer = {};
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

    minePlacer = {
      1: function(size, row, col) {
        board.mines.push(
          (size * Math.floor(Math.random() * row)) + Math.floor(Math.random() * size)
        );
      },
      2: function(size, row, col, topDiff, bottomDiff) {
        board.mines.push(
          (size * Math.floor((Math.random() * bottomDiff) + row - topDiff)) + Math.floor(Math.random() * col)
        );
      },
      3: function(size, row, col, topDiff, bottomDiff) {
        board.mines.push(
          (size * Math.floor((Math.random() * bottomDiff) + row - topDiff)) + Math.floor((Math.random() * (size - col)) + col + 2)
        );
      },
      4: function(size, row, col) {
        board.mines.push(
          (size * Math.floor((Math.random() * (size - row)) + row + 2)) + Math.floor(Math.random() * size)
        );
      }
    }

    function generateMines(size, click) {
      var numOfMines = Math.floor(Math.random() * (size) + size / 2);
      var mineSettings = {
        row: {
          0: {
            skip: 1,
            topDiff: 0,
            bottomDiff: 3
          }
        },
        col: {
          0 : {
            skip: 2,
            topDiff: 1 ,
            bottomDiff: 3
          }
        }
      };
      mineSettings.row[size-1] = {
        skip: 4,
        topDiff: 1,
        bottomDiff: 2
      };
      mineSettings.col[size-1] = {
        skip: 3,
        topDiff: 1,
        bottomDiff: 3
      };

      var row = +click.target.dataset.row;
      var col = +click.target.dataset.col;

      var runSettings = {
        skip: [],
        topDiff: 1,
        bottomDiff: 3,
        count: 0
      };

      (function() {
        if(mineSettings.row[row]) {
          runSettings.skip.push(mineSettings.row[row].skip);
          runSettings.topDiff = runSettings.topDiff ? mineSettings.row[row].topDiff : runSettings.topDiff;
          runSettings.bottomDiff = runSettings.bottomDiff !== 2 ? mineSettings.row[row].bottomDiff : runSettings.bottomDiff;
        }
        if(mineSettings.col[col]) {
          runSettings.skip.push(mineSettings.col[col].skip);
        }
      });

      while(board.mines.length < numOfMines) {
        var location = (runSettings.count % 4) + 1;
        if(runSettings.skip.indexOf(location) < 0) {
          minePlacer[location](size, row, col, runSettings.topDiff, runSettings.bottomDiff);
        }
        runSettings.count++;
      }
    }

    function generate(size, click) {
      board.size = Math.pow(size, 2);
      generateMines(size, click);
      console.log(click);
      var table = $(click.currentTarget);
      var rows = table.find('tr');
      rows.each(function(rInd, row) {
        var tiles = $(row).find('td');
        $(tiles).each(function(cInd, tile) {
          var squareCalc = (size * rInd) + cInd;
          if(board.mines.indexOf(squareCalc) > -1) {
            tile.className = 'mine'
          }
        });
      });
      // handleTileSelection(size, click.target, true);
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
