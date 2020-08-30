import EventSortView from "../view/sort";
import TripDayView from "../view/trip-days";
import EventEditorView from "../view/edit-event";
import EventPointView from "../view/event";
import NoPointsView from '../view/no-points.js';
import {getSorterRule, splitEventsByDays, getFilterRule} from '../utils/trip.js';
import {SORT_TYPE, FILTER_TYPE, RenderPosition} from '../const.js';
import {render, replace} from '../utils/render.js';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

    this._eventSorterComponent = new EventSortView();
    this._noPointsComponent = new NoPointsView();
  }

  init(tripEvents, eventDestinations, tripOffers) {
    this._tripEvents = tripEvents.slice();
    this._eventDestinations = eventDestinations;
    this._tripOffers = tripOffers;

    this._renderTripBoard();
  }

  _renderSort() {
    render(this._tripEventsContainer, this._eventSorterComponent, RenderPosition.BEFOREEND);
  }

  _renderNoPoints() {
    render(this._tripEventsContainer, this._noPointsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSinglePoint(pointContainer, tripEvent) {
    const eventPointComponent = new EventPointView(tripEvent);
    const eventEditorComponent = new EventEditorView(tripEvent, this._eventDestinations, this._tripOffers);

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

  _renderChainPoints(sortedTripEvents) {
    const groupedEvents = splitEventsByDays(sortedTripEvents);

    Object.keys(groupedEvents).forEach((shortDay, dayIndex) => {
      const eventDay = new Date(shortDay);
      const dayId = dayIndex + 1;
      const EventDayComponent = new TripDayView(dayId, eventDay);
      render(this._tripEventsContainer, EventDayComponent, RenderPosition.BEFOREEND);

      groupedEvents[shortDay].forEach((tripEvent) => {
        const pointContainer = EventDayComponent.getPointContainer();
        this._renderSinglePoint(pointContainer, tripEvent);
      });
    });
  }

  _renderTripBoard() {
    if (this._tripEvents.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();

    const sortedTripEvents = this._tripEvents
      .filter(getFilterRule(FILTER_TYPE.EVERYTHING))
      .sort(getSorterRule(SORT_TYPE.EVENT));

    this._renderChainPoints(sortedTripEvents);
  }
}
