import {ObserverDecorator as Observervable} from '../abstract/observer.js';
import ActiveItem from '../abstract/active-item.js';
import {TabNavItem} from '../const.js';

// eslint-disable-next-line new-cap
export default class Menu extends Observervable(ActiveItem) {
  constructor() {
    super();

    this._activeItem = TabNavItem.TABLE;
  }
}
