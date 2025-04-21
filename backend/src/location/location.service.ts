import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, ConflictException, BadRequestException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateLocationDto } from './dto/createLocation.dto';
import { Location } from './schema/location.schema';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
    ) { }

    async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
        const existing = await this.locationModel.findOne({ name: createLocationDto.name });
        if (existing) {
          throw new BadRequestException('Tên địa điểm đã tồn tại');
        }
    
        const newLocation = new this.locationModel({
          ...createLocationDto,
          reviews: [],
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

    async getLcocationByName(name: string): Promise<Location[]> {
        const locations = await this.locationModel.find({ name: { $regex: name, $options: 'i' } }).exec();
        if (!locations || locations.length === 0) {
            throw new NotFoundException('Location not found');
        }
        return locations;
    }

    // async updateLocation(id: string, )
}