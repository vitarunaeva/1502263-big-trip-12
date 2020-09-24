import {ObserverDecorator as Observervable} from '../abstract/observer.js';
import ActiveItem from '../abstract/active-item.js';
import {FilterType} from '../const.js';

// eslint-disable-next-line new-cap
export default class Filter extends Observervable(ActiveItem) {
  constructor() {
    super();

    this._activeItem = FilterType.EVERYTHING;
  }
}
