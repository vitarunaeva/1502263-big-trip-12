import moment from 'moment';
import AbstractView from './abstract.js';

const createTripDaysTemplate = (dayId, eventDate) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
       <span class="day__counter">${dayId}</span>
       <time class="day__date" datetime="${moment(eventDate).format(`YYYY-MM-DD`)}">
        ${moment(eventDate).format(`MMM DD`)}
       </time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

export default class TripDays extends AbstractView {
  constructor(dayId = null, eventDate = null) {
    super();
    this._dayId = dayId;
    this._eventDate = eventDate;
  }

  getTemplate() {
    return createTripDaysTemplate(this._dayId, this._eventDate);
  }

  getPointContainer() {
    return this.getElement().querySelector(`.trip-events__list`);
  }
}
