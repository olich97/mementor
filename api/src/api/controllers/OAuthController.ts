import { IOAuthService } from '../../core/interfaces/services/IOAuthService';
import { Application, Request, Response } from 'express';
import { IBaseController } from './IBaseController';
import Logger from '../../infrastructure/Logger';
import { InternalErrorResponse, SuccessResponse } from '../models/ApiResponse';

export class OAuthController implements IBaseController {
  private _oAuthService: IOAuthService;

  constructor(oAuthService: IOAuthService) {
    this._oAuthService = oAuthService;
  }

  register(app: Application): void {
    app.route('/oauth/github').post(async (req, res) => await this.loginWithGithub(req, res));
    app.route('/oauth/github/login_url').get(async (req, res) => await this.getLoginUrl(req, res));
    app.route('/oauth/github/logout').post(async (req, res) => await this.logout(req, res));
  }

  async getLoginUrl(req: Request, res: Response) {
    try {
      Logger.debug(`Received getLoginUrl with parameters`);

      const url = await this._oAuthService.getLoginUrl();

      Logger.debug('Sending result: %o', url);

      return new SuccessResponse(url).send(res);
    } catch (error) {
      Logger.error(error);
      return new InternalErrorResponse(error.message).send(res);
    }
  }

  async loginWithGithub(req: Request, res: Response) {
    try {
      const sessionCode = req.headers['git-hub-code'] || '';

      Logger.debug(`Received login requesr with parameters code: ${sessionCode}`);

      const result = await this._oAuthService.logIn(sessionCode.toString());

      Logger.debug('Sending result: %o', result);
      res.cookie('github-jwt', result.token, {
        httpOnly: true,
        domain: req.headers['origin'],
        sameSite: 'strict',
      });

      return new SuccessResponse(result).send(res);
    } catch (error) {
      Logger.error(error);
      return new InternalErrorResponse(error.message).send(res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.cookies['github-jwt'] || '';

      Logger.debug(`Received login requesr with parameters token: ${token}`);

      const result = await this._oAuthService.logOut(token.toString());

      Logger.debug('Sending result: %o', result);

      return new SuccessResponse(result).send(res);
    } catch (error) {
      Logger.error(error);
      return new InternalErrorResponse(error.message).send(res);
    }
  }
}
