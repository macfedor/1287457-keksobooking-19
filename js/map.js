'use strict';

(function () {

  var MAX_Y = 630;
  var MIN_Y = 130;
  var MAX_PIN_COUNT = 5;
  var ANY_OPTION_NAME = 'any';
  var LOW_PRICE_NAME = 'low';
  var HIGH_PRICE_NAME = 'high';
  var PRICE_FILTER_NAME = 'housing-price';
  var mainPin = document.querySelector('.map__pin--main');
  var mainPinImg = mainPin.querySelector('img');
  var mainPinWidth = mainPin.offsetWidth;
  var mainPinHeight = mainPinImg.offsetHeight + Number(getComputedStyle(mainPin, 'after').height.replace('px', ''));
  var mainPinDefaultCoordX = Math.floor(mainPin.offsetLeft - mainPin.offsetWidth / 2);
  var mainPinDefaultCoordY = Math.floor(mainPin.offsetTop - mainPin.offsetHeight / 2);
  var mainPinDefaultPositionX = mainPin.offsetLeft;
  var mainPinDefaultPositionY = mainPin.offsetTop;
  var map = document.querySelector('.map');
  var noticeForm = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var filterItems = filterForm.querySelectorAll('select, input');

  var filterNamesMap = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };
  var pricesMap = {
    'low': {
      'name': 'low',
      'value': 10000
    },
    'middle': {
      'name': 'middle'
    },
    'high': {
      'name': 'high',
      'value': 50000
    }
  };
  var addressInput = noticeForm.querySelector('#address');
  var mapWidth = map.offsetWidth;
  var backendData; // переменная для хранения данных с сервера

  var onPinClick = function (evt) {
    var pin = evt.target.closest('button');
    var img = pin.querySelector('img');
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    pin.classList.add('map__pin--active');
    window.card.showCard(img.alt);
  };

  var addPin = function (pin, template) {
    var result = template.cloneNode(true);
    var avatar = result.querySelector('img');
    avatar.setAttribute('alt', pin.offer.title);
    avatar.setAttribute('src', pin.author.avatar);
    result.setAttribute('style', 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;transform:translate(-50%, -100%)');
    result.addEventListener('mousedown', onPinClick);
    result.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.keyEnter) {
        onPinClick(evt);
      }
    });
    return result;
  };

  var removeElements = function (selector, unlessClassName) { // удаляем все элементы по селектору. кроме элементов с классом в unlessClassName
    var elems = map.querySelectorAll(selector);
    elems.forEach(function (elem) {
      if (!elem.classList.contains(unlessClassName)) {
        elem.remove();
      }
    });
  };

  var addData = function (array) {
    var fragmentPin = document.createDocumentFragment();
    var templatePin = document.querySelector('#pin').content.querySelector('button');
    var fragmentCard = document.createDocumentFragment();
    var templateCard = document.querySelector('#card').content.querySelector('.map__card');
    array.forEach(function (elem) {
      if (elem.offer) {
        fragmentPin.appendChild(addPin(elem, templatePin));
        fragmentCard.appendChild(window.card.addCard(elem, templateCard));
      }
    });
    document.querySelector('.map__pins').appendChild(fragmentPin);
    var referenceElement = document.querySelector('.map__filters-container');
    document.querySelector('.map').insertBefore(fragmentCard, referenceElement);
    window.util.setAbleFormElems(filterForm, true);
  };

  var redrawMap = function (data) {
    removeElements('.map__pin, .map__card.popup', 'map__pin--main');
    addData(data);
  };

  var getEnabledPinCoords = function () {
    var coordX = Math.floor(mainPin.offsetLeft + mainPinWidth / 2);
    var coordY = Math.floor(mainPin.offsetTop + mainPinHeight);
    addressInput.value = coordX + ', ' + coordY;
  };

  var setDefaultPosition = function () {
    addressInput.value = mainPinDefaultCoordX + ', ' + mainPinDefaultCoordY;
    mainPin.style.left = mainPinDefaultPositionX + 'px';
    mainPin.style.top = mainPinDefaultPositionY + 'px';
  };

  var activatePage = function (mode) {
    window.util.setAbleFormElems(noticeForm, true);
    map.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    getEnabledPinCoords();

    mainPin.removeEventListener('mousedown', onInactiveMainPinClick);
    mainPin.addEventListener('mousedown', onActiveMainPinClick);
    if (mode === window.util.afterSendModeName) { // если мы уже загружали точки, то сейчас вытаскиваем данные из переменной
      filterData(backendData);
    } else {
      window.backend.load(filterData, window.util.onBackendError);
    }
  };

  var preparePage = function (mode) {
    window.util.setAbleFormElems(noticeForm);
    window.util.setAbleFormElems(filterForm);
    setDefaultPosition();
    if (mode === window.util.afterSendModeName) { // удаляем с карты отрисованные данные
      removeElements('.map__pin', 'map__pin--main');
      removeElements('.map__card.popup');
      mainPin.addEventListener('mousedown', onInactiveMainPinNewClick);
    } else {
      mainPin.addEventListener('mousedown', onInactiveMainPinClick);
    }
  };

  var getPriceRange = function (priceType, offerValue, priceValue) {
    var result;
    switch (priceType) {
      case LOW_PRICE_NAME:
        result = offerValue < priceValue;
        break;
      case HIGH_PRICE_NAME:
        result = offerValue > priceValue;
        break;
      default:
        result = offerValue >= pricesMap[LOW_PRICE_NAME].value && offerValue <= pricesMap[HIGH_PRICE_NAME].value;
    }
    return result;
  };

  var filterData = function (array) {
    if (!backendData) { // записываем полученные от сервера данные в переменную, если она пустая
      backendData = array;
    }
    var result = array;
    filterItems.forEach(function (item) {
      if (item.checked) {
        result = result.filter(function (elem) {
          return elem.offer.features.indexOf(item.value) !== -1;
        });
      } else if (item.value !== ANY_OPTION_NAME && item.type !== 'checkbox') {
        result = result.filter(function (elem) {
          if (item.name === PRICE_FILTER_NAME) {
            var priceType = pricesMap[item.value].name;
            var offerValue = elem.offer[filterNamesMap[item.name]];
            var priceValue = pricesMap[item.value].value;
            return getPriceRange(priceType, offerValue, priceValue);
          } else {
            return window.util.comparePrimitives(elem.offer[filterNamesMap[item.name]], item.value);
          }
        });
      }
    });
    result = result.slice(0, MAX_PIN_COUNT);
    redrawMap(result);
  };

  filterItems.forEach(function (item) {
    item.addEventListener('change', function () {
      onFilterItemChange();
    });
  });

  var filterCheckboxes = filterForm.querySelectorAll('input[type=checkbox]');
  filterCheckboxes.forEach(function (item) {
    item.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.keyEnter) {
        item.toggleAttribute('checked');
        onFilterItemChange();
      }
    });
  });

  var onFilterItemChange = window.debounce(function () {
    filterData(backendData);
  });

  var onInactiveMainPinClick = function (evt) {
    if (evt.button === window.util.mouseLeft) {
      activatePage();
      mainPin.removeEventListener('mousedown', onInactiveMainPinClick);
    }
  };

  var onInactiveMainPinNewClick = function (evt) {
    if (evt.button === window.util.mouseLeft) {
      activatePage(window.util.afterSendModeName);
      mainPin.removeEventListener('mousedown', onInactiveMainPinNewClick);
    }
  };

  var onActiveMainPinClick = function (evt) {
    var currentCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseUp = function () {
      getEnabledPinCoords();
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };

    var onMouseMove = function (evtMove) {
      var shift = {
        x: currentCoords.x - evtMove.clientX,
        y: currentCoords.y - evtMove.clientY
      };
      currentCoords = {
        x: evtMove.clientX,
        y: evtMove.clientY
      };
      var resultY = mainPin.offsetTop - shift.y;
      var resultX = mainPin.offsetLeft - shift.x;
      if (resultY < MIN_Y - mainPinHeight) {
        resultY = MIN_Y - mainPinHeight;
      } else if (resultY > MAX_Y - mainPinHeight) {
        resultY = MAX_Y - mainPinHeight;
      }
      if (resultX + mainPinWidth / 2 < 0) {
        resultX = Math.round(-mainPinWidth / 2);
      } else if (resultX + mainPinWidth / 2 > mapWidth) {
        resultX = Math.round(mapWidth - mainPinWidth / 2);
      }
      mainPin.style.top = resultY + 'px';
      mainPin.style.left = resultX + 'px';
      getEnabledPinCoords();
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
  };

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === window.util.keyEnter) {
      activatePage();
    }
  });

  preparePage();

  window.map = {
    preparePage: preparePage,
    setDefaultPosition: setDefaultPosition
  };

})();
