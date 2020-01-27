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
  var coordX = getRandomNumb(0, areaWidth);
  var coordY = getRandomNumb(130, 630);

  var createObj = function (numb) {
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

var addData = function (array) {
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#pin').content.querySelector('button');
  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(addPin(array[i], template));
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

addData(data);
