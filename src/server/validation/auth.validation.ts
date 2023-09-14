import fs from "fs";
import Joi from "joi";
import { createValidation } from "../common/validation";
import { localization } from "../common/localization";

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
        throw new Error(localization('strongerPassword'));
    }
}

function customRuleUsername(value: string) {
    // allow only letters, numbers, underscores, and dashes
    if (/^[a-zA-Z0-9_-]+$/.test(value)) {
        return value;
    } else {
        throw new Error("Username can only contain letters, numbers, underscores, and dashes.");
    }
}

const registrationSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required().label('Email'),
    username: Joi.string().custom(customRuleUsername).min(3).max(30).required().label('Username'),
    password: Joi.string().min(8).custom(customRuleCommonPassword).custom(customRuleStrongPassword).required().label('Password'),
    retype_password: Joi.ref("password"),
}).with("password", "retype_password");

function registrationPostValidation(validationResult: Joi.ValidationResult) {
    if (validationResult.error?.details?.length) {
        validationResult.error.details.forEach((error) => {
            if (error.context?.key === "retype_password") {
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