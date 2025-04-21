import { CreateCategoryDto } from './../category/dto/createCategory.dto';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/createLocation.dto';
import { AuthGuardD } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/auth/schema/user.schema';
import { UpdateLocationDto } from './dto/updateLocation.dto';


    @ApiTags('locations')
    @Controller('location')
    export class LocationController {
      constructor(private readonly locationService: LocationService) {}
    
    
    @Post('createLocation')
    @UseGuards(AuthGuardD)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Tạo địa điểm mới kèm ảnh (upload)' })
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
    async createLocation(
    @CurrentUser() currentUser: User,
    @Body() createLocationDto: CreateLocationDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    ) {
    if (!currentUser) {
        throw new HttpException('User không tồn tại hoặc chưa xác thực', HttpStatus.UNAUTHORIZED);
    }

    const newLocation = await this.locationService.createLocation(createLocationDto, files?.files);
    return newLocation;
    }

    @Patch('updatelocation/:id')
    @UseGuards(AuthGuardD)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Cập nhật địa điểm kèm ảnh mới (nếu có)' })
    @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 10 }]))
    async updateLocation(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @UploadedFiles() files: { files: Express.Multer.File[] },
    ) {
    return this.locationService.updateLocation(id, updateLocationDto, files?.files);
    }

    @Get('getLocationById/:id')
    @UseGuards(AuthGuardD)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lấy thông tin địa điểm theo ID' })
    async getLocationById(
    @CurrentUser() currentUser: User,
    @Param('id') id: string,
    ) {
        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }
        return this.locationService.getLocationById(id);
    }

    @Get('getLocationByName/:name')
    @UseGuards(AuthGuardD)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lấy thông tin địa điểm theo tên' })
    async getLocationByName(
    @CurrentUser() currentUser: User,
    @Param('name') name: string,
    ) {
        if (!currentUser) {
            throw new HttpException('User not found or not authenticated', HttpStatus.UNAUTHORIZED);
        }
        return this.locationService.getLcocationByName(name);
    }

    


    @Get('getAllLocations')
    async getAllLocations() {
        return this.locationService.getAllLocations()
    }
}