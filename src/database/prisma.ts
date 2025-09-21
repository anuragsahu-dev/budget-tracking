import { PrismaClient } from "@prisma/client";
import { config } from "../config/config";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database.url,
    },
  },
});

export default prisma;
