import {createTripInfoTemplate} from "./view/trip-info";
import {createMenuTemplate} from "./view/menu";
import {createTripFiltersTemplate} from "./view/filter";
import {createTripSortTemplate} from "./view/sort";
import {createTripDaysTemplate} from "./view/trip-days";
import {createEditTripEventTemplate} from "./view/edit-event";
import {createEventTemplate} from "./view/event";

const TRIPS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);
const mainElement = bodyElement.querySelector(`.page-main`);

const tripMainElement = headerElement.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControlsElement.querySelector(`h2`);
render(tripControlsTitle, createMenuTemplate(), `afterend`);
render(tripControlsElement, createTripFiltersTemplate());


const tripEventsElement = mainElement.querySelector(`.trip-events`);
render(tripEventsElement, createTripSortTemplate(), `beforeend`);

render(tripEventsElement, createTripDaysTemplate(), `beforeend`);

const tripDaysElement = document.querySelector(`.trip-days`);
const tripEventsListElement = tripDaysElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEditTripEventTemplate(), `beforeend`);

for (let i = 0; i < TRIPS_COUNT; i++) {
  render(tripEventsListElement, createEventTemplate(), `beforeend`);
}

