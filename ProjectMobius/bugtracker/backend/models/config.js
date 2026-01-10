import { Sequelize } from "sequelize";

export const db = new Sequelize({
    dialect: "sqlite",
    storage: "action.db",
});

export const synchronizeDatabase = async () => {
    await db.authenticate();
    // Disable foreign keys to allow dropping/recreating tables if needed by alter:true used below
    try {
        await db.query("PRAGMA foreign_keys = OFF;");
        await db.sync({ alter: true });
        await db.query("PRAGMA foreign_keys = ON;");
    } catch (err) {
        // Ensure they are turned back on if error
        await db.query("PRAGMA foreign_keys = ON;");
        throw err;
    }
};



