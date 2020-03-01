'use strict';

(function () {
  var noticeForm = document.querySelector('.ad-form');
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var type = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var timein = noticeForm.querySelector('#timein');
  var timeout = noticeForm.querySelector('#timeout');
  var btnReset = noticeForm.querySelector('.ad-form__reset');
  var map = document.querySelector('.map');
  var filterForm = document.querySelector('.map__filters');
  var roomsGuestsMap = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var typesPricesMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var checkRoomsCapacities = function () {
    var activeValue = roomNumber.value;
    var availableGuests = roomsGuestsMap[activeValue];
    var capacityValues = capacity.querySelectorAll('option');
    capacityValues.forEach(function (elem) {
      if (availableGuests.indexOf(elem.value) === -1) {
        elem.removeAttribute('selected');
        elem.disabled = true;
      } else {
        elem.disabled = false;
      }
    });
    var capacityActive = capacity.querySelector('option:checked');
    var customValidity = capacityActive.disabled === true ? 'Выберите из доступных вариантов для выбранного количества комнат' : '';
    capacity.setCustomValidity(customValidity);
  };

  var checkTypesPrices = function () {
    var activeType = type.value;
    var minPrice = typesPricesMap[activeType];
    price.setAttribute('placeholder', minPrice);
    price.setAttribute('min', minPrice);
  };

  var onTimesChange = function (evt) {
    var activeValue = evt.target.value;
    timein.value = activeValue;
    timeout.value = activeValue;
  };

  var resetPage = function () {
    noticeForm.reset();
    filterForm.reset();
    window.util.setAbleFormElems(noticeForm);
    map.classList.add('map--faded');
    window.map.preparePage(window.util.afterSendModeName);
    checkRoomsCapacities();
    checkTypesPrices();
    noticeForm.classList.add('ad-form--disabled');
    document.removeEventListener('keydown', window.card.onDocumentEscPress);
    window.map.setDefaultPosition();
  };

  var submitSuccess = function (string) {
    window.util.onBackendSuccess(string);
    resetPage();
  };

  var onNoticeSubmit = function (evtSubmit) {
    evtSubmit.preventDefault();
    var formData = new FormData(noticeForm);
    window.backend.save(formData, submitSuccess, window.util.onBackendError);
  };

  var avatarUpload = noticeForm.querySelector('#avatar');
  var avatarPreview = noticeForm.querySelector('.ad-form-header__preview img');

  avatarUpload.addEventListener('change', function () {
    window.util.insertImage(avatarUpload, avatarPreview);
  });

  var photoUpload = noticeForm.querySelector('#images');
  var photoPreview = noticeForm.querySelector('.ad-form__photo');

  photoUpload.addEventListener('change', function () {
    window.util.insertImage(photoUpload, photoPreview);
  });

  var noticeCheckboxes = noticeForm.querySelectorAll('input[type=checkbox]');
  noticeCheckboxes.forEach(function (item) {
    item.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.keyEnter) {
        evt.preventDefault();
        item.toggleAttribute('checked');
      }
    });
  });

  roomNumber.addEventListener('change', function () {
    checkRoomsCapacities();
  });

  capacity.addEventListener('change', function () {
    checkRoomsCapacities();
  });

  type.addEventListener('change', function () {
    checkTypesPrices();
  });

  timein.addEventListener('change', onTimesChange);
  timeout.addEventListener('change', onTimesChange);

  btnReset.addEventListener('click', resetPage);

  noticeForm.addEventListener('submit', onNoticeSubmit);

  checkRoomsCapacities();
  checkTypesPrices();

})();
