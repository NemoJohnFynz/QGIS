import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsObject,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  
  class OpeningHourDto {
    @ApiProperty({ example: 'Monday' })
    @IsString()
    day: string;
  
    @ApiProperty({ example: '08:00', required: false })
    @IsOptional()
    @IsString()
    open?: string;
  
    @ApiProperty({ example: '22:00', required: false })
    @IsOptional()
    @IsString()
    close?: string;
  
    @ApiProperty({ example: false, required: false })
    @IsOptional()
    isClosed?: boolean;
  }
  
  class MenuItemDto {
    @ApiProperty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsNumber()
    price: number;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    image?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;
  }
  
  export class UpdateLocationDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    images?: string[];
  
  
    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    categories?: string[];
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;
  
    @ApiProperty({ example: { phone: '0123456789', website: 'https://abc.com' }, required: false })
    @IsOptional()
    contact?: Map<string, string>;
  
    @ApiProperty({ type: [OpeningHourDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OpeningHourDto)
    openingHours?: OpeningHourDto[];
  
    @ApiProperty({ type: [MenuItemDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MenuItemDto)
    menu?: MenuItemDto[];
  }
  