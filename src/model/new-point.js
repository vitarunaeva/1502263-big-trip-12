import {ObserverDecorator as Observervable} from '../abstract/observer.js';
import ActiveItem from '../abstract/active-item.js';

// eslint-disable-next-line new-cap
export default class NewPoint extends Observervable(ActiveItem) {
  constructor() {
    super();
  }
}
