import {EVENT_TYPE} from "../const";
import {getRandomInteger, getRandomElements} from "../utils/random-integer";

const offersTitleList = [
  `Order Uber`,
  `Add luggage`,
  `Switch to comfort`,
  `Rent a car`,
  `Add breakfast`,
  `Book tickets`,
  `Lunch in city`
];

const getRandomOffers = () => {
  const offers = getRandomElements(offersTitleList, 0, 6);
  return offers.map((title) => ({title, price: getRandomInteger(10, 200)}));
};

export const generateOffers = () => Object.values(EVENT_TYPE).map((eventType) => {
  return {eventType, offers: getRandomOffers()};
});
