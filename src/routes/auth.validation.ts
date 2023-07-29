import fs from "fs";
import Validator from "validatorjs";
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



const passwordListHashTable: { [password: string]: boolean } = {};
const strongCommonPasswords = fs.readFileSync(__dirname + "/../common/strong-common-passwords.txt", "utf8").split("\n");


strongCommonPasswords.forEach((password: string) => {
    passwordListHashTable[password] = true;
});


Validator.register(
    "commonPassword",
    (value) => {
        return passwordListHashTable[String(value).toLowerCase()] !== true;
    },
    "Your password is too common. Please choose a different password."
);
export const registerRules = {
    email: "required|email",
    username: "required|string",
    password: "required|string|min:8|commonPassword|strongPassword",
};

export const loginRules = {
    emailOrUsername: "required|string",
    password: "required|string",
};
