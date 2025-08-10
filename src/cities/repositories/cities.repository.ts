import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { CityEntity } from '../entities/city.entity';
import { UpdateCityDto } from '../dto/update-city.dto';
import { CreateCityDto } from '../dto/create-city.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { City, CityDocument } from '../schemas/cities.schema';
import { ICitiesRepository } from 'src/commons/interfaces/respository.interface';
import { PaginationResponseInterface } from 'src/commons/interfaces/response.interface';

@Injectable()
export class CitiesRepository implements ICitiesRepository {
  constructor(@InjectModel(City.name) private readonly model: Model<City>) {}

  async create(createCityDto: CreateCityDto): Promise<CityEntity | unknown> {
    try {
      return (await this.model.create(createCityDto)) as any;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async find(params: {
    key: keyof CityEntity | any;
    value: any;
  }): Promise<CityEntity | null> {
    try {
      return await this.model.findOne({ [params.key]: params.value });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async update(
    id: string | number,
    user: CityEntity | UpdateCityDto,
  ): Promise<CityEntity | null> {
    try {
      return await this.model.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async delete(id: string, parent: string): Promise<void> {
    try {
      return await this.model.findOneAndDelete({ _id: id, parent_id: parent });
    } catch (error) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * Paginate users
   * @param query - Query object for filtering results
   * @param skip - Number of documents to skip
   * @param perPage - Number of documents per page
   * @param sortBy - Field to sort by (default: "name")
   * @param order - Sort order (1 for ascending, -1 for descending, default: "1")
   */
  public async paginate(
    query: Record<string, any>,
    skip: number,
    perPage: number,
    fields: string[] = [
      '_id',
      'name',
      'province',
      'cod_city',
      'lat',
      'lon',
      'zones',
    ],
  ): Promise<PaginationResponseInterface> {
    try {
      // Fetch paginated data
      const users = await this.model
        .find(query)
        .select(fields.length > 0 ? fields.join(' ') : '')
        .skip(skip)
        .limit(perPage);

      // Get total count of matching documents
      const totalUsers = await this.model.countDocuments(query);

      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / perPage);

      return {
        data: users,
        totalPages,
        totalItems: totalUsers,
      };
    } catch (error: any) {
      throw new RpcException({
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async validateUserHaveCity(
    parent_id: string,
    name: string,
  ): Promise<CityDocument | void> {
    return await this.model.findOne({ parent_id, name: name });
  }
}
