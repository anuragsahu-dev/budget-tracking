import bcrypt from "bcryptjs";
import logger from "../config/logger";
import { config } from "../config/config";
import { ApiError } from "../middlewares/error.middleware";

export const createPasswordHash = async (
  plainPassword: string
): Promise<string> => {
  return bcrypt.hash(plainPassword, config.password.salt_rounds); 
};

export const verifyPassword = async (
  userPassword: string,
  dbPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(userPassword, dbPassword);
  } catch (error) {
    logger.error("Password comparison failed due to internal server problem", {
      error,
    });
    throw new ApiError(500, "Internal server error");
  }
};


/*
✅ Better: Remove await unless you need try/catch 
specifically around it (which you do, so await is 
fine here). But in this case, since the try/catch 
is around it, await is actually required for catching errors. 
So this use is correct.
*/