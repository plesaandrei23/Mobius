import express from "express";
import cors from "cors";

import { synchronizeDatabase } from "../models/config.js";
import "../models/index.js"; // import once to register associations

import authRoutes from "../routes/authRoutes.js"
import projectRoutes from "../routes/projectRoutes.js";
import bugRoutes from "../routes/bugRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// healthcheck
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "backend" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/admin", adminRoutes);

//add admin control to see all ussers, projects, bugs (new user type admin)

const start = async () => {
    try {
        await synchronizeDatabase();
        console.log("Database synced");

        // Seed Admin
        const { User } = await import("../models/index.js");
        const bcrypt = await import("bcrypt");

        const adminEmail = "admin@admin.com";
        const adminExists = await User.findOne({ where: { email: adminEmail } });
        const hashedPassword = await bcrypt.hash("addmin", 10);

        if (!adminExists) {
            await User.create({
                email: adminEmail,
                passwordHash: hashedPassword,
                role: "ADMIN"
            });
            console.log("Admin account seeded");
        } else {
            // Ensure permissions and password are correct even if it exists
            adminExists.role = "ADMIN";
            adminExists.passwordHash = hashedPassword;
            await adminExists.save();
            console.log("Admin account updated/verified");
        }

        // Demo Data Seeding
        const fs = await import("fs");
        const path = await import("path");
        const { Project, ProjectTeam } = await import("../models/index.js");

        try {
            const usersData = JSON.parse(fs.readFileSync(path.resolve("demo-users.json"), "utf8"));
            for (const u of usersData) {
                const existing = await User.findOne({ where: { email: u.email } });
                if (!existing) {
                    const pwd = await bcrypt.hash(u.password, 10);
                    await User.create({ email: u.email, passwordHash: pwd, role: u.role });
                    console.log(`Seeded user: ${u.email}`);
                }
            }

            const projectsData = JSON.parse(fs.readFileSync(path.resolve("demo-projects.json"), "utf8"));
            for (const p of projectsData) {
                const existing = await Project.findOne({ where: { name: p.name } });
                if (!existing) {
                    const owner = await User.findOne({ where: { email: p.ownerEmail } });
                    if (owner) {
                        const newProject = await Project.create({
                            name: p.name,
                            description: p.description,
                            repoUrl: p.repoUrl,
                            ownerId: owner.id
                        });
                        // Add owner as member (MP)
                        await ProjectTeam.create({
                            userId: owner.id,
                            projectId: newProject.id
                        });
                        console.log(`Seeded project: ${p.name}`);
                    }
                }
            }
        } catch (seedErr) {
            console.warn("Demo seeding skipped or failed:", seedErr.message);
        }

        app.listen(PORT, () => {
            console.log(`Backend listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
};

start();