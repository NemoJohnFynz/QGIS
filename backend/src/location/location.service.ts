import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException, ConflictException, BadRequestException, HttpException, HttpStatus, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateLocationDto } from './dto/createLocation.dto';
import { Location } from './schema/location.schema';
import { UpdateLocationDto } from './dto/updateLocation.dto';
import { CreateReviewDto } from './dto/createReview.dto';
import { Review } from './schema/review.schema';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
        @InjectModel('Review') private reviewModel: Model<Review>,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    
    async createLocation(
        createLocationDto: CreateLocationDto,
        files?: Express.Multer.File[],
      ): Promise<Location> {

        // Xử lý trường contact
        const contactObject: Record<string, string> = {};
        const contactEntries = Array.isArray(createLocationDto.contact)
          ? createLocationDto.contact
          : createLocationDto.contact
          ? [createLocationDto.contact]
          : [];
        if (contactEntries.length > 0) {
          try {
            contactEntries.forEach((contactEntry: string) => {
              const [key, value] = contactEntry.split(':');
              if (!key || !value) {
                throw new Error(`Định dạng không hợp lệ: ${contactEntry}. Định dạng mong đợi: key:value`);
              }
              contactObject[key.trim()] = value.trim();
            });
          } catch (error) {
            throw new BadRequestException(`Lỗi xử lý contact: ${error.message}`);
          }
        }
      
        // Xử lý trường openingHours
        const openingHoursArray: { day: string; open: string; close: string; isClosed: boolean }[] = [];
        const openingHoursEntries = Array.isArray(createLocationDto.openingHours)
          ? createLocationDto.openingHours
          : createLocationDto.openingHours
          ? [createLocationDto.openingHours]
          : [];
        if (openingHoursEntries.length > 0) {
          try {
            openingHoursEntries.forEach((entry: string) => {
              const pairs = entry.split(',').map((pair: string) => pair.split(':'));
              const entryObject: { [key: string]: string | boolean } = {};
      
              pairs.forEach(([key, value]: [string, string]) => {
                if (!key || !value) {
                  throw new Error(`Định dạng không hợp lệ: ${entry}. Định dạng mong đợi: day:...,open:...,close:...,isClosed:...`);
                }
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                if (trimmedKey === 'isClosed') {
                  entryObject[trimmedKey] = trimmedValue.toLowerCase() === 'true';
                } else {
                  entryObject[trimmedKey] = trimmedValue;
                }
              });
      
              // Kiểm tra các trường bắt buộc
              if (!entryObject.day || !entryObject.open || !entryObject.close || entryObject.isClosed === undefined) {
                throw new Error(`Thiếu trường bắt buộc trong openingHours: ${entry}`);
              }
      
              openingHoursArray.push({
                day: entryObject.day as string,
                open: entryObject.open as string,
                close: entryObject.close as string,
                isClosed: entryObject.isClosed as boolean,
              });
            });
          } catch (error) {
            throw new BadRequestException(`Lỗi xử lý openingHours: ${error.message}`);
          }
        }
      
        // Xử lý trường menu
        const menuArray: { name: string; price: number; description: string }[] = [];
        const menuEntries = Array.isArray(createLocationDto.menu)
          ? createLocationDto.menu
          : createLocationDto.menu
          ? [createLocationDto.menu]
          : [];
        if (menuEntries.length > 0) {
          try {
            menuEntries.forEach((entry: string) => {
              const pairs = entry.split(',').map((pair: string) => pair.split(':'));
              const entryObject: { [key: string]: string | number } = {};
      
              pairs.forEach(([key, value]: [string, string]) => {
                if (!key || !value) {
                  throw new Error(`Định dạng không hợp lệ: ${entry}. Định dạng mong đợi: name:...,price:...,description:...`);
                }
                const trimmedKey = key.trim();
                const trimmedValue = value.trim();
                if (trimmedKey === 'price') {
                  const priceValue = parseFloat(trimmedValue);
                  if (isNaN(priceValue)) {
                    throw new Error(`Giá trị price không hợp lệ: ${trimmedValue}. Phải là một số.`);
                  }
                  entryObject[trimmedKey] = priceValue;
                } else {
                  entryObject[trimmedKey] = trimmedValue;
                }
              });
      
              // Kiểm tra các trường bắt buộc
              if (!entryObject.name || entryObject.price === undefined || !entryObject.description) {
                throw new Error(`Thiếu trường bắt buộc trong menu: ${entry}`);
              }
      
              menuArray.push({
                name: entryObject.name as string,
                price: entryObject.price as number,
                description: entryObject.description as string,
              });
            });
          } catch (error) {
            throw new BadRequestException(`Lỗi xử lý menu: ${error.message}`);
          }
        }
      
        // Parse trường location
        let parsedLocation: { type: string; coordinates: number[] };
        try {
          parsedLocation = JSON.parse(createLocationDto.location);
          if (!parsedLocation.type || parsedLocation.type !== 'Point' || !Array.isArray(parsedLocation.coordinates) || parsedLocation.coordinates.length !== 2) {
            throw new BadRequestException('Định dạng location không hợp lệ. Định dạng mong đợi: {"type":"Point","coordinates":[longitude,latitude]}');
          }
        } catch (error) {
          throw new BadRequestException(`Định dạng JSON không hợp lệ ở trường location: ${error.message}`);
        }
      
        // Tạo đối tượng Location mới
        const newLocation = new this.locationModel({
          ...createLocationDto,
          location: parsedLocation,
          contact: contactObject,
          openingHours: openingHoursArray,
          menu: menuArray, // Lưu menu dưới dạng mảng các đối tượng
          reviews: [],
        });
      
        // Nếu có upload file (ảnh)
        if (files && files.length > 0) {
          try {
            const uploadedImages = await Promise.all(
              files.map(file => this.cloudinaryService.uploadFile(file)),
            );
            newLocation.images = uploadedImages;
          } catch (error) {
            throw new HttpException('Upload ảnh thất bại', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      
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

    async updateLocation(
        id: string,
        updateLocationDto: UpdateLocationDto,
        files?: Express.Multer.File[],
      ): Promise<Location> {
        const location = await this.locationModel.findById(id);
        if (!location) {
          throw new NotFoundException('Location not found');
        }
      
        // Nếu có file ảnh mới thì upload lên Cloudinary
        if (files && files.length > 0) {
          try {
            const uploadedImages = await Promise.all(
              files.map((file) => this.cloudinaryService.uploadFile(file))
            );
            location.images = uploadedImages;
          } catch (error) {
            throw new HttpException('Failed to upload new images', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      
        // Cập nhật các trường khác (ngoại trừ ảnh)
        Object.assign(location, updateLocationDto);
      
        return location.save();
      }
      

    async deleteLocation(id: string): Promise<Location> {
        const location = await this.locationModel.findByIdAndDelete(id).exec();
        if (!location) {
            throw new NotFoundException('Location not found');
        }
        return location;
    }

    async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
      const { user, location, rating, comment } = createReviewDto;
  
      const newReview = new this.reviewModel({
        user,
        location,
        rating,
        comment,
      });
  
      return newReview.save();
    }

    async getReviewInLocation(locationId: string): Promise<Review[]> {
      const location = await this.locationModel.findById(locationId);
      if (!location) {
        throw new NotFoundException('Location not found');
      }
      const reviews = await this.reviewModel.find({ location: locationId }).exec();
      if (!reviews || reviews.length === 0) {
        throw new NotFoundException('No reviews found for this location');
      }
      return reviews;
    }

    
}