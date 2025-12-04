import { Router } from "express";
import {
    getProjects,
    createProject,
    getProject,
    updateProject,
    addMember,
    removeMember,
    addTester,
    removeTester,
} from "../controllers/projectController.js";

const router = Router();

// NOTE: These routes require authentication.
// Please ensure you mount this router with an auth middleware,
// or add the middleware to each route here.

// GET /api/projects - List user's projects
router.get("/", getProjects);

// POST /api/projects - Create new project
router.post("/", createProject);

// GET /api/projects/:projectId - Get project details
router.get("/:projectId", getProject);

// PATCH /api/projects/:projectId - Update project
router.patch("/:projectId", updateProject);

// POST /api/projects/:projectId/members - Add member
router.post("/:projectId/members", addMember);

// DELETE /api/projects/:projectId/members/:userId - Remove member
router.delete("/:projectId/members/:userId", removeMember);

// POST /api/projects/:projectId/testers - Add tester (self or other)
// Note: The controller handles both cases (self if no userId, or explicit userId)
// You might want a specific route for 'self' like /:projectId/testers/self if you want to be strict,
// but the controller logic `addTester` seems to handle it.
router.post("/:projectId/testers", addTester);

// DELETE /api/projects/:projectId/testers/:userId - Remove tester
router.delete("/:projectId/testers/:userId", removeTester);

export default router;
