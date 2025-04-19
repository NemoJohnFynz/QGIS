import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize, ArrayMaxSize, IsString, IsOptional } from 'class-validator';

export class GetDirectionsDto {



  @ApiProperty({ example: '10.762622,106.660172', description: 'Vị trí bắt đầu (latitude,longitude)' })  
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  origin: number[];


  @ApiProperty({ example: '10.762622,106.660172', description: 'Vị trí đích (latitude,longitude)' })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  destination: number[];


  @ApiProperty({ example: 'driving', description: 'Loại phương tiện: driving, walking, cycling' })
  @IsOptional()
  @IsString()
  profile?: string; // driving, walking, cycling
}
