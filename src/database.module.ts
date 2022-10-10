/* istanbul ignore file */
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule],
  providers: [
    AppService,
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Db> => {
        const logger = new Logger(DatabaseModule.name);
        const url = configService.get<string>('DB_URL');
        logger.log(`DB_URL ${url}`);
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
