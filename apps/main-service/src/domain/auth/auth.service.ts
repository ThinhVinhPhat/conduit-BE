import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/create-auth.dto';
import { DatabaseService } from '@lib/database';
import { comparePassword, hasPassword } from '@lib/helpers/hasPassword';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { config } from '../../config/index';
import { ValidateCodeDTO } from './dto/validate-email.dto';
import redis from 'redis';
import { createClient } from 'redis';

@Injectable()
export class AuthService {
  private readonly client: ReturnType<typeof createClient>;

  constructor(
    private readonly prisma: DatabaseService,
    private jwtService: JwtService,
  ) {
    // this.client = createClient();

    // this.client.on('error', (err) => {
    //   console.error('❌ Redis error:', err);
    // });

    // this.client.connect();
  }

  generateJwt(user: User) {
    return this.jwtService.signAsync({
      iss: config.jwt.ISSUER,
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

  async validateCode(validateCodeDTO: ValidateCodeDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: validateCodeDTO.email },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const storedCode = await this.client.get(`verify:${user.id}`);
    await this.client.quit();
    if (!storedCode) {
      throw new HttpException('Code not match', HttpStatus.BAD_REQUEST);
    }

    return {
      data: user,
    };
  }
}
