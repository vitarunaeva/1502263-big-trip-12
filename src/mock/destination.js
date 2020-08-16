import {getRandomInteger} from "../utils/random-integer";

const stubText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.
                  Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
                  Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. 
                  Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
                  Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
                  Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const getRandomDescription = () => {
  stubText.split(`.`).sort(() => Math.random() - 0.5);
  return stubText.slice(getRandomInteger(0, 4));
};

const getRandomPhotos = () => {
  const photos = [];
  const photosCount = getRandomInteger(0, 2);
  for (let i = 0; i < photosCount; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};

const eventDestination = [
  `Saint-Petersburg`,
  `Amsterdam`,
  `New York`,
  `Volgograd`,
  `Peking`
];

export const getTripEvent = () => {
  return eventDestination.map((city) => ({
    name: city,
    description: getRandomDescription(),
    photos: getRandomPhotos()
  }));
};
