import { OAuthOutput } from './models/OAuthOutput';

export interface IOAuthService {
  logIn(providerCode: string): Promise<OAuthOutput>;
  logOut(token: string): Promise<void>;
  verifyUserByToken(token: string): Promise<OAuthOutput | undefined>;
  getLoginUrl(): Promise<string>;
}
