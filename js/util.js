'use strict';

(function () {

  var MOUSE_LEFT = 0;
  var KEY_ENTER = 'Enter';
  var KEY_ESC = 'Escape';

  var getRandomNumb = function (min, max) {
    return Math.floor(Math.random() * max) + min;
  };

  var getRandomArray = function (array) {
    var resultArray = [];
    var length = getRandomNumb(1, array.length);
    for (var i = 0; i < length; i++) {
      resultArray.push(array[i]);
    }
    return resultArray;
  };

  var hideElem = function (elem) {
    elem.classList.add('hidden');
  };

  window.util = {
    getRandomNumb: getRandomNumb,
    getRandomArray: getRandomArray,
    hideElem: hideElem,
    mouseLeft: MOUSE_LEFT,
    keyEnter: KEY_ENTER,
    keyEscape: KEY_ESC
  };

})();
