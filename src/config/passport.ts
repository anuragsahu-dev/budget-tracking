import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config";
import logger from "./logger";
import { UserRepository } from "../modules/user/user.repository";

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

        // Check if user already exists
        let user = await UserRepository.findUserByEmail(normalizedEmail);

        if (!user) {
          // Create new user via Google OAuth
          const createResult = await UserRepository.createUser({
            email: normalizedEmail,
            googleId: profile.id,
            isEmailVerified: true, // Google already verified the email
          });

          // Handle create errors
          if (!createResult.success) {
            logger.error("Failed to create user via Google OAuth", {
              email: normalizedEmail,
              error: createResult.error,
              message: createResult.message,
            });
            return cb(new Error(createResult.message), false);
          }

          user = createResult.data;
        } else if (!user.googleId) {
          // User exists but hasn't linked Google account - link it now
          const updateResult = await UserRepository.updateUser(user.id, {
            googleId: profile.id,
            isEmailVerified: true,
          });

          // Handle update errors
          if (!updateResult.success) {
            logger.error("Failed to link Google account", {
              userId: user.id,
              error: updateResult.error,
              message: updateResult.message,
            });
            return cb(new Error(updateResult.message), false);
          }

          user = updateResult.data;
        }
        // If user exists and already has googleId, we just use the existing user

        logger.info("Google login successful", {
          userId: user.id,
          email: normalizedEmail,
          googleId: profile.id,
        });

        return cb(null, user);
      } catch (error) {
        logger.error("Google login failed", { error });
        return cb(error as Error, false);
      }
    }
  )
);

export default passport;
