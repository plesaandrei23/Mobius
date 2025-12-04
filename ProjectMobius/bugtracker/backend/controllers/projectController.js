import { Project, User, ProjectTeam, ProjectTester } from "../models/index.js";

// GET /api/projects
// Returns all projects where the current user is a Member (MP) or Tester (TST)
export const getProjects = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: getProjects");
        console.log("USER ID:", req.user.id);
        console.log("==================================================");
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            include: [
                { model: Project, as: "memberProjects" },
                { model: Project, as: "testerProjects" },
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Combine both lists. You might want to flag which role they have in the response.
        // For simplicity, we just return the list of projects.
        // We can map them to add a "role" field if needed, but for now just the project data.
        const projects = [
            ...user.memberProjects.map((p) => ({ ...p.toJSON(), role: "MP" })),
            ...user.testerProjects.map((p) => ({ ...p.toJSON(), role: "TST" })),
        ];

        return res.json(projects);
    } catch (err) {
        console.error("getProjects error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/projects
// Create a new project and add current user as MP
export const createProject = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: createProject");
        console.log("USER ID:", req.user.id);
        console.log("BODY:", JSON.stringify(req.body, null, 2));
        console.log("==================================================");
        const { name, repoUrl, description } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const project = await Project.create({
            name,
            repoUrl,
            description,
        });

        // Add creator as Member
        await project.addMember(userId);

        return res.status(201).json(project);
    } catch (err) {
        console.error("createProject error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/projects/:projectId
// Return project details if user is MP or TST
export const getProject = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: getProject");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("==================================================");
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: User,
                    as: "members",
                    attributes: ["id", "email"],
                    through: { attributes: [] },
                },
                {
                    model: User,
                    as: "testers",
                    attributes: ["id", "email"],
                    through: { attributes: [] },
                },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check access
        const isMember = project.members.some((m) => m.id === userId);
        const isTester = project.testers.some((t) => t.id === userId);

        if (!isMember && !isTester) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.json(project);
    } catch (err) {
        console.error("getProject error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// PATCH /api/projects/:projectId
// Update project info (MP only)
export const updateProject = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: updateProject");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("BODY:", JSON.stringify(req.body, null, 2));
        console.log("==================================================");
        const { projectId } = req.params;
        const userId = req.user.id;
        const { name, repoUrl, description } = req.body;

        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: "members", attributes: ["id"] }],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = project.members.some((m) => m.id === userId);
        if (!isMember) {
            return res.status(403).json({ message: "Only members can update the project" });
        }

        if (name) project.name = name;
        if (repoUrl) project.repoUrl = repoUrl;
        if (description) project.description = description;

        await project.save();

        return res.json(project);
    } catch (err) {
        console.error("updateProject error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/projects/:projectId/members
// Add a user as MP (Requester must be MP)
export const addMember = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: addMember");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("TARGET USER:", req.body.userId);
        console.log("==================================================");
        const { projectId } = req.params;
        const { userId: targetUserId } = req.body; // User to add
        const requesterId = req.user.id;

        if (!targetUserId) {
            return res.status(400).json({ message: "Target userId is required" });
        }

        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: "members", attributes: ["id"] }],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isRequesterMember = project.members.some((m) => m.id === requesterId);
        if (!isRequesterMember) {
            return res.status(403).json({ message: "Only members can add other members" });
        }

        // Check if already member
        const isAlreadyMember = project.members.some((m) => m.id === targetUserId);
        if (isAlreadyMember) {
            return res.status(409).json({ message: "User is already a member" });
        }

        await project.addMember(targetUserId);

        return res.status(201).json({ message: "Member added" });
    } catch (err) {
        console.error("addMember error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /api/projects/:projectId/members/:userId
// Remove a user from members (Requester must be MP)
export const removeMember = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: removeMember");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("TARGET USER:", req.params.userId);
        console.log("==================================================");
        const { projectId, userId: targetUserId } = req.params;
        const requesterId = req.user.id;

        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: "members", attributes: ["id"] }],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isRequesterMember = project.members.some((m) => m.id === requesterId);
        if (!isRequesterMember) {
            return res.status(403).json({ message: "Only members can remove members" });
        }

        // Prevent removing oneself if they are the only member? (Optional logic)
        // For now, allow it.

        await project.removeMember(targetUserId);

        return res.json({ message: "Member removed" });
    } catch (err) {
        console.error("removeMember error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/projects/:projectId/testers
// Add a tester (Requester must be MP, or Self-Add if not MP)
export const addTester = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: addTester");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("BODY:", JSON.stringify(req.body, null, 2));
        console.log("==================================================");
        const { projectId } = req.params;
        const requesterId = req.user.id;
        // If body has userId, we are adding someone else. If not, maybe self add?
        // The routes might separate these: /testers/self vs /testers
        // But let's handle both here or assume this is the generic "add tester" logic.
        // Based on requirements:
        // POST /testers/self -> add current user
        // POST /testers -> add another user (MP only)

        // Let's check if we are adding self or other
        let targetUserId = req.body.userId;
        const isSelfAdd = !targetUserId || targetUserId === requesterId;

        if (isSelfAdd) {
            targetUserId = requesterId;
        }

        const project = await Project.findByPk(projectId, {
            include: [
                { model: User, as: "members", attributes: ["id"] },
                { model: User, as: "testers", attributes: ["id"] },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Authorization
        if (isSelfAdd) {
            // Check if user is MP (cannot be TST if MP)
            const isMember = project.members.some((m) => m.id === requesterId);
            if (isMember) {
                return res.status(400).json({ message: "Project members cannot be testers" });
            }
        } else {
            // Adding someone else -> Requester must be MP
            const isRequesterMember = project.members.some((m) => m.id === requesterId);
            if (!isRequesterMember) {
                return res.status(403).json({ message: "Only members can add testers" });
            }
        }

        // Check if already tester
        const isAlreadyTester = project.testers.some((t) => t.id === targetUserId);
        if (isAlreadyTester) {
            return res.status(409).json({ message: "User is already a tester" });
        }

        await project.addTester(targetUserId);

        return res.status(201).json({ message: "Tester added" });
    } catch (err) {
        console.error("addTester error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /api/projects/:projectId/testers/:userId
// Remove a tester (Requester must be MP)
export const removeTester = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: removeTester");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("TARGET USER:", req.params.userId);
        console.log("==================================================");
        const { projectId, userId: targetUserId } = req.params;
        const requesterId = req.user.id;

        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: "members", attributes: ["id"] }],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isRequesterMember = project.members.some((m) => m.id === requesterId);
        if (!isRequesterMember) {
            return res.status(403).json({ message: "Only members can remove testers" });
        }

        await project.removeTester(targetUserId);

        return res.json({ message: "Tester removed" });
    } catch (err) {
        console.error("removeTester error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};