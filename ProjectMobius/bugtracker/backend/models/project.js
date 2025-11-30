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
    },
    {
        tableName: "projects",
        underscored: true,
    },
);