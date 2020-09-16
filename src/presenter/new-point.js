import {nanoid} from 'nanoid';
import EventFilterView from '../view/edit-event.js';
import {remove, render} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../const.js';

export default class NewPoint {
  constructor(pointContainer, changeData) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;

    this._editorComponent = null;

    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event, tripOffers) {
    if (this._editorComponent !== null) {
      return;
    }

    this._editorComponent = new EventFilterView(event, tripOffers);

    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editorComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointContainer, this._editorComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    if (this._editorComponent === null) {
      return;
    }

    remove(this._editorComponent);
    this._editorComponent = null;

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({}, (point, {id: nanoid(5)}))
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
