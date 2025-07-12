import { UserModel } from "../../../../models/User.model";
import catchError from "../../../../packages/error/catchError";
import { ValidationError } from "../Error/AuthError";
import { registerUserSchema } from "../Schema/validate.Schema";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
} from "../service/auth.service";

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
