import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../database/prisma";
import { config } from "./config";
import { nanoid } from "nanoid";
import logger from "./logger";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
    },
    async (_accessToken, _refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return cb(new Error("No email provided by Google"), false);
        }

        const normalizedEmail = email.toLowerCase();
        const username = `${profile.displayName.replace(/\s+/g, "_")}_${nanoid(
          8
        )}`;

        let user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: normalizedEmail,
              username,
              fullName: profile.displayName,
              isEmailVerified: true,
              googleId: profile.id,
            },
          });
        } else if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id, isEmailVerified: true },
          });
        }

        logger.info("Google login successful", {
          email: normalizedEmail,
          googleId: profile.id,
        });
        return cb(null, user);
      } catch (error) {
        logger.error("Google login failed", { error });
        return cb(error, false);
      }
    }
  )
);

/*


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value!;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Create a new user
          user = await prisma.user.create({
            data: {
              email,
              username: profile.displayName,
              isEmailVerified: true, // Google verified
              googleId: profile.id,
            },
          });
        } else if (!user.googleId) {
          // Link Google account
          user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId: profile.id, isEmailVerified: true },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

*/

/*
import { Router } from "express";
import passport from "passport";
import { generateAccessRefreshToken } from "../utils/token.util";

const router = Router();

// Step 1: Redirect user to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user as any;

    // Generate your access + refresh tokens
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user.id);

    // Store refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set cookies (httpOnly, secure)
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .redirect(process.env.FRONTEND_URL!); // redirect to SPA
  }
);

export default router;
*/
