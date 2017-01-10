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
    var service = {
      generate: generate,
      handleTileSelection: handleTileSelection,
      mineChecks: mineChecks
    };

    var mineChecks = {
      above: function(size, position, count) {
        var mines = board.mines.filter(function(mine) {
          return position - size === mine ||
            position - size - 1 === mine ||
            position - size + 1 === mine;
        });
        return count + mines.length;
      },
      below: function(size, position, count) {
        
      }
    }

    function generateMines(size) {
      var min = Math.floor(size/2);
      var numOfMines = Math.floor(Math.random() * (size + 1 - min) + min);
      board.mines = [];
      var numOfTiles = Math.pow(size, 2);
      for(var i = 0; i < numOfMines; i++) {
        board.mines.push(Math.floor(Math.random() * numOfTiles));
      }
    }

    function generate(size, click) {
      generateMines(size, click);
    }

    function checkMine(size, position, option) {
      switch (option) {
        case 'above':
          
          break;
      
        default:
          break;
      }
    }

    function handleTileSelection(size, click) {
      var squareCalc = (size * +click.target.dataset.row) + (+click.target.dataset.col);
      if(board.mines.indexOf(squareCalc) > -1) {
        click.target.className = 'mine';
      } else {
        click.target.innerHTML = 'not mine';
        if(squareCalc < size) {
          checkMine(size, squareCalc, 'above');
        } else if(!(squareCalc % size)) {
          checkMine(size, squareCalc, 'left');
        } else if(!((squareCalc - size - 1) % size)) {
          checkMine(size, squareCalc, 'right');
        } else if(squareCalc >= (Math.pow(size,2)-size)) {
          checkMine(size, squareCalc, 'below');
        } else {
          checkMine(size, squareCalc, 'none');
        }
      }
      console.log(click);
    }

    return service;
  });
