import { UserModel } from "../../../../models/User.model";
import catchError from "../../../../packages/error/catchError";
import { ValidationError } from "../Error/AuthError";
import {
  registerUserSchema,
  verifyUserSchema,
} from "../Schema/validate.Schema";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
} from "../service/auth.service";
import brcypt from "bcryptjs";

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
