import { sendData } from './server.js';
import { showSuccessMessage, showErrorMessage } from './util.js';
import { resetPage } from './map.js';
import { renderPreview } from './preview.js';

const IMG_WIDTH = 70;
const IMG_HEIGHT = 70;
const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_PRICE_VALUE = 1000000;
const COORDINATE_ROUNDING = 5;

const COORDINATES_DEFAULT = {
  lat: 35.67500,
  lng: 139.75000,
};

const MIN_PRICE_OF_TYPE = {
  bungalow: '0',
  flat: '1000',
  hotel: '3000',
  house: '5000',
  palace: '10000',
};

const form = document.querySelector('.ad-form');
const formFieldsets = form.querySelectorAll('fieldset');
const formType = form.querySelector('#type');
const formInputPrice = form.querySelector('#price');
const formTimein = form.querySelector('#timein');
const formTimeout = form.querySelector('#timeout');
const inputTitle = form.querySelector('#title');
const addressForm = form.querySelector('#address');
addressForm.value = `${COORDINATES_DEFAULT.lat}, ${COORDINATES_DEFAULT.lng}`;
const formRoomNumber = form.querySelector('#room_number');
const formCapacity = form.querySelector('#capacity');
const resetButton = form.querySelector('.ad-form__reset');
const fileChooserAvatar = form.querySelector('.ad-form-header__input');
const previewAvatar = form.querySelector('.js-preview-avatar');
const fileChooserPhoto = form.querySelector('.ad-form__input');
const previewPhotoContainer = form.querySelector('.ad-form__photo');

//создает элемент img для превью жилья
const renderImgContainer = () => {
  const previewPhoto = document.createElement('img');
  previewPhoto.width = IMG_WIDTH;
  previewPhoto.height = IMG_HEIGHT;
  previewPhoto.alt = 'Фото жилья';
  previewPhotoContainer.appendChild(previewPhoto);

  return previewPhoto;
};

renderPreview(fileChooserPhoto, renderImgContainer());//показывает превью жилья
renderPreview(fileChooserAvatar, previewAvatar);//показывает превью аватара

//валидация поля Заголовок объявления
inputTitle.addEventListener('input', () => {
  const valueLength = inputTitle.value.length;

  if (valueLength < MIN_TITLE_LENGTH) {
    inputTitle.style.borderColor = 'red';
    inputTitle.setCustomValidity('Напишите, пожалуйста, еще ' + (MIN_TITLE_LENGTH - valueLength) + ' симв.');
  } else if (valueLength > MAX_TITLE_LENGTH) {
    inputTitle.style.borderColor = 'red';
    inputTitle.setCustomValidity('Заголовок слишком длинный. Удалите, пожалуйста, ' + (valueLength - MAX_TITLE_LENGTH) + ' симв.');
  } else {
    inputTitle.style.borderColor = 'white';
    inputTitle.setCustomValidity('');
  }

  inputTitle.reportValidity();
});

//смена значения плейсхолдера поля Цена за ночь и его минимальное значение при смене активного значения в поле Тип жилья
formType.addEventListener('change', () => {
  formInputPrice.placeholder = MIN_PRICE_OF_TYPE[formType.value];
  formInputPrice.min = MIN_PRICE_OF_TYPE[formType.value];
});

//валидация поля Цена за ночь
formInputPrice.addEventListener('input', () => {
  const valuePrice = formInputPrice.value;

  if (valuePrice > MAX_PRICE_VALUE) {
    formInputPrice.style.borderColor = 'red';
    formInputPrice.setCustomValidity(`Максимальная цена за ночь - ${MAX_PRICE_VALUE} + руб.`);
  } else if (valuePrice < MIN_PRICE_OF_TYPE[formType.value]) {
    formInputPrice.style.borderColor = 'red';
    formInputPrice.setCustomValidity(`Минимальная цена за ночь - ${MIN_PRICE_OF_TYPE[formType.value]} руб.`);
  } else {
    formInputPrice.style.borderColor = 'white';
    formInputPrice.setCustomValidity('');
  }

  formInputPrice.reportValidity();
});

//валидация поля Количество комнат и количество мест
formRoomNumber.addEventListener('change', () => {
  const roomNumber = formRoomNumber.value;
  const capacity = formCapacity.value;

  if (roomNumber === '1' && capacity !== '1') {
    formCapacity.style.borderColor = 'red';
    formCapacity.setCustomValidity('В одной комнате мы можем разместить одного гостя.');
  } else if (roomNumber === '2' && capacity !== '1' && capacity !== '2') {
    formCapacity.style.borderColor = 'red';
    formCapacity.setCustomValidity('В двух комнатах мы можем разместить одного или двух гостей.');
  } else if (roomNumber === '3' && capacity !== '1' && capacity !== '2' && capacity !== '3') {
    formCapacity.style.borderColor = 'red';
    formCapacity.setCustomValidity('В трех комнатах мы можем разместить одного, двух или троих гостей.');
  } else if (roomNumber === '100' && capacity !== '0') {
    formCapacity.style.borderColor = 'red';
    formCapacity.setCustomValidity('Сто комнат не для гостей.');
  } else {
    formCapacity.style.borderColor = 'white';
    formInputPrice.setCustomValidity('');
  }

  formCapacity.reportValidity();
});

//смена выбранного элемента селекта полей Время заезда и выезда
formTimein.addEventListener('change', () => {
  const timeinOption = formTimein.selectedIndex;
  formTimeout[timeinOption].setAttribute('selected', 'selected');
});

formTimeout.addEventListener('change', () => {
  const timeoutOption = formTimeout.selectedIndex;
  formTimein[timeoutOption].setAttribute('selected', 'selected');
});

//передача координат главной метки в поле "Адрес (координаты)"
const getAddressCoordinates = (coordinates) => {
  addressForm.value = `${(coordinates.lat).toFixed(COORDINATE_ROUNDING)}, ${(coordinates.lng).toFixed(COORDINATE_ROUNDING)}`;
};

//неактивное состояние формы и фильтра для карты до загрузки карты.
form.classList.add('ad-form--disabled');
formFieldsets.forEach((fieldset) => fieldset.setAttribute('disabled', 'true'));

//отправляет форму
const setUserFormSubmit = (cb) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    sendData(
      () => {
        showSuccessMessage();
        resetPage();
        cb();
      },
      showErrorMessage,
      new FormData(evt.target),
    );
  })
};

//кнопка сброса данных формы и фильтра
const onButtonReset = (cb) => {
  resetButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    resetPage();
    cb();
  });
};

export { form, formFieldsets, getAddressCoordinates, onButtonReset, setUserFormSubmit };
