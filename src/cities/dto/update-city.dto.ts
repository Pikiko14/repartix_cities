import { PartialType } from '@nestjs/mapped-types';
import { CreateCityDto } from './create-city.dto';
import { IsOptional } from 'class-validator';

export class UpdateCityDto extends PartialType(CreateCityDto) {
  @IsOptional()
  id: number | string;

  @IsOptional()
  _id: string;
}
