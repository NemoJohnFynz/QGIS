import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray, Validate, ValidationArguments } from "class-validator";
import { Types } from "mongoose";

// Validator tùy chỉnh để đảm bảo ít nhất một trường được cung cấp
const IsAtLeastOneFieldProvided = () => {
  return Validate(
    (args: ValidationArguments) => {
      const { content, mediaURL, location } = args.object as SendMessageDto;
      return !!(content || mediaURL?.length || location); // Kiểm tra ít nhất một trường có giá trị
    },
    {
      message: "Phải cung cấp ít nhất một trong các trường content, mediaURL hoặc location.",
    }
  );
};

export class SendMessageDto {
  @ApiProperty({
    example: "nội 😶‍🌫️ dung 😶‍🌫️ của 😶‍🌫️ bạn",
    required: false,
    type: "string",
  })
  @IsString()
  @IsOptional()
  readonly content?: string;

  @ApiProperty({
    type: "array",
    items: { type: "string", format: "binary" },
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly mediaURL?: string[];

  @ApiProperty({
    example: "vị ❗ trí ❗ của ❗ bạn",
    required: false,
    type: "string",
  })
  @IsString()
  @IsOptional()
  readonly location?: string;

  @IsAtLeastOneFieldProvided()
  private readonly atLeastOneFieldProvided?: boolean; 
}