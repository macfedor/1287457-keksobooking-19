'use strict';

var getTestData = function () {
  var count = 8;
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var times = ['12:00', '13:00', '14:00'];
  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var areaWidth = document.querySelector('.map').offsetWidth;
  var maxRooms = 5;
  var maxGuests = 50;
  var maxPrice = 100500;
  var minPrice = 1;

  var createObj = function (numb) {
    var coordX = getRandomNumb(0, areaWidth);
    var coordY = getRandomNumb(130, 630);
    var obj = {
      'author': {
        'avatar': 'img/avatars/user0' + numb + '.png',
      },
      'offer': {
        'title': 'ЗАГОЛОВОК ' + numb,
        'address': coordX + ', ' + coordY,
        'price': getRandomNumb(minPrice, maxPrice),
        'type': types[getRandomNumb(0, types.length - 1)],
        'rooms': getRandomNumb(1, maxRooms),
        'guests': getRandomNumb(1, maxGuests),
        'checkin': times[getRandomNumb(0, times.length - 1)],
        'checkout': times[getRandomNumb(0, times.length - 1)],
        'features': getRandomArray(features),
        'description': 'строка с описанием',
        'photos': getRandomArray(photos)
      },
      'location': {
        'x': coordX,
        'y': coordY,
      }
    };
    return obj;
  };

  var createObjArray = function (length) {
    var array = [];
    for (var i = 1; i <= length; i++) {
      array.push(createObj(i));
    }
    return array;
  };

  return createObjArray(count);
};

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

var data = getTestData();

var addPin = function (pin, template) {
  var result = template.cloneNode(true);
  var coordX = pin.location.x - result.offsetWidth / 2;
  var coordY = pin.location.y - result.offsetHeight;
  var avatar = result.querySelector('img');
  avatar.setAttribute('alt', pin.offer.title);
  avatar.setAttribute('src', pin.author.avatar);
  result.setAttribute('style', 'left: ' + coordX + 'px; top: ' + coordY + 'px;');
  return result;
};

var hideElem = function (elem) {
  elem.classList.add('hidden');
};

var addCard = function (card, template) {
  var result = template.cloneNode(true);
  if (card.offer.title) {
    result.querySelector('.popup__title').textContent = card.offer.title;
  } else {
    hideElem(result.querySelector('.popup__title'));
  }
  if (card.offer.address) {
    result.querySelector('.popup__text--address').textContent = card.offer.address;
  } else {
    hideElem(result.querySelector('.popup__text--address'));
  }
  if (card.offer.price) {
    result.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  } else {
    hideElem(result.querySelector('.popup__text--price'));
  }
  if (card.offer.type) {
    var type;
    if (card.offer.type === 'flat') {
      type = 'Квартира';
    } else if (card.offer.type === 'bungalo') {
      type = 'Бунгало';
    } else if (card.offer.type === 'house') {
      type = 'Дом';
    } else if (card.offer.type === 'palace') {
      type = 'Дворец';
    }
    result.querySelector('.popup__type').textContent = type;
  } else {
    hideElem(result.querySelector('.popup__type'));
  }
  if (card.offer.rooms && card.offer.guests) {
    result.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  } else {
    hideElem(result.querySelector('.popup__text--capacity'));
  }
  if (card.offer.checkin && card.offer.checkout) {
    result.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  } else {
    hideElem(result.querySelector('.popup__text--time'));
  }
  if (card.offer.features) {
    var features = '';
    for (var i = 0; i < card.offer.features.length; i++) {
      features += '<li class="popup__feature popup__feature--' + card.offer.features[i] + '"></li>';
    }
    result.querySelector('.popup__features').innerHTML = features;
  } else {
    hideElem(result.querySelector('.popup__features'));
  }
  if (card.offer.description) {
    result.querySelector('.popup__description').textContent = card.offer.description;
  } else {
    hideElem(result.querySelector('.popup__description'));
  }
  if (card.offer.photos) {
    var photos = '';
    for (var j = 0; j < card.offer.photos.length; j++) {
      photos += '<img src="' + card.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
    }
    result.querySelector('.popup__photos').innerHTML = photos;
  } else {
    hideElem(result.querySelector('.popup__photos'));
  }
  if (card.author.avatar) {
    result.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);
  } else {
    hideElem(result.querySelector('.popup__avatar'));
  }
  return result;
};

var addData = function (array) {
  var fragmentPin = document.createDocumentFragment();
  var templatePin = document.querySelector('#pin').content.querySelector('button');
  var fragmentCard = document.createDocumentFragment();
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  for (var i = 0; i < array.length; i++) {
    fragmentPin.appendChild(addPin(array[i], templatePin));
    if (i === 0) {
      fragmentCard.appendChild(addCard(array[i], templateCard));
    }
  }
  document.querySelector('.map__pins').appendChild(fragmentPin);
  var referenceElement = document.querySelector('.map__filters-container');
  document.querySelector('.map').insertBefore(fragmentCard, referenceElement);
};

addData(data);
