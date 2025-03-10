import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RequestCreateUserDto } from './dto/create-user.dto';
import { RequestUpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '@lib/database';
import { hasPassword } from '@lib/helpers/hasPassword';
import { userRespond } from '../constant/message';
import { IUserResponse } from '@lib/types';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger: Logger;
  constructor(private readonly prisma: DatabaseService) {
    this.logger = new Logger(UserService.name);
  }

  async register(createUserDto: RequestCreateUserDto): Promise<any> {
    const { email, password, username } = createUserDto.user;
    const existEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (existEmail) {
      throw new HttpException(
        userRespond.create.emailExist,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user: User = await this.prisma.user.create({
      data: {
        name: username,
        email: email,
        password: await hasPassword(password, 10),
        avatar: '',
        description: '',
      },
    });
    return {
      status: HttpStatus.OK,
      data: user,
      message: userRespond.create.success,
    };
  }

  async findAll(): Promise<IUserResponse> {
    const users = await this.prisma.user.findMany();
    return {
      status: HttpStatus.OK,
      data: users,
      message: userRespond.get.success,
    };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: string): Promise<IUserResponse> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }
    return {
      status: HttpStatus.OK,
      data: user,
      message: userRespond.get.success,
    };
  }

  async update(
    userId: string,
    updateUserDto: RequestUpdateUserDto,
  ): Promise<any> {
    const { name, avatar, description, password } = updateUserDto.user;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      this.logger.warn(userRespond.get.error);
      throw new HttpException(userRespond.update.error, HttpStatus.NOT_FOUND);
    }

    if (name) {
      const existName = await this.prisma.user.findFirst({
        where: { name: name },
      });
      if (existName && existName.id !== user.id) {
        this.logger.warn(userRespond.update.error);
        throw new HttpException(
          userRespond.update.error,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
        avatar: avatar,
        description: description,
        password: password ? await hasPassword(password, 10) : user.password,
      },
    });

    return {
      status: HttpStatus.OK,
      data: updatedUser,
      message: userRespond.update.success,
    };
  }

  async remove(id: string): Promise<IUserResponse> {
    const user = this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(userRespond.delete.error, HttpStatus.NOT_FOUND);
    }
    await this.prisma.user.update({
      where: { id },
      data: { active: false },
    });
    return {
      status: HttpStatus.OK,
      message: userRespond.delete.success,
    };
  }
}
