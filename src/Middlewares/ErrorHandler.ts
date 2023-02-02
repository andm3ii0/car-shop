import { NextFunction, Request, Response } from 'express';

type ObjectError = {
  status: number;
  message: string;
};

class ErrorHandler {
  public static handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const errObj = JSON.parse(error.message) as ObjectError;
    res.status(errObj.status).json({ message: errObj.message });
    next();
  }
}

export default ErrorHandler;
