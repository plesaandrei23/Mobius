import { Project, User, ProjectTeam, ProjectTester } from "../models/index.js";

// GET /api/projects
// GET /api/projects
export const getProjects = async (req, res) => {
    try {
        // Requirement: Users need to see ALL projects to be able to join them as testers.
        // We fetch all projects. Frontend can visually distinguish "My Projects" vs others if needed.
        const projects = await Project.findAll({
            include: [
                { model: User, as: "members", attributes: ["id", "email"] },
                { model: User, as: "testers", attributes: ["id", "email"] }
            ]
        });

        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/projects
export const createProject = async (req, res) => {
    try {
        const { name, description, repoUrl } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const project = await Project.create({
            name,
            description,
            repoUrl,
            ownerId: userId
        });

        // Add creator as MP
        await ProjectTeam.create({
            user_id: userId,
            project_id: project.id
        });

        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET /api/projects/:projectId
export const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId, {
            include: [
                { model: User, as: "members", attributes: ["id", "email"] },
                { model: User, as: "testers", attributes: ["id", "email"] }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/projects/:projectId/members
export const addMember = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body;

        const project = await Project.findByPk(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const userToAdd = await User.findOne({ where: { email } });
        if (!userToAdd) return res.status(404).json({ message: "User to add not found" });

        // Check if already member
        const existing = await ProjectTeam.findOne({
            where: { project_id: projectId, user_id: userToAdd.id }
        });

        if (existing) {
            return res.status(409).json({ message: "User is already a member" });
        }

        await ProjectTeam.create({
            project_id: projectId,
            user_id: userToAdd.id
        });

        res.status(201).json({ message: "Member added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/projects/:projectId/testers
export const addTester = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email } = req.body; // If adding someone else
        // Or if adding self: const userId = req.user.id;

        // The requirement says: 
        // "As a student that is not a member of the project team i can register as a tester (TST) for the project"
        // So we might support both adding self and adding others.

        let userIdToAdd;
        if (email) {
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: "User not found" });
            userIdToAdd = user.id;
        } else {
            userIdToAdd = req.user.id;
        }

        const project = await Project.findByPk(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // Check if already tester
        const existing = await ProjectTester.findOne({
            where: { project_id: projectId, user_id: userIdToAdd }
        });

        if (existing) {
            return res.status(409).json({ message: "User is already a tester" });
        }

        await ProjectTester.create({
            project_id: projectId,
            user_id: userIdToAdd
        });

        res.status(201).json({ message: "Tester added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/projects/:projectId
export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByPk(projectId);

        if (!project) return res.status(404).json({ message: "Project not found" });

        // Check ownership
        if (project.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this project" });
        }

        await project.destroy();
        res.json({ message: "Project deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
