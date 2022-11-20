import { debounce } from './util.js';
import { getData } from './server.js';
import { onButtonReset, setUserFormSubmit } from './form.js';
import { renderMap, mainMarkerCoordinates } from './map.js';
import { makesFiltersInactive, makesFiltersActive, checkFilters, changeFilters } from './filter.js';

const TIMEOUT_DELAY = 500;

makesFiltersInactive(); //переводит фильтры в неактивное состояние
renderMap(); //загружает карту
mainMarkerCoordinates(); //передает координаты главной метки в поле адрес
makesFiltersActive(); // При успешной загрузке карты фильтр для карты переключается в активное состояние

getData((ads) => {
  checkFilters(ads),
  changeFilters(debounce(() => checkFilters(ads), TIMEOUT_DELAY));
  setUserFormSubmit(() => checkFilters(ads));
  onButtonReset(() => checkFilters(ads));
});
