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

export function prettyError(error: any) {
  let message = error.detail;
  /* handle condition where error detail contains "already exists" */
  if (error.detail.includes("already exists")) {
    /* Change "Key (KEY_NAME)=(KEY_VALUE) already exists." to "KEY_NAME KEY_VALUE already exists." for error.detail */
    message = error.detail.replace(/Key \((.+)\)=\((.+)\) already exists./, "$1 $2 already exists.");
  }
  return message;
}
