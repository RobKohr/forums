import { NextFunction, Request, Response } from "express";

export function trimBody(req: Request, res: Response, next: NextFunction) {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = req.body[key].trim();
        }
    }
    next();
}