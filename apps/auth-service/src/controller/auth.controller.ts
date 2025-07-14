import { SessionModel } from "../../../../models/session.model";
import { UserModel } from "../../../../models/User.model";
import catchError from "../../../../packages/error/catchError";
import {
  InvalidCredentialsError,
  NotFoundError,
  ValidationError,
} from "../Error/AuthError";
import {
  loginSchema,
  registerUserSchema,
  verifyUserSchema,
} from "../Schema/validate.Schema";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
} from "../service/auth.service";
import brcypt from "bcrypt";
import {
  accessTokenSignOptions,
  refreshTokenSignOptions,
  signToken,
} from "../utils/jwt/jwt";
import { setAuthCookies } from "../utils/cookies";
import { OK } from "../../../../packages/constants/HttpStatusCode";

// register a user
export const registerHandler = catchError(async (req, res, next) => {
  // validate user
  const request = registerUserSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // check if user exists or not
  const existingUser = await UserModel.findOne({ email: request.email });

  if (existingUser) {
    return next(new ValidationError("User already exists"));
  }

  await checkOtpRestrictions(request.email);
  await trackOtpRequest(request.email);
  await sendOtp(request.name, request.email, "email-verfication");

  res.status(200).json({
    message: "OTP sent to email. Please verfiy your account.",
  });
});

// verify a user
export const verifyUser = catchError(async (req, res, next) => {
  const request = verifyUserSchema.parse({ ...req.body });

  const existingUser = await UserModel.findOne({ email: request.email });

  if (existingUser) {
    throw new ValidationError("User already exists.");
  }

  await verifyOtp(request.email, request.otp);
  const hashedPassword = await brcypt.hash(request.password!, 12);

  const newUser = await UserModel.create({
    name: request.name,
    email: request.email,
    password: hashedPassword,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    newUser,
  });
});

// login a user
export const loginUser = catchError(async (req, res, next) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const user = await UserModel.findOne({ email: request.email });

  if (!user) {
    return next(new NotFoundError("User doesn't exist!"));
  }

  const isMatch = await brcypt.compare(request.password!, user.password!);

  if (!isMatch)
    return next(new InvalidCredentialsError("Invalid email or password"));

  // create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: request.userAgent,
  });

  // create refresh and access token
  const sessionInfo = {
    sessionId: session._id as string,
  };
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken(
    { ...sessionInfo, userId: user._id as string },
    accessTokenSignOptions
  );

  setAuthCookies({ res, refreshToken, accessToken }).status(OK).json({
    message: "User logged in.",
  });
});
