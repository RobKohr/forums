import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import { Tspec } from "tspec";
import { knex } from "../db";

export const router = Router();
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());
interface UserProfile {
  id: number;
  display_name: string;
  username: string;
  email: string;
}
interface Auth {
  id: number;
  user_id: number;
  username: string;
  email: string;
  password: string;
}
interface AuthToUserProfile {
  id: number;
  auth_id: number;
  user_id: number;
}

const register = async (req: Request, res: Response) => {
  console.log("made it to register");
  /* trim all body fields */
  console.log("req.body", req.body);

  Object.keys(req.body).forEach((key) => {
    if (req.body[key].trim) {
      req.body[key] = req.body[key].trim();
    }
  });

  if (req.body.password !== req.body.retypePassword) {
    res.json({ success: false, message: "Passwords do not match" });
    return;
  }

  const passwordHash = bcrypt.hashSync(req.body.password, 10);

  /* start an sql transaction */
  knex.transaction ffdf(async function (trx: any) {
    console.log("made it to sql.begin");
    const userProfile = {
      display_name: req.body.username,
      username: req.body.username.toLowerCase(),
      email: req.body.email,
    };
    /* insert into user_profile using knex and get id */
    const userResult = await knex("user_profile").insert(userProfile).returning("id");
    const userId = userResult[0].id;
    console.log("userId", userId, "userResult", userResult);

    const authUser = {
      username: req.body.username.toLowerCase(),
      email: req.body.email,
      password: passwordHash,
      user_id: userId,
    };
    /* insert into auth using sql and get id */
    const authResult = await knex("auth").insert(authUser).returning("id");
    const authId = authResult[0].id;

    if (authId && userId) {
      /* insert into auth_to_user_profile using knex */
      await knex("auth_to_user_profile").insert({ auth_id: authId, user_id: userId });
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Failed to register" });
    }
  });
};

router.post("/register", register);

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

// const getBookById = (req: Request<{ id: string }>, res: Response<Book>) => {
//   res.json({
//     id: +req.params.id,
//     title: "Book Title",
//     description: "Book Description",
//   });
// };

// export type BookApiSpec = Tspec.DefineApiSpec<{
//   tags: ["Book"];
//   paths: {
//     "/books/{id}": {
//       get: {
//         summary: "Get book by idasdf";
//         handler: typeof getBookById;
//       };
//     };
//   };
// }>;
