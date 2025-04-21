import { CreateCategoryDto } from './../category/dto/createCategory.dto';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/createLocation.dto';
import { AuthGuardD } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/auth/schema/user.schema';

@ApiTags('Location')
@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
    ) { }

    @Post('createLocation')
    @UseGuards(new RolesGuard(true))
    @UseGuards(AuthGuardD)
    async createCategory(
        @Body() createLocationDto: CreateLocationDto,
        @CurrentUser() currentUser: User,
    ) {
        try {
            const newCategory = await this.locationService.createLocation(createLocationDto);
            return newCategory;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('getAllLocations')
    async getAllLocations() {
        return this.locationService.getAllLocations()
    }
}