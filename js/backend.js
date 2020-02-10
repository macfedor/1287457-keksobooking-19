'use strict';

(function () {

  var load = function (onSuccess, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var TIMEOUT = 10000;
    var STATUS_SUCCESS = 200;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Данные не получены. Статус: ' + xhr.status + ' "' + xhr.statusText + '"', 'error');
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения', 'error');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.', 'error');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = {
    load: load
  };

})();
