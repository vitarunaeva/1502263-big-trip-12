import Observer from '../abstract/observer.js';
import {FILTER_TYPE} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();

    this._activeItem = FILTER_TYPE.EVERYTHING;
  }

  getItem() {
    return this._activeItem;
  }
}
