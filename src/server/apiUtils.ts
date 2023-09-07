import { NextFunction, Request, Response } from "express";
import { Validator } from "./common/validation";

export function trimBody(req: Request, res: Response, next: NextFunction) {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim();
        }
    }
    next();
}

export function addSimulatedDelay(req: Request, res: Response, next: NextFunction) {
    setTimeout(() => {
        next();
    }, 3000);
}

export function validate(validator: Validator) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validationResult = await validator(req.body)
        if (validationResult?.error) {
            console.log("validator.errors", JSON.stringify(validationResult.error, null, 2));
            res.status(412).send({
                success: false,
                message: "Validation failed",
                data: validationResult.error,
            });
        } else {
            return next();
        }
    };
}

