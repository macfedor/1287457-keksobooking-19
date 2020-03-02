'use strict';

(function () {

  var STATUS_SUCCESS = 200;
  var TIMEOUT = 10000;

  var createXhr = function (onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = TIMEOUT;
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс.');
    });
    return xhr;
  };

  var load = function (onSuccess, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = createXhr(onError);
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onSuccess(xhr.response);
      } else {
        onError('Данные не получены. Статус: ' + xhr.status + ' "' + xhr.statusText + '"');
      }
    });

    xhr.open('GET', URL);
    xhr.send();
  };

  var save = function (data, onSuccess, onError) {
    var URL_SAVE = 'https://js.dump.academy/keksobooking';
    var xhrSave = createXhr(onError);

    xhrSave.addEventListener('load', function () {
      if (xhrSave.status === STATUS_SUCCESS) {
        onSuccess('Данные успешно отправлены');
      } else {
        onError('Статус ответа: ' + xhrSave.status + ' ' + xhrSave.statusText);
      }
    });

    xhrSave.open('POST', URL_SAVE);
    xhrSave.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };

})();
