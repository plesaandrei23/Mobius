// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const SALT_ROUNDS = 10;

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Optional fallback if you still send via query by mistake
        if (!email || !password) {
        email = req.query.email;
        password = req.query.password;
        }

        console.log("-----Email received for register:", email);

        if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Email and password are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // IMPORTANT: search by column "email"
        const existing = await User.findOne({ where: { email: normalizedEmail } });
        if (existing) {
        return res.status(409).json({ message: "Email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // IMPORTANT: save into "email" column
        const user = await User.create({ email: normalizedEmail, passwordHash });

        return res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
    };

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        console.log("-----Email received for login:", email);

        const normalizedEmail = email.trim().toLowerCase(); 

        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "8h" },
        );

        return res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};