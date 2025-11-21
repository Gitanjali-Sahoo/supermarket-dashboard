import Database from "better-sqlite3";

const db = new Database("./db/sales.db", { verbose: console.log });

export default db;
