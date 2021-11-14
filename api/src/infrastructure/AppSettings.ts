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
    url: get('DATABASE_URL').required().asString(),
    mappingsPath: get('DATABASE_MAPPINGS_PATH').asString(),
  },
};
