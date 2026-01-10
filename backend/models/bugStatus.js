import { DataTypes } from "sequelize";
import { db } from "./config.js";

export const BugStatus = db.define(
    "BugStatus",
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        bugId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // 1-to-1 relation with Bug
        field: "bug_id",
        },

        statusDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "status_date",
        },

        statusDescription: {
        type: DataTypes.TEXT,
        field: "status_description",
        },

        // commit that FIXED the bug (not the one where it was found)
        commitLink: {
        type: DataTypes.TEXT,
        field: "commit_link",
        },
    },
    {
        underscored: true,
        tableName: "bug_status",
    },
);