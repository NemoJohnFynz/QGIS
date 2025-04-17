import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    unique: [
      true,
      'The phone number has been created, please try with another number',
    ],
  })
  numberPhone: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  address: string;

  @Prop()
  gender: boolean; 

  @Prop()
  avatar: string;

  @Prop()
  coverImage: string;

  @Prop({ default: false })
  role: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  otp: string

  @Prop()
  otpExpirationTime: Date

  @Prop()
  refreshToken: string;

  
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
