/* Copyright Robert Kohr 2023 - All Rights Reserved */

import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { TspecDocsMiddleware } from "tspec";
dotenv.config({ path: '../../.env' });

declare global {
  var start: number;
  function secondsSinceStart(): number;
  function log(...args: any[]): void;
}
global.start = Date.now();
console.log(`Server startup process began at ${new Date(global.start)}`);
global.secondsSinceStart = () => {
  return (Date.now() - global.start) / 1000;
};
global.log = (...args: any[]) => {
  console.log(global.secondsSinceStart(), ...args);
};

const express = require("express"),
  bodyParser = require("body-parser")


import 'swagger-jsdoc';
import 'swagger-ui-express';
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// parse application/json
app.use(bodyParser.json());

const port = process.env["API_PORT"] || 9999;

import { router as authRouter } from "./routes/auth.api";
const initServer = async () => {
  const app = express();
  /* output every api request's path and method to the console, if that file isn't a static file*/
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url.indexOf(".") === -1) {
      global.log(req.method, req.url);
    }
    next();
  });

  app.use("/auth", authRouter);
  app.listen(port);

  global.log(`Startup complete: http://localhost:${port}/docs`);
  app.use("/docs", await TspecDocsMiddleware());
  global.log("ts spec updated");
};
initServer();