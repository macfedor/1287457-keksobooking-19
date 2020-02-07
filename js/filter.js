'use strict';

(function () {

  var filter = document.querySelector('.map__filters');

  var disableFilters = function () {
    var filters = filter.querySelectorAll('select');
    for (var i = 0; i < filters.length; i++) {
      filters[i].disabled = true;
    }
  };

  var enableFilters = function () {
    var filters = filter.querySelectorAll('select');
    for (var i = 0; i < filters.length; i++) {
      filters[i].disabled = false;
    }
  };

  window.filter = {
    disableFilters: disableFilters,
    enableFilters: enableFilters
  };

})();
