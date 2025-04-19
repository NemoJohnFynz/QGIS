import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, ConflictException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateLocationDto } from './dto/createLocation.dto';
import { Location } from './schema/location.schema';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
    ) { }

    async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
        const { name, address, phone, latitude, longitude } = createLocationDto;

        const existingLocation = await this.locationModel.findOne({ name });
        if (existingLocation) {
            throw new ConflictException('Location already exists');
        }

        const newLocation = new this.locationModel({
            name,
            address,
            phone,
            latitude,
            longitude,
        });

        return newLocation.save();
    }

    async getAllLocations(): Promise<Location[]> {
        return this.locationModel.find().exec();
    }

    async getLocationById(id: string): Promise<Location> {
        const location = await this.locationModel.findById(id).exec();
        if (!location) {
            throw new NotFoundException('Location not found');
        }
        return location;
    }
}