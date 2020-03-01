'use strict';

(function () {
  var AFTER_SEND_MODE_NAME = 'afterSend';
  var MOUSE_LEFT = 0;
  var KEY_ENTER = 'Enter';
  var KEY_ESC = 'Escape';
  var successPopup;
  var errorPopup;

  var hideElement = function (elem) {
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

  var onSuccessPopupClose = function () {
    hideElement(successPopup);
    document.removeEventListener('click', onSuccessPopupClose);
    document.removeEventListener('keydown', onSuccessPopupKeydown);
  };

  var onSuccessPopupKeydown = function (evtSuccessKeydown) {
    if (evtSuccessKeydown.key === window.util.keyEscape) {
      onSuccessPopupClose();
    }
  };

  var onBackendSuccess = function (string) {
    if (!successPopup) {
      createSuccessPopup();
    }
    successPopup.classList.remove('hidden');
    var popupText = successPopup.querySelector('.success__message');
    popupText.textContent = string;
    document.addEventListener('click', onSuccessPopupClose);
    document.addEventListener('keydown', onSuccessPopupKeydown);
  };

  var onErrorPopupClose = function () {
    hideElement(errorPopup);
    document.removeEventListener('mouseup', onErrorPopupClose);
    document.removeEventListener('keydown', onErrorPopupKeydown);
  };

  var onErrorPopupKeydown = function (evtErrorKeydown) {
    if (evtErrorKeydown.key === window.util.keyEscape) {
      onErrorPopupClose();
    }
  };

  var onBackendError = function (string) {
    if (!errorPopup) {
      createErrorPopup();
    }
    var errorBtnClose = errorPopup.querySelector('.error__button');
    var popupText = errorPopup.querySelector('.error__message');
    popupText.textContent = string;
    document.addEventListener('mouseup', onErrorPopupClose);
    errorBtnClose.addEventListener('mouseup', onErrorPopupClose);
    document.addEventListener('keydown', onErrorPopupKeydown);
    errorPopup.classList.remove('hidden');
  };

  var setAbleFormElems = function (currentForm, enable) { // переключение disable/endable для элементов формы. если есть второй аргумент - поля активны, если нет - отключены
    var fields = currentForm.querySelectorAll('fieldset, select');
    fields.forEach(function (field) {
      field.disabled = enable ? false : true;
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
    hideElement: hideElement,
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
