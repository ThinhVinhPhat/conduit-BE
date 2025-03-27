import { Inject, Injectable } from '@nestjs/common';
import { config } from 'apps/main-service/src/config';
import ImageKit from 'imagekit';

@Injectable()
export class ConduitImagekitService {
  constructor(
    @Inject('IMAGEKIT_CLIENT') private readonly imagekitProvider: ImageKit,
  ) {}

  async getAuthenticationParameter() {
    const auth = await this.imagekitProvider.getAuthenticationParameters();
    return {
      token: auth.token,
      expire: auth.expire,
      signature: auth.signature,
      publicKey: config.imageKit.PUBLIC_KEY,
    };
  }
}
