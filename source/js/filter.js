import { clearMarker, createPinMarker } from './map.js';

const DEFAULT_VALUE = 'any';
const MAX_OFFERS = 10;

const priceMapFilter = {
  low: {
    start: 0,
    end: 10000,
  },
  middle: {
    start: 10000,
    end: 50000,
  },
  high: {
    start: 50000,
    end: 1000000,
  },
};

const mapFilters = document.querySelector('.map__filters');
const mapFiltersChild = mapFilters.children;
const typeFilter = mapFilters.querySelector('#housing-type');
const priceFilter = mapFilters.querySelector('#housing-price');
const roomsFilter = mapFilters.querySelector('#housing-rooms');
const guestsFilter = mapFilters.querySelector('#housing-guests');
const featuresFilter = mapFilters.querySelectorAll('.map__checkbox');

//переводит фильтры в неактивное состояние
const makesFiltersInactive = () => {
  mapFilters.classList.add('map__filters--disabled');

  for (let child of mapFiltersChild) {
    child.setAttribute('disabled', 'true');
  }
};

//переводит фильтры в активное состояние
const makesFiltersActive = () => {
  mapFilters.classList.remove('map__filters--disabled');

  for (let child of mapFiltersChild) {
    child.disabled = false;
  }
};

const checkType = (ad) => typeFilter.value === ad.offer.type || typeFilter.value === DEFAULT_VALUE;

const checkPrice = (ad) => priceFilter.value === DEFAULT_VALUE || (ad.offer.price >= priceMapFilter[priceFilter.value].start && ad.offer.price <= priceMapFilter[priceFilter.value].end);

const checkRooms = (ad) => ad.offer.rooms === +roomsFilter.value || roomsFilter.value === DEFAULT_VALUE;

const checkGuests = (ad) => ad.offer.guests === +guestsFilter.value || guestsFilter.value === DEFAULT_VALUE;

const checkFeatures = (ad) => Array.from(featuresFilter)
  .every((filterFeature) => {
    if (!filterFeature.checked) {
      return true;
    }
    if (!ad.offer.features) {
      return false;
    }
    return ad.offer.features.includes(filterFeature.value);
  });

const checkFilters = (ads)  => {
  const filteredData = [];
  for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];
    if (
      checkType(ad) &&
      checkPrice(ad) &&
      checkRooms(ad) &&
      checkGuests(ad) &&
      checkFeatures(ad)
    ) {
      filteredData.push(ad);
    }
    if (filteredData.length === MAX_OFFERS) {
      break;
    }
  }
  createPinMarker(filteredData);
};

const changeFilters = (cb) => {
  mapFilters.addEventListener('change', () => {
    clearMarker(),
    cb();
  });
};

export { mapFilters, checkFilters, changeFilters, makesFiltersInactive, makesFiltersActive };
