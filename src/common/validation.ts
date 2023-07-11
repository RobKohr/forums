import { NextFunction, Request, Response } from "express";
import * as Validator from "validatorjs";

export const rules = {
  email: "required|email",
  username: "required|string",
  phone: "required|string",
  password: "required|string|min:6|confirmed|strict",
  gender: "string",
};

export function createValidator(rules: Validator.Rules, Validator: Validator.ValidatorStatic) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const validator = new Validator(req.body, rules);

    function passes() {
      next();
    }

    function fails() {
      console.log("validator.errors", validator.errors);
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: validator.errors,
      });
    }
    validator.checkAsync(passes, fails);
  };
}
