import express, { type Express, type Request, type Response } from "express";
import next from "next";
import http from 'http'
import cookieParser from "cookie-parser";
const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 7000;
const app = next({ dev, customServer: true });
const handle = app.getRequestHandler();
import fs from 'fs'
import { spawn } from "child_process";

//custom file imports
import customError from "./utils/customError.js";
import adminRouter from './router/adminRoutes.js'
import connectDb from "./database/db_conn.js";
import userRouter from "./router/userRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import reporterRouter from "./router/reporterRoutes.js";

     if (!fs.existsSync("private.pem") || !fs.existsSync("public.pem")) {
             spawn("node", ["./dist/utils/securekeyGenerator.js"], {
              stdio: "inherit",
              shell: true,
            });
          }

async function start() {
          
  await app.prepare();
  const server: Express = express();
  const httpServer = http.createServer(server);

    // server.use
  server.use(express.json());
  server.use(cookieParser());
  server.disable("x-powered-by"); //disabling express x-powered by header
  server.use("/server/api/v1/user", userRouter);
  server.use("/server/api/v1/reporter", reporterRouter);
  server.use("/server/api/v1/admin", adminRouter);

  // Handling all Next.js and frontend routes
  server.all(/(.*)/, (req: Request, res: Response) => {
    if (req.path.startsWith("/server/")) {
      throw new customError("API ROUTE NOT FOUND!",500);
    } else {
      return handle(req, res); // Forward to Next.js
    }
  });
  server.use("/server/api",errorHandler);

  httpServer.listen(PORT, async (err?: Error) => {
    if (err) {
      console.log("Server failed to start:", err);
      process.exit(1);
    }
    await connectDb();
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}

void start();
