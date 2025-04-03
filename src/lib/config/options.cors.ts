import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

import { NODE_ENV } from '../constants';

/** Allowed production origins */
const prodOrigin = [
  'https://www.zitaonyekafoundation.org',
  'https://zitaonyekafoundation.org',
  'https://admin-zofoundation.vercel.app',
  'https://www.admin-zofoundation.vercel.app',
  'https://zof-server.onrender.com',
];

/** Allowed development origins */
const devOrigin = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];

const config = new ConfigService();
const isProduction = config.get(NODE_ENV) === 'production';

const allowedOrigins = isProduction ? prodOrigin : devOrigin;

/** CORS config options */
export const corsOptions: CorsOptions = {
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'X-Requested-With',
    'Accept',
    'User-Agent',
  ],

  credentials: true,
  optionsSuccessStatus: 200,
  exposedHeaders: [
    'Content-Range',
    'X-Content-Range',
    'Set-Cookie',
    'Authorization',
  ],

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  origin: (origin, callback) => {
    if (isProduction) {
      if (allowedOrigins.indexOf(origin!) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
};
