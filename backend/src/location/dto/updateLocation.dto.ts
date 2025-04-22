import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({
    example: 'quán cà phê Nemo',
    description: 'Tên địa điểm, gửi dưới dạng chuỗi trong form-data',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '256 nguyễn văn cừ',
    description: 'Địa chỉ, gửi dưới dạng chuỗi trong form-data',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '{"type":"Point","coordinates":[105.85,21.02]}',
    description: 'Chuỗi JSON mô tả tọa độ địa điểm (type: "Point", coordinates: [longitude, latitude]), gửi dưới dạng chuỗi trong form-data',
    required: true,
  })

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['phone:0836887911', 'website:https://example.com', 'email:tienyeuai2200@gmail.com'],
    description: 'Danh sách thông tin liên hệ, gửi một hoặc nhiều giá trị với key "contact" (VD: contact=phone:0836887911, contact=website:https://example.com). Mỗi giá trị phải có định dạng key:value.',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  contact?: string | string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['day:Monday,open:08:00,close:22:00,isClosed:false', 'day:Tuesday,open:08:00,close:22:00,isClosed:false'],
    description: 'Danh sách giờ mở cửa, gửi một hoặc nhiều giá trị với key "openingHours" (VD: openingHours=day:Monday,open:08:00,close:22:00,isClosed:false). Mỗi giá trị phải có định dạng day:...,open:...,close:...,isClosed:....',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  openingHours?: string | string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['name:cà phê đá,price:25000,description:cà phê đá', 'name:trà sữa,price:30000,description:trà sữa ngon'],
    description: 'Danh sách món ăn, gửi một hoặc nhiều giá trị với key "menu" (VD: menu=name:cà phê đá,price:25000,description:cà phê đá). Mỗi giá trị phải có định dạng name:...,price:...,description:....',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  menu?: string | string[];

  @ApiProperty({
    example: '6805e45d1a410c5428e154d5',
    description: 'Danh sách ID danh mục, gửi dưới dạng chuỗi hoặc nhiều giá trị trong form-data',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  categories?: string;

  @ApiProperty({
    example: 'mô tả địa điểm',
    description: 'Mô tả địa điểm, gửi dưới dạng chuỗi trong form-data',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Danh sách file ảnh (tối đa 10 file), gửi dưới dạng file trong form-data',
    required: false,
  })
  files?: Express.Multer.File[];
}