import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/create-auth.dto';
import { ApiOperationDecorator, Public } from '@lib/decorators';
import { ValidateCodeDTO } from './dto/validate-email.dto';
import { UserResponseWrapperDto } from '../user/dto/user-respond.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperationDecorator({
    summary: 'Sign in',
    description: 'Sign in with email and password',
  })
  @Post('/login')
  signIn(@Body() createAuthDto: SignInDto) {
    if (Object.keys(createAuthDto).length == 0) {
      return { message: 'Invalid request' };
    }
    return this.authService.signIn(createAuthDto);
  }

  @Public()
  @ApiOperationDecorator({
    summary: 'Sign in',
    description: 'Sign in with email and password',
  })
  @Post('/validate-code')
  async validateEmail(@Body() validateCodeDTO: ValidateCodeDTO) {
    if (Object.keys(validateCodeDTO).length == 0) {
      return { message: 'Invalid request' };
    }
    try {
      const { data } = await this.authService.validateCode(validateCodeDTO);
      const accessToken = await this.authService.generateJwt(data);
      return new UserResponseWrapperDto(data, accessToken);
    } catch (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid request',
      };
    }
  }
}
