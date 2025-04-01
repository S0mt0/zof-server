import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

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
    return 0;
  }

  return args.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1,
  );
};

/** Generates and returns an object whose keys in number represent ***time*** in `hour` and values expressed in `milliseconds`
 * @description Ranges from 1 to 24 ***hours***
 */
export function generateHours(): TimeInMilliseconds<Hours> {
  const hours = {} as TimeInMilliseconds<Hours>;
  for (let i = 1; i <= 24; i++) {
    hours[i as keyof typeof hours] = i * 60 * 60 * 1000;
  }
  return hours;
}

/** Generates and returns an object whose keys in number represent ***time*** in `day` and values expressed in `milliseconds`
 * @description Ranges from 1 to 7 ***days***
 */
export function generateDays(): TimeInMilliseconds<Days> {
  const days = {} as TimeInMilliseconds<Days>;
  for (let i = 1; i <= 7; i++) {
    days[i as keyof typeof days] = i * 24 * 60 * 60 * 1000;
  }
  return days;
}

/** Generates and returns an object whose keys in number represent ***time*** in `minute` and values expressed in `milliseconds`
 * @description Ranges from 1 to 59 ***minutes***
 */
export function generateMinutes(): TimeInMilliseconds<Minutes> {
  const minutes = {} as TimeInMilliseconds<Minutes>;
  for (let i = 1; i <= 59; i++) {
    minutes[i as keyof typeof minutes] = i * 60 * 1000;
  }
  return minutes;
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

/**
 * Transforms the return mongodb document by removing specified schema properties
 * @param schemaProps - array of schema properties
 * @returns Transform function of a mongodb schema
 */
export const removeSchemaProps = (schemaProps: string[]) => {
  return (_, ret: Record<string, any>) => {
    if (schemaProps.length) {
      schemaProps.forEach((prop) => {
        if (prop.includes('.')) {
          const [parent, child] = prop.split('.');
          if (ret[parent]) delete ret[parent][child];
        }

        delete ret[prop];
      });
    }

    delete ret.id;
    delete ret.__v;

    return ret;
  };
};

/**
 * @param schemaProps - array of optional schema properties that should be removed when converting a mongo document to plain javascript object or when toJSON is called
 * @returns toObject/toJSON document options
 */
export const transformSchema = (schemaProps?: string[]) => {
  return {
    virtuals: true,
    versionKey: false,
    transform: removeSchemaProps(schemaProps),
  };
};

export const extractAuthHeader = (req: Request) => {
  const authorization =
    req.headers['authorization'] || (req.headers['Authorization'] as string);

  if (!authorization || !authorization.startsWith('Bearer '))
    throw new UnauthorizedException('Missing or invalid authorization header.');

  return authorization.split(' ')[1] as string;
};
