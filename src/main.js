import TripInfoView from "./view/trip-info";
import MenuView from "./view/menu";
import EventFilterView from "./view/filter";
import EventSortView from "./view/sort";
import TripDayView from "./view/trip-days";
import EventEditorView from "./view/edit-event";
import EventPointView from "./view/event";
import AddButtonView from "./view/add-button";
import NoPointsView from './view/no-points.js';

import {getTripEvent} from "./mock/destination";
import {generateOffers} from "./mock/offers";
import {generateRandomEvent} from "./mock/event";
import {getSorterRule, splitEventsByDays, getFilterRule} from "./utils/trip.js";
import {FILTER_TYPE, SORT_TYPE, RenderPosition} from "./const";
import {render} from './utils/render.js';

const TRIPS_COUNT = 15;

const eventDestinations = getTripEvent();
const eventOffers = generateOffers();
const events = new Array(TRIPS_COUNT).fill().map(() => generateRandomEvent(eventDestinations, eventOffers));
const sortedEvents = events.filter(getFilterRule(FILTER_TYPE.FUTURE)).sort(getSorterRule(SORT_TYPE.EVENT));
const offersList = eventOffers.find((offer) => offer.eventType === sortedEvents[0].eventType).offers;
const groupedEvents = splitEventsByDays(sortedEvents);

const renderPoint = (dayContainer, tripEvent) => {
  const pointContainer = dayContainer.querySelector(`.trip-events__list`);

  const eventPointComponent = new EventPointView(tripEvent);
  const eventEditorComponent = new EventEditorView(tripEvent, offersList);

  const replacePointToForm = () => {
    pointContainer.replaceChild(eventEditorComponent.getElement(), eventPointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointContainer.replaceChild(eventPointComponent.getElement(), eventEditorComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditorComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  eventEditorComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(pointContainer, eventPointComponent.getElement());
};
const renderPoints = (pointsContainer, tripEvents) => {
  if (!tripEvents.length) {
    render(pointsContainer, new NoPointsView().getElement());
    return;
  }

  render(pointsContainer, new EventSortView().getElement(), RenderPosition.AFTERBEGIN);

  Object.keys(groupedEvents).forEach((eventDate, dayIndex) => {
    const eventDay = new Date(eventDate);
    const dayId = dayIndex + 1;

    const tripDayComponent = new TripDayView(dayId, eventDay);
    render(tripDaysElement, tripDayComponent.getElement());

    groupedEvents[eventDate].forEach((tripEvent) => {
      renderPoint(tripDayComponent.getElement(), tripEvent);
    });
  });
};

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);
const mainElement = bodyElement.querySelector(`.page-main`);

const tripMainElement = headerElement.querySelector(`.trip-main`);
const tripInfoComponent = new TripInfoView(events);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControlsElement.querySelector(`h2`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);

render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(tripMainElement, new AddButtonView().getElement());
render(tripControlsTitle, new MenuView().getElement(), RenderPosition.AFTEREND);
render(tripControlsElement, new EventFilterView().getElement());

renderPoints(tripEventsElement, events);

