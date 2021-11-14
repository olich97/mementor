import { Response } from 'express';

// Helper code for the API consumer to understand the error and handle is accordingly
enum StatusCode {
  SUCCESS = '10000',
  FAILURE = '10001',
  RETRY = '10002',
  INVALID_ACCESS_TOKEN = '10003',
}

enum ResponseStatus {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
  constructor(
    protected status: ResponseStatus,
    protected isSuccess = false,
    protected message: string = undefined,
    protected data: object = undefined,
    protected errors: string[] = undefined,
  ) {}

  protected prepare<T extends ApiResponse>(res: Response, response: T): Response {
    return res.status(this.status).json(ApiResponse.sanitize(response));
  }

  public send(res: Response): Response {
    return this.prepare<ApiResponse>(res, this);
  }

  private static sanitize<T extends ApiResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);

    delete clone.status;
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(error = 'Internal Error') {
    super(ResponseStatus.INTERNAL_ERROR, false, undefined, undefined, [error]);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(error = 'Bad parameters') {
    super(ResponseStatus.BAD_REQUEST, false, undefined, undefined, [error]);
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(data: object) {
    super(ResponseStatus.SUCCESS, true, undefined, data, undefined);
  }
}
