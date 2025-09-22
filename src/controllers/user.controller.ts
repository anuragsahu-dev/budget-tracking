import prisma from "../database/prisma";
import { ApiError, asyncHandler } from "../middlewares/error.middleware";

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existedUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  
});
