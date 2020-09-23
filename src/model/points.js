import {ObserverDecorator as Observable} from '../abstract/observer.js';
import {AdapterDecorator as Fetchable} from '../abstract/fetch-adapter.js';
import SimpleCollection from '../abstract/simple-collection.js';
import Offers from './offers.js';
import Destinations from './destinations.js';
import {
  updateItem as updateItemById,
  addItem as addItemById,
  deleteItem as deleteItemById
} from '../utils/collection.js';

// eslint-disable-next-line new-cap
export default class Points extends Fetchable(Observable(SimpleCollection)) {
  constructor() {
    super();
  }

  setItems(updateType, items) {
    super.setItems(items);

    this._notify(updateType);
  }

  updateItem(updateType, selectedItem) {
    this._items = updateItemById(this._items, selectedItem);
    this._notify(updateType, selectedItem);
  }

  addItem(updateType, selectedItem) {
    this._items = addItemById(this._items, selectedItem);
    this._notify(updateType, selectedItem);
  }

  deleteItem(updateType, selectedItem) {
    this._items = deleteItemById(this._items, selectedItem);
    this._notify(updateType);
  }

  static adaptToClient(point) {
    return Object.assign(
        {},
        point,
        {
          id: point.id,
          type: point.type,
          price: point[`base_price`],
          startDate: point[`date_from`] !== null ? new Date(point[`date_from`]) : point[`date_from`],
          endDate: point[`date_to`] !== null ? new Date(point[`date_to`]) : point[`date_to`],
          offers: point.offers.map((singleOffer) => Offers.adaptToClient(singleOffer)),
          destination: Destinations.adaptToClient(point.destination),
          isFavorite: point[`is_favorite`]
        }
    );
  }


  static adaptToServer(point) {
    return Object.assign(
        {},
        point,
        {
          "id": point.id,
          "type": point.type,
          "base_price": point.price,
          "date_from": point.startDate instanceof Date ? point.startDate.toISOString() : null,
          "date_to": point.endDate instanceof Date ? point.endDate.toISOString() : null,
          "offers": point.offers.map((singleOffer) => Offers.adaptToServer(singleOffer)),
          "destination": Destinations.adaptToServer(point.destination),
          "is_favorite": point.isFavorite
        }
    );
  }
}

