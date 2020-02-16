'use strict';

(function () {
  var noticeForm = document.querySelector('.ad-form');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var type = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var timein = noticeForm.querySelector('#timein');
  var timeout = noticeForm.querySelector('#timeout');
  var btnReset = noticeForm.querySelector('.ad-form__submit');
  var map = document.querySelector('.map');
  var roomsGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var typesPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var checkRoomsCapacities = function () {
    var activeValue = roomNumber.value;
    var availableGuests = roomsGuests[activeValue];
    var capacityValues = capacity.querySelectorAll('option');
    for (var i = 0; i < capacityValues.length; i++) {
      var elem = capacityValues[i];
      if (availableGuests.indexOf(elem.value) === -1) {
        elem.removeAttribute('selected');
        elem.disabled = true;
      } else {
        elem.disabled = false;
      }
    }
    var capacityActive = capacity.querySelector('option:checked');
    if (capacityActive.disabled === true) {
      capacity.setCustomValidity('Выберите из доступных вариантов для выбранного количества комнат');
    } else {
      capacity.setCustomValidity('');
    }
  };

  var checkTypesPrices = function () {
    var activeType = type.value;
    var minPrice = typesPrices[activeType];
    price.setAttribute('placeholder', minPrice);
    price.setAttribute('min', minPrice);
  };

  var onChangeTimes = function (evt) {
    var activeValue = evt.target.value;
    timein.value = activeValue;
    timeout.value = activeValue;
  };

  var resetNoticeForm = function () {
    noticeForm.reset();
    window.map.getDefaultPosition();
  };

  var submitSuccess = function (string) {
    window.util.onBackendSuccess(string);
    noticeForm.reset();
    window.util.setAbleFormElems(noticeForm);
    map.classList.add('map--faded');
    window.map.preparePage(window.util.afterSendModeName);
    checkRoomsCapacities();
    checkTypesPrices();
    noticeForm.classList.add('ad-form--disabled');
  };

  var onSubmitNotice = function (evtSubmit) {
    evtSubmit.preventDefault();
    var formData = new FormData(noticeForm);
    window.backend.save(formData, submitSuccess, window.util.onBackendError);
  };

  roomNumber.addEventListener('change', function () {
    checkRoomsCapacities();
  });

  capacity.addEventListener('change', function () {
    checkRoomsCapacities();
  });

  type.addEventListener('change', function () {
    checkTypesPrices();
  });

  timein.addEventListener('change', onChangeTimes);
  timeout.addEventListener('change', onChangeTimes);

  btnReset.addEventListener('click', resetNoticeForm());

  noticeForm.addEventListener('submit', onSubmitNotice);

  checkRoomsCapacities();
  checkTypesPrices();

})();
