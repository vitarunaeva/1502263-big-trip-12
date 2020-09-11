import moment from 'moment';

const addLeadZero = (digit) => {
  return digit < 10 ? `0` + digit : digit;
};

export const humanizeDuration = (finishDate, startDate) => {
  const startMoment = moment(finishDate)
    .subtract(finishDate.getSeconds(), `seconds`)
    .subtract(finishDate.getMilliseconds(), `milliseconds`);
  const finishMoment = moment(startDate)
    .subtract(startDate.getSeconds(), `seconds`)
    .subtract(startDate.getMilliseconds(), `milliseconds`);

  const duration = moment.duration(startMoment.diff(finishMoment));
  const readableDurations = [];

  if (duration.days() > 0) {
    readableDurations.push(`${addLeadZero(duration.days())}D`);
  }

  if (duration.hours() > 0) {
    readableDurations.push(`${addLeadZero(duration.hours())}H`);
  }

  if (duration.minutes() > 0) {
    readableDurations.push(`${addLeadZero(duration.minutes())}M`);
  }

  return readableDurations.join(` `);
};

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
};

export const removeItemById = (items, updatedItem) => {
  if (items.length === 0) {
    return items;
  }

  return items.filter((item) => item.id !== updatedItem.id);
};
