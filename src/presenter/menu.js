import FilterPresenter from '../presenter/filter.js';
import MenuView from '../view/menu.js';
import EventAddButtonView from '../view/add-button';
import {render} from '../utils/render.js';
import {UpdateType, RenderPosition, ModelType, MenuItem, FILTER_TYPE} from '../const.js';

export default class Menu {
  constructor(menuContainer, modelStore) {
    this._menuContainer = menuContainer;
    this._newPointModel = modelStore.get(ModelType.NEW_POINT);
    this._menuModel = modelStore.get(ModelType.MENU);
    this._filterModel = modelStore.get(ModelType.FILTER);

    this._controlsContainer = this._menuContainer.querySelector(`.trip-controls`);
    this._tripConntrolsTitle = this._controlsContainer.querySelector(`h2`);

    this._tabsComponent = null;
    this._buttonAddComponent = null;

    this._filterPresenter = new FilterPresenter(this._controlsContainer, modelStore);

    this._handleMenuClick = this._handleMenuClick.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPointModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._tabsComponent = new MenuView(this._menuModel.getItem());
    render(this._tripConntrolsTitle, this._tabsComponent, RenderPosition.AFTEREND);

    this._buttonAddComponent = new EventAddButtonView();
    render(this._menuContainer, this._buttonAddComponent);

    // render(this._tripConntrolsTitle, this._menuContainer, RenderPosition.AFTEREND);

    this._tabsComponent.setMenuClickHandler(this._handleMenuClick);
    this._buttonAddComponent.setButtonClickHandler(this._handleMenuClick);

    this._filterPresenter.init();
  }

  _handleModelEvent(_event, payload) {
    const isNewPointActive = payload !== null;
    this._buttonAddComponent.setDisabledButton(isNewPointActive);
  }

  _handleMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.ADD_NEW_EVENT:
        this._setActiveNavItem(MenuItem.TABLE);
        this._filterPresenter.init();
        this._newPointModel.setItem(UpdateType.MAJOR, menuItem);
        break;
      case MenuItem.TABLE:
        this._setActiveNavItem(menuItem);
        this._filterPresenter.init();
        break;
      case MenuItem.STATISTICS:
        this._setActiveNavItem(menuItem);
        this._filterPresenter.destroy();
        break;
    }
  }

  _setActiveNavItem(tab) {
    if (this._filterModel.getItem() !== FILTER_TYPE.EVERYTHING) {
      this._filterModel.setItem(UpdateType.MAJOR, FILTER_TYPE.EVERYTHING);
    }

    if (this._menuModel.getItem() === tab) {
      return;
    }

    this._menuModel.setItem(UpdateType.MAJOR, tab);
    this._tabsComponent.setActiveTab(tab);
  }
}
