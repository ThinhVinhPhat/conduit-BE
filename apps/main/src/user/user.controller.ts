import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestCreateUserDto } from './dto/create-user.dto';
import { RequestUpdateUserDto } from './dto/update-user.dto';
import { Public } from '@lib/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserReq, Roles, ApiOperationDecorator } from '@lib/decorators';
import { User } from '@prisma/client';
import { Role } from '../constant/role';
import { AuthService } from '../auth/auth.service';
import { UserResponseWrapperDto } from './dto/user-respond.dto';
import { userRespond } from '../constant/message';

@Controller('users')
export class UserController {
  private readonly logger: Logger;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    this.logger = new Logger(UserController.name);
  }

  @Public()
  @ApiOperationDecorator({
    summary: 'Register User',
    description: 'Register user',
    type: RequestCreateUserDto,
  })
  @Post()
  async register(
    @Body() createUserDto: RequestCreateUserDto,
  ): Promise<UserResponseWrapperDto> {
    try {
      if (Object.keys(createUserDto).length == 0) {
        throw new UnprocessableEntityException('Invalid request');
      }
      this.logger.log('Registering User.....');

      const { data } = await this.userService.register(createUserDto);
      const accessToken = await this.authService.generateJwt(data);

      this.logger.log('Done Registering User.....');
      return new UserResponseWrapperDto(data, accessToken);
    } catch (error) {
      this.logger.warn(userRespond.create.error, error);
      throw new HttpException(
        userRespond.create.error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @ApiOperationDecorator({
    summary: 'Get User',
    description: 'Get user',
  })
  @Get('/me')
  async getMe(@UserReq() user: User): Promise<User> {
    return user;
  }

  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: 'Get All Users By Admin',
    description: 'Get All Users By Admin',
  })
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: 'Get One User By Admin',
    description: 'Get One User By Admin',
  })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperationDecorator({
    summary: 'Update User',
    description: 'Update user',
    type: RequestUpdateUserDto,
  })
  @ApiBearerAuth()
  @Patch()
  async update(
    @UserReq() user: User,
    @Body() updateUserDto: RequestUpdateUserDto,
  ) {
    try {
      const userId = user.id;
      if (Object.keys(updateUserDto).length == 0) {
        throw new UnprocessableEntityException('Invalid request');
      }
      this.logger.log('Updating User.....');

      const { data } = await this.userService.update(userId, updateUserDto);
      const accessToken = await this.authService.generateJwt(data);

      this.logger.log('Done Update User.....');
      return new UserResponseWrapperDto(data, accessToken);
    } catch (error) {
      this.logger.warn(userRespond.create.error, error);
      throw new HttpException(
        userRespond.create.error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperationDecorator({
    summary: 'Delete User',
    description: 'Delete user',
  })
  @ApiBearerAuth()
  @Delete()
  remove(@UserReq() user: User) {
    const userId = user.id;
    return this.userService.remove(userId);
  }
}
