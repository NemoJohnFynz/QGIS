import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EventModule } from './event/event.module';
import { CategoryModule } from './category/category.module';

import { LocationModule } from 'src/location/location.module';
import { MapModule } from './map/map.module';
import { ChatModule } from './chat/chat.module';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    CloudinaryModule,
    EventModule,
    CategoryModule,
    EventModule,
    LocationModule,
    MapModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
