import { BaseEntity } from './BaseEntity';
import { Content } from './Content';
import { v4 as uuid } from 'uuid';
import { LoginProvider } from '../enums';

export class User extends BaseEntity {
  providerUserId: string;
  username: string;
  provider: LoginProvider;
  photoProfileUrl: string;
  token?: string;
  tokenExpirationDate?: Date;
  lastLoginDate?: Date;

  public static Create(
    username: string,
    providerUserId: string,
    provider: LoginProvider,
    photoProfileUrl: string,
  ): User {
    const user = new User();
    user.id = uuid();
    user.username = username;
    user.provider = provider;
    user.providerUserId = providerUserId;
    user.photoProfileUrl = photoProfileUrl;

    return user;
  }
}
