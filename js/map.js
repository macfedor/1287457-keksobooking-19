'use strict';

(function () {

  var MAX_Y = 630;
  var MIN_Y = 130;
  var MAX_PIN_COUNT = 5;
  var ANY_OPTION_NAME = 'any';
  var mainPin = document.querySelector('.map__pin--main');
  var mainPinImg = mainPin.querySelector('img');
  var mainPinWidth = mainPin.offsetWidth;
  var mainPinHeight = mainPinImg.offsetHeight + Number(getComputedStyle(mainPin, 'after').height.replace('px', ''));
  var map = document.querySelector('.map');
  var noticeForm = document.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var filterItems = filterForm.querySelectorAll('select, input');
  var filterGlossary = {
    'housing-type': 'type'
  };
  var addressInput = noticeForm.querySelector('#address');
  var mapWidth = map.offsetWidth;
  var backendData;

  var onClickPin = function (evt) {
    var pin = evt.target.closest('button');
    var img = pin.querySelector('img');
    window.card.showCard(img.alt);
  };

  var addPin = function (pin, template) {
    var result = template.cloneNode(true);
    var coordX = pin.location.x - result.offsetWidth / 2;
    var coordY = pin.location.y - result.offsetHeight;
    var avatar = result.querySelector('img');
    avatar.setAttribute('alt', pin.offer.title);
    avatar.setAttribute('src', pin.author.avatar);
    result.setAttribute('style', 'left: ' + coordX + 'px; top: ' + coordY + 'px;');
    result.addEventListener('mousedown', onClickPin);
    result.addEventListener('keydown', function (evt) {
      if (evt.key === window.util.keyEnter) {
        onClickPin(evt);
      }
    });
    return result;
  };

  var removeElems = function (selector, unlessClassName) { // удаляем все элементы по селектору. кроме элементов с классом в unlessClassName
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
    removeElems('.map__pin, .map__card.popup', 'map__pin--main');
    addData(data);
  };

  var getEnabledPinCoords = function () {
    var coordX = Math.floor(mainPin.offsetLeft + mainPinWidth / 2);
    var coordY = Math.floor(mainPin.offsetTop + mainPinHeight);
    addressInput.value = coordX + ', ' + coordY;
  };

  var getDefaultPosition = function () {
    var coordX = Math.floor(mainPin.offsetLeft - mainPin.offsetWidth / 2);
    var coordY = Math.floor(mainPin.offsetTop - mainPin.offsetHeight / 2);
    addressInput.value = coordX + ', ' + coordY;
  };

  var activatePage = function (mode) {
    window.util.setAbleFormElems(noticeForm, true);
    map.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    getEnabledPinCoords();

    mainPin.removeEventListener('mousedown', onClickInactiveMainPin);
    mainPin.addEventListener('mousedown', onClickActiveMainPin);
    if (mode === window.util.afterSendModeName) { // если мы уже загружали точки, то сейчас вытаскиваем данные из переменной
      filterData(backendData);
    } else {
      window.backend.load(filterData, window.util.onBackendError);
    }
  };

  var preparePage = function (mode) {
    window.util.setAbleFormElems(noticeForm);
    window.util.setAbleFormElems(filterForm);
    getDefaultPosition();
    if (mode === window.util.afterSendModeName) { // удаляем с карты отрисованные данные
      removeElems('.map__pin', 'map__pin--main');
      removeElems('.map__card.popup');
      mainPin.addEventListener('mousedown', onAnotherClickInactiveMainPin);
    } else {
      mainPin.addEventListener('mousedown', onClickInactiveMainPin);
    }
  };

  var filterData = function (array, filterName, filterValue) {
    if (!backendData) {
      backendData = array;
    }
    var result = array;
    if (filterName && filterValue && filterValue !== ANY_OPTION_NAME) {
      result = result.filter(function (item) {
        return item.offer[filterGlossary[filterName]] === filterValue;
      });
    }
    result = result.slice(0, MAX_PIN_COUNT);
    redrawMap(result);
  };

  filterItems.forEach(function (item) {
    item.addEventListener('change', function () {
      filterData(backendData, item.name, item.value);
    });
  });

  var onClickInactiveMainPin = function (evt) {
    if (evt.button === window.util.mouseLeft) {
      activatePage();
      mainPin.removeEventListener('mousedown', onClickInactiveMainPin);
    }
  };

  var onAnotherClickInactiveMainPin = function (evt) {
    if (evt.button === window.util.mouseLeft) {
      activatePage(window.util.afterSendModeName);
      mainPin.removeEventListener('mousedown', onAnotherClickInactiveMainPin);
    }
  };

  var onClickActiveMainPin = function (evt) {
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
    activatePage: activatePage,
    preparePage: preparePage,
    getDefaultPosition: getDefaultPosition
  };

})();
