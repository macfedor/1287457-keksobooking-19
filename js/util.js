'use strict';

(function () {
  var AFTER_SEND_MODE_NAME = 'afterSend';
  var MOUSE_LEFT = 0;
  var KEY_ENTER = 'Enter';
  var KEY_ESC = 'Escape';
  var successPopup;
  var errorPopup;
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

  var createSuccessPopup = function () {
    successPopup = document.querySelector('#success').content.querySelector('.success');
    document.querySelector('main').appendChild(successPopup);
  };

  var createErrorPopup = function () {
    errorPopup = document.querySelector('#error').content.querySelector('.error');
    document.querySelector('main').appendChild(errorPopup);
  };

  var onCloseSuccessPopup = function () {
    hideElem(successPopup);
    document.removeEventListener('click', onCloseSuccessPopup);
    document.removeEventListener('keydown', onKeydownSuccessPopup);
  };

  var onKeydownSuccessPopup = function (evtSuccessKeydown) {
    if (evtSuccessKeydown.key === window.util.keyEscape) {
      onCloseSuccessPopup();
    }
  };

  var onBackendSuccess = function (string) {
    if (!successPopup) {
      createSuccessPopup();
    }
    successPopup.classList.remove('hidden');
    var popupText = successPopup.querySelector('.success__message');
    popupText.textContent = string;
    document.addEventListener('click', onCloseSuccessPopup);
    document.addEventListener('keydown', onKeydownSuccessPopup);
  };

  var onCloseErrorPopup = function () {
    hideElem(errorPopup);
    document.removeEventListener('mouseup', onCloseErrorPopup);
    document.removeEventListener('keydown', onKeydownErrorPopup);
  };

  var onKeydownErrorPopup = function (evtErrorKeydown) {
    if (evtErrorKeydown.key === window.util.keyEscape) {
      onCloseErrorPopup();
    }
  };

  var onBackendError = function (string) {
    if (!errorPopup) {
      createErrorPopup();
    }
    var errorBtnClose = errorPopup.querySelector('.error__button');
    var popupText = errorPopup.querySelector('.error__message');
    popupText.textContent = string;
    document.addEventListener('mouseup', onCloseErrorPopup);
    errorBtnClose.addEventListener('mouseup', onCloseErrorPopup);
    document.addEventListener('keydown', onKeydownErrorPopup);
    errorPopup.classList.remove('hidden');
  };

  var setAbleFormElems = function (currentForm, enable) { // переключение disable/endable для элементов формы. если есть второй аргумент - поля активны, если нет - отключены
    var fields = currentForm.querySelectorAll('fieldset, select');
    fields.forEach(function (field) {
      if (enable) {
        field.disabled = false;
      } else {
        field.disabled = true;
      }
    });
  };

  var comparePrimitives = function (firstValue, secondValue) {
    if (typeof (firstValue) === typeof (secondValue)) {
      return firstValue === secondValue;
    }
    var type = typeof (firstValue);
    switch (type) {
      case 'number':
        secondValue = Number(secondValue);
        break;
      case 'string':
        secondValue = String(secondValue);
        break;
    }
    return firstValue === secondValue;
  };

  var insertImage = function (fileChooser, previewBlock) {
    var file = fileChooser.files[0];
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      var img = previewBlock;
      if (previewBlock.tagName !== 'IMG') {
        if (!previewBlock.querySelector('img')) {
          previewBlock.insertAdjacentHTML('afterbegin', '<img style="max-width:100%; max-height:100%">');
        }
        img = previewBlock.querySelector('img');
      }
      img.src = reader.result;
    });
    reader.readAsDataURL(file);
  };

  window.util = {
    getRandomNumb: getRandomNumb,
    getRandomArray: getRandomArray,
    hideElem: hideElem,
    mouseLeft: MOUSE_LEFT,
    keyEnter: KEY_ENTER,
    keyEscape: KEY_ESC,
    afterSendModeName: AFTER_SEND_MODE_NAME,
    onBackendError: onBackendError,
    onBackendSuccess: onBackendSuccess,
    setAbleFormElems: setAbleFormElems,
    comparePrimitives: comparePrimitives,
    insertImage: insertImage
  };

})();
