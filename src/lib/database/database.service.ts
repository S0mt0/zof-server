import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationBootstrap() {
    try {
      if (this.connection.readyState === 1) {
        console.log('Database connection established successfully🗼');
      } else {
        console.error('Database connection not ready⚠️');
        process.exit(1);
      }
    } catch (error) {
      console.error('Unable to connect to the database⚠️:', error);
      process.exit(1);
    }
  }
}
