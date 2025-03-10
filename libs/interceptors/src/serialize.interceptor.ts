import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const respond = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        data.data.password = undefined;
        return {
          status: respond.status,
          data: data,
        };
      }),
    );
  }
}
