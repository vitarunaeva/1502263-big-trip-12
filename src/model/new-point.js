import Observer from "../utils/observer.js";

export default class NewPoint extends Observer {
  constructor() {
    super();
  }

  set(updateType, items) {
    this._items = items.slice();

    this._notify(updateType);
  }
}
