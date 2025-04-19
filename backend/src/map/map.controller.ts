import { Controller, UseGuards, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MapService } from './map.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuardD } from 'src/auth/guard/auth.guard';
import { GetDirectionsDto } from './dto/get-directions.dto';

@ApiTags('Map')
@ApiBearerAuth()
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post('directions')
  @UseGuards(AuthGuardD)
  @ApiOperation({ summary: 'Lấy chỉ đường', description: 'Lấy hướng đi từ vị trí bắt đầu đến đích sử dụng dịch vụ bản đồ.' })
  @ApiBody({ type: GetDirectionsDto })
  @ApiResponse({ status: 200, description: 'Trả về hướng đi thành công.' })
  @ApiResponse({ status: 400, description: 'Yêu cầu không hợp lệ.' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực hoặc token không hợp lệ.' })
  async getDirections(@Body() dto: GetDirectionsDto) {
    try {
      const { origin, destination, profile } = dto;
      return await this.mapService.getDirections(origin, destination, profile);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
