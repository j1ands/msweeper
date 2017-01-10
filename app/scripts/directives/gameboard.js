'use strict';

/**
 * @ngdoc directive
 * @name msweeperApp.directive:gameBoard
 * @description
 * # gameBoard
 */
angular.module('msweeperApp')
.directive('gameBoard', gameBoard);

  gameBoard.$inject = ['boardGenerator'];
  
  function gameBoard(boardGenerator) {
    return {
      templateUrl: '/scripts/directives/gameboard.html',
      restrict: 'E',
      scope: {
        size: '='
      },
      link: function (scope) {
        scope.gameState = {};
        scope.tableSize = scope.size;
        scope.getTableSize = getTableSize;
        scope.handleGameClick = handleGameClick;

        scope.gameState = {
          clicked: false
        };

        function getTableSize(num) {
          return new Array(num);
        }

        function handleGameClick(clickEvent) {
          if(!scope.gameState.clicked) {
            boardGenerator.generate(scope.tableSize, clickEvent);
            scope.gameState.clicked = true;
          } else {
            boardGenerator.handleTileSelection(scope.tableSize, clickEvent);
          }
        }
      }
    };
  }
