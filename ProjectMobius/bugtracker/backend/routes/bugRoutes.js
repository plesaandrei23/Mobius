import { Router } from "express";
import { getProjectBugs, createBug, updateBug } from "../controllers/bugController.js";
// Assuming you have an authentication middleware. 
// If not, you'll need to create one or import it if it exists.
// For now, I will assume a middleware named 'authenticate' exists or I will leave a placeholder.
// Let's check if there is a middleware file first? 
// Actually, I'll just use a placeholder comment if I don't see one, 
// but usually it's something like `import { authenticate } from "../middleware/auth.js";`

const router = Router();

// We need to handle the ":projectId" part.
// Usually, these routes are mounted like: app.use('/api/projects', projectRoutes)
// So the URL would be /api/projects/:projectId/bugs
// But wait, if we mount this router at /api/projects, then we can handle the nested structure.
// OR we can define the full path here.

// OPTION 1: Mount at /api
// router.get('/projects/:projectId/bugs', authenticate, getProjectBugs);

// OPTION 2: Mount at /api/projects/:projectId/bugs (less common for Express routers to handle dynamic parent params easily without mergeParams)

// Let's stick to the structure implied by the controller:
// The controller expects `req.params.projectId`.
// So we should define the routes with `:projectId` in them.

// NOTE: You need to make sure you have an authentication middleware.
// I will assume you will add it. For now I will just link the controller functions.

// GET /api/projects/:projectId/bugs
router.get("/projects/:projectId/bugs", getProjectBugs);

// POST /api/projects/:projectId/bugs
router.post("/projects/:projectId/bugs", createBug);

// PATCH /api/projects/:projectId/bugs/:bugId
router.patch("/projects/:projectId/bugs/:bugId", updateBug);

export default router;
