import EventSortView from "../view/sort";
import TripDayView from "../view/trip-days";
import EventMsgView from '../view/event-msg.js';
import PointPresenter from './point.js';
import NewPointPresenter from './new-point.js';
import {getSorterRule, groupEvents, convertToNullableDate, getFilterRule} from '../utils/trip.js';
import {RenderPosition, UpdateType, UserAction, FILTER_TYPE, SORT_TYPE, ModelType, TabNavItem, MessageText} from '../const.js';
import {remove, render} from '../utils/render.js';
import {State as EventPresenterState} from "../const";

export default class Event {
  constructor(tripEventsContainer, modelStore, api) {
    this._tripEventsContainer = tripEventsContainer;

    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._filterModel = modelStore.get(ModelType.FILTER);
    this._newPointModel = modelStore.get(ModelType.NEW_POINT);
    this._menuModel = modelStore.get(ModelType.MENU);
    this._tripOffersModel = modelStore.get(ModelType.OFFERS);
    this._destinationsModel = modelStore.get(ModelType.DESTINATIONS);

    this._currentSortType = SORT_TYPE.EVENT;
    this._dayStorage = Object.create(null);
    this._pointStorage = Object.create(null);
    this._eventSorterComponent = null;
    this._isLoading = true;
    this._isCrashed = false;
    this._api = api;
    this._msgComponent = null;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleMenuEvent = this._handleMenuEvent.bind(this);

    this._createPoint = this._createPoint.bind(this);
    this._menuModel.addObserver(this._handleMenuEvent);

    this._newPointPresenter = new NewPointPresenter(this._tripEventsContainer, modelStore, this._handleViewAction);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._newPointModel.addObserver(this._createPoint);

    this._renderTripBoard();
  }

  destroy() {
    this._clearTripBoard({resetSortType: true});

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._newPointModel.removeObserver(this._createPoint);
  }

  _createPoint(_event, payload) {
    if (payload === null) {
      return;
    }

    this._handleModeChange();
    this._currentSortType = SORT_TYPE.EVENT;
    for (const point of Object.values(this._pointStorage)) {
      point.replaceEditFormToPoint();
    }
    this._newPointPresenter.init(this._destinationsModel.getItems(), this._tripOffersModel.getItems());
  }

  _getPoints() {
    const filterType = this._filterModel.getItem();

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
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updateItem(updateType, response);
          })
          .catch(() => {
            this._pointStorage[update.id].setViewState(EventPresenterState.ABORTED);
          });
        break;
      case UserAction.ADD_POINT:
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addItem(updateType, response);
          })
          .catch(() => {
            this._newPointPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deleteItem(updateType, update);
          })
          .catch(() => {
            this._pointStorage[update.id].setViewState(EventPresenterState.ABORTED);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        this._isCrashed = false;
        this._clearTripBoard({resetSortType: true});
        this._renderTripBoard();
        break;
      case UpdateType.CRASH:
        this._isLoading = false;
        this._isCrashed = true;
        this._clearTripBoard({resetSortType: true});
        this._renderTripBoard();
        break;
    }
  }

  _handleMenuEvent(_updateType, menuItem) {
    switch (menuItem) {
      case TabNavItem.TABLE.toLowerCase():
        this._renderTripBoard();
        break;
      case TabNavItem.STATISTICS.toLowerCase():
        this._clearTripBoard({resetSortType: true});
        break;
      default:
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

  _renderMsg(msgText) {
    if (this._msgComponent !== null) {
      this._msgComponent = null;
    }

    this._msgComponent = new EventMsgView(msgText);
    render(this._tripEventsContainer, this._msgComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const point = new PointPresenter(pointContainer, this._handleViewAction, this._handleModeChange);
    point.init(tripEvent, this._destinationsModel.getItems(), this._tripOffersModel.getItems());
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
    if (this._isLoading) {
      this._renderMsg(MessageText.LOADING);
      return;
    }

    if (this._isCrashed) {
      this._renderMsg(MessageText.CRASH);
      return;
    }

    if (!this._getPoints().length) {
      this._renderMsg(MessageText.NO_POINTS);
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
    remove(this._msgComponent);
    remove(this._eventSorterComponent);
  }
}
