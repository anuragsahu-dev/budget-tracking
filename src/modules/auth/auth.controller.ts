import { asyncHandler } from "../../utils/asyncHandler";

import type { Request, Response } from "express";
import { AuthService } from "./auth.service";

export const AuthController = {
  start: asyncHandler(async (req: Request, res: Response) => {
   const otp = await AuthService.start(req.body);
   return res.json({ otp });
  }),

  verify: asyncHandler(async (req: Request, res: Response) => {}),

  setName: asyncHandler(async (req: Request, res: Response) => {}),

  me: asyncHandler(async (req: Request, res: Response) => {}),

  google: asyncHandler(async (req: Request, res: Response) => {}),

  googleCallback: asyncHandler(async (req: Request, res: Response) => {}),

  logout: asyncHandler(async (req: Request, res: Response) => {}),
};
