import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })

export class Location extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    address: string;

    @Prop({ type: Number })
    phone: number;

    @Prop({ type: Number, required: true })
    latitude: number;

    @Prop({ type: Number, required: true })
    longitude: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);