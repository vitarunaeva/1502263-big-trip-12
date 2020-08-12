import moment from 'moment';
import {ACTIVITY_TYPE, POSTFIX_TYPE, SORT_TYPE, FILTER_TYPE} from '../const.js';

export const eventTypePostfix = (eventType) => {
  return Object.values(ACTIVITY_TYPE).includes(eventType) ? POSTFIX_TYPE.ACTIVITY : POSTFIX_TYPE.MOVE;
};

export const getSorterRule = (sortType) => {
  switch (sortType) {
    case SORT_TYPE.TIME:
      return (a, b) => {
        const durationA = moment(a.endDate).diff(moment(a.startDate));
        const durationB = moment(b.endDate).diff(moment(b.startDate));
        return durationB - durationA;
      };
    case SORT_TYPE.PRICE:
      return (a, b) => getTotalEventPrice(b) - getTotalEventPrice(a);
    default:
      return (a, b) => moment(a.startDate) - moment(b.startDate);
  }
};

export const getFilterRule = (filterType) => {
  switch (filterType) {
    case FILTER_TYPE.FUTURE:
      return (event) => moment().isBefore(event.startDate);
    case FILTER_TYPE.PAST:
      return (event) => moment().isAfter(event.endDate);
    default:
      return () => true;
  }
};

export const getTotalEventPrice = (event) => {
  return event.offers.reduce((offerSum, offer) => offer.price + offerSum, event.price);
};

export const splitEventsByDays = (sortedEvents) => {
  const groupedEvents = {};

  sortedEvents.forEach((event) => {
    const shortDay = moment(event.startDate).format(`YYYY-MM-DD`);

    if (!groupedEvents[shortDay]) {
      groupedEvents[shortDay] = [event];
    } else {
      groupedEvents[shortDay].push(event);
    }
  });

  return groupedEvents;
};