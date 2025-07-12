abstract class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", code: string = "BAD_REQUEST") {
    super(message, 400, code);
  }
}

class ValidationError extends AppError {
  constructor(message: string = "Invalid request data") {
    super(message, 401, "INVALID_DATA");
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

class InvalidCredentialsError extends AppError {
  constructor(message: string = "Invalid credentials") {
    super(message, 401, "INVALID_CREDENTIALS");
  }
}

class AccountLockedError extends AppError {
  constructor(
    message: string = "Account is locked due to multiple failed login attempts"
  ) {
    super(message, 403, "ACCOUNT_LOCKED");
  }
}

class TokenExpiredError extends AppError {
  constructor(message: string = "Token has expired") {
    super(message, 401, "TOKEN_EXPIRED");
  }
}

class TokenInvalidError extends AppError {
  constructor(message: string = "Invalid token") {
    super(message, 401, "TOKEN_INVALID");
  }
}

class EmailNotVerifiedError extends AppError {
  constructor(message: string = "Email is not verified") {
    super(message, 403, "EMAIL_NOT_VERIFIED");
  }
}

class PasswordResetError extends AppError {
  constructor(message: string = "Password reset failed") {
    super(message, 400, "PASSWORD_RESET_FAILED");
  }
}

class RegistrationError extends AppError {
  constructor(message: string = "Registration failed") {
    super(message, 400, "REGISTRATION_FAILED");
  }
}

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  InvalidCredentialsError,
  AccountLockedError,
  TokenExpiredError,
  TokenInvalidError,
  EmailNotVerifiedError,
  PasswordResetError,
  RegistrationError,
};
