import TripInfoView from '../view/trip-info';

import {render, replace, remove} from '../utils/render.js';
import {RenderPosition, ModelType} from '../const.js';

export default class Summary {
  constructor(summaryContainer, modelStore) {
    this._summaryContainer = summaryContainer;
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._summaryComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevSummaryComponent = this._summaryComponent;
    const points = this._pointsModel.getItems();

    this._summaryComponent = new TripInfoView(points);

    if (prevSummaryComponent === null) {
      render(this._summaryContainer, this._summaryComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._summaryComponent, prevSummaryComponent);
    remove(prevSummaryComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
