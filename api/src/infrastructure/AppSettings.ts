import dotenv from 'dotenv';
import { get } from 'env-var';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Api server port
   */
  port: get('PORT').required().asPortNumber(),
  /**
   * Used by logger
   */
  logging: {
    level: get('LOG_LEVEL').asString() || 'silly',
  },
  /**
   * Database connection options
   */
  database: {
    url: get('DATABASE_URL').required().asUrlString(),
    mappingsPath: get('DATABASE_MAPPINGS_PATH').asString(),
  },
  /**
   * Storage provider
   */
  storage: {
    url: get('STORAGE_URL').required().asUrlString(),
  },
  /**
   * Cors requests
   */
  cors: {
    origins: get('CORS_ORIGINS').required().asString().split(', '),
  },
  /**
   * Git hub authentication options
   */
  github: {
    clientId: get('GITHUB_CLIENT_ID').required().asString(),
    clientSecret: get('GITHUB_CLIENT_SECRET').required().asString(),
    apiUrlPrefix: get('GITHUB_API_PREFIX').required().asString(),
    tokenUrl: get('GITHUB_TOKEN_URL').required().asString(),
    callbackUrl: get('GITHUB_CALLBACK_URL').required().asString(),
  },
  /**
   * Options for generation jwt tokens
   */
  jwt: {
    secret: get('JWT_SECRET').required().asString(),
    tokenDurationHours: get('JWT_TOKEN_DURATION_HOURS').required().asInt(),
  },
};
