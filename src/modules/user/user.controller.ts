import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendApiResponse } from "../../utils/apiResponse";
import { getValidatedBody } from "../../types/express";
import type { UpdateProfileInput } from "./user.validation";
import logger from "../../config/logger";

export const UserController = {

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const profile = await UserService.getProfile(userId);

    logger.info("User profile fetched", { userId });

    return sendApiResponse(res, 200, "Profile fetched successfully", profile);
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const updateData = getValidatedBody<UpdateProfileInput>(req);

    const updatedProfile = await UserService.updateProfile(userId, updateData);

    return sendApiResponse(
      res,
      200,
      "Profile updated successfully",
      updatedProfile
    );
  }),
};
