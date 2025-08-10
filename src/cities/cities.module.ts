import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesController } from './cities.controller';
import { City, CitySchema } from './schemas/cities.schema';
import { CitiesRepository } from './repositories/cities.repository';
import { CacheServiceModule } from 'src/commons/cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: City.name,
        schema: CitySchema,
      },
    ]),
    CacheServiceModule,
  ],
  controllers: [CitiesController],
  providers: [CitiesService, CitiesRepository],
})
export class CitiesModule {}
