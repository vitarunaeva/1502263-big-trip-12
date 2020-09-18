import flatpickr from 'flatpickr';
import moment from 'moment';
import SmartView from '../abstract/smart-view.js';
import {MOVE_TYPE, ACTIVITY_TYPE, POINT_ID, NEW_EVENT} from '../const.js';
import {eventTypePostfix, defineDestination} from '../utils/trip.js';
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createEventTypesTemplate = (selectedType) => {
  return Object.values(selectedType).map((type) => (
    `<div class="event__type-item">
        <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}"
               for="event-type-${type}"
               data-type="${type}">
         ${type}
        </label>
      </div>`)).join(``);
};

const createDestinationItemsTemplate = (destinations, currentDestination, pointId) => {
  const {name: currentCity} = currentDestination;

  const destinationOptions = destinations
    .map((city) => (
      `<option value="${city.name}" ${currentCity === city.name ? `selected` : ``}>
        ${city.name}
      </option>`));

  if (pointId === POINT_ID) {
    destinationOptions.unshift(`<option selected disabled></option>`);
  }

  return destinationOptions.join(``);
};

const createAvailableOffersTemplate = (offers, selectedOffers) => {
  if (!offers.length) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers.map((singleOffer) => createOfferItemTemplate(singleOffer, selectedOffers.includes(singleOffer)))
      .join(``)}
    </div>`
  );
};

const createOfferItemTemplate = (offer, isChecked) => {
  const normalizedOfferId = offer.title.replace(/\s/g, `-`).toLowerCase();

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
             id="event-offer-${normalizedOfferId}"
             type="checkbox"
             name="event-offer-${normalizedOfferId}"
             value="${offer.title}"
             ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${normalizedOfferId}">
      <span class="event__offer-title">${offer.title}</span>
      +
      €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createConcreteDestinationTemplate = (destination) => {
  if (!destination || !destination.description) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">${destination.name}</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${destination.photos
      .map((photoUrl) => (`<img class="event__photo" src="${photoUrl}" alt="Event photo">`))
      .join(``)
    }
      </div>
    </div>`
  );
};

const createResetButtonTemplate = (pointId) => {
  return `<button class="event__reset-btn" type="reset">${pointId === POINT_ID ? `Cancel` : `Delete`}</button>`;
};

const createFavoriteButtonTemplate = (pointId, isFavoriteEvent) => {
  if (pointId === POINT_ID) {
    return ``;
  }

  return `<input id="event-favorite-${pointId}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavoriteEvent ? `checked` : ``}>
  <label class="event__favorite-btn" for="event-favorite">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </label>`;
};

const createRollupButtonTemplate = (pointId) => {
  if (pointId === POINT_ID) {
    return ``;
  }

  return `<button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;
};

const createEditTripEventTemplate = (eventItem, destinations, offersList) => {
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventItem.type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createEventTypesTemplate(MOVE_TYPE)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createEventTypesTemplate(ACTIVITY_TYPE)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination">
            ${eventItem.type} ${eventTypePostfix(eventItem.type)}
          </label>
          <select class="event__input  event__input--destination" id="event-destination" name="event-destination" >
            <datalist id="destination-list">
              ${createDestinationItemsTemplate(destinations, eventItem.destination, eventItem.id)}
            </datalist>
          </select>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${moment(eventItem.startDate).format(`DD/MM/YY HH:mm`)}">
          —
          <label class="visually-hidden" for="event-end-time">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${moment(eventItem.endDate).format(`DD/MM/YY HH:mm`)}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price" type="number" name="event-price" value="${eventItem.price}" autocomplete="off">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${createResetButtonTemplate(eventItem.id)}
        ${createFavoriteButtonTemplate(eventItem.id, eventItem.isFavorite)}
        ${createRollupButtonTemplate(eventItem.id)}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${createAvailableOffersTemplate(offersList, eventItem.offers)}
        </section>
        <section class="event__section  event__section--destination">
          ${createConcreteDestinationTemplate(eventItem.destination)}
        </section>
      </section>
    </form>`
  );
};

