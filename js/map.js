'use strict';

(function () {

  var MAX_Y = 630;
  var MIN_Y = 130;
  var mainPin = document.querySelector('.map__pin--main');
  var mainPinImg = mainPin.querySelector('img');
  var mainPinWidth = mainPin.offsetWidth;
  var mainPinHeight = mainPinImg.offsetHeight + Number(getComputedStyle(mainPin, 'after').height.replace('px', ''));
  var map = document.querySelector('.map');
  var noticeForm = document.querySelector('.ad-form');
  var addressInput = noticeForm.querySelector('#address');
  var mapWidth = map.offsetWidth;

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

  var addData = function (array) {
    var fragmentPin = document.createDocumentFragment();
    var templatePin = document.querySelector('#pin').content.querySelector('button');
    var fragmentCard = document.createDocumentFragment();
    var templateCard = document.querySelector('#card').content.querySelector('.map__card');
    for (var i = 0; i < array.length; i++) {
      if (array[i].offer) {
        fragmentPin.appendChild(addPin(array[i], templatePin));
        fragmentCard.appendChild(window.card.addCard(array[i], templateCard));
      }
    }
    document.querySelector('.map__pins').appendChild(fragmentPin);
    var referenceElement = document.querySelector('.map__filters-container');
    document.querySelector('.map').insertBefore(fragmentCard, referenceElement);
  };

  var getEnabledPinCoords = function () {
    var coordX = Math.floor(mainPin.offsetLeft + mainPinWidth / 2);
    var coordY = Math.floor(mainPin.offsetTop + mainPinHeight);
    addressInput.value = coordX + ', ' + coordY;
  };

  var getDefaultPosition = function () {
    var coordX = Math.floor(mainPin.offsetLeft - mainPin.offsetWidth / 2);
    var coordY = Math.floor(mainPin.offsetTop - mainPin.offsetHeight / 2);
    return coordX + ', ' + coordY;
  };

  var activatePage = function () {
    window.notice.enableFormElems();
    window.filter.enableFilters();
    map.classList.remove('map--faded');
    noticeForm.classList.remove('ad-form--disabled');
    window.backend.load(addData, window.util.createInfo);
    getEnabledPinCoords();
    window.notice.checkRoomsCapacities();
    window.notice.checkTypesPrices();

    mainPin.removeEventListener('mousedown', onClickInactiveMainPin);
    mainPin.addEventListener('mousedown', onClickActiveMainPin);
  };

  var preparePage = function () {
    window.notice.disableFormElems();
    window.filter.disableFilters();
    addressInput.value = getDefaultPosition();
    mainPin.addEventListener('mousedown', onClickInactiveMainPin);
  };

  var onClickInactiveMainPin = function (evt) {
    if (evt.button === window.util.mouseLeft) {
      activatePage();
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

})();
