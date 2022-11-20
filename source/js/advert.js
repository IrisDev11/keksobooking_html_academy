const cardTemplate = document.querySelector('#card').content.querySelector('.popup');

const createListType = (types) => {
  let type = '';

  switch(types) {
    case 'flat':
      type = 'Квартира';
      break;
    case 'bungalow':
      type = 'Бунгало';
      break;
    case 'house':
      type = 'Дом';
      break;
    case 'palace':
      type = 'Дворец';
      break;
  }
  return type;
};

const getRoomsEnding = (roomCount) => {
  switch (roomCount) {
    case 1:
      return 'комната';
    case 2:
    case 3:
    case 4:
      return 'комнаты';
    default:
      return 'комнат';
  }
};

const getGuestsEnding = (guestCount) => {
  if (guestCount === 0) {
    return 'не для гостей';
  }
  if (guestCount > 1) {
    return `для ${guestCount} гостей`;
  }
  return `для ${guestCount} гостя`;
};

const createFeaturesList = (features) => {
  let newFeaturesList = document.createDocumentFragment();

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const newFeatureItem = document.createElement('li');
    newFeatureItem.classList.add('popup__feature', `popup__feature--${feature}`);
    newFeaturesList.appendChild(newFeatureItem);
  }
  return newFeaturesList;
};

const createPhotosList = (photos) => {
  let newPhotosList = document.createDocumentFragment();

  for (let i = 0; i < photos.length; i++) {
    const newPhotoItem = document.createElement('img');
    newPhotoItem.classList.add('popup__photo');
    newPhotoItem.src = photos[i];
    newPhotoItem.alt = 'Фотография жилья';
    newPhotoItem.setAttribute('width', '45');
    newPhotoItem.setAttribute('height', '40');
    newPhotosList.appendChild(newPhotoItem);
  }
  return newPhotosList;
};

const createAdvert = ({
  author,
  offer,
}) => {
  const advert = cardTemplate.cloneNode(true);

  advert.querySelector('.popup__avatar').src = author.avatar || '';
  advert.querySelector('.popup__title').textContent = offer.title || '';
  advert.querySelector('.popup__text--address').textContent = offer.address || '';
  advert.querySelector('.popup__text--price').textContent = `${offer.price} ₽/ночь` || '';
  advert.querySelector('.popup__type').textContent = createListType(offer.type) || '';
  advert.querySelector('.popup__text--capacity').textContent = (!offer.rooms || !Number.isInteger(offer.guests)) ? '' : `${offer.rooms} ${getRoomsEnding(offer.rooms)} ${getGuestsEnding(offer.guests)}`;
  advert.querySelector('.popup__text--time').textContent = (!offer.checkin || !offer.checkout) ? '' : `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  advert.querySelector('.popup__description').textContent = offer.description || '';

  const advertFeatures = advert.querySelector('.popup__features');
  advertFeatures.innerHTML = '';
  if (offer.features) {
    const newFeatureElements = createFeaturesList(offer.features);
    advertFeatures.appendChild(newFeatureElements);
  } else {
    advertFeatures.remove();
  }

  const advertPhotos = advert.querySelector('.popup__photos');
  advertPhotos.innerHTML = '';
  if (offer.photos) {
    const newPhotoElements = createPhotosList(offer.photos);
    advertPhotos.appendChild(newPhotoElements);
  } else {
    advertPhotos.remove();
  }

  return advert;
};

export { createAdvert };
