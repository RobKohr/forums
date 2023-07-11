import 'dotenv/config';
import postgres from 'postgres';


export const sql = postgres({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
});

function createUserProfileTableIfNotExists(){
    sql`
        CREATE TABLE IF NOT EXISTS user_profile (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL
        );
    `;
}
createUserProfileTableIfNotExists();


function createAuthTableIfNotExists(){
    sql`
        CREATE TABLE IF NOT EXISTS auth (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES user_profile(id),
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        );
    `;
}
createAuthTableIfNotExists();


function createAuthToUsersTableIfNotExists(){
    sql`
        CREATE TABLE IF NOT EXISTS auth_to_user_profile (
            id SERIAL PRIMARY KEY,
            auth_id INTEGER NOT NULL REFERENCES auth(id),
            user_id INTEGER NOT NULL REFERENCES user_profile(id)
        );
    `;
}
createAuthToUsersTableIfNotExists();
