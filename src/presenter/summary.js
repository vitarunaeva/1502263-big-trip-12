import TripInfoView from '../view/trip-info';
import MenuView from "../view/menu";

import {render, replace, remove} from '../utils/render.js';
import {RenderPosition, ModelType} from '../const.js';

export default class Summary {
  constructor(summaryContainer, modelStore) {
    this._summaryContainer = summaryContainer;
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._tripControlsTitle = this._summaryContainer.querySelector(`h2`);
    this._summaryComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevSummaryComponent = this._summaryComponent;
    const points = this._pointsModel.getItems();

    this._summaryComponent = new TripInfoView(points);


    // render(this._summaryComponent, null, RenderPosition.AFTERBEGIN);
    render(this._tripControlsTitle, new MenuView(), RenderPosition.AFTEREND);

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
