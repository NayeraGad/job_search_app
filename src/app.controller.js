import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import connectionDB from "./DB/connectionDB.js";
import { AppError, globalErrorHandler } from "./utilities/errorHandler.js";
import {
  adminDashboardRouter,
  authRouter,
  chatRouter,
  companyRouter,
  jobsRouter,
  schema,
  userRouter,
} from "./modules/index.js";
import { createHandler } from "graphql-http/lib/use/http";

const Bootstrap = (app, express) => {
  app.use(helmet());

  app.use(cors());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use(limiter);

  // app.use(express.json())
  app.use((req, res, next) => {
    if (req.path !== "/dashboard/graphql") {
      express.json()(req, res, next);
    } else {
      next();
    }
  });

  connectionDB();

  app.get("/", (req, res, next) => {
    return res.status(200).json({ message: "Welcome to Job Search app" });
  });

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/company", companyRouter);
  app.use("/jobs", jobsRouter);
  app.use("/dashboard", adminDashboardRouter);
  app.use("/chat", chatRouter);

  app.use("/dashboard/graphql", createHandler({ schema }));

  app.use("*", (req, res, next) => {
    return next(new AppError(`invalid url ${req.originalUrl}`, 404));
  });

  app.use(globalErrorHandler);
};

export default Bootstrap;
