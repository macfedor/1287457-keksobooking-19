'use strict';

(function () {

  var noticeForm = document.querySelector('.ad-form');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var type = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var timein = noticeForm.querySelector('#timein');
  var timeout = noticeForm.querySelector('#timeout');
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

  var disableFormElems = function () {
    var fields = noticeForm.querySelectorAll('fieldset');
    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = true;
    }
  };

  var enableFormElems = function () {
    var fields = noticeForm.querySelectorAll('fieldset');
    for (var i = 0; i < fields.length; i++) {
      fields[i].disabled = false;
    }
  };

  var checkRoomsCapacities = function () {
    var activeValue = roomNumber.value;
    var availableGuests = roomsGuests[activeValue];
    var capacityValues = capacity.querySelectorAll('option');
    for (var i = 0; i < capacityValues.length; i++) {
      if (availableGuests.indexOf(capacityValues[i].value) === -1) {
        capacityValues[i].removeAttribute('selected');
        capacityValues[i].disabled = true;
      } else {
        capacityValues[i].disabled = false;
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

  window.notice = {
    enableFormElems: enableFormElems,
    disableFormElems: disableFormElems,
    checkRoomsCapacities: checkRoomsCapacities,
    checkTypesPrices: checkTypesPrices
  };

})();
