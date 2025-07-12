import redis from "../../../../packages/config/redis";
import { ValidationError } from "../Error/AuthError";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail";

export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock: ${email}`)) {
    throw new ValidationError(
      "Account locked due to multiple login attempts. Please try again in 30 minutes."
    );
  }

  if (await redis.get(`otp_spam_lock: ${email}`)) {
    throw new ValidationError(
      "Too many OTP requests! Please wait 1 hour before requesting agiain."
    );
  }

  if (await redis.get(`otp_cooldown: ${email}`)) {
    throw new ValidationError("Please wait 1 min before requesting again!");
  }
};

export const trackOtpRequest = async (email: string) => {
  const otpRequestKey = `otp_request_count: ${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock: ${email}`, "locked", "EX", 3600);
    throw new ValidationError(
      "Too many requests! Please wait 1 hour before requesting again."
    );
  }

  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendMail(email, "Please verify your email address", template, {
    name,
    otp,
  });
  await redis.set(`otp: ${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown: ${email}`, "true", "EX", 60);
};
