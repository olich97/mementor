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
  }

  async list(req: Request, res: Response) {
    try {
      const skip = req.query.skip || 0;
      const take = req.query.take || 100;
      const keyword = req.query.search || '';

      const result = await this._memeService.searchByText(
        parseInt(skip.toString()),
        parseInt(take.toString()),
        keyword.toString(),
      );

      return new SuccessResponse(result).send(res);
    } catch (error) {
      Logger.error(error);
      return new InternalErrorResponse(error.message).send(res);
    }
  }
}
