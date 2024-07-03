import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { environment } from '../../../environment/environment';
import { ENTITIES_TOKEN } from './entities.token';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(@Inject(ENTITIES_TOKEN) private readonly entities: []) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      username: environment.database.username,
      password: environment.database.password,
      port: environment.database.port,
      host: environment.database.host,
      database: environment.database.name,
      logging: !environment.production,
      entities: this.entities,
      synchronize: false,
      autoLoadEntities: false,
    };
  }
}
