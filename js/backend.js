'use strict';

(function () {

  var STATUS_SUCCESS = 200;
  var TIMEOUT = 10000;

  var load = function (onSuccess, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
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

  var save = function (data, onSuccess, onError) {
    var URL_SAVE = 'https://js.dump.academy/keksobooking';
    var xhrSave = new XMLHttpRequest();
    xhrSave.responseType = 'json';

    xhrSave.addEventListener('load', function () {
      if (xhrSave.status === STATUS_SUCCESS) {
        onSuccess('Данные успешно отправлены');
      } else {
        onError('Статус ответа: ' + xhrSave.status + ' ' + xhrSave.statusText);
      }
    });
    xhrSave.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhrSave.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhrSave.timeout + 'мс');
    });

    xhrSave.open('POST', URL_SAVE);
    xhrSave.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };

})();
