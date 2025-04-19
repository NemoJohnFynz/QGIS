import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
    ;
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationSchema } from './schema/location.schema';
import { AuthModule } from 'src/auth/auth.module';
@Module({
    imports: [

        MongooseModule.forFeature([
            {
                name: 'Location',
                schema: LocationSchema,
            },
        ]),
        AuthModule
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [MongooseModule, LocationService],
})
export class LocationModule { }