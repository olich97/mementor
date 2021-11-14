import { Application } from 'express';

export interface IBaseController {
  register(app: Application): void;
}
