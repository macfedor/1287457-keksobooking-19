'use strict';

(function () {

  var MARKER = '___marker___';
  var offerTypeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var checkProperty = function (property, selector, callback, block, contentAddition, customContent) {
    var parentBlock = block || document;
    if (property) {
      callback(parentBlock, property, selector, contentAddition, customContent);
    } else {
      window.util.hideElem(parentBlock.querySelector(selector));
    }
  };

  var setTextContent = function (block, property, selector, contentAddition, customContent) {
    var parentBlock = block || document;
    var content = customContent || property;
    parentBlock.querySelector(selector).textContent = content;
    if (contentAddition) {
      parentBlock.querySelector(selector).textContent += contentAddition;
    }
  };

  var setSrc = function (block, property, selector) {
    var parentBlock = block || document;
    parentBlock.querySelector(selector).setAttribute('src', property);
  };

  var setHTMLFromArray = function (block, property, selector, HTMLCode) {
    var parentBlock = block || document;
    var content = '';
    for (var i = 0; i < property.length; i++) {
      content += HTMLCode.replace(MARKER, property[i]);
    }
    parentBlock.querySelector(selector).innerHTML = content;
  };

  var addCard = function (card, template) {
    var result = template.cloneNode(true);
    checkProperty(card.offer.title, '.popup__title', setTextContent, result);
    checkProperty(card.offer.address, '.popup__text--address', setTextContent, result);
    checkProperty(card.offer.price, '.popup__text--price', setTextContent, result, '₽/ночь');
    checkProperty(card.offer.description, '.popup__description', setTextContent, result);
    checkProperty(card.offer.type, '.popup__type', setTextContent, result, '', offerTypeMap[card.offer.type]);
    checkProperty(card.author.avatar, '.popup__avatar', setSrc, result);
    checkProperty(card.offer.features, '.popup__features', setHTMLFromArray, result, '<li class="popup__feature popup__feature--' + MARKER + '"></li>');
    checkProperty(card.offer.photos, '.popup__photos', setHTMLFromArray, result, '<img src="' + MARKER + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">');

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
    popups.forEach(function (elem) {
      if (elem.querySelector('.popup__title').textContent === title) {
        elem.classList.remove('hidden');
        elem.classList.add('active');
      } else {
        elem.classList.add('hidden');
        elem.classList.remove('active');
      }
    });
    document.addEventListener('keydown', onDocumentEscPress);
  };

  window.card = {
    addCard: addCard,
    showCard: showCard,
    onDocumentEscPress: onDocumentEscPress
  };

})();
