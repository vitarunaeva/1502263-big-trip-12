export const MOVE_TYPE = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
};

export const ACTIVITY_TYPE = {
  CHECK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`,
};

export const EVENT_TYPE = Object.assign({}, MOVE_TYPE, ACTIVITY_TYPE);

export const POSTFIX_TYPE = {
  MOVE: `to`,
  ACTIVITY: `in`,
};

export const MAX_OFFERS = 3;

export const POINT_ID = null;

export const SORT_TYPE = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const FILTER_TYPE = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const NEW_EVENT = {
  id: POINT_ID,
  destination: {name: ``},
  type: EVENT_TYPE.FLIGHT,
  price: ``,
  offers: [],
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`
};

export const PointMode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`,
  CRASH: `CRASH`
};

export const StatisticsType = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPENT: `time spent`,
};

export const TabNavItem = {
  TABLE: `Table`,
  STATISTICS: `Statistics`
};

export const ModelType = {
  DESTINATIONS: `Destinations`,
  FILTER: `Filter`,
  OFFERS: `Offers`,
  MENU: `Menu`,
  POINTS: `Points`,
  NEW_POINT: `NewPoint`,
};

export const TabAdditionalItem = {
  ADD_NEW_EVENT: `ADD_NEW_EVENT`,
};

export const MenuItem = Object.assign({}, TabNavItem, TabAdditionalItem);

export const MessageText = {
  CRASH: `Oops, something went wrong. Try again later`,
  NO_POINTS: `Click New Event to create your first point`,
  LOADING: `Loading...`
};


export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  DEFAULT: `DEFAULT`,
  ABORTED: `ABORTED`,
  SUCCEED: `SUCCEED`,
};

