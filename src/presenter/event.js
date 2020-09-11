import EventSortView from "../view/sort";
import TripDayView from "../view/trip-days";
import NoPointsView from '../view/no-points.js';
import PointPresenter from './point.js';
import {getSorterRule, groupEvents, convertToNullableDate} from '../utils/trip.js';
import {SORT_TYPE, RenderPosition} from '../const.js';
import {remove, render} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SORT_TYPE.EVENT;
    this._dayStorage = Object.create(null);
    this._pointStorage = Object.create(null);
    this._eventSorterComponent = new EventSortView(this._currentSortType);
    this._noPointsComponent = new NoPointsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleTripEventChange = this._handleTripEventChange.bind(this);
  }

  init(tripEvents, offersList) {
    this._tripEvents = tripEvents.slice();
    this._offersList = offersList;

    this._renderTripBoard();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
    this._eventSorterComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleModeChange() {
    Object
      .values(this._pointStorage)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTripEventChange(updatedTripEvent) {
    this._tripEvents = updateItem(this._tripEvents, updatedTripEvent);
    this._pointStorage[updatedTripEvent.id].init(updatedTripEvent, this._offersList);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (sortType === SORT_TYPE.EVENT) {
      this._eventSorterComponent._element.querySelector(`.trip-sort__item--day`).style.visibility = ``;
    } else {
      this._eventSorterComponent._element.querySelector(`.trip-sort__item--day`).style.visibility = `hidden`;
    }

    this._clearEvents();

    this._currentSortType = sortType;
    const sortedEvents = this._tripEvents.sort(getSorterRule(this._currentSortType));

    this._renderEvents(sortedEvents);
  }

  _renderNoPoints() {
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const point = new PointPresenter(pointContainer, this._handleTripEventChange, this._handleModeChange);
    point.init(tripEvent, this._offersList);
    this._pointStorage[tripEvent.id] = point;
  }

  _renderEvents(sortedTripEvents) {
    const groupedEvents = groupEvents(this._currentSortType, sortedTripEvents);

    if (this._currentSortType === SORT_TYPE.EVENT) {
      Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
        const eventDay = convertToNullableDate(shortDay);
        const dayId = dayIndex + 1;
        const eventDayComponent = new TripDayView(dayId, eventDay);
        this._dayStorage[dayId] = eventDayComponent;
        render(this._tripEventsContainer, eventDayComponent, RenderPosition.BEFOREEND);

        groupedEvents[shortDay].forEach((tripEvent) => {
          const pointContainer = eventDayComponent.getPointContainer();
          this._renderSinglePoint(pointContainer, tripEvent);
        });
      });
    } else if (this._currentSortType === SORT_TYPE.TIME || this._currentSortType === SORT_TYPE.PRICE) {
      const eventDayComponent = new TripDayView();
      this._dayStorage[0] = eventDayComponent;
      render(this._tripEventsContainer, eventDayComponent, RenderPosition.BEFOREEND);
      const pointContainer = eventDayComponent.getPointContainer();
      groupedEvents.forEach((tripEvent) => {
        this._renderSinglePoint(pointContainer, tripEvent);
      });
    }
  }

  _clearEvents() {
    this._pointStorage = Object.create(null);

    Object
      .values(this._dayStorage)
      .forEach((day) => remove(day));

    this._dayStorage = Object.create(null);
  }

  _renderTripBoard() {
    if (!this._tripEvents.length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    const sortedTripEvents = this._tripEvents
      .sort(getSorterRule(this._currentSortType));

    this._renderEvents(sortedTripEvents);
  }
}
