import EventPresenter from './presenter/event.js';
import Api from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import StoreFactory from './model/store-factore';
import TripInfoPresenter from './presenter/trip-info.js';
import MenuPresenter from './presenter/menu.js';
import StatisticsPresenter from './presenter/statistics.js';
import {ModelType, UpdateType} from './const.js';


const AUTHORIZATION = `Basic c100a054440a4hs`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v12`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const modelStore = StoreFactory.create();

const bodyElement = document.querySelector(`.page-body`);
const headerElement = bodyElement.querySelector(`.page-header`);

const tripMainElement = headerElement.querySelector(`.trip-main`);

const mainElement = document.querySelector(`.page-main`);
const tripEventsElement = mainElement.querySelector(`.trip-events`);
const statisticsElement = mainElement.querySelector(`.page-body__container`);

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, modelStore);
const menuPresenter = new MenuPresenter(tripMainElement, modelStore);
const eventPresenter = new EventPresenter(tripEventsElement, modelStore, apiWithProvider);
const statisticsPresenter = new StatisticsPresenter(statisticsElement, modelStore);

tripInfoPresenter.init();
eventPresenter.init();
statisticsPresenter.init();

const fetchedDataPromises = [
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getPoints()
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
