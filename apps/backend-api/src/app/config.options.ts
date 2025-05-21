import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  validationOptions: { allowUnknown: true, abortEarly: true },
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    ROUND_DURATION: Joi.number().default(60), // одна минута раунда
    COOLDOWN_DURATION: Joi.number().default(30), // полминуты обратного отсчета
    LOG_LEVEL: Joi.string().default('info'), // "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent"
    API_PREFIX: Joi.string().default('api'),
    DB_TYPE: Joi.string().default('postgres'), // "postgres" | "mysql" | "mariadb" | "sqlite" | "mssql" | "oracle"
    DB_SSL: Joi.boolean().default(false),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().default('postgres'),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    JWT_ACCESS_TOKEN: Joi.string().required(),
    JWT_ACCESS_EXPIRES: Joi.string().required(),
  }),
};
