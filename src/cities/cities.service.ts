import { RpcException } from '@nestjs/microservices';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { DeleteCityDto } from './dto/delete-city.dto';
import { CacheService } from 'src/commons/cache/cache.service';
import { QueryParamDto } from 'src/commons/dto/query-param.dto';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CitiesRepository } from './repositories/cities.repository';
import { ResponseRequestInterface } from 'src/commons/interfaces/response.interface';
import { CityEntity } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @Inject() private repository: CitiesRepository,
    @Inject() private readonly cacheService: CacheService,
  ) {}

  /**
   * Create city
   * @param { CreateCityDto } createCityDto
   * @returns
   */
  async create(createCityDto: CreateCityDto) {
    try {
      await this.cacheService.removeByPrefix(
        `keyv:${createCityDto.parent_id}:city:list`,
      );

      // validate essit city
      const issetCity = await this.repository.validateUserHaveCity(
        createCityDto.parent_id,
        createCityDto.name,
      );

      if (issetCity)
        throw new RpcException({
          message: 'City already exists',
          status: HttpStatus.BAD_REQUEST,
        });

      // creo la ciudad
      const city = await this.repository.create(createCityDto);

      // return response
      return {
        success: true,
        data: city,
        message: 'City created successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * List cities
   * @param { QueryParamDto } queryParams
   * @returns
   */
  async findAll(
    queryParams: QueryParamDto,
  ): Promise<ResponseRequestInterface | any> {
    const cacheKey = `${queryParams.parent_id}:city:list:${JSON.stringify(queryParams)}`;
    let cities = await this.cacheService.getItem(cacheKey);
    if (cities) {
      return {
        success: true,
        cities,
        message: 'Cities list (from cache)',
      };
    }

    try {
      let query: Record<string, any> = {
        parent_id: queryParams.parent_id,
      };

      // validamos la busqueda
      if (queryParams.search) {
        const searchRegex = new RegExp(queryParams.search as string, 'i');
        query = {
          $or: [{ name: searchRegex }, { cod_city: searchRegex }],
        };
      }

      // validamos la data de la paginacion
      const page = queryParams.page || 1;
      const perPage = queryParams.perPage || 7;
      const skip = (parseInt(page as string) - 1) * parseInt(perPage as string);

      cities = await this.repository.paginate(query, skip, perPage as number, [
        '_id',
        'name',
        'province',
        'cod_city',
        'lat',
        'lon',
        'zones',
      ]);

      // Guardamos el resultado en cache por 10 minutos
      await this.cacheService.setItem(cacheKey, cities);

      return {
        success: true,
        cities,
        message: 'Cities list',
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async update(id: number | string, updateCityDto: UpdateCityDto) {
    let city = await this.repository.find({
      key: '_id',
      value: updateCityDto.id,
    });

    if (!city)
      throw new RpcException({
        message: `City with this id: ${updateCityDto.id} not found`,
        status: HttpStatus.NOT_FOUND,
        error: true,
      });

    // clear cache
    await this.cacheService.removeByPrefix(
      `keyv:${updateCityDto.parent_id}:city:list`,
    );

    try {
      // validate if user exist with this email
      const issetCity = await this.repository.validateUserHaveCity(
        updateCityDto.parent_id,
        updateCityDto.name,
      );
      if (issetCity && issetCity.id !== city.id)
        throw new RpcException({
          message: 'City already exists',
          status: HttpStatus.BAD_REQUEST,
          error: true,
        });

      city = await this.repository.update(city.id, updateCityDto);

      // return data
      return {
        success: true,
        data: city,
        message: 'City Update Success',
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  /**
   * Delete city
   * @param { DeleteCityDto } deleteCityDto
   * @returns
   */
  async remove(deleteCityDto: DeleteCityDto) {
    await this.cacheService.removeByPrefix(
      `keyv:${deleteCityDto.parent_id}:city:list`,
    );

    let city: CityEntity | void = await this.repository.find({
      key: '_id',
      value: deleteCityDto.id,
    });

    if (!city) {
      throw new RpcException({
        message: `City with this id: ${deleteCityDto.id} not found`,
        status: HttpStatus.NOT_FOUND,
        error: true,
      });
    }

    try {
      city = await this.repository.delete(
        deleteCityDto.id,
        deleteCityDto.parent_id,
      );

      // return data
      return {
        success: true,
        data: city,
        message: 'City delete success',
      };
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
