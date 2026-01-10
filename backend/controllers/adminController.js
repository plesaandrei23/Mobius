import { User, Project } from "../models/index.js";

// GET /api/admin/users
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "email", "role"]
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/admin/users/:userId
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent deleting self
        // Prevent deleting self
        if (req.user.id === parseInt(userId)) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        // Prevent deleting self? Or distinct admin check.
        // Usually good to prevent deleting the last admin, but for now just delete.
        await user.destroy();
        res.json({ message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/admin/projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                { model: User, as: "members", attributes: ["email"] } // Just to show who is in it
            ]
        });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/admin/projects/:projectId
export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.destroy();
        res.json({ message: "Project deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
