import { Router } from "express";
import {
    getProjects,
    createProject,
    getProject,
    addMember,
    addTester
} from "../controllers/projectController.js";
import { getBugs, createBug } from "../controllers/bugController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProject);
router.post("/:projectId/members", addMember);
router.post("/:projectId/testers", addTester);

router.get("/:projectId/bugs", getBugs);
router.post("/:projectId/bugs", createBug);

export default router;
