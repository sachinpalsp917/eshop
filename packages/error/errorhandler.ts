import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "../constants/HttpStatusCode";
import { AppError } from "../../apps/auth-service/src/Error/AuthError";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH: ${req.path}`, err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      code: err.code,
      message: err.message,
    });
  } else {
    res.status(INTERNAL_SERVER_ERROR).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }

  console.log("Error Occurred: ", err);

  next();
};

export default errorHandler;
