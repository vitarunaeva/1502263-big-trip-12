import Observer from "../utils/observer.js";

export default class NewPoint extends Observer {
  constructor() {
    super();
  }

  set(updateType, item) {
    this._items = item;

    this._notify(updateType);
  }
}
