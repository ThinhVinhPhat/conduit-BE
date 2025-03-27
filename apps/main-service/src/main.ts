import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  const config = new DocumentBuilder()
    .setTitle('Conduit')
    .setDescription('The Conduit API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
      transform: true,
    }),
  );
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
      validationError: {
        target: false,
      },
      transform: true,
    }),
  );

  await app.listen(process.env.port ?? 3100);
}
bootstrap();
