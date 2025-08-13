import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: true })
export class Zone {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cod_zone: string;

  @Prop({ required: false, min: -90, max: 90 })
  lat?: number;

  @Prop({ required: false, min: -180, max: 180 })
  lon?: number;

  @Prop({ required: false })
  price?: string;
}
export const ZoneSchema = SchemaFactory.createForClass(Zone);


export type CityDocument = City & Document;
@Schema({ timestamps: true })
export class City {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  cod_city: string;

  @Prop({ required: true, min: -90, max: 90 })
  lat: number;

  @Prop({ required: true, min: -180, max: 180 })
  lon: number;

  @Prop({ type: [ZoneSchema], default: [] })
  zones: Zone[];

  @Prop()
  parent_id?: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
