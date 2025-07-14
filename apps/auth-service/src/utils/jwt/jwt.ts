import { SignOptions, VerifyOptions } from "jsonwebtoken";
import {
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from "../../../../../packages/config/env";
import jwt from "jsonwebtoken";

export type accessTokenPayload = {
  sessionId: string;
  userId: string;
};

export type refreshTokenPayload = {
  sessionId: string;
};

// custom signing options with additional attribute
type signOptionsAndSecret = SignOptions & {
  secret: string;
};

// default signing options for audience metadata
const defaults: SignOptions = {
  audience: ["user"],
};

// signing options for access and refresh token
export const accessTokenSignOptions: signOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: signOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: accessTokenPayload | refreshTokenPayload,
  options?: signOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

type verifyOptionsAndSecret = VerifyOptions & {
  secret: string;
};

export const verifyToken = <TPayload extends object = accessTokenPayload>(
  token: string,
  options?: verifyOptionsAndSecret
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};

  try {
    const payload = jwt.verify(token, secret, {
      ...verifyOpts,
      audience: ["user"],
    }) as TPayload;

    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};
