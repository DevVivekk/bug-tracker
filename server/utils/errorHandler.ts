import { Request, Response, NextFunction } from "express";
import CustomError from "./customError.js";

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: false,
    message: "Unknown error occurred",
  });
};

export default errorHandler;
