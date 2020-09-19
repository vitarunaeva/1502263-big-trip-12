import EventSortView from "../view/sort";
import TripDayView from "../view/trip-days";
import NoPointsView from '../view/no-points.js';
import PointPresenter from './point.js';
import NewPointPresenter from './new-point.js';
import {getSorterRule, groupEvents, convertToNullableDate, getFilterRule} from '../utils/trip.js';
import {RenderPosition, UpdateType, UserAction, FILTER_TYPE, SORT_TYPE} from '../const.js';
import {remove, render} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer, {pointsModel, offersModel, destinationsModel, filterModel} = {}) {
    this._tripEventsContainer = tripEventsContainer;

    this._pointsModel = pointsModel;
    this._tripOffers = offersModel.getItems();
    this._destinations = destinationsModel.getItems();
    this._filterModel = filterModel;

    this._currentSortType = SORT_TYPE.EVENT;
    this._dayStorage = Object.create(null);
    this._pointStorage = Object.create(null);
    this._eventSorterComponent = null;
    this._noPointsComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newPointPresenter = new NewPointPresenter(this._tripEventsContainer, this._handleViewAction);
  }

  init() {
    this._renderTripBoard();
  }

  createPoint() {
    this._currentSortType = SORT_TYPE.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FILTER_TYPE.EVERYTHING);
    this._newPointPresenter.init(this._destinations, this._tripOffers);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();

    return this._pointsModel.getItems()
      .filter(getFilterRule(filterType))
      .sort(getSorterRule(this._currentSortType));
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._eventSorterComponent = new EventSortView(this._currentSortType);
    this._eventSorterComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._pointStorage)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updateItem(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addItem(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deleteItem(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, payload) {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        this._clearEvents();
        this._renderEvents(this._getPoints());
        break;
      case UpdateType.MAJOR:
        const resetSortType = Object.values(FILTER_TYPE).includes(payload);
        this._clearTripBoard({resetSortType});
        this._renderTripBoard();
        break;
    }
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
    this._renderEvents(this._getPoints());
  }

  _renderNoPoints() {
    if (this._noPointsComponent !== null) {
      this._noPointsComponent = null;
    }

    this._noPointsComponent = new NoPointsView();
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const point = new PointPresenter(pointContainer, this._handleViewAction, this._handleModeChange);
    point.init(tripEvent, this._destinations, this._tripOffers);
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
    if (!this._getPoints().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    this._renderEvents(this._getPoints());
  }

  _clearTripBoard({resetSortType} = {}) {
    if (resetSortType) {
      this._currentSortType = SORT_TYPE.EVENT;
    }

    this._newPointPresenter.destroy();
    this._clearEvents();
    remove(this._noPointsComponent);
    remove(this._eventSorterComponent);
  }
}
