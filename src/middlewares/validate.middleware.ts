import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./error.middleware";

export const validateData = <Schema extends ZodType>(schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((item) => item.message);
      return next(new ApiError(400, "Validation Error", messages));
    }
    req.body = result.data;
    next();
  };
};
