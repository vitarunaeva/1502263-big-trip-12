import {getRandomInteger, getRandomElement, getRandomDate, getRandomElements} from "../src/utils/random-integer";
import {EVENT_TYPE} from "../src/const";

const maxStartDays = 5;
const maxDurationEventMinutes = 135;

export const generateRandomEvent = (destination, availableOffers) => {
  const eventType = getRandomElement(Object.values(EVENT_TYPE));
  const startDate = getRandomDate(maxStartDays * 24 * 60);
  const filteredOffers = availableOffers.find((offer) => offer.eventType === eventType).offers;
  const offers = getRandomElements(filteredOffers, 0, filteredOffers.length - 1);

  return {
    id: getRandomInteger(0, 100),
    destination: getRandomElement(destination),
    eventType,
    price: getRandomInteger(2, 50) * 10,
    offers,
    startDate,
    endDate: getRandomDate(maxDurationEventMinutes, startDate),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
