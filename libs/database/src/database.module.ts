import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

interface DatabaseModuleOptions {
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  dbName: string;
}

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_OPTIONS',
          useValue: options,
        },
        {
          provide: DatabaseService,
          useFactory: () => {
            return new DatabaseService();
          },
        },
      ],
      exports: ['DATABASE_OPTIONS', DatabaseService],
    };
  }
}
