import { Router } from "express";
import {
  authentication,
  validation,
} from "../../middleware/index.js";
import { chatSchema } from "./chat.validation.js";
import { getChat } from "./chatService/chat.service.js";

export const chatRouter = Router();

chatRouter.get(
  "/:userId",
  validation(chatSchema),
  authentication(),
  getChat
);
