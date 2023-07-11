import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import fs from "fs";
import { Tspec } from "tspec";
import Validator from "validatorjs";
import { knex, prettyError } from "../db";
import { createValidator } from "../validation/common";

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

function passwordStrength(value: string) {
  value = String(value);
  const containsAnUppercaseLetter = /[A-Z]/.test(value);
  const containsALowercaseLetter = /[a-z]/.test(value);
  const containsANumber = /\d/.test(value);
  const containsASpecialCharacter = /[^a-zA-Z\d]/.test(value);
  const numberOfPossibleCharacters =
    (containsAnUppercaseLetter ? 26 : 0) + (containsALowercaseLetter ? 26 : 0) + (containsANumber ? 10 : 0) + (containsASpecialCharacter ? 32 : 0);
  const strength = numberOfPossibleCharacters ** value.length;
  return strength;
}

Validator.register(
  "strongPassword",
  (value) => {
    return passwordStrength(String(value)) > 1e13;
  },
  `Your password is not strong enough. You can add more characters, numbers, and symbols to make it stronger.`
);
Validator.register(
  "almostStrongPassword",
  (value) => {
    return passwordStrength(String(value)) > 1e11;
  },
  "Your password is almost strong enough. You can add more characters, numbers, and symbols to make it stronger."
);

/* import ./10-million-password-list-top-1000000.txt, convert to lower case, and if it is strong enough, add to strong common passwords */
/*
function filterBigPasswordList() {
  const bigPasswordList = fs.readFileSync(__dirname + "/10-million-password-list-top-1000000.txt", "utf8").split("\n");
  let count = 0;
  fs.writeFileSync(__dirname + "/strong-common-passwords.txt", "");
  bigPasswordList.forEach((password) => {
    password = password.trim().toLocaleLowerCase();
    if (passwordStrength(password) < 1e13) return;
    fs.appendFileSync(__dirname + "/strong-common-passwords.txt", password + "\n");
    count++;
  });
  console.log("count", count);
}
filterBigPasswordList();
*/
const passwordListHashTable: { [password: string]: boolean } = {};
const strongCommonPasswords = fs.readFileSync(__dirname + "/strong-common-passwords.txt", "utf8").split("\n");
strongCommonPasswords.forEach((password) => {
  passwordListHashTable[password] = true;
});

Validator.register(
  "commonPassword",
  (value) => {
    return passwordListHashTable[String(value).toLowerCase()] !== true;
  },
  "Your password is too common. Please choose a different password."
);
const rules = {
  email: "required|email",
  username: "required|string",
  password: "required|string|min:8|commonPassword|almostStrongPassword|strongPassword",
};

const register = async (req: Request, res: Response) => {
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
  knex
    .transaction(async function (trx: any) {
      console.log("made it to sql.begin");
      const userProfile = {
        display_name: req.body.username,
        username: req.body.username.toLowerCase(),
        email: req.body.email,
      };
      /* insert into user_profile using knex and get id */
      const userResult = await trx("user_profile").insert(userProfile).returning("id");
      const userId = userResult[0].id;
      console.log("userId", userId, "userResult", userResult);

      const authUser = {
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        password: passwordHash,
        user_id: userId,
      };
      /* insert into auth using sql and get id */
      const authResult = await trx("auth").insert(authUser).returning("id");
      const authId = authResult[0].id;

      if (authId && userId) {
        /* insert into auth_to_user_profile using knex */
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

router.post("/register", createValidator(rules, Validator), register);

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
