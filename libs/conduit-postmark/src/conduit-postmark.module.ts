import {
  DynamicModule,
  Global,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import { Client } from 'postmark';
import { ConduitPostmarkService } from './index';

export interface PostmarkModuleOptions {
  apiToken: string;
}

export interface PostmarkModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<PostmarkModuleOptions> | PostmarkModuleOptions;
  inject?: any[];
}

@Global()
@Module({})
export class ConduitPostmarkModule {
  static forRoot(options: PostmarkModuleOptions): DynamicModule {
    const postmarkProvider: Provider = {
      provide: 'POSTMARK_CLIENT',
      useValue: new Client(options.apiToken),
    };
    return {
      module: ConduitPostmarkModule,
      providers: [postmarkProvider, ConduitPostmarkService],
      exports: [ConduitPostmarkService],
    };
  }

  static forRootAsync(options: PostmarkModuleAsyncOptions): DynamicModule {
    const asyncProvider: Provider[] = [
      {
        provide: 'POSTMARK_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
      {
        provide: 'POSTMARK_CLIENT',
        useFactory: async (options: PostmarkModuleOptions) => {
          return new Client(options.apiToken);
        },
        inject: ['POSTMARK_OPTIONS'],
      },
    ];
    return {
      module: ConduitPostmarkModule,
      imports: options.imports || [],
      providers: [...asyncProvider, ConduitPostmarkService],
      exports: [ConduitPostmarkService],
    };
  }
  static register(options: PostmarkModuleOptions): DynamicModule {
    const postmarkProvider: Provider = {
      provide: 'POSTMARK_CLIENT',
      useValue: new Client(options.apiToken),
    };

    return {
      module: ConduitPostmarkModule,
      providers: [postmarkProvider, ConduitPostmarkService],
      exports: [ConduitPostmarkService],
    };
  }
}
