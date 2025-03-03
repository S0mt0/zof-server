import { generateDays, generateHours, generateMinutes } from '../utils';

/** Time in `minute`, ` hour` and `day` expressed in `milliseconds` */
export const TIME_IN = {
  /** Time in `minutes` expressed in `milliseconds` */
  minutes: generateMinutes(),
  /** Time in `hours` expressed in `milliseconds` */
  hours: generateHours(),
  /** Time in `days` expressed in `milliseconds` */
  days: generateDays(),
};

export const APP_NAME = 'Co Foundation';

/** **Account Types** object */
export const accounts = {
  /** `admin` account type */
  ADMIN: 'admin',

  /** `user` account type */
  User: 'user',
};

export const PROFILE_IMGS_NAME_LIST = [
  'Garfield',
  'Tinkerbell',
  'Annie',
  'Loki',
  'Cleo',
  'Angel',
  'Bob',
  'Mia',
  'Coco',
  'Gracie',
  'Bear',
  'Bella',
  'Abby',
  'Harley',
  'Cali',
  'Leo',
  'Luna',
  'Jack',
  'Felix',
  'Kiki',
];

export const PROFILE_IMGS_COLLECTIONS_LIST = [
  'notionists-neutral',
  'adventurer-neutral',
  'fun-emoji',
];
