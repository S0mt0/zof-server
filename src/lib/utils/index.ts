import { Request } from 'express';
import ShortUniqueId from 'short-unique-id';
import {
  PROFILE_IMGS_COLLECTIONS_LIST,
  PROFILE_IMGS_NAME_LIST,
} from '../constants';
import { Days, Hours, Minutes, TimeInMilliseconds } from '../interface';

/** Randomly generates image urls on https://api.dicebear.com */
export const getRandomAvatarUrl = () =>
  `https://api.dicebear.com/6.x/${PROFILE_IMGS_COLLECTIONS_LIST[Math.floor(Math.random() * PROFILE_IMGS_COLLECTIONS_LIST?.length)]}/svg?seed=${PROFILE_IMGS_NAME_LIST[Math.floor(Math.random() * PROFILE_IMGS_NAME_LIST?.length)]}`;

/**
 * Multiplies all the number arguments and returns their product
 * @param args Numbers
 * @returns Product of the passed in numbers
 */
export const multiply = (...args: number[]) => {
  if (args.length === 0) {
    return 0; // If no numbers are provided, return 0
  }

  return args.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1,
  );
};

/** Generates and returns an object whose keys in number represent ***time*** in `hour` and values expressed in `milliseconds`
 * @description Ranges from 1 to 24 ***hours***
 */
export const generateHours = (): TimeInMilliseconds<Hours> => {
  const hours = {} as TimeInMilliseconds<Hours>;
  for (let i = 1; i <= 24; i++) {
    hours[i as keyof typeof hours] = i * 60 * 60 * 1000; // Convert hours to milliseconds
  }
  return hours;
};

/** Generates and returns an object whose keys in number represent ***time*** in `day` and values expressed in `milliseconds`
 * @description Ranges from 1 to 7 ***days***
 */
export const generateDays = (): TimeInMilliseconds<Days> => {
  const days = {} as TimeInMilliseconds<Days>;
  for (let i = 1; i <= 7; i++) {
    days[i as keyof typeof days] = i * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  }
  return days;
};

/** Generates and returns an object whose keys in number represent ***time*** in `minute` and values expressed in `milliseconds`
 * @description Ranges from 1 to 59 ***minutes***
 */
export const generateMinutes = (): TimeInMilliseconds<Minutes> => {
  const minutes = {} as TimeInMilliseconds<Minutes>;
  for (let i = 1; i <= 59; i++) {
    minutes[i as keyof typeof minutes] = i * 60 * 1000; // Convert minutes to milliseconds
  }
  return minutes;
};

/**
 * Used to generate random positive integers of length, 4 by default, otherwise the passed in length, and expiration time for the code which by default is 15 minutes, otherwise the passed in expiration time.
 * @param length
 * @param exp Code expiration time in `minutes` [15 minutes by default] expressed in milliseconds
 * @returns random code [positive integers] and expiration time
 */

export function getRandomNumbers(length: number = 4, exp: number = 15) {
  const { randomUUID } = new ShortUniqueId({
    length,
    dictionary: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  });

  const code = randomUUID();
  //set code expiration
  const expiresAt = Date.now() + exp * 60 * 1000; // by default, code expires 15 minutes after it's generated.

  return {
    /** Random number */
    code: +code,
    /** Code expiration time expressed in `milliseconds` */
    expiresAt,
  };
}

/**
 * Function obscures an email address
 * @param email string
 * @example 's******@gmail.com'
 * @returns Obscured email
 */
export const obscureEmail = (email: string) => {
  if (email) {
    const [name, domain] = email.split('@');
    const l = name.length;
    if (l > 2) {
      return `${name[0]}${new Array(l - 1).join('*')}${name[l - 1]}@${domain}`;
    } else {
      return `${name[0]}${new Array(l).join('*')}@${domain}`;
    }
  }
};

// /**
//  * Verifies a jwt token and returns the decoded data if verified, or an error message if token fails verification
//  * @param token
//  * @param secret
//  * @returns decoded `data` OR `error message`
//  */
// export const verifyJwtToken = (
//   token: string,
//   options?: { message?: string },
//   secret: string = envs.jwtSecret,
// ) => {
//   try {
//     const data = jwt.verify(token, secret);
//     if (data && typeof data !== 'string') return { data };
//   } catch (err) {
//     let message = 'Invalid Token.';

//     if (err?.message?.toLowerCase()?.includes('expired')) {
//       message =
//         options.message ||
//         'Hey champ! Your session expired, please login again.';
//     }

//     return {
//       error: message,
//     };
//   }
// };
