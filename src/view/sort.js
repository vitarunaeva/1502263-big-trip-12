import AbstractView from '../abstract/simple-view.js';
import {SORT_TYPE} from '../const.js';

const createEventSorterTemplate = (selectedSortType) => {

  const sortItemsTemplate = Object
    .values(SORT_TYPE)
    .map((sortItem) =>
      `<div class="trip-sort__item  trip-sort__item--${sortItem}">
        <input type="radio" name="trip-sort" class="trip-sort__input  visually-hidden"
          id="sort-${sortItem}"
          value="${sortItem}"
          ${selectedSortType === sortItem ? `checked` : ``}
        >
        <label class="trip-sort__btn" for="sort-${sortItem}">
          ${sortItem.toUpperCase()}
        </label>
      </div>`)
    .join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">DAY</span>
        ${sortItemsTemplate}
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class EventSort extends AbstractView {
  constructor(initSortType) {
    super();

    this._initSortType = initSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createEventSorterTemplate(this._initSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._callback.sortTypeChange(evt.target.value);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
