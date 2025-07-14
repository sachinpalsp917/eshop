import { CookieOptions, Response } from "express";
import {
  fifteenMinutesFromNow,
  thirtyDaysFromNow,
} from "../../../../packages/Date/date";

const secure = process.env.NODE_ENV !== "development";

export const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const accessCookieOptions: CookieOptions = {
  ...defaults,
  expires: fifteenMinutesFromNow(),
};

export const refreshCookieoptions: CookieOptions = {
  ...defaults,
  expires: thirtyDaysFromNow(),
};

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, refreshToken, accessToken }: Params) =>
  res
    .cookie("refresh-token", refreshToken, refreshCookieoptions)
    .cookie("access-token", accessToken, accessCookieOptions);
