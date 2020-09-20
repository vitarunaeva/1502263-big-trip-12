import Observer from '../abstract/observer.js';
import {TabNavItem} from '../const.js';


export default class Menu extends Observer {
  constructor() {
    super();

    this._activeItem = TabNavItem.TABLE;
  }
}
