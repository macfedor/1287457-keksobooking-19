'use strict';

(function () {

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
      var coordX = window.util.getRandomNumb(0, areaWidth);
      var coordY = window.util.getRandomNumb(130, 630);
      var obj = {
        'author': {
          'avatar': 'img/avatars/user0' + numb + '.png',
        },
        'offer': {
          'title': 'ЗАГОЛОВОК ' + numb,
          'address': coordX + ', ' + coordY,
          'price': window.util.getRandomNumb(minPrice, maxPrice),
          'type': types[window.util.getRandomNumb(0, types.length - 1)],
          'rooms': window.util.getRandomNumb(1, maxRooms),
          'guests': window.util.getRandomNumb(1, maxGuests),
          'checkin': times[window.util.getRandomNumb(0, times.length - 1)],
          'checkout': times[window.util.getRandomNumb(0, times.length - 1)],
          'features': window.util.getRandomArray(features),
          'description': 'строка с описанием',
          'photos': window.util.getRandomArray(photos)
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

  window.testData = getTestData;

})();
