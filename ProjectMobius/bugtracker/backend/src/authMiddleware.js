// src/authMiddleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";//TODO: Change this

export const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const token = header.substring("Bearer ".length);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};