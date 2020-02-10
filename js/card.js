'use strict';

(function () {

  var addCard = function (card, template) {
    var result = template.cloneNode(true);
    if (card.offer.title) {
      result.querySelector('.popup__title').textContent = card.offer.title;
    } else {
      window.util.hideElem(result.querySelector('.popup__title'));
    }
    if (card.offer.address) {
      result.querySelector('.popup__text--address').textContent = card.offer.address;
    } else {
      window.util.hideElem(result.querySelector('.popup__text--address'));
    }
    if (card.offer.price) {
      result.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
    } else {
      window.util.hideElem(result.querySelector('.popup__text--price'));
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
      window.util.hideElem(result.querySelector('.popup__type'));
    }
    if (card.offer.rooms && card.offer.guests) {
      result.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    } else {
      window.util.hideElem(result.querySelector('.popup__text--capacity'));
    }
    if (card.offer.checkin && card.offer.checkout) {
      result.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
    } else {
      window.util.hideElem(result.querySelector('.popup__text--time'));
    }
    if (card.offer.features) {
      var features = '';
      for (var i = 0; i < card.offer.features.length; i++) {
        features += '<li class="popup__feature popup__feature--' + card.offer.features[i] + '"></li>';
      }
      result.querySelector('.popup__features').innerHTML = features;
    } else {
      window.util.hideElem(result.querySelector('.popup__features'));
    }
    if (card.offer.description) {
      result.querySelector('.popup__description').textContent = card.offer.description;
    } else {
      window.util.hideElem(result.querySelector('.popup__description'));
    }
    if (card.offer.photos) {
      var photos = '';
      for (var j = 0; j < card.offer.photos.length; j++) {
        photos += '<img src="' + card.offer.photos[j] + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
      }
      result.querySelector('.popup__photos').innerHTML = photos;
    } else {
      window.util.hideElem(result.querySelector('.popup__photos'));
    }
    if (card.author.avatar) {
      result.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);
    } else {
      window.util.hideElem(result.querySelector('.popup__avatar'));
    }

    var onClose = function () {
      result.classList.add('hidden');
    };

    var closeBtn = result.querySelector('.popup__close');
    closeBtn.addEventListener('click', onClose);

    return result;
  };

  var onDocumentEscPress = function (evt) {
    if (evt.key === window.util.keyEscape) {
      var activeCard = document.querySelector('.map__card.active');
      activeCard.classList.remove('active');
      activeCard.classList.add('hidden');
      document.removeEventListener('keydown', onDocumentEscPress);
    }
  };

  var showCard = function (title) {
    var popups = document.querySelectorAll('.map__card');
    for (var i = 0; i < popups.length; i++) {
      if (popups[i].querySelector('.popup__title').textContent === title) {
        popups[i].classList.remove('hidden');
        popups[i].classList.add('active');
      } else {
        popups[i].classList.add('hidden');
        popups[i].classList.remove('active');
      }
    }
    document.addEventListener('keydown', onDocumentEscPress);
  };

  window.card = {
    addCard: addCard,
    showCard: showCard
  };

})();
