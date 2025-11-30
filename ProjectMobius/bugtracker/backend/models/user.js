import { DataTypes } from "sequelize";
import { db } from "./config.js";

export const User = db.define(
    "User",
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        },
        
        passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: "password_hash",
        },
        
        role: {
        // STUDENT / ADMIN etc.
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "STUDENT",
        },
    },
    {
        tableName: "users",
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
        ],
    },
);