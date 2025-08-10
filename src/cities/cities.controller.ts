import { Controller } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { DeleteCityDto } from './dto/delete-city.dto';
import { QueryParamDto } from 'src/commons/dto/query-param.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @MessagePattern('create-city')
  create(@Payload() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @MessagePattern('find-all-cities')
  findAll(queryParams: QueryParamDto) {
    return this.citiesService.findAll(queryParams);
  }

  @MessagePattern('update-city')
  update(@Payload() updateCityDto: UpdateCityDto) {
    return this.citiesService.update(updateCityDto.id, updateCityDto);
  }

  @MessagePattern('remove-city')
  remove(@Payload() deleteCityDto: DeleteCityDto) {
    return this.citiesService.remove(deleteCityDto);
  }
}
