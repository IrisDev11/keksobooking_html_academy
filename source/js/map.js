import { form, formFieldsets, getAddressCoordinates } from './form.js';
import { createAdvert } from './advert.js';
import { mapFilters } from './filter.js';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MAP_LIB = L;
const ZOOM_MAP = 12;

const COORDINATES_DEFAULT = {
  lat: 35.67500,
  lng: 139.75000,
};

const mapCanvas = document.querySelector('#map-canvas');

//переводит форму в активное состояние
const makesStateActive = () => {
  form.classList.remove('ad-form--disabled');
  formFieldsets.forEach((fieldset) => fieldset.disabled = false);
};

//подключает карту
const map = MAP_LIB.map(mapCanvas);

const renderMap = () => {
  map.on('load', () => {
    makesStateActive();
  })
    .setView(COORDINATES_DEFAULT, ZOOM_MAP);

  MAP_LIB.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);
};

//главная метка
const mainPinIcon = MAP_LIB.icon({
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

//метка объявлений
const pinAdIcon = MAP_LIB.icon({
  iconUrl: '../img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

//добавляем главную метку на карту
const mainPinMarker = MAP_LIB.marker(
  COORDINATES_DEFAULT,
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);

//определение координат при передвижении метки по карте
const mainMarkerCoordinates = () => mainPinMarker.on('move', (evt) => {
  const points = evt.target.getLatLng();
  getAddressCoordinates(points);
});

//создаем слой с группой меток
const markerGroup = MAP_LIB.layerGroup().addTo(map);

//создаем метки по данным полученным с сервера
const createPinMarker = (offers) => {
  offers.forEach((offer) => {
    const marker = L.marker(
      {
        lat: offer.location.lat,
        lng: offer.location.lng,
      },
      {
        icon: pinAdIcon,
      });

    marker.addTo(markerGroup) //добавляем метки на карту
      .bindPopup(
        createAdvert(offer),  //заполняем балун данными с сервера
        {
          keepInView: true, //карта автоматически перемещается, если всплывающий балун-объявление не помещается и вылезает за границы
        },
      );
  });
};

//возвращение формы и карты в дефолтное состояние после отправки формы
const resetPage = () => {
  mainPinMarker.setLatLng(COORDINATES_DEFAULT);
  map.setView(COORDINATES_DEFAULT, ZOOM_MAP);
  form.reset();
  getAddressCoordinates(COORDINATES_DEFAULT);
  mapFilters.reset();
  clearMarker();
};

//очищение слоя с метками объявлений
const clearMarker = () => markerGroup.clearLayers();

export { renderMap, resetPage, clearMarker, mainMarkerCoordinates, createPinMarker };
