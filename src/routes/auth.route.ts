import { Router } from "express";
import passport from "passport";
import { ApiError, asyncHandler } from "../middlewares/error.middleware";
import {
  cookieOptions,
  generateAccessRefreshToken,
} from "../utils/accessRefreshToken";
import { config } from "../config/config";
import ms from "ms";
import { sendApiResponse } from "../utils/apiResponse";
import { User } from "@prisma/client";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureMessage: true }),
  asyncHandler(async (req, res) => {
    const user = req.user as User;

    if (!user) {
      throw new ApiError(401, "Google login failed");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user.id
    );

    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: ms(config.auth.accessTokenExpiry),
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: ms(config.auth.refreshTokenExpiry),
      });

    return sendApiResponse(res, 200, "Google login successful", {
      accessToken,
      refreshToken,
    });
  })
);

// when we have frontend then some configuration change but not everything
// like res.redirect use and failure redirect use

/*
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/failure" }),
  asyncHandler(async (req, res) => {
    const user = req.user as User;

    if (!user) {
      return res.redirect(`${config.frontend.url}/login?error=google_login_failed`);
    }

    // Generate access & refresh tokens
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user.id);

    // Set HttpOnly cookies for secure frontend usage
    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(config.auth.accessTokenExpiry),
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(config.auth.refreshTokenExpiry),
      });

    // Redirect to frontend dashboard (or any route)
    return res.redirect(`${config.frontend.url}/dashboard`);
  })
);

// Optional failure route
router.get("/google/failure", (req, res) => {
  return res.redirect(`${config.frontend.url}/login?error=google_login_failed`);
});

*/
