import { User } from '../../core/entities/User';
import { LoginProvider } from '../../core/enums';
import { IUserRepository } from '../../core/interfaces/repositories/IUserRepository';
import { IOAuthService } from '../../core/interfaces/services/IOAuthService';
import { OAuthOutput } from '../../core/interfaces/services/models/OAuthOutput';
import axios from 'axios';
import config from '../AppSettings';
import { GithubUser } from './models/GithubUser';
import jwt from 'jsonwebtoken';
import Logger from '../Logger';

export class GithubService implements IOAuthService {
  private _userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository;
  }
  public async getLoginUrl(): Promise<string> {
    return `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${config.github.callbackUrl}&scope=read:user`;
  }

  public async logIn(providerCode: string): Promise<OAuthOutput> {
    const gitHubUser = await this.getGitHubUser(providerCode);
    Logger.debug('Github user %o', gitHubUser);
    // need to check if git hub user already exists in the system
    let myUser = await this._userRepository.getByProviderId(gitHubUser.id.toString());
    // for sure need to generate a jwt
    const jwtToken = await jwt.sign(gitHubUser, config.jwt.secret, { expiresIn: `${config.jwt.tokenDurationHours}h` });
    var tokenExpirationDate = new Date();
    tokenExpirationDate.setHours(tokenExpirationDate.getHours() + config.jwt.tokenDurationHours);
    if (myUser) {
      // updating some stuff
      myUser.photoProfileUrl = gitHubUser.avatar_url;
      myUser.token = jwtToken;
      myUser.tokenExpirationDate = tokenExpirationDate;
      myUser.lastLoginDate = new Date();
      await this._userRepository.update(myUser);
    } else {
      // creating new user
      myUser = User.Create(gitHubUser.login, gitHubUser.id.toString(), LoginProvider.GTHUB, gitHubUser.avatar_url);
      myUser.token = jwtToken;
      myUser.tokenExpirationDate = tokenExpirationDate;
      await this._userRepository.add(myUser);
    }

    return {
      userId: myUser.id,
      token: myUser.token,
      photoProfileUrl: myUser.photoProfileUrl,
      username: myUser.username,
    };
  }

  public async logOut(token: string): Promise<void> {
    const user = await this._userRepository.getByToken(token);
    if (!user) {
      throw Error(`User not found for token`);
    }
    //user.RevokeTokenLogin(new Date());
    user.token = null;
    user.tokenExpirationDate = null;
    await this._userRepository.update(user);
  }

  public async verifyUserByToken(token: string): Promise<OAuthOutput> {
    const user = await this._userRepository.getByToken(token);
    if (!user) {
      throw Error(`User not found for token`);
    }
    try {
      await jwt.verify(token, config.jwt.secret, { expiresIn: `${config.jwt.tokenDurationHours}h` });
    } catch (error) {
      return null;
    }

    return { userId: user.id, token: user.token, photoProfileUrl: user.photoProfileUrl, username: user.username };
  }

  private async getGitHubUser(code: string): Promise<GithubUser> {
    const token = await this.getGithubToken(code);
    const user = await axios
      .get(`${config.github.apiUrlPrefix}/user`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })
      .then(res => res.data)
      .catch(error => {
        throw new Error(`Error getting user from GitHub: ${error.message}`);
      });

    return user;
  }

  private async getGithubToken(code: string): Promise<string> {
    const githubToken = await axios
      .post(
        `${config.github.tokenUrl}?client_id=${config.github.clientId}&client_secret=${config.github.clientSecret}&redirect_uri=${config.github.callbackUrl}&code=${code}`,
        {},
        { headers: { Accept: 'application/json' } },
      )
      .then(res => {
        return res.data.access_token;
      })
      .catch(error => {
        throw error;
      });

    return githubToken;
  }
}
