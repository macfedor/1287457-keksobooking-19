'use strict';

(function () {

  var mainPin = document.querySelector('.map__pin--main');
  var mainPinImg = mainPin.querySelector('img');
  var mainPinWidth = mainPin.offsetWidth;
  var mainPinHeight = mainPinImg.offsetHeight + Number(getComputedStyle(mainPin, 'after').height.replace('px', ''));
  var map = document.querySelector('.map');
  var noticeForm = document.querySelector('.ad-form');
  var addressInput = noticeForm.querySelector('#address');

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
    var coordX = Math.floor(mainPin.offsetLeft - mainPinWidth / 2);
    var coordY = Math.floor(mainPin.offsetTop - mainPinHeight);
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
  };

  var preparePage = function () {
    window.notice.disableFormElems();
    window.filter.disableFilters();
    addressInput.value = getDefaultPosition();
  };

  mainPin.addEventListener('mousedown', function (evt) {
    if (evt.button === window.util.mouseLeft) {
      activatePage();
    }
  });

  mainPin.addEventListener('keydown', function (evt) {
    if (evt.key === window.util.keyEnter) {
      activatePage();
    }
  });

  preparePage();

})();
