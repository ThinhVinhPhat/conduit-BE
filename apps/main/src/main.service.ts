import { Injectable } from '@nestjs/common';

@Injectable()
export class MainService {
  getHello(): any {
    return {
      message: 'Hello World',
      data: {
        name: 'John',
        age: 30,
        email: 'john@example.com',
        password: '123456',
      },
    };
  }
}
