import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import { FileService } from './file.service';
import { ApiOperationDecorator } from '@lib/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConduitImagekitService } from '@lib/conduit-imagekit';

@Controller('file')
export class FileController {
  private readonly logger: Logger;
  constructor(
    private readonly fileService: FileService,
    private readonly imageKitService: ConduitImagekitService,
  ) {
    this.logger = new Logger('FileController');
  }

  @ApiOperationDecorator({
    summary: 'Get ImageKit',
    description: 'Get ImageKit AuthenticationParameter',
  })
  @ApiBearerAuth()
  @Get('imagekit-auth')
  async getImageKitAuthParameter() {
    try {
      const authParameter =
        await this.imageKitService.getAuthenticationParameter();
      return authParameter;
    } catch (error) {
      this.logger.warn('Get ImageKit AuthenticationParameter failed: ', error);
      throw new HttpException(
        'Get ImageKit AuthenticationParameter failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @ApiOperationDecorator({
  //   summary: 'Upload Image',
  //   description: 'Upload Image to ImageKit',
  // })
  // @ApiBearerAuth()
  // @Get('upload')
  // async uploadImage(@Req() req: Request, @Res) {
  //   try {
  //     const response = await axios.post(
  //       'https://ik.imagekit.io/qinoqbrbp/api/v1/files/upload',
  //       req.body,
  //       { headers: { Authorization: `Bearer YOUR_API_KEY` } },
  //     );
  //     res.json(response.data);
  //   } catch (error) {
  //     res
  //       .status(error.response?.status || 500)
  //       .json(error.response?.data || 'Error');
  //   }
  // }
}
