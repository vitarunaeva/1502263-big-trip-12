import Store from './store.js';
import Menu from './menu.js';
import Points from './points.js';
import Filter from './filter.js';
import Offers from './offers.js';
import Destinations from './destinations.js';
import NewPoint from './new-point.js';

export default class StoreFactory {
  static create(tripEvents, tripOffers, destinations) {
    const modelStore = new Store();

    const menuModel = new Menu();
    modelStore.set(menuModel);

    const destinationsModel = new Destinations();
    destinationsModel.setItems(destinations);
    modelStore.set(destinationsModel);

    const offersModel = new Offers();
    offersModel.setItems(tripOffers);
    modelStore.set(offersModel);

    const pointsModel = new Points();
    pointsModel.setItems(tripEvents);
    modelStore.set(pointsModel);

    const newPoint = new NewPoint();
    modelStore.set(newPoint);

    const filterModel = new Filter();
    modelStore.set(filterModel);

    return modelStore;
  }
}