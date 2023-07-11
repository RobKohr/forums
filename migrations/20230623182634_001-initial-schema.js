/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = async function(knex) {
    await knex.raw(`    
    CREATE TABLE IF NOT EXISTS user_profile (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        email TEXT NOT NULL
    );
    `);
    await knex.raw(`
    CREATE TABLE IF NOT EXISTS auth (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES user_profile(id),
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    );
    `);
    await knex.raw(`
    CREATE TABLE IF NOT EXISTS auth_to_user_profile (
        id SERIAL PRIMARY KEY,
        auth_id INTEGER NOT NULL REFERENCES auth(id),
        user_id INTEGER NOT NULL REFERENCES user_profile(id)
    );  
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.raw(`
    DROP TABLE IF EXISTS auth_to_user_profile;
    `);
    await knex.raw(`
    DROP TABLE IF EXISTS auth;
    `);
    await knex.raw(`
    DROP TABLE IF EXISTS user_profile;
    `);
};