export default class EventEditor extends SmartView {
  constructor(destinations = [], tripOffers = [], eventItem = NEW_EVENT) {
    super();

    this._offers = tripOffers.find((offer) => eventItem.type === offer.eventType);

    this._eventItem = eventItem;
    this._sourceEventItem = eventItem;
    this._destinations = destinations;
    this._offerList = this._offers ? this._offers.offers : [];
    this._datepickers = null;


    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset() {
    this.updateData(this._sourceEventItem);
  }

  getTemplate() {
    return createEditTripEventTemplate(this._eventItem, this._destinations, this._offerList);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);

    if (this._callback.cancelClick) {
      this.setCancelClickHandler(this._callback.cancelClick);
    }
    if (this._callback.favoriteClick) {
      this.setFavoriteClickHandler(this._callback.favoriteClick);
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeClickHandler);
    this.getElement()
      .querySelector(`.event__input--destination`)
      .addEventListener(`change`, this._destinationInputHandler);
  }

  _setDatePicker() {
    if (this._datepickers) {
      this._datepickers.forEach((item) => item.destroy());
      this._datepickers = null;
    }

    const eventStartDate = flatpickr(
        this.getElement().querySelector(`.event__input--time[name="event-start-time"]`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._eventItem.startDate,
          onChange: this._dateChangeHandler
        }
    );

    const eventEndDate = flatpickr(
        this.getElement().querySelector(`.event__input--time[name="event-end-time"]`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._eventItem.endDate,
          minDate: this._eventItem.startDate,
          onChange: this._dateChangeHandler
        }
    );

    this._datepickers = [eventStartDate, eventEndDate];
  }

  _dateChangeHandler([selectedDate], dateTime) {
    if (selectedDate) {
      const updatedProperty = Object.create(null);
      updatedProperty[dateTime] = selectedDate;
      this.updateData(updatedProperty, true);
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const price = parseInt(evt.target.value, 10);

    this.updateData({
      price
    }, true);
  }

  _typeClickHandler(evt) {
    evt.preventDefault();
    const selectedEventType = evt.target.dataset.type;

    if (selectedEventType === this._eventItem.type.toLowerCase()) {
      this.getElement().querySelector(`.event__type-btn`).click();
      return;
    }

    this.updateData({
      type: selectedEventType,
      offers: []
    });
  }


  _defineSelectedOffers() {
    const checkedTitles = Array
      .from(this.getElement().querySelectorAll(`.event__offer-checkbox`))
      .filter((element) => element.checked)
      .map((element) => element.value);

    const offers = this._offerList.filter((offer) => checkedTitles.includes(offer.title));

    this.updateData({offers}, true);
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();
    const selectedCity = evt.target.value;

    if (selectedCity === this._eventItem.destination.name) {
      return;
    }

    const updatedProperty = defineDestination(this._destinations, selectedCity);
    // const isRenderActual = updatedProperty.description === this._eventItem.destination.description;
    const isRenderActual = true;

    this.updateData({
      destination: updatedProperty
    }, isRenderActual);
  }


  _cancelClickHandler(evt) {
    evt.preventDefault();
    this.reset();
    this._callback.cancelClick();
  }

  _favoriteClickHandler() {
    this.updateData({
      isFavorite: !this._sourceItem.isFavorite
    }, true);
    this._sourceItem = this._eventItem;
    this._callback.favoriteClick(this._eventItem);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._defineSelectedOffers();
    this._sourceItem = this._eventItem;
    this._callback.formSubmit(this._eventItem);
  }

  updateData(updatedData, justDataUpdating) {
    super.updateData(updatedData, justDataUpdating);
    this._eventItem = Object.assign({}, this._eventItem, this._data);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._cancelClickHandler);
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }
}
