import { DataTypes } from "sequelize";
import { db } from "./config.js";

export const ProjectTeam = db.define(
    "ProjectTeam",
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
        tableName: "project_teams",
        timestamps: false, // no created_at / updated_at here
    },
);