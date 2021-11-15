import { IMemeService } from '../../core/interfaces/services/IMemeService';
import Logger from '../../infrastructure/Logger';
import { Application, Request, Response } from 'express';
import { InternalErrorResponse, SuccessResponse } from '../models/ApiResponse';
import { IBaseController } from './IBaseController';

export class MemeController implements IBaseController {
  private _memeService: IMemeService;

  constructor(memeService: IMemeService) {
    this._memeService = memeService;
  }

  register(app: Application): void {
    app.route('/memes').get(async (req, res) => await this.list(req, res));
    app.route('/memes/:code').get(async (req, res) => await this.getByCode(req, res));
  }

  async list(req: Request, res: Response) {
    try {
      const skip = req.query.skip || 0;
      const take = req.query.take || 100;
      const keyword = req.query.search || '';

      Logger.debug(`Received list meme request with parameters skip: ${skip}, limit: ${take}, search: ${keyword}`);

      const result = await this._memeService.searchByText(
        parseInt(skip.toString()),
        parseInt(take.toString()),
        keyword.toString(),
      );
      Logger.debug('Sending result: %o', result.length);

      return new SuccessResponse(result).send(res);
    } catch (error) {
      Logger.error(error);
      return new InternalErrorResponse(error.message).send(res);
    }
  }

  async getByCode(req: Request, res: Response) {
    try {
      const code = req.params.code || '';

      Logger.debug(`Received meme request with parameters code: ${code}`);

      const result = await this._memeService.getByCode(code);
      Logger.debug('Sending result: %o', result);

      return new SuccessResponse(result).send(res);
    } catch (error) {
      Logger.error(error);
      return new InternalErrorResponse(error.message).send(res);
    }
  }
}
