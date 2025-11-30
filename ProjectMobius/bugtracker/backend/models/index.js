import { db } from "./config.js";
import { User } from "./user.js";
import { Project } from "./project.js";
import { ProjectTeam } from "./projectTeam.js";
import { ProjectTester } from "./projectTester.js";
import { Bug } from "./bug.js";
import { BugStatus } from "./bugStatus.js";

// User many to many Project (MP)
User.belongsToMany(Project, {
    through: ProjectTeam,
    as: "memberProjects",
        foreignKey: "user_id",
        otherKey: "project_id",
});

Project.belongsToMany(User, {
    through: ProjectTeam,
    as: "members",
        foreignKey: "project_id",
        otherKey: "user_id",
});

// User many to many Project (TST)
User.belongsToMany(Project, {
    through: ProjectTester,
    as: "testerProjects",
        foreignKey: "user_id",
        otherKey: "project_id",
});

Project.belongsToMany(User, {
    through: ProjectTester,
    as: "testers",
        foreignKey: "project_id",
        otherKey: "user_id",
});

// Project 1 to many Bug
Project.hasMany(Bug, { foreignKey: "project_id" });

Bug.belongsTo(Project, { foreignKey: "project_id" });


// Bug - reporter (TST)
User.hasMany(Bug, { as: "reportedBugs", foreignKey: "reporter_id" });

Bug.belongsTo(User, { as: "reporter", foreignKey: "reporter_id" });


// Bug - allocated MP
User.hasMany(Bug, { as: "allocatedBugs", foreignKey: "allocated_id" });

Bug.belongsTo(User, { as: "allocated", foreignKey: "allocated_id" });


// Bug 1 to 1 BugStatus
Bug.hasOne(BugStatus, { foreignKey: "bug_id" });

BugStatus.belongsTo(Bug, { foreignKey: "bug_id" });


export {
    db,
    User,
    Project,
    ProjectTeam,
    ProjectTester,
    Bug,
    BugStatus,
};