'use strict';

(function () {

  var DEBOUNCE_TIME = 500;

  var debounce = function (callback) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, parameters);
      }, DEBOUNCE_TIME);
    };
  };

  window.debounce = debounce;

})();
