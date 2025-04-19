import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Category extends Document {
@Prop({
unique: [
    true,
    'The category has been created, please try with another category',
],
})
name: string;

@Prop()
description: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);


