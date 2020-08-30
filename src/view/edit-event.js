import moment from 'moment';
import AbstractView from './abstract.js';
import {MOVE_TYPE, ACTIVITY_TYPE, POINT_ID} from '../const.js';
import {eventTypePostfix} from '../utils/trip.js';

const createEventTypesTemplate = (pointId, specificType) => {
  return Object.values(specificType).map((type) => (
    `<div class="event__type-item">
        <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${pointId}">${type}</label>
      </div>`)).join(``);
};

const createDestinationItemsTemplate = (destinations) => {
  return destinations.map((city) => (
    `<option value="${city.name}"></option>`
  )).join(``);
};

const createAvailableOffersTemplate = (pointId, offers, selectedOffers) => {
  if (!offers.length) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers.map((singleOffer) => createOfferItemTemplate(pointId, singleOffer, selectedOffers.includes(singleOffer)))
      .join(``)}
    </div>`
  );
};

const createOfferItemTemplate = (pointId, offer, isChecked) => {
  const normalizedOfferId = offer.name.replace(/\s/g, `-`).toLowerCase();

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${normalizedOfferId}-${pointId}" type="checkbox" name="event-offer-${normalizedOfferId}" ${isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${normalizedOfferId}-${pointId}">
      <span class="event__offer-title">${offer.title}</span>
      +
      €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createConcreteDestinationTemplate = (pointId, destination) => {
  if (!destination || !destination.name || pointId !== POINT_ID) {
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
  <label class="event__favorite-btn" for="event-favorite-${pointId}">
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

const createEditTripEventTemplate = (eventItem, offersList) => {
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${eventItem.id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventItem.eventType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${eventItem.id}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createEventTypesTemplate(eventItem.id, MOVE_TYPE)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createEventTypesTemplate(eventItem.id, ACTIVITY_TYPE)}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${eventItem.id}">
            ${eventItem.eventType} ${eventTypePostfix(eventItem.eventType)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${eventItem.id}" type="text" name="event-destination" value="${eventItem.destination.name}" list="destination-list-${eventItem.id}">
          <datalist id="destination-list-${eventItem.id}">
            ${createDestinationItemsTemplate(eventItem.offers)}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${eventItem.id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${eventItem.id}" type="text" name="event-start-time" value="${moment(eventItem.startDate).format(`DD/MM/YY HH:mm`)}">
          —
          <label class="visually-hidden" for="event-end-time-${eventItem.id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${eventItem.id}" type="text" name="event-end-time" value="${moment(eventItem.endDate).format(`DD/MM/YY HH:mm`)}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${eventItem.id}">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-${eventItem.id}" type="text" name="event-price" value="${eventItem.price}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${createResetButtonTemplate(eventItem.id)}
        ${createFavoriteButtonTemplate(eventItem.id, eventItem.isFavorite)}
        ${createRollupButtonTemplate(eventItem.id)}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${createAvailableOffersTemplate(eventItem.id, offersList, eventItem.offers)}
        </section>
        <section class="event__section  event__section--destination">
          ${createConcreteDestinationTemplate(eventItem.id, eventItem.destination)}
        </section>
      </section>
    </form>`
  );
};

export default class EventEditor extends AbstractView {
  constructor(eventItem, tripOffers) {
    super();

    this._eventItem = eventItem;
    this._offerList = tripOffers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
  }

  getTemplate() {
    return createEditTripEventTemplate(this._eventItem, this._offerList);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._cancelClickHandler);
  }
}
