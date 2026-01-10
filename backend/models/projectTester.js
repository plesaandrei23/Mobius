import { DataTypes } from "sequelize";
import { db } from "./config.js";

export const ProjectTester = db.define(
    "ProjectTester",
    {
        userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "user_id",
        },
        projectId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: "project_id",
        },
    },
    {
        underscored: true,
        tableName: "project_testers",
        timestamps: false,
    },
);