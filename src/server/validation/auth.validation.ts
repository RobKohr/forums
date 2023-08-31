import fs from "fs";
import Joi from "joi";
import { createValidation } from "../common/validation";

let isOnServer = false;
let customRuleCommonPassword = (value: string) => {
    return value; // skip this check on the client
}
if (isOnServer) {
    const passwordListHashTable: { [password: string]: boolean } = {};
    const strongCommonPasswords = fs.readFileSync(__dirname + "/../common/strong-common-passwords.txt", "utf8").split("\n");
    strongCommonPasswords.forEach((password: string) => {
        passwordListHashTable[password] = true;
    });
    customRuleCommonPassword = (value: string) => {
        if (passwordListHashTable[String(value).toLowerCase()] !== true) {
            return value;
        } else {
            throw new Error("Your password is too common. Please choose a different password.");
        }
    }
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
function customRuleStrongPassword(value: string) {
    if (passwordStrength(String(value)) > 1e16) {
        return value;
    } else {
        throw new Error("Add more letters, numbers, and symbols to make a stronger password.");
    }
}

const registrationSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required().label('Email'),
    username: Joi.string().alphanum().min(3).max(30).required().label('Username'),
    password: Joi.string().min(8).custom(customRuleCommonPassword).custom(customRuleStrongPassword).required().label('Password'),
    repeat_password: Joi.ref("password"),
}).with("password", "repeat_password");

function registrationPostValidation(validationResult: Joi.ValidationResult) {
    if (validationResult.error?.details?.length) {
        validationResult.error.details.forEach((error) => {
            if (error.context?.key === "repeat_password") {
                error.message = "Passwords do not match";
            }
            if (error.message.includes('failed custom validation because ')) {
                error.message = error.message.split('failed custom validation because ')[1];
            }
        });
    }
    return validationResult;
}


export const registrationValidation = createValidation(registrationSchema, registrationPostValidation);

const loginSchema = Joi.object({
    emailOrUsername: Joi.string().required(),
    password: Joi.string().required(),
})

export const loginValidation = createValidation(loginSchema);