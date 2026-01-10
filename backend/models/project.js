import { DataTypes } from "sequelize";
import { db } from "./config.js";

export const Project = db.define(
    "Project",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
        },

        repoUrl: {
            type: DataTypes.TEXT,
            field: "repo_url",
        },

        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Allow null temporarily for existing projects, or enforced in logic
            field: "owner_id"
        }
    },
    {
        tableName: "projects",
        underscored: true,
    },
);