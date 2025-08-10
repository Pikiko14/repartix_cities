import { CityEntity } from "src/cities/entities/city.entity";
import { CreateCityDto } from './../../cities/dto/create-city.dto';

export interface ICitiesRepository {
  create(createCityDto: CreateCityDto): Promise<CityEntity | unknown>;
  
  find(params: { key: keyof CityEntity; value: any }): Promise<CityEntity | null>;
  
  update(id: string, user: CityEntity): Promise<CityEntity | null>;
  
  delete(id: string, parent_id: string): Promise<void>;
}
