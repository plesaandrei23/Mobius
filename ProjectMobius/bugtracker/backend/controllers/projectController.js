import { Project, User, ProjectTeam, ProjectTester } from "../models/index.js";

// GET /api/projects
export const getProjects = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find projects where user is MP or TST
        // We can fetch all and filter, or use complex query. 
        // For simplicity with Sequelize, let's fetch projects including members and testers
        // and filter in JS or use where clause on association.

        // Better approach: Find User and include projects
        const user = await User.findByPk(userId, {
            include: [
                { model: Project, as: "memberProjects" },
                { model: Project, as: "testerProjects" }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Combine and deduplicate if needed (though usually disjoint roles)
        const projects = [...user.memberProjects, ...user.testerProjects];

        // Deduplicate by ID just in case
        const uniqueProjects = Array.from(new Map(projects.map(p => [p.id, p])).values());

        res.json(uniqueProjects);
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
            repoUrl
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
