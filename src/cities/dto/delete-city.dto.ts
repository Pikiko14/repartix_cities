import { IsString, IsOptional } from 'class-validator';

export class DeleteCityDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  parent_id: string;
}
