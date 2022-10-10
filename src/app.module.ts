/* istanbul ignore file */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.prod'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
