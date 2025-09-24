import bcrypt from "bcryptjs";
import logger from "../config/logger";
import { config } from "../config/config";
import { ApiError } from "../middlewares/error.middleware";

export const createHash = async (plainValue: string): Promise<string> => {
  try {
    const saltRounds = config.bcrypt.salt_rounds;
    return await bcrypt.hash(plainValue, saltRounds);
  } catch (error) {
    logger.error("Error occured when trying to hash plain string", { error });
    throw new ApiError(500, "Internal server error");
  }
};

export const verifyHash = async (
  plainValue: string,
  hashValue: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainValue, hashValue);
  } catch (error) {
    logger.error("Hashing comparison failed due to internal server problem", {
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
