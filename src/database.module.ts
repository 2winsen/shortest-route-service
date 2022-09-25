/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { AppService } from './app.service';

@Module({
  providers: [
    AppService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        // local
        // const url = 'mongodb://root:example@localhost:27017';
        // docker-compose
        const url = 'mongodb://root:example@mongodb:27017';
        const client = new MongoClient(url);
        const dbName = 'shortest-path-service';
        try {
          await client.connect();
          return client.db(dbName);
        } catch (e) {
          throw e;
        }
      }
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule { }
