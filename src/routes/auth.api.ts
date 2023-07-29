import "dotenv/config";

import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import { Tspec } from "tspec";
import Validator from "validatorjs";
import { trimBody } from "../common/api";
import { knex, prettyError } from "../common/db";
import { validate } from "../common/validation";
import { loginRules, registerRules } from "./auth.validation";
const jwt = require('jsonwebtoken');


export const router = Router();
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

/* Begin Register */
const register = async (req: Request, res: Response) => {
  const { email, username, password, retypePassword } = req.body;
  if (password !== retypePassword) {
    res.json({ success: false, message: "Passwords do not match" });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  /* start an sql transaction */
  knex
    .transaction(async function (trx: any) {
      const userProfile = {
        display_name: username,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
      };
      const userResult = await trx("user_profile").insert(userProfile).returning("id");
      const userId = userResult[0].id;

      const authUser = {
        username: username.toLowerCase(),
        email: email,
        password: passwordHash,
        user_id: userId,
      };
      /* insert into auth using sql and get id */
      const authResult = await trx("auth").insert(authUser).returning("id");
      const authId = authResult[0].id;
      if (authId && userId) {
        await trx("auth_to_user_profile").insert({ auth_id: authId, user_id: userId });
        res.json({ success: true });
      } else {
        res.json({ success: false, message: `Unknown error - authId: ${authId} userId:${userId} ` });
      }
    })
    .catch(function (error: any) {
      res.json({ success: false, message: prettyError(error) });
    });
};
router.post("/register", trimBody, validate(registerRules, Validator), register);

export type RegisterApiSpec = Tspec.DefineApiSpec<{
  tags: ["Auth"];
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a user";
        body: {
          username: string;
          email: string;
          password: string;
          retypePassword: string;
        };
        handler: typeof register;
      };
    };
  };
}>;


function generateAccessToken({ username, email, display_name, user_id }: { username: string, email: string, display_name: string, user_id: number }) {
  const secret = process.env.TOKEN_SECRET;
  if (typeof (secret) === 'string') {
    return jwt.sign({ username, email, display_name, user_id }, secret, { expiresIn: '1800s' });
  } else {
    throw new Error('TOKEN_SECRET is not a string');
  }
}


/* End Register */
/* Begin Login */

const login = async (req: Request, res: Response) => {
  let { emailOrUsername, password } = req.body;
  emailOrUsername = emailOrUsername.toLowerCase();

  /* emailOrUsername can be either an email or a username */
  const result = await knex("auth")
    .select("auth.*", "user_profile.display_name")
    .join("user_profile", "user_profile.id", "auth.user_id")
    .where("auth.email", emailOrUsername)
    .orWhere("auth.username", emailOrUsername)
    .first();
  if (!result) {
    res.json({ success: false, message: "Invalid login" });
    return;
  }
  const { username, email, display_name, user_id } = result;

  const passwordMatch = bcrypt.compareSync(password, result.password);
  /* add jwt token */


  if (!passwordMatch) {
    res.json({ success: false, message: "Invalid login" });
    return;
  } else {
    const token = generateAccessToken({ username, email, display_name, user_id })
    res.json({ success: true, message: "Login successful", token });
  }

};

router.post("/login", trimBody, validate(loginRules, Validator), login);

export type LoginApiSpec = Tspec.DefineApiSpec<{
  tags: ["Auth"];
  paths: {
    "/auth/login": {
      post: {
        summary: "Login a user";
        body: {
          emailOrUsername: string;
          password: string;
        };
        handler: typeof login;
      };
    };
  };
}>;