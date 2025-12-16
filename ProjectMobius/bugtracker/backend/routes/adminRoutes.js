import express from "express";
import { getUsers, deleteUser, getProjects, deleteProject } from "../controllers/adminController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};

// Protect all admin routes
router.use(authenticate, requireAdmin);

router.get("/users", getUsers);
router.delete("/users/:userId", deleteUser);
router.get("/projects", getProjects);
router.delete("/projects/:projectId", deleteProject);

export default router;
