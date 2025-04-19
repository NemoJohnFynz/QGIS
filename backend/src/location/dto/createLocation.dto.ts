import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateIf,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
    @ApiProperty({ example: 'Quán Coffee Tình đắng như Cà Phê' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123 Main St, City, Country' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: '+1234567890' })
    @IsNumber()
    @IsOptional()
    phone?: number;

    @ApiProperty({ example: 12.345678 })
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @ApiProperty({ example: 98.765432 })
    @IsNumber()
    @IsNotEmpty()
    longitude: number;
}
