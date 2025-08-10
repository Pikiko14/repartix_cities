import { envs } from './configuration';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesModule } from './cities/cities.module';
import { CacheServiceModule } from './commons/cache/cache.module';

@Module({
  imports: [
    CacheServiceModule,
    MongooseModule.forRoot(envs.app_env === 'production' ?  envs.atlas_url : envs.db_url,),
    CitiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
