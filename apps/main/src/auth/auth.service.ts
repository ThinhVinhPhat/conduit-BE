import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/create-auth.dto';
import { DatabaseService } from '@lib/database';
import { comparePassword, hasPassword } from '@lib/helpers/hasPassword';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { config } from '../config/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private jwtService: JwtService,
  ) {}

  generateJwt(user: User) {
    return this.jwtService.signAsync({
      iss: config.jwt.JWT_ISSUER,
      sub: user.id,
    });
  }

  async signIn(createAuthDto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(await hasPassword(createAuthDto.password, 10));

    const isValidPassword = await comparePassword(
      createAuthDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException('Password not match', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user.id, username: user.name };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
