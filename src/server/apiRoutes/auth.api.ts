import "dotenv/config";

import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { NextFunction, Request, Response, Router } from "express";
import { Tspec } from "tspec";
import { trimBody, validate } from "../apiUtils";
import { knex, prettyError } from "../db";
import { loginValidation, registrationValidation } from "../validation/auth.validation";
const jwt = require('jsonwebtoken');

export const router = Router();
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

/* Begin Register */
const register = async (req: Request, res: Response) => {
  const { email, username, password, retype_password } = req.body;
  if (password !== retype_password) {
    res.json({ success: false, message: `Passwords do not match ${password} ${retype_password}` });
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
router.post("/register", trimBody, validate(registrationValidation), register);

export type RegisterApiSpec = Tspec.DefineApiSpec<{
  tags: ["Auth"];
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a user";
        body: {
          username: string;
          email: string;
          password: string;
          retype_password: string;
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
  if (!passwordMatch) {
    res.json({ success: false, message: "Invalid login" });
    return;
  } else {
    const token = generateAccessToken({ username, email, display_name, user_id })
    res.json({ success: true, message: "Login successful", token });
  }

};

router.post("/login", trimBody, validate(loginValidation), login);

export type LoginApiSpec = Tspec.DefineApiSpec<{
  tags: ["Auth"];
  paths: {
    "/api/auth/login": {
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


interface ValidateTokenRequest extends Request {
  username?: string;
}

async function validateToken(req: ValidateTokenRequest, res: Response, next: NextFunction): Promise<void> {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token == null) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, process.env.TOKEN_SECRET, (err: any, username: any) => {
    if (err) { return res.sendStatus(403); }
    req.username = username;
    next();
  })

}

router.post("/validateToken", validateToken, (req: ValidateTokenRequest, res: Response) => {
  res.json({ success: true, message: "Token is valid", username: req.username });
});
router.get("/validateToken", validateToken, (req: ValidateTokenRequest, res: Response) => {
  res.json({ success: true, message: "Token is valid", username: req.username });
});

export type ValidateTokenPostApiSpec = Tspec.DefineApiSpec<{
  tags: ["Auth"];
  paths: {
    "/api/auth/validateToken": {
      post: {
        summary: "Validate a token";
        handler: typeof validateToken;
        body: {
          token: string;
        }
      };
    };
  };
}>;


export type ValidateTokenGetApiSpec = Tspec.DefineApiSpec<{
  tags: ["Auth"],
  paths: {
    "/api/auth/validateToken": {
      get: {
        summary: "Validate a token",
        handler: typeof validateToken,
        query: {
          token: string,
        },
      };
    };
  };
}>;
