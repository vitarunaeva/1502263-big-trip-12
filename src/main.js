import {createTripInfoTemplate} from "./view/trip-info";
import {createMenuTemplate} from "./view/menu";
import {createTripFiltersTemplate} from "./view/filter";
import {createTripSortTemplate} from "./view/sort";
import {createTripDaysTemplate} from "./view/trip-days";
import {createEditTripEventTemplate} from "./view/edit-event";

import {getTripEvent} from "./mock/destination";
import {generateOffers} from "./mock/offers";
import {generateRandomEvent} from "./mock/event";
import {getSorterRule, splitEventsByDays, getFilterRule} from "./utils/trip.js";
import {FILTER_TYPE, SORT_TYPE, newEventItem} from "./const";

const TRIPS_COUNT = 15;

const eventDestinations = getTripEvent();
const eventOffers = generateOffers();
const events = new Array(TRIPS_COUNT).fill().map(() => generateRandomEvent(eventDestinations, eventOffers));

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);
const mainElement = bodyElement.querySelector(`.page-main`);

const tripMainElement = headerElement.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(events), `afterbegin`);

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControlsElement.querySelector(`h2`);
render(tripControlsTitle, createMenuTemplate(), `afterend`);
render(tripControlsElement, createTripFiltersTemplate());

const tripEventsElement = mainElement.querySelector(`.trip-events`);
render(tripEventsElement, createTripSortTemplate(), `afterbegin`);

const sortedEvents = events.filter(getFilterRule(FILTER_TYPE.FUTURE)).sort(getSorterRule(SORT_TYPE.EVENT));

const offersList = eventOffers.find((offer) => offer.eventType === sortedEvents[0].eventType).offers;

const groupedEvents = splitEventsByDays(sortedEvents);

const tripDaysElement = tripEventsElement.querySelector(`.trip-days`);
render(tripDaysElement, createEditTripEventTemplate(newEventItem, offersList));

Object.keys(groupedEvents).forEach((eventDate, dayIndex) => {
  const eventDay = new Date(eventDate);
  const dayId = dayIndex + 1;
  render(tripDaysElement, createTripDaysTemplate(dayId, eventDay, groupedEvents[eventDate]));
});

