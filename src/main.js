import EventPresenter from './presenter/event.js';
import Api from './api.js';
import StoreFactory from './model/store-factore';
import TripInfoPresenter from './presenter/trip-info.js';
import MenuPresenter from './presenter/menu.js';
import StatisticsPresenter from './presenter/statistics.js';
import {ModelType, UpdateType} from './const.js';


const AUTHORIZATION = `Basic c1a054440a4cd`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

const modelStore = StoreFactory.create();

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);

const tripMainElement = headerElement.querySelector(`.trip-main`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const statisticsElement = mainElement.querySelector(`.page-body__container`);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const eventPresenter = new EventPresenter(tripEventsElement, modelStore, api);
const statisticsPresenter = new StatisticsPresenter(statisticsElement, modelStore);

tripInfoPresenter.init();
eventPresenter.init();
statisticsPresenter.init();

const fetchedDataPromises = [
  api.getDestinations(),
  api.getOffers(),
  api.getPoints()
];

Promise.all(fetchedDataPromises)
  .then(([destinations, offers, points]) => {
    modelStore.get(ModelType.DESTINATIONS).setItems(destinations);
    modelStore.get(ModelType.OFFERS).setItems(offers);
    modelStore.get(ModelType.POINTS).setItems(UpdateType.INIT, points);
    menuPresenter.init();
  })
  .catch(() => {
    modelStore.get(ModelType.POINTS).setItems(UpdateType.CRASH, []);
  });


