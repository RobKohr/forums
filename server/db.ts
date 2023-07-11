import postgres from "postgres";
import knexfile from "./knexfile";
const configs = {
  host: "localhost",
  port: 5432,
  database: "forums",
  username: "postgres",
  password: "",
};

export const knex = require("knex")(knexfile.development);
const { host, port, database, username, password } = configs;
export const sql = postgres({ host, port, database, username, password });
