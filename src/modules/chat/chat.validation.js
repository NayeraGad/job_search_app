import Joi from "joi";
import { generalRules } from "../../utilities/index.js";

export const chatSchema = {
  params: Joi.object({
    userId: generalRules.id,
  }),
};
