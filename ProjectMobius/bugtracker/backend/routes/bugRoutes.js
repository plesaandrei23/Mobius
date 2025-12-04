import { Router } from "express";
import { getBugs, createBug, updateBug } from "../controllers/bugController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

// These routes are nested under /api/projects/:projectId/bugs in server.js? 
// Or we can define them here. 
// Let's stick to the plan:
// GET /api/projects/:projectId/bugs -> handled by projectRoutes or nested?
// Express Router mergeParams is useful for nesting.

// However, to keep it simple, let's define routes that might not be strictly nested in URL structure here,
// OR we can mount this router at /api/bugs and handle IDs there.

// BUT, the README says:
// GET /api/projects/:projectId/bugs
// POST /api/projects/:projectId/bugs

// So these should probably be attached to the project router or a nested router.
// Let's use this file for direct bug manipulation if any, or just export the handlers to be used in projectRoutes?
// Actually, let's make this router handle the nested paths if we mount it correctly, 
// OR just put these routes in projectRoutes for simplicity since they depend on projectId.

// Wait, the plan said "Implement Backend: Bug Controller & Routes".
// Let's put the project-related bug routes in projectRoutes.js to avoid confusion, 
// and use this file for direct bug updates (PATCH /api/bugs/:bugId).

// PATCH /:bugId
router.patch("/:bugId", updateBug);

export default router;
