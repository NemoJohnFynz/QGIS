import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Review } from './review.schema';

@Schema()
export class Location extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: Object })
  location: { type: string; coordinates: number[] };

  @Prop({
    type: {
      phone: { type: String, required: false },
      website: { type: String, required: false },
      email: { type: String, required: false },
    },
    default: {},
  })
  contact: { phone?: string; website?: string; email?: string };

  @Prop({
    type: [
      {
        day: { type: String, required: true },
        open: { type: String, required: true },
        close: { type: String, required: true },
        isClosed: { type: Boolean, required: true },
      },
    ],
    default: [],
  })
  openingHours: { day: string; open: string; close: string; isClosed: boolean }[];

  menu: { name: string; price: number; description: string }[];

  @Prop({ type: String, ref: 'Category' })
  categories?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: "Review", default: [] })
  reviews: Review[];

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);