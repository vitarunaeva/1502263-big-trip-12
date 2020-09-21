import EventPresenter from './presenter/event.js';

import StoreFactory from './model/store-factore';
import SummaryPresenter from './presenter/summary.js';
import MenuPresenter from './presenter/menu.js';
import StatisticsPresenter from './presenter/statistics.js';

import {getTripEvent} from "../mock/destination";
import {generateOffers} from "../mock/offers";
import {generateRandomEvent} from "../mock/event";

const TRIPS_COUNT = 15;

const eventDestinations = getTripEvent();
const eventOffers = generateOffers();
const events = new Array(TRIPS_COUNT).fill().map(() => generateRandomEvent(eventDestinations, eventOffers));

const modelStore = StoreFactory.create(events, eventOffers, eventDestinations);

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);

const tripMainElement = headerElement.querySelector(`.trip-main`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const statsElement = mainElement.querySelector(`.page-body__container`);

const summaryPresenter = new SummaryPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const eventPresenter = new EventPresenter(tripEventsElement, modelStore);
const statisticsPresenter = new StatisticsPresenter(statsElement, modelStore);

summaryPresenter.init();
menuPresenter.init();
eventPresenter.init();

statisticsPresenter.init();

// render(tripMainElement, new TripInfoView(pointsModel), RenderPosition.AFTERBEGIN);
// render(tripMainElement, new AddButtonView());
// render(tripControlsTitle, new MenuView(), RenderPosition.AFTEREND);

// document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   eventPresenter.createPoint();
//   document.querySelector(`.trip-main__event-add-btn`).setAttribute(`disabled`, `disabled`);
// });

