import TripInfoView from "./view/trip-info";
import MenuView from "./view/menu";
import EventFilterView from "./view/filter";
import EventPresenter from './presenter/event.js';
import AddButtonView from "./view/add-button";

import {getTripEvent} from "./mock/destination";
import {generateOffers} from "./mock/offers";
import {generateRandomEvent} from "./mock/event";
import {getSorterRule, getFilterRule} from "./utils/trip.js";
import {FILTER_TYPE, SORT_TYPE, RenderPosition} from "./const";
import {render} from './utils/render.js';

const TRIPS_COUNT = 15;

const eventDestinations = getTripEvent();
const eventOffers = generateOffers();
const events = new Array(TRIPS_COUNT).fill().map(() => generateRandomEvent(eventDestinations, eventOffers));
const sortedEvents = events.filter(getFilterRule(FILTER_TYPE.FUTURE)).sort(getSorterRule(SORT_TYPE.EVENT));
const offersList = eventOffers.find((offer) => offer.eventType === sortedEvents[0].eventType).offers;

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);
const mainElement = bodyElement.querySelector(`.page-main`);

const tripMainElement = headerElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControlsElement.querySelector(`h2`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

const eventPresenter = new EventPresenter(tripEventsElement);

render(tripMainElement, new TripInfoView(events), RenderPosition.AFTERBEGIN);
render(tripMainElement, new AddButtonView());
render(tripControlsTitle, new MenuView(), RenderPosition.AFTEREND);
render(tripControlsElement, new EventFilterView());

eventPresenter.init(events, eventDestinations, offersList);


