import { User } from '@/core/entities/User';
import { EntitySchema } from 'typeorm';

export const UserMapping = new EntitySchema<User>({
  name: 'User',
  tableName: 'user',
  columns: {
    id: {
      type: String,
      primary: true,
      name: 'user_id',
    },
    username: {
      type: String,
    },
    provider: {
      type: String,
    },
    providerUserId: {
      type: String,
      name: 'provider_user_id',
    },
    photoProfileUrl: {
      type: String,
      name: 'photo_profile_url',
    },
    token: {
      type: 'text',
    },
    tokenExpirationDate: {
      type: Date,
      name: 'token_expiration_date',
    },
    lastLoginDate: {
      type: Date,
      name: 'last_login_date',
    },
    lastUpdateDate: {
      type: Date,
      name: 'last_update_date',
      updateDate: true,
    },
  },
});
