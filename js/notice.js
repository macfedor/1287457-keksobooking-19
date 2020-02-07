'use strict';

(function () {

  var noticeForm = document.querySelector('.ad-form');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var roomsGuests = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
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

  roomNumber.addEventListener('change', function () {
    checkRoomsCapacities();
  });

  capacity.addEventListener('change', function () {
    checkRoomsCapacities();
  });

  window.notice = {
    enableFormElems: enableFormElems,
    disableFormElems: disableFormElems,
    checkRoomsCapacities: checkRoomsCapacities
  };

})();
