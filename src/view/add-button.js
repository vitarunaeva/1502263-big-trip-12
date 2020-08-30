import AbstractView from './abstract.js';

export const createAddButtonTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`
  );
};

export default class AddButton extends AbstractView {

  getTemplate() {
    return createAddButtonTemplate();
  }
}
