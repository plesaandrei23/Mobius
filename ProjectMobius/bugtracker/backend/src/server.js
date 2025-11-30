import express from "express";
import cors from "cors";

import { synchronizeDatabase } from "../models/config.js";
import "../models/index.js"; // import once to register associations

import authRoutes from "../routes/authRoutes.js"

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

// TODO: later we will add:
// import projectRoutes from "../routes/projectRoutes.js";
// import bugRoutes from "../routes/bugRoutes.js";
// app.use("/api/projects", projectRoutes);
// app.use("/api/bugs", bugRoutes);

const start = async () => {
    try {
        await synchronizeDatabase();
        console.log("Database synced");

        app.listen(PORT, () => {
        console.log(`Backend listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
};


start();