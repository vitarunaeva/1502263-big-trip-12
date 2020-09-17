import TripInfoView from "./view/trip-info";
import MenuView from "./view/menu";
import FilterPresenter from './presenter/filter';
import EventPresenter from './presenter/event.js';
import AddButtonView from "./view/add-button";
import PointsModel from './model/points';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';

import {getTripEvent} from "../mock/destination";
import {generateOffers} from "../mock/offers";
import {generateRandomEvent} from "../mock/event";
import {RenderPosition} from "./const";
import {render} from './utils/render.js';

const TRIPS_COUNT = 15;

const eventDestinations = getTripEvent();
const eventOffers = generateOffers();
const events = new Array(TRIPS_COUNT).fill().map(() => generateRandomEvent(eventDestinations, eventOffers));
const destinationsModel = new DestinationsModel();
destinationsModel.setItems(eventDestinations);

const offersModel = new OffersModel();
offersModel.setItems(eventOffers);

const pointsModel = new PointsModel();
pointsModel.setItems(events);

const filterModel = new FilterModel();

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);
const mainElement = bodyElement.querySelector(`.page-main`);

const tripMainElement = headerElement.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControlsElement.querySelector(`h2`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);

const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);
const eventPresenter = new EventPresenter(tripEventsElement, {pointsModel, offersModel, destinationsModel, filterModel});

filterPresenter.init();
eventPresenter.init();

render(tripMainElement, new TripInfoView(pointsModel), RenderPosition.AFTERBEGIN);
render(tripMainElement, new AddButtonView());
render(tripControlsTitle, new MenuView(), RenderPosition.AFTEREND);
// render(tripControlsElement, new EventFilterView());

// eventPresenter.init(pointsModel, eventOffers);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  eventPresenter.createPoint();
  document.querySelector(`.trip-main__event-add-btn`).setAttribute(`disabled`, `disabled`);
});

