"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const config_1 = require("./config");
const logger_1 = __importDefault(require("./logger"));
const user_repository_1 = require("../modules/user/user.repository");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: config_1.config.google.clientId,
    clientSecret: config_1.config.google.clientSecret,
    callbackURL: config_1.config.google.callbackUrl,
}, async (_accessToken, _refreshToken, profile, cb) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return cb(new Error("No email provided by Google"), false);
        }
        const normalizedEmail = email.toLowerCase();
        let user = await user_repository_1.UserRepository.findUserByEmail(normalizedEmail);
        if (!user) {
            const createResult = await user_repository_1.UserRepository.createUser({
                email: normalizedEmail,
                googleId: profile.id,
                isEmailVerified: true,
            });
            if (!createResult.success) {
                logger_1.default.error("Failed to create user via Google OAuth", {
                    email: normalizedEmail,
                    error: createResult.error,
                    message: createResult.message,
                });
                return cb(new Error(createResult.message), false);
            }
            user = createResult.data;
        }
        else if (!user.googleId) {
            const updateResult = await user_repository_1.UserRepository.updateUser(user.id, {
                googleId: profile.id,
                isEmailVerified: true,
            });
            if (!updateResult.success) {
                logger_1.default.error("Failed to link Google account", {
                    userId: user.id,
                    error: updateResult.error,
                    message: updateResult.message,
                });
                return cb(new Error(updateResult.message), false);
            }
            user = updateResult.data;
        }
        logger_1.default.info("Google login successful", {
            userId: user.id,
            email: normalizedEmail,
            googleId: profile.id,
        });
        return cb(null, user);
    }
    catch (error) {
        logger_1.default.error("Google login failed", { error });
        return cb(error, false);
    }
}));
exports.default = passport_1.default;
