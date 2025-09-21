import { Router } from "express";
import { healthCheck } from "../controllers/healthCheck.controller";

const router = Router();

router.get("/full-check", healthCheck);


export default router;