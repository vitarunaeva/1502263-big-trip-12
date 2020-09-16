import EventEditorView from "../view/edit-event";
import EventPointView from "../view/event";
import {RenderPosition, PointMode, UserAction, UpdateType} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._editorComponent = null;
    this._mode = PointMode.DEFAULT;

    this._replacePointToEditor = this._replacePointToEditor.bind(this);
    this._replaceEditFormToPoint = this._replaceEditFormToPoint.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(tripEvent, tripOffers) {
    this._tripEvent = tripEvent;

    const prevPointComponent = this._pointComponent;
    const prevEditorComponent = this._editorComponent;

    this._pointComponent = new EventPointView(this._tripEvent);
    this._editorComponent = new EventEditorView(this._tripEvent, tripOffers);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._editorComponent.setCancelClickHandler(this._handleCancelClick);
    this._editorComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._editorComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._editorComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEditorComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === PointMode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === PointMode.EDITING) {
      replace(this._editorComponent, prevEditorComponent);
    }

    remove(prevPointComponent);
    remove(prevEditorComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editorComponent);
  }

  resetView() {
    if (this._mode !== PointMode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _replacePointToEditor() {
    replace(this._editorComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = PointMode.EDITING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._editorComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = PointMode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._editorComponent.reset();
      this._replaceEditFormToPoint();
    }
  }

  _handleEditClick() {
    this._replacePointToEditor();
  }

  _handleCancelClick() {
    this._replaceEditFormToPoint();
  }

  _handleDeleteClick() {
    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, this._tripEvent);
  }

  _handleFavoriteClick(updatedPoint) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
  }

  _handleFormSubmit(updatedPoint) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.MINOR, updatedPoint);
    this._replacePointToEditor();
  }
}
