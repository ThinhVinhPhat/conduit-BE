import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConduitImagekitService } from './conduit-imagekit.service';
const ImageKit = require('imagekit');

type ConduitImagekitModuleOptions = {
  publicKey: string;
  privateKey: string;
  url: string;
};

@Global()
@Module({})
export class ConduitImagekitModule {
  static forRoot(options: ConduitImagekitModuleOptions): DynamicModule {
    const imagekitProvider: Provider = {
      provide: 'IMAGEKIT_CLIENT',
      useValue: new ImageKit({
        publicKey: options.publicKey,
        privateKey: options.privateKey,
        urlEndpoint: options.url,
      }),
    };
    return {
      module: ConduitImagekitModule,
      providers: [imagekitProvider, ConduitImagekitService],
      exports: [ConduitImagekitService],
    };
  }
}
