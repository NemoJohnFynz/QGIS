import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
    ;
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationSchema } from './schema/location.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ReviewSchema } from './schema/review.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
    imports: [

        MongooseModule.forFeature([
            {
                name: 'Location',
                schema: LocationSchema,
            },
        ]),
        MongooseModule.forFeature([
            {
                name: 'Review',
                schema: ReviewSchema,
            },
        ]),
        AuthModule,
        CloudinaryModule,
    ],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [MongooseModule, LocationService],
})
export class LocationModule { }