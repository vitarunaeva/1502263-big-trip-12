import StatisticsView from '../view/stats.js';
import {render, remove} from '../utils/render.js';
import {RenderPosition, ModelType, TabNavItem} from '../const.js';

export default class Statistics {
  constructor(statisticsContainer, modelStore) {
    this._statisticsContainer = statisticsContainer;
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._menuModel = modelStore.get(ModelType.MENU);

    this._statisticsComponent = null;

    this._handleMenuEvent = this._handleMenuEvent.bind(this);
  }

  init() {
    this._menuModel.addObserver(this._handleMenuEvent);
  }

  _renderStatistics() {
    if (this._statisticsComponent) {
      return;
    }

    this._statisticsComponent = new StatisticsView(this._pointsModel.getItems());
    render(this._statisticsContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  destroy() {
    if (this._statisticsComponent === null) {
      return;
    }

    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }

  _handleMenuEvent(_event, menuItem) {
    switch (menuItem) {
      case TabNavItem.STATISTICS:
        this._renderStatistics();
        break;
      default:
        this.destroy();
        break;
    }
  }
}
