import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsOptional, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsOptional()
  APP_PORT: string;

  @IsOptional()
  APP_NAME: string;

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  DATABASE_PORT: number;

  @IsNotEmpty()
  DATABASE_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const config = {
  APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 4000,
  APP_NAME: process.env.APP_NAME ?? 'main-service',
  DB_HOST: process.env.DATABASE_HOST ?? 'localhost',
  DB_USERNAME: process.env.DATABASE_USERNAME ?? 'user',
  DB_PASSWORD: process.env.DATABASE_PASSWORD ?? 'password',
  DB_PORT: parseInt(process.env.DATABASE_PORT, 10) ?? 5434,
  DB_NAME: process.env.DATABASE_NAME ?? 'conduit',
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
    JWT_ISSUER: process.env.JWT_ISSUER ?? 'conduit',
  },
};
