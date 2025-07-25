import { SessionModel } from "../../../../models/session.model";
import { UserModel } from "../../../../models/User.model";
import catchError from "../../../../packages/error/catchError";
import {
  ConflictError,
  InvalidCredentialsError,
  NotFoundError,
  TokenExpiredError,
  ValidationError,
} from "../Error/AuthError";
import {
  forgotPasswordSchema,
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
  refreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt/jwt";
import {
  accessCookieOptions,
  clearAuthCookies,
  refreshCookieoptions,
  setAuthCookies,
} from "../utils/cookies";
import { OK } from "../../../../packages/constants/HttpStatusCode";
import { ONE_DAY_MS, thirtyDaysFromNow } from "../../../../packages/Date/date";
import z from "zod";

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
    return next(new ValidationError("User already exists."));
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

// refresh token user
export const refreshUser = catchError(async (req, res, next) => {
  const refreshToken = (await req.cookies["refresh-token"]) as
    | string
    | undefined;

  const { ...payload } = await verifyToken<refreshTokenPayload>(
    refreshToken as string,
    {
      secret: refreshTokenSignOptions.secret,
    }
  );

  if (!payload) {
    return next(new TokenExpiredError("Invalid refresh token"));
  }

  const session = await SessionModel.findById(payload.payload?.sessionId);
  const now = Date.now();
  if (!(session && session.expiresAt.getTime() > now)) {
    return next(new TokenExpiredError("Session expired"));
  }

  let sessionExpiry = session?.expiresAt;

  // refresh the session if it expires in 24 hours
  const sessionNeedsRefresh =
    sessionExpiry.getTime()! - Date.now() <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    sessionExpiry = thirtyDaysFromNow();
    await session?.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session?._id as string }, refreshTokenSignOptions)
    : undefined;

  const userId = String(session?.userId);
  const newAccessToken = signToken(
    {
      sessionId: session?._id as string,
      userId,
    },
    accessTokenSignOptions
  );

  if (newRefreshToken) {
    res.cookie("refresh-token", refreshToken, refreshCookieoptions);
  }

  res
    .status(OK)
    .cookie("access-token", newAccessToken, accessCookieOptions)
    .json({ message: "Access Token Refreshed" });
});

// logout user
export const logoutUser = catchError(async (req, res, next) => {
  const accessToken = req.cookies["access-token"] as string | undefined;
  const payload = verifyToken(accessToken || "")?.payload;

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res).status(OK).json({
    message: "Logout successful",
  });
});

// user forgot password
export const forgotPasswordUser = catchError(async (req, res, next) => {
  const emailSchema = z.object({ email: z.email(req.body).min(3).max(255) });

  const { email } = emailSchema.parse(req.body);

  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(new NotFoundError("User not found!"));
  }

  await checkOtpRestrictions(email);
  await trackOtpRequest(email);
  await sendOtp(user.name, email, "forgot-password");

  res.status(200).json({
    message: "OTP sent to mail. Please verify your account.",
  });
});

// verify forgot password otp
export const forgotPasswordOtp = catchError(async (req, res, next) => {
  const request = forgotPasswordSchema.parse(req.body);

  await verifyOtp(request.email!, request.otp!);

  res
    .status(200)
    .json({ message: "OTP verified. You can now reset your password." });
});

// reset user password
export const resetUserPassword = catchError(async (req, res, next) => {
  const request = forgotPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({ email: request.email });

  if (!user) {
    return next(new ValidationError("User not found"));
  }

  // new password should not be same as old password
  const isMatch = await brcypt.compare(request.password!, user.password!);

  if (isMatch)
    return next(
      new ConflictError("New password cannot be same as old password.")
    );

  const hashedPassword = await brcypt.hash(request.password!, 12);

  await UserModel.findByIdAndUpdate(
    { _id: user._id },
    { password: hashedPassword }
  );

  clearAuthCookies(res).status(OK).json({
    message: "Password updated successfully",
  });
});
