import TripInfoView from '../view/trip-info';

import {render, replace, remove} from '../utils/render.js';
import {RenderPosition, ModelType} from '../const.js';

export default class TripInfo {
  constructor(tripInfoContainer, modelStore) {
    this._tripInfoContainer = tripInfoContainer;
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this._tripInfoComponent;
    const points = this._pointsModel.getItems();

    this._tripInfoComponent = new TripInfoView(points);

    if (prevTripInfoComponent === null) {
      render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
