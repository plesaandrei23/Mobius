import { DataTypes } from "sequelize";
import { db } from "./config.js";

export const Bug = db.define(
    "Bug",
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "project_id",
        },

        reporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "reporter_id",
        },

        title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        },

        description: {
        type: DataTypes.TEXT,
        allowNull: false,
        },
        
        severity: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: 
            {
            isIn: [["LOW", "MEDIUM", "HIGH", "CRITICAL"]],
            },
        },

        priority: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: 
            {
            isIn: [["LOW", "MEDIUM", "HIGH"]],
            },
        },

        // commit where the bug was observed / tested
        commitLink: {
        type: DataTypes.TEXT,
        field: "commit_link",
        },

        // MP assigned to fix it
        allocatedId: {
        type: DataTypes.INTEGER,
        field: "allocated_id",
        },

        status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "OPEN",
        validate: 
            {
            isIn: [["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]],
            },
        },
    },
    {
        tableName: "bugs",
        underscored: true,
    },
);