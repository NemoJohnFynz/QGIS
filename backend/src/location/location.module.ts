import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
    ;
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationSchema } from './schema/location.schema';
@Module({
    imports: [

        //
        MongooseModule.forFeature([
            {
                name: 'Location',
                schema: LocationSchema,
            },
        ]),
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [MongooseModule, LocationService],
})
export class LocationModule { }