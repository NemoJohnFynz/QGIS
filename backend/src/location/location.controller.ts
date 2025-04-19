import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { LocationService } from './location.service'
import { CreateLocationDto } from './dto/createLocation.dto';

@ApiTags('Location')
@Controller('location')
export class LocationController {
    constructor(
        private readonly locationService: LocationService,
    ) { }

    @Post('createLocation')
    @ApiOperation({ summary: 'Tạo vị trí cho bản đồ' })
    @ApiBody({ type: CreateLocationDto })
    async createLocation(@Body() createLocationDto: CreateLocationDto) {
        return this.locationService.createLocation(createLocationDto)
    }

    @Get('getAllLocations')
    @ApiBearerAuth()
    async getAllLocations() {
        return this.locationService.getAllLocations()
    }
}