import { Router } from "express";
import { updateBug } from "../controllers/bugController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

// PATCH /api/bugs/:bugId
router.patch("/:bugId", updateBug);

export default router;
