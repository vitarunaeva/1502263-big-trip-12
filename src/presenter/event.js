import EventSortView from "../view/sort";
import TripDayView from "../view/trip-days";
import EventEditorView from "../view/edit-event";
import EventPointView from "../view/event";
import NoPointsView from '../view/no-points.js';
import {getSorterRule, groupEvents, convertToNullableDate} from '../utils/trip.js';
import {SORT_TYPE, RenderPosition} from '../const.js';
import {remove, render, replace} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._currentSortType = SORT_TYPE.EVENT;
    this._events = [];

    this._eventSorterComponent = new EventSortView(this._currentSortType);
    this._noPointsComponent = new NoPointsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripEvents, eventDestinations, offersList) {
    this._tripEvents = tripEvents.slice();
    this._offersList = offersList;

    this._renderTripBoard();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
    this._eventSorterComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
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
    const eventPointComponent = new EventPointView(tripEvent);
    const eventEditorComponent = new EventEditorView(tripEvent, this._offersList);

    const replacePointToForm = () => {
      replace(eventEditorComponent, eventPointComponent);
    };

    const replaceFormToPoint = () => {
      replace(eventPointComponent, eventEditorComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    eventPointComponent.setEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditorComponent.setCancelClickHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    eventEditorComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(pointContainer, eventPointComponent, RenderPosition.BEFOREEND);
  }

  _renderEvents(sortedTripEvents) {
    const groupedEvents = groupEvents(this._currentSortType, sortedTripEvents);

    if (this._currentSortType === SORT_TYPE.EVENT) {
      Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
        const eventDay = convertToNullableDate(shortDay);
        const dayId = dayIndex + 1;
        const EventDayComponent = new TripDayView(dayId, eventDay);
        this._events.push(EventDayComponent);
        render(this._tripEventsContainer, EventDayComponent, RenderPosition.BEFOREEND);

        groupedEvents[shortDay].forEach((tripEvent) => {
          const pointContainer = EventDayComponent.getPointContainer();
          this._renderSinglePoint(pointContainer, tripEvent);
        });
      });
    } else if (this._currentSortType === SORT_TYPE.TIME || this._currentSortType === SORT_TYPE.PRICE) {
      const EventDayComponent = new TripDayView();
      this._events.push(EventDayComponent);
      render(this._tripEventsContainer, EventDayComponent, RenderPosition.BEFOREEND);
      const pointContainer = EventDayComponent.getPointContainer();
      groupedEvents.forEach((tripEvent) => {
        this._renderSinglePoint(pointContainer, tripEvent);
      });
    }
  }

  _clearEvents() {
    this._events.forEach((event) => remove(event));
    this._events = [];
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
