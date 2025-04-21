import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  images: string[]; // URL hình ảnh

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true, // [longitude, latitude]
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ default: [] })
  categories: string[]; // VD: ['restaurant', 'coffee']

  @Prop()
  address: string;

  @Prop({
    type: Map,
    of: String,
    default: {},
  })
  contact: Map<string, string>; // phone, email, website...

  @Prop({
    type: [
      {
        day: { type: String, required: true },
        open: String,
        close: String,
        isClosed: Boolean,
      },
    ],
  })
  openingHours: {
    day: string;
    open: string;
    close: string;
    isClosed?: boolean;
  }[];

  @Prop({ type: [Types.ObjectId], ref: 'Review', default: [] })
  reviews: Types.ObjectId[];

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: String,
        description: String,
      },
    ],
    default: [],
  })
  menu: {
    name: string;
    price: number;
    image?: string;
    description?: string;
  }[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
