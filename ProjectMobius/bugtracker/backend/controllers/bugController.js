import { Bug, Project, User } from "../models/index.js";

// GET /api/projects/:projectId/bugs
export const getBugs = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Verify project exists
        const project = await Project.findByPk(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const bugs = await Bug.findAll({
            where: { project_id: projectId },
            include: [
                { model: User, as: "reporter", attributes: ["id", "email"] },
                { model: User, as: "allocated", attributes: ["id", "email"] }
            ]
        });

        res.json(bugs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/projects/:projectId/bugs
export const createBug = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, severity, priority, commitLink } = req.body;
        const reporterId = req.user.id;

        // Verify project exists
        const project = await Project.findByPk(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // TODO: Verify user is TST on this project (optional but recommended)

        const bug = await Bug.create({
            projectId,
            reporterId,
            title,
            description,
            severity,
            priority,
            commitLink,
            status: "OPEN"
        });

        res.status(201).json(bug);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// PATCH /api/bugs/:bugId
export const updateBug = async (req, res) => {
    try {
        const { bugId } = req.params;
        const { status, allocatedId, commitLink } = req.body; // Fields to update

        const bug = await Bug.findByPk(bugId);
        if (!bug) return res.status(404).json({ message: "Bug not found" });

        // TODO: Verify user is MP on the project (optional but recommended)

        if (status) bug.status = status;
        if (allocatedId) bug.allocatedId = allocatedId;
        if (commitLink) bug.commitLink = commitLink; // For when bug is resolved

        await bug.save();

        res.json(bug);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
