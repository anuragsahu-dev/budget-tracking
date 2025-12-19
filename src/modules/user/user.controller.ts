import { asyncHandler } from "../../utils/asyncHandler";
import type { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendApiResponse } from "../../utils/apiResponse";
import { getValidatedBody, getValidatedQuery } from "../../types/express";
import type {
  UpdateProfileInput,
  GetAvatarUploadUrlInput,
  ConfirmAvatarUploadInput,
} from "./user.validation";

export const UserController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const profile = await UserService.getProfile(userId);

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

  /**
   * Get pre-signed URL for avatar upload
   */
  getAvatarUploadUrl: asyncHandler(async (req: Request, res: Response) => {
    const { mime } = getValidatedQuery<GetAvatarUploadUrlInput>(req);

    const result = await UserService.getAvatarUploadUrl(mime);

    return sendApiResponse(
      res,
      200,
      "Upload URL generated successfully",
      result
    );
  }),

  /**
   * Confirm avatar upload after client uploads to S3
   */
  confirmAvatarUpload: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const data = getValidatedBody<ConfirmAvatarUploadInput>(req);

    const result = await UserService.confirmAvatarUpload(userId, data);

    return sendApiResponse(res, 200, "Avatar updated successfully", result);
  }),

  /**
   * Delete user's avatar
   */
  deleteAvatar: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const result = await UserService.deleteAvatar(userId);

    return sendApiResponse(res, 200, "Avatar deleted successfully", result);
  }),
};
