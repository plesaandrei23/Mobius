import { Bug, BugStatus, Project, User } from "../models/index.js";

// GET /api/projects/:projectId/bugs
// List all bugs for the project (MP or TST)
export const getProjectBugs = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: getProjectBugs");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("==================================================");
        const { projectId } = req.params;
        const userId = req.user.id;

        const project = await Project.findByPk(projectId, {
            include: [
                { model: User, as: "members", attributes: ["id"] },
                { model: User, as: "testers", attributes: ["id"] },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = project.members.some((m) => m.id === userId);
        const isTester = project.testers.some((t) => t.id === userId);

        if (!isMember && !isTester) {
            return res.status(403).json({ message: "Access denied" });
        }

        const bugs = await Bug.findAll({
            where: { projectId },
            include: [
                { model: User, as: "reporter", attributes: ["id", "email"] },
                { model: User, as: "allocated", attributes: ["id", "email"] },
                { model: BugStatus }, // Include the solution details if any
            ],
        });

        return res.json(bugs);
    } catch (err) {
        console.error("getProjectBugs error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/projects/:projectId/bugs
// Create a new bug (TST only)
export const createBug = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: createBug");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("BODY:", JSON.stringify(req.body, null, 2));
        console.log("==================================================");
        const { projectId } = req.params;
        const userId = req.user.id;
        const { title, description, severity, priority, commitLink } = req.body;

        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: "testers", attributes: ["id"] }],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isTester = project.testers.some((t) => t.id === userId);
        if (!isTester) {
            return res.status(403).json({ message: "Only testers can report bugs" });
        }

        if (!title || !description || !severity || !priority) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const bug = await Bug.create({
            projectId,
            reporterId: userId,
            title,
            description,
            severity,
            priority,
            commitLink,
            status: "OPEN",
        });

        return res.status(201).json(bug);
    } catch (err) {
        console.error("createBug error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// PATCH /api/projects/:projectId/bugs/:bugId
// Update bug (MP only) - Allocate, Status, Solution
export const updateBug = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("ACTION: updateBug");
        console.log("USER ID:", req.user.id);
        console.log("PROJECT ID:", req.params.projectId);
        console.log("BUG ID:", req.params.bugId);
        console.log("BODY:", JSON.stringify(req.body, null, 2));
        console.log("==================================================");
        const { projectId, bugId } = req.params;
        const userId = req.user.id;
        const { status, allocate, solution } = req.body;
        // allocate: boolean (true to assign to self)
        // solution: { commitLink, description } (if resolving)

        const project = await Project.findByPk(projectId, {
            include: [{ model: User, as: "members", attributes: ["id"] }],
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = project.members.some((m) => m.id === userId);
        if (!isMember) {
            return res.status(403).json({ message: "Only members can update bugs" });
        }

        const bug = await Bug.findOne({ where: { id: bugId, projectId } });
        if (!bug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        // 1. Allocation
        if (allocate === true) {
            // Check if already allocated to someone else?
            if (bug.allocatedId && bug.allocatedId !== userId) {
                return res.status(409).json({ message: "Bug is already allocated to someone else" });
            }
            bug.allocatedId = userId;
        } else if (allocate === false) {
            // Unassign if needed (optional)
            if (bug.allocatedId === userId) {
                bug.allocatedId = null;
            }
        }

        // 2. Status Update
        if (status) {
            bug.status = status;
        }

        // 3. Solution (BugStatus)
        if (solution) {
            // If providing a solution, we assume status might change to RESOLVED
            // or we just attach the info.
            // Check if BugStatus exists
            let bugStatus = await BugStatus.findOne({ where: { bugId: bug.id } });

            if (bugStatus) {
                if (solution.commitLink) bugStatus.commitLink = solution.commitLink;
                if (solution.description) bugStatus.statusDescription = solution.description;
                await bugStatus.save();
            } else {
                await BugStatus.create({
                    bugId: bug.id,
                    commitLink: solution.commitLink,
                    statusDescription: solution.description,
                });
            }

            // Auto-set status to RESOLVED if not explicitly provided?
            // Let's rely on the user sending status="RESOLVED" explicitly or just do it here.
            // Requirement: "after solving a bug, i can add a status to the solution..."
            if (!status) {
                bug.status = "RESOLVED";
            }
        }

        await bug.save();

        return res.json(bug);
    } catch (err) {
        console.error("updateBug error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
