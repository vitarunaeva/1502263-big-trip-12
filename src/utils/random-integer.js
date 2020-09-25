export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (elements) => {
  if (!elements || !elements.length) {
    throw new Error(`Incorrect array`);
  }

  const randomIndex = getRandomInteger(0, elements.length - 1);
  return elements[randomIndex];
};

export const getRandomElements = (elements, minElementsCount, maxElementsCount) => {
  if (!elements) {
    throw new Error(`Incorrect array`);
  }

  if (!elements.length) {
    return [];
  }

  const elementsCount = getRandomInteger(minElementsCount, maxElementsCount);
  return elements.slice().sort(() => 0.5 - Math.random()).slice(0, elementsCount);
};

export const getRandomDate = (maxMinuteOffset, startDate = null) => {
  const millisecOffset = 1000 * 60 * maxMinuteOffset;
  const randomTimeOffset = getRandomInteger(0, +millisecOffset);
  const startTime = startDate ? startDate.getTime() : new Date().getTime();

  return new Date(startTime + randomTimeOffset);
};
