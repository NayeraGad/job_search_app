import express from "express";
import Bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
import path from "path";
import { runIO } from "./src/socket.io/index.js";
import { taskScheduling } from "./src/modules/auth/auth.service.js";

dotenv.config({ path: path.resolve("./src/config/.env") });

const app = express();
const port = process.env.PORT || 3001;

// For vercel
app.set("trust proxy", 1);

Bootstrap(app, express);

const httpServer = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

runIO(httpServer, app);
