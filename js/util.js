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

  var createInfo = function (infoText, infoType) {
    var node = document.createElement('div');
    var bgColor;
    var showTime = 5000;
    node.style = 'z-index: 100; text-align: center; top:50%; position:fixed; left:0; width:100%; fint-size:30px; color:#fff';
    node.textContent = infoText;
    switch (infoType) {
      case 'error':
        bgColor = 'red';
        break;
      case 'success':
        bgColor = 'green';
        break;
      default:
        bgColor = 'yellow';
    }
    node.style.backgroundColor = bgColor;
    document.body.insertAdjacentElement('afterbegin', node);
    setTimeout(function () {
      node.remove();
    }, showTime);
  };

  window.util = {
    getRandomNumb: getRandomNumb,
    getRandomArray: getRandomArray,
    hideElem: hideElem,
    mouseLeft: MOUSE_LEFT,
    keyEnter: KEY_ENTER,
    keyEscape: KEY_ESC,
    createInfo: createInfo
  };

})();
